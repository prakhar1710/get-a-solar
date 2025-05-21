
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import BidForm from '@/components/forms/BidForm';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';

interface BidSubmissionDialogProps {
  showBidForm: boolean;
  setShowBidForm: (show: boolean) => void;
  selectedProject: Project | null;
  onBidSubmit: (data: any) => Promise<void>;
  onViewMyBids?: () => void;
}

const BidSubmissionDialog = ({ 
  showBidForm, 
  setShowBidForm, 
  selectedProject, 
  onBidSubmit,
  onViewMyBids
}: BidSubmissionDialogProps) => {
  return (
    <Dialog open={showBidForm} onOpenChange={setShowBidForm}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit Bid</DialogTitle>
          <DialogDescription>
            {selectedProject?.title} - {selectedProject?.system_size} kW System
          </DialogDescription>
        </DialogHeader>
        <BidForm 
          onSubmit={onBidSubmit} 
          projectSize={selectedProject?.system_size}
        />
        {onViewMyBids && (
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={onViewMyBids}>
              View My Bids
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BidSubmissionDialog;
