import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminMembers() {
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

  const { data: members } = await supabase
    .from("profiles")
    .select("*, intake_responses(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-navy-deep">
      <header className="border-b border-white/10 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="font-accent text-gold tracking-wider">The Gentlemen — Admin</p>
          <nav className="flex gap-6">
            <a href="/admin" className="font-body text-sm text-grey-muted hover:text-white">Dashboard</a>
            <a href="/admin/members" className="font-body text-sm text-gold">Members</a>
            <a href="/admin/revenue" className="font-body text-sm text-grey-muted hover:text-white">Revenue</a>
            <a href="/dashboard" className="font-body text-sm text-grey-muted hover:text-white">Back to Dashboard</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <h1 className="font-display text-4xl text-white mb-8">Members</h1>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-body text-sm text-grey-muted py-3 pr-4">Member</th>
                <th className="text-left font-body text-sm text-grey-muted py-3 pr-4">Tier</th>
                <th className="text-left font-body text-sm text-grey-muted py-3 pr-4">Joined</th>
                <th className="text-left font-body text-sm text-grey-muted py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((member) => (
                <tr key={member.id} className="border-b border-white/5">
                  <td className="py-4 pr-4">
                    <p className="font-body text-white">{member.full_name || "—"}</p>
                  </td>
                  <td className="py-4 pr-4">
                    <span className="inline-block px-3 py-1 bg-gold/20 text-gold font-body text-xs uppercase">
                      {member.tier || "starter"}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <p className="font-body text-grey-muted text-sm">
                      {new Date(member.created_at).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4">
                    <button className="font-body text-sm text-gold hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!members || members.length === 0) && (
          <div className="p-8 border border-white/10 bg-grey-warm/20 text-center">
            <p className="font-body text-grey-muted">No members yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}