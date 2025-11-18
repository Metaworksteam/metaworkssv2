import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, FileText, Plus, Download, Filter, Settings, Calendar, Clock, Check, X, Pencil, Trash2, Upload, Loader2, AlertCircle } from "lucide-react";
import { DirectFileUploader } from "@/components/common/direct-file-uploader";
import { Policy } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Define policy type for the component
interface PolicyWithDetails extends Policy {
  // Add fields that are used in the UI but might not be in the schema
  category?: string;
  version?: string;
  status?: string;
  author?: string;
  approver?: string;
  reviewDate?: string;
  documentUrl?: string; // URL to download the attached document
}

// Status mapping for display
const statusMap: Record<string, string> = {
  active: "Active",
  draft: "Draft",
  review: "Under Review",
  archived: "Archived"
};

// PolicyForm component for adding/editing policies
function PolicyForm({ onCancel }: { onCancel: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  
  // Status options for the dropdown
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "review", label: "Under Review" },
  ];
  
  // Category options
  const categoryOptions = [
    { value: "security", label: "Security" },
    { value: "data", label: "Data" },
    { value: "compliance", label: "Compliance" },
    { value: "general", label: "General" },
  ];

  // Form state
  const [formState, setFormState] = useState({
    title: "",
    type: categoryOptions[0].value,
    content: "",
    version: "1.0",
    author: user?.username || "",
    approver: "",
    status: statusOptions[0].value,
    reviewDate: "",
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  // Create policy mutation
  const createPolicyMutation = useMutation({
    mutationFn: async (policyData: Partial<PolicyWithDetails>) => {
      const res = await apiRequest("POST", "/api/policies", policyData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Policy created",
        description: "Your policy has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/policies'] });
      onCancel();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create policy",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.title) {
      toast({
        title: "Missing information",
        description: "Please enter a policy name.",
        variant: "destructive",
      });
      return;
    }
    
    // Since file uploads are now handled by DirectFileUploader which triggers the mutation,
    // we only need to handle when there's no file.
    if (!file) {
      // Create policy without file
      createPolicyMutation.mutate(formState);
    }
    // Otherwise the DirectFileUploader will handle the upload and call the mutation
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Policy Name</Label>
          <Input 
            id="title" 
            placeholder="Enter policy name" 
            value={formState.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Category</Label>
          <select
            id="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formState.type}
            onChange={handleInputChange}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <Textarea 
          id="content" 
          placeholder="Enter policy description" 
          rows={4} 
          value={formState.content}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input 
            id="version" 
            placeholder="e.g., 1.0" 
            value={formState.version}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input 
            id="author" 
            placeholder="Enter author name" 
            value={formState.author}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="approver">Approver</Label>
          <Input 
            id="approver" 
            placeholder="Enter approver name" 
            value={formState.approver}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formState.status}
            onChange={handleInputChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewDate">Next Review Date</Label>
          <Input 
            id="reviewDate" 
            type="date" 
            value={formState.reviewDate}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="document">Upload Policy Document</Label>
        <DirectFileUploader
          endpoint="/api/upload/document"
          fieldName="document"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          buttonText="Upload Policy Document"
          onFileUploaded={(fileId, filename, url) => {
            // Store file info to be submitted with form
            setFile(null);
            // Update policy with file information
            createPolicyMutation.mutate({ 
              ...formState,
              fileId: fileId,
              documentUrl: url
            });
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supported file types: PDF, DOCX (Max size: 10MB)
        </p>
      </div>
      
      {file && (
        <div className="flex items-center gap-2 p-2 border rounded">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          type="submit" 
          disabled={createPolicyMutation.isPending}
        >
          {createPolicyMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Policy'
          )}
        </Button>
      </div>
    </form>
  );
}

// PolicyEditForm component for editing policies
function PolicyEditForm({ policy, onCancel }: { policy: PolicyWithDetails; onCancel: () => void }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  
  // Status options for the dropdown
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "active", label: "Active" },
    { value: "review", label: "Under Review" },
  ];
  
  // Category options
  const categoryOptions = [
    { value: "security", label: "Security" },
    { value: "data", label: "Data" },
    { value: "compliance", label: "Compliance" },
    { value: "general", label: "General" },
  ];

  // Form state
  const [formState, setFormState] = useState({
    title: policy.title || "",
    type: policy.type || categoryOptions[0].value,
    content: policy.content || "",
    version: policy.version || "1.0",
    author: policy.author || user?.username || "",
    approver: policy.approver || "",
    status: policy.status?.toLowerCase() || statusOptions[0].value,
    reviewDate: policy.reviewDate ? new Date(policy.reviewDate).toISOString().split('T')[0] : "",
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  // File change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  // Update policy mutation
  const updatePolicyMutation = useMutation({
    mutationFn: async (policyData: Partial<PolicyWithDetails>) => {
      const res = await apiRequest("PUT", `/api/policies/${policy.id}`, policyData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Policy updated",
        description: "Your policy has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/policies'] });
      onCancel();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update policy",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formState.title) {
      toast({
        title: "Missing information",
        description: "Please enter a policy name.",
        variant: "destructive",
      });
      return;
    }
    
    // Since file uploads are now handled by DirectFileUploader which triggers the mutation,
    // we only need to handle when there's no file.
    if (!file) {
      // Update policy without file
      updatePolicyMutation.mutate(formState);
    }
    // Otherwise the DirectFileUploader will handle the upload and call the mutation
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Policy Name</Label>
          <Input 
            id="title" 
            placeholder="Enter policy name" 
            value={formState.title}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Category</Label>
          <select
            id="type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formState.type}
            onChange={handleInputChange}
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Description</Label>
        <Textarea 
          id="content" 
          placeholder="Enter policy description" 
          rows={4} 
          value={formState.content}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="version">Version</Label>
          <Input 
            id="version" 
            placeholder="e.g., 1.0" 
            value={formState.version}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input 
            id="author" 
            placeholder="Enter author name" 
            value={formState.author}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="approver">Approver</Label>
          <Input 
            id="approver" 
            placeholder="Enter approver name" 
            value={formState.approver}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formState.status}
            onChange={handleInputChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reviewDate">Next Review Date</Label>
          <Input 
            id="reviewDate" 
            type="date" 
            value={formState.reviewDate}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="document">Upload New Document</Label>
        <DirectFileUploader
          endpoint="/api/upload/document"
          fieldName="document"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          buttonText="Upload New Document"
          onFileUploaded={(fileId, filename, url) => {
            // Store file info to be submitted with form
            setFile(null);
            // Update policy with file information
            updatePolicyMutation.mutate({ 
              ...formState,
              fileId: fileId,
              documentUrl: url
            });
          }}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supported file types: PDF, DOCX (Max size: 10MB)
        </p>
      </div>
      
      {file && (
        <div className="flex items-center gap-2 p-2 border rounded">
          <FileText className="h-5 w-5 text-primary" />
          <span className="text-sm truncate">{file.name}</span>
          <span className="text-xs text-muted-foreground ml-auto">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button 
          type="submit" 
          disabled={updatePolicyMutation.isPending}
        >
          {updatePolicyMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Policy'
          )}
        </Button>
      </div>
    </form>
  );
}

export default function PolicyManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [showEditPolicy, setShowEditPolicy] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyWithDetails | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingPolicy, setDeletingPolicy] = useState<PolicyWithDetails | null>(null);
  
  // Fetch policies from the API
  const { data: policiesData, isLoading, error } = useQuery<PolicyWithDetails[]>({
    queryKey: ['/api/policies'],
  });
  
  // Convert policies to the needed format with proper date formatting
  const policies = policiesData?.map(policy => ({
    ...policy,
    name: policy.title || 'Untitled Policy',
    category: policy.type || 'General',
    version: policy.version || '1.0',
    status: policy.status || 'Draft',
    lastUpdated: new Date(policy.updatedAt).toLocaleDateString(),
    reviewDate: policy.reviewDate || 'N/A',
    description: policy.content || 'No description provided.',
    // Use the documentUrl property provided by the API
    documentUrl: policy.documentUrl || undefined
  })) || [];
  
  // Delete policy mutation
  const deletePolicyMutation = useMutation({
    mutationFn: async (policyId: number) => {
      const res = await apiRequest("DELETE", `/api/policies/${policyId}`);
      return res.ok;
    },
    onSuccess: () => {
      toast({
        title: "Policy deleted",
        description: "Policy has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/policies'] });
      setShowDeleteConfirmation(false);
      setDeletingPolicy(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete policy",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Filter policies based on active tab
  const filteredPolicies = activeTab === "all" 
    ? policies 
    : activeTab === "active" 
      ? policies.filter(p => p.status.toLowerCase() === "active")
      : activeTab === "draft" 
        ? policies.filter(p => p.status.toLowerCase() === "draft")
        : policies.filter(p => p.status.toLowerCase() === "under review");
        
  // Loading state
  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Policy Management | MetaWorks</title>
        </Helmet>
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-primary mb-8">Policy Management</h1>
            
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardContent className="flex justify-center items-center py-16">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                  <h3 className="text-lg font-medium mb-2">Loading Policies</h3>
                  <p className="text-muted-foreground">Please wait while we fetch your policy documents...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }
  
  // Error state
  if (error) {
    return (
      <>
        <Helmet>
          <title>Policy Management | MetaWorks</title>
        </Helmet>
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-primary mb-8">Policy Management</h1>
            
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardContent className="flex justify-center items-center py-16">
                <div className="text-center">
                  <AlertCircle className="h-10 w-10 mx-auto mb-4 text-destructive" />
                  <h3 className="text-lg font-medium mb-2">Error Loading Policies</h3>
                  <p className="text-muted-foreground mb-4">There was a problem loading your policy documents.</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Policy Management | MetaWorks</title>
      </Helmet>
      
      {/* Edit Policy Dialog */}
      <Dialog open={showEditPolicy} onOpenChange={setShowEditPolicy}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>
              Update the policy details
            </DialogDescription>
          </DialogHeader>
          {editingPolicy && (
            <PolicyEditForm 
              policy={editingPolicy} 
              onCancel={() => {
                setShowEditPolicy(false);
                setEditingPolicy(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the policy
              {deletingPolicy?.title && <span className="font-medium"> "{deletingPolicy.title}"</span>}
              {deletingPolicy?.fileId && " and any associated document files"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingPolicy(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deletingPolicy) {
                  deletePolicyMutation.mutate(deletingPolicy.id);
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
              disabled={deletePolicyMutation.isPending}
            >
              {deletePolicyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-primary">Policy Management</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Dialog open={showAddPolicy} onOpenChange={setShowAddPolicy}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Add Policy</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Add New Policy</DialogTitle>
                    <DialogDescription>
                      Create a new policy document for your organization
                    </DialogDescription>
                  </DialogHeader>
                  <PolicyForm onCancel={() => setShowAddPolicy(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Policy Documents</CardTitle>
                  <CardDescription>
                    Manage your organization's policies and compliance documents
                  </CardDescription>
                </div>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="draft">Draft</TabsTrigger>
                    <TabsTrigger value="review">Under Review</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Policy Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Review Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolicies.map(policy => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-primary" />
                            {policy.title || policy.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {policy.description.length > 80 
                              ? policy.description.substring(0, 80) + "..."
                              : policy.description}
                          </div>
                        </TableCell>
                        <TableCell>{policy.category}</TableCell>
                        <TableCell>{policy.version}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              policy.status === "Active" ? "bg-green-500/20 text-green-500 border-green-500/20" : 
                              policy.status === "Draft" ? "bg-blue-500/20 text-blue-500 border-blue-500/20" : 
                              "bg-amber-500/20 text-amber-500 border-amber-500/20"
                            } border`}
                          >
                            {policy.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                            {policy.lastUpdated}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            {policy.reviewDate}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            {policy.documentUrl ? (
                              <>
                                <a 
                                  href={policy.documentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  title="View document"
                                >
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </a>
                                <a 
                                  href={policy.documentUrl} 
                                  download={`${policy.title.replace(/\s+/g, '_')}.pdf`}
                                  title="Download document"
                                >
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </a>
                              </>
                            ) : (
                              <Button variant="ghost" size="icon" className="h-8 w-8" disabled title="No document attached">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => {
                                // Pre-fill form with policy data
                                setEditingPolicy(policy);
                                setShowEditPolicy(true);
                              }}
                              title="Edit policy"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                // Show delete confirmation
                                setDeletingPolicy(policy);
                                setShowDeleteConfirmation(true);
                              }}
                              title="Delete policy"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPolicies.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No policies found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredPolicies.length} of {policies.length} policies
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    // Generate CSV data
                    const headers = ["Policy Name", "Category", "Version", "Status", "Last Updated", "Review Date"];
                    const csvData = [
                      headers.join(","),
                      ...policies.map(policy => [
                        `"${policy.title || policy.name}"`,
                        `"${policy.category}"`,
                        `"${policy.version}"`,
                        `"${policy.status}"`,
                        `"${policy.lastUpdated}"`,
                        `"${policy.reviewDate}"`
                      ].join(","))
                    ].join("\n");
                    
                    // Create a blob and download link
                    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", "policy_export.csv");
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Policy Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Active Policies</span>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/20 border">
                      {policies.filter(p => p.status.toLowerCase() === "active").length} / {policies.length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Draft Policies</span>
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20 border">
                      {policies.filter(p => p.status.toLowerCase() === "draft").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Under Review</span>
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20 border">
                      {policies.filter(p => p.status.toLowerCase() === "review").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Policies</span>
                    <Badge className="bg-primary/20 text-primary border-primary/20 border">
                      {policies.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-green-500/20 text-green-500">
                      <Check className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Acceptable Use Policy approved</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-blue-500/20 text-blue-500">
                      <Pencil className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Access Control Policy updated</p>
                      <p className="text-xs text-muted-foreground">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="p-1 rounded-full bg-amber-500/20 text-amber-500">
                      <Clock className="h-3 w-3" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Data Protection Policy due for review</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">Policy Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Information Security Policy Template</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Data Protection Policy Template</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Access Control Policy Template</span>
                  </div>
                  <div className="flex items-center p-2 rounded-md hover:bg-primary/5 cursor-pointer transition-colors">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    <span>Incident Response Policy Template</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}