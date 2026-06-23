import { useState } from "react";
import {
  AlertTriangle,
  Award,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileCheck2,
  Flag,
  MapPin,
  Megaphone,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UsersRound,
  WalletCards,
  XCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import type { Dispute, DocumentReview, WorkerProfile } from "@/context/types";
import { DashboardShell } from "@/layouts/DashboardShell";
import { Switch } from "@/components/ui/switch";

// ─── Health Chart ──────────────────────────────────────────────────────────────

const healthData = [
  { week: "W1 May", created: 4, completed: 2, cancelled: 1 },
  { week: "W2 May", created: 7, completed: 5, cancelled: 1 },
  { week: "W3 May", created: 6, completed: 4, cancelled: 2 },
  { week: "W4 May", created: 9, completed: 7, cancelled: 0 },
  { week: "W1 Jun", created: 11, completed: 8, cancelled: 1 },
  { week: "W2 Jun", created: 8, completed: 6, cancelled: 2 },
  { week: "W3 Jun", created: 13, completed: 9, cancelled: 1 },
  { week: "W4 Jun", created: 10, completed: 8, cancelled: 0 },
];

function PlatformHealthChart() {
  return (
    <div className="surface-panel p-6 space-y-4">
      <div>
        <span className="eyebrow">Platform Metrics</span>
        <h2 className="mt-2 text-xl font-bold text-foreground">8-Week Booking Health</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Weekly bookings created vs. completed vs. cancelled — the primary signal for marketplace growth.
        </p>
      </div>
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={healthData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0.014 88 / 40%)" />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "oklch(0.54 0.03 222)", fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "oklch(0.54 0.03 222)", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: "oklch(0.995 0.004 90)",
                borderColor: "oklch(0.9 0.014 88)",
                borderRadius: "0.8rem",
                color: "oklch(0.28 0.03 228)",
                boxShadow: "var(--shadow-soft)",
                fontSize: 11,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Line type="monotone" dataKey="created" stroke="oklch(0.58 0.16 197)" strokeWidth={2} dot={{ r: 3 }} name="Created" />
            <Line type="monotone" dataKey="completed" stroke="oklch(0.65 0.18 145)" strokeWidth={2} dot={{ r: 3 }} name="Completed" />
            <Line type="monotone" dataKey="cancelled" stroke="oklch(0.62 0.2 25)" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 3" name="Cancelled" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Document Review Card ──────────────────────────────────────────────────────

const DOC_LABELS: Record<DocumentReview["type"], string> = {
  id: "Gov ID Document",
  police: "Police Clearance",
  barangay: "Barangay Clearance",
};

function DocRow({
  docType,
  review,
  onApprove,
  onReject,
}: {
  docType: DocumentReview["type"];
  review?: DocumentReview;
  onApprove: () => void;
  onReject: (note: string) => void;
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [note, setNote] = useState("");

  const status = review?.status ?? "pending";

  return (
    <div className="rounded-xl border border-border/70 bg-background/60 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {status === "approved" && <CheckCircle2 className="text-success shrink-0" size={14} />}
          {status === "rejected" && <XCircle className="text-destructive shrink-0" size={14} />}
          {status === "pending" && <Clock3 className="text-warning shrink-0" size={14} />}
          <p className="text-sm font-semibold text-foreground">{DOC_LABELS[docType]}</p>
        </div>
        <span
          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
            status === "approved"
              ? "bg-success/10 text-success"
              : status === "rejected"
              ? "bg-destructive/10 text-destructive"
              : "bg-warning/10 text-warning"
          }`}
        >
          {status}
        </span>
      </div>
      {review?.rejectionNote && (
        <p className="text-[10px] text-muted-foreground bg-destructive/5 rounded-lg px-2 py-1">
          Rejection note: {review.rejectionNote}
        </p>
      )}
      {status !== "approved" && (
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            className="h-7 text-[10px] rounded-full px-3 cursor-pointer"
            onClick={onApprove}
          >
            <CheckCircle2 size={11} className="mr-1" /> Approve
          </Button>
          {!rejectMode ? (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-[10px] rounded-full px-3 cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/5"
              onClick={() => setRejectMode(true)}
            >
              <XCircle size={11} className="mr-1" /> Reject
            </Button>
          ) : (
            <div className="flex gap-1.5 w-full">
              <Input
                placeholder="Reason for rejection…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-7 text-[10px] rounded-lg flex-1 bg-surface/50 border-border/60"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[10px] rounded-full px-2.5 cursor-pointer text-destructive border-destructive/30 hover:bg-destructive/5 shrink-0"
                onClick={() => {
                  onReject(note || "No reason provided");
                  setRejectMode(false);
                  setNote("");
                }}
              >
                Send
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-[10px] rounded-full px-2.5 cursor-pointer shrink-0"
                onClick={() => { setRejectMode(false); setNote(""); }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Worker Qualification Card ─────────────────────────────────────────────────

function WorkerQualificationCard({
  worker,
  onVerify,
  onApproveDoc,
  onRejectDoc,
  onSuspend,
  onUnsuspend,
}: {
  worker: WorkerProfile;
  onVerify: (id: string) => void;
  onApproveDoc: (id: string, t: DocumentReview["type"]) => void;
  onRejectDoc: (id: string, t: DocumentReview["type"], note: string) => void;
  onSuspend: (id: string) => void;
  onUnsuspend: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const reviews = worker.documentReviews ?? [];
  const getReview = (t: DocumentReview["type"]) => reviews.find((r) => r.type === t);
  const isQualified =
    worker.verified && worker.isIdVerified && worker.hasPoliceClearance && worker.hasBarangayClearance;

  return (
    <article className={`surface-panel p-5 transition-all duration-300 ${worker.suspended ? "opacity-70 border-destructive/20" : ""}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">{worker.name}</h3>
            {worker.suspended ? (
              <span className="tag-soft bg-destructive/10 text-destructive border-destructive/20 text-[9px] font-extrabold uppercase">
                Suspended
              </span>
            ) : (
              <span className="tag-soft text-[9px] font-extrabold uppercase">
                {isQualified ? "Qualified" : "For verification"}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-primary">{worker.service}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} /> {worker.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <UserCheck size={14} /> {worker.completedJobs} completed jobs
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {!worker.suspended && (
            <Button
              variant={isQualified ? "soft" : "default"}
              size="sm"
              onClick={() => onVerify(worker.id)}
              disabled={isQualified}
              className="cursor-pointer"
            >
              <ShieldCheck size={14} />
              {isQualified ? "Verified" : "Verify all"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => worker.suspended ? onUnsuspend(worker.id) : onSuspend(worker.id)}
            className={`cursor-pointer ${worker.suspended ? "text-success border-success/30 hover:bg-success/5" : "text-destructive border-destructive/30 hover:bg-destructive/5"}`}
          >
            <ShieldOff size={14} />
            {worker.suspended ? "Unsuspend" : "Suspend"}
          </Button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Hide docs" : "Review docs"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {(["id", "police", "barangay"] as DocumentReview["type"][]).map((docType) => (
            <DocRow
              key={docType}
              docType={docType}
              review={getReview(docType)}
              onApprove={() => onApproveDoc(worker.id, docType)}
              onReject={(note) => onRejectDoc(worker.id, docType, note)}
            />
          ))}
        </div>
      )}

      {!expanded && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2">
              <Award className="text-primary" size={16} />
              <p className="text-sm font-bold text-foreground">Qualifications</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {worker.certifications.length ? (
                worker.certifications.map((c) => (
                  <span key={c} className="tag-soft">{c}</span>
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
                <span key={skill} className="tag-soft">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

// ─── Dispute Card ──────────────────────────────────────────────────────────────

const RESOLUTION_LABELS = {
  refund: "Issue Refund",
  warn: "Warn Worker",
  dismiss: "Dismiss",
};

function DisputeCard({
  dispute,
  onResolve,
}: {
  dispute: Dispute;
  onResolve: (id: string, resolution: "refund" | "warn" | "dismiss") => void;
}) {
  const statusColor =
    dispute.status === "open"
      ? "bg-warning/10 text-warning"
      : dispute.status === "resolved"
      ? "bg-success/10 text-success"
      : "bg-muted text-muted-foreground";

  return (
    <article className="surface-panel p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Flag size={14} className="text-destructive shrink-0" />
            <h3 className="text-base font-bold text-foreground">{dispute.service}</h3>
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${statusColor}`}>
              {dispute.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {dispute.clientName} → {dispute.workerName} ·{" "}
            {new Date(dispute.createdAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
        {dispute.resolution && (
          <span className="text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {dispute.resolution === "refund" ? "Refunded" : dispute.resolution === "warn" ? "Worker Warned" : "Dismissed"}
          </span>
        )}
      </div>

      <div className="rounded-xl bg-surface/60 border border-border/60 p-3">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Client Complaint</p>
        <p className="text-sm text-foreground leading-relaxed">{dispute.complaint}</p>
      </div>

      {dispute.status === "open" && (
        <div className="flex flex-wrap gap-2">
          {(["refund", "warn", "dismiss"] as const).map((resolution) => (
            <Button
              key={resolution}
              size="sm"
              variant={resolution === "refund" ? "default" : "outline"}
              className={`h-8 text-xs rounded-full px-4 cursor-pointer ${
                resolution === "dismiss" ? "text-muted-foreground" : resolution === "warn" ? "text-warning border-warning/30 hover:bg-warning/5" : ""
              }`}
              onClick={() => onResolve(dispute.id, resolution)}
            >
              {RESOLUTION_LABELS[resolution]}
            </Button>
          ))}
        </div>
      )}
    </article>
  );
}

// ─── Announcement Form ─────────────────────────────────────────────────────────

function AnnouncementForm({ onPost }: { onPost: (title: string, message: string, target: "all" | "clients" | "workers", expiresAt?: string) => void }) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "clients" | "workers">("all");
  const [expiresAt, setExpiresAt] = useState("");
  const [posted, setPosted] = useState(false);

  const handlePost = () => {
    if (!title.trim() || !message.trim()) return;
    onPost(title.trim(), message.trim(), target, expiresAt || undefined);
    setTitle("");
    setMessage("");
    setTarget("all");
    setExpiresAt("");
    setPosted(true);
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <div className="surface-panel p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Megaphone className="text-primary" size={18} />
        <h2 className="text-lg font-bold text-foreground">Post Announcement</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ann-title" className="text-xs font-semibold text-foreground/80">Title</Label>
          <Input
            id="ann-title"
            placeholder="e.g. Platform Maintenance on July 4"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-surface/50 border-border/60 rounded-xl text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ann-message" className="text-xs font-semibold text-foreground/80">Message</Label>
          <textarea
            id="ann-message"
            placeholder="Write your announcement message here…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full bg-surface/50 border border-border/60 rounded-xl text-sm px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-foreground/80">Audience</Label>
            <div className="grid grid-cols-3 p-1 bg-surface border border-border/60 rounded-full gap-1">
              {(["all", "clients", "workers"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTarget(t)}
                  className={`py-1.5 text-[11px] font-semibold rounded-full capitalize transition-all duration-200 cursor-pointer ${
                    target === t
                      ? "bg-card text-foreground shadow-sm border border-border/10 font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ann-expiry" className="text-xs font-semibold text-foreground/80">Expires (optional)</Label>
            <Input
              id="ann-expiry"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="bg-surface/50 border-border/60 rounded-xl text-sm"
            />
          </div>
        </div>

        <Button
          onClick={handlePost}
          disabled={!title.trim() || !message.trim()}
          className="w-full rounded-full font-bold cursor-pointer"
        >
          <Megaphone size={14} className="mr-2" />
          {posted ? "Announcement Posted ✓" : "Post Announcement"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const {
    bookings,
    disputes,
    transactions,
    user,
    verifyWorker,
    workers,
    suspendWorker,
    unsuspendWorker,
    approveDocument,
    rejectDocument,
    resolveDispute,
    postAnnouncement,
  } = useAppContext();

  const [disputeFilter, setDisputeFilter] = useState<"all" | "open" | "resolved" | "dismissed">("open");

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const acceptedBookings = bookings.filter((b) => b.status === "accepted");
  const verifiedWorkers = workers.filter((w) => w.verified);
  const needsReview = workers.filter(
    (w) => !w.isIdVerified || !w.hasPoliceClearance || !w.hasBarangayClearance,
  );
  const completedPayments = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredDisputes =
    disputeFilter === "all" ? disputes : disputes.filter((d) => d.status === disputeFilter);

  return (
    <DashboardShell
      eyebrow="Admin dashboard"
      title={`Hello, ${user?.name ?? "Admin"}`}
      description="Monitor marketplace health, review worker credentials, manage disputes, and broadcast platform announcements."
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
      {/* ── KPI Tiles ─────────────────────────────────────────────────────────── */}
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

      {/* ── Platform Health Chart (Feature 3) ─────────────────────────────────── */}
      <PlatformHealthChart />

      {/* ── Recent Bookings + Quick Stats ─────────────────────────────────────── */}
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
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">Open disputes</span>
                <span className="font-bold text-foreground">{disputes.filter((d) => d.status === "open").length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Worker Qualification Review (Features 1 + 4) ──────────────────────── */}
      <section className="space-y-4">
        <div>
          <span className="eyebrow">Worker verification</span>
          <h2 className="mt-3 text-2xl font-bold text-foreground">Qualification review</h2>
          <p className="mt-2 body-copy max-w-2xl">
            Expand each worker card to review individual documents. Approve or reject documents separately, or suspend a worker platform-wide.
          </p>
        </div>
        <div className="grid gap-4">
          {workers.map((worker) => (
            <WorkerQualificationCard
              key={worker.id}
              worker={worker}
              onVerify={verifyWorker}
              onApproveDoc={approveDocument}
              onRejectDoc={rejectDocument}
              onSuspend={suspendWorker}
              onUnsuspend={unsuspendWorker}
            />
          ))}
        </div>
      </section>

      {/* ── Disputes (Feature 2) ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="eyebrow">Complaints</span>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Dispute & Complaint Center</h2>
            <p className="mt-2 body-copy max-w-2xl">
              Review client-filed complaints against workers. Issue refunds, send warnings, or dismiss invalid complaints.
            </p>
          </div>
          <div className="flex gap-1 p-1 bg-surface border border-border/60 rounded-full">
            {(["open", "resolved", "dismissed", "all"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setDisputeFilter(f)}
                className={`px-4 py-1.5 text-[11px] font-bold rounded-full capitalize transition-all cursor-pointer ${
                  disputeFilter === f
                    ? "bg-card text-foreground shadow-sm border border-border/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {filteredDisputes.length === 0 ? (
          <div className="surface-panel p-6 text-sm text-muted-foreground">
            No {disputeFilter === "all" ? "" : disputeFilter} disputes found.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDisputes.map((dispute) => (
              <DisputeCard key={dispute.id} dispute={dispute} onResolve={resolveDispute} />
            ))}
          </div>
        )}
      </section>

      {/* ── Broadcast Announcements (Feature 5) ────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <span className="eyebrow">Communications</span>
          <h2 className="mt-3 text-2xl font-bold text-foreground">Broadcast Announcements</h2>
          <p className="mt-2 body-copy max-w-2xl">
            Post platform-wide or role-specific announcements. They appear as dismissible banners on client and worker dashboards.
          </p>
        </div>
        <AnnouncementForm
          onPost={(title, message, target, expiresAt) =>
            postAnnouncement({ title, message, target, expiresAt })
          }
        />
      </section>
    </DashboardShell>
  );
}
