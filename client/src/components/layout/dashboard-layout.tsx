import React, { ReactNode } from "react";
import Sidebar from "@/components/dashboard/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;