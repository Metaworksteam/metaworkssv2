import React from "react";
import { useLocation } from "wouter";

export default function ComplianceLogos() {
  const [_, navigate] = useLocation();

  // Navigate to framework pages
  const navigateToNcaEcc = () => navigate("/frameworks/nca-ecc");
  const navigateToSama = () => navigate("/frameworks/sama");
  const navigateToPdpl = () => navigate("/frameworks/pdpl");
  const navigateToIso = () => navigate("/frameworks/iso-27001");

  return (
    <div className="py-8 bg-background relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">Supported Compliance Frameworks</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {/* NCA ECC Logo */}
          <div 
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            onClick={navigateToNcaEcc}
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mb-2">
              <div className="text-3xl font-bold text-primary">NCA</div>
            </div>
            <span className="text-sm text-gray-300">ECC Framework</span>
          </div>
          
          {/* SAMA Logo */}
          <div 
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            onClick={navigateToSama}
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mb-2">
              <div className="text-3xl font-bold text-primary">SAMA</div>
            </div>
            <span className="text-sm text-gray-300">Cyber Security Framework</span>
          </div>
          
          {/* PDPL Logo */}
          <div 
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            onClick={navigateToPdpl}
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mb-2">
              <div className="text-3xl font-bold text-primary">PDPL</div>
            </div>
            <span className="text-sm text-gray-300">Data Protection Law</span>
          </div>
          
          {/* ISO 27001 Logo */}
          <div 
            className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            onClick={navigateToIso}
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 mb-2">
              <div className="text-3xl font-bold text-primary">ISO</div>
            </div>
            <span className="text-sm text-gray-300">27001 Standard</span>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}