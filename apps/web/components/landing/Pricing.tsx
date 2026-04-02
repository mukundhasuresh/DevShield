"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Developer",
    price: "Free",
    description: "Perfect for open source projects and small indie teams.",
    features: ["Up to 5 Repositories", "Basic Haiku Scan", "Secret Detection", "10 Scans per Month", "Community Support"],
    popular: false,
    cta: "Get Started"
  },
  {
    name: "Pro",
    price: "$49",
    period: "/mo",
    description: "Unlimited power for serious product development teams.",
    features: ["Unlimited Repositories", "Sonnet Deep Scan Agent", "Auto-Fix Generation", "Blockchain Audit Logging", "Slack Integration", "Priority Support"],
    popular: true,
    cta: "Start Free Trial"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure for large-scale engineering orgs.",
    features: ["Self-Hosted Option", "Custom LLM Fine-Tuning", "Dedicated Account Manager", "SAML SSO", "Compliance Reporting (SOC2)"],
    popular: false,
    cta: "Contact Sales"
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[#050505] border-t border-[#222222]/40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            World-class security tools scaled for everyone. Start for free, upgrade when you need the full power of Sonnet and Blockchain auditing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch pt-8">
          {plans.map((plan, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative h-full"
            >
              <div className={`flex flex-col h-full rounded-2xl border ${plan.popular ? 'border-accent bg-[#0a0a0a] shadow-[0_0_30px_rgba(99,102,241,0.15)] target-ring' : 'border-[#222222] bg-[#0a0a0a]/50'} p-8 relative overflow-hidden`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-[#ededed]">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start">
                      <Check className="h-5 w-5 text-accent mr-3 shrink-0" />
                      <span className="text-sm text-[#d4d4d4]">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto pt-6">
                   <Button 
                      className={`w-full h-11 rounded-full font-medium ${plan.popular ? 'bg-accent hover:bg-accent/90 text-white' : 'bg-[#111111] border border-[#222222] hover:bg-[#1a1a1a] text-foreground'}`}
                      variant={plan.popular ? 'default' : 'outline'}
                   >
                     {plan.cta}
                   </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
