"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

export function RecentScansTable({ isLoading, data }: { isLoading?: boolean; data?: any[] }) {
  if (isLoading) {
    return (
      <Card className="bg-[#161616] border-[#222222] mt-4 shadow-none">
        <CardHeader>
          <Skeleton className="h-5 w-40 bg-[#222222]" />
          <Skeleton className="h-4 w-64 bg-[#222222] mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-[#222222] rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const scans = data || [
    { id: "1", repo: "acme/auth-service", pr: "#142", status: "complete", score: 85, time: "10 min ago" },
    { id: "2", repo: "acme/payment-api", pr: "#55", status: "scanning", score: null, time: "Just now" },
    { id: "3", repo: "acme/web-frontend", pr: "#891", status: "failed", score: 0, time: "1 hr ago" },
    { id: "4", repo: "acme/data-pipeline", pr: "#12", status: "complete", score: 32, time: "2 hrs ago" },
    { id: "5", repo: "acme/core-infra", pr: "#4", status: "complete", score: 100, time: "5 hrs ago" },
  ];

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase();
    switch(s) {
      case "complete": return <CheckCircle2 className="h-4 w-4 text-[#22c55e] mr-1.5" />;
      case "scanning": return <Clock className="h-4 w-4 text-[#6366f1] mr-1.5 animate-pulse" />;
      case "failed": return <XCircle className="h-4 w-4 text-[#ef4444] mr-1.5" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground mr-1.5" />;
    }
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <Badge variant="outline" className="text-muted-foreground border-[#333]">Pending</Badge>;
    if (score >= 80) return <Badge className="bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20 border border-[#22c55e]/20">{score}/100</Badge>;
    if (score >= 50) return <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] hover:bg-[#f59e0b]/20 border border-[#f59e0b]/20">{score}/100</Badge>;
    if (score > 0) return <Badge className="bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 border border-[#ef4444]/20">{score}/100</Badge>;
    return <Badge className="bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30 border border-[#ef4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">Critical</Badge>;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="mt-4"
    >
      <Card className="bg-[#161616] border-[#222222] shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold text-foreground">Recent Scans</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">The latest pull request security analysis jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#222222] overflow-hidden">
            <Table>
              <TableHeader className="bg-[#111111]">
                <TableRow className="border-[#222222] hover:bg-transparent">
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Repository</TableHead>
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Pull Request</TableHead>
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Score</TableHead>
                  <TableHead className="text-right text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm font-medium">
                      No recent scans found. Create a PR to start.
                    </TableCell>
                  </TableRow>
                ) : (
                  scans.map((scan) => (
                    <TableRow key={scan.id} className="border-[#222222] hover:bg-[#1a1a1a]/50 transition-colors cursor-pointer text-sm">
                      <TableCell className="font-medium text-foreground py-3">
                        {scan.repo}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-3 font-mono text-xs">
                        {scan.pr}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center capitalize text-muted-foreground text-xs font-medium">
                          {getStatusIcon(scan.status)}
                          {scan.status}
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        {getScoreBadge(scan.score)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground py-3 text-xs">
                        {scan.time}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
