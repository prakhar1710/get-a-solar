import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Project, Bid } from '@/types';
import ProjectCard from '@/components/dashboard/ProjectCard';
import BidForm from '@/components/forms/BidForm';
import { RefreshCw, Search, FileText, Upload, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock data for available projects
const mockAvailableProjects: Project[] = [
  {
    id: '1',
    customer_id: '1',
    title: '10 kW Rooftop Solar Installation',
    location: 'Indiranagar',
    system_size: 10,
    budget: 450000,
    description: 'Looking for a reliable vendor to install a 10 kW rooftop solar system for my home. The roof is relatively new and has good sun exposure throughout the day.',
    state: 'Karnataka',
    subsidy_applied: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    status: 'open'
  },
  {
    id: '2',
    customer_id: '1',
    title: '5 kW Solar System for Small Office',
    location: 'Koramangala',
    system_size: 5,
    budget: 225000,
    description: 'Need a solar system for my small office space. Roof area approximately 500 sq ft. Looking for efficient panels with good warranty.',
    state: 'Karnataka',
    subsidy_applied: false,
    created_at: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    status: 'open'
  },
  {
    id: '4',
    customer_id: '2',
    title: '20 kW System for Manufacturing Unit',
    location: 'Electronic City',
    system_size: 20,
    budget: 900000,
    description: 'Manufacturing unit looking to reduce electricity costs with solar installation. Roof area is sufficient and clear of obstructions.',
    state: 'Karnataka',
    subsidy_applied: true,
    created_at: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    status: 'open'
  }
];

// Mock data for vendor's submitted bids
const mockSubmittedBids: Bid[] = [
  {
    id: '1',
    project_id: '3',
    vendor_id: '1',
    price_per_watt: 48,
    equipment_tier: 'tier1',
    timeline_days: 30,
    amc_included: true,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

const VendorDashboard: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [submittedBids, setSubmittedBids] = useState<Bid[]>(mockSubmittedBids);
  const [availableProjects, setAvailableProjects] = useState<Project[]>(mockAvailableProjects);

  const handleBidSubmit = (data: any) => {
    if (!selectedProject) return;
    
    const newBid: Bid = {
      id: (submittedBids.length + 1).toString(),
      project_id: selectedProject.id,
      vendor_id: '1', // In a real app, this would be the logged-in vendor's ID
      price_per_watt: data.price_per_watt,
      equipment_tier: data.equipment_tier,
      timeline_days: data.timeline_days,
      amc_included: data.amc_included,
      created_at: new Date().toISOString()
    };

    setSubmittedBids([...submittedBids, newBid]);
    setShowBidForm(false);
    
    toast({
      title: "Bid submitted successfully",
      description: "Your bid has been sent to the customer for review.",
    });
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowBidForm(true);
  };

  // Filter projects based on search term
  const filteredProjects = availableProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if vendor has already bid on a project
  const hasBidOnProject = (projectId: string) => {
    return submittedBids.some(bid => bid.project_id === projectId);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Browse available solar projects and submit competitive bids
            </p>
          </div>
          <Button 
            className="bg-sbs-orange hover:bg-sbs-orange/90 text-white flex items-center gap-2"
          >
            <Upload className="h-4 w-4" /> Upload Certifications
          </Button>
        </div>

        {/* Verification Status Card */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  <Check className="h-3 w-3 mr-1" /> GSTIN Verified
                </Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  ALMM Certification Pending
                </Badge>
                <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                  BIS Certification Pending
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete your verification process to improve your visibility and bid ranking.
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="text-sbs-orange border-sbs-orange hover:bg-sbs-orange hover:text-white">
              Complete Verification
            </Button>
          </CardFooter>
        </Card>

        {/* Main dashboard content */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList>
            <TabsTrigger value="available">Available Projects</TabsTrigger>
            <TabsTrigger value="mybids">My Bids</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search projects by title, location..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" title="Refresh projects">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="dashboard-section">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No projects match your search criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="overflow-hidden border-border/40 shadow-sm hover:shadow transition-shadow duration-300">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                            <CardDescription>
                              {project.location}, {project.state}
                            </CardDescription>
                          </div>
                          {hasBidOnProject(project.id) && (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              Bid Submitted
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">System Size</p>
                              <p className="font-medium">{project.system_size} kW</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Budget</p>
                              <p className="font-medium">₹{(project.budget / 100000).toFixed(1)}L</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">Description</p>
                            <p className="text-sm line-clamp-2">{project.description}</p>
                          </div>
                          {project.subsidy_applied && (
                            <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md inline-block">
                              State subsidy applicable
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button 
                          className="w-full bg-sbs-orange hover:bg-sbs-orange/90 text-white"
                          onClick={() => handleProjectSelect(project)}
                          disabled={hasBidOnProject(project.id)}
                        >
                          {hasBidOnProject(project.id) ? 'Bid Submitted' : 'Submit Bid'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="mybids">
            <div className="dashboard-section">
              {submittedBids.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
                  <h3 className="text-lg font-medium mb-2">No bids submitted yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse available projects and submit your first bid
                  </p>
                  <Button 
                    onClick={() => document.querySelector('[data-value="available"]')?.dispatchEvent(new MouseEvent('click'))}
                    className="bg-sbs-orange hover:bg-sbs-orange/90 text-white"
                  >
                    View Available Projects
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {submittedBids.map((bid) => {
                    // In a real app, you'd fetch the project details based on bid.project_id
                    const project = [...mockAvailableProjects, {
                      id: '3',
                      customer_id: '1',
                      title: '15 kW Commercial Installation',
                      location: 'Whitefield',
                      system_size: 15,
                      budget: 675000,
                      description: 'Commercial property requiring 15kW installation. Roof is flat concrete with clear sun exposure. Multiple quotes welcome.',
                      state: 'Karnataka',
                      subsidy_applied: true,
                      created_at: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
                      status: 'closed'
                    }].find(p => p.id === bid.project_id);
                    
                    if (!project) return null;
                    
                    return (
                      <Card key={bid.id} className="overflow-hidden border-border/40">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
                          <CardDescription>
                            {project.location}, {project.state}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Your Bid</p>
                              <p className="font-medium">₹{bid.price_per_watt}/W</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Equipment</p>
                              <p className="font-medium capitalize">{bid.equipment_tier.replace('tier', 'Tier ')}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Timeline</p>
                              <p className="font-medium">{bid.timeline_days} days</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">AMC</p>
                              <p className="font-medium">{bid.amc_included ? 'Included' : 'Not included'}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex justify-between">
                          <div className="text-xs">
                            Bid submitted on {new Date(bid.created_at).toLocaleDateString()}
                          </div>
                          <Badge variant={project.status === 'open' ? 'outline' : 'secondary'}>
                            Project {project.status}
                          </Badge>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bid Submission Dialog */}
      <Dialog open={showBidForm} onOpenChange={setShowBidForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Bid</DialogTitle>
            <DialogDescription>
              {selectedProject?.title} - {selectedProject?.system_size} kW System
            </DialogDescription>
          </DialogHeader>
          <BidForm 
            onSubmit={handleBidSubmit} 
            projectSize={selectedProject?.system_size}
          />
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default VendorDashboard;
