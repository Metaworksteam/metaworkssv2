import { useState } from "react";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Framework {
  id: number;
  name: string;
  description?: string;
}

interface RiskAssessmentFormProps {
  onSuccess?: () => void;
  frameworks: Framework[];
}

const assessmentSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  frameworkId: z.coerce.number().positive({ message: "Please select a framework" }),
  startDate: z.date(),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

export default function RiskAssessmentForm({ onSuccess, frameworks }: RiskAssessmentFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
    },
  });
  
  const createAssessmentMutation = useMutation({
    mutationFn: async (values: AssessmentFormValues) => {
      const response = await apiRequest("POST", "/api/assessments", {
        ...values,
        startDate: format(values.startDate, 'yyyy-MM-dd'),
        status: "in_progress"
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assessment Created",
        description: "Your risk assessment has been created successfully.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error Creating Assessment",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
  
  function onSubmit(values: AssessmentFormValues) {
    createAssessmentMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assessment Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Annual Security Assessment 2025" {...field} />
              </FormControl>
              <FormDescription>
                Provide a descriptive name for this assessment
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="frameworkId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compliance Framework</FormLabel>
              <Select 
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a compliance framework" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {frameworks.map((framework) => (
                    <SelectItem key={framework.id} value={framework.id.toString()}>
                      {framework.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the compliance framework you want to assess against
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => date && field.onChange(date)}
                    disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date when this assessment was started
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={createAssessmentMutation.isPending}
        >
          {createAssessmentMutation.isPending ? "Creating..." : "Create Assessment"}
        </Button>
      </form>
    </Form>
  );
}