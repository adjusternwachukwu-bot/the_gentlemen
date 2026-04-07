"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-deep">
      <div className="w-full max-w-md p-8 border border-white/10 bg-grey-warm/20">
        <div className="text-center mb-8">
          <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase">
            The Gentlemen
          </p>
          <h1 className="font-display text-3xl text-white mt-4">Welcome Back</h1>
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-grey-muted mt-6">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-gold hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}