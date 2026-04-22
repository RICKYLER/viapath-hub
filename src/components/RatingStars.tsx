import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < Math.round(rating);
        return (
          <Star
            key={index}
            className={active ? "fill-accent text-accent" : "text-border"}
            size={16}
          />
        );
      })}
      <span className="ml-2 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}
