import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RiskBulkImportProps {
  companyId?: number;
  onSuccess?: () => void;
}

interface ImportResult {
  totalProcessed: number;
  successCount: number;
  failureCount: number;
  results: Array<{
    success: boolean;
    risk: any;
    error?: string;
  }>;
}

export default function RiskBulkImport({ companyId, onSuccess }: RiskBulkImportProps) {
  const [jsonData, setJsonData] = useState<string>("");
  const [fileData, setFileData] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const importRisksMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/risks/import", {
        risks: data,
        companyId
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Risks Imported",
        description: `Successfully imported ${data.successCount} out of ${data.totalProcessed} risks.`,
      });
      setImportResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/risks'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "Failed to import risks. Please check your data format.",
      });
    },
  });
  
  const handleJsonImport = () => {
    try {
      const parsedData = JSON.parse(jsonData);
      if (!Array.isArray(parsedData)) {
        toast({
          variant: "destructive",
          title: "Invalid Format",
          description: "The JSON data must be an array of risk objects.",
        });
        return;
      }
      
      importRisksMutation.mutate(parsedData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Invalid JSON",
        description: "Please provide valid JSON data.",
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileData(e.target.files[0]);
    }
  };
  
  const handleFileUpload = async () => {
    if (!fileData) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select a file to upload.",
      });
      return;
    }
    
    try {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        try {
          const result = e.target?.result as string;
          const parsedData = JSON.parse(result);
          if (!Array.isArray(parsedData)) {
            toast({
              variant: "destructive",
              title: "Invalid File Format",
              description: "The file must contain a JSON array of risk objects.",
            });
            return;
          }
          
          importRisksMutation.mutate(parsedData);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Invalid File Content",
            description: "The file does not contain valid JSON data.",
          });
        }
      };
      fileReader.readAsText(fileData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "File Reading Error",
        description: "Failed to read the file.",
      });
    }
  };
  
  const clearData = () => {
    setJsonData("");
    setFileData(null);
    setImportResult(null);
  };
  
  const preloadSampleData = () => {
    // Sample data structure for the first few risks from the dataset
    const sampleData = [
      {
        "title": "Absence of IT Strategy",
        "description": "Unclear IT governance for business goals.",
        "cause": "Lack of cybersecurity strategy.",
        "category": "Strategic",
        "owner": "IT Department",
        "likelihood": "Very Likely",
        "impact": "Major",
        "inherentRiskLevel": "High",
        "existingControls": "None",
        "controlEffectiveness": "None",
        "residualRiskLevel": "High",
        "mitigationActions": "Develop IT strategy and roadmap.",
        "isAccepted": false
      },
      {
        "title": "No Periodic IT Policy Reviews",
        "description": "Outdated policies lead to inefficiencies.",
        "cause": "No review process.",
        "category": "Strategic",
        "owner": "IT Department",
        "likelihood": "Very Likely",
        "impact": "Major",
        "inherentRiskLevel": "High",
        "existingControls": "Last reviewed in 2020.",
        "controlEffectiveness": "None",
        "residualRiskLevel": "High",
        "mitigationActions": "Regular policy updates.",
        "isAccepted": false
      },
      {
        "title": "Missing IT Steering Committee",
        "description": "No oversight for IT operations.",
        "cause": "No committee/charter.",
        "category": "Strategic",
        "owner": "IT Department",
        "likelihood": "Very Likely",
        "impact": "Major",
        "inherentRiskLevel": "High",
        "existingControls": "None",
        "controlEffectiveness": "None",
        "residualRiskLevel": "High",
        "mitigationActions": "Establish committee and charter.",
        "isAccepted": false
      }
    ];
    
    setJsonData(JSON.stringify(sampleData, null, 2));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bulk Import Risks</CardTitle>
        <CardDescription>
          Import multiple risks at once using JSON format or a file upload
        </CardDescription>
      </CardHeader>
      <CardContent>
        {importResult ? (
          <div className="space-y-4">
            <Alert variant={importResult.failureCount > 0 ? "destructive" : "default"}>
              <AlertTitle>Import Results</AlertTitle>
              <AlertDescription>
                Successfully imported {importResult.successCount} out of {importResult.totalProcessed} risks.
                {importResult.failureCount > 0 && (
                  <p className="mt-2">Failed to import {importResult.failureCount} risks. See details below.</p>
                )}
              </AlertDescription>
            </Alert>
            
            {importResult.failureCount > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Failed Imports:</h4>
                <div className="max-h-60 overflow-auto border rounded-md p-4">
                  {importResult.results
                    .filter(r => !r.success)
                    .map((result, idx) => (
                      <div key={idx} className="mb-2 pb-2 border-b last:border-0">
                        <p className="text-destructive font-medium">{result.risk.title || 'Unknown Risk'}</p>
                        <p className="text-sm">{result.error}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            <Button onClick={clearData} variant="outline" className="mt-4">
              Import More Risks
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="json">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="json" className="flex-1">JSON Input</TabsTrigger>
              <TabsTrigger value="file" className="flex-1">File Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="json" className="space-y-4">
              <Textarea 
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Paste JSON array of risk objects here..."
                className="min-h-[300px] font-mono text-xs"
              />
              <div className="flex justify-between">
                <Button onClick={preloadSampleData} variant="outline" size="sm">
                  Load Sample Data
                </Button>
                <Button 
                  onClick={handleJsonImport}
                  disabled={!jsonData || importRisksMutation.isPending}
                >
                  {importRisksMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import Risks'
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center min-h-[200px]">
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a JSON file containing an array of risk objects
                </p>
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleFileChange}
                  className="text-sm"
                />
                {fileData && (
                  <p className="text-sm mt-2">
                    Selected file: {fileData.name}
                  </p>
                )}
              </div>
              <Button 
                onClick={handleFileUpload} 
                disabled={!fileData || importRisksMutation.isPending}
                className="w-full"
              >
                {importRisksMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Upload and Import'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> Each risk object must include title, description, category, likelihood, impact, and inherentRiskLevel fields at minimum.
        </p>
      </CardFooter>
    </Card>
  );
}