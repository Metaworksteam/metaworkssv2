import { ClerkProvider } from "@clerk/clerk-react";
import { apiRequest } from "./queryClient";

// Get the Clerk Publishable Key from our API endpoint
export let clerkPublishableKey = "";

// Function to fetch the publishable key from the server
export async function fetchClerkPublishableKey() {
  try {
    const res = await apiRequest("GET", "/api/clerk-key");
    const data = await res.json();
    if (data.publishableKey) {
      clerkPublishableKey = data.publishableKey;
      return data.publishableKey;
    }
    return "";
  } catch (error) {
    console.error("Failed to fetch Clerk publishable key:", error);
    return "";
  }
}

export { ClerkProvider };