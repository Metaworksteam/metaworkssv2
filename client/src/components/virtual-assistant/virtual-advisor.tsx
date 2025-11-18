import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Loader2, Send, User, Bot, Mic, MicOff, 
  HelpCircle, FileText, Code, ListChecks, Volume2, VolumeX 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

// Types for messages
type MessageType = "user" | "assistant";
type MessageCategory = "general" | "guidance" | "policy" | "control" | "checklist";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  category: MessageCategory;
  timestamp: Date;
}

// Avatar configuration
type AvatarState = "neutral" | "thinking" | "happy" | "confused";
type VoiceState = "on" | "off";

// Initial prompt suggestions
const initialSuggestions = [
  "Explain NCA ECC framework",
  "How do I comply with control 2-5-3?",
  "Generate a security policy template",
  "What's in a risk assessment?",
  "Create compliance checklist"
];

// Initial messages
const initialMessages: Message[] = [
  {
    id: "welcome-message",
    content: "Hello! I'm your MetaWorks cybersecurity compliance assistant. I'm here to help you understand and implement NCA ECC requirements.",
    type: "assistant",
    category: "general",
    timestamp: new Date(),
  },
  {
    id: "suggestion-1",
    content: "You can ask me about specific controls, policy requirements, or how to improve your compliance posture. Try one of the suggested queries below to get started.",
    type: "assistant",
    category: "guidance",
    timestamp: new Date(),
  },
];

// Sample compliance questions and their answers
const complianceQA: Record<string, {answer: string, category: MessageCategory}> = {
  "explain nca ecc framework": {
    answer: "The NCA Essential Cybersecurity Controls (ECC) is a regulatory framework developed by the National Cybersecurity Authority of Saudi Arabia. It consists of 5 domains, 29 subdomains, and 114 essential controls covering various aspects of cybersecurity. The domains include: Cybersecurity Governance, Cybersecurity Defense, Cybersecurity Resilience, Third-Party and Cloud Services Cybersecurity, and Industrial Control Systems Cybersecurity.",
    category: "general"
  },
  "control 2-5-3": {
    answer: "Control 2-5-3 falls under the Cybersecurity Defense domain and addresses secure network configurations. It requires organizations to implement secure configurations for network devices including routers, switches, and firewalls according to industry standards. You need to document your configurations, review them regularly, and restrict administrative access to these devices.",
    category: "control"
  },
  "security policy template": {
    answer: "I can help you create a security policy template. A comprehensive information security policy should include: 1) Purpose and scope, 2) Roles and responsibilities, 3) Data classification, 4) Access control rules, 5) Password requirements, 6) Incident response procedures, 7) Acceptable use guidelines, 8) Compliance requirements. Would you like me to generate a specific section?",
    category: "policy"
  },
  "risk assessment": {
    answer: "A risk assessment under NCA ECC should include: 1) Asset identification and valuation, 2) Threat identification, 3) Vulnerability assessment, 4) Risk calculation (Impact × Likelihood), 5) Risk prioritization, 6) Treatment plans. The ECC requires risk assessments to be conducted annually or after significant changes to systems or processes.",
    category: "guidance"
  },
  "compliance checklist": {
    answer: "Here's a basic NCA ECC compliance checklist: 1) Develop cybersecurity governance structure, 2) Implement security awareness training, 3) Deploy technical controls (firewalls, antivirus, etc.), 4) Establish incident response procedures, 5) Create backup and recovery plans, 6) Implement access control measures, 7) Perform regular vulnerability assessments, 8) Document all security policies and procedures. Would you like a more detailed checklist for a specific domain?",
    category: "checklist"
  },
};

// Function to generate unique IDs for messages
const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Icon mapping for message categories
const categoryIcons: Record<MessageCategory, React.ReactNode> = {
  general: <Bot className="h-4 w-4" />,
  guidance: <HelpCircle className="h-4 w-4" />,
  policy: <FileText className="h-4 w-4" />,
  control: <Code className="h-4 w-4" />,
  checklist: <ListChecks className="h-4 w-4" />,
};

export default function VirtualAdvisor() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("neutral");
  const [voiceState, setVoiceState] = useState<VoiceState>("off");
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [didAgentLoaded, setDidAgentLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState<number>(Date.now());
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const agentContainerRef = useRef<HTMLDivElement>(null);

  // Function to check if the D-ID agent is loaded
  // Simplified function that just shows a message instead of trying to load D-ID agent
  const checkDIDAgent = React.useCallback(() => {
    console.log("D-ID agent refresh requested...");
    
    // Show that we tried to refresh
    setDidAgentLoaded(true);
    
    // After 1.5 seconds, show it as not loaded again so user can click refresh again if needed
    setTimeout(() => {
      setDidAgentLoaded(false);
    }, 1500);
    
  }, []);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input field on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  // Set UI state when tab changes to 'assistant'
  useEffect(() => {
    if (activeTab === 'assistant') {
      // Reset agent loading state
      setDidAgentLoaded(false);
      
      // Set up an event listener for the iframe's load event
      const handleIframeLoad = () => {
        setTimeout(() => {
          setDidAgentLoaded(true);
        }, 2000); // Give a little extra time for the agent to initialize
      };
      
      // Find the iframe and add the load listener
      const iframe = document.getElementById('did-agent-iframe') as HTMLIFrameElement;
      if (iframe) {
        iframe.addEventListener('load', handleIframeLoad);
      }
      
      // Set a fallback timer in case the load event doesn't fire
      const fallbackTimer = setTimeout(() => {
        setDidAgentLoaded(true);
      }, 8000);
      
      return () => {
        // Clean up event listener and timer
        if (iframe) {
          iframe.removeEventListener('load', handleIframeLoad);
        }
        clearTimeout(fallbackTimer);
      };
    }
  }, [activeTab]);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      type: "user",
      category: "general", // Default category for user messages
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setAvatarState("thinking");

    // Simulate API call to get response
    setTimeout(() => {
      generateResponse(userMessage.content);
    }, 1500);
  };

  // Function to generate a response based on user input
  const generateResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for matches in our QA database
    let answer = "";
    let category: MessageCategory = "general";
    
    for (const [key, value] of Object.entries(complianceQA)) {
      if (lowerQuestion.includes(key)) {
        answer = value.answer;
        category = value.category;
        break;
      }
    }
    
    // Default response if no match
    if (!answer) {
      answer = "I don't have specific information about that query. You can ask me about NCA ECC controls, cybersecurity policies, risk assessments, or compliance checklists.";
      category = "general";
      setAvatarState("confused");
    } else {
      setAvatarState("happy");
    }

    const assistantMessage: Message = {
      id: generateId(),
      content: answer,
      type: "assistant",
      category: category,
      timestamp: new Date(),
    };

    // If voice is on, simulate text-to-speech
    if (voiceState === "on") {
      // This is where you'd implement actual text-to-speech
      console.log("Text-to-speech would say:", answer);
    }

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
    
    // Reset avatar state after 3 seconds
    setTimeout(() => {
      setAvatarState("neutral");
    }, 3000);
  };

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  // Function to toggle voice input/output
  const toggleVoiceInput = () => {
    setIsListening((prev) => !prev);
    
    // Placeholder for speech recognition
    if (!isListening) {
      // This would be where you'd implement the speech recognition API
      
      // Simulate turning off after 3 seconds
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };
  
  // Function to toggle voice output
  const toggleVoiceOutput = () => {
    setVoiceState((prev) => (prev === "on" ? "off" : "on"));
  };
  
  // Function to use a suggested prompt
  const useSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
  };

  return (
    <Card className="flex flex-col h-[700px] max-h-[80vh] backdrop-blur-sm bg-card/50 border-primary/10">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Bot className="h-5 w-5 mr-2 text-primary" />
              MetaWorks Compliance Assistant
            </CardTitle>
            <CardDescription>
              Your AI guide to NCA ECC compliance
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVoiceOutput}
                    className="h-8 w-8"
                  >
                    {voiceState === "on" ? (
                      <Volume2 className="h-4 w-4" />
                    ) : (
                      <VolumeX className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{voiceState === "on" ? "Disable" : "Enable"} voice responses</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="chat" className="flex-1 flex flex-col" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="assistant">Virtual Consultant</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
          <CardContent className="flex-1 overflow-hidden p-0 pt-4">
            <ScrollArea className="h-full px-4">
              <div className="flex flex-col gap-3 pb-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-full",
                      message.type === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-start gap-3 rounded-lg px-4 py-2 max-w-[85%]",
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.type === "assistant" && (
                        <Avatar className="h-8 w-8 border bg-background">
                          {categoryIcons[message.category]}
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        {message.type === "assistant" && message.category !== "general" && (
                          <Badge variant="outline" className="w-fit mb-1 text-xs">
                            {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                          </Badge>
                        )}
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <span className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {message.type === "user" && (
                        <Avatar className="h-8 w-8 border bg-background">
                          <User className="h-4 w-4" />
                        </Avatar>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3 rounded-lg px-4 py-2 bg-muted">
                      <Avatar className="h-8 w-8 border bg-background">
                        <Bot className="h-4 w-4" />
                      </Avatar>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          {/* Suggestion chips */}
          {messages.length <= 3 && (
            <div className="px-4 py-2">
              <div className="flex flex-wrap gap-2">
                {initialSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => useSuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <CardFooter className="pt-2 pb-4">
            <div className="flex w-full items-center gap-2 border rounded-md pl-3 pr-1 py-1 focus-within:ring-1 focus-within:ring-primary">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about NCA ECC compliance..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                disabled={isLoading}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={toggleVoiceInput}
                      className={cn(
                        "shrink-0",
                        isListening ? "text-red-500 animate-pulse" : ""
                      )}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isListening ? "Stop" : "Start"} voice input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                type="submit"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="assistant" className="flex-1 flex flex-col items-center justify-center p-0 m-0">
          <div className="flex flex-col items-center justify-center space-y-4 p-4 text-center">
            {/* D-ID Agent iframe */}
            <div className="w-full min-h-[400px] border rounded-lg overflow-hidden relative">
              {activeTab === 'assistant' && (
                <iframe 
                  key={iframeKey}
                  src={`/did-agent.html?t=${iframeKey}`}
                  className="w-full h-[400px] border-none bg-black"
                  title="D-ID Virtual Agent"
                  id="did-agent-iframe"
                  allowFullScreen
                  allow="camera *; microphone *; autoplay; clipboard-write"
                  style={{ opacity: didAgentLoaded ? 1 : 0.7 }}
                />
              )}
              
              {!didAgentLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-blue-900/50 to-blue-900/70">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-foreground max-w-md">
                    Loading D-ID agent... If it doesn't appear, please try refreshing.
                  </p>
                </div>
              )}
            </div>
            
            <div className="max-w-sm mt-4">
              <h3 className="text-xl font-semibold">Virtual Cybersecurity Consultant</h3>
              <p className="text-sm text-muted-foreground mt-2">
                I can answer questions about NCA ECC controls, help you understand compliance requirements, and guide you through implementing essential cybersecurity measures.
              </p>
              
              <div className="mt-4 flex space-x-4">
                <Button onClick={() => {
                  setActiveTab("chat");
                  setTimeout(() => {
                    inputRef.current?.focus();
                  }, 100);
                }}>
                  Start Text Chat
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // Show loading indicator
                    setDidAgentLoaded(false);
                    
                    // Force iframe reload by updating the key
                    setIframeKey(Date.now());
                    
                    // After 5 seconds, hide the loading overlay
                    setTimeout(() => {
                      setDidAgentLoaded(true);
                    }, 5000);
                  }}
                >
                  Refresh Agent
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}