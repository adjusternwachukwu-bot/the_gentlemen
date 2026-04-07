import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("tier")
    .eq("id", user.id)
    .single();

  const { data: lastCheckIn } = await supabase
    .from("check_ins")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .single();

  const daysSinceCheckIn = lastCheckIn
    ? Math.floor((Date.now() - new Date(lastCheckIn.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-navy-deep">
      <header className="border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="font-accent text-gold tracking-wider">The Gentlemen</p>
          <a href="/api/auth/signout" className="font-body text-sm text-grey-muted hover:text-white">
            Sign Out
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="font-display text-4xl text-white mb-8">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Your Tier</p>
            <p className="font-display text-2xl text-gold capitalize">{profile?.tier || "Starter"}</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Days Since Check-in</p>
            <p className="font-display text-2xl text-white">
              {daysSinceCheckIn !== null ? daysSinceCheckIn : "--"}
            </p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Status</p>
            <p className="font-display text-2xl text-gold">Active</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="/dashboard/checkin" className="block p-8 border border-white/10 bg-grey-warm/20 hover:border-gold transition-colors">
            <p className="font-display text-2xl text-white mb-2">Weekly Check-in</p>
            <p className="font-body text-sm text-grey-muted">Track your performance</p>
          </a>

          <a href="/dashboard/appointments" className="block p-8 border border-white/10 bg-grey-warm/20 hover:border-gold transition-colors">
            <p className="font-display text-2xl text-white mb-2">Appointments</p>
            <p className="font-body text-sm text-grey-muted">View upcoming calls</p>
          </a>

          <a href="/dashboard/messages" className="block p-8 border border-white/10 bg-grey-warm/20 hover:border-gold transition-colors">
            <p className="font-display text-2xl text-white mb-2">Messages</p>
            <p className="font-body text-sm text-grey-muted">Chat with your provider</p>
          </a>

          <a href="/dashboard/track" className="block p-8 border border-white/10 bg-grey-warm/20 hover:border-gold transition-colors">
            <p className="font-display text-2xl text-white mb-2">Performance History</p>
            <p className="font-body text-sm text-grey-muted">See your progress</p>
          </a>
        </div>
      </main>
    </div>
  );
}