import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Check, Loader2, Sparkles, PenLine, List, UploadCloud } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DocumentUpload from "./document-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

// Policy upload form schema
const policyUploadSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.string().min(1, "Please select a policy type"),
  content: z.string().optional(),
});

// AI policy generation schema
const aiGenerationSchema = z.object({
  policyType: z.string().min(1, "Please select a policy type"),
  organization: z.string().min(2, "Organization name is required"),
  industry: z.string().min(1, "Please select your industry"),
  companySize: z.string().min(1, "Please select your company size"),
  includeRegulatory: z.boolean().default(false),
  regulations: z.array(z.string()).optional(),
});

type PolicyUploadValues = z.infer<typeof policyUploadSchema>;
type AIGenerationValues = z.infer<typeof aiGenerationSchema>;

// Template options for predefined policy templates
const policyTemplates = [
  {
    id: "is-basic",
    name: "Basic Information Security Policy",
    description: "A fundamental policy covering essential security controls",
    type: "information_security",
  },
  {
    id: "is-comprehensive",
    name: "Comprehensive Information Security Policy",
    description: "Detailed policy aligned with ISO 27001 standards",
    type: "information_security",
  },
  {
    id: "password-standard",
    name: "Password Policy",
    description: "Standard password requirements and management",
    type: "password",
  },
  {
    id: "acceptable-use-basic",
    name: "Acceptable Use Policy",
    description: "Basic guidelines for appropriate use of IT resources",
    type: "acceptable_use",
  },
  {
    id: "data-protection-standard",
    name: "Data Protection Policy",
    description: "Standard controls for protecting sensitive data",
    type: "data_protection",
  },
];

export default function PolicyUpload() {
  const [fileId, setFileId] = useState<number | null>(null);
  const [mode, setMode] = useState<string>("upload");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generatingPolicy, setGeneratingPolicy] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<PolicyUploadValues>({
    resolver: zodResolver(policyUploadSchema),
    defaultValues: {
      title: "",
      type: "",
      content: "",
    },
  });
  
  const aiForm = useForm<AIGenerationValues>({
    resolver: zodResolver(aiGenerationSchema),
    defaultValues: {
      policyType: "",
      organization: "",
      industry: "",
      companySize: "",
      includeRegulatory: false,
      regulations: [],
    },
  });

  // Create policy mutation
  const policyMutation = useMutation({
    mutationFn: async (data: PolicyUploadValues) => {
      // Include fileId with policy data if a document was uploaded
      const policyData = fileId ? { ...data, fileId } : data;
      const res = await apiRequest("POST", "/api/policies", policyData);
      return res.json();
    },
    onSuccess: async (policy) => {
      toast({
        title: "Policy created",
        description: fileId 
          ? "Your policy has been created successfully with the attached document." 
          : "Your policy has been created successfully.",
      });
      
      // Reset the form
      form.reset();
      setFileId(null);
      
      // Invalidate policies query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating policy",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PolicyUploadValues) => {
    policyMutation.mutate(data);
  };
  
  const handleDocumentUploaded = (uploadedFileId: number) => {
    setFileId(uploadedFileId);
    toast({
      title: "Document ready",
      description: "Document uploaded and ready to be attached to the policy.",
    });
  };

  // Generate AI policy function
  const generateAIPolicy = async (data: AIGenerationValues) => {
    setGeneratingPolicy(true);
    
    try {
      // In a real application, this would call the backend API
      // to generate the policy using AI
      const response = await fetch('/api/policies/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate policy');
      }
      
      const generatedPolicy = await response.json();
      
      // Populate the main form with the generated content
      form.setValue('title', `${data.organization} ${data.policyType.replace('_', ' ')} Policy`);
      form.setValue('type', data.policyType);
      form.setValue('content', generatedPolicy.content);
      
      // Switch to the upload tab to review and save
      setMode('upload');
      
      toast({
        title: "Policy Generated",
        description: "Your policy has been generated. Please review and save it.",
      });
    } catch (error) {
      console.error("Error generating policy:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Could not generate policy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPolicy(false);
    }
  };
  
  // Use template function
  const useTemplate = (templateId: string) => {
    const template = policyTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      form.setValue('type', template.type);
      form.setValue('title', template.name);
      
      // In a real application, you would fetch the template content
      // from the backend
      fetch(`/api/policies/templates/${templateId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Template not found');
          }
          return res.json();
        })
        .then(data => {
          form.setValue('content', data.content);
          setMode('upload');
          toast({
            title: "Template Applied",
            description: "Template has been applied. You can now customize and save it.",
          });
        })
        .catch(error => {
          // Fallback content if template fetch fails - in production this would be handled properly
          form.setValue('content', `# ${template.name}\n\n${template.description}\n\nThis is a placeholder for the template content. In production, this would be fetched from the server.`);
          setMode('upload');
          toast({
            title: "Template Applied",
            description: "A template outline has been applied. Please customize it before saving.",
          });
        });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle>Policy Management</CardTitle>
          <CardDescription>
            Create, generate, or upload policy documents for your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" value={mode} onValueChange={setMode}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                Upload & Create
              </TabsTrigger>
              <TabsTrigger value="template" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Use Template
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Generate
              </TabsTrigger>
            </TabsList>
            
            {/* Upload & Create Tab */}
            <TabsContent value="upload">
              <div className="space-y-6">
                {/* Document Upload Component */}
                <DocumentUpload 
                  onUploadComplete={handleDocumentUploaded}
                  title="Policy Document Upload (Optional)"
                />
                
                {/* Policy Details Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {fileId && (
                      <div className="bg-primary/10 border border-primary/20 rounded-md p-3 flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium">Document uploaded and ready to attach</span>
                        <Check className="h-4 w-4 text-green-500 ml-auto" />
                      </div>
                    )}
                  
                    {/* Policy Title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Information Security Policy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Policy Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a policy type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="information_security">Information Security Policy</SelectItem>
                              <SelectItem value="acceptable_use">Acceptable Use Policy</SelectItem>
                              <SelectItem value="data_protection">Data Protection Policy</SelectItem>
                              <SelectItem value="incident_response">Incident Response Plan</SelectItem>
                              <SelectItem value="business_continuity">Business Continuity Plan</SelectItem>
                              <SelectItem value="password">Password Policy</SelectItem>
                              <SelectItem value="remote_access">Remote Access Policy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Policy Content (Optional if document is uploaded) */}
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Content {fileId ? "(Optional)" : ""}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter policy text content here (optional if document is uploaded)"
                              className="min-h-[200px]"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => form.reset()}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={policyMutation.isPending}
                      >
                        {policyMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Create Policy
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
            
            {/* Template Tab */}
            <TabsContent value="template">
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <List className="h-5 w-5 text-primary" />
                    Policy Templates
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a pre-defined policy template to get started quickly. You can customize the content after selecting.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <RadioGroup value={selectedTemplate || ""} onValueChange={setSelectedTemplate}>
                    {policyTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`flex items-start space-x-2 p-3 rounded-md border transition-colors ${
                          selectedTemplate === template.id ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <RadioGroupItem value={template.id} id={`template-${template.id}`} />
                        <label
                          htmlFor={`template-${template.id}`}
                          className="flex flex-1 flex-col cursor-pointer"
                        >
                          <span className="font-medium">{template.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {template.description}
                          </span>
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="flex justify-end space-x-2 mt-6">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => setSelectedTemplate(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    disabled={!selectedTemplate}
                    onClick={() => selectedTemplate && useTemplate(selectedTemplate)}
                  >
                    <PenLine className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            {/* AI Generate Tab */}
            <TabsContent value="ai">
              <div className="space-y-6">
                <div className="bg-primary/5 rounded-lg p-4 mb-6 border border-primary/10">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    AI Policy Generator
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Generate a customized policy document based on your organization's specific needs and context.
                  </p>
                </div>
                
                <Form {...aiForm}>
                  <form onSubmit={aiForm.handleSubmit(generateAIPolicy)} className="space-y-6">
                    {/* Policy Type */}
                    <FormField
                      control={aiForm.control}
                      name="policyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a policy type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="information_security">Information Security Policy</SelectItem>
                              <SelectItem value="acceptable_use">Acceptable Use Policy</SelectItem>
                              <SelectItem value="data_protection">Data Protection Policy</SelectItem>
                              <SelectItem value="incident_response">Incident Response Plan</SelectItem>
                              <SelectItem value="password">Password Policy</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Organization Name */}
                    <FormField
                      control={aiForm.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your company name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Industry */}
                    <FormField
                      control={aiForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="financial">Financial Services</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="tech">Technology</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Company Size */}
                    <FormField
                      control={aiForm.control}
                      name="companySize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Size</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="small">Small (1-50 employees)</SelectItem>
                              <SelectItem value="medium">Medium (51-500 employees)</SelectItem>
                              <SelectItem value="large">Large (501+ employees)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Include Regulatory Requirements */}
                    <FormField
                      control={aiForm.control}
                      name="includeRegulatory"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Regulatory Compliance</FormLabel>
                            <FormDescription>
                              Include regulatory compliance requirements
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => aiForm.reset()}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={generatingPolicy}
                      >
                        {generatingPolicy ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Policy
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
