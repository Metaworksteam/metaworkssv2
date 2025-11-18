import { Helmet } from "react-helmet-async";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AwardIcon, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserGameStats {
  totalPoints: number;
  level: number;
  streakDays: number;
  completedSteps: number;
}

export default function OnboardingPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch user game stats if logged in
  const { data: gameStats } = useQuery<UserGameStats>({
    queryKey: ["/api/gamification/user-stats"],
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });

  // Fetch user badges if logged in
  const { data: userBadges } = useQuery<any[]>({
    queryKey: ["/api/gamification/user-badges"],
    enabled: !!user?.id,
    staleTime: 60 * 1000,
  });

  return (
    <>
      <Helmet>
        <title>Onboarding & Learning | MetaWorks</title>
      </Helmet>

      <div className="container mx-auto py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-1">Onboarding & Learning</h1>
        <p className="text-muted-foreground mb-6">
          Complete the onboarding journey to learn about cybersecurity compliance
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar with user stats */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Progress</CardTitle>
                <CardDescription>
                  Track your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Level {gameStats?.level || 1}</span>
                        <span className="text-sm text-muted-foreground">
                          {gameStats?.totalPoints || 0} points
                        </span>
                      </div>
                      <Progress value={
                        gameStats?.totalPoints 
                          ? (gameStats.totalPoints % 100) 
                          : 0
                      } className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {gameStats?.totalPoints
                          ? 100 - (gameStats.totalPoints % 100)
                          : 100} points until next level
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-card border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Completed Steps</p>
                        <p className="text-2xl font-semibold flex items-end gap-1">
                          {gameStats?.completedSteps || 0}
                          <span className="text-xs text-muted-foreground pb-1">steps</span>
                        </p>
                      </div>
                      <div className="bg-card border rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">Current Streak</p>
                        <p className="text-2xl font-semibold flex items-end gap-1">
                          {gameStats?.streakDays || 0}
                          <span className="text-xs text-muted-foreground pb-1">days</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <AwardIcon className="h-4 w-4" />
                        <span>Your Badges</span>
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {userBadges && userBadges.length > 0 ? (
                          userBadges.map((badge) => (
                            <div 
                              key={badge.id}
                              className="flex flex-col items-center justify-center bg-muted/30 rounded-md p-2"
                              title={badge.name}
                            >
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <AwardIcon className="h-5 w-5 text-primary" />
                              </div>
                              <span className="text-xs truncate max-w-full block mt-1">
                                {badge.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-4 text-center p-3">
                            <p className="text-sm text-muted-foreground">
                              No badges earned yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">
                      Login to track your progress
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="group flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                      <h3 className="font-medium">ECC Framework Guide</h3>
                      <p className="text-sm text-muted-foreground">Official documentation</p>
                    </div>
                    <Badge variant="outline">PDF</Badge>
                  </div>

                  <div className="group flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                      <h3 className="font-medium">Cybersecurity Basics</h3>
                      <p className="text-sm text-muted-foreground">Introduction to core concepts</p>
                    </div>
                    <Badge variant="outline">Article</Badge>
                  </div>

                  <div className="group flex items-center justify-between p-3 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <div>
                      <h3 className="font-medium">Policy Templates</h3>
                      <p className="text-sm text-muted-foreground">Sample security policies</p>
                    </div>
                    <Badge variant="outline">Templates</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="onboarding" className="mb-6">
              <TabsList>
                <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
                <TabsTrigger value="learning">Learning Modules</TabsTrigger>
              </TabsList>
              <TabsContent value="onboarding">
                <OnboardingWizard />
              </TabsContent>
              <TabsContent value="learning">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-12">
                      <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">Learning Modules Coming Soon</h3>
                      <p className="text-muted-foreground text-center max-w-md">
                        Our interactive learning modules are under development. 
                        Complete the onboarding process to get started with the basics.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}