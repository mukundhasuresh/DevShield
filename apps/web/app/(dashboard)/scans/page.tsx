import { ScansDataTable } from "@/components/dashboard/ScansDataTable";

export default async function ScansPage() {
  // Artificial network delay to observe custom Skeleton states gracefully
  await new Promise((resolve) => setTimeout(resolve, 600));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Scans History</h2>
        <p className="text-sm text-muted-foreground mt-1">Review the complete history of pull request security scans and granular results.</p>
      </div>

      <div className="pt-2">
        <ScansDataTable />
      </div>
    </div>
  );
}
