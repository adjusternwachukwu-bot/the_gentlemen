"use client";

import { useState } from "react";

export function FinalCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-24 bg-black">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4">
          Final Call
        </p>
        
        <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
          Gentlemen. It&apos;s time.
        </h2>
        
        <p className="font-body text-xl text-grey-muted mb-12">
          Your edge is waiting. Join the waitlist or sign up now.
        </p>

        {submitted ? (
          <div className="p-6 border border-gold bg-gold/10">
            <p className="font-body text-gold">You&apos;re in. We&apos;ll be in touch.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-4 bg-grey-warm border border-white/20 text-white font-body placeholder:text-grey-muted focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-gold text-black font-accent text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
            >
              Join
            </button>
          </form>
        )}
      </div>
    </section>
  );
}