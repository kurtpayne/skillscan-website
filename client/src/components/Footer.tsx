/* ============================================================
   FOOTER — SkillScan Deep Navy Design System
   ============================================================ */
import { Shield, Github, ExternalLink } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer
      className="section-divider mt-24"
      style={{ background: "oklch(0.10 0.022 265 / 0.8)" }}
    >
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "oklch(0.58 0.22 290)",
                  boxShadow: "0 0 12px oklch(0.58 0.22 290 / 0.3)",
                }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
              >
                SkillScan
              </span>
            </div>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif" }}
            >
              Offline static analysis for AI agent skill files. Open-source. Enterprise-grade. Zero network calls.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com/kurtpayne/skillscan-security"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                style={{ color: "oklch(0.55 0.015 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.015 265)")}
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://pypi.org/project/skillscan-security/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                style={{ color: "oklch(0.55 0.015 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.015 265)")}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                PyPI
              </a>
              <a
                href="https://hub.docker.com/r/kurtpayne/skillscan-security"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm transition-colors duration-200"
                style={{ color: "oklch(0.55 0.015 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.015 265)")}
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Docker Hub
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Tools
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "🔍 Scan", href: "/", desc: "Static analysis" },
                { label: "📐 Lint", href: "/lint", desc: "Quality linting" },
                { label: "🔬 Trace", href: "/trace", desc: "Behavioural tracing" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm transition-colors duration-200 flex items-center gap-1.5"
                    style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.015 265)")}
                  >
                    {item.label}
                    <span className="text-xs" style={{ color: "oklch(0.40 0.010 265)" }}>— {item.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Product
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Rules Catalog", href: "/rules" },
                { label: "Documentation", href: "/docs" },
                { label: "ML Model", href: "/model" },
                { label: "Blog", href: "/blog" },
                { label: "Changelog", href: "https://github.com/kurtpayne/skillscan-security/blob/main/PATTERN_UPDATES.md", external: true },
              ].map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.015 265)")}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4
              className="text-sm font-semibold mb-4 uppercase tracking-wider"
              style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Resources
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Contributing", href: "https://github.com/kurtpayne/skillscan-security/blob/main/CONTRIBUTING.md" },
                { label: "Detection Model", href: "https://github.com/kurtpayne/skillscan-security/blob/main/docs/DETECTION_MODEL.md" },
                { label: "Architecture", href: "https://github.com/kurtpayne/skillscan-security/blob/main/docs/ARCHITECTURE.md" },
                { label: "Report a False Positive", href: "https://github.com/kurtpayne/skillscan-security/issues/new?template=false-positive.md" },
                { label: "Report a Missed Attack", href: "https://github.com/kurtpayne/skillscan-security/issues/new?template=false-negative.md" },
                { label: "Report an Issue", href: "https://github.com/kurtpayne/skillscan-security/issues/new/choose" },
                { label: "Submit Corpus Sample", href: "https://github.com/kurtpayne/skillscan-security/issues/new?template=corpus-submission.md" },
                { label: "Open Issues", href: "https://github.com/kurtpayne/skillscan-security/issues" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.015 265)")}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid oklch(0.58 0.22 290 / 0.10)" }}
        >
          <p
            className="text-xs"
            style={{ color: "oklch(0.45 0.012 265)", fontFamily: "'Inter', sans-serif" }}
          >
            © 2026 SkillScan. Open source under the MIT License.
          </p>
          <p
            className="text-xs"
            style={{ color: "oklch(0.45 0.012 265)", fontFamily: "'Inter', sans-serif" }}
          >
            Built for the security community. No telemetry. No tracking.
          </p>
        </div>
      </div>
    </footer>
  );
}
