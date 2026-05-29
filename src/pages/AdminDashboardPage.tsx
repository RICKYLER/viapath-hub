import {
  AlertTriangle,
  Award,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  ShieldCheck,
  UserCheck,
  UsersRound,
  WalletCards,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import type { WorkerProfile } from "@/context/types";
import { DashboardShell } from "@/layouts/DashboardShell";

function WorkerQualificationCard({
  onVerify,
  worker,
}: {
  onVerify: (workerId: string) => void;
  worker: WorkerProfile;
}) {
  const requirements = [
    { label: "ID verified", passed: worker.isIdVerified },
    { label: "Police clearance", passed: worker.hasPoliceClearance },
    { label: "Barangay clearance", passed: worker.hasBarangayClearance },
  ];
  const isQualified = worker.verified && requirements.every((requirement) => requirement.passed);

  return (
    <article className="surface-panel p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">{worker.name}</h3>
            <span className="tag-soft">{isQualified ? "Qualified" : "For verification"}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-primary">{worker.service}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} />
              {worker.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <UserCheck size={14} />
              {worker.completedJobs} completed jobs
            </span>
          </div>
        </div>

        <Button variant={isQualified ? "soft" : "default"} size="sm" onClick={() => onVerify(worker.id)} disabled={isQualified}>
          <ShieldCheck size={16} />
          {isQualified ? "Verified" : "Verify worker"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {requirements.map((requirement) => {
          const Icon = requirement.passed ? CheckCircle2 : XCircle;

          return (
            <div key={requirement.label} className="rounded-lg border border-border/70 bg-background/60 p-3">
              <Icon className={requirement.passed ? "text-success" : "text-warning"} size={16} />
              <p className="mt-2 text-sm font-semibold text-foreground">{requirement.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{requirement.passed ? "Submitted and valid" : "Needs admin review"}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2">
            <Award className="text-primary" size={16} />
            <p className="text-sm font-bold text-foreground">Qualifications</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {worker.certifications.length ? (
              worker.certifications.map((certification) => (
                <span key={certification} className="tag-soft">
                  {certification}
                </span>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">No certifications listed yet</span>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="text-primary" size={16} />
            <p className="text-sm font-bold text-foreground">Skills on profile</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span key={skill} className="tag-soft">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function AdminDashboardPage() {
  const { bookings, transactions, user, verifyWorker, workers } = useAppContext();

  const pendingBookings = bookings.filter((booking) => booking.status === "pending");
  const acceptedBookings = bookings.filter((booking) => booking.status === "accepted");
  const verifiedWorkers = workers.filter((worker) => worker.verified);
  const needsReview = workers.filter(
    (worker) => !worker.isIdVerified || !worker.hasPoliceClearance || !worker.hasBarangayClearance,
  );
  const completedPayments = transactions
    .filter((transaction) => transaction.status === "completed")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <DashboardShell
      eyebrow="Admin dashboard"
      title={`Hello, ${user?.name ?? "Admin"}`}
      description="Monitor demo marketplace activity, worker verification readiness, booking flow, and payment movement from one admin view."
      aside={
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Demo admin email</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{user?.email ?? "admin@viapathhub.demo"}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-success">
            <ShieldCheck size={16} />
            Admin access enabled
          </div>
        </div>
      }
    >
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="stat-tile">
          <UsersRound className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Workers listed</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{workers.length}</p>
        </article>
        <article className="stat-tile">
          <CalendarCheck2 className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Total bookings</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{bookings.length}</p>
        </article>
        <article className="stat-tile">
          <Clock3 className="text-warning" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Pending bookings</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{pendingBookings.length}</p>
        </article>
        <article className="stat-tile">
          <WalletCards className="text-success" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Completed payments</p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {completedPayments.toLocaleString("en-PH", { style: "currency", currency: "PHP" })}
          </p>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="surface-panel overflow-hidden">
          <div className="border-b border-border/60 px-5 py-4">
            <h2 className="text-lg font-bold text-foreground">Recent bookings</h2>
          </div>
          <div className="divide-y divide-border/60">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-foreground">{booking.service}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {booking.clientName} with {booking.workerName}
                  </p>
                </div>
                <span className="tag-soft w-fit capitalize">{booking.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="surface-panel p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-success" size={18} />
              <h2 className="text-lg font-bold text-foreground">Verification</h2>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Verified workers</span>
                <span className="font-bold text-foreground">{verifiedWorkers.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Needs document review</span>
                <span className="font-bold text-foreground">{needsReview.length}</span>
              </div>
            </div>
          </div>

          <div className="surface-panel p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-warning" size={18} />
              <h2 className="text-lg font-bold text-foreground">Queue</h2>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Awaiting worker action</span>
                <span className="font-bold text-foreground">{pendingBookings.length}</span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Accepted appointments</span>
                <span className="font-bold text-foreground">{acceptedBookings.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <span className="eyebrow">Worker verification</span>
          <h2 className="mt-3 text-2xl font-bold text-foreground">Qualification review</h2>
          <p className="mt-2 body-copy max-w-2xl">
            Open this area to check if Rick or any worker has the required documents and listed skills before marking them qualified.
          </p>
        </div>
        <div className="grid gap-4">
          {workers.map((worker) => (
            <WorkerQualificationCard key={worker.id} worker={worker} onVerify={verifyWorker} />
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
