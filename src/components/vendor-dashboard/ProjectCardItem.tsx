
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface ProjectCardItemProps {
  project: Project;
  hasBidOnProject: boolean;
  onSelectProject: (project: Project) => void;
}

const ProjectCardItem: React.FC<ProjectCardItemProps> = ({
  project,
  hasBidOnProject,
  onSelectProject,
}) => {
  return (
    <Card key={project.id} className="overflow-hidden border-border/40 shadow-sm hover:shadow transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{project.title}</CardTitle>
            <CardDescription>
              {project.location}, {project.state}
            </CardDescription>
          </div>
          {hasBidOnProject && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              Bid Submitted
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">System Size</p>
              <p className="font-medium">{project.system_size} kW</p>
            </div>
            <div>
              <p className="text-muted-foreground">Budget</p>
              <p className="font-medium">₹{(project.budget / 100000).toFixed(1)}L</p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Description</p>
            <p className="text-sm line-clamp-2">{project.description}</p>
          </div>
          {project.subsidy_applied && (
            <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-md inline-block">
              State subsidy applicable
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          className="w-full bg-sbs-orange hover:bg-sbs-orange/90 text-white"
          onClick={() => onSelectProject(project)}
          disabled={hasBidOnProject}
        >
          {hasBidOnProject ? 'Bid Submitted' : 'Submit Bid'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCardItem;
