import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download } from "lucide-react";

export default function PdplPage() {
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
          <h1 className="text-3xl font-bold text-primary">Personal Data Protection Law (PDPL)</h1>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6 border border-border mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mr-4">
                <div className="text-xl font-bold text-primary">PDPL</div>
              </div>
              <h2 className="text-2xl font-semibold">Data Protection Law</h2>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download Framework</span>
            </Button>
          </div>

          <div className="prose prose-invert max-w-none mt-6">
            <p>
              The Personal Data Protection Law (PDPL) is Saudi Arabia's comprehensive data protection framework that regulates the collection, processing, disclosure, and transfer of personal data. The law aims to protect individuals' privacy rights and ensure proper handling of personal information by organizations operating in Saudi Arabia.
            </p>
            
            <h3 className="text-xl font-semibold mt-6">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Strict requirements for obtaining explicit consent before collecting personal data</li>
              <li>Data subject rights including access, correction, deletion, and objection to processing</li>
              <li>Limitations on cross-border data transfers</li>
              <li>Mandatory data breach notification requirements</li>
              <li>Heavy penalties for non-compliance, including fines and business restrictions</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6">How MetaWorks Helps</h3>
            <p>
              MetaWorks simplifies PDPL compliance with specialized features:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Data mapping tools to identify and categorize personal data in your systems</li>
              <li>Automated gap analysis against all PDPL requirements</li>
              <li>Customizable privacy policy and consent form templates</li>
              <li>Data subject request management workflow</li>
              <li>Data breach response planning and notification system</li>
              <li>Cross-border transfer compliance assessment</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button className="flex items-center gap-2" asChild>
            <Link href="/dashboard">
              <FileText className="h-4 w-4 mr-2" />
              Start PDPL Assessment
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}