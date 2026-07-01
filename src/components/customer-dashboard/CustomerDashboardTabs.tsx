
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, FolderOpen } from 'lucide-react';
import ProjectTabs from './ProjectTabs';
import SolarCalculator from './SolarCalculator';
import { Project } from '@/types';
import type { AcceptedBidInfo } from '@/hooks/useCustomerProjects';

interface CustomerDashboardTabsProps {
  projects: Project[];
  isLoading: boolean;
  onViewDetails: (project: Project) => void;
  refreshProjects: () => void;
  onNewProject: () => void;
  reviewedProjectIds?: Set<string>;
  acceptedBidsByProject?: Record<string, AcceptedBidInfo>;
  onMarkCompleted?: (project: Project) => void;
  onRateVendor?: (project: Project) => void;
}

const CustomerDashboardTabs: React.FC<CustomerDashboardTabsProps> = (props) => {
  return (
    <Tabs defaultValue="projects" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="projects" className="flex items-center gap-2">
          <FolderOpen className="h-4 w-4" />
          My Projects
        </TabsTrigger>
        <TabsTrigger value="calculator" className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Solar Calculator
        </TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="mt-6">
        <ProjectTabs {...props} />
      </TabsContent>

      <TabsContent value="calculator" className="mt-6">
        <SolarCalculator onCalculationComplete={(r) => console.log('calc:', r)} />
      </TabsContent>
    </Tabs>
  );
};

export default CustomerDashboardTabs;
