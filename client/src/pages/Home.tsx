/* ============================================================
   HOME PAGE — SkillScan Deep Navy Design System
   Sections: Hero, Stats Bar, Features, How It Works,
             Rule Categories, GitHub Actions CTA, Final CTA
   ============================================================ */
import { useState, useEffect } from "react";
import { Shield, Zap, Lock, GitBranch, Terminal, ChevronRight, Copy, Check, ExternalLink, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TerminalScan from "@/components/TerminalScan";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663340703543/GpzBjr25jP63Hgax7fEfrw/hero-bg_24844349.png";

const INSTALL_CMD = "pip install skillscan-security";
const SCAN_CMD = "skillscan scan ./skills/ --format sarif -o results.sarif";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded transition-all duration-200"
      style={{ color: "oklch(0.60 0.015 265)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.60 0.015 265)")}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

const features = [
  {
    icon: Lock,
    title: "Offline-First",
    description: "All analysis runs locally. No skill file ever leaves your machine. Complete data privacy for sensitive enterprise configurations.",
    color: "oklch(0.58 0.22 290)",
  },
  {
    icon: Shield,
    title: "100+ Detection Rules",
    description: "Covers MCP tool poisoning, prompt injection, credential exfiltration, container escape, social engineering chains, and more.",
    color: "oklch(0.72 0.19 45)",
  },
  {
    icon: GitBranch,
    title: "SARIF + JUnit Output",
    description: "Standardized output formats integrate directly with GitHub Security tab, Jenkins, SonarQube, and any SARIF-compatible tool.",
    color: "oklch(0.65 0.18 200)",
  },
  {
    icon: Zap,
    title: "CI/CD Native",
    description: "Drop-in reusable GitHub Actions workflow. Scan on every PR. Block merges on critical findings. Zero configuration required.",
    color: "oklch(0.70 0.15 160)",
  },
  {
    icon: Terminal,
    title: "Pattern Updates",
    description: "Automated twice-daily threat intel updates. New attack patterns land as PRs, reviewed before merge. Always current.",
    color: "oklch(0.60 0.20 320)",
  },
  {
    icon: AlertTriangle,
    title: "Chain Detection",
    description: "Multi-signal chain rules catch compound attacks — MCP poisoning + credential access, container escape + secret harvesting.",
    color: "oklch(0.65 0.22 25)",
  },
];

const ruleCategories = [
  { prefix: "MAL", label: "Malware Patterns", count: 45, color: "oklch(0.65 0.22 25)" },
  { prefix: "EXF", label: "Exfiltration", count: 17, color: "oklch(0.72 0.19 45)" },
  { prefix: "ABU", label: "Abuse Patterns", count: 7, color: "oklch(0.70 0.15 160)" },
  { prefix: "INJ", label: "Injection", count: 14, color: "oklch(0.58 0.22 290)" },
  { prefix: "CHN", label: "Chain Rules", count: 14, color: "oklch(0.65 0.18 200)" },
  { prefix: "CAP", label: "Capability Abuse", count: 6, color: "oklch(0.70 0.15 160)" },
  { prefix: "PINJ", label: "Prompt/Pipeline Injection", count: 6, color: "oklch(0.55 0.24 280)" },
  { prefix: "SUP", label: "Supply Chain", count: 15, color: "oklch(0.68 0.16 80)" },
];
// Note: ruleCategories counts are static display values; live total comes from GitHub API

const scanResults = [
  { status: "pass", rule: "INJ-001", message: "No prompt injection patterns detected", file: "search_tool.yaml" },
  { status: "pass", rule: "EXF-003", message: "No exfiltration channels detected", file: "search_tool.yaml" },
  { status: "block", rule: "MAL-025", message: "MCP Tool Description Poisoning detected", file: "data_processor.yaml", line: 15 },
  { status: "warn", rule: "ABU-006", message: "Stealth instruction concealment", file: "analytics.yaml", line: 8 },
  { status: "pass", rule: "CHN-011", message: "No compound attack chains detected", file: "user_manager.yaml" },
];

export default function Home() {
  const [visibleStats, setVisibleStats] = useState(false);
  const [ruleCount, setRuleCount] = useState(100);
  const [rulepackVersion, setRulepackVersion] = useState("0.3");

  useEffect(() => {
    const timer = setTimeout(() => setVisibleStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fetch live rule count and rulepack version from GitHub
  useEffect(() => {
    const url = "https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/src/skillscan/data/rules/default.yaml";
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        // Extract version from first line: version: "2026.03.17.2"
        const verMatch = text.match(/^version:\s*["']?([\d.]+)["']?/m);
        if (verMatch) setRulepackVersion(verMatch[1]);
        // Count all rules across sections:
        // static_rules and chain_rules use '- id:' (78 rules)
        // action_patterns (19) and capability_patterns (3) are dicts without id lines
        // Total = 100; use id-line count + 22 for the dict-based sections
        const ids = text.match(/^- id: /gm);
        if (ids) setRuleCount(ids.length + 22);
      })
      .catch(() => { /* keep defaults on error */ });
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Gradient overlay for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, oklch(0.12 0.025 265 / 0.95) 0%, oklch(0.12 0.025 265 / 0.75) 50%, oklch(0.12 0.025 265 / 0.40) 100%)",
          }}
        />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: headline */}
            <div>
              {/* Version badge */}
              <div className="inline-flex items-center gap-2 mb-6 animate-fade-up">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: "oklch(0.58 0.22 290 / 0.15)",
                    border: "1px solid oklch(0.58 0.22 290 / 0.35)",
                    color: "oklch(0.78 0.18 290)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  v{rulepackVersion} — {ruleCount} rules
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: "oklch(0.70 0.15 160 / 0.15)",
                    border: "1px solid oklch(0.70 0.15 160 / 0.30)",
                    color: "oklch(0.75 0.15 160)",
                  }}
                >
                  Open Source
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-up-delay-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
              >
                Offline Security
                <br />
                Analysis for{" "}
                <span className="gradient-text">AI Skills</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-8 animate-fade-up-delay-2"
                style={{ color: "oklch(0.70 0.015 265)", maxWidth: "480px" }}
              >
                Static scanning for MCP tools, Claude skills, and agent configurations.
                Zero network calls. Enterprise CI/CD ready. Catches what your agents shouldn't do.
              </p>

              {/* Install snippet */}
              <div
                className="rounded-lg p-4 mb-8 animate-fade-up-delay-2"
                style={{
                  background: "oklch(0.10 0.020 265 / 0.9)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.25)",
                  maxWidth: "480px",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs" style={{ color: "oklch(0.50 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>
                    Quick install
                  </span>
                  <CopyButton text={INSTALL_CMD} />
                </div>
                <code
                  className="text-sm"
                  style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <span style={{ color: "oklch(0.55 0.015 265)" }}>$</span>{" "}
                  {INSTALL_CMD}
                </code>
                <div className="mt-2 flex items-center justify-between">
                  <code
                    className="text-sm"
                    style={{ color: "oklch(0.72 0.19 45)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    <span style={{ color: "oklch(0.55 0.015 265)" }}>$</span>{" "}
                    {SCAN_CMD}
                  </code>
                  <CopyButton text={SCAN_CMD} />
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 animate-fade-up-delay-3">
                <a
                  href="https://github.com/kurtpayne/skillscan-security"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold btn-primary-glow"
                >
                  View on GitHub
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href="/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    background: "oklch(0.20 0.025 265)",
                    border: "1px solid oklch(0.58 0.22 290 / 0.25)",
                    color: "oklch(0.85 0.01 265)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.50)";
                    (e.currentTarget as HTMLElement).style.background = "oklch(0.22 0.028 265)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.25)";
                    (e.currentTarget as HTMLElement).style.background = "oklch(0.20 0.025 265)";
                  }}
                >
                  Read the Docs
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: animated terminal scan — desktop */}
            <div className="hidden lg:flex justify-end animate-fade-up-delay-2">
              <div className="w-full max-w-lg">
                <TerminalScan />
              </div>
            </div>
          </div>

          {/* Mobile compact terminal — shown below CTAs on small screens */}
          <div className="lg:hidden mt-8 animate-fade-up-delay-2">
            <TerminalScan compact />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div
        className="section-divider"
        style={{ background: "oklch(0.14 0.022 265 / 0.7)", backdropFilter: "blur(8px)" }}
      >
        <div className="container py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: `${ruleCount}+`, label: "Detection Rules" },
              { value: "15", label: "Chain Rules" },
              { value: "88", label: "Showcase Fixtures" },
              { value: "0", label: "Network Calls" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
                style={{
                  opacity: visibleStats ? 1 : 0,
                  transform: visibleStats ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`,
                }}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.18 290)" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Everything you need to secure AI skills
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "oklch(0.60 0.015 265)" }}>
              Built for enterprise DevSecOps teams who need confidence before deploying AI agent configurations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="glow-card rounded-xl p-6">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${feature.color} / 0.15`, border: `1px solid ${feature.color} / 0.30` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE SCAN OUTPUT ── */}
      <section
        className="py-24 section-divider"
        style={{ background: "oklch(0.11 0.022 265 / 0.5)" }}
      >
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Terminal output */}
            <div>
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "oklch(0.09 0.018 265)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.20)",
                  boxShadow: "0 0 40px oklch(0.58 0.22 290 / 0.08), 0 16px 48px oklch(0 0 0 / 0.4)",
                }}
              >
                {/* Window chrome */}
                <div
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.12)" }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.22 25)" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.72 0.19 45)" }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.70 0.15 160)" }} />
                  <span
                    className="ml-3 text-xs"
                    style={{ color: "oklch(0.45 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    skillscan scan ./skills/ --format compact
                  </span>
                </div>
                {/* Output lines */}
                <div className="p-4 space-y-1.5">
                  {scanResults.map((result, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {result.status === "pass" && <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.70 0.15 160)" }} />}
                      {result.status === "block" && <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.65 0.22 25)" }} />}
                      {result.status === "warn" && <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.72 0.19 45)" }} />}
                      <div>
                        <span
                          style={{
                            color: result.status === "block"
                              ? "oklch(0.65 0.22 25)"
                              : result.status === "warn"
                              ? "oklch(0.72 0.19 45)"
                              : "oklch(0.70 0.15 160)",
                          }}
                        >
                          [{result.status.toUpperCase()}]
                        </span>{" "}
                        <span style={{ color: "oklch(0.78 0.18 290)" }}>{result.rule}</span>{" "}
                        <span style={{ color: "oklch(0.65 0.015 265)" }}>{result.message}</span>
                        <br />
                        <span style={{ color: "oklch(0.45 0.012 265)" }}>
                          → {result.file}{result.line ? `:${result.line}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div
                    className="mt-3 pt-3 text-xs"
                    style={{
                      borderTop: "1px solid oklch(0.58 0.22 290 / 0.10)",
                      color: "oklch(0.55 0.015 265)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    Scan complete. 1 BLOCK, 1 WARN, 3 PASS. Exit code: 1
                  </div>
                </div>
              </div>
            </div>

            {/* Copy */}
            <div>
              <h2
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
              >
                Scan results you can act on
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "oklch(0.60 0.015 265)" }}>
                SkillScan outputs clean, structured results in compact, SARIF, or JUnit format. 
                Every finding includes the rule ID, severity, file path, and line number — 
                exactly what your CI/CD pipeline needs to make a merge decision.
              </p>
              <p className="text-base leading-relaxed mb-8" style={{ color: "oklch(0.60 0.015 265)" }}>
                SARIF output uploads directly to the GitHub Security tab. JUnit output integrates 
                with Jenkins and SonarQube. The compact format is human-readable in any terminal.
              </p>
              <a
                href="/rules"
                className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
                style={{ color: "oklch(0.78 0.18 290)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.88 0.18 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
              >
                Browse all 100+ rules
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── RULE CATEGORIES ── */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Detection rule coverage
            </h2>
            <p className="text-base" style={{ color: "oklch(0.60 0.015 265)" }}>
              Rules are organized by attack category, updated automatically as new threats emerge.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ruleCategories.map((cat) => (
              <a
                key={cat.prefix}
                href="/rules"
                className="glow-card rounded-xl p-5 text-center group"
              >
                <div
                  className="text-2xl font-bold mb-1 transition-colors duration-200"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: cat.color }}
                >
                  {cat.count}
                </div>
                <div
                  className="text-xs font-semibold mb-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: cat.color, opacity: 0.8 }}
                >
                  {cat.prefix}
                </div>
                <div className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>
                  {cat.label}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── GITHUB ACTIONS CTA ── */}
      <section
        className="py-20 section-divider"
        style={{ background: "oklch(0.11 0.022 265 / 0.5)" }}
      >
        <div className="container">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "oklch(0.16 0.025 265 / 0.7)",
              border: "1px solid oklch(0.58 0.22 290 / 0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Background glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, oklch(0.58 0.22 290 / 0.12) 0%, transparent 70%)",
                transform: "translate(30%, -30%)",
              }}
            />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{
                    background: "oklch(0.70 0.15 160 / 0.15)",
                    border: "1px solid oklch(0.70 0.15 160 / 0.30)",
                    color: "oklch(0.75 0.15 160)",
                  }}
                >
                  <GitBranch className="w-3 h-3" />
                  GitHub Actions
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
                >
                  One workflow. Every PR scanned.
                </h2>
                <p className="text-base leading-relaxed mb-6" style={{ color: "oklch(0.60 0.015 265)" }}>
                  Add SkillScan to your GitHub Actions pipeline with a single workflow reference. 
                  Findings appear in the Security tab. Blocks merge on critical issues. 
                  Works with any repository that contains skill files.
                </p>
                <a
                  href="/docs#github-actions"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold btn-primary-glow"
                >
                  View the workflow
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

              {/* Workflow snippet */}
              <div
                className="rounded-lg p-5 text-xs"
                style={{
                  background: "oklch(0.09 0.018 265)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.20)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <div className="space-y-1" style={{ color: "oklch(0.65 0.015 265)" }}>
                  <div><span style={{ color: "oklch(0.55 0.015 265)" }}># .github/workflows/security.yml</span></div>
                  <div style={{ color: "oklch(0.70 0.15 160)" }}>on: [push, pull_request]</div>
                  <div style={{ color: "oklch(0.70 0.15 160)" }}>jobs:</div>
                  <div className="pl-4" style={{ color: "oklch(0.65 0.015 265)" }}>skillscan:</div>
                  <div className="pl-8" style={{ color: "oklch(0.65 0.015 265)" }}>uses:</div>
                  <div className="pl-10" style={{ color: "oklch(0.78 0.18 290)" }}>kurtpayne/skillscan-security/.github/</div>
                  <div className="pl-10" style={{ color: "oklch(0.78 0.18 290)" }}>workflows/skillscan-scan.yml@main</div>
                  <div className="pl-8" style={{ color: "oklch(0.65 0.015 265)" }}>with:</div>
                  <div className="pl-10"><span style={{ color: "oklch(0.72 0.19 45)" }}>skill-path</span><span style={{ color: "oklch(0.65 0.015 265)" }}>: </span><span style={{ color: "oklch(0.70 0.15 160)" }}>'./skills/'</span></div>
                  <div className="pl-10"><span style={{ color: "oklch(0.72 0.19 45)" }}>fail-on</span><span style={{ color: "oklch(0.65 0.015 265)" }}>: </span><span style={{ color: "oklch(0.70 0.15 160)" }}>'block'</span></div>
                  <div className="pl-10"><span style={{ color: "oklch(0.72 0.19 45)" }}>upload-sarif</span><span style={{ color: "oklch(0.65 0.015 265)" }}>: </span><span style={{ color: "oklch(0.70 0.15 160)" }}>'true'</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LINTER CALLOUT ── */}
      <section className="py-20" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container">
          <div
            className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start"
            style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.20)" }}
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                style={{ background: "oklch(0.70 0.15 160 / 0.12)", border: "1px solid oklch(0.70 0.15 160 / 0.25)", color: "oklch(0.70 0.15 160)", fontFamily: "'JetBrains Mono', monospace" }}>
                NEW
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
                Skill File Quality Linter
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "oklch(0.60 0.015 265)" }}>
                25 quality rules catch weasel words, passive voice, undefined acronyms, missing fields,
                and dependency graph issues — before they reach production. Configurable via{" "}
                <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 290)" }}>.skillscan-lint.toml</code>,
                with Vale styles for inline editor feedback.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/linter" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold btn-primary-glow">
                  Explore the linter
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="https://github.com/kurtpayne/skillscan-lint" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.85 0.01 265)" }}>
                  GitHub <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                {[
                  { id: "QL-004", sev: "WARN", msg: "Intensifier: 'very' weakens the claim", color: "oklch(0.72 0.19 45)" },
                  { id: "QL-009", sev: "ERROR", msg: "Missing description field", color: "oklch(0.65 0.22 25)" },
                  { id: "QL-016", sev: "WARN", msg: "Superlative: 'best' is unsubstantiated", color: "oklch(0.72 0.19 45)" },
                  { id: "GR-002", sev: "ERROR", msg: "Dangling ref: 'auth-helper' not found", color: "oklch(0.65 0.22 25)" },
                  { id: "QL-021", sev: "WARN", msg: "Undefined acronym: 'LLM'", color: "oklch(0.72 0.19 45)" },
                ].map((item) => (
                  <div key={item.id} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
                    <span className="text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.sev}</span>
                    <div>
                      <span className="text-xs font-semibold" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{item.id}</span>
                      <p className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.015 265)" }}>{item.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ── FINAL CTA ── */}
      <section className="py-24">
        <div className="container text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
          >
            Start scanning in 30 seconds
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: "oklch(0.60 0.015 265)" }}>
            Open source. MIT licensed. No account required. No data leaves your machine.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/kurtpayne/skillscan-security"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold btn-primary-glow"
            >
              Get Started on GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="/rules"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: "oklch(0.20 0.025 265)",
                border: "1px solid oklch(0.58 0.22 290 / 0.25)",
                color: "oklch(0.85 0.01 265)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.50)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.25)";
              }}
            >
              Browse Detection Rules
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
