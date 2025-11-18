import { SecurityTimeline } from "@/components/progress/security-timeline";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Calendar, BookOpen, Star } from "lucide-react";

export default function SecurityProgressPage() {
  return (
    <>
      <Helmet>
        <title>Security Journey Progress | MetaWorks</title>
      </Helmet>

      <div className="container py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Security Journey Progress</h1>
          <p className="text-muted-foreground">
            Track your cybersecurity compliance journey and progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="col-span-1">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="rounded-full bg-primary/10 p-4 mb-3">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div className="text-4xl font-bold">56%</div>
              <div className="text-sm text-muted-foreground text-center">Overall Compliance</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="rounded-full bg-green-100 p-4 mb-3">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold">3</div>
              <div className="text-sm text-muted-foreground text-center">Badges Earned</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="rounded-full bg-blue-100 p-4 mb-3">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold">12</div>
              <div className="text-sm text-muted-foreground text-center">Completed Steps</div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="rounded-full bg-amber-100 p-4 mb-3">
                <Star className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-4xl font-bold">540</div>
              <div className="text-sm text-muted-foreground text-center">Points Earned</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="badges">Badges & Achievements</TabsTrigger>
            <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timeline" className="mt-0">
            <SecurityTimeline />
          </TabsContent>
          
          <TabsContent value="badges" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <Badge className="p-6 flex flex-col items-center justify-center gap-2 bg-muted">
                    <Award className="h-12 w-12" />
                    <div className="text-center">
                      <h3 className="font-medium">Security First Steps</h3>
                      <p className="text-sm text-muted-foreground">Complete your first assessment</p>
                    </div>
                  </Badge>
                  
                  <Badge className="p-6 flex flex-col items-center justify-center gap-2 bg-green-100 text-green-800">
                    <Award className="h-12 w-12" />
                    <div className="text-center">
                      <h3 className="font-medium">Risk Ranger</h3>
                      <p className="text-sm text-muted-foreground">Complete risk assessment</p>
                    </div>
                  </Badge>
                  
                  <Badge className="p-6 flex flex-col items-center justify-center gap-2 bg-amber-100 text-amber-800">
                    <Award className="h-12 w-12" />
                    <div className="text-center">
                      <h3 className="font-medium">Policy Pro</h3>
                      <p className="text-sm text-muted-foreground">Develop security policies</p>
                    </div>
                  </Badge>
                  
                  <Badge className="p-6 flex flex-col items-center justify-center gap-2 bg-muted">
                    <Award className="h-12 w-12" />
                    <div className="text-center">
                      <h3 className="font-medium">Compliance Champion</h3>
                      <p className="text-sm text-muted-foreground">Reach 80% compliance</p>
                    </div>
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">
                  Detailed statistics will be available as you progress through your security journey.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}