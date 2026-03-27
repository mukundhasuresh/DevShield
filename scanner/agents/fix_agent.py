"""
Fix agent for DevShield using Claude Sonnet.
Generates remediations.
"""
import os
import json
import logging
from anthropic import Anthropic

logger = logging.getLogger("fix_agent")

FIX_PROMPT = """
You are a security engineer. For this vulnerability, provide:
1. A clear explanation of the fix
2. The corrected code snippet

Vulnerability: {vuln_description}
Affected code: {affected_code}

Return JSON: {"explanation": "...", "fixed_code": "..."}
"""

def get_client() -> Anthropic:
    return Anthropic(
        api_key=os.environ.get("ANTIGRAVITY_API_KEY", "dummy"),
        base_url=os.environ.get("ANTIGRAVITY_BASE_URL", "https://api.anthropic.com")
    )

def generate_fix(vuln_description: str, affected_code: str) -> dict:
    if not vuln_description:
        return {"explanation": "", "fixed_code": ""}
        
    client = get_client()
    formatted_prompt = FIX_PROMPT.replace("{vuln_description}", vuln_description).replace("{affected_code}", affected_code)
    
    # Requirement: Every Sonnet API call must have a Haiku fallback if it fails
    models = ["claude-sonnet-4-5", "claude-haiku-3-5"]
    
    for model in models:
        try:
            response = client.messages.create(
                model=model,
                max_tokens=2048,
                system="You strictly return perfectly structured raw JSON output without any markdown formatting tags.",
                messages=[
                    {"role": "user", "content": formatted_prompt}
                ]
            )
            
            raw_text = response.content[0].text
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            
            return json.loads(raw_text)
            
        except Exception as e:
            logger.warning(f"Failed to generate fix using model {model}: {e}")
            continue
            
    logger.error("All AI fixing models failed completely.")
    return {"explanation": "Error generating fix via AI", "fixed_code": affected_code}
