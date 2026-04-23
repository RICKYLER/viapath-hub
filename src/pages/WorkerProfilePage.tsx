import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, MapPin, MessageSquare, ShieldCheck, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/RatingStars";
import { ReviewList } from "@/components/ReviewList";
import { useAppContext } from "@/context/AppContext";

export function WorkerProfilePage({ workerId }: { workerId: string }) {
  const { getWorkerById, user } = useAppContext();
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
          {worker.isIdVerified && (
            <div className="flex items-center gap-2 text-primary font-medium">
              <ShieldCheck size={16} />
              <span>Identity Verified</span>
            </div>
          )}
          {worker.hasPoliceClearance && (
            <div className="flex items-center gap-2 text-success">
              <ShieldCheck size={16} />
              <span>Police Clearance</span>
            </div>
          )}
          {worker.hasBarangayClearance && (
            <div className="flex items-center gap-2 text-success">
              <ShieldCheck size={16} />
              <span>Barangay Clearance</span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {user?.id !== worker.id && (
            <>
              <Button asChild className="w-full" size="lg">
                <Link to="/client/booking/$workerId" params={{ workerId: worker.id }}>
                  Book this worker
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/client/chat/$workerId" params={{ workerId: worker.id }}>
                  <MessageSquare size={18} className="mr-2" />
                  Chat with worker
                </Link>
              </Button>
            </>
          )}
          {user?.id === worker.id && (
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to="/worker/profile">
                Edit my profile
              </Link>
            </Button>
          )}
        </div>
      </aside>

      <section className="space-y-5">
        <article className="surface-panel p-6">
          <h2 className="text-xl font-bold text-foreground">About</h2>
          <p className="mt-3 body-copy">{worker.about}</p>
        </article>

        {worker.certifications.length > 0 && (
          <article className="surface-panel p-6 border-l-4 border-primary/50">
            <h2 className="text-xl font-bold text-foreground">Certifications</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {worker.certifications.map((cert) => (
                <span key={cert} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  <Star size={12} fill="currentColor" />
                  {cert}
                </span>
              ))}
            </div>
          </article>
        )}

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
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="mt-2 text-lg font-bold text-foreground">{worker.barangay}</p>
            </div>
          </div>
        </article>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Reviews and Feedback</h2>
          <ReviewList 
            reviews={[
              {
                id: 'r1',
                reviewerName: 'Patricia Gomez',
                rating: 5,
                comment: 'Excellent service! Very professional and punctual. Highly recommended for anyone in Tagum.',
                date: '2 days ago'
              },
              {
                id: 'r2',
                reviewerName: 'Lyra Santos',
                rating: 4,
                comment: 'Very good experience. The quality of work was great, just a minor delay in arrival but communicated well.',
                date: '1 week ago'
              }
            ]} 
          />
        </section>
      </section>
    </div>
  );
}
