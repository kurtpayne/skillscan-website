/* ============================================================
   ABOUT PAGE — SkillScan
   Brief, no-bullshit, privacy-first.
   ============================================================ */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Github, ExternalLink } from "lucide-react";

export default function About() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.12 0.025 265)" }}
    >
      <Navbar />

      <main className="flex-1 container pt-28 pb-16 max-w-2xl">
        <h1
          className="text-3xl font-bold mb-6"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: "oklch(0.95 0.005 265)",
          }}
        >
          About SkillScan
        </h1>

        <div
          className="space-y-5 text-sm leading-relaxed"
          style={{
            color: "oklch(0.75 0.015 265)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <p>
            SkillScan is an open-source static analysis tool for AI agent skill
            files. It scans for malicious patterns, prompt injection, data
            exfiltration, MCP tool poisoning, and container escape techniques.
          </p>

          <p>
            Everything runs offline. No skill file ever leaves your machine. No
            telemetry, no tracking, no phone-home.
          </p>

          <h2
            className="text-xl font-semibold pt-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.90 0.008 265)",
            }}
          >
            Why it exists
          </h2>
          <p>
            AI agents run code written by strangers. MCP tools, Claude skills,
            and agent configurations can contain anything — and most developers
            install them without review. SkillScan gives you a way to check
            before you trust.
          </p>

          <h2
            className="text-xl font-semibold pt-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.90 0.008 265)",
            }}
          >
            How it works
          </h2>
          <p>
            Pattern-based static analysis with a growing rule set. SARIF and
            JUnit output for CI/CD integration. No machine learning inference, no
            cloud calls — just pattern matching you can audit yourself.
          </p>

          <h2
            className="text-xl font-semibold pt-4"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.90 0.008 265)",
            }}
          >
            Who maintains it
          </h2>
          <p>
            SkillScan is maintained by{" "}
            <a
              href="https://github.com/kurtpayne"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-200"
              style={{ color: "oklch(0.78 0.18 290)" }}
            >
              Kurt Payne
            </a>
            . Contributions are welcome — see the{" "}
            <a
              href="https://github.com/kurtpayne/skillscan-security/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-200"
              style={{ color: "oklch(0.78 0.18 290)" }}
            >
              contributing guide
            </a>
            .
          </p>

          <div className="flex items-center gap-4 pt-4">
            <a
              href="https://github.com/kurtpayne/skillscan-security"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors duration-200"
              style={{ color: "oklch(0.65 0.015 265)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "oklch(0.78 0.18 290)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "oklch(0.65 0.015 265)")
              }
            >
              <Github className="w-4 h-4" />
              Source Code
            </a>
            <a
              href="https://pypi.org/project/skillscan-security/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm transition-colors duration-200"
              style={{ color: "oklch(0.65 0.015 265)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "oklch(0.78 0.18 290)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "oklch(0.65 0.015 265)")
              }
            >
              <ExternalLink className="w-3.5 h-3.5" />
              PyPI
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
