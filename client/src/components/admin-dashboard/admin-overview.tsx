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
  Users,
  Building2,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle,
  Shield,
  XCircle,
  BarChart,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminOverview() {
  // Dummy data for demonstration
  const statsCards = [
    {
      title: "Total Users",
      value: "412",
      change: "+12%",
      trend: "up",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Organizations",
      value: "43",
      change: "+5%",
      trend: "up",
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: "Assessments",
      value: "187",
      change: "+8%",
      trend: "up",
      icon: <ClipboardCheck className="h-5 w-5" />
    },
    {
      title: "Compliance Avg",
      value: "68%",
      change: "-2%",
      trend: "down",
      icon: <Shield className="h-5 w-5" />
    }
  ];
  
  const recentUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      company: "TechSolutions Inc.",
      role: "Admin",
      joinDate: "Oct 5, 2023"
    },
    {
      id: 2,
      name: "Mark Williams",
      email: "m.williams@example.com",
      company: "Global Services Ltd.",
      role: "User",
      joinDate: "Oct 3, 2023"
    },
    {
      id: 3,
      name: "Jessica Lee",
      email: "jessica@example.com",
      company: "Innovate Systems",
      role: "User",
      joinDate: "Oct 2, 2023"
    },
    {
      id: 4,
      name: "David Chen",
      email: "d.chen@example.com",
      company: "Secure Networks",
      role: "Admin",
      joinDate: "Sep 29, 2023"
    }
  ];
  
  const recentAssessments = [
    {
      id: 1,
      organization: "TechSolutions Inc.",
      framework: "NCA ECC",
      score: 78,
      status: "Completed",
      date: "Oct 6, 2023"
    },
    {
      id: 2,
      organization: "Global Services Ltd.",
      framework: "SAMA",
      score: 65,
      status: "In Progress",
      date: "Oct 4, 2023"
    },
    {
      id: 3,
      organization: "Innovate Systems",
      framework: "PDPL",
      score: 82,
      status: "Completed",
      date: "Oct 3, 2023"
    },
    {
      id: 4,
      organization: "Secure Networks",
      framework: "ISO 27001",
      score: 91,
      status: "Completed",
      date: "Oct 1, 2023"
    }
  ];
  
  const complianceByFramework = [
    {
      name: "NCA ECC",
      compliant: 32,
      partial: 14,
      nonCompliant: 8,
      progress: 74,
      color: "bg-green-500"
    },
    {
      name: "SAMA",
      compliant: 28,
      partial: 17,
      nonCompliant: 12,
      progress: 63,
      color: "bg-blue-500"
    },
    {
      name: "PDPL",
      compliant: 18,
      partial: 8,
      nonCompliant: 6,
      progress: 69,
      color: "bg-purple-500"
    },
    {
      name: "ISO 27001",
      compliant: 40,
      partial: 11,
      nonCompliant: 5,
      progress: 80,
      color: "bg-amber-500"
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-primary">Admin</Badge>;
      case "User":
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">User</Badge>;
    }
  };
  
  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">{score}%</Badge>;
    if (score >= 60) return <Badge className="bg-amber-500">{score}%</Badge>;
    return <Badge variant="destructive">{score}%</Badge>;
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case "In Progress":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administration Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Create Report</Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-2">
                  {stat.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="ml-auto flex items-center">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold mt-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.title}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Framework Compliance Overview */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            Compliance by Framework
          </CardTitle>
          <CardDescription>
            Overview of compliance status across all frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            {complianceByFramework.map((framework, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="font-medium">{framework.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {framework.progress}% Compliant
                  </div>
                </div>
                <Progress value={framework.progress} className={`h-2 ${framework.color}`} />
                <div className="grid grid-cols-3 text-xs gap-4 pt-1">
                  <div className="flex items-center">
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-muted-foreground">Compliant: {framework.compliant}</span>
                  </div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1 text-amber-500" />
                    <span className="text-muted-foreground">Partial: {framework.partial}</span>
                  </div>
                  <div className="flex items-center">
                    <XCircle className="h-3 w-3 mr-1 text-red-500" />
                    <span className="text-muted-foreground">Non-compliant: {framework.nonCompliant}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs section */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Recent Users
          </TabsTrigger>
          <TabsTrigger value="assessments" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            Recent Assessments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent User Registrations</CardTitle>
              <CardDescription>
                New users who have joined the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-10 bg-muted p-3 text-xs font-medium">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Company</div>
                  <div className="col-span-1">Role</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                <div className="divide-y">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-10 p-3 text-sm items-center"
                    >
                      <div className="col-span-3 font-medium">{user.name}</div>
                      <div className="col-span-3 text-muted-foreground">{user.email}</div>
                      <div className="col-span-2 text-muted-foreground">{user.company}</div>
                      <div className="col-span-1">{getRoleBadge(user.role)}</div>
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
                Showing 4 of 18 recent users
              </div>
              <Button variant="outline" size="sm">
                View All Users
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Assessments</CardTitle>
              <CardDescription>
                Latest compliance assessments conducted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-10 bg-muted p-3 text-xs font-medium">
                  <div className="col-span-3">Organization</div>
                  <div className="col-span-2">Framework</div>
                  <div className="col-span-1">Score</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Date</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                <div className="divide-y">
                  {recentAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="grid grid-cols-10 p-3 text-sm items-center"
                    >
                      <div className="col-span-3 font-medium">{assessment.organization}</div>
                      <div className="col-span-2 text-muted-foreground">{assessment.framework}</div>
                      <div className="col-span-1">{getScoreBadge(assessment.score)}</div>
                      <div className="col-span-2">{getStatusBadge(assessment.status)}</div>
                      <div className="col-span-1 text-muted-foreground">{assessment.date}</div>
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
                Showing 4 of 32 recent assessments
              </div>
              <Button variant="outline" size="sm">
                View All Assessments
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Quick Actions */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart className="mr-2 h-5 w-5 text-primary" />
            Administrative Actions
          </CardTitle>
          <CardDescription>
            Quick access to common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <Users className="h-8 w-8 text-primary/70" />
              <span>Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <Building2 className="h-8 w-8 text-primary/70" />
              <span>Manage Organizations</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary/70" />
              <span>View Compliance Reports</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2">
              <Activity className="h-8 w-8 text-primary/70" />
              <span>System Audit Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}