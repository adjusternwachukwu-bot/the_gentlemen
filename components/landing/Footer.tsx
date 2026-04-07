const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="py-12 bg-navy-deep border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="font-accent text-white tracking-wider">The Gentlemen Co.</p>
            <p className="font-body text-sm text-grey-muted mt-1">
              Built for men who perform.
            </p>
          </div>

          <nav className="flex gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-body text-sm text-grey-muted hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="font-body text-xs text-grey-muted">
            &copy; {new Date().getFullYear()} The Gentlemen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}