
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeIndianRupee, Calendar, Map, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Project, STATE_SUBSIDIES } from '@/types';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  const formattedDate = formatDistanceToNow(new Date(project.created_at), { addSuffix: true });
  
  const subsidyPercentage = project.subsidy_applied ? STATE_SUBSIDIES[project.state] || 0 : 0;
  
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
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-sbs-purple-light text-sbs-purple-dark">
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
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          Posted {formattedDate}
        </div>
        <Button 
          size="sm" 
          className="bg-sbs-purple hover:bg-sbs-purple-dark text-white"
          onClick={() => onViewDetails(project)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
