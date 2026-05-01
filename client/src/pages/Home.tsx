/* ============================================================
   HOME PAGE — SkillScan Deep Navy Design System
   Sections: Hero, Stats Bar, Features, How It Works,
             Rule Categories, GitHub Actions CTA, Final CTA
   ============================================================ */
import { useState, useEffect } from "react";
import { Shield, Zap, Lock, GitBranch, Terminal, ChevronRight, Copy, Check, ExternalLink, AlertTriangle, CheckCircle2, XCircle, Sliders, FileCode2, Link2, Database, GitMerge, FlaskConical, Search, Globe, Code2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TerminalScan from "@/components/TerminalScan";
import TerminalDemo from "@/components/TerminalDemo";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663340703543/GpzBjr25jP63Hgax7fEfrw/hero-bg_24844349.png";

const INSTALL_CMD = "pip install skillscan-security";
const SCAN_CMD = "skillscan scan ./skills/ --format sarif --out results.sarif";
const LINT_INSTALL_CMD = "pip install skillscan-lint";
const TRACE_INSTALL_CMD = "pip install skillscan-trace";

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
    title: "250+ Detection Rules",
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
    description: "Threat intel updates ship as reviewed PRs. New attack patterns and IOC feeds are added as they're discovered and verified.",
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
// AUTO_SYNC_BEGIN: ruleCategories
  { prefix: "MAL", label: "Malware Patterns", count: 75, color: "oklch(0.65 0.22 25)" },
  { prefix: "EXF", label: "Exfiltration", count: 22, color: "oklch(0.72 0.19 45)" },
  { prefix: "ABU", label: "Abuse Patterns", count: 9, color: "oklch(0.70 0.15 160)" },
  { prefix: "CHN", label: "Chain Rules", count: 14, color: "oklch(0.65 0.18 200)" },
  { prefix: "PINJ", label: "Prompt/Pipeline Injection", count: 29, color: "oklch(0.55 0.24 280)" },
  { prefix: "SUP", label: "Supply Chain", count: 48, color: "oklch(0.68 0.16 80)" },
  { prefix: "SE", label: "Social Engineering", count: 6, color: "oklch(0.62 0.20 340)" },
  { prefix: "DEF", label: "Defense Evasion", count: 1, color: "oklch(0.60 0.18 240)" },
  { prefix: "EXEC", label: "Execution Hijack", count: 2, color: "oklch(0.63 0.20 15)" },
  { prefix: "GR", label: "Graph Rules", count: 1, color: "oklch(0.65 0.15 180)" },
  { prefix: "OBF", label: "Obfuscation", count: 5, color: "oklch(0.58 0.18 270)" },
  { prefix: "PSV", label: "Passive Surveillance", count: 59, color: "oklch(0.67 0.16 60)" },
// AUTO_SYNC_END: ruleCategories
];
// Note: ruleCategories counts are static display values; live total comes from GitHub API

const scanResults = [
  { status: "allow", verdict: "verdict=allow score=0 findings=0", file: "search_tool.md" },
  { status: "warn",  verdict: "verdict=warn  score=35 findings=1", rule: "SE-SEM-001", sev: "[high/critical]", msg: "Credential-harvest pattern", file: "analytics.md" },
  { status: "block", verdict: "verdict=block score=180 findings=1", rule: "CHN-001", sev: "[critical/critical]", msg: "Download+execute chain", file: "data_processor.md" },
  { status: "block", verdict: "verdict=block score=70 findings=1", rule: "PINJ-001", sev: "[high/high]", msg: "Prompt override / jailbreak", file: "injector.md", line: 1 },
];

export default function Home() {
  const [visibleStats, setVisibleStats] = useState(false);
  const [ruleCount, setRuleCount] = useState(258);
  const [rulepackVersion, setRulepackVersion] = useState("0.3");

  useEffect(() => {
    const timer = setTimeout(() => setVisibleStats(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fetch live rule count and rulepack version from GitHub.
  // Source of truth is kurtpayne/skillscan-rules (the split-out rules repo);
  // skillscan-security/src/skillscan/data/rules/default.yaml is a bundled
  // snapshot that only refreshes at package-release time.
  useEffect(() => {
    const url = "https://raw.githubusercontent.com/kurtpayne/skillscan-rules/main/rules/default.yaml";
    fetch(url)
      .then((r) => r.text())
      .then((text) => {
        // Extract version from first line: version: "2026.03.17.2"
        const verMatch = text.match(/^version:\s*["']?([\d.]+)["']?/m);
        if (verMatch) setRulepackVersion(verMatch[1]);
        // Count static_rules + chain_rules via `  - id:` lines (2-space indent).
        // This is the same count llms.txt and the rule-table page display —
        // capability_patterns are not user-facing rules and shouldn't be added.
        const ids = text.match(/^  - id: /gm);
        if (ids) setRuleCount(ids.length);
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
                Security Tooling
                <br />
                for{" "}
                <span className="gradient-text">AI Agent Skills</span>
              </h1>

              <p
                className="text-lg leading-relaxed mb-8 animate-fade-up-delay-2"
                style={{ color: "oklch(0.70 0.015 265)", maxWidth: "480px" }}
              >
                Three open-source tools that cover the full lifecycle of AI skill security: static analysis to catch malicious patterns before deployment, quality linting to enforce best practices, and live behavioural tracing to verify what a skill actually does at runtime.
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
                    skillscan-security
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

      {/* ── SUITE CARDS ── */}
      <section className="py-16" style={{ background: "oklch(0.11 0.022 265)" }}>
        <div className="container">
          <p className="text-center text-xs font-semibold uppercase tracking-widest mb-10" style={{ color: "oklch(0.50 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
            Three tools. One security lifecycle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Scan */}
            <a href="/" className="group rounded-xl p-6 transition-all duration-200 no-underline" style={{ background: "oklch(0.14 0.025 265)", border: "1px solid oklch(0.58 0.22 290 / 0.20)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.45)"; (e.currentTarget as HTMLElement).style.background = "oklch(0.16 0.028 265)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.20)"; (e.currentTarget as HTMLElement).style.background = "oklch(0.14 0.025 265)"; }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.58 0.22 290 / 0.15)", border: "1px solid oklch(0.58 0.22 290 / 0.30)" }}>
                  <span className="text-lg">🔍</span>
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "oklch(0.90 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}>skillscan-security</div>
                  <div className="text-xs" style={{ color: "oklch(0.58 0.22 290)" }}>Static Analysis</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.015 265)" }}>140+ rules covering MCP tool poisoning, prompt injection, credential exfiltration, supply chain attacks, and chain detection. SARIF output, CI/CD native.</p>
              <div className="flex flex-wrap gap-2">
                {["pip install skillscan-security", "SARIF", "GitHub Actions"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.58 0.22 290 / 0.12)", color: "oklch(0.72 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{tag}</span>
                ))}
              </div>
            </a>
            {/* Lint */}
            <a href="/lint" className="group rounded-xl p-6 transition-all duration-200 no-underline" style={{ background: "oklch(0.14 0.025 265)", border: "1px solid oklch(0.70 0.15 160 / 0.20)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.70 0.15 160 / 0.45)"; (e.currentTarget as HTMLElement).style.background = "oklch(0.16 0.028 265)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.70 0.15 160 / 0.20)"; (e.currentTarget as HTMLElement).style.background = "oklch(0.14 0.025 265)"; }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.70 0.15 160 / 0.15)", border: "1px solid oklch(0.70 0.15 160 / 0.30)" }}>
                  <span className="text-lg">📐</span>
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "oklch(0.90 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}>skillscan-lint</div>
                  <div className="text-xs" style={{ color: "oklch(0.70 0.15 160)" }}>Quality Linting</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.015 265)" }}>Enforces skill quality standards: schema validation, description completeness, permission hygiene, and structural best practices. Runs in seconds.</p>
              <div className="flex flex-wrap gap-2">
                {["pip install skillscan-lint", "pre-commit", "JSON Schema"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.70 0.15 160 / 0.12)", color: "oklch(0.70 0.15 160)", fontFamily: "'JetBrains Mono', monospace" }}>{tag}</span>
                ))}
              </div>
            </a>
            {/* Trace */}
            <a href="/trace" className="group rounded-xl p-6 transition-all duration-200 no-underline" style={{ background: "oklch(0.14 0.025 265)", border: "1px solid oklch(0.72 0.19 45 / 0.20)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.19 45 / 0.45)"; (e.currentTarget as HTMLElement).style.background = "oklch(0.16 0.028 265)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.72 0.19 45 / 0.20)"; (e.currentTarget as HTMLElement).style.background = "oklch(0.14 0.025 265)"; }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "oklch(0.72 0.19 45 / 0.15)", border: "1px solid oklch(0.72 0.19 45 / 0.30)" }}>
                  <span className="text-lg">🔬</span>
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "oklch(0.90 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}>skillscan-trace</div>
                  <div className="text-xs" style={{ color: "oklch(0.72 0.19 45)" }}>Behavioural Tracing</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.60 0.015 265)" }}>Runs your skill against a live LLM in a canary MCP environment with 14 instrumented tools. Watches what the skill actually does, not just what it claims.</p>
              <div className="flex flex-wrap gap-2">
                {["pip install skillscan-trace", "BYOK", "Ollama"].map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: "oklch(0.72 0.19 45 / 0.12)", color: "oklch(0.72 0.19 45)", fontFamily: "'JetBrains Mono', monospace" }}>{tag}</span>
                ))}
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── TERMINAL DEMO ── */}
      <section
        className="py-24"
        style={{ background: "oklch(0.09 0.018 265)", borderTop: "1px solid oklch(0.58 0.22 290 / 0.08)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{
                background: "oklch(0.58 0.22 290 / 0.12)",
                border: "1px solid oklch(0.58 0.22 290 / 0.30)",
                color: "oklch(0.78 0.18 290)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Live demo
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              See it in action
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "oklch(0.60 0.015 265)" }}>
              Switch between tools to see what each one outputs on a real skill file.
              Hover to pause the animation.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <TerminalDemo />
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm" style={{ color: "oklch(0.50 0.015 265)" }}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "oklch(0.70 0.15 160)" }} />
              allow — no findings
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "oklch(0.72 0.19 45)" }} />
              warn — review required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: "oklch(0.65 0.22 25)" }} />
              block — merge blocked
            </span>
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
              { value: "98.8%", label: "Verdict Accuracy" },
              { value: "97.8%", label: "Threat Detection" },
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
                    skillscan scan ./skills/
                  </span>
                </div>
                {/* Output lines — real compact format */}
                <div className="p-4 space-y-2">
                  {scanResults.map((result, i) => (
                    <div key={i} className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <div className="flex items-center gap-2">
                        {result.status === "allow" && <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.70 0.15 160)" }} />}
                        {result.status === "block" && <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.65 0.22 25)" }} />}
                        {result.status === "warn" && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.72 0.19 45)" }} />}
                        <span style={{
                          color: result.status === "block" ? "oklch(0.65 0.22 25)" : result.status === "warn" ? "oklch(0.72 0.19 45)" : "oklch(0.70 0.15 160)"
                        }}>{result.verdict}</span>
                      </div>
                      {result.rule && (
                        <div className="pl-5 mt-0.5" style={{ color: "oklch(0.55 0.015 265)" }}>
                          - <span style={{ color: "oklch(0.78 0.18 290)" }}>{result.rule}</span>{" "}
                          <span style={{ color: "oklch(0.50 0.015 265)" }}>{result.sev}</span>{" "}
                          {result.msg}{" @ "}{result.file}{result.line ? `:${result.line}` : ""}
                        </div>
                      )}
                      {!result.rule && (
                        <div className="pl-5 mt-0.5" style={{ color: "oklch(0.45 0.012 265)" }}>
                          {result.file}
                        </div>
                      )}
                    </div>
                  ))}
                  <div
                    className="mt-3 pt-3 text-xs"
                    style={{
                      borderTop: "1px solid oklch(0.58 0.22 290 / 0.10)",
                      color: "oklch(0.78 0.18 290)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    verdict=block  score=285  findings=3  exit=1
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
                Browse all {ruleCount}+ rules
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

      {/* ── DETECTION FRAMEWORK ── */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{
                background: "oklch(0.58 0.22 290 / 0.12)",
                border: "1px solid oklch(0.58 0.22 290 / 0.30)",
                color: "oklch(0.78 0.18 290)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Defense in depth
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Three layers of defense. One verdict.
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "oklch(0.60 0.015 265)" }}>
              Rule-based detection catches known patterns. The ML classifier catches novel phrasing no rule can express. Third-party integrations extend coverage with external engines. All running offline.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* ── Rule-based detection ── */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(0.14 0.020 265)",
                border: "1px solid oklch(0.72 0.19 45 / 0.20)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.72 0.19 45 / 0.15)" }}
                >
                  <Shield className="w-5 h-5" style={{ color: "oklch(0.72 0.19 45)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
                    Rule-based detection
                  </h3>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>Deterministic, zero-config, instant</p>
                </div>
              </div>
              <p className="text-sm mb-5" style={{ color: "oklch(0.62 0.015 265)" }}>
                {ruleCount}+ static rules, chain correlation, multilang analysis, AST data-flow, graph-based structural checks, and stemmed semantic scoring. Includes continuously updated threat intelligence with 6,000+ IOCs and vulnerable package detection.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Static regex rules", detail: `${ruleCount}+ rules across 12 categories` },
                  { label: "Chain rules", detail: "Multi-signal correlation (e.g. download + execute)" },
                  { label: "Multilang rules", detail: "Language-gated patterns for .js, .ts, .py, .go, .rs" },
                  { label: "Python AST data-flow", detail: "Source-to-sink taint analysis" },
                  { label: "IOC matching", detail: "6,000+ domains, IPs, CIDRs" },
                  { label: "Vuln DB matching", detail: "Known-vulnerable package versions" },
                  { label: "Binary artifact detection", detail: "Embedded executables and encoded payloads" },
                  { label: "Skill graph analysis", detail: "Cross-file permission scope violations" },
                  { label: "Stemmed feature scorer", detail: "Distributed intent across sentences" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "oklch(0.72 0.19 45 / 0.50)" }} />
                    <div>
                      <span className="text-xs font-semibold" style={{ color: "oklch(0.80 0.008 265)" }}>{item.label}</span>
                      <span className="text-xs ml-1" style={{ color: "oklch(0.50 0.015 265)" }}> — {item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="/rules"
                className="inline-flex items-center gap-1 text-xs mt-5 font-semibold transition-colors duration-200"
                style={{ color: "oklch(0.72 0.19 45)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.82 0.19 45)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.72 0.19 45)")}
              >
                Browse all rules <ChevronRight className="w-3 h-3" />
              </a>
            </div>

            {/* ── ML classifier ── */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(0.14 0.020 265)",
                border: "1px solid oklch(0.78 0.18 290 / 0.25)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.58 0.22 290 / 0.15)" }}
                >
                  <FlaskConical className="w-5 h-5" style={{ color: "oklch(0.78 0.18 290)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
                    ML classifier
                  </h3>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>Catches what rules can't express</p>
                </div>
              </div>
              <p className="text-sm mb-5" style={{ color: "oklch(0.62 0.015 265)" }}>
                Fine-tuned Qwen2.5-1.5B generative detector. Identifies novel prompt injection, obfuscated attacks, and semantic patterns that no static rule or keyword scorer can match. Runs offline via llama.cpp — no API keys, no network.
              </p>
              <div className="space-y-3">
                {[
                  { label: "Model", detail: "Qwen2.5-1.5B, GGUF Q4_K_M (~935 MB)" },
                  { label: "7 attack classes", detail: "With human-readable reasoning" },
                  { label: "Offline inference", detail: "CPU-only via llama.cpp" },
                  { label: "Frozen weights", detail: "Independent of your rule config" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-2 items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "oklch(0.78 0.18 290 / 0.50)" }} />
                    <div>
                      <span className="text-xs font-semibold" style={{ color: "oklch(0.80 0.008 265)" }}>{item.label}</span>
                      <span className="text-xs ml-1" style={{ color: "oklch(0.50 0.015 265)" }}> — {item.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <a
                href="/model"
                className="inline-flex items-center gap-1 text-xs mt-5 font-semibold transition-colors duration-200"
                style={{ color: "oklch(0.78 0.18 290)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.88 0.18 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
              >
                View model card <ChevronRight className="w-3 h-3" />
              </a>
            </div>

            {/* ── Integrations ── */}
            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(0.14 0.020 265)",
                border: "1px solid oklch(0.65 0.18 200 / 0.20)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: "oklch(0.65 0.18 200 / 0.15)" }}
                >
                  <Link2 className="w-5 h-5" style={{ color: "oklch(0.65 0.18 200)" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
                    Integrations
                  </h3>
                  <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>Extend coverage with external engines</p>
                </div>
              </div>
              <p className="text-sm mb-5" style={{ color: "oklch(0.62 0.015 265)" }}>
                Plug in third-party detection engines to extend SkillScan's coverage. Integration findings are scored and reported alongside native detections.
              </p>
              <div
                className="rounded-lg p-4 mb-4"
                style={{
                  background: "oklch(0.12 0.018 265)",
                  border: "1px solid oklch(0.65 0.18 200 / 0.12)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4" style={{ color: "oklch(0.65 0.18 200)" }} />
                  <span className="text-sm font-semibold" style={{ color: "oklch(0.85 0.008 265)" }}>ClamAV</span>
                  <span
                    className="px-1.5 py-0.5 rounded text-xs"
                    style={{
                      background: "oklch(0.65 0.18 145 / 0.15)",
                      color: "oklch(0.65 0.18 145)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    available
                  </span>
                </div>
                <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>
                  Signature-based antivirus scan of embedded scripts and binaries. Enable with <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.18 200)" }}>--clamav</code>.
                </p>
              </div>
              <a
                href="https://github.com/kurtpayne/skillscan-security/issues/new?title=Integration+suggestion:+&labels=enhancement"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
                style={{ color: "oklch(0.65 0.18 200)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.75 0.18 200)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.18 200)")}
              >
                Suggest an integration <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="py-24 section-divider" style={{ background: "oklch(0.10 0.020 265)" }}>
        <div className="container">
          <div className="text-center mb-14">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
              style={{
                background: "oklch(0.65 0.18 200 / 0.12)",
                border: "1px solid oklch(0.65 0.18 200 / 0.30)",
                color: "oklch(0.72 0.18 200)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              7 built-in integrations
            </div>
            <h2
              className="text-3xl sm:text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Extend coverage with external engines
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "oklch(0.60 0.015 265)" }}>
              Plug in AV scanners, custom rule sets, and live threat intelligence. All integration findings are scored alongside native detections and factored into the final verdict.
            </p>
          </div>

          <div className="space-y-10">
            {/* ── AV / Malware ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.50 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  AV / Malware
                </span>
                <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.020 265)" }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* VirusTotal */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.65 0.22 25 / 0.18)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.65 0.22 25 / 0.12)", border: "1px solid oklch(0.65 0.22 25 / 0.25)" }}
                    >
                      <Search className="w-4 h-4" style={{ color: "oklch(0.65 0.22 25)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3
                          className="text-sm font-semibold"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                        >
                          VirusTotal
                        </h3>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.65 0.22 25 / 0.10)", color: "oklch(0.72 0.22 25)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          --virustotal
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.58 0.22 290 / 0.10)", color: "oklch(0.72 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          BYOK
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                        SHA-256 hash lookups via the VirusTotal v3 API. Rate-limited on the free tier. Requires your own API key.
                      </p>
                    </div>
                  </div>
                </div>
                {/* ClamAV */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.65 0.22 25 / 0.18)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.65 0.22 25 / 0.12)", border: "1px solid oklch(0.65 0.22 25 / 0.25)" }}
                    >
                      <Shield className="w-4 h-4" style={{ color: "oklch(0.65 0.22 25)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3
                          className="text-sm font-semibold"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                        >
                          ClamAV
                        </h3>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.65 0.22 25 / 0.10)", color: "oklch(0.72 0.22 25)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          --clamav
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.70 0.15 160 / 0.12)", color: "oklch(0.70 0.15 160)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          Docker default
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                        Local AV via subprocess wrapper. Signature-based scan of embedded scripts and binaries. Enabled by default in the Docker image.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Rules Engines ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.50 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Rules Engines
                </span>
                <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.020 265)" }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* YARA */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.58 0.22 290 / 0.12)", border: "1px solid oklch(0.58 0.22 290 / 0.25)" }}
                    >
                      <FileCode2 className="w-4 h-4" style={{ color: "oklch(0.72 0.18 290)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3
                          className="text-sm font-semibold"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                        >
                          YARA
                        </h3>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.58 0.22 290 / 0.10)", color: "oklch(0.72 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          --yara-rules
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.58 0.22 290 / 0.08)", color: "oklch(0.60 0.15 290)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          yara-python
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                        Match user-supplied .yar rule files against skill content. Requires the optional yara-python dependency.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Semgrep */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.58 0.22 290 / 0.12)", border: "1px solid oklch(0.58 0.22 290 / 0.25)" }}
                    >
                      <Code2 className="w-4 h-4" style={{ color: "oklch(0.72 0.18 290)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3
                          className="text-sm font-semibold"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                        >
                          Semgrep
                        </h3>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.58 0.22 290 / 0.10)", color: "oklch(0.72 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          --semgrep-rules
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                        AST-level static analysis of code embedded in skills via the external Semgrep CLI. Catches injection patterns, insecure APIs, and language-specific anti-patterns.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Threat Intelligence ── */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "oklch(0.50 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Threat Intelligence
                </span>
                <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.020 265)" }} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* IOC Database */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.65 0.18 200 / 0.18)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.65 0.18 200 / 0.12)", border: "1px solid oklch(0.65 0.18 200 / 0.25)" }}
                    >
                      <Database className="w-4 h-4" style={{ color: "oklch(0.65 0.18 200)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3
                          className="text-sm font-semibold"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                        >
                          IOC Database
                        </h3>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.70 0.15 160 / 0.12)", color: "oklch(0.70 0.15 160)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          built-in
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                        9 threat feeds — URLhaus, FeodoTracker, Spamhaus DROP, HaGeZi, Phishing Army, KADhosts. ~5K bundled high-precision IOCs; large feeds (~1M entries) pulled at scan time. Refreshed twice daily.
                      </p>
                    </div>
                  </div>
                </div>
                {/* OSV.dev */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.65 0.18 200 / 0.18)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.65 0.18 200 / 0.12)", border: "1px solid oklch(0.65 0.18 200 / 0.25)" }}
                    >
                      <Globe className="w-4 h-4" style={{ color: "oklch(0.65 0.18 200)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3
                          className="text-sm font-semibold"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                        >
                          OSV.dev
                        </h3>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.70 0.15 160 / 0.12)", color: "oklch(0.70 0.15 160)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          built-in
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                        Live vulnerability lookups for package dependencies against the public Open Source Vulnerabilities API. No API key required.
                      </p>
                    </div>
                  </div>
                </div>
                {/* External Vuln Reports */}
                <div
                  className="rounded-xl p-5"
                  style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.65 0.18 200 / 0.18)" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "oklch(0.65 0.18 200 / 0.12)", border: "1px solid oklch(0.65 0.18 200 / 0.25)" }}
                    >
                      <GitMerge className="w-4 h-4" style={{ color: "oklch(0.65 0.18 200)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3
                          className="text-sm font-semibold"
                          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
                        >
                          External Vuln Reports
                        </h3>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{ background: "oklch(0.65 0.18 200 / 0.10)", color: "oklch(0.72 0.18 200)", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          --vuln-report
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                        Ingest findings from Snyk, GitHub Dependabot, or Grype JSON exports. Normalized and reported alongside native vulnerability detections.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXTENSIBILITY ── */}
      <section className="py-20 section-divider" style={{ background: "oklch(0.09 0.018 265)" }}>
        <div className="container">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-5 h-5" style={{ color: "oklch(0.72 0.19 290)" }} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "oklch(0.72 0.19 290)", fontFamily: "'JetBrains Mono', monospace" }}>Extensibility</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
              Fully customizable.<br />
              <span style={{ color: "oklch(0.72 0.19 290)" }}>Except the part that matters.</span>
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "oklch(0.62 0.015 265)" }}>
              Every detection layer is a dial you control — your rules, your thresholds, your policy profiles.
              The one exception is the ML classifier: a frozen GGUF artifact that acts as a tamper-resistant
              trust anchor. A malicious skill author can craft patterns to evade your custom rules.
              They cannot retrain the model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {[
              {
                icon: <FileCode2 className="w-4 h-4" />,
                title: "Custom Rules",
                desc: "Write YAML rule files and load them with --rules. Override or extend any built-in pattern.",
                code: "skillscan scan ./skills/ --rules ./my-rules.yaml",
              },
              {
                icon: <Sliders className="w-4 h-4" />,
                title: "Policy Profiles",
                desc: "Choose strict, balanced, permissive, ci, enterprise, or observe — or define your own threshold and severity mapping.",
                code: "skillscan scan ./skills/ --profile enterprise",
              },
              {
                icon: <Link2 className="w-4 h-4" />,
                title: "Chain Rules",
                desc: "Correlate signals across layers. Flag a file only when EXF and PINJ both fire.",
                code: "# chain_rules: [EXF-*, PINJ-*] → block",
              },
              {
                icon: <Database className="w-4 h-4" />,
                title: "Vuln / IOC Database",
                desc: "Update threat intel on demand. Bring your own CVE or IOC entries.",
                code: "skillscan intel update",
              },
              {
                icon: <GitMerge className="w-4 h-4" />,
                title: "Inline Suppression",
                desc: "Suppress a specific finding at the source with a comment. Tracked in provenance output.",
                code: "# skillscan-suppress: MAL-001",
              },
              {
                icon: <FlaskConical className="w-4 h-4" />,
                title: "Community Rules",
                desc: "Submit new patterns via GitHub issues. Accepted rules flow into the static layer, not the model.",
                href: "https://github.com/kurtpayne/skillscan-security/issues/new?template=corpus-submission.md",
                cta: "Submit a pattern →",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-5"
                style={{
                  background: "oklch(0.13 0.022 265 / 0.7)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.15)",
                }}
              >
                <div className="flex items-center gap-2 mb-2" style={{ color: "oklch(0.72 0.19 290)" }}>
                  {item.icon}
                  <span className="text-sm font-semibold" style={{ color: "oklch(0.90 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</span>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>{item.desc}</p>
                {item.code && (
                  <code className="block text-xs px-3 py-2 rounded-md" style={{ background: "oklch(0.08 0.015 265)", color: "oklch(0.75 0.12 290)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.code}
                  </code>
                )}
                {item.href && (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: "oklch(0.72 0.19 290)" }}>
                    {item.cta}
                  </a>
                )}
              </div>
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
                  <div className="pl-10"><span style={{ color: "oklch(0.72 0.19 45)" }}>fail-on-severity</span><span style={{ color: "oklch(0.65 0.015 265)" }}>: </span><span style={{ color: "oklch(0.70 0.15 160)" }}>'critical'</span></div>
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
                <a href="/lint"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.85 0.01 265)" }}>
                  Browse all rules <ChevronRight className="w-4 h-4" />
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
      {/* ── TRACE CALLOUT ── */}
      <section className="py-20" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container">
          <div
            className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start"
            style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.20)" }}
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
                style={{ background: "oklch(0.58 0.22 290 / 0.12)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>
                BEHAVIORAL ANALYSIS
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
                Does your skill behave the way it claims?
              </h2>
              <p className="text-base leading-relaxed mb-6" style={{ color: "oklch(0.60 0.015 265)" }}>
                <strong style={{ color: "oklch(0.88 0.012 265)" }}>skillscan-trace</strong> runs your skill against a live LLM inside a canary environment — a sandboxed MCP server with 14 instrumented tools. It watches what the skill actually does when prompted, not just what it claims to do. Bring your own key. Runs entirely on your machine.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="/trace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold btn-primary-glow">
                  Learn about tracing
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a href="https://github.com/kurtpayne/skillscan-trace" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.85 0.01 265)" }}>
                  GitHub <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="w-full md:w-72 flex-shrink-0">
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                {[
                  { sev: "CRITICAL", rule: "CANARY-001", msg: "Exfiltration via http_request tool", color: "oklch(0.55 0.22 25)" },
                  { sev: "HIGH", rule: "CANARY-003", msg: "Credential access: ~/.aws/credentials", color: "oklch(0.65 0.22 45)" },
                  { sev: "MEDIUM", rule: "CANARY-007", msg: "Bash injection via shell tool", color: "oklch(0.72 0.19 80)" },
                  { sev: "INFO", rule: "CANARY-011", msg: "Network enumeration attempt", color: "oklch(0.65 0.18 200)" },
                  { sev: "PASS", rule: "VERDICT", msg: "3 variants × 10 turns — SUSPICIOUS", color: "oklch(0.72 0.19 45)" },
                ].map((item) => (
                  <div key={item.rule} className="flex items-start gap-3 px-4 py-3" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
                    <span className="text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: item.color, fontFamily: "'JetBrains Mono', monospace" }}>{item.sev}</span>
                    <div>
                      <span className="text-xs font-semibold" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{item.rule}</span>
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
