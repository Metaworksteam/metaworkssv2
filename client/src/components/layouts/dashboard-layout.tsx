import React, { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Home,
  LayoutDashboard,
  FileText,
  Shield,
  BarChartHorizontal,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
  BarChart4,
  HardHat,
  Cog,
  Waypoints,
  GraduationCap,
  LayoutGrid,
  UserCircle,
  Building,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const { user, signOut } = useClerk();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutMutation } = useAuth();

  const handleLogout = async () => {
    if (user) {
      await signOut();
    } else {
      logoutMutation.mutate();
    }
  };

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/risk-management", label: "Risk Management", icon: <Shield className="h-5 w-5" /> },
    { href: "/risk-assessment", label: "Risk Assessment", icon: <AlertTriangle className="h-5 w-5" /> },
    { href: "/risk-prediction", label: "Risk Prediction", icon: <BarChart4 className="h-5 w-5" /> },
    { href: "/policies", label: "Policy Management", icon: <FileText className="h-5 w-5" /> },
    { href: "/company", label: "Company Profile", icon: <Building className="h-5 w-5" /> },
    { href: "/security-progress", label: "Security Progress", icon: <Waypoints className="h-5 w-5" /> },
    { href: "/onboarding", label: "Onboarding", icon: <GraduationCap className="h-5 w-5" /> },
    { href: "/frameworks/nca-ecc", label: "NCA ECC", icon: <HardHat className="h-5 w-5" /> },
    { href: "/frameworks/sama", label: "SAMA", icon: <BarChartHorizontal className="h-5 w-5" /> },
    { href: "/virtual-assistant", label: "Virtual Assistant", icon: <HelpCircle className="h-5 w-5" /> },
  ];

  const adminLinks = [
    { href: "/admin", label: "Admin Panel", icon: <Cog className="h-5 w-5" /> },
    { href: "/admin-dashboard", label: "Admin Dashboard", icon: <LayoutGrid className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 pb-2">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">MetaWorks</span>
              </div>
            </Link>
          </div>

          <Separator className="my-2" />

          <div className="p-4 flex-grow overflow-y-auto">
            <nav className="space-y-1">
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      location === link.href
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                    {location === link.href && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                </Link>
              ))}

              {/* Admin section if user has admin role */}
              {user?.publicMetadata?.role === "admin" && (
                <>
                  <Separator className="my-2" />
                  <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">
                    Admin
                  </p>
                  {adminLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant={location === link.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          location === link.href
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.icon}
                        <span className="ml-3">{link.label}</span>
                        {location === link.href && (
                          <ChevronRight className="ml-auto h-4 w-4" />
                        )}
                      </Button>
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary h-9 w-9 rounded-full flex items-center justify-center text-primary-foreground">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {user?.firstName || user?.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.emailAddresses?.[0]?.emailAddress || "user@example.com"}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full flex items-center justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 relative">
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}