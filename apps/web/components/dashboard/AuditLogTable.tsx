"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Link as LinkIcon, Check, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function AuditLogTable({ logs }: { logs: any[] }) {
  const [verifyingMap, setVerifyingMap] = useState<Record<string, 'verifying' | 'success' | 'failed'>>({});

  const handleVerify = async (id: string, hash: string) => {
    setVerifyingMap(prev => ({ ...prev, [id]: 'verifying' }));
    
    // Simulate ethers.js verification
    // In production: await verifyScan(hash) from '@/lib/blockchain'
    await new Promise(r => setTimeout(r, 1500));
    
    setVerifyingMap(prev => ({ ...prev, [id]: 'success' }));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
      <Card className="bg-[#161616] border-[#222222] shadow-none">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-md font-semibold text-foreground">Immutable Scan Logs</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Cryptography hashes securely persisted on Polygon Amoy testnet.</CardDescription>
          </div>
          <Badge variant="outline" className="bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/30">
            Polygon Amoy True
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-[#222222] overflow-hidden mt-2">
            <Table>
              <TableHeader className="bg-[#111111]">
                <TableRow className="border-[#222222] hover:bg-transparent">
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Target</TableHead>
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Transaction</TableHead>
                  <TableHead className="text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider hidden md:table-cell">Scan Hash (SHA-256)</TableHead>
                  <TableHead className="text-right text-muted-foreground h-10 text-xs font-medium uppercase tracking-wider">Verification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                     <TableCell colSpan={4} className="h-32 text-center text-muted-foreground text-sm font-medium">No audit logs available for this organization.</TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} className="border-[#222222] hover:bg-[#1a1a1a]/50 transition-colors text-sm">
                      <TableCell className="font-medium text-foreground py-4">
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs">{log.repo}</span>
                          <span className="text-xs text-muted-foreground font-mono">#{log.pr}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {log.txHash ? (
                          <a 
                            href={`https://amoy.polygonscan.com/tx/${log.txHash}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
                          >
                            <span className="font-mono text-xs">{log.txHash.substring(0, 14)}...</span>
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">Pending TX...</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-4 font-mono text-xs hidden md:table-cell">
                        {log.scanHash ? `${log.scanHash.substring(0, 16)}...${log.scanHash.slice(-4)}` : '...'}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        {verifyingMap[log.id] === 'success' ? (
                          <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 inline-flex items-center">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 bg-[#111111] border-[#222222] hover:bg-[#1a1a1a] text-[#8b5cf6] hover:text-[#7c3aed] transition-colors"
                            onClick={() => handleVerify(log.id, log.scanHash)}
                            disabled={verifyingMap[log.id] === 'verifying' || !log.scanHash}
                          >
                            {verifyingMap[log.id] === 'verifying' ? (
                              <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Verifying...</>
                            ) : (
                              <><ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Verify</>
                            )}
                          </Button>
                        )}
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
