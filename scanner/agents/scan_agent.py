"""
Deep scan agent for DevShield using Claude Sonnet.
"""

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

def deep_scan_file(diff: str) -> dict:
    pass
