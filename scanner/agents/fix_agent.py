"""
Fix agent for DevShield using Claude Sonnet.
Generates remediations.
"""

FIX_PROMPT = """
You are a security engineer. For this vulnerability, provide:
1. A clear explanation of the fix
2. The corrected code snippet

Vulnerability: {vuln_description}
Affected code: {affected_code}

Return JSON: {"explanation": "...", "fixed_code": "..."}
"""

def generate_fix(vuln_description: str, affected_code: str) -> dict:
    pass
