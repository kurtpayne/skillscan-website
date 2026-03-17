/* ============================================================
   DOCS PAGE — SkillScan Documentation
   ============================================================ */
import { useState } from "react";
import { Copy, Check, ExternalLink, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded transition-all duration-200 absolute top-3 right-3"
      style={{ color: "oklch(0.50 0.015 265)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.50 0.015 265)")}
      aria-label="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div className="relative my-4">
      <pre
        className="rounded-lg p-4 text-sm overflow-x-auto"
        style={{
          background: "oklch(0.09 0.018 265)",
          border: "1px solid oklch(0.58 0.22 290 / 0.20)",
          color: "oklch(0.78 0.18 290)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  );
}

const sections = [
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "cli-reference", label: "CLI Reference" },
  { id: "github-actions", label: "GitHub Actions" },
  { id: "output-formats", label: "Output Formats" },
  { id: "rule-severity", label: "Rule Severity" },
  { id: "contributing", label: "Contributing" },
];

export default function Docs() {
  const [activeSection, setActiveSection] = useState("installation");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar nav */}
            <aside className="hidden lg:block">
              <div
                className="sticky top-24 rounded-xl p-5"
                style={{
                  background: "oklch(0.14 0.022 265 / 0.7)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.15)",
                }}
              >
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  On this page
                </h3>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200"
                      style={{
                        color: activeSection === s.id ? "oklch(0.78 0.18 290)" : "oklch(0.58 0.015 265)",
                        background: activeSection === s.id ? "oklch(0.58 0.22 290 / 0.10)" : "transparent",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-6 pt-5" style={{ borderTop: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
                  <a
                    href="https://github.com/kurtpayne/skillscan-security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs transition-colors duration-200"
                    style={{ color: "oklch(0.50 0.015 265)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.50 0.015 265)")}
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on GitHub
                  </a>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-3 space-y-16">
              {/* Page header */}
              <div>
                <h1
                  className="text-4xl font-bold mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
                >
                  Documentation
                </h1>
                <p className="text-lg" style={{ color: "oklch(0.60 0.015 265)" }}>
                  Everything you need to install, configure, and integrate SkillScan into your security pipeline.
                </p>
              </div>

              {/* Installation */}
              <section id="installation">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
                  Installation
                </h2>
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  SkillScan requires Python 3.12 or higher. Install from PyPI:
                </p>
                <CodeBlock code="pip install skillscan-security" />
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Or install from source for the latest development version:
                </p>
                <CodeBlock code={`git clone https://github.com/kurtpayne/skillscan-security.git
cd skillscan-security
pip install -e ".[dev]"`} />
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Docker image is also available:
                </p>
                <CodeBlock code="docker pull ghcr.io/kurtpayne/skillscan-security:latest" />
              </section>

              {/* Quick Start */}
              <section id="quick-start">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
                  Quick Start
                </h2>
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Scan a directory of skill files and output compact results:
                </p>
                <CodeBlock code="skillscan scan ./skills/" />
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Scan and output SARIF for CI/CD integration:
                </p>
                <CodeBlock code="skillscan scan ./skills/ --format sarif -o results.sarif" />
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Fail the build only on BLOCK-severity findings:
                </p>
                <CodeBlock code="skillscan scan ./skills/ --fail-on block" />
              </section>

              {/* CLI Reference */}
              <section id="cli-reference">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
                  CLI Reference
                </h2>
                <CodeBlock code={`skillscan scan [OPTIONS] PATH

Options:
  --format [compact|sarif|junit]  Output format (default: compact)
  -o, --output PATH               Write output to file
  --fail-on [block|warn|info]     Exit code 1 if findings at this level
  --rules PATH                    Custom rules YAML file
  --exclude PATTERN               Glob pattern to exclude files
  --no-ai                         Disable AI-assisted analysis
  --verbose                       Verbose output
  --help                          Show this message`} />
                <p className="mt-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Exit codes: <code className="code-badge">0</code> = clean scan,{" "}
                  <code className="code-badge">1</code> = findings at or above fail-on threshold,{" "}
                  <code className="code-badge">2</code> = scan error.
                </p>
              </section>

              {/* GitHub Actions */}
              <section id="github-actions">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
                  GitHub Actions
                </h2>
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  SkillScan ships a reusable GitHub Actions workflow. Add it to your repository with a single workflow file:
                </p>
                <CodeBlock code={`# .github/workflows/skillscan.yml
name: SkillScan Security

on: [push, pull_request]

jobs:
  skillscan:
    uses: kurtpayne/skillscan-security/.github/workflows/skillscan-scan.yml@main
    with:
      skill-path: './skills/'
      fail-on: 'block'
      upload-sarif: 'true'
    permissions:
      security-events: write
      contents: read`} lang="yaml" />
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  The workflow supports the following inputs:
                </p>
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}
                >
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: "oklch(0.16 0.022 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                        {["Input", "Default", "Description"].map((h) => (
                          <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: "oklch(0.75 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["skill-path", "'.'", "Path to scan for skill files"],
                        ["fail-on", "'block'", "Severity threshold for non-zero exit"],
                        ["upload-sarif", "'true'", "Upload results to GitHub Security tab"],
                        ["skillscan-version", "'latest'", "PyPI version to install"],
                        ["output-format", "'sarif'", "Output format (sarif, compact, junit)"],
                      ].map(([input, def, desc], i) => (
                        <tr
                          key={input}
                          style={{
                            background: i % 2 === 0 ? "transparent" : "oklch(0.14 0.018 265 / 0.4)",
                            borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)",
                          }}
                        >
                          <td className="px-4 py-3"><code className="code-badge">{input}</code></td>
                          <td className="px-4 py-3"><code className="code-badge">{def}</code></td>
                          <td className="px-4 py-3" style={{ color: "oklch(0.60 0.015 265)" }}>{desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4">
                  <a
                    href="https://github.com/kurtpayne/skillscan-security/blob/main/docs/GITHUB_ACTIONS.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
                    style={{ color: "oklch(0.65 0.18 290)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.18 290)")}
                  >
                    Full GitHub Actions documentation
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </section>

              {/* Output Formats */}
              <section id="output-formats">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
                  Output Formats
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: "compact", desc: "Human-readable terminal output. Best for local development and quick scans.", use: "Local dev, pre-commit hooks" },
                    { name: "sarif", desc: "Static Analysis Results Interchange Format. Integrates with GitHub Security tab, VS Code, and most SAST tools.", use: "GitHub Actions, IDE integration" },
                    { name: "junit", desc: "JUnit XML format. Compatible with Jenkins, SonarQube, and any CI system that consumes test results.", use: "Jenkins, SonarQube, TeamCity" },
                  ].map((fmt) => (
                    <div key={fmt.name} className="glow-card rounded-xl p-5">
                      <code
                        className="text-sm font-bold mb-2 block"
                        style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        --format {fmt.name}
                      </code>
                      <p className="text-sm mb-3" style={{ color: "oklch(0.60 0.015 265)" }}>{fmt.desc}</p>
                      <p className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
                        Best for: {fmt.use}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Rule Severity */}
              <section id="rule-severity">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
                  Rule Severity Levels
                </h2>
                <div className="space-y-3">
                  {[
                    { level: "BLOCK", color: "oklch(0.65 0.22 25)", desc: "Critical finding. The skill file contains a pattern that should prevent deployment. Exit code 1 when --fail-on block (default)." },
                    { level: "WARN", color: "oklch(0.72 0.19 45)", desc: "Suspicious pattern that warrants review. May be a false positive depending on context. Exit code 1 when --fail-on warn." },
                    { level: "INFO", color: "oklch(0.65 0.18 200)", desc: "Informational finding. Pattern is noted but not necessarily malicious. Use for audit trails." },
                  ].map((s) => (
                    <div
                      key={s.level}
                      className="flex items-start gap-4 p-4 rounded-lg"
                      style={{
                        background: "oklch(0.16 0.022 265 / 0.5)",
                        border: `1px solid ${s.color} / 0.20`,
                      }}
                    >
                      <span
                        className="text-xs font-bold px-2 py-1 rounded flex-shrink-0 mt-0.5"
                        style={{
                          background: `${s.color} / 0.15`,
                          color: s.color,
                          fontFamily: "'JetBrains Mono', monospace",
                        }}
                      >
                        {s.level}
                      </span>
                      <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>{s.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Contributing */}
              <section id="contributing">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
                  Contributing
                </h2>
                <p className="mb-4" style={{ color: "oklch(0.65 0.015 265)" }}>
                  SkillScan is open source and welcomes contributions. The most valuable contributions are new detection rules with showcase fixtures and tests.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Add a detection rule", href: "https://github.com/kurtpayne/skillscan-security/blob/main/CONTRIBUTING.md", desc: "Follow the rule metadata spec and add a showcase fixture." },
                    { title: "Report a false positive", href: "https://github.com/kurtpayne/skillscan-security/issues", desc: "Open an issue with the skill file and expected behavior." },
                    { title: "Improve documentation", href: "https://github.com/kurtpayne/skillscan-security", desc: "PRs for docs improvements are always welcome." },
                    { title: "Threat intelligence", href: "https://github.com/kurtpayne/skillscan-security/blob/main/docs/INTEL.md", desc: "Submit new IOCs or vulnerability data to the intel database." },
                  ].map((item) => (
                    <a
                      key={item.title}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glow-card rounded-xl p-5 flex items-start gap-3"
                    >
                      <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.58 0.22 290)" }} />
                      <div>
                        <div className="text-sm font-semibold mb-1" style={{ color: "oklch(0.85 0.01 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                          {item.title}
                        </div>
                        <div className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>{item.desc}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
