import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Check } from "lucide-react";

export default function LogoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: async (fileData: FormData) => {
      const res = await apiRequest("POST", "/api/upload/logo", fileData, {
        isFormData: true,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Logo uploaded",
        description: "Your company logo has been uploaded successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/company"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, GIF, or SVG file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 2MB)
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 2MB.",
          variant: "destructive",
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    formData.append("logo", file);
    
    uploadMutation.mutate(formData);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo Image</Label>
            <Input 
              id="logo" 
              type="file" 
              accept="image/jpeg, image/png, image/gif, image/svg+xml" 
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground">
              Upload a JPEG, PNG, GIF, or SVG file (max 2MB)
            </p>
          </div>
          
          {preview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="border rounded-md p-4 flex justify-center">
                <img 
                  src={preview} 
                  alt="Logo preview" 
                  className="max-h-32 max-w-full object-contain" 
                />
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={!file || uploadMutation.isPending}
            className="w-full"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : uploadMutation.isSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Uploaded
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}