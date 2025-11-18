import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  AlertTriangle, 
  Clock, 
  FileCheck, 
  CalendarCheck, 
  ShieldCheck,
  ArrowRight,
  FileWarning,
  Shield,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface TimelineEvent {
  id: string | number;
  title: string;
  description?: string;
  date: string;
  type: 'assessment' | 'milestone' | 'risk' | 'improvement' | 'compliance';
  status: 'completed' | 'in-progress' | 'planned' | 'overdue';
  frameworkName?: string;
  score?: number;
  metadata?: Record<string, any>;
}

interface SecurityProgressTimelineProps {
  events: TimelineEvent[];
  className?: string;
  maxVisible?: number;
  showIcons?: boolean;
  compact?: boolean;
  animate?: boolean;
}

export function SecurityProgressTimeline({ 
  events = [], 
  className, 
  maxVisible = 5,
  showIcons = true,
  compact = false,
  animate = true
}: SecurityProgressTimelineProps) {
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Control how many events are shown
  const displayEvents = expanded 
    ? sortedEvents 
    : sortedEvents.slice(0, maxVisible);
  
  useEffect(() => {
    // Initialize animation only when needed
    if (animate && !animationComplete) {
      // Start with no events
      setVisibleEvents([]);
      
      // Animate events appearing one by one
      let displayCount = 0;
      const interval = setInterval(() => {
        if (displayCount < displayEvents.length) {
          setVisibleEvents(prev => [...prev, displayEvents[displayCount]]);
          displayCount++;
        } else {
          clearInterval(interval);
          setAnimationComplete(true);
        }
      }, 600); // Adjust timing as needed
      
      return () => clearInterval(interval);
    } else if (!animate) {
      // If animation is disabled, just show all events immediately
      setVisibleEvents(displayEvents);
    }
  }, [animate, animationComplete, expanded]); // Only depend on animation controls and expanded state
  
  // Update visible events when displayEvents changes but only if not animating
  useEffect(() => {
    if (!animate || animationComplete) {
      setVisibleEvents(displayEvents);
    }
  }, [displayEvents, animate, animationComplete]);
  
  // Icon mapping based on event type
  const getIcon = (type: TimelineEvent['type'], status: TimelineEvent['status']) => {
    switch (type) {
      case 'assessment':
        return status === 'completed' ? <FileCheck className="h-5 w-5 text-green-500" /> 
          : status === 'in-progress' ? <Clock className="h-5 w-5 text-amber-500" />
          : status === 'overdue' ? <AlertTriangle className="h-5 w-5 text-destructive" />
          : <CalendarCheck className="h-5 w-5 text-muted-foreground" />;
      case 'milestone':
        return <Check className="h-5 w-5 text-primary" />;
      case 'risk':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'improvement':
        return <ArrowRight className="h-5 w-5 text-blue-500" />;
      case 'compliance':
        return <ShieldCheck className="h-5 w-5 text-green-500" />;
      default:
        return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };
  
  // Badge styling based on status
  const getStatusBadge = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">In Progress</Badge>;
      case 'planned':
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Planned</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">Overdue</Badge>;
      default:
        return null;
    }
  };
  
  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Security Progress Timeline</h3>
        {sortedEvents.length > maxVisible && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs"
          >
            {expanded ? (
              <>
                Show Less <ChevronUp className="h-3 w-3" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-3 w-3" />
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="relative">
        {/* Timeline line */}
        {!compact && (
          <div className="absolute left-6 top-8 bottom-8 w-px bg-border/50 z-0" />
        )}
        
        {/* Timeline events */}
        <div className="space-y-4 relative z-10">
          <AnimatePresence>
            {visibleEvents.filter(event => event !== undefined && event !== null).map((event, index) => (
              <motion.div
                key={event.id}
                initial={animate ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={cn(
                  "border border-border/40 relative backdrop-blur-sm",
                  event.status === 'completed' && "bg-green-500/5",
                  event.status === 'in-progress' && "bg-amber-500/5",
                  event.status === 'planned' && "bg-blue-500/5", 
                  event.status === 'overdue' && "bg-red-500/5"
                )}>
                  <CardHeader className={cn("pb-2", compact && "p-3")}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {showIcons && !compact && (
                          <div className="mt-1 flex-shrink-0">
                            {getIcon(event.type, event.status)}
                          </div>
                        )}
                        <div>
                          <CardTitle className={cn("flex items-start gap-2", compact && "text-sm")}>
                            {event.title}
                            {compact && getStatusBadge(event.status)}
                          </CardTitle>
                          {!compact && (
                            <CardDescription>{event.description}</CardDescription>
                          )}
                        </div>
                      </div>
                      {!compact && (
                        <div className="flex flex-col items-end gap-1">
                          {getStatusBadge(event.status)}
                          <span className="text-xs text-muted-foreground">
                            {formatDate(event.date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  {!compact && event.score !== undefined && (
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Compliance Score</span>
                          <span className="font-medium">{event.score}%</span>
                        </div>
                        <Progress value={event.score} className="h-2" />
                        {event.frameworkName && (
                          <div className="text-xs text-muted-foreground">
                            Framework: {event.frameworkName}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                  
                  {compact && (
                    <CardFooter className="pt-0 pb-2 px-3">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(event.date)}
                      </span>
                    </CardFooter>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Show "Load more" button if there are more events than initially shown */}
      {sortedEvents.length > maxVisible && !expanded && animationComplete && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setExpanded(true)}
            className="text-xs"
          >
            View Complete History
          </Button>
        </div>
      )}
    </div>
  );
}