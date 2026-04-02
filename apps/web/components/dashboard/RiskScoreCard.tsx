"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ShieldAlert, Activity, CheckCircle, Database } from "lucide-react";

interface MetricsData {
  riskScore: number;
  vulnCount: number;
  repoCount: number;
  scanCount: number;
}

export function RiskScoreCard({ isLoading, data }: { isLoading?: boolean, data?: MetricsData }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#161616] border-[#222222]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-1/2 bg-[#222222] rounded-md" />
              <Skeleton className="h-5 w-5 rounded-full bg-[#222222]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 bg-[#222222] rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const defaultData = data || { riskScore: 0, vulnCount: 0, repoCount: 0, scanCount: 0 };
  
  const metrics = [
    { title: "Risk Score", value: `${defaultData.riskScore}/100`, icon: ShieldAlert, color: "text-[#ef4444]" },
    { title: "Vulnerabilities", value: defaultData.vulnCount, icon: Activity, color: "text-[#f59e0b]" },
    { title: "Protected Repos", value: defaultData.repoCount, icon: Database, color: "text-[#6366f1]" },
    { title: "Total Scans", value: defaultData.scanCount, icon: CheckCircle, color: "text-[#22c55e]" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.title}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1, ease: "easeOut" }}
        >
          <Card className="bg-[#161616] border-[#222222] hover:border-[#333333] transition-colors shadow-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.title}
              </CardTitle>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground font-sans tracking-tight">{m.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
