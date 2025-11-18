import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DirectFileUploaderProps {
  onFileUploaded: (fileId: number, filename: string, url: string) => void;
  accept?: string;
  buttonText?: string;
  endpoint: string;
  fieldName: string;
  maxSize?: number;
}

export function DirectFileUploader({
  onFileUploaded,
  accept = "*/*",
  buttonText = "Upload File",
  endpoint,
  fieldName,
  maxSize = 10 * 1024 * 1024 // 10MB default max size
}: DirectFileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    // Check file size
    if (maxSize && file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize / (1024 * 1024)}MB`,
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    // Create form data
    const formData = new FormData();
    formData.append(fieldName, file);
    
    // Display uploading toast
    toast({
      title: "Uploading file...",
      description: "Please wait while your file is being uploaded.",
    });
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(errorData.message || 'File upload failed');
      }
      
      const data = await response.json();
      
      // Success notification
      toast({
        title: "File uploaded successfully",
        description: file.name,
      });
      
      // Call callback with file ID and URL
      onFileUploaded(data.fileId, data.filename, data.url);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept={accept}
        className="hidden"
        id="file-upload"
      />
      <Button 
        type="button"
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            {buttonText}
          </>
        )}
      </Button>
    </div>
  );
}