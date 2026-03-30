# Work Queue — 2026-03-31

> **Current state:** v14 model live on HuggingFace. Macro F1 **0.8805** on expanded eval (516 examples).
> The eval set was expanded today from 471 → 516 examples, exposing that the previously reported 0.9023 was inflated by a thin eval set.
>
> **Two gaps to close before v15:**
> - **GitHub SKILL.md FPR 21.9%** — 51 of 233 benign github files still flagged as injection
> - **Supply-chain injection recall 66.7%** — 2 of 6 `skill_composition_supply_chain` eval examples missed
>
> **Target for v15:** Macro F1 ≥ 0.93, FPR ≤ 8%, supply-chain recall ≥ 90%.

---

## Priority 1 — Fix GitHub SKILL.md FPR (~1.5 hrs)

The model confuses legitimate SKILL.md files (imperative instructions, tool calls, system directives) with injection attacks. 100% of benign FPs come from the `benign_github_*` archetype (233 eval examples, 21.9% FPR).

**Action:** Add 60 more `benign_github_SKILL_md` hard-negative training examples. Focus on the top-scoring FP patterns from the v14 logits cache (`/tmp/v14_logits_cache.pt`):

Top FP archetypes to target (all scoring ≥ 0.997):
- Skills that use `subprocess`, `os.environ`, `shell=True` for legitimate automation
- Skills with `mcp_*` tool calls for legitimate integrations
- Skills with `execute`, `run`, `deploy` imperative verbs in legitimate contexts
- Skills that reference credentials legitimately (Vault, AWS SM, env vars)
- Skills with multi-step numbered instructions that look like attack playbooks

Save to `training_corpus/benign/` with prefix `benign_hn_github_skill_`.

```bash
# After writing examples, verify count
find training_corpus/benign/ -name "benign_hn_github_skill_*.md" | wc -l
# Should be 60+
```

---

## Priority 2 — Fix Supply-Chain Injection Recall (~45 min)

The `skill_composition_supply_chain` archetype has only 54 training examples and 6 eval examples, with 66.7% recall (2 FNs). The missed examples are likely the more subtle variants where the supply-chain payload is embedded in a dependency's SKILL.md rather than the top-level skill.

**Action:** Add 20 more `skill_composition_supply_chain` training examples. Focus on:
- Transitive dependency SKILL.md files that embed instructions
- Package README files with hidden instruction payloads
- Dependency install hooks that inject instructions
- `requirements.txt` / `package.json` with malicious package names that shadow legitimate ones

Save to `training_corpus/malicious/` with prefix `skill_comp_supply_chain_`.

Also add 4 more eval examples to `held_out_eval/` with prefix `injection_skill_comp_eval_0` (continuing from 05).

---

## Priority 3 — Eval Set Health Check (~30 min)

The eval set is now 516 examples. Before v15 training, verify:

```bash
cd ~/skillscan-corpus
python3 - << 'EOF'
import os, collections
eval_dir = 'held_out_eval'
labels = collections.Counter()
cats = collections.Counter()
for f in os.listdir(eval_dir):
    if not f.endswith('.md'):
        continue
    content = open(f'{eval_dir}/{f}').read()
    for line in content.split('\n'):
        if line.startswith('label:'):
            labels[line.split(':')[1].strip()] += 1
        if line.startswith('category:'):
            cats[line.split(':')[1].strip()] += 1
print(f"Total: {sum(labels.values())}")
print(f"Benign: {labels['benign']}, Injection: {labels['injection']}")
print(f"\nTop 10 categories:")
for cat, n in cats.most_common(10):
    print(f"  {cat}: {n}")
EOF
```

Target: benign ≥ 200, injection ≥ 200, no archetype with n=1 except for specific singleton evasion variants.

---

## Priority 4 — Register eval set labels in skill-index.yaml (~15 min)

The new eval categories (`hard_negative_devops`, `hard_negative_sysadmin`, etc.) are not registered in `index/skill-index.yaml`. While the eval script doesn't use the index, it's good hygiene to keep it current.

Add entries for:
- `hard_negative_devops`
- `hard_negative_sysadmin`
- `hard_negative_cloud`
- `hard_negative_enterprise`
- `hard_negative_mcp`
- `hard_negative_devtool`

---

## Training Run — After Priorities 1–2 are committed

```bash
source ~/.skillscan-secrets
cd ~/skillscan-corpus
modal run --detach scripts/finetune_modal.py
# Monitor at https://modal.com/apps/kurtpayne
```

**Note:** The local client must stay alive until Modal returns results, OR the remote eval write (now in `run_finetune`) will handle EVAL_RESULTS.md and the git push automatically. `--detach` is now safe as of commit `2b243c29`.

---

## Process notes from today's session

| Issue | Fix applied | Commit |
|---|---|---|
| 8 injection dirs missing from skill-index.yaml | Added all 8 | `140ff097` |
| Pre-flight check missing in finetune_modal.py | Added abort check | `2b243c29` |
| ONNX fp16 conversion was a noop | Removed, now fp32 | `ff3331c8` |
| Eval write lost on `--detach` | Moved into remote function | `2b243c29` |
| Pattern-update skill gh auth silent failure | Hardened Step 0 | website repo |
| ~/.bashrc doesn't source secrets on fresh session | Added auto-source block | local only |
| Eval set too small / inflated F1 | Expanded 471 → 516 | `[pending push]` |

---

## v14 → v15 expected delta

| Metric | v14 (current) | v15 (target) |
|---|---|---|
| Macro F1 | 0.8805 | ≥ 0.93 |
| Benign F1 | 0.9053 | ≥ 0.94 |
| Injection F1 | 0.8557 | ≥ 0.92 |
| FPR | 15.8% | ≤ 8% |
| Supply-chain recall | 66.7% | ≥ 90% |
| Eval set size | 516 | 516 (stable) |

---

*Generated 2026-03-30. Supersedes 2026-03-24 work queue (all items from that queue are complete).*
