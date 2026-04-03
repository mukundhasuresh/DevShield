"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase-client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Handling potential implicit grant hash fragments
    const supabase = createBrowserClient();
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/dashboard");
      }
    });
    
    // Fallback if the auth state doesn't change
    const timer = setTimeout(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.push("/login?error=timeout");
        } else {
          router.push("/dashboard");
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
          <ShieldCheck className="h-12 w-12 text-accent relative z-10" />
        </div>
        <p className="text-lg font-medium text-foreground tracking-tight animate-pulse">
          Authenticating your session...
        </p>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}
