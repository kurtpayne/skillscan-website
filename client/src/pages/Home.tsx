/* ============================================================
   HOME PAGE — SkillScan Deep Navy Design System
   Sections: Hero, Stats Bar, Features, How It Works,
             Rule Categories, GitHub Actions CTA, Final CTA
   ============================================================ */
import { useState, useEffect } from "react";
import { Shield, Zap, Lock, GitBranch, Terminal, ChevronRight, Copy, Check, ExternalLink, AlertTriangle, CheckCircle2, XCircle, Sliders, FileCode2, Link2, Database, GitMerge, FlaskConical } from "lucide-react";
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
  { prefix: "MAL", label: "Malware Patterns", count: 54, color: "oklch(0.65 0.22 25)" },
  { prefix: "EXF", label: "Exfiltration", count: 20, color: "oklch(0.72 0.19 45)" },
  { prefix: "ABU", label: "Abuse Patterns", count: 7, color: "oklch(0.70 0.15 160)" },
  { prefix: "CHN", label: "Chain Rules", count: 14, color: "oklch(0.65 0.18 200)" },
  { prefix: "PINJ", label: "Prompt/Pipeline Injection", count: 16, color: "oklch(0.55 0.24 280)" },
  { prefix: "SUP", label: "Supply Chain", count: 21, color: "oklch(0.68 0.16 80)" },
  { prefix: "SE", label: "Social Engineering", count: 3, color: "oklch(0.62 0.20 340)" },
  { prefix: "DEF", label: "Defense Evasion", count: 1, color: "oklch(0.60 0.18 240)" },
  { prefix: "EXEC", label: "Execution Hijack", count: 1, color: "oklch(0.63 0.20 15)" },
  { prefix: "GR", label: "Graph Rules", count: 1, color: "oklch(0.65 0.15 180)" },
  { prefix: "OBF", label: "Obfuscation", count: 4, color: "oklch(0.58 0.18 270)" },
  { prefix: "PSV", label: "Passive Surveillance", count: 5, color: "oklch(0.67 0.16 60)" },
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
                Eight-layer static analysis for MCP tools, Claude skills, and agent configurations.
                Runs entirely offline — no network calls at scan time. Built for enterprise security teams
                who need a verifiable gate before deploying AI agent configurations.
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
              { value: "0.9752", label: "ML Model F1" },
              { value: "1.89%", label: "False Positive Rate" },
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

      {/* ── 8-LAYER DETECTION FRAMEWORK ── */}
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
              Eight detection layers. One verdict.
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "oklch(0.60 0.015 265)" }}>
              Eight independent detection layers, all running offline. Rules catch known patterns. The stemmed scorer catches distributed intent. The ML layer catches novel phrasing no rule can express.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                  <th className="text-left py-3 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.55 0.015 265)", width: "2rem" }}>Layer</th>
                  <th className="text-left py-3 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.55 0.015 265)" }}>Mechanism</th>
                  <th className="text-left py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.55 0.015 265)" }}>What it catches</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: "1", mech: "IOC matching", detail: "Intel DB scan (5,500 entries: domains, IPs, CIDRs)", catches: "Known malicious domains and IPs embedded in skill content", accent: "oklch(0.65 0.22 25)" },
                  { n: "2", mech: "Static rules", detail: "Regex pattern matching (158 rules across 9 categories)", catches: "Known attack patterns, structural violations, dangerous constructs", accent: "oklch(0.72 0.19 45)" },
                  { n: "3", mech: "Python AST data-flow", detail: "Source-to-sink taint analysis (.py files only)", catches: "Secret → decode → exec/network flows in embedded Python scripts", accent: "oklch(0.70 0.15 160)" },
                  { n: "4", mech: "Stemmed feature scorer", detail: "Porter-stemmed axis scoring (prompt injection + social engineering)", catches: "Multi-sentence intent distributed across text — jailbreaks, credential harvest instructions not caught by single-line rules", accent: "oklch(0.65 0.18 200)" },
                  { n: "5", mech: "Skill graph analysis", detail: "Graph-based PSV rules", catches: "Tool drift, circular dependencies, permission scope violations", accent: "oklch(0.68 0.16 80)" },
                  { n: "6", mech: "ML classifier", detail: "DeBERTa-v3 + LoRA  ·  F1 0.9752  ·  FPR 1.89%", catches: "Novel phrasing, obfuscated attacks, and semantic patterns no rule or scorer can express", accent: "oklch(0.78 0.18 290)", highlight: true },
                  { n: "7", mech: "Vuln DB matching", detail: "Dependency scan (23 Python pkgs, 4 npm pkgs, 111 versions)", catches: "Known-vulnerable package versions in requirements.txt / package.json", accent: "oklch(0.60 0.20 320)" },
                  { n: "8", mech: "ClamAV", detail: "Signature-based AV scan (optional, via --clamav)", catches: "Known malware signatures in embedded script files (.py, .sh, .js…)", accent: "oklch(0.62 0.20 340)" },
                ].map((row) => (
                  <tr
                    key={row.n}
                    onClick={row.highlight ? () => window.location.href = '/model' : undefined}
                    style={{
                      borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)",
                      background: row.highlight ? "oklch(0.58 0.22 290 / 0.06)" : "transparent",
                      cursor: row.highlight ? "pointer" : "default",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={row.highlight ? (e) => { (e.currentTarget as HTMLElement).style.background = "oklch(0.58 0.22 290 / 0.12)"; } : undefined}
                    onMouseLeave={row.highlight ? (e) => { (e.currentTarget as HTMLElement).style.background = "oklch(0.58 0.22 290 / 0.06)"; } : undefined}
                  >
                    <td className="py-4 pr-6">
                      <span
                        className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold"
                        style={{
                          background: `${row.accent} / 0.15`,
                          color: row.accent,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {row.n}
                      </span>
                    </td>
                    <td className="py-4 pr-6">
                      <div className="font-semibold mb-0.5" style={{ color: row.highlight ? "oklch(0.88 0.18 290)" : "oklch(0.88 0.005 265)" }}>
                        {row.mech}
                        {row.highlight && (
                          <>
                            <span
                              className="ml-2 px-1.5 py-0.5 rounded text-xs"
                              style={{
                                background: "oklch(0.58 0.22 290 / 0.20)",
                                color: "oklch(0.78 0.18 290)",
                                fontFamily: "'JetBrains Mono', monospace",
                              }}
                            >
                              ML
                            </span>
                            <span
                              className="ml-2 text-xs"
                              style={{ color: "oklch(0.58 0.22 290 / 0.70)", fontFamily: "'Inter', sans-serif" }}
                            >
                              → view model
                            </span>
                          </>
                        )}
                      </div>
                      <div className="text-xs" style={{ color: "oklch(0.50 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>
                        {row.detail}
                      </div>
                    </td>
                    <td className="py-4 text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                      {row.catches}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/model"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
              style={{ color: "oklch(0.78 0.18 290)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.88 0.18 290)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
            >
              ML model details, architecture, and evaluation history
              <ChevronRight className="w-4 h-4" />
            </a>
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
              The one exception is the ML classifier: a frozen ONNX artifact that acts as a tamper-resistant
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
                desc: "Choose strict, ci, paranoid, audit, or minimal — or define your own threshold and severity mapping.",
                code: "skillscan scan ./skills/ --policy paranoid",
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

          {/* Fixed ML anchor callout */}
          <div
            className="rounded-xl p-5 flex gap-4 items-start"
            style={{
              background: "oklch(0.12 0.025 265 / 0.6)",
              border: "1px solid oklch(0.65 0.22 25 / 0.30)",
            }}
          >
            <div className="mt-0.5 flex-shrink-0">
              <Lock className="w-5 h-5" style={{ color: "oklch(0.72 0.22 25)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.88 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Layer 6 — ML Classifier is intentionally fixed</p>
              <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                The DeBERTa-v3 + LoRA model is a frozen ONNX artifact. Its weights are not configurable and
                cannot be overridden by rules or policy files. This is by design: the model provides a
                detection signal that is independent of your local configuration, making it resistant to
                evasion by a skill author who knows your rule set.
              </p>
              <a href="/model" className="inline-flex items-center gap-1 text-xs mt-2 font-semibold" style={{ color: "oklch(0.72 0.22 25)" }}>
                View model card <ChevronRight className="w-3 h-3" />
              </a>
            </div>
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
