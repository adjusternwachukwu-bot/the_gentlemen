"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

let supabase: ReturnType<typeof createClient> | null = null;

const getSupabase = () => {
  if (!supabase && typeof window !== "undefined") {
    supabase = createClient(
      (window as unknown as { env: { NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY: string } }).env?.NEXT_PUBLIC_SUPABASE_URL || "",
      (window as unknown as { env: { NEXT_PUBLIC_SUPABASE_URL: string; NEXT_PUBLIC_SUPABASE_ANON_KEY: string } }).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
  }
  return supabase;
};

type Appointment = {
  id: string;
  provider_name: string;
  scheduled_at: string;
  status: string;
  video_link: string;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      const sb = getSupabase();
      if (!sb) return;

      const { data } = await sb.from("appointments").select("*").order("scheduled_at", { ascending: true });
      setAppointments(data || []);
      setLoading(false);
    }

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-deep p-6 flex items-center justify-center">
        <p className="font-body text-grey-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl text-white mb-8">Appointments</h1>

        {appointments.length === 0 ? (
          <div className="p-8 border border-white/10 bg-grey-warm/20 text-center">
            <p className="font-body text-grey-muted">No appointments yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-6 border border-white/10 bg-grey-warm/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-display text-xl text-white">{apt.provider_name}</p>
                    <p className="font-body text-sm text-grey-muted mt-1">
                      {new Date(apt.scheduled_at).toLocaleString()}
                    </p>
                    <p className="font-body text-sm text-gold mt-2 capitalize">{apt.status}</p>
                  </div>
                  {apt.video_link && apt.status === "confirmed" && (
                    <a
                      href={apt.video_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light"
                    >
                      Join Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}