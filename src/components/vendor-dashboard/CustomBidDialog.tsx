
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface CustomBidDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Project | null;
  onSubmit: (data: any) => Promise<boolean>;
}

const CustomBidDialog: React.FC<CustomBidDialogProps> = ({
  open,
  onOpenChange,
  selectedProject,
  onSubmit
}) => {
  const { toast } = useToast();
  const [pricePerWatt, setPricePerWatt] = useState<number>(45);
  const [equipmentTier, setEquipmentTier] = useState<string>('tier2');
  const [timelineDays, setTimelineDays] = useState<number>(30);
  const [amcIncluded, setAmcIncluded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pricePerWatt < 10 || pricePerWatt > 200) {
      toast({
        title: "Invalid price",
        description: "Price must be between ₹10 and ₹200 per Watt",
        variant: "destructive",
      });
      return;
    }
    
    if (timelineDays < 7 || timelineDays > 180) {
      toast({
        title: "Invalid timeline",
        description: "Timeline must be between 7 and 180 days",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    const bidData = {
      price_per_watt: pricePerWatt,
      equipment_tier: equipmentTier,
      timeline_days: timelineDays,
      amc_included: amcIncluded,
    };

    const success = await onSubmit(bidData);
    
    if (success) {
      // Reset form
      setPricePerWatt(45);
      setEquipmentTier('tier2');
      setTimelineDays(30);
      setAmcIncluded(false);
      onOpenChange(false);
    }
    
    setIsSubmitting(false);
  };

  const totalProjectCost = pricePerWatt * (selectedProject?.system_size || 5) * 1000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Submit Custom Bid</DialogTitle>
          <DialogDescription>
            {selectedProject?.title} - {selectedProject?.system_size} kW System
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pricePerWatt">Price per Watt (₹)</Label>
            <Input
              id="pricePerWatt"
              type="number"
              step="0.1"
              min="10"
              max="200"
              value={pricePerWatt}
              onChange={(e) => setPricePerWatt(Number(e.target.value))}
              required
            />
            {pricePerWatt && selectedProject && (
              <p className="text-sm text-muted-foreground">
                Total project cost: ₹{totalProjectCost.toLocaleString('en-IN')}
                {totalProjectCost >= 100000 && ` (₹${(totalProjectCost / 100000).toFixed(2)}L)`}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipmentTier">Equipment Tier</Label>
            <Select value={equipmentTier} onValueChange={setEquipmentTier}>
              <SelectTrigger>
                <SelectValue placeholder="Select equipment tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tier1">Tier 1 (Premium Brands)</SelectItem>
                <SelectItem value="tier2">Tier 2 (Standard Brands)</SelectItem>
                <SelectItem value="tier3">Tier 3 (Budget Brands)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timelineDays">Timeline (days)</Label>
            <Input
              id="timelineDays"
              type="number"
              min="7"
              max="180"
              value={timelineDays}
              onChange={(e) => setTimelineDays(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">Include AMC</Label>
              <p className="text-sm text-muted-foreground">
                Annual Maintenance Contract for 5 years
              </p>
            </div>
            <Switch
              checked={amcIncluded}
              onCheckedChange={setAmcIncluded}
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-sbs-orange hover:bg-sbs-orange/90 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Custom Bid'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBidDialog;
