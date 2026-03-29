# SkillScan ML Training Strategy
*Written: 2026-03-29 — based on decontaminated eval results and corpus audit*

---

## Executive Summary

The v10 model (F1=0.9787) was measured on a contaminated eval set. The true generalization performance on the decontaminated 459-file set is **F1=0.50 (model-only, --skip-rules)** — the model classifies everything as benign (0% recall, 0% FPR). This is not a minor regression; it is a complete failure to generalize to the new eval distribution. This document diagnoses why, challenges the current architecture, surfaces assumptions, and proposes a concrete phased plan to reach F1 ≥ 0.92 on the decontaminated set.

---

## 1. Diagnosis

### 1.1 What the eval actually shows

| Eval mode | F1 | FPR | Recall | Interpretation |
|---|---|---|---|---|
| Rules-only | 0.4781 | 38.7% | 41.1% | Rules fire on enterprise patterns; miss new injection archetypes |
| Rules + ML | 0.4613 | 43.2% | 45.2% | ML adds more FPs on top of rules; marginal recall gain |
| **ML-only (--skip-rules)** | **0.50** | **0.0%** | **0.0%** | **Model never fires — classifies everything as benign** |

The ML-only result is the most informative. The model has **perfect specificity and zero sensitivity** — it has collapsed to a trivial "always benign" classifier on this distribution. This is a known failure mode for imbalanced classifiers when the test distribution shifts.

### 1.2 Root cause: three compounding problems

**Problem 1 — Eval contamination (now fixed)**
The v10 eval set (451 files) overlapped with training data. The model memorized the eval distribution. The decontaminated set (459 files) replaced 233 benign files with real GitHub-scraped content and added 14 new injection archetypes. The model has never seen either.

**Problem 2 — Benign distribution mismatch**
Training benign corpus: 16,856 files, of which only ~128 (0.76%) are real GitHub-scraped skill files. Eval benign set: 315 files, of which 237 (75.2%) are real GitHub-scraped. The model learned "benign" from synthetic/generated content and has never seen the real distribution at scale.

**Problem 3 — Missing injection archetypes in training**
The 14 new injection archetypes added during decontamination are not represented in training at all:
- `jb_jb11` (DAN/STAN/persona jailbreaks): 16 FNs — 0 training examples
- `mcp_imp` (MCP tool description poisoning): 12 FNs — 0 training examples  
- `ent_supply_chain` (supply chain redirect via .npmrc/.pypirc): 6 FNs — 0 training examples
- `ent_cred`, `ent_ep`, `ent_indirect` (enterprise exfil variants): 8 FNs — 0 training examples
- `se_fake_mcp` (fake MCP server social engineering): 6 FNs — 0 training examples

### 1.3 Why the model collapsed to "always benign"

The class weight cap of 4× is insufficient at the current 48:1 benign:injection ratio (16,856 : 349). At 48:1, the uncapped weight would be 24×. Capping at 4× means the model still sees 12× more benign signal per effective training step than it should. Over 5 epochs, the gradient signal from injection examples is overwhelmed. The model converges to the majority class.

Additionally, the 5-epoch training schedule with no early stopping means the model can overfit to the training distribution and then fail to generalize when the test distribution shifts.

---

## 2. Assumptions Surfaced

The following assumptions were embedded in the previous training strategy. Each is now challenged:

| Assumption | Status | Reality |
|---|---|---|
| "The eval set is a reliable proxy for real-world performance" | ❌ False | The eval set was contaminated; v10 F1=0.9787 is not real |
| "More training data always helps" | ❌ Conditional | Adding 7,000 benign files at 48:1 ratio makes recall worse, not better |
| "LoRA r=64 is sufficient for this task" | ⚠ Uncertain | r=64 with only `query_proj` + `value_proj` targets may underfit on new archetypes |
| "5 epochs is the right training duration" | ⚠ Uncertain | No validation curve tracking; we don't know if the model is overfitting or underfitting |
| "DeBERTa-v3-base is the right architecture" | ⚠ Needs validation | It was chosen because `protectai/deberta-v3-base-prompt-injection-v2` was a good starting point; this assumption has not been re-evaluated since |
| "MAX_LENGTH=256 tokens is sufficient" | ⚠ Risky | The new injection archetypes embed attacks in longer documents; 256 tokens may truncate the attack payload |
| "Class weights capped at 4× are sufficient" | ❌ False | At 48:1 ratio, 4× cap is too low; the model is overwhelmed by benign signal |
| "The eval set should be balanced 50/50" | ⚠ Debatable | Real-world distribution is heavily benign; a 50/50 eval set measures peak discrimination, not real-world performance |

---

## 3. Architecture Critique

### 3.1 What DeBERTa-v3 is good at (and what it is not)

DeBERTa-v3-base is a 184M parameter encoder model with disentangled attention and enhanced mask decoder. It is excellent at:
- Short-to-medium text classification (≤512 tokens)
- Binary and multi-class intent detection
- Transfer learning from a domain-adjacent checkpoint (`protectai/deberta-v3-base-prompt-injection-v2`)

It is less well-suited for:
- **Long documents**: The sliding-window chunker in `_scanner.py` handles this, but chunking introduces its own failure modes — an attack buried at the end of a 500-line file may be in a chunk that scores benign because the surrounding context is benign
- **Structural/semantic attacks**: MCP tool description poisoning (`mcp_imp`) and supply chain redirects (`ent_supply_chain`) require understanding the *relationship* between a legitimate instruction and an embedded override — not just the presence of malicious tokens
- **Evasion**: Encoding-based evasion (base64, hex, char codes) requires the model to understand that encoded content should be decoded before classification — DeBERTa sees the encoded string as opaque tokens

### 3.2 ModernBERT as an alternative

The April 2025 paper "ModernBERT or DeBERTaV3?" (ACL 2025) found that DeBERTaV3 outperforms ModernBERT when controlling for dataset differences. ModernBERT is 2-4× faster at inference but DeBERTa has better classification accuracy on most benchmarks. **Recommendation: stay with DeBERTa-v3 for now.** The performance gap is not the architecture — it is the training data.

### 3.3 The chunking strategy is a liability

The current sliding-window chunker processes each 256-token chunk independently and takes the max score across chunks. This is correct for attacks that are self-contained in a single chunk. It fails for:
- **Distributed attacks**: An attack split across two chunks (e.g., instruction override in chunk 1, payload in chunk 2) — neither chunk alone scores high enough
- **Context-dependent attacks**: MCP tool description poisoning requires seeing both the legitimate tool description and the override in the same context window

**Recommendation**: Add a "document summary" chunk — a concatenation of the first 128 tokens + last 128 tokens of the file — as an additional chunk to catch attacks at document boundaries.

### 3.4 LoRA target modules

Currently targeting only `query_proj` and `value_proj`. The literature on LoRA for classification tasks suggests that also targeting `key_proj` and the output projection (`out_proj`) improves performance on tasks requiring structural understanding. This is a low-risk change.

---

## 4. The Real Problem: Corpus Quality, Not Quantity

The core issue is not that we need more data — it is that the training data does not represent the real-world distribution the model will encounter. Specifically:

**Benign side:** The model has never seen real GitHub-scraped agent skill files at scale. These files contain legitimate security tooling language (credential references, vault integrations, audit patterns) that the model conflates with malicious content because it only learned "benign" from synthetic examples.

**Malicious side:** 14 new injection archetypes are completely absent from training. The model cannot detect what it has never seen.

**The ratio problem is secondary.** If we add the right data on both sides, the ratio will naturally improve. The current 48:1 ratio is partly an artifact of the benign corpus being inflated with synthetic data that doesn't represent the real distribution.

---

## 5. Phased Action Plan

### Phase A: Fix the training data (1-2 days)

**A1. Add the 14 missing injection archetypes to training (high priority)**
- Generate 10-15 examples per archetype × 14 archetypes = ~150-200 new malicious examples
- Focus on: `jb_jb11` (DAN/STAN), `mcp_imp` (MCP tool poisoning), `ent_supply_chain`, `ent_cred`, `ent_ep`, `ent_indirect`, `se_fake_mcp`
- These are the exact files the model missed — adding them directly closes the recall gap

**A2. Add 1,500-2,000 real GitHub-scraped benign files (targeted, not bulk)**
- Do NOT add all 7,000 scraped files — this inflates the ratio without improving quality
- Select the 1,500 most diverse files from the scrape (cluster by content, pick diverse representatives)
- Target: CLAUDE.md, AGENTS.md, .cursorrules, OpenAI assistant definitions — these are the specific formats the model has not seen

**A3. Target ratio after Phase A**
- Benign: ~18,500 (16,856 + 1,500 new + ~150 from existing FP files)
- Malicious: ~550 (349 + 150 new + 50 from existing FN files)
- Ratio: ~34:1 — comparable to v10's 27:1, which achieved good results

### Phase B: Fix the training procedure (1 day)

**B1. Raise the class weight cap from 4× to 8×**
- At 34:1 ratio, uncapped weight is 17×. Cap at 8× gives injection examples 8× more loss weight than benign.
- This is the single most impactful hyperparameter change.

**B2. Add validation split and early stopping**
- Use 10% of training data as validation
- Stop training when validation F1 stops improving (patience=2 epochs)
- This prevents overfitting to the training distribution

**B3. Extend LoRA target modules**
- Add `key_proj` and `out_proj` to target modules
- Increase LoRA r from 64 to 96 for the new fine-tune (more capacity for new archetypes)

**B4. Extend MAX_LENGTH from 256 to 384 tokens**
- The new injection archetypes embed attacks in longer documents
- 384 tokens captures more context without exceeding DeBERTa's 512-token limit
- This will increase inference time by ~50% but improves coverage of long-document attacks

**B5. Add document-boundary chunk**
- In `_scanner.py`, add a synthetic chunk: first 192 tokens + last 192 tokens of the document
- This catches attacks split across the document boundary

### Phase C: Improve the eval methodology (0.5 days)

**C1. Update CI to use --skip-rules --ml-detect**
- The CI eval should measure the model in isolation (as we now do locally)
- Rules are a separate layer and should be tested separately

**C2. Add per-archetype F1 to the eval output**
- The current eval reports macro F1 only
- Per-archetype F1 shows which attack families the model is missing
- This is already partially implemented in the fine-tune script

**C3. Add a real-world FPR metric**
- The current eval has a 50/50 benign:injection split
- Add a second eval pass with the real-world distribution (~95% benign, 5% injection)
- This measures the FPR the user actually experiences

### Phase D: Validate and iterate (ongoing)

**D1. Run v11 fine-tune after Phase A+B changes**
- Expected outcome: F1 ≥ 0.85 on the decontaminated set (conservative estimate)
- If F1 < 0.85: diagnose per-archetype breakdown, add more targeted examples
- If F1 ≥ 0.85 but < 0.92: run Phase D2

**D2. Adversarial augmentation for remaining FN archetypes**
- For any archetype still below F1=0.80 after v11: generate adversarial variants
- Use `skillscan-trace` behavioral sandbox to generate ground-truth labels
- This is the "quality over quantity" approach — 5 well-crafted adversarial examples beat 50 generic ones

**D3. Target: F1 ≥ 0.92 on decontaminated set within 3 training runs**

---

## 6. What NOT to Do

- **Do not bulk-add 7,000 scraped benign files.** This inflates the ratio and dilutes the injection signal. Quality and diversity matter more than volume.
- **Do not raise the F1 gate to 0.95 before reaching 0.92 on the decontaminated set.** The gate is currently measured on the training corpus's internal eval split, not the decontaminated set. These are different things.
- **Do not change the base model.** DeBERTa-v3-base is the right architecture for this task. The problem is training data and hyperparameters, not the model.
- **Do not add more static rules to compensate for ML failures.** The static rules are a separate layer and are acknowledged as clunky. The ML model should be the primary detector. Adding rules to paper over ML gaps creates technical debt.

---

## 7. Success Criteria

| Metric | Current | Target |
|---|---|---|
| ML-only macro F1 (decontaminated set) | 0.50 | **≥ 0.92** |
| ML-only FPR (decontaminated set) | 0.0% | **≤ 5%** |
| ML-only recall (decontaminated set) | 0.0% | **≥ 90%** |
| Per-archetype F1 (worst archetype) | 0.0 | **≥ 0.75** |
| Inference time per file (CPU, avg) | ~5s | **≤ 3s** (with MAX_LENGTH=384) |

---

## 8. Timeline

| Phase | Work | Estimated time |
|---|---|---|
| A1: Generate 150-200 new injection examples | Corpus generation | 2-3 hours |
| A2: Select 1,500 diverse benign files from scrape | Corpus curation | 1 hour |
| B: Update fine-tune script (class weights, LoRA, MAX_LENGTH, early stopping) | Code | 1 hour |
| B5: Add document-boundary chunk to scanner | Code | 30 min |
| C: Update CI eval methodology | Code | 30 min |
| D1: Run v11 fine-tune on Modal | Training | ~45 min |
| D1: Evaluate v11 on decontaminated set | Eval | ~20 min |
| **Total** | | **~6 hours** |
