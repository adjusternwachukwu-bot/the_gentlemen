const steps = [
  {
    number: "01",
    title: "Tell us where you are",
    description: "Quick intake. We'll handle the rest.",
  },
  {
    number: "02",
    title: "Meet your edge specialist",
    description: "One-on-one with someone who gets it. No judgment.",
  },
  {
    number: "03",
    title: "Reclaim your edge",
    description: "Stay locked in. We keep you sharp.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-navy-deep">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-accent text-gold text-sm tracking-[0.3em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white">
            Three steps to your edge.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative p-8">
              <div className="absolute top-0 left-0 font-display text-6xl text-white/5">
                {step.number}
              </div>
              <div className="relative">
                <h3 className="font-display text-2xl text-gold mb-4">{step.title}</h3>
                <p className="font-body text-grey-muted">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}