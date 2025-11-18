import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, Calendar, ChevronLeft, ClipboardList, Edit, Percent, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { RiskStatusChart } from "@/components/risks/risk-status-chart";
import { AssessmentResultItem } from "@/components/risks/assessment-result-item";
import RiskAssessmentForm from "@/components/risks/risk-assessment-form";
import OneClickReportButton from "@/components/reports/one-click-report-button";
import { Framework, Assessment, AssessmentResult } from "@shared/schema";

export default function RiskAssessmentPage() {
  const [, setLocation] = useLocation();
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const { toast } = useToast();
  const [match, params] = useRoute<{ id?: string }>("/risk-assessment/:id?");
  
  // Query to get frameworks
  const { data: frameworks = [] } = useQuery<Framework[]>({
    queryKey: ['/api/frameworks'],
  });
  
  // Query to get all assessments for the user
  const { data: assessments = [], refetch: refetchAssessments } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });
  
  // Get assessment results for the selected assessment
  const { data: assessmentResults = [], refetch: refetchResults } = useQuery<AssessmentResult[]>({
    queryKey: ['/api/assessment-results', assessmentId || 0],
    enabled: !!assessmentId,
  });
  
  useEffect(() => {
    if (match && params?.id) {
      setAssessmentId(parseInt(params.id));
    } else if (assessments.length > 0) {
      setAssessmentId(assessments[0].id);
    }
  }, [match, params, assessments]);
  
  const selectedAssessment = assessmentId 
    ? assessments.find(a => a.id === assessmentId) 
    : null;
  
  // Calculate status counts
  const implementedCount = assessmentResults.filter(r => r.status === 'implemented').length;
  const partiallyImplementedCount = assessmentResults.filter(r => r.status === 'partially_implemented').length;
  const notImplementedCount = assessmentResults.filter(r => r.status === 'not_implemented').length;
  
  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  }
  
  function formatDate(dateString?: string) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
  
  async function handleNewAssessmentSuccess() {
    toast({
      title: "Assessment Created",
      description: "Risk assessment has been created successfully",
    });
    await refetchAssessments();
  }
  
  function renderAssessmentList() {
    if (assessments.length === 0) {
      return (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No assessments found. Create a new assessment to get started.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <div className="space-y-4">
        {assessments.map((assessment) => (
          <Card 
            key={assessment.id} 
            className={`cursor-pointer hover:border-primary/50 transition-all ${assessmentId === assessment.id ? 'border-primary' : ''}`}
            onClick={() => setAssessmentId(assessment.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-medium">{assessment.name}</CardTitle>
                <Badge className={getStatusColor(assessment.status)}>
                  {assessment.status === 'in_progress' ? 'In Progress' : 'Completed'}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1 text-xs mt-1">
                <Calendar className="h-3 w-3" />
                {formatDate(assessment.startDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="outline" className="rounded-sm">
                  {assessment.frameworkName || "Unknown framework"}
                </Badge>
                <Badge variant="outline" className="rounded-sm flex items-center gap-1">
                  <Percent className="h-3 w-3" />
                  {assessment.score ? `${Math.round(assessment.score)}%` : 'N/A'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Risk Assessment | MetaWorks</title>
      </Helmet>
      
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button
              variant="ghost"
              className="gap-1 mb-2"
              onClick={() => setLocation('/risk-management')}
            >
              <ChevronLeft className="h-4 w-4" /> 
              Back to Risk Management
            </Button>
            <h1 className="text-3xl font-bold mb-1">Risk Assessment</h1>
            <p className="text-muted-foreground">
              Evaluate your organization's compliance with cybersecurity frameworks
            </p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                New Assessment
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Create New Assessment</SheetTitle>
                <SheetDescription>
                  Start a new compliance assessment for your organization.
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <RiskAssessmentForm 
                  onSuccess={handleNewAssessmentSuccess} 
                  frameworks={frameworks}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left sidebar - Assessment list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Assessments</CardTitle>
                <CardDescription>
                  Select an assessment to view details
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[calc(100vh-250px)] overflow-auto">
                {renderAssessmentList()}
              </CardContent>
            </Card>
          </div>
          
          {/* Right content area - Assessment details */}
          <div className="lg:col-span-3">
            {selectedAssessment ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">{selectedAssessment.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">
                            {selectedAssessment.frameworkName || 'Unknown Framework'}
                          </Badge>
                          <span>•</span>
                          <Badge className={getStatusColor(selectedAssessment.status)}>
                            {selectedAssessment.status === 'in_progress' ? 'In Progress' : 'Completed'}
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {/* One-click report generation button */}
                        {selectedAssessment && (
                          <OneClickReportButton 
                            assessmentId={selectedAssessment.id}
                            assessmentName={selectedAssessment.name}
                          />
                        )}
                        <Button variant="outline" size="sm" className="gap-1">
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div className="bg-card border rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="text-xl font-semibold">{formatDate(selectedAssessment.startDate)}</p>
                      </div>
                      <div className="bg-card border rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Completion Date</p>
                        <p className="text-xl font-semibold">
                          {selectedAssessment.completionDate ? formatDate(selectedAssessment.completionDate) : 'In Progress'}
                        </p>
                      </div>
                      <div className="bg-card border rounded-md p-4">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-xl font-semibold">
                          {selectedAssessment.score ? `${Math.round(selectedAssessment.score)}%` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4">Compliance Status</h3>
                      <div className="h-[180px]">
                        <RiskStatusChart 
                          implemented={implementedCount}
                          partiallyImplemented={partiallyImplementedCount}
                          notImplemented={notImplementedCount}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Assessment Results</CardTitle>
                    <CardDescription>
                      Detailed compliance status for each control
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Tabs defaultValue="all">
                      <div className="px-6 pb-2 border-b">
                        <TabsList>
                          <TabsTrigger value="all" className="gap-2">
                            <ClipboardList className="h-4 w-4" />
                            All Controls
                          </TabsTrigger>
                          <TabsTrigger value="implemented" className="gap-2 text-green-600">
                            Implemented ({implementedCount})
                          </TabsTrigger>
                          <TabsTrigger value="partial" className="gap-2 text-amber-600">
                            Partial ({partiallyImplementedCount})
                          </TabsTrigger>
                          <TabsTrigger value="not-implemented" className="gap-2 text-red-600">
                            Not Implemented ({notImplementedCount})
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="all" className="m-0">
                        <ScrollArea className="h-[400px]">
                          <div className="px-1 py-2">
                            {assessmentResults.length === 0 ? (
                              <div className="flex flex-col items-center justify-center p-8 text-center">
                                <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No assessment results found.</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {assessmentResults.map((result) => (
                                  <AssessmentResultItem 
                                    key={result.id} 
                                    result={result} 
                                    onUpdate={() => refetchResults()}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="implemented" className="m-0">
                        <ScrollArea className="h-[400px]">
                          <div className="px-1 py-2">
                            {assessmentResults.filter(r => r.status === 'implemented').map((result) => (
                              <AssessmentResultItem 
                                key={result.id} 
                                result={result} 
                                onUpdate={() => refetchResults()}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="partial" className="m-0">
                        <ScrollArea className="h-[400px]">
                          <div className="px-1 py-2">
                            {assessmentResults.filter(r => r.status === 'partially_implemented').map((result) => (
                              <AssessmentResultItem 
                                key={result.id} 
                                result={result} 
                                onUpdate={() => refetchResults()}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                      
                      <TabsContent value="not-implemented" className="m-0">
                        <ScrollArea className="h-[400px]">
                          <div className="px-1 py-2">
                            {assessmentResults.filter(r => r.status === 'not_implemented').map((result) => (
                              <AssessmentResultItem 
                                key={result.id} 
                                result={result} 
                                onUpdate={() => refetchResults()}
                              />
                            ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-6">
                    <p className="text-sm text-muted-foreground">
                      Update the status of each control to track your organization's compliance progress.
                    </p>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Assessment Selected</CardTitle>
                  <CardDescription>
                    Select an existing assessment from the sidebar or create a new one to get started.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <AlertTriangle className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No assessment data to display. Please select or create an assessment.
                    </p>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Create New Assessment
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Create New Assessment</SheetTitle>
                          <SheetDescription>
                            Start a new compliance assessment for your organization.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          <RiskAssessmentForm 
                            onSuccess={handleNewAssessmentSuccess} 
                            frameworks={frameworks}
                          />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}