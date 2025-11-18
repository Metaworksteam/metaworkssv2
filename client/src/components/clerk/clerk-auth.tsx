import { SignIn, SignUp, UserProfile, UserButton } from "@clerk/clerk-react";
import { useUser, useAuth } from "@clerk/clerk-react";

export function ClerkSignIn() {
  return (
    <div className="w-full max-w-md">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary text-primary-foreground hover:bg-primary/90",
            card: "bg-card",
            headerTitle: "text-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-input",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            footerActionLink: "text-primary hover:text-primary/90"
          },
        }}
      />
    </div>
  );
}

export function ClerkSignUp() {
  return (
    <div className="w-full max-w-md">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary text-primary-foreground hover:bg-primary/90",
            card: "bg-card",
            headerTitle: "text-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-input",
            dividerLine: "bg-border",
            dividerText: "text-muted-foreground",
            footerActionLink: "text-primary hover:text-primary/90"
          },
        }}
      />
    </div>
  );
}

export function ClerkUserProfile() {
  return (
    <div className="w-full max-w-4xl">
      <UserProfile 
        appearance={{
          elements: {
            card: "bg-card",
            navbar: "bg-background",
            navbarButton: "text-foreground",
            pageTitle: "text-foreground",
            formFieldLabel: "text-foreground",
            formFieldInput: "bg-background border-input",
            formButtonPrimary: 
              "bg-primary text-primary-foreground hover:bg-primary/90",
            formButtonReset: "text-destructive hover:text-destructive/90",
            accordionTriggerButton: "text-foreground",
            profileSectionTitle: "text-foreground",
            profileSectionPrimaryButton: 
              "bg-primary text-primary-foreground hover:bg-primary/90",
          },
        }}
      />
    </div>
  );
}

export function ClerkUserButton() {
  return (
    <UserButton 
      appearance={{
        elements: {
          userButtonPopoverCard: "bg-card",
          userButtonPopoverActionButton: "text-foreground hover:bg-muted",
          userButtonPopoverActionButtonText: "text-foreground",
          userButtonPopoverFooter: "border-t border-border",
        },
      }}
    />
  );
}

export function useClerkUser() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useAuth();
  
  return {
    isSignedIn,
    user,
    signOut,
  };
}