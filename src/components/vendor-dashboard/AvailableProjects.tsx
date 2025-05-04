
import React, { useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Project, Bid } from '@/types';
import ProjectCardItem from './ProjectCardItem';

interface AvailableProjectsProps {
  projects: Project[];
  submittedBids: Bid[];
  onProjectSelect: (project: Project) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const AvailableProjects: React.FC<AvailableProjectsProps> = ({
  projects,
  submittedBids,
  onProjectSelect,
  isLoading = false,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter projects based on search term
  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if vendor has already bid on a project
  const hasBidOnProject = (projectId: string) => {
    return submittedBids.some(bid => bid.project_id === projectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects by title, location..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          title="Refresh projects"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="dashboard-section">
        {isLoading ? (
          <div className="text-center py-12">
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No projects match your search criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCardItem
                key={project.id}
                project={project}
                hasBidOnProject={hasBidOnProject(project.id)}
                onSelectProject={onProjectSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableProjects;
