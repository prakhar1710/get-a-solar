import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Bid, Project } from '@/types';
import BidItem from './BidItem';

interface AcceptedBidsProps {
  bids: Bid[];
  projects: Project[];
}

const AcceptedBids: React.FC<AcceptedBidsProps> = ({ bids, projects }) => {
  const getProjectForBid = (bid: Bid) => {
    if (bid.project) return bid.project;
    return projects.find((p) => p.id === bid.project_id);
  };

  const acceptedBids = bids.filter((bid) => {
    const project = getProjectForBid(bid);
    return project?.status === 'awarded' && project?.accepted_bid_id === bid.id;
  });

  return (
    <div className="dashboard-section">
      {acceptedBids.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-20 mb-2" />
          <h3 className="text-lg font-medium mb-2">No accepted bids yet</h3>
          <p className="text-muted-foreground">
            When a customer accepts one of your bids, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {acceptedBids.map((bid) => {
            const project = getProjectForBid(bid);
            if (!project) return null;
            return <BidItem key={bid.id} bid={bid} project={project} />;
          })}
        </div>
      )}
    </div>
  );
};

export default AcceptedBids;
