import requests
import json
import logging

logger = logging.getLogger("dependency_scanner")

OSV_QUERY_ENDPOINT = "https://api.osv.dev/v1/query"

def query_osv(package_name: str, version: str, ecosystem: str = "npm") -> list:
    """
    Queries the OSV (Open Source Vulnerability) database for a specific package version.
    Ecosystems e.g.: 'npm', 'PyPI', 'crates.io'
    """
    payload = {
        "version": version,
        "package": {
            "name": package_name,
            "ecosystem": ecosystem
        }
    }
    
    try:
        response = requests.post(OSV_QUERY_ENDPOINT, json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get("vulns", [])
        else:
            logger.warning(f"OSV API returned {response.status_code} for {package_name}")
            return []
    except Exception as e:
        logger.error(f"Error querying OSV API: {e}")
        return []

def scan_dependencies(dependencies: dict, ecosystem: str = "npm") -> list[dict]:
    """
    Scans a dictionary of dependencies { "package": "version" }
    Returns a list of DevShield vulnerability dicts.
    """
    vulns = []
    
    for package_name, version in dependencies.items():
        # Clean versions like '^1.0.0' or '~2.0' to raw versions for basic matching
        # Proper version resolution requires a lockfile parser, but this is a V1 baseline
        clean_version = version.lstrip('^~><=')
        
        osv_vulns = query_osv(package_name, clean_version, ecosystem)
        
        for vuln in osv_vulns:
            # Extract CVSS if available
            cvss_score = 0.0
            severity = "MEDIUM"
            if "severity" in vuln and len(vuln["severity"]) > 0:
                for score_record in vuln["severity"]:
                    if score_record["type"] == "CVSS_V3":
                        try:
                            cvss_score = float(score_record.get("score", "0.0").split("/")[0][-3:])
                        except Exception:
                            cvss_score = 0.0
            
            aliases = vuln.get('aliases', [])
            cve_id = next((a for a in aliases if a.startswith('CVE')), None)
            
            vulns.append({
                "type": "SUPPLY_CHAIN",
                "severity": "HIGH", # Default fallback, OSV data might specify differently
                "title": f"Vulnerable Dependency: {package_name}@{clean_version}",
                "description": vuln.get("details", f"Known vulnerability in {package_name}: {vuln.get('id')}"),
                "line_number": 0,
                "cwe_id": cve_id or vuln.get('id'),
                "cvss_score": cvss_score
            })
            
    return vulns
