import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import StarRating from './StarRating';
import { Project } from '@/types';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  vendorId: string;
  vendorName?: string;
  onSubmitted?: () => void;
}

const parameters = [
  {
    key: 'installation_quality' as const,
    label: 'Installation Quality',
    hint: 'Workmanship, structural integrity, clean wiring',
  },
  {
    key: 'timeline_promptness' as const,
    label: 'Timeline & Promptness',
    hint: 'Adherence to the promised completion date',
  },
  {
    key: 'subsidy_paperwork' as const,
    label: 'Subsidy & Paperwork Support',
    hint: 'Handling net-metering and DISCOM approvals',
  },
  {
    key: 'communication_professionalism' as const,
    label: 'Communication & Professionalism',
    hint: 'Transparency and team behavior',
  },
];

type Ratings = Record<(typeof parameters)[number]['key'], number>;

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  open,
  onOpenChange,
  project,
  vendorId,
  vendorName,
  onSubmitted,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Ratings>({
    installation_quality: 0,
    timeline_promptness: 0,
    subsidy_paperwork: 0,
    communication_professionalism: 0,
  });
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setRating = (key: keyof Ratings, value: number) =>
    setRatings((prev) => ({ ...prev, [key]: value }));

  const allRated = parameters.every((p) => ratings[p.key] > 0);

  const handleSubmit = async () => {
    if (!user) return;
    if (!allRated) {
      toast({
        title: 'Please rate every parameter',
        description: 'Give a star rating for each of the four categories.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        project_id: project.id,
        customer_id: user.id,
        vendor_id: vendorId,
        installation_quality: ratings.installation_quality,
        timeline_promptness: ratings.timeline_promptness,
        subsidy_paperwork: ratings.subsidy_paperwork,
        communication_professionalism: ratings.communication_professionalism,
        // average_rating is set by DB trigger; send placeholder to satisfy NOT NULL
        average_rating: 0,
        comment: comment.trim() || null,
      });
      if (error) throw error;
      toast({
        title: 'Review submitted',
        description: `Thank you for rating ${vendorName || 'the vendor'}.`,
      });
      onOpenChange(false);
      onSubmitted?.();
    } catch (error: any) {
      console.error('Review submit error:', error);
      toast({
        title: 'Error submitting review',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rate your vendor</DialogTitle>
          <DialogDescription>
            {project.title}
            {vendorName ? ` — ${vendorName}` : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {parameters.map((p) => (
            <div key={p.key} className="space-y-1">
              <Label className="text-sm font-medium">{p.label}</Label>
              <p className="text-xs text-muted-foreground">{p.hint}</p>
              <StarRating
                value={ratings[p.key]}
                onChange={(v) => setRating(p.key, v)}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="review-comment">Written feedback</Label>
            <Textarea
              id="review-comment"
              placeholder="Write a detailed review..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-sbs-purple hover:bg-sbs-purple-dark text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…
              </>
            ) : (
              'Submit Review'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
