import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Shield } from "lucide-react";
import metaLogo from "@assets/metawork keylogo.webp";

export default function HeroSection() {
  const [_, navigate] = useLocation();
  const { user } = useAuth();
  
  const navigateToDashboard = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };
  
  const navigateToAdmin = () => {
    if (user) {
      navigate("/admin");
    } else {
      navigate("/auth");
    }
  };
  
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-primary/5"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header area with positioning for logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-primary">
            <span>Meta Works</span>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              <span className="block bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">One-Click</span>
              <span className="block">Cybersecurity</span>
              <span className="block">Compliance</span>
              <span className="block bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">Solution</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 backdrop-blur-sm bg-black/20 p-4 rounded-lg border border-primary/20">
              Innovative Cybersecurity Solutions for Comprehensive Compliance and Protection.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Dashboard Button */}
              <button 
                onClick={navigateToDashboard}
                className="py-3 px-8 rounded-lg font-medium text-center bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none"
              >
                Go to Dashboard
              </button>
              
              {/* Admin Panel Button */}
              <button 
                onClick={navigateToAdmin}
                className="py-3 px-8 rounded-lg font-medium text-center border border-primary/50 bg-background/30 text-primary shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-primary/10 focus:outline-none"
              >
                Admin Control
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="backdrop-blur-sm bg-primary/10 rounded-lg p-4 text-center border border-primary/20">
                <p className="text-2xl md:text-3xl font-bold text-primary">99.9%</p>
                <p className="text-xs text-gray-400">Compliance Rate</p>
              </div>
              <div className="backdrop-blur-sm bg-primary/10 rounded-lg p-4 text-center border border-primary/20">
                <p className="text-2xl md:text-3xl font-bold text-emerald-400">500+</p>
                <p className="text-xs text-gray-400">Controls Covered</p>
              </div>
              <div className="backdrop-blur-sm bg-primary/10 rounded-lg p-4 text-center col-span-2 sm:col-span-1 border border-primary/20">
                <p className="text-2xl md:text-3xl font-bold text-primary">24/7</p>
                <p className="text-xs text-gray-400">Monitoring</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center lg:justify-end relative md:-mt-8">
            {/* MetaWorks Logo - Extra Large on right side */}
            <div className="relative flex justify-center items-center">
              <img src={metaLogo} alt="Meta Works Security Shield" className="h-96 lg:h-[450px] w-auto z-10" />
              
              {/* Enhanced glowing effect behind logo */}
              <div className="absolute inset-0 scale-110 bg-primary/30 blur-3xl rounded-full z-0"></div>
            </div>
            
            {/* Small floating element */}
            <div className="absolute bottom-4 right-4 backdrop-blur-sm bg-primary/10 p-3 rounded-lg shadow-lg border border-primary/20 z-20">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-semibold">ECC Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}} />
    </section>
  );
}
