/* ============================================================
   LINT PAGE — SkillScan Deep Navy Design System
   Sections: Hero, Lint vs Scan vs Trace comparison,
             Filterable rule table (34 rules), CI snippet, CTA
   ============================================================ */
import { useState, useMemo } from "react";
import { Copy, Check, ExternalLink, GitBranch, ChevronRight, Search, Filter, CheckCircle2, AlertTriangle, Info, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      className="p-1.5 rounded transition-all duration-200 flex-shrink-0"
      style={{ color: "oklch(0.60 0.015 265)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.60 0.015 265)")}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.22 0.025 265)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: "1px solid oklch(0.18 0.022 265)" }}
      >
        <span className="text-xs font-mono" style={{ color: "oklch(0.50 0.015 265)" }}>{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-3 text-sm font-mono overflow-x-auto" style={{ color: "oklch(0.88 0.012 265)", lineHeight: "1.6" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

type Severity = "ERROR" | "WARNING" | "INFO";
type Category = "Readability" | "Weasel Words" | "Clarity" | "Completeness" | "Graph";

interface LintRule {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
}

const RULES: LintRule[] = [
  // Readability
  { id: "QL-001", category: "Readability", severity: "WARNING", title: "Long Sentences", description: "Sentences exceeding 35 words. Long sentences reduce scannability for LLM consumers." },
  { id: "QL-002", category: "Readability", severity: "INFO", title: "Passive Voice", description: "Passive constructions: 'is used', 'was created', 'can be configured'. Prefer active voice." },
  { id: "QL-003", category: "Readability", severity: "INFO", title: "Heading Too Long", description: "Skill name or heading exceeds 60 characters." },
  { id: "QL-007", category: "Readability", severity: "INFO", title: "Consecutive Nouns", description: "Three or more consecutive nouns forming a noun stack (e.g. 'skill file path validation')." },
  { id: "QL-017", category: "Readability", severity: "INFO", title: "Nominalisations", description: "Nominalised verbs that add length without clarity: utilisation, implementation, etc." },
  { id: "QL-025", category: "Readability", severity: "INFO", title: "Weak Opener", description: "Description starts with a weak opener: 'This skill…', 'It will…', etc." },
  // Weasel Words
  { id: "QL-004", category: "Weasel Words", severity: "WARNING", title: "Intensifiers", description: "Vague intensifiers: very, really, quite, extremely, incredibly, etc." },
  { id: "QL-005", category: "Weasel Words", severity: "INFO", title: "Hedge Phrases", description: "Hedging language: might, could, perhaps, possibly, arguably, etc." },
  { id: "QL-006", category: "Weasel Words", severity: "WARNING", title: "Filler Phrases", description: "Filler phrases: in order to, due to the fact that, at this point in time, etc." },
  { id: "QL-016", category: "Weasel Words", severity: "WARNING", title: "Superlatives", description: "Superlative claims: best, fastest, most powerful, state-of-the-art, etc." },
  { id: "QL-018", category: "Weasel Words", severity: "INFO", title: "Redundant Phrases", description: "Redundant word pairs: end result, past history, free gift, etc." },
  { id: "QL-019", category: "Weasel Words", severity: "WARNING", title: "Buzzwords", description: "Business buzzwords: synergy, game-changer, leverage, circle back, etc." },
  { id: "QL-020", category: "Weasel Words", severity: "INFO", title: "Vague Quantifiers", description: "Vague quantifiers in descriptions: several, many, various, numerous, etc." },
  // Clarity
  { id: "QL-008", category: "Clarity", severity: "WARNING", title: "Vague Action Verbs", description: "Vague verbs: handle, deal with, manage, process, do, perform, etc." },
  { id: "QL-015", category: "Clarity", severity: "INFO", title: "Ambiguous Pronouns", description: "Ambiguous pronouns (it, this, that, they) without a clear antecedent." },
  { id: "QL-021", category: "Clarity", severity: "WARNING", title: "Undefined Acronyms", description: "Acronyms used without inline expansion (60+ known acronyms whitelisted)." },
  { id: "QL-022", category: "Clarity", severity: "WARNING", title: "Double Negatives", description: "Double negatives: not uncommon, not without, not impossible, etc." },
  // Completeness
  { id: "QL-009", category: "Completeness", severity: "ERROR", title: "Missing Description", description: "No description field found in YAML front-matter. Required for skill discovery." },
  { id: "QL-010", category: "Completeness", severity: "ERROR", title: "Missing Name", description: "No name field found in YAML front-matter. Required for skill registry." },
  { id: "QL-011", category: "Completeness", severity: "WARNING", title: "Missing Version", description: "No version field found in YAML front-matter." },
  { id: "QL-012", category: "Completeness", severity: "INFO", title: "Missing Tags", description: "No tags field found in YAML front-matter." },
  { id: "QL-013", category: "Completeness", severity: "INFO", title: "Description Too Short", description: "Description is fewer than 10 words. Too brief to be useful for LLM consumers." },
  { id: "QL-014", category: "Completeness", severity: "INFO", title: "Description Too Long", description: "Description exceeds 150 words. Consider a shorter summary with a details section." },
  { id: "QL-023", category: "Completeness", severity: "WARNING", title: "Missing Examples", description: "No examples: YAML list and no ## Examples Markdown heading." },
  { id: "QL-024", category: "Completeness", severity: "INFO", title: "Missing Tags Field", description: "No tags: field in YAML front-matter." },
  // Graph
  { id: "GR-001", category: "Graph", severity: "ERROR", title: "Dependency Cycle", description: "A circular dependency chain was detected across two or more skill files." },
  { id: "GR-002", category: "Graph", severity: "ERROR", title: "Dangling Reference", description: "A skill references a dependency that does not exist in the scanned set." },
  { id: "GR-003", category: "Graph", severity: "WARNING", title: "Orphan Skill", description: "A skill is not referenced by any other skill and has no dependents." },
  { id: "GR-004", category: "Graph", severity: "INFO", title: "Hub Skill", description: "A skill is referenced by an unusually high number of other skills (hub node)." },
];

const CATEGORY_COLORS: Record<Category, string> = {
  "Readability": "oklch(0.65 0.18 200)",
  "Weasel Words": "oklch(0.72 0.19 45)",
  "Clarity": "oklch(0.78 0.18 290)",
  "Completeness": "oklch(0.65 0.22 25)",
  "Graph": "oklch(0.60 0.20 320)",
};

const SEVERITY_COLORS: Record<Severity, string> = {
  ERROR: "oklch(0.55 0.22 25)",
  WARNING: "oklch(0.72 0.19 80)",
  INFO: "oklch(0.65 0.18 200)",
};

const SEVERITY_ICONS: Record<Severity, typeof AlertTriangle> = {
  ERROR: AlertTriangle,
  WARNING: AlertTriangle,
  INFO: Info,
};

const CI_SNIPPET = `# .github/workflows/lint.yml
name: Skill Lint
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install skillscan-lint
        run: pip install skillscan-lint
      - name: Lint skills
        run: skillscan-lint ./skills/ --format sarif -o lint-results.sarif
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: lint-results.sarif`;

const COMPARISON = [
  {
    tool: "skillscan-lint",
    what: "Quality & completeness",
    how: "Static text analysis of SKILL.md front-matter and body",
    when: "Every commit — fast, no API key",
    cost: "Free",
    color: "oklch(0.65 0.18 200)",
  },
  {
    tool: "skillscan scan",
    what: "Security threats",
    how: "147 static rules + ML classifier on skill content",
    when: "Every PR — still fast, no API key",
    cost: "Free",
    color: "oklch(0.72 0.19 45)",
  },
  {
    tool: "skillscan-trace",
    what: "Behavioral safety",
    how: "Live LLM execution against canary server",
    when: "Pre-publish — slower, BYOK",
    cost: "Your LLM tokens",
    color: "oklch(0.78 0.18 290)",
  },
];

const ALL_CATEGORIES: Category[] = ["Readability", "Weasel Words", "Clarity", "Completeness", "Graph"];
const ALL_SEVERITIES: Severity[] = ["ERROR", "WARNING", "INFO"];

export default function LintPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [activeSeverity, setActiveSeverity] = useState<Severity | "All">("All");

  const filtered = useMemo(() => {
    return RULES.filter((r) => {
      const matchesSearch =
        search === "" ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || r.category === activeCategory;
      const matchesSeverity = activeSeverity === "All" || r.severity === activeSeverity;
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [search, activeCategory, activeSeverity]);

  const counts = useMemo(() => ({
    ERROR: RULES.filter((r) => r.severity === "ERROR").length,
    WARNING: RULES.filter((r) => r.severity === "WARNING").length,
    INFO: RULES.filter((r) => r.severity === "INFO").length,
  }), []);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.025 265)", color: "oklch(0.95 0.005 265)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, oklch(0.65 0.18 200) 0%, transparent 70%)" }}
          />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "oklch(0.65 0.18 200 / 0.12)", border: "1px solid oklch(0.65 0.18 200 / 0.25)", color: "oklch(0.75 0.18 200)" }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Quality Linting — Phase 0 of SkillScan
            </div>
            <h1
              className="text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
            >
              Write skills that{" "}
              <span style={{ color: "oklch(0.75 0.18 200)" }}>communicate clearly</span>
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.70 0.012 265)" }}>
              <strong style={{ color: "oklch(0.88 0.012 265)" }}>skillscan-lint</strong> checks your SKILL.md for readability, completeness, and structural quality — before security scanning, before behavioral tracing. {RULES.length} rules covering front-matter, prose quality, and dependency graphs.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/kurtpayne/skillscan-lint"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
                style={{ background: "oklch(0.65 0.18 200)", color: "oklch(0.10 0.018 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.58 0.18 200)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.65 0.18 200)")}
              >
                <GitBranch className="w-4 h-4" />
                View on GitHub
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
              <a
                href="#rules"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
                style={{ background: "oklch(0.18 0.022 265)", border: "1px solid oklch(0.28 0.025 265)", color: "oklch(0.88 0.012 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.65 0.18 200 / 0.5)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.28 0.025 265)")}
              >
                Browse rules
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-8">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Total rules", value: RULES.length.toString(), color: "oklch(0.65 0.18 200)" },
              { label: "ERROR", value: counts.ERROR.toString(), color: "oklch(0.55 0.22 25)" },
              { label: "WARNING", value: counts.WARNING.toString(), color: "oklch(0.72 0.19 80)" },
              { label: "INFO", value: counts.INFO.toString(), color: "oklch(0.65 0.18 200)" },
              { label: "Categories", value: ALL_CATEGORIES.length.toString(), color: "oklch(0.78 0.18 290)" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold" style={{ color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.012 265)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Lint vs. Scan vs. Trace
            </h2>
            <p className="text-sm mb-8" style={{ color: "oklch(0.60 0.012 265)" }}>
              The three tools are complementary layers, not alternatives. Run all three for a complete picture.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid oklch(0.22 0.025 265)" }}>
                    {["Tool", "Checks for", "Method", "When to run", "Cost"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "oklch(0.50 0.015 265)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: "1px solid oklch(0.18 0.022 265)" }}
                    >
                      <td className="py-3 px-4">
                        <code className="font-mono text-xs font-semibold" style={{ color: row.color }}>{row.tool}</code>
                      </td>
                      <td className="py-3 px-4" style={{ color: "oklch(0.80 0.010 265)" }}>{row.what}</td>
                      <td className="py-3 px-4" style={{ color: "oklch(0.65 0.010 265)" }}>{row.how}</td>
                      <td className="py-3 px-4" style={{ color: "oklch(0.65 0.010 265)" }}>{row.when}</td>
                      <td className="py-3 px-4" style={{ color: "oklch(0.65 0.010 265)" }}>{row.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── CI Snippet ── */}
      <section className="py-8">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Add to CI in 30 seconds
            </h2>
            <p className="text-sm mb-6" style={{ color: "oklch(0.60 0.012 265)" }}>
              Results appear in the GitHub Security tab via SARIF upload. No tokens, no configuration.
            </p>
            <CodeBlock code={CI_SNIPPET} lang="yaml" />
          </div>
        </div>
      </section>

      {/* ── Rule Table ── */}
      <section id="rules" className="py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              All {RULES.length} lint rules
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Search */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1 min-w-48"
                style={{ background: "oklch(0.16 0.022 265)", border: "1px solid oklch(0.24 0.025 265)" }}
              >
                <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "oklch(0.50 0.015 265)" }} />
                <input
                  type="text"
                  placeholder="Search rules..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1"
                  style={{ color: "oklch(0.88 0.012 265)" }}
                />
              </div>

              {/* Category filter */}
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => setActiveCategory("All")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: activeCategory === "All" ? "oklch(0.28 0.025 265)" : "oklch(0.16 0.022 265)",
                    border: "1px solid oklch(0.24 0.025 265)",
                    color: activeCategory === "All" ? "oklch(0.92 0.008 265)" : "oklch(0.60 0.012 265)",
                  }}
                >
                  All
                </button>
                {ALL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: activeCategory === cat ? `${CATEGORY_COLORS[cat].replace(")", " / 0.15)")}` : "oklch(0.16 0.022 265)",
                      border: `1px solid ${activeCategory === cat ? CATEGORY_COLORS[cat].replace(")", " / 0.35)") : "oklch(0.24 0.025 265)"}`,
                      color: activeCategory === cat ? CATEGORY_COLORS[cat] : "oklch(0.60 0.012 265)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Severity filter */}
              <div className="flex gap-1.5">
                {ALL_SEVERITIES.map((sev) => {
                  const Icon = SEVERITY_ICONS[sev];
                  return (
                    <button
                      key={sev}
                      onClick={() => setActiveSeverity(activeSeverity === sev ? "All" : sev)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: activeSeverity === sev ? `${SEVERITY_COLORS[sev].replace(")", " / 0.15)")}` : "oklch(0.16 0.022 265)",
                        border: `1px solid ${activeSeverity === sev ? SEVERITY_COLORS[sev].replace(")", " / 0.35)") : "oklch(0.24 0.025 265)"}`,
                        color: activeSeverity === sev ? SEVERITY_COLORS[sev] : "oklch(0.60 0.012 265)",
                      }}
                    >
                      <Icon className="w-3 h-3" />
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Results count */}
            <div className="text-xs mb-4" style={{ color: "oklch(0.50 0.012 265)" }}>
              Showing {filtered.length} of {RULES.length} rules
            </div>

            {/* Rule rows */}
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="text-center py-12" style={{ color: "oklch(0.50 0.012 265)" }}>
                  No rules match your filters.
                </div>
              ) : (
                filtered.map((rule) => {
                  const SevIcon = SEVERITY_ICONS[rule.severity];
                  return (
                    <div
                      key={rule.id}
                      className="flex items-start gap-3 p-4 rounded-lg transition-all duration-150"
                      style={{
                        background: "oklch(0.15 0.022 265)",
                        border: "1px solid oklch(0.20 0.022 265)",
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.28 0.025 265)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.20 0.022 265)")}
                    >
                      <SevIcon
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: SEVERITY_COLORS[rule.severity] }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <code className="text-xs font-mono font-semibold" style={{ color: "oklch(0.65 0.18 200)" }}>{rule.id}</code>
                          <span className="text-sm font-semibold" style={{ color: "oklch(0.92 0.008 265)" }}>{rule.title}</span>
                          <span
                            className="text-xs px-1.5 py-0.5 rounded"
                            style={{
                              background: `${CATEGORY_COLORS[rule.category].replace(")", " / 0.12)")}`,
                              color: CATEGORY_COLORS[rule.category],
                              border: `1px solid ${CATEGORY_COLORS[rule.category].replace(")", " / 0.25)")}`,
                            }}
                          >
                            {rule.category}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: "oklch(0.62 0.010 265)" }}>{rule.description}</p>
                      </div>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0"
                        style={{
                          background: `${SEVERITY_COLORS[rule.severity].replace(")", " / 0.12)")}`,
                          color: SEVERITY_COLORS[rule.severity],
                        }}
                      >
                        {rule.severity}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
            >
              Quality first, security second
            </h2>
            <p className="mb-8" style={{ color: "oklch(0.65 0.012 265)" }}>
              A well-written skill is easier to audit. Start with lint, then layer in security scanning and behavioral tracing.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/kurtpayne/skillscan-lint"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                style={{ background: "oklch(0.65 0.18 200)", color: "oklch(0.10 0.018 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.58 0.18 200)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.65 0.18 200)")}
              >
                <GitBranch className="w-4 h-4" />
                skillscan-lint on GitHub
              </a>
              <a
                href="/trace"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                style={{ background: "oklch(0.18 0.022 265)", border: "1px solid oklch(0.28 0.025 265)", color: "oklch(0.88 0.012 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.65 0.18 200 / 0.5)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.28 0.025 265)")}
              >
                <Zap className="w-4 h-4" />
                Next: Behavioral Tracing →
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
