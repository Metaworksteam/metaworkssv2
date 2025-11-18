import React from "react";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import { Route, Redirect } from "wouter";
import { Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClerkProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element | null;
}) {
  const { isSignedIn, user } = useClerkUser();
  // Use a simpler check since isLoaded isn't available 
  const isLoading = user === undefined;

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!isSignedIn) {
    return (
      <Route path={path}>
        <div className="flex justify-center items-center h-screen">
          <div className="text-center max-w-md p-6 bg-card rounded-lg border border-border shadow-md">
            <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-4">
              This area requires Clerk authentication. Please sign in with your Clerk admin account.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild variant="default">
                <a href="/clerk-login">Sign in with Clerk</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/login">Regular Login</a>
              </Button>
            </div>
          </div>
        </div>
      </Route>
    );
  }

  return <Route path={path}><Component /></Route>;
}