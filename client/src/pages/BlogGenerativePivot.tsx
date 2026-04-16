/* ============================================================
   BLOG POST — Generative Detection Pivot
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

export default function BlogGenerativePivot() {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://skillscan.sh/blog/generative-pivot";

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
              <span className="text-xs" style={{ color: "oklch(0.45 0.012 265)" }}>Apr 15, 2026 · 11 min read</span>
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
              From Pattern Matching to Reasoning: SkillScan's Pivot to Generative Detection
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.62 0.015 265)" }}>
              For months our ML detector was a DeBERTa-v3-base LoRA adapter that, on a clean eval with labels
              stripped, caught almost nothing. We threw it out. This post is the honest story of what went
              wrong, why encoder-only classifiers are the wrong tool for this problem, and how a 1.5B-parameter
              generative model that <em>reasons</em> about code ended up catching 87.4% of malicious skills at
              88.9% verdict accuracy.
            </p>
          </header>

          {/* Article body */}
          <article className="space-y-8" style={{ color: "oklch(0.68 0.015 265)", lineHeight: "1.75" }}>

            {/* Section 1 — The encoder-only trap */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                The encoder-only trap
              </h2>
              <p>
                DeBERTa and ModernBERT are excellent models for what they are: sequence classifiers that compress
                an entire document into a fixed-size embedding, then decide a class. On NLI benchmarks, on
                sentiment tasks, on topic categorization — they work beautifully. They fail on adversarial
                security classification in ways that look like success right up until you look closely.
              </p>
              <p className="mt-4">
                An encoder can learn that the token sequence <InlineCode>../../etc/passwd</InlineCode> correlates
                with the malicious class. What it cannot do is reason about <em>why</em>: that the
                <InlineCode>template_name</InlineCode> parameter flowing into a <InlineCode>FileSystemLoader</InlineCode>
                without normalization lets a caller escape the template root. There is no sequence in that skill
                file that by itself is suspicious. The attack lives in the relationship between parts.
              </p>
              <p className="mt-4">
                We spent two months trying to patch our way past this with better corpora, larger adapters, and
                the ProtectAI prompt-injection base model. Along the way we found two bugs that make me cringe
                to write publicly, but here they are.
              </p>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>Bug 1: label leakage</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Our training corpus stores ground-truth labels in YAML frontmatter. The preprocessing step
                  was feeding that frontmatter directly to the tokenizer. DeBERTa wasn't detecting attacks — it
                  was reading the answer key. Our reported macro F1 of 0.975 was, in reality,
                  the model memorizing <InlineCode>labels: [path_traversal]</InlineCode> strings.
                </p>
              </div>
              <div className="rounded-xl p-5 my-6" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-1" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>Bug 2: ONNX export corruption</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  When we tried to upgrade to ModernBERT, the ONNX export silently produced numerically broken
                  models. ModernBERT's hybrid local/global attention doesn't trace cleanly through
                  <InlineCode>torch.onnx.export</InlineCode>. The graph compiled, inference ran, outputs looked
                  plausible — and every prediction was garbage. We shipped that for nearly two weeks.
                </p>
              </div>
              <p>
                Strip the frontmatter, fix the eval harness, run it honestly: macro F1 drops to <strong>0.113</strong>.
                The model could partially catch prompt injection (the most common class in training) and essentially
                nothing else. Path traversal: F1 = 0.000. Supply chain: 0.000. Social engineering: 0.000. This is
                worse than a coin flip because it signals confident coverage that doesn't exist.
              </p>
            </section>

            {/* Section 2 — Why Qwen */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Why Qwen2.5-1.5B
              </h2>
              <p>
                If the problem is that encoders can't reason, the fix is to use a model that can. We picked
                Qwen2.5-1.5B-Instruct for four reasons:
              </p>
              <div className="space-y-4 mt-5">
                {[
                  {
                    num: "01",
                    title: "Reasoning about code, not pattern-matching",
                    body: "Decoder-only LLMs are trained to produce coherent text about what a piece of code does. That 'what does this do' capability is exactly the primitive we were missing. We don't need the model to memorize attack signatures — we need it to notice that an unsanitized parameter reaches a file loader, and say so."
                  },
                  {
                    num: "02",
                    title: "Small enough for CPU inference",
                    body: "At 1.5B parameters, the GGUF Q4_K_M quantization is ~935 MB and runs through llama.cpp in about 2 seconds per file on CPU. That is slower than a DeBERTa encoder (50 ms), but fast enough to ship as an opt-in scanner layer. GPU inference drops this to 0.14 s."
                  },
                  {
                    num: "03",
                    title: "Apache 2.0, no vendor lock-in",
                    body: "The model weights, the fine-tuning scripts, and the inference stack (llama.cpp) are all permissively licensed. We can publish the merged adapter on HuggingFace under our own name without licensing friction. Detection should not require an API key to a frontier lab."
                  },
                  {
                    num: "04",
                    title: "Structured JSON output",
                    body: "Qwen2.5-Instruct follows structured output instructions reliably. Every detection returns {verdict, labels, reasoning} as JSON, which means the scanner integrates the model's output as a first-class signal alongside the static rule engine instead of treating it as an opaque score."
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

            {/* Section 3 — Teacher distillation */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Teacher distillation at scale
              </h2>
              <p>
                We don't hand-label training data. Instead, frontier models (Claude Sonnet and GPT-4o) analyze
                each corpus file and emit a structured JSON verdict, and that JSON becomes the student's
                training target. The student learns not just the classification but the <em>reasoning pattern</em>
                that produced it.
              </p>
              <CodeBlock lang="json" code={`{
  "verdict": "MALICIOUS",
  "labels": ["path_traversal", "prompt_injection"],
  "confidence": 0.92,
  "reasoning": "The template_name parameter is passed to FileSystemLoader without path
normalization or allowlist validation. A caller supplying '../../etc/passwd' would escape
the template root. Separately, a hidden HTML comment instructs the agent to read raw
file content for any non-template path, which is a prompt-injection payload targeting
the assistant rather than the parser."
}`} />
              <p>
                For 25,000+ files, running teachers through the chat completions API one at a time is
                prohibitively expensive and slow. We moved the whole pipeline onto the OpenAI Batch API: 50%
                cheaper per token, no rate-limit throttling, and a single overnight job processes the full
                corpus. Claude equivalents run on Anthropic's prompt caching for the static system prompt.
              </p>
              <p className="mt-4">
                A critical design decision: the reasoning field is part of the training target, not a separate
                output. Forcing the model to articulate evidence before committing to a verdict is what
                transfers reasoning capability from teacher to student. A model trained only on
                <InlineCode>{`{verdict, labels}`}</InlineCode> converges to the same pattern-matching behavior
                the encoders showed.
              </p>
            </section>

            {/* Section 4 — Multi-label classification as product */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Multi-label classification as the product
              </h2>
              <p>
                The old ML output looked like this:
              </p>
              <CodeBlock lang="text" code={`MALICIOUS (confidence: 0.87)`} />
              <p>
                That string is useless to a security engineer triaging an alert. It contains no evidence, no
                attack class, no actionable location. The user has to reverse-engineer the scanner to figure
                out whether to trust it.
              </p>
              <p className="mt-4">
                The new output looks like this:
              </p>
              <CodeBlock lang="text" code={`MALICIOUS — path_traversal + prompt_injection

The template_name parameter is passed to FileSystemLoader without sanitization.
Paths containing ../ resolve outside the template directory, and a hidden HTML
comment instructs the agent to read raw file content for non-template paths.`} />
              <p>
                This reframes what "detection" means. The scanner's job is no longer to hand you a probability
                — it is to hand you a <em>case</em>: here is what I found, here is why it matters, here is
                where to look. Users can verify our conclusion, fix the root cause, and tell us when we're
                wrong. Multi-label output also matches the reality that most real attacks combine primitives
                (exfil+injection, drop+exec, etc.) — a single-class classifier was always the wrong shape.
              </p>
            </section>

            {/* Section 5 — Honest results */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                Honest results (v4.1)
              </h2>
              <p>
                All numbers below are measured on a held-out eval set that has never entered training, with
                frontmatter labels stripped before tokenization. Verdict accuracy is the top-level
                malicious/benign call. Threat detection rate is the share of actual threats the model flagged.
                Class F1 is per-label multi-label performance — it measures how precisely the model
                categorizes the specific attack type, so a file correctly flagged as malicious but labeled
                <InlineCode>path_traversal</InlineCode> when the gold label is <InlineCode>code_injection</InlineCode>
                counts as a partial miss on this metric, even though the verdict is correct.
              </p>
              <div className="overflow-x-auto rounded-xl my-5" style={{ border: "1px solid oklch(0.58 0.22 290 / 0.15)" }}>
                <table className="w-full" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "oklch(0.16 0.025 265)", borderBottom: "1px solid oklch(0.58 0.22 290 / 0.20)" }}>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.65 0.015 265)", fontFamily: "'Space Grotesk', sans-serif" }}>Metric</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.72 0.15 55)", fontFamily: "'Space Grotesk', sans-serif" }}>DeBERTa (honest)</th>
                      <th className="text-center px-4 py-2.5 text-xs font-semibold" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>Qwen v4.1</th>
                    </tr>
                  </thead>
                  <tbody>
                    <MetricRow label="Verdict accuracy" oldV="—" newV="88.9%" better={true} />
                    <MetricRow label="Threat detection rate" oldV="—" newV="87.4%" better={true} />
                    <MetricRow label="Multi-label F1 (categorization)" oldV="0.113" newV="0.731" better={true} />
                    <MetricRow label="path_traversal F1" oldV="0.000" newV="0.974" better={true} />
                    <MetricRow label="social_engineering F1" oldV="0.000" newV="0.944" better={true} />
                    <MetricRow label="prompt_injection F1" oldV="0.540" newV="0.432" better={false} />
                    <MetricRow label="Inference (CPU)" oldV="0.05 s" newV="2.0 s" better={false} />
                    <MetricRow label="Inference (GPU)" oldV="—" newV="0.14 s" better={true} />
                  </tbody>
                </table>
              </div>
              <p>
                The headline is that the model reliably flags bad skills: 87.4% of malicious files are caught
                and 88.9% of verdicts agree with the gold label. Path traversal and social engineering
                categorization jumped from complete failure to F1 0.974 and 0.944. These are the classes where
                reasoning matters most — the attacks look benign at the token level and are dangerous only in
                context. The encoder literally could not see them.
              </p>
              <p className="mt-4">
                The weak spot on the categorization metric is prompt injection (F1 0.432), which is
                <em> lower</em> than the encoder's number. That's not a model regression — the model still
                catches these files as malicious. It's a taxonomy problem we explain below.
              </p>
            </section>

            {/* Section 6 — What we learned */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What we learned the hard way
              </h2>
              <div className="space-y-5">
                <div>
                  <p className="font-semibold mb-2" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Measurement matters more than optimization.
                  </p>
                  <p>
                    The single biggest lift in this entire project — from multi-label F1 0.479 to 0.731 —
                    came from <em>zero model changes</em>. Our eval labels were single-class when the attacks
                    were multi-class. A file that was both path_traversal and prompt_injection was labeled
                    only as one; the model's correct "both" prediction was scored as a partial miss. We
                    re-ran the teachers over the eval set with multi-label output, corrected the gold labels,
                    and watched F1 climb 25 points. You cannot optimize a metric that is measuring the wrong
                    thing.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    "Prompt injection" is a delivery mechanism, not an attack class.
                  </p>
                  <p>
                    Almost every attack in our corpus uses prompt injection to deliver <em>something</em> — exfil,
                    code exec, path traversal, credential harvest. Labeling a file simply as
                    "prompt_injection" is like labeling a phishing email as "email". The F1 0.432 score on
                    this class reflects our ongoing taxonomy work, not a model capability gap. We're moving
                    toward labeling the payload (what the attack achieves) as the primary class and treating
                    injection as a delivery attribute.
                  </p>
                </div>
                <div>
                  <p className="font-semibold mb-2" style={{ color: "oklch(0.85 0.005 265)", fontFamily: "'Space Grotesk', sans-serif" }}>
                    Infrastructure investments pay off fast.
                  </p>
                  <p>
                    Moving evaluation from local CPU to Modal GPU cut a full-corpus eval from 37 minutes to
                    5. That's the difference between "run once per day" and "iterate through twelve
                    hyperparameter configurations before lunch". When you're searching a design space, your
                    feedback loop latency is the dominant variable. Spend on it early.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 — What's open, what's closed */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What's open, what's closed
              </h2>
              <div className="rounded-xl p-5 my-5" style={{ background: "oklch(0.70 0.15 160 / 0.06)", border: "1px solid oklch(0.70 0.15 160 / 0.25)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "oklch(0.75 0.18 160)", fontFamily: "'Space Grotesk', sans-serif" }}>Open</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  Model weights (<InlineCode>kurtpayne/skillscan-detector-v4</InlineCode> on HuggingFace),
                  fine-tuning scripts, evaluation harness, scoring methodology, architecture decisions, and
                  the full set of static detection rules and IOC database. If you want to reproduce our
                  numbers or fork the detector, everything you need is public.
                </p>
              </div>
              <div className="rounded-xl p-5 my-5" style={{ background: "oklch(0.65 0.18 25 / 0.06)", border: "1px solid oklch(0.65 0.18 25 / 0.20)" }}>
                <p className="text-sm font-semibold mb-2" style={{ color: "oklch(0.75 0.18 25)", fontFamily: "'Space Grotesk', sans-serif" }}>Closed</p>
                <p className="text-sm" style={{ color: "oklch(0.62 0.015 265)" }}>
                  The training corpus. Releasing the exact training examples would hand attackers a map of
                  our decision boundary — they could craft evasions by searching for patterns
                  <em> adjacent to but not included in</em> the corpus. An open corpus is training data for
                  attackers. The rules, the model, the scanner, and the reasoning outputs stay public; the
                  training data is the defensive moat.
                </p>
              </div>
              <p>
                We've been asked why this asymmetry is acceptable. The answer is that the detection rules
                and IOC database already provide the community transparency you want from a security tool —
                you can audit every rule, every signature, every URL we flag. The corpus is different: its
                value to a defender is the signal it provides to the model, while its value to an attacker
                is the ability to craft near-miss evasions. Publishing it would disproportionately help the
                attacker.
              </p>
            </section>

            {/* Section 8 — What's next */}
            <section>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}>
                What's next
              </h2>
              <p>
                v4.1 is the first detector architecture we're confident enough in to build on. The roadmap:
              </p>
              <div className="space-y-3 mt-5">
                {[
                  ["v4.2 — trace-enhanced training", "Use skillscan-trace to execute each corpus file in a sandbox and capture behavioral evidence (network calls, file operations, MCP tool invocations). Feed that evidence into the teacher prompt so the student learns what attacks do, not just what they say."],
                  ["Confidence calibration", "Current confidence is 0.95 on nearly every prediction — the model was trained against teacher outputs that rarely hedge. We need to re-weight training so low-confidence teachers produce low-confidence students, and run isotonic regression calibration against the eval set."],
                  ["Adversarial robustness", "Feed skillscan-fuzzer-generated evasion variants into training and track recall on those variants as a first-class metric. This is the arms race the encoders couldn't fight."],
                  ["Community contributions", "Opt-in sample submission via skillscan feedback fp / skillscan feedback fn. The corpus stays private, but accepted samples enter the next training run — with the submitter credited in the changelog."],
                ].map(([title, body]) => (
                  <div key={title} className="p-4 rounded-lg" style={{ background: "oklch(0.13 0.020 265)", border: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
                    <div className="text-sm font-semibold mb-1.5" style={{ color: "oklch(0.78 0.18 290)", fontFamily: "'Space Grotesk', sans-serif" }}>{title}</div>
                    <p className="text-xs" style={{ color: "oklch(0.58 0.015 265)" }}>{body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5">
                The ML detector remains opt-in via <InlineCode>--ml-detect</InlineCode>. Static rules are
                still the primary layer — they're fast, deterministic, and don't require a 935 MB model
                download. But if you want deeper analysis with human-readable reasoning, v4.1 is a
                meaningfully different tool than anything we've shipped before.
              </p>
              <CodeBlock code={`# Install with the llama.cpp ML backend
pip install 'skillscan-security[ml-llama]'

# First run downloads the GGUF model (~935 MB)
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
