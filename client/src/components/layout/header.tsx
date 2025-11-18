import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Menu, X, Presentation } from "lucide-react";
import { ThemeSwitch } from "./theme-switch";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogin = () => {
    navigate("/auth");
  };
  
  const handleSignup = () => {
    navigate("/contact-us");
  };
  
  const handleClerkAuth = () => {
    navigate("/clerk-auth");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="backdrop-blur-sm bg-background/60 border-b border-primary/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {/* Logo */}
            <div 
              onClick={() => navigate("/")} 
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Shield className="w-10 h-10 text-primary" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">MetaWorks</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <button onClick={() => navigate("/solution")} className="text-sm font-medium hover:text-primary transition-colors">Solution</button>
            <button onClick={() => navigate("/pricing")} className="text-sm font-medium hover:text-primary transition-colors">Pricing</button>
            <button onClick={() => navigate("/about")} className="text-sm font-medium hover:text-primary transition-colors">About</button>
            
            {/* Dark/Light Mode Toggle */}
            <ThemeSwitch>Toggle theme</ThemeSwitch>
            
            {/* D-ID Agent Quick Access */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate("/did-agent")}
                    className="relative"
                  >
                    <Presentation className="h-5 w-5 text-primary" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full"></span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>D-ID Virtual Agent</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/user-dashboard")}
                  className="hidden md:inline-flex"
                >
                  User Dashboard
                </Button>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="hidden md:inline-flex"
                >
                  Login
                </Button>
                <Button onClick={handleSignup}>Get Started</Button>
              </>
            )}
            
            {/* Mobile menu button */}
            <button 
              type="button" 
              className="md:hidden text-gray-300 hover:text-white focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden backdrop-blur-sm bg-background/90 absolute top-full left-0 w-full border-b border-primary/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/#features" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary">Features</a>
              <a 
                onClick={() => { navigate('/solution'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                Solution
              </a>
              <a 
                onClick={() => { navigate('/pricing'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                Pricing
              </a>
              <a 
                onClick={() => { navigate('/about'); setIsMenuOpen(false); }}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                About
              </a>
              
              {user ? (
                <>
                  <a 
                    onClick={() => { navigate('/user-dashboard'); setIsMenuOpen(false); }}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary cursor-pointer"
                  >
                    User Dashboard
                  </a>
                </>
              ) : (
                <>
                  <a 
                    onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary cursor-pointer"
                  >
                    Login
                  </a>
                </>
              )}
              
              <a 
                onClick={() => { navigate('/did-agent'); setIsMenuOpen(false); }}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-primary/10 hover:text-primary cursor-pointer"
              >
                <Presentation className="mr-2 h-4 w-4 text-primary" />
                <span>D-ID Agent</span>
                <span className="ml-2 h-2 w-2 bg-green-500 rounded-full"></span>
              </a>
              
              <div className="flex items-center px-3 py-2">
                <span className="text-sm mr-2">Theme:</span>
                <ThemeSwitch>Toggle theme</ThemeSwitch>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
