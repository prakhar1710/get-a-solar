
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeIndianRupee, Calendar, Map, Star, CheckCircle2, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Project, STATE_SUBSIDIES } from '@/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
  onMarkCompleted?: (project: Project) => void;
  onRateVendor?: (project: Project) => void;
  hasReview?: boolean;
  canRate?: boolean;
}

const statusStyles: Record<string, string> = {
  open: 'bg-sbs-purple-light text-sbs-purple-dark',
  awarded: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  onMarkCompleted,
  onRateVendor,
  hasReview,
  canRate,
}) => {
  const formattedDate = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });
  const subsidyPercentage = project.subsidy_applied ? STATE_SUBSIDIES[project.state] || 0 : 0;
  const statusClass = statusStyles[project.status] || 'bg-sbs-purple-light text-sbs-purple-dark';

  return (
    <Card className="overflow-hidden border-border/40 shadow-sm hover:shadow transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Map className="h-3 w-3 mr-1" /> {project.location}, {project.state}
            </CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Zap className="h-4 w-4 text-sbs-orange mr-2" />
            <span>{project.system_size} kW</span>
          </div>
          <div className="flex items-center">
            <BadgeIndianRupee className="h-4 w-4 text-sbs-orange mr-2" />
            <span>₹{(project.budget / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {project.subsidy_applied && subsidyPercentage > 0 && (
          <div className="mt-2 text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md inline-flex items-center">
            {project.state} Subsidy: {subsidyPercentage}% applicable
          </div>
        )}

        {hasReview && (
          <Badge className="mt-2 bg-green-100 text-green-800 border-green-300 flex items-center gap-1 w-fit">
            <CheckCircle2 className="h-3 w-3" /> Reviewed
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between items-center gap-2 pt-2">
        <div className="text-xs text-muted-foreground flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Posted {formattedDate}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails(project)}
          >
            View Details
          </Button>
          {project.status === 'awarded' && onMarkCompleted && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onMarkCompleted(project)}
            >
              Mark as Completed
            </Button>
          )}
          {canRate && !hasReview && onRateVendor && (
            <Button
              size="sm"
              className="bg-sbs-orange hover:bg-sbs-orange/90 text-white flex items-center gap-1"
              onClick={() => onRateVendor(project)}
            >
              <Star className="h-3 w-3" /> Rate Vendor
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
