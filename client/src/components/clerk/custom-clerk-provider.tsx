import { ClerkProvider } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { fetchClerkPublishableKey } from "@/lib/clerk";
import { Loader2 } from "lucide-react";

interface CustomClerkProviderProps {
  children: React.ReactNode;
}

export function CustomClerkProvider({ children }: CustomClerkProviderProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClerkPublishableKey()
      .then(fetchedKey => {
        setKey(fetchedKey);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching Clerk publishable key:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!key) {
    console.warn("Missing Clerk Publishable Key. User authentication might not work correctly.");
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={key}>{children}</ClerkProvider>;
}

export default CustomClerkProvider;