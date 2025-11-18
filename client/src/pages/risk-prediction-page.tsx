import { useState } from "react";
import { useClerk } from "@clerk/clerk-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle, ArrowRight, BarChart4, FileText, ShieldAlert } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import RadarChart from "@/components/charts/radar-chart";
import HeatMap from "@/components/charts/heat-map";

const RiskPredictionPage = () => {
  const { toast } = useToast();
  const { user } = useClerk();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Define the type for the dashboard data
  interface RiskDashboardData {
    risk_score: number;
    compliance_level: string;
    last_assessment_date?: string;
    assessment_name?: string;
    framework?: number;
    high_risk_domains?: string[];
    critical_recommendations?: string[];
    risk_summary?: string;
    domain_risk_distribution?: {
      high: number;
      medium: number;
      low: number;
    };
    historical_data?: Array<{
      date: string;
      score: number;
      status: string;
    }>;
  }

  // Query to fetch risk prediction dashboard data
  const { 
    data: dashboardData, 
    isLoading: isDashboardLoading,
    isError: isDashboardError
  } = useQuery<RiskDashboardData>({
    queryKey: ["/api/risk-prediction/dashboard"],
    enabled: !!user,
  });

  // Handle setting the badge color based on compliance level
  const getComplianceBadgeColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-green-500 hover:bg-green-600";
      case "Medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "Low":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-slate-500 hover:bg-slate-600";
    }
  };

  // Handle setting the risk score color
  const getRiskScoreColor = (score: number) => {
    if (score >= 0 && score <= 3) {
      return "text-green-500";
    } else if (score > 3 && score <= 6) {
      return "text-yellow-500";
    } else {
      return "text-red-500";
    }
  };

  // Generate radar chart data from dashboard data if available
  const generateRadarChartData = () => {
    if (!dashboardData || !dashboardData.domain_risk_distribution) {
      return null;
    }

    // This is a dummy implementation - in a real app, you'd transform domain risk data
    // into a format suitable for the radar chart
    return {
      labels: ['Access Control', 'Data Protection', 'Network Security', 'Physical Security', 'System Management'],
      datasets: [
        {
          label: 'Risk Level',
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Generate heatmap data for the compliance score by domain
  const generateHeatMapData = () => {
    if (!dashboardData) {
      return null;
    }

    // This is a dummy implementation - in a real app, you'd transform domain risk data
    // into a format suitable for the heatmap
    return {
      data: [
        { x: 'Domain 1', y: 'Control 1.1', value: Math.random() * 100 },
        { x: 'Domain 1', y: 'Control 1.2', value: Math.random() * 100 },
        { x: 'Domain 2', y: 'Control 2.1', value: Math.random() * 100 },
        { x: 'Domain 2', y: 'Control 2.2', value: Math.random() * 100 },
        { x: 'Domain 3', y: 'Control 3.1', value: Math.random() * 100 },
      ]
    };
  };

  return (
    <DashboardLayout>
      <div className="container p-6 mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI-Powered Risk Prediction</h1>
              <p className="text-muted-foreground mt-1">
                Advanced analytics and risk insights powered by artificial intelligence
              </p>
            </div>
            <div className="flex space-x-2">
              <Link href="/assessments">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  View Assessments
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  View Reports
                </Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-lg">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <BarChart4 className="h-4 w-4" />
                Risk Dashboard
              </TabsTrigger>
              <TabsTrigger value="remediation" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Remediation Plans
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                Gap Analysis
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="mt-6">
              {isDashboardLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isDashboardError ? (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Failed to load risk dashboard data. Please try again later.
                  </AlertDescription>
                </Alert>
              ) : !dashboardData ? (
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>No Data Available</AlertTitle>
                  <AlertDescription>
                    Complete an assessment to generate risk prediction insights.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Overall Risk Card */}
                  <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                    <CardHeader>
                      <CardTitle>Overall Risk Score</CardTitle>
                      <CardDescription>Based on your latest assessment</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center space-y-4 h-32">
                        <div className={`text-6xl font-bold ${getRiskScoreColor(dashboardData.risk_score)}`}>
                          {dashboardData.risk_score.toFixed(1)}
                        </div>
                        <Badge className={getComplianceBadgeColor(dashboardData.compliance_level)}>
                          {dashboardData.compliance_level} Compliance
                        </Badge>
                      </div>
                      <Progress 
                        value={dashboardData.risk_score * 10} 
                        className={`h-2 mt-4 ${
                          dashboardData.risk_score <= 3 
                            ? "bg-green-500/20" 
                            : dashboardData.risk_score <= 6 
                              ? "bg-yellow-500/20" 
                              : "bg-red-500/20"
                        }`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Low Risk</span>
                        <span>High Risk</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground">
                        Last assessment: {dashboardData.last_assessment_date 
                          ? new Date(dashboardData.last_assessment_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </CardFooter>
                  </Card>

                  {/* Risk Summary Card */}
                  <Card className="col-span-1 md:col-span-2">
                    <CardHeader>
                      <CardTitle>Risk Summary</CardTitle>
                      <CardDescription>AI-generated analysis of your security posture</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">
                        {dashboardData.risk_summary || "No risk summary available."}
                      </p>
                      
                      {dashboardData.high_risk_domains && dashboardData.high_risk_domains.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">High Risk Domains</h4>
                          <div className="flex flex-wrap gap-2">
                            {dashboardData.high_risk_domains.map((domain: string, index: number) => (
                              <Badge key={index} variant="destructive">
                                {domain}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Critical Recommendations Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Critical Recommendations</CardTitle>
                      <CardDescription>Top priorities for risk mitigation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dashboardData.critical_recommendations && dashboardData.critical_recommendations.length > 0 ? (
                        <ul className="space-y-2">
                          {dashboardData.critical_recommendations.map((recommendation: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No critical recommendations available.</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Risk Distribution Card */}
                  <Card className="col-span-1 md:col-span-3">
                    <CardHeader>
                      <CardTitle>Risk Distribution</CardTitle>
                      <CardDescription>Risk levels across security domains</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-1/2 h-60">
                        {generateRadarChartData() && (
                          <RadarChart data={generateRadarChartData() as { 
                            labels: string[]; 
                            datasets: { 
                              label: string; 
                              data: number[]; 
                              backgroundColor: string; 
                              borderColor: string; 
                              borderWidth: number; 
                            }[] 
                          }} />
                        )}
                      </div>
                      <div className="w-full md:w-1/2 h-60">
                        {generateHeatMapData() && (
                          <HeatMap data={generateHeatMapData()?.data || []} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Remediation Plans Tab */}
            <TabsContent value="remediation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Remediation Plans</CardTitle>
                  <CardDescription>
                    Select an assessment to generate detailed remediation recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <p className="mb-4 text-muted-foreground">
                        This feature will be available soon. You'll be able to select an assessment and generate 
                        customized remediation plans based on your compliance gaps.
                      </p>
                      <Button variant="outline" disabled>
                        Generate Remediation Plan
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Gap Analysis Tab */}
            <TabsContent value="analysis" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Control Gap Analysis</CardTitle>
                  <CardDescription>
                    Select a control to analyze implementation gaps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-center">
                      <p className="mb-4 text-muted-foreground">
                        This feature will be available soon. You'll be able to select a specific control
                        and receive detailed analysis of implementation gaps.
                      </p>
                      <Button variant="outline" disabled>
                        Analyze Control
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RiskPredictionPage;