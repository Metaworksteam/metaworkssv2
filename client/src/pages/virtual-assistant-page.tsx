import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import VirtualAdvisor from "@/components/virtual-assistant/virtual-advisor";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Info, Users, FileText, Zap } from "lucide-react";

export default function VirtualAssistantPage() {
  const { user } = useAuth();
  
  // Add the loadDIDAgent function directly to the window
  useEffect(() => {
    console.log("Virtual Assistant page loaded");
    
    // Define the loadDIDAgent function on the window object
    (window as any).loadDIDAgent = function() {
      console.log("Loading D-ID Agent...");
      const container = document.getElementById('agent-container');
      if (container && container.innerHTML === '') {
        console.log("Agent container found, loading script");
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://agent.d-id.com/v1/index.js';
        script.setAttribute('data-name', 'did-agent');
        script.setAttribute('data-target', '#agent-container');
        script.setAttribute('data-mode', 'fabio'); // Or use 'widget' for corner view
        script.setAttribute('data-client-key', 'YXV0aDB8NjdkYmZkZmY1MmQ3MzE2OWEzM2Q5NThiOklKaldaQmlNRjJnazZtVmlSSVpUag==');
        script.setAttribute('data-agent-id', 'agt_954OZ9Ea');
        script.setAttribute('data-monitor', 'true');
        container.appendChild(script);
        container.style.display = 'block';
      } else {
        console.log("Agent container not found or not empty");
      }
    };
    
    // Clean up function
    return () => {
      delete (window as any).loadDIDAgent;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Virtual Consultant | MetaWorks</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-6 flex items-center">
              <Bot className="mr-2 h-8 w-8 text-primary" />
              Virtual Compliance Consultant
            </h1>
            
            <div className="mb-6">
              <p className="text-muted-foreground">
                Get instant guidance on NCA ECC compliance, security policies, and best practices 
                with our AI-powered virtual consultant. Ask questions, request guidance, or
                generate compliance materials in real-time.
              </p>
            </div>

            <VirtualAdvisor />
          </div>

          {/* Sidebar content */}
          <div className="w-full md:w-80 space-y-4">
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  How the Assistant Works
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our virtual consultant uses advanced AI to answer your cybersecurity compliance
                  questions, drawing from:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Badge variant="outline" className="mr-2 mt-0.5">NCA ECC</Badge>
                    <span>Latest Essential Cybersecurity Controls</span>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="outline" className="mr-2 mt-0.5">POLICY</Badge>
                    <span>Best practice policy templates and guidance</span>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="outline" className="mr-2 mt-0.5">RISK</Badge>
                    <span>Risk assessment methodologies and examples</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Staff Assistance
                </h3>
                <p className="text-sm text-muted-foreground">
                  The consultant can help your cybersecurity staff understand compliance 
                  requirements and guide implementation efforts.
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Suggested Topics
                </h3>
                <ul className="space-y-1 text-sm">
                  <li>• NCA ECC domain explanations</li>
                  <li>• Security policy templates</li>
                  <li>• Compliance checklists</li>
                  <li>• Control implementation guidance</li>
                  <li>• Risk assessment methods</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Quick Commands
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="bg-muted rounded-md px-3 py-1">explain control 4-5-2</div>
                  <div className="bg-muted rounded-md px-3 py-1">generate security policy</div>
                  <div className="bg-muted rounded-md px-3 py-1">create compliance checklist</div>
                  <div className="bg-muted rounded-md px-3 py-1">risk assessment steps</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}