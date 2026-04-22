import { CalendarRange, CircleCheckBig, DollarSign, UsersRound } from "lucide-react";

import { BookingCard } from "@/components/BookingCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function WorkerDashboardPage() {
  const { user, workerBookings, getBookingsByStatus, transactions } = useAppContext();

  const totalEarnings = transactions
    .filter(tx => tx.type === 'payout' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Mock payouts for workers in MVP
  const workerTransactions = transactions.map(tx => ({
    ...tx,
    type: 'payout' as const,
    counterpartName: 'ViaPathHub Payout'
  }));

  return (
    <DashboardShell
      eyebrow="Worker dashboard"
      title={`Welcome, ${user?.name ?? "Worker"}`}
      description="Manage incoming client requests, stay on top of accepted jobs, and keep your profile ready for more bookings."
      aside={
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Incoming</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{getBookingsByStatus("pending").length}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Total Earned</p>
            <p className="mt-1 text-2xl font-bold text-success">₱{totalEarnings.toLocaleString()}</p>
          </div>
        </div>
      }
    >
      <section className="grid gap-4 sm:grid-cols-3">
        <article className="stat-tile">
          <UsersRound className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Active client requests</p>
          <p className="mt-2 text-3xl font-bold text-foreground">{workerBookings.length}</p>
        </article>
        <article className="stat-tile">
          <DollarSign className="text-success" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Estimated Earnings</p>
          <p className="mt-2 text-3xl font-bold text-foreground">₱{totalEarnings.toLocaleString()}</p>
        </article>
        <article className="stat-tile">
          <CircleCheckBig className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Profile status</p>
          <p className="mt-2 text-3xl font-bold text-foreground">Verified</p>
        </article>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Incoming bookings</h2>
          <div className="grid gap-4">
            {workerBookings.length ? (
              workerBookings.map((booking) => <BookingCard key={booking.id} booking={booking} perspective="worker" />)
            ) : (
              <div className="surface-panel p-6 text-sm text-muted-foreground">No incoming bookings yet.</div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <TransactionHistory transactions={workerTransactions} title="Earnings History" />
        </section>
      </div>
    </DashboardShell>
  );
}
