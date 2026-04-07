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

type CheckIn = {
  id: string;
  mood: number;
  energy: number;
  focus: number;
  created_at: string;
};

export default function TrackPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCheckIns() {
      const sb = getSupabase();
      if (!sb) return;

      const { data } = await sb
        .from("check_ins")
        .select("*")
        .order("created_at", { ascending: false });

      setCheckIns(data || []);
      setLoading(false);
    }

    fetchCheckIns();
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
        <h1 className="font-display text-3xl text-white mb-8">Performance History</h1>

        {checkIns.length === 0 ? (
          <div className="p-8 border border-white/10 bg-grey-warm/20 text-center">
            <p className="font-body text-grey-muted">No check-ins yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {checkIns.map((checkIn) => (
              <div key={checkIn.id} className="p-6 border border-white/10 bg-grey-warm/20">
                <div className="flex justify-between items-center mb-4">
                  <p className="font-body text-sm text-grey-muted">
                    {new Date(checkIn.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-body text-xs text-grey-muted mb-1">Mood</p>
                    <p className="font-display text-2xl text-gold">{checkIn.mood}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-grey-muted mb-1">Energy</p>
                    <p className="font-display text-2xl text-gold">{checkIn.energy}</p>
                  </div>
                  <div>
                    <p className="font-body text-xs text-grey-muted mb-1">Focus</p>
                    <p className="font-display text-2xl text-gold">{checkIn.focus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}