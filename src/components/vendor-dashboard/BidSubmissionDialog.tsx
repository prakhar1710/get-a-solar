
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Project } from '@/types';
import BidForm from '@/components/forms/BidForm';

interface BidSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Project | null;
  onSubmit: (data: any) => Promise<boolean>;
}

const BidSubmissionDialog: React.FC<BidSubmissionDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  onSubmit
}) => {
  const handleSubmit = async (data: any) => {
    const success = await onSubmit(data);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Submit Bid</DialogTitle>
          <DialogDescription>
            {selectedProject?.title} - {selectedProject?.system_size} kW System
          </DialogDescription>
        </DialogHeader>
        <BidForm 
          onSubmit={handleSubmit} 
          projectSize={selectedProject?.system_size}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BidSubmissionDialog;
