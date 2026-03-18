/* ============================================================
   FEED PAGE — SkillScan Deep Navy Design System
   Public scan feed for popular skills — coming soon placeholder
   ============================================================ */
import Navbar from "@/components/Navbar";
import { Activity, Clock, GitBranch, Radio } from "lucide-react";

const FEED_URL =
  "https://raw.githubusercontent.com/kurtpayne/skillscan-security/main/data/scan_feed.json";

export default function Feed() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.10 0.020 265)", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
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
            Coming soon
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
          >
            Public Scan Feed
          </h1>
          <p
            className="text-lg leading-relaxed mb-10"
            style={{ color: "oklch(0.65 0.015 265)" }}
          >
            Daily scan results for popular public skills from ClawHub and skills.sh — surfacing
            real findings on real skills so you can see exactly what SkillScan catches in the wild.
          </p>

          {/* Feed URL preview */}
          <div
            className="inline-flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-mono text-left"
            style={{
              background: "oklch(0.14 0.025 265)",
              border: "1px solid oklch(0.58 0.22 290 / 0.15)",
              color: "oklch(0.65 0.015 265)",
              wordBreak: "break-all",
            }}
          >
            <GitBranch className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.58 0.22 290)" }} />
            <span>{FEED_URL}</span>
          </div>
        </div>
      </section>

      {/* How it will work */}
      <section className="pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-xl font-semibold mb-8 text-center"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.85 0.010 265)" }}
          >
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Activity,
                title: "Daily GitHub Actions cron",
                body:
                  "A scheduled workflow scans ~50 popular skills from public registries every day using SkillScan's static + chain rule engine.",
              },
              {
                icon: GitBranch,
                title: "Results committed to repo",
                body:
                  "Scan results are written to data/scan_feed.json in the skillscan-security repo — auditable, versioned, no external infrastructure.",
              },
              {
                icon: Clock,
                title: "Live feed on this page",
                body:
                  "This page fetches the latest feed JSON on load and renders verdict badges, top findings, and a distribution summary across all scanned skills.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-5 rounded-xl"
                style={{
                  background: "oklch(0.14 0.025 265)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.12)",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "oklch(0.58 0.22 290 / 0.15)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "oklch(0.78 0.18 290)" }} />
                </div>
                <h3
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: "oklch(0.90 0.008 265)" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "oklch(0.60 0.012 265)" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>

          {/* Responsible disclosure note */}
          <div
            className="mt-8 p-4 rounded-lg text-sm leading-relaxed"
            style={{
              background: "oklch(0.14 0.025 265)",
              border: "1px solid oklch(0.58 0.22 290 / 0.10)",
              color: "oklch(0.60 0.012 265)",
            }}
          >
            <span style={{ color: "oklch(0.78 0.18 290)", fontWeight: 600 }}>
              Responsible disclosure.{" "}
            </span>
            Only public skills from explicit public registry listings are scanned. Findings are
            displayed at the rule-category level — not raw matched text. Each finding will include
            a dispute link so authors can contest false positives. Full methodology will be
            published in{" "}
            <a
              href="https://github.com/kurtpayne/skillscan-security/blob/main/SCAN_FEED_POLICY.md"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "oklch(0.78 0.18 290)", textDecoration: "underline" }}
            >
              SCAN_FEED_POLICY.md
            </a>{" "}
            before the feed goes live.
          </div>
        </div>
      </section>
    </div>
  );
}
