import { BookingCard } from "@/components/BookingCard";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function MyBookingsPage() {
  const { clientBookings } = useAppContext();

  return (
    <DashboardShell
      eyebrow="My bookings"
      title="All your scheduled services"
      description="Review appointment details, locations, and booking notes for every client request."
    >
      <div className="grid gap-4">
        {clientBookings.length ? (
          clientBookings.map((booking) => <BookingCard key={booking.id} booking={booking} perspective="client" />)
        ) : (
          <div className="surface-panel p-6 text-sm text-muted-foreground">You have not placed any bookings yet.</div>
        )}
      </div>
    </DashboardShell>
  );
}
