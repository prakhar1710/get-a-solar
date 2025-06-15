
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bid, Project } from '@/types';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface BidItemProps {
  bid: Bid;
  project: Project;
}

const BidItem: React.FC<BidItemProps> = ({ bid, project }) => {
  const getBidStatus = () => {
    if (project.status === 'awarded') {
      // Check if this bid was accepted
      if ((project as any).accepted_bid_id === bid.id) {
        return {
          label: 'Accepted',
          variant: 'default' as const,
          icon: <CheckCircle className="h-4 w-4" />,
          className: 'bg-green-100 text-green-800 border-green-300'
        };
      } else {
        return {
          label: 'Not Selected',
          variant: 'secondary' as const,
          icon: <XCircle className="h-4 w-4" />,
          className: 'bg-red-100 text-red-800 border-red-300'
        };
      }
    } else if (project.status === 'open') {
      return {
        label: 'Under Review',
        variant: 'outline' as const,
        icon: <Clock className="h-4 w-4" />,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
    } else {
      return {
        label: 'Closed',
        variant: 'secondary' as const,
        icon: <XCircle className="h-4 w-4" />,
        className: 'bg-gray-100 text-gray-800 border-gray-300'
      };
    }
  };

  const status = getBidStatus();

  return (
    <Card className="overflow-hidden border-border/40">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
            <CardDescription>
              {project.location}, {project.state}
            </CardDescription>
          </div>
          <Badge className={`flex items-center gap-1 ${status.className}`}>
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Your Bid</p>
            <p className="font-medium">₹{bid.price_per_watt}/W</p>
          </div>
          <div>
            <p className="text-muted-foreground">Equipment</p>
            <p className="font-medium capitalize">{bid.equipment_tier.replace('tier', 'Tier ')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Timeline</p>
            <p className="font-medium">{bid.timeline_days} days</p>
          </div>
          <div>
            <p className="text-muted-foreground">AMC</p>
            <p className="font-medium">{bid.amc_included ? 'Included' : 'Not included'}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <div className="text-xs">
          Bid submitted on {new Date(bid.created_at).toLocaleDateString()}
        </div>
        <Badge variant={project.status === 'open' ? 'outline' : 'secondary'}>
          Project {project.status}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default BidItem;
