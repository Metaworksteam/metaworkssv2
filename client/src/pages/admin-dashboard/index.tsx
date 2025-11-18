import React from "react";
import { Helmet } from "react-helmet-async";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import AdminSidebar from "@/components/admin-dashboard/admin-sidebar";
import AdminHeader from "@/components/admin-dashboard/admin-header";
import AdminOverview from "@/components/admin-dashboard/admin-overview";
import { isAdmin } from "@/lib/clerk-roles";

export default function AdminDashboard() {
  const { user } = useClerkUser();

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MetaWorks</title>
      </Helmet>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <AdminSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            <AdminOverview />
          </main>
        </div>
      </div>
    </>
  );
}