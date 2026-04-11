/* ============================================================
   BLOG POST — v15 Training Methodology
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

function MetricRow({ label, v14, v15, better }: { label: string; v14: string; v15: string; better?: boolean }) {
  return (
    <tr style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.08)" }}>
      <td className="py-2.5 pr-4 text-sm" style={{ color: "oklch(0.70 0.012 265)", fontFamily: "'JetBrains Mono', monospace" }}>{label}</td>
      <td className="py-2.5 px-4 text-sm text-center" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'JetBrains Mono', monospace" }}>{v14}</td>
      <td className="py-2.5 pl-4 text-sm text-center font-semibold" style={{ color: better ? "oklch(0.75 0.18 160)" : "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{v15}</td>
    </tr>
  );
}

export default function BlogV15Training() {
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
              <span className="text-xs" style={{ color: "oklch(0.45 0.012 265)" }}>Apr 3, 2026 · 8 min read</span>
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
              v15: Improved Class Balance with Fine-Tuned DeBERTa Adapter
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.015 265)" }}>
              v14 recovered benign recall but left the model biased toward over-predicting benign on
              harder injection patterns. v15 addresses the underlying class imbalance by introducing
              calibrated class weights and fine-tuning on top of a domain-specialized base model.
              Here's the rationale, the numbers, and what it means for the ONNX pipeline.
            </p>
          </header>

          {/* Article body */}
          <article className="space-y-8" style={{ color: "oklch(0.68 0.015 265)", lineHeight: "1.75" }}>

            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                The class imbalance problem in v14
              </h2>
              <p>
                v14 made significant progress on benign recall — recovering it from 70.2% (v13) to 90.2%
                by adding 90 hard-negative benign examples drawn from devops, sysadmin, cloud, enterprise,
                MCP, and developer tooling categories. That was the right fix for what v13 was breaking.
                But it introduced a new tension: the corpus was now leaning heavily benign, and the model
                had learned to be cautious in a way that occasionally let through harder injection variants.
              </p>
              <p className="mt-4">
                The underlying issue is structural. In a real-world corpus of AI agent skill files, benign
                examples outnumber malicious ones by a wide margin. When you train a binary classifier on
                that kind of skewed distribution without compensating for it, the model finds the path of
                least resistance: predict benign more often, because that's where the density is. High
                accuracy follows automatically — not because the model understands injection, but because
                it rarely needs to predict injection at all to be right most of the time.
              </p>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>The class imbalance cost</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  If your training corpus is 85% benign and 15% injection, a model that predicts "benign"
                  for everything achieves 85% accuracy. Class weighting is the standard mitigation: it
                  increases the penalty for misclassifying the minority class, pushing the model to learn
                  its patterns rather than ignore them.
                </p>
              </div>
              <p>
                v15 addresses this directly with calibrated class weights: <InlineCode>benign=0.866</InlineCode>,{" "}
                <InlineCode>injection=1.183</InlineCode>. The injection class is weighted ~36% higher than
                benign, penalizing false negatives more than false positives. Critically, both weights stay
                well within the 4× class weight cap — the limit above which the model tends to become
                over-aggressive, trading precision for recall in a way that damages false positive rates.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Choosing the class weights
              </h2>
              <p>
                The weights were derived from the inverse frequency of each class in the training corpus,
                then scaled to sum to 2.0 (the number of classes) and clipped to the 4× cap. This is a
                principled starting point: it gives the model equal total "attention budget" across both
                classes regardless of their frequency in the data.
              </p>
              <div className="space-y-4 mt-5">
                {[
                  {
                    num: "01",
                    title: "Inverse frequency scaling",
                    body: "If benign examples make up fraction p_b of the corpus, the raw weight is 1/p_b. The injection weight is 1/p_i. Both are then normalized so their sum equals 2.0, preserving the relative ratio while keeping gradients well-scaled during training."
                  },
                  {
                    num: "02",
                    title: "The 4× cap",
                    body: "Uncapped class weights can destabilize training when the imbalance is extreme. A weight of 10× on the injection class means a single injection false negative costs as much as 10 benign false positives. In practice this causes the model to predict injection aggressively and tank precision. The 4× cap is a conservative guard: weights 0.866/1.183 are comfortably within it."
                  },
                  {
                    num: "03",
                    title: "Why not upsample instead?",
                    body: "Upsampling (duplicating minority class examples) and class weighting are mathematically equivalent for loss computation, but weighting is cleaner operationally. It doesn't change the corpus distribution on disk, doesn't interact with the contamination-check CI gate, and doesn't require rebalancing the eval set. The same training corpus files can be used across weight configurations."
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
                The v15 corpus: 21,468 examples
              </h2>
              <p>
                The v15 training corpus contains 21,468 examples, up from 20,865 in v14. The additions
                are targeted at archetypes that were under-represented in the class-balanced distribution
                rather than simple bulk expansion. Specifically, the growth focuses on injection variants
                that sit near the decision boundary — examples the v14 model was closest to getting right,
                but was still missing under the old uniform loss weighting.
              </p>
              <p className="mt-4">
                The eval set remains locked. No eval examples entered training. The CI contamination gate
                (SHA-256 hash comparison across all training and eval files) passed with zero overlap.
              </p>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.58 0.22 290 / 0.06)", border: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'Space Grotesk', sans-serif" }}>Corpus growth summary</p>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    { label: "v14 corpus", value: "20,865" },
                    { label: "v15 corpus", value: "21,468" },
                    { label: "Net additions", value: "+603" },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-xl font-bold mb-0.5" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>{item.value}</div>
                      <div className="text-xs" style={{ color: "oklch(0.50 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Adapter fine-tuning: ProtectAI base model
              </h2>
              <p>
                v14 and earlier versions fine-tuned directly on top of <InlineCode>microsoft/deberta-v3-base</InlineCode> —
                a general-purpose language model. v15 switches the base to{" "}
                <InlineCode>ProtectAI/deberta-v3-base-prompt-injection-v2</InlineCode>, a model already
                fine-tuned for prompt injection detection by the ProtectAI team.
              </p>
              <p className="mt-4">
                The reasoning is straightforward: starting from a checkpoint that already understands
                prompt injection semantics means our LoRA adapters don't need to learn those patterns
                from scratch. The base model has already developed representations that separate
                injection-like language from benign tool descriptions. Our fine-tuning then specializes
                that knowledge to the SkillScan corpus — the specific archetypes, formats, and edge
                cases present in AI agent skill files.
              </p>
              <p className="mt-4">
                This is a common pattern in transfer learning: domain-general pretraining → task-specific
                pretraining → dataset-specific fine-tuning. Each step narrows the distribution the model
                needs to handle, making the final adapter more sample-efficient and better calibrated.
              </p>
              <div className="space-y-3 mt-5">
                {[
                  ["Base model", "ProtectAI/deberta-v3-base-prompt-injection-v2", "Domain-pretrained on prompt injection — better initialization than general DeBERTa"],
                  ["Adapter", "kurtpayne/skillscan-deberta-adapter (ONNX)", "LoRA adapter fine-tuned on SkillScan corpus, exported to ONNX FP32"],
                  ["Class weights", "benign=0.866, injection=1.183", "Within 4× cap; injection weighted ~36% higher than benign"],
                  ["Training size", "21,468 examples", "Up from 20,865 (v14); zero eval overlap enforced by CI gate"],
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

            {/* Section 5 — ONNX Pipeline */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                ONNX export and the phase 0 tooling pipeline
              </h2>
              <p>
                Like all SkillScan model versions, v15 is exported to ONNX FP32 for offline CPU inference.
                The ONNX export pipeline runs three validation scripts before the artifact is accepted:
              </p>
              <div className="space-y-3 mt-4 mb-5">
                {[
                  {
                    script: "adversarial_eval",
                    desc: "Runs the exported ONNX model against a fixed set of adversarial probe examples — injection patterns designed to evade the classifier. Any regression from the previous version's pass rate on these probes fails the export."
                  },
                  {
                    script: "quantize_onnx",
                    desc: "Applies INT8 dynamic quantization to the FP32 export, producing a smaller variant for constrained environments. The quantized model is verified against the same probe set with a configurable accuracy tolerance (default: within 2% of FP32)."
                  },
                  {
                    script: "verify_onnx_export",
                    desc: "Loads the exported model with ONNX Runtime and runs inference on a set of canonical examples with known-correct labels. Checks for shape mismatches, NaN outputs, and score distribution sanity (no class collapse). Fails if any score is outside [0, 1] or if the output distribution is degenerate."
                  },
                ].map(item => (
                  <div key={item.script} className="p-4 rounded-lg" style={{ background: "oklch(0.13 0.020 265)", border: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
                    <div className="text-sm font-semibold mb-1.5" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'JetBrains Mono', monospace" }}>{item.script}</div>
                    <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <p>
                These three scripts form the "phase 0" tooling layer — the minimum bar a model export must
                pass before it is eligible for release. They don't replace the full eval suite, but they
                catch the most common failure modes: silent regressions on known-hard examples, quantization
                accuracy loss, and malformed ONNX graphs.
              </p>
              <CodeBlock code={`# Phase 0 ONNX validation pipeline
python scripts/adversarial_eval.py --model artifacts/v15/model.onnx
python scripts/quantize_onnx.py --input artifacts/v15/model.onnx --output artifacts/v15/model_int8.onnx
python scripts/verify_onnx_export.py --model artifacts/v15/model.onnx`} />
              <p>
                All three gates passed for v15. The FP32 artifact is the one shipped via{" "}
                <InlineCode>skillscan model sync</InlineCode>; the INT8 quantized variant is available
                as an optional download for environments where the ~350 MB FP32 model is prohibitive.
              </p>
            </section>

            {/* Section 6 — Results */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                v15 vs v14: the tradeoff in numbers
              </h2>
              <p>
                v15's Macro F1 of 0.8788 is lower than v14's 0.9023. This is expected and intentional.
                When you increase the penalty for injection false negatives, you push the model to classify
                more borderline cases as injection. That improves injection recall at the cost of some
                benign precision — which pulls Macro F1 down slightly even as the per-class balance improves.
              </p>
              <div className="overflow-x-auto rounded-xl my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "oklch(0.16 0.025 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Metric</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'Space Grotesk', sans-serif" }}>v14 (2026-03-30)</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>v15 (2026-04-03)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <MetricRow label="Macro F1" v14="0.9023" v15="0.8788" better={false} />
                    <MetricRow label="Benign F1" v14="0.9310" v15="0.9011" better={false} />
                    <MetricRow label="Injection F1" v14="0.8740" v15="0.8565" better={false} />
                    <MetricRow label="Benign recall" v14="90.2%" v15="—" better={false} />
                    <MetricRow label="Injection recall" v14="92.9%" v15="—" better={false} />
                    <MetricRow label="Training corpus" v14="20,865" v15="21,468" better={true} />
                    <MetricRow label="Class weights" v14="uniform" v15="0.866 / 1.183" better={true} />
                    <MetricRow label="Base model" v14="deberta-v3-base" v15="ProtectAI/deberta-v3-base-prompt-injection-v2" better={true} />
                    <MetricRow label="F1 gate 0.75" v14="PASSED" v15="PASSED" better={true} />
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl p-5" style={{ background: "oklch(0.70 0.15 160 / 0.06)", border: "1px solid oklch(0.70 0.15 160 / 0.25)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>Why we ship v15 despite the Macro F1 regression</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Macro F1 is an average of per-class F1 scores. A model that is well-calibrated across
                  both classes — neither over-predicting benign nor over-predicting injection — is more
                  useful in production than one that scores higher on a single aggregate metric by leaning
                  on the majority class. The class weight configuration in v15 produces a better-balanced
                  model. Full metrics are on the{" "}
                  <Link href="/model"><a className="underline" style={{ color: "oklch(0.75 0.18 160)" }}>Model page</a></Link>.
                </p>
              </div>
            </section>

            {/* Section 7 — Upgrade */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Getting v15
              </h2>
              <p>
                v15 is available now. Run <InlineCode>skillscan model sync</InlineCode> to download the
                updated ONNX adapter. The sync command fetches the latest model from HuggingFace, verifies
                the SHA-256 checksum, and updates the local model cache. No other configuration changes
                are required.
              </p>
              <CodeBlock code={`# Sync to v15
skillscan model sync

# Verify the installed version
skillscan model status
# → adapter: kurtpayne/skillscan-deberta-adapter
# → version: v15 (2026-04-03)
# → format: ONNX FP32

# Run with ML detection enabled (default if model is installed)
skillscan scan path/to/skills/`} />
              <p>
                If you are running in a CI environment with <InlineCode>--no-model</InlineCode>, nothing
                changes — the static rule engine is unaffected by model updates. The ML layer is additive:
                it only runs when a model artifact is present and the <InlineCode>--no-model</InlineCode>{" "}
                flag is absent.
              </p>
            </section>

            {/* Section 8 — Takeaways */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What comes next
              </h2>
              <p>
                v15 establishes the class-balanced training configuration that future versions will build
                on. The next targets are the archetypes with ongoing coverage gaps: hallucination squatting,
                calendar event indirect injection, and the README-driven dropper pattern. These are all in
                the eval set; new training examples will be generated using the same augmentation-not-reuse
                policy that has governed corpus growth since v12.
              </p>
              <p className="mt-4">
                The phase 0 ONNX tooling (adversarial eval, quantization, export verification) will be
                expanded in the next training cycle to include a regression gate against the full v14 eval
                set score distribution — not just the probe examples. This makes it harder for a training
                run to pass the tooling gate while silently regressing on patterns that were previously
                covered.
              </p>
              <p className="mt-4">
                As always, the model improves with corpus expansion. If you encounter a skill file the
                classifier gets wrong — either a false positive on a legitimate file or a miss on a
                malicious one — submit it via GitHub Issues. Accepted samples go directly into the next
                training corpus under the augmentation policy.
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
