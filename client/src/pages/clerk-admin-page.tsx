import React from "react";
import { Helmet } from "react-helmet-async";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "wouter";
import {
  Users,
  Settings,
  Shield,
  Lock,
  UserCog,
  KeyRound,
  ArrowLeft,
  ExternalLink
} from "lucide-react";

export default function ClerkAdminPage() {
  const { user, signOut, isSignedIn } = useClerkUser();

  if (!isSignedIn || !user) {
    return null; // ClerkProtectedRoute will handle redirection
  }

  return (
    <>
      <Helmet>
        <title>Clerk Admin - MetaWorks</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="border-b border-border backdrop-blur-sm bg-background/60 sticky top-0 z-10">
            <div className="container flex h-16 items-center justify-between py-4">
              <div className="flex items-center gap-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
                <h1 className="text-xl font-bold flex items-center">
                  <Shield className="w-5 h-5 text-primary mr-2" />
                  Clerk Admin Portal
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  Signed in as: <span className="font-medium">{user.firstName || user.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 container py-8">
            <div className="grid gap-8">
              <Alert className="bg-card border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <AlertTitle>Clerk Authentication Admin Access</AlertTitle>
                <AlertDescription>
                  This admin portal provides access to Clerk authentication settings. 
                  For security reasons, user management should be handled directly in the Clerk dashboard.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserCog className="h-5 w-5 text-primary" />
                      Current Access
                    </CardTitle>
                    <CardDescription>Your authentication details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">User ID:</div>
                        <div className="font-mono text-xs bg-primary/5 p-2 rounded mt-1 break-all">
                          {user.id}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Email:</div>
                        <div>{user.emailAddresses?.[0]?.emailAddress || 'Not available'}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Name:</div>
                        <div>{user.firstName} {user.lastName}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-card/50 border-primary/10 md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Manage Users & Authentication
                    </CardTitle>
                    <CardDescription>Access your Clerk dashboard to manage users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>Manage your application's authentication settings, users, and organization permissions through the Clerk dashboard.</p>
                      <div className="flex items-center p-3 bg-muted rounded-lg">
                        <Shield className="h-5 w-5 mr-2 text-primary" />
                        <span className="text-sm">Clerk provides secure user management, authentication, and access control.</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={() => window.open("https://dashboard.clerk.com", "_blank")}>
                      <ExternalLink className="h-4 w-4" />
                      Open Clerk Dashboard
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Tabs defaultValue="users" className="mt-6">
                <TabsList className="grid grid-cols-3 md:w-auto w-full">
                  <TabsTrigger value="users" className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="users">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>
                        View and manage users in your application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 border border-dashed border-border rounded-lg">
                        <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">User Management</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                          For security reasons, user management is handled directly in the Clerk dashboard.
                          Open the Clerk dashboard to manage users and their permissions.
                        </p>
                        <Button className="mt-6 gap-2" onClick={() => window.open("https://dashboard.clerk.com", "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                          Open Clerk Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage security settings for your application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 border border-dashed border-border rounded-lg">
                        <KeyRound className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Security Settings</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                          Authentication security settings are managed through the Clerk dashboard.
                          This includes password policies, MFA settings, and session management.
                        </p>
                        <Button className="mt-6 gap-2" onClick={() => window.open("https://dashboard.clerk.com", "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                          Open Clerk Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Settings</CardTitle>
                      <CardDescription>
                        Configure authentication settings for your application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 border border-dashed border-border rounded-lg">
                        <Settings className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">Application Settings</h3>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                          Configure the authentication flow, appearance settings, and integration options
                          through the Clerk dashboard.
                        </p>
                        <Button className="mt-6 gap-2" onClick={() => window.open("https://dashboard.clerk.com", "_blank")}>
                          <ExternalLink className="h-4 w-4" />
                          Open Clerk Dashboard
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}