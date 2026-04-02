"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 border-b border-[#222222]/40 bg-[#0a0a0a]/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-accent/10 p-1.5 rounded-lg border border-accent/20">
             <Shield className="h-5 w-5 text-accent" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground">DevShield</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Sign In
          </Link>
          <Button asChild className="bg-foreground text-background hover:bg-[#ededed]/90 h-9 px-4 rounded-full font-medium">
            <a href="https://github.com/apps/devshield-ai/installations/new" target="_blank" rel="noopener noreferrer">
              Install App
            </a>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
