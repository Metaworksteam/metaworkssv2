import { useState } from "react";
import { useParams, useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ComplianceReport } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Download, 
  Loader2, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const colors = {
  implemented: "#10b981",
  partially_implemented: "#f59e0b",
  not_implemented: "#ef4444",
  not_applicable: "#6b7280",
};

const statusLabels = {
  implemented: "Implemented",
  partially_implemented: "Partially Implemented",
  not_implemented: "Not Implemented",
  not_applicable: "Not Applicable",
};

const riskColors = {
  low: "#10b981",
  medium: "#f59e0b",
  high: "#ef4444",
};

export default function SharedReportPage() {
  const [match, params] = useRoute<{ token: string }>("/shared-report/:token");
  const { token } = params || {};
  const location = useLocation();
  const searchParams = new URLSearchParams(location[0].split("?")[1] || "");
  const providedPassword = searchParams.get("password") || "";
  
  const [password, setPassword] = useState(providedPassword);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const { toast } = useToast();

  const { 
    data: report, 
    isLoading, 
    error,
    refetch 
  } = useQuery<ComplianceReport>({
    queryKey: ["/api/reports/share", token, password],
    queryFn: async () => {
      const url = `/api/reports/share/${token}${password ? `?password=${password}` : ""}`;
      const res = await fetch(url);
      
      if (res.status === 401) {
        setIsPasswordDialogOpen(true);
        throw new Error("password_required");
      }
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      return res.json();
    },
    retry: false,
  });

  function handlePasswordSubmit() {
    setIsPasswordDialogOpen(false);
    refetch();
  }

  if (isLoading) {
    return (
      <div className="container max-w-7xl flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Loading Report...</h2>
        </div>
      </div>
    );
  }

  if (error && (error as Error).message !== "password_required") {
    return (
      <div className="container max-w-7xl flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Error Loading Report
            </CardTitle>
            <CardDescription>
              There was an error loading this shared report.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{(error as Error).message}</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <a href="/">Return to Homepage</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!report && !isLoading) {
    return null; // Password dialog will be shown via AlertDialog
  }

  const reportData = report?.reportData as any;
  if (!reportData) {
    return (
      <div className="container max-w-7xl flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Invalid Report
            </CardTitle>
            <CardDescription>
              This report does not contain valid data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <a href="/">Return to Homepage</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create data for the summary pie chart
  const summaryPieData = [
    { name: "Implemented", value: reportData.summary.implementedControls, color: colors.implemented },
    { name: "Partially Implemented", value: reportData.summary.partiallyImplementedControls, color: colors.partially_implemented },
    { name: "Not Implemented", value: reportData.summary.notImplementedControls, color: colors.not_implemented },
    { name: "Not Applicable", value: reportData.summary.notApplicableControls, color: colors.not_applicable },
  ];

  // Create data for the domain risk levels bar chart
  const domainRiskData = reportData.domainRiskLevels.map((domain: any) => ({
    name: domain.displayName || domain.domainName,
    score: Math.round(domain.complianceScore),
    riskLevel: domain.riskLevel,
  }));

  return (
    <>
      <div className="container max-w-7xl py-6">
        <Button variant="ghost" className="mb-4" asChild>
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </a>
        </Button>
        
        {/* Report Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{report?.title || "Compliance Report"}</h1>
          <p className="text-muted-foreground">{report?.summary || ""}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Generated: {report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : "N/A"}
            </div>
          </div>
        </div>
        
        {/* Report Content */}
        <div className="space-y-8">
          {/* Summary Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                {reportData.framework.displayName} Compliance Summary
              </CardTitle>
              <CardDescription>
                Overall compliance status and summary metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Compliance Score</span>
                      <span className="font-bold text-2xl">{Math.round(reportData.summary.complianceScore)}%</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${reportData.summary.complianceScore}%`,
                          backgroundColor: 
                            reportData.summary.complianceScore >= 80 ? riskColors.low :
                            reportData.summary.complianceScore >= 50 ? riskColors.medium :
                            riskColors.high
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium">Compliance Status</h3>
                    <div className="mt-2 flex items-center gap-2">
                      {reportData.summary.complianceScore >= 80 ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="font-medium text-green-600">
                            Compliant
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span className="font-medium text-red-600">
                            Non-Compliant
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium">Risk Level</h3>
                    <div className="mt-2 flex items-center gap-2">
                      {reportData.summary.riskLevel === "Low" && (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          <span className="font-medium text-green-600">Low Risk</span>
                        </div>
                      )}
                      {reportData.summary.riskLevel === "Medium" && (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                          <span className="font-medium text-amber-600">Medium Risk</span>
                        </div>
                      )}
                      {reportData.summary.riskLevel === "High" && (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <span className="font-medium text-red-600">High Risk</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold">{reportData.summary.totalControls}</div>
                      <div className="text-sm text-muted-foreground">Total Controls</div>
                    </div>
                    <div className="rounded-md border p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {reportData.summary.implementedControls}
                      </div>
                      <div className="text-sm text-muted-foreground">Implemented</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={summaryPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => 
                          percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''
                        }
                      >
                        {summaryPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Domain Risk Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Domain Risk Levels</CardTitle>
              <CardDescription>
                Compliance scores and risk levels by domain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={domainRiskData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Compliance Score (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip 
                      formatter={(value, name, props) => [`${value}%`, 'Compliance Score']}
                      labelFormatter={(label) => `Domain: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="score" 
                      name="Compliance Score" 
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-2">
                <h3 className="font-medium">Domain Risk Breakdown</h3>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {reportData.domainRiskLevels.map((domain: any) => (
                    <div 
                      key={domain.domainId} 
                      className="rounded-md border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{domain.displayName || domain.domainName}</span>
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ 
                            backgroundColor: 
                              domain.riskLevel === "low" ? riskColors.low :
                              domain.riskLevel === "medium" ? riskColors.medium :
                              riskColors.high
                          }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {Math.round(domain.complianceScore)}% Compliant
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {domain.implementedControls} of {domain.totalControls} controls implemented
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Control Assessment Results</CardTitle>
              <CardDescription>
                Detailed results for each control
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="notImplemented">Not Implemented</TabsTrigger>
                  <TabsTrigger value="partiallyImplemented">Partial</TabsTrigger>
                  <TabsTrigger value="implemented">Implemented</TabsTrigger>
                </TabsList>
                
                {/* All Controls Tab */}
                <TabsContent value="all" className="mt-4">
                  <div className="space-y-4">
                    {reportData.detailedResults.map((result: any) => (
                      <div
                        key={result.resultId}
                        className="rounded-md border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              {result.controlIdentifier}: {result.controlName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Domain: {result.domainName}
                            </p>
                          </div>
                          <div 
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: 
                                result.status === "implemented" ? "rgba(16, 185, 129, 0.1)" :
                                result.status === "partially_implemented" ? "rgba(245, 158, 11, 0.1)" :
                                result.status === "not_implemented" ? "rgba(239, 68, 68, 0.1)" :
                                "rgba(107, 114, 128, 0.1)",
                              color:
                                result.status === "implemented" ? colors.implemented :
                                result.status === "partially_implemented" ? colors.partially_implemented :
                                result.status === "not_implemented" ? colors.not_implemented :
                                colors.not_applicable,
                            }}
                          >
                            {statusLabels[result.status as keyof typeof statusLabels]}
                          </div>
                        </div>
                        
                        {result.evidence && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium">Evidence</h4>
                            <p className="text-sm">{result.evidence}</p>
                          </div>
                        )}
                        
                        {result.comments && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium">Comments</h4>
                            <p className="text-sm">{result.comments}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Not Implemented Tab */}
                <TabsContent value="notImplemented" className="mt-4">
                  <div className="space-y-4">
                    {reportData.detailedResults
                      .filter((result: any) => result.status === "not_implemented")
                      .map((result: any) => (
                        <div
                          key={result.resultId}
                          className="rounded-md border p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                {result.controlIdentifier}: {result.controlName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Domain: {result.domainName}
                              </p>
                            </div>
                            <div 
                              className="rounded-full px-3 py-1 text-xs font-medium bg-red-50 text-red-600"
                            >
                              Not Implemented
                            </div>
                          </div>
                          
                          {result.evidence && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Evidence</h4>
                              <p className="text-sm">{result.evidence}</p>
                            </div>
                          )}
                          
                          {result.comments && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Comments</h4>
                              <p className="text-sm">{result.comments}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                {/* Partially Implemented Tab */}
                <TabsContent value="partiallyImplemented" className="mt-4">
                  <div className="space-y-4">
                    {reportData.detailedResults
                      .filter((result: any) => result.status === "partially_implemented")
                      .map((result: any) => (
                        <div
                          key={result.resultId}
                          className="rounded-md border p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                {result.controlIdentifier}: {result.controlName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Domain: {result.domainName}
                              </p>
                            </div>
                            <div 
                              className="rounded-full px-3 py-1 text-xs font-medium bg-amber-50 text-amber-600"
                            >
                              Partially Implemented
                            </div>
                          </div>
                          
                          {result.evidence && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Evidence</h4>
                              <p className="text-sm">{result.evidence}</p>
                            </div>
                          )}
                          
                          {result.comments && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Comments</h4>
                              <p className="text-sm">{result.comments}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                {/* Implemented Tab */}
                <TabsContent value="implemented" className="mt-4">
                  <div className="space-y-4">
                    {reportData.detailedResults
                      .filter((result: any) => result.status === "implemented")
                      .map((result: any) => (
                        <div
                          key={result.resultId}
                          className="rounded-md border p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                {result.controlIdentifier}: {result.controlName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Domain: {result.domainName}
                              </p>
                            </div>
                            <div 
                              className="rounded-full px-3 py-1 text-xs font-medium bg-green-50 text-green-600"
                            >
                              Implemented
                            </div>
                          </div>
                          
                          {result.evidence && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Evidence</h4>
                              <p className="text-sm">{result.evidence}</p>
                            </div>
                          )}
                          
                          {result.comments && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Comments</h4>
                              <p className="text-sm">{result.comments}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>
                Actions to improve compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.recommendations.length > 0 ? (
                  reportData.recommendations.map((rec: any, index: number) => (
                    <div
                      key={`${rec.controlIdentifier}-${index}`}
                      className="rounded-md border p-4"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium">
                            {rec.controlIdentifier}: {rec.controlName}
                          </h3>
                          <div 
                            className="rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: rec.priority === "high" ? "rgba(239, 68, 68, 0.1)" : 
                                              rec.priority === "medium" ? "rgba(245, 158, 11, 0.1)" : 
                                              "rgba(16, 185, 129, 0.1)",
                              color: rec.priority === "high" ? "#ef4444" : 
                                    rec.priority === "medium" ? "#f59e0b" : 
                                    "#10b981"
                            }}
                          >
                            {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                          </div>
                        </div>
                        <p className="mt-1 text-sm">
                          {rec.recommendation}
                        </p>
                        {rec.domainName && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Domain: {rec.domainName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-md border border-dashed p-8 text-center">
                    <h3 className="font-medium">No Recommendations</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      All controls are properly implemented.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Password Dialog */}
      <AlertDialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Protected Report</AlertDialogTitle>
            <AlertDialogDescription>
              This report is password protected. Please enter the password to view it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordSubmit}>
              Access Report
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}