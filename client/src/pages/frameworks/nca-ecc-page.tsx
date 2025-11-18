import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  FileText, 
  Download, 
  Shield, 
  Server, 
  RefreshCw, 
  Globe, 
  Cpu, 
  ChevronDown, 
  ChevronRight,
  Check,
  Info
} from "lucide-react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

// The structured data for the ECC domains and subdomains
const eccDomains = [
  {
    id: 1,
    name: "Cybersecurity Governance",
    icon: <Shield className="h-5 w-5" />,
    description: "Controls related to cybersecurity strategy, policies, organizational structure, and compliance.",
    subdomains: [
      { id: "1-1", name: "Cybersecurity Strategy", controls: 5 },
      { id: "1-2", name: "Cybersecurity Management", controls: 8 },
      { id: "1-3", name: "Cybersecurity Policies and Procedures", controls: 9 },
      { id: "1-4", name: "Cybersecurity Roles and Responsibilities", controls: 3 },
      { id: "1-5", name: "Cybersecurity Risk Management", controls: 5 },
      { id: "1-6", name: "Cybersecurity Compliance", controls: 3 },
      { id: "1-7", name: "Cybersecurity Awareness and Training", controls: 4 }
    ]
  },
  {
    id: 2,
    name: "Cybersecurity Defense",
    icon: <Server className="h-5 w-5" />,
    description: "Controls that focus on the protection of assets, identity management, access management, and cryptography.",
    subdomains: [
      { id: "2-1", name: "Asset Management", controls: 6 },
      { id: "2-2", name: "Identity and Access Management", controls: 10 },
      { id: "2-3", name: "Information Systems Security", controls: 9 },
      { id: "2-4", name: "Email Security", controls: 5 },
      { id: "2-5", name: "Network Security", controls: 8 },
      { id: "2-6", name: "Cryptography", controls: 5 },
      { id: "2-7", name: "Physical Security", controls: 5 },
      { id: "2-8", name: "Third Party Services Management", controls: 5 },
      { id: "2-9", name: "Data Protection", controls: 7 },
      { id: "2-10", name: "Mobile Device Security", controls: 3 },
      { id: "2-11", name: "Application Security", controls: 7 }
    ]
  },
  {
    id: 3,
    name: "Cybersecurity Resilience",
    icon: <RefreshCw className="h-5 w-5" />,
    description: "Controls that ensure business continuity, log management and monitoring, vulnerability management, penetration testing, incident response, and disaster recovery.",
    subdomains: [
      { id: "3-1", name: "Cybersecurity Event Logging and Monitoring", controls: 6 },
      { id: "3-2", name: "Vulnerability Management", controls: 4 },
      { id: "3-3", name: "Backup and Recovery", controls: 5 },
      { id: "3-4", name: "Penetration Testing", controls: 2 },
      { id: "3-5", name: "Cybersecurity Incident and Threat Management", controls: 5 }
    ]
  },
  {
    id: 4,
    name: "Third-Party and Cloud Computing Cybersecurity",
    icon: <Globe className="h-5 w-5" />,
    description: "Controls that manage cybersecurity risks associated with third-party services and cloud computing environments.",
    subdomains: [
      { id: "4-1", name: "Third-Party Service Management", controls: 4 },
      { id: "4-2", name: "Cloud Computing and Hosting Cybersecurity", controls: 6 }
    ]
  },
  {
    id: 5,
    name: "Industrial Control Systems Cybersecurity",
    icon: <Cpu className="h-5 w-5" />,
    description: "Controls that ensure the security of industrial control systems (ICS), SCADA, and operational technology (OT) environments.",
    subdomains: [
      { id: "5-1", name: "Industrial Control Systems Security", controls: 5 }
    ]
  }
];

export default function NcaEccPage() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <>
      <Helmet>
        <title>NCA ECC Framework | MetaWorks</title>
      </Helmet>
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-primary">NCA Essential Cybersecurity Controls</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-600 hover:bg-amber-700">Version: ECC-1:2018</Badge>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="structure">Framework Structure</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    About the Framework
                  </CardTitle>
                  <CardDescription>
                    Essential Cybersecurity Controls (ECC-1:2018)
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p>
                    The NCA Essential Cybersecurity Controls (ECC) framework is a comprehensive set of cybersecurity controls 
                    issued by the National Cybersecurity Authority of Saudi Arabia. It aims to establish minimum cybersecurity 
                    requirements for organizations to protect their information and technology assets from common cybersecurity threats.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6">Framework Objectives</h3>
                  <p>The main objectives of the ECC framework are to:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Set minimum cybersecurity requirements for information and technology assets</li>
                    <li>Help organizations minimize cybersecurity risks from internal and external threats</li>
                    <li>Focus on three key security principles: Confidentiality, Integrity, and Availability</li>
                    <li>Address four main cybersecurity pillars: Strategy, People, Processes, and Technology</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6">Applicability</h3>
                  <p>
                    The ECC framework is applicable to:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Government organizations in Saudi Arabia (ministries, authorities, establishments)</li>
                    <li>Companies and entities owned by government organizations</li>
                    <li>Private sector organizations owning, operating or hosting Critical National Infrastructures (CNIs)</li>
                    <li>Other organizations are strongly encouraged to leverage these controls as best practices</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6">Implementation Approach</h3>
                  <p>
                    MetaWorks provides a structured approach to implementing the NCA ECC framework:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Comprehensive gap analysis against all 114 ECC controls</li>
                    <li>Risk-based prioritization of control implementation</li>
                    <li>Development of customized policies and procedures</li>
                    <li>Implementation roadmap with clear milestones</li>
                    <li>Compliance monitoring and continuous improvement</li>
                  </ul>
                </CardContent>
              </Card>
                
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-green-500/20 p-1">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <strong>Comprehensive Coverage:</strong> 5 main domains, 29 subdomains, and 114 essential controls
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-green-500/20 p-1">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <strong>Risk-Based Approach:</strong> Controls designed to address the most common and impactful cybersecurity risks
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-green-500/20 p-1">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <strong>Alignment:</strong> Compatible with international standards and frameworks
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-green-500/20 p-1">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <strong>Flexible Implementation:</strong> Controls can be tailored to organization size and complexity
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                  <CardHeader>
                    <CardTitle>How MetaWorks Helps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <strong>Automated Assessment:</strong> Comprehensive evaluation of your organization's compliance status
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <strong>Gap Analysis:</strong> Detailed reporting on control gaps with prioritized remediation guidance
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <strong>Policy Generation:</strong> AI-assisted creation of policies aligned with ECC requirements
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <strong>Remediation Tracking:</strong> Task management system for tracking compliance progress
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="mt-1 rounded-full bg-primary/20 p-1">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <strong>Virtual Consultant:</strong> AI-powered guidance on implementing specific controls
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="structure" className="space-y-6">
              <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Framework Structure
                  </CardTitle>
                  <CardDescription>
                    The ECC framework consists of 5 main domains, 29 subdomains, and 114 essential controls
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {eccDomains.map((domain) => (
                      <Card key={domain.id} className="bg-card/50 border-primary/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                              {domain.icon}
                            </div>
                            <span>Domain {domain.id}:</span>
                          </CardTitle>
                          <CardDescription className="font-medium text-foreground">
                            {domain.name}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          <p className="mb-2">{domain.description}</p>
                          <p className="text-xs">
                            <span className="font-semibold">{domain.subdomains.length}</span> subdomains, 
                            <span className="font-semibold ml-1">
                              {domain.subdomains.reduce((acc, subdomain) => acc + subdomain.controls, 0)}
                            </span> controls
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {eccDomains.map((domain) => (
                      <AccordionItem key={domain.id} value={`domain-${domain.id}`} className="border border-primary/10 rounded-lg mb-4 overflow-hidden">
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                              {domain.icon}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold">Domain {domain.id}: {domain.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {domain.subdomains.length} subdomains, {domain.subdomains.reduce((acc, subdomain) => acc + subdomain.controls, 0)} controls
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="px-4 py-2 bg-muted/30">
                            <div className="font-medium mb-2">Subdomains:</div>
                            <div className="space-y-1">
                              {domain.subdomains.map((subdomain) => (
                                <div key={subdomain.id} className="flex items-center justify-between py-2 px-3 bg-background/50 rounded border border-border/50">
                                  <div className="flex items-center gap-2">
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    <span>
                                      <span className="font-medium">{subdomain.id}:</span> {subdomain.name}
                                    </span>
                                  </div>
                                  <Badge variant="outline" className="ml-2">
                                    {subdomain.controls} controls
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="assessment" className="space-y-6">
              <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Assessment Process
                  </CardTitle>
                  <CardDescription>
                    How MetaWorks helps you assess and achieve compliance with the ECC framework
                  </CardDescription>
                </CardHeader>
                <CardContent className="prose prose-invert max-w-none">
                  <p>
                    MetaWorks provides a comprehensive assessment methodology for the NCA ECC framework. 
                    Our assessment process follows these key steps:
                  </p>
                  
                  <ol className="list-decimal pl-5 space-y-4">
                    <li>
                      <strong>Initial Assessment:</strong> Evaluate your current security posture against all 114 ECC controls
                    </li>
                    <li>
                      <strong>Gap Analysis:</strong> Identify areas of non-compliance with detailed explanation of control requirements
                    </li>
                    <li>
                      <strong>Risk Rating:</strong> Prioritize gaps based on risk level and implementation complexity
                    </li>
                    <li>
                      <strong>Remediation Planning:</strong> Develop a customized roadmap for addressing compliance gaps
                    </li>
                    <li>
                      <strong>Implementation Support:</strong> Provide guidance and resources for implementing required controls
                    </li>
                    <li>
                      <strong>Evidence Collection:</strong> Gather and organize compliance evidence for each control
                    </li>
                    <li>
                      <strong>Compliance Verification:</strong> Validate the effectiveness of implemented controls
                    </li>
                    <li>
                      <strong>Continuous Monitoring:</strong> Establish processes for ongoing compliance maintenance
                    </li>
                  </ol>
                  
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 mt-6">
                    <h3 className="text-xl font-semibold mb-2">Ready to Start Your Assessment?</h3>
                    <p>
                      Begin your NCA ECC compliance journey with our automated assessment tool. 
                      Our platform will guide you through each step of the process and provide 
                      actionable insights to improve your cybersecurity posture.
                    </p>
                    <div className="flex justify-center mt-4">
                      <Button size="lg" className="gap-2" asChild>
                        <Link href="/frameworks/nca-ecc-assessment">
                          <FileText className="h-5 w-5" />
                          Start ECC Assessment
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
            <Button className="flex items-center gap-2" asChild>
              <Link href="/frameworks/nca-ecc-assessment">
                <FileText className="h-4 w-4 mr-2" />
                Start ECC Assessment
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}