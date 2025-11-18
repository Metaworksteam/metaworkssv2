import React, { useState } from "react";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Shield, Server, RefreshCw, BarChart4 } from "lucide-react";
import NcaEccAssessmentForm from "@/components/frameworks/nca-ecc/assessment-form";
import { useAuth } from "@/hooks/use-auth";

// Domain selection card component
const DomainCard = ({ 
  domain, 
  status, 
  completionPercentage, 
  onClick 
}: { 
  domain: { id: number; name: string; icon: React.ReactNode }; 
  status: "not-started" | "in-progress" | "completed"; 
  completionPercentage: number;
  onClick: () => void;
}) => {
  const statusColors = {
    "not-started": "bg-gray-500/10 text-gray-400",
    "in-progress": "bg-amber-500/10 text-amber-500",
    "completed": "bg-green-500/10 text-green-500"
  };
  
  const statusIcons = {
    "not-started": <AlertCircle className="h-4 w-4 text-gray-400" />,
    "in-progress": <AlertCircle className="h-4 w-4 text-amber-500" />,
    "completed": <CheckCircle2 className="h-4 w-4 text-green-500" />
  };
  
  return (
    <Card 
      className="cursor-pointer hover:border-primary/30 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-primary/10 text-primary">
            {domain.icon}
          </div>
          <span>Domain {domain.id}</span>
          <div className={`ml-auto p-1 rounded-full ${statusColors[status]}`}>
            {statusIcons[status]}
          </div>
        </CardTitle>
        <CardDescription className="font-medium text-foreground">
          {domain.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-2 w-full bg-muted rounded overflow-hidden">
          <div 
            className={`h-full ${
              status === "completed" ? "bg-green-500" : "bg-amber-500"
            }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          {status === "not-started" && "Assessment not started"}
          {status === "in-progress" && `${completionPercentage}% complete`}
          {status === "completed" && "Assessment completed"}
        </div>
      </CardContent>
    </Card>
  );
};

export default function NcaEccAssessmentPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDomainId, setSelectedDomainId] = useState<number | null>(null);
  
  // Mock data for the domains
  const domains = [
    {
      id: 1,
      name: "Cybersecurity Governance",
      icon: <Shield className="h-5 w-5" />,
      status: "in-progress" as const,
      completionPercentage: 42
    },
    {
      id: 2,
      name: "Cybersecurity Defense",
      icon: <Server className="h-5 w-5" />,
      status: "not-started" as const,
      completionPercentage: 0
    },
    {
      id: 3,
      name: "Cybersecurity Resilience",
      icon: <RefreshCw className="h-5 w-5" />,
      status: "not-started" as const,
      completionPercentage: 0
    },
    {
      id: 4,
      name: "Third-Party and Cloud Computing Cybersecurity",
      icon: <Server className="h-5 w-5" />,
      status: "not-started" as const,
      completionPercentage: 0
    },
    {
      id: 5,
      name: "Industrial Control Systems Cybersecurity",
      icon: <Server className="h-5 w-5" />,
      status: "not-started" as const,
      completionPercentage: 0
    }
  ];
  
  // Overall assessment stats
  const overallStats = {
    totalControls: 114,
    implementedControls: 12,
    partiallyImplementedControls: 24,
    notImplementedControls: 78,
    notApplicableControls: 0,
    overallScore: 21 // percentage
  };
  
  // Handle domain selection
  const handleDomainSelect = (domainId: number) => {
    setSelectedDomainId(domainId);
    setActiveTab("assessment");
  };
  
  // Handle back button from assessment form
  const handleBackToOverview = () => {
    setSelectedDomainId(null);
    setActiveTab("overview");
  };
  
  return (
    <>
      <Helmet>
        <title>NCA ECC Assessment | MetaWorks</title>
      </Helmet>
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link href="/frameworks/nca-ecc">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Framework
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-primary">NCA ECC Assessment</h1>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="overview" disabled={selectedDomainId !== null}>Assessment Overview</TabsTrigger>
              <TabsTrigger value="assessment" disabled={selectedDomainId === null}>Domain Assessment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle>Assessment Progress</CardTitle>
                  <CardDescription>
                    Track your NCA ECC compliance across all domains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                        <div className="text-2xl font-bold mt-1">{overallStats.overallScore}%</div>
                        <div className="h-2 w-full bg-muted rounded overflow-hidden mt-2">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${overallStats.overallScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground">Implemented</div>
                        <div className="text-2xl font-bold mt-1 text-green-500">
                          {overallStats.implementedControls}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            /{overallStats.totalControls}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded overflow-hidden mt-2">
                          <div 
                            className="h-full bg-green-500"
                            style={{ width: `${(overallStats.implementedControls / overallStats.totalControls) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground">Partially Implemented</div>
                        <div className="text-2xl font-bold mt-1 text-amber-500">
                          {overallStats.partiallyImplementedControls}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            /{overallStats.totalControls}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded overflow-hidden mt-2">
                          <div 
                            className="h-full bg-amber-500"
                            style={{ width: `${(overallStats.partiallyImplementedControls / overallStats.totalControls) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-card p-4 rounded-lg border border-border">
                        <div className="text-sm text-muted-foreground">Not Implemented</div>
                        <div className="text-2xl font-bold mt-1 text-red-500">
                          {overallStats.notImplementedControls}
                          <span className="text-sm font-normal text-muted-foreground ml-1">
                            /{overallStats.totalControls}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded overflow-hidden mt-2">
                          <div 
                            className="h-full bg-red-500"
                            style={{ width: `${(overallStats.notImplementedControls / overallStats.totalControls) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-lg font-semibold">Domains</div>
                      <div className="text-sm text-muted-foreground">
                        Select a domain to begin or continue assessment
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {domains.map((domain) => (
                        <DomainCard
                          key={domain.id}
                          domain={domain}
                          status={domain.status}
                          completionPercentage={domain.completionPercentage}
                          onClick={() => handleDomainSelect(domain.id)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary" />
                    Compliance Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-medium">Compliance Dashboard Coming Soon</h3>
                    <p className="text-muted-foreground mt-2">
                      Complete domain assessments to generate detailed compliance insights and reports.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assessment">
              {selectedDomainId === 1 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-4"
                    onClick={handleBackToOverview}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Overview
                  </Button>
                  <NcaEccAssessmentForm />
                </>
              )}
              {selectedDomainId && selectedDomainId !== 1 && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-4"
                    onClick={handleBackToOverview}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Overview
                  </Button>
                  <Card className="backdrop-blur-sm bg-card/50 border-primary/10 p-12">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <h3 className="mt-4 text-lg font-medium">Domain {selectedDomainId} Assessment Coming Soon</h3>
                      <p className="text-muted-foreground mt-2">
                        Assessment for this domain is currently under development.
                      </p>
                      <p className="text-muted-foreground">
                        Please try Domain 1: Cybersecurity Governance for a demonstration of the assessment process.
                      </p>
                    </div>
                  </Card>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}