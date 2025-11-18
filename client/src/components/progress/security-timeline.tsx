import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle,

  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface TimelineStep {
  id: number;
  title: string;
  description: string | null;
  order: number;
  type: string;
  points: number;
  estimatedDuration: number;
  completed?: boolean;
  startedAt?: string | null;
  completedAt?: string | null;
  status?: 'not_started' | 'in_progress' | 'completed';
}

export function SecurityTimeline() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const { toast } = useToast();
  
  const { data: timelineSteps, isLoading, error } = useQuery<TimelineStep[]>({
    queryKey: ['/api/progress/timeline'],
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="w-full h-24" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Failed to load timeline</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </CardContent>
      </Card>
    );
  }

  // Sort timeline steps by order
  const sortedSteps = timelineSteps?.sort((a, b) => a.order - b.order) || [];
  
  // Find the most recent in-progress step
  const currentStep = sortedSteps.find(step => step.status === 'in_progress') || 
                     sortedSteps.find(step => step.status === 'not_started') ||
                     sortedSteps[sortedSteps.length - 1];
  
  // Calculate overall progress
  const completedSteps = sortedSteps.filter(step => step.status === 'completed').length;
  const totalSteps = sortedSteps.length;
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div>
              <h3 className="text-xl font-semibold">Security Journey Progress</h3>
              <p className="text-muted-foreground">
                {completedSteps} of {totalSteps} steps completed
              </p>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              {progressPercentage.toFixed(0)}% Complete
            </Badge>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {sortedSteps.map((step) => (
          <TimelineItem 
            key={step.id}
            step={step}
            isActive={activeStep === step.id}
            onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelineItemProps {
  step: TimelineStep;
  isActive: boolean;
  onClick: () => void;
}

function TimelineItem({ step, isActive, onClick }: TimelineItemProps) {
  const StatusIcon = {
    completed: () => <CheckCircle2 className="h-6 w-6 text-green-500" />,
    in_progress: () => <Clock className="h-6 w-6 text-amber-500" />,
    not_started: () => <Clock className="h-6 w-6 text-muted-foreground" />,
  }[step.status || 'not_started'];

  const formatTimeEstimate = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <Card className={`border-l-4 ${
      step.status === 'completed' ? 'border-l-green-500' :
      step.status === 'in_progress' ? 'border-l-amber-500' : 'border-l-muted-foreground'
    }`}>
      <CardContent className="p-0">
        <div 
          className="p-4 flex items-center cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={onClick}
        >
          <div className="mr-4">
            <StatusIcon />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">{step.title}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="px-2">
                  {step.points} pts
                </Badge>
                <Badge variant="secondary" className="text-xs px-2">
                  {formatTimeEstimate(step.estimatedDuration)}
                </Badge>
                <ChevronRight className={`h-5 w-5 transition-transform ${isActive ? 'rotate-90' : ''}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{step.type}</p>
          </div>
        </div>
        
        {isActive && (
          <div className="p-4 pt-0 border-t">
            {step.description && (
              <p className="text-sm mb-4">{step.description}</p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {step.startedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Started</p>
                  <p className="text-sm">{format(new Date(step.startedAt), 'MMM d, yyyy')}</p>
                </div>
              )}
              
              {step.completedAt && (
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-sm">{format(new Date(step.completedAt), 'MMM d, yyyy')}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm capitalize">{step.status?.replace('_', ' ')}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-2">
              {step.status !== 'completed' && (
                <Button size="sm">
                  {step.status === 'not_started' ? 'Start' : 'Continue'}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}