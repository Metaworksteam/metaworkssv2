import React, { useState } from "react";
import { SecurityProgressTimeline, TimelineEvent } from "@/components/timeline/security-progress-timeline";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SecurityTimelineDemo() {
  // Controls for the demo
  const [activeTab, setActiveTab] = useState<string>("example1");
  const [animationEnabled, setAnimationEnabled] = useState<boolean>(true);
  const [showIcons, setShowIcons] = useState<boolean>(true);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  
  // Sample data for the timeline
  const securityMilestones: TimelineEvent[] = [
    {
      id: 1,
      title: "SAMA Framework Assessment Completed",
      description: "Successfully completed the SAMA cybersecurity framework assessment with a high score.",
      date: "2025-03-25",
      type: "assessment",
      status: "completed",
      frameworkName: "SAMA Framework",
      score: 85
    },
    {
      id: 2,
      title: "Security Policies Updated",
      description: "Updated all security policies to align with the latest compliance requirements.",
      date: "2025-03-15",
      type: "milestone",
      status: "completed"
    },
    {
      id: 3,
      title: "NCA ECC Assessment In Progress",
      description: "Started assessment against the NCA Essential Cybersecurity Controls framework.",
      date: "2025-04-01",
      type: "assessment",
      status: "in-progress",
      frameworkName: "NCA ECC",
      score: 42
    },
    {
      id: 4,
      title: "Critical Vulnerability Detected",
      description: "A critical vulnerability was detected in the authentication system. Remediation in progress.",
      date: "2025-02-28",
      type: "risk",
      status: "in-progress"
    },
    {
      id: 5,
      title: "Security Awareness Training",
      description: "Conducted organization-wide security awareness training for all employees.",
      date: "2025-02-15",
      type: "improvement",
      status: "completed"
    },
    {
      id: 6,
      title: "ISO 27001 Certification",
      description: "Planned ISO 27001 certification assessment and preparation.",
      date: "2025-05-15",
      type: "compliance",
      status: "planned"
    },
    {
      id: 7,
      title: "Penetration Testing",
      description: "Conducted external penetration testing to identify vulnerabilities.",
      date: "2025-01-20",
      type: "assessment",
      status: "completed",
      score: 72
    },
    {
      id: 8,
      title: "Compliance Audit Overdue",
      description: "Quarterly compliance audit is overdue and needs to be scheduled.",
      date: "2025-03-31",
      type: "compliance",
      status: "overdue"
    }
  ];
  
  // Example set focused on assessment events
  const assessmentEvents = securityMilestones.filter(
    event => event.type === 'assessment'
  );
  
  // Example set focused on high priority items (risks and overdue items)
  const highPriorityEvents = securityMilestones.filter(
    event => event.type === 'risk' || event.status === 'overdue'
  );
  
  return (
    <DashboardLayout>
      <div className="container py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security Progress Timeline</h1>
          <p className="text-muted-foreground mt-2">
            Interactive timeline showing security milestones, assessments, and progress
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Timeline Configuration</CardTitle>
            <CardDescription>
              Adjust settings to customize the timeline display
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="animation-toggle">Animation</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Enable animation effects</span>
                  <Switch 
                    id="animation-toggle"
                    checked={animationEnabled} 
                    onCheckedChange={setAnimationEnabled} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icons-toggle">Show Icons</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Display event type icons</span>
                  <Switch 
                    id="icons-toggle"
                    checked={showIcons} 
                    onCheckedChange={setShowIcons} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="compact-toggle">Compact Mode</Label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Use minimalist display</span>
                  <Switch 
                    id="compact-toggle"
                    checked={isCompact} 
                    onCheckedChange={setIsCompact} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visible-count">Visible Events</Label>
                <Select 
                  value={visibleCount.toString()} 
                  onValueChange={(val) => setVisibleCount(parseInt(val))}
                >
                  <SelectTrigger id="visible-count">
                    <SelectValue placeholder="Number of visible events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 events</SelectItem>
                    <SelectItem value="5">5 events</SelectItem>
                    <SelectItem value="8">All events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="example1">All Events</TabsTrigger>
            <TabsTrigger value="example2">Assessments</TabsTrigger>
            <TabsTrigger value="example3">High Priority</TabsTrigger>
          </TabsList>
          
          <TabsContent value="example1" className="pt-6">
            <SecurityProgressTimeline 
              events={securityMilestones}
              maxVisible={visibleCount}
              showIcons={showIcons}
              compact={isCompact}
              animate={animationEnabled}
            />
          </TabsContent>
          
          <TabsContent value="example2" className="pt-6">
            <SecurityProgressTimeline 
              events={assessmentEvents}
              maxVisible={visibleCount}
              showIcons={showIcons}
              compact={isCompact}
              animate={animationEnabled}
            />
          </TabsContent>
          
          <TabsContent value="example3" className="pt-6">
            <SecurityProgressTimeline 
              events={highPriorityEvents}
              maxVisible={visibleCount}
              showIcons={showIcons}
              compact={isCompact}
              animate={animationEnabled}
            />
          </TabsContent>
        </Tabs>
        
        <Separator className="my-8" />
        
        <Card>
          <CardHeader>
            <CardTitle>Compact Timeline View</CardTitle>
            <CardDescription>
              Space-efficient timeline variant for sidebar or dashboard widgets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityProgressTimeline 
              events={securityMilestones.slice(0, 4)}
              maxVisible={4}
              compact={true}
              animate={animationEnabled}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}