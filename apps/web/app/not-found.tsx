import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="h-24 w-24 rounded-2xl bg-[#111111] border border-[#222222] flex items-center justify-center mb-6 shadow-2xl">
          <Compass className="h-10 w-10 text-muted-foreground animate-spin-slow" />
        </div>
        <h1 className="text-8xl font-black tracking-tighter text-[#1a1a1a] select-none absolute top-[-50px] -z-10">
          404
        </h1>
        <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Route Not Found
        </h2>
        <p className="text-muted-foreground text-md max-w-sm mb-8">
          The requested coordinate does not exist within the DevShield secure boundary.
        </p>
        <Button onClick={() => window.location.href = '/dashboard'} className="bg-foreground text-background hover:bg-[#ededed]/90 h-11 px-8 rounded-full font-medium">
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}
