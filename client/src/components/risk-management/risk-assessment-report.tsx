import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Filter, Printer, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

// Define the risk assessment entry type
type RiskAssessmentEntry = {
  domain: string;
  subdomain: string;
  domainCode: string;
  controlCode: string;
  controlName: string;
  controlStatus: "not_implemented" | "partially_implemented" | "implemented" | "not_applicable";
  currentStatus: string;
  recommendation: string;
  managementResponse: string;
  targetDate: string;
  priority: "High" | "Medium" | "Low";
};

// Assessment type
type Assessment = {
  id: number;
  name: string;
  startDate: string;
  status: string;
  companyId: number;
  frameworkId: number;
  createdBy: number;
  frameworkName: string;
  score?: number;
  completionDate?: string;
};

// Assessment result type
type AssessmentResult = {
  id: number;
  assessmentId: number;
  controlId: number;
  status: "not_implemented" | "partially_implemented" | "implemented" | "not_applicable";
  evidence: string | null;
  recommendation: string;
  managementResponse: string;
  targetDate: string | null;
  updatedBy: number;
  controlName: string;
  controlDescription: string;
  domainName: string;
  domainCode: string;
  controlCode: string;
  comments?: string | null;
};

// Create a mapping function to transform assessment results into risk assessment entries
const mapAssessmentResultsToEntries = (results: AssessmentResult[]): RiskAssessmentEntry[] => {
  return results.map(result => ({
    domain: result.domainName,
    subdomain: result.controlDescription,
    domainCode: result.domainCode,
    controlCode: result.controlCode,
    controlName: result.controlName,
    controlStatus: result.status,
    currentStatus: result.evidence || `No status details available for ${result.controlName}`,
    recommendation: result.recommendation || "No recommendation provided",
    managementResponse: result.managementResponse || "No response provided",
    targetDate: result.targetDate || "Not set",
    priority: calculatePriority(result)
  }));
};

// Calculate priority based on control attributes
const calculatePriority = (result: AssessmentResult): "High" | "Medium" | "Low" => {
  // For now, apply a simple rule-based approach
  // In a real app, this could use more sophisticated logic
  if (result.status === "not_implemented") {
    return "High"; 
  } else if (result.status === "partially_implemented") {
    return "Medium";
  } else {
    return "Low";
  }
};

// Format status for display
const formatStatus = (status: RiskAssessmentEntry["controlStatus"]): string => {
  switch (status) {
    case "not_implemented":
      return "Not Implemented";
    case "partially_implemented":
      return "Partially Implemented";
    case "implemented":
      return "Implemented";
    case "not_applicable":
      return "Not Applicable";
    default:
      return status;
  }
};

// Generate summary statistics
const generateSummaryStats = (data: RiskAssessmentEntry[]) => {
  const applicableEntries = data.filter(entry => entry.controlStatus !== "not_applicable");
  
  const domainStats: Record<string, { 
    total: number; 
    notImplemented: number; 
    partiallyImplemented: number; 
    implemented: number;
  }> = {};
  
  applicableEntries.forEach(entry => {
    if (!domainStats[entry.domain]) {
      domainStats[entry.domain] = { total: 0, notImplemented: 0, partiallyImplemented: 0, implemented: 0 };
    }
    
    domainStats[entry.domain].total++;
    
    if (entry.controlStatus === "not_implemented") {
      domainStats[entry.domain].notImplemented++;
    } else if (entry.controlStatus === "partially_implemented") {
      domainStats[entry.domain].partiallyImplemented++;
    } else if (entry.controlStatus === "implemented") {
      domainStats[entry.domain].implemented++;
    }
  });
  
  return {
    total: applicableEntries.length,
    notImplemented: applicableEntries.filter(e => e.controlStatus === "not_implemented").length,
    partiallyImplemented: applicableEntries.filter(e => e.controlStatus === "partially_implemented").length,
    implemented: applicableEntries.filter(e => e.controlStatus === "implemented").length,
    notApplicable: data.filter(e => e.controlStatus === "not_applicable").length,
    domainStats
  };
};

// Generate chart data
const generateChartData = (stats: ReturnType<typeof generateSummaryStats>) => {
  // For pie chart
  const pieData = [
    { name: "Not Implemented", value: stats.notImplemented, color: "#f87171" },
    { name: "Partially Implemented", value: stats.partiallyImplemented, color: "#facc15" },
    { name: "Implemented", value: stats.implemented, color: "#4ade80" }
  ];
  
  // For bar chart
  const barData = Object.entries(stats.domainStats).map(([domain, data]) => ({
    name: domain,
    "Not Implemented": data.notImplemented,
    "Partially Implemented": data.partiallyImplemented,
    "Implemented": data.implemented
  }));
  
  return { pieData, barData };
};

// Status badge component
const StatusBadge = ({ status }: { status: RiskAssessmentEntry["controlStatus"] }) => {
  const variants: Record<string, string> = {
    "not_implemented": "bg-red-500/20 text-red-500 border-red-500/20",
    "partially_implemented": "bg-amber-500/20 text-amber-500 border-amber-500/20",
    "implemented": "bg-green-500/20 text-green-500 border-green-500/20",
    "not_applicable": "bg-gray-500/20 text-gray-400 border-gray-400/20"
  };
  
  return (
    <Badge className={`${variants[status]} border`}>
      {formatStatus(status)}
    </Badge>
  );
};

export default function RiskAssessmentReport() {
  const [activeTab, setActiveTab] = useState("summary");
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  
  // Fetch assessments
  const { data: assessments, isLoading: isLoadingAssessments } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
    retry: 1,
  });
  
  // Get the latest assessment ID if none is selected
  const latestAssessmentId = selectedAssessmentId || 
    (assessments && assessments.length > 0 
      ? assessments.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0].id 
      : null);
  
  // Fetch assessment results
  const { data: assessmentResults, isLoading: isLoadingResults } = useQuery<AssessmentResult[]>({
    queryKey: ["/api/assessment-results", latestAssessmentId],
    enabled: !!latestAssessmentId,
    retry: 1,
  });
  
  // Fetch risk prediction
  const { data: riskPrediction, isLoading: isLoadingPrediction } = useQuery({
    queryKey: ["/api/risk-prediction/assessment", latestAssessmentId],
    enabled: !!latestAssessmentId,
    retry: 1,
  });
  
  // Transform assessment results to risk assessment entries
  const riskAssessmentData: RiskAssessmentEntry[] = assessmentResults 
    ? mapAssessmentResultsToEntries(assessmentResults)
    : [];
  
  // Filter data based on selected filters
  const filteredData = riskAssessmentData.filter(entry => {
    if (selectedDomain && entry.domain !== selectedDomain) return false;
    if (selectedPriority && entry.priority !== selectedPriority) return false;
    return true;
  });
  
  // Generate statistics and chart data
  const stats = generateSummaryStats(filteredData);
  const { pieData, barData } = generateChartData(stats);
  
  // Get unique domains for filter
  const uniqueDomains = Array.from(new Set(riskAssessmentData.map(e => e.domain)));
  
  // Calculate compliance score
  const complianceScore = stats.total > 0 
    ? Math.round(((stats.implemented + stats.partiallyImplemented * 0.5) / stats.total) * 100)
    : 0;
  
  // High risks count from the risk prediction
  const highRisksCount = riskPrediction?.domain_risks
    ? riskPrediction.domain_risks.filter((domain: any) => domain.risk_level === "High").length
    : filteredData.filter(entry => entry.priority === "High").length;
  
  // Medium risks count
  const mediumRisksCount = riskPrediction?.domain_risks
    ? riskPrediction.domain_risks.filter((domain: any) => domain.risk_level === "Medium").length
    : filteredData.filter(entry => entry.priority === "Medium").length;
  
  // Determine if we're in loading state
  const isLoading = isLoadingAssessments || isLoadingResults || isLoadingPrediction;
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading risk assessment data...</p>
        </div>
      </div>
    );
  }
  
  // Show empty state if no assessments
  if (!assessments || assessments.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10 p-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-xl font-medium">No Assessments Found</h3>
          <p className="text-muted-foreground mt-2">
            You haven't created any risk assessments yet.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/risk-assessment/new">
              <Button>Create Assessment</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }
  
  // Show empty state if no results
  if (!assessmentResults || assessmentResults.length === 0) {
    return (
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10 p-12">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-xl font-medium">No Assessment Results Found</h3>
          <p className="text-muted-foreground mt-2">
            The selected assessment doesn't have any results yet.
          </p>
          <div className="flex justify-center mt-6">
            <Link href={`/risk-assessment/${latestAssessmentId}`}>
              <Button>Complete Assessment</Button>
            </Link>
          </div>
        </div>
      </Card>
    );
  }
  
  // Find the current assessment
  const currentAssessment = assessments?.find(a => a.id === latestAssessmentId);
  
  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                {currentAssessment?.frameworkName || "NCA ECC"} Risk Assessment Report
              </CardTitle>
              <CardDescription>
                Comprehensive analysis of compliance with Essential Cybersecurity Controls
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {assessments && assessments.length > 1 && (
            <div className="mb-6">
              <Select 
                value={latestAssessmentId?.toString() || ""} 
                onValueChange={(value) => setSelectedAssessmentId(parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-[300px]">
                  <SelectValue placeholder="Select Assessment" />
                </SelectTrigger>
                <SelectContent>
                  {assessments.map(assessment => (
                    <SelectItem key={assessment.id} value={assessment.id.toString()}>
                      {assessment.name} ({new Date(assessment.startDate).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-auto">
              <Select value={selectedDomain || ""} onValueChange={(value) => setSelectedDomain(value || null)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Domains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Domains</SelectItem>
                  {uniqueDomains.map(domain => (
                    <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedPriority || ""} onValueChange={(value) => setSelectedPriority(value || null)}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Overall Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{complianceScore}%</div>
                        <Progress value={complianceScore} className="h-2 w-[150px]" />
                        <p className="text-xs text-muted-foreground mt-2">
                          Based on {stats.total} applicable controls
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Implementation Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[150px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            labelLine={false}
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Not Implemented</span>
                          <span className="text-sm font-medium">{stats.notImplemented}</span>
                        </div>
                        <Progress value={(stats.notImplemented / stats.total) * 100} className="h-2 bg-red-100">
                          <div className="h-full bg-red-500 rounded-full"></div>
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Partially Implemented</span>
                          <span className="text-sm font-medium">{stats.partiallyImplemented}</span>
                        </div>
                        <Progress value={(stats.partiallyImplemented / stats.total) * 100} className="h-2 bg-amber-100">
                          <div className="h-full bg-amber-500 rounded-full"></div>
                        </Progress>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Implemented</span>
                          <span className="text-sm font-medium">{stats.implemented}</span>
                        </div>
                        <Progress value={(stats.implemented / stats.total) * 100} className="h-2 bg-green-100">
                          <div className="h-full bg-green-500 rounded-full"></div>
                        </Progress>
                      </div>
                      {stats.notApplicable > 0 && (
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Not Applicable</span>
                            <span className="text-sm font-medium">{stats.notApplicable}</span>
                          </div>
                          <Progress value={(stats.notApplicable / (stats.total + stats.notApplicable)) * 100} className="h-2 bg-gray-100">
                            <div className="h-full bg-gray-400 rounded-full"></div>
                          </Progress>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Implementation by Domain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={barData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={150} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Not Implemented" stackId="a" fill="#f87171" />
                          <Bar dataKey="Partially Implemented" stackId="a" fill="#facc15" />
                          <Bar dataKey="Implemented" stackId="a" fill="#4ade80" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Risk Assessment Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">High Risks</p>
                          <p className="text-2xl font-bold text-red-500">{highRisksCount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Medium Risks</p>
                          <p className="text-2xl font-bold text-amber-500">{mediumRisksCount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Assessment Date</p>
                          <p className="text-sm">
                            {currentAssessment?.startDate 
                              ? new Date(currentAssessment.startDate).toLocaleDateString() 
                              : "Not available"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Framework</p>
                          <p className="text-sm">{currentAssessment?.frameworkName || "NCA ECC"}</p>
                        </div>
                      </div>
                      
                      {riskPrediction?.risk_summary && (
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-1">Risk Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                            {riskPrediction.risk_summary}
                          </p>
                        </div>
                      )}
                      
                      {riskPrediction?.recommendations && (
                        <div className="pt-2">
                          <h4 className="text-sm font-medium mb-1">Key Recommendations</h4>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {riskPrediction.recommendations.slice(0, 3).map((rec: string, index: number) => (
                              <li key={index} className="mb-1">{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="detailed" className="py-4">
              <Card>
                <CardContent className="p-0 overflow-auto">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[180px]">Domain</TableHead>
                        <TableHead className="w-[100px]">Control ID</TableHead>
                        <TableHead className="min-w-[250px]">Control</TableHead>
                        <TableHead className="w-[150px]">Status</TableHead>
                        <TableHead className="min-w-[200px]">Current Status</TableHead>
                        <TableHead className="min-w-[200px]">Recommendation</TableHead>
                        <TableHead className="min-w-[150px]">Priority</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No results found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((entry, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{entry.domain}</TableCell>
                            <TableCell>{entry.controlCode}</TableCell>
                            <TableCell>{entry.controlName}</TableCell>
                            <TableCell><StatusBadge status={entry.controlStatus} /></TableCell>
                            <TableCell className="max-w-[300px] truncate">{entry.currentStatus}</TableCell>
                            <TableCell className="max-w-[300px] truncate">{entry.recommendation}</TableCell>
                            <TableCell>
                              <Badge 
                                className={
                                  entry.priority === "High" 
                                    ? "bg-red-500/20 text-red-500 border-red-500/20" 
                                    : entry.priority === "Medium"
                                    ? "bg-amber-500/20 text-amber-500 border-amber-500/20"
                                    : "bg-blue-500/20 text-blue-500 border-blue-500/20"
                                }
                              >
                                {entry.priority}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}