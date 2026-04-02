"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Link2, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <BrainCircuit className="h-6 w-6 text-accent" />,
    title: "AI Deep Scan Engine",
    description: "Claude 3.5 intelligent agent organically triages and deep scans every file in your Pull Requests to detect obscure zero-days, logic flaws, and credential leaks.",
  },
  {
    icon: <Link2 className="h-6 w-6 text-[#8b5cf6]" />,
    title: "Immutable Blockchain Audit",
    description: "Every security scan generates a cryptographic hash that is instantly published directly to the Polygon Amoy blockchain acting as your zero-trust audit trail.",
  },
  {
    icon: <Wrench className="h-6 w-6 text-[#22c55e]" />,
    title: "Auto Fix Generation",
    description: "Don't just detect vulnerabilities. DevShield synthetically generates production-ready code patches instantly allowing developers to merge fixes in seconds.",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#050505] relative border-t border-[#222222]/40">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Total Pipeline Defense
          </h2>
          <p className="text-muted-foreground text-lg">
            Stop shipping vulnerabilities. Implement an elite tier defensive architecture without slowing down your developers.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <Card className="bg-[#0a0a0a] border-[#222222] shadow-none h-full hover:border-[#333333] transition-colors duration-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
