import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { workers as initialWorkers, serviceTypes } from "@/data/workers";
import { authStore } from "@/context/auth-store";
import type {
  Announcement,
  AnnouncementTarget,
  AuthUser,
  Booking,
  BookingStatus,
  Dispute,
  DisputeResolution,
  DocumentReview,
  Transaction,
  WorkerProfile,
} from "@/context/types";
import { fetchWorkers, createBookingDb } from "@/lib/api";

interface CreateBookingInput {
  workerId: string;
  date: string;
  location: string;
  note: string;
}

interface UpdateWorkerProfileInput {
  about?: string;
  location?: string;
  service?: string;
  skills?: string[];
  acceptingBookings?: boolean;
  suspended?: boolean;
  verified?: boolean;
  isIdVerified?: boolean;
  hasPoliceClearance?: boolean;
  hasBarangayClearance?: boolean;
  documentReviews?: DocumentReview[];
}

interface AppContextValue {
  user: AuthUser | null;
  workers: WorkerProfile[];
  serviceTypes: string[];
  bookings: Booking[];
  clientBookings: Booking[];
  workerBookings: Booking[];
  topWorkers: WorkerProfile[];
  transactions: Transaction[];
  disputes: Dispute[];
  announcements: Announcement[];
  dismissedAnnouncementIds: string[];
  login: typeof authStore.login;
  register: typeof authStore.register;
  logout: typeof authStore.logout;
  createBooking: (input: CreateBookingInput) => Booking | null;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => boolean;
  updateWorkerProfile: (input: UpdateWorkerProfileInput) => void;
  verifyWorker: (workerId: string) => void;
  suspendWorker: (workerId: string) => void;
  unsuspendWorker: (workerId: string) => void;
  approveDocument: (workerId: string, docType: DocumentReview["type"]) => void;
  rejectDocument: (workerId: string, docType: DocumentReview["type"], note: string) => void;
  fileDispute: (bookingId: string, complaint: string) => void;
  resolveDispute: (disputeId: string, resolution: DisputeResolution) => void;
  postAnnouncement: (input: Omit<Announcement, "id" | "createdAt">) => void;
  dismissAnnouncement: (announcementId: string) => void;
  getWorkerById: (workerId: string) => WorkerProfile | undefined;
  getBookingsByStatus: (status: BookingStatus) => Booking[];
  getActiveAnnouncements: (role: "clients" | "workers") => Announcement[];
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
    price: 500,
    lat: 7.438,
    lng: 125.822,
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
    price: 350,
    lat: 7.465,
    lng: 125.795,
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
    status: "completed",
    price: 500,
    lat: 7.4478,
    lng: 125.8094,
    statusHistory: [
      createStatusHistoryItem("pending", "2026-04-22T12:10:00.000Z"),
      createStatusHistoryItem("accepted", "2026-04-23T08:00:00.000Z"),
      createStatusHistoryItem("completed", "2026-04-26T20:00:00.000Z"),
    ],
  },
];

const seededTransactions: Transaction[] = [
  {
    id: "t1",
    bookingId: "b1",
    amount: 500,
    date: "2026-04-22T10:05:00.000Z",
    status: "completed",
    type: "payment",
    counterpartName: "Lina Mae Torres",
  },
  {
    id: "t2",
    bookingId: "b0",
    amount: 450,
    date: "2026-04-20T16:20:00.000Z",
    status: "completed",
    type: "payment",
    counterpartName: "Marco Silva",
  },
];

const seededDisputes: Dispute[] = [
  {
    id: "d1",
    bookingId: "b3",
    clientId: "client-lyra",
    clientName: "Lyra Santos",
    workerName: "Lina Mae Torres",
    service: "Massage Therapy",
    complaint:
      "The worker arrived 45 minutes late without prior notice. The session was rushed as a result. I would like a partial refund.",
    status: "open",
    createdAt: "2026-04-27T09:00:00.000Z",
  },
];

const seededAnnouncements: Announcement[] = [
  {
    id: "ann1",
    title: "Platform Maintenance — June 30",
    message:
      "ViaPathHub will be offline for scheduled maintenance on June 30 from 2:00 AM to 4:00 AM (PHT). New bookings cannot be made during this window.",
    target: "all",
    expiresAt: "2026-06-30T04:00:00.000Z",
    createdAt: "2026-06-23T00:00:00.000Z",
  },
];

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, authStore.getSnapshot);
  const [workers, setWorkers] = useState<WorkerProfile[]>(initialWorkers);
  const [bookings, setBookings] = useState<Booking[]>(seededBookings);
  const [transactions, setTransactions] = useState<Transaction[]>(seededTransactions);
  const [disputes, setDisputes] = useState<Dispute[]>(seededDisputes);
  const [announcements, setAnnouncements] = useState<Announcement[]>(seededAnnouncements);
  const [dismissedAnnouncementIds, setDismissedAnnouncementIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const dbWorkers = await fetchWorkers();
      if (dbWorkers && dbWorkers.length > 0) {
        setWorkers(dbWorkers);
      }
    }
    loadData();
  }, []);

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
          verified: false,
          isIdVerified: false,
          hasPoliceClearance: false,
          hasBarangayClearance: false,
          certifications: ["Pending admin qualification review"],
          barangay: "Magugpo",
          completedJobs: 0,
          responseTime: "Replies in 20 mins",
          lat: 7.4478,
          lng: 125.8094,
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

  const updateWorkerProfile = (input: UpdateWorkerProfileInput) => {
    if (!user?.workerId) return;

    setWorkers((current) =>
      current.map((worker) =>
        worker.id === user.workerId
          ? { ...worker, ...input }
          : worker,
      ),
    );
  };

  const verifyWorker = (workerId: string) => {
    setWorkers((current) =>
      current.map((worker) =>
        worker.id === workerId
          ? {
              ...worker,
              verified: true,
              isIdVerified: true,
              hasPoliceClearance: true,
              hasBarangayClearance: true,
              certifications: worker.certifications.includes("Admin verified")
                ? worker.certifications
                : [
                    ...worker.certifications.filter(
                      (certification) => certification !== "Pending admin qualification review",
                    ),
                    "Admin verified",
                  ],
            }
          : worker,
      ),
    );
  };

  const suspendWorker = (workerId: string) => {
    setWorkers((current) =>
      current.map((w) => (w.id === workerId ? { ...w, suspended: true } : w)),
    );
  };

  const unsuspendWorker = (workerId: string) => {
    setWorkers((current) =>
      current.map((w) => (w.id === workerId ? { ...w, suspended: false } : w)),
    );
  };

  const approveDocument = (workerId: string, docType: DocumentReview["type"]) => {
    setWorkers((current) =>
      current.map((w) => {
        if (w.id !== workerId) return w;
        const existingReviews = w.documentReviews ?? [];
        const updated = existingReviews.filter((r) => r.type !== docType);
        updated.push({ type: docType, status: "approved" });
        const isIdVerified = docType === "id" ? true : w.isIdVerified;
        const hasPoliceClearance = docType === "police" ? true : w.hasPoliceClearance;
        const hasBarangayClearance = docType === "barangay" ? true : w.hasBarangayClearance;
        const allApproved = isIdVerified && hasPoliceClearance && hasBarangayClearance;
        return {
          ...w,
          documentReviews: updated,
          isIdVerified,
          hasPoliceClearance,
          hasBarangayClearance,
          verified: allApproved ? true : w.verified,
        };
      }),
    );
  };

  const rejectDocument = (workerId: string, docType: DocumentReview["type"], note: string) => {
    setWorkers((current) =>
      current.map((w) => {
        if (w.id !== workerId) return w;
        const existingReviews = w.documentReviews ?? [];
        const updated = existingReviews.filter((r) => r.type !== docType);
        updated.push({ type: docType, status: "rejected", rejectionNote: note });
        return { ...w, documentReviews: updated };
      }),
    );
  };

  const fileDispute = (bookingId: string, complaint: string) => {
    if (!user) return;
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;
    const dispute: Dispute = {
      id: `dispute-${Date.now()}`,
      bookingId,
      clientId: user.id,
      clientName: user.name,
      workerName: booking.workerName,
      service: booking.service,
      complaint,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setDisputes((current) => [dispute, ...current]);
  };

  const resolveDispute = (disputeId: string, resolution: DisputeResolution) => {
    setDisputes((current) =>
      current.map((d) =>
        d.id === disputeId
          ? { ...d, status: resolution === "dismiss" ? "dismissed" : "resolved", resolution }
          : d,
      ),
    );
  };

  const postAnnouncement = (input: Omit<Announcement, "id" | "createdAt">) => {
    const ann: Announcement = {
      ...input,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((current) => [ann, ...current]);
  };

  const dismissAnnouncement = (announcementId: string) => {
    setDismissedAnnouncementIds((current) =>
      current.includes(announcementId) ? current : [...current, announcementId],
    );
  };

  const getActiveAnnouncements = (role: "clients" | "workers") => {
    const now = new Date();
    return announcements.filter((ann) => {
      if (dismissedAnnouncementIds.includes(ann.id)) return false;
      if (ann.expiresAt && new Date(ann.expiresAt) < now) return false;
      if (ann.target === "all") return true;
      if (ann.target === "clients" && role === "clients") return true;
      if (ann.target === "workers" && role === "workers") return true;
      return false;
    });
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
      transactions,
      disputes,
      announcements,
      dismissedAnnouncementIds,
      login: authStore.login,
      register: authStore.register,
      logout: authStore.logout,
      createBooking,
      updateBookingStatus,
      updateWorkerProfile,
      verifyWorker,
      suspendWorker,
      unsuspendWorker,
      approveDocument,
      rejectDocument,
      fileDispute,
      resolveDispute,
      postAnnouncement,
      dismissAnnouncement,
      getWorkerById: (workerId: string) => workers.find((worker) => worker.id === workerId),
      getBookingsByStatus: (status: BookingStatus) => bookings.filter((booking) => booking.status === status),
      getActiveAnnouncements,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookings, clientBookings, topWorkers, transactions, disputes, announcements, dismissedAnnouncementIds, user, workerBookings, workers],
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
