---
title: "SkillScan v4: From Pattern Matching to Reasoning — Our New Generative Detector"
date: 2026-04-10
author: Kurt Payne
tags:
  - ML / Training
  - Generative AI
  - Security
  - Qwen
  - llama.cpp
  - Transparency
---

For the past several weeks, SkillScan's ML detector has been built on DeBERTa-v3-base — an encoder-only transformer fine-tuned with a LoRA adapter to classify AI agent skill files as malicious or benign. On paper, the architecture made sense: small model, fast inference, proven track record on NLI benchmarks.

In practice, it was failing silently on nearly every attack class we cared about.

Today we're shipping v4, a fundamentally different approach: a generative model that *reasons* about threats instead of pattern-matching against them. Here's what happened, what we learned, and where we're headed.

## The honest numbers

When we ran a clean evaluation — no label leakage, strict train/eval separation — our DeBERTa adapter produced these per-class F1 scores:

| Attack class | DeBERTa F1 |
|---|---|
| Prompt injection | 0.540 |
| Path traversal | 0.000 |
| Supply chain | 0.000 |
| Social engineering | 0.000 |
| Data exfiltration | 0.000 |
| Code injection | 0.099 |
| Evasion | 0.154 |

That's a macro F1 of 0.113. The model could partially detect prompt injection — the most common pattern in our training set — and essentially nothing else. For a security tool, this is worse than useless: it creates a false sense of coverage.

## What went wrong

We traced the inflated numbers from earlier evaluations to two bugs:

**Label leakage in the training pipeline.** Our training corpus uses YAML frontmatter to store ground-truth labels. The preprocessing step was feeding that frontmatter directly to the model. DeBERTa wasn't learning to detect attacks — it was reading the answer key. Stripping frontmatter before tokenization dropped the apparent F1 dramatically, revealing the true model capability.

**ModernBERT ONNX export corruption.** When we attempted to upgrade to ModernBERT (which has a hybrid local/global attention mechanism), the ONNX export silently produced broken models. Outputs were numerically wrong — the model appeared to work but returned garbage predictions. This cost us weeks of debugging before we identified the attention architecture as the root cause.

Both bugs were silent failures. The pipeline ran, the metrics looked plausible, and the model shipped. This is the scariest kind of ML bug: the kind that passes every automated check.

## The v4 approach: teach a small model to reason

Encoder-only models compress an entire document into a fixed-size embedding, then make a classification decision from that embedding. For detecting subtle attack patterns — a `../` buried in an otherwise benign path, a social engineering setup that spans multiple paragraphs — this compression loses critical context.

We needed a model that could *explain* why something is suspicious, not just assign a probability.

### Teacher distillation

We started by having two frontier models — Claude Sonnet and GPT-4o — analyze every file in our training corpus. Each teacher produced structured JSON output:

```json
{
  "verdict": "SUSPICIOUS",
  "labels": ["social_engineering", "data_exfiltration"],
  "confidence": 0.85,
  "reasoning": "The skill instructs the agent to ask the user for their API keys under the pretense of 'validating configuration', then writes them to an external endpoint..."
}
```

This gave us approximately 20,000 distilled training examples with rich reasoning chains — not just binary labels.

### Fine-tuning Qwen2.5-1.5B-Instruct

We chose Qwen2.5-1.5B-Instruct as the student model. At 1.5B parameters, it's small enough for CPU inference but large enough to follow structured output formats reliably. Fine-tuning used QLoRA (4-bit quantization during training, rank-16 adapters) on the distilled dataset.

The key design decision: the model outputs its reasoning *before* its verdict. This isn't just for explainability — it materially improves detection quality by forcing the model to articulate evidence before committing to a classification.

### Deployment: GGUF on llama.cpp

For inference, we quantize the merged model to GGUF Q4_K_M format (935 MB) and run it through llama.cpp. No PyTorch, no CUDA, no Python ML stack at scan time. The scanner shells out to `llama-cli`, parses the JSON response, and integrates the verdict into the existing rule engine.

Average inference time is 2.0 seconds per file on CPU. That's slower than the DeBERTa encoder (which ran in ~50ms), but it's a reasonable trade-off for dramatically better detection.

## Results

| Attack class | DeBERTa F1 | Qwen v4 F1 | Change |
|---|---|---|---|
| Prompt injection | 0.540 | 0.667 | +0.127 |
| Path traversal | 0.000 | 0.857 | +0.857 |
| Social engineering | 0.000 | 0.857 | +0.857 |
| Code injection | 0.099 | 0.424 | +0.325 |
| Supply chain | 0.000 | 0.340 | +0.340 |
| Evasion | 0.154 | 0.308 | +0.154 |
| Data exfiltration | 0.000 | 0.148 | +0.148 |
| **Macro F1** | **0.113** | **0.487** | **4.3x** |

Verdict accuracy is 85.2% across the held-out eval set, with a 1.2% parse failure rate (cases where the model produces malformed JSON, which the scanner treats as PASS).

The improvement is most dramatic on attack classes that DeBERTa completely missed. Path traversal and social engineering both jumped from zero to 0.857 F1. These are exactly the classes where reasoning matters most — the attacks look benign at the token level but are dangerous in context.

## Explainable detections

Every v4 detection now includes a human-readable reasoning field. When `skillscan scan` flags a file with the ML detector, the output includes *why* the model flagged it:

> "The skill instructs the agent to recursively read files from parent directories using `../../` path traversal patterns, then encode the contents as base64 and append them to an outbound HTTP request. This combines path traversal with data exfiltration."

This is a step change in usability. Security teams can triage findings without reverse-engineering what the model might have keyed on. It also makes false positives easier to identify and report.

## What's still weak

We're publishing these numbers because transparency matters more than looking good. Some areas need significant improvement:

**Data exfiltration (F1 = 0.148)** has the highest false positive rate. The model over-triggers on skills that legitimately send data to external APIs. Distinguishing "upload a file to S3" from "exfiltrate credentials to an attacker endpoint" requires understanding intent, not just mechanics.

**Evasion (F1 = 0.308)** is inherently adversarial — these are files specifically crafted to avoid detection. As the model improves, evasion techniques will adapt. This is an arms race we expect to fight continuously.

**Inference speed** is acceptable but not great. At 2 seconds per file, scanning a directory of 100 skills takes over 3 minutes with ML detection enabled. We're exploring 0.5B parameter models and speculative decoding to bring this down.

## What's next

**Trace-enhanced training data.** SkillScan Trace executes skills in a sandboxed environment and records behavioral side-effects. We plan to incorporate trace evidence into the training pipeline — teaching the model what an attack *does*, not just what it *says*.

**Smaller models.** Qwen2.5-0.5B-Instruct is a candidate for a faster inference tier. Early experiments show it can handle structured output but struggles with nuanced reasoning on subtle attacks.

**Community contributions.** SkillScan is open source. If you encounter false positives or missed detections, file an issue with the skill file (or a sanitized version) and we'll incorporate it into the next training cycle. The model gets better with real-world examples.

The ML detector remains opt-in via `--ml-detect`. Static rules are still the primary detection layer — they're fast, deterministic, and don't require downloading a 935 MB model. But for teams that want deeper analysis, v4 represents a meaningful improvement in both coverage and trust.

---

*Try it: `pip install skillscan-security[ml-llama]` and run `skillscan scan your-skills/ --ml-detect`*

*Source: [github.com/kurtpayne/skillscan-security](https://github.com/kurtpayne/skillscan-security)*
