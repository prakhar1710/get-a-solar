
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <TabsList className="w-full sm:w-auto h-auto flex-wrap">
          <TabsTrigger value="active" className="flex-1 sm:flex-none">Active Projects</TabsTrigger>
          <TabsTrigger value="closed" className="flex-1 sm:flex-none">Completed & Closed</TabsTrigger>
          <TabsTrigger value="all" className="flex-1 sm:flex-none">All Projects</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2 self-end sm:self-auto">
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
