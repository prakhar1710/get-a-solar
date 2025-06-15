import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import ProjectTabs from '@/components/customer-dashboard/ProjectTabs';
import BidsDialog from '@/components/customer-dashboard/BidsDialog';
import NewProjectDialog from '@/components/customer-dashboard/NewProjectDialog';
import { useCustomerProjects } from '@/hooks/useCustomerProjects';

const CustomerDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const profileRefreshed = useRef(false);
  
  // Custom hook to manage project data and actions
  const {
    projects,
    isLoading,
    selectedProject,
    projectBids,
    showBidsDialog,
    setShowBidsDialog,
    handleViewDetails,
    refreshProjects
  } = useCustomerProjects(user?.id);

  // Check profile status only once when component mounts
  useEffect(() => {
    // Only attempt to refresh profile if:
    // 1. We have a user
    // 2. We don't have a profile yet
    // 3. We haven't already tried to refresh the profile
    if (user && !profile && !profileRefreshed.current) {
      console.log("CustomerDashboard: Refreshing profile");
      profileRefreshed.current = true;
      refreshProfile();
    }
  }, [user, profile, refreshProfile]);

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
        // Only attempt to refresh profile if we haven't tried before
        if (!profileRefreshed.current) {
          profileRefreshed.current = true;
          await refreshProfile();
        }
        
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
        setShowNewProjectForm(false);
        // Refresh projects instead of manually updating the state
        refreshProjects();
        
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
          <ProjectTabs
            projects={projects}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            refreshProjects={refreshProjects}
            onNewProject={() => setShowNewProjectForm(true)}
          />
        </div>
      </div>
      
      {/* Dialogs */}
      <NewProjectDialog
        isOpen={showNewProjectForm}
        onClose={() => setShowNewProjectForm(false)}
        onSubmit={handleProjectSubmit}
      />
      
      <BidsDialog
        isOpen={showBidsDialog}
        onClose={() => setShowBidsDialog(false)}
        project={selectedProject}
        bids={projectBids}
        onBidAccepted={refreshProjects}
      />
    </MainLayout>
  );
};

export default CustomerDashboard;
