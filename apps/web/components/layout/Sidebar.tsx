"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, ListTodo, History, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Repositories", href: "/repos", icon: ListTodo },
  { name: "Scans", href: "/scans", icon: Shield },
  { name: "Audit Log", href: "/audit-log", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-[#222222] bg-[#0a0a0a] pt-4 pb-4">
      <div className="flex h-14 items-center px-6 border-b border-[#222222]/50 pb-4 mb-2">
        <div className="rounded-md bg-accent/20 p-1.5 mr-3 ring-1 ring-accent/30 shadow-inner">
          <Shield className="h-5 w-5 text-accent" />
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">DevShield</span>
      </div>
      
      <nav className="flex-1 space-y-1.5 px-4 pt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href} className="relative block group">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-[#161616] border border-[#222222]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "relative z-10 flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground group-hover:bg-[#111111]"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 pb-2 mt-auto">
        <div className="rounded-xl border border-[#222222] bg-[#111111] p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <h4 className="text-xs font-semibold text-foreground mb-1 relative z-10">Pro Plan Active</h4>
          <p className="text-xs text-muted-foreground mb-3 relative z-10">Unlimited scans</p>
          <div className="w-full bg-[#222222] rounded-full h-1.5 relative z-10">
            <motion.div 
              className="bg-accent h-1.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: "45%" }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
