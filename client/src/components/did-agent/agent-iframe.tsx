import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface AgentIframeProps {
  title?: string;
  shareLink?: string;
  height?: string;
}

export default function AgentIframe({
  title = "MetaWorks Security Assistant",
  shareLink = "https://studio.d-id.com/agents/share?id=agt_YjpQXzSG&utm_source=copy&key=WjI5dloyeGxMVzloZFhSb01ud3hNRGM1TWpNME5qWTNORFkxTURVeU1UTTJPVEU2V0hKdlJGRlNZbkJITW5nMlNYSkdSRGxJY2paRA==",
  height = "600px"
}: AgentIframeProps) {
  return (
    <Card className="w-full shadow-lg border-primary/10 backdrop-blur-sm bg-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="rounded-lg overflow-hidden w-full bg-black/5">
          <iframe
            src={shareLink}
            width="100%"
            height={height}
            className="border-0"
            allow="camera; microphone; clipboard-write; autoplay"
            allowFullScreen
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}