
import React from 'react';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { RefreshCw, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface ProjectsListProps {
  projects: Project[];
  isLoading: boolean;
  onViewDetails: (project: Project) => void;
  onRefresh: () => void;
  filter: 'active' | 'closed' | 'all';
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects, 
  isLoading, 
  onViewDetails, 
  onRefresh,
  filter
}) => {
  // Filter projects based on the active tab
  const filteredProjects = projects.filter(project => {
    if (filter === 'active') return project.status !== 'closed';
    if (filter === 'closed') return project.status === 'closed';
    return true; // 'all' filter
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Loading projects...</p>
      </div>
    );
  }

  // Empty state
  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        {filter === 'all' ? (
          <>
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
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
        ) : filter === 'active' ? (
          <>
            <h3 className="text-xl font-medium mb-2">No active projects</h3>
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
          <p className="text-muted-foreground">
            No closed projects yet
          </p>
        )}
      </div>
    );
  }

  // Project list
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default ProjectsList;
