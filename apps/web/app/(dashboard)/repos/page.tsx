import { RepoList } from "@/components/dashboard/RepoList";
import { createServerClient } from "@/lib/supabase-server";

export default async function ReposPage() {
  const supabase = createServerClient();
  const { data: dbRepos } = await supabase.from('repositories').select('*').order('created_at', { ascending: false });

  const formattedRepos = (dbRepos || []).map(r => ({
    id: r.id,
    name: r.full_name,
    enabled: r.scanning_enabled !== false,
    lastScan: "Ready",
    branch: "main" // GitHub webhook API usually omits branch on standard repository listing, could be resolved if stored
  }));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Repositories</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage which repositories are protected by DevShield.</p>
      </div>

      <div className="pt-2">
        <RepoList initialRepos={formattedRepos} />
      </div>
    </div>
  );
}
