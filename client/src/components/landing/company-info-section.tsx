import React from "react";
import { Upload, X, Plus, Eye, Download, FileText } from "lucide-react";

export default function CompanyInfoSection() {
  return (
    <section className="py-20 bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Company Information Dashboard</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Easily manage your organization's information and compliance documentation.</p>
        </div>
        
        <div className="backdrop-blur-sm bg-card/30 border border-primary/10 p-6 md:p-8 rounded-xl shadow-xl">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Company Info Form */}
            <div className="lg:w-1/2">
              <h3 className="text-xl font-semibold mb-6">Company Details</h3>
              
              <div className="backdrop-blur-sm bg-card/30 border border-primary/10 rounded-lg p-6 mb-6">
                {/* Company Logo Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Logo</label>
                  <div className="flex items-center">
                    <div className="w-20 h-20 rounded-md bg-background border border-gray-700 flex items-center justify-center mr-4">
                      <Upload className="w-8 h-8 text-gray-500" />
                    </div>
                    <div>
                      <button className="px-4 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors">
                        Upload Logo
                      </button>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG (max. 2MB)</p>
                    </div>
                  </div>
                </div>
                
                {/* Company Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                    placeholder="Acme Corporation" 
                  />
                </div>
                
                {/* Executive Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CEO Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                      placeholder="John Smith" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CIO Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                      placeholder="Sarah Johnson" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CTO Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                      placeholder="Michael Brown" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">CISO Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                      placeholder="David Chen" 
                    />
                  </div>
                </div>
                
                {/* Cybersecurity Staff */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cybersecurity Staff</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        className="flex-1 p-2 rounded-l-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                        placeholder="Staff Member Name" 
                      />
                      <button className="p-2 rounded-r-md bg-red-500 bg-opacity-20 text-red-500 border border-l-0 border-red-500 border-opacity-20 hover:bg-opacity-30 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        className="flex-1 p-2 rounded-l-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none" 
                        placeholder="Staff Member Name" 
                      />
                      <button className="p-2 rounded-r-md bg-red-500 bg-opacity-20 text-red-500 border border-l-0 border-red-500 border-opacity-20 hover:bg-opacity-30 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <button className="mt-2 flex items-center text-sm text-primary">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Another Staff Member
                  </button>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                    Save Company Information
                  </button>
                </div>
              </div>
            </div>
            
            {/* Policy Document Management */}
            <div className="lg:w-1/2">
              <h3 className="text-xl font-semibold mb-6">Policy Document Management</h3>
              
              <div className="backdrop-blur-sm bg-card/30 border border-primary/10 rounded-lg p-6 mb-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Upload Policy Document</label>
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-500" />
                    <p className="mt-1 text-sm text-gray-400">Drag and drop your document here, or click to browse</p>
                    <button className="mt-4 px-4 py-2 rounded-md bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors">
                      Select Document
                    </button>
                    <p className="mt-1 text-xs text-gray-500">DOCX, PDF (max. 10MB)</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Policy Type</label>
                  <select className="w-full p-2 rounded-md bg-background border border-gray-700 focus:border-primary transition-colors focus:outline-none">
                    <option>Information Security Policy</option>
                    <option>Acceptable Use Policy</option>
                    <option>Data Protection Policy</option>
                    <option>Incident Response Plan</option>
                    <option>Business Continuity Plan</option>
                    <option>Password Policy</option>
                    <option>Remote Access Policy</option>
                  </select>
                </div>
                
                <div className="flex justify-end">
                  <button className="px-4 py-2 rounded-md bg-gray-700 text-white text-sm font-medium mr-2 hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                  <button className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                    Process Document
                  </button>
                </div>
              </div>
              
              {/* Document List */}
              <div className="backdrop-blur-sm bg-card/30 border border-primary/10 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Automated Policies</h4>
                
                <div className="space-y-3">
                  {[
                    {
                      title: "Information Security Policy",
                      updatedAt: "2 days ago"
                    },
                    {
                      title: "Acceptable Use Policy",
                      updatedAt: "1 week ago"
                    },
                    {
                      title: "Incident Response Plan",
                      updatedAt: "3 weeks ago"
                    }
                  ].map((policy, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-3 hover:bg-background/50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center">
                        <FileText className="w-6 h-6 text-primary mr-3" />
                        <div>
                          <p className="text-sm font-medium">{policy.title}</p>
                          <p className="text-xs text-gray-400">Last updated: {policy.updatedAt}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1.5 rounded-md text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-1.5 rounded-md text-gray-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
