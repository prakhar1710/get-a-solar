
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProjectForm from '@/components/forms/ProjectForm';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project, Bid, Profile } from '@/types';
import BidCard from '@/components/dashboard/BidCard';
import { rankBids } from '@/utils/bidRanking';
import { Plus, RefreshCw, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CustomerDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [projectBids, setProjectBids] = useState<Bid[]>([]);
  const [rankedBids, setRankedBids] = useState<Bid[]>([]);
  const [showBidsDialog, setShowBidsDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileChecked, setProfileChecked] = useState(false);

  // Check profile status on mount
  useEffect(() => {
    if (user && !profile && !profileChecked) {
      refreshProfile().then(() => {
        setProfileChecked(true);
      });
    } else if (profile) {
      setProfileChecked(true);
    }
  }, [user, profile, refreshProfile, profileChecked]);

  // Fetch customer projects
  useEffect(() => {
    if (!user) return;
    
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('customer_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        setProjects(data as Project[] || []);
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Error fetching projects",
          description: error.message || "Failed to load your projects.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
  }, [user, toast]);

  const handleProjectSubmit = async (data: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a project.",
        variant: "destructive",
      });
      return;
    }
    
    // Ensure profile exists
    if (!profile) {
      try {
        await refreshProfile();
        // Only proceed if profile is now available after refresh
        if (!profile) {
          toast({
            title: "Profile Required",
            description: "Please complete your profile before creating a project.",
            variant: "destructive",
          });
          return;
        }
      } catch (error: any) {
        console.error("Failed to create/fetch profile:", error);
        toast({
          title: "Profile error",
          description: "There was an issue with your user profile. Please try logging out and back in.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      console.log("Creating project with customer_id:", user.id);
      
      const newProject = {
        customer_id: user.id,
        title: data.title,
        location: data.location,
        system_size: data.system_size,
        budget: data.budget,
        description: data.description,
        state: data.state,
        subsidy_applied: data.subsidy_applied,
        status: 'open' as const
      };
      
      const { error, data: createdProject } = await supabase
        .from('projects')
        .insert([newProject])
        .select();
        
      if (error) {
        console.error("Project creation error:", error);
        throw error;
      }
      
      console.log("Project created successfully:", createdProject);
      
      if (createdProject && createdProject.length > 0) {
        setProjects(prevProjects => [createdProject[0] as Project, ...prevProjects]);
        setShowNewProjectForm(false);
        
        toast({
          title: "Project created successfully",
          description: "Your solar project is now visible to vendors for bidding.",
        });
      }
    } catch (error: any) {
      console.error("Full error details:", error);
      toast({
        title: "Error creating project",
        description: error.message || "Failed to create your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = async (project: Project) => {
    setSelectedProject(project);
    
    try {
      // Fetch bids for the selected project
      const { data: bidsData, error: bidsError } = await supabase
        .from('bids')
        .select(`
          *,
          profiles:vendor_id (
            full_name
          )
        `)
        .eq('project_id', project.id);
        
      if (bidsError) throw bidsError;
      
      const bidsWithVendorInfo = bidsData?.map(bid => ({
        ...bid,
        vendor_name: bid.profiles?.full_name || 'Anonymous Vendor',
        vendor_rating: 4.5, // Mock rating for now
        equipment_tier: bid.equipment_tier as 'tier1' | 'tier2' | 'tier3'
      })) || [];
      
      setProjectBids(bidsWithVendorInfo as Bid[]);
      
      // Rank the bids using our algorithm
      const ranked = rankBids(bidsWithVendorInfo as Bid[], project);
      setRankedBids(ranked);
      
      setShowBidsDialog(true);
    } catch (error: any) {
      toast({
        title: "Error fetching bids",
        description: error.message || "Failed to fetch bids for this project.",
        variant: "destructive",
      });
    }
  };

  const refreshProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProjects(data as Project[] || []);
      
      toast({
        title: "Projects refreshed",
        description: "Your projects list has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error refreshing projects",
        description: error.message || "Failed to refresh your projects.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={refreshProjects}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
              </div>
            </div>
            
            <TabsContent value="active">
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading projects...</p>
                </div>
              ) : projects.filter(p => p.status !== 'closed').length === 0 ? (
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
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading projects...</p>
                </div>
              ) : projects.filter(p => p.status === 'closed').length === 0 ? (
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
              {isLoading ? (
                <div className="text-center py-12">
                  <p>Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No projects yet</h3>
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
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
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
