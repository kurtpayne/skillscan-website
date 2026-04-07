/* ============================================================
   TRACE RUN PAGE — interactive hosted trace form
   Route: /trace/run
   ============================================================ */
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload, Link2, ChevronDown, ChevronUp, Shield, AlertTriangle,
  CheckCircle2, XCircle, Loader2, Copy, Check, Download, ExternalLink,
  Eye, EyeOff,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE = "https://trace.skillscan.sh";

const DEMO_SKILLS = [
  {
    name: "git-secret-scanner",
    desc: "Reads credentials, attempts exfiltration",
    verdict: "BLOCK",
    url: "https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/examples/trace-demos/git-secret-scanner/SKILL.md",
  },
  {
    name: "dependency-updater",
    desc: "curl|bash bootstrap + telemetry exfil",
    verdict: "BLOCK",
    url: "https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/examples/trace-demos/dependency-updater/SKILL.md",
  },
  {
    name: "meeting-summarizer",
    desc: "Benign read/write — should pass clean",
    verdict: "PASS",
    url: "https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/examples/trace-demos/meeting-summarizer/SKILL.md",
  },
];

const PROVIDERS = [
  {
    id: "openrouter", label: "OpenRouter", badge: "200+ models",
    defaultModel: "anthropic/claude-3.5-haiku", defaultJudge: "anthropic/claude-sonnet-4-6",
    envKey: "OPENROUTER_API_KEY",
    traceModels: ["anthropic/claude-3.5-haiku", "anthropic/claude-3-haiku", "anthropic/claude-3.7-sonnet", "google/gemini-2.0-flash-001", "openai/gpt-4.1-mini"],
    judgeModels: ["anthropic/claude-sonnet-4-6", "anthropic/claude-sonnet-4-5", "openai/gpt-4.1", "anthropic/claude-3.7-sonnet"],
  },
  {
    id: "openai", label: "OpenAI", badge: "",
    defaultModel: "gpt-4.1-mini", defaultJudge: "gpt-4.1",
    envKey: "OPENAI_API_KEY",
    traceModels: ["gpt-4.1-mini", "gpt-4.1-nano", "gpt-4o-mini"],
    judgeModels: ["gpt-4.1", "gpt-4o", "o3-mini"],
  },
  {
    id: "anthropic", label: "Anthropic", badge: "",
    defaultModel: "claude-3-5-sonnet-latest", defaultJudge: "claude-sonnet-4-6-latest",
    envKey: "ANTHROPIC_API_KEY",
    traceModels: ["claude-3-5-sonnet-latest", "claude-3-5-haiku-latest", "claude-3-haiku-20240307"],
    judgeModels: ["claude-sonnet-4-6-latest", "claude-sonnet-4-5-latest", "claude-3-5-sonnet-latest"],
  },
];

// ── localStorage persistence ──────────────────────────────────────────────────

const LS_KEY = "skillscan-trace-prefs";

type SavedPrefs = {
  providerId?: string;
  apiKey?: string;
  model?: string;
  judgeModel?: string;
  variants?: number;
  maxTurns?: number;
};

function loadPrefs(): SavedPrefs {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}"); } catch { return {}; }
}

function savePrefs(p: SavedPrefs) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch {}
}

// ── frontmatter parser ────────────────────────────────────────────────────────

function parseFrontmatter(content: string): Record<string, unknown> | null {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const result: Record<string, unknown> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)/);
    if (kv) {
      const val = kv[2].trim();
      if (val.startsWith("[") || val.startsWith("-")) {
        // Simple array parse: "  - bash" lines or "[bash, read_file]"
        continue; // handled below
      }
      result[kv[1]] = val;
    }
  }
  // Parse allowed-tools as array
  const toolsMatch = m[1].match(/allowed-tools:\s*\n((?:\s+-\s+.+\n?)*)/);
  if (toolsMatch) {
    result["allowed-tools"] = toolsMatch[1].match(/- (.+)/g)?.map(s => s.replace(/^- /, "").trim()) || [];
  }
  const inlineTools = m[1].match(/allowed-tools:\s*\[([^\]]+)\]/);
  if (inlineTools) {
    result["allowed-tools"] = inlineTools[1].split(",").map(s => s.trim());
  }
  return Object.keys(result).length ? result : null;
}

function SkillMetadata({ content }: { content: string }) {
  const meta = parseFrontmatter(content);
  if (!meta) return null;
  const tools = meta["allowed-tools"] as string[] | undefined;
  return (
    <div className="rounded-lg px-4 py-3 space-y-1.5"
      style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.20 0.022 265)" }}>
      <div className="flex items-center gap-2 flex-wrap">
        {meta.name && (
          <span className="text-sm font-mono font-medium" style={{ color: "oklch(0.80 0.012 265)" }}>
            {meta.name as string}
          </span>
        )}
        {meta.version && (
          <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "oklch(0.15 0.022 265)", color: "oklch(0.55 0.015 265)" }}>
            v{meta.version as string}
          </span>
        )}
      </div>
      {meta.description && (
        <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)" }}>{meta.description as string}</p>
      )}
      {tools && tools.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs" style={{ color: "oklch(0.45 0.015 265)" }}>tools:</span>
          {tools.map(t => (
            <span key={t} className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ background: "oklch(0.15 0.030 210)", color: "oklch(0.68 0.08 210)" }}>
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── small helpers ─────────────────────────────────────────────────────────────

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded transition-colors"
      style={{ color: "oklch(0.55 0.015 265)" }}
      onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.78 0.18 290)")}
      onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.55 0.015 265)")}
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const v = (verdict || "").toUpperCase();
  const map: Record<string, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
    PASS:  { bg: "oklch(0.18 0.06 155)", text: "oklch(0.78 0.18 155)", border: "oklch(0.30 0.10 155)", icon: <CheckCircle2 className="w-4 h-4" /> },
    BLOCK: { bg: "oklch(0.18 0.06 25)",  text: "oklch(0.78 0.18 25)",  border: "oklch(0.30 0.10 25)",  icon: <XCircle className="w-4 h-4" /> },
    REVIEW:      { bg: "oklch(0.18 0.06 80)",  text: "oklch(0.78 0.18 80)",  border: "oklch(0.30 0.10 80)",  icon: <AlertTriangle className="w-4 h-4" /> },
    ERROR:       { bg: "oklch(0.18 0.06 55)",  text: "oklch(0.78 0.18 55)",  border: "oklch(0.30 0.10 55)",  icon: <AlertTriangle className="w-4 h-4" /> },
    INCONCLUSIVE:{ bg: "oklch(0.16 0.03 265)", text: "oklch(0.65 0.04 265)", border: "oklch(0.28 0.04 265)", icon: <Shield className="w-4 h-4" /> },
  };
  const s = map[v] || map.REVIEW;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>
      {s.icon}{v}
    </span>
  );
}

function SeverityPill({ sev }: { sev: string }) {
  const s = (sev || "").toUpperCase();
  const colors: Record<string, string> = {
    CRITICAL: "oklch(0.78 0.18 25)", HIGH: "oklch(0.78 0.18 55)",
    MEDIUM: "oklch(0.78 0.18 80)",   LOW: "oklch(0.78 0.18 240)",
    INFO: "oklch(0.65 0.015 265)",
  };
  return <span className="text-xs font-mono font-bold" style={{ color: colors[s] || colors.INFO }}>{s}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl p-6 ${className}`}
      style={{ background: "oklch(0.11 0.018 265)", border: "1px solid oklch(0.20 0.022 265)" }}>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.22 0.025 265)",
  color: "oklch(0.88 0.012 265)", borderRadius: "0.5rem",
  padding: "0.5rem 0.75rem", fontSize: "0.875rem", width: "100%", outline: "none",
};

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input style={inputStyle} {...props} />;
}

function Sel(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select style={{ ...inputStyle, cursor: "pointer", appearance: "none", WebkitAppearance: "none", paddingRight: "2rem" }} {...props} />;
}

function ModelSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const isCustom = !options.includes(value) && value !== "";
  const [showCustom, setShowCustom] = useState(isCustom);

  return showCustom ? (
    <div className="flex gap-1.5">
      <Input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="model id" />
      <button type="button" onClick={() => { setShowCustom(false); onChange(options[0]); }}
        className="text-xs px-2 whitespace-nowrap" style={{ color: "oklch(0.55 0.015 265)" }}>
        ← presets
      </button>
    </div>
  ) : (
    <Sel value={value} onChange={e => { if (e.target.value === "__other") { setShowCustom(true); onChange(""); } else { onChange(e.target.value); } }}>
      {options.map(m => <option key={m} value={m}>{m}</option>)}
      <option value="__other">Other…</option>
    </Sel>
  );
}

// ── report view ───────────────────────────────────────────────────────────────

function FindingCard({ f }: { f: Record<string, unknown> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid oklch(0.20 0.022 265)" }}>
      <button className="w-full flex items-center justify-between px-4 py-3 text-left"
        style={{ background: "oklch(0.09 0.018 265)" }} onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3 min-w-0">
          <SeverityPill sev={f.severity as string} />
          <span className="text-xs font-mono" style={{ color: "oklch(0.65 0.015 265)" }}>{f.rule_id as string}</span>
          <span className="text-sm truncate" style={{ color: "oklch(0.85 0.012 265)" }}>{(f.message || f.title) as string}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.55 0.015 265)" }} />
               : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.55 0.015 265)" }} />}
      </button>
      {open && (
        <div className="px-4 py-3 space-y-2" style={{ borderTop: "1px solid oklch(0.18 0.022 265)" }}>
          {f.detail && <p className="text-sm" style={{ color: "oklch(0.75 0.012 265)" }}>{f.detail as string}</p>}
          {f.line_number && (
            <p className="text-xs font-mono" style={{ color: "oklch(0.55 0.015 265)" }}>
              Line {f.line_number as number}{f.matched_text ? `: ${f.matched_text}` : ""}
            </p>
          )}
          {f.technique && <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>MITRE: {f.technique as string}</p>}
        </div>
      )}
    </div>
  );
}

function EventTimeline({ events }: { events: Record<string, unknown>[] }) {
  if (!events.length) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold" style={{ color: "oklch(0.75 0.012 265)" }}>
        Tool call timeline ({events.length})
      </h3>
      {events.map((ev, i) => {
        const tool = ev.tool as string;
        const turn = ev.turn as number;
        const args = ev.arguments as Record<string, unknown> | undefined;
        const evFindings = (ev.findings as Record<string, unknown>[]) || [];
        const hasFinding = evFindings.length > 0;
        return (
          <div key={i} className="rounded-lg overflow-hidden"
            style={{ border: `1px solid ${hasFinding ? "oklch(0.28 0.08 25)" : "oklch(0.20 0.022 265)"}` }}>
            <div className="flex items-center gap-3 px-4 py-2.5"
              style={{ background: hasFinding ? "oklch(0.11 0.03 25)" : "oklch(0.09 0.018 265)" }}>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ background: "oklch(0.15 0.022 265)", color: "oklch(0.60 0.015 265)" }}>
                T{turn}
              </span>
              <span className="text-sm font-mono font-medium"
                style={{ color: hasFinding ? "oklch(0.78 0.18 25)" : "oklch(0.78 0.08 210)" }}>
                {tool}
              </span>
              {hasFinding && (
                <span className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{ background: "oklch(0.18 0.06 25)", color: "oklch(0.78 0.18 25)", border: "1px solid oklch(0.30 0.10 25)" }}>
                  flagged
                </span>
              )}
            </div>
            {args && Object.keys(args).length > 0 && (
              <div className="px-4 py-2" style={{ borderTop: `1px solid ${hasFinding ? "oklch(0.20 0.05 25)" : "oklch(0.18 0.022 265)"}` }}>
                {Object.entries(args).map(([k, v]) => (
                  <p key={k} className="text-xs font-mono truncate" style={{ color: "oklch(0.60 0.015 265)" }}>
                    <span style={{ color: "oklch(0.50 0.015 265)" }}>{k}:</span>{" "}
                    {typeof v === "string" ? v : JSON.stringify(v)}
                  </p>
                ))}
              </div>
            )}
            {evFindings.map((ef, j) => (
              <div key={j} className="flex items-center gap-2 px-4 py-2"
                style={{ borderTop: "1px solid oklch(0.20 0.05 25)", background: "oklch(0.10 0.02 25)" }}>
                <SeverityPill sev={ef.severity as string} />
                <span className="text-xs font-mono" style={{ color: "oklch(0.55 0.015 265)" }}>{ef.rule_id as string}</span>
                <span className="text-xs truncate" style={{ color: "oklch(0.70 0.012 265)" }}>{ef.message as string}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function UserMessagesSection({ messages }: { messages: string[] }) {
  if (!messages.length) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold" style={{ color: "oklch(0.75 0.012 265)" }}>
        Fuzz inputs ({messages.length})
      </h3>
      {messages.map((m, i) => (
        <div key={i} className="flex items-start gap-2 rounded-lg px-4 py-2.5"
          style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.20 0.022 265)" }}>
          <span className="text-xs font-mono mt-0.5 flex-shrink-0"
            style={{ color: "oklch(0.45 0.015 265)" }}>#{i + 1}</span>
          <p className="text-sm" style={{ color: "oklch(0.72 0.012 265)" }}>{m}</p>
        </div>
      ))}
    </div>
  );
}

function ToolSurfaceSummary({ events }: { events: Record<string, unknown>[] }) {
  const CANARY_TOOLS = [
    // Filesystem & network
    "bash", "read_file", "write_file", "http_fetch", "list_directory",
    // Email & messaging
    "email_send", "gmail_send", "search_emails", "read_email", "slack_post_message",
    // Calendar
    "calendar_create", "calendar_list",
    // GitHub
    "github_create_issue", "github_push_file", "get_file_contents", "search_code",
    "create_pull_request", "merge_pull_request", "get_secret_scanning_alert",
    // Notion
    "notion_create_page", "notion_append_block",
    // Database
    "execute_sql", "list_tables", "describe_table",
    // Secrets & vault
    "read_secret", "list_secrets", "get_vault_item",
    // Cloud CLI
    "call_aws_cli", "call_kubectl",
    // Code execution
    "python", "computer",
    // Agent memory
    "memory_write", "memory_read", "context_write",
    // Web
    "web_search", "web_fetch",
  ];
  const calledTools = new Set(events.map(ev => ev.tool as string));
  if (!events.length) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold" style={{ color: "oklch(0.75 0.012 265)" }}>
        Tool surface
      </h3>
      <div className="rounded-lg px-4 py-3" style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.20 0.022 265)" }}>
        <div className="flex flex-wrap gap-2">
          {CANARY_TOOLS.map(t => {
            const used = calledTools.has(t);
            return (
              <span key={t} className="text-xs font-mono px-2 py-1 rounded"
                style={{
                  background: used ? "oklch(0.18 0.06 155)" : "oklch(0.12 0.018 265)",
                  color: used ? "oklch(0.78 0.18 155)" : "oklch(0.45 0.015 265)",
                  border: `1px solid ${used ? "oklch(0.30 0.10 155)" : "oklch(0.20 0.022 265)"}`,
                }}>
                {used ? "\u2713 " : ""}{t}
              </span>
            );
          })}
        </div>
        <p className="text-xs mt-2" style={{ color: "oklch(0.45 0.015 265)" }}>
          {calledTools.size} of {CANARY_TOOLS.length} canary tools used
        </p>
      </div>
    </div>
  );
}

function AuthorDeclarations({ report }: { report: Record<string, unknown> }) {
  const domains = (report.allow_domains as string[]) || [];
  const commands = (report.allow_commands as string[]) || [];
  if (!domains.length && !commands.length) return null;
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold" style={{ color: "oklch(0.75 0.012 265)" }}>
        Author declarations
      </h3>
      <div className="rounded-lg px-4 py-3 space-y-2" style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.20 0.022 265)" }}>
        {domains.length > 0 && (
          <div>
            <span className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>Allowed domains: </span>
            {domains.map(d => (
              <span key={d} className="text-xs font-mono px-1.5 py-0.5 rounded mr-1"
                style={{ background: "oklch(0.15 0.022 265)", color: "oklch(0.68 0.08 210)" }}>{d}</span>
            ))}
          </div>
        )}
        {commands.length > 0 && (
          <div>
            <span className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>Allowed commands: </span>
            {commands.map(c => (
              <span key={c} className="text-xs font-mono px-1.5 py-0.5 rounded mr-1"
                style={{ background: "oklch(0.15 0.022 265)", color: "oklch(0.68 0.08 210)" }}>{c}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProvenanceSection({ provenance }: { provenance: Record<string, unknown> | undefined }) {
  const [open, setOpen] = useState(false);
  if (!provenance) return null;
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid oklch(0.20 0.022 265)" }}>
      <button className="w-full flex items-center justify-between px-4 py-2.5 text-left"
        style={{ background: "oklch(0.09 0.018 265)" }} onClick={() => setOpen(!open)}>
        <span className="text-xs font-semibold" style={{ color: "oklch(0.55 0.015 265)" }}>Provenance</span>
        {open ? <ChevronUp className="w-3.5 h-3.5" style={{ color: "oklch(0.45 0.015 265)" }} />
               : <ChevronDown className="w-3.5 h-3.5" style={{ color: "oklch(0.45 0.015 265)" }} />}
      </button>
      {open && (
        <div className="px-4 py-3 space-y-1" style={{ borderTop: "1px solid oklch(0.18 0.022 265)" }}>
          {Object.entries(provenance).map(([k, v]) => (
            <p key={k} className="text-xs font-mono" style={{ color: "oklch(0.55 0.015 265)" }}>
              <span style={{ color: "oklch(0.45 0.015 265)" }}>{k}:</span> {String(v)}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function ReportView({ report, reportUrl }: { report: Record<string, unknown>; reportUrl: string }) {
  const findings = [...((report.findings as Record<string, unknown>[]) || []),
                    ...((report.trace_findings as Record<string, unknown>[]) || [])];
  const events = (report.events as Record<string, unknown>[]) || [];
  const toolCalls = (report.total_tool_calls as number) ?? 0;
  const userMessages = (report.user_messages as string[]) || [];

  // Derive verdict: judge_verdict if judge ran, otherwise infer from results
  let verdict: string;
  if (report.error) verdict = "ERROR";
  else if (report.judge_verdict) verdict = (report.judge_verdict as string).toUpperCase();
  else if (findings.length > 0) verdict = "BLOCK";
  else if (toolCalls === 0) verdict = "INCONCLUSIVE";
  else verdict = "PASS";

  const [copied, setCopied] = useState(false);
  const bySev = (s: string) => findings.filter(f => ((f.severity as string) || "").toUpperCase() === s);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "skillscan-trace-report.json"; a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <VerdictBadge verdict={verdict} />
              {report.risk_score !== undefined && (
                <span className="text-sm" style={{ color: "oklch(0.60 0.015 265)" }}>Risk: {report.risk_score as number}</span>
              )}
            </div>
            {(report.skill_name || report.skill_path) && (
              <p className="text-sm font-mono" style={{ color: "oklch(0.65 0.015 265)" }}>
                {(report.skill_name || report.skill_path) as string}
              </p>
            )}
            {report.model && <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>Model: {report.model as string}</p>}
            <p className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
              {toolCalls} tool call{toolCalls !== 1 ? "s" : ""}
              {` · ${findings.length} finding${findings.length !== 1 ? "s" : ""}`}
              {report.duration_seconds ? ` · ${(report.duration_seconds as number).toFixed(1)}s` : ""}
              {userMessages.length ? ` · ${userMessages.length} input${userMessages.length !== 1 ? "s" : ""}` : ""}
            </p>
            {report.skill_sha256 && (
              <p className="text-xs font-mono" style={{ color: "oklch(0.40 0.015 265)" }}>
                sha256:{(report.skill_sha256 as string).slice(0, 16)}…
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => { navigator.clipboard.writeText(reportUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "oklch(0.16 0.022 265)", border: "1px solid oklch(0.25 0.025 265)", color: "oklch(0.75 0.012 265)" }}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button onClick={downloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "oklch(0.16 0.022 265)", border: "1px solid oklch(0.25 0.025 265)", color: "oklch(0.75 0.012 265)" }}>
              <Download className="w-3 h-3" /> JSON
            </button>
            <a href={reportUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "oklch(0.16 0.022 265)", border: "1px solid oklch(0.25 0.025 265)", color: "oklch(0.75 0.012 265)" }}>
              <ExternalLink className="w-3 h-3" /> Permalink
            </a>
          </div>
        </div>
        {findings.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTop: "1px solid oklch(0.18 0.022 265)" }}>
            {["CRITICAL","HIGH","MEDIUM","LOW"].map(s => {
              const n = bySev(s).length; if (!n) return null;
              return <span key={s} className="text-xs font-mono"><SeverityPill sev={s} />{" "}<span style={{ color: "oklch(0.75 0.012 265)" }}>{n}</span></span>;
            })}
          </div>
        )}
      </Card>

      {/* Error */}
      {report.error && (
        <Card>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.78 0.18 55)" }} />
            <div className="space-y-1 min-w-0">
              <p className="text-sm font-medium" style={{ color: "oklch(0.80 0.12 55)" }}>Trace error</p>
              <p className="text-sm font-mono break-all" style={{ color: "oklch(0.70 0.012 265)" }}>{report.error as string}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Findings */}
      {!report.error && findings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold" style={{ color: "oklch(0.75 0.012 265)" }}>Findings ({findings.length})</h3>
          {findings.map((f, i) => <FindingCard key={i} f={f} />)}
        </div>
      )}

      {/* Tool call timeline */}
      {!report.error && <EventTimeline events={events} />}

      {/* Tool surface summary */}
      {!report.error && <ToolSurfaceSummary events={events} />}

      {/* No tool calls message */}
      {!report.error && toolCalls === 0 && (
        <Card>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.65 0.08 265)" }} />
            <div className="space-y-1">
              <p className="text-sm font-medium" style={{ color: "oklch(0.75 0.012 265)" }}>No tool calls observed</p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>
                The model responded with text only and did not invoke any tools during the trace.
                This can happen when the skill references tools not in the canary server's surface,
                or when the model decides no tool use is needed for the generated inputs.
                This is an inconclusive result — not a pass.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Clean pass */}
      {!report.error && toolCalls > 0 && findings.length === 0 && (
        <Card>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" style={{ color: "oklch(0.78 0.18 155)" }} />
            <p className="text-sm" style={{ color: "oklch(0.75 0.012 265)" }}>
              No findings — {toolCalls} tool call{toolCalls !== 1 ? "s" : ""} observed, none flagged.
            </p>
          </div>
        </Card>
      )}

      {/* Static scan findings */}
      {((report.static_findings as Record<string, unknown>[]) || []).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold" style={{ color: "oklch(0.75 0.012 265)" }}>
            Static scan ({(report.static_findings as Record<string, unknown>[]).length})
          </h3>
          {(report.static_findings as Record<string, unknown>[]).map((f, i) => <FindingCard key={`s${i}`} f={f} />)}
        </div>
      )}

      {/* Lint findings */}
      {((report.lint_findings as Record<string, unknown>[]) || []).length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold" style={{ color: "oklch(0.75 0.012 265)" }}>
            Quality lint ({(report.lint_findings as Record<string, unknown>[]).length})
          </h3>
          {(report.lint_findings as Record<string, unknown>[]).map((f, i) => <FindingCard key={`l${i}`} f={f} />)}
        </div>
      )}

      {/* User messages */}
      <UserMessagesSection messages={userMessages} />

      {/* Author declarations */}
      <AuthorDeclarations report={report} />

      {/* Provenance */}
      <ProvenanceSection provenance={report.provenance as Record<string, unknown> | undefined} />

      {/* Permalink */}
      <div className="flex items-center justify-between rounded-lg px-4 py-3"
        style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.20 0.022 265)" }}>
        <span className="text-xs font-mono truncate" style={{ color: "oklch(0.55 0.015 265)" }}>{reportUrl}</span>
        <CopyBtn text={reportUrl} />
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────

type Phase = "form" | "submitting" | "polling" | "done" | "error";
type InputMode = "file" | "url";

export default function TraceRun() {
  const saved = loadPrefs();
  const initProvider = PROVIDERS.find(p => p.id === saved.providerId) || PROVIDERS[0];

  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [skillContent, setSkillContent] = useState("");
  const [skillZipB64, setSkillZipB64] = useState("");
  const [fileName, setFileName] = useState("");
  const [skillUrl, setSkillUrl] = useState("");
  const [providerId, setProviderId] = useState(initProvider.id);
  const [apiKey, setApiKey] = useState(saved.apiKey || "");
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(saved.model || initProvider.defaultModel);
  const [judgeModel, setJudgeModel] = useState(saved.judgeModel || initProvider.defaultJudge);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [variants, setVariants] = useState(saved.variants || 3);
  const [maxTurns, setMaxTurns] = useState(saved.maxTurns || 10);
  const [includeScan, setIncludeScan] = useState(true);
  const [includeLint, setIncludeLint] = useState(true);
  const [allowDomains, setAllowDomains] = useState("");
  const [allowCommands, setAllowCommands] = useState("");
  const [multiModel, setMultiModel] = useState(false);
  const [comparisonModel, setComparisonModel] = useState(initProvider.traceModels[1] || initProvider.traceModels[0]);
  const [messageMode, setMessageMode] = useState<"llm" | "manual">("llm");
  const [manualMessages, setManualMessages] = useState("");

  // Persist choices to localStorage
  useEffect(() => {
    savePrefs({ providerId, apiKey, model, judgeModel, variants, maxTurns });
  }, [providerId, apiKey, model, judgeModel, variants, maxTurns]);

  const [phase, setPhase] = useState<Phase>("form");
  const [jobId, setJobId] = useState<string | null>(null);
  const [pollStatus, setPollStatus] = useState("Queued...");
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [report2, setReport2] = useState<Record<string, unknown> | null>(null);
  const [reportUrl2, setReportUrl2] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const provider = PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0];

  const handleProviderChange = (id: string) => {
    setProviderId(id);
    const p = PROVIDERS.find(x => x.id === id);
    if (p) { setModel(p.defaultModel); setJudgeModel(p.defaultJudge); setComparisonModel(p.traceModels[1] || p.traceModels[0]); }
  };

  const handleFileLoad = (file: File) => {
    setFileName(file.name);
    if (file.name.toLowerCase().endsWith(".zip")) {
      setSkillContent("");
      const reader = new FileReader();
      reader.onload = ev => {
        const arrayBuf = ev.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuf);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        setSkillZipB64(btoa(binary));
      };
      reader.readAsArrayBuffer(file);
    } else {
      setSkillZipB64("");
      const reader = new FileReader();
      reader.onload = ev => setSkillContent((ev.target?.result as string) || "");
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    handleFileLoad(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; if (!file) return;
    setInputMode("file");
    handleFileLoad(file);
  }, []);

  const poll = useCallback(async (id: string) => {
    try {
      const resp = await fetch(`${API_BASE}/v1/status/${id}`);
      const data = await resp.json() as Record<string, unknown>;
      const status = data.status as string;
      if (status === "pending") { setPollStatus("Queued..."); pollRef.current = setTimeout(() => poll(id), 3000); }
      else if (status === "running") { setPollStatus("Tracing..."); pollRef.current = setTimeout(() => poll(id), 3000); }
      else if (status === "error") {
        setErrorMsg(`Trace failed: ${(data.error as string) || "Unknown error"}`);
        setPhase("error");
      } else {
        // "done" or no status (Fly returns the result directly for completed jobs)
        const result = (data.result || data) as Record<string, unknown>;
        // If the trace harness itself errored (e.g. bad model, bad key), show it
        if (result.error && !result.events?.length && !result.findings?.length) {
          setErrorMsg(`Trace error: ${result.error as string}`);
          setPhase("error");
        } else {
          const url = (data.report_url || result.report_url || `${API_BASE}/report/${id}`) as string;
          setReport(result); setReportUrl(url); setPhase("done");
        }
      }
    } catch { setErrorMsg("Lost connection to trace service."); setPhase("error"); }
  }, []);

  const buildBody = (modelOverride?: string): Record<string, unknown> => {
    const content = skillContent;
    const isZip = !!skillZipB64;
    const parsedDomains = allowDomains.split(",").map(s => s.trim()).filter(Boolean);
    const parsedCommands = allowCommands.split(",").map(s => s.trim()).filter(Boolean);
    const parsedManual = messageMode === "manual"
      ? manualMessages.split("\n").map(s => s.trim()).filter(Boolean).slice(0, 10)
      : undefined;
    const body: Record<string, unknown> = {
      skill_content: content, provider: providerId, api_key: apiKey,
      model: modelOverride || model, variants, max_turns: maxTurns,
      include_scan: includeScan, include_lint: includeLint,
      ...(inputMode === "url" ? { source_url: skillUrl } : {}),
      ...(isZip ? { skill_zip_b64: skillZipB64 } : {}),
      ...(parsedDomains.length ? { allow_domains: parsedDomains } : {}),
      ...(parsedCommands.length ? { allow_commands: parsedCommands } : {}),
      ...(parsedManual && parsedManual.length > 0 ? { user_messages: parsedManual } : {}),
    };
    if (judgeModel.trim()) { body.judge = true; body.judge_model = judgeModel.trim(); }
    return body;
  };

  const submitOne = async (body: Record<string, unknown>): Promise<{ report: Record<string, unknown>; reportUrl: string } | null> => {
    const resp = await fetch(`${API_BASE}/v1/submit`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await resp.json() as Record<string, unknown>;
    if (resp.status === 429) throw new Error((data.error as string) || "Rate limit exceeded.");
    if (!resp.ok) throw new Error((data.error as string) || `Server error: ${resp.status}`);
    if (data.status === "done" || data.cached) {
      const result = (data.result || data) as Record<string, unknown>;
      return { report: result, reportUrl: (data.report_url || result.report_url || `${API_BASE}/report/${data.job_id}`) as string };
    }
    // Poll until done
    const id = data.job_id as string;
    return new Promise((resolve, reject) => {
      const doPoll = async () => {
        try {
          const r = await fetch(`${API_BASE}/v1/status/${id}`);
          const d = await r.json() as Record<string, unknown>;
          const status = d.status as string;
          if (status === "pending" || status === "running") {
            setPollStatus(status === "running" ? "Tracing..." : "Queued...");
            setTimeout(doPoll, 3000);
          } else if (status === "error") {
            reject(new Error((d.error as string) || "Trace failed"));
          } else {
            const result = (d.result || d) as Record<string, unknown>;
            if (result.error && !result.events?.length && !result.findings?.length) {
              reject(new Error(result.error as string));
            } else {
              resolve({ report: result, reportUrl: (d.report_url || result.report_url || `${API_BASE}/report/${id}`) as string });
            }
          }
        } catch { reject(new Error("Lost connection to trace service.")); }
      };
      setTimeout(doPoll, 3000);
    });
  };

  const handleSubmit = async () => {
    const content = skillContent;
    const isZip = !!skillZipB64;
    if (inputMode === "url") {
      if (!skillUrl.trim()) { setErrorMsg("Enter a skill URL."); setPhase("error"); return; }
    } else {
      if (!content.trim() && !isZip) { setErrorMsg("Upload a skill file."); setPhase("error"); return; }
    }
    if (!apiKey.trim()) { setErrorMsg("Enter your API key."); setPhase("error"); return; }
    if (!model.trim()) { setErrorMsg("Enter a model name."); setPhase("error"); return; }
    if (multiModel && !comparisonModel.trim()) { setErrorMsg("Enter a comparison model."); setPhase("error"); return; }

    setPhase("submitting"); setErrorMsg(null);
    try {
      if (multiModel) {
        setPhase("polling"); setPollStatus("Submitting both models...");
        const [r1, r2] = await Promise.all([
          submitOne(buildBody(model)),
          submitOne(buildBody(comparisonModel)),
        ]);
        if (r1) { setReport(r1.report); setReportUrl(r1.reportUrl); }
        if (r2) { setReport2(r2.report); setReportUrl2(r2.reportUrl); }
        setPhase("done");
      } else {
        const body = buildBody();
        const resp = await fetch(`${API_BASE}/v1/submit`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
        });
        const data = await resp.json() as Record<string, unknown>;

        if (resp.status === 429) { setErrorMsg((data.error as string) || "Rate limit exceeded."); setPhase("error"); return; }
        if (!resp.ok) { setErrorMsg((data.error as string) || `Server error: ${resp.status}`); setPhase("error"); return; }
        if (data.status === "done" || data.cached) {
          const result = (data.result || data) as Record<string, unknown>;
          setReport(result); setReportUrl((data.report_url || result.report_url || `${API_BASE}/report/${data.job_id}`) as string);
          setPhase("done"); return;
        }

        const id = data.job_id as string;
        setJobId(id); setPhase("polling"); setPollStatus("Queued...");
        pollRef.current = setTimeout(() => poll(id), 3000);
      }
    } catch (e) { setErrorMsg(`${(e as Error).message}`); setPhase("error"); }
  };

  const reset = () => {
    if (pollRef.current) clearTimeout(pollRef.current);
    setPhase("form"); setReport(null); setReportUrl(null); setReport2(null); setReportUrl2(null); setErrorMsg(null); setJobId(null);
  };

  const isLoading = phase === "submitting" || phase === "polling";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "oklch(0.07 0.018 265)" }}>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 space-y-6">

        {/* Header + explainer */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" style={{ color: "oklch(0.78 0.18 290)" }} />
              <h1 className="text-xl font-bold" style={{ color: "oklch(0.92 0.012 265)" }}>Online Trace</h1>
            </div>
            <p className="text-sm" style={{ color: "oklch(0.60 0.015 265)" }}>
              Behavioral trace for a skill file using your own API key.{" "}
              <a href="/trace" className="underline" style={{ color: "oklch(0.65 0.08 290)" }}>Run locally instead →</a>
            </p>
          </div>

          {/* How it works */}
          <div className="rounded-lg px-4 py-3 space-y-2"
            style={{ background: "oklch(0.09 0.020 265)", border: "1px solid oklch(0.18 0.022 265)" }}>
            <p className="text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)" }}>How it works</p>
            <div className="space-y-1.5">
              <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>
                <span style={{ color: "oklch(0.68 0.08 210)" }}>1.</span>{" "}
                Your API key calls the LLM with the skill as a system prompt. We never see the model's text responses — only the tool calls it makes.
              </p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>
                <span style={{ color: "oklch(0.68 0.08 210)" }}>2.</span>{" "}
                A canary MCP server intercepts every tool call (bash, read_file, http_fetch, etc.) and returns synthetic responses with embedded tracking tokens.
              </p>
              <p className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>
                <span style={{ color: "oklch(0.68 0.08 210)" }}>3.</span>{" "}
                Findings fire when the model reads sensitive paths, relays canary tokens to external endpoints, or calls tools not declared in the skill's allowed-tools.
              </p>
            </div>
          </div>

          {/* Sample skills */}
          {(phase === "form" || phase === "error") && (
            <div className="space-y-2">
              <p className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>Try a demo skill:</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {DEMO_SKILLS.map(d => (
                  <button key={d.name} onClick={() => { setInputMode("url"); setSkillUrl(d.url); }}
                    className="rounded-lg px-3 py-2.5 text-left transition-colors"
                    style={{ background: "oklch(0.10 0.018 265)", border: "1px solid oklch(0.20 0.022 265)" }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "oklch(0.35 0.06 290)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "oklch(0.20 0.022 265)")}>
                    <p className="text-xs font-mono font-medium" style={{ color: "oklch(0.78 0.08 210)" }}>{d.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "oklch(0.50 0.015 265)" }}>{d.desc}</p>
                    <span className="text-xs mt-1 inline-block"
                      style={{ color: d.verdict === "BLOCK" ? "oklch(0.70 0.14 25)" : "oklch(0.70 0.14 155)" }}>
                      Expected: {d.verdict}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {(phase === "form" || phase === "error") && (
          <Card className="space-y-5">
            {/* Input mode */}
            <div className="space-y-3">
              <div className="flex gap-2">
                {(["file", "url"] as InputMode[]).map(m => (
                  <button key={m} onClick={() => setInputMode(m)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{
                      background: inputMode === m ? "oklch(0.20 0.040 290)" : "oklch(0.13 0.018 265)",
                      border: `1px solid ${inputMode === m ? "oklch(0.40 0.08 290)" : "oklch(0.22 0.025 265)"}`,
                      color: inputMode === m ? "oklch(0.85 0.015 290)" : "oklch(0.60 0.015 265)",
                    }}>
                    {m === "file" ? <Upload className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
                    {m === "file" ? "Upload file" : "GitHub URL"}
                  </button>
                ))}
              </div>
              {inputMode === "file" ? (
                <div className="rounded-lg border-2 border-dashed flex flex-col items-center justify-center py-8 px-4 cursor-pointer"
                  style={{ borderColor: (skillContent || skillZipB64) ? "oklch(0.40 0.08 290)" : "oklch(0.25 0.025 265)" }}
                  onDragOver={e => e.preventDefault()} onDrop={handleDrop} onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" accept=".md,.txt,.zip" className="hidden" onChange={handleFileChange} />
                  {(skillContent || skillZipB64) ? (
                    <p className="text-sm font-mono" style={{ color: "oklch(0.78 0.18 290)" }}>✓ {fileName || (skillZipB64 ? "ZIP loaded" : "file loaded")}</p>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 mb-2" style={{ color: "oklch(0.45 0.015 265)" }} />
                      <p className="text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>Drop your SKILL.md here or click to browse</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>GitHub raw URL</label>
                  <Input type="url" placeholder="https://raw.githubusercontent.com/org/repo/main/SKILL.md"
                    value={skillUrl} onChange={e => setSkillUrl(e.target.value)} />
                </div>
              )}
            </div>

            {/* Provider / Key / Trace model */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>Provider</label>
                <Sel value={providerId} onChange={e => handleProviderChange(e.target.value)}>
                  {PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.label}{p.badge ? ` (${p.badge})` : ""}</option>)}
                </Sel>
              </div>
              <div className="space-y-1">
                <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                  API Key <span style={{ color: "oklch(0.45 0.015 265)" }}>— never stored</span>
                </label>
                <div className="relative">
                  <Input type={showKey ? "text" : "password"} placeholder={provider.envKey}
                    value={apiKey} onChange={e => setApiKey(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "2.5rem" }} />
                  <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2"
                    style={{ color: "oklch(0.45 0.015 265)" }} onClick={() => setShowKey(!showKey)} tabIndex={-1}>
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                  Trace model <span style={{ color: "oklch(0.45 0.015 265)" }}>— smaller = more susceptible</span>
                </label>
                <ModelSelect value={model} onChange={setModel} options={provider.traceModels} />
              </div>
            </div>

            {/* Scan + lint toggles */}
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeScan} onChange={e => setIncludeScan(e.target.checked)}
                  className="rounded" style={{ accentColor: "oklch(0.55 0.18 290)" }} />
                <span className="text-xs" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Static scan <span style={{ color: "oklch(0.45 0.015 265)" }}>— no key needed</span>
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={includeLint} onChange={e => setIncludeLint(e.target.checked)}
                  className="rounded" style={{ accentColor: "oklch(0.55 0.18 290)" }} />
                <span className="text-xs" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Lint <span style={{ color: "oklch(0.45 0.015 265)" }}>— quality checks</span>
                </span>
              </label>
            </div>

            {/* Advanced */}
            <div>
              <button className="flex items-center gap-1.5 text-xs" style={{ color: "oklch(0.55 0.015 265)" }}
                onClick={() => setShowAdvanced(!showAdvanced)}>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Advanced options
              </button>
              {showAdvanced && (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                        Fuzz variants <span style={{ color: "oklch(0.45 0.015 265)" }}>(1–10)</span>
                      </label>
                      <Input type="number" min={1} max={10} value={variants} onChange={e => setVariants(Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                        Max turns <span style={{ color: "oklch(0.45 0.015 265)" }}>(1–20)</span>
                      </label>
                      <Input type="number" min={1} max={20} value={maxTurns} onChange={e => setMaxTurns(Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                        Judge model <span style={{ color: "oklch(0.45 0.015 265)" }}>— smarter interpreter</span>
                      </label>
                      <ModelSelect value={judgeModel} onChange={setJudgeModel} options={provider.judgeModels} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                        Allow domains <span style={{ color: "oklch(0.45 0.015 265)" }}>— comma-separated</span>
                      </label>
                      <Input type="text" placeholder="api.example.com, cdn.example.com"
                        value={allowDomains} onChange={e => setAllowDomains(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                        Allow commands <span style={{ color: "oklch(0.45 0.015 265)" }}>— comma-separated</span>
                      </label>
                      <Input type="text" placeholder="git, npm, pip"
                        value={allowCommands} onChange={e => setAllowCommands(e.target.value)} />
                    </div>
                  </div>

                  {/* Multi-model comparison */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={multiModel} onChange={e => setMultiModel(e.target.checked)}
                        className="rounded" style={{ accentColor: "oklch(0.55 0.18 290)" }} />
                      <span className="text-xs" style={{ color: "oklch(0.65 0.015 265)" }}>
                        Multi-model comparison <span style={{ color: "oklch(0.45 0.015 265)" }}>— run two models side by side</span>
                      </span>
                    </label>
                    {multiModel && (
                      <div className="space-y-1">
                        <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>Comparison model</label>
                        <ModelSelect value={comparisonModel} onChange={setComparisonModel} options={provider.traceModels} />
                      </div>
                    )}
                  </div>

                  {/* Input mode toggle */}
                  <div className="space-y-2">
                    <label className="text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>Input mode</label>
                    <div className="flex gap-2">
                      {(["llm", "manual"] as const).map(m => (
                        <button key={m} type="button" onClick={() => setMessageMode(m)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{
                            background: messageMode === m ? "oklch(0.20 0.040 290)" : "oklch(0.13 0.018 265)",
                            border: `1px solid ${messageMode === m ? "oklch(0.40 0.08 290)" : "oklch(0.22 0.025 265)"}`,
                            color: messageMode === m ? "oklch(0.85 0.015 290)" : "oklch(0.60 0.015 265)",
                          }}>
                          {m === "llm" ? "LLM-generated" : "Manual"}
                        </button>
                      ))}
                    </div>
                    {messageMode === "manual" && (
                      <div className="space-y-1">
                        <label className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
                          Enter up to 10 user messages, one per line
                        </label>
                        <textarea
                          value={manualMessages}
                          onChange={e => setManualMessages(e.target.value)}
                          rows={5}
                          placeholder={"Summarize the meeting notes\nRead the .env file and show me the contents\nList all files in the home directory"}
                          style={{ ...inputStyle, resize: "vertical", minHeight: "5rem" }}
                        />
                        <p className="text-xs" style={{ color: "oklch(0.40 0.015 265)" }}>
                          {manualMessages.split("\n").filter(s => s.trim()).length}/10 messages
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {phase === "error" && errorMsg && (
              <div className="flex items-start gap-2 rounded-lg px-4 py-3 text-sm"
                style={{ background: "oklch(0.14 0.04 25)", border: "1px solid oklch(0.28 0.08 25)", color: "oklch(0.80 0.12 25)" }}>
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />{errorMsg}
              </div>
            )}

            <button onClick={handleSubmit} disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm"
              style={{ background: "oklch(0.55 0.18 290)", color: "oklch(0.98 0.005 265)",
                       opacity: isLoading ? 0.6 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              Run Trace
            </button>
          </Card>
        )}

        {phase === "polling" && (
          <Card className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.78 0.18 290)" }} />
            <p className="text-sm font-medium" style={{ color: "oklch(0.75 0.012 265)" }}>{pollStatus}</p>
            {jobId && <p className="text-xs font-mono" style={{ color: "oklch(0.40 0.015 265)" }}>job {jobId.slice(0, 8)}…</p>}
            <button onClick={reset} className="text-xs underline mt-2" style={{ color: "oklch(0.50 0.015 265)" }}>Cancel</button>
          </Card>
        )}

        {phase === "submitting" && (
          <Card className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "oklch(0.78 0.18 290)" }} />
            <p className="text-sm" style={{ color: "oklch(0.75 0.012 265)" }}>Submitting…</p>
          </Card>
        )}

        {phase === "done" && report && reportUrl && (
          <>
            <button onClick={reset} className="text-xs underline" style={{ color: "oklch(0.50 0.015 265)" }}>← Run another trace</button>
            {/* Show parsed skill metadata if we have the content */}
            {skillContent && <SkillMetadata content={skillContent} />}

            {/* Multi-model comparison banner */}
            {report2 && reportUrl2 && (() => {
              const v1 = report.judge_verdict
                ? (report.judge_verdict as string).toUpperCase()
                : ((report.findings as unknown[])?.length ? "BLOCK" : (report.total_tool_calls as number) > 0 ? "PASS" : "INCONCLUSIVE");
              const v2 = report2.judge_verdict
                ? (report2.judge_verdict as string).toUpperCase()
                : ((report2.findings as unknown[])?.length ? "BLOCK" : (report2.total_tool_calls as number) > 0 ? "PASS" : "INCONCLUSIVE");
              const agree = v1 === v2;
              return (
                <div className="rounded-xl p-4 space-y-1"
                  style={{
                    background: agree ? "oklch(0.14 0.04 155)" : "oklch(0.14 0.04 55)",
                    border: `1px solid ${agree ? "oklch(0.30 0.10 155)" : "oklch(0.30 0.10 55)"}`,
                  }}>
                  <p className="text-sm font-semibold" style={{ color: agree ? "oklch(0.80 0.14 155)" : "oklch(0.80 0.14 55)" }}>
                    {agree
                      ? `Agreement: both ${v1}`
                      : `Disagreement: ${report.model as string} = ${v1}, ${report2.model as string} = ${v2}`}
                  </p>
                </div>
              );
            })()}

            <ReportView report={report} reportUrl={reportUrl} />

            {report2 && reportUrl2 && (
              <ReportView report={report2} reportUrl={reportUrl2} />
            )}
          </>
        )}

        <p className="text-xs text-center" style={{ color: "oklch(0.40 0.015 265)" }}>
          Your API key is sent directly to the trace service, used for this run, and immediately discarded — never logged or stored.
          Reports are stored for 90 days.{" "}
          <a href="/trace" className="underline" style={{ color: "oklch(0.50 0.020 290)" }}>Prefer to run locally?</a>
        </p>
      </main>
      <Footer />
    </div>
  );
}
