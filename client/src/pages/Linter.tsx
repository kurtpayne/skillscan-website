/* ============================================================
   LINTER PAGE — SkillScan Deep Navy Design System
   Sections: Hero, Rule Reference Table, Vale Integration,
             Config (.skillscan-lint.toml), VS Code Extension,
             Install CTA
   Design: Deep navy (#0d0f1a), purple accent oklch(0.58 0.22 290),
           Space Grotesk headings, JetBrains Mono code, Inter body
   ============================================================ */
import { useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Settings,
  Code2,
  Puzzle,
  AlertTriangle,
  Info,
  XCircle,
  Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Rule data ──────────────────────────────────────────────────────────────

type Severity = "ERROR" | "WARNING" | "INFO";
type Category = "Readability" | "Weasel Words" | "Clarity" | "Completeness" | "Graph";

interface Rule {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
}

const ALL_RULES: Rule[] = [
  // Readability
  { id: "QL-001", category: "Readability", severity: "INFO", title: "Passive Voice", description: "Flags passive-voice constructions that reduce clarity and directness." },
  { id: "QL-002", category: "Readability", severity: "INFO", title: "Long Sentence", description: "Sentences exceeding the configured word limit (default: 35 words)." },
  { id: "QL-003", category: "Readability", severity: "INFO", title: "Heading Too Long", description: "Skill name or heading exceeds 60 characters." },
  { id: "QL-004", category: "Weasel Words", severity: "WARNING", title: "Intensifiers", description: "Vague intensifiers: very, really, quite, extremely, incredibly, etc." },
  { id: "QL-005", category: "Weasel Words", severity: "INFO", title: "Hedge Phrases", description: "Hedging language: might, could, perhaps, possibly, arguably, etc." },
  { id: "QL-006", category: "Weasel Words", severity: "WARNING", title: "Filler Phrases", description: "Filler phrases: in order to, due to the fact that, at this point in time, etc." },
  { id: "QL-007", category: "Readability", severity: "INFO", title: "Consecutive Nouns", description: "Three or more consecutive nouns forming a noun stack (e.g. 'skill file path validation')." },
  { id: "QL-008", category: "Clarity", severity: "WARNING", title: "Vague Action Verbs", description: "Vague verbs: handle, deal with, manage, process, do, perform, etc." },
  { id: "QL-009", category: "Completeness", severity: "ERROR", title: "Missing Description", description: "No description field found in YAML front-matter." },
  { id: "QL-010", category: "Completeness", severity: "ERROR", title: "Missing Name", description: "No name field found in YAML front-matter." },
  { id: "QL-011", category: "Completeness", severity: "WARNING", title: "Missing Version", description: "No version field found in YAML front-matter." },
  { id: "QL-012", category: "Completeness", severity: "INFO", title: "Missing Tags", description: "No tags field found in YAML front-matter." },
  { id: "QL-013", category: "Completeness", severity: "INFO", title: "Description Too Short", description: "Description is fewer than the configured minimum words (default: 10)." },
  { id: "QL-014", category: "Completeness", severity: "INFO", title: "Description Too Long", description: "Description exceeds the configured maximum words (default: 150)." },
  { id: "QL-015", category: "Clarity", severity: "INFO", title: "Ambiguous Pronouns", description: "Ambiguous pronouns (it, this, that, they) without a clear antecedent." },
  // New rules (QL-016 to QL-025)
  { id: "QL-016", category: "Weasel Words", severity: "WARNING", title: "Superlatives", description: "Superlative claims: best, fastest, most powerful, state-of-the-art, etc." },
  { id: "QL-017", category: "Readability", severity: "INFO", title: "Nominalisations", description: "Nominalised verbs that add length without clarity: utilisation, implementation, etc." },
  { id: "QL-018", category: "Weasel Words", severity: "INFO", title: "Redundant Phrases", description: "Redundant word pairs: end result, past history, free gift, etc." },
  { id: "QL-019", category: "Weasel Words", severity: "WARNING", title: "Buzzwords", description: "Business buzzwords: synergy, game-changer, leverage, circle back, etc." },
  { id: "QL-020", category: "Weasel Words", severity: "INFO", title: "Vague Quantifiers", description: "Vague quantifiers in descriptions: several, many, various, numerous, etc." },
  { id: "QL-021", category: "Clarity", severity: "WARNING", title: "Undefined Acronyms", description: "Acronyms used without inline expansion (60+ known acronyms whitelisted)." },
  { id: "QL-022", category: "Clarity", severity: "WARNING", title: "Double Negatives", description: "Double negatives: not uncommon, not without, not impossible, etc." },
  { id: "QL-023", category: "Completeness", severity: "WARNING", title: "Missing Examples", description: "No examples: YAML list and no ## Examples Markdown heading." },
  { id: "QL-024", category: "Completeness", severity: "INFO", title: "Missing Tags Field", description: "No tags: field in YAML front-matter." },
  { id: "QL-025", category: "Readability", severity: "INFO", title: "Weak Opener", description: "Description starts with a weak opener: 'This skill…', 'It will…', etc." },
  // Graph rules
  { id: "GR-001", category: "Graph", severity: "ERROR", title: "Dependency Cycle", description: "A circular dependency chain was detected across two or more skill files." },
  { id: "GR-002", category: "Graph", severity: "ERROR", title: "Dangling Reference", description: "A skill references a dependency that does not exist in the scanned set." },
  { id: "GR-003", category: "Graph", severity: "WARNING", title: "Orphan Skill", description: "A skill is not referenced by any other skill and has no dependents." },
  { id: "GR-004", category: "Graph", severity: "INFO", title: "Hub Skill", description: "A skill is referenced by an unusually high number of other skills (hub node)." },
];

const CATEGORIES: Category[] = ["Readability", "Weasel Words", "Clarity", "Completeness", "Graph"];

const CATEGORY_COLORS: Record<Category, string> = {
  "Readability": "oklch(0.65 0.18 200)",
  "Weasel Words": "oklch(0.72 0.19 45)",
  "Clarity": "oklch(0.58 0.22 290)",
  "Completeness": "oklch(0.70 0.15 160)",
  "Graph": "oklch(0.65 0.22 25)",
};

const SEVERITY_CONFIG: Record<Severity, { color: string; icon: typeof CheckCircle2; label: string }> = {
  ERROR: { color: "oklch(0.65 0.22 25)", icon: XCircle, label: "ERROR" },
  WARNING: { color: "oklch(0.72 0.19 45)", icon: AlertTriangle, label: "WARN" },
  INFO: { color: "oklch(0.65 0.18 200)", icon: Info, label: "INFO" },
};

// ── Copy button ────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded transition-all duration-200"
      style={{ color: "oklch(0.55 0.015 265)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.55 0.015 265)")}
      aria-label="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

// ── Code block ────────────────────────────────────────────────────────────

function CodeBlock({ code, lang = "" }: { code: string; lang?: string }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "oklch(0.58 0.22 290 / 0.12)" }}>
        <span className="text-xs" style={{ color: "oklch(0.45 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="p-4 text-xs overflow-x-auto" style={{ color: "oklch(0.72 0.015 265)", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.7 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

export default function Linter() {
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRules = ALL_RULES.filter((r) => {
    const matchCat = selectedCategory === "All" || r.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || r.id.toLowerCase().includes(q) || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.11 0.018 265)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-28 pb-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
        <div className="container max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: "oklch(0.58 0.22 290 / 0.12)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>
            <FileText className="w-3 h-3" />
            skillscan-lint
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)", letterSpacing: "-0.02em" }}>
            Skill File Quality Linter
          </h1>
          <p className="text-lg mb-8 max-w-2xl" style={{ color: "oklch(0.62 0.015 265)", lineHeight: 1.7 }}>
            25 quality rules across 5 categories — readability, weasel words, clarity, completeness, and graph integrity.
            Runs offline, integrates with Vale for inline editor feedback, and is configurable via <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 290)" }}>.skillscan-lint.toml</code>.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="https://github.com/kurtpayne/skillscan-lint" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold btn-primary-glow">
              View on GitHub <ExternalLink className="w-4 h-4" />
            </a>
            <a href="#rules" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.85 0.01 265)" }}>
              Browse Rules <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Quick install ── */}
      <section className="py-12" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "1", label: "Install", code: "pip install skillscan-lint" },
              { step: "2", label: "Scan a skill file", code: "skillscan-lint scan ./skills/" },
              { step: "3", label: "Configure (optional)", code: "skillscan-lint config" },
            ].map(({ step, label, code }) => (
              <div key={step} className="rounded-xl p-5" style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: "oklch(0.58 0.22 290 / 0.20)", color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>
                    {step}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: "oklch(0.85 0.01 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{label}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-md" style={{ background: "oklch(0.09 0.018 265)" }}>
                  <code className="text-xs flex-1 truncate" style={{ color: "oklch(0.72 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>{code}</code>
                  <CopyButton text={code} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rule Reference ── */}
      <section id="rules" className="py-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5" style={{ color: "oklch(0.58 0.22 290)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
              Rule Reference
            </h2>
          </div>
          <p className="mb-8 text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>
            {ALL_RULES.length} rules total. Severity can be overridden per-rule in <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.72 0.18 290)" }}>.skillscan-lint.toml</code>.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "oklch(0.45 0.015 265)" }} />
              <input
                type="text"
                placeholder="Search rules…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                style={{
                  background: "oklch(0.14 0.022 265)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.20)",
                  color: "oklch(0.85 0.01 265)",
                  fontFamily: "'Inter', sans-serif",
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["All", ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category | "All")}
                  className="px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                  style={{
                    background: selectedCategory === cat ? "oklch(0.58 0.22 290 / 0.20)" : "oklch(0.14 0.022 265)",
                    border: `1px solid ${selectedCategory === cat ? "oklch(0.58 0.22 290 / 0.50)" : "oklch(0.58 0.22 290 / 0.15)"}`,
                    color: selectedCategory === cat ? "oklch(0.78 0.18 290)" : "oklch(0.60 0.015 265)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "oklch(0.13 0.022 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                  {["Rule ID", "Category", "Severity", "Title", "Description"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif", letterSpacing: "0.05em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRules.map((rule, i) => {
                  const sev = SEVERITY_CONFIG[rule.severity];
                  const SevIcon = sev.icon;
                  const catColor = CATEGORY_COLORS[rule.category];
                  return (
                    <tr
                      key={rule.id}
                      style={{
                        background: i % 2 === 0 ? "oklch(0.12 0.018 265)" : "oklch(0.11 0.018 265)",
                        borderBottom: "1px solid oklch(0.58 0.22 290 / 0.06)",
                      }}
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-bold" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>
                          {rule.id}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${catColor} / 0.12`, color: catColor, fontFamily: "'Inter', sans-serif" }}>
                          {rule.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold" style={{ color: sev.color, fontFamily: "'JetBrains Mono', monospace" }}>
                          <SevIcon className="w-3 h-3" />
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-xs" style={{ color: "oklch(0.82 0.01 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                        {rule.title}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif", maxWidth: "320px" }}>
                        {rule.description}
                      </td>
                    </tr>
                  );
                })}
                {filteredRules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: "oklch(0.45 0.015 265)" }}>
                      No rules match your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Vale Integration ── */}
      <section id="vale" className="py-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <Code2 className="w-5 h-5" style={{ color: "oklch(0.58 0.22 290)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
              Vale Integration
            </h2>
          </div>
          <p className="mb-8 text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>
            SkillScan ships 10 Vale styles that mirror the QL rules, enabling inline editor feedback in VS Code and CI prose checks without running the full linter.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "oklch(0.82 0.01 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Quick setup
              </h3>
              <CodeBlock lang=".vale.ini" code={`StylesPath = vale/styles
MinAlertLevel = suggestion

[*.md]
BasedOnStyles = SkillScan`} />
              <p className="mt-3 text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
                The <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.72 0.18 290)" }}>vale/styles/SkillScan/</code> directory is included in the repo root.
                Install the <a href="https://marketplace.visualstudio.com/items?itemName=ChrisChinchilla.vale-vscode" target="_blank" rel="noopener noreferrer" style={{ color: "oklch(0.65 0.18 200)" }}>Vale VS Code extension</a> for inline squiggles.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3" style={{ color: "oklch(0.82 0.01 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                Included styles
              </h3>
              <div className="space-y-2">
                {[
                  { style: "WeaselIntensifiers", mirrors: "QL-004", level: "warning" },
                  { style: "WeaselHedges", mirrors: "QL-005", level: "suggestion" },
                  { style: "WeaselFillers", mirrors: "QL-006", level: "warning" },
                  { style: "VagueActions", mirrors: "QL-008", level: "warning" },
                  { style: "PassiveVoice", mirrors: "QL-003", level: "suggestion" },
                  { style: "Superlatives", mirrors: "QL-016", level: "warning" },
                  { style: "Nominalisations", mirrors: "QL-017", level: "suggestion" },
                  { style: "RedundantPhrases", mirrors: "QL-018", level: "suggestion" },
                  { style: "Buzzwords", mirrors: "QL-019", level: "warning" },
                  { style: "DoubleNegatives", mirrors: "QL-022", level: "warning" },
                ].map(({ style, mirrors, level }) => (
                  <div key={style} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
                    style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
                    <code style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>SkillScan/{style}</code>
                    <div className="flex items-center gap-3">
                      <span style={{ color: "oklch(0.50 0.015 265)" }}>→ {mirrors}</span>
                      <span className="px-1.5 py-0.5 rounded text-xs" style={{
                        background: level === "warning" ? "oklch(0.72 0.19 45 / 0.12)" : "oklch(0.65 0.18 200 / 0.12)",
                        color: level === "warning" ? "oklch(0.72 0.19 45)" : "oklch(0.65 0.18 200)",
                      }}>{level}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Config ── */}
      <section id="config" className="py-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-5 h-5" style={{ color: "oklch(0.58 0.22 290)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
              Configuration
            </h2>
          </div>
          <p className="mb-8 text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>
            Place a <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 290)" }}>.skillscan-lint.toml</code> file in your repo root (or any parent directory).
            The linter walks up from the scanned path to find it automatically.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <CodeBlock lang=".skillscan-lint.toml" code={`[rules]
# Disable rules globally
disable = ["QL-003", "QL-007"]

[rules.overrides]
# Promote or demote individual rule severity
"QL-017" = "error"
"QL-004" = "info"

[thresholds]
# Tune numeric thresholds
max_sentence_length = 30
min_description_words = 15
max_description_words = 120

[graph]
skip_graph = false

[output]
format = "compact"   # compact | json | sarif | junit
fail_on = "warning"  # error | warning | info`} />
            </div>
            <div className="space-y-4">
              {[
                { key: "[rules]", desc: "disable — list of rule IDs to suppress entirely across all files." },
                { key: "[rules.overrides]", desc: "Map of rule ID → new severity. Accepts error, warning, or info." },
                { key: "[thresholds]", desc: "Numeric knobs for word-count and sentence-length rules. Defaults are provisional — tune to your corpus." },
                { key: "[graph]", desc: "skip_graph = true disables all GR-* graph integrity checks. Useful for single-file scans." },
                { key: "[output]", desc: "Default output format and fail-on threshold. CLI flags override these values." },
              ].map(({ key, desc }) => (
                <div key={key} className="p-4 rounded-lg" style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
                  <code className="text-xs font-bold block mb-1" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{key}</code>
                  <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)", fontFamily: "'Inter', sans-serif" }}>{desc}</p>
                </div>
              ))}
              <div className="p-4 rounded-lg" style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
                <code className="text-xs font-bold block mb-1" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>skillscan-lint config</code>
                <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)", fontFamily: "'Inter', sans-serif" }}>
                  Prints the resolved config as JSON — useful for debugging discovery and verifying overrides are applied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VS Code Extension ── */}
      <section id="vscode" className="py-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <Puzzle className="w-5 h-5" style={{ color: "oklch(0.58 0.22 290)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
              VS Code Extension
            </h2>
          </div>
          <p className="mb-2 text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>
            The SkillScan Security extension runs both <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 290)" }}>skillscan</code> and <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 290)" }}>skillscan-lint</code> on every save,
            merging their SARIF output into a single diagnostic stream. Security findings and quality findings appear side-by-side in the Problems panel, each tagged with its source tool.
          </p>
          <p className="mb-8 text-sm" style={{ color: "oklch(0.45 0.015 265)" }}>
            Quality lint is optional: if <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>skillscan-lint</code> is not installed, a one-time notification is shown and security diagnostics continue normally.
            Both tools produce SARIF 2.1.0 — the same format used by GitHub Code Scanning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { icon: CheckCircle2, title: "Security + quality in one install", desc: "Both skillscan (security) and skillscan-lint (quality) run on save. Findings from each tool are labeled with their source so you can distinguish prompt injection warnings from weasel word notices." },
              { icon: Settings, title: "Respects both config files", desc: "The extension reads .skillscan-lint.toml automatically. Disabled rules and severity overrides are reflected in real time. Security rules path is configurable separately." },
              { icon: Code2, title: "SARIF 2.1.0 output", desc: "Both tools emit SARIF 2.1.0. The same output format used by GitHub Advanced Security — enabling direct upload to Code Scanning from CI." },
              { icon: FileText, title: "Quick fixes (coming soon)", desc: "One-click fixes for common issues: remove filler phrases, add missing YAML fields, expand undefined acronyms." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl" style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.58 0.22 290 / 0.15)" }}>
                  <Icon className="w-4 h-4" style={{ color: "oklch(0.78 0.18 290)" }} />
                </div>
                <div>
                  <div className="text-sm font-semibold mb-1" style={{ color: "oklch(0.85 0.01 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Inter', sans-serif" }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-6 mb-4" style={{ background: "oklch(0.14 0.022 265)", border: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "oklch(0.82 0.01 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
              Install the combined extension
            </h3>
            <p className="text-xs mb-4" style={{ color: "oklch(0.45 0.015 265)" }}>The SkillScan Security extension includes lint integration. Install both Python tools, then install the extension from source.</p>
            <CodeBlock lang="bash" code={`# Install both tools
pip install skillscan-security skillscan-lint

# Build and install the VS Code extension
git clone https://github.com/kurtpayne/skillscan-security
cd skillscan-security/editors/vscode
npm install && npm run package
code --install-extension skillscan-security-*.vsix`} />
            <p className="mt-4 text-xs" style={{ color: "oklch(0.45 0.015 265)" }}>
              Marketplace listing is in progress. In the meantime, install locally via <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>vsce package</code>.
              The standalone <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>skillscan-vscode</code> extension (lint-only) is also available for teams that only need quality checks.
            </p>
          </div>
        </div>
      </section>

      {/* ── CI Integration ── */}
      <section id="ci" className="py-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
        <div className="container max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: "oklch(0.58 0.22 290)" }} />
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}>
              CI Integration
            </h2>
          </div>
          <p className="mb-6 text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>
            Both tools produce SARIF 2.1.0 output. Run them together in CI and upload findings to GitHub Code Scanning for inline PR annotations.
          </p>
          <CodeBlock lang=".github/workflows/skillscan.yml" code={`name: SkillScan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install skillscan-security skillscan-lint

      # Security scan — blocks on high/critical findings
      - run: skillscan scan ./skills/ --format sarif -o security.sarif

      # Quality lint — warns on style issues
      - run: skillscan-lint scan ./skills/ --format sarif --fail-on never -o lint.sarif

      # Upload both to GitHub Code Scanning
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: security.sarif
          category: skillscan-security
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: lint.sarif
          category: skillscan-lint`} />
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24">
        <div className="container max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
            Better skill files start here
          </h2>
          <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: "oklch(0.60 0.015 265)" }}>
            Open source, MIT licensed, zero telemetry. Install in 10 seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://github.com/kurtpayne/skillscan-lint" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold btn-primary-glow">
              Get skillscan-lint <ExternalLink className="w-4 h-4" />
            </a>
            <a href="#rules" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{ background: "oklch(0.18 0.025 265)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.85 0.01 265)" }}>
              Browse all 25 rules
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
