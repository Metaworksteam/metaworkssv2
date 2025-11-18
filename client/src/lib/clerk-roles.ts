import { User } from "@clerk/clerk-react";

// User role types
export type UserRole = 'admin' | 'user';

// Check if the user has a specific role
export function hasRole(user: User | null | undefined, role: UserRole): boolean {
  if (!user) return false;
  
  // Check public metadata for roles
  const metadata = user.publicMetadata;
  const roles = metadata?.roles as string[] | undefined;
  
  if (!roles) return false;
  
  return roles.includes(role);
}

// Check if user is an admin
export function isAdmin(user: User | null | undefined): boolean {
  return hasRole(user, 'admin');
}

// Get all roles for a user
export function getUserRoles(user: User | null | undefined): UserRole[] {
  if (!user) return [];
  
  const metadata = user.publicMetadata;
  return (metadata?.roles as string[] | undefined) || [];
}