
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import VerificationStatusCard from '@/components/vendor-dashboard/VerificationStatusCard';
import AvailableProjects from '@/components/vendor-dashboard/AvailableProjects';
import MyBids from '@/components/vendor-dashboard/MyBids';
import BidSubmissionDialog from '@/components/vendor-dashboard/BidSubmissionDialog';
import { useVendorDashboard } from '@/hooks/vendor/useVendorDashboard';

const VendorDashboard: React.FC = () => {
  const {
    selectedProject,
    showBidForm,
    setShowBidForm,
    submittedBids,
    availableProjects,
    isLoading,
    handleBidSubmit,
    handleProjectSelect,
    refreshProjects,
    handleViewAvailableProjects
  } = useVendorDashboard();

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
        <VerificationStatusCard />

        {/* Main dashboard content */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList>
            <TabsTrigger value="available">Available Projects</TabsTrigger>
            <TabsTrigger value="mybids">My Bids</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <AvailableProjects 
              projects={availableProjects}
              submittedBids={submittedBids}
              onProjectSelect={handleProjectSelect}
              isLoading={isLoading}
              onRefresh={refreshProjects}
            />
          </TabsContent>
          
          <TabsContent value="mybids">
            <MyBids 
              bids={submittedBids}
              projects={availableProjects}
              onViewAvailableProjects={handleViewAvailableProjects}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bid Submission Dialog */}
      <BidSubmissionDialog 
        showBidForm={showBidForm}
        setShowBidForm={setShowBidForm}
        selectedProject={selectedProject}
        onBidSubmit={handleBidSubmit}
      />
    </MainLayout>
  );
};

export default VendorDashboard;
