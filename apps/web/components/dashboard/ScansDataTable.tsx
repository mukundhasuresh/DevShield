"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, XCircle, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_SCANS = [
  { id: "1", repo: "acme/auth-service", pr: "#142", status: "complete", score: 85, time: "10 min ago", severity: "HIGH" },
  { id: "2", repo: "acme/payment-api", pr: "#55", status: "scanning", score: null, time: "Just now", severity: "NONE" },
  { id: "3", repo: "acme/web-frontend", pr: "#891", status: "failed", score: 0, time: "1 hr ago", severity: "CRITICAL" },
  { id: "4", repo: "acme/data-pipeline", pr: "#12", status: "complete", score: 32, time: "2 hrs ago", severity: "MEDIUM" },
  { id: "5", repo: "acme/core-infra", pr: "#4", status: "complete", score: 100, time: "5 hrs ago", severity: "NONE" },
  { id: "6", repo: "acme/auth-service", pr: "#141", status: "complete", score: 90, time: "1 day ago", severity: "LOW" },
  { id: "7", repo: "acme/web-frontend", pr: "#890", status: "complete", score: 45, time: "2 days ago", severity: "HIGH" },
];

export function ScansDataTable() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredScans = MOCK_SCANS.filter(scan => {
    const matchesSearch = scan.repo.toLowerCase().includes(search.toLowerCase()) || scan.pr.includes(search);
    const matchesFilter = filter === "all" || scan.status === filter || scan.severity.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case "complete": return <CheckCircle2 className="h-4 w-4 text-[#22c55e] mr-1.5" />;
      case "scanning": return <Clock className="h-4 w-4 text-[#6366f1] mr-1.5 animate-pulse" />;
      case "failed": return <XCircle className="h-4 w-4 text-[#ef4444] mr-1.5" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground mr-1.5" />;
    }
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return <Badge variant="outline" className="text-muted-foreground border-[#333]">Pending</Badge>;
    if (score >= 80) return <Badge className="bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20">{score}/100</Badge>;
    if (score >= 50) return <Badge className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">{score}/100</Badge>;
    if (score > 0) return <Badge className="bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/20">{score}/100</Badge>;
    return <Badge className="bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">Critical</Badge>;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <Card className="bg-[#161616] border-[#222222] shadow-none">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-4">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search repos or PRs..."
                className="h-9 w-full rounded-md border border-[#222222] bg-[#111111] pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
             <Button variant="outline" size="sm" className="h-9 border-[#222222] bg-[#111111] hover:bg-[#1a1a1a] text-muted-foreground hover:text-foreground">
               <Filter className="mr-2 h-4 w-4" /> Filter
             </Button>
          </div>
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
                {filteredScans.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground text-sm font-medium">
                      No matching scans found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredScans.map((scan) => (
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
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-muted-foreground font-medium">Showing {filteredScans.length} of {MOCK_SCANS.length} results</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled className="h-8 bg-[#111111] border-[#222222] text-muted-foreground">Previous</Button>
              <Button variant="outline" size="sm" className="h-8 bg-[#161616] border-[#222222] text-foreground hover:bg-[#222222] transition-colors">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
