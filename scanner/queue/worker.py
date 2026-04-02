import os
import asyncio
import logging
import hashlib
import json
from copy import deepcopy
from bullmq import Worker
from supabase import create_client

from agents.triage_agent import triage_files
from agents.scan_agent import deep_scan_file
from agents.fix_agent import generate_fix
from scanners.secret_scanner import scan_text_for_secrets
from scanners.dependency_scanner import scan_dependencies
from github_helper import get_pr_diff, post_pr_comment
from blockchain.logger import write_scan_hash_to_polygon

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("worker")

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

def init_supabase():
    if SUPABASE_URL and SUPABASE_KEY:
        return create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.warning("Supabase credentials missing.")
    return None

def calculate_risk_score(vulns: list) -> int:
    score = 100
    for v in vulns:
        if v["severity"] == "CRITICAL": score -= 40
        elif v["severity"] == "HIGH": score -= 20
        elif v["severity"] == "MEDIUM": score -= 10
        elif v["severity"] == "LOW": score -= 5
    return max(0, score)

def format_pr_comment(vulns: list, score: int, scan_id: str) -> str:
    critical = sum(1 for v in vulns if v["severity"] == "CRITICAL")
    high = sum(1 for v in vulns if v["severity"] == "HIGH")
    medium = sum(1 for v in vulns if v["severity"] == "MEDIUM")
    low = sum(1 for v in vulns if v["severity"] == "LOW")
    
    comment_lines = [
        f"## DevShield Security Scan",
        f"**Risk Score: {score}/100** | {len(vulns)} vulnerabilities found\n",
        f"| Severity | Count |",
        f"|----------|-------|",
        f"| 🔴 Critical | {critical} |",
        f"| 🟠 High | {high} |",
        f"| 🟡 Medium | {medium} |",
        f"| 🔵 Low | {low} |\n",
        f"### Findings\n"
    ]
    
    if vulns:
        for idx, v in enumerate(vulns[:5]): # Show up to 5 primarily in PR
            comment_lines.append(f"**[{v['severity']}] {v['title']}** — `{v.get('file_path', 'unknown')}:{v.get('line_number', 0)}`")
            comment_lines.append(v['description'])
            if 'fix_suggestion' in v and v['fix_suggestion']:
                comment_lines.append(f"Fix: {v['fix_suggestion']}")
            comment_lines.append("\n---")
        
        if len(vulns) > 5:
            comment_lines.append(f"\n*...and {len(vulns) - 5} more vulnerabilities. View full report on DevShield dashboard.*")
    else:
        comment_lines.append("✅ No security vulnerabilities detected.")
        
    comment_lines.append(f"\n🔗 [View full report on DevShield](#) | ⛓️ [Verify on Polygon](#) | Scan ID: `{scan_id}`")
    return "\n".join(comment_lines)

async def _process_job(job):
    """Core logic extracted from bullmq job wrapper"""
    data = job.data
    repo_name = data.get("repoName")
    pr_number = data.get("prNumber")
    installation_id = data.get("installationId")
    
    logger.info(f"Processing PR: {repo_name} #{pr_number}")
    
    # Next.js / Github Hook usually passes diffUrl, but we can fetch text native:
    # 1. Fetch raw diff
    try:
        raw_diff = get_pr_diff(repo_name, pr_number, installation_id)
    except Exception as e:
        logger.error(f"Cannot process diff: {e}")
        return
        
    if not raw_diff:
        logger.info("Empty diff, exiting gracefully.")
        return

    # To process effectively, split diff by files (naive parser for demo)
    file_diffs = []
    current_file = None
    current_diff = []
    
    for line in raw_diff.splitlines():
        if line.startswith("diff --git"):
            if current_file:
                file_diffs.append({"path": current_file, "content": "\n".join(current_diff)})
            parts = line.split(" ")
            current_file = parts[-1].replace("b/", "")
            current_diff = [line]
        else:
            current_diff.append(line)
            
    if current_file:
        file_diffs.append({"path": current_file, "content": "\n".join(current_diff)})
        
    # 2. Haiku triage
    file_paths = [fd["path"] for fd in file_diffs]
    triage_result = triage_files(file_paths)
    relevant_files = {f["path"]: f for f in triage_result.get("files", []) if f.get("relevant")}

    all_vulns = []

    # 3. Sonnet deep scan + 4. Secret scanner + run dependency scan if applicable
    extracted_dependencies = {}
    
    for fd in file_diffs:
        path = fd["path"]
        content = fd["content"]
        
        # 4. Secret scan on all files
        secrets_found = scan_text_for_secrets(content)
        for s in secrets_found: s["file_path"] = path
        all_vulns.extend(secrets_found)
        
        if "package.json" in path or "requirements.txt" in path:
            # We would parse packages here to send to OSV in a real scenario
            # Simulating dependency scan triggered
            logger.info(f"Dependency file found: {path}")

        # 3. Sonnet scanning if flagged
        if path in relevant_files:
            logger.info(f"Deep scanning relevant file: {path}")
            ai_scan = deep_scan_file(content)
            vulns = ai_scan.get("vulnerabilities", [])
            for v in vulns: v["file_path"] = path
            all_vulns.extend(vulns)

    # 5. Dependency Scanning (Assuming extracted format from files)
    if extracted_dependencies:
        dep_vulns = scan_dependencies(extracted_dependencies)
        for v in dep_vulns: v["file_path"] = "dependencies"
        all_vulns.extend(dep_vulns)

    # 6. Fix agent
    final_vulns = []
    for vuln in all_vulns:
        if vuln["severity"] in ["CRITICAL", "HIGH", "MEDIUM"]:
            logger.info(f"Generating fix for {vuln['title']}")
            # Grab context: ideally from line number, but we pass diff chunk
            fix_data = generate_fix(vuln["description"], vuln.get("file_path", ""))
            vuln["ai_explanation"] = fix_data.get("explanation", "")
            vuln["fix_suggestion"] = fix_data.get("fixed_code", "")
        final_vulns.append(vuln)

    # 7. Aggregate + Calculate Score
    risk_score = calculate_risk_score(final_vulns)
    
    supabase = init_supabase()
    scan_id = "unknown-id"
    
    # 8. Store in Supabase
    if supabase:
        try:
            # Create the scan record
            scan_record = supabase.table("scans").insert({
                "pr_number": pr_number,
                "pr_title": data.get("prTitle", "Untitled"),
                "pr_author": data.get("author", "unknown"),
                "status": "complete",
                "risk_score": risk_score,
                "vuln_count": len(final_vulns),
                "critical_count": sum(1 for v in final_vulns if v["severity"] == "CRITICAL"),
                "high_count": sum(1 for v in final_vulns if v["severity"] == "HIGH"),
                "medium_count": sum(1 for v in final_vulns if v["severity"] == "MEDIUM"),
                "low_count": sum(1 for v in final_vulns if v["severity"] == "LOW")
            }).execute()
            
            scan_id = scan_record.data[0]["id"]
            
            # Insert vulnerabilities
            for v in final_vulns:
                supabase.table("vulnerabilities").insert({
                    "scan_id": scan_id,
                    "vuln_type": v.get("type", "UNKNOWN"),
                    "severity": v.get("severity", "INFO"),
                    "title": v.get("title", "Unknown"),
                    "description": v.get("description", ""),
                    "file_path": v.get("file_path", ""),
                    "line_number": v.get("line_number", 0),
                    "cwe_id": v.get("cwe_id", ""),
                    "cvss_score": v.get("cvss_score", 0.0),
                    "ai_explanation": v.get("ai_explanation", ""),
                    "fix_suggestion": v.get("fix_suggestion", "")
                }).execute()
                
        except Exception as e:
            logger.error(f"Failed to post to Supabase: {e}")

    # 9. Post PR comment
    try:
        comment_body = format_pr_comment(final_vulns, risk_score, scan_id)
        if installation_id:
            post_pr_comment(repo_name, pr_number, installation_id, comment_body)
    except Exception as e:
        logger.error(f"Failed to post PR comment: {e}")

    # 10. Hash + Push to Blockchain
    digest_payload = json.dumps({"pr": pr_number, "repo": repo_name, "score": risk_score, "vulns": final_vulns}, sort_keys=True)
    scan_hash = hashlib.sha256(digest_payload.encode('utf-8')).hexdigest()
    
    tx_hash = write_scan_hash_to_polygon(
        scan_hash=scan_hash,
        ipfs_cid="", # Skipped real Pinata IPFS for now, could be added later
        repo_name=repo_name,
        pr_number=str(pr_number)
    )
    
    if supabase and tx_hash:
        supabase.table("scans").update({
            "scan_hash": "0x" + scan_hash,
            "tx_hash": tx_hash
        }).eq("id", scan_id).execute()

    logger.info(f"Finished processing PR {repo_name} #{pr_number}. Score: {risk_score}")

async def process_job(job, job_token):
    if job.name == 'analyze-pr':
        await asyncio.to_thread(_process_job, job) # Since _process_job uses synchronous requests/supabase calls right now
        return {"status": "success"}
    return {"status": "ignored"}

async def main():
    logger.info(f"Starting DevShield Worker on {REDIS_URL}")
    worker = Worker('scan-jobs', process_job, {"connection": REDIS_URL})
    try:
        await asyncio.Event().wait()
    finally:
        await worker.close()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Worker gracefully shutting down.")
