"use client";

import { useState } from "react";

const tiers = [
  {
    name: "The Starter",
    tier: "starter",
    price: "99",
    checkoutUrl: "https://gentlemen.lemonsqueezy.com/checkout/buy/79beeee6-9b81-4dc2-bb97-492b6da637e5",
    features: [
      "AI intake assessment",
      "1 session/mo",
      "Direct messaging",
      "Performance tracking",
    ],
    highlighted: false,
  },
  {
    name: "The Member",
    tier: "member",
    price: "179",
    checkoutUrl: "https://gentlemen.lemonsqueezy.com/checkout/buy/b983d2d8-9dca-467b-a94c-f04cc38cf5a3",
    features: [
      "Everything in Starter",
      "2 sessions/mo",
      "Priority support",
      "Priority booking",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "The Gentleman",
    tier: "gentleman",
    price: "299",
    checkoutUrl: "https://gentlemen.lemonsqueezy.com/checkout/buy/79beeee6-9b81-4dc2-bb97-492b6da637e5",
    features: [
      "Everything in Member",
      "Unlimited messaging",
      "Weekly check-ins",
      "Performance dashboard",
      "Priority everything",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: typeof tiers[0]) => {
    if (tier.checkoutUrl) {
      window.location.href = tier.checkoutUrl;
    } else {
      window.location.href = "/signup";
    }
  };

  return (
    <section id="pricing" className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4">
            Pricing
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white">
            Invest in your performance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 border ${
                tier.highlighted
                  ? "border-gold bg-grey-warm/50"
                  : "border-white/10 bg-grey-warm/20"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-black font-accent text-xs tracking-wider uppercase">
                  {tier.badge}
                </div>
              )}
              
              <h3 className="font-display text-2xl text-white mb-2">{tier.name}</h3>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="font-display text-5xl text-white">${tier.price}</span>
                <span className="font-body text-grey-muted">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="font-body text-grey-muted text-sm">
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(tier)}
                disabled={loading === tier.tier}
                className={`w-full block text-center py-4 font-accent text-sm tracking-wider uppercase transition-colors ${
                  tier.highlighted
                    ? "bg-gold text-black hover:bg-gold-light"
                    : "border border-white/20 text-white hover:border-gold hover:text-gold"
                } disabled:opacity-50`}
              >
                {loading === tier.tier ? "Loading..." : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}