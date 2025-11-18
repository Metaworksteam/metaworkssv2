import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RiskHeatmap, { RiskHeatmapComponent } from "@/components/risks/risk-heatmap";
import { RiskStatusChart } from "@/components/risks/risk-status-chart";
import { FileText, AlertTriangle, CheckCircle } from "lucide-react";

interface RiskDashboardProps {
  assessmentId: number;
}

export default function RiskDashboard({ assessmentId }: RiskDashboardProps) {
  const [view, setView] = useState<string>("summary");

  // Fetch assessment data
  const { data: assessment } = useQuery<any>({
    queryKey: ["/api/assessments", assessmentId],
  });

  // Fetch assessment results
  const { data: assessmentResults, isLoading: resultsLoading } = useQuery<any[]>({
    queryKey: ["/api/assessment-results", assessmentId],
    queryFn: async () => {
      const response = await fetch(`/api/assessment-results?assessmentId=${assessmentId}`);
      return await response.json();
    },
  });

  // Calculate stats from results
  const stats = assessmentResults ? assessmentResults.reduce((acc: any, result: any) => {
    acc.total++;
    acc[result.status]++;
    return acc;
  }, {
    total: 0,
    implemented: 0,
    partially_implemented: 0,
    not_implemented: 0,
  }) : {
    total: 0,
    implemented: 0,
    partially_implemented: 0,
    not_implemented: 0,
  };

  // Group results by domain for the heatmap
  const domainResults = () => {
    if (!assessmentResults || assessmentResults.length === 0) return [];
    
    // Group by domain
    const domainGroups: Record<string, any> = {};
    
    const total = assessmentResults.length;
    const implementedCount = assessmentResults.filter((r: any) => r.status === "implemented").length;
    const partiallyCount = assessmentResults.filter((r: any) => r.status === "partially_implemented").length;
    
    assessmentResults.forEach((result: any) => {
      const domain = result.domainName || "Unknown";
      
      if (!domainGroups[domain]) {
        domainGroups[domain] = {
          domain,
          domainCode: result.domainCode || "",
          controls: [],
          implemented: 0,
          partially_implemented: 0,
          not_implemented: 0,
          risk_level: 0
        };
      }
      
      domainGroups[domain].controls.push(result);
      domainGroups[domain][result.status]++;
    });
    
    // Calculate risk level for each domain (0-100, where 0 is no risk and 100 is high risk)
    Object.values(domainGroups).forEach((domain: any) => {
      const totalControls = domain.controls.length;
      const implementedWeight = 0;  // No risk
      const partiallyWeight = 50;   // Medium risk
      const notImplementedWeight = 100;  // High risk
      
      const riskScore = (
        (domain.implemented * implementedWeight) +
        (domain.partially_implemented * partiallyWeight) +
        (domain.not_implemented * notImplementedWeight)
      ) / totalControls;
      
      domain.risk_level = Math.round(riskScore);
    });
    
    return Object.values(domainGroups);
  };

  // Calculate the compliance score (0-100)
  const complianceScore = () => {
    if (assessment && assessment.score !== undefined && assessment.score !== null) {
      return Math.round(assessment.score);
    }
    
    if (!assessmentResults || assessmentResults.length === 0) return 0;
    
    const totalControls = assessmentResults.length;
    const implementedWeight = 1.0;  // Full weight
    const partiallyWeight = 0.5;    // Half weight
    
    const score = (
      (stats.implemented * implementedWeight) +
      (stats.partially_implemented * partiallyWeight)
    ) / totalControls * 100;
    
    return Math.round(score);
  };

  // Simple overview of the assessment
  const renderOverview = () => {
    if (!assessment || !assessmentResults) return null;
    
    // No results yet
    if (assessmentResults.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <h3 className="text-xl font-medium">No Assessment Results</h3>
          <p className="text-center text-gray-500">
            There are no control evaluations for this assessment yet.
            Navigate to the Controls tab to start your assessment.
          </p>
        </div>
      );
    }

    const frameworks = assessment?.frameworkName || assessmentResults[0]?.frameworkName;
    const statusLabel = assessment?.status || "draft";
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{frameworks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{statusLabel.replace('_', ' ')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complianceScore()}%</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Control Implementation Status</CardTitle>
              <CardDescription>
                Overview of control implementation across all domains
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <RiskStatusChart 
                implemented={stats.implemented}
                partiallyImplemented={stats.partially_implemented}
                notImplemented={stats.not_implemented}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Domain Risk Heatmap</CardTitle>
              <CardDescription>
                Risk level by domain based on control implementation
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <RiskHeatmapComponent domains={domainResults()} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  if (resultsLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-pulse text-center">
          <div className="h-4 w-32 bg-gray-300 rounded mb-4 mx-auto"></div>
          <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-gray-300 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="summary" value={view} onValueChange={setView}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          {renderOverview()}
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Assessment Results</CardTitle>
              <CardDescription>
                View detailed implementation status by domain and control
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assessmentResults && assessmentResults.length > 0 ? (
                <div className="space-y-6">
                  {domainResults().map((domain: any, index: number) => (
                    <div key={index} className="mb-8">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        {domain.domainCode} - {domain.domain}
                      </h3>
                      <div className="ml-7 space-y-1 text-sm">
                        <div className="grid grid-cols-12 gap-2 font-medium pb-2 border-b">
                          <div className="col-span-6">Control</div>
                          <div className="col-span-3">Status</div>
                          <div className="col-span-3">Last Updated</div>
                        </div>
                        {domain.controls.map((control: any, ctrlIndex: number) => (
                          <div key={ctrlIndex} className="grid grid-cols-12 gap-2 py-2 border-b border-gray-100">
                            <div className="col-span-6">
                              {control.controlCode} - {control.controlName}
                            </div>
                            <div className="col-span-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                control.status === "implemented" 
                                  ? "bg-green-100 text-green-800" 
                                  : control.status === "partially_implemented" 
                                  ? "bg-yellow-100 text-yellow-800" 
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {control.status === "implemented" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {control.status === "partially_implemented" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                {control.status === "not_implemented" && <FileText className="h-3 w-3 mr-1" />}
                                {control.status.replace("_", " ")}
                              </span>
                            </div>
                            <div className="col-span-3 text-gray-500">
                              {new Date(control.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                  <h3 className="text-lg font-medium">No Assessment Results</h3>
                  <p className="text-gray-500 mt-1">
                    There are no control evaluations for this assessment yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}