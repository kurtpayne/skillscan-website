# SkillScan Project Memory

> Last updated: 2026-03-27
> Purpose: Persistent context for Manus sessions — survives compaction.

---

## Mission

SkillScan is a security scanner that detects **prompt injection, jailbreaks, and malicious content** in AI agent skill files (SKILL.md format). It uses a fine-tuned DeBERTa-v3 model (LoRA adapter) for ML-based detection, plus a YARA-style rule engine for pattern matching.

---

## Secrets File

Location: `~/.skillscan-secrets`

```bash
source ~/.skillscan-secrets
```

Contains:
- `HF_TOKEN` — HuggingFace write token (user: **kurtpayne**)
- `GITHUB_PAT` — GitHub personal access token (use `unset GH_TOKEN` first if gh auth fails)
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `MODAL_TOKEN_ID` + `MODAL_TOKEN_SECRET` — Modal GPU compute

**Note:** If `gh` auth fails with "token invalid", run: `source ~/.skillscan-secrets && unset GH_TOKEN && echo "$GITHUB_PAT" | gh auth login --with-token`

---

## Repository Map

### `kurtpayne/skillscan-security` (PUBLIC)
Path: `/home/ubuntu/skillscan-security`

**What lives here:**
- `src/skillscan/` — Python CLI scanner (`skillscan` command)
- `src/skillscan/data/rules/default.yaml` — YARA-style detection rules (137 static rules as of 2026-03-24)
- `src/skillscan/data/intel/ioc_db.json` — 5,507 IOC entries
- `src/skillscan/data/intel/vuln_db.json` — 63 packages (47 Python + 16 npm), dict-format only
- `src/skillscan/detectors/skill_graph.py` — PSV-001/002/003/004, GR-007 graph rules
- `src/skillscan/ml_detector.py` — ML detection + M10.8 attack_hint classifier
- `src/skillscan/_corpus_manager.py` — bundled fallback for CorpusManager (added 2026-03-25 to fix CI)
- `src/skillscan/corpus.py` — shim that imports from _corpus_manager (added 2026-03-25)
- `src/skillscan/models.py` — Finding model (includes `attack_hint` field as of M10.8)
- `.github/workflows/corpus-sync.yml` — CI fine-tune trigger (stays here, NOT in private repo)
- `examples/showcase/` — 119 showcase examples
- `tests/` — 300+ test functions across 30 files
- `ROADMAP.md` — project roadmap
- `docs/MODEL_METRICS.md` — model performance history (updated 2026-03-25 with v8 and v9 results)

**What does NOT live here (gitignored):**
- `corpus/` — all corpus data is in private repo
- `scripts/finetune_modal.py` — in private repo
- `scripts/scrape_*.py` — in private repo

### `kurtpayne/skillscan-corpus` (PRIVATE)
Path: `~/skillscan-corpus`

**What lives here:**
- `training_corpus/benign/` — ~9,050 benign examples (including 5,000+ vendor skill files from corpus researcher agent)
- `training_corpus/malicious/` — 160+ malicious examples (gap archetype + enterprise injection)
- `training_corpus/augmented/` — 120 backtranslation augmented examples (added v8)
- `training_corpus/prompt_injection/`, `jailbreak_distillations/`, `agent_hijacker/`, `obfuscation_injection/`, `social_engineering/`, `graph_injection/`
- `held_out_eval/` — 444 held-out eval examples (expanded from 201 in v8)
  - `held_out_eval/organic/` — organic eval holdouts from pattern-updater skill
- `scripts/finetune_modal.py` — Modal GPU fine-tune pipeline
  - **FIXED 2026-03-25**: `import hashlib as _hashlib` and `import pathlib as _pathlib` moved before first use in ONNX FP16 export block (was causing UnboundLocalError, ONNX export silently failed in v8)
- `scripts/reserve_eval_set.py` — carves 20% stratified eval split
- `scripts/backtranslate_augment.py` — EN→FR/ES/ZH/DE→EN paraphrase augmentation (needs OPENAI_API_KEY)
- `scripts/confidence_audit.py` — scores examples against current model
- `scripts/augment_corpus.py` — adversarial variants from benign files
- `scripts/corpus_manager.py` — corpus index builder
- `manifest.json` — corpus metadata + last archetype F1 scores

**INJECTION_DIRS** (finetune_modal.py label mapping):
`prompt_injection`, `malicious`, `social_engineering`, `adversarial`, `jailbreak_distillations`, `augmented`, `benchmark_injection`, `agent_hijacker`, `obfuscation_injection`

### `kurtpayne/skillscan-lint` (PUBLIC)
Path: `~/skillscan-lint`

**What lives here:**
- `src/skillscan_lint/rules/quality.py` — 34 lint rules (QL-001 through QL-034 as of M10.9)
- 86 tests pass

### `kurtpayne/skillscan-website` (PUBLIC — webdev project)
Path: `/home/ubuntu/skillscan-website`
Stack: React 19 + Tailwind 4 + shadcn/ui (static frontend)
Dev server: `https://3000-ilaaohrx0a3warjfb8lg2-21cd6f79.us2.manus.computer`

> ⚠️ **CRITICAL — READ EVERY SESSION:**
> The website is hosted on **GitHub Pages**, NOT Manus hosting.
> The Manus webdev checkpoint/publish system is irrelevant for deployment.
> **The ONLY way to deploy the website is:**
> ```bash
> source ~/.skillscan-secrets
> GH_TOKEN="$GITHUB_PAT" git push github HEAD:main
> ```
> GitHub Pages auto-deploys on every push to `github/main`.
> The `github` remote = `https://github.com/kurtpayne/skillscan-website.git`
> The `origin` remote = Manus internal git (NOT the live site).
> **NEVER tell Kurt to click Publish in the Manus UI. NEVER say the site is deployed without pushing to `github` remote.**

---

## Model

### HuggingFace Repo
`kurtpayne/skillscan-deberta-adapter`
Base model: `protectai/deberta-v3-base-prompt-injection-v2`

### Current Production Model: v9 (v18161-5ep)
**Pushed 2026-03-25** — ONNX FP32 (~350 MB), manifest version `18161-5ep`
- Macro F1: **0.9752** (gate 0.92 PASSED ✅, target 0.97 MET ✅)
- FPR: **1.89%** (SaaS ≤ 2% threshold MET ✅)
- Training corpus: 18,161 examples
- Eval set: 444 examples
- Regression gate: 3 benign MCP fixtures exempted (n=1 each, macro F1 improved)

### ONNX Status
**FP32 confirmed as production format.** The FP16 conversion step (`onnxconverter_common.float16`) runs but produces no file size reduction for DeBERTa-v3 — the attention mechanism retains FP32 constants. INT8 quantization was evaluated in an earlier run and caused F1 collapse (0.84 → 0.32). FP32 at ~350 MB is the final format. Modal timeout increased to 3600s (was 1800s) to accommodate the ONNX export step.

### Persistent FN Archetypes (v8 and v9, both zero)
| Archetype | Description | Priority |
|---|---|---|
| mcp_server_impersonation | MCP tool name spoofing | High |
| organic_mal047 | Claude hooks RCE | High |
| se_git_config_harvest | git config credential harvest | High |
| jb_jb07_035 | jailbreak consistency appeal variant | Medium |
| jb_jb08_037 | jailbreak refusal prohibition variant | Medium |
| jb_jb09_045, jb_jb10_046 | new jailbreak archetypes (0 training examples) | Medium |
| pi24_rss_indirect_injection | RSS-based indirect injection | Medium |
| pi37_markdown_injection | markdown link injection (0 training examples) | Low |

All 3 high-priority zeros need **15–20 more diverse variants** — current 10–11 examples are likely too homogeneous for the model to generalize.

### Key Model History
| Version | Corpus | Macro F1 | FPR | Notes |
|---|---|---|---|---|
| v1278 | 1,278 | 0.27 | 95.7% | Baseline, heavily injection-biased |
| v7458 | 7,277 | 0.8448 | 15.7% | First gate pass |
| v11461 (v5/v7) | 11,461 | 0.9110 | 11.5% | Enterprise benign + MCP coverage |
| v16589 (v8) | 16,589 | 0.9608 | 3.69% | Gap archetypes + enterprise adversarial |
| **v18161 (v9)** | **18,161** | **0.9752** | **1.89%** | **Current — both SaaS quality targets met ✅** |

### Known Issues Fixed
- **INT8 quantization bug**: `QOperator avx512_vnni` mode corrupts DeBERTa-v3 relative position attention → F1 collapses 0.84→0.32. **Fixed**: fp16 ONNX export instead.
- **Corpus split-brain**: training data was split across public/private repos. **Fixed**: all corpus data now in private repo only.
- **INJECTION_DIRS missing `obfuscation_injection`**: M7 examples were silently skipped. **Fixed**.
- **`training_corpus/` path prefix not stripped**: labeling logic skipped all `training_corpus/category/...` files. **Fixed**.
- **`vuln_db.json` list-format pollution**: pattern-update skill was adding OSV list-format entries (inert, never matched). **Fixed**: skill now has explicit format guard.
- **ONNX export UnboundLocalError**: `_pathlib` used before `import pathlib as _pathlib` in same try block. **Fixed 2026-03-25** in `finetune_modal.py`.
- **CI test collection failure**: `test_corpus.py` importing `from skillscan.corpus import CorpusManager` but module didn't exist in installed package. **Fixed 2026-03-25**: bundled `_corpus_manager.py` + `corpus.py` shim.
- **Ruff lint failures (13 errors)**: E501 in `analysis.py`, F401/I001 in test files. **Fixed 2026-03-25**.

---

## Static Rules Summary (as of 2026-03-24)

**Total: 137 rules** (134 static + 15 chain + 17 multilang) + 5 graph stubs (PSV-001/002/003/004, GR-007)

Key rule prefixes: PINJ, EXF, SE, SUP, MAL, CHN, PSV, GR

Recent additions (M6 P1+P2, 2026-03-24):
- PINJ-008: YAML anchor/alias injection
- PINJ-009: Fake end-of-prompt dividers
- PINJ-010: Fake system headers
- PINJ-011: Tool alias injection
- PINJ-012: AGENT INSTRUCTION headers
- PINJ-013: Conditional time-lock patterns
- PINJ-014: Injection keywords in all frontmatter fields
- EXF-018: Error messages leaking system prompt
- EXF-019: Logging endpoints collecting conversation history
- SE-002: `~/.git-credentials` + send/upload
- SE-003: Prize/reward framing + API key requests
- SUP-018: `pip install` with suspicious package names

Chain rules (CHN-001/002/004/005) now have `window_lines: 40` per-rule override.

---

## Lint Rules Summary (as of 2026-03-24)

**Total: 34 lint rules** (QL-001 through QL-034)

Recent additions (M10.9, 2026-03-24):
- QL-026: Unknown frontmatter keys
- QL-027: Non-semver version strings
- QL-028: Vague tool references
- QL-029: Description implies undeclared tools
- QL-030: Bash/computer without justification
- QL-031: No changelog/updated field
- QL-032: No Inputs/Outputs section
- QL-033: No "When to Use" section
- QL-034: CLI tool references without Prerequisites

---

## ROADMAP Milestones (current state, 2026-03-25)

| Milestone | Status | Description |
|---|---|---|
| M1–M6 | **DONE** | Core scanner, 137 rules, CLI, CI, chain rules |
| M7 | **✅ DONE (2026-03-25)** | v9: macro F1=0.9752, FPR=1.89%, both SaaS quality targets met |
| M7.5 | **✅ DONE** | Enterprise benign corpus, FPR 11.5%→1.89% |
| M8 | **DONE** | PSV-001/002/003/004, GR-007 |
| M8 P2 (PSV-005) | Moved to M10.7 | Tool drift via `scan --baseline` |
| **M10.5** | **✅ DONE (2026-03-25)** | Model UX: `--no-model`, `--require-model`, passive warnings, TTY download prompt |
| **M10.7** | **✅ DONE (2026-03-25)** | CLI UX audit + command consolidation + PSV-005 |
| **M14.5** | **Unlocked** | Model details page on website (prerequisite M7 ≥0.95 met, M10.5 done) |
| M9 | Planned | VS Code/Zed/JetBrains extensions (blocked on Microsoft captcha) |
| M10 | **✅ DONE (2026-03-26)** | Documentation accuracy |
| M10.6 | Planned | Organic eval pipeline |
| M10.8 | **✅ DONE (2026-03-24)** | Attack-type hints on ML findings |
| M10.9 | **✅ DONE (2026-03-24)** | 9 new lint rules (QL-026 through QL-034) |
| M10.10 | **✅ DONE (2026-03-25)** | HuggingFace model card |
| M10.11 | Planned | License files across all repos |
| M10.12 | Planned | Formalized feedback mechanism (GitHub issue templates) |
| M5 (intel) | **DONE** | IOC DB 5,507 entries, vuln DB 63 packages |
| M11 | **✅ DONE (2026-03-26)** | Hardening & PyPI publish (v0.8.0, per-file timeout, schema sync, Apache-2.0) |
| M14.0 | **✅ DONE (2026-03-27)** | Unified skill index (skill-index.yaml, 19 demo_feed entries, 13 organic holdout) |
| M14 | **✅ DONE (2026-03-27)** | Public scan feed (demo-feed.yml weekly cron + build_demo_feed.py, Feed page live) |
| M15 | Planned | skillscan-core extraction |
| M17 | **❌ DROPPED** | Similarity hashing — requires running a registry; not aligned with offline-only positioning |

### Next Work Priorities (updated 2026-03-27)

**✅ M10.7: CLI UX Audit & Command Consolidation — COMPLETE (2026-03-25)**
- 8 commands removed, 12 added/changed
- 5 built-in policy profiles (strict, ci, balanced, permissive, enterprise, observe)
- Provenance meta block in all JSON scan reports by default
- 6 docs written: CLI_REFERENCE, custom-rules, custom-intel, custom-policy, benchmark-guide, suppression-format
- 351 tests passing, 0 failures
- Commit: `5635bbf` on `kurtpayne/skillscan-security`

**✅ M10.10: HuggingFace Model Card — COMPLETE (2026-03-25)**
- `MODEL_CARD.md` written and committed to `kurtpayne/skillscan-security` (commit `dba729f`)
- README.md pushed to `kurtpayne/skillscan-deberta-adapter` on HuggingFace Hub
- Covers: architecture (DeBERTa-v3 + LoRA r=64, ONNX FP32), training data (18,161 examples), eval results (F1 0.9752, FPR 1.89%), version history, 8 FN archetypes, how-to-use, two-layer detection architecture, citation block
- ROADMAP.md M14.5 section fully specced (commit `dba729f`)

**P1 — M14.5: Website Update (v1.0 docs + ML model + positioning)**
- Now unblocked. Full spec in ROADMAP.md M14.5 section.
- Homepage: add F1/FPR stats, offline-only positioning copy, two-layer how-it-works section
- New /model page: architecture, performance table, version history, limitations, FN archetypes, HF link
- Docs page: CLI reference, policy profiles, suppression, custom rules sections
- Examples page: group by attack category, add CI/CD snippet, suppression snippet
- Positioning copy: offline-only niche, enterprise trust signals (SARIF, provenance, policy profiles)
- After this milestone: Trace as a Service
- Project: `skillscan-website` at `/home/ubuntu/skillscan-website`

**P2 — M10.12: Feedback Mechanism**
- GitHub issue templates for FP/FN reports
- Link from website and CLI output

---

### Trace Strategy Decisions (locked 2026-03-27)

**Open source:** `skillscan-trace` will be made public. Detection methodology, canary tool surface, policy profiles — all open. Training corpus and fine-tuned model weights stay private (the defensible asset).

**BYOK only (no managed inference for now).** User provides their own API key. SkillScan never stores or transmits keys — they go directly to the chosen LLM provider for that invocation only. This must be stated prominently in PRIVACY.md and the README.

**OpenRouter support:** `--provider openrouter` shortcut + `OPENROUTER_API_KEY` env var. OpenRouter model names use `provider/model` format (e.g. `anthropic/claude-3-haiku`). Unlocks 200+ models through one key. Multi-model trace becomes trivial.

**Positioning:** Behavioral trace is a **publish-gate, not a commit-gate.** Static scanner (`skillscan`) is the commit-gate — fast, free, local, no key needed. Trace is the publish-gate — produces the signed report URL artifact that has value beyond the developer's machine.

**Hosted reporting infrastructure (deferred, Phase C):**
- Stack: **Fly.io Machines** (compute) + **Cloudflare R2** (report storage) + **Cloudflare Workers** (submission API + SHA-based cache lookup)
- Cost at 5k callsites × 1 publish/day: ~$20–25/month (vs ~$75/month on Lambda)
- Per-trace compute: ~$0.000132 on Fly shared-cpu-1x (4× cheaper than Lambda)
- R2 free tier covers ~10GB/month report storage (150k × 50KB = 7.5GB — right at boundary)
- SHA-based cache: reports keyed on `(skill_sha256, model_id)` — same skill+model never re-runs
- Rate limit as backstop: 10 new traces/IP/day, 50/GitHub user/day
- Free tier: public GitHub repos get free hosted scans (marketing flywheel)
- Paid tier: private/commercial repos, flat fee $3–5/report via Stripe Checkout, no account required
- Lambda is **disqualified** as primary (priced on wall-clock I/O wait, 4× more expensive)
- Vercel **borderline** (60s default timeout too tight for 3-variant trace with slow model)
- Cloudflare Workers **disqualified** (30s hard limit, V8 isolates won't run `mcp` SDK)
- Modal **disqualified for hosted** (per-second container pricing makes I/O-wait workloads expensive; keep for corpus batch only)

**Auth design (locked 2026-03-27):**
- Free OSS tier: URL-reachability check only. Submit `source_url` (public GitHub raw URL). Service fetches it; if 200 without auth, repo is public, trace is free. No account, no token, no OAuth.
- GitHub Action (public repo): GitHub OIDC token. Action requests OIDC token, includes in `Authorization: Bearer`. Service verifies against GitHub JWKS. No pre-registration, no stored secret.
- Self-hosted: `--remote-host https://my-host.corp.com` override. Enterprise runs the Docker image in their own VPC. Their code never leaves their network. This is the enterprise path — better sell than "send us your private code."
- Private repo scanning: **DROPPED.** Requires GitHub App installation or PAT (security liability). Enterprise path is self-hosted Docker image, not hosted scanning. Do not build until explicitly needed.
- Paid tier (Phase C, deferred): GitHub OAuth → opaque token (32-byte hex, stored in DB with owner/scope/rate_limit). No expiry. Revocation instant. Scoped to GitHub identity, not email.

**Docker image design (locked 2026-03-27):**
- Single image, two modes. A4 and the server mode are ONE milestone.
- `docker run skillscan/trace run ./skill.md --provider openrouter --api-key $KEY` — existing single-trace behavior, containerized.
- `docker run -p 8080:8080 skillscan/trace serve` — server mode: FastAPI wrapper (~150 lines) around the harness. Three endpoints: `POST /v1/submit`, `GET /v1/report/{id}`, `GET /v1/health`. Background thread per job. SQLite for single-instance; swap for Redis/Postgres at scale.
- Same image used for: Fly.io hosted service (serve mode) + enterprise self-hosting (serve mode) + local containerized runs (run mode).
- `--remote-host` in CLI points at any instance of this image.

**Trace Phase A (current — pre-public-release):**
- A1: Provider UX — `--provider openrouter/ollama/openai` shortcuts, env var auto-detection (`OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`)
- A2: Config system — three-tier YAML (CLI flags > trace-config.yml > defaults)
- A3: PRIVACY.md + README transparency section (keys never stored/transmitted by SkillScan except to chosen LLM provider)
- A4: Docker image with both `run` and `serve` modes (single image, prerequisite for Fly.io hosted service and self-hosting)
- A5: Bash AST upgrade (regex → bashlex, catches obfuscation)
- A6: Stale docs correction (ROADMAP says "spec only" — wrong, Phases 1–5 done, 144 tests pass)

**Trace Phase B (open-source launch):**
- B1: Make `skillscan-trace` repo public
- B2: Website /trace page (data flow diagram, provider guides, sample report, quick-start)
- B3: GitHub Action (`skillscan/trace-action` — OIDC-based for public repos, PR comment with report URL)
- B4: Multi-model trace (run against 2+ models via OpenRouter, report agreement/disagreement)
- B5: `--remote` flag in CLI + `source_url` URL-reachability verification on server side

**Trace Phase C (hosted reporting — deferred):**
- C1: Fly.io + R2 + Workers infrastructure (Fly Machines for compute, CF R2 for report storage, CF Workers for submission API + SHA cache)
- C2: BYOK hosted reports, free for public OSS repos (URL-reachability check, no account)
- C3: GitHub OIDC verification for Action (public repo free tier)
- C4: GitHub OAuth + opaque tokens for paid private-repo tier (after C2 has demand data)
- C5: Managed inference / paid tier (after C4 has demand data)

---

## Organic Eval Pipeline

The `skillscan-pattern-update` skill writes new attack patterns to `~/skillscan-corpus/held_out_eval/organic/` (eval-only, never training data). Promotion tracking: `~/skillscan-corpus/held_out_eval/PROMOTION_CANDIDATES.md`.

---

## Secrets Self-Recovery

The secrets file (`~/.skillscan-secrets`) is encrypted and stored in the private website repo. If the sandbox is reset and the file is missing, recover it with:

```bash
# Decrypt and restore (uses OWNER_OPEN_ID from the injected Manus environment)
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 \
  -in /home/ubuntu/skillscan-website/private-docs/.secrets.enc \
  -pass env:OWNER_OPEN_ID \
  > ~/.skillscan-secrets && chmod 600 ~/.skillscan-secrets
source ~/.skillscan-secrets
```

If the repo is not yet cloned:
```bash
gh repo clone kurtpayne/skillscan-website /home/ubuntu/skillscan-website
```

**Encryption details:**
- Algorithm: AES-256-CBC, PBKDF2, 600,000 iterations
- Passphrase: `$OWNER_OPEN_ID` (injected automatically by Manus into every session)
- Encrypted file: `private-docs/.secrets.enc` in `kurtpayne/skillscan-website` (private repo)

**Secrets stored (key names):**
- `GITHUB_PAT` — GitHub personal access token (repo read/write)
- `OPENAI_API_KEY` — OpenAI API key
- `ANTHROPIC_API_KEY` — Anthropic API key
- `HF_TOKEN` — HuggingFace token (for model pushes)
- `MODAL_TOKEN_ID` + `MODAL_TOKEN_SECRET` — Modal Labs (corpus fine-tune)
- `DOCKER_USERNAME` + `DOCKER_TOKEN` — Docker Hub (for image pushes)

**To re-encrypt after updating secrets:**
```bash
openssl enc -aes-256-cbc -pbkdf2 -iter 600000 \
  -in ~/.skillscan-secrets \
  -out /home/ubuntu/skillscan-website/private-docs/.secrets.enc \
  -pass env:OWNER_OPEN_ID
cd /home/ubuntu/skillscan-website && git add private-docs/.secrets.enc && \
  git commit -m "chore: refresh encrypted secrets" && git push github HEAD:main
```

---

## Fine-Tune Trigger

```bash
source ~/.skillscan-secrets && unset GH_TOKEN
cd ~/skillscan-corpus
modal run scripts/finetune_modal.py --force   # bypass delta threshold
modal run scripts/finetune_modal.py --dry-run  # stats only
```

Or via GitHub Actions:
```bash
gh workflow run corpus-sync.yml -R kurtpayne/skillscan-security -f force_retrain=true
```

Corpus-sync workflow inputs: `force_retrain` (string "true"/"false") — note: NOT `force`, that's wrong.

---

## Pattern-Update Skill Repo Targeting Rules

**IMPORTANT** — the pattern-update skill (`~/skills/skillscan-pattern-update/SKILL.md`) has been updated with explicit repo targeting rules:
1. `corpus-sync.yml` stays in skillscan-security (public) — do NOT move it
2. `vuln_db.json` must use dict-format only — never OSV list format
3. Real malicious files found during threat research → `training_corpus/malicious/` in skillscan-corpus
4. Synthetic examples generated during rule authoring → do NOT go in training_corpus/malicious/
5. Organic eval holdouts → `held_out_eval/organic/` in skillscan-corpus

---

## Key Files to Know

| File | Purpose |
|---|---|
| `~/.skillscan-secrets` | All API keys and tokens |
| `~/skillscan-corpus/scripts/finetune_modal.py` | Fine-tune pipeline (source of truth) |
| `~/skillscan-corpus/manifest.json` | Corpus metadata + last archetype F1 scores |
| `/home/ubuntu/skillscan-security/docs/MODEL_METRICS.md` | Model performance history |
| `/home/ubuntu/skillscan-security/ROADMAP.md` | Project roadmap |
| `~/skills/skillscan-pattern-update/SKILL.md` | Pattern update skill (has repo targeting rules) |
| `~/skills/skillscan-intel-update/SKILL.md` | Intel DB update skill |
| `~/skillscan-security/src/skillscan/data/rules/default.yaml` | All 137 static rules |
| `~/.skillscan/rules/default.yaml` | User rules dir (must be kept in sync with bundled) |

---
## CRITICAL: How the Installed Package Resolves (Editable Install)

**The installed `skillscan` package always resolves to `/home/ubuntu/skillscan-security/src/`, NOT `/tmp/sec-fix/src/` or any other working copy.**

The editable install (`pip install -e .`) was run from `~/skillscan-security`. This means:
- `import skillscan.rules` → `/home/ubuntu/skillscan-security/src/skillscan/rules.py`
- `importlib.resources.files('skillscan.data.rules')` → `/home/ubuntu/skillscan-security/src/skillscan/data/rules/`
- Running `pytest tests/` without `PYTHONPATH=src` uses the **home repo source**, not the working copy

**Workflow when fixing bugs in a working copy (e.g. /tmp/sec-fix):**
1. Make changes in the working copy `src/`
2. Sync changed files to the home repo: `git diff --name-only origin/main | grep "^src/" | while read f; do cp "$f" "/home/ubuntu/skillscan-security/$f"; done`
3. Sync user-local rules: `cp ~/skillscan-security/src/skillscan/data/rules/default.yaml ~/.skillscan/rules/default.yaml`
4. Run tests WITHOUT `PYTHONPATH=src` to match CI: `cd /tmp/sec-fix && python3 -m pytest tests/ -q`
5. Commit from the working copy and push

**The `~/.skillscan/rules/default.yaml` user-local file overrides bundled rules** (last-writer-wins in `_merge_rulepacks`). Always keep it in sync with the bundled rules after any `default.yaml` change.

---
## CRITICAL: Multi-line Pattern Matching in the Scanner

**The scanner tests rules line-by-line by default.** In `analysis.py`:
```python
for line_no, line in enumerate(analysis_text.splitlines(), 1):
    if rule.pattern.search(line):
```

Patterns using `[\s\S]` or `(?s)`/`(?is)` flags require multi-line text — they will NEVER fire in line-by-line mode even if the file content is correct.

**The fix:** `StaticRule` and `CompiledStaticRule` have a `multiline: bool = False` field. Set `multiline: true` in `default.yaml` for any rule whose pattern contains `[\s\S]` or inline `(?s)`. The scanner uses full-text matching for those rules.

**Rules currently requiring `multiline: true`:** MAL-008, SUP-009, EXF-013, MAL-015, MAL-017, ABU-004, MAL-023, MAL-024

When adding new rules: if the pattern contains `[\s\S]` or `(?s)`, you MUST add `multiline: true` or it will silently never fire in CI.

---
## CRITICAL: Test Isolation — lru_cache Poisoning

`load_compiled_builtin_rulepack` uses `@lru_cache(maxsize=3)`. Stale cache from earlier tests causes later tests to get wrong rules. The `tests/conftest.py` autouse fixture clears it before and after each test. Do not remove this fixture.

---
## CRITICAL: Pattern Update Skill CI Gate

Before opening any PR from the pattern-update skill:
1. Sync source files to home repo (see above)
2. Run `pytest tests/ -q` — must be green
3. For every new showcase: run `skillscan scan <showcase_dir> --policy-profile strict` and confirm expected rule IDs appear
4. Only then open the PR

Failure to do this caused the 8-hour CI debugging session on 2026-03-27.

---
## CRITICAL: Cisco Recall CI Job — bash -e Exit Code

`skillscan scan` exits 1 when verdict is BLOCK. Under `bash -e` this aborts the script. All scan calls in CI use `|| true`:
```bash
OUTPUT=$(skillscan scan "$FIXTURE" --policy-profile strict 2>&1) || true
```
