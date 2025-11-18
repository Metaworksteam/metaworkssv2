import React from "react";
import { 
  FileText, Shield, Star, HelpCircle, Users, Archive, 
} from "lucide-react";

const features = [
  {
    title: "AI-Generated Policies",
    description: "Automatically generate compliant policies mapped to NCA ECC controls.",
    icon: FileText,
  },
  {
    title: "One-Click Compliance",
    description: "Assess your organization and get step-by-step compliance recommendations.",
    icon: Shield,
  },
  {
    title: "Risk Assessment",
    description: "Interactive risk heatmaps and AI-based scoring to visualize your security posture.",
    icon: Star,
  },
  {
    title: "Virtual Consultant",
    description: "AI chatbot for answering compliance questions and providing guidance.",
    icon: HelpCircle,
  },
  {
    title: "Multi-User Access",
    description: "Role-based access control for admins, compliance officers, and team members.",
    icon: Users,
  },
  {
    title: "Document Repository",
    description: "Secure storage for compliance documents with version control and audit logs.",
    icon: Archive,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Compliance Features</h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Our platform offers everything you need to achieve and maintain NCA ECC compliance with minimal effort.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="backdrop-blur-sm border border-primary/10 bg-card/20 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-emerald-400 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
