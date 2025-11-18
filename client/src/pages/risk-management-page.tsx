import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Filter, 
  Plus, 
  RefreshCw, 
  Upload
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/use-auth";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import RiskEntryForm, { Risk } from "@/components/risks/risk-entry-form";
import RiskBulkImport from "@/components/risks/risk-bulk-import";

export default function RiskManagementPage() {
  const { user } = useAuth();
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch risks
  const { data: risks, isLoading, isError, refetch } = useQuery<Risk[]>({
    queryKey: ['/api/risks'],
    throwOnError: false,
  });
  
  // Filter risks based on search term and active tab
  const filteredRisks = risks?.filter(risk => {
    const matchesSearch = searchTerm === "" || 
      risk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
      (activeTab === "high" && risk.inherentRiskLevel === "High") ||
      (activeTab === "medium" && risk.inherentRiskLevel === "Medium") ||
      (activeTab === "low" && risk.inherentRiskLevel === "Low") ||
      (activeTab === "accepted" && risk.isAccepted);
      
    return matchesSearch && matchesTab;
  });
  
  const riskLevelColor = (level?: string) => {
    switch (level) {
      case "High": return "text-destructive";
      case "Medium": return "text-amber-500";
      case "Low": return "text-green-500";
      default: return "text-gray-500";
    }
  };
  
  const handleRiskClick = (risk: Risk) => {
    setSelectedRisk(risk);
    setIsEditDialogOpen(true);
  };
  
  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    refetch();
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedRisk(null);
    refetch();
  };
  
  const handleImportSuccess = () => {
    setIsImportDialogOpen(false);
    refetch();
  };
  
  // Calculate risk statistics
  const totalRisks = risks?.length || 0;
  const highRisks = risks?.filter(r => r.inherentRiskLevel === "High").length || 0;
  const mediumRisks = risks?.filter(r => r.inherentRiskLevel === "Medium").length || 0;
  const lowRisks = risks?.filter(r => r.inherentRiskLevel === "Low").length || 0;
  const acceptedRisks = risks?.filter(r => r.isAccepted).length || 0;
  
  return (
    <>
      <Helmet>
        <title>Risk Management | MetaWorks</title>
      </Helmet>
      
      <div className="flex flex-col h-full gap-4 p-4 md:p-6">
        <PageHeader
          title="Risk Management"
          description="Identify, assess and manage cybersecurity risks"
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsImportDialogOpen(true)}
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Risk
              </Button>
            </div>
          }
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="py-4">
              <CardTitle className="text-xl">Total Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">
                {isLoading ? <Skeleton className="h-10 w-16" /> : totalRisks}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="py-4">
              <CardTitle className="text-xl text-destructive">High Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">
                {isLoading ? <Skeleton className="h-10 w-16" /> : highRisks}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="py-4">
              <CardTitle className="text-xl text-amber-500">Medium Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-500">
                {isLoading ? <Skeleton className="h-10 w-16" /> : mediumRisks}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur">
            <CardHeader className="py-4">
              <CardTitle className="text-xl text-green-500">Low Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-500">
                {isLoading ? <Skeleton className="h-10 w-16" /> : lowRisks}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="flex-1 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Risk Register</CardTitle>
                <CardDescription>View and manage all identified risks</CardDescription>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Input 
                  placeholder="Search risks..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-xs"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter By</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => setActiveTab("all")}>
                        All Risks
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab("high")}>
                        <span className="text-destructive font-medium mr-2">●</span>
                        High Risks
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab("medium")}>
                        <span className="text-amber-500 font-medium mr-2">●</span>
                        Medium Risks
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setActiveTab("low")}>
                        <span className="text-green-500 font-medium mr-2">●</span>
                        Low Risks
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setActiveTab("accepted")}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accepted Risks
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="all" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="high" className="text-destructive">High</TabsTrigger>
                <TabsTrigger value="medium" className="text-amber-500">Medium</TabsTrigger>
                <TabsTrigger value="low" className="text-green-500">Low</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Likelihood</TableHead>
                        <TableHead>Impact</TableHead>
                        <TableHead>Inherent Risk</TableHead>
                        <TableHead>Residual Risk</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(5).fill(0).map((_, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={7}>
                              <Skeleton className="h-10 w-full" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : isError ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-destructive">
                            <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                            <p>Failed to load risks. Please try again.</p>
                          </TableCell>
                        </TableRow>
                      ) : filteredRisks?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No risks found.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRisks?.map((risk) => (
                          <TableRow 
                            key={risk.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => handleRiskClick(risk)}
                          >
                            <TableCell>
                              <div className="font-medium">{risk.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                                {risk.description}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{risk.category}</Badge>
                            </TableCell>
                            <TableCell>{risk.likelihood}</TableCell>
                            <TableCell>{risk.impact}</TableCell>
                            <TableCell>
                              <span className={cn("font-semibold", riskLevelColor(risk.inherentRiskLevel))}>
                                {risk.inherentRiskLevel}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={cn("font-semibold", riskLevelColor(risk.residualRiskLevel))}>
                                {risk.residualRiskLevel || 'Not assessed'}
                              </span>
                            </TableCell>
                            <TableCell>
                              {risk.isAccepted ? (
                                <Badge variant="outline" className="border-green-500 text-green-500">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Accepted
                                </Badge>
                              ) : (
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Open
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="high" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                    {/* This is just a different filter of the same data */}
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="medium" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="low" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="accepted" className="m-0">
                <div className="border rounded-md">
                  <Table>
                    {/* Same table structure as the "all" tab */}
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Risk Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Risk</DialogTitle>
            <DialogDescription>
              Enter the details of the new risk to add to the register
            </DialogDescription>
          </DialogHeader>
          <RiskEntryForm 
            onSuccess={handleCreateSuccess} 
            companyId={1} // Replace with actual company ID
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Risk Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Risk</DialogTitle>
            <DialogDescription>
              Update the details of this risk
            </DialogDescription>
          </DialogHeader>
          {selectedRisk && (
            <RiskEntryForm 
              initialData={selectedRisk}
              onSuccess={handleEditSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Bulk Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Import Risks</DialogTitle>
            <DialogDescription>
              Import multiple risks at once using JSON or file upload
            </DialogDescription>
          </DialogHeader>
          <RiskBulkImport 
            onSuccess={handleImportSuccess}
            companyId={1} // Replace with actual company ID
          />
        </DialogContent>
      </Dialog>
    </>
  );
}