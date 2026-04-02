"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, AlertTriangle, Github, ExternalLink, Activity, Info, CheckCircle2, Copy, Check, Link as LinkIcon, FileCode2 } from "lucide-react";
import Link from "next/link";

interface ScanDetailClientProps {
  scan: any;
  vulnerabilities: any[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

const getScoreColor = (score: number) => {
  if (score <= 30) return "#22c55e"; // green
  if (score <= 60) return "#eab308"; // yellow
  if (score <= 85) return "#f97316"; // orange
  return "#dc2626"; // red
};

const CodeBlock = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-md bg-[#0a0a0a] border border-[#222222] overflow-hidden mt-2">
      <div className="flex items-center justify-between px-4 py-2 bg-[#111111] border-b border-[#222222]">
        <span className="text-xs font-mono text-muted-foreground">Suggested Fix</span>
        <button 
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-[#22c55e]" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-[#ededed]"><code>{code}</code></pre>
      </div>
    </div>
  );
};

export function ScanDetailClient({ scan, vulnerabilities }: ScanDetailClientProps) {
  const scoreColor = getScoreColor(scan.risk_score || 0);
  const polygonUrl = scan.tx_hash ? `https://amoy.polygonscan.com/tx/${scan.tx_hash}` : null;
  const githubUrl = `https://github.com/${scan.repo_name || "acme/repo"}/pull/${scan.pr_number}`;

  return (
    <div className="flex flex-col space-y-8 pb-10">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
      >
        <div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
            <Link href="/scans" className="hover:text-foreground transition-colors">Scans</Link>
            <span>/</span>
            <span>{scan.id ? scan.id.split('-')[0] : '...'}</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
            {scan.pr_title || `Pull Request #${scan.pr_number}`}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Github className="h-4 w-4 mr-1.5" />
              <span className="font-medium text-[#ededed]">{scan.repo_name}</span>
            </div>
            <div className="h-1 w-1 rounded-full bg-[#333]" />
            <div className="flex items-center">
              <span className="text-[#ededed] px-2 py-0.5 rounded-md bg-[#161616] border border-[#222] font-mono text-xs">
                {scan.pr_author || 'author'}
              </span>
            </div>
            <div className="h-1 w-1 rounded-full bg-[#333]" />
            <span>{new Date(scan.created_at || Date.now()).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="bg-[#111] border-[#222] hover:bg-[#1a1a1a]" onClick={() => window.open(githubUrl, '_blank')}>
             <Github className="mr-2 h-4 w-4" /> View PR
          </Button>
          {polygonUrl && (
            <Button variant="outline" className="bg-[#111] border-[#222] hover:bg-[#1a1a1a] text-[#8b5cf6] hover:text-[#7c3aed]" onClick={() => window.open(polygonUrl, '_blank')}>
               <LinkIcon className="mr-2 h-4 w-4" /> Verify On-Chain
            </Button>
          )}
        </div>
      </motion.div>

      {/* Main Stats */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-[#161616] border-[#222222] col-span-1 md:col-span-1 shadow-none overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at center, ${scoreColor} 0%, transparent 70%)` }} />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground text-center">Calculated Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-4 relative z-10">
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-4 shadow-lg shrink-0" style={{ borderColor: scoreColor, boxShadow: `0 0 20px ${scoreColor}40` }}>
              <span className="text-4xl font-bold font-sans tracking-tighter" style={{ color: scoreColor }}>
                {scan.risk_score || 0}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#161616] border-[#222222] col-span-1 md:col-span-3 shadow-none">
          <CardHeader>
            <CardTitle className="text-md font-semibold text-foreground">Scan Summary</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-2">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</span>
                  <div className="flex items-center">
                    {scan.status === 'complete' ? <CheckCircle2 className="h-4 w-4 text-[#22c55e] mr-2" /> : <Activity className="h-4 w-4 text-[#6366f1] mr-2" />}
                    <span className="text-lg font-medium text-foreground capitalize">{scan.status || 'Unknown'}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Found</span>
                  <span className="text-lg font-medium text-foreground">{vulnerabilities.length}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-[#ef4444] uppercase tracking-wider font-semibold">Critical / High</span>
                  <span className="text-lg font-medium text-foreground">{(scan.critical_count || 0) + (scan.high_count || 0)}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-[#f59e0b] uppercase tracking-wider font-semibold">Medium / Low</span>
                  <span className="text-lg font-medium text-foreground">{(scan.medium_count || 0) + (scan.low_count || 0)}</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Vulnerabilities List */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-foreground flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2 text-accent" /> Security Findings
        </h3>
        
        {vulnerabilities.length === 0 ? (
          <Card className="bg-[#161616] border-[#222222] border-dashed shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-16">
               <CheckCircle2 className="h-12 w-12 text-[#22c55e] mb-4" />
               <p className="text-lg font-medium text-foreground">No vulnerabilities detected</p>
               <p className="text-sm text-muted-foreground mt-1">This pull request passed all security checks successfully.</p>
            </CardContent>
          </Card>
        ) : (
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4">
            {vulnerabilities.map((vuln) => (
              <motion.div key={vuln.id} variants={item}>
                <Card className="bg-[#161616] border-[#222222] shadow-none overflow-hidden">
                  <div className={`h-1 w-full ${vuln.severity === 'CRITICAL' ? 'bg-[#dc2626]' : vuln.severity === 'HIGH' ? 'bg-[#f59e0b]' : vuln.severity === 'MEDIUM' ? 'bg-[#eab308]' : 'bg-[#3b82f6]'}`} />
                  <CardHeader className="pb-3 border-b border-[#222222]/50">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={`border-transparent ${vuln.severity === 'CRITICAL' ? 'bg-[#dc2626]/10 text-[#dc2626]' : vuln.severity === 'HIGH' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : vuln.severity === 'MEDIUM' ? 'bg-[#eab308]/10 text-[#eab308]' : 'bg-[#3b82f6]/10 text-[#3b82f6]'}`}>
                            {vuln.severity}
                          </Badge>
                          <Badge variant="outline" className="bg-[#222] text-[#ededed] border-[#333] font-mono text-xs">
                            {vuln.vuln_type}
                          </Badge>
                          {vuln.cwe_id && (
                            <Badge variant="outline" className="bg-transparent text-muted-foreground border-[#333]">
                              {vuln.cwe_id}
                            </Badge>
                          )}
                          {vuln.cvss_score > 0 && (
                            <Badge variant="outline" className="bg-transparent text-muted-foreground border-[#333]">
                              CVSS {vuln.cvss_score}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-semibold text-foreground pt-1">{vuln.title}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-muted-foreground bg-[#111] px-2.5 py-1.5 rounded-md border border-[#222]">
                        <FileCode2 className="h-3.5 w-3.5" />
                        <span className="font-mono">{vuln.file_path}{vuln.line_number ? `:${vuln.line_number}` : ''}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-5">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-[#ededed] flex items-center">
                        <Info className="h-4 w-4 mr-1.5 text-muted-foreground" /> Overview
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {vuln.description}
                      </p>
                    </div>
                    
                    {vuln.ai_explanation && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-[#ededed] flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1.5 text-accent" /> AI Analysis
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {vuln.ai_explanation}
                        </p>
                      </div>
                    )}

                    {vuln.fix_suggestion && (
                      <div className="space-y-2 pt-2">
                        <CodeBlock code={vuln.fix_suggestion} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
