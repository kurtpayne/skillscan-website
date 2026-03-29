/* ============================================================
   FEED PAGE — SkillScan Deep Navy Design System
   Live demo feed — fetches /demo-feed.json (written weekly by
   the demo-feed.yml GitHub Actions workflow).
   ============================================================ */
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
  GitBranch,
  Loader2,
  Radio,
  XCircle,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TopFinding {
  rule_id: string;
  title: string;
  severity: string;
  confidence: string;
}

interface FeedEntry {
  id: string;
  demo_title: string;
  demo_description: string;
  label: string;
  archetype: string;
  rule_id: string;
  reference: string;
  verdict: "BLOCK" | "ALLOW" | "WARN" | "ERROR";
  expected_verdict: string;
  verdict_match: boolean;
  severity: string;
  findings_count: number;
  top_findings: TopFinding[];
  error?: string;
  scanned_at: string;
}

interface FeedData {
  generated_at: string;
  skillscan_version: string;
  entry_count: number;
  block_count: number;
  allow_count: number;
  error_count: number;
  unexpected_count: number;
  entries: FeedEntry[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FEED_URL = "/demo-feed.json";

function verdictColor(v: string) {
  if (v === "BLOCK") return "oklch(0.65 0.22 25)";
  if (v === "ALLOW") return "oklch(0.65 0.18 145)";
  if (v === "WARN") return "oklch(0.72 0.18 70)";
  return "oklch(0.65 0.015 265)";
}

function verdictBg(v: string) {
  if (v === "BLOCK") return "oklch(0.65 0.22 25 / 0.12)";
  if (v === "ALLOW") return "oklch(0.65 0.18 145 / 0.12)";
  if (v === "WARN") return "oklch(0.72 0.18 70 / 0.12)";
  return "oklch(0.58 0.015 265 / 0.12)";
}

function verdictBorder(v: string) {
  if (v === "BLOCK") return "oklch(0.65 0.22 25 / 0.25)";
  if (v === "ALLOW") return "oklch(0.65 0.18 145 / 0.25)";
  if (v === "WARN") return "oklch(0.72 0.18 70 / 0.25)";
  return "oklch(0.58 0.015 265 / 0.20)";
}

function VerdictIcon({ verdict }: { verdict: string }) {
  if (verdict === "BLOCK") return <XCircle className="w-4 h-4" style={{ color: verdictColor(verdict) }} />;
  if (verdict === "ALLOW") return <CheckCircle className="w-4 h-4" style={{ color: verdictColor(verdict) }} />;
  return <AlertTriangle className="w-4 h-4" style={{ color: verdictColor(verdict) }} />;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  } catch {
    return iso;
  }
}

function formatRelative(iso: string) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "today";
    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(iso);
  } catch {
    return iso;
  }
}

// ---------------------------------------------------------------------------
// Entry card
// ---------------------------------------------------------------------------

function EntryCard({ entry }: { entry: FeedEntry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        background: "oklch(0.13 0.022 265)",
        border: `1px solid ${verdictBorder(entry.verdict)}`,
      }}
    >
      {/* Header row */}
      <button
        className="w-full text-left p-5 flex items-start gap-4"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        {/* Verdict badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-0.5"
          style={{
            background: verdictBg(entry.verdict),
            border: `1px solid ${verdictBorder(entry.verdict)}`,
            color: verdictColor(entry.verdict),
          }}
        >
          <VerdictIcon verdict={entry.verdict} />
          {entry.verdict}
        </div>

        {/* Title + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="font-semibold text-sm leading-snug"
              style={{ color: "oklch(0.92 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {entry.demo_title}
            </span>
            {entry.archetype && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: "oklch(0.58 0.22 290 / 0.10)",
                  color: "oklch(0.72 0.15 290)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.18)",
                }}
              >
                {entry.archetype.replace(/_/g, " ")}
              </span>
            )}
          </div>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: "oklch(0.58 0.012 265)" }}>
            {entry.demo_description}
          </p>
        </div>

        {/* Expand toggle */}
        <div className="flex-shrink-0 mt-0.5" style={{ color: "oklch(0.50 0.012 265)" }}>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-5 pb-5 pt-0 space-y-4"
          style={{ borderTop: "1px solid oklch(0.20 0.025 265)" }}
        >
          {/* Findings */}
          {entry.top_findings.length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: "oklch(0.72 0.015 265)" }}>
                Top findings ({entry.findings_count} total)
              </p>
              <div className="space-y-1.5">
                {entry.top_findings.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs px-3 py-2 rounded-lg"
                    style={{ background: "oklch(0.16 0.025 265)" }}
                  >
                    <span
                      className="font-mono font-semibold flex-shrink-0"
                      style={{ color: "oklch(0.78 0.18 290)" }}
                    >
                      {f.rule_id}
                    </span>
                    <span className="flex-1" style={{ color: "oklch(0.75 0.012 265)" }}>
                      {f.title}
                    </span>
                    {f.severity && (
                      <span
                        className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs font-medium uppercase"
                        style={{
                          background:
                            f.severity === "CRITICAL" || f.severity === "HIGH"
                              ? "oklch(0.65 0.22 25 / 0.15)"
                              : "oklch(0.65 0.18 70 / 0.15)",
                          color:
                            f.severity === "CRITICAL" || f.severity === "HIGH"
                              ? "oklch(0.72 0.20 25)"
                              : "oklch(0.72 0.18 70)",
                        }}
                      >
                        {f.severity}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {entry.error && (
            <div
              className="text-xs px-3 py-2 rounded-lg"
              style={{
                background: "oklch(0.65 0.22 25 / 0.08)",
                border: "1px solid oklch(0.65 0.22 25 / 0.20)",
                color: "oklch(0.72 0.18 25)",
              }}
            >
              Error: {entry.error}
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-4 text-xs" style={{ color: "oklch(0.50 0.010 265)" }}>
            {entry.rule_id && (
              <span>
                Rule:{" "}
                <span className="font-mono" style={{ color: "oklch(0.65 0.015 265)" }}>
                  {entry.rule_id}
                </span>
              </span>
            )}
            <span>Scanned {formatRelative(entry.scanned_at)}</span>
            {entry.reference && (
              <a
                href={entry.reference}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
                style={{ color: "oklch(0.72 0.15 290)" }}
                onClick={(e) => e.stopPropagation()}
              >
                Reference <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function Feed() {
  const [data, setData] = useState<FeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "BLOCK" | "ALLOW" | "WARN">("all");

  useEffect(() => {
    fetch(FEED_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: FeedData) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const filtered = data
    ? filter === "all"
      ? data.entries
      : data.entries.filter((e) => e.verdict === filter)
    : [];

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.10 0.020 265)", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: "oklch(0.58 0.22 290 / 0.12)",
              border: "1px solid oklch(0.58 0.22 290 / 0.25)",
              color: "oklch(0.78 0.18 290)",
            }}
          >
            <Radio className="w-3 h-3" />
            Live demo feed
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
          >
            Public Scan Feed
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "oklch(0.65 0.015 265)" }}>
            Weekly scan results for a curated set of real-world skills — both malicious and benign —
            showing exactly what SkillScan catches in the wild.
          </p>

          {data && (
            <p className="text-xs mt-3" style={{ color: "oklch(0.48 0.010 265)" }}>
              Last updated {formatRelative(data.generated_at)} · SkillScan v{data.skillscan_version}
            </p>
          )}
        </div>
      </section>

      {/* Stats bar */}
      {data && (
        <section className="pb-8 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Scanned", value: data.entry_count, icon: Activity, color: "oklch(0.78 0.18 290)" },
                { label: "BLOCK", value: data.block_count, icon: XCircle, color: "oklch(0.65 0.22 25)" },
                { label: "ALLOW", value: data.allow_count, icon: CheckCircle, color: "oklch(0.65 0.18 145)" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl text-center"
                  style={{ background: "oklch(0.14 0.025 265)", border: "1px solid oklch(0.22 0.025 265)" }}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1.5" style={{ color }} />
                  <div className="text-2xl font-bold" style={{ color: "oklch(0.92 0.008 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    {value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.012 265)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter tabs + entries */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Filter tabs */}
          {data && (
            <div className="flex gap-2 mb-6">
              {(["all", "BLOCK", "ALLOW"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: filter === f ? "oklch(0.58 0.22 290 / 0.18)" : "oklch(0.14 0.025 265)",
                    border: `1px solid ${filter === f ? "oklch(0.58 0.22 290 / 0.35)" : "oklch(0.22 0.025 265)"}`,
                    color: filter === f ? "oklch(0.82 0.18 290)" : "oklch(0.60 0.012 265)",
                  }}
                >
                  {f === "all" ? `All (${data.entry_count})` : f === "BLOCK" ? `BLOCK (${data.block_count})` : `ALLOW (${data.allow_count})`}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20 gap-3" style={{ color: "oklch(0.58 0.015 265)" }}>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading feed…</span>
            </div>
          )}

          {/* Error / not yet generated */}
          {!loading && error && (
            <div className="text-center py-20">
              <Clock className="w-10 h-10 mx-auto mb-4" style={{ color: "oklch(0.50 0.015 265)" }} />
              <p className="text-sm font-medium mb-2" style={{ color: "oklch(0.80 0.010 265)" }}>
                Feed not yet generated
              </p>
              <p className="text-xs leading-relaxed max-w-sm mx-auto" style={{ color: "oklch(0.52 0.010 265)" }}>
                The weekly scan runs every Sunday at 04:00 UTC. The first run will populate this page automatically.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                {[
                  { icon: Activity, title: "Weekly cron", body: "GitHub Actions scans all entries every Sunday" },
                  { icon: GitBranch, title: "Versioned results", body: "JSON committed to the website repo — auditable history" },
                  { icon: CheckCircle, title: "Curated set", body: "13 real-world malicious + 5 clean reference skills" },
                ].map(({ icon: Icon, title, body }) => (
                  <div
                    key={title}
                    className="p-4 rounded-xl text-left max-w-xs"
                    style={{ background: "oklch(0.14 0.025 265)", border: "1px solid oklch(0.22 0.025 265)" }}
                  >
                    <Icon className="w-4 h-4 mb-2" style={{ color: "oklch(0.72 0.15 290)" }} />
                    <p className="text-xs font-semibold mb-1" style={{ color: "oklch(0.85 0.008 265)" }}>{title}</p>
                    <p className="text-xs" style={{ color: "oklch(0.55 0.010 265)" }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entries */}
          {!loading && !error && data && (
            <div className="space-y-3">
              {filtered.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-sm py-10" style={{ color: "oklch(0.52 0.010 265)" }}>
                  No entries match this filter.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Responsible disclosure footer */}
      <section className="pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="p-4 rounded-lg text-sm leading-relaxed"
            style={{
              background: "oklch(0.13 0.022 265)",
              border: "1px solid oklch(0.20 0.025 265)",
              color: "oklch(0.55 0.010 265)",
            }}
          >
            <span style={{ color: "oklch(0.78 0.18 290)", fontWeight: 600 }}>
              Responsible disclosure.{" "}
            </span>
            Malicious entries are drawn from our organic holdout corpus — real-world attack patterns
            discovered in the wild and verified by our team. Findings are displayed at the
            rule-category level only, not raw matched text. Benign entries are official public skills
            from well-known projects. To dispute a finding, open an issue using the{" "}
            <a
              href="https://github.com/kurtpayne/skillscan-security/issues/new?template=false-positive.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.72 0.15 290)", textDecoration: "underline" }}
            >
              false positive template
            </a>
            .
          </div>
        </div>
      </section>
    </div>
  );
}
