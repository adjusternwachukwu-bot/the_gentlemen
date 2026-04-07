import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { count: totalMembers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: starterCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("tier", "starter");

  const { count: memberCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("tier", "member");

  const { count: gentlemanCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("tier", "gentleman");

  const { data: newSignups } = await supabase
    .from("profiles")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  const mrr = (memberCount || 0) * 179 + (gentlemanCount || 0) * 299;

  return (
    <div className="min-h-screen bg-navy-deep">
      <header className="border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="font-accent text-gold tracking-wider">The Gentlemen — Admin</p>
          <nav className="flex gap-6">
            <a href="/admin" className="font-body text-sm text-gold">Dashboard</a>
            <a href="/admin/members" className="font-body text-sm text-grey-muted hover:text-white">Members</a>
            <a href="/admin/revenue" className="font-body text-sm text-grey-muted hover:text-white">Revenue</a>
            <a href="/dashboard" className="font-body text-sm text-grey-muted hover:text-white">Back to Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="font-display text-4xl text-white mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Total Members</p>
            <p className="font-display text-4xl text-white">{totalMembers || 0}</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">MRR</p>
            <p className="font-display text-4xl text-gold">${mrr}</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">New Today</p>
            <p className="font-display text-4xl text-white">{newSignups?.length || 0}</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Churn Rate</p>
            <p className="font-display text-4xl text-white">0%</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Starter</p>
            <p className="font-display text-3xl text-white">{starterCount || 0}</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Member</p>
            <p className="font-display text-3xl text-white">{memberCount || 0}</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Gentleman</p>
            <p className="font-display text-3xl text-white">{gentlemanCount || 0}</p>
          </div>
        </div>
      </main>
    </div>
  );
}