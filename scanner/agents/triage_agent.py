"""
Triage agent for DevShield using Claude Haiku.
Classifies files by security relevance.
"""
import os
import json
import logging
from anthropic import Anthropic

logger = logging.getLogger("triage_agent")

TRIAGE_PROMPT = """
You are a security triage assistant. Given a list of changed files in a PR diff, classify each file by security relevance.

Return JSON only:
{
  "files": [
    {"path": "...", "relevant": true/false, "reason": "..."}
  ]
}

Files to triage:
{file_list}
"""

def get_client() -> Anthropic:
    return Anthropic(
        api_key=os.environ.get("ANTIGRAVITY_API_KEY", "dummy"),
        base_url=os.environ.get("ANTIGRAVITY_BASE_URL", "https://api.anthropic.com")
    )

def triage_files(file_list: list) -> dict:
    if not file_list:
        return {"files": []}

    client = get_client()
    formatted_prompt = TRIAGE_PROMPT.replace("{file_list}", json.dumps(file_list, indent=2))
    
    try:
        response = client.messages.create(
            model="claude-haiku-3-5",
            max_tokens=4096,
            system="You are an expert security triage assistant. You strictly return perfectly structured raw JSON output without any markdown formatting tags.",
            messages=[
                {"role": "user", "content": formatted_prompt}
            ]
        )
        
        # Parse the JSON out
        raw_text = response.content[0].text
        # Optional: cleanup markdown backticks natively
        raw_text = raw_text.replace("```json", "").replace("```", "").strip()
        
        return json.loads(raw_text)
    except Exception as e:
        logger.error(f"Failed to triage files via Antigravity Haiku: {e}")
        # Fail safe fallback: Treat all files as relevant
        return {
            "files": [{"path": f, "relevant": True, "reason": "Fallback mode active"} for f in file_list]
        }
