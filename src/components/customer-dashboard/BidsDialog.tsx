
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BidCard from '@/components/dashboard/BidCard';
import { Bid, Project } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BidsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  bids: Bid[];
  onBidAccepted?: () => void;
}

const BidsDialog: React.FC<BidsDialogProps> = ({
  isOpen,
  onClose,
  project,
  bids,
  onBidAccepted
}) => {
  const { toast } = useToast();
  
  const handleAcceptTopBid = async () => {
    if (!project || bids.length === 0) return;
    
    const topBid = bids[0]; // First bid is the highest scored one
    
    try {
      // Update project status to 'awarded' and store the accepted bid ID
      const { error: projectError } = await supabase
        .from('projects')
        .update({ 
          status: 'awarded',
          accepted_bid_id: topBid.id
        })
        .eq('id', project.id);
        
      if (projectError) throw projectError;
      
      toast({
        title: "Bid accepted successfully",
        description: `You have accepted the bid from ${topBid.vendor_name || 'the vendor'}.`,
      });
      
      // Close dialog and refresh data
      onClose();
      if (onBidAccepted) {
        onBidAccepted();
      }
    } catch (error: any) {
      console.error('Error accepting bid:', error);
      toast({
        title: "Error accepting bid",
        description: error.message || "Failed to accept the bid. Please try again.",
        variant: "destructive",
      });
    }
  };

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
              {project.status === 'open' && (
                <Button 
                  className="bg-sbs-orange hover:bg-sbs-orange/90 text-white"
                  onClick={handleAcceptTopBid}
                >
                  Accept Top Bid
                </Button>
              )}
              {project.status === 'awarded' && (
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white" 
                  disabled
                >
                  Bid Accepted
                </Button>
              )}
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
