import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import SolutionPage from "@/pages/solution-page";
import PricingPage from "@/pages/pricing-page";
import AboutPage from "@/pages/about-page";
import ContactUsPage from "@/pages/contact-us-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import AdminPage from "@/pages/admin-page";
import VirtualAssistantPage from "@/pages/virtual-assistant-page";
import DIDAgentPage from "@/pages/did-agent-page";
import AgentTestPage from "@/pages/agent-test-page";
import NcaEccPage from "@/pages/frameworks/nca-ecc-page";
import NcaEccAssessmentPage from "@/pages/frameworks/nca-ecc-assessment-page";
import SamaPage from "@/pages/frameworks/sama-page";
import SAMAFrameworkPage from "@/pages/sama-framework-page";
import PdplPage from "@/pages/frameworks/pdpl-page";
import Iso27001Page from "@/pages/frameworks/iso-27001-page";
import SecurityTimelineDemo from "@/pages/security-timeline-demo";
import SecurityProgressPage from "@/pages/security-progress-page";
import RiskManagementPage from "@/pages/risk-management-page";
import RiskAssessmentPage from "@/pages/risk-assessment-page";
import RiskPredictionPage from "@/pages/risk-prediction-page";
import PolicyManagementPage from "@/pages/policy-management-page";
import CompanyDashboardPage from "@/pages/company-dashboard-page";
import OnboardingPage from "@/pages/onboarding-page";
import ClerkAuthPage from "@/pages/clerk-auth-page";
import ClerkAdminPage from "@/pages/clerk-admin-page";
import UserDashboard from "@/pages/user-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import SharedReportPage from "@/pages/shared-report-page";
import AdminMessagesPage from "@/pages/admin-messages-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { ClerkProtectedRoute } from "@/lib/clerk-protected-route";
import { AdminProtectedRoute, UserProtectedRoute } from "@/lib/role-protected-routes";
import ThemeProvider from "@/components/layout/theme-switch";
import CustomClerkProvider from "@/components/clerk/custom-clerk-provider";

function Router() {
        return (
                <Switch>
                        <Route path="/" component={HomePage} />
                        {/* Public Pages */}
                        <Route path="/solution" component={SolutionPage} />
                        <Route path="/pricing" component={PricingPage} />
                        <Route path="/about" component={AboutPage} />
                        <Route path="/contact-us" component={ContactUsPage} />
                        {/* Standard Authentication Routes */}
                        <Route path="/login" component={AuthPage} />
                        <Route path="/auth" component={AuthPage} />
                        {/* Clerk Authentication Routes */}
                        <Route path="/clerk-auth" component={ClerkAuthPage} />
                        <Route path="/clerk-login" component={ClerkAuthPage} />
                        <ClerkProtectedRoute path="/clerk-admin" component={ClerkAdminPage} />
                        {/* New Role-Protected Routes */}
                        <AdminProtectedRoute path="/admin-dashboard" component={AdminDashboard} />
                        <UserProtectedRoute path="/user-dashboard" component={UserDashboard} />
                        {/* Protected Routes - accessible through either auth system */}
                        <ProtectedRoute path="/dashboard" component={DashboardPage} />
                        <ProtectedRoute path="/admin" component={AdminPage} />
                        <ProtectedRoute path="/admin-messages" component={AdminMessagesPage} />
                        <ProtectedRoute path="/virtual-assistant" component={VirtualAssistantPage} />
                        <ProtectedRoute path="/risk-management" component={RiskManagementPage} />
                        <ProtectedRoute path="/risk-assessment" component={RiskAssessmentPage} />
                        <ProtectedRoute path="/risk-prediction" component={RiskPredictionPage} />
                        <ProtectedRoute path="/policies" component={PolicyManagementPage} />
                        <ProtectedRoute path="/security-timeline" component={SecurityTimelineDemo} />
                        <ProtectedRoute path="/security-progress" component={SecurityProgressPage} />
                        <Route path="/company" component={CompanyDashboardPage} />
                        <Route path="/onboarding" component={OnboardingPage} />
                        {/* Public Routes */}
                        <Route path="/did-agent" component={DIDAgentPage} />
                        <Route path="/agent" component={DIDAgentPage} />
                        <Route path="/agent-test" component={AgentTestPage} />
                        <Route path="/frameworks/nca-ecc" component={NcaEccPage} />
                        <ProtectedRoute path="/frameworks/nca-ecc-assessment" component={NcaEccAssessmentPage} />
                        <Route path="/frameworks/sama" component={SamaPage} />
                        <ProtectedRoute path="/frameworks/sama-assessment" component={SAMAFrameworkPage} />
                        <Route path="/frameworks/pdpl" component={PdplPage} />
                        <Route path="/frameworks/iso-27001" component={Iso27001Page} />
                        {/* Report Routes */}
                        <Route path="/shared-report/:token" component={SharedReportPage} />
                        <ProtectedRoute path="/reports/:id" component={NotFound} />
                        <Route component={NotFound} />
                </Switch>
        );
}

function App() {
        return (
                <QueryClientProvider client={queryClient}>
                        <CustomClerkProvider>
                                <AuthProvider>
                                        <HelmetProvider>
                                                <ThemeProvider>
                                                        <Router />
                                                        <Toaster />
                                                </ThemeProvider>
                                        </HelmetProvider>
                                </AuthProvider>
                        </CustomClerkProvider>
                </QueryClientProvider>
        );
}

export default App;
