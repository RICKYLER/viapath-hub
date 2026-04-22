import { Link } from "@tanstack/react-router";
import { CalendarDays, DollarSign, Search, Sparkles } from "lucide-react";

import { BookingCard } from "@/components/BookingCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { WorkerCard } from "@/components/WorkerCard";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function ClientDashboardPage() {
  const { user, clientBookings, topWorkers, transactions } = useAppContext();

  const totalSpent = transactions
    .filter(tx => tx.type === 'payment' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

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
      </section>
    </DashboardShell>
  );
}
