
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BidCard from '@/components/dashboard/BidCard';
import { Bid, Project } from '@/types';

interface BidsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  bids: Bid[];
}

const BidsDialog: React.FC<BidsDialogProps> = ({
  isOpen,
  onClose,
  project,
  bids
}) => {
  if (!project) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project?.title}</DialogTitle>
          <DialogDescription>
            {project?.location}, {project?.state} • {project?.system_size} kW System
          </DialogDescription>
        </DialogHeader>
        
        {bids.length > 0 ? (
          <>
            <div className="space-y-6">
              <h3 className="text-lg font-medium border-b pb-2">Bids ({bids.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bids.map((bid, index) => (
                  <BidCard 
                    key={bid.id} 
                    bid={bid} 
                    isHighestScore={index === 0}
                  />
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button className="bg-sbs-orange hover:bg-sbs-orange/90 text-white">
                Accept Top Bid
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No bids received yet for this project
            </p>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BidsDialog;
