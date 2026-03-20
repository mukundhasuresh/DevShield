import re
import math

PATTERNS = {
    'AWS_ACCESS_KEY': r'(?i)AKIA[0-9A-Z]{16}',
    'SLACK_TOKEN': r'(xox[p|b|o|a]-[0-9]{12}-[0-9]{12}-[0-9]{12}-[a-z0-9]{32})',
    'RSA_PRIVATE_KEY': r'-----BEGIN (DSA|RSA|OPENSSH) PRIVATE KEY-----',
    'GENERIC_SECRET': r'(?i)(secret|token|password|api_key|credential)[\s\=\:]+[\'"]([a-zA-Z0-9_\-\+]{16,})[\'"]'
}

def calculate_shannon_entropy(data: str) -> float:
    if not data:
        return 0.0
    entropy = 0
    for x in set(data):
        p_x = float(data.count(x)) / len(data)
        entropy += - p_x * math.log2(p_x)
    return entropy

def scan_text_for_secrets(text: str) -> list[dict]:
    """
    Returns a list of vulnerability dicts identical closely matching the Sonnet JSON schema
    So it can be uniformly mapped.
    """
    vulns = []
    if not text:
        return vulns
        
    lines = text.splitlines()
    for i, line in enumerate(lines):
        line_num = i + 1
        for secret_name, pattern in PATTERNS.items():
            matches = re.finditer(pattern, line)
            for match in matches:
                
                # Check entropy for generic secret pattern to reduce false positives
                # Standard english text is ~3.5 entropy, High density Base64 usually > 4.5
                if secret_name == 'GENERIC_SECRET':
                    secret_val = match.group(2)
                    if calculate_shannon_entropy(secret_val) < 4.0:
                        continue # Skip low entropy string
                        
                vulns.append({
                    "type": "SECRET",
                    "severity": "CRITICAL",
                    "title": f"Hardcoded {secret_name.replace('_', ' ').title()}",
                    "description": f"A potential {secret_name.lower()} was found exposed in the source code. This allows full access to the linked resource.",
                    "line_number": line_num,
                    "cwe_id": "CWE-798", 
                    "cvss_score": 9.8
                })
                
    return vulns
