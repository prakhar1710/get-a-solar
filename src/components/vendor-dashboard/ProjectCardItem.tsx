
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Zap, IndianRupee, Calendar, CheckCircle, Settings } from 'lucide-react';
import { Project } from '@/types';

interface ProjectCardItemProps {
  project: Project;
  onQuickBid: () => void;
  onCustomBid?: () => void;
  hasSubmittedBid: boolean;
}

const ProjectCardItem: React.FC<ProjectCardItemProps> = ({ 
  project, 
  onQuickBid, 
  onCustomBid,
  hasSubmittedBid 
}) => {
  return (
    <Card className="overflow-hidden border-border/40 hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold mb-1">{project.title}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {project.location}, {project.state}
            </CardDescription>
          </div>
          <Badge variant={project.status === 'open' ? 'default' : 'secondary'}>
            {project.status === 'open' ? 'Open' : 'Closed'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-sbs-orange" />
              <span className="font-medium">{project.system_size} kW</span>
            </div>
            <div className="flex items-center">
              <IndianRupee className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium">₹{(project.budget / 100000).toFixed(1)}L</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Posted {new Date(project.created_at).toLocaleDateString()}
          </div>

          {project.subsidy_applied && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Subsidy Applied
            </Badge>
          )}

          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        {hasSubmittedBid ? (
          <div className="w-full flex items-center justify-center py-2 text-green-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Bid Submitted</span>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <Button 
              onClick={onQuickBid}
              className="w-full bg-sbs-orange hover:bg-sbs-orange/90 text-white"
              size="sm"
            >
              Quick Bid
            </Button>
            {onCustomBid && (
              <Button 
                onClick={onCustomBid}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Custom Bid
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCardItem;
