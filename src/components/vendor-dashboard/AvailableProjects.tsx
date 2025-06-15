
import React from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project, Bid } from '@/types';
import ProjectCardItem from './ProjectCardItem';

interface AvailableProjectsProps {
  projects: Project[];
  submittedBids: Bid[];
  onProjectSelect: (project: Project) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const AvailableProjects: React.FC<AvailableProjectsProps> = ({
  projects,
  submittedBids,
  onProjectSelect,
  isLoading,
  onRefresh
}) => {
  const hasSubmittedBid = (projectId: string) => {
    return submittedBids.some(bid => bid.project_id === projectId);
  };

  if (isLoading) {
    return (
      <div className="dashboard-section">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sbs-orange mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading available projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Available Projects</h2>
          <p className="text-muted-foreground text-sm">
            {projects.length} project{projects.length !== 1 ? 's' : ''} available for bidding
          </p>
        </div>
        <Button 
          onClick={onRefresh}
          variant="outline" 
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
          <h3 className="text-lg font-medium mb-2">No projects available</h3>
          <p className="text-muted-foreground mb-4">
            There are currently no open projects for bidding.
          </p>
          <Button 
            onClick={onRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Check for new projects
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <ProjectCardItem
              key={project.id}
              project={project}
              onSelectProject={() => onProjectSelect(project)}
              hasBidOnProject={hasSubmittedBid(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableProjects;
