"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Topbar() {
  const pathname = usePathname();
  // Capitalize properly without dashes
  const pageName = (pathname.split("/")[1] || "dashboard")
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#222222] bg-[#0a0a0a]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="flex bg-[#161616] border border-[#222222] rounded-md px-3 py-1.5 items-center cursor-pointer hover:bg-[#1a1a1a] transition-colors">
          <span className="text-sm font-medium text-foreground pr-2 border-r border-[#222222] mr-2">Acme Corp</span>
          <span className="text-sm text-muted-foreground">{pageName}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden w-64 lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search scans, repos..."
            className="h-9 w-full rounded-md border border-[#222222] bg-[#111111] pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
        </div>

        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </Button>

        <ThemeToggle />

        <div className="h-6 w-px bg-[#222222] mx-1" />

        <Button variant="ghost" className="h-9 pl-2 pr-1 hover:bg-[#111111] border border-transparent hover:border-[#222222]">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>DV</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
