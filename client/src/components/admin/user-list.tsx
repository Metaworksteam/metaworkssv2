import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Sample user data (in a real app, this would be fetched from an API)
const users = [
  {
    id: 1,
    name: "Sarah Adams",
    email: "sarah@example.com",
    role: "Admin",
    accessLevel: "Premium",
    isActive: true,
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "Security Engineer",
    accessLevel: "Basic",
    isActive: true,
  },
  {
    id: 3,
    name: "David Chen",
    email: "david@example.com",
    role: "Compliance Officer",
    accessLevel: "Premium",
    isActive: false,
  },
  {
    id: 4,
    name: "Lisa Williams",
    email: "lisa@example.com",
    role: "Auditor",
    accessLevel: "Basic",
    isActive: true,
  },
];

export default function UserList() {
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Function to get avatar colors based on role
  const getAvatarColors = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-primary/20 text-primary";
      case "Security Engineer":
        return "bg-emerald-500/20 text-emerald-500";
      case "Compliance Officer":
        return "bg-blue-500/20 text-blue-500";
      case "Auditor":
        return "bg-amber-500/20 text-amber-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Access Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={getAvatarColors(user.role)}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{user.accessLevel}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={user.isActive ? "success" : "destructive"} className="rounded-full">
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-auto p-1">Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80 h-auto p-1">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
