import { useState } from "react";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface Risk {
  id?: number;
  title: string;
  description: string;
  cause?: string;
  category: string;
  owner?: string;
  likelihood: string;
  impact: string;
  inherentRiskLevel: string;
  existingControls?: string;
  controlEffectiveness?: string;
  residualRiskLevel?: string;
  mitigationActions?: string;
  targetDate?: string;
  isAccepted: boolean;
  companyId?: number;
}

interface RiskEntryFormProps {
  onSuccess?: () => void;
  initialData?: Risk;
  companyId?: number;
}

const riskSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  cause: z.string().optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  owner: z.string().optional(),
  likelihood: z.string().min(1, { message: "Please select likelihood" }),
  impact: z.string().min(1, { message: "Please select impact" }),
  inherentRiskLevel: z.string().min(1, { message: "Please select inherent risk level" }),
  existingControls: z.string().optional(),
  controlEffectiveness: z.string().optional(),
  residualRiskLevel: z.string().optional(),
  mitigationActions: z.string().optional(),
  targetDate: z.string().optional(),
  isAccepted: z.boolean().default(false),
  companyId: z.number().optional(),
});

export type RiskFormValues = z.infer<typeof riskSchema>;

export default function RiskEntryForm({ onSuccess, initialData, companyId }: RiskEntryFormProps) {
  const [targetDateString, setTargetDateString] = useState<string | undefined>(initialData?.targetDate);
  const { toast } = useToast();
  
  const defaultValues: Partial<RiskFormValues> = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    cause: initialData?.cause || "",
    category: initialData?.category || "",
    owner: initialData?.owner || "",
    likelihood: initialData?.likelihood || "",
    impact: initialData?.impact || "",
    inherentRiskLevel: initialData?.inherentRiskLevel || "",
    existingControls: initialData?.existingControls || "",
    controlEffectiveness: initialData?.controlEffectiveness || "",
    residualRiskLevel: initialData?.residualRiskLevel || "",
    mitigationActions: initialData?.mitigationActions || "",
    targetDate: initialData?.targetDate || "",
    isAccepted: initialData?.isAccepted || false,
    companyId: companyId || initialData?.companyId,
  };
  
  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskSchema),
    defaultValues,
  });
  
  const saveRiskMutation = useMutation({
    mutationFn: async (values: RiskFormValues) => {
      const response = await apiRequest("POST", "/api/risks", {
        ...values,
        id: initialData?.id,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: initialData ? "Risk Updated" : "Risk Created",
        description: `The risk has been ${initialData ? "updated" : "created"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/risks'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: initialData ? "Error Updating Risk" : "Error Creating Risk",
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });
  
  function onSubmit(values: RiskFormValues) {
    saveRiskMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Missing IT Strategy" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Risk Category</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Strategic">Strategic</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide a detailed description of the risk"
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
          name="cause"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cause</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What causes this risk?"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="owner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Risk Owner</FormLabel>
              <FormControl>
                <Input placeholder="e.g., IT Department" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="likelihood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Likelihood</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select likelihood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Very Likely">Very Likely</SelectItem>
                    <SelectItem value="Likely">Likely</SelectItem>
                    <SelectItem value="Possible">Possible</SelectItem>
                    <SelectItem value="Unlikely">Unlikely</SelectItem>
                    <SelectItem value="Very Unlikely">Very Unlikely</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="impact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Impact</FormLabel>
                <Select 
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Catastrophic">Catastrophic</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Serious">Serious</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="inherentRiskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inherent Risk Level</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="existingControls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Existing Controls</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What controls are already in place?"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="controlEffectiveness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Control Effectiveness</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select effectiveness" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Effective">Effective</SelectItem>
                  <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="residualRiskLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Residual Risk Level (Post-Mitigation)</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="mitigationActions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mitigation Actions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What actions can be taken to mitigate this risk?"
                  className="min-h-[100px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="targetDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Target Date</FormLabel>
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
                        field.value
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
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      const formattedDate = date ? format(date, 'yyyy-MM-dd') : undefined;
                      field.onChange(formattedDate);
                      setTargetDateString(formattedDate);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Risk Accepted</FormLabel>
                <FormDescription>
                  Check this if the organization has formally accepted this risk
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={saveRiskMutation.isPending}
        >
          {saveRiskMutation.isPending ? "Saving..." : initialData ? "Update Risk" : "Add Risk"}
        </Button>
      </form>
    </Form>
  );
}