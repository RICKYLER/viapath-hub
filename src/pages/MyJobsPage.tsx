import React, { useState } from 'react';
import { Map as MapIcon, LayoutList } from "lucide-react";
import { useSearch } from "@tanstack/react-router";
import { BookingCard } from "@/components/BookingCard";
import { MapLocator } from "@/components/MapLocator";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";

export function MyJobsPage() {
  const { workerBookings } = useAppContext();
  const search = useSearch({ from: '/worker/jobs' }) as { view?: 'list' | 'map', lat?: number, lng?: number };
  const [viewMode, setViewMode] = useState<'list' | 'map'>(search.view || 'list');

  const centerLocation = search.lat && search.lng ? { lat: search.lat, lng: search.lng } : undefined;

  // Sync state with URL search params
  React.useEffect(() => {
    if (search.view) {
      setViewMode(search.view);
    }
  }, [search.view]);

  // Format bookings for the map
  const mapMarkers = workerBookings
    .filter(b => b.lat && b.lng)
    .map(b => ({
      id: b.id,
      name: `Client: ${b.clientName} (${b.service})`,
      lat: b.lat!,
      lng: b.lng!
    }));

  return (
    <DashboardShell
      eyebrow="My jobs"
      title="Track all accepted and incoming work"
      description="Review your appointment queue, upcoming visits, and job notes from clients."
      aside={
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <LayoutList size={16} className="mr-2" />
            List
          </Button>
          <Button 
            variant={viewMode === 'map' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <MapIcon size={16} className="mr-2" />
            Map
          </Button>
        </div>
      }
    >
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <MapLocator workers={mapMarkers} center={centerLocation} />
          <div className="grid gap-4 mt-6">
            <h3 className="font-bold text-foreground">Recent job locations in Tagum City</h3>
            <p className="text-sm text-muted-foreground">This map shows the precise location of your upcoming client visits.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {workerBookings.length ? (
            workerBookings.map((booking) => <BookingCard key={booking.id} booking={booking} perspective="worker" />)
          ) : (
            <div className="surface-panel p-6 text-sm text-muted-foreground">No jobs are assigned to you yet.</div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
