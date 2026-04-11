/* ============================================================
   BLOG POST — v12 Training Methodology
   Design: Deep Navy system, violet accent — matches site design
   Audience: Security engineers, ML practitioners, enterprise evaluators
   ============================================================ */
import { useState } from "react";
import { Link } from "wouter";
import { Copy, Check, ArrowLeft, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl overflow-hidden my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "oklch(0.14 0.022 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
        <span className="text-xs" style={{ color: "oklch(0.45 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>bash</span>
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

function MetricRow({ label, v11bad, v11clean, v12 }: { label: string; v11bad: string; v11clean: string; v12: string }) {
  return (
    <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
      <td className="py-2.5 pr-4 text-sm" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>{label}</td>
      <td className="py-2.5 px-4 text-sm text-center" style={{ color: "oklch(0.65 0.18 25)", fontFamily: "'JetBrains Mono', monospace" }}>{v11bad}</td>
      <td className="py-2.5 px-4 text-sm text-center" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'JetBrains Mono', monospace" }}>{v11clean}</td>
      <td className="py-2.5 pl-4 text-sm text-center font-semibold" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'JetBrains Mono', monospace" }}>{v12}</td>
    </tr>
  );
}

export default function BlogV12Training() {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

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
              <span className="text-xs" style={{ color: "oklch(0.45 0.012 265)" }}>Mar 29, 2026 · 8 min read</span>
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
              How We Built a Cleaner ML Model: The v12 Training Methodology
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.015 265)" }}>
              When we discovered that 44% of our evaluation set had leaked into training, we didn't
              paper over the number. We fixed the process, rebuilt the corpus, and retrained from scratch.
              Here's exactly what we did and why it matters.
            </p>
          </header>

          {/* Article body */}
          <article className="space-y-8" style={{ color: "oklch(0.68 0.015 265)", lineHeight: "1.75" }}>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                The contamination problem
              </h2>
              <p>
                SkillScan's ML layer — a DeBERTa-v3-base model fine-tuned with LoRA adapters — is trained to
                classify AI agent skill files as benign or malicious. Like any classifier, its credibility
                depends entirely on the integrity of its evaluation set. If the model has seen the test
                examples during training, the reported metrics are meaningless.
              </p>
              <p className="mt-4">
                In March 2026, during a routine audit, we discovered that our v11 model had been trained on
                a corpus that included 204 files also present in the held-out evaluation set. The contamination
                happened through a well-intentioned but unguarded process step: after the v10 decontamination
                pass, we identified 204 files where the model was making errors (136 false positives, 68 false
                negatives) and added them to the training corpus to improve generalization. The files were
                never removed from the evaluation set.
              </p>
              <p className="mt-4">
                The result: v11's reported Macro F1 of 0.926 was inflated by ~37 points. The true
                generalization score, measured on the 259 evaluation examples the model had never seen,
                was 0.555 — with injection recall collapsing to 19.6%.
              </p>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>What 19.6% recall means in practice</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Of every 100 malicious skill files the v11 model had never seen before, it would catch
                  approximately 20 and miss 80. For a security tool, this is not a usable number. The static
                  rule engine (which catches ~80% of threats independently) was unaffected — but the ML layer
                  was providing false confidence rather than genuine additional coverage.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                The fix: process, not just data
              </h2>
              <p>
                The root cause was a process gap, not a code bug. We had a cleanup procedure but no
                enforcement mechanism. The fix required changes at three levels:
              </p>
              <div className="space-y-4 mt-5">
                {[
                  {
                    num: "01",
                    title: "Eval set is immutable ground truth",
                    body: "The 463 files in held_out_eval/ are never modified or added to training. Any file that enters the eval set is permanently excluded from training, regardless of model performance on it. If the model is getting a specific pattern wrong, the fix is to add different examples of that pattern to training — not the eval examples themselves."
                  },
                  {
                    num: "02",
                    title: "CI gate on every push",
                    body: "A GitHub Actions workflow now runs on every push to main. It computes SHA-256 hashes of all eval files and all training files, finds the intersection, and fails the build if any overlap exists. The gate runs in under 30 seconds and cannot be bypassed without a deliberate override."
                  },
                  {
                    num: "03",
                    title: "Augmentation, not reuse",
                    body: "When the model misses a pattern, we generate paraphrased variants of that pattern for training — different surface text, same attack semantics. This is the correct way to improve coverage without contaminating the eval set."
                  }
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
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                The v12 corpus
              </h2>
              <p>
                After removing the 204 contaminated files from training, we audited the false negative
                breakdown to understand which injection archetypes the model was missing most severely.
                The results were stark:
              </p>
              <div className="overflow-x-auto rounded-xl my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "oklch(0.16 0.025 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                      {["Archetype", "False negatives", "True positives", "v11 recall"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["organic (real-world)", "22", "0", "0%"],
                      ["enterprise auth/redirect", "10", "0", "0%"],
                      ["organic PI", "8", "0", "0%"],
                      ["MCP poisoning", "8", "0", "0%"],
                      ["supply chain", "6", "0", "0%"],
                      ["jailbreaks", "18", "18", "50%"],
                      ["social engineering", "8", "3", "27%"],
                      ["evasion variants", "7", "1", "13%"],
                    ].map(([arch, fn, tp, recall], i) => (
                      <tr key={arch} style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)", background: i % 2 === 0 ? "oklch(0.12 0.018 265)" : "transparent" }}>
                        <td className="px-4 py-2.5 text-xs" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>{arch}</td>
                        <td className="px-4 py-2.5 text-xs text-center" style={{ color: "oklch(0.65 0.18 25)", fontFamily: "'JetBrains Mono', monospace" }}>{fn}</td>
                        <td className="px-4 py-2.5 text-xs text-center" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>{tp}</td>
                        <td className="px-4 py-2.5 text-xs text-center font-semibold" style={{ color: recall === "0%" ? "oklch(0.65 0.18 25)" : "oklch(0.72 0.15 55)", fontFamily: "'JetBrains Mono', monospace" }}>{recall}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                Five archetypes had zero recall — the model had no generalization capability for them
                at all. For each blind spot, we generated 10 new training examples using paraphrased
                variants: different tool names, different exfiltration endpoints, different obfuscation
                techniques, but the same underlying attack pattern. This produced 67 new injection
                examples with zero eval overlap.
              </p>
              <p className="mt-4">
                The final v12 training corpus: <strong style={{ color: "oklch(0.85 0.005 265)" }}>19,407 files</strong> (19,340 original + 67 augmented),
                <strong style={{ color: "oklch(0.85 0.005 265)" }}> 463 eval files</strong>, zero overlap, enforced by CI.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Hyperparameter changes for v12
              </h2>
              <p>
                The recall collapse wasn't only a data problem. The model was also under-penalized for
                missing injections. With a roughly 95:5 benign-to-injection ratio in the training corpus,
                the model could achieve high accuracy by predicting "benign" for everything. We made
                four changes to address this:
              </p>
              <div className="space-y-3 mt-5">
                {[
                  ["Injection class weight cap", "Raised from 8× to 12×", "Penalizes false negatives more heavily. The cap prevents the model from becoming overly aggressive on benign files."],
                  ["Label smoothing", "0.05 added", "Reduces overconfidence on training examples, improving generalization to unseen patterns."],
                  ["Warmup ratio", "0.06 → 0.10", "Longer warmup prevents the model from memorizing early high-loss examples before the learning rate stabilizes."],
                  ["Training epochs", "4 → 6 with early stopping", "More passes over the data with patience=2 early stopping. Stops when eval F1 stops improving rather than running a fixed number of epochs."],
                ].map(([param, change, reason]) => (
                  <div key={param} className="p-4 rounded-lg" style={{ background: "oklch(0.13 0.020 265)", border: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
                    <div className="flex items-start justify-between gap-4 mb-1.5">
                      <span className="text-sm font-semibold" style={{ color: "oklch(0.82 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{param}</span>
                      <span className="text-xs shrink-0 px-2 py-0.5 rounded" style={{ background: "oklch(0.58 0.22 290 / 0.10)", color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{change}</span>
                    </div>
                    <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)" }}>{reason}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 — Results */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Results
              </h2>
              <p>
                v12 training completed on Modal A10G (24 GB VRAM). The following table compares the
                three numbers: the contaminated v11 score (what we reported), the true v11 score
                (clean eval only), and v12 (clean training + clean eval).
              </p>
              <div className="overflow-x-auto rounded-xl my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "oklch(0.16 0.025 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Metric</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>v11 reported</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'Space Grotesk', sans-serif" }}>v11 true</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>v12</th>
                    </tr>
                  </thead>
                  <tbody>
                    <MetricRow label="Macro F1" v11bad="0.926" v11clean="0.555" v12="0.7287" />
                    <MetricRow label="Injection recall" v11bad="0.944" v11clean="0.196" v12="0.966" />
                    <MetricRow label="Injection precision" v11bad="0.861" v11clean="0.617" v12="0.844" />
                    <MetricRow label="FPR (benign)" v11bad="2.66%" v11clean="5.71%" v12="2.49%" />
                    <MetricRow label="Eval set size" v11bad="463 (44% leaked)" v11clean="259 (clean)" v12="463 (clean)" />
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl p-5" style={{ background: "oklch(0.70 0.15 160 / 0.06)", border: "1px solid oklch(0.70 0.15 160 / 0.25)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>v12 results — published Mar 29, 2026</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Injection recall recovered from 19.6% to 96.6% on the clean 463-example eval set.
                  Macro F1 reached 0.7287 — below the contaminated v11 number (0.926) but a genuine,
                  verifiable result. FPR improved from 5.71% to 2.49%. Full metrics are on the{"|"}
                  <Link href="/model"><a className="underline" style={{ color: "oklch(0.75 0.18 160)" }}>Model page</a></Link>.
                </p>
              </div>
            </section>

            {/* Section 6 — Takeaways */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What this means for users
              </h2>
              <p>
                The static rule engine — which catches known injection patterns, exfiltration attempts,
                privilege escalation, and supply chain attacks — was unaffected by the contamination.
                It has no training data and no eval set. If you've been using SkillScan for static
                scanning, your results are valid.
              </p>
              <p className="mt-4">
                The <InlineCode>--ml-detect</InlineCode> flag, which enables the ML classifier as a
                supplementary layer, is now backed by v12b — a model trained and evaluated on a clean,
                non-overlapping corpus. Injection recall is 96.6% on the 463-example held-out eval set.
                The Model page has the full metrics.
              </p>
              <p className="mt-4">
                Going forward, every model version will include: the training corpus hash, the eval set
                hash, the CI gate status, and the clean eval metrics. The contamination incident is
                documented in the CHANGELOG and EVAL_RESULTS.md in the corpus repository. We believe
                transparency about failures is more valuable than silence about them.
              </p>
            </section>

          </article>

          {/* Footer CTA */}
          <div className="mt-14 pt-10" style={{ borderTop: "1px solid oklch(0.58 0.22 290 / 0.12)" }}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.82 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Questions or feedback?
                </p>
                <p className="text-sm" style={{ color: "oklch(0.55 0.015 265)" }}>
                  Open an issue on GitHub or use <InlineCode>skillscan feedback fp</InlineCode> to report a false positive.
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
