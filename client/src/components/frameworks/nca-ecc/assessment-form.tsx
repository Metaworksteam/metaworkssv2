import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, HelpCircle, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the schema for a single control assessment
const controlAssessmentSchema = z.object({
  controlId: z.string(),
  status: z.enum(["implemented", "partially-implemented", "not-implemented", "not-applicable"]),
  evidence: z.string().optional(),
  notes: z.string().optional(),
});

// Define the schema for the entire assessment form
const assessmentFormSchema = z.object({
  companyId: z.number(),
  frameworkId: z.number(),
  domainId: z.number(),
  controls: z.array(controlAssessmentSchema),
});

type ControlAssessment = z.infer<typeof controlAssessmentSchema>;
type AssessmentFormValues = z.infer<typeof assessmentFormSchema>;

// Mock data for the ECC Domain 1 controls
const domain1Controls = [
  {
    id: "1-1-1",
    name: "Cybersecurity Strategy Development",
    description: "The organization must develop a cybersecurity strategy approved by the head of the organization, and it must be aligned with the organization's business strategy.",
    requirement: "The organization's cybersecurity strategy must include the following at minimum: cybersecurity vision, mission, strategic goals, and strategic initiatives."
  },
  {
    id: "1-1-2",
    name: "Cybersecurity Strategy Implementation",
    description: "The organization must develop and implement an operational plan for the cybersecurity strategy.",
    requirement: "The operational plan must include projects, timelines, KPIs, and responsible stakeholders for implementing the strategy."
  },
  {
    id: "1-1-3",
    name: "Cybersecurity Strategy Review",
    description: "The organization must review the cybersecurity strategy annually or when significant changes occur in the business or threat landscape.",
    requirement: "Document any revisions and maintain records of strategy reviews and approvals."
  },
  {
    id: "1-2-1",
    name: "Cybersecurity Governance Structure",
    description: "The organization must establish a governance structure for cybersecurity that defines clear roles and responsibilities.",
    requirement: "This structure must include executive leadership involvement and reporting lines for cybersecurity functions."
  },
  {
    id: "1-2-2",
    name: "Cybersecurity Risk Management",
    description: "The organization must implement a cybersecurity risk management process.",
    requirement: "This process must include risk identification, assessment, treatment, and regular monitoring and reporting."
  }
];

// Status options with icons and colors
const statusOptions = [
  { 
    value: "implemented", 
    label: "Implemented", 
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    description: "The control is fully implemented and operating effectively",
    color: "bg-green-500/10 text-green-500 border-green-500/20"
  },
  { 
    value: "partially-implemented", 
    label: "Partially Implemented", 
    icon: <HelpCircle className="h-4 w-4 text-amber-500" />,
    description: "The control is partially implemented or not fully effective",
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  { 
    value: "not-implemented", 
    label: "Not Implemented", 
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    description: "The control is not implemented",
    color: "bg-red-500/10 text-red-500 border-red-500/20"
  },
  { 
    value: "not-applicable", 
    label: "Not Applicable", 
    icon: <HelpCircle className="h-4 w-4 text-gray-400" />,
    description: "The control is not applicable to your organization",
    color: "bg-gray-500/10 text-gray-400 border-gray-400/20"
  }
];

export default function NcaEccAssessmentForm() {
  const [activeControlIndex, setActiveControlIndex] = useState(0);
  const { toast } = useToast();
  
  // Initialize form with default values
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentFormSchema),
    defaultValues: {
      companyId: 1, // This would come from the current company context
      frameworkId: 1, // This is for NCA ECC
      domainId: 1, // Starting with Domain 1
      controls: domain1Controls.map(control => ({
        controlId: control.id,
        status: "not-implemented" as const,
        evidence: "",
        notes: ""
      }))
    }
  });

  // Calculate progress
  const completedControls = form.watch("controls").filter(
    control => control.status !== "not-implemented"
  ).length;
  
  const progressPercentage = Math.round((completedControls / domain1Controls.length) * 100);

  // Handle form submission
  const onSubmit = async (data: AssessmentFormValues) => {
    console.log("Assessment data:", data);
    
    try {
      // Send assessment data to the server
      const response = await fetch('/api/assessment-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assessmentId: 1, // This would normally come from the current assessment context
          results: data.controls.map(control => ({
            controlId: parseInt(control.controlId.split('-').pop() || '1'),
            status: control.status === 'partially-implemented' ? 'partially_implemented' : control.status,
            evidence: control.evidence || null,
            comments: control.notes || null,
            updatedBy: 1 // This would normally come from the current user context
          }))
        }),
        credentials: 'include'
      });
      
      if (response.ok) {
        toast({
          title: "Assessment Saved",
          description: "Your domain assessment has been saved successfully.",
        });
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to save assessment');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save assessment",
        variant: "destructive"
      });
    }
  };

  // Navigation functions
  const goToNextControl = () => {
    if (activeControlIndex < domain1Controls.length - 1) {
      setActiveControlIndex(activeControlIndex + 1);
    }
  };

  const goToPreviousControl = () => {
    if (activeControlIndex > 0) {
      setActiveControlIndex(activeControlIndex - 1);
    }
  };

  // Get the active control
  const activeControl = domain1Controls[activeControlIndex];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Domain 1: Cybersecurity Governance</CardTitle>
                <CardDescription>
                  Assessment for Essential Cybersecurity Controls (ECC-1:2018)
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  Progress: {completedControls} of {domain1Controls.length} controls
                </div>
                <Progress value={progressPercentage} className="h-2 w-[200px] mt-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Control navigation indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium">
                  Control {activeControlIndex + 1} of {domain1Controls.length}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToPreviousControl}
                  disabled={activeControlIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={goToNextControl}
                  disabled={activeControlIndex === domain1Controls.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg backdrop-blur-sm bg-card/30">
              <div className="mb-4">
                <div className="font-semibold text-lg">{activeControl.id}: {activeControl.name}</div>
                <p className="text-muted-foreground mt-1">{activeControl.description}</p>
              </div>
              
              <div className="bg-primary/5 p-3 rounded border border-primary/10 mb-4">
                <div className="font-medium mb-1">Requirement:</div>
                <p className="text-sm">{activeControl.requirement}</p>
              </div>

              <FormField
                control={form.control}
                name={`controls.${activeControlIndex}.status`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Implementation Status</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        {statusOptions.map(option => (
                          <div
                            key={option.value}
                            className={`flex items-center space-x-2 p-3 rounded-md border ${
                              field.value === option.value ? option.color : "border-border"
                            } transition-colors`}
                          >
                            <RadioGroupItem value={option.value} id={`status-${option.value}`} />
                            <label
                              htmlFor={`status-${option.value}`}
                              className="flex flex-1 items-center space-x-2 cursor-pointer"
                            >
                              {option.icon}
                              <span className="font-medium">{option.label}</span>
                              <span className="text-xs text-muted-foreground">
                                - {option.description}
                              </span>
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 space-y-4">
                <FormField
                  control={form.control}
                  name={`controls.${activeControlIndex}.evidence`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Evidence</FormLabel>
                      <FormDescription>
                        Provide evidence of how this control is implemented in your organization.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the evidence that demonstrates implementation of this control..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`controls.${activeControlIndex}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormDescription>
                        Add any additional notes or context about this control.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes, challenges, or plans related to this control..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save Assessment
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}