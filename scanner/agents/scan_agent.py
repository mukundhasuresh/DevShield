"""
Deep scan agent for DevShield using Claude Sonnet.
"""
import os
import json
import logging
from anthropic import Anthropic

logger = logging.getLogger("scan_agent")

SCAN_PROMPT = """
You are an expert application security engineer. Analyze this code diff for security vulnerabilities.

For each vulnerability found, return:
- type: SECRET | OWASP | SUPPLY_CHAIN | IAC_MISCONFIG
- severity: CRITICAL | HIGH | MEDIUM | LOW | INFO
- title: short descriptive title
- description: explain what the vulnerability is and why it's dangerous
- line_number: line in the diff
- cwe_id: CWE identifier if applicable
- cvss_score: estimated 0.0-10.0

Return JSON only. If no vulnerabilities found, return {"vulnerabilities": []}.

Code diff:
{diff}
"""

def get_client() -> Anthropic:
    return Anthropic(
        api_key=os.environ.get("ANTIGRAVITY_API_KEY", "dummy"),
        base_url=os.environ.get("ANTIGRAVITY_BASE_URL", "https://api.anthropic.com")
    )

def deep_scan_file(diff: str) -> dict:
    if not diff.strip():
        return {"vulnerabilities": []}
        
    client = get_client()
    formatted_prompt = SCAN_PROMPT.replace("{diff}", diff)
    
    # Requirement: Every Sonnet API call must have a Haiku fallback if it fails
    models = ["claude-sonnet-4-5", "claude-haiku-3-5"]
    
    for model in models:
        try:
            response = client.messages.create(
                model=model,
                max_tokens=4096,
                system="You are an expert security engineer. You strictly return perfectly structured raw JSON output without any markdown formatting tags.",
                messages=[
                    {"role": "user", "content": formatted_prompt}
                ]
            )
            
            raw_text = response.content[0].text
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            
            return json.loads(raw_text)
            
        except Exception as e:
            logger.warning(f"Failed to scan file using model {model}: {e}")
            continue
            
    logger.error("All AI scanning models failed completely.")
    return {"vulnerabilities": []}
