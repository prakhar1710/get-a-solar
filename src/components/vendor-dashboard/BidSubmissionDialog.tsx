
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BidForm from '@/components/forms/BidForm';
import { Project } from '@/types';

interface BidSubmissionDialogProps {
  showBidForm: boolean;
  setShowBidForm: (show: boolean) => void;
  selectedProject: Project | null;
  onBidSubmit: (data: any) => Promise<void>;
}

const BidSubmissionDialog = ({ 
  showBidForm, 
  setShowBidForm, 
  selectedProject, 
  onBidSubmit 
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
      </DialogContent>
    </Dialog>
  );
};

export default BidSubmissionDialog;
