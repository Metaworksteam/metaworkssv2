import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Clock, Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AssessmentResultItemProps {
  result: {
    id: number;
    assessmentId: number;
    controlId: number;
    status: string;
    evidence?: string;
    recommendation?: string;
    managementResponse?: string;
    targetDate?: string;
    updatedAt: string;
    controlName?: string;
    controlDescription?: string;
    domainName?: string;
    subdomainName?: string;
    controlCode?: string;
    domainCode?: string;
  };
  onUpdate?: () => void;
}

export function AssessmentResultItem({ result, onUpdate }: AssessmentResultItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(result.status);
  const [evidence, setEvidence] = useState(result.evidence || "");
  const [recommendation, setRecommendation] = useState(result.recommendation || "");
  const { toast } = useToast();
  
  const updateMutation = useMutation({
    mutationFn: async (data: {
      status: string;
      evidence: string;
      recommendation: string;
    }) => {
      const response = await apiRequest("PATCH", `/api/assessment-results/${result.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Control Updated",
        description: "Control status has been updated successfully",
      });
      setIsEditing(false);
      if (onUpdate) onUpdate();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to update control",
        description: error.message,
      });
    },
  });
  
  function handleUpdate() {
    updateMutation.mutate({
      status,
      evidence,
      recommendation,
    });
  }
  
  function getStatusIcon(status: string) {
    switch (status) {
      case "implemented":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partially_implemented":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "not_implemented":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  }
  
  function getStatusLabel(status: string) {
    switch (status) {
      case "implemented":
        return "Implemented";
      case "partially_implemented":
        return "Partially Implemented";
      case "not_implemented":
        return "Not Implemented";
      default:
        return "Unknown";
    }
  }
  
  function getStatusColor(status: string) {
    switch (status) {
      case "implemented":
        return "bg-green-500/10 text-green-600 border-green-600/20";
      case "partially_implemented":
        return "bg-amber-500/10 text-amber-600 border-amber-600/20";
      case "not_implemented":
        return "bg-red-500/10 text-red-600 border-red-600/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-600/20";
    }
  }

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(result.status)}
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {result.controlCode ? `${result.controlCode} - ` : ""}
                  {result.controlName || "Unknown Control"}
                </p>
                <Badge className={getStatusColor(result.status)}>
                  {getStatusLabel(result.status)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {result.domainName} {result.subdomainName ? `> ${result.subdomainName}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Control Status</DialogTitle>
                  <DialogDescription>
                    Update the implementation status and provide evidence for this control.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                      Status
                    </Label>
                    <Select
                      value={status}
                      onValueChange={setStatus}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="implemented">Implemented</SelectItem>
                        <SelectItem value="partially_implemented">Partially Implemented</SelectItem>
                        <SelectItem value="not_implemented">Not Implemented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="evidence" className="text-right">
                      Evidence
                    </Label>
                    <Textarea
                      id="evidence"
                      className="col-span-3"
                      placeholder="Provide evidence for this control"
                      value={evidence}
                      onChange={(e) => setEvidence(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recommendation" className="text-right">
                      Recommendation
                    </Label>
                    <Textarea
                      id="recommendation"
                      className="col-span-3"
                      placeholder="Provide a recommendation (if needed)"
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? "Updating..." : "Update"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-0 space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">
                {result.controlDescription || "No description available."}
              </p>
            </div>
            
            {result.evidence && (
              <div>
                <h4 className="text-sm font-medium mb-1">Evidence</h4>
                <p className="text-sm text-muted-foreground">{result.evidence}</p>
              </div>
            )}
            
            {result.recommendation && (
              <div>
                <h4 className="text-sm font-medium mb-1">Recommendation</h4>
                <p className="text-sm text-muted-foreground">{result.recommendation}</p>
              </div>
            )}
            
            {result.managementResponse && (
              <div>
                <h4 className="text-sm font-medium mb-1">Management Response</h4>
                <p className="text-sm text-muted-foreground">{result.managementResponse}</p>
              </div>
            )}
            
            {result.targetDate && (
              <div>
                <h4 className="text-sm font-medium mb-1">Target Date</h4>
                <p className="text-sm text-muted-foreground">
                  {new Date(result.targetDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}