import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import BidsDialog from '@/components/customer-dashboard/BidsDialog';
import NewProjectDialog from '@/components/customer-dashboard/NewProjectDialog';
import CustomerDashboardTabs from '@/components/customer-dashboard/CustomerDashboardTabs';
import ReviewDialog from '@/components/reviews/ReviewDialog';
import { useCustomerProjects } from '@/hooks/useCustomerProjects';
import { Project } from '@/types';

const CustomerDashboard: React.FC = () => {
  const { toast } = useToast();
  const { user, profile, refreshProfile } = useAuth();
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [reviewProject, setReviewProject] = useState<Project | null>(null);
  const profileRefreshed = useRef(false);

  const {
    projects,
    isLoading,
    selectedProject,
    projectBids,
    showBidsDialog,
    setShowBidsDialog,
    handleViewDetails,
    reviewedProjectIds,
    acceptedBidsByProject,
    markProjectCompleted,
    refreshProjects,
  } = useCustomerProjects();

  useEffect(() => {
    if (user && !profile && !profileRefreshed.current) {
      profileRefreshed.current = true;
      refreshProfile();
    }
  }, [user, profile, refreshProfile]);

  const handleProjectSubmit = async (data: any) => {
    if (!user) {
      toast({ title: 'Authentication required', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    if (!profile) {
      if (!profileRefreshed.current) {
        profileRefreshed.current = true;
        await refreshProfile();
      }
      if (!profile) {
        toast({ title: 'Profile Required', description: 'Please complete your profile first.', variant: 'destructive' });
        return;
      }
    }

    try {
      const { error, data: createdProject } = await supabase
        .from('projects')
        .insert([{
          customer_id: user.id,
          title: data.title,
          location: data.location,
          system_size: data.system_size,
          budget: data.budget,
          description: data.description,
          state: data.state,
          subsidy_applied: data.subsidy_applied,
          status: 'open' as const,
        }])
        .select();

      if (error) throw error;
      if (createdProject && createdProject.length > 0) {
        setShowNewProjectForm(false);
        refreshProjects();
        toast({ title: 'Project created', description: 'Your solar project is now visible to vendors.' });
      }
    } catch (error: any) {
      toast({ title: 'Error creating project', description: error.message, variant: 'destructive' });
    }
  };

  const reviewVendorInfo = reviewProject ? acceptedBidsByProject[reviewProject.id] : null;

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Customer Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Calculate your solar needs and manage your project requirements
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
          <CustomerDashboardTabs
            projects={projects}
            isLoading={isLoading}
            onViewDetails={handleViewDetails}
            refreshProjects={refreshProjects}
            onNewProject={() => setShowNewProjectForm(true)}
            reviewedProjectIds={reviewedProjectIds}
            acceptedBidsByProject={acceptedBidsByProject}
            onMarkCompleted={markProjectCompleted}
            onRateVendor={setReviewProject}
          />
        </div>
      </div>

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

      {reviewProject && reviewVendorInfo && (
        <ReviewDialog
          open={!!reviewProject}
          onOpenChange={(open) => !open && setReviewProject(null)}
          project={reviewProject}
          vendorId={reviewVendorInfo.vendor_id}
          vendorName={reviewVendorInfo.vendor_name || undefined}
          onSubmitted={refreshProjects}
        />
      )}
    </MainLayout>
  );
};

export default CustomerDashboard;
