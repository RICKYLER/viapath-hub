import { useMemo, useState } from "react";
import { WorkerCard } from "@/components/WorkerCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { DashboardShell } from "@/layouts/DashboardShell";
import { Button } from "@/components/ui/button";
import { MapLocator } from "@/components/MapLocator";

export function SearchWorkersPage() {
  const { workers, serviceTypes } = useAppContext();
  const [service, setService] = useState<string>("all");
  const [barangay, setBarangay] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [showMap, setShowMap] = useState(false);

  const barangays = useMemo(() => {
    return Array.from(new Set(workers.map(w => w.barangay))).sort();
  }, [workers]);

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const matchesService = service === "all" || worker.service === service;
      const matchesBarangay = barangay === "all" || worker.barangay === barangay;
      const haystack = `${worker.name} ${worker.location} ${worker.about} ${worker.skills.join(" ")}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      return matchesService && matchesBarangay && matchesQuery;
    });
  }, [barangay, query, service, workers]);

  return (
    <DashboardShell
      eyebrow="Search workers"
      title="Browse skilled professionals near you"
      description="Filter by service type and compare trusted local workers before booking."
    >
      <section className="grid gap-4">
        <div className="surface-panel grid gap-4 p-5 md:grid-cols-[220px_220px_minmax(0,1fr)_auto]">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Service type</p>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {serviceTypes.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Barangay (Tagum)</p>
            <Select value={barangay} onValueChange={setBarangay}>
              <SelectTrigger>
                <SelectValue placeholder="Select a barangay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Barangays</SelectItem>
                {barangays.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Search</p>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, skill, or barangay"
            />
          </div>
          <div className="flex items-end">
            <Button 
              variant={showMap ? "default" : "outline"}
              onClick={() => setShowMap(!showMap)}
              className="w-full md:w-auto"
            >
              {showMap ? "Hide Map" : "Show Map"}
            </Button>
          </div>
        </div>

        {showMap && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <MapLocator 
              workers={filteredWorkers.map(w => ({ id: w.id, name: w.name, lat: w.lat, lng: w.lng }))} 
            />
          </div>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredWorkers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} canBook />
        ))}
      </section>
    </DashboardShell>
  );
}
