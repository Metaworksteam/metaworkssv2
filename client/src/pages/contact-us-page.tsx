import React, { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/landing/footer";
import { Mail, MessageSquare, User, Send, CheckCircle, Calendar, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet-async";
import backgroundImage from "@assets/metawork background.png";

declare global {
  interface Window {
    Calendly?: any;
  }
}

export default function ContactUsPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "demo">("demo");
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Calendly script is loaded
    const checkCalendlyLoaded = () => {
      if (window.Calendly) {
        setIsCalendlyLoaded(true);
      } else {
        // Keep checking until loaded
        setTimeout(checkCalendlyLoaded, 100);
      }
    };

    if (activeTab === "demo") {
      checkCalendlyLoaded();
    }
  }, [activeTab]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactFormData.name || !contactFormData.email || !contactFormData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(contactFormData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contactFormData)
      });

      if (response.ok) {
        setIsContactSubmitted(true);
        setContactFormData({ name: "", email: "", message: "" });
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon."
        });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <Helmet>
        <title>Contact Us - MetaWorks | Get Started with Compliance Solutions</title>
        <meta name="description" content="Get in touch with MetaWorks. Book a demo or send us a message to learn how our AI-powered compliance platform can help your organization." />
        <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
      </Helmet>

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

      <section className="py-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Get Started with MetaWorks
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Book a personalized demo or send us a message. We're here to help you achieve compliance excellence.
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex justify-center mb-8">
            <div className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-xl p-1 inline-flex">
              <button
                onClick={() => setActiveTab("demo")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "demo"
                    ? "bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid="tab-demo"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Book a Demo
                </div>
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "contact"
                    ? "bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
                data-testid="tab-contact"
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact Us
                </div>
              </button>
            </div>
          </div>

          {/* Demo Booking with Calendly */}
          {activeTab === "demo" && (
            <div className="backdrop-blur-sm bg-[#0f1517]/60 border border-white/10 rounded-2xl p-10 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left Section - Benefits */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    What You'll Get:
                  </h3>
                  {[
                    {
                      title: "Personalized Demo",
                      description: "30-minute customized walkthrough tailored to your organization's needs"
                    },
                    {
                      title: "Expert Consultation",
                      description: "Direct access to our compliance experts to answer your questions"
                    },
                    {
                      title: "ROI Analysis",
                      description: "See how much time and money you can save with our automation"
                    },
                    {
                      title: "Free Trial Access",
                      description: "Get started immediately with a 14-day free trial"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {benefit.title}
                        </h4>
                        <p className="text-white/85">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Section - Calendly Scheduler */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden relative" style={{ minHeight: '650px' }}>
                  {!isCalendlyLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="text-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-white text-sm">Loading calendar...</p>
                      </div>
                    </div>
                  )}
                  <div 
                    className="calendly-inline-widget" 
                    data-url="https://calendly.com/abdullaharoomi/30min"
                    style={{ minWidth: '320px', height: '650px', width: '100%' }}
                    data-testid="calendly-widget"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Form */}
          {activeTab === "contact" && (
            <div className="max-w-2xl mx-auto">
              {isContactSubmitted ? (
                <div className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-emerald-400/10 border border-primary/20 rounded-2xl p-12 text-center">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2 text-white">Thank You!</h3>
                  <p className="text-gray-300 mb-6">
                    Your message has been sent successfully. We'll get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsContactSubmitted(false)}
                    className="py-2 px-6 rounded-lg font-medium bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all"
                    data-testid="button-send-another"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-2xl p-8 md:p-12">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Name *
                        </div>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={contactFormData.name}
                        onChange={handleContactChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors focus:outline-none text-white"
                        placeholder="Your name"
                        data-testid="input-contact-name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email *
                        </div>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={contactFormData.email}
                        onChange={handleContactChange}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors focus:outline-none text-white"
                        placeholder="your.email@example.com"
                        data-testid="input-contact-email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message *
                        </div>
                      </label>
                      <textarea
                        name="message"
                        value={contactFormData.message}
                        onChange={handleContactChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors focus:outline-none text-white resize-none"
                        placeholder="Tell us how we can help you..."
                        data-testid="input-contact-message"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-lg font-medium bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                      data-testid="button-submit-contact"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
