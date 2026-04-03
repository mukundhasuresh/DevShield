"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Shield } from "lucide-react";
import { createBrowserClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const handleGithubLogin = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background px-4">
      <Card className="mx-auto w-full max-w-sm rounded-xl border border-border shadow-2xl bg-card">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6 mt-2">
            <div className="rounded-2xl bg-accent/20 p-4 ring-1 ring-accent/30 shadow-inner">
              <Shield className="h-10 w-10 text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">Sign in to DevShield</CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Connect your GitHub account to protect your repositories with AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8">
          <Button 
            variant="outline" 
            className="w-full h-12 text-md transition-all hover:bg-accent hover:text-white" 
            onClick={handleGithubLogin}
          >
            <Github className="mr-3 h-5 w-5" />
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
