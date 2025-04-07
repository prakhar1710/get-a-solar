
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Bid, Project } from '@/types';
import BidItem from './BidItem';

interface MyBidsProps {
  bids: Bid[];
  projects: Project[];
  onViewAvailableProjects: () => void;
}

const MyBids: React.FC<MyBidsProps> = ({ bids, projects, onViewAvailableProjects }) => {
  // Helper function to find project by ID
  const findProject = (projectId: string) => {
    return projects.find(p => p.id === projectId);
  };

  return (
    <div className="dashboard-section">
      {bids.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
          <h3 className="text-lg font-medium mb-2">No bids submitted yet</h3>
          <p className="text-muted-foreground mb-4">
            Browse available projects and submit your first bid
          </p>
          <Button 
            onClick={onViewAvailableProjects}
            className="bg-sbs-orange hover:bg-sbs-orange/90 text-white"
          >
            View Available Projects
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {bids.map((bid) => {
            const project = findProject(bid.project_id);
            
            if (!project) return null;
            
            return (
              <BidItem
                key={bid.id}
                bid={bid}
                project={project}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBids;
