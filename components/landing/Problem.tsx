export function Problem() {
  const stats = [
    { number: "122M+", label: "Americans in mental health deserts" },
    { number: "4x", label: "More likely to die by suicide" },
    { number: "0", label: "Brands built for men. Until now." },
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4">
            The Problem
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white">
            Men are falling behind.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-8 border border-white/10 bg-grey-warm/30"
            >
              <p className="font-display text-5xl md:text-6xl gold-shimmer mb-4">
                {stat.number}
              </p>
              <p className="font-body text-grey-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}