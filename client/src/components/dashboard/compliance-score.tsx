import React from "react";
import { Progress } from "@/components/ui/progress";

interface ComplianceScoreProps {
  score: number;
}

export default function ComplianceScore({ score }: ComplianceScoreProps) {
  // Get the status based on score
  const getStatus = () => {
    if (score >= 80) return { text: "Good", color: "text-green-500" };
    if (score >= 60) return { text: "Average", color: "text-amber-500" };
    return { text: "Needs Improvement", color: "text-red-500" };
  };
  
  // Get progress color
  const getProgressColor = () => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const status = getStatus();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="text-2xl font-bold">{score}%</div>
        <div className={`text-sm ${status.color}`}>{status.text}</div>
      </div>
      
      <Progress 
        value={score} 
        max={100} 
        className="h-2 bg-muted"
        style={{ 
          "--progress-background": getProgressColor() 
        } as React.CSSProperties} 
      />
      
      <p className="text-xs text-muted-foreground mt-1">
        {80 - score > 0 ? `${80 - score}% needed for compliance` : "Compliance achieved"}
      </p>
    </div>
  );
}
