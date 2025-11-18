import React from "react";
import {
  LayoutDashboard, Users, FileText, Star, Clock, Settings, Shield,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, isActive: false },
  { name: "User Management", icon: Users, isActive: true },
  { name: "Policy Management", icon: FileText, isActive: false },
  { name: "Risk Assessment", icon: Star, isActive: false },
  { name: "Compliance Tasks", icon: Clock, isActive: false },
  { name: "Settings", icon: Settings, isActive: false },
];

const sampleUsers = [
  {
    name: "Sarah Adams",
    email: "sarah@example.com",
    role: "Admin",
    accessLevel: "Premium",
    isActive: true,
    initials: "SA"
  },
  {
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "Security Engineer",
    accessLevel: "Basic",
    isActive: true,
    initials: "MJ"
  }
];

export default function AdminPreview() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Admin Control Panel</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Manage users, monitor compliance, and control all aspects of your cybersecurity posture.</p>
        </div>
        
        <div className="backdrop-blur-sm bg-card/30 border border-primary/10 p-6 md:p-8 rounded-xl overflow-hidden shadow-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Admin Sidebar Preview */}
            <div className="lg:w-64 p-4 backdrop-blur-sm bg-card/30 border border-primary/10 rounded-lg mr-6 mb-6 lg:mb-0 flex-shrink-0">
              <div className="flex items-center mb-8">
                <Shield className="w-8 h-8 text-primary" />
                <span className="ml-2 text-lg font-bold">Admin Panel</span>
              </div>
              
              <div className="space-y-4">
                {sidebarItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded-md ${
                      item.isActive 
                        ? "bg-primary bg-opacity-20 text-primary border-l-2 border-primary" 
                        : "text-gray-400 hover:text-primary transition-colors"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Admin Content Preview */}
            <div className="flex-1 backdrop-blur-sm bg-card/30 border border-primary/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">User Management</h3>
                <button className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  Add New User
                </button>
              </div>
              
              {/* User Management Form */}
              <div className="backdrop-blur-sm bg-card/40 border border-primary/10 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold mb-4">Create New User</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                      placeholder="John Doe" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">User Role</label>
                    <select className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none">
                      <option>Admin</option>
                      <option>Compliance Officer</option>
                      <option>Security Engineer</option>
                      <option>Auditor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Access Level</label>
                    <select className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none">
                      <option>Trial</option>
                      <option>Basic</option>
                      <option>Premium</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 rounded-md bg-gray-700 text-white text-sm font-medium mr-2 hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                  <button className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                    Create User
                  </button>
                </div>
              </div>
              
              {/* User List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Access Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {sampleUsers.map((user, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Avatar>
                                <AvatarFallback className={`${
                                  index === 0 ? "bg-primary/20 text-primary" : "bg-emerald-500/20 text-emerald-400"
                                }`}>
                                  {user.initials}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{user.accessLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-500 bg-opacity-20 text-green-500">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button className="text-primary hover:text-primary/80 mr-3">Edit</button>
                          <button className="text-red-500 hover:text-red-400">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
