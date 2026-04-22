import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useRouter } from "@tanstack/react-router";

import { workers as initialWorkers, serviceTypes } from "@/data/workers";
import { authStore } from "@/context/auth-store";
import type { AuthUser, Booking, BookingStatus, WorkerProfile } from "@/context/types";

interface CreateBookingInput {
  workerId: string;
  date: string;
  location: string;
  note: string;
}

interface UpdateWorkerProfileInput {
  about: string;
  location: string;
  service: string;
  skills: string[];
}

interface AppContextValue {
  user: AuthUser | null;
  workers: WorkerProfile[];
  serviceTypes: string[];
  bookings: Booking[];
  clientBookings: Booking[];
  workerBookings: Booking[];
  topWorkers: WorkerProfile[];
  login: typeof authStore.login;
  register: typeof authStore.register;
  logout: typeof authStore.logout;
  createBooking: (input: CreateBookingInput) => Booking | null;
  updateWorkerProfile: (input: UpdateWorkerProfileInput) => void;
  getWorkerById: (workerId: string) => WorkerProfile | undefined;
  getBookingsByStatus: (status: BookingStatus) => Booking[];
}

const seededBookings: Booking[] = [
  {
    id: "b1",
    workerId: "w1",
    clientId: "client-demo",
    clientName: "Patricia Gomez",
    workerName: "Lina Mae Torres",
    service: "Massage Therapy",
    date: "2026-04-25T14:00",
    location: "Visayan Village, Tagum City",
    note: "Need a relaxing home session after office hours.",
    status: "confirmed",
  },
  {
    id: "b2",
    workerId: "w3",
    clientId: "client-demo",
    clientName: "Patricia Gomez",
    workerName: "Rogelio Quiblat",
    service: "Plumbing",
    date: "2026-04-28T09:30",
    location: "Mankilam, Tagum City",
    note: "Kitchen sink leak needs checking before noon.",
    status: "pending",
  },
  {
    id: "b3",
    workerId: "w1",
    clientId: "client-lyra",
    clientName: "Lyra Santos",
    workerName: "Lina Mae Torres",
    service: "Massage Therapy",
    date: "2026-04-26T18:30",
    location: "Magugpo South, Tagum City",
    note: "Deep tissue massage after a basketball game.",
    status: "pending",
  },
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, authStore.getSnapshot);
  const [workers, setWorkers] = useState<WorkerProfile[]>(initialWorkers);
  const [bookings, setBookings] = useState<Booking[]>(seededBookings);

  useEffect(() => {
    router.invalidate();
  }, [router, user?.id, user?.role]);

  useEffect(() => {
    if (!user || user.role !== "worker" || !user.workerId) return;

    const workerId = user.workerId;

    setWorkers((current) => {
      if (current.some((worker) => worker.id === workerId)) return current;

      return [
        {
          id: workerId,
          name: user.name,
          service: "Cleaning",
          rating: 4.7,
          location: user.location,
          about: "Newly onboarded worker profile ready to accept flexible jobs in Tagum City.",
          image: initialWorkers[0]?.image ?? "",
          skills: ["Home service", "Flexible schedule", "Quick replies"],
          verified: true,
          completedJobs: 0,
          responseTime: "Replies in 20 mins",
        },
        ...current,
      ];
    });
  }, [user]);

  const clientBookings = useMemo(() => {
    if (!user || user.role !== "client") return [];
    return bookings.filter((booking) => booking.clientId === user.id);
  }, [bookings, user]);

  const workerBookings = useMemo(() => {
    if (!user || user.role !== "worker") return [];
    return bookings.filter((booking) => booking.workerId === user.workerId);
  }, [bookings, user]);

  const topWorkers = useMemo(
    () => [...workers].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [workers],
  );

  const createBooking = ({ workerId, date, location, note }: CreateBookingInput) => {
    if (!user) return null;

    const worker = workers.find((candidate) => candidate.id === workerId);
    if (!worker) return null;

    const booking: Booking = {
      id: `booking-${Date.now()}`,
      workerId: worker.id,
      clientId: user.id,
      clientName: user.name,
      workerName: worker.name,
      service: worker.service,
      date,
      location,
      note,
      status: "pending",
    };

    setBookings((current) => [booking, ...current]);
    return booking;
  };

  const updateWorkerProfile = ({ about, location, service, skills }: UpdateWorkerProfileInput) => {
    if (!user?.workerId) return;

    setWorkers((current) =>
      current.map((worker) =>
        worker.id === user.workerId
          ? {
              ...worker,
              about,
              location,
              service,
              skills,
            }
          : worker,
      ),
    );
  };

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      workers,
      serviceTypes,
      bookings,
      clientBookings,
      workerBookings,
      topWorkers,
      login: authStore.login,
      register: authStore.register,
      logout: authStore.logout,
      createBooking,
      updateWorkerProfile,
      getWorkerById: (workerId: string) => workers.find((worker) => worker.id === workerId),
      getBookingsByStatus: (status: BookingStatus) => bookings.filter((booking) => booking.status === status),
    }),
    [bookings, clientBookings, topWorkers, user, workerBookings, workers],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
