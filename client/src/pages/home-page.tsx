import React from "react";
import Header from "@/components/layout/header";
import HeroSection from "@/components/landing/hero-section";
import FeaturesSection from "@/components/landing/features-section";
import ContactSection from "@/components/landing/contact-section";
import ComplianceLogos from "@/components/landing/compliance-logos";
import Footer from "@/components/landing/footer";
import { Shield } from "lucide-react";
import backgroundImage from "@assets/metawork background.png";

export default function HomePage() {
  return (
    <div className="min-h-screen text-foreground relative">
      {/* Background image */}
      <div 
        className="fixed top-0 left-0 right-0 bottom-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 -z-10" />
      
      <Header />
      <HeroSection />
      <ComplianceLogos />
      <FeaturesSection />
      <ContactSection />
      <Footer />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flow {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(1000%);
            opacity: 0;
          }
        }
        
        body {
          background-color: #121212;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(0, 183, 235, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(78, 204, 163, 0.05) 0%, transparent 50%);
        }
      `}} />
    </div>
  );
};
