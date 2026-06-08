/* ============================================================
   LEGAL PAGE — SkillScan
   Warranty disclaimer + data source attribution.
   ============================================================ */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Legal() {
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
          Legal
        </h1>

        <div
          className="space-y-6 text-sm leading-relaxed"
          style={{
            color: "oklch(0.75 0.015 265)",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {/* Disclaimer */}
          <section>
            <h2
              className="text-xl font-semibold mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.90 0.008 265)",
              }}
            >
              Disclaimer
            </h2>
            <p>
              SkillScan is provided "as is" without warranty of any kind, express
              or implied, including but not limited to the warranties of
              merchantability, fitness for a particular purpose, and
              noninfringement.
            </p>
            <p className="mt-3">
              SkillScan is a static analysis tool. A clean scan does not
              guarantee the absence of malicious behavior. It identifies known
              patterns — it cannot detect novel attacks, obfuscated payloads, or
              runtime-only behavior. Use it as one layer in a defense-in-depth
              strategy, not as your only line of defense.
            </p>
            <p className="mt-3">
              In no event shall the authors or copyright holders be liable for
              any claim, damages, or other liability arising from the use of this
              software.
            </p>
          </section>

          {/* License */}
          <section>
            <h2
              className="text-xl font-semibold mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.90 0.008 265)",
              }}
            >
              License
            </h2>
            <p>
              SkillScan is open source under the{" "}
              <a
                href="https://github.com/kurtpayne/skillscan-security/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors duration-200"
                style={{ color: "oklch(0.78 0.18 290)" }}
              >
                MIT License
              </a>
              .
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2
              className="text-xl font-semibold mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.90 0.008 265)",
              }}
            >
              Privacy
            </h2>
            <p>
              The SkillScan CLI performs all analysis locally. No files, scan
              results, or telemetry are transmitted to any server.
            </p>
            <p className="mt-3">
              This website uses self-hosted{" "}
              <a
                href="https://umami.is"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors duration-200"
                style={{ color: "oklch(0.78 0.18 290)" }}
              >
                Umami
              </a>{" "}
              for privacy-respecting analytics. No cookies. No personal data
              collected. No third-party tracking.
            </p>
          </section>

          {/* Data Sources & Attribution */}
          <section>
            <h2
              className="text-xl font-semibold mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.90 0.008 265)",
              }}
            >
              Attribution
            </h2>
            <p>SkillScan's detection rules draw on publicly available threat intelligence and research, including:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5" style={{ color: "oklch(0.65 0.015 265)" }}>
              <li>
                <a
                  href="https://attack.mitre.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: "oklch(0.78 0.18 290)" }}
                >
                  MITRE ATT&CK®
                </a>{" "}
                framework for threat classification
              </li>
              <li>
                <a
                  href="https://owasp.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: "oklch(0.78 0.18 290)" }}
                >
                  OWASP
                </a>{" "}
                for web and application security patterns
              </li>
              <li>
                <a
                  href="https://cwe.mitre.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: "oklch(0.78 0.18 290)" }}
                >
                  CWE
                </a>{" "}
                (Common Weakness Enumeration)
              </li>
              <li>Community-submitted detection patterns via GitHub issues</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2
              className="text-xl font-semibold mb-3"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.90 0.008 265)",
              }}
            >
              Contact
            </h2>
            <p>
              For security disclosures, use the{" "}
              <a
                href="https://github.com/kurtpayne/skillscan-security/security/advisories/new"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors duration-200"
                style={{ color: "oklch(0.78 0.18 290)" }}
              >
                GitHub Security Advisory
              </a>{" "}
              process. For everything else, open an{" "}
              <a
                href="https://github.com/kurtpayne/skillscan-security/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 transition-colors duration-200"
                style={{ color: "oklch(0.78 0.18 290)" }}
              >
                issue
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
