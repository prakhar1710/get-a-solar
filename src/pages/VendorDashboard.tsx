
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Project, Bid } from '@/types';
import BidForm from '@/components/forms/BidForm';
import { Upload } from 'lucide-react';
import VerificationStatusCard from '@/components/vendor-dashboard/VerificationStatusCard';
import AvailableProjects from '@/components/vendor-dashboard/AvailableProjects';
import MyBids from '@/components/vendor-dashboard/MyBids';

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

// Additional mock project for the submitted bid
const mockProjectForBid: Project = {
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
};

const VendorDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [submittedBids, setSubmittedBids] = useState<Bid[]>(mockSubmittedBids);
  const [availableProjects, setAvailableProjects] = useState<Project[]>(mockAvailableProjects);
  
  // All projects including the one for the submitted bid
  const allProjects = [...availableProjects, mockProjectForBid];

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

  const handleViewAvailableProjects = () => {
    document.querySelector('[data-value="available"]')?.dispatchEvent(new MouseEvent('click'));
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
            />
          </TabsContent>
          
          <TabsContent value="mybids">
            <MyBids 
              bids={submittedBids}
              projects={allProjects}
              onViewAvailableProjects={handleViewAvailableProjects}
            />
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
