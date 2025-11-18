import React from "react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  FileText,
  BarChart3,
  ClipboardCheck,
  AlertTriangle,
  Book,
  Home,
  CheckCircle2,
  HelpCircle,
  Settings,
  GraduationCap
} from "lucide-react";

// Type for sidebar items
interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

// Type for framework items
interface FrameworkItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export default function UserSidebar() {
  const [location] = useLocation();

  // Define main sidebar items
  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/user-dashboard",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Onboarding",
      href: "/onboarding",
      icon: <GraduationCap className="h-5 w-5" />
    },
    {
      title: "Assessments",
      href: "/user-dashboard/assessments",
      icon: <ClipboardCheck className="h-5 w-5" />
    },
    {
      title: "Risk Management",
      href: "/user-dashboard/risks",
      icon: <AlertTriangle className="h-5 w-5" />
    },
    {
      title: "Policies",
      href: "/user-dashboard/policies",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Documentation",
      href: "/user-dashboard/documentation",
      icon: <Book className="h-5 w-5" />
    },
    {
      title: "Support",
      href: "/user-dashboard/support",
      icon: <HelpCircle className="h-5 w-5" />
    },
    {
      title: "Settings",
      href: "/user-dashboard/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ];
  
  // Define framework items with dedicated colors
  const frameworkItems: FrameworkItem[] = [
    {
      title: "NCA ECC",
      href: "/user-dashboard/frameworks/nca-ecc",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-green-500"
    },
    {
      title: "SAMA",
      href: "/user-dashboard/frameworks/sama",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-blue-500"
    },
    {
      title: "PDPL",
      href: "/user-dashboard/frameworks/pdpl",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-purple-500"
    },
    {
      title: "ISO 27001",
      href: "/user-dashboard/frameworks/iso-27001",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "text-amber-500"
    }
  ];

  return (
    <div className="w-64 border-r border-border bg-card/30 backdrop-blur-sm h-screen flex-shrink-0">
      {/* Logo and title */}
      <div className="h-16 border-b border-border flex items-center px-4">
        <Shield className="h-6 w-6 text-primary mr-2" />
        <h1 className="font-bold text-lg">MetaWorks</h1>
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

          {/* Main Nav links */}
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
          
          {/* Frameworks Section */}
          <div className="mt-6 px-2">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Compliance Frameworks
            </h3>
            <div className="mt-2 space-y-1">
              {frameworkItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                      location === item.href
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <span className={cn("mr-3", item.color)}>{item.icon}</span>
                    {item.title}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Virtual Assistant Link */}
          <div className="px-2 mt-6">
            <Link href="/did-agent">
              <Button variant="default" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Virtual Assistant
              </Button>
            </Link>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}