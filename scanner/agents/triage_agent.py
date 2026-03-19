"""
Triage agent for DevShield using Claude Haiku.
Classifies files by security relevance.
"""

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

def triage_files(file_list: list) -> dict:
    pass
