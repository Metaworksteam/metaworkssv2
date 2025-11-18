import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import Sidebar from "@/components/dashboard/sidebar";
import { ContactMessage, DemoRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AdminMessagesPage() {
  const { toast } = useToast();

  // Fetch contact messages
  const { data: contactMessages = [], isLoading: contactLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
  });

  // Fetch demo requests
  const { data: demoRequests = [], isLoading: demosLoading } = useQuery<DemoRequest[]>({
    queryKey: ['/api/book-demo'],
  });

  // Update contact message status
  const updateContactStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest('PATCH', `/api/contact/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Status Updated",
        description: "Contact message status has been updated successfully.",
      });
    },
  });

  // Update demo request status
  const updateDemoStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest('PATCH', `/api/book-demo/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/book-demo'] });
      toast({
        title: "Status Updated",
        description: "Demo request status has been updated successfully.",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { label: "New", variant: "default" as const, icon: Clock },
      read: { label: "Read", variant: "secondary" as const, icon: CheckCircle },
      replied: { label: "Replied", variant: "outline" as const, icon: MessageSquare },
      archived: { label: "Archived", variant: "outline" as const, icon: XCircle },
      contacted: { label: "Contacted", variant: "secondary" as const, icon: CheckCircle },
      scheduled: { label: "Scheduled", variant: "default" as const, icon: Clock },
      completed: { label: "Completed", variant: "outline" as const, icon: CheckCircle },
      cancelled: { label: "Cancelled", variant: "outline" as const, icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title>Customer Messages - MetaWorks Admin</title>
        <meta name="description" content="View and manage customer contact messages and demo requests" />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        <Sidebar />

        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Customer Messages</h1>
                <p className="text-muted-foreground">View and manage contact messages and demo requests</p>
              </div>
            </div>

            <Tabs defaultValue="contact" className="space-y-6">
              <TabsList>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Contact Messages ({contactMessages.length})
                </TabsTrigger>
                <TabsTrigger value="demos" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Demo Requests ({demoRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="contact" className="space-y-4">
                {contactLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Loading contact messages...</p>
                    </CardContent>
                  </Card>
                ) : contactMessages.length === 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">No contact messages yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  contactMessages.map((message) => (
                    <Card key={message.id} data-testid={`contact-message-${message.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{message.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {message.email}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(message.status)}
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(message.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContactStatus.mutate({ id: message.id, status: 'read' })}
                            disabled={message.status === 'read' || updateContactStatus.isPending}
                            data-testid={`button-mark-read-${message.id}`}
                          >
                            Mark as Read
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContactStatus.mutate({ id: message.id, status: 'replied' })}
                            disabled={message.status === 'replied' || updateContactStatus.isPending}
                            data-testid={`button-mark-replied-${message.id}`}
                          >
                            Mark as Replied
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContactStatus.mutate({ id: message.id, status: 'archived' })}
                            disabled={message.status === 'archived' || updateContactStatus.isPending}
                            data-testid={`button-archive-${message.id}`}
                          >
                            Archive
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="demos" className="space-y-4">
                {demosLoading ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">Loading demo requests...</p>
                    </CardContent>
                  </Card>
                ) : demoRequests.length === 0 ? (
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-center text-muted-foreground">No demo requests yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  demoRequests.map((request) => (
                    <Card key={request.id} data-testid={`demo-request-${request.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-lg">{request.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {request.email}
                              {request.company && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span>{request.company}</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(request.status)}
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(request.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {request.message && (
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{request.message}</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDemoStatus.mutate({ id: request.id, status: 'contacted' })}
                            disabled={request.status === 'contacted' || updateDemoStatus.isPending}
                            data-testid={`button-mark-contacted-${request.id}`}
                          >
                            Mark as Contacted
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDemoStatus.mutate({ id: request.id, status: 'scheduled' })}
                            disabled={request.status === 'scheduled' || updateDemoStatus.isPending}
                            data-testid={`button-mark-scheduled-${request.id}`}
                          >
                            Mark as Scheduled
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateDemoStatus.mutate({ id: request.id, status: 'completed' })}
                            disabled={request.status === 'completed' || updateDemoStatus.isPending}
                            data-testid={`button-mark-completed-${request.id}`}
                          >
                            Mark as Completed
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
