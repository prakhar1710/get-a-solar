
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProjectForm from '@/components/forms/ProjectForm';

interface NewProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const NewProjectDialog: React.FC<NewProjectDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Solar Project</DialogTitle>
          <DialogDescription>
            Provide details about your solar needs to receive competitive bids from verified vendors
          </DialogDescription>
        </DialogHeader>
        <ProjectForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectDialog;
