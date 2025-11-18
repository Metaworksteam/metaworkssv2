import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ChevronRight,
  BarChart3,
  Shield,
  FileClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UserOverview() {
  // Dummy data for demonstration
  const frameworkProgress = [
    {
      name: "NCA ECC",
      progress: 72,
      status: "In Progress",
      color: "text-green-500",
      bgColor: "bg-green-500"
    },
    {
      name: "SAMA",
      progress: 48,
      status: "In Progress",
      color: "text-blue-500",
      bgColor: "bg-blue-500"
    },
    {
      name: "PDPL",
      progress: 32,
      status: "Started",
      color: "text-purple-500",
      bgColor: "bg-purple-500"
    },
    {
      name: "ISO 27001",
      progress: 0,
      status: "Not Started",
      color: "text-amber-500",
      bgColor: "bg-amber-500"
    }
  ];
  
  const pendingTasks = [
    {
      id: 1,
      title: "Complete NCA ECC Domain 1 Assessment",
      dueDate: "Oct 15, 2023",
      priority: "High",
      framework: "NCA ECC"
    },
    {
      id: 2,
      title: "Review Access Control Policy",
      dueDate: "Oct 18, 2023",
      priority: "Medium",
      framework: "SAMA"
    },
    {
      id: 3,
      title: "Document Incident Response Procedures",
      dueDate: "Oct 22, 2023",
      priority: "High",
      framework: "NCA ECC"
    },
    {
      id: 4,
      title: "Update Data Classification Policy",
      dueDate: "Oct 30, 2023",
      priority: "Medium",
      framework: "PDPL"
    }
  ];
  
  const recentAssessments = [
    {
      id: 1,
      name: "NCA ECC Domain 2: Risk Management",
      date: "Oct 1, 2023",
      score: 78,
      status: "Completed"
    },
    {
      id: 2,
      name: "SAMA Control Set: Access Control",
      date: "Sep 28, 2023",
      score: 65,
      status: "Completed"
    },
    {
      id: 3,
      name: "NCA ECC Domain 3: Security Policy",
      date: "Sep 25, 2023",
      score: 82,
      status: "Completed"
    }
  ];
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>;
      case "Medium":
        return <Badge variant="default" className="bg-amber-500">Medium</Badge>;
      case "Low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };
  
  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">Strong ({score}%)</Badge>;
    if (score >= 60) return <Badge className="bg-amber-500">Moderate ({score}%)</Badge>;
    return <Badge variant="destructive">Weak ({score}%)</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compliance Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Generate Report</Button>
          <Button>Start Assessment</Button>
        </div>
      </div>
      
      {/* Overall Compliance Score */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Overall Compliance Status
          </CardTitle>
          <CardDescription>
            Combined compliance score across all frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 rounded-full flex items-center justify-center border-8 border-primary/30 relative">
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">72%</span>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Overall Score</div>
                <div className="text-xl font-bold mt-1">Moderate</div>
                <div className="text-sm text-muted-foreground mt-1">Last updated: Oct 8, 2023</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 md:w-1/2">
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <CheckCircle2 className="h-5 w-5 text-green-500 mb-1" />
                <div className="text-xs text-muted-foreground">Compliant</div>
                <div className="text-lg font-bold">42</div>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <AlertTriangle className="h-5 w-5 text-amber-500 mb-1" />
                <div className="text-xs text-muted-foreground">Partial</div>
                <div className="text-lg font-bold">28</div>
              </div>
              <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-primary/5 border border-primary/10">
                <AlertTriangle className="h-5 w-5 text-red-500 mb-1" />
                <div className="text-xs text-muted-foreground">Non-Compliant</div>
                <div className="text-lg font-bold">15</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Framework Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {frameworkProgress.map((framework, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CheckCircle2 className={`mr-2 h-4 w-4 ${framework.color}`} />
                {framework.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{framework.progress}%</span>
                </div>
                <Progress value={framework.progress} className="h-2" />
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="text-xs">
                    {framework.status}
                  </Badge>
                  <Button variant="ghost" size="sm" className="h-7 text-xs p-0">
                    <span>View Details</span>
                    <ChevronRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Tabs section */}
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks" className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            Pending Tasks
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center">
            <FileClock className="mr-2 h-4 w-4" />
            Recent Assessments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pending Compliance Tasks</CardTitle>
              <CardDescription>
                Tasks that require your attention to improve your compliance posture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-9 bg-muted p-3 text-xs font-medium">
                  <div className="col-span-4">Task</div>
                  <div className="col-span-2">Framework</div>
                  <div className="col-span-1">Due Date</div>
                  <div className="col-span-1">Priority</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                <div className="divide-y">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="grid grid-cols-9 p-3 text-sm items-center"
                    >
                      <div className="col-span-4 font-medium">{task.title}</div>
                      <div className="col-span-2 text-muted-foreground">{task.framework}</div>
                      <div className="col-span-1 text-muted-foreground">{task.dueDate}</div>
                      <div className="col-span-1">{getPriorityBadge(task.priority)}</div>
                      <div className="col-span-1 text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 4 of 12 pending tasks
              </div>
              <Button variant="outline" size="sm">
                View All Tasks
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Assessments</CardTitle>
              <CardDescription>
                Your most recent compliance assessments and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-8 bg-muted p-3 text-xs font-medium">
                  <div className="col-span-4">Assessment</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1">Score</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                <div className="divide-y">
                  {recentAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="grid grid-cols-8 p-3 text-sm items-center"
                    >
                      <div className="col-span-4 font-medium">{assessment.name}</div>
                      <div className="col-span-1 text-muted-foreground">{assessment.date}</div>
                      <div className="col-span-1">{getScoreBadge(assessment.score)}</div>
                      <div className="col-span-1">
                        <Badge variant="outline" className="bg-primary/5">
                          {assessment.status}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-right">
                        <Button variant="ghost" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <div className="text-sm text-muted-foreground">
                Showing 3 of 8 assessments
              </div>
              <Button variant="outline" size="sm">
                View All Assessments
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Policies access section */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Organizational Policies
          </CardTitle>
          <CardDescription>
            Access and review your organization's compliance policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary/70" />
              <span>Information Security Policy</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary/70" />
              <span>Access Control Policy</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary/70" />
              <span>Data Classification Policy</span>
            </Button>
            <Button variant="default" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <BarChart3 className="h-8 w-8" />
              <span>View All Policies</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}