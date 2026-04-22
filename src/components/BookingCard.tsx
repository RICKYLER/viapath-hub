import { format } from "date-fns";
import { CalendarDays, CheckCheck, MapPin, NotebookPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import type { Booking } from "@/context/types";

interface BookingCardProps {
  booking: Booking;
  perspective: "client" | "worker";
}

export function BookingCard({ booking, perspective }: BookingCardProps) {
  const { updateBookingStatus } = useAppContext();
  const counterpart = perspective === "client" ? booking.workerName : booking.clientName;

  return (
    <Card className="border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {perspective === "client" ? "Assigned worker" : "Client"}
            </p>
            <h3 className="mt-1 text-lg font-bold text-foreground">{counterpart}</h3>
            <p className="text-sm text-primary">{booking.service}</p>
          </div>
          <span className={`status-pill ${booking.status}`}>{booking.status}</span>
        </div>

        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} />
            <span>{format(new Date(booking.date), "MMM d, yyyy • h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{booking.location}</span>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-2xl bg-surface px-4 py-3 text-sm text-muted-foreground">
          <NotebookPen size={16} className="mt-0.5 shrink-0" />
          <p>{booking.note}</p>
        </div>

        {perspective === "worker" ? (
          <div className="flex flex-wrap gap-3">
            {booking.status === "pending" ? (
              <Button size="sm" onClick={() => updateBookingStatus(booking.id, "accepted")}>
                <CheckCheck size={16} />
                Accept booking
              </Button>
            ) : null}

            {booking.status === "accepted" ? (
              <Button size="sm" variant="outline" onClick={() => updateBookingStatus(booking.id, "completed")}>
                Mark completed
              </Button>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
