import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/types';
import StarRating from './StarRating';
import { formatDistanceToNow } from 'date-fns';

interface VendorReviewsPanelProps {
  vendorId: string;
}

const VendorReviewsPanel: React.FC<VendorReviewsPanelProps> = ({ vendorId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('vendor_id', vendorId)
        .order('created_at', { ascending: false });
      if (!cancelled) {
        if (error) console.error('Failed to load reviews:', error);
        setReviews((data as Review[]) || []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.average_rating), 0) /
        reviews.length
      : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg">Customer Reviews</CardTitle>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <StarRating value={Math.round(avg)} readOnly size="sm" />
              <span className="text-sm font-medium">{avg.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({reviews.length} review{reviews.length === 1 ? '' : 's'})
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Loading reviews…
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No review from the customer
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border rounded-lg p-4 space-y-2 bg-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating
                      value={Math.round(Number(r.average_rating))}
                      readOnly
                      size="sm"
                    />
                    <span className="text-sm font-semibold">
                      {Number(r.average_rating).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(r.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-sm">
                  {r.comment && r.comment.trim().length > 0
                    ? r.comment
                    : (
                      <span className="text-muted-foreground italic">
                        No review from the customer
                      </span>
                    )}
                </p>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground pt-1">
                  <span>Installation: {r.installation_quality}/5</span>
                  <span>Timeline: {r.timeline_promptness}/5</span>
                  <span>Paperwork: {r.subsidy_paperwork}/5</span>
                  <span>Communication: {r.communication_professionalism}/5</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VendorReviewsPanel;
