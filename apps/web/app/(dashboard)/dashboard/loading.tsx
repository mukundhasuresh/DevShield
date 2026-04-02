import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { SeverityDonut } from "@/components/dashboard/SeverityDonut";
import { VulnerabilityTrend } from "@/components/dashboard/VulnerabilityTrend";
import { RecentScansTable } from "@/components/dashboard/RecentScansTable";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of your pull request security scans.</p>
      </div>

      <RiskScoreCard isLoading />

      <div className="grid gap-6 md:grid-cols-3">
        <VulnerabilityTrend isLoading />
        <SeverityDonut isLoading />
      </div>

      <div className="pt-2">
        <RecentScansTable isLoading />
      </div>
    </div>
  );
}
