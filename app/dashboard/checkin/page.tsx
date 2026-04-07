"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function CheckIn() {
  const router = useRouter();
  const [mood, setMood] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [focus, setFocus] = useState(0);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!mood || !energy || !focus) return;

    setLoading(true);
    const sb = getSupabase();
    if (!sb) return;

    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    await sb.from("check_ins").insert({
      user_id: user.id,
      mood,
      energy,
      focus,
      notes,
    } as unknown as never);

    router.push("/dashboard");
    setLoading(false);
  };

  if (mood && energy && focus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep p-6">
        <div className="w-full max-w-md text-center">
          <p className="font-display text-3xl text-gold mb-4">Thank you.</p>
          <p className="font-body text-grey-muted mb-8">
            Your performance doctor will review this within 24 hours.
          </p>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-4 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light disabled:opacity-50"
          >
            {loading ? "Saving..." : "Complete"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep p-6">
      <div className="w-full max-w-2xl">
        <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase text-center mb-8">
          Weekly Check-in
        </p>

        <div className="space-y-12">
          <div>
            <p className="font-display text-2xl text-white text-center mb-4">
              How&apos;s your mood?
            </p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setMood(num)}
                  className={`w-14 h-14 font-display text-xl border transition-colors ${
                    mood === num
                      ? "border-gold bg-gold text-black"
                      : "border-white/20 text-white hover:border-gold"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-2xl text-white text-center mb-4">
              Energy level?
            </p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setEnergy(num)}
                  className={`w-14 h-14 font-display text-xl border transition-colors ${
                    energy === num
                      ? "border-gold bg-gold text-black"
                      : "border-white/20 text-white hover:border-gold"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-display text-2xl text-white text-center mb-4">
              Focus?
            </p>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setFocus(num)}
                  className={`w-14 h-14 font-display text-xl border transition-colors ${
                    focus === num
                      ? "border-gold bg-gold text-black"
                      : "border-white/20 text-white hover:border-gold"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes (optional)..."
              className="w-full px-6 py-4 bg-grey-warm border border-white/20 text-white font-body focus:outline-none focus:border-gold resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}