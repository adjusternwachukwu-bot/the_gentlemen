import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminRevenue() {
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

  const starterMRR = (starterCount || 0) * 99;
  const memberMRR = (memberCount || 0) * 179;
  const gentlemanMRR = (gentlemanCount || 0) * 299;
  const totalMRR = starterMRR + memberMRR + gentlemanMRR;

  return (
    <div className="min-h-screen bg-navy-deep">
      <header className="border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="font-accent text-gold tracking-wider">The Gentlemen — Admin</p>
          <nav className="flex gap-6">
            <a href="/admin" className="font-body text-sm text-grey-muted hover:text-white">Dashboard</a>
            <a href="/admin/members" className="font-body text-sm text-grey-muted hover:text-white">Members</a>
            <a href="/admin/revenue" className="font-body text-sm text-gold">Revenue</a>
            <a href="/dashboard" className="font-body text-sm text-grey-muted hover:text-white">Back to Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="font-display text-4xl text-white mb-8">Revenue</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-8 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Monthly Recurring Revenue</p>
            <p className="font-display text-5xl text-gold">${totalMRR}</p>
            <p className="font-body text-sm text-grey-muted mt-4">per month</p>
          </div>

          <div className="p-8 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Annual Run Rate</p>
            <p className="font-display text-5xl text-white">${totalMRR * 12}</p>
            <p className="font-body text-sm text-grey-muted mt-4">projected</p>
          </div>
        </div>

        <h2 className="font-display text-2xl text-white mb-4">Revenue by Tier</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Starter ($99/mo)</p>
            <p className="font-display text-3xl text-white">{starterCount || 0} members</p>
            <p className="font-body text-gold mt-2">${starterMRR}/mo</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Member ($179/mo)</p>
            <p className="font-display text-3xl text-white">{memberCount || 0} members</p>
            <p className="font-body text-gold mt-2">${memberMRR}/mo</p>
          </div>

          <div className="p-6 border border-white/10 bg-grey-warm/20">
            <p className="font-body text-sm text-grey-muted mb-2">Gentleman ($299/mo)</p>
            <p className="font-display text-3xl text-white">{gentlemanCount || 0} members</p>
            <p className="font-body text-gold mt-2">${gentlemanMRR}/mo</p>
          </div>
        </div>
      </main>
    </div>
  );
}