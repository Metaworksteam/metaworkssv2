import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  buttonText?: string;
  isLoading?: boolean;
}

export function FileUploader({
  onFileSelect,
  accept = '*',
  multiple = false,
  buttonText = 'Upload File',
  isLoading = false
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(multiple ? files : [files[0]]);
      onFileSelect(multiple ? files : [files[0]]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
        id="file-upload"
      />
      
      <Button 
        type="button" 
        onClick={triggerFileSelect}
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Upload className="h-4 w-4 mr-2" />
        )}
        {buttonText}
      </Button>
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div 
              key={`${file.name}-${index}`} 
              className="flex items-center justify-between p-2 pl-3 rounded-md bg-secondary/20"
            >
              <div className="flex items-center space-x-2 truncate max-w-[80%]">
                <span className="text-xs text-muted-foreground truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({file.size < 1024 * 1024 
                    ? `${Math.round(file.size / 1024)} KB` 
                    : `${(file.size / (1024 * 1024)).toFixed(1)} MB`})
                </span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => handleRemoveFile(index)}
                className="h-6 w-6 p-0"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}