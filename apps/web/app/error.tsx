"use client";

import { useEffect } from "react";
import { ShieldAlert, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-center px-4">
      <div className="h-20 w-20 rounded-full bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center mb-6">
        <ShieldAlert className="h-10 w-10 text-[#ef4444]" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
        System Malfunction
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        We've detected a critical error in this module. Our automated agents have been notified and are actively investigating.
      </p>
      <div className="flex space-x-4 flex-col sm:flex-row space-y-4 sm:space-y-0">
        <Button onClick={() => reset()} className="bg-foreground text-background hover:bg-[#ededed]/90 h-11 px-8 rounded-full font-medium">
          <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" className="border-[#222222] bg-[#111111] hover:bg-[#1a1a1a] h-11 px-8 rounded-full" onClick={() => window.location.href = '/'}>
          Return to Base
        </Button>
      </div>
      <div className="mt-12 text-xs font-mono text-[#333333]">
        ERR_ID: {error.digest || 'UNKNOWN_FAULT'}
      </div>
    </div>
  );
}
