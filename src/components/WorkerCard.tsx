import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RatingStars } from "@/components/RatingStars";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground leading-tight">{worker.name}</h3>
                  {worker.suspended && (
                    <span className="inline-flex h-4 px-1.5 items-center justify-center rounded bg-muted text-muted-foreground text-[8px] font-extrabold uppercase">
                      Suspended
                    </span>
                  )}
                  {!worker.suspended && worker.acceptingBookings === false && (
                    <span className="inline-flex h-4 px-1.5 items-center justify-center rounded bg-destructive/10 text-destructive text-[8px] font-extrabold uppercase">
                      Offline
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <p className="text-sm font-medium text-primary leading-none">{worker.service}</p>
                  
                  {/* Trust Badges */}
                  <TooltipProvider>
                    <div className="flex items-center gap-1.5">
                      {worker.isIdVerified && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex h-4 px-1.5 items-center justify-center rounded bg-success/12 border border-success/20 text-success text-[8px] font-extrabold uppercase cursor-help select-none">
                              ID
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-foreground text-background border border-border max-w-[220px]">
                            <p className="font-bold text-xs">ID Verified</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Government identification checked and validated by admin.</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {worker.hasPoliceClearance && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex h-4 px-1.5 items-center justify-center rounded bg-info/12 border border-info/25 text-info text-[8px] font-extrabold uppercase cursor-help select-none">
                              Police
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-foreground text-background border border-border max-w-[220px]">
                            <p className="font-bold text-xs">Police Cleared</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Official Police Clearance verified with zero criminal record history.</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {worker.hasBarangayClearance && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex h-4 px-1.5 items-center justify-center rounded bg-secondary text-secondary-foreground border border-border/10 text-[8px] font-extrabold uppercase cursor-help select-none">
                              Barangay
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-foreground text-background border border-border max-w-[220px]">
                            <p className="font-bold text-xs">Barangay Cleared</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">Verified active residency clearance within the local Barangay.</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
              
              {worker.verified ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="cursor-help text-success hover:scale-105 transition-transform">
                        <CheckCircle2 size={18} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-foreground text-background border border-border">
                      <p className="font-bold text-xs">Verified Specialist</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">This worker has completed all trust checks.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : null}
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
            worker.suspended ? (
              <Button disabled className="flex-1 sm:flex-none bg-muted text-muted-foreground border-transparent cursor-not-allowed">
                Unavailable
              </Button>
            ) : worker.acceptingBookings !== false ? (
              <Button asChild className="flex-1 sm:flex-none">
                <Link to="/client/booking/$workerId" params={{ workerId: worker.id }}>
                  Book now
                </Link>
              </Button>
            ) : (
              <Button disabled className="flex-1 sm:flex-none bg-muted text-muted-foreground border-transparent cursor-not-allowed">
                Offline
              </Button>
            )
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
