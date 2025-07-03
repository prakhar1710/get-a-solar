
import React from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project, Bid } from '@/types';
import ProjectCardItem from './ProjectCardItem';

interface AvailableProjectsProps {
  projects: Project[];
  submittedBids: Bid[];
  onProjectSelect: (project: Project) => void;
  onCustomBidSelect?: (project: Project) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const AvailableProjects: React.FC<AvailableProjectsProps> = ({ 
  projects, 
  submittedBids, 
  onProjectSelect, 
  onCustomBidSelect,
  isLoading, 
  onRefresh 
}) => {
  // Helper function to check if vendor has already bid on a project
  const hasBidOnProject = (projectId: string) => {
    return submittedBids.some(bid => bid.project_id === projectId);
  };

  return (
    <div className="dashboard-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Available Projects</h2>
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading projects...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
          <h3 className="text-lg font-medium mb-2">No projects available</h3>
          <p className="text-muted-foreground mb-4">
            Check back later for new solar installation projects
          </p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Projects
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCardItem
              key={project.id}
              project={project}
              onQuickBid={() => onProjectSelect(project)}
              onCustomBid={onCustomBidSelect ? () => onCustomBidSelect(project) : undefined}
              hasSubmittedBid={hasBidOnProject(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableProjects;
