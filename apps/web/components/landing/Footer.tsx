"use client";

import Link from "next/link";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#222222]/40 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-accent/10 p-1.5 rounded-lg border border-accent/20">
                <Shield className="h-5 w-5 text-accent" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">DevShield</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              The next-generation autonomous DevSecOps platform securing workflows automatically using AI and Blockchain.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="https://github.com/mukundhasuresh" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-foreground font-semibold mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-accent transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-accent transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Security Setup</Link></li>
              <li><Link href="#" className="hover:text-accent transition-colors">Smart Contract Audit</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#222222]/40 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} DevShield. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
             <span>Engineered with ❤️ for seamless security.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
