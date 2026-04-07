export function SocialProof() {
  const trustBadges = [
    "HIPAA Compliant",
    "50-State Coverage",
    "256-bit Encryption",
  ];

  return (
    <section className="py-24 bg-navy-deep">
      <div className="max-w-6xl mx-auto px-6">
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {trustBadges.map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-grey-muted">
              <svg
                className="w-5 h-5 text-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-body text-sm">{badge}</span>
            </div>
          ))}
        </div>

        {/* Testimonial placeholder */}
        <div className="max-w-3xl mx-auto text-center p-12 border border-white/10 bg-grey-warm/20">
          <p className="font-display text-2xl text-white italic mb-6">
            &ldquo;I thought asking for help was a sign of weakness. The Gentlemen showed me it was the opposite.&rdquo;
          </p>
          <p className="font-body text-grey-muted">— J.M., Member since 2024</p>
        </div>
      </div>
    </section>
  );
}