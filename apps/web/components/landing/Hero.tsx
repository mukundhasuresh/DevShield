"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ShieldCheck, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

const CODE_LINES = [
  { text: "async function authenticate(req, res) {", focus: false, danger: false },
  { text: "  const token = req.headers.authorization;", focus: false, danger: false },
  { text: "  if (!token) return res.send(401);", focus: false, danger: false },
  { text: "  ", focus: false, danger: false },
  { text: "  // DEV-ONLY: hardcoded jwt verification", focus: true, danger: true },
  { text: "  const data = jwt.verify(token, 'super_secret_hardcoded_key');", focus: true, danger: true },
  { text: "  ", focus: false, danger: false },
  { text: "  return next(data);", focus: false, danger: false },
  { text: "}", focus: false, danger: false },
];

export function Hero() {
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine((prev) => (prev + 1) % CODE_LINES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#8b5cf6]/20 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent backdrop-blur-sm"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            <span>DevShield 1.0 is now live</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground"
          >
            Automated Security for the <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#8b5cf6]">
              Modern Developer
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl"
          >
            AI-powered code scanning natively integrated into your GitHub PR workflow. 
            Catch vulnerabilities, secure secrets, and persist immutable audit logs on the blockchain effortlessly.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <Button size="lg" className="h-12 px-8 bg-foreground text-background hover:bg-[#ededed]/90 w-full sm:w-auto font-medium rounded-full" asChild>
              <a href="https://github.com/apps/devshield-ai/installations/new">
                <Github className="mr-2 h-5 w-5" />
                Install on GitHub — it's free
              </a>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 border-[#222222] bg-[#111111] hover:bg-[#1a1a1a] w-full sm:w-auto font-medium rounded-full group" asChild>
              <a href="#features">
                Explore Features <ChevronRight className="ml-1 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-1" />
              </a>
            </Button>
          </motion.div>

          {/* Animated Scanner Demo */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="w-full max-w-3xl pt-12 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-10 pointer-events-none object-cover" />
            <div className="rounded-xl border border-[#222222] bg-[#0c0c0c] shadow-2xl overflow-hidden relative">
              <div className="flex items-center px-4 py-3 border-b border-[#222222] bg-[#111111]">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-[#ef4444]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#f59e0b]/80" />
                  <div className="h-3 w-3 rounded-full bg-[#22c55e]/80" />
                </div>
                <div className="mx-auto flex items-center text-xs text-muted-foreground font-mono bg-[#161616] px-3 py-1 rounded-md border border-[#222]">
                  <Github className="h-3 w-3 mr-1.5" />
                  scanning pr-#142/auth.js
                </div>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed text-left text-muted-foreground relative">
                {/* Scanner bar animation */}
                <motion.div 
                   animate={{ top: `${(activeLine / CODE_LINES.length) * 100}%` }}
                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   className="absolute left-0 right-0 h-8 bg-accent/10 border-y border-accent/30 pointer-events-none flex items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                   style={{ zIndex: 0 }}
                >
                  <div className="w-[3px] h-full bg-accent animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]" />
                </motion.div>

                {CODE_LINES.map((line, idx) => (
                  <div key={idx} className={`relative z-10 px-2 py-0.5 transition-colors duration-300 ${activeLine === idx ? (line.danger ? 'text-[#ef4444]' : 'text-foreground font-medium') : (line.danger && activeLine > idx ? 'text-[#ef4444]' : '')}`}>
                    <span className="opacity-40 mr-4 select-none">{idx + 1}</span>
                    {line.text}
                    {idx === 5 && activeLine > 5 && (
                       <motion.div 
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         className="absolute -right-2 top-0 mt-0.5 ml-4 inline-flex items-center bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30 px-2 rounded text-xs"
                       >
                         Hardcoded Secret Detected
                       </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
