import { RepoList } from "@/components/dashboard/RepoList";

export default async function ReposPage() {
  // Artificial network delay to observe custom Skeleton states gracefully
  await new Promise((resolve) => setTimeout(resolve, 600));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Repositories</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage which repositories are protected by DevShield.</p>
      </div>

      <div className="pt-2">
        <RepoList />
      </div>
    </div>
  );
}
