import React from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Users,
  BarChart3,
  ClipboardCheck,
  Database,
  Settings,
  Home,
  LineChart,
  FileSpreadsheet,
  HelpCircle,
  Bell
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminSidebar() {
  const [location] = useLocation();

  // Define sidebar items for admin dashboard
  const sidebarItems: SidebarItem[] = [
    {
      title: "Overview",
      href: "/admin-dashboard",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Users",
      href: "/admin-dashboard/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Organizations",
      href: "/admin-dashboard/organizations",
      icon: <Database className="h-5 w-5" />
    },
    {
      title: "Assessments",
      href: "/admin-dashboard/assessments",
      icon: <ClipboardCheck className="h-5 w-5" />
    },
    {
      title: "Analytics",
      href: "/admin-dashboard/analytics",
      icon: <LineChart className="h-5 w-5" />
    },
    {
      title: "Reports",
      href: "/admin-dashboard/reports",
      icon: <FileSpreadsheet className="h-5 w-5" />
    },
    {
      title: "Notifications",
      href: "/admin-dashboard/notifications",
      icon: <Bell className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/admin-dashboard/settings",
      icon: <Settings className="h-5 w-5" />
    },
    {
      title: "Support",
      href: "/admin-dashboard/support",
      icon: <HelpCircle className="h-5 w-5" />
    }
  ];

  return (
    <div className="w-64 border-r border-border bg-card/30 backdrop-blur-sm h-screen flex-shrink-0">
      {/* Logo and title */}
      <div className="h-16 border-b border-border flex items-center px-4">
        <Shield className="h-6 w-6 text-primary mr-2" />
        <h1 className="font-bold text-lg">MetaWorks Admin</h1>
      </div>

      {/* Sidebar content */}
      <ScrollArea className="h-[calc(100vh-64px)]">
        <div className="py-4 px-2">
          {/* Home link */}
          <div className="px-2 mb-4">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start text-muted-foreground">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Admin Nav links */}
          <div className="px-2 mb-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administration
            </h3>
          </div>
          <nav className="space-y-1 px-2">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                    location === item.href
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="mr-3 text-primary/80">{item.icon}</span>
                  {item.title}
                </a>
              </Link>
            ))}
          </nav>
          
          {/* User Dashboard Link */}
          <div className="px-2 mt-6">
            <Link href="/user-dashboard">
              <Button variant="secondary" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Switch to User View
              </Button>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}