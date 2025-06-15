
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, FolderOpen } from 'lucide-react';
import ProjectTabs from './ProjectTabs';
import SolarCalculator from './SolarCalculator';
import { Project, Bid } from '@/types';

interface CustomerDashboardTabsProps {
  projects: Project[];
  isLoading: boolean;
  onViewDetails: (project: Project, bids: Bid[]) => void;
  refreshProjects: () => void;
  onNewProject: () => void;
}

const CustomerDashboardTabs: React.FC<CustomerDashboardTabsProps> = ({
  projects,
  isLoading,
  onViewDetails,
  refreshProjects,
  onNewProject
}) => {
  const handleCalculationComplete = (result: any) => {
    // You can use this to pre-fill project creation form if needed
    console.log('Solar calculation completed:', result);
  };

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
        <ProjectTabs
          projects={projects}
          isLoading={isLoading}
          onViewDetails={onViewDetails}
          refreshProjects={refreshProjects}
          onNewProject={onNewProject}
        />
      </TabsContent>
      
      <TabsContent value="calculator" className="mt-6">
        <SolarCalculator onCalculationComplete={handleCalculationComplete} />
      </TabsContent>
    </Tabs>
  );
};

export default CustomerDashboardTabs;
