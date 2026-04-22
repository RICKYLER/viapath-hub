import { createClient } from "@supabase/supabase-js";

// Database Types for ViaPathHub
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          created_at: string;
          role: "client" | "worker" | "admin";
          full_name: string;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          role?: "client" | "worker" | "admin";
          full_name: string;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          role?: "client" | "worker" | "admin";
          full_name?: string;
          avatar_url?: string | null;
        };
      };
      workers: {
        Row: {
          id: string; // references users.id
          title: string;
          category: string;
          rating: number;
          review_count: number;
          hourly_rate: number;
          bio: string;
          location_lat: number | null;
          location_lng: number | null;
          location_geohash: string | null;
        };
        Insert: {
          id: string;
          title: string;
          category: string;
          rating?: number;
          review_count?: number;
          hourly_rate: number;
          bio: string;
          location_lat?: number | null;
          location_lng?: number | null;
          location_geohash?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          rating?: number;
          review_count?: number;
          hourly_rate?: number;
          bio?: string;
          location_lat?: number | null;
          location_lng?: number | null;
          location_geohash?: string | null;
        };
      };
      jobs: {
        Row: {
          id: string;
          created_at: string;
          client_id: string; // references users.id
          worker_id: string; // references workers.id
          status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
          description: string;
          scheduled_for: string;
          price: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id: string;
          worker_id: string;
          status?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
          description: string;
          scheduled_for: string;
          price: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          client_id?: string;
          worker_id?: string;
          status?: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
          description?: string;
          scheduled_for?: string;
          price?: number;
        };
      };
      reviews: {
        Row: {
          id: string;
          created_at: string;
          job_id: string; // references jobs.id
          reviewer_id: string; // references users.id
          worker_id: string; // references workers.id
          rating: number; // 1-5
          comment: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          job_id: string;
          reviewer_id: string;
          worker_id: string;
          rating: number;
          comment?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          job_id?: string;
          reviewer_id?: string;
          worker_id?: string;
          rating?: number;
          comment?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          created_at: string;
          job_id: string | null;
          sender_id: string; // references users.id
          receiver_id: string; // references users.id
          content: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          job_id?: string | null;
          sender_id: string;
          receiver_id: string;
          content: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          job_id?: string | null;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          read?: boolean;
        };
      };
    };
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
  console.warn("⚠️ Supabase credentials are missing or invalid. Database features will not work.");
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://your-project.supabase.co", 
  supabaseAnonKey || "your-anon-key"
);
