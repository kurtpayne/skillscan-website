/* ============================================================
   TERMINAL SCAN — Animated live scan output component
   Design: Deep navy, violet/orange/green color-coded output
   Animation: Lines appear sequentially with a typing cursor
   ============================================================ */
import { useEffect, useState, useRef } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Minus } from "lucide-react";

interface ScanLine {
  type: "cmd" | "info" | "pass" | "block" | "warn" | "blank" | "summary";
  text: string;
  delay: number; // ms after previous line
}

const SCAN_SEQUENCE: ScanLine[] = [
  { type: "cmd",     text: "$ skillscan scan ./skills/ --format compact", delay: 0 },
// AUTO_SYNC_BEGIN: rulepack
  { type: "info",    text: "SkillScan v2026.04.25.1  •  rulepack 2026.04.25.1  •  238 rules loaded", delay: 600 },
// AUTO_SYNC_END: rulepack
  { type: "info",    text: "Scanning 5 skill files in ./skills/ ...", delay: 400 },
  { type: "blank",   text: "", delay: 300 },
  { type: "pass",    text: "verdict=allow  score=0    findings=0  search_tool.md", delay: 350 },
  { type: "pass",    text: "verdict=allow  score=0    findings=0  user_manager.md", delay: 280 },
  { type: "warn",    text: "verdict=warn   score=35   findings=1  analytics.md", delay: 320 },
  { type: "info",    text: "  - SE-SEM-001 [high/critical] Credential-harvest pattern @ analytics.md", delay: 180 },
  { type: "block",   text: "verdict=block  score=180  findings=1  data_processor.md", delay: 380 },
  { type: "info",    text: "  - CHN-001 [critical/critical] Download+execute chain @ data_processor.md:12", delay: 180 },
  { type: "block",   text: "verdict=block  score=70   findings=1  injector.md", delay: 280 },
  { type: "info",    text: "  - PINJ-001 [high/high] Prompt override / jailbreak @ injector.md:1", delay: 180 },
  { type: "blank",   text: "", delay: 300 },
  { type: "summary", text: "verdict=block  score=285  findings=3  exit=1", delay: 400 },
];

const lineColors = {
  cmd:     "oklch(0.70 0.015 265)",
  info:    "oklch(0.55 0.015 265)",
  pass:    "oklch(0.70 0.15 160)",
  block:   "oklch(0.65 0.22 25)",
  warn:    "oklch(0.72 0.19 45)",
  blank:   "transparent",
  summary: "oklch(0.78 0.18 290)",
};

function LineIcon({ type }: { type: ScanLine["type"] }) {
  const size = "w-3.5 h-3.5 flex-shrink-0 mt-0.5";
  if (type === "pass")    return <CheckCircle2 className={size} style={{ color: lineColors.pass }} />;
  if (type === "block")   return <XCircle className={size} style={{ color: lineColors.block }} />;
  if (type === "warn")    return <AlertTriangle className={size} style={{ color: lineColors.warn }} />;
  if (type === "summary") return <Minus className={size} style={{ color: lineColors.summary }} />;
  return <span className="w-3.5 flex-shrink-0" />;
}

export default function TerminalScan({ compact = false }: { compact?: boolean }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startAnimation = () => {
    setVisibleCount(0);
    setRunning(true);
  };

  useEffect(() => {
    // Auto-start on mount
    const initTimer = setTimeout(startAnimation, 800);
    return () => clearTimeout(initTimer);
  }, []);

  useEffect(() => {
    if (!running) return;
    if (visibleCount >= SCAN_SEQUENCE.length) {
      // Pause then restart loop
      timerRef.current = setTimeout(() => {
        setVisibleCount(0);
      }, 4000);
      return;
    }
    const line = SCAN_SEQUENCE[visibleCount];
    timerRef.current = setTimeout(() => {
      setVisibleCount((c) => c + 1);
      // Auto-scroll
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, line.delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [running, visibleCount]);

  const visibleLines = SCAN_SEQUENCE.slice(0, visibleCount);
  const isComplete = visibleCount >= SCAN_SEQUENCE.length;

  // Compact mode: show only key verdict lines for mobile
  const compactLines = visibleLines.filter(
    (l) => l.type === "cmd" || l.type === "block" || l.type === "warn" || l.type === "summary"
  );
  const displayLines = compact ? compactLines : visibleLines;

  return (
    <div
      className="rounded-xl overflow-hidden select-none"
      style={{
        background: "oklch(0.09 0.018 265)",
        border: "1px solid oklch(0.58 0.22 290 / 0.25)",
        boxShadow: "0 0 60px oklch(0.58 0.22 290 / 0.12), 0 24px 64px oklch(0 0 0 / 0.5)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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
          className="ml-3 text-xs flex-1 truncate"
          style={{ color: "oklch(0.40 0.012 265)" }}
        >
          terminal — skillscan
        </span>
        {/* Live indicator */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isComplete ? "oklch(0.55 0.015 265)" : "oklch(0.70 0.15 160)",
              boxShadow: isComplete ? "none" : "0 0 6px oklch(0.70 0.15 160 / 0.8)",
              animation: isComplete ? "none" : "pulse 1.5s ease-in-out infinite",
            }}
          />
          <span className="text-xs" style={{ color: "oklch(0.40 0.012 265)" }}>
            {isComplete ? "done" : "scanning"}
          </span>
        </div>
      </div>

      {/* Output area */}
      <div
        ref={containerRef}
        className="p-4 overflow-y-auto space-y-1"
        style={compact ? { minHeight: "160px", maxHeight: "200px" } : { minHeight: "320px", maxHeight: "380px" }}
      >
        {displayLines.map((line, i) => {
          if (line.type === "blank") return <div key={i} className="h-2" />;
          return (
            <div key={i} className="flex items-start gap-2 text-xs leading-relaxed">
              <LineIcon type={line.type} />
              <span
                style={{
                  color: lineColors[line.type],
                  whiteSpace: "pre",
                  letterSpacing: line.type === "cmd" ? "0" : "-0.01em",
                }}
              >
                {line.text}
              </span>
            </div>
          );
        })}

        {/* Blinking cursor while animating */}
        {!isComplete && (
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3.5" />
            <span
              className="inline-block w-2 h-3.5 rounded-sm"
              style={{
                background: "oklch(0.58 0.22 290)",
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
