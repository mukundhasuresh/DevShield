import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { SeverityDonut } from "@/components/dashboard/SeverityDonut";
import { VulnerabilityTrend } from "@/components/dashboard/VulnerabilityTrend";
import { RecentScansTable } from "@/components/dashboard/RecentScansTable";

export default async function DashboardPage() {
  // Simulating an Artificial Network Delay to exhibit beautiful Skeleton animations correctly
  await new Promise((resolve) => setTimeout(resolve, 800));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of your pull request security scans.</p>
      </div>

      <RiskScoreCard />

      <div className="grid gap-6 md:grid-cols-3">
        <VulnerabilityTrend />
        <SeverityDonut />
      </div>

      <div className="pt-2">
        <RecentScansTable />
      </div>
    </div>
  );
}
