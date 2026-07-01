
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { Project } from '@/types';
import ProjectsList from './ProjectsList';
import type { AcceptedBidInfo } from '@/hooks/useCustomerProjects';

interface ProjectTabsProps {
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

const ProjectTabs: React.FC<ProjectTabsProps> = ({
  projects,
  isLoading,
  onViewDetails,
  refreshProjects,
  onNewProject,
  reviewedProjectIds,
  acceptedBidsByProject,
  onMarkCompleted,
  onRateVendor,
}) => {
  const commonProps = {
    projects,
    isLoading,
    onViewDetails,
    onRefresh: onNewProject,
    reviewedProjectIds,
    acceptedBidsByProject,
    onMarkCompleted,
    onRateVendor,
  };

  return (
    <Tabs defaultValue="active" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="closed">Completed & Closed</TabsTrigger>
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
        <ProjectsList {...commonProps} filter="active" />
      </TabsContent>
      <TabsContent value="closed">
        <ProjectsList {...commonProps} filter="closed" />
      </TabsContent>
      <TabsContent value="all">
        <ProjectsList {...commonProps} filter="all" />
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
