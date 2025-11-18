import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X, Plus, Upload } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import LogoUpload from "./logo-upload";

// Company info form schema
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  ceoName: z.string().optional(),
  cioName: z.string().optional(),
  ctoName: z.string().optional(),
  cisoName: z.string().optional(),
  cybersecurityStaff: z.array(z.string()),
});

type CompanyFormValues = z.infer<typeof companyFormSchema>;

export default function CompanyInfoForm() {
  const [staffMembers, setStaffMembers] = React.useState<string[]>(['', '']);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch existing company data
  const { data: companyData, isLoading } = useQuery({
    queryKey: ["/api/company-info"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      ceoName: "",
      cioName: "",
      ctoName: "",
      cisoName: "",
      cybersecurityStaff: ['', ''],
    },
  });
  
  // Update form with existing data when fetched
  useEffect(() => {
    if (companyData) {
      form.reset({
        companyName: companyData.companyName || "",
        ceoName: companyData.ceoName || "",
        cioName: companyData.cioName || "",
        ctoName: companyData.ctoName || "",
        cisoName: companyData.cisoName || "",
        cybersecurityStaff: companyData.cybersecurityStaff?.length 
          ? companyData.cybersecurityStaff 
          : ['', ''],
      });
      
      setStaffMembers(companyData.cybersecurityStaff?.length 
        ? companyData.cybersecurityStaff 
        : ['', '']);
    }
  }, [companyData, form]);
  
  // Save company info mutation
  const saveMutation = useMutation({
    mutationFn: async (data: CompanyFormValues) => {
      const res = await apiRequest("POST", "/api/company-info", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Company info saved",
        description: "Your company information has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company-info"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving company info",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CompanyFormValues) => {
    // Filter out empty staff members
    data.cybersecurityStaff = data.cybersecurityStaff.filter(staff => staff.trim() !== '');
    saveMutation.mutate(data);
  };
  
  const addStaffMember = () => {
    const newStaffMembers = [...staffMembers, ''];
    setStaffMembers(newStaffMembers);
    form.setValue('cybersecurityStaff', newStaffMembers);
  };
  
  const removeStaffMember = (index: number) => {
    const newStaffMembers = staffMembers.filter((_, i) => i !== index);
    setStaffMembers(newStaffMembers);
    form.setValue('cybersecurityStaff', newStaffMembers);
  };
  
  const updateStaffMember = (index: number, value: string) => {
    const newStaffMembers = [...staffMembers];
    newStaffMembers[index] = value;
    setStaffMembers(newStaffMembers);
    form.setValue('cybersecurityStaff', newStaffMembers);
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload Component */}
      <LogoUpload />
      
      {/* Company Details Form */}
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Executive Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="ceoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cioName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CIO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Sarah Johnson" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ctoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CTO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Michael Brown" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cisoName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CISO Name</FormLabel>
                      <FormControl>
                        <Input placeholder="David Chen" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Cybersecurity Staff */}
              <div className="mb-6">
                <FormLabel className="block text-sm font-medium mb-2">Cybersecurity Staff</FormLabel>
                <div className="space-y-2">
                  {staffMembers.map((member, index) => (
                    <div key={index} className="flex items-center">
                      <Input
                        value={member}
                        onChange={(e) => updateStaffMember(index, e.target.value)}
                        placeholder="Staff Member Name"
                        className="flex-1 rounded-r-none"
                      />
                      <Button
                        type="button"
                        onClick={() => removeStaffMember(index)}
                        variant="destructive"
                        size="icon"
                        className="rounded-l-none h-10 w-10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                <Button
                  type="button"
                  onClick={addStaffMember}
                  variant="ghost"
                  className="mt-2 text-sm text-primary hover:bg-primary/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Staff Member
                </Button>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Saving..." : "Save Company Information"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function for query
function getQueryFn<T>({ on401 }: { on401: "returnNull" | "throw" }) {
  return async ({ queryKey }: { queryKey: (string | number)[] }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (on401 === "returnNull" && res.status === 401) {
      return null;
    }

    if (!res.ok) {
      const text = (await res.text()) || res.statusText;
      throw new Error(`${res.status}: ${text}`);
    }

    return await res.json() as T;
  };
}
