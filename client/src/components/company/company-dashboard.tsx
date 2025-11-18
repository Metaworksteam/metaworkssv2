import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileUploader } from '@/components/upload/file-uploader';
import { DirectFileUploader } from '@/components/common/direct-file-uploader';
import { Building2, FileText, Upload, Image, Download, FileIcon, Trash2, Save, Edit, X, Check } from 'lucide-react';
import { format } from 'date-fns';

interface CompanyInfo {
  id: number;
  companyName: string;
  sector?: string;
  size?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  contactEmail?: string;
  contactPhone?: string;
  ceoName?: string;
  cioName?: string;
  ctoName?: string;
  cisoName?: string;
  businessDescription?: string;
  foundedYear?: number;
  employeeCount?: number;
  annualRevenue?: string;
  logoId?: number;
  documentsFileIds?: number[];
  updatedAt?: string;
  updatedBy?: number;
  logoUrl?: string;
}

interface Document {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedAt: string;
  uploadedBy: number;
  fileType: string;
  downloadUrl: string;
}

// Form validation schema
const companyInfoSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  sector: z.string().optional(),
  size: z.string().optional(),
  website: z.string().url('Invalid website URL').optional().or(z.string().length(0)),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  contactEmail: z.string().email('Invalid email address').optional().or(z.string().length(0)),
  contactPhone: z.string().optional(),
  ceoName: z.string().optional(),
  cioName: z.string().optional(),
  ctoName: z.string().optional(),
  cisoName: z.string().optional(),
  businessDescription: z.string().optional(),
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  employeeCount: z.number().int().min(1).optional(),
  annualRevenue: z.string().optional(),
});

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState('general');
  const { toast } = useToast();
  
  // Fetch company information
  const { data: companyInfo, isLoading, isError } = useQuery({
    queryKey: ['/api/company'],
  });
  
  // Fetch company documents
  const { data: documentsData, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ['/api/company/documents'],
    enabled: activeTab === 'documents'
  });
  
  // Form setup
  const form = useForm({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      companyName: '',
      sector: '',
      size: '',
      website: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      contactEmail: '',
      contactPhone: '',
      ceoName: '',
      cioName: '',
      ctoName: '',
      cisoName: '',
      businessDescription: '',
      foundedYear: undefined as number | undefined,
      employeeCount: undefined as number | undefined,
      annualRevenue: '',
    },
    values: companyInfo as any || {},
  });
  
  // Save company information mutation
  const saveCompanyMutation = useMutation({
    mutationFn: async (data: CompanyInfo) => {
      const res = await apiRequest('POST', '/api/company', data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/company'] });
      toast({
        title: "Company information saved",
        description: "Your company information has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving company information",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Upload company logo mutation
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      // Create formData properly
      const formData = new FormData();
      formData.append('logo', file);
      
      // Manual fetch implementation for FormData upload instead of using apiRequest
      const response = await fetch('/api/upload/logo', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Failed to upload logo');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/company'] });
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been uploaded successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error uploading logo",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Upload company document mutation
  const uploadDocumentMutation = useMutation({
    mutationFn: async (file: File) => {
      // Create formData properly
      const formData = new FormData();
      formData.append('document', file);
      
      // Manual fetch implementation for FormData upload
      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Include cookies for authentication
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'Failed to upload document');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/company/documents'] });
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error uploading document",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: number) => {
      const res = await apiRequest('DELETE', `/api/company/documents/${documentId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/company/documents'] });
      toast({
        title: "Document deleted",
        description: "Your document has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting document",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: z.infer<typeof companyInfoSchema>) => {
    saveCompanyMutation.mutate(data as CompanyInfo);
  };
  
  const handleLogoUpload = (files: File[]) => {
    if (files.length > 0) {
      uploadLogoMutation.mutate(files[0]);
    }
  };
  
  const handleDocumentUpload = (files: File[]) => {
    if (files.length > 0) {
      uploadDocumentMutation.mutate(files[0]);
    }
  };
  
  const handleDeleteDocument = (documentId: number) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocumentMutation.mutate(documentId);
    }
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="text-center p-8">
        <div className="text-destructive text-6xl mb-4">
          <X className="mx-auto h-16 w-16" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Failed to load company information</h3>
        <p className="text-muted-foreground mb-4">There was an error loading your company information.</p>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/company'] })}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
          <p className="text-muted-foreground">Manage your company information and documents</p>
        </div>
      </div>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            General Information
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Company Logo */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
                <CardDescription>Upload your company logo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  {companyInfo?.logoUrl ? (
                    <div className="relative h-48 w-48 rounded-md overflow-hidden border border-border">
                      <img 
                        src={companyInfo.logoUrl} 
                        alt={companyInfo.companyName} 
                        className="h-full w-full object-contain" 
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-48 rounded-md bg-muted flex items-center justify-center">
                      <Image className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  
                  <DirectFileUploader
                    endpoint="/api/upload/logo"
                    fieldName="logo"
                    accept="image/*"
                    buttonText="Upload Logo"
                    onFileUploaded={(fileId, filename, url) => {
                      // Update company info with the uploaded logo info
                      queryClient.invalidateQueries({ queryKey: ['/api/company'] });
                      toast({
                        title: "Logo uploaded",
                        description: "Your company logo has been uploaded successfully."
                      });
                    }}
                  />
                  
                  {companyInfo?.logoId && (
                    <div className="text-xs text-muted-foreground">
                      Last updated: {companyInfo.updatedAt ? 
                        format(new Date(companyInfo.updatedAt), 'PPP') : 
                        'Unknown'
                      }
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Company Information Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
                <CardDescription>Manage your company information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Name *</label>
                      <Input 
                        {...form.register('companyName')}
                        placeholder="Enter company name" 
                      />
                      {form.formState.errors.companyName && (
                        <p className="text-xs text-destructive">{form.formState.errors.companyName.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sector</label>
                      <Select 
                        value={form.watch('sector')} 
                        onValueChange={(value) => form.setValue('sector', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="retail">Retail</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company Size</label>
                      <Select 
                        value={form.watch('size')} 
                        onValueChange={(value) => form.setValue('size', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1001-5000">1001-5000 employees</SelectItem>
                          <SelectItem value="5001+">5001+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Website</label>
                      <Input 
                        {...form.register('website')}
                        placeholder="https://example.com" 
                      />
                      {form.formState.errors.website && (
                        <p className="text-xs text-destructive">{form.formState.errors.website.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Email</label>
                      <Input 
                        {...form.register('contactEmail')}
                        placeholder="contact@example.com" 
                      />
                      {form.formState.errors.contactEmail && (
                        <p className="text-xs text-destructive">{form.formState.errors.contactEmail.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Phone</label>
                      <Input 
                        {...form.register('contactPhone')}
                        placeholder="+1 (555) 123-4567" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Founded Year</label>
                      <Input 
                        type="number" 
                        {...form.register('foundedYear', { valueAsNumber: true })}
                        placeholder="Year founded"
                      />
                      {form.formState.errors.foundedYear && (
                        <p className="text-xs text-destructive">{form.formState.errors.foundedYear.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Employee Count</label>
                      <Input 
                        type="number" 
                        {...form.register('employeeCount', { valueAsNumber: true })}
                        placeholder="Number of employees"
                      />
                      {form.formState.errors.employeeCount && (
                        <p className="text-xs text-destructive">{form.formState.errors.employeeCount.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input 
                        {...form.register('address')}
                        placeholder="123 Main St" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">City</label>
                      <Input 
                        {...form.register('city')}
                        placeholder="City" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Country</label>
                      <Input 
                        {...form.register('country')}
                        placeholder="Country" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Postal Code</label>
                      <Input 
                        {...form.register('postalCode')}
                        placeholder="12345" 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CEO Name</label>
                      <Input 
                        {...form.register('ceoName')}
                        placeholder="CEO full name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CIO Name</label>
                      <Input 
                        {...form.register('cioName')}
                        placeholder="CIO full name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CTO Name</label>
                      <Input 
                        {...form.register('ctoName')}
                        placeholder="CTO full name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CISO Name</label>
                      <Input 
                        {...form.register('cisoName')}
                        placeholder="CISO full name" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Description</label>
                    <Textarea 
                      {...form.register('businessDescription')}
                      placeholder="Describe your business"
                      rows={4}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={saveCompanyMutation.isPending}
                    >
                      {saveCompanyMutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⧗</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Company Information
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Company Documents</CardTitle>
              <CardDescription>Manage your company documents and certificates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Upload important documents related to your company for compliance purposes.
                  </p>
                  
                  <DirectFileUploader
                    endpoint="/api/upload/document"
                    fieldName="document"
                    accept=".pdf,.doc,.docx"
                    buttonText="Upload Document"
                    onFileUploaded={(fileId, filename, url) => {
                      // Update documents list
                      queryClient.invalidateQueries({ queryKey: ['/api/company/documents'] });
                      toast({
                        title: "Document uploaded",
                        description: "Your document has been uploaded successfully."
                      });
                    }}
                  />
                </div>
                
                {isLoadingDocuments ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {documentsData?.documents && documentsData.documents.length > 0 ? (
                      <div className="border rounded-md divide-y divide-border">
                        {documentsData.documents.map((doc: Document) => (
                          <div key={doc.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center space-x-4">
                              <div className="rounded-md bg-primary/10 p-2">
                                <FileIcon className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{doc.originalName}</p>
                                <p className="text-xs text-muted-foreground">
                                  {format(new Date(doc.uploadedAt), 'PPP')} • 
                                  {doc.size < 1024 * 1024 
                                    ? ` ${Math.round(doc.size / 1024)} KB` 
                                    : ` ${(doc.size / (1024 * 1024)).toFixed(1)} MB`}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                asChild
                              >
                                <a href={doc.downloadUrl} download>
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </a>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10 border rounded-md">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
                        <p className="text-muted-foreground mb-4">Upload your first document to get started.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}