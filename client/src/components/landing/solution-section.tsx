import React from "react";
import { Shield, Lock, FileCheck, Brain, Users, BarChart3, CheckCircle2 } from "lucide-react";

const solutionFeatures = [
  {
    icon: Shield,
    title: "Comprehensive Security Framework",
    description: "Complete cybersecurity compliance aligned with Saudi Arabia's regulatory requirements including NCA ECC, SAMA, and PDPL frameworks."
  },
  {
    icon: Brain,
    title: "AI-Powered Compliance",
    description: "Leverage artificial intelligence to automate policy generation, risk assessment, and compliance monitoring, reducing manual effort by 80%."
  },
  {
    icon: FileCheck,
    title: "Automated Policy Management",
    description: "Generate, manage, and maintain compliance policies automatically mapped to regulatory controls with version control and audit trails."
  },
  {
    icon: Lock,
    title: "Risk Assessment & Management",
    description: "Interactive risk heatmaps, AI-based scoring, and real-time threat detection to visualize and manage your security posture effectively."
  },
  {
    icon: Users,
    title: "Multi-User Collaboration",
    description: "Role-based access control for admins, compliance officers, and team members with granular permissions and activity tracking."
  },
  {
    icon: BarChart3,
    title: "Real-Time Reporting & Analytics",
    description: "Comprehensive dashboards, exportable reports, and shareable compliance certificates for stakeholders and regulators."
  }
];

const benefits = [
  "Reduce compliance time from months to weeks",
  "Automated evidence collection and documentation",
  "24/7 virtual compliance consultant powered by AI",
  "Continuous compliance monitoring and alerts",
  "Secure document repository with encryption",
  "Integration with existing security tools"
];

export default function SolutionSection() {
  return (
    <section id="solution" className="py-20 bg-background/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            Our Solution
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            One-Click Cybersecurity Compliance Platform designed to simplify and automate your organization's compliance journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {solutionFeatures.map((feature, index) => (
            <div 
              key={index}
              className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-emerald-400/10 border border-primary/20 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Key Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-gray-200 text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-6 text-lg">
            Ready to transform your compliance process?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/#demo" 
              className="inline-block py-3 px-8 rounded-lg font-medium text-center bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Book a Demo
            </a>
            <a 
              href="/pricing" 
              className="inline-block py-3 px-8 rounded-lg font-medium text-center border border-primary/50 bg-background/30 text-primary shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary/10"
            >
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
