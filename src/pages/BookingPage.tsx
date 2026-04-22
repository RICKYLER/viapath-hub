import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/AppContext";

export function BookingPage({ workerId }: { workerId: string }) {
  const navigate = useNavigate();
  const { user, getWorkerById, createBooking } = useAppContext();
  const worker = getWorkerById(workerId);
  const [date, setDate] = useState("2026-04-30T10:00");
  const [location, setLocation] = useState(user?.location ?? "Tagum City, Davao del Norte");
  const [note, setNote] = useState("Please bring needed tools and confirm before arrival.");

  const summary = useMemo(() => {
    if (!worker) return "";
    return `${worker.service} booking with ${worker.name}`;
  }, [worker]);

  if (!worker) {
    return (
      <div className="page-shell section-gap">
        <div className="surface-panel p-6 text-sm text-muted-foreground">Worker not found for booking.</div>
      </div>
    );
  }

  const submit = () => {
    const booking = createBooking({ workerId: worker.id, date, location, note });
    if (booking) {
      navigate({ to: "/client/bookings" });
    }
  };

  return (
    <div className="page-shell section-gap grid gap-6 lg:grid-cols-[0.9fr_minmax(0,0.7fr)]">
      <section className="surface-elevated space-y-5 p-6">
        <span className="eyebrow">Booking page</span>
        <h1 className="title-section text-balance">Confirm your schedule with {worker.name}</h1>
        <p className="body-copy">Finalize the appointment details below. The booking is stored in context state for this MVP.</p>
        <div className="surface-panel p-5">
          <p className="text-sm text-muted-foreground">Selected worker</p>
          <div className="mt-3 flex items-center gap-4">
            <img src={worker.image} alt={worker.name} className="h-16 w-16 rounded-2xl border border-border/70 object-cover" />
            <div>
              <p className="text-lg font-bold text-foreground">{worker.name}</p>
              <p className="text-sm text-primary">{worker.service}</p>
              <p className="text-sm text-muted-foreground">{worker.location}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="form-panel space-y-5">
        <div className="space-y-2">
          <Label htmlFor="date">Appointment date</Label>
          <Input id="date" type="datetime-local" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Service address</Label>
          <Input id="location" value={location} onChange={(event) => setLocation(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="note">Booking note</Label>
          <Textarea id="note" value={note} onChange={(event) => setNote(event.target.value)} rows={5} />
        </div>
        <div className="surface-panel p-4">
          <p className="text-sm text-muted-foreground">Summary</p>
          <p className="mt-2 font-semibold text-foreground">{summary}</p>
        </div>
        <Button className="w-full" size="lg" onClick={submit}>
          Confirm booking
        </Button>
      </section>
    </div>
  );
}
