import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle2, AlertCircle, XCircle, HelpCircle } from "lucide-react";
import { Framework, Domain, Control } from "@shared/schema";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Progress } from "@/components/ui/progress";

// Component for displaying SAMA maturity levels
const MaturityLevel = ({ level }: { level: string }) => {
  const getMaturityColor = (level: string) => {
    switch (level) {
      case "baseline": return "bg-gray-200 text-gray-800";
      case "evolving": return "bg-blue-200 text-blue-800";
      case "established": return "bg-green-200 text-green-800";
      case "predictable": return "bg-purple-200 text-purple-800";
      case "leading": return "bg-amber-200 text-amber-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <Badge className={`${getMaturityColor(level)} rounded-md px-2 py-1`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </Badge>
  );
};

// Component for displaying controls for a specific domain
const DomainControls = ({ domainId }: { domainId: number }) => {
  const { toast } = useToast();
  
  const { data: controls, isLoading, error } = useQuery({
    queryKey: ['/api/controls', domainId],
    queryFn: async () => {
      const response = await fetch(`/api/controls?domainId=${domainId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch domain controls');
      }
      return response.json();
    }
  });

  // Display error message if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `Failed to load controls: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((index) => (
          <Card key={index} className="border border-border/40">
            <CardHeader className="pb-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getMaturityLevelFromScore = (score: number) => {
    switch (score) {
      case 1: return "baseline";
      case 2: return "evolving";
      case 3: return "established";
      case 4: return "predictable";
      case 5: return "leading";
      default: return "baseline";
    }
  };

  return (
    <div className="space-y-4">
      {controls?.map((control: Control) => {
        // Extract SAMA specific properties from frameworKSpecific JSON
        const samaMaturityLevel = control.frameworkSpecific ? 
          (control.frameworkSpecific as any).samaMaturityLevel || "baseline" : 
          getMaturityLevelFromScore(control.maturityLevel || 1);
          
        const samaDescription = control.frameworkSpecific ? 
          (control.frameworkSpecific as any).samaMaturityDescription || "" : 
          "";
          
        const assessmentCriteria = control.frameworkSpecific ? 
          (control.frameworkSpecific as any).assessmentCriteria || [] : 
          [];
          
        return (
          <Card key={control.id} className="border border-border/40">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {control.controlId}: {control.name}
                  </CardTitle>
                  <CardDescription>{control.description}</CardDescription>
                </div>
                <MaturityLevel level={samaMaturityLevel} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                    <Info className="h-4 w-4" /> Maturity Description
                  </h4>
                  <p className="text-sm text-muted-foreground">{samaDescription}</p>
                </div>
                
                {assessmentCriteria.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-1">Assessment Criteria</h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {assessmentCriteria.map((criteria: string, index: number) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-2">
                  <h4 className="font-medium text-sm mb-1">Maturity Progress</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Baseline</span>
                      <span>Leading</span>
                    </div>
                    <Progress 
                      value={(control.maturityLevel || 1) * 20} 
                      className="h-2" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm">
                    Start Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default function SAMAFrameworkPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("");
  
  // Fetch the SAMA framework
  const { data: samaFramework, isLoading: frameworkLoading } = useQuery({
    queryKey: ['/api/frameworks/sama'],
    queryFn: async () => {
      const response = await fetch(`/api/frameworks?name=SAMA Cyber Security Framework`);
      if (!response.ok) {
        throw new Error('Failed to fetch SAMA framework');
      }
      const frameworks = await response.json();
      return frameworks[0];
    }
  });
  
  // Fetch domains for the SAMA framework
  const { data: domains, isLoading: domainsLoading, error } = useQuery({
    queryKey: ['/api/domains', samaFramework?.id],
    queryFn: async () => {
      if (!samaFramework?.id) return [];
      const response = await fetch(`/api/domains?frameworkId=${samaFramework.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch framework domains');
      }
      return response.json();
    },
    enabled: !!samaFramework?.id
  });
  
  // Set active tab when domains are loaded
  useEffect(() => {
    if (domains && domains.length > 0 && !activeTab) {
      setActiveTab(domains[0].id.toString());
    }
  }, [domains, activeTab]);
  
  // Display error message if query fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: `Failed to load SAMA framework data: ${error.message}`,
        variant: "destructive",
      });
    }
  }, [error, toast]);
  
  const isLoading = frameworkLoading || domainsLoading;
  
  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">SAMA Cyber Security Framework</h1>
          <p className="text-muted-foreground mt-1">
            Assessment based on the Saudi Central Bank (SAMA) Cyber Security Framework
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>About the SAMA Framework</CardTitle>
            <CardDescription>
              The SAMA Cyber Security Framework provides a maturity-based approach to cybersecurity assessment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                SAMA's framework uses a maturity model with five levels to assess cybersecurity capabilities:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <h3 className="font-medium mb-1">Baseline</h3>
                  <p className="text-sm text-muted-foreground">Basic controls with minimal implementation</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
                  <h3 className="font-medium mb-1">Evolving</h3>
                  <p className="text-sm text-muted-foreground">Controls are documented but not fully consistent</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-md">
                  <h3 className="font-medium mb-1">Established</h3>
                  <p className="text-sm text-muted-foreground">Well-defined and consistently implemented</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-md">
                  <h3 className="font-medium mb-1">Predictable</h3>
                  <p className="text-sm text-muted-foreground">Measured and managed with quantitative data</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded-md">
                  <h3 className="font-medium mb-1">Leading</h3>
                  <p className="text-sm text-muted-foreground">Optimized with continuous improvement</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-[500px] w-full rounded-md" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 w-full">
              {domains?.map((domain: Domain) => (
                <TabsTrigger key={domain.id} value={domain.id.toString()}>
                  {domain.displayName}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {domains?.map((domain: Domain) => (
              <TabsContent key={domain.id} value={domain.id.toString()} className="pt-4">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">{domain.displayName}</h2>
                  <p className="text-muted-foreground">{domain.description}</p>
                </div>
                <DomainControls domainId={domain.id} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
}