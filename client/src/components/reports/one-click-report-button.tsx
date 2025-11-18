import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Loader2, FileText, Share2, Copy, Check, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";

interface OneClickReportButtonProps {
  assessmentId: number;
  assessmentName: string;
}

export default function OneClickReportButton({
  assessmentId,
  assessmentName,
}: OneClickReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [reportId, setReportId] = useState<number | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Generate a default title based on assessment name and current date
      const title = `Compliance Report - ${assessmentName} - ${new Date().toLocaleDateString()}`;
      const summary = `Comprehensive compliance report for ${assessmentName}`;
      
      // Generate the report with default settings
      const reportRes = await apiRequest("POST", "/api/reports", {
        assessmentId,
        title,
        summary,
        isPublic: false,
        format: "pdf"
      });
      
      if (!reportRes.ok) {
        throw new Error("Failed to generate report");
      }
      
      const reportData = await reportRes.json();
      setReportId(reportData.id);
      
      // Create a share link for the report
      const shareRes = await apiRequest("POST", `/api/reports/${reportData.id}/share`, {});
      
      if (!shareRes.ok) {
        throw new Error("Failed to create share link");
      }
      
      const shareLinkData = await shareRes.json();
      
      // Generate the full shareable URL
      const baseUrl = window.location.origin;
      const fullShareLink = `${baseUrl}/shared-report/${shareLinkData.shareToken}`;
      
      return { report: reportData, shareLink: fullShareLink };
    },
    onSuccess: (data) => {
      setIsGenerating(false);
      setShareLink(data.shareLink);
      setShowDialog(true);
      
      toast({
        title: "Report Generated",
        description: "Your compliance report has been generated with a shareable link.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/reports/assessment", assessmentId] });
    },
    onError: (error: Error) => {
      setIsGenerating(false);
      
      toast({
        title: "Error",
        description: `Failed to generate report: ${error.message}`,
        variant: "destructive",
      });
    },
  });

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

  function handleGenerateReport() {
    generateReportMutation.mutate();
  }

  return (
    <>
      <Button 
        variant="default" 
        className="flex items-center gap-2"
        onClick={handleGenerateReport}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating One-Click Report...
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Generate Report with Link
          </>
        )}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Generated Successfully</DialogTitle>
            <DialogDescription>
              Your compliance report has been generated. Use the shareable link below to share it with others.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="font-medium">Shareable Link</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Input 
                value={shareLink || ""} 
                readOnly 
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => shareLink && copyToClipboard(shareLink)}
              >
                {copySuccess ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <p className="mt-2 text-sm text-muted-foreground">
              This link can be shared with anyone, no login required.
            </p>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            {reportId && (
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                asChild
              >
                <a 
                  href={`/reports/${reportId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Report
                </a>
              </Button>
            )}
            
            {shareLink && (
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                asChild
              >
                <a 
                  href={shareLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Shared Link
                </a>
              </Button>
            )}
            
            <Button 
              variant="default" 
              className="w-full sm:w-auto"
              onClick={() => setShowDialog(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}