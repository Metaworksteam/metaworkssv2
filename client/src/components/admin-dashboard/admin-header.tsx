import React from "react";
import { useClerkUser } from "@/components/clerk/clerk-auth";
import { Bell, Menu, Search, HelpCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { ThemeSwitch } from "@/components/layout/theme-switch";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  toggleSidebar?: () => void;
}

export default function AdminHeader({ toggleSidebar }: AdminHeaderProps) {
  const { user, signOut } = useClerkUser();
  
  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user) return "A";
    
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else {
      return "A";
    }
  };

  return (
    <header className="h-16 border-b border-border bg-card/30 backdrop-blur-sm px-4 flex items-center justify-between">
      {/* Left section with mobile menu toggle and search */}
      <div className="flex items-center gap-4 flex-1">
        {toggleSidebar && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        
        <div className="relative max-w-md w-full hidden md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-background/50"
          />
        </div>
      </div>
      
      {/* Admin badge */}
      <div className="hidden md:flex mx-4">
        <Badge variant="default" className="px-3 py-1 text-xs">
          Administrator
        </Badge>
      </div>
      
      {/* Right section with help, notifications and user menu */}
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
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          <span className="sr-only">Notifications</span>
        </Button>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl} alt={user?.firstName || "Admin"} />
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
                <span className="text-xs text-primary font-medium mt-1">Administrator</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>My Profile</DropdownMenuItem>
            <DropdownMenuItem>System Settings</DropdownMenuItem>
            <DropdownMenuItem>Activity Log</DropdownMenuItem>
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