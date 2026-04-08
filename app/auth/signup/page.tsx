"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        router.push("/onboarding");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep">
      <div className="w-full max-w-md p-8 border border-white/10 bg-grey-warm/20">
        <div className="text-center mb-8">
          <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase">
            The Gents
          </p>
          <h1 className="font-display text-3xl text-white mt-4">Join the List</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-body text-sm text-grey-muted mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-grey-warm border border-white/20 text-white font-body focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block font-body text-sm text-grey-muted mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-grey-warm border border-white/20 text-white font-body focus:outline-none focus:border-gold"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light disabled:opacity-50"
          >
            {loading ? "Processing..." : "Join"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-grey-muted mt-6">
          Already a member?{" "}
          <a href="/login" className="text-gold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}