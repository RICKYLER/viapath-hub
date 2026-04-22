export type UserRole = "client" | "worker";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  workerId?: string;
}

export interface WorkerProfile {
  id: string;
  name: string;
  service: string;
  rating: number;
  location: string;
  about: string;
  image: string;
  skills: string[];
  verified: boolean;
  completedJobs: number;
  responseTime: string;
  lat: number;
  lng: number;
}

export type BookingStatus = "pending" | "accepted" | "completed" | "cancelled";

export interface BookingStatusHistoryItem {
  status: BookingStatus;
  changedAt: string;
}

export interface Booking {
  id: string;
  workerId: string;
  clientId: string;
  clientName: string;
  workerName: string;
  service: string;
  date: string;
  location: string;
  note: string;
  status: BookingStatus;
  statusHistory: BookingStatusHistoryItem[];
  price?: number;
  lat?: number;
  lng?: number;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "refunded";
  type: "payment" | "payout";
  counterpartName: string;
}
