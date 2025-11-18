import React from "react";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import { Route, Redirect } from "wouter";
import { Shield, Loader2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAdmin } from "./clerk-roles";

// Base component for role-protected routes
interface RoleProtectedRouteProps {
  path: string;
  component: () => React.JSX.Element | null;
  roleCheck: (user: any) => boolean;
  unauthorizedComponent: () => React.JSX.Element | null;
}

function RoleProtectedRoute({
  path,
  component: Component,
  roleCheck,
  unauthorizedComponent: UnauthorizedComponent
}: RoleProtectedRouteProps) {
  const { isSignedIn, user } = useClerkUser();
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
        <Redirect to="/clerk-auth" />
      </Route>
    );
  }

  if (!roleCheck(user)) {
    return <Route path={path}><UnauthorizedComponent /></Route>;
  }

  return <Route path={path}><Component /></Route>;
}

// Admin-specific protected route
export function AdminProtectedRoute({
  path,
  component
}: {
  path: string;
  component: () => React.JSX.Element | null;
}) {
  const UnauthorizedAccess = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center max-w-md p-6 bg-card rounded-lg border border-border shadow-md">
        <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Admin Access Only</h2>
        <p className="text-muted-foreground mb-4">
          This area requires administrative privileges. Your account does not have the necessary permissions.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <a href="/user-dashboard">Go to User Dashboard</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <RoleProtectedRoute
      path={path}
      component={component}
      roleCheck={(user) => isAdmin(user)}
      unauthorizedComponent={UnauthorizedAccess}
    />
  );
}

// User-specific protected route (allows both users and admins)
export function UserProtectedRoute({
  path,
  component
}: {
  path: string;
  component: () => React.JSX.Element | null;
}) {
  const UnauthorizedAccess = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center max-w-md p-6 bg-card rounded-lg border border-border shadow-md">
        <UserX className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Login Required</h2>
        <p className="text-muted-foreground mb-4">
          Please log in to access this page. If you don't have an account, you can sign up for one.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <a href="/clerk-auth">Login</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <RoleProtectedRoute
      path={path}
      component={component}
      roleCheck={() => true} // Any authenticated user is allowed
      unauthorizedComponent={UnauthorizedAccess}
    />
  );
}