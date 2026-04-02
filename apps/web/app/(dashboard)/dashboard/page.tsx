import { createServerClient } from "@/lib/supabase";
import { RiskScoreCard } from "@/components/dashboard/RiskScoreCard";
import { SeverityDonut } from "@/components/dashboard/SeverityDonut";
import { VulnerabilityTrend } from "@/components/dashboard/VulnerabilityTrend";
import { RecentScansTable } from "@/components/dashboard/RecentScansTable";

export default async function DashboardPage() {
  const supabase = createServerClient();

  // Parallel fetch dashboard metrics
  const [
    { data: recentScans },
    { count: scanCount },
    { count: repoCount },
    { data: allVulns }
  ] = await Promise.all([
    supabase.from('scans').select(`*, repositories(full_name)`).order('created_at', { ascending: false }).limit(5),
    supabase.from('scans').select('*', { count: 'exact', head: true }),
    supabase.from('repositories').select('*', { count: 'exact', head: true }),
    supabase.from('vulnerabilities').select('severity')
  ]);

  // Aggregate Vulnerability Severity Donut Data
  let critical = 0, high = 0, medium = 0, low = 0;
  if (allVulns) {
    for (const v of allVulns) {
      if (v.severity === 'CRITICAL') critical++;
      else if (v.severity === 'HIGH') high++;
      else if (v.severity === 'MEDIUM') medium++;
      else if (v.severity === 'LOW') low++;
    }
  }
  const donutData = [
    { name: "CRITICAL", value: critical },
    { name: "HIGH", value: high },
    { name: "MEDIUM", value: medium },
    { name: "LOW", value: low }
  ];

  // Map Recent Scans cleanly for the component
  const mappedRecentScans = (recentScans || []).map(s => ({
    id: s.id,
    repo: s.repositories?.full_name || 'unknown',
    pr: `#${s.pr_number}`,
    status: s.status,
    score: s.risk_score,
    time: new Date(s.created_at).toLocaleDateString()
  }));

  // Calculate Average Risk Score
  const avgRiskScore = recentScans && recentScans.length > 0 
    ? Math.round(recentScans.reduce((acc, curr) => acc + (curr.risk_score || 100), 0) / recentScans.length)
    : 100;

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Overview of your pull request security scans.</p>
      </div>

      <RiskScoreCard data={{
         riskScore: avgRiskScore,
         vulnCount: allVulns?.length || 0,
         repoCount: repoCount || 0,
         scanCount: scanCount || 0
      }} />

      <div className="grid gap-6 md:grid-cols-3">
        <VulnerabilityTrend />
        <SeverityDonut data={donutData} />
      </div>

      <div className="pt-2">
        <RecentScansTable data={mappedRecentScans} />
      </div>
    </div>
  );
}
