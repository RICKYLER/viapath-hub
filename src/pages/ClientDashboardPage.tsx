
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, DollarSign, Flag, Search, Sparkles, X } from "lucide-react";

import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { BookingCard } from "@/components/BookingCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { WorkerCard } from "@/components/WorkerCard";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function ClientDashboardPage() {
  const { user, clientBookings, topWorkers, transactions, workers, fileDispute, getActiveAnnouncements } = useAppContext();

  const [flaggingBookingId, setFlaggingBookingId] = useState<string | null>(null);
  const [complaintText, setComplaintText] = useState("");
  const [submittedDisputeId, setSubmittedDisputeId] = useState<string | null>(null);

  const activeAnnouncements = getActiveAnnouncements("clients");

  const totalSpent = transactions
    .filter((tx) => tx.type === "payment" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const previouslyBookedWorkers = useMemo(() => {
    const bookedWorkerIds = Array.from(new Set(clientBookings.map((b) => b.workerId)));
    return workers.filter((w) => bookedWorkerIds.includes(w.id));
  }, [clientBookings, workers]);

  const completedBookings = clientBookings.filter((b) => b.status === "completed");

  const handleSubmitDispute = (bookingId: string) => {
    if (!complaintText.trim()) return;
    fileDispute(bookingId, complaintText.trim());
    setSubmittedDisputeId(bookingId);
    setFlaggingBookingId(null);
    setComplaintText("");
  };

  return (
    <DashboardShell
      eyebrow="Client dashboard"
      title={`Good day, ${user?.name ?? "Client"}`}
      description="Track upcoming appointments, discover reliable workers, and manage your ViaPathHub activity in one place."
      aside={
        <div className="space-y-4">
          <div className="surface-panel p-4 bg-primary/5 border-primary/10">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total Spent</p>
            <p className="mt-1 text-2xl font-bold text-primary">₱{totalSpent.toLocaleString()}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick actions</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm">
                <Link to="/client/search">Find workers</Link>
              </Button>
            </div>
          </div>
        </div>
      }
    >
      {/* Announcement banners */}
      {activeAnnouncements.length > 0 && <AnnouncementBanner announcements={activeAnnouncements} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="stat-tile">
          <p className="text-sm text-muted-foreground">Upcoming bookings</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">{clientBookings.length}</p>
        </article>
        <article className="stat-tile">
          <DollarSign className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Total Invested</p>
          <p className="mt-2 text-3xl font-bold text-foreground">₱{totalSpent.toLocaleString()}</p>
        </article>
        <article className="stat-tile">
          <p className="text-sm text-muted-foreground">Preferred city</p>
          <p className="mt-2 font-display text-3xl font-bold text-foreground">Tagum</p>
        </article>
      </div>

      {previouslyBookedWorkers.length > 0 && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <h2 className="text-lg font-bold text-foreground tracking-tight">Hire Again</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {previouslyBookedWorkers.map((worker) => (
              <div key={worker.id} className="surface-panel p-3.5 flex items-center justify-between gap-4 min-w-[300px] max-w-[340px] shrink-0 border border-border/80 hover:bg-surface/50 hover:border-border transition-all duration-300">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={worker.image} alt={worker.name} className="h-11 w-11 rounded-xl object-cover border border-border/10" />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold truncate text-foreground leading-tight">{worker.name}</h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{worker.service}</p>
                  </div>
                </div>
                <Button asChild size="sm" variant="soft" className="h-8 rounded-full text-xs font-semibold px-4 cursor-pointer hover:bg-primary/15">
                  <Link to="/client/booking/$workerId" params={{ workerId: worker.id }}>
                    Book
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-foreground">Recommended workers</h2>
              <Button asChild variant="soft" size="sm">
                <Link to="/client/search">
                  <Search size={16} />
                  Explore all
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {topWorkers.slice(0, 2).map((worker) => (
                <WorkerCard key={worker.id} worker={worker} canBook />
              ))}
            </div>
          </div>

          <TransactionHistory transactions={transactions} title="Payment History" />
        </div>

        <div className="space-y-4">
          <div className="surface-panel space-y-4 p-5 h-fit">
            <div className="flex items-center gap-2">
              <CalendarDays className="text-primary" size={18} />
              <h2 className="text-lg font-bold text-foreground">My bookings</h2>
            </div>
            {clientBookings.length ? (
              <div className="space-y-4">
                {clientBookings.slice(0, 2).map((booking) => (
                  <BookingCard key={booking.id} booking={booking} perspective="client" />
                ))}
              </div>
            ) : (
              <div className="surface-panel p-4 text-sm text-muted-foreground">
                No bookings yet — try browsing workers to schedule your first service.
              </div>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/client/bookings">
                <Sparkles size={16} />
                See all bookings
              </Link>
            </Button>
          </div>

          {/* Flag an Issue — Completed Bookings */}
          {completedBookings.length > 0 && (
            <div className="surface-panel p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Flag className="text-warning" size={16} />
                <h2 className="text-base font-bold text-foreground">Flag an Issue</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                Had a problem with a completed service? You can file a dispute for admin review.
              </p>
              <div className="space-y-3">
                {completedBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="rounded-xl border border-border/60 bg-surface/50 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">{booking.workerName}</p>
                      </div>
                      {submittedDisputeId === booking.id ? (
                        <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                          Flagged ✓
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setFlaggingBookingId(flaggingBookingId === booking.id ? null : booking.id)}
                          className="text-[10px] font-bold text-warning border border-warning/30 px-2.5 py-1 rounded-full hover:bg-warning/5 transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <Flag size={10} /> Flag
                        </button>
                      )}
                    </div>

                    {flaggingBookingId === booking.id && (
                      <div className="space-y-2 pt-1">
                        <textarea
                          placeholder="Describe the issue you experienced…"
                          value={complaintText}
                          onChange={(e) => setComplaintText(e.target.value)}
                          rows={2}
                          className="w-full bg-background border border-border/60 rounded-lg text-xs px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="h-7 text-[10px] rounded-full px-3 cursor-pointer flex-1"
                            onClick={() => handleSubmitDispute(booking.id)}
                            disabled={!complaintText.trim()}
                          >
                            Submit Complaint
                          </Button>
                          <button
                            type="button"
                            onClick={() => { setFlaggingBookingId(null); setComplaintText(""); }}
                            className="h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
