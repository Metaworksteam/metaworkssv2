import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Loader2, Send, User, Bot, Mic, MicOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Types for messages
type MessageType = "user" | "assistant";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

// Initial messages that the assistant will show
const initialMessages: Message[] = [
  {
    id: "welcome-message",
    content: "Hello! I'm your MetaWorks cybersecurity compliance assistant. How can I help you today?",
    type: "assistant",
    timestamp: new Date(),
  },
  {
    id: "suggestion-1",
    content: "I can answer questions about NCA ECC controls and help you understand compliance requirements.",
    type: "assistant",
    timestamp: new Date(),
  },
];

// Sample compliance questions and their answers for demo purposes
const complianceQA: Record<string, string> = {
  "what is nca ecc": "The NCA Essential Cybersecurity Controls (ECC) is a set of cybersecurity requirements developed by the National Cybersecurity Authority of Saudi Arabia. It includes controls organized into five domains: Governance, Defense, Resilience, Risk Management, and Technology.",
  "explain control 2-3-3": "Control 2-3-3 in NCA ECC refers to Patch Management. It requires organizations to develop and implement a patch management process to ensure that security patches and updates are applied in a timely manner to reduce security risks.",
  "what is a cybersecurity policy": "A cybersecurity policy is a document that outlines how an organization protects its information assets, systems, and networks from unauthorized access and security threats. It defines procedures, responsibilities, and requirements for maintaining cybersecurity.",
  "help with risk assessment": "For risk assessment under NCA ECC, you should: 1) Identify your critical assets, 2) Determine potential threats, 3) Assess vulnerabilities, 4) Evaluate impacts, 5) Calculate risk levels, and 6) Develop mitigation plans. Would you like me to guide you through each step?",
  "compliance report": "To generate a compliance report, navigate to the Risk Assessment section in the dashboard, run a compliance scan, and click on 'Generate Report'. The system will create a PDF showing your compliance status against all NCA ECC controls.",
};

// Function to generate unique IDs for messages
const generateId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function AssistantChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input field on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      type: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call to get response
    setTimeout(() => {
      generateResponse(userMessage.content);
    }, 1000);
  };

  // Function to generate a response based on user input
  const generateResponse = (question: string) => {
    const lowerQuestion = question.toLowerCase();
    
    // Check for exact or partial matches
    let answer = "";
    
    for (const [key, value] of Object.entries(complianceQA)) {
      if (lowerQuestion.includes(key)) {
        answer = value;
        break;
      }
    }
    
    // Default response if no match
    if (!answer) {
      answer = "I don't have specific information about that query. Please ask about NCA ECC controls, cybersecurity policies, or risk assessment, and I'll do my best to help.";
    }

    const assistantMessage: Message = {
      id: generateId(),
      content: answer,
      type: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  // Function to handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  // Function to toggle voice input
  const toggleVoiceInput = () => {
    setIsListening((prev) => !prev);
    
    // Placeholder for speech recognition
    if (!isListening) {
      // This would be where you'd implement the speech recognition API
      // For now, it's just a visual toggle
      
      // Simulate turning off after 3 seconds
      setTimeout(() => {
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <Card className="flex flex-col h-[700px] max-h-[80vh] backdrop-blur-sm bg-card/50 border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          Virtual Cybersecurity Consultant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full px-4">
          <div className="flex flex-col gap-3 py-3">
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
                    "flex items-start gap-3 rounded-lg px-4 py-2 max-w-[80%]",
                    message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.type === "assistant" && (
                    <Avatar className="h-8 w-8 border bg-background">
                      <Bot className="h-4 w-4" />
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm">{message.content}</p>
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
      
      <CardFooter className="pt-0">
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
    </Card>
  );
}