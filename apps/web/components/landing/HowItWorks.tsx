"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Install the GitHub App",
    description: "Connect DevShield to your organization or specific repositories in 2 clicks. No complex CI/CD YAML configurations required."
  },
  {
    number: "02",
    title: "Open a Pull Request",
    description: "Developers continue working natively. DevShield automatically listens to webhook events and kicks off isolated secure scans in the background."
  },
  {
    number: "03",
    title: "Get Results & Fixes",
    description: "View granular security breakdowns complete with AI-generated fixes inside the Dashboard and appended directly onto the GitHub PR as review comments."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0a0a0a] border-t border-[#222222]/40 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 block h-full w-[1px] -translate-x-1/2 md:bg-gradient-to-b md:from-transparent md:via-[#222] md:to-transparent opacity-50" />
      
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Silent Integration. Loud Protection.
          </h2>
        </div>

        <div className="flex flex-col space-y-12 md:space-y-0 relative">
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[1px] bg-[#222222] md:-translate-x-1/2 hidden md:block" />
          
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className={`flex flex-col md:flex-row items-center justify-between w-full relative z-10 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="md:w-5/12 w-full mb-8 md:mb-0" />
              
              <div className="absolute left-[20px] md:left-1/2 md:-translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-[#111111] border-4 border-[#0a0a0a] z-20">
                <div className="w-3 h-3 bg-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              </div>
              
              <div className={`md:w-5/12 w-full pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 text-left'}`}>
                <div className="space-y-3 p-6 rounded-xl border border-[#222222] bg-[#111111]/50 backdrop-blur-sm shadow-xl hover:border-accent/40 transition-colors duration-300">
                  <span className="text-4xl font-black text-[#222222] select-none block mb-2">{step.number}</span>
                  <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
