import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/dashboard/sidebar";
import ComplianceScore from "@/components/dashboard/compliance-score";
import RiskHeatmap from "@/components/risks/risk-heatmap";
import CompanyInfoSection from "@/components/landing/company-info-section";
import { Link } from "wouter";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Download, BarChart3, Network, Lock, Database, Cloud, UserCheck, Settings, Clipboard, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Assessment, AssessmentResult, Control, Domain, Framework } from "@shared/schema";

// Component to display controls for a domain with their compliance status
interface DomainControlsProps {
  domainId: number;
  allResults: AssessmentResult[] | undefined;
}

function DomainControls({ domainId, allResults }: DomainControlsProps) {
  // Fetch controls for this domain
  const { data: controls, isLoading } = useQuery<Control[]>({
    queryKey: ['/api/controls', domainId],
    enabled: !!domainId,
    queryFn: async () => {
      const res = await fetch(`/api/controls?domainId=${domainId}`);
      return await res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-6">
        <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Loading controls...</p>
      </div>
    );
  }

  if (!controls || controls.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No controls found for this domain.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {controls.map(control => {
        // Find the assessment result for this control
        const result = allResults?.find(r => r.controlId === control.id);
        
        // Map status to display status
        const status = 
          !result ? "Not Assessed" :
          result.status === "implemented" ? "Compliant" :
          result.status === "partially_implemented" ? "Partially Compliant" :
          "Non-Compliant";
        
        return (
          <div 
            key={control.id} 
            className="rounded-lg border p-3 flex items-center justify-between bg-background/60"
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                status === "Compliant" ? "bg-green-500" : 
                status === "Partially Compliant" ? "bg-amber-500" : 
                status === "Not Assessed" ? "bg-gray-400" : "bg-red-500"
              }`}></div>
              <div>
                <div className="text-xs text-muted-foreground">
                  {control.controlId || `ECC ${control.id}`}
                </div>
                <div className="font-medium">{control.name}</div>
              </div>
            </div>
            <Link href={`/control/${control.id}`}>
              <Button variant="ghost" size="icon">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeSecurityDomain, setActiveSecurityDomain] = useState("governance");
  
  // Get all assessments for the user
  const { data: assessments, isLoading: assessmentsLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });
  
  // Get all frameworks
  const { data: frameworks, isLoading: frameworksLoading } = useQuery<Framework[]>({
    queryKey: ['/api/frameworks'],
  });
  
  // Get NCA ECC framework specifically
  const ncaEccFramework = frameworks?.find((f: Framework) => f.name === "NCA ECC");
  
  // Get domains for the NCA ECC framework
  const { data: domains, isLoading: domainsLoading } = useQuery<Domain[]>({
    queryKey: ['/api/domains', ncaEccFramework?.id],
    enabled: !!ncaEccFramework?.id,
    queryFn: async () => {
      if (!ncaEccFramework?.id) return [];
      const res = await fetch(`/api/domains?frameworkId=${ncaEccFramework.id}`);
      return await res.json();
    }
  });
  
  // Get all assessment results
  const { data: allResults, isLoading: resultsLoading } = useQuery<AssessmentResult[]>({
    queryKey: ['/api/assessment-results/all'],
    enabled: !!assessments?.length,
    queryFn: async () => {
      if (!assessments?.length) return [];
      
      // Get latest assessment
      const latestAssessment = assessments.reduce((latest: Assessment, current: Assessment) => {
        return new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest;
      }, assessments[0]);
      
      const res = await fetch(`/api/assessment-results?assessmentId=${latestAssessment.id}`);
      return await res.json();
    }
  });
  
  // Calculate compliance score
  const complianceScore = () => {
    if (!allResults || allResults.length === 0) return 0;
    
    const totalControls = allResults.length;
    const implementedCount = allResults.filter((r: AssessmentResult) => r.status === "implemented").length;
    const partiallyCount = allResults.filter((r: AssessmentResult) => r.status === "partially_implemented").length;
    
    return Math.round(((implementedCount + (partiallyCount * 0.5)) / totalControls) * 100);
  };
  
  // Calculate risk level
  const calculateRiskLevel = () => {
    const score = complianceScore();
    
    if (score >= 85) return { level: "Low", color: "text-green-500" };
    if (score >= 65) return { level: "Medium", color: "text-amber-500" };
    return { level: "High", color: "text-red-500" };
  };
  
  // Get controls data for tasks
  const { data: controls, isLoading: controlsLoading } = useQuery<Control[]>({
    queryKey: ['/api/controls'],
    enabled: !!allResults?.length
  });
  
  // Get domains for tasks
  const { data: allDomains, isLoading: allDomainsLoading } = useQuery<Domain[]>({
    queryKey: ['/api/domains/all'],
    enabled: !!controls?.length,
    queryFn: async () => {
      const res = await fetch(`/api/domains/all`);
      return await res.json();
    }
  });
  
  // Enhanced pending tasks with control and domain information
  const pendingTasks = React.useMemo(() => {
    if (!allResults || !controls || !allDomains) return [];
    
    const filteredTasks = allResults
      .filter((result: AssessmentResult) => 
        result.status === "not_implemented" || result.status === "partially_implemented")
      .slice(0, 3);
    
    return filteredTasks.map((task: AssessmentResult) => {
      const control = controls.find((c: Control) => c.id === task.controlId);
      const domain = control ? allDomains.find((d: Domain) => d.id === control.domainId) : null;
      
      return {
        ...task,
        controlName: control?.name || `Control ${task.controlId}`,
        domainName: domain?.name || "Security Domain"
      };
    });
  }, [allResults, controls, allDomains]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.username}
              </span>
            </div>
          </div>
          
          {/* Company Information Dashboard */}
          <CompanyInfoSection />
          
          {/* Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="backdrop-blur-sm bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-primary" />
                  Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <ComplianceScore score={complianceScore()} />
                )}
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  Risk Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className={`text-2xl font-bold ${calculateRiskLevel().color}`}>
                      {calculateRiskLevel().level}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pendingTasks.length > 0 
                        ? `${pendingTasks.length} issues need attention` 
                        : "No critical issues found"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-primary/5 border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resultsLoading ? (
                  <div className="flex flex-col items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                    <span className="text-sm text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {allResults?.filter((r: AssessmentResult) => r.status === "implemented").length || 0}/
                      {allResults?.length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ncaEccFramework?.name || "NCA ECC"} controls implemented
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Heatmap */}
            <Card className="md:col-span-2 backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Risk Heatmap</CardTitle>
                <Link href="/risk-management">
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="text-xs text-muted-foreground"
                  >
                    View Full Risk Management →
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <RiskHeatmap />
              </CardContent>
            </Card>
            
            {/* Pending Tasks */}
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  Pending Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resultsLoading ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                      <span className="text-sm text-muted-foreground">Loading tasks...</span>
                    </div>
                  ) : pendingTasks.length > 0 ? (
                    pendingTasks.map((task: AssessmentResult & { controlName?: string; domainName?: string }, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          task.status === "not_implemented" ? "bg-red-500" : "bg-amber-500"
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium">
                            {task.controlName || `Control ${task.controlId}`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {task.domainName || "Security Domain"} - Updated {new Date(task.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-sm text-muted-foreground">No pending tasks</p>
                    </div>
                  )}
                  <Link href="/did-agent">
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      Talk to Virtual Consultant
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    View All Tasks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* NCA ECC Framework */}
          <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
            <CardHeader>
              <CardTitle>NCA ECC Framework</CardTitle>
              <CardDescription>
                {ncaEccFramework?.description || "Essential Cybersecurity Controls"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {domainsLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Loading NCA ECC domains...</p>
                </div>
              ) : domains && domains.length > 0 ? (
                <Tabs defaultValue={domains[0]?.id?.toString()}>
                  <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${domains.length}, 1fr)` }}>
                    {domains.map(domain => (
                      <TabsTrigger key={domain.id} value={domain.id.toString()}>
                        {domain.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {domains.map(domain => (
                    <TabsContent key={domain.id} value={domain.id.toString()}>
                      <div className="mt-4">
                        {/* Get controls for this domain */}
                        <DomainControls domainId={domain.id} allResults={allResults} />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No domains found for NCA ECC framework. Please add domains and controls to get started.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
