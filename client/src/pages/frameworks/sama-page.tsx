import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default function SamaPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-primary">SAMA Cyber Security Framework</h1>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mr-4">
                <div className="text-xl font-bold text-primary">SAMA</div>
              </div>
              <h2 className="text-2xl font-semibold">Cyber Security Framework</h2>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download Framework</span>
            </Button>
          </div>

          <div className="prose prose-invert max-w-none mt-6">
            <p>
              The Saudi Arabian Monetary Authority (SAMA) Cyber Security Framework provides a method for financial institutions to assess their cybersecurity maturity and capabilities. It outlines the minimum cyber security requirements for the financial sector in Saudi Arabia and provides guidance to identify and address cyber security risks.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Comprehensive coverage of cybersecurity domains including governance, risk management, compliance, operations, and technology</li>
              <li>Maturity-based approach to assess and enhance cybersecurity capabilities</li>
              <li>Alignment with international standards like NIST, ISO 27001, and PCI DSS</li>
              <li>Regulatory compliance requirement for financial institutions in Saudi Arabia</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">How MetaWorks Helps</h3>
            <p>
              MetaWorks streamlines SAMA compliance with tailored features for financial institutions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Comprehensive assessment of your organization against SAMA requirements</li>
              <li>Automated maturity level calculation across all domains</li>
              <li>Policy templates specifically designed for SAMA compliance</li>
              <li>Continuous monitoring of compliance status</li>
              <li>Detailed reporting for regulatory submissions</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button className="flex items-center gap-2" asChild>
            <Link href="/dashboard">
              <FileText className="h-4 w-4 mr-2" />
              Start SAMA Assessment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}