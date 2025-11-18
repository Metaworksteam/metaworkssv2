import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck, ShieldOff, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DomainData {
  domain: string;
  domainCode: string;
  controls: any[];
  implemented: number;
  partially_implemented: number;
  not_implemented: number;
  risk_level: number;
}

interface RiskHeatmapProps {
  domains?: DomainData[];
}

function RiskHeatmapComponent({ domains = [] }: RiskHeatmapProps) {
  // If no domains or empty data, show placeholder
  if (!domains || domains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 h-64 bg-card/30 backdrop-blur-sm rounded-lg border border-border/30">
        <AlertTriangle className="h-12 w-12 text-amber-500 opacity-80" />
        <h3 className="text-lg font-medium">No Risk Data Available</h3>
        <p className="text-center text-muted-foreground max-w-md">
          There is no risk data to display for this assessment. Complete an assessment to view your risk heatmap.
        </p>
      </div>
    );
  }

  // Function to determine color based on risk level
  const getRiskColor = (riskLevel: number) => {
    if (riskLevel <= 20) return "bg-emerald-600/90"; // Very Low Risk
    if (riskLevel <= 40) return "bg-green-500/90"; // Low Risk
    if (riskLevel <= 60) return "bg-amber-500/90"; // Medium Risk
    if (riskLevel <= 80) return "bg-orange-500/90"; // High Risk
    return "bg-red-600/90"; // Very High Risk
  };

  // Function to get badge colors
  const getRiskBadgeColor = (riskLevel: number) => {
    if (riskLevel <= 20) return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"; 
    if (riskLevel <= 40) return "bg-green-500/20 text-green-600 border-green-500/30"; 
    if (riskLevel <= 60) return "bg-amber-500/20 text-amber-600 border-amber-500/30"; 
    if (riskLevel <= 80) return "bg-orange-500/20 text-orange-600 border-orange-500/30"; 
    return "bg-red-500/20 text-red-600 border-red-500/30"; 
  };

  // Function to get text color
  const getTextColor = (riskLevel: number) => {
    return "text-white"; // All backgrounds are dark enough for white text
  };

  // Function to get risk level label
  const getRiskLabel = (riskLevel: number) => {
    if (riskLevel <= 20) return "Very Low";
    if (riskLevel <= 40) return "Low";
    if (riskLevel <= 60) return "Medium";
    if (riskLevel <= 80) return "High";
    return "Very High";
  };

  // Function to get risk icon
  const getRiskIcon = (riskLevel: number) => {
    if (riskLevel <= 20) return <ShieldCheck className="h-4 w-4" />;
    if (riskLevel <= 40) return <Shield className="h-4 w-4" />;
    if (riskLevel <= 60) return <ShieldAlert className="h-4 w-4" />;
    if (riskLevel <= 80) return <ShieldOff className="h-4 w-4" />;
    return <ShieldOff className="h-4 w-4" />;
  };

  // Calculate compliance percentage for visual bars
  const getCompliancePercentage = (domain: DomainData) => {
    const total = domain.implemented + domain.partially_implemented + domain.not_implemented;
    if (total === 0) return 0;
    
    // Full compliance for implemented, half for partially implemented
    return Math.round(((domain.implemented * 1.0) + (domain.partially_implemented * 0.5)) / total * 100);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-2">
          {domains.map((domain, index) => {
            const compliancePercentage = getCompliancePercentage(domain);
            return (
              <Card key={index} className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className={`h-1.5 ${getRiskColor(domain.risk_level)}`}></div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-base font-medium flex items-center">
                        {domain.domainCode} - {domain.domain}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 ml-1.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-xs">
                              Risk level is calculated based on control implementation status and criticality
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        {domain.controls.length} controls
                      </div>
                    </div>
                    <Badge className={`${getRiskBadgeColor(domain.risk_level)}`}>
                      <span className="flex items-center gap-1">
                        {getRiskIcon(domain.risk_level)}
                        {getRiskLabel(domain.risk_level)} Risk
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-muted-foreground">Compliance</span>
                      <span className="font-medium">{compliancePercentage}%</span>
                    </div>
                    <Progress value={compliancePercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-md py-2 px-2">
                      <span className="text-lg font-semibold text-emerald-600">{domain.implemented}</span>
                      <span className="block text-xs text-muted-foreground">Implemented</span>
                    </div>
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-md py-2 px-2">
                      <span className="text-lg font-semibold text-amber-600">{domain.partially_implemented}</span>
                      <span className="block text-xs text-muted-foreground">Partial</span>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-md py-2 px-2">
                      <span className="text-lg font-semibold text-red-600">{domain.not_implemented}</span>
                      <span className="block text-xs text-muted-foreground">Not Impl.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 p-2 bg-card/30 backdrop-blur-sm rounded-lg border border-border/30">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-emerald-600/90 mr-2"></div>
            <span className="text-xs font-medium">Very Low Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-green-500/90 mr-2"></div>
            <span className="text-xs font-medium">Low Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-amber-500/90 mr-2"></div>
            <span className="text-xs font-medium">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-orange-500/90 mr-2"></div>
            <span className="text-xs font-medium">High Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-sm bg-red-600/90 mr-2"></div>
            <span className="text-xs font-medium">Very High Risk</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

// Sample data for dashboard view when no props are provided
const sampleDomainData: DomainData[] = [
  {
    domain: "Governance",
    domainCode: "GOV",
    controls: new Array(12),
    implemented: 5,
    partially_implemented: 4,
    not_implemented: 3,
    risk_level: 40
  },
  {
    domain: "Defense",
    domainCode: "DEF",
    controls: new Array(8),
    implemented: 6,
    partially_implemented: 1,
    not_implemented: 1,
    risk_level: 20
  },
  {
    domain: "Resilience",
    domainCode: "RES",
    controls: new Array(10),
    implemented: 4,
    partially_implemented: 3,
    not_implemented: 3,
    risk_level: 60
  },
  {
    domain: "Risk Management",
    domainCode: "RISK",
    controls: new Array(7),
    implemented: 2,
    partially_implemented: 2,
    not_implemented: 3,
    risk_level: 70
  }
];

// Default export with data fetching for dashboard
export default function RiskHeatmap() {
  const { data: riskData, isLoading, error } = useQuery({
    queryKey: ["/api/risk-prediction/dashboard"],
    retry: 1,
  });
  
  // If still loading or no data, show loading state or sample data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-muted-foreground">Loading risk data...</p>
        </div>
      </div>
    );
  }
  
  // If there is an error or no risk data
  if (error || !riskData || !riskData.domain_risk_distribution) {
    return <RiskHeatmapComponent domains={[]} />;
  }
  
  // Map API data to the format expected by the heatmap component
  const domainData: DomainData[] = riskData.high_risk_domains?.map((domain: any) => {
    return {
      domain: domain.domain,
      domainCode: domain.domain_code || domain.domain.substring(0, 3).toUpperCase(),
      controls: domain.control_risks || [],
      implemented: domain.implemented || 0,
      partially_implemented: domain.partially_implemented || 0,
      not_implemented: domain.not_implemented || 0,
      risk_level: 
        domain.risk_level === "High" ? 80 :
        domain.risk_level === "Medium" ? 60 :
        domain.risk_level === "Low" ? 40 : 20
    };
  }) || [];
  
  // If no data is available from the API, fallback to sample data for demonstration
  if (domainData.length === 0) {
    // For demo purposes, otherwise we would just show empty state
    return <RiskHeatmapComponent domains={sampleDomainData} />;
  }
  
  return <RiskHeatmapComponent domains={domainData} />;
}

// Named export for when data is provided
export { RiskHeatmapComponent };