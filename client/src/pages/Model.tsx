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
              Layer 8 — Generative Detector · v4
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
            >
              SkillScan Generative Detector
            </h1>
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "oklch(0.65 0.015 265)", maxWidth: "640px" }}
            >
              A fine-tuned Qwen2.5-1.5B model that detects and explains security threats in AI agent
              skill files. Classifies 7 attack types with human-readable reasoning. Runs entirely
              offline via llama.cpp — no GPU, no network calls.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://huggingface.co/kurtpayne/skillscan-detector-v4"
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
                  v4 generative detector — first release
                </div>
                <div className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.015 265)" }}>
                  Architecture switch from DeBERTa classifier to Qwen2.5-1.5B generative model. Teacher distillation via Claude Sonnet + GPT-4o on 20k examples.
                  Shipped as GGUF Q4_K_M (~935 MB). Macro F1: <strong style={{color:"oklch(0.72 0.22 145)"}}>0.731</strong> across 7 attack classes with human-readable reasoning.
                  66 eval files upgraded to multi-label via teacher validation. The static rule engine (Layers 1–5) is unaffected and production-ready.
                </div>
              </div>
            </div>
          </div>
          <SectionHeader
            label="v4 — 2026-04-10"
            title="Generative detection layer"
            sub="The generative detector runs entirely offline via llama.cpp. It catches semantic attacks that static rules miss — with structured reasoning for each finding. v4 trained on 20,035 teacher-distilled examples (Claude Sonnet + GPT-4o) across 7 attack classes."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard value="0.731" label="Macro F1" sub="20,035 distilled examples · 7-class multi-label · honest eval" accent="oklch(0.72 0.22 145)" />
            <MetricCard value="88.9%" label="Verdict accuracy" sub="Binary safe/unsafe verdict on held-out eval set" accent="oklch(0.65 0.18 200)" />
            <MetricCard value="7" label="Attack classes" sub="Prompt injection, code injection, data exfil, supply chain, SE, evasion, path traversal" accent="oklch(0.78 0.18 290)" />
          </div>
          <div
            className="rounded-xl p-5 text-sm"
            style={{
              background: "oklch(0.14 0.022 265)",
              border: "1px solid oklch(0.58 0.22 290 / 0.15)",
              color: "oklch(0.62 0.015 265)",
            }}
          >
            The model is a QLoRA-fine-tuned Qwen2.5-1.5B, shipped as GGUF Q4_K_M (~935 MB) for offline CPU inference via llama.cpp.
            It is trained via teacher distillation: Claude Sonnet and GPT-4o labeled 20k real-world and adversarial skill files with structured verdicts, attack labels, and reasoning.
            The model generates JSON output containing a verdict (safe/unsafe), up to 7 attack type labels with confidence scores, and a human-readable explanation of detected threats.
            This represents a 6.5x macro F1 improvement over the previous DeBERTa binary classifier (0.731 vs 0.113 honest eval).
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section className="py-20 section-divider" style={{ background: "oklch(0.11 0.022 265 / 0.5)" }}>
        <div className="container">
          <SectionHeader
            label="Architecture"
            title="How the model works"
            sub="Qwen2.5-1.5B fine-tuned via QLoRA with teacher distillation, quantized to GGUF Q4_K_M for offline inference via llama.cpp."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              {[
                { label: "Base model", value: "Qwen/Qwen2.5-1.5B-Instruct" },
                { label: "Fine-tuning", value: "QLoRA (r=32, alpha=64), 3 epochs on 20k teacher-distilled examples" },
                { label: "Task", value: "Multi-label classification with reasoning (7 attack types)" },
                { label: "Inference format", value: "GGUF Q4_K_M (~935 MB)" },
                { label: "Runtime", value: "llama.cpp via llama-cpp-python, CPU-only" },
                { label: "Input", value: "Full SKILL.md text (up to 2048 tokens)" },
                { label: "Output", value: "Structured JSON with verdict, labels, confidence, and reasoning" },
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
                # Example generative detector output
              </div>
              <div className="space-y-1 text-xs" style={{ color: "oklch(0.65 0.015 265)" }}>
                <div>{"{"}</div>
                <div className="pl-4"><span style={{ color: "oklch(0.78 0.18 290)" }}>"verdict"</span>: <span style={{ color: "oklch(0.65 0.22 25)" }}>"unsafe"</span>,</div>
                <div className="pl-4"><span style={{ color: "oklch(0.78 0.18 290)" }}>"labels"</span>: [</div>
                <div className="pl-8"><span style={{ color: "oklch(0.65 0.22 25)" }}>"prompt_injection"</span>,</div>
                <div className="pl-8"><span style={{ color: "oklch(0.65 0.22 25)" }}>"data_exfiltration"</span></div>
                <div className="pl-4">],</div>
                <div className="pl-4"><span style={{ color: "oklch(0.78 0.18 290)" }}>"confidence"</span>: <span style={{ color: "oklch(0.72 0.22 145)" }}>0.91</span>,</div>
                <div className="pl-4"><span style={{ color: "oklch(0.78 0.18 290)" }}>"reasoning"</span>: <span style={{ color: "oklch(0.65 0.22 25)" }}>"Skill overrides</span></div>
                <div className="pl-8"><span style={{ color: "oklch(0.65 0.22 25)" }}>system prompt via role injection and</span></div>
                <div className="pl-8"><span style={{ color: "oklch(0.65 0.22 25)" }}>exfils context to external webhook."</span></div>
                <div>{"}"}</div>
              </div>
              <div className="mt-4 pt-4 text-xs" style={{ borderTop: "1px solid oklch(0.58 0.22 290 / 0.12)", color: "oklch(0.50 0.015 265)" }}>
                The model explains what it found and why, making findings actionable without manual triage.
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
            sub="v1–v15 used DeBERTa-v3-base binary classifier. v4 (2026-04-10) switches to Qwen2.5-1.5B generative model with 7-class multi-label classification and reasoning. v1–v10 metrics were measured on a contaminated held-out set."
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
                  { v: "v15 (2026-04-03)", corpus: "21,468 (clean)", f1: "0.8788", fpr: "—", note: "Class weight rebalancing (benign=0.866, injection=1.183, within 4× cap). Adapter fine-tuning on ProtectAI/deberta-v3-base-prompt-injection-v2. Benign F1 0.9011, injection F1 0.8565. Gate 0.75 PASSED.", current: false },
                  { v: "v4 (2026-04-10)", corpus: "20,035 (distilled)", f1: "0.731", fpr: "—", note: "Corrected eval: 66 files upgraded to multi-label via teacher validation. Macro F1 0.479 \u2192 0.731 with no model changes. Architecture switch: Qwen2.5-1.5B generative model with reasoning. Teacher distillation via Claude Sonnet + GPT-4o. 7-class multi-label.", current: true },
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

      {/* ── PER-CLASS RESULTS ── */}
      <section className="py-20 section-divider" style={{ background: "oklch(0.11 0.022 265 / 0.5)" }}>
        <div className="container">
          <SectionHeader
            label="Per-class performance"
            title="F1 scores by attack type"
            sub="v4.1 corrected eval — 66 files upgraded to multi-label via teacher validation. Macro F1 0.731 across 7 classes."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "path_traversal", f1: "0.974", accent: "oklch(0.72 0.22 145)" },
              { label: "social_engineering", f1: "0.944", accent: "oklch(0.72 0.22 145)" },
              { label: "data_exfiltration", f1: "0.836", accent: "oklch(0.72 0.22 145)" },
              { label: "code_injection", f1: "0.727", accent: "oklch(0.72 0.19 45)" },
              { label: "supply_chain", f1: "0.650", accent: "oklch(0.72 0.19 45)" },
              { label: "evasion", f1: "0.556", accent: "oklch(0.72 0.19 45)" },
              { label: "prompt_injection", f1: "0.432", accent: "oklch(0.65 0.22 25)" },
            ].map((cls) => (
              <div
                key={cls.label}
                className="rounded-xl p-5"
                style={{
                  background: "oklch(0.14 0.022 265)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.15)",
                }}
              >
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: cls.accent }}
                >
                  {cls.f1}
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {cls.label}
                </div>
              </div>
            ))}
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
                    Known coverage gaps (v4 eval)
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    "prompt_injection F1 (0.432) — taxonomy reform in progress: PI being narrowed to pure instruction override only, attacks labeled by specific payload type instead",
                    "evasion F1 (0.556) — broad category, improving with targeted corpus expansion",
                    "supply_chain F1 (0.650) — additional package-level attack patterns needed",
                    "First generative model release — expect continued improvement",
                  ].map((a) => (
                    <div key={a} className="text-xs" style={{ color: "oklch(0.60 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>
                      · {a}
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
                  v4.1 corrected eval: per-class F1 ranges from 0.432 (prompt_injection) to 0.974 (path_traversal). Prompt injection taxonomy reform underway — PI being narrowed to pure instruction override, with attacks labeled by specific payload type instead.
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
            sub="The model is not designed for direct HuggingFace inference. It is downloaded and run locally by the skillscan CLI via llama.cpp."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Install and run",
                code: `pip install 'skillscan-security[ml]'
skillscan model sync             # downloads GGUF (~935 MB)
skillscan scan path/to/skills/ --ml-detect`,
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
