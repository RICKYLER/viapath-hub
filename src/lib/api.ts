import { supabase } from "./supabase";
import { workers as mockWorkers } from "@/data/workers";
import type { WorkerProfile, Booking } from "@/context/types";

// This simulates an API call and gracefully falls back to mock data
// if Supabase is not properly configured yet.

export async function fetchWorkers(): Promise<WorkerProfile[]> {
  try {
    const { data, error } = await supabase.from("workers").select("*, users(full_name, avatar_url)");
    if (error) throw error;
    if (!data || data.length === 0) return mockWorkers; // Fallback if DB is empty
    
    // Map DB data to Frontend Type
    return data.map((d: any) => ({
      id: d.id,
      name: d.users?.full_name || "Unknown Worker",
      service: d.category,
      rating: d.rating || 0,
      location: d.location_geohash || "Unknown Location",
      about: d.bio || "",
      image: d.users?.avatar_url || "",
      skills: [], 
      verified: true,
      completedJobs: d.review_count || 0,
      responseTime: "Usually replies in an hour",
      lat: d.location_lat || 7.4478,
      lng: d.location_lng || 125.8094,
    }));
  } catch (err) {
    console.warn("Supabase fetch failed, falling back to mock data:", err);
    return mockWorkers;
  }
}

export async function createBookingDb(booking: Booking) {
  try {
    const { error } = await (supabase.from("jobs") as any).insert([{
      id: booking.id,
      client_id: booking.clientId,
      worker_id: booking.workerId,
      status: booking.status,
      description: booking.note,
      scheduled_for: booking.date,
      price: 0,
    }]);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Supabase insert failed, using local context state only:", err);
    return false;
  }
}
