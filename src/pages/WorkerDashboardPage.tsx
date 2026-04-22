import { CalendarRange, CircleCheckBig, UsersRound } from "lucide-react";

import { BookingCard } from "@/components/BookingCard";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function WorkerDashboardPage() {
  const { user, workerBookings, getBookingsByStatus } = useAppContext();

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
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Accepted</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{getBookingsByStatus("accepted").length}</p>
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
          <CalendarRange className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Next service city</p>
          <p className="mt-2 text-3xl font-bold text-foreground">Tagum</p>
        </article>
        <article className="stat-tile">
          <CircleCheckBig className="text-primary" size={18} />
          <p className="mt-3 text-sm text-muted-foreground">Profile status</p>
          <p className="mt-2 text-3xl font-bold text-foreground">Ready</p>
        </article>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Incoming bookings</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {workerBookings.length ? (
            workerBookings.map((booking) => <BookingCard key={booking.id} booking={booking} perspective="worker" />)
          ) : (
            <div className="surface-panel p-6 text-sm text-muted-foreground">No incoming bookings yet.</div>
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
