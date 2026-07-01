
import React from 'react';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import type { AcceptedBidInfo } from '@/hooks/useCustomerProjects';

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  onViewDetails: (project: Project) => void;
  onRefresh: () => void;
  filter: 'active' | 'closed' | 'all';
  reviewedProjectIds?: Set<string>;
  acceptedBidsByProject?: Record<string, AcceptedBidInfo>;
  onMarkCompleted?: (project: Project) => void;
  onRateVendor?: (project: Project) => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  isLoading,
  onViewDetails,
  onRefresh,
  filter,
  reviewedProjectIds,
  acceptedBidsByProject,
  onMarkCompleted,
  onRateVendor,
}) => {
  const filteredProjects = projects.filter((project) => {
    if (filter === 'active') return project.status !== 'closed' && project.status !== 'completed';
    if (filter === 'closed') return project.status === 'closed' || project.status === 'completed';
    return true;
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading projects...</p>
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        {filter === 'all' || filter === 'active' ? (
          <>
            <h3 className="text-xl font-medium mb-2">
              {filter === 'all' ? 'No projects yet' : 'No active projects'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Create your first project to start receiving bids from verified solar vendors
            </p>
            <Button
              onClick={onRefresh}
              className="bg-sbs-purple hover:bg-sbs-purple-dark text-white"
            >
              Create New Project
            </Button>
          </>
        ) : (
          <p className="text-muted-foreground">No completed or closed projects yet</p>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredProjects.map((project) => {
        const hasReview = reviewedProjectIds?.has(project.id) ?? false;
        const hasAcceptedBid = !!acceptedBidsByProject?.[project.id];
        const canRate = project.status === 'completed' && hasAcceptedBid;
        return (
          <ProjectCard
            key={project.id}
            project={project}
            onViewDetails={onViewDetails}
            onMarkCompleted={onMarkCompleted}
            onRateVendor={onRateVendor}
            hasReview={hasReview}
            canRate={canRate}
          />
        );
      })}
    </div>
  );
};

export default ProjectsList;
