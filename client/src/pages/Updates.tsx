/* ============================================================
   UPDATES PAGE — Pattern Updates changelog feed
   Fetches PATTERN_UPDATES.md from GitHub API and renders it
   as a structured changelog with severity badges and metadata.
   ============================================================ */
import { useState, useEffect } from "react";
import { ExternalLink, RefreshCw, AlertTriangle, Shield, Zap, GitCommit, Calendar, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PATTERN_UPDATES_URL =
  "https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/PATTERN_UPDATES.md";
const CHANGELOG_URL =
  "https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/CHANGELOG.md";

interface UpdateEntry {
  date: string;
  version: string;
  rules: string[];
  categories: string[];
  summary: string;
  rawBlock: string;
  severity: "high" | "medium" | "low";
  source: "pattern" | "release";
}

function parseSeverity(block: string): "high" | "medium" | "low" {
  const lower = block.toLowerCase();
  if (lower.includes("block") || lower.includes("mal-") || lower.includes("chn-") || lower.includes("container escape") || lower.includes("exfil")) return "high";
  if (lower.includes("warn") || lower.includes("abu-") || lower.includes("inj-")) return "medium";
  return "low";
}

function extractRules(text: string): string[] {
  const m = text.match(/\b(MAL|ABU|EXF|INJ|CHN|CAP|PINJ|SUP|EXEC|SE|DEF|OBF|PSV|GR|EVASION)-[A-Z]*-?\d{3}\b/g) || [];
  return Array.from(new Set(m));
}

function parsePatternUpdates(markdown: string): UpdateEntry[] {
  const sections = markdown.split(/\n(?=## \d{4}-\d{2}-\d{2})/);
  const entries: UpdateEntry[] = [];
  for (const section of sections) {
    const dateMatch = section.match(/^## (\d{4}-\d{2}-\d{2})/m);
    if (!dateMatch) continue;
    const date = dateMatch[1];
    const versionMatch = section.match(/rulepack[:\s]+([0-9.]+)/i) ||
                         section.match(/`([0-9]{4}\.[0-9]{2}\.[0-9]{2}(?:\.[0-9]+)?)`/);
    const version = versionMatch ? versionMatch[1] : date;
    const rules = extractRules(section);
    const catSet = new Set<string>(); rules.forEach((r) => catSet.add(r.split("-")[0]));
    const lines = section.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("-"));
    const summary = lines[0]?.trim() || "Pattern update — see details below.";
    entries.push({ date, version, rules, categories: Array.from(catSet), summary, rawBlock: section, severity: parseSeverity(section), source: "pattern" });
  }
  return entries;
}

function parseChangelog(markdown: string): UpdateEntry[] {
  const sections = markdown.split(/\n(?=## \[)/);
  const entries: UpdateEntry[] = [];
  for (const section of sections) {
    const headerMatch = section.match(/^## \[([^\]]+)\][^\n]*—[^\n]*(\d{4}-\d{2}-\d{2})/);
    if (!headerMatch) continue;
    const version = headerMatch[1];
    if (version === "Unreleased") continue;
    const date = headerMatch[2];
    const rules = extractRules(section);
    const catSet = new Set<string>(); rules.forEach((r) => catSet.add(r.split("-")[0]));
    let summary = "";
    for (const l of section.split("\n")) {
      const t = l.trim();
      if (!t || t.startsWith("##") || t.startsWith("[")) continue;
      if (t.startsWith("-") || t.startsWith("*")) { summary = t.replace(/^[-*]\s*/, "").replace(/\*\*/g, "").replace(/`/g, ""); break; }
    }
    if (!summary) summary = `Release v${version}`;
    const ruleCountMatch = section.match(/(\d+)\s+total rules/);
    const totalRules = ruleCountMatch ? parseInt(ruleCountMatch[1]) : 0;
    const sev: "high" | "medium" | "low" = totalRules >= 50 ? "high" : totalRules >= 20 ? "medium" : parseSeverity(section);
    entries.push({ date, version: `v${version}`, rules, categories: Array.from(catSet), summary, rawBlock: section, severity: sev, source: "release" });
  }
  return entries;
}

function mergeAndSort(a: UpdateEntry[], b: UpdateEntry[]): UpdateEntry[] {
  return [...a, ...b].sort((x, y) => {
    const d = y.date.localeCompare(x.date);
    if (d !== 0) return d;
    return x.source === "pattern" ? -1 : 1;
  });
}

const SEVERITY_STYLES: Record<string, { label: string; bg: string; text: string; border: string }> = {
  high:   { label: "High Impact", bg: "oklch(0.65 0.22 25 / 0.12)",  text: "oklch(0.75 0.20 25)",  border: "oklch(0.65 0.22 25 / 0.30)" },
  medium: { label: "Medium",      bg: "oklch(0.72 0.19 45 / 0.12)",  text: "oklch(0.78 0.17 45)",  border: "oklch(0.72 0.19 45 / 0.30)" },
  low:    { label: "Maintenance", bg: "oklch(0.58 0.22 290 / 0.12)", text: "oklch(0.70 0.18 290)", border: "oklch(0.58 0.22 290 / 0.30)" },
};

const CATEGORY_COLORS: Record<string, string> = {
  MAL: "oklch(0.65 0.22 25)",
  ABU: "oklch(0.72 0.19 45)",
  EXF: "oklch(0.60 0.20 320)",
  INJ: "oklch(0.65 0.18 200)",
  CHN: "oklch(0.58 0.22 290)",
  CAP: "oklch(0.70 0.15 160)",
  PINJ: "oklch(0.55 0.24 280)",
  SUP: "oklch(0.68 0.16 80)",
  EXEC: "oklch(0.60 0.20 320)",
  SE: "oklch(0.62 0.20 340)",
  DEF: "oklch(0.60 0.18 240)",
  OBF: "oklch(0.58 0.18 270)",
  PSV: "oklch(0.67 0.16 60)",
  GR: "oklch(0.65 0.15 180)",
  EVASION: "oklch(0.60 0.18 160)",
};

function RuleBadge({ rule }: { rule: string }) {
  const cat = rule.split("-")[0];
  const color = CATEGORY_COLORS[cat] || "oklch(0.60 0.015 265)";
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      {rule}
    </span>
  );
}

function UpdateCard({ entry, index }: { entry: UpdateEntry; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const sev = SEVERITY_STYLES[entry.severity];

  // Format the raw block for display — strip the header line
  const bodyLines = entry.rawBlock
    .split("\n")
    .filter((l) => !l.startsWith("## "))
    .join("\n")
    .trim();

  return (
    <div
      className="glow-card rounded-xl p-6 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <GitCommit className="w-4 h-4 flex-shrink-0" style={{ color: entry.source === "release" ? "oklch(0.70 0.15 160)" : "oklch(0.58 0.22 290)" }} />
          <span
            className="font-mono text-sm font-semibold"
            style={{ color: "oklch(0.85 0.01 265)" }}
          >
            {entry.version}
          </span>
          {entry.source === "release" && (
            <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: "oklch(0.70 0.15 160 / 0.12)", color: "oklch(0.70 0.15 160)", border: "1px solid oklch(0.70 0.15 160 / 0.30)" }}>release</span>
          )}
        </div>

        {/* Severity badge */}
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: sev.bg, color: sev.text, border: `1px solid ${sev.border}` }}
        >
          {entry.severity === "high" && <AlertTriangle className="w-3 h-3" />}
          {entry.severity === "medium" && <Shield className="w-3 h-3" />}
          {entry.severity === "low" && <Zap className="w-3 h-3" />}
          {sev.label}
        </span>

        {/* Date */}
        <div className="flex items-center gap-1.5" style={{ color: "oklch(0.50 0.012 265)" }}>
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-xs font-mono">{entry.date.replace(/\.\d+$/, "")}</span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm mb-4 leading-relaxed" style={{ color: "oklch(0.70 0.012 265)" }}>
        {entry.summary}
      </p>

      {/* Rule badges */}
      {entry.rules.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {entry.rules.map((r) => (
            <RuleBadge key={r} rule={r} />
          ))}
        </div>
      )}

      {/* Expand toggle */}
      {bodyLines && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="text-xs transition-colors duration-200"
          style={{ color: "oklch(0.58 0.22 290)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.70 0.18 290)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.58 0.22 290)")}
          aria-expanded={expanded}
          aria-label={expanded ? "Hide update details" : "Show update details"}
        >
          {expanded ? "Hide details ↑" : "Show details ↓"}
        </button>
      )}

      {expanded && bodyLines && (
        <pre
          className="mt-4 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed"
          style={{
            background: "oklch(0.09 0.018 265)",
            border: "1px solid oklch(0.58 0.22 290 / 0.12)",
            color: "oklch(0.65 0.012 265)",
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {bodyLines}
        </pre>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-6 animate-pulse"
          style={{ background: "oklch(0.16 0.022 265 / 0.5)", border: "1px solid oklch(0.58 0.22 290 / 0.10)" }}
        >
          <div className="flex gap-3 mb-4">
            <div className="h-4 w-32 rounded" style={{ background: "oklch(0.22 0.02 265)" }} />
            <div className="h-4 w-20 rounded" style={{ background: "oklch(0.22 0.02 265)" }} />
          </div>
          <div className="h-3 w-full rounded mb-2" style={{ background: "oklch(0.20 0.02 265)" }} />
          <div className="h-3 w-3/4 rounded" style={{ background: "oklch(0.20 0.02 265)" }} />
        </div>
      ))}
    </div>
  );
}

export default function Updates() {
  const [entries, setEntries] = useState<UpdateEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      const [patternRes, changelogRes] = await Promise.all([
        fetch(PATTERN_UPDATES_URL, { cache: "no-cache" }),
        fetch(CHANGELOG_URL, { cache: "no-cache" }),
      ]);
      const patternText = patternRes.ok ? await patternRes.text() : "";
      const changelogText = changelogRes.ok ? await changelogRes.text() : "";
      if (!patternText && !changelogText) throw new Error("Both sources returned errors");
      const merged = mergeAndSort(
        patternText ? parsePatternUpdates(patternText) : [],
        changelogText ? parseChangelog(changelogText) : []
      );
      setEntries(merged);
      setLastFetched(new Date());
    } catch (e) {
      setError("Could not load updates from GitHub. Check your connection or view the files directly.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUpdates(); }, []);

  const totalRules = Array.from(new Set(entries.flatMap((e) => e.rules))).length;
  const highImpact = entries.filter((e) => e.severity === "high").length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Page header */}
        <section
          className="relative py-20 overflow-hidden"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 0%, oklch(0.18 0.04 280 / 0.5) 0%, transparent 70%)",
          }}
        >
          <div className="container">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4" style={{ color: "oklch(0.58 0.22 290)" }} />
                <span className="text-sm font-mono" style={{ color: "oklch(0.58 0.22 290)" }}>
                  PATTERN UPDATES
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.03em" }}
              >
                Release{" "}
                <span className="gradient-text">History</span>
              </h1>
              <p className="text-lg mb-8" style={{ color: "oklch(0.65 0.012 265)" }}>
                Full changelog — major releases and granular rulepack updates merged into a
                single timeline, most recent first.
              </p>

              {/* Stats row */}
              {!loading && entries.length > 0 && (
                <div className="flex flex-wrap gap-6">
                  <div>
                    <div className="text-2xl font-bold font-mono" style={{ color: "oklch(0.85 0.01 265)" }}>
                      {entries.length}
                    </div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.012 265)" }}>update batches</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono" style={{ color: "oklch(0.85 0.01 265)" }}>
                      {totalRules}
                    </div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.012 265)" }}>unique rules added</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono" style={{ color: "oklch(0.75 0.20 25)" }}>
                      {highImpact}
                    </div>
                    <div className="text-xs" style={{ color: "oklch(0.50 0.012 265)" }}>high-impact updates</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-medium" style={{ color: "oklch(0.55 0.012 265)" }}>
                  {loading ? "Loading..." : `${entries.length} entries — most recent first`}
                </h2>
                <div className="flex items-center gap-4">
                  {lastFetched && (
                    <span className="text-xs font-mono" style={{ color: "oklch(0.50 0.012 265)" }}>
                      {entries.length} entries · fetched {lastFetched.toLocaleTimeString()}
                    </span>
                  )}
                  <button
                    onClick={fetchUpdates}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                    style={{
                      background: "oklch(0.20 0.025 265)",
                      border: "1px solid oklch(0.58 0.22 290 / 0.20)",
                      color: "oklch(0.65 0.012 265)",
                    }}
                    aria-label="Refresh updates"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                  <a
                    href="https://github.com/kurtpayne/skillscan-security/blob/main/PATTERN_UPDATES.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs transition-colors duration-200"
                    style={{ color: "oklch(0.58 0.22 290)" }}
                  >
                    View on GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Loading/error/content — announce changes to screen readers */}
              <div aria-live="polite">

              {/* Error state */}
              {error && (
                <div
                  className="rounded-xl p-6 mb-6 flex items-start gap-3"
                  style={{
                    background: "oklch(0.65 0.22 25 / 0.08)",
                    border: "1px solid oklch(0.65 0.22 25 / 0.25)",
                  }}
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.75 0.20 25)" }} />
                  <div>
                    <p className="text-sm font-medium mb-1" style={{ color: "oklch(0.75 0.20 25)" }}>
                      Could not load updates
                    </p>
                    <p className="text-xs" style={{ color: "oklch(0.60 0.012 265)" }}>{error}</p>
                    <a
                      href="https://github.com/kurtpayne/skillscan-security/blob/main/PATTERN_UPDATES.md"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs mt-2"
                      style={{ color: "oklch(0.58 0.22 290)" }}
                    >
                      View on GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Loading skeleton */}
              {loading && <LoadingSkeleton />}

              {/* Update cards */}
              {!loading && !error && (
                <div className="space-y-4">
                  {entries.length === 0 ? (
                    <div className="text-center py-16" style={{ color: "oklch(0.50 0.012 265)" }}>
                      No pattern updates found.
                    </div>
                  ) : (
                    entries.map((entry, i) => (
                      <UpdateCard key={entry.version + entry.date} entry={entry} index={i} />
                    ))
                  )}
                </div>
              )}
              </div>{/* end aria-live */}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
