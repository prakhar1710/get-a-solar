
import React, { useState, useMemo } from 'react';
import { FileText, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to check if vendor has already bid on a project
  const hasBidOnProject = (projectId: string) => {
    return submittedBids.some(bid => bid.project_id === projectId);
  };

  // Filter projects based on search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter(project => 
      project.location.toLowerCase().includes(query) ||
      project.state.toLowerCase().includes(query) ||
      project.title.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

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

      {/* Search Section */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by location, state, or project title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-2">
            Found {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} matching "{searchQuery}"
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Loading projects...</div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? 'No projects found' : 'No projects available'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? `No projects match "${searchQuery}". Try a different search term.`
              : 'Check back later for new solar installation projects'
            }
          </p>
          {searchQuery ? (
            <Button onClick={() => setSearchQuery('')} variant="outline">
              Clear Search
            </Button>
          ) : (
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Projects
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
