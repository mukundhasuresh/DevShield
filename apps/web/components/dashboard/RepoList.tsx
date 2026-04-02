"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Shield, ShieldOff, GitFork } from "lucide-react";

const INITIAL_REPOS = [
  { id: "1", name: "acme/payment-api", enabled: true, lastScan: "10 min ago", branch: "main" },
  { id: "2", name: "acme/auth-service", enabled: true, lastScan: "1 hr ago", branch: "master" },
  { id: "3", name: "acme/web-frontend", enabled: false, lastScan: "Never", branch: "main" },
  { id: "4", name: "acme/data-pipeline", enabled: true, lastScan: "2 hrs ago", branch: "develop" },
  { id: "5", name: "acme/core-infra", enabled: false, lastScan: "Never", branch: "main" }
];

export function RepoList() {
  const [repos, setRepos] = useState(INITIAL_REPOS);

  const toggleRepo = (id: string) => {
    setRepos(repos.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="bg-[#161616] border-[#222222] shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold text-foreground">Connected Repositories</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Manage DevShield protection settings per repository.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#222222] overflow-hidden mt-2">
            <Table>
              <TableHeader className="bg-[#111111]">
                <TableRow className="border-[#222222] hover:bg-transparent">
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Repository</TableHead>
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Default Branch</TableHead>
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Last Scan</TableHead>
                  <TableHead className="text-right text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Protection</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repos.map((repo) => (
                  <TableRow key={repo.id} className="border-[#222222] hover:bg-[#1a1a1a]/50 transition-colors text-sm">
                    <TableCell className="font-medium text-foreground py-4">
                      {repo.name}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center text-muted-foreground">
                        <GitFork className="h-4 w-4 mr-2" />
                        {repo.branch}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground py-4">
                      {repo.lastScan}
                    </TableCell>
                    <TableCell className="py-4 text-right">
                      <button 
                         onClick={() => toggleRepo(repo.id)}
                         className={`inline-flex h-6 w-11 mt-1 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] ${repo.enabled ? 'bg-accent' : 'bg-[#333333]'}`}
                      >
                         <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${repo.enabled ? 'translate-x-5' : 'translate-x-[2px]'}`} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
