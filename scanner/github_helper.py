import os
import time
import jwt
import requests
import logging
from github import Github, Auth

logger = logging.getLogger("github_helper")

def get_github_app_jwt() -> str:
    app_id = os.getenv("GITHUB_APP_ID")
    private_key = os.getenv("GITHUB_APP_PRIVATE_KEY", "").replace("\\n", "\n")

    if not app_id or not private_key:
        raise ValueError("Missing GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY")

    payload = {
        "iat": int(time.time()) - 60,
        "exp": int(time.time()) + (10 * 60),
        "iss": app_id
    }

    return jwt.encode(payload, private_key, algorithm="RS256")

def get_installation_token(installation_id: int) -> str:
    token = get_github_app_jwt()
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    url = f"https://api.github.com/app/installations/{installation_id}/access_tokens"
    resp = requests.post(url, headers=headers)
    resp.raise_for_status()
    return resp.json()["token"]

def get_pr_diff(repo_name: str, pr_number: int, installation_id: int) -> str:
    """Fetch the diff content for a given PR."""
    token = get_installation_token(installation_id)
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3.diff"
    }
    url = f"https://api.github.com/repos/{repo_name}/pulls/{pr_number}"
    resp = requests.get(url, headers=headers)
    if resp.status_code == 200:
        return resp.text
    else:
        logger.error(f"Failed to fetch PR diff: {resp.text}")
        return ""

def post_pr_comment(repo_name: str, pr_number: int, installation_id: int, body: str):
    """Posts a PR comment as the GitHub App"""
    token = get_installation_token(installation_id)
    auth = Auth.Token(token)
    g = Github(auth=auth)
    
    try:
        repo = g.get_repo(repo_name)
        pr = repo.get_pull(pr_number)
        pr.create_issue_comment(body)
    except Exception as e:
        logger.error(f"Failed to post PR comment: {e}")
