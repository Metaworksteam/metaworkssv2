import React from "react";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import { Bell, Menu, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ThemeSwitch } from "@/components/layout/theme-switch";
import { Badge } from "@/components/ui/badge";

interface UserHeaderProps {
  toggleSidebar?: () => void;
  organizationName?: string;
}

export default function UserHeader({ toggleSidebar, organizationName = "Your Organization" }: UserHeaderProps) {
  const { user, signOut } = useClerkUser();
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else {
      return "U";
    }
  };

  // Dummy compliance score for demonstration
  const complianceScore = 72;

  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-sm px-4 flex items-center justify-between">
      {/* Left section with mobile menu toggle */}
      <div className="flex items-center">
        {toggleSidebar && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        
        {/* Organization name and compliance badge */}
        <div className="flex items-center">
          <h2 className="font-medium text-sm md:text-base">{organizationName}</h2>
          <div className="ml-4 hidden md:flex items-center">
            <Badge variant="outline" className="bg-primary/5 text-xs gap-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Compliance Score: {complianceScore}%</span>
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Right section with notifications, help and user menu */}
      <div className="flex items-center space-x-2">
        <ThemeSwitch>Toggle theme</ThemeSwitch>
        
        {/* Help */}
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help</span>
        </Button>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} alt={user?.firstName || "User"} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.firstName} {user?.lastName}</span>
                <span className="text-xs text-muted-foreground truncate max-w-52">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Company Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}