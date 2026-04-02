import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { scanQueue } from '@/lib/queue';

export async function POST(request: Request) {
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");
  const deliveryId = request.headers.get("x-github-delivery");
  
  const payloadStr = await request.text();

  if (!event || !deliveryId) {
    return NextResponse.json({ error: "Missing GitHub headers" }, { status: 400 });
  }
  
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (secret && signature) {
    const hmac = crypto.createHmac("sha256", secret);
    const digest = "sha256=" + hmac.update(payloadStr).digest("hex");
    if (signature !== digest) {
      return NextResponse.json({ error: "Invalid signature payload" }, { status: 401 });
    }
  }

  let payload;
  try {
    payload = JSON.parse(payloadStr);
  } catch(e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Route handled: pull_request
  if (event === "pull_request") {
    const action = payload.action;
    
    // Process new PRs or updated commits to existing PRs
    if (action === "opened" || action === "synchronize" || action === "reopened") {
      const prData = {
        repoName: payload.repository.full_name,
        repoId: payload.repository.id,
        prNumber: payload.pull_request.number,
        prTitle: payload.pull_request.title,
        author: payload.pull_request.user.login,
        installationId: payload.installation?.id, // Useful for GitHub App token retrieval
        baseBranch: payload.pull_request.base.ref,
        headBranch: payload.pull_request.head.ref,
        diffUrl: payload.pull_request.diff_url,
        action
      };
      
      const jobId = `${prData.repoName}-${prData.prNumber}-${deliveryId}`;
      console.log(`Queueing scan job: ${jobId}`);
      
      await scanQueue.add('analyze-pr', prData, { jobId });
      
      return NextResponse.json({ status: "queued", job: prData }, { status: 202 });
    }
  }
  
  // Route handled: GitHub App Installations
  if (event === "installation" || event === "installation_repositories") {
    const { createAdminClient } = await import('@/lib/supabase');
    const supabase = createAdminClient();
    const installationId = payload.installation.id;
    const account = payload.installation.account;

    let orgId = null;
    if (payload.action !== "deleted") {
      // Upsert the org
      const { data: org, error: orgError } = await supabase.from('organizations').upsert(
        {
          github_installation_id: installationId,
          github_login: account.login,
          github_type: account.type.toLowerCase()
        },
        { onConflict: 'github_installation_id' }
      ).select('id').single();
  
      if (orgError) {
        console.error("Org upsert error:", orgError);
      } else if (org) {
        orgId = org.id;
      }
    }

    // Process added repos
    if ((payload.action === "created" || payload.action === "added") && orgId) {
      const repos = payload.repositories || payload.repositories_added || [];
      const repoPayloads = repos.map((repo: any) => ({
        org_id: orgId,
        github_repo_id: repo.id,
        full_name: repo.full_name,
      }));
      if (repoPayloads.length > 0) {
        await supabase.from('repositories').upsert(repoPayloads, { onConflict: 'github_repo_id' });
      }
    }

    // Process removed repos
    if (payload.action === "removed" && orgId) {
      const repos = payload.repositories_removed || [];
      for (const repo of repos) {
        await supabase.from('repositories').delete().match({ github_repo_id: repo.id });
      }
    }

    // Process uninstall
    if (payload.action === "deleted") {
      // Deleting the org cascades safely or we manually clean up if needed
      await supabase.from('organizations').delete().match({ github_installation_id: installationId });
    }

    return NextResponse.json({ status: "installation_synced" }, { status: 200 });
  }

  // Default success for ignored events/actions (e.g. issue_comment)
  return NextResponse.json({ status: "ignored", event, action: payload.action }, { status: 200 });
}
