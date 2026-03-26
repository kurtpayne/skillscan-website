/* ============================================================
   NAVBAR — SkillScan Deep Navy Design System
   Transparent with blur backdrop, violet accent on active links
   ============================================================ */
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rules", label: "Rules" },
  { href: "/docs", label: "Docs" },
  { href: "/model", label: "Model" },
  { href: "/linter", label: "Linter" },
  { href: "/updates", label: "Updates" },
  { href: "/feed", label: "Feed" },
  { href: "https://github.com/kurtpayne/skillscan-security", label: "GitHub", external: true },
];

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "oklch(0.12 0.025 265 / 0.92)"
          : "oklch(0.12 0.025 265 / 0.60)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid oklch(0.58 0.22 290 / 0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: "oklch(0.58 0.22 290)",
                boxShadow: "0 0 16px oklch(0.58 0.22 290 / 0.4)",
              }}
            >
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              SkillScan
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = !link.external && location === link.href;
              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                    style={{
                      color: "oklch(0.70 0.015 265)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = "oklch(0.95 0.005 265)";
                      (e.target as HTMLElement).style.background = "oklch(0.20 0.025 265)";
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = "oklch(0.70 0.015 265)";
                      (e.target as HTMLElement).style.background = "transparent";
                    }}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive ? "oklch(0.78 0.18 290)" : "oklch(0.70 0.015 265)",
                    background: isActive ? "oklch(0.58 0.22 290 / 0.12)" : "transparent",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://pypi.org/project/skillscan-security/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 btn-primary-glow"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              pip install
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-md"
            style={{ color: "oklch(0.70 0.015 265)" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden py-4 border-t"
            style={{ borderColor: "oklch(0.58 0.22 290 / 0.15)" }}
          >
            {navLinks.map((link) => {
              if (link.external) {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-3 text-sm font-medium"
                    style={{ color: "oklch(0.70 0.015 265)", fontFamily: "'Inter', sans-serif" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium"
                  style={{ color: "oklch(0.70 0.015 265)", fontFamily: "'Inter', sans-serif" }}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="px-4 pt-3">
              <a
                href="https://pypi.org/project/skillscan-security/"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-4 py-2 rounded-md text-sm font-semibold btn-primary-glow"
              >
                pip install
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
