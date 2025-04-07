
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProjectForm from '@/components/forms/ProjectForm';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project, Bid } from '@/types';
import BidCard from '@/components/dashboard/BidCard';
import { rankBids } from '@/utils/bidRanking';
import { Plus, RefreshCw, FilterX, SlidersHorizontal } from 'lucide-react';

// Mock data for projects
const mockProjects: Project[] = [
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
  }
];

// Mock data for bids on project 1
const mockBids: Bid[] = [
  {
    id: '1',
    project_id: '1',
    vendor_id: '1',
    price_per_watt: 48,
    equipment_tier: 'tier1',
    timeline_days: 30,
    amc_included: true,
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    vendor_name: 'SolarTech Solutions',
    vendor_rating: 4.8
  },
  {
    id: '2',
    project_id: '1',
    vendor_id: '2',
    price_per_watt: 45,
    equipment_tier: 'tier3',
    timeline_days: 21,
    amc_included: false,
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
    vendor_name: 'EcoSolar India',
    vendor_rating: 3.5
  },
  {
    id: '3',
    project_id: '1',
    vendor_id: '3',
    price_per_watt: 50,
    equipment_tier: 'tier1',
    timeline_days: 25,
    amc_included: true,
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    vendor_name: 'Premium Solar',
    vendor_rating: 4.9
  },
  {
    id: '4',
    project_id: '1',
    vendor_id: '4',
    price_per_watt: 44,
    equipment_tier: 'tier2',
    timeline_days: 35,
    amc_included: false,
    created_at: new Date(Date.now() - 3600000 * 10).toISOString(),
    vendor_name: 'SunRise Energy',
    vendor_rating: 3.8
  }
];

const CustomerDashboard: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [projectBids, setProjectBids] = useState<Bid[]>([]);
  const [rankedBids, setRankedBids] = useState<Bid[]>([]);
  const [showBidsDialog, setShowBidsDialog] = useState(false);

  const handleProjectSubmit = (data: any) => {
    const newProject: Project = {
      id: (projects.length + 1).toString(),
      customer_id: '1',
      title: data.title,
      location: data.location,
      system_size: data.system_size,
      budget: data.budget,
      description: data.description,
      state: data.state,
      subsidy_applied: data.subsidy_applied,
      created_at: new Date().toISOString(),
      status: 'open'
    };

    setProjects([...projects, newProject]);
    setShowNewProjectForm(false);
    
    toast({
      title: "Project created successfully",
      description: "Your solar project is now visible to vendors for bidding.",
    });
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    // In a real app, you'd fetch bids for the selected project
    if (project.id === '1') {
      const bids = mockBids;
      setProjectBids(bids);
      
      // Rank the bids using our algorithm
      const ranked = rankBids(bids, project);
      setRankedBids(ranked);
    } else {
      setProjectBids([]);
      setRankedBids([]);
    }
    
    setShowBidsDialog(true);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Customer Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Post solar project requirements and receive competitive vendor bids
            </p>
          </div>
          <Button 
            onClick={() => setShowNewProjectForm(true)}
            className="bg-sbs-purple hover:bg-sbs-purple-dark text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>

        <div className="dashboard-section">
          <Tabs defaultValue="active" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="active">Active Projects</TabsTrigger>
                <TabsTrigger value="closed">Closed Projects</TabsTrigger>
                <TabsTrigger value="all">All Projects</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <SlidersHorizontal className="h-4 w-4" /> Filter
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <RefreshCw className="h-4 w-4" /> Refresh
                </Button>
              </div>
            </div>
            
            <TabsContent value="active">
              {projects.filter(p => p.status !== 'closed').length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No active projects</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first project to start receiving bids from verified solar vendors
                  </p>
                  <Button 
                    onClick={() => setShowNewProjectForm(true)}
                    className="bg-sbs-purple hover:bg-sbs-purple-dark text-white"
                  >
                    Create New Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.filter(p => p.status !== 'closed').map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="closed">
              {projects.filter(p => p.status === 'closed').length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No closed projects yet
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.filter(p => p.status === 'closed').map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* New Project Dialog */}
      <Dialog open={showNewProjectForm} onOpenChange={setShowNewProjectForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Solar Project</DialogTitle>
            <DialogDescription>
              Provide details about your solar needs to receive competitive bids from verified vendors
            </DialogDescription>
          </DialogHeader>
          <ProjectForm onSubmit={handleProjectSubmit} />
        </DialogContent>
      </Dialog>
      
      {/* Project Bids Dialog */}
      <Dialog open={showBidsDialog} onOpenChange={setShowBidsDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>
              {selectedProject?.location}, {selectedProject?.state} • {selectedProject?.system_size} kW System
            </DialogDescription>
          </DialogHeader>
          
          {rankedBids.length > 0 ? (
            <>
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Bids ({rankedBids.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rankedBids.map((bid, index) => (
                    <BidCard 
                      key={bid.id} 
                      bid={bid} 
                      isHighestScore={index === 0}
                    />
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBidsDialog(false)}>
                  Close
                </Button>
                <Button className="bg-sbs-orange hover:bg-sbs-orange/90 text-white">
                  Accept Top Bid
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground mb-4">
                No bids received yet for this project
              </p>
              <Button variant="outline" onClick={() => setShowBidsDialog(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CustomerDashboard;
