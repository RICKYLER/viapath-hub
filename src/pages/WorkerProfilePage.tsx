import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, MapPin, MessageSquare, ShieldCheck, Star, UploadCloud, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RatingStars } from "@/components/RatingStars";
import { ReviewList } from "@/components/ReviewList";
import { useAppContext } from "@/context/AppContext";
import { toast } from "sonner";

export function WorkerProfilePage({ workerId }: { workerId: string }) {
  const { getWorkerById, user, updateWorkerProfile } = useAppContext();
  const worker = getWorkerById(workerId);

  const [idFile, setIdFile] = useState<string | null>(null);
  const [policeFile, setPoliceFile] = useState<string | null>(null);
  const [barangayFile, setBarangayFile] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!worker) {
    return (
      <div className="page-shell section-gap">
        <div className="surface-panel p-6 text-sm text-muted-foreground">Worker not found.</div>
      </div>
    );
  }

  const handleVettingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idFile && !policeFile && !barangayFile) {
      toast.error("Please upload at least one vetting document.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      updateWorkerProfile({
        isIdVerified: idFile ? true : worker.isIdVerified,
        hasPoliceClearance: policeFile ? true : worker.hasPoliceClearance,
        hasBarangayClearance: barangayFile ? true : worker.hasBarangayClearance,
        verified: true,
      });
      toast.success("Vetting documents submitted and approved successfully!");
      setSubmitting(false);
      setIdFile(null);
      setPoliceFile(null);
      setBarangayFile(null);
    }, 1500);
  };

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
              {worker.suspended ? (
                <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed border-transparent" size="lg">
                  Worker Suspended
                </Button>
              ) : worker.acceptingBookings !== false ? (
                <Button asChild className="w-full" size="lg">
                  <Link to="/client/booking/$workerId" params={{ workerId: worker.id }}>
                    Book this worker
                  </Link>
                </Button>
              ) : (
                <Button disabled className="w-full bg-muted text-muted-foreground cursor-not-allowed border-transparent" size="lg">
                  Offline / On Break
                </Button>
              )}
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
        {worker.suspended && (
          <div className="surface-panel p-4 bg-destructive/8 border-destructive/25 rounded-[1.5rem] flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive shrink-0" />
            <p className="text-sm text-destructive font-semibold">
              This worker has been suspended by the platform administrator and is not currently available for bookings.
            </p>
          </div>
        )}
        {!worker.suspended && worker.acceptingBookings === false && (
          <div className="surface-panel p-4 bg-destructive/5 border-destructive/20 rounded-[1.5rem] flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-destructive animate-ping" />
            <p className="text-sm text-destructive font-semibold">
              This professional is currently taking a break and not accepting bookings.
            </p>
          </div>
        )}

        {/* Own Profile Clearance Vetting Upload Center */}
        {user?.id === worker.id && (
          <article className="surface-panel p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Identity & Clearance Vetting</h2>
              <p className="text-xs text-muted-foreground mt-1">Submit files to verify credentials and earn trust badges.</p>
            </div>
            
            <form onSubmit={handleVettingSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {/* ID upload block */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground/80">Gov ID Document</Label>
                  {worker.isIdVerified ? (
                    <div className="flex items-center gap-1.5 p-4 rounded-xl bg-success/5 border border-success/20 text-success text-xs font-bold justify-center h-20">
                      <CheckCircle2 size={16} /> Verified
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-3 h-20 cursor-pointer transition-colors ${idFile ? "border-primary bg-primary/5 text-primary" : "border-border/60 bg-surface/50 hover:bg-surface text-muted-foreground"}`}>
                      <UploadCloud size={18} />
                      <span className="text-[10px] mt-1 font-bold">{idFile ? "Selected" : "Upload ID"}</span>
                      <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setIdFile(e.target.files?.[0]?.name ?? "id_verified.pdf")} />
                    </label>
                  )}
                </div>

                {/* Police Clearance upload block */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground/80">Police Clearance</Label>
                  {worker.hasPoliceClearance ? (
                    <div className="flex items-center gap-1.5 p-4 rounded-xl bg-success/5 border border-success/20 text-success text-xs font-bold justify-center h-20">
                      <CheckCircle2 size={16} /> Cleared
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-3 h-20 cursor-pointer transition-colors ${policeFile ? "border-primary bg-primary/5 text-primary" : "border-border/60 bg-surface/50 hover:bg-surface text-muted-foreground"}`}>
                      <UploadCloud size={18} />
                      <span className="text-[10px] mt-1 font-bold">{policeFile ? "Selected" : "Upload Certificate"}</span>
                      <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setPoliceFile(e.target.files?.[0]?.name ?? "police_clearance.pdf")} />
                    </label>
                  )}
                </div>

                {/* Barangay Clearance upload block */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-foreground/80">Barangay Clearance</Label>
                  {worker.hasBarangayClearance ? (
                    <div className="flex items-center gap-1.5 p-4 rounded-xl bg-success/5 border border-success/20 text-success text-xs font-bold justify-center h-20">
                      <CheckCircle2 size={16} /> Cleared
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-3 h-20 cursor-pointer transition-colors ${barangayFile ? "border-primary bg-primary/5 text-primary" : "border-border/60 bg-surface/50 hover:bg-surface text-muted-foreground"}`}>
                      <UploadCloud size={18} />
                      <span className="text-[10px] mt-1 font-bold">{barangayFile ? "Selected" : "Upload Clearance"}</span>
                      <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => setBarangayFile(e.target.files?.[0]?.name ?? "barangay_clearance.pdf")} />
                    </label>
                  )}
                </div>
              </div>

              {(!worker.isIdVerified || !worker.hasPoliceClearance || !worker.hasBarangayClearance) && (
                <Button type="submit" disabled={submitting} className="w-full cursor-pointer h-10 rounded-full font-bold text-xs" size="sm">
                  {submitting ? "Submitting..." : "Submit Vetting Documents"}
                </Button>
              )}
            </form>
          </article>
        )}

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
