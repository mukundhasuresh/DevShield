"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const COLORS = {
  CRITICAL: "#dc2626", // critical
  HIGH: "#f59e0b",     // warning
  MEDIUM: "#eab308",   // yellow
  LOW: "#3b82f6",      // blue
};

export function SeverityDonut({ isLoading, data }: { isLoading?: boolean; data?: any[] }) {
  if (isLoading) {
    return (
      <Card className="bg-[#161616] border-[#222222] col-span-1 h-[350px]">
        <CardHeader>
          <Skeleton className="h-5 w-32 bg-[#222222]" />
          <Skeleton className="h-4 w-48 bg-[#222222] mt-1" />
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px]">
          <Skeleton className="h-40 w-40 rounded-full bg-[#222222]" />
        </CardContent>
      </Card>
    );
  }

  const defaultData = data || [
    { name: "CRITICAL", value: 1 },
    { name: "HIGH", value: 4 },
    { name: "MEDIUM", value: 12 },
    { name: "LOW", value: 24 },
  ];

  // Calculate total to show inside the donut optionally
  const total = defaultData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="col-span-1"
    >
      <Card className="bg-[#161616] border-[#222222] h-[350px] shadow-none flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold text-foreground">Severity Breakdown</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">Distribution of active vulnerabilities</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-4">
          {total === 0 ? (
             <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                No vulnerabilities found
             </div>
          ) : (
            <div className="h-[220px] w-full relative">
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-3xl font-bold text-foreground">{total}</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defaultData}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {defaultData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#555"} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#111111", border: "1px solid #222222", borderRadius: "8px" }}
                    itemStyle={{ color: "#ededed", fontWeight: 500 }}
                  />
                  <Legend verticalAlign="bottom" height={30} iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
