import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Sparkles, Volume2, VolumeX } from "lucide-react";

interface AgentWidgetProps {
  title?: string;
  initialMessage?: string;
  showInput?: boolean;
}

export default function AgentWidget({ 
  title = "MetaWorks Security Assistant", 
  initialMessage = "Hello, I'm your security assistant. How can I help you today?", 
  showInput = true
}: AgentWidgetProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [talkId, setTalkId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  // Fetch DID API keys when component mounts
  useEffect(() => {
    async function fetchDidKeys() {
      try {
        const response = await fetch('/api/did-keys');
        if (!response.ok) {
          throw new Error('Failed to fetch DID keys');
        }
        
        const data = await response.json();
        setAgentId(data.agentId || 'kgn-KqCZSo');
        setApiKey(data.apiKey || null);
        
        // If no initial message is provided, don't send anything
        if (initialMessage) {
          await sendMessage(initialMessage);
        }
      } catch (error) {
        console.error('Error fetching DID keys:', error);
        toast({
          title: "Connection Error",
          description: "Could not connect to the virtual agent service",
          variant: "destructive"
        });
      }
    }
    
    fetchDidKeys();
  }, [initialMessage, toast]);

  // Handle sending a message to the DID API
  const sendMessage = async (text: string) => {
    try {
      setIsSending(true);

      // Call our backend API which will securely communicate with DID
      const response = await fetch('/api/did-agent/talk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          presenter_id: agentId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to communicate with agent service');
      }

      const data = await response.json();
      setTalkId(data.id);

      // Poll for the completed talk
      pollTalkStatus(data.id);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Error",
        description: error instanceof Error ? error.message : "Failed to send message to the agent",
        variant: "destructive"
      });
      setIsSending(false);
    }
  };

  // Poll the talk status until it's ready
  const pollTalkStatus = async (id: string) => {
    try {
      const response = await fetch(`/api/did-agent/talk/${id}`);
      if (!response.ok) {
        throw new Error('Failed to check talk status');
      }

      const data = await response.json();
      
      if (data.status === 'done') {
        setVideoUrl(data.result_url);
        setIsSending(false);
      } else if (data.status === 'error') {
        throw new Error(data.error || 'An error occurred with the agent service');
      } else {
        // Continue polling if not done
        setTimeout(() => pollTalkStatus(id), 1000);
      }
    } catch (error) {
      console.error('Error polling talk status:', error);
      toast({
        title: "Agent Error",
        description: error instanceof Error ? error.message : "Failed to get agent response",
        variant: "destructive"
      });
      setIsSending(false);
    }
  };

  // Handle user message submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage("");
  };

  // Toggle mute state
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-primary/10 backdrop-blur-sm bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="rounded-lg overflow-hidden bg-black/5 aspect-video w-full flex items-center justify-center relative">
          {videoUrl ? (
            <>
              <video 
                ref={videoRef} 
                src={videoUrl} 
                className="w-full h-full object-cover"
                autoPlay 
                loop
              />
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute bottom-2 right-2 bg-background/80 hover:bg-background/90"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </>
          ) : (
            <div className="text-center p-4">
              {isSending ? (
                <div className="flex flex-col items-center space-y-2">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Your security assistant is thinking...</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Your security assistant is ready to help</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      {showInput && (
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full space-y-2">
            <div className="flex w-full items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask me anything about cybersecurity..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
                className="flex-1"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={isSending || !message.trim()}
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardFooter>
      )}
    </Card>
  );
}