import React from "react";
import { Helmet } from "react-helmet-async";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import UserSidebar from "@/components/user-dashboard/user-sidebar";
import UserHeader from "@/components/user-dashboard/user-header";
import UserOverview from "@/components/user-dashboard/user-overview";

export default function UserDashboard() {
  const { user } = useClerkUser();
  const organizationName = "Your Organization"; // This would come from your database

  return (
    <>
      <Helmet>
        <title>Compliance Dashboard - MetaWorks</title>
      </Helmet>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <UserSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <UserHeader organizationName={organizationName} />
          
          <main className="flex-1 p-6 overflow-auto">
            <UserOverview />
          </main>
        </div>
      </div>
    </>
  );
}