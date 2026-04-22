import { BookingCard } from "@/components/BookingCard";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function MyJobsPage() {
  const { workerBookings } = useAppContext();

  return (
    <DashboardShell
      eyebrow="My jobs"
      title="Track all accepted and incoming work"
      description="Review your appointment queue, upcoming visits, and job notes from clients."
    >
      <div className="grid gap-4">
        {workerBookings.length ? (
          workerBookings.map((booking) => <BookingCard key={booking.id} booking={booking} perspective="worker" />)
        ) : (
          <div className="surface-panel p-6 text-sm text-muted-foreground">No jobs are assigned to you yet.</div>
        )}
      </div>
    </DashboardShell>
  );
}
