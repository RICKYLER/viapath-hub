import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  workerId: string;
  jobId: string;
  onSubmit: (data: { rating: number; comment: string }) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ workerId, jobId, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-foreground">Rate your experience</h3>
        <p className="text-sm text-muted-foreground">How was the service provided by the worker?</p>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform active:scale-95"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              size={32}
              className={cn(
                "transition-colors duration-200",
                (hover || rating) >= star 
                  ? "fill-primary text-primary" 
                  : "fill-transparent text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Write a comment (optional)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your feedback to help others..."
          className="min-h-[100px] resize-none"
        />
      </div>

      <Button type="submit" disabled={rating === 0} className="w-full">
        Submit Review
      </Button>
    </form>
  );
};
