/* ============================================================
   BLOG POST — v4.2 Richer Output, Fewer Misses
   Design: Deep Navy system, violet accent — matches site design
   Audience: Security engineers, ML practitioners, enterprise evaluators
   ============================================================ */
import { useState } from "react";
import { Link } from "wouter";
import { Copy, Check, ArrowLeft, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl overflow-hidden my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "oklch(0.14 0.022 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
        <span className="text-xs" style={{ color: "oklch(0.45 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
          className="flex items-center gap-1.5 text-xs transition-colors duration-200"
          style={{ color: copied ? "oklch(0.70 0.15 160)" : "oklch(0.50 0.015 265)" }}
          aria-label="Copy to clipboard">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs" style={{ background: "oklch(0.09 0.018 265)", color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MetricRow({ label, oldV, newV, better }: { label: string; oldV: string; newV: string; better?: boolean }) {
  return (
    <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
      <td className="py-2.5 pr-4 text-sm" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>{label}</td>
      <td className="py-2.5 px-4 text-sm text-center" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'JetBrains Mono', monospace" }}>{oldV}</td>
      <td className="py-2.5 pl-4 text-sm text-center font-semibold" style={{ color: better ? "oklch(0.75 0.18 160)" : "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{newV}</td>
    </tr>
  );
}

export default function BlogV42Richer() {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://skillscan.sh/blog/v42-richer";

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">

          {/* Back link */}
          <Link href="/blog">
            <a className="inline-flex items-center gap-2 text-sm mb-10 transition-colors duration-200"
              style={{ color: "oklch(0.55 0.015 265)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.78 0.18 290)")}
              onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.55 0.015 265)")}>
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </a>
          </Link>

          {/* Hero */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "oklch(0.58 0.22 290 / 0.12)", color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>ML / Training</span>
              <span className="text-xs" style={{ color: "oklch(0.45 0.012 265)" }}>Apr 17, 2026 · 12 min read</span>
              <button
                onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{ background: copied ? "oklch(0.70 0.15 160 / 0.12)" : "oklch(0.58 0.22 290 / 0.08)", color: copied ? "oklch(0.70 0.15 160)" : "oklch(0.55 0.015 265)", border: `1px solid ${copied ? "oklch(0.70 0.15 160 / 0.30)" : "oklch(0.58 0.22 290 / 0.15)"}` }}
                aria-label="Copy link to clipboard">
                {copied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
            <h1 className="text-4xl font-bold mb-5 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}>
              Richer Output, Fewer Misses: Shipping SkillScan Detector v4.2
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.015 265)" }}>
              Three failed training iterations. A one-line parser bug that was silently suppressing our
              reported metrics. A near-miss where a prompt mismatch almost hid the actual win. This is the
              honest path from v4.1 to v4.2 — a detector that now catches 99.4% of threats on our held-out
              eval, with zero false negatives, and returns structured severity, sub-classes, and
              affected-line information alongside every verdict.
            </p>
          </header>

          {/* Article body */}
          <article className="space-y-8" style={{ color: "oklch(0.68 0.015 265)", lineHeight: "1.75" }}>

            {/* Section 1 — Three failed iterations */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Three failed iterations after v4.1
              </h2>
              <p>
                v4.1 landed at macro F1 0.731 on multi-label categorization — a big jump over the encoder
                era. The obvious next move was to keep iterating on the same axis. So we did, three
                different ways, over three weeks. Each time the number went the wrong direction.
              </p>
              <div className="overflow-x-auto rounded-xl my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "oklch(0.16 0.025 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Attempt</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Hypothesis</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'Space Grotesk', sans-serif" }}>Macro F1</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
                      <td className="py-2.5 pr-4 text-sm" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>v4.1 (baseline)</td>
                      <td className="py-2.5 px-4 text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>—</td>
                      <td className="py-2.5 pl-4 text-sm text-center font-semibold" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>0.731</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
                      <td className="py-2.5 pr-4 text-sm" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>v4.2 (attempt 1)</td>
                      <td className="py-2.5 px-4 text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>Strip prompt-injection co-labels to sharpen primary-class signal</td>
                      <td className="py-2.5 pl-4 text-sm text-center font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'JetBrains Mono', monospace" }}>0.649</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
                      <td className="py-2.5 pr-4 text-sm" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>v4.2.1</td>
                      <td className="py-2.5 px-4 text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>Re-distill 250 stale teacher analyses</td>
                      <td className="py-2.5 pl-4 text-sm text-center font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'JetBrains Mono', monospace" }}>0.685</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-4 text-sm" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>v4.3</td>
                      <td className="py-2.5 px-4 text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>Full re-distill with "specificity ordering" prompt</td>
                      <td className="py-2.5 pl-4 text-sm text-center font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'JetBrains Mono', monospace" }}>0.592</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p>
                After the third regression, the explanation stopped being "we picked a bad hyperparameter"
                and started being "we're measuring the wrong thing." The teacher models define both the
                training targets <em>and</em> the evaluation gold labels. That makes "model improved" and
                "model matches teacher better" indistinguishable on F1. When the teacher distribution
                shifts — even slightly, from a re-distill or a prompt tweak — the metric moves, and it's
                impossible to tell from the number alone whether the student got better at the real task
                or just better at mimicking the new teacher.
              </p>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>Circular signal</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  If your teacher labels define both what the student is trained to predict <em>and</em> what
                  the student is evaluated against, macro F1 measures teacher-imitation, not detection
                  quality. You can keep tuning forever and the curve will look like noise.
                </p>
              </div>
            </section>

            {/* Section 2 — Stepping back */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What does "better" actually mean?
              </h2>
              <p>
                We stepped back and listed the axes a detector could improve on:
              </p>
              <div className="space-y-4 mt-5">
                {[
                  { num: "01", title: "Accuracy", body: "Verdict correctness and per-class F1. The metric we had been chasing, now clearly hitting a ceiling shaped by the teacher labels." },
                  { num: "02", title: "Coverage", body: "Does it catch the archetypes the static rules miss? Does it generalize to novel attack shapes?" },
                  { num: "03", title: "Output richness", body: "Does the detection carry enough information for a human reviewer to act? A bare 'malicious' verdict is less useful than a verdict plus severity plus the lines to look at." },
                  { num: "04", title: "Deployment size and speed", body: "Model size, inference latency on CPU and GPU, memory footprint. These determine whether the detector can run in constrained environments." },
                  { num: "05", title: "Self-improvement", body: "Can the detector help generate its own training signal — via adversarial variants, trace validation, user feedback?" },
                  { num: "06", title: "Trust", body: "Calibration, reasoning quality, failure-mode transparency. Can a user look at an output and decide whether to believe it?" },
                ].map(item => (
                  <div key={item.num} className="flex gap-5 p-5 rounded-xl" style={{ background: "oklch(0.14 0.022 265 / 0.6)", border: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
                    <span className="text-2xl font-bold shrink-0" style={{ color: "oklch(0.58 0.22 290 / 0.35)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.num}</span>
                    <div>
                      <p className="font-semibold mb-1.5 text-sm" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</p>
                      <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5">
                We had been optimizing axis 1 and hitting a circular-signal ceiling. Axis 3 — output
                richness — had a much clearer path. Severity, sub-classes, and affected-line numbers are
                concrete, verifiable, and don't require the model to be <em>more correct</em> to be
                <em> more useful</em>. We picked that as the investment.
              </p>
              <p className="mt-4">
                The other constraint: we did not want a regression vector. Changing the existing label
                taxonomy risked breaking everything that already worked. So we decided to <em>augment</em>
                rather than replace — keep verdict and labels exactly as they were in v4.1, add the new
                fields via a second distillation pass over the existing teacher outputs.
              </p>
            </section>

            {/* Section 3 — The $7 bug */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                The $7 bug that was making v4.1 look worse than it was
              </h2>
              <p>
                Before we kicked off training, we ran a validation pass with skillscan-trace using a
                dual-LLM judge (GPT-4o and Claude Sonnet 4.5) on the 144 held-out files where v4.1's
                prediction disagreed with the gold label. Cost: about $7. The intent was to find
                systematic errors in the model. What we found was an error in the harness.
              </p>
              <p className="mt-4">
                Twenty-two of the disagreements were on benign enterprise eval files that our parser was
                silently labeling as malicious. The offending line:
              </p>
              <CodeBlock lang="python" code={`def parse_ground_truth(frontmatter: dict) -> str:
    # BUG: any label value other than literal "benign" was treated as malicious
    return "benign" if frontmatter.get("label") == "benign" else "malicious"`} />
              <p>
                Twenty-two files in the enterprise eval set use <InlineCode>label: SAFE</InlineCode>
                instead of <InlineCode>label: benign</InlineCode>. The parser flipped them to malicious
                ground truth. The model was correctly calling them benign — and being scored as wrong
                for it. One line fixed moved v4.1's reported verdict accuracy meaningfully upward.
              </p>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>Our measurement was broken, not our model.</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Three training iterations couldn't overcome a one-line parser bug. The regressions we
                  had been chasing were partly noise and partly a measurement floor we couldn't get
                  below. This is the strongest argument for validating measurement before optimizing.
                </p>
              </div>
            </section>

            {/* Section 4 — Schema augmentation */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Schema augmentation at scale
              </h2>
              <p>
                With the measurement issue fixed, we ran the schema augmentation. The 24,913 existing
                v4.1 teacher analyses went through the OpenAI Batch API with a prompt that was explicit
                about what not to touch:
              </p>
              <CodeBlock lang="text" code={`You are augmenting an existing threat analysis. Keep the existing
verdict, labels, and reasoning fields EXACTLY as written. Do not
re-classify, re-label, or re-word.

Add four new fields derived from the existing analysis:
  - severity: one of [none, medium, high, critical]
  - sub_classes: specific attack sub-types (see taxonomy)
  - affected_lines: 1-indexed line numbers in the source file
  - remediation: short actionable guidance`} />
              <p>
                Cost: about $68 for the full corpus. Time: overnight via Batch. Parse rate: 100%. Because
                the augmentation does not alter the labels that v4.1 was already trained on, the risk of
                regressing the existing detection behavior was bounded by prompt-following capability —
                not by label drift.
              </p>
              <p className="mt-4">
                We initially planned to train on all four new fields. During the user review of sample
                outputs, the remediation field kept saying variations of "block this skill" or "do not
                deploy this skill". The verdict was: this is noise — users who see a malicious verdict
                plus labels plus reasoning do not need the model to tell them to block it. We dropped
                remediation and kept severity, sub_classes, and affected_lines. All three carry real
                signal that users cannot easily reconstruct from the verdict alone.
              </p>
            </section>

            {/* Section 5 — The near-miss */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                A near-miss: the prompt mismatch that almost hid the win
              </h2>
              <p>
                We trained v4.2 with the new 7-field output schema. The first eval run came back at
                85.6% verdict accuracy with macro F1 0.567. That looks like a regression — a fourth one.
                We almost shelved the run.
              </p>
              <p className="mt-4">
                Then one of us noticed the eval harness was still using the old 4-field system prompt.
                The model had been trained to emit verdict, labels, severity, sub_classes, affected_lines,
                remediation, reasoning. The eval was asking for verdict, labels, confidence, reasoning.
                The model was confused — trying to satisfy two specifications at once — and the parse
                step threw out any output that didn't match the old shape exactly.
              </p>
              <p className="mt-4">
                We updated <InlineCode>eval_modal.py</InlineCode> to use the 7-field prompt. The numbers
                flipped dramatically on the next run.
              </p>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.70 0.15 160 / 0.06)", border: "1px solid oklch(0.70 0.15 160 / 0.25)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>Prompts are data, too.</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Changing the training prompt without updating the eval prompt means measuring something
                  different than what you trained. When you change the schema, you have to change every
                  touchpoint — training, eval, inference code path, parsing, tests — in lockstep.
                </p>
              </div>
            </section>

            {/* Section 6 — Real numbers */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                v4.2 vs v4.1 on the held-out eval
              </h2>
              <p>
                All numbers below are measured on the 208-file held-out eval after the parser fix. v4.1
                is re-scored with the corrected parser, so this is an apples-to-apples comparison. Every
                file's frontmatter labels are stripped before tokenization.
              </p>
              <div className="overflow-x-auto rounded-xl my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "oklch(0.16 0.025 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Metric</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'Space Grotesk', sans-serif" }}>v4.1 (true)</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>v4.2</th>
                    </tr>
                  </thead>
                  <tbody>
                    <MetricRow label="Verdict accuracy" oldV="94.2%" newV="98.6%" better={true} />
                    <MetricRow label="Threat detection rate" oldV="92.7%" newV="99.4%" better={true} />
                    <MetricRow label="False negatives" oldV="—" newV="0 / 208" better={true} />
                    <MetricRow label="False positives" oldV="—" newV="2 / 208" better={true} />
                    <MetricRow label="Macro F1 (multi-label)" oldV="0.584" newV="0.620" better={true} />
                    <MetricRow label="Parse failures" oldV="—" newV="1 / 208" better={true} />
                    <MetricRow label="Inference (GPU)" oldV="0.14 s" newV="0.6 s" better={false} />
                    <MetricRow label="Inference (CPU)" oldV="2.0 s" newV="~2 s" better={true} />
                    <MetricRow label="Model size (GGUF Q4_K_M)" oldV="940 MB" newV="940 MB" better={true} />
                  </tbody>
                </table>
              </div>
              <p>
                Threat detection at 99.4% with zero false negatives on the held-out set is the number we
                care about most. The two false positives are both hard-benign enterprise eval files that
                the dual-LLM judge also split on. Macro F1 climbed modestly from 0.584 to 0.620; it
                remains the weakest metric and that is fine — it measures label <em>precision</em>
                (getting the right sub-category), not pass/fail correctness. A file correctly flagged as
                malicious but classed as <InlineCode>data_exfiltration</InlineCode> when gold says
                <InlineCode>supply_chain</InlineCode> counts as a partial miss here, while the user gets
                the right verdict.
              </p>
            </section>

            {/* Section 7 — New rich output */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What the new output looks like
              </h2>
              <CodeBlock lang="json" code={`{
  "verdict": "malicious",
  "labels": ["data_exfiltration", "social_engineering"],
  "severity": "high",
  "sub_classes": ["exfil_credentials", "se_phishing"],
  "affected_lines": [10, 12, 14, 15],
  "reasoning": "Lines 10-15 build a form prompt that asks the agent to
collect API keys under the pretext of 'verifying account access', then
POST them to an attacker-controlled endpoint. The social-engineering
framing is intended to bypass user suspicion of the request."
}`} />
              <p>
                A reviewer looking at this output gets three things they did not get from v4.1:
              </p>
              <ul className="mt-3 space-y-2 list-disc pl-6" style={{ color: "oklch(0.66 0.015 265)" }}>
                <li><strong>Which lines to look at.</strong> Four line numbers in a 60-line skill file means you're not reading from the top.</li>
                <li><strong>How severe.</strong> High vs. critical vs. medium routes the finding into the right triage bucket.</li>
                <li><strong>What specific sub-type.</strong> "exfil_credentials" is actionable; "data_exfiltration" is a category.</li>
              </ul>
              <p className="mt-4">
                The severity distribution on the held-out eval:
              </p>
              <div className="rounded-xl p-5 my-5" style={{ background: "oklch(0.58 0.22 290 / 0.06)", border: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { label: "critical", value: "59", note: "RCE, creds, install hooks" },
                    { label: "high", value: "104", note: "exfil, PT, impactful PI" },
                    { label: "medium", value: "2", note: "lower-impact findings" },
                    { label: "none", value: "42", note: "benign files" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-xl font-bold mb-0.5" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
                      <div className="text-xs mb-1" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
                      <div className="text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>{item.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 8 — Sub-class taxonomy */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                The sub-class taxonomy
              </h2>
              <p>
                v4.2 adds 15+ finer-grained attack sub-types under the existing seven top-level labels.
                The taxonomy is deliberately concrete — each sub-class names a specific technique a
                reviewer has to recognize, not an abstract category.
              </p>
              <div className="space-y-3 mt-5">
                {[
                  ["evasion", "evasion_base64, evasion_unicode_homoglyph, evasion_comment_smuggling, evasion_stego"],
                  ["data_exfiltration", "exfil_credentials, exfil_telemetry, exfil_dns, exfil_url_encoded"],
                  ["supply_chain", "sc_install_hook, sc_registry_redirect, sc_typosquatting, sc_curl_bash"],
                  ["prompt_injection", "pi_goal_hijack, pi_context_extract, pi_jailbreak, pi_hidden_instructions"],
                  ["code_injection", "ci_shell_exec, ci_eval_exec, ci_yaml_deserialization, ci_hook_injection"],
                  ["social_engineering", "se_impersonation, se_urgency, se_authority_claim, se_phishing"],
                  ["path_traversal", "pt_read, pt_write, pt_symlink"],
                ].map(([parent, children]) => (
                  <div key={parent} className="p-4 rounded-lg" style={{ background: "oklch(0.13 0.020 265)", border: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
                    <div className="text-sm font-semibold mb-1.5" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{parent}</div>
                    <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>{children}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 9 — Meta lessons */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Three meta-lessons
              </h2>
              <div className="space-y-5">
                <div>
                  <p className="font-semibold mb-2" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Measurement before optimization.
                  </p>
                  <p>
                    A one-line parse bug was suppressing our reported metrics across three training
                    iterations. We were tuning against a moving floor we couldn't get below. Before you
                    burn a week on hyperparameters, spend a day sanity-checking every stage of the
                    metric pipeline against known inputs.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Augment, don't replace.
                  </p>
                  <p>
                    When you have a model that works, add capability (new schema fields) without touching
                    the things that work (existing labels and reasoning). Schema augmentation has no
                    regression vector on the original task — the worst case is that the new fields are
                    wrong, not that the old fields get worse.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Prompts are data too.
                  </p>
                  <p>
                    A schema change is a coordinated update across training, eval, inference, parsing,
                    and tests. Missing any one of them measures something different than you trained. We
                    almost shelved v4.2 because one file hadn't gotten the update.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 — Open vs closed */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What stays open, what stays closed
              </h2>
              <div className="rounded-xl p-5 my-5" style={{ background: "oklch(0.70 0.15 160 / 0.06)", border: "1px solid oklch(0.70 0.15 160 / 0.25)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>Open</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Model weights (<InlineCode>kurtpayne/skillscan-detector-v4</InlineCode> on HuggingFace),
                  training scripts, eval harness, architecture, and every static rule. If you want to
                  reproduce v4.2's numbers or fork the detector, everything you need is public.
                </p>
              </div>
              <div className="rounded-xl p-5 my-5" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>Closed</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  The training corpus. Same reasoning as in the generative-pivot post: an open corpus is
                  training data for attackers searching for near-miss evasions. The weights and the
                  pipeline stay public; the corpus is the defensive moat.
                </p>
              </div>
            </section>

            {/* Section 11 — What's next */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What's next
              </h2>
              <div className="space-y-3 mt-5">
                {[
                  ["Smaller, faster deployment", "INT3 quantization and speculative decoding to cut the GGUF artifact size and drop CPU inference below a second. The 940 MB download is still the biggest friction point for casual adopters."],
                  ["Self-improvement flywheel", "Adversarial variant generation via skillscan-fuzzer, feeding into skillscan-trace for behavioral verification, feeding back into the training corpus. The goal is that the detector's own misses become its next training signal automatically."],
                  ["Continuous corpus growth", "The pattern-update agent is already landing rule and corpus deltas on a weekly cadence. The aim is a shorter cycle from 'a researcher spots a new archetype' to 'the detector catches it'."],
                ].map(([title, body]) => (
                  <div key={title} className="p-4 rounded-lg" style={{ background: "oklch(0.13 0.020 265)", border: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
                    <div className="text-sm font-semibold mb-1.5" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</div>
                    <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)" }}>{body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5">
                v4.2 is available now. The GGUF artifact is drop-in compatible with the v4.1 install —
                run the scanner with ML enabled and you get the richer output automatically.
              </p>
              <CodeBlock code={`# Install with the llama.cpp ML backend
pip install 'skillscan-security[ml-llama]'

# First run downloads the v4.2 GGUF model (~940 MB)
skillscan scan path/to/skills/ --ml-detect`} />
            </section>

          </article>

          {/* Footer CTA */}
          <div className="mt-14 pt-10" style={{ borderTop: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.82 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Found a false positive or missed detection?
                </p>
                <p className="text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>
                  Open an issue on GitHub or use <InlineCode>skillscan feedback fp</InlineCode> /{" "}
                  <InlineCode>skillscan feedback fn</InlineCode> to submit a sample.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
                  style={{ background: copied ? "oklch(0.70 0.15 160 / 0.12)" : "oklch(0.58 0.22 290 / 0.08)", color: copied ? "oklch(0.70 0.15 160)" : "oklch(0.65 0.015 265)", border: `1px solid ${copied ? "oklch(0.70 0.15 160 / 0.30)" : "oklch(0.58 0.22 290 / 0.15)"}` }}
                  aria-label="Share article link">
                  {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  {copied ? "Copied!" : "Share"}
                </button>
                <a href="https://github.com/kurtpayne/skillscan-security" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
                  style={{ background: "oklch(0.58 0.22 290 / 0.12)", color: "oklch(0.78 0.18 290)", border: "1px solid oklch(0.58 0.22 290 / 0.25)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.58 0.22 290 / 0.20)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.58 0.22 290 / 0.12)")}>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "oklch(0.58 0.22 290 / 0.12)", color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>
      {children}
    </code>
  );
}
