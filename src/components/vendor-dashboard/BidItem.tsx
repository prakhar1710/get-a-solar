
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bid, Project } from '@/types';

interface BidItemProps {
  bid: Bid;
  project: Project;
}

const BidItem: React.FC<BidItemProps> = ({ bid, project }) => {
  return (
    <Card className="overflow-hidden border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
        <CardDescription>
          {project.location}, {project.state}
        </CardDescription>
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
