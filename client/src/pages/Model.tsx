/* ============================================================
   MODEL PAGE — SkillScan ML Detection Model
   Design: Deep Navy system, violet accent
   Sections: Hero, Architecture, Performance, Version History,
             What it detects, Limitations, How to use
   ============================================================ */
import { ExternalLink, ChevronRight, CheckCircle2, XCircle, AlertTriangle, FlaskConical, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div className="mb-10">
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
        style={{
          background: "oklch(0.58 0.22 290 / 0.12)",
          border: "1px solid oklch(0.58 0.22 290 / 0.30)",
          color: "oklch(0.78 0.18 290)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </div>
      <h2
        className="text-2xl sm:text-3xl font-bold mb-3"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
      >
        {title}
      </h2>
      {sub && (
        <p className="text-base max-w-2xl" style={{ color: "oklch(0.60 0.015 265)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function MetricCard({ value, label, sub, accent = "oklch(0.78 0.18 290)" }: { value: string; label: string; sub?: string; accent?: string }) {
  return (
    <div
      className="rounded-xl p-6 text-center"
      style={{
        background: "oklch(0.14 0.022 265)",
        border: "1px solid oklch(0.58 0.22 290 / 0.20)",
      }}
    >
      <div
        className="text-3xl font-bold mb-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: accent }}
      >
        {value}
      </div>
      <div className="text-sm font-medium mb-1" style={{ color: "oklch(0.80 0.005 265)" }}>
        {label}
      </div>
      {sub && (
        <div className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function Model() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
        <div className="container">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "oklch(0.72 0.19 45 / 0.12)",
                border: "1px solid oklch(0.72 0.19 45 / 0.35)",
                color: "oklch(0.82 0.15 45)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Layer 6 — ML Classifier · v15
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
            >
              SkillScan DeBERTa Adapter
            </h1>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "oklch(0.65 0.015 265)", maxWidth: "640px" }}
            >
              A LoRA-fine-tuned DeBERTa-v3-base model for detecting prompt injection, jailbreaks,
              and semantic attacks in AI agent skill files. Runs entirely offline via ONNX Runtime.
              No network calls at scan time.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://huggingface.co/kurtpayne/skillscan-deberta-adapter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold btn-primary-glow"
              >
                View on HuggingFace
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/kurtpayne/skillscan-security/blob/main/docs/MODEL_METRICS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: "oklch(0.18 0.025 265)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.25)",
                  color: "oklch(0.85 0.01 265)",
                }}
              >
                Full metrics history
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── BETA NOTICE ── */}
      <section className="py-20">
        <div className="container">
          <div
            className="rounded-xl p-6 mb-10"
            style={{
              background: "oklch(0.72 0.19 45 / 0.07)",
              border: "1px solid oklch(0.72 0.19 45 / 0.35)",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.72 0.19 45)" }} />
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: "oklch(0.85 0.12 45)" }}>
                  ML detection is experimental — v15 results available
                </div>
                <div className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.015 265)" }}>
                  v15 training completed 2026-04-03 on a 21,468-example corpus with class weight rebalancing (benign=0.866, injection=1.183) and adapter fine-tuning via ProtectAI/deberta-v3-base-prompt-injection-v2.
                  Macro F1: <strong style={{color:"oklch(0.72 0.22 145)"}}>0.8788</strong> (benign F1 0.9011, injection F1 0.8565).
                  v14 (2026-03-30): Macro F1 0.9023, benign recall 90.2%, injection recall 92.9%.
                  The static rule engine (Layers 1–5) is unaffected and production-ready.
                </div>
              </div>
            </div>
          </div>
          <SectionHeader
            label="v15 — 2026-04-03"
            title="ML detection layer"
            sub="The ML classifier runs entirely offline via ONNX Runtime. It catches semantic attacks that static rules miss — jailbreaks, indirect injection, and novel archetypes. v15 trained on 21,468 examples with class weight rebalancing (benign=0.866, injection=1.183) and fine-tuning on top of ProtectAI/deberta-v3-base-prompt-injection-v2."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard value="0.8788" label="v15 Macro F1" sub="21,468 training examples · class weights balanced · gate 0.75 PASSED" accent="oklch(0.72 0.22 145)" />
            <MetricCard value="0.9011" label="v15 benign F1" sub="Injection F1 0.8565 · weights: benign=0.866, injection=1.183" accent="oklch(0.65 0.18 200)" />
            <MetricCard value="14+" label="Attack families" sub="Jailbreaks, MCP attacks, supply chain, SE" accent="oklch(0.78 0.18 290)" />
          </div>
          <div
            className="rounded-xl p-5 text-sm"
            style={{
              background: "oklch(0.14 0.022 265)",
              border: "1px solid oklch(0.58 0.22 290 / 0.15)",
              color: "oklch(0.62 0.015 265)",
            }}
          >
            The model is a LoRA-fine-tuned DeBERTa-v3-base adapter, shipped as ONNX FP32 (~350 MB) for offline CPU inference.
            It is trained on a corpus of real-world agent skill files and adversarially crafted injection examples across 14+ attack families.
            v15 (2026-04-03): Macro F1 0.8788, benign F1 0.9011, injection F1 0.8565. Trained on 21,468 examples. Class weights: benign=0.866, injection=1.183 (within 4× cap). Base: ProtectAI/deberta-v3-base-prompt-injection-v2. Adapter: kurtpayne/skillscan-deberta-adapter (ONNX). F1 gate 0.75 PASSED.
            v14 (2026-03-30): Macro F1 0.9023, injection recall 92.9%, FPR 16.2%, benign recall 90.2% on 20,865 examples. v11 true F1 was 0.555 on 259 clean examples (injection recall 19.6%) after C-2 decontamination.
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section className="py-20 section-divider" style={{ background: "oklch(0.11 0.022 265 / 0.5)" }}>
        <div className="container">
          <SectionHeader
            label="Architecture"
            title="How the model works"
            sub="DeBERTa-v3-base fine-tuned via LoRA, exported to ONNX FP32 for offline inference."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              {[
                { label: "Base model", value: "microsoft/deberta-v3-base" },
                { label: "Fine-tuning", value: "LoRA (Low-Rank Adaptation), r=64, alpha=128" },
                { label: "Task", value: "Binary classification: BENIGN / INJECTION" },
                { label: "Inference format", value: "ONNX FP32 (~350 MB)" },
                { label: "Runtime", value: "ONNX Runtime (CPU), no GPU required" },
                { label: "Input", value: "Raw SKILL.md text, chunked to 512 tokens with 64-token stride" },
                { label: "Output", value: "Per-chunk injection probability; verdict = max-pool over chunks" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex gap-4 py-3"
                  style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}
                >
                  <div
                    className="text-xs font-semibold flex-shrink-0 w-36"
                    style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'Space Grotesk', sans-serif", paddingTop: "2px" }}
                  >
                    {row.label}
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: "oklch(0.82 0.005 265)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(0.09 0.018 265)",
                border: "1px solid oklch(0.58 0.22 290 / 0.20)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <div className="text-xs mb-4" style={{ color: "oklch(0.50 0.015 265)" }}>
                # Sliding-window chunking strategy
              </div>
              <div className="space-y-2 text-xs" style={{ color: "oklch(0.65 0.015 265)" }}>
                <div><span style={{ color: "oklch(0.78 0.18 290)" }}>for</span> chunk <span style={{ color: "oklch(0.78 0.18 290)" }}>in</span> sliding_window(skill_text, size=512, stride=64):</div>
                <div className="pl-4">prob = model.score(chunk)  <span style={{ color: "oklch(0.50 0.015 265)" }}># 0.0–1.0</span></div>
                <div className="pl-4">scores.append(prob)</div>
                <div></div>
                <div>verdict = max(scores)  <span style={{ color: "oklch(0.50 0.015 265)" }}># max-pool</span></div>
                <div><span style={{ color: "oklch(0.78 0.18 290)" }}>if</span> verdict &gt; threshold:  <span style={{ color: "oklch(0.50 0.015 265)" }}># default 0.70</span></div>
                <div className="pl-4"><span style={{ color: "oklch(0.65 0.22 25)" }}>flag</span>(file, score=verdict)</div>
              </div>
              <div className="mt-4 pt-4 text-xs" style={{ borderTop: "1px solid oklch(0.58 0.22 290 / 0.12)", color: "oklch(0.50 0.015 265)" }}>
                A single malicious instruction buried deep in a large file is not diluted by surrounding benign content.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERSION HISTORY ── */}
      <section className="py-20">
        <div className="container">
          <SectionHeader
            label="Training history"
            title="Model training progression"
            sub="v1–v10 metrics were measured on a held-out set later found to have contamination. v11 post-audit F1 is 0.555 on 259 clean examples. v15 (2026-04-03) achieved Macro F1 0.8788 with class weight rebalancing on 21,468 examples."
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                  {["Version", "Corpus size", "Macro F1", "FPR", "Key improvement"].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 pr-6 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "oklch(0.55 0.015 265)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { v: "v1278", corpus: "1,278", f1: "0.2690", fpr: "95.7%", note: "Baseline — heavily injection-biased base model", current: false },
                  { v: "v7458", corpus: "7,277", f1: "0.8448", fpr: "15.7%", note: "First gate pass; corpus expansion from 210 → 7,277", current: false },
                  { v: "v11461", corpus: "11,461", f1: "0.9110", fpr: "11.45%", note: "Enterprise benign corpus; MCP/SE coverage", current: false },
                  { v: "v16589", corpus: "16,589", f1: "0.9608", fpr: "3.69%", note: "Gap archetype closure; enterprise adversarial examples", current: false },
                  { v: "v18161", corpus: "18,161", f1: "0.9752", fpr: "1.89%", note: "Both SaaS quality thresholds met", current: false },
                  { v: "v18258", corpus: "18,258", f1: "—", fpr: "—", note: "Contaminated eval — superseded by v11", current: false },
                  { v: "v11 (2026-03-29)", corpus: "19,511 (contaminated)", f1: "0.555", fpr: "5.71%", note: "Post-audit: true F1 on 259 clean examples. Injection recall 19.6%. C-2 decontamination applied.", current: false },
                  { v: "v12 (2026-03-29)", corpus: "21,149 (clean)", f1: "0.7287", fpr: "2.49%", note: "Decontaminated corpus + 86 targeted injection examples. Injection recall 96.6%, benign F1 0.760. Gate 0.70 PASSED.", current: false },
                  { v: "v13 (2026-03-30)", corpus: "21,149 (clean)", f1: "0.7873", fpr: "1.78%", note: "47 targeted FN archetype additions (mcp_server_imp, org_mal047, se_git_config_harvest). Injection recall 97.4%, benign precision 98.2%. Gate 0.75 PASSED.", current: false },
                  { v: "v14 (2026-03-30)", corpus: "20,865 (clean)", f1: "0.9023", fpr: "16.2%", note: "90 hard-negative benign examples (devops/sysadmin/cloud/enterprise/MCP/devtool) + 44 injection. Benign recall 90.2% (up from 70.2%), injection recall 92.9%. Gate 0.75 PASSED.", current: false },
                  { v: "v15 (2026-04-03)", corpus: "21,468 (clean)", f1: "0.8788", fpr: "—", note: "Class weight rebalancing (benign=0.866, injection=1.183, within 4× cap). Adapter fine-tuning on ProtectAI/deberta-v3-base-prompt-injection-v2. Benign F1 0.9011, injection F1 0.8565. Gate 0.75 PASSED.", current: true },
                ].map((row) => (
                  <tr
                    key={row.v}
                    style={{
                      borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)",
                      background: row.current ? "oklch(0.58 0.22 290 / 0.06)" : "transparent",
                    }}
                  >
                    <td className="py-4 pr-6">
                      <span
                        style={{
                          color: row.current ? "oklch(0.88 0.18 290)" : "oklch(0.70 0.015 265)",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: row.current ? "700" : "400",
                        }}
                      >
                        {row.v}
                        {row.current && (
                          <span
                            className="ml-2 px-1.5 py-0.5 rounded text-xs"
                            style={{
                              background: "oklch(0.58 0.22 290 / 0.20)",
                              color: "oklch(0.78 0.18 290)",
                            }}
                          >
                            current
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 pr-6 text-xs" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.corpus}
                    </td>
                    <td className="py-4 pr-6 font-semibold" style={{ color: row.current ? "oklch(0.78 0.18 290)" : "oklch(0.72 0.005 265)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.f1}
                    </td>
                    <td className="py-4 pr-6" style={{ color: row.current ? "oklch(0.70 0.15 160)" : "oklch(0.65 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>
                      {row.fpr}
                    </td>
                    <td className="py-4 text-xs" style={{ color: "oklch(0.60 0.015 265)" }}>
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── WHAT IT DETECTS ── */}
      <section className="py-20 section-divider" style={{ background: "oklch(0.11 0.022 265 / 0.5)" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Detects */}
            <div>
              <SectionHeader label="Coverage" title="What the model detects" />
              <div className="space-y-3">
                {[
                  { cat: "Prompt injection", ex: "Role overrides, fake system headers, goal hijacking, context extraction" },
                  { cat: "Jailbreaks", ex: "DAN-style, consistency appeals, refusal prohibitions, developer mode" },
                  { cat: "Indirect injection", ex: "RSS feed poisoning, tool result injection, \"when you read this\" triggers" },
                  { cat: "Exfiltration", ex: "DNS exfil, webhook callbacks, error message + secret patterns" },
                  { cat: "Supply chain", ex: "Malicious pip install hooks, setup.py backdoors, package name typosquatting" },
                  { cat: "Social engineering", ex: "Urgency framing, prize/reward scams, credential verification pretexts" },
                  { cat: "MCP-specific attacks", ex: "Tool name spoofing, sampling exfiltration, multi-agent hijack" },
                ].map((item) => (
                  <div key={item.cat} className="flex gap-3">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.70 0.15 160)" }} />
                    <div>
                      <div className="text-sm font-semibold mb-0.5" style={{ color: "oklch(0.88 0.005 265)" }}>{item.cat}</div>
                      <div className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>{item.ex}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Does not detect */}
            <div>
              <SectionHeader label="Limitations" title="What it does not detect" />
              <div className="space-y-3 mb-8">
                {[
                  { issue: "Runtime-conditional payloads", detail: "Instructions that activate only when a specific date, env var, or API response is present. Requires dynamic execution to detect." },
                  { issue: "Indirect injection from external content", detail: "A skill that fetches a malicious RSS feed at runtime cannot be flagged by static analysis of the skill file itself." },
                  { issue: "Infrastructure-level MCP trust", detail: "Whether an MCP server at a given URL is legitimate cannot be determined from the skill file alone." },
                  { issue: "Semantic obfuscation at high sophistication", detail: "Attacks encoded in multi-layer base64 + steganography + homoglyph substitution may evade detection if no training variants exist." },
                ].map((item) => (
                  <div key={item.issue} className="flex gap-3">
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "oklch(0.65 0.22 25)" }} />
                    <div>
                      <div className="text-sm font-semibold mb-0.5" style={{ color: "oklch(0.88 0.005 265)" }}>{item.issue}</div>
                      <div className="text-xs" style={{ color: "oklch(0.55 0.015 265)" }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Known FN archetypes */}
              <div
                className="rounded-xl p-5"
                style={{
                  background: "oklch(0.72 0.19 45 / 0.06)",
                  border: "1px solid oklch(0.72 0.19 45 / 0.20)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4" style={{ color: "oklch(0.72 0.19 45)" }} />
                  <span className="text-xs font-semibold" style={{ color: "oklch(0.72 0.19 45)" }}>
                    Known coverage gaps (v15 eval)
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    "hallucination squatting (new archetype, 2026-03-29)",
                    "calendar event indirect injection (new archetype, 2026-03-29)",
                    "README-driven dropper / AMOS pattern",
                    "telemetry exfil disguised as analytics",
                    "mcp_server_impersonation — ongoing coverage target",
                    "macro F1 regression v14→v15 (0.9023→0.8788) — class balance tradeoff",
                  ].map((a) => (
                    <div key={a} className="text-xs" style={{ color: "oklch(0.60 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>
                      · {a}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
                  These archetypes are tracked across v14–v15 eval. Class weight rebalancing in v15 (benign=0.866, injection=1.183) improved injection coverage at the cost of a small macro F1 regression; the overall balance is better calibrated.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TO USE ── */}
      <section className="py-20">
        <div className="container">
          <SectionHeader
            label="Usage"
            title="How to use the model"
            sub="The model is not designed for direct HuggingFace inference. It is downloaded and run locally by the skillscan CLI via ONNX Runtime."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Install and run",
                code: `pip install skillscan-security
skillscan model install          # downloads ONNX adapter (~350 MB)
skillscan scan path/to/skills/   # static rules + ML detection`,
              },
              {
                title: "Check model status",
                code: `skillscan model status
# shows installed version vs HF Hub latest`,
              },
              {
                title: "Update to latest",
                code: `skillscan update
# pulls latest rules, intel DB, and model`,
              },
              {
                title: "CI/CD (no model download)",
                code: `skillscan scan path/to/skills/ --no-model
# static rules only, skips ML layer`,
              },
            ].map((block) => (
              <div
                key={block.title}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}
              >
                <div
                  className="px-4 py-2.5 text-xs font-semibold"
                  style={{
                    background: "oklch(0.14 0.022 265)",
                    borderBottom: "1px solid oklch(0.58 0.22 290 / 0.12)",
                    color: "oklch(0.65 0.015 265)",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {block.title}
                </div>
                <pre
                  className="p-4 text-xs overflow-x-auto"
                  style={{
                    background: "oklch(0.09 0.018 265)",
                    color: "oklch(0.78 0.18 290)",
                    fontFamily: "'JetBrains Mono', monospace",
                    margin: 0,
                  }}
                >
                  <code>{block.code}</code>
                </pre>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold btn-primary-glow"
            >
              Full CLI documentation
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/kurtpayne/skillscan-security/blob/main/docs/DETECTION_MODEL.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: "oklch(0.18 0.025 265)",
                border: "1px solid oklch(0.58 0.22 290 / 0.25)",
                color: "oklch(0.85 0.01 265)",
              }}
            >
              Detection model architecture doc
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ── CORPUS CTA ── */}
      <section className="py-20 section-divider" style={{ background: "oklch(0.11 0.022 265 / 0.5)" }}>
        <div className="container">
          <div
            className="rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8"
            style={{
              background: "oklch(0.13 0.022 265 / 0.8)",
              border: "1px solid oklch(0.55 0.20 160 / 0.30)",
              boxShadow: "0 0 40px oklch(0.55 0.20 160 / 0.06)",
            }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "oklch(0.55 0.20 160 / 0.15)",
                border: "1px solid oklch(0.55 0.20 160 / 0.30)",
              }}
            >
              <FlaskConical className="w-7 h-7" style={{ color: "oklch(0.70 0.18 160)" }} />
            </div>
            <div className="flex-1">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
              >
                Help improve the model
              </h2>
              <p className="text-sm leading-relaxed mb-1" style={{ color: "oklch(0.62 0.015 265)" }}>
                The model improves with every corpus expansion. Each new version is trained on a larger, more diverse set of skill samples
                and evaluated against the same locked holdout set — so improvements are always verifiable.
              </p>
              <p className="text-sm" style={{ color: "oklch(0.50 0.015 265)" }}>
                Submit a benign or malicious skill sample via GitHub Issues. Accepted samples go into the training corpus.
                They do <em>not</em> affect the static rule layer.
              </p>
            </div>
            <a
              href="https://github.com/kurtpayne/skillscan-security/issues/new?template=corpus-submission.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm flex-shrink-0 transition-all duration-200"
              style={{
                background: "oklch(0.55 0.20 160 / 0.15)",
                border: "1px solid oklch(0.55 0.20 160 / 0.40)",
                color: "oklch(0.75 0.18 160)",
                fontFamily: "'Space Grotesk', sans-serif",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.20 160 / 0.25)";
                (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.55 0.20 160 / 0.60)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "oklch(0.55 0.20 160 / 0.15)";
                (e.currentTarget as HTMLElement).style.borderColor = "oklch(0.55 0.20 160 / 0.40)";
              }}
            >
              Submit a sample
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
