import { createServerClient } from "@/lib/supabase";
import { ScanDetailClient } from "@/components/dashboard/ScanDetailClient";
import { notFound } from "next/navigation";

export default async function ScanDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const { id } = params;

  // Retrieve Scan from Supabase natively as per Week 7 prompt transition
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .select(`
      *,
      repositories (
        full_name
      )
    `)
    .eq("id", id)
    .single();

  if (scanError || !scan) {
    console.error("Failed to fetch scan detail:", scanError);
    return notFound();
  }

  // Retrieve Vulnerabilities mapped to this scan
  const { data: vulnerabilities, error: vulnError } = await supabase
    .from("vulnerabilities")
    .select("*")
    .eq("scan_id", id)
    // Order by severity primarily could be done, but created_at is safe
    .order("created_at", { ascending: false });

  if (vulnError) {
    console.error("Failed to fetch vulnerabilities:", vulnError);
  }

  // Normalize data map bypassing relation array mapping
  const normalizedScan = {
    ...scan,
    repo_name: scan.repositories?.full_name || scan.repo_name || "unknown/repo"
  };

  return (
    <ScanDetailClient scan={normalizedScan} vulnerabilities={vulnerabilities || []} />
  );
}
