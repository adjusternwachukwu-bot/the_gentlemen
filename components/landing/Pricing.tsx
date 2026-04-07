"use client";

import { useState } from "react";

const tiers = [
  {
    name: "The Starter",
    tier: "starter",
    price: "99",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_STARTER_VARIANT_ID || "starter-variant-id",
    features: [
      "AI intake assessment",
      "1 provider consultation/mo",
      "Messaging between visits",
      "Mood + performance tracking",
    ],
    highlighted: false,
  },
  {
    name: "The Member",
    tier: "member",
    price: "179",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_MEMBER_VARIANT_ID || "member-variant-id",
    features: [
      "Everything in Starter",
      "2 consultations/mo",
      "Medication management",
      "Priority booking",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    name: "The Gentleman",
    tier: "gentleman",
    price: "299",
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_GENTLEMAN_VARIANT_ID || "gentleman-variant-id",
    features: [
      "Everything in Member",
      "Unlimited messaging",
      "Weekly AI check-ins",
      "Performance dashboard",
      "Priority everything",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tier: typeof tiers[0]) => {
    setLoading(tier.tier);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: tier.variantId,
          email: "",
          tier: tier.tier,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        window.location.href = "/signup";
      }
    } catch {
      window.location.href = "/signup";
    }

    setLoading(null);
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