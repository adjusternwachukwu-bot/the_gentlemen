export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-navy-deep">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-grey-warm via-navy-deep to-black opacity-50" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="font-accent text-gold text-lg tracking-[0.3em] uppercase mb-6 opacity-0 animate-fade-in">
          The Gentlemen Co.
        </p>
        
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 opacity-0 animate-fade-in animate-delay-100">
          The strongest thing you<br />
          <span className="gold-shimmer">can do is ask for help.</span>
        </h1>
        
        <p className="font-body text-xl md:text-2xl text-grey-muted max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in animate-delay-200">
          Built for men who perform. Premium access to licensed providers through white-label telehealth. Because your mind is your greatest asset.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in animate-delay-300">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center px-8 py-4 bg-gold text-black font-accent text-lg tracking-wider uppercase rounded-none transition-all duration-300 hover:bg-gold-light hover:scale-105"
          >
            Get Your Edge
          </a>
          
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-accent text-lg tracking-wider uppercase rounded-none transition-all duration-300 hover:border-gold hover:text-gold"
          >
            See How It Works
          </a>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in animate-delay-500">
          <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}