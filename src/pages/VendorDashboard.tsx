
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project } from '@/types';
import VerificationStatusCard from '@/components/vendor-dashboard/VerificationStatusCard';
import AvailableProjects from '@/components/vendor-dashboard/AvailableProjects';
import MyBids from '@/components/vendor-dashboard/MyBids';
import VendorDashboardHeader from '@/components/vendor-dashboard/VendorDashboardHeader';
import BidSubmissionDialog from '@/components/vendor-dashboard/BidSubmissionDialog';
import CustomBidDialog from '@/components/vendor-dashboard/CustomBidDialog';
import CertificationUploadDialog from '@/components/vendor-dashboard/CertificationUploadDialog';
import VendorReviewsPanel from '@/components/reviews/VendorReviewsPanel';
import { useVendorDashboard } from '@/hooks/useVendorDashboard';
import { useAuth } from '@/contexts/AuthContext';

const VendorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [showCustomBidForm, setShowCustomBidForm] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const {
    submittedBids,
    availableProjects,
    bidProjects,
    isLoading,
    handleBidSubmit,
    refreshProjects
  } = useVendorDashboard();

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowBidForm(true);
  };

  const handleCustomBidSelect = (project: Project) => {
    setSelectedProject(project);
    setShowCustomBidForm(true);
  };

  const handleViewAvailableProjects = () => {  
    document.querySelector('[data-value="available"]')?.dispatchEvent(new MouseEvent('click'));
  };

  const handleBidSubmitWrapper = async (data: any) => {
    if (!selectedProject) return false;
    return await handleBidSubmit(data, selectedProject);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <VendorDashboardHeader onUploadClick={() => setShowUploadDialog(true)} />

        {/* Verification Status Card */}
        <VerificationStatusCard onUploadClick={() => setShowUploadDialog(true)} />

        {/* Main dashboard content */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList>
            <TabsTrigger value="available">Available Leads</TabsTrigger>
            <TabsTrigger value="mybids">My Active Bids</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <AvailableProjects 
              projects={availableProjects}
              submittedBids={submittedBids}
              onProjectSelect={handleProjectSelect}
              onCustomBidSelect={handleCustomBidSelect}
              isLoading={isLoading}
              onRefresh={refreshProjects}
            />
          </TabsContent>
          
          <TabsContent value="mybids">
            <MyBids 
              bids={submittedBids}
              projects={bidProjects}
              onViewAvailableProjects={handleViewAvailableProjects}
            />
          </TabsContent>
        </Tabs>

        {user && (
          <div className="mt-8">
            <VendorReviewsPanel vendorId={user.id} />
          </div>
        )}
      </div>

      
      {/* Certification Upload Dialog */}
      <CertificationUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
      
      {/* Bid Submission Dialog */}
      <BidSubmissionDialog
        open={showBidForm}
        onOpenChange={setShowBidForm}
        selectedProject={selectedProject}
        onSubmit={handleBidSubmitWrapper}
      />

      {/* Custom Bid Dialog */}
      <CustomBidDialog
        open={showCustomBidForm}
        onOpenChange={setShowCustomBidForm}
        selectedProject={selectedProject}
        onSubmit={handleBidSubmitWrapper}
      />
    </MainLayout>
  );
};

export default VendorDashboard;
