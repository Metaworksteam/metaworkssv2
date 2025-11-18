import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default function Iso27001Page() {
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
          <h1 className="text-3xl font-bold text-primary">ISO/IEC 27001 Information Security Standard</h1>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mr-4">
                <div className="text-xl font-bold text-primary">ISO</div>
              </div>
              <h2 className="text-2xl font-semibold">27001 Standard</h2>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download Overview</span>
            </Button>
          </div>

          <div className="prose prose-invert max-w-none mt-6">
            <p>
              ISO/IEC 27001 is the internationally recognized standard for information security management systems (ISMS). It provides a systematic approach to managing sensitive information and ensuring its confidentiality, integrity, and availability. Organizations can become ISO 27001 certified to demonstrate their commitment to information security best practices.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Risk-based approach to information security management</li>
              <li>Systematic framework covering all aspects of information security</li>
              <li>Set of 114 controls across 14 domains (Annex A)</li>
              <li>Plan-Do-Check-Act (PDCA) cycle for continuous improvement</li>
              <li>Global recognition and acceptance as a security standard</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">How MetaWorks Helps</h3>
            <p>
              MetaWorks provides comprehensive ISO 27001 compliance support:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Complete ISO 27001 gap analysis against all 114 controls</li>
              <li>Risk assessment framework and methodology</li>
              <li>Statement of Applicability (SoA) generator</li>
              <li>Full suite of ISO 27001 policy templates</li>
              <li>Implementation planning and task management</li>
              <li>Internal audit support and documentation</li>
              <li>Certification preparation guidance</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button className="flex items-center gap-2" asChild>
            <Link href="/dashboard">
              <FileText className="h-4 w-4 mr-2" />
              Start ISO 27001 Assessment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}