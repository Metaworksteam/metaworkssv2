import React from "react";
import { Award, MapPin, Rocket, Users, Shield, Heart, Target, Zap, Globe, Building2 } from "lucide-react";
import mcitLogo from "@assets/Hnet.com-image_7.original_1759845224098.png";
import miskLogo from "@assets/MiSK_Foundation_Logo.svg_1759845282340.png";

const achievements = [
  {
    icon: Award,
    title: "Misk Launchpad 7 Graduate",
    description: "Successfully graduated from Misk Launchpad's 7th cohort, accelerating our growth in Saudi Arabia's startup ecosystem"
  },
  {
    icon: Rocket,
    title: "Tech Champions 5",
    description: "Proud participant of Tech Champions 5 program, showcasing innovation in cybersecurity compliance solutions"
  },
  {
    icon: Heart,
    title: "MCIT Support",
    description: "Supported by the Ministry of Communication and Information Technology, advancing digital transformation in the Kingdom"
  },
  {
    icon: Building2,
    title: "Trusted by Major Companies in Saudi",
    description: "Sports Boulevard Foundation, Saudi Ceramics, Honda, STC, PWC, PIF, Ministry of Energy, Elm"
  }
];

const values = [
  {
    icon: Shield,
    title: "Security First",
    description: "We prioritize the security and privacy of your data in everything we build with enterprise-grade encryption and compliance"
  },
  {
    icon: Target,
    title: "Customer Success",
    description: "Your compliance journey is our priority. We provide dedicated support and guidance every step of the way"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "Continuously evolving our platform with cutting-edge AI, automation, and emerging technologies"
  },
  {
    icon: Globe,
    title: "Regional Expertise",
    description: "Deep understanding of Middle East regulations and compliance frameworks, built for the region"
  }
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-background/90 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            About MetaWorks
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-300 mb-6">
            <MapPin className="w-5 h-5 text-primary" />
            <p className="text-xl">Proudly Born and Raised in Saudi Arabia</p>
          </div>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Leading the future of cybersecurity compliance in the Middle East with AI-powered innovation
          </p>
        </div>

        {/* Partner Logos */}
        <div className="mb-16">
          <p className="text-center text-gray-400 mb-8 text-sm uppercase tracking-wider">Supported By</p>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            <div className="backdrop-blur-sm bg-white border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
              <img 
                src={mcitLogo} 
                alt="Ministry of Communication and Information Technology" 
                className="h-24 md:h-28 w-auto object-contain"
                data-testid="img-mcit-logo"
              />
            </div>
            <div className="backdrop-blur-sm bg-white border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
              <img 
                src={miskLogo} 
                alt="MiSK Foundation" 
                className="h-24 md:h-28 w-auto object-contain"
                data-testid="img-misk-logo"
              />
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-emerald-400/10 border border-primary/20 rounded-2xl p-8 md:p-12 mb-16 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">Our Story</h3>
          <div className="max-w-4xl mx-auto space-y-5 text-gray-200 text-lg leading-relaxed">
            <p>
              <strong className="text-primary">MetaWorks</strong> is a pioneering cybersecurity compliance platform proudly born and raised in the Kingdom of Saudi Arabia. 
              We are dedicated to revolutionizing how organizations approach cybersecurity compliance across the region and beyond.
            </p>
            <p>
              Our mission is to empower businesses to achieve and maintain compliance with critical regulatory frameworks 
              including <strong className="text-white">NCA ECC, SAMA CSF, PDPL, and ISO 27001</strong> through innovative AI-powered automation and intelligent workflows. 
              We believe compliance should be an enabler of trust, security, and sustainable growth—not a burden.
            </p>
            <p>
              With the prestigious support of <strong className="text-white">Misk Launchpad 7</strong>, <strong className="text-white">Tech Champions 5</strong>, 
              and the <strong className="text-white">Ministry of Communication and Information Technology (MCIT)</strong>, we've developed a world-class 
              platform that combines cutting-edge AI technology with deep regulatory expertise and regional insights.
            </p>
            <p className="text-primary font-semibold">
              Today, we're transforming compliance management for CTOs, CISOs, CIOs, Compliance Officers, Risk Officers, and IT Managers 
              with our agentic cybersecurity workforce solution.
            </p>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">Recognition & Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                data-testid={`card-achievement-${index}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <achievement.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-2 text-white">{achievement.title}</h4>
                    <p className="text-gray-400 leading-relaxed">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center text-white">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-xl p-6 text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
                data-testid={`card-value-${index}`}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-white">{value.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="backdrop-blur-sm bg-gradient-to-br from-primary/5 to-emerald-400/5 border border-primary/20 rounded-2xl p-8 md:p-10">
            <p className="text-gray-300 mb-6 text-xl font-medium">
              Join leading organizations trusting MetaWorks for their cybersecurity compliance
            </p>
            <p className="text-gray-400 mb-8 text-base max-w-2xl mx-auto">
              Transform your compliance journey with our AI-powered platform designed for the modern enterprise
            </p>
            <a 
              href="/#contact" 
              className="inline-block py-4 px-10 rounded-lg font-semibold text-center bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30"
              data-testid="button-get-in-touch"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
