import jwt from 'jsonwebtoken';

/**
 * Authenticates as GitHub App and generates a JWT
 * Useful for grabbing installation access tokens
 */
export function getGitHubAppJwt(): string {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!appId || !privateKey) {
    throw new Error('Missing GitHub App environment variables');
  }

  const payload = {
    // Issued at time, 60 seconds in the past to allow for clock drift
    iat: Math.floor(Date.now() / 1000) - 60,
    // JWT expiration time (10 minutes maximum)
    exp: Math.floor(Date.now() / 1000) + (10 * 60),
    // GitHub App's identifier
    iss: appId
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

/**
 * Retrieves an installation access token
 * Called by the backend to fetch logic/diff files or post PR comments
 */
export async function getInstallationToken(installationId: string | number): Promise<string> {
  const token = getGitHubAppJwt();
  
  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get installation token: ${data.message || JSON.stringify(data)}`);
  }
  
  return data.token;
}
