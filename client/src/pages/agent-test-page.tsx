import React from 'react';
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AgentScript from "@/components/did-agent/agent-script";

export default function AgentTestPage() {
  const { toast } = useToast();
  
  return (
    <div className="container py-6 space-y-6 max-w-5xl">
      <div className="text-center space-y-4 mb-6">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">AI Security Assistant</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Interact with your virtual cybersecurity consultant
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About the Agent</CardTitle>
              <CardDescription>
                Your virtual cybersecurity consultant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Capabilities</h3>
                <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                  <li>Explain cybersecurity concepts</li>
                  <li>Provide compliance guidance</li>
                  <li>Suggest security controls</li>
                  <li>Analyze policy requirements</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium">Powered by</h3>
                <p className="text-sm text-muted-foreground">
                  D-ID Realistic AI Avatar technology
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sample Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    toast({
                      title: "Question Suggested",
                      description: "Ask the agent: What is the NCA ECC framework?",
                      variant: "default",
                    });
                  }}
                >
                  What is the NCA ECC framework?
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    toast({
                      title: "Question Suggested",
                      description: "Ask the agent: Explain the key components of cybersecurity governance",
                      variant: "default",
                    });
                  }}
                >
                  Explain the key components of cybersecurity governance
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => {
                    toast({
                      title: "Question Suggested",
                      description: "Ask the agent: What are the best practices for password policies?",
                      variant: "default",
                    });
                  }}
                >
                  What are the best practices for password policies?
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <AgentScript 
            height="600px"
            containerClassName="rounded-lg overflow-hidden shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}