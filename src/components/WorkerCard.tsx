import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/RatingStars";
import type { WorkerProfile } from "@/context/types";

interface WorkerCardProps {
  worker: WorkerProfile;
  canBook?: boolean;
}

export function WorkerCard({ worker, canBook = false }: WorkerCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-border/70 bg-card/95 shadow-[var(--shadow-soft)] transition-transform duration-300 hover:-translate-y-1">
      <CardContent className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start gap-4">
          <img
            src={worker.image}
            alt={worker.name}
            className="h-16 w-16 rounded-2xl border border-border/70 bg-surface object-cover"
            loading="lazy"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">{worker.name}</h3>
                <p className="text-sm font-medium text-primary">{worker.service}</p>
              </div>
              {worker.verified ? <CheckCircle2 className="text-success" size={18} /> : null}
            </div>
            <RatingStars rating={worker.rating} />
          </div>
        </div>

        <p className="body-copy line-clamp-3">{worker.about}</p>

        <div className="flex flex-wrap gap-2">
          {worker.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="tag-soft">
              {skill}
            </span>
          ))}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{worker.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            <span>{worker.responseTime}</span>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap gap-3 pt-1">
          <Button asChild variant="outline" className="flex-1 sm:flex-none">
            <Link to="/client/workers/$workerId" params={{ workerId: worker.id }}>
              View profile
            </Link>
          </Button>
          {canBook ? (
            <Button asChild className="flex-1 sm:flex-none">
              <Link to="/client/booking/$workerId" params={{ workerId: worker.id }}>
                Book now
              </Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
