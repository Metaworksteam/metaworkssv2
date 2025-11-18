import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Shield,
  LayoutDashboard,
  Users,
  FileText,
  Star,
  Clock,
  Settings,
  LogOut,
  Bot,
  Presentation,
  BarChart4,
  AlertTriangle,
  History,
  GraduationCap,
  Mail,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Onboarding",
    icon: GraduationCap,
    path: "/onboarding",
  },
  {
    name: "User Management",
    icon: Users,
    path: "/admin",
  },
  {
    name: "Customer Messages",
    icon: Mail,
    path: "/admin-messages",
  },
  {
    name: "Policy Management",
    icon: FileText,
    path: "/policies",
  },
  {
    name: "Risk Management",
    icon: AlertTriangle,
    path: "/risk-management",
  },
  {
    name: "Security Timeline",
    icon: History,
    path: "/security-timeline",
  },
  {
    name: "NCA ECC Assessment",
    icon: Star,
    path: "/frameworks/nca-ecc-assessment",
  },
  {
    name: "SAMA Assessment",
    icon: Shield,
    path: "/frameworks/sama-assessment",
  },
  {
    name: "Compliance Tasks",
    icon: Clock,
    path: "/tasks",
  },
  {
    name: "Virtual Assistant",
    icon: Bot,
    path: "/virtual-assistant",
  },
  {
    name: "D-ID Agent",
    icon: Presentation,
    path: "/did-agent",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const [location, navigate] = useLocation();
  const { logoutMutation } = useAuth();
  
  const isActive = (path: string) => {
    if (path === "/dashboard" && location === "/dashboard") {
      return true;
    }
    if (path === "/onboarding" && location === "/onboarding") {
      return true;
    }
    if (path === "/admin" && location === "/admin") {
      return true;
    }
    if (path === "/virtual-assistant" && location === "/virtual-assistant") {
      return true;
    }
    if (path === "/did-agent" && location === "/did-agent") {
      return true;
    }
    if (path === "/risk-management" && location === "/risk-management") {
      return true;
    }
    if (path === "/policies" && location === "/policies") {
      return true;
    }
    if (path === "/security-timeline" && location === "/security-timeline") {
      return true;
    }
    if (path === "/frameworks/nca-ecc-assessment" && location === "/frameworks/nca-ecc-assessment") {
      return true;
    }
    if (path === "/frameworks/sama-assessment" && location === "/frameworks/sama-assessment") {
      return true;
    }
    return location === path;
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-background/60 backdrop-blur-sm border-r border-primary/10 p-4">
      <div className="flex items-center gap-2 py-4">
        <Shield className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">MetaWorks</span>
      </div>
      
      <div className="mt-8 flex flex-col flex-1 gap-1">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
              isActive(item.path)
                ? "bg-primary bg-opacity-20 text-primary border-l-2 border-primary"
                : "hover:bg-primary/10 hover:text-primary text-muted-foreground"
            } transition-colors`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.name}</span>
          </div>
        ))}
      </div>
      
      <div 
        onClick={handleLogout}
        className="flex items-center px-3 py-2 mt-auto rounded-md cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <LogOut className="mr-3 h-5 w-5" />
        <span>Logout</span>
      </div>
    </div>
  );
}
