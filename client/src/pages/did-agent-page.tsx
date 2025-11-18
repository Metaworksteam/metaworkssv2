import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { Sparkles, BookOpen, Shield, FileCheck } from "lucide-react";
import AgentScript from "@/components/did-agent/agent-script";

export default function DIDAgentPage() {
  return (
    <>
      <Helmet>
        <title>MetaWorks | Virtual Security Assistant</title>
      </Helmet>
      
      <div className="container py-8 max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-2">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Virtual Security Assistant</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Your AI-powered cybersecurity consultant helps you understand compliance frameworks,
              security best practices, and provides guidance tailored to your organization.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Agent Column */}
            <div className="lg:col-span-2">
              <AgentScript 
                height="600px"
                containerClassName="rounded-lg overflow-hidden shadow-lg"
              />
            </div>
            
            {/* Information Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How To Use</CardTitle>
                  <CardDescription>
                    Tips for interacting with your virtual security assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Ask About Frameworks
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      "Can you explain the NCA ECC framework domains?"
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Get Security Advice
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      "What are the best practices for password policies?"
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-primary" />
                      Policy Guidance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      "What should I include in an acceptable use policy?"
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Supported Frameworks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>NCA ECC (Essential Cybersecurity Controls)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>SAMA Cyber Security Framework</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>ISO 27001 Information Security</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>PDPL (Personal Data Protection Law)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>IT General Controls (ITGC)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}