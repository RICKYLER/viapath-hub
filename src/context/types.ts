export type UserRole = "client" | "worker" | "admin";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location: string;
  workerId?: string;
}

export interface DocumentReview {
  type: "id" | "police" | "barangay";
  status: "pending" | "approved" | "rejected";
  rejectionNote?: string;
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
  isIdVerified: boolean;
  hasPoliceClearance: boolean;
  hasBarangayClearance: boolean;
  certifications: string[];
  barangay: string;
  completedJobs: number;
  responseTime: string;
  lat: number;
  lng: number;
  acceptingBookings?: boolean;
  suspended?: boolean;
  documentReviews?: DocumentReview[];
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
  isEscrowed?: boolean;
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

export type DisputeResolution = "refund" | "warn" | "dismiss";
export type DisputeStatus = "open" | "resolved" | "dismissed";

export interface Dispute {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  workerName: string;
  service: string;
  complaint: string;
  workerResponse?: string;
  status: DisputeStatus;
  resolution?: DisputeResolution;
  createdAt: string;
}

export type AnnouncementTarget = "all" | "clients" | "workers";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  target: AnnouncementTarget;
  expiresAt?: string;
  createdAt: string;
}
