import { AuditLogTable } from "@/components/dashboard/AuditLogTable";
import { createServerClient } from "@/lib/supabase-server";

export default async function AuditLogPage() {
  const supabase = createServerClient();
  const { data: dbScans } = await supabase.from('scans')
    .select(`*, repositories(full_name)`)
    .not('tx_hash', 'is', null)
    .order('created_at', { ascending: false });

  const mappedLogs = (dbScans || []).map(s => ({
    id: s.id,
    repo: s.repositories?.full_name || s.repo_name || 'unknown',
    pr: s.pr_number,
    txHash: s.tx_hash,
    scanHash: s.scan_hash,
  }));

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Audit Log</h2>
        <p className="text-sm text-muted-foreground mt-1">Immutable records of all security scans verified on the Polygon blockchain.</p>
      </div>

      <div className="pt-2">
        <AuditLogTable logs={mappedLogs} />
      </div>
    </div>
  );
}
