import React, { useState } from "react";
import { Calendar, Mail, User, Send, CheckCircle, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DemoSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/book-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: "", email: "", company: "", message: "" });
        toast({
          title: "Demo Request Sent!",
          description: "We'll contact you shortly to schedule your demo."
        });
      } else {
        throw new Error("Failed to submit demo request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="demo" className="py-20 bg-gradient-to-br from-primary/5 to-emerald-400/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-emerald-400/20 border border-primary/30 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Limited Spots Available</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            Book Your Free Demo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            See how Meta Works can transform your compliance process. Get a personalized walkthrough of our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Benefits List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-6">What You'll Get:</h3>
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
                  <h4 className="text-lg font-semibold text-white mb-1">{benefit.title}</h4>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div>
            {isSubmitted ? (
              <div className="backdrop-blur-sm bg-gradient-to-br from-primary/10 to-emerald-400/10 border border-primary/20 rounded-2xl p-12 text-center">
                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2 text-white">Request Received!</h3>
                <p className="text-gray-300 mb-6">
                  Thank you for your interest. Our team will contact you within 24 hours to schedule your demo.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="py-2 px-6 rounded-lg font-medium bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Book Another Demo
                </button>
              </div>
            ) : (
              <div className="backdrop-blur-sm bg-card/30 border border-primary/20 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors focus:outline-none text-white"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Work Email *
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors focus:outline-none text-white"
                      placeholder="john@company.com"
                    />
                  </div>

                  {/* Company Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Company Name
                      </div>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors focus:outline-none text-white"
                      placeholder="Your Company"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Additional Information
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors focus:outline-none text-white resize-none"
                      placeholder="Tell us about your compliance needs (optional)"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-lg font-medium bg-gradient-to-r from-primary to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Request Demo
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
