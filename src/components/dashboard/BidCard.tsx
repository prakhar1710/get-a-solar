
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Check, X, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Bid } from '@/types';
import { Button } from '@/components/ui/button';

interface BidCardProps {
  bid: Bid;
  isHighestScore?: boolean;
  onAcceptBid?: (bid: Bid) => void;
  projectStatus?: 'open' | 'closed' | 'awarded';
  acceptedBidId?: string | null;
  projectSize?: number;
}

const BidCard: React.FC<BidCardProps> = ({ 
  bid, 
  isHighestScore = false, 
  onAcceptBid, 
  projectStatus, 
  acceptedBidId,
  projectSize = 5
}) => {
  const getEquipmentTierLabel = (tier: string) => {
    switch(tier) {
      case 'tier1': return 'Tier 1 (Premium)';
      case 'tier2': return 'Tier 2 (Standard)';
      case 'tier3': return 'Tier 3 (Budget)';
      default: return tier;
    }
  };
  
  const tierColorMap = {
    'tier1': 'bg-green-100 text-green-800 border-green-300',
    'tier2': 'bg-blue-100 text-blue-800 border-blue-300',
    'tier3': 'bg-amber-100 text-amber-800 border-amber-300',
  };

  const isAcceptedBid = projectStatus === 'awarded' && acceptedBidId === bid.id;
  
  // Calculate total project cost
  const totalProjectCost = bid.price_per_watt * projectSize * 1000; // Converting kW to Watt

  return (
    <Card className={`overflow-hidden border ${isHighestScore && !isAcceptedBid ? 'border-sbs-purple' : 'border-border/40'} ${isAcceptedBid ? 'border-green-500 ring-2 ring-green-300' : ''} shadow-sm hover:shadow transition-shadow duration-300`}>
      {isHighestScore && !isAcceptedBid && (
        <div className="bg-sbs-purple text-white text-xs text-center py-1 font-medium">
          Highest Ranked Bid
        </div>
      )}
      {isAcceptedBid && (
        <div className="bg-green-600 text-white text-xs text-center py-1 font-medium">
          Accepted Bid
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">
            {bid.vendor_name || 'Vendor'}
          </CardTitle>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-1 text-sm font-medium">{bid.vendor_rating?.toFixed(1) || '4.0'}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Price per Watt</div>
            <div className="font-semibold flex items-center">
              <IndianRupee className="h-3 w-3 mr-1" />
              {bid.price_per_watt}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Total Project Cost</div>
            <div className="font-semibold flex items-center text-sbs-purple">
              <IndianRupee className="h-3 w-3 mr-1" />
              {totalProjectCost.toLocaleString('en-IN')}
              {totalProjectCost >= 100000 && (
                <span className="ml-1 text-xs">
                  (₹{(totalProjectCost / 100000).toFixed(2)}L)
                </span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Equipment</div>
            <div>
              <Badge variant="outline" className={`${tierColorMap[bid.equipment_tier as keyof typeof tierColorMap]}`}>
                {getEquipmentTierLabel(bid.equipment_tier)}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Timeline</div>
            <div className="flex items-center text-sm">
              <Clock className="h-3 w-3 mr-1" />
              {bid.timeline_days} days
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">AMC Included</div>
            <div>
              {bid.amc_included ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <X className="h-4 w-4 text-sbs-red" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        {bid.score !== undefined && (
          <div className="text-xs px-2 py-1 rounded-full bg-sbs-purple/10 text-sbs-purple">
            Score: {bid.score.toFixed(1)}
          </div>
        )}
        
        {projectStatus === 'open' && onAcceptBid && (
          <Button 
            size="sm" 
            className="bg-sbs-orange hover:bg-sbs-orange/90 text-white"
            onClick={() => onAcceptBid(bid)}
          >
            Accept Bid
          </Button>
        )}
        {isAcceptedBid && (
           <Badge className="flex items-center gap-1 bg-green-100 text-green-800 border-green-300">
             <CheckCircle className="h-4 w-4" />
             Accepted
           </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default BidCard;
