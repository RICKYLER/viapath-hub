import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewListProps {
  reviews: Review[];
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 surface-panel">
        <p className="text-muted-foreground">No reviews yet for this worker.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <article key={review.id} className="surface-panel p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground">{review.reviewerName}</h4>
            <span className="text-xs text-muted-foreground">{review.date}</span>
          </div>
          
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={cn(
                  review.rating >= star 
                    ? "fill-primary text-primary" 
                    : "fill-transparent text-muted-foreground"
                )}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {review.comment}
          </p>
        </article>
      ))}
    </div>
  );
};
