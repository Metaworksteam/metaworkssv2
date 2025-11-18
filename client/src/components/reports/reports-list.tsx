import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, FileText, Download, Share2, Copy, Check, Calendar, ExternalLink } from "lucide-react";
import { ComplianceReport, ReportShareLink } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface ReportsListProps {
  assessmentId: number;
}

const createShareLinkSchema = z.object({
  reportId: z.number(),
  expiresAt: z.string().optional(),
  password: z.string().optional(),
  maxViews: z.number().optional(),
});

type CreateShareLinkFormValues = z.infer<typeof createShareLinkSchema>;

export default function ReportsList({ assessmentId }: ReportsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);
  const [shareLinkDialogOpen, setShareLinkDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasExpiry, setHasExpiry] = useState(false);
  const [hasMaxViews, setHasMaxViews] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const { data: reports, isLoading } = useQuery<ComplianceReport[]>({
    queryKey: ["/api/reports/assessment", assessmentId],
    queryFn: async () => {
      const res = await fetch(`/api/reports/assessment/${assessmentId}`);
      if (!res.ok) throw new Error("Failed to load reports");
      return res.json();
    },
  });

  const { data: shareLinks, isLoading: isLoadingShareLinks } = useQuery<ReportShareLink[]>({
    queryKey: ["/api/reports/share", selectedReport?.id],
    queryFn: async () => {
      if (!selectedReport) return [];
      const res = await fetch(`/api/reports/${selectedReport.id}/share`);
      if (!res.ok) throw new Error("Failed to load share links");
      return res.json();
    },
    enabled: !!selectedReport,
  });

  const form = useForm<CreateShareLinkFormValues>({
    resolver: zodResolver(createShareLinkSchema),
    defaultValues: {
      reportId: selectedReport?.id || 0,
      expiresAt: undefined,
      password: undefined,
      maxViews: undefined,
    },
  });

  const createShareLinkMutation = useMutation({
    mutationFn: async (values: CreateShareLinkFormValues) => {
      const reportId = selectedReport?.id;
      if (!reportId) throw new Error("No report selected");
      
      // Format the values properly
      const payload: any = { ...values, reportId };
      
      // Only include expiresAt if hasExpiry is true
      if (!hasExpiry) {
        delete payload.expiresAt;
      }
      
      // Only include maxViews if hasMaxViews is true
      if (!hasMaxViews) {
        delete payload.maxViews;
      }
      
      const res = await apiRequest("POST", `/api/reports/${reportId}/share`, payload);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Share Link Created",
        description: "Your share link has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/share", selectedReport?.id] });
      setShareLinkDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create share link: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deactivateShareLinkMutation = useMutation({
    mutationFn: async (linkId: number) => {
      const res = await apiRequest("POST", `/api/reports/share/${linkId}/deactivate`, {});
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Share Link Deactivated",
        description: "The share link has been deactivated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports/share", selectedReport?.id] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to deactivate share link: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  function onCreateShareLink(data: CreateShareLinkFormValues) {
    createShareLinkMutation.mutate(data);
  }

  function getReportLink(report: ComplianceReport) {
    return `/reports/${report.id}`;
  }

  function getShareLink(token: string, password?: string) {
    const baseUrl = window.location.origin;
    let url = `${baseUrl}/shared-report/${token}`;
    if (password) {
      url += `?password=${password}`;
    }
    return url;
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy link.",
        variant: "destructive",
      });
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Compliance Reports</h2>

      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : reports && reports.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(report.createdAt)}
                </CardDescription>
                <Badge 
                  variant={report.isPublic ? "outline" : "secondary"}
                  className="absolute top-2 right-2"
                >
                  {report.isPublic ? "Public" : "Private"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{report.summary || "No summary provided."}</p>
                
                <div className="mt-3 flex items-center text-xs text-muted-foreground">
                  <Badge variant="outline">{report.format.toUpperCase()}</Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={getReportLink(report)} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-1 h-3 w-3" />
                    View
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedReport(report);
                    setShareLinkDialogOpen(true);
                  }}
                >
                  <Share2 className="mr-1 h-3 w-3" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium">No Reports Yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate a report to see it here.
          </p>
        </div>
      )}

      {/* Share Link Dialog */}
      <Dialog open={shareLinkDialogOpen} onOpenChange={setShareLinkDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Report</DialogTitle>
            <DialogDescription>
              Create a shareable link to this report that can be accessed without logging in.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="create">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create New Link</TabsTrigger>
              <TabsTrigger value="manage">Manage Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onCreateShareLink)} className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Password Protection</FormLabel>
                      <Switch 
                        checked={showPassword} 
                        onCheckedChange={setShowPassword} 
                      />
                    </div>
                    {showPassword && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="text" 
                                placeholder="Enter password" 
                                {...field} 
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormDescription>
                              Viewers will need this password to access the report
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Expiration Date</FormLabel>
                      <Switch 
                        checked={hasExpiry} 
                        onCheckedChange={setHasExpiry} 
                      />
                    </div>
                    {hasExpiry && (
                      <FormField
                        control={form.control}
                        name="expiresAt"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="datetime-local" 
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value)} 
                              />
                            </FormControl>
                            <FormDescription>
                              Link will expire at this date and time
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <FormLabel>Maximum Views</FormLabel>
                      <Switch 
                        checked={hasMaxViews} 
                        onCheckedChange={setHasMaxViews} 
                      />
                    </div>
                    {hasMaxViews && (
                      <FormField
                        control={form.control}
                        name="maxViews"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1"
                                max="100"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                              />
                            </FormControl>
                            <FormDescription>
                              Link will deactivate after this many views
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  <DialogFooter className="pt-4">
                    <Button
                      type="submit"
                      disabled={createShareLinkMutation.isPending}
                      className="w-full"
                    >
                      {createShareLinkMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Share2 className="mr-2 h-4 w-4" />
                          Create Share Link
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="manage">
              {isLoadingShareLinks ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : shareLinks && shareLinks.length > 0 ? (
                <div className="space-y-3">
                  {shareLinks.map((link) => (
                    <div 
                      key={link.id} 
                      className="rounded-md border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            Created {formatDate(link.createdAt)}
                          </span>
                          <div className="mt-1 flex items-center gap-2">
                            {link.isActive ? (
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                Inactive
                              </Badge>
                            )}
                            
                            {link.password && (
                              <Badge variant="outline">
                                Password Protected
                              </Badge>
                            )}
                            
                            {link.expiresAt && (
                              <Badge variant="outline">
                                Expires {formatDate(link.expiresAt)}
                              </Badge>
                            )}
                            
                            {link.maxViews && (
                              <Badge variant="outline">
                                {link.viewCount}/{link.maxViews} Views
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => copyToClipboard(getShareLink(link.shareToken, link.password || undefined))}
                          >
                            {copySuccess ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a 
                              href={`/shared-report/${link.shareToken}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          
                          {link.isActive && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deactivateShareLinkMutation.mutate(link.id)}
                              disabled={deactivateShareLinkMutation.isPending}
                            >
                              {deactivateShareLinkMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Deactivate"
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium">No Share Links</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create a share link to let others view this report.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}