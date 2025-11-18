import React from "react";
import { Card } from "@/components/ui/card";

// Simulated risk data
const riskData = [
  { category: "Network Security", level: "high", issues: 3 },
  { category: "Access Controls", level: "medium", issues: 2 },
  { category: "Data Protection", level: "low", issues: 1 },
  { category: "Incident Response", level: "medium", issues: 2 },
  { category: "Physical Security", level: "low", issues: 0 },
  { category: "Application Security", level: "high", issues: 4 },
  { category: "Cloud Security", level: "medium", issues: 2 },
  { category: "Third-Party Risk", level: "high", issues: 3 },
  { category: "Compliance", level: "low", issues: 1 },
];

export default function RiskHeatmap() {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-500/20 text-green-500 border-green-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "high":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };
  
  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {riskData.map((risk, index) => (
          <Card 
            key={index}
            className={`p-3 flex flex-col items-center justify-center border ${getRiskColor(risk.level)}`}
          >
            <div className="text-sm font-medium">{risk.category}</div>
            <div className="mt-1 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-1 ${
                risk.level === "low" ? "bg-green-500" : 
                risk.level === "medium" ? "bg-amber-500" : "bg-red-500"
              }`}></div>
              <span className="text-xs capitalize">{risk.level} Risk</span>
            </div>
            <div className="text-xs mt-1">
              {risk.issues} {risk.issues === 1 ? "issue" : "issues"}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">Low Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">Medium Risk</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
            <span className="text-xs text-muted-foreground">High Risk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
