import { ScansDataTable } from "@/components/dashboard/ScansDataTable";
import { createServerClient } from "@/lib/supabase";

export default async function ScansPage() {
  const supabase = createServerClient();
  const { data: dbScans } = await supabase.from('scans').select(`*, repositories(full_name)`).order('created_at', { ascending: false });

  const mappedScans = (dbScans || []).map(s => ({
    id: s.id,
    repo: s.repositories?.full_name || 'unknown',
    pr: `#${s.pr_number}`,
    status: s.status,
    score: s.risk_score,
    time: new Date(s.created_at).toLocaleDateString(),
    severity: s.risk_score !== null && s.risk_score <= 30 ? "CRITICAL" : s.risk_score && s.risk_score < 70 ? "HIGH" : "LOW"
  }));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Scans History</h2>
        <p className="text-sm text-muted-foreground mt-1">Review the complete history of pull request security scans and granular results.</p>
      </div>

      <div className="pt-2">
        <ScansDataTable initialScans={mappedScans} />
      </div>
    </div>
  );
}
