import React from "react";
import { useQuery, QueryFunction, QueryKey } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Loader2, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { queryClient } from "@/lib/queryClient";

// Policy types badge styles
const policyTypeBadges: Record<string, string> = {
  information_security: "bg-blue-500/20 text-blue-700 border-blue-300",
  acceptable_use: "bg-green-500/20 text-green-700 border-green-300",
  data_protection: "bg-purple-500/20 text-purple-700 border-purple-300",
  incident_response: "bg-red-500/20 text-red-700 border-red-300",
  business_continuity: "bg-amber-500/20 text-amber-700 border-amber-300",
  password: "bg-indigo-500/20 text-indigo-700 border-indigo-300",
  remote_access: "bg-cyan-500/20 text-cyan-700 border-cyan-300",
};

// Policy type labels
const policyTypeLabels: Record<string, string> = {
  information_security: "Information Security",
  acceptable_use: "Acceptable Use",
  data_protection: "Data Protection",
  incident_response: "Incident Response",
  business_continuity: "Business Continuity",
  password: "Password Policy",
  remote_access: "Remote Access",
};

type Policy = {
  id: number;
  title: string;
  type: string;
  content: string | null;
  fileId: number | null;
  createdAt: string;
  updatedAt: string;
  documentUrl?: string | null;
};

export default function PolicyList() {
  // Custom query function
  const customQueryFn: QueryFunction<Policy[], QueryKey> = async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || res.statusText);
    }

    return res.json();
  };

  // Fetch policies
  const { data: policies, isLoading, error } = useQuery<Policy[]>({
    queryKey: ["/api/policies"],
    queryFn: customQueryFn,
  });

  if (isLoading) {
    return (
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle>Policy Documents</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Loading policies...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle>Policy Documents</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="mt-2 font-medium">Error loading policies</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!policies || policies.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <CardTitle>Policy Documents</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <div className="flex flex-col items-center text-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <p className="mt-2 font-medium">No policies found</p>
            <p className="text-sm text-muted-foreground">
              Upload your first policy document to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
      <CardHeader>
        <CardTitle>Policy Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Document</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={policyTypeBadges[policy.type] || ""}
                  >
                    {policyTypeLabels[policy.type] || policy.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(policy.updatedAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {policy.documentUrl ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="text-primary hover:text-primary/80"
                    >
                      <a href={policy.documentUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">No document</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

