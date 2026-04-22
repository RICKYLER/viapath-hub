import { ArrowRight, BriefcaseBusiness, Clock3, MapPinned, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { WorkerCard } from "@/components/WorkerCard";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";

const benefits = [
  {
    title: "Quick local matching",
    body: "Find available service pros around Tagum City without bouncing between chat groups and random listings.",
    icon: MapPinned,
  },
  {
    title: "Flexible work access",
    body: "Workers can accept part-time or on-demand jobs that fit their schedules and specialties.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Trust-first bookings",
    body: "Ratings, service history, and clear appointment details help both sides book with confidence.",
    icon: ShieldCheck,
  },
];

export function HomePage() {
  const { workers, topWorkers, bookings } = useAppContext();

  return (
    <div className="page-shell section-gap space-y-8 sm:space-y-10">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_0.9fr] lg:items-stretch">
        <div className="hero-card flex flex-col justify-between gap-8">
          <div className="space-y-5">
            <span className="eyebrow">Technopreneurship concept • marketplace MVP</span>
            <div className="space-y-4">
              <h1 className="title-display text-balance">Reliable local services, booked faster in Tagum City.</h1>
              <p className="body-copy max-w-2xl text-base sm:text-lg">
                ViaPathHub connects clients with dependable massage therapists, nail techs, plumbers, electricians,
                and cleaners while giving skilled workers a better way to land flexible jobs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="map-chip">Serving Tagum City, Davao del Norte</span>
              <span className="tag-soft">Mobile-first experience</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">
                Join ViaPathHub
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/login">Try demo access</Link>
            </Button>
          </div>
        </div>

        <div className="surface-elevated grid gap-4 p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="stat-tile">
              <p className="text-sm text-muted-foreground">Verified workers</p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">{workers.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Across personal care, repair, and cleaning services.</p>
            </article>
            <article className="stat-tile">
              <p className="text-sm text-muted-foreground">Active mock bookings</p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">{bookings.length}</p>
              <p className="mt-2 text-sm text-muted-foreground">Live examples for client and worker dashboards.</p>
            </article>
          </div>

          <div className="surface-panel space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Marketplace promise</p>
                <p className="text-sm text-muted-foreground">Convenience, dependable labor, and faster client-worker matching.</p>
              </div>
              <Clock3 className="text-primary" size={22} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-2xl font-bold text-foreground">12m</p>
                <p className="text-sm text-muted-foreground">Typical reply pace</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">4.8★</p>
                <p className="text-sm text-muted-foreground">Average worker rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">Core service categories</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {benefits.map(({ title, body, icon: Icon }) => (
          <article key={title} className="surface-panel p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
              <Icon size={20} />
            </div>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Featured workers</span>
            <h2 className="title-section mt-3">Top-rated professionals in the area</h2>
          </div>
          <Button asChild variant="soft">
            <Link to="/client/search">Browse all workers</Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {topWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} canBook />
          ))}
        </div>
      </section>
    </div>
  );
}
