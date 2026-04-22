import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, MapPin, ShieldCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/RatingStars";
import { useAppContext } from "@/context/AppContext";

export function WorkerProfilePage({ workerId }: { workerId: string }) {
  const { getWorkerById } = useAppContext();
  const worker = getWorkerById(workerId);

  if (!worker) {
    return (
      <div className="page-shell section-gap">
        <div className="surface-panel p-6 text-sm text-muted-foreground">Worker not found.</div>
      </div>
    );
  }

  return (
    <div className="page-shell section-gap grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="surface-elevated space-y-5 p-6">
        <img src={worker.image} alt={worker.name} className="h-28 w-28 rounded-[2rem] border border-border/70 object-cover" />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{worker.name}</h1>
          <p className="text-base font-semibold text-primary">{worker.service}</p>
          <RatingStars rating={worker.rating} />
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{worker.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={16} />
            <span>{worker.completedJobs} completed jobs</span>
          </div>
          {worker.verified ? (
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-success" />
              <span>Verified worker profile</span>
            </div>
          ) : null}
        </div>
        <Button asChild className="w-full" size="lg">
          <Link to="/client/booking/$workerId" params={{ workerId: worker.id }}>
            Book this worker
          </Link>
        </Button>
      </aside>

      <section className="space-y-5">
        <article className="surface-panel p-6">
          <h2 className="text-xl font-bold text-foreground">About</h2>
          <p className="mt-3 body-copy">{worker.about}</p>
        </article>

        <article className="surface-panel p-6">
          <h2 className="text-xl font-bold text-foreground">Skills and specialties</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span key={skill} className="tag-soft">
                {skill}
              </span>
            ))}
          </div>
        </article>

        <article className="surface-panel p-6">
          <div className="flex items-center gap-2">
            <Star className="text-accent" size={18} />
            <h2 className="text-xl font-bold text-foreground">Why clients book this worker</h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="stat-tile">
              <p className="text-sm text-muted-foreground">Rating</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{worker.rating.toFixed(1)}★</p>
            </div>
            <div className="stat-tile">
              <p className="text-sm text-muted-foreground">Response time</p>
              <p className="mt-2 text-2xl font-bold text-foreground">Fast</p>
            </div>
            <div className="stat-tile">
              <p className="text-sm text-muted-foreground">Coverage</p>
              <p className="mt-2 text-2xl font-bold text-foreground">Tagum</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
