import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ClerkSignIn, ClerkSignUp } from "@/components/clerk/clerk-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClerkUser } from "@/components/clerk/clerk-auth";

export default function ClerkAuthPage() {
  const [activeTab, setActiveTab] = useState<string>("sign-in");
  const [location, navigate] = useLocation();
  const { isSignedIn } = useClerkUser();

  // Redirect if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/clerk-admin");
    }
  }, [isSignedIn, navigate]);

  return (
    <>
      <Helmet>
        <title>Admin Authentication - MetaWorks</title>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border backdrop-blur-sm bg-background/60 sticky top-0 z-10">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="gap-1">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <h1 className="text-xl font-bold flex items-center">
                <Shield className="w-5 h-5 text-primary mr-2" />
                Admin Authentication
              </h1>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 container flex items-start justify-center py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
            {/* Auth forms */}
            <div className="flex flex-col items-center">
              <Tabs 
                defaultValue="sign-in" 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full max-w-md"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                  <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                <div className="mt-6">
                  <TabsContent value="sign-in">
                    <ClerkSignIn />
                  </TabsContent>
                  <TabsContent value="sign-up">
                    <ClerkSignUp />
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Information panel */}
            <div className="hidden md:flex flex-col justify-center bg-primary/5 backdrop-blur-sm p-10 rounded-lg border border-primary/10">
              <div className="max-w-md">
                <div className="mb-6 flex justify-center">
                  <Shield className="h-16 w-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Admin Authentication Portal
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    This is a secure area for administrative access to the MetaWorks platform.
                    Only authorized administrators should access this portal.
                  </p>
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <h3 className="font-medium mb-2">Administrator Capabilities:</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Manage user accounts and permissions</li>
                      <li>Configure platform-wide settings</li>
                      <li>Access system analytics and reporting</li>
                      <li>Manage compliance frameworks</li>
                      <li>Configure security policies</li>
                    </ul>
                  </div>
                  <p className="text-sm">
                    If you're a standard user looking to access your dashboard,
                    please use the regular login page instead.
                  </p>
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" asChild>
                      <a href="/login">Go to Regular Login</a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}