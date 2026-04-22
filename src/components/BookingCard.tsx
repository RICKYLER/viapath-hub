import { format } from "date-fns";
import { Ban, CalendarDays, CheckCheck, Clock3, CreditCard, MapPin, MapPinned, MessageSquare, NotebookPen } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppContext } from "@/context/AppContext";
import type { Booking } from "@/context/types";
import { toast } from "sonner";
import { PaymentModal } from "@/components/PaymentModal";
import { ReviewForm } from "@/components/ReviewForm";

interface BookingCardProps {
  booking: Booking;
  perspective: "client" | "worker";
}

export function BookingCard({ booking, perspective }: BookingCardProps) {
  const { updateBookingStatus } = useAppContext();
  const [showPayment, setShowPayment] = useState(false);
  const counterpart = perspective === "client" ? booking.workerName : booking.clientName;
  const isAcceptableDate = new Date(booking.date).getTime() > Date.now();

  const applyStatus = (status: Booking["status"], message: string) => {
    const updated = updateBookingStatus(booking.id, status);
    if (!updated) {
      toast.error(message);
    }
  };

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

        <div className="rounded-2xl border border-border/70 bg-surface/70 px-4 py-4">
          <div className="flex items-center gap-2">
            <Clock3 size={16} className="text-primary" />
            <p className="text-sm font-semibold text-foreground">Booking timeline</p>
          </div>
          <div className="mt-4 space-y-3">
            {booking.statusHistory.map((entry, index) => (
              <div key={`${entry.status}-${entry.changedAt}`} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  {index < booking.statusHistory.length - 1 ? <span className="mt-1 h-8 w-px bg-border" /> : null}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium capitalize text-foreground">{entry.status}</p>
                  <p className="text-xs text-muted-foreground">{format(new Date(entry.changedAt), "MMM d, yyyy • h:mm a")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm" variant="outline">
            <Link 
              to={perspective === "client" ? "/client/chat/$workerId" : "/worker/chat/$clientId"}
              params={perspective === "client" ? { workerId: booking.workerId } : { clientId: booking.clientId }}
            >
              <MessageSquare size={16} />
              Chat
            </Link>
          </Button>

          {perspective === "worker" && booking.status === "pending" ? (
            <Button
              size="sm"
              disabled={!isAcceptableDate}
              onClick={() => applyStatus("accepted", "Only future bookings can be accepted.")}
            >
              <CheckCheck size={16} />
              Accept booking
            </Button>
          ) : null}

          {perspective === "worker" && booking.status === "accepted" && (
            <Button 
              size="sm" 
              variant="outline"
              asChild
            >
              <Link 
                to="/worker/jobs" 
                search={{ 
                  view: 'map',
                  lat: booking.lat,
                  lng: booking.lng
                }}
              >
                <MapPinned size={16} className="mr-2" />
                Locate Job
              </Link>
            </Button>
          )}
          {perspective === "worker" && booking.status === "accepted" && (
            <Button size="sm" onClick={() => updateBookingStatus(booking.id, "completed")}>
              Mark completed
            </Button>
          )}

          {perspective === "client" && ["accepted", "completed"].includes(booking.status) && (
            <Button size="sm" onClick={() => setShowPayment(true)}>
              <CreditCard size={16} />
              {booking.status === "completed" ? "Pay Now" : "Pre-pay"}
            </Button>
          )}

          {["pending", "accepted"].includes(booking.status) ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => applyStatus("cancelled", "This booking can no longer be cancelled.")}
            >
              <Ban size={16} />
              Cancel booking
            </Button>
          ) : null}
        </div>

        {perspective === "client" && booking.status === "completed" && (
          <div className="mt-4 border-t border-border/50 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ReviewForm 
              workerId={booking.workerId} 
              jobId={booking.id} 
              onSubmit={(data) => {
                toast.success("Review submitted! Thank you for your feedback.");
              }} 
            />
          </div>
        )}

        <PaymentModal 
          isOpen={showPayment} 
          onClose={() => setShowPayment(false)}
          amount={500} // Mock amount for MVP
          workerName={booking.workerName}
          onSuccess={() => {
            toast.success("Payment successful!");
            if (booking.status === "accepted") {
              applyStatus("completed", "Booking marked as completed after payment.");
            }
          }}
        />

        {perspective === "worker" && booking.status === "pending" && !isAcceptableDate ? (
          <p className="text-sm text-destructive">This booking date has already passed, so it can no longer be accepted.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
