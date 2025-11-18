import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/header";
import PricingSection from "@/components/landing/pricing-section";
import Footer from "@/components/landing/footer";
import backgroundImage from "@assets/metawork background.png";

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Pricing - Meta Works</title>
      </Helmet>
      <div className="min-h-screen text-foreground relative">
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
        <div className="pt-20">
          <PricingSection />
        </div>
        <Footer />
      </div>
    </>
  );
}
