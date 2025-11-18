import React, { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import UserForm from "@/components/admin/user-form";
import UserList from "@/components/admin/user-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanyInfoForm from "@/components/company/company-info-form";
import PolicyUpload from "@/components/company/policy-upload";
import PolicyList from "@/components/company/policy-list";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ClerkUserButton } from "@/components/clerk/clerk-auth";
import { Shield, ServerCog, UserCog, Building, FileText } from "lucide-react";

export default function AdminPage() {
  const [showUserForm, setShowUserForm] = useState(false);
  const { isSignedIn, user: clerkUser } = useClerkUser();
  const { user } = useAuth();
  
  // Check if user has admin access (either through Clerk or regular auth)
  const hasAccess = isSignedIn || (user && user.role === 'admin');
  
  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center max-w-md p-6 bg-card rounded-lg border border-border shadow-md">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">
            You need administrator privileges to access this page. Please sign in with an admin account.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild variant="default">
              <a href="/clerk-auth">Sign in with Clerk</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/auth">Sign in with Password</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <ServerCog className="mr-2 h-6 w-6 text-primary" />
                Admin Control Panel
              </h1>
              <p className="text-muted-foreground mt-1">Manage users, company information, and system settings</p>
            </div>
            
            {isSignedIn && (
              <div className="flex items-center gap-2 bg-card/60 backdrop-blur-sm rounded-lg p-2 border border-border">
                <span className="text-sm">Admin: {clerkUser?.firstName || clerkUser?.username || 'Admin'}</span>
                <ClerkUserButton />
              </div>
            )}
          </div>
          
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList className="grid grid-cols-3 md:w-auto w-full">
              <TabsTrigger value="users" className="flex items-center">
                <UserCog className="mr-2 h-4 w-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Company Information
              </TabsTrigger>
              <TabsTrigger value="policies" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Policy Management
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              {showUserForm ? (
                <UserForm onCancel={() => setShowUserForm(false)} />
              ) : (
                <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <button 
                      onClick={() => setShowUserForm(true)} 
                      className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Add New User
                    </button>
                  </CardHeader>
                  <CardContent>
                    <UserList />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="company" className="space-y-4">
              <CompanyInfoForm />
            </TabsContent>
            
            <TabsContent value="policies" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PolicyUpload />
                <PolicyList />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
