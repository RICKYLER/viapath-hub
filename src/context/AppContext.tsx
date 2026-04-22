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
  updateBookingStatus: (bookingId: string, status: BookingStatus) => boolean;
  updateWorkerProfile: (input: UpdateWorkerProfileInput) => void;
  getWorkerById: (workerId: string) => WorkerProfile | undefined;
  getBookingsByStatus: (status: BookingStatus) => Booking[];
}

const createStatusHistoryItem = (status: BookingStatus, changedAt: string) => ({ status, changedAt });

const isFutureBookingDate = (date: string) => {
  const parsedDate = new Date(date);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.getTime() > Date.now();
};

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
    status: "accepted",
    statusHistory: [
      createStatusHistoryItem("pending", "2026-04-22T09:15:00.000Z"),
      createStatusHistoryItem("accepted", "2026-04-22T10:00:00.000Z"),
    ],
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
    statusHistory: [createStatusHistoryItem("pending", "2026-04-22T11:30:00.000Z")],
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
    statusHistory: [createStatusHistoryItem("pending", "2026-04-22T12:10:00.000Z")],
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
    if (!worker || !isFutureBookingDate(date)) return null;

    const createdAt = new Date().toISOString();

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
      statusHistory: [createStatusHistoryItem("pending", createdAt)],
    };

    setBookings((current) => [booking, ...current]);
    return booking;
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus) => {
    let didUpdate = false;

    setBookings((current) =>
      current.map((booking) => {
        if (booking.id !== bookingId) return booking;
        if (booking.status === status) {
          didUpdate = true;
          return booking;
        }
        if (booking.status === "completed" || booking.status === "cancelled") return booking;
        if (status === "accepted" && (booking.status !== "pending" || !isFutureBookingDate(booking.date))) return booking;
        if (status === "completed" && booking.status !== "accepted") return booking;
        if (status === "cancelled" && !["pending", "accepted"].includes(booking.status)) return booking;

        didUpdate = true;
        return {
          ...booking,
          status,
          statusHistory: [...booking.statusHistory, createStatusHistoryItem(status, new Date().toISOString())],
        };
      }),
    );

    return didUpdate;
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
      updateBookingStatus,
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
