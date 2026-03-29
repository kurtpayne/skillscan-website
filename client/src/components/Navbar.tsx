/* ============================================================
   NAVBAR — SkillScan Deep Navy Design System
   Suite-aware nav: Tools dropdown (Scan · Lint · Trace),
   Resources group, transparent with blur backdrop.
   ============================================================ */
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield, ChevronDown, ScanSearch, FileCode2, Activity } from "lucide-react";

const tools = [
  {
    href: "/",
    label: "Scan",
    icon: ScanSearch,
    desc: "Static analysis — 140+ rules",
    color: "oklch(0.58 0.22 290)",
  },
  {
    href: "/lint",
    label: "Lint",
    icon: FileCode2,
    desc: "Quality & style checks",
    color: "oklch(0.70 0.15 160)",
  },
  {
    href: "/trace",
    label: "Trace",
    icon: Activity,
    desc: "Live behavioural tracing",
    color: "oklch(0.72 0.19 45)",
  },
];

const navLinks = [
  { href: "/rules", label: "Rules" },
  { href: "/docs", label: "Docs" },
  { href: "/updates", label: "Updates" },
  { href: "/feed", label: "Feed" },
  { href: "/blog/skills-security-model", label: "Blog" },
  { href: "https://github.com/kurtpayne/skillscan-security", label: "GitHub", external: true },
];

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isToolActive = tools.some((t) => t.href === location);

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
            {/* Tools dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setToolsOpen((o) => !o)}
                className="flex items-center gap-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  color: isToolActive ? "oklch(0.78 0.18 290)" : "oklch(0.70 0.015 265)",
                  background: isToolActive ? "oklch(0.58 0.22 290 / 0.12)" : "transparent",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!isToolActive) (e.currentTarget as HTMLElement).style.color = "oklch(0.95 0.005 265)";
                }}
                onMouseLeave={(e) => {
                  if (!isToolActive) (e.currentTarget as HTMLElement).style.color = "oklch(0.70 0.015 265)";
                }}
              >
                Tools
                <ChevronDown
                  className="w-3.5 h-3.5 transition-transform duration-200"
                  style={{ transform: toolsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {toolsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-64 rounded-xl overflow-hidden py-2"
                  style={{
                    background: "oklch(0.14 0.025 265)",
                    border: "1px solid oklch(0.58 0.22 290 / 0.20)",
                    boxShadow: "0 16px 40px oklch(0.05 0.02 265 / 0.8)",
                  }}
                >
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    const active = location === tool.href;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 transition-all duration-150"
                        style={{
                          background: active ? "oklch(0.58 0.22 290 / 0.10)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) (e.currentTarget as HTMLElement).style.background = "oklch(0.18 0.025 265)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${tool.color} / 0.15`, border: `1px solid ${tool.color} / 0.25` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: tool.color }} />
                        </div>
                        <div>
                          <div
                            className="text-sm font-semibold"
                            style={{ color: active ? "oklch(0.78 0.18 290)" : "oklch(0.90 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {tool.label}
                          </div>
                          <div className="text-xs" style={{ color: "oklch(0.52 0.015 265)" }}>{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Regular links */}
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
            {/* Tools section */}
            <div className="px-4 pb-2">
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "oklch(0.50 0.015 265)" }}>Tools</p>
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-3 py-2.5 text-sm font-medium"
                    style={{ color: location === tool.href ? "oklch(0.78 0.18 290)" : "oklch(0.70 0.015 265)", fontFamily: "'Inter', sans-serif" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4" style={{ color: tool.color }} />
                    {tool.label}
                    <span className="text-xs ml-auto" style={{ color: "oklch(0.45 0.012 265)" }}>{tool.desc}</span>
                  </Link>
                );
              })}
            </div>
            <div className="border-t my-2" style={{ borderColor: "oklch(0.58 0.22 290 / 0.10)" }} />
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
