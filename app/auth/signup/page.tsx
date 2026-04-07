"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth";
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

    const { data, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else if (data.user) {
      router.push("/onboarding");
    } else {
      setError("Check your email to verify your account.");
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
          <h1 className="font-display text-3xl text-white mt-4">Create Your Account</h1>
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
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center font-body text-sm text-grey-muted mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-gold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}