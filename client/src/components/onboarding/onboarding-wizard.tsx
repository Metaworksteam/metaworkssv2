import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { OnboardingStep, UserProgress } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle2, ArrowRight, Award, BookOpen, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function OnboardingWizard() {
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("content");
  const { toast } = useToast();

  // Fetch onboarding steps
  const { data: steps, isLoading: stepsLoading } = useQuery<OnboardingStep[]>({
    queryKey: ["/api/onboarding/steps"],
    staleTime: 60 * 1000, // 1 minute
  });

  // Fetch user progress if user is logged in
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress[]>({
    queryKey: ["/api/onboarding/progress", user?.id],
    enabled: !!user?.id,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Determine which step to start with based on user progress
  useEffect(() => {
    if (steps && userProgress) {
      const incompleteStep = findFirstIncompleteStep(steps, userProgress);
      if (incompleteStep !== -1) {
        setActiveStep(incompleteStep);
      }
    }
  }, [steps, userProgress]);

  // Save user progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: async (progress: { stepId: number; completed: boolean; score?: number }) => {
      return apiRequest("POST", "/api/onboarding/progress", progress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/progress", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/gamification/user-stats"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving progress",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Find the first incomplete step
  const findFirstIncompleteStep = (steps: OnboardingStep[], progress: UserProgress[]): number => {
    if (!steps || !progress) return 0;
    
    // Map step IDs to their completion status
    const completionMap = progress.reduce((acc, curr) => {
      acc[curr.stepId] = curr.completed;
      return acc;
    }, {} as Record<number, boolean>);

    // Find first incomplete step
    for (let i = 0; i < steps.length; i++) {
      const stepId = steps[i].id;
      if (!completionMap[stepId]) {
        return i;
      }
    }
    
    return 0; // Default to first step if all completed
  };

  // Mark current step as complete and move to next step
  const completeStep = async (stepId: number, score?: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your progress",
        variant: "default",
      });
      return;
    }

    await updateProgressMutation.mutateAsync({
      stepId,
      completed: true,
      score,
    });

    if (steps && activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      setActiveTab("content"); // Reset to content tab for new step
      
      toast({
        title: "Step completed!",
        description: `Moving to ${steps[activeStep + 1]?.title}`,
        variant: "default",
      });
    } else {
      toast({
        title: "Onboarding Complete!",
        description: "You have completed all onboarding steps",
        variant: "default",
      });
    }
  };

  // Calculate overall progress
  const calculateProgress = (): number => {
    if (!steps || !userProgress) return 0;
    
    const completedSteps = userProgress.filter(p => p.completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  // Check if a step is completed
  const isStepCompleted = (stepId: number): boolean => {
    if (!userProgress) return false;
    const progress = userProgress.find(p => p.stepId === stepId);
    return progress?.completed || false;
  };

  // Loading state
  if (stepsLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No steps found
  if (!steps || steps.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-muted-foreground">No onboarding steps available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentStep = steps[activeStep];

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Onboarding Progress</h3>
          <span className="text-sm text-muted-foreground">{calculateProgress()}%</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
      </div>

      {/* Step list */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {steps.map((step, index) => (
          <Button
            key={step.id}
            variant={activeStep === index ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => setActiveStep(index)}
          >
            {isStepCompleted(step.id) ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs">
                {index + 1}
              </span>
            )}
            {step.title}
          </Button>
        ))}
      </div>

      {/* Current step card */}
      <Card className="border border-border/40 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{currentStep.title}</CardTitle>
              <CardDescription>{currentStep.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{currentStep.estimatedDuration} min</span>
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>{currentStep.points} points</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="quiz" disabled={currentStep.type !== 'quiz'}>
                Quiz
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="p-0">
            <CardContent className="pt-6">
              <div className="prose prose-invert max-w-none">
                {currentStep?.content && typeof currentStep.content === 'object' && 'content' in currentStep.content ? (
                  <div dangerouslySetInnerHTML={{ __html: currentStep.content.content as string }} />
                ) : (
                  <p className="text-muted-foreground">Content not available</p>
                )}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="quiz" className="p-0">
            <CardContent className="pt-6">
              {currentStep?.content && currentStep.type === 'quiz' && typeof currentStep.content === 'object' && 'questions' in currentStep.content ? (
                <div className="space-y-4">
                  <p className="font-medium">Test your knowledge</p>
                  <p className="text-sm text-muted-foreground">
                    Complete this quiz to earn points and mark this step as complete.
                  </p>
                  {/* Quiz implementation would go here */}
                  <p className="text-sm text-muted-foreground italic">
                    Quiz content will be implemented in a future update.
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No quiz available for this step</p>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>

        <CardFooter className="flex justify-between py-4">
          <Button
            variant="outline"
            onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          
          <div className="space-x-2">
            {!isStepCompleted(currentStep.id) ? (
              <Button 
                onClick={() => completeStep(currentStep.id)} 
                disabled={updateProgressMutation.isPending}
              >
                {updateProgressMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Mark Complete
              </Button>
            ) : (
              <Button
                onClick={() => activeStep < steps.length - 1 && setActiveStep(activeStep + 1)}
                disabled={activeStep === steps.length - 1}
              >
                Next Step
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Badges section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="h-5 w-5" />
            Available Badges
          </CardTitle>
          <CardDescription>
            Complete onboarding steps to earn badges
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Badge display would go here */}
            <div className="flex items-center justify-center h-24 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">Badges loading...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}