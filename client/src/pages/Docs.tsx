/* ============================================================
   DOCS PAGE — SkillScan CLI Reference (man-page quality)
   Design: Deep Navy system, violet accent
   Sections: Installation, Quick Start, User Journey, CLI Reference,
             Docker, GitHub Actions, Output Formats, Policy Profiles,
             Suppression, Custom Rules, Feedback
   ============================================================ */
import { useState } from "react";
import { ExternalLink, Copy, Check, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div
      className="relative rounded-xl overflow-hidden mb-4"
      style={{ border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          background: "oklch(0.14 0.022 265)",
          borderBottom: "1px solid oklch(0.58 0.22 290 / 0.12)",
        }}
      >
        <span className="text-xs" style={{ color: "oklch(0.45 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>
          {lang}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs transition-colors duration-200"
          style={{ color: copied ? "oklch(0.70 0.15 160)" : "oklch(0.50 0.015 265)" }}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className="p-4 overflow-x-auto text-xs"
        style={{
          background: "oklch(0.09 0.018 265)",
          color: "oklch(0.78 0.18 290)",
          fontFamily: "'JetBrains Mono', monospace",
          margin: 0,
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl font-bold mb-5"
      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
    >
      {children}
    </h2>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-base font-semibold mt-7 mb-3"
      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.82 0.005 265)" }}
    >
      {children}
    </h3>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 leading-relaxed text-sm" style={{ color: "oklch(0.65 0.015 265)" }}>
      {children}
    </p>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="px-1.5 py-0.5 rounded text-xs"
      style={{
        background: "oklch(0.58 0.22 290 / 0.12)",
        color: "oklch(0.78 0.18 290)",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {children}
    </code>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg px-4 py-3 mb-4 text-sm"
      style={{
        background: "oklch(0.58 0.22 290 / 0.08)",
        border: "1px solid oklch(0.58 0.22 290 / 0.20)",
        color: "oklch(0.68 0.015 265)",
      }}
    >
      {children}
    </div>
  );
}

const sections = [
  { id: "installation", label: "Installation" },
  { id: "quick-start", label: "Quick Start" },
  { id: "user-journey", label: "User Journey" },
  { id: "scan", label: "scan" },
  { id: "update", label: "update" },
  { id: "model", label: "model" },
  { id: "intel", label: "intel" },
  { id: "rule", label: "rule" },
  { id: "policy", label: "policy" },
  { id: "suppress", label: "suppress" },
  { id: "benchmark", label: "benchmark" },
  { id: "docker", label: "Docker" },
  { id: "github-actions", label: "GitHub Actions" },
  { id: "output-formats", label: "Output Formats" },
  { id: "policy-profiles", label: "Policy Profiles" },
  { id: "suppression-format", label: "Suppression Files" },
  { id: "custom-rules", label: "Custom Rules" },
  { id: "customization", label: "Customization" },
  { id: "feedback", label: "Feedback" },
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
                <nav className="space-y-0.5">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className="w-full text-left px-3 py-1.5 rounded-md text-xs transition-all duration-200"
                      style={{
                        color: activeSection === s.id ? "oklch(0.78 0.18 290)" : "oklch(0.55 0.015 265)",
                        background: activeSection === s.id ? "oklch(0.58 0.22 290 / 0.10)" : "transparent",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </nav>
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
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
                  <a
                    href="https://github.com/kurtpayne/skillscan-security/issues/new/choose"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs mt-2 transition-colors duration-200"
                    style={{ color: "oklch(0.50 0.015 265)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.50 0.015 265)")}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Report an issue
                  </a>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:col-span-3 space-y-14">
              {/* Page header */}
              <div>
                <h1
                  className="text-4xl font-bold mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
                >
                  Documentation
                </h1>
                <p className="text-base" style={{ color: "oklch(0.60 0.015 265)" }}>
                  Complete reference for installing, configuring, and integrating SkillScan into your security pipeline.
                  All detection runs offline — no network calls at scan time.
                </p>
              </div>

              {/* ── INSTALLATION ── */}
              <section id="installation">
                <SectionTitle>Installation</SectionTitle>
                <Prose>SkillScan requires Python 3.11 or higher. Install from PyPI:</Prose>
                <CodeBlock code="pip install skillscan-security" />
                <Prose>Install from source (latest development version):</Prose>
                <CodeBlock code={`git clone https://github.com/kurtpayne/skillscan-security.git
cd skillscan-security
pip install -e ".[dev]"`} />
                <Prose>Docker image (includes ClamAV for binary artifact scanning):</Prose>
                <CodeBlock code={`docker pull kurtpayne/skillscan:latest
docker run --rm -v $(pwd)/skills:/skills kurtpayne/skillscan:latest scan /skills`} />
                <Prose>Verify installation:</Prose>
                <CodeBlock code="skillscan version" />
              </section>

              {/* ── QUICK START ── */}
              <section id="quick-start">
                <SectionTitle>Quick Start</SectionTitle>
                <Prose>Scan a directory of skill files:</Prose>
                <CodeBlock code="skillscan scan ./skills/" />
                <Prose>Scan with the ML classifier enabled (downloads model on first run):</Prose>
                <CodeBlock code={`skillscan model install          # one-time download (~350 MB)
skillscan scan ./skills/ --ml-detect`} />
                <Prose>Update rules, intel DB, and model in one command:</Prose>
                <CodeBlock code="skillscan update" />
                <Prose>Output SARIF for GitHub Security tab upload:</Prose>
                <CodeBlock code="skillscan scan ./skills/ --format sarif -o results.sarif" />
                <Note>
                  Exit codes: <InlineCode>0</InlineCode> = clean scan &nbsp;·&nbsp;{" "}
                  <InlineCode>1</InlineCode> = findings at or above policy threshold &nbsp;·&nbsp;{" "}
                  <InlineCode>2</InlineCode> = scan error
                </Note>
              </section>

              {/* ── USER JOURNEY ── */}
              <section id="user-journey">
                <SectionTitle>User Journey</SectionTitle>
                <Prose>
                  This section walks through a complete workflow from first install to CI/CD integration,
                  including the ML model, custom rules, and suppression files.
                </Prose>

                <SubTitle>1. Install and run your first scan</SubTitle>
                <CodeBlock code={`pip install skillscan-security
skillscan scan ./skills/
# verdict=allow  score=0    findings=0  search_tool.md
# verdict=block  score=180  findings=1  data_processor.md
#   - CHN-001 [critical/critical] Download+execute chain @ data_processor.md
# verdict=block  exit=1`} />

                <SubTitle>2. Install the ML model</SubTitle>
                <Prose>
                  The ML classifier (DeBERTa-v3 + LoRA, F1 0.9752) catches semantic attacks and novel jailbreaks
                  that static rules cannot express. It runs entirely offline via ONNX Runtime.
                </Prose>
                <CodeBlock code={`skillscan model install          # downloads from HuggingFace Hub (~350 MB)
skillscan model status           # shows installed version vs Hub latest
skillscan scan ./skills/ --ml-detect`} />

                <SubTitle>3. Keep everything current</SubTitle>
                <CodeBlock code={`skillscan update                 # rules + intel DB + model
skillscan update --no-model      # rules + intel DB only (faster for CI)`} />

                <SubTitle>4. Choose a policy profile</SubTitle>
                <Prose>
                  Policy profiles control which severity levels trigger a block verdict and what the exit code threshold is.
                  The default profile is <InlineCode>strict</InlineCode>.
                </Prose>
                <CodeBlock code={`skillscan policy list            # show available profiles
skillscan scan ./skills/ --policy ci          # CI-optimized: blocks on critical only
skillscan scan ./skills/ --policy enterprise  # enterprise: blocks on high+critical`} />

                <SubTitle>5. Suppress known false positives</SubTitle>
                <CodeBlock code={`# Create a suppression file
cat > .skillscan-suppress.yaml << 'EOF'
suppressions:
  - rule: SE-SEM-001
    file: analytics.md
    reason: "Reviewed 2026-03-25 — urgency language is legitimate product copy"
    expires: "2026-09-25"
EOF

skillscan scan ./skills/   # SE-SEM-001 on analytics.md is now suppressed`} />

                <SubTitle>6. Add custom rules</SubTitle>
                <CodeBlock code={`# Create a custom rule file
cat > my-rules.yaml << 'EOF'
rules:
  - id: CUSTOM-001
    name: Internal API Key Exposure
    description: Detects hardcoded internal API key patterns
    severity: critical
    pattern: "sk-internal-[a-zA-Z0-9]{32}"
    tags: [secrets, custom]
EOF

skillscan scan ./skills/ --rules my-rules.yaml`} />

                <SubTitle>7. Test a custom rule</SubTitle>
                <CodeBlock code={`skillscan rule test --rules my-rules.yaml --fixture path/to/test.md
# Runs the rule against the fixture and shows match/no-match result`} />

                <SubTitle>8. Compare against a baseline</SubTitle>
                <CodeBlock code={`# Save a baseline
skillscan scan ./skills/ --format json -o baseline.json

# Later: compare current scan against baseline
skillscan scan ./skills/ --baseline baseline.json
# Shows only new findings since the baseline was taken`} />

                <SubTitle>9. Integrate with CI/CD</SubTitle>
                <Prose>See the <a href="#github-actions" className="underline" style={{ color: "oklch(0.78 0.18 290)" }}>GitHub Actions</a> section for a complete workflow example.</Prose>
              </section>

              {/* ── SCAN ── */}
              <section id="scan">
                <SectionTitle>skillscan scan</SectionTitle>
                <Prose>Scan one or more skill files or directories. The primary command.</Prose>
                <CodeBlock code={`skillscan scan [OPTIONS] PATH [PATH...]

Arguments:
  PATH                    File or directory to scan (repeatable)

Options:
  --format [compact|text|sarif|junit|json]
                          Output format (default: compact)
  -o, --output PATH       Write output to file instead of stdout
  --policy PROFILE        Policy profile: strict|ci|balanced|permissive|enterprise|observe
                          (default: strict)
  --rules PATH            Additional custom rules YAML file
  --ml-detect             Enable ML classifier (requires model install)
  --no-model              Disable ML classifier even if installed
  --graph                 Enable skill graph analysis (PSV rules)
  --baseline PATH         Compare against a previous JSON scan report
  --no-suppress           Ignore suppression files for this run
  --no-provenance         Omit provenance meta block from JSON output
  --exclude PATTERN       Glob pattern to exclude files (repeatable)
  --verbose               Verbose output
  --help                  Show this message`} />

                <SubTitle>Real scan output — compact format</SubTitle>
                <Prose>
                  The compact format is the default. Each line shows verdict, score, finding count, and file.
                  Findings are indented below the verdict line.
                </Prose>
                <CodeBlock code={`$ skillscan scan ./skills/

verdict=allow  score=0    findings=0  search_tool.md
verdict=warn   score=35   findings=1  analytics.md
  - SE-SEM-001 [high/critical] Credential-harvest pattern @ analytics.md
verdict=block  score=180  findings=1  data_processor.md
  - CHN-001 [critical/critical] Download+execute chain @ data_processor.md
verdict=block  score=70   findings=1  injector.md
  - PINJ-001 [high/high] Prompt override / jailbreak @ injector.md:1

verdict=block  score=285  findings=3  exit=1`} />

                <SubTitle>JSON output with provenance block</SubTitle>
                <CodeBlock code={`$ skillscan scan ./skills/ --format json | python3 -m json.tool

{
  "meta": {
    "scanner_version": "2026.03.25.2",
    "rules_sha": "a3f9c2...",
    "model_version": "v18161-5ep",
    "policy_profile": "strict",
    "scanned_at": "2026-03-25T22:15:00Z"
  },
  "verdict": "block",
  "score": 285,
  "findings": [
    {
      "rule": "CHN-001",
      "severity": "critical",
      "file": "data_processor.md",
      "line": 12,
      "message": "Download+execute chain"
    }
  ]
}`} lang="json" />
              </section>

              {/* ── UPDATE ── */}
              <section id="update">
                <SectionTitle>skillscan update</SectionTitle>
                <Prose>Pull the latest rules, intel DB, and ML model in one command. The recommended way to stay current.</Prose>
                <CodeBlock code={`skillscan update                 # rules + intel DB + model (if installed)
skillscan update --no-model      # rules + intel DB only`} />
                <Note>
                  <InlineCode>update</InlineCode> checks the rules SHA against the upstream repo before downloading.
                  If the SHA matches, no download occurs. Intel sources registered via{" "}
                  <InlineCode>intel add --url</InlineCode> are re-fetched automatically.
                </Note>
              </section>

              {/* ── MODEL ── */}
              <section id="model">
                <SectionTitle>skillscan model</SectionTitle>
                <CodeBlock code={`skillscan model install          # download ONNX adapter from HuggingFace (~350 MB)
skillscan model install --force  # re-download even if already installed
skillscan model install --repo kurtpayne/skillscan-deberta-adapter
                                 # install from a specific HF repo
skillscan model status           # show installed version vs Hub latest`} />
                <Prose>
                  The model is a DeBERTa-v3-base adapter fine-tuned via LoRA on 18,161 skill file examples.
                  It runs entirely offline via ONNX Runtime. No GPU required.
                  See the <a href="/model" className="underline" style={{ color: "oklch(0.78 0.18 290)" }}>Model page</a> for full architecture and evaluation details.
                </Prose>
              </section>

              {/* ── INTEL ── */}
              <section id="intel">
                <SectionTitle>skillscan intel</SectionTitle>
                <CodeBlock code={`skillscan intel list             # show registered intel sources
skillscan intel add --url URL    # register a remote intel feed (JSON or YAML)
skillscan intel remove NAME      # remove a registered source
skillscan intel lookup INDICATOR # look up an IOC in the local intel DB
skillscan intel status           # show DB size and last-updated timestamp`} />
                <Note>
                  Intel sources registered with <InlineCode>intel add --url</InlineCode> are re-fetched automatically
                  on every <InlineCode>skillscan update</InlineCode> run. The built-in DB ships with 5,507 IOCs
                  and 63 vulnerable packages.
                </Note>
              </section>

              {/* ── RULE ── */}
              <section id="rule">
                <SectionTitle>skillscan rule</SectionTitle>
                <CodeBlock code={`skillscan rule list              # list all loaded rules with IDs and severity
skillscan rule status            # show bundled vs user-local rule versions
skillscan rule test --rules PATH --fixture PATH
                                 # test a custom rule against a fixture file`} />
              </section>

              {/* ── POLICY ── */}
              <section id="policy">
                <SectionTitle>skillscan policy</SectionTitle>
                <CodeBlock code={`skillscan policy list            # list all available profiles
skillscan policy show-default    # show the active default policy YAML`} />
                <Prose>
                  See <a href="#policy-profiles" className="underline" style={{ color: "oklch(0.78 0.18 290)" }}>Policy Profiles</a> for
                  a description of each built-in profile.
                </Prose>
              </section>

              {/* ── SUPPRESS ── */}
              <section id="suppress">
                <SectionTitle>skillscan suppress</SectionTitle>
                <CodeBlock code={`skillscan suppress list          # list all active suppressions
skillscan suppress check         # validate suppression file format`} />
                <Prose>
                  Suppressions are managed by editing <InlineCode>.skillscan-suppress.yaml</InlineCode> directly.
                  See <a href="#suppression-format" className="underline" style={{ color: "oklch(0.78 0.18 290)" }}>Suppression Files</a> for the format.
                </Prose>
              </section>

              {/* ── BENCHMARK ── */}
              <section id="benchmark">
                <SectionTitle>skillscan benchmark</SectionTitle>
                <CodeBlock code={`skillscan benchmark              # run benchmark against built-in fixtures
skillscan benchmark --verbose    # show per-fixture pass/fail results`} />
                <Prose>
                  The benchmark runs the scanner against a set of known-malicious and known-benign fixtures
                  and reports precision, recall, and F1. Useful for validating custom rules and policy changes.
                </Prose>
              </section>

              {/* ── DOCKER ── */}
              <section id="docker">
                <SectionTitle>Docker</SectionTitle>
                <Prose>
                  The official Docker image includes ClamAV for binary artifact scanning and ships with the
                  latest rules and intel DB baked in. The ML model is not included by default (add{" "}
                  <InlineCode>--ml-detect</InlineCode> and mount a model volume if needed).
                </Prose>

                <SubTitle>Basic scan</SubTitle>
                <CodeBlock code={`docker run --rm \\
  -v $(pwd)/skills:/skills \\
  kurtpayne/skillscan:latest \\
  scan /skills`} />

                <SubTitle>SARIF output</SubTitle>
                <CodeBlock code={`docker run --rm \\
  -v $(pwd)/skills:/skills \\
  -v $(pwd)/results:/results \\
  kurtpayne/skillscan:latest \\
  scan /skills --format sarif -o /results/results.sarif`} />

                <SubTitle>With suppression file</SubTitle>
                <CodeBlock code={`docker run --rm \\
  -v $(pwd)/skills:/skills \\
  -v $(pwd)/.skillscan-suppress.yaml:/.skillscan-suppress.yaml \\
  kurtpayne/skillscan:latest \\
  scan /skills`} />

                <SubTitle>With ML model</SubTitle>
                <CodeBlock code={`# First: download the model to a local volume
docker run --rm \\
  -v skillscan-model:/root/.skillscan \\
  kurtpayne/skillscan:latest \\
  model install

# Then: scan with ML detection
docker run --rm \\
  -v $(pwd)/skills:/skills \\
  -v skillscan-model:/root/.skillscan \\
  kurtpayne/skillscan:latest \\
  scan /skills --ml-detect`} />

                <SubTitle>Specific version</SubTitle>
                <CodeBlock code="docker pull kurtpayne/skillscan:v2026.03.25" />
              </section>

              {/* ── GITHUB ACTIONS ── */}
              <section id="github-actions">
                <SectionTitle>GitHub Actions</SectionTitle>
                <Prose>
                  Add SkillScan to your CI/CD pipeline to block malicious skills before merge.
                  The example below uploads SARIF results to the GitHub Security tab.
                </Prose>
                <CodeBlock code={`name: SkillScan Security

on:
  push:
    branches: [main]
  pull_request:
    paths:
      - 'skills/**'
      - '**/*.md'

jobs:
  skillscan:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      contents: read

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install SkillScan
        run: pip install skillscan-security

      - name: Run SkillScan
        run: |
          skillscan scan ./skills/ \\
            --format sarif \\
            --policy ci \\
            -o results.sarif

      - name: Upload SARIF to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif`} lang="yaml" />

                <SubTitle>With ML model (cached)</SubTitle>
                <CodeBlock code={`      - name: Cache SkillScan model
        uses: actions/cache@v4
        with:
          path: ~/.skillscan
          key: skillscan-model-v18161

      - name: Install model (if not cached)
        run: skillscan model install

      - name: Run SkillScan with ML
        run: |
          skillscan scan ./skills/ \\
            --ml-detect \\
            --format sarif \\
            --policy ci \\
            -o results.sarif`} lang="yaml" />

                <SubTitle>Baseline comparison (PR workflow)</SubTitle>
                <CodeBlock code={`      - name: Scan main branch baseline
        if: github.event_name == 'pull_request'
        run: |
          git fetch origin main
          git stash
          skillscan scan ./skills/ --format json -o baseline.json
          git stash pop

      - name: Scan PR changes against baseline
        if: github.event_name == 'pull_request'
        run: |
          skillscan scan ./skills/ \\
            --baseline baseline.json \\
            --format sarif \\
            -o results.sarif`} lang="yaml" />
              </section>

              {/* ── OUTPUT FORMATS ── */}
              <section id="output-formats">
                <SectionTitle>Output Formats</SectionTitle>

                <SubTitle>compact (default)</SubTitle>
                <Prose>Human-readable. One line per file, findings indented below. Ideal for local development.</Prose>
                <CodeBlock code={`verdict=allow  score=0    findings=0  search_tool.md
verdict=block  score=180  findings=1  data_processor.md
  - CHN-001 [critical/critical] Download+execute chain @ data_processor.md:12

verdict=block  score=180  findings=1  exit=1`} />

                <SubTitle>text</SubTitle>
                <Prose>Verbose human-readable output with full finding details, provenance block, and summary table.</Prose>

                <SubTitle>sarif</SubTitle>
                <Prose>
                  Static Analysis Results Interchange Format (SARIF 2.1.0). Uploads directly to the GitHub Security tab
                  via <InlineCode>github/codeql-action/upload-sarif</InlineCode>. Also compatible with VS Code SARIF viewer,
                  Azure DevOps, and most enterprise SAST platforms.
                </Prose>

                <SubTitle>junit</SubTitle>
                <Prose>JUnit XML format. Compatible with Jenkins, SonarQube, and most CI/CD dashboards.</Prose>

                <SubTitle>json</SubTitle>
                <Prose>
                  Machine-readable JSON with full finding details and a provenance meta block (scanner version, rules SHA,
                  model version, policy profile, timestamp). Use with <InlineCode>--baseline</InlineCode> for delta comparisons.
                  Suppress the provenance block with <InlineCode>--no-provenance</InlineCode>.
                </Prose>
              </section>

              {/* ── POLICY PROFILES ── */}
              <section id="policy-profiles">
                <SectionTitle>Policy Profiles</SectionTitle>
                <Prose>
                  Policy profiles control which severity levels trigger a block verdict and what the exit code threshold is.
                  All profiles are inspectable YAML files — run <InlineCode>skillscan policy show-default</InlineCode> to see
                  the active profile.
                </Prose>

                <div className="overflow-x-auto mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                        {["Profile", "Block threshold", "Warn threshold", "Use case"].map((h) => (
                          <th key={h} className="text-left py-3 pr-6 text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.55 0.015 265)" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { profile: "strict", block: "high+", warn: "medium+", use: "Default. Recommended for production skill registries." },
                        { profile: "ci", block: "critical only", warn: "high+", use: "CI/CD pipelines where false positives break builds." },
                        { profile: "balanced", block: "high+", warn: "low+", use: "General-purpose. More verbose than strict." },
                        { profile: "permissive", block: "critical only", warn: "high+", use: "Low-noise. For mature pipelines with established baselines." },
                        { profile: "enterprise", block: "high+", warn: "medium+", use: "Like strict, but with additional enterprise-specific rules enabled." },
                        { profile: "observe", block: "never", warn: "all", use: "Audit mode. Never fails the build. Useful for initial rollout." },
                      ].map((row) => (
                        <tr key={row.profile} style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
                          <td className="py-3 pr-6 font-mono text-xs" style={{ color: "oklch(0.78 0.18 290)" }}>{row.profile}</td>
                          <td className="py-3 pr-6 text-xs" style={{ color: "oklch(0.65 0.015 265)" }}>{row.block}</td>
                          <td className="py-3 pr-6 text-xs" style={{ color: "oklch(0.65 0.015 265)" }}>{row.warn}</td>
                          <td className="py-3 text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>{row.use}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <CodeBlock code={`# Use a built-in profile
skillscan scan ./skills/ --policy ci

# Use a custom policy file
skillscan scan ./skills/ --policy ./my-policy.yaml`} />
              </section>

              {/* ── SUPPRESSION FILES ── */}
              <section id="suppression-format">
                <SectionTitle>Suppression Files</SectionTitle>
                <Prose>
                  Suppress known false positives by creating a <InlineCode>.skillscan-suppress.yaml</InlineCode> file
                  in your project root. SkillScan auto-discovers this file on every scan.
                </Prose>
                <CodeBlock code={`# .skillscan-suppress.yaml
suppressions:
  - rule: SE-SEM-001
    file: analytics.md
    reason: "Reviewed 2026-03-25 — urgency language is legitimate product copy"
    expires: "2026-09-25"

  - rule: EXF-007
    file: webhook_tool.md
    reason: "Outbound webhook is intentional product feature, reviewed by security team"
    # no expires = permanent suppression`} lang="yaml" />

                <Note>
                  Suppressions without an <InlineCode>expires</InlineCode> field are permanent.
                  Expired suppressions are ignored but not removed — they appear in{" "}
                  <InlineCode>skillscan suppress list</InlineCode> with an EXPIRED status.
                  Use <InlineCode>--no-suppress</InlineCode> to run a scan ignoring all suppressions.
                </Note>
              </section>

              {/* ── CUSTOM RULES ── */}
              <section id="custom-rules">
                <SectionTitle>Custom Rules</SectionTitle>
                <Prose>
                  Add organization-specific detection rules by passing a custom YAML file to{" "}
                  <InlineCode>--rules</InlineCode>. Custom rules are additive — they run alongside the built-in rules.
                </Prose>
                <CodeBlock code={`# my-rules.yaml
rules:
  - id: CUSTOM-001
    name: Internal API Key Exposure
    description: Detects hardcoded internal API key patterns
    severity: critical
    pattern: "sk-internal-[a-zA-Z0-9]{32}"
    tags: [secrets, custom]

  - id: CUSTOM-002
    name: Internal Domain Reference
    description: Flags references to internal infrastructure domains
    severity: high
    pattern: "\\.internal\\.example\\.com"
    tags: [infra, custom]`} lang="yaml" />

                <SubTitle>Test a custom rule</SubTitle>
                <CodeBlock code={`# Create a fixture file
echo "Use sk-internal-abc123def456ghi789jkl012mno345pq to authenticate" > test.md

# Test the rule
skillscan rule test --rules my-rules.yaml --fixture test.md
# CUSTOM-001 matched: sk-internal-... @ test.md:1`} />

                <SubTitle>Run with custom rules</SubTitle>
                <CodeBlock code="skillscan scan ./skills/ --rules my-rules.yaml" />

                <Note>
                  Custom rules use the same YAML schema as built-in rules. See{" "}
                  <a
                    href="https://github.com/kurtpayne/skillscan-security/blob/main/docs/custom-rules-format.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: "oklch(0.78 0.18 290)" }}
                  >
                    docs/custom-rules-format.md
                  </a>{" "}
                  for the full schema including chain rules, multilang rules, and AST flow rules.
                </Note>
              </section>

              {/* ── CUSTOMIZATION ── */}
              <section id="customization">
                <SectionTitle>Customization</SectionTitle>
                <Prose>
                  Every detection layer except the ML classifier is configurable. The table below summarizes
                  what you can change and how. The ML model (Layer 6) is intentionally fixed — see the
                  callout at the bottom of this section.
                </Prose>

                <div className="overflow-x-auto rounded-xl mb-6" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: "oklch(0.14 0.022 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: "oklch(0.72 0.19 290)", fontFamily: "'Space Grotesk', sans-serif" }}>Layer</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: "oklch(0.72 0.19 290)", fontFamily: "'Space Grotesk', sans-serif" }}>What you can change</th>
                        <th className="text-left px-4 py-3 font-semibold" style={{ color: "oklch(0.72 0.19 290)", fontFamily: "'Space Grotesk', sans-serif" }}>How</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { layer: "Static rules", what: "Add, override, or disable any pattern", how: "--rules my-rules.yaml  |  # skillscan-suppress: RULE-ID" },
                        { layer: "Policy profiles", what: "Fail threshold, severity mapping", how: "--policy strict|ci|paranoid|audit|minimal" },
                        { layer: "Chain rules", what: "Multi-signal correlation logic", how: "chain_rules block in custom YAML" },
                        { layer: "Vuln / IOC DB", what: "CVE and IOC entries", how: "skillscan intel update" },
                        { layer: "Lint rules", what: "Style and quality checks", how: ".skillscan-lint.toml in project root" },
                        { layer: "Output format", what: "SARIF, JUnit, compact text, JSON", how: "--format sarif|junit|text|json" },
                        { layer: "Fail threshold", what: "When to exit non-zero", how: "--fail-on block|warn|info" },
                      ].map((row, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)", background: i % 2 === 0 ? "oklch(0.11 0.018 265)" : "oklch(0.13 0.020 265)" }}>
                          <td className="px-4 py-3" style={{ color: "oklch(0.78 0.12 290)", fontFamily: "'JetBrains Mono', monospace" }}>{row.layer}</td>
                          <td className="px-4 py-3" style={{ color: "oklch(0.75 0.010 265)" }}>{row.what}</td>
                          <td className="px-4 py-3" style={{ color: "oklch(0.62 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>{row.how}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <SubTitle>Policy profiles</SubTitle>
                <Prose>Five built-in profiles cover the most common deployment contexts:</Prose>
                <CodeBlock code={`skillscan scan ./skills/ --policy strict    # fail on warn+
skillscan scan ./skills/ --policy ci        # fail on block only (default for CI)
skillscan scan ./skills/ --policy paranoid  # fail on info+, stricter ML threshold
skillscan scan ./skills/ --policy audit     # never fail, always emit full report
skillscan scan ./skills/ --policy minimal   # static rules only, no ML`} />

                <SubTitle>Inline suppression</SubTitle>
                <Prose>
                  Suppress a specific rule on a specific line by adding a comment immediately above it.
                  Suppressed findings are recorded in the provenance block of JSON output so they remain auditable.
                </Prose>
                <CodeBlock code={`# skillscan-suppress: MAL-001
export ADMIN_TOKEN="placeholder-replaced-at-runtime"`} lang="yaml" />

                <SubTitle>Project-level suppression file</SubTitle>
                <Prose>
                  Suppress rules across an entire project using a <InlineCode>.skillscan-suppress</InlineCode> file at the repo root:
                </Prose>
                <CodeBlock code={`# .skillscan-suppress
# Format: RULE-ID  path/to/file.md  optional reason
MAL-001  skills/legacy-tool.md  Known false positive - token is a placeholder
EXF-003  skills/analytics.md    Intentional telemetry, reviewed 2026-03-01`} />

                <SubTitle>Community rule contributions</SubTitle>
                <Prose>
                  New detection patterns submitted via GitHub issues are reviewed and, if accepted, added to
                  the static rule layer. They do not affect the ML model. Use the corpus-submission issue
                  template to provide a rule ID, pattern, severity, and at least one fixture file.
                </Prose>
                <div className="mb-4">
                  <a
                    href="https://github.com/kurtpayne/skillscan-security/issues/new?template=corpus-submission.yml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200"
                    style={{
                      background: "oklch(0.58 0.22 290 / 0.12)",
                      border: "1px solid oklch(0.58 0.22 290 / 0.25)",
                      color: "oklch(0.78 0.18 290)",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.50)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.25)")}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Submit a pattern via GitHub Issues
                  </a>
                </div>

                <div
                  className="rounded-xl p-5 flex gap-4 items-start"
                  style={{ background: "oklch(0.12 0.025 265 / 0.6)", border: "1px solid oklch(0.65 0.22 25 / 0.30)" }}
                >
                  <Lock className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.72 0.22 25)" }} />
                  <div>
                    <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.88 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Layer 6 — ML Classifier is intentionally fixed</p>
                    <p className="text-xs leading-relaxed" style={{ color: "oklch(0.58 0.015 265)" }}>
                      The DeBERTa-v3 + LoRA model is a frozen ONNX artifact. Its weights cannot be overridden
                      by rules or policy files. This is by design: the model provides a detection signal that
                      is independent of your local configuration, making it resistant to evasion by a skill
                      author who knows your rule set. The model is retrained periodically as the corpus grows;
                      updates are distributed via <InlineCode>skillscan model update</InlineCode>.
                    </p>
                    <a
                      href="/model"
                      className="inline-flex items-center gap-1 text-xs mt-2 font-semibold"
                      style={{ color: "oklch(0.72 0.22 25)" }}
                    >
                      View model card <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </section>

              {/* ── FEEDBACK ── */}
              <section id="feedback">
                <SectionTitle>Feedback & Bug Reports</SectionTitle>
                <Prose>
                  Found a false positive or false negative? Have a feature request? Want to contribute a skill sample to improve the model? All feedback goes through GitHub Issues.
                </Prose>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "False positive (FP)",
                      desc: "A benign skill was flagged incorrectly.",
                      url: "https://github.com/kurtpayne/skillscan-security/issues/new?template=false-positive.md",
                    },
                    {
                      title: "False negative (FN)",
                      desc: "A malicious skill was not detected.",
                      url: "https://github.com/kurtpayne/skillscan-security/issues/new?template=false-negative.md",
                    },
                    {
                      title: "Bug report",
                      desc: "Something is broken or behaving unexpectedly.",
                      url: "https://github.com/kurtpayne/skillscan-security/issues/new?template=bug-report.md",
                    },
                    {
                      title: "Feature request",
                      desc: "Suggest a new detection rule, command, or integration.",
                      url: "https://github.com/kurtpayne/skillscan-security/issues/new?template=feature-request.md",
                    },
                    {
                      title: "Corpus submission",
                      desc: "Submit a skill sample (benign or malicious) to help improve the ML model. Accepted samples are added to the training corpus, not the static rule layer.",
                      url: "https://github.com/kurtpayne/skillscan-security/issues/new?template=corpus-submission.yml",
                    },
                  ].map((item) => (
                    <a
                      key={item.title}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-xl p-5 transition-all duration-200"
                      style={{
                        background: "oklch(0.14 0.022 265)",
                        border: "1px solid oklch(0.58 0.22 290 / 0.18)",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.40)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.18)")}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold" style={{ color: "oklch(0.88 0.005 265)" }}>{item.title}</span>
                        <ExternalLink className="w-3.5 h-3.5" style={{ color: "oklch(0.50 0.015 265)" }} />
                      </div>
                      <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>{item.desc}</p>
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
