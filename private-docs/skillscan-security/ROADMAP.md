# SkillScan Roadmap

> **Last updated:** 2026-03-28
> **Version:** 0.3.3
>
> SkillScan was designed and directed by Kurt Payne and built with [Manus](https://manus.im).

---

## Product Direction

SkillScan is an **offline, privacy-first security scanner for AI agent skill files**. It ships as a CLI, a Docker image, and editor extensions. It runs entirely on the developer's machine — no network calls, no telemetry, no API keys required.

The two user-facing products are:

- **`skillscan`** — security scanner. Detects malicious intent, prompt injection, exfiltration channels, supply chain risks, and social engineering in SKILL.md files. Eight detection layers: static rules, chain rules, AST data-flow analysis, ML classifier, IOC/vuln DB, semantic classifier, skill graph, and permission scope validation.
- **`skillscan-lint`** — quality linter. Checks SKILL.md files for LLM-effectiveness issues: missing front-matter, ambiguous instructions, over-broad tool declarations, and schema violations.

These two tools are the product. The behavioral tracer (`skillscan-trace`) and training corpus (`skillscan-corpus`) are private infrastructure that improve the ML model and validate detection rules. They do not ship to users and are not part of the public roadmap.

**SaaS scanner** (token-gated hosted scanning with permanent report URLs) is a future phase. It is not on the active roadmap. The prerequisite is a false positive rate below 2% on benign skills and a detection rate above 85% on the malicious corpus. The current ML model (v9, macro F1 0.9752, FPR 1.89%) has now crossed both SaaS quality thresholds (F1 ≥ 0.97 ✅, FPR ≤ 2% ✅). The remaining SaaS prerequisites are product-completeness items: M10.x CLI polish, M14.5 website model page, and HuggingFace model card. The SaaS design is documented in `skillscan-trace/ROADMAP.md` Phase 3 for reference when the time comes.

---

## Current State (2026-03-25)

### What is working and shipped

| Component | Status | Notes |
|---|---|---|
| Static rules | **137 rules** (134 static + 15 chain + 17 multilang) | `default.yaml`, `multilang.yaml` (PINJ-008–014, EXF-018/019, SE-002/003, SUP-018, PSV-001–004, GR-007 added) |
| AST data-flow analysis | **Complete** | `detectors/ast_flows.py` — secret→decode→exec/network flows |
| Skill graph / PSV | **Complete** | `detectors/skill_graph.py` — PSV-001/002/003/004 + GR-007 cycle detection |
| ML classifier | **v9, macro F1 0.9752** | DeBERTa-v3-base + LoRA, FP32 ONNX (~350 MB), HuggingFace Hub (`18161-5ep`) |
| IOC DB | **5,507 entries** (bundled) | 3,955 domains, 8 IPs, 1,538 CIDRs, 3 URLs; runtime feeds via `managed_sources.json` |
| Vuln DB | **63 packages** | 47 Python + 16 npm |
| Semantic classifier | **Complete** | `semantic_local.py` — offline stem-and-score, no network |
| `skillscan diff` | **Complete** | Instruction-level diff with security-relevant change flagging |
| SARIF / JUnit / CycloneDX output | **Complete** | CI-ready output formats |
| Docker image | **Complete** | Multi-arch, published to Docker Hub |
| GitHub Actions integration | **Complete** | `integrations/github-actions/` |
| VS Code extension | **Scaffolded, not published** | Blocked by Microsoft account registration issue |
| `skillscan-lint` | **Complete, 34 rules** | SARIF output, schema validation, front-matter checks (QL-026–034 added) |
| Skill fuzzer | **Complete** | `tools/skill-fuzzer/` — 5 mutation strategies, evasion rate reporting |
| Test suite | **300 test functions** across 30 files | |
| Showcase examples | **119 examples** covering all rule categories | |

### ML model state

Model history (all runs that passed the F1 gate):

| Metric | v7458 (2026-03-22) | v11461 (2026-03-24) | v16589 (2026-03-25) | **v18161 (2026-03-25)** | Target (v1.0) |
|---|---|---|---|---|---|
| Training corpus | 7,277 | 11,461 | 16,589 | **18,161** (v9) → **18,216** (current) | 25,000+ |
| Eval set | 181 | 201 | 444 | **444** | 500+ |
| Macro F1 | 0.8448 | 0.9110 | 0.9608 | **0.9752** | **≥ 0.97 ✅** |
| Benign F1 | 0.9040 | 0.9317 | 0.9781 | **—** | ≥ 0.99 |
| Injection F1 | 0.7857 | 0.8903 | 0.9435 | **—** | ≥ 0.97 |
| FPR | 15.7% | 11.45% | 3.69% | **1.89%** | **≤ 2% ✅** |
| Enterprise benign FPR | — | 11.45% | 3.69% | **1.89%** | ≤ 2% ✅ |

v9 improvements over v8: macro F1 +1.44pp (0.9608 → 0.9752), FPR halved (3.69% → 1.89%). Both SaaS quality targets now met. ONNX confirmed as FP32 — FP16 conversion produces no size reduction for DeBERTa-v3; INT8 causes F1 collapse. 8 persistent FN archetypes remain for v10 corpus work.

### Open gaps

Updated 2026-03-25 after v9 fine-tune (macro F1=0.9752, FPR=1.89%). Full analysis: `docs/GAP_ANALYSIS.md`.

| Gap | Severity | Milestone |
|---|---|---|
| ~~8 injection FN archetypes (jb07, jb08, mcp_impersonation, pi21, pi24, pi61, se_git, organic)~~ | ~~High~~ | ✅ M7 |
| 8 persistent FN archetypes (mcp_imp, org_mal047, se_git, jb07/08 variants, jb09/10, pi24_rss, pi37) | **Medium** | M7-v9 |
| ~~5 P1 YAML rules missing (PINJ-008/009/010/012, SE-003)~~ | ~~High~~ | ✅ M6 |
| ~~6 P2 YAML/graph rules missing (PINJ-011/013/014, EXF-018/019, SE-002)~~ | ~~High~~ | ✅ M6 |
| ~~PSV-004 unknown frontmatter keys not flagged~~ | ~~Medium~~ | ✅ M8 |
| ~~GR-007 circular dependency detection missing~~ | ~~Medium~~ | ✅ M8 |
| ~~PSV-005 tool drift detection missing~~ | ~~Medium~~ | ✅ M10.7 |
| ~~SUP-018 pip install in skill body not flagged~~ | ~~Medium~~ | ✅ M6 |
| ~~9 lint rules missing (QL-026 through QL-034)~~ | ~~Medium~~ | ✅ M10.9 |
| ~~Chain rule proximity window missing~~ | ~~Medium~~ | ✅ M6 |
| ~~PSV rules not wired through rule YAML~~ | ~~Medium~~ | ✅ M8 |
| ~~Vuln DB thin (78 packages, target 150+)~~ | ~~Low~~ | ✅ M5 |
| ~~IOC DB bundled only 2,051 entries~~ | ~~Low~~ | ✅ M5 |
| VS Code extension unpublished | **Low** | M9 |
| ~~`exfil_channels.yaml` not merged into `default.yaml`~~ | ~~Low~~ | ✅ M6 |
| ~~`docs/RELEASE_ONBOARDING.md` stale~~ | ~~Low~~ | ✅ M10 |
| ~~`docs/PROMPT_INJECTION_CORPUS.md` references non-existent script~~ | ~~Low~~ | ✅ M10 |
| No warning when ML model is not installed | **Low** | M10.5 |

---

## Design Principle: The Static Analysis Ceiling

Static offline analysis has a hard ceiling. Almost all of the highest-value gaps — runtime behavior prediction, indirect injection from external content fetched at runtime, temporal and conditional payloads, MCP server infrastructure trust — require dynamic execution or infrastructure-level signals. These are not gaps we can close with better regex or a larger corpus.

**This is a feature, not a limitation.** The offline/private/deterministic positioning is the reason teams trust SkillScan in security-sensitive environments. We own the offline trust layer completely and are honest about where dynamic analysis begins.

The one exception is `skillscan-trace` (private): a local execution harness that runs a skill through an instrumented agent environment. The user supplies model credentials; we supply the canary environment and detection layer. This stays within the offline/private paradigm and remains private infrastructure.

---

## Milestone 5 — Intel & Vuln DB Depth ✅ Complete (2026-03-24)

**Goal:** Make the IOC and vuln DBs credible enough that a security team trusts them.

The bundled IOC DB has 2,051 entries. The runtime feed integration works but is not tested in CI. The vuln DB has 35 packages — thin for a tool claiming supply chain coverage.

**IOC DB actions:**
- Expand the bundled IOC DB to 5,000+ entries by seeding from Abuse.ch URLhaus (hosts only), Feodo Tracker, and Spamhaus DROP/EDROP. The `intel_update.py` script already supports these sources.
- Add at least 10 hand-curated campaign IOCs from recent MCP-related threat intel (the 2026-03-21 PATTERN_UPDATES.md entries are candidates).
- Add a CI test validating bundled DB has ≥ 5,000 entries and all entries parse correctly.

**Vuln DB actions:**
- Add the top 15 most-referenced Python packages from the GitHub skills corpus that have known CVEs: `requests`, `urllib3`, `cryptography`, `paramiko`, `pillow`, `aiohttp`, `httpx`, `boto3`, `sqlalchemy`, `django`, `flask`, `fastapi`, `celery`, `redis`, `pymongo`.
- Add the top 10 npm packages: `axios`, `express`, `node-fetch`, `got`, `superagent`, `ws`, `socket.io`, `jsonwebtoken`, `bcrypt`, `multer`.
- Source from OSV.dev API (already integrated in `intel_update.py`).

**Acceptance criteria:** Bundled IOC DB ≥ 5,000 entries. Vuln DB ≥ 50 packages. CI gate validates both counts. No regression in false positive rate on the benign showcase examples.

---

## Milestone 6 — Chain Rule Precision ✅ Complete (2026-03-24)

**Goal:** Reduce false positives from chain rules on large, legitimate SKILL.md files.

The current chain rules (CHN-001 through CHN-014) match patterns anywhere in the document. A 2,000-line SKILL.md that mentions both "read credentials" and "http request" in unrelated sections will trigger CHN-001 even if the two patterns are 1,500 lines apart. The fix is a proximity window.

**Actions:**
- Add a `window_lines` field to chain rule definitions in `default.yaml`. Default: `null` (current whole-document behavior). Set `window_lines: 40` on CHN-001, CHN-002, CHN-004, CHN-005 as the highest false-positive rules.
- Update `rules.py` to enforce the window when `window_lines` is set.
- Add metadata blocks to all 15 chain rules (currently only static rules have metadata guards).
- Migrate `exfil_channels.yaml` (EXF-002, CHN-003) into `default.yaml` and delete the satellite file.
- **[GAP P1]** Add `PINJ-008` — YAML anchor/alias injection in frontmatter (`&override` + `*override` in non-standard fields). Severity: HIGH.
- **[GAP P1]** Add `PINJ-009` — Fake end-of-prompt dividers (`---END OF SYSTEM PROMPT---`, `[END OF INSTRUCTIONS]`) followed by role markers. Severity: HIGH.
- **[GAP P1]** Add `PINJ-010` — Fake system header at the very start of a skill file before frontmatter (`SYSTEM:`, `[SYSTEM]`). Severity: HIGH.
- **[GAP P1]** Add `PINJ-012` — `AGENT INSTRUCTION` or `AI AGENT INSTRUCTION` headers anywhere in the skill body. Severity: CRITICAL.
- **[GAP P1]** Add `SE-003` — Prize/reward/winner framing combined with requests for API keys, account IDs, or credentials. Severity: CRITICAL.
- **[GAP P2]** Add `PINJ-011` — Tool alias injection (`safe_exec → Bash`, `w+ maps to w+`). Severity: HIGH.
- **[GAP P2]** Add `PINJ-013` — Conditional time-lock patterns (date/time condition + instruction-override language). Severity: HIGH.
- **[GAP P2]** Add `PINJ-014` — Scan all string-type frontmatter fields (not just `description`) for injection keywords. Severity: HIGH.
- **[GAP P2]** Add `EXF-018` — Error messages instructed to include `system prompt`, `conversation history`, or `full context`. Severity: HIGH.
- **[GAP P2]** Add `EXF-019` — Skills that configure logging/audit endpoints collecting conversation history or environment metadata. Severity: HIGH.
- **[GAP P2]** Add `SE-002` — Instructions to read `~/.gitconfig` or `~/.git-credentials` combined with any send/upload/audit instruction. Severity: HIGH.
- **[GAP P3]** Add `SUP-018` — `pip install` in skill bodies referencing non-standard package names pinned to specific versions. Severity: MEDIUM.

**Acceptance criteria:** CHN-001/002/004/005 false positive rate on the 104 benign showcase examples drops to zero. All chain rules have metadata blocks. `exfil_channels.yaml` is deleted. All P1 YAML rules (PINJ-008/009/010/012, SE-003) implemented with showcase examples.

---

## ~~Milestone 7 — ML Model Quality: Injection Recall~~ ✅ COMPLETE (2026-03-25)

**Goal:** Push macro F1 from 0.911 to ≥ 0.95, closing the remaining gap on indirect injection, jailbreak variants, and social engineering attacks.

**v8 result (2026-03-25):** macro F1=**0.9608**, FPR=**3.69%**, injection F1=**0.9435**. F1 gate 0.92 PASSED. 6 of 9 targeted zero-recall archetypes resolved. `MODEL_METRICS.md` updated.

**Completed actions:**
- ✅ 91 gap archetype examples (jb07, jb08, mcp_imp, org_mal047, org_sup017, pi21, pi24, pi61, se_git — 10–11 each)
- ✅ 69 adversarial enterprise examples (ent_cred_exfil ×12, ent_ep_redirect ×16, ent_tool_alias ×12, ent_supply_chain ×17, ent_indirect_inj ×12)
- ✅ 120 backtranslation augments
- ✅ 218 reserved eval examples (held_out_eval/ expanded to 444 total)
- ✅ v8 fine-tune triggered and completed (corpus: 16,589 examples)
- ✅ `docs/MODEL_METRICS.md` updated with v8 results
- ✅ ONNX export bug fixed (`finetune_modal.py` Python scoping error); re-run triggered 2026-03-25

**Resolved archetypes (6/9):** jb07 ✅, jb08 ✅ (2/3), organic_sup017 ✅, pi21 ✅, pi24 ✅ (5/6), pi61 ✅

**Remaining FN archetypes (8 for v9):** mcp_server_impersonation, organic_mal047, se_git_config_harvest, jb_jb07_035, jb_jb08_037, jb09/jb10 (new), pi24_rss, pi37_markdown.

**Acceptance criteria:** ✅ Macro F1 ≥ 0.95 (actual: 0.9608). ✅ FPR ≤ 6% (actual: 3.69%). ✅ `MODEL_METRICS.md` current.

---

## Milestone 7.5 — Enterprise Benign Corpus: Corporate Workflows & Runbooks

**Goal:** Eliminate false positives on legitimate enterprise skill files that use credential-referencing, internal endpoint, and authentication patterns.

Live inference testing (2026-03-24) revealed that the v5 model flags 6 out of 9 benign enterprise jargon examples as injection. The jargon vocabulary itself (`Toolzilla`, `Artemis`, `Blorb`, etc.) is handled correctly — the model generalizes to unknown names fine. The problem is **semantic patterns** that appear in both benign enterprise workflows and real attacks:

| Trigger pattern | Benign context | Attack context |
|---|---|---|
| `"send results to [endpoint]"` | Internal reporting API call | Exfiltration channel |
| `"your API key is stored in [vault]"` | Operational credential retrieval | Credential harvesting setup |
| `"authenticate using your [badge/token]"` | SSO / MFA workflow | Social engineering pretext |
| `"sampling/createMessage"` | Legitimate MCP delegation | MCP sampling exfil |
| `"never include credentials"` | Explicit security guardrail | (Ironically triggers the model) |

Enterprise customers scanning internal skill libraries — runbooks, deployment scripts, auth helpers, incident response procedures — will encounter significant false positive noise from these patterns.

**Actions:**
- Add 20–30 benign training examples covering **credential-referencing operational patterns**: vault retrieval, config file reads, API key rotation, token refresh workflows. Emphasize that the credential is being *used for a legitimate purpose*, not exfiltrated.
- Add 20–30 benign training examples covering **internal endpoint patterns**: sending results to `corp.internal` APIs, posting to internal Slack/Teams webhooks, writing to internal dashboards, logging to internal SIEM.
- Add 20–30 benign training examples covering **enterprise authentication workflows**: SSO login, badge-based auth, MFA setup, bastion host access, jump server patterns, service account usage.
- Add 10–15 benign training examples covering **runbook-style multi-step procedures**: incident response runbooks, deployment checklists, on-call procedures, change management workflows.
- Add 5 held-out eval examples for each of the 4 pattern categories (20 new benign eval examples total) to track FP rate on enterprise patterns specifically.
- Save all examples to `training_corpus/benign/benign/` with prefix `benign_enterprise_`.

**Why this is a separate milestone from M7:** M7 is about injection recall (catching attacks). M7.5 is about benign precision (not crying wolf on legitimate enterprise skills). They require different corpus additions and can be worked in parallel. Both feed the same training run.

**Status (2026-03-24): COMPLETE.** All 20 enterprise benign eval examples score SAFE (100%). FPR dropped to 7.38%. Corpus researcher agent harvested 389 vendor skill files (Azure, AWS, Composio, ServiceNow) and runs daily at 02:00 UTC.

**Remaining work for v8:**
- Add malicious enterprise skill variants (see M7 above for details).
- Add 10 more enterprise benign eval examples covering compound patterns: multi-step runbooks, CI/CD pipeline skills, infrastructure-as-code helpers.

**Acceptance criteria:** All 30 enterprise benign eval examples score SAFE. 50–80 adversarial enterprise injection examples score INJECTION. FPR ≤ 5%.

---

## Milestone 8 — Skill Graph / PSV Rule Wiring

**Goal:** Make PSV rules first-class citizens surfaced through the standard rule YAML path.

PSV-001/002/003 are implemented in `detectors/skill_graph.py` but have no entries in `default.yaml`. This means they do not appear in `skillscan rule list` output and cannot be suppressed via `--suppress-rule`.

**Actions:**
- Add PSV-001, PSV-002, PSV-003 stubs to `default.yaml` with full metadata (description, severity, references, techniques).
- Ensure `skillscan rule list` shows PSV rules.
- Ensure PSV findings can be suppressed via `--suppress-rule PSV-001`.
- Add 5 showcase examples for PSV rules.
- **[GAP P2]** Add `PSV-004` — flag unknown frontmatter keys not in the standard schema. Catches `system_override`, `behavior`, `activation` injection vectors. Severity: WARNING.
- **[GAP P2]** Add `GR-007` — detect cycles in the skill invocation graph using DFS. Severity: ERROR.
- **[GAP P4]** Add `GR-008` — warn when a skill invokes another skill without a version constraint. Severity: WARNING.
- **[GAP P4]** Add `PSV-005` — detect tool set expansion between skill versions (surfaced from `skillscan diff`). Severity: HIGH.

**Acceptance criteria:** `skillscan rule list` shows PSV-001/002/003/004. PSV findings appear in SARIF output. Suppression works. GR-007 detects circular dependencies. 8 new showcase examples pass.

---

## Milestone 9 — Editor Extensions: Zed and JetBrains

**Goal:** Publish working editor extensions for Zed and JetBrains IDEs.

The VS Code extension is scaffolded but blocked by Microsoft's account registration process. Zed and JetBrains are the active targets. Both support LSP-based diagnostics — the extension is a thin wrapper that runs `skillscan --format sarif` and maps findings to editor diagnostics.

**Actions:**
- Implement Zed extension using Zed's extension API (Rust-based, published to the Zed extension registry).
- Implement JetBrains plugin using the IntelliJ Platform SDK (Kotlin, published to JetBrains Marketplace).
- Both extensions surface `skillscan` and `skillscan-lint` findings as inline diagnostics with severity levels.
- Add installation instructions to `docs/DISTRIBUTION.md`.

**Acceptance criteria:** Both extensions installable from their respective registries. Findings appear inline in the editor. At least one screenshot in the README.

---

## ~~Milestone 10 — Documentation Accuracy~~ ✅ COMPLETE (2026-03-26)

**Goal:** Ensure all docs reflect current state. No stale metrics, no references to non-existent files.

**Actions:**
- Update `docs/MODEL_METRICS.md` with v7458 results and the full comparison table.
- Update `docs/DETECTION_MODEL.md` Layer 7 (ML) with current model architecture and performance.
- Add a "What SkillScan does not detect" section to `docs/DETECTION_MODEL.md`.
- Condense `docs/RELEASE_ONBOARDING.md` into `docs/RELEASE_CHECKLIST.md` and delete it.
- Resolve the `docs/PROMPT_INJECTION_CORPUS.md` reference to a non-existent script (delete or fix).

**Acceptance criteria:** All docs reflect current state. No references to non-existent files or scripts. `skillscan --version` output matches `pyproject.toml`.

---

## Milestone 10.5 — Model UX: Missing-Model Detection & Guided Download

**Goal:** Give users a clear, actionable error when the ML model is not installed, instead of a silent failure or cryptic traceback.

Currently, if a user runs `skillscan` without having run `skillscan model sync`, the ML detector silently falls back to rule-only mode with no indication that the model layer is inactive. Users have no way to know they are getting reduced injection recall.

**Actions:**
- In `ml_detector.py`, detect the missing-model case at startup and emit a structured warning: `[WARN] ML model not installed — injection recall is reduced. Run: skillscan model sync`.
- In the CLI (`cli.py`), intercept the missing-model warning and offer an interactive prompt when running in a TTY: `ML model not found. Download now? [Y/n]`. If the user confirms, invoke `skillscan model sync` inline before proceeding with the scan.
- Add a `--no-model` flag to explicitly opt out of the model layer and suppress the warning (useful in CI environments where the model is intentionally excluded to save disk space).
- Add a `--require-model` flag that exits with a non-zero code if the model is not installed (useful for gating CI jobs on full-fidelity scans).
- Ensure `skillscan model sync` prints the model version, size, and a brief description of what it enables after a successful download.
- Add a test in `tests/test_ml_detector.py` that asserts the correct warning is emitted when the model directory is absent.

**Acceptance criteria:** Running `skillscan scan <path>` without a model installed prints the warning and offers the interactive download prompt (TTY only). `--no-model` suppresses the warning. `--require-model` exits non-zero when the model is absent. `skillscan model sync` output is informative.

---

## ~~Milestone 10.6 — Organic Eval Pipeline & Corpus Commit Policy~~ ✅ COMPLETE (2026-03-26)

**Goal:** Establish a closed feedback loop between the pattern update agent and the ML model, ensuring every new attack pattern discovered in the wild is immediately tested against the model and tracked as a known gap if missed.

**Background:** The pattern update skill discovers real-world threats on a schedule. Previously, new patterns were added directly to the training corpus, which contaminates the held-out eval set and makes F1 scores unreliable. The correct architecture:

1. New patterns land in `held_out_eval/organic/` in `kurtpayne/skillscan-corpus` (eval-only, never training data)
2. CI runs the held-out eval after each fine-tune, reporting hand-crafted vs organic breakdown
3. If the model misses an organic example (FN), a GitHub issue is opened automatically in `skillscan-security`
4. After a fine-tune that correctly classifies the example, it is *promoted* to the training corpus and removed from eval

**Status as of 2026-03-23:**
- ✅ `skillscan-pattern-update` skill updated to write organic eval examples to `held_out_eval/organic/` and commit to private corpus repo
- ✅ `corpus/` gitignored in `skillscan-security` — cannot be re-added accidentally
- ✅ Corpus commit policy documented: all training data lives in `kurtpayne/skillscan-corpus` (private)

**Remaining actions:**
- Create `held_out_eval/organic/` directory in `kurtpayne/skillscan-corpus` with a `README.md` explaining the promotion workflow.
- Create `PROMOTION_CANDIDATES.md` in `kurtpayne/skillscan-corpus` to track examples ready for promotion.
- Update `finetune_modal.py` to include `held_out_eval/organic/` in the held-out eval run and report per-source breakdown.
- Add a post-eval step in `finetune_modal.py`: if any organic example is a FN, open a GitHub issue in `skillscan-security` titled `[ML Regression] Model misses organic pattern: {pattern_id}`.

**Acceptance criteria:** Pattern update skill writes organic eval examples and commits. Post-eval step opens GitHub issues for FN organic examples. `PROMOTION_CANDIDATES.md` is maintained. `corpus/` cannot be re-added to the public repo.

---

## ~~Milestone 10.7 — CLI UX Audit & Command Consolidation~~ ✅ COMPLETE (2026-03-26)
**Status (2026-03-26): COMPLETE.** All 8 commands removed, 12 added/changed. Five built-in policy profiles shipped. Provenance `meta` block present in all scan reports. All six docs files written. 351 tests passing. PSV-005 tool-drift detection live via `scan --baseline`.

**Goal:** Reduce user friction by rationalising the CLI surface into a coherent, discoverable set of commands. No backward-compat ceremony — the user base is small, move fast.

**Decisions locked 2026-03-25 (see `docs/CLI_REFERENCE.md` proposal for full detail):**

### Commands removed

| Removed | Reason |
|---|---|
| `diff` (report comparison) | Teams do their own JSON diffing; no clear job-to-be-done |
| `skill-diff` | Replaced by `scan --baseline <prev-report.json>` |
| `rule sync` | Replaced by `skillscan update` |
| `intel sync` | Replaced by `skillscan update` |
| `model sync` | Renamed to `model install` |
| `intel rebuild` | Merge happens at scan load time; no pre-build needed |
| `suppress add` | Format is simple YAML; document it instead |
| `corpus` (all subcommands) | Internal training plumbing; not user-facing |

### Commands added / changed

| Command | Notes |
|---|---|
| `skillscan update [--no-model]` | Always pulls fresh (no TTL). Runs rule + intel + model install in order. Auto-rebuilds merged intel DB. |
| `skillscan scan --baseline <report.json>` | Shows only findings new since the baseline report |
| `skillscan scan --no-provenance` | Provenance block (`meta:`) is included by default; this flag suppresses it |
| `skillscan scan --no-suppress` | Disables auto-discovery of `.skillscan-suppressions.yaml` in the scan target |
| `skillscan model install [--repo R] [--force]` | Replaces `model sync`; `--repo` for custom/private model forks |
| `skillscan model status` | Shows installed version, HF Hub latest, whether update is available |
| `skillscan intel add --url <feed-url>` | URL-based IOC/vuln feed sources; re-fetched on every `update` |
| `skillscan intel lookup <indicator>` | Point lookup against merged DB; shows which source it came from |
| `skillscan policy list` | Lists all built-in profiles with one-line descriptions |
| `skillscan rule test <rule-file> <skill-file>` | Test a custom rule before adding it; shows matched lines |
| `skillscan benchmark --verbose` | Per-case results (pass/fail, expected/actual, rules fired) |
| `suppress check` | Only remaining `suppress` subcommand; CI gate for expired entries |

### Built-in policy profiles (shipped as inspectable YAML in `data/policies/`)

| Profile | Blocks on | ML required | Use case |
|---|---|---|---|
| `strict` | score ≥ 70, all categories | No | Default. Maximum coverage. |
| `ci` | CRITICAL + HIGH only | No | PR gates. Low noise. |
| `permissive` | score ≥ 90, CRITICAL only | No | Trusted internal registries. |
| `enterprise` | score ≥ 70, all categories | Yes (required) | Formal security gate with ML. |
| `observe` | nothing (exit 0 always) | No | Day-one adoption, third-party audits. Prints banner reminding users to switch to enforcement mode. |

### Suppression model

Suppression files (`.skillscan-suppressions.yaml`) live in the skill repo, co-located with skills, owned by skill authors, reviewed in PRs. Auto-discovered from the scan target directory. Inline suppression comments (`# skillscan: suppress PINJ-009 reason="..." expires="2026-06-01"`) also supported. `suppress add` removed — format is documented in `docs/suppression-format.md`.

### Provenance in scan reports

Every scan report JSON includes a `meta` block by default:
```json
"meta": {
  "skillscan_version": "0.9.2",
  "rules_version": "2026-03-25",
  "rules_sha": "b7d2e44",
  "ioc_db_version": "2026-03-25",
  "vuln_db_version": "2026-03-25",
  "model_version": "v18161-5ep",
  "policy_profile": "ci",
  "policy_sha": "a3f9c12",
  "scanned_at": "2026-03-25T10:31:00Z"
}
```
Opt out with `--no-provenance`. Full policy blob embedded with `--include-policy`.

### Docs to write (part of this milestone)

- `docs/CLI_REFERENCE.md` — full command reference with sample output
- `docs/custom-rules-format.md` — rule schema, pattern syntax, chain rule semantics, worked example
- `docs/custom-intel-format.md` — IOC and vuln DB schema, version constraint syntax, examples
- `docs/custom-policy-format.md` — policy schema, all configurable fields, worked examples for each profile
- `docs/benchmark-guide.md` — manifest format, building a good benchmark, CI gate pattern, worked example manifest
- `docs/suppression-format.md` — file-level and inline suppression syntax, expiry semantics

**Remaining actions:**
- [ ] Remove `diff`, `skill-diff`, `rule sync`, `intel sync`, `model sync`, `intel rebuild`, `suppress add`, `corpus` from CLI
- [ ] Implement `skillscan update [--no-model]` (always-fresh, auto-rebuilds merged intel)
- [ ] Implement `scan --baseline`, `scan --no-provenance`, `scan --no-suppress`
- [ ] Rename `model sync` → `model install`; add `--repo` flag
- [ ] Add `intel add --url` support
- [ ] Add `intel lookup <indicator>` command
- [ ] Add `policy list` command
- [ ] Add `rule test <rule-file> <skill-file>` command
- [ ] Add `benchmark --verbose` flag
- [ ] Implement provenance `meta` block in scan report JSON
- [ ] Ship five built-in policy profiles as YAML files in `data/policies/`
- [ ] Implement `observe` profile banner
- [ ] Implement `PSV-005` — detect tool set expansion between skill versions (surface from `scan --baseline`); severity HIGH
- [ ] Write all six docs files listed above
- [ ] Update `--help` text and README to reflect the new surface
- [ ] Update GitHub Actions integration templates

**Acceptance criteria:**
- `skillscan update` brings rules, IOC DB, and model all current in one command
- `skillscan --help` shows a coherent, scannable command list with no redundancy
- All removed commands return a clear error with migration hint
- Five built-in profiles ship and are selectable via `--profile`
- Provenance block present in all scan reports by default
- All six docs files written and accurate

---

## Milestone 10.8 — ML Classifier Attack-Type Hints ✅ Complete (2026-03-24)

**Goal:** Make the ML classifier's output actionable by adding an attack-type hint to every `PINJ-ML-001` finding, so users know *what kind* of attack was detected without requiring a full multi-class model retraining.

**Problem statement:** The current ML classifier outputs a single binary label (`INJECTION` / `BENIGN`) with a confidence score. All injection findings produce the same generic `PINJ-ML-001` title regardless of whether the attack is a jailbreak, a credential exfiltration attempt, a supply-chain hook, or an indirect injection. Users cannot prioritize or triage findings without reading the raw snippet.

**Proposed approach — lightweight post-processing (no retraining required):**

After the ML score passes the injection threshold, run the top-scoring chunk through a deterministic keyword classifier that maps it to the most likely attack category. This adds an `attack_hint` field to the finding's metadata and enriches the `title` and `mitigation` text.

| Attack hint | Key signals | Severity modifier |
|---|---|---|
| `jailbreak` | "developer mode", "DAN", "unrestricted", "ignore previous", "pretend you are" | HIGH |
| `social_engineering` | "urgent", "deprecated", "verify your", "confirm credentials", "reward", "vendor" | HIGH |
| `exfiltration` | DNS patterns, webhook URLs, `curl`, `wget`, error message + secret, base64 + send | CRITICAL |
| `supply_chain` | package names + install + hook, `setup.py`, `__init__` + exec | CRITICAL |
| `indirect_injection` | RSS, changelog, tool result, "when you read", "if this appears" | MEDIUM |
| `prompt_injection` | role override, context extraction, goal hijack, system prompt leak | HIGH |

**Future path to full multi-class:** Once the training corpus has ≥200 labeled examples per attack class (currently ~10/class), replace the keyword post-processor with a proper multi-label DeBERTa head. The attack-hint field in the Finding schema is forward-compatible with this upgrade.

**Remaining actions:**
- [ ] Add `attack_hint: str | None` field to the `Finding` dataclass in `models.py`
- [ ] Implement `_classify_attack_type(text: str) -> str` in `ml_detector.py` using a priority-ordered keyword ruleset
- [ ] Enrich `PINJ-ML-001` title: `"ML-detected {attack_hint} (DeBERTa classifier)"` when hint is available
- [ ] Add attack-type-specific mitigation text for each hint category
- [ ] Update SARIF output to include `attack_hint` as a property bag entry
- [ ] Add unit tests for each attack hint category
- [ ] Update `docs/DETECTION_RULES.md` to document the attack hint taxonomy

**Acceptance criteria:**
- `PINJ-ML-001` findings include a non-null `attack_hint` for ≥80% of injection examples in the held-out eval set
- Attack hint accuracy (correct category) ≥70% on the labeled eval set
- No change to FPR or macro F1 (post-processing only, no model change)
- SARIF output includes `attack_hint` in the `properties` field
---
## Milestone 10.9 — Lint Rule Expansion (skillscan-lint) ✅ Complete (2026-03-24)

**Goal:** Bring skillscan-lint from 25 rules to 34 rules, covering schema validation, description/tools alignment, and documentation completeness gaps identified in the vendor skill corpus audit.

The 389-file vendor skill harvest (Azure, AWS, Composio, ServiceNow) revealed 9 patterns that real enterprise skills follow consistently but that the current lint rules do not check for. These are quality and reliability issues, not security issues — they belong in `skillscan-lint`, not `skillscan-security`.

**Actions:**
- **[GAP P2]** Add `QL-026` — warn on unknown frontmatter keys not in the standard schema. Add `QL-027` — warn when `version` is not a valid semver string. Severity: INFO/WARNING.
- **[GAP P2]** Add `QL-028` — detect "use the tool" or "call the function" without a specific tool name in the skill body. Severity: INFO.
- **[GAP P2]** Add `QL-029` — detect when the description contains action verbs (`executes`, `runs`, `deploys`) that imply capabilities not present in `allowed-tools`. Severity: WARNING.
- **[GAP P2]** Add `QL-030` — warn when `allowed-tools` contains `computer` or `Bash` without a justification keyword in the description. Severity: WARNING.
- **[GAP P2]** Add `QL-032` — warn when a skill has no `## Inputs` or `## Outputs` section. Severity: WARNING.
- **[GAP P3]** Add `QL-031` — info-level flag when a skill has no `changelog` section and no `updated` frontmatter field. Severity: INFO.
- **[GAP P3]** Add `QL-033` — info-level flag when a skill has no `## When to Use` section. Severity: INFO.
- **[GAP P4]** Add `QL-034` — warn when a skill body references specific CLI tools (`az`, `kubectl`, `terraform`, `gh`, `npm`, `pip`) without a `compatibility:` or `## Prerequisites` section. Severity: INFO.

**Acceptance criteria:** `skillscan-lint` rule count reaches 34. All 9 new rules have unit tests and at least 2 showcase examples each. No regression on existing showcase examples.

---
## Milestone 10.10 — HuggingFace Model Card

**Goal:** Write a complete, professional model card for `kurtpayne/skillscan-deberta-adapter` so security teams evaluating the tool can understand what the model does, how it was trained, and what its limitations are.

**Actions:**
- Fill out the HuggingFace model card with:
  - Model description: DeBERTa-v3-base + LoRA adapter fine-tuned for prompt injection / malicious skill detection in SKILL.md files
  - Training data summary: corpus size, class balance, data sources (synthetic + organic), corpus date range
  - Evaluation results table: macro F1, benign F1, injection F1, FPR, enterprise benign eval — for v5 and v7
  - Intended use and out-of-scope use
  - Limitations and known failure modes (8 FN archetypes, indirect injection ceiling)
  - How to use: `skillscan model sync` CLI command, not for direct HuggingFace inference
  - License and citation
- Add a `MODEL_CARD.md` to the skillscan-security repo that mirrors the HuggingFace card (single source of truth, synced on model publish)
- Update `docs/MODEL_METRICS.md` to reference the model card

**Acceptance criteria:** Model card is live on HuggingFace with all sections filled. `MODEL_CARD.md` exists in the repo and matches. No placeholder sections remain.

---
## ~~Milestone 10.11 — License Files Across All Repos~~ ✅ COMPLETE (2026-03-26)

**Goal:** Ensure every public SkillScan repo and the HuggingFace model have an explicit, consistent license so users and enterprise security teams know their rights.

**Background:** `skillscan-security` already has an Apache 2.0 `LICENSE` file. The other repos and the HuggingFace model card are missing license declarations.

**Actions:**
- Add `LICENSE` (Apache 2.0) to `skillscan-lint` repo
- Add `LICENSE` (Apache 2.0) to `skillscan-website` repo (if public)
- Add `license: apache-2.0` to the HuggingFace model card YAML front-matter for `kurtpayne/skillscan-deberta-adapter`
- Add a `## License` section to `README.md` in each repo pointing to the LICENSE file
- Confirm the SPDX identifier `Apache-2.0` appears in `pyproject.toml` for `skillscan-security` and `skillscan-lint`
- Decide on license for the ML model weights specifically: Apache 2.0 covers the adapter code; the base model (DeBERTa-v3-base) is MIT — document both in the model card

**Acceptance criteria:** All repos have a `LICENSE` file. HuggingFace model card declares `apache-2.0`. `pyproject.toml` files include `license = "Apache-2.0"`. README files reference the license.

---
## ~~Milestone 10.12 — Formalized Feedback Mechanism~~ ✅ COMPLETE (2026-03-26)

**Goal:** Give users a clear, low-friction way to report false positives, false negatives, and general feedback — and make that channel visible in every place a user might look.

**Background:** Users currently have no obvious path to report issues. False positive and false negative reports are the highest-value signal for improving detection quality. GitHub Issues is the right channel for an open-source tool; the work here is formalizing it with templates, surfacing it in the right places, and wiring it into the CLI.

**Actions:**
- Create GitHub Issue templates in `skillscan-security/.github/ISSUE_TEMPLATE/`:
  - `false_positive.yml` — structured form: rule ID, file snippet, expected vs actual verdict, skill source
  - `false_negative.yml` — structured form: attack type, sample content (sanitized), why it should be flagged
  - `feature_request.yml` — standard feature request template
  - `bug_report.yml` — standard bug report with version, OS, command run, output
- Add `CONTRIBUTING.md` to `skillscan-security` explaining the feedback process, how FP/FN reports feed into the corpus, and the review SLA
- Add a `--feedback` flag to the CLI: `skillscan feedback` opens the GitHub Issues new-issue page in the default browser (or prints the URL if no browser is available)
- Add a feedback nudge to the CLI output: when a scan returns BLOCK with high confidence, print a one-liner: `False positive? Report it: https://github.com/kurtpayne/skillscan-security/issues/new/choose`
- Surface on the website: add a "Feedback" or "Report an Issue" link in the nav and on the scan results page
- Add `SECURITY.md` with a responsible disclosure policy (private report via GitHub Security Advisories, 90-day disclosure window)

**Acceptance criteria:** Issue templates are live on GitHub. `skillscan feedback` command works. Feedback URL appears in CLI BLOCK output. Website has a visible feedback link. `CONTRIBUTING.md` and `SECURITY.md` exist.

---
## Milestone 11 — Hardening & PyPI Publish ✅ COMPLETE (2026-03-26)

**Goal:** Ensure the scanner is robust enough for enterprise CI/CD use.

**Implemented:**
- `--max-file-size` flag (default: 1 MB) — skips oversized files with a `[SKIP]` warning in the report
- `--timeout` flag (default: 30s) — scan-level wall-clock timeout via `concurrent.futures`; exits cleanly with a `[TIMEOUT]` warning
- `pyproject.toml` license corrected from MIT → Apache-2.0; `LICENSE` file already present
- `[lint]` optional extra added: `pip install skillscan-security[lint]` installs `skillscan-lint`
- `skill-schema.yaml` externalized as single source of truth for FM keys, tool risk tiers, and graph edge keys; both packages read it at runtime (B2 fallback pattern)
- `schema-sync.yml` CI workflow auto-opens a PR to `skillscan-lint` whenever `skill-schema.yaml` changes (requires `SCHEMA_SYNC_PAT` secret)
- Version bumped to **0.8.0**

**M11.1 ✅ COMPLETE (2026-03-26):** Per-file timeout — `_scan_one_file()` extracted from the 222-line per-file loop body; dispatched via `ThreadPoolExecutor(max_workers=1)` with `Future.result(timeout=file_timeout_seconds)`. `TimeoutError` emits `SCAN-TIMEOUT-SKIP` advisory finding and continues to next file. `--timeout` CLI flag now enforces per-file (not scan-level) wall-clock limit.

**Acceptance criteria:** ✅ `--max-file-size` and `--timeout` flags work. ✅ License consistent. ✅ Schema drift prevention in place.

---

## Milestone 12 — Binary Detection & Multi-Language Coverage ✅ Complete

Completed 2026-03-18. `multilang.yaml` covers JavaScript/TypeScript, Ruby, Go, and Rust with 17 static rules. Binary/encoded payload detection is included in `default.yaml` (OBF-001/002/003).

---

## Milestone 13 — Docs & Metadata Consolidation *(partially complete)*

Completed: `RELEASE_VERIFICATION_0.2.3.md` deleted, `PRD.md` (root) deleted, `AUTOMATION_GUARDRAILS.md` merged, `PLATFORM_SKILLS.md` merged, `docs/OPENCLAW_CONTEXT.md` IOC seeds updated, `docs/THREAT_MODEL.md` stale notes fixed.

Remaining items folded into Milestones 10 and 6:
- `docs/RELEASE_ONBOARDING.md` → condense into `RELEASE_CHECKLIST.md` (M10)
- `exfil_channels.yaml` → merge into `default.yaml` (M6)
- Chain rule metadata guard → extend to cover chain rules (M6)
- `docs/PROMPT_INJECTION_CORPUS.md` → resolve or delete (M10)

---

## Milestone 14 — Public Scan Feed

**Goal:** A daily-updated public feed of scanned skills on the SkillScan website, demonstrating real-world detection value.

This is the primary distribution mechanism for the offline product. A developer who sees a skill flagged on the public feed will install the scanner to check their own skills. The feed also builds the known-good registry needed for Milestone 17 (similarity hashing).

**Actions:**
- Daily cron job that scans the top 50 most-starred skills from the Claude skills registry and the OpenClaw index.
- Results stored as static JSON, rendered by the website's Feed page (already scaffolded).
- Each scan result shows: skill name, source URL, finding count by severity, top finding ID and description.
- A "scan this skill" button that links to the CLI install instructions.

**Acceptance criteria:** Feed updates daily. At least 50 skills shown. Results are accurate (no false positives on well-known benign skills). Feed page loads in < 2s.

---

## Milestone 14.5 — Website Update (v1.0 docs + ML model + positioning)

**Goal:** Bring the SkillScan website to v1.0 quality: more docs, more examples, prominent ML model page, and clear positioning as the offline-first enterprise-ready scanner. After this milestone, the product is ready for Trace as a Service.

**Prerequisites:** ✅ M7 (F1 ≥ 0.97 met at 0.9752), ✅ M10.7 (CLI surface stable). Both now complete.

**Status:** Ready to implement.

---

### 1. Homepage updates

**Stats bar** — update the three key stats to reflect current state:
- Rules: **137** (was lower)
- ML Macro F1: **0.9752** (new stat — add this)
- False Positive Rate: **1.89%** (new stat — add this)
- Showcase examples: **119**

**Hero section** — add a one-line positioning statement below the tagline that calls out the offline-only niche:
> *Runs entirely on your machine. No API keys, no telemetry, no network calls at scan time.*

**"How it works" section** — add a two-layer detection explainer to the homepage (or link to the Model page):
- Layer 1: 137 static + chain + multilang rules — known attack patterns, structural violations, IOC matching
- Layer 2: DeBERTa-v3 ML classifier — novel phrasing, jailbreaks, semantic attacks that rules can't catch
- Explain that both layers run offline, results are deterministic, no model API call is made

---

### 2. New: Model page

Add a dedicated `/model` route (or `/docs/model`) with the following sections:

**Architecture overview**
- Base model: `microsoft/deberta-v3-base`
- Fine-tuning: LoRA (r=64), 5 epochs, trained on 18,161 examples (v9); corpus now at 18,216 (+55 since v9)
- Inference: ONNX FP32 (~350 MB), runs on CPU via ONNX Runtime, no GPU required
- Input: sliding-window chunking (512 tokens, 64-token stride), verdict = max-pool over chunks
- Output: binary `BENIGN` / `INJECTION` with confidence score + attack-type hint

**Current performance** (pull from `docs/MODEL_METRICS.md`, do not hardcode):
- Macro F1: 0.9752
- FPR: 1.89%
- Eval set: 444 held-out examples (never used in training)
- Training corpus: 18,216 examples (18,161 at v9 training time; +55 added since)

**Version history table** — show all versions that passed the F1 gate:

| Version | Corpus | Macro F1 | FPR | Key improvement |
|---|---|---|---|---|
| v1278 | 1,278 | 0.2690 | 95.7% | Baseline |
| v7458 | 7,277 | 0.8448 | 15.7% | First gate pass |
| v11461 | 11,461 | 0.9110 | 11.45% | Enterprise benign corpus |
| v16589 | 16,589 | 0.9608 | 3.69% | Gap archetype closure |
| **v18161** | **18,161** | **0.9752** | **1.89%** | **Current — SaaS quality thresholds met** |

**What it detects** — attack category table (same as MODEL_CARD.md):
Prompt injection, jailbreaks, indirect injection, exfiltration, supply chain, social engineering, MCP-specific attacks.

**What it does not detect** — honest limitations section:
Runtime-conditional payloads, indirect injection from external content fetched at runtime, infrastructure-level MCP trust, highly sophisticated multi-layer obfuscation.

**Known failure modes** — the 8 persistent FN archetypes with descriptions.

**HuggingFace link** — link to `kurtpayne/skillscan-deberta-adapter` model card.

---

### 3. Multi-layer detection framework display

This is a prominent visual element, not buried in docs. It should appear on the homepage and/or a dedicated section, not just on the Model page.

**Design intent:** A scannable table or diagram that shows all 8 detection layers, what each catches, and why the combination matters. The goal is to make the depth of the scanner immediately legible to a security engineer skimming the site.

**Content** (the 8 layers, in order):

| Layer | Name | Mechanism | What it catches |
|---|---|---|---|
| 1 | Static rules | YARA-style pattern matching (137 rules) | Known attack patterns, structural violations, IOC matches |
| 2 | Chain rules | Multi-pattern proximity matching (15 rules) | Attack sequences requiring co-occurrence within a window |
| 3 | Multilang rules | Language-specific patterns (17 rules) | JS/TS/Ruby/Go/Rust attack patterns |
| 4 | AST data-flow | Source-to-sink flow analysis | Secret → decode → exec/network flows |
| 5 | Skill graph | Graph-based PSV rules | Tool drift, circular dependencies, permission scope violations |
| 6 | ML classifier | DeBERTa-v3 + LoRA (F1 0.9752) | Novel phrasing, jailbreaks, semantic attacks that rules can’t catch |
| 7 | IOC / Vuln DB | Indicator matching (5,507 IOCs, 63 packages) | Known malicious domains, IPs, vulnerable dependencies |
| 8 | Semantic classifier | Offline stem-and-score | Keyword-level semantic patterns without network dependency |

**Placement options** (pick one during implementation):
- Horizontal scrolling card strip on the homepage below the hero
- Numbered list with expand-on-click detail in a "How it works" section
- Full-width table on a dedicated `/how-it-works` or `/detection` page linked from the nav

**Key message to reinforce:** Every layer runs offline. No layer makes a network call. The ML layer uses a locally-installed ONNX model, not an API.

---

### 4. Docs page expansion — treat as the man page

The docs on the website should be the canonical human-readable reference, sourced from the repo docs. The goal is: if someone wants to understand how to use SkillScan, the website docs should be complete enough that they never need to read the raw README.

Source files in the repo (already written as part of M10.7) to surface on the website:
- `docs/CLI_REFERENCE.md` — full command reference
- `docs/custom-rules-format.md` — rule schema and examples
- `docs/custom-intel-format.md` — IOC/vuln feed formats
- `docs/custom-policy-format.md` — policy YAML schema
- `docs/benchmark-guide.md` — benchmark manifest format
- `docs/suppression-format.md` — suppression YAML schema

**Sections to add or expand on the website docs page:**

**Installation** — three install paths with copy-pasteable commands:
```bash
# pip
pip install skillscan-security
skillscan model install

# Docker
docker pull kurtpayne/skillscan:latest
docker run --rm -v $(pwd):/scan kurtpayne/skillscan scan /scan

# GitHub Actions
# (see CI/CD section below)
```

**User journey / getting started** — a linear walkthrough of the full first-use experience:
1. Install (`pip install` or `docker pull`)
2. Install the ML model (`skillscan model install` — one-time, ~350 MB)
3. Run first scan (`skillscan scan path/to/skills/`)
4. Read the output (verdict, score, findings by severity)
5. Choose a policy profile (`--profile ci` for PR gates, `--profile strict` for security reviews)
6. Set up a suppression file for known FPs
7. Add to CI/CD (GitHub Actions snippet)
8. Keep fresh (`skillscan update` — rules + intel + model in one command)

**Docker usage** — dedicated section with full examples:
```bash
# Scan a local directory
docker run --rm -v $(pwd):/scan kurtpayne/skillscan scan /scan

# Scan with a specific policy profile
docker run --rm -v $(pwd):/scan kurtpayne/skillscan scan /scan --profile ci

# JSON output for CI integration
docker run --rm -v $(pwd):/scan kurtpayne/skillscan scan /scan --format json > report.json

# SARIF output for GitHub Code Scanning
docker run --rm -v $(pwd):/scan kurtpayne/skillscan scan /scan --format sarif > results.sarif

# With a suppression file
docker run --rm -v $(pwd):/scan kurtpayne/skillscan scan /scan \
  --suppress-file /scan/.skillscan-suppressions.yaml

# Update rules and intel (model not included in Docker image by default)
docker run --rm kurtpayne/skillscan update --no-model
```

**CI/CD integration** — full GitHub Actions workflow:
```yaml
name: SkillScan Security Gate
on: [pull_request]
jobs:
  skillscan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run SkillScan
        uses: kurtpayne/skillscan-action@v1
        with:
          path: .
          profile: ci
          format: sarif
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: skillscan-results.sarif
```

**Policy profiles** — "which profile should I use?" decision table:

| Situation | Profile | Why |
|---|---|---|
| First day, just exploring | `observe` | Exit 0 always; shows findings without blocking |
| PR gate, low noise | `ci` | CRITICAL + HIGH only; fast |
| Full security review | `strict` | All categories, default threshold |
| Trusted internal registry | `permissive` | CRITICAL only, high threshold |
| Formal security gate with ML required | `enterprise` | All categories, ML layer required |

**Suppression** — "Managing False Positives" with a worked example:
```yaml
# .skillscan-suppressions.yaml
suppressions:
  - rule_id: EXF-007
    path: skills/deployment/deploy-to-prod.md
    reason: "Legitimate internal endpoint, reviewed by security team"
    expires: "2026-09-01"
    approved_by: "kurt@example.com"
```

**Custom rules** — minimal worked example:
```yaml
# my-rules.yaml
rules:
  - id: CUSTOM-001
    name: Internal credential pattern
    severity: HIGH
    pattern: 'vault\.read\(["\']secret/'
    description: "Detects vault secret reads that may indicate credential harvesting"
```

**Output formats** — table of all supported formats:

| Format | Flag | Use case |
|---|---|---|
| Text (default) | `--format text` | Human review |
| JSON | `--format json` | Programmatic processing, CI artifacts |
| SARIF | `--format sarif` | GitHub Code Scanning, SAST tooling |
| JUnit | `--format junit` | Jenkins, test result dashboards |
| CycloneDX | `--format cyclonedx` | SBOM pipelines |

---

### 5. Examples page expansion

The current examples page shows showcase examples. Expand it with:

**Attack category breakdown** — group examples by attack category with counts:
- Prompt injection (PINJ-*): N examples
- Exfiltration (EXF-*): N examples
- Social engineering (SE-*): N examples
- Supply chain (SUP-*): N examples
- Malware patterns (MAL-*): N examples
- ML-detected (PINJ-ML-001): N examples

**CI/CD integration example** — copy-pasteable GitHub Actions workflow (same as docs section above, surfaced here too for discoverability).

**Suppression example** — copy-pasteable `.skillscan-suppressions.yaml` snippet for the most common FP scenario.

---

### 6. Positioning copy updates

Update the website copy to reflect the offline-only niche and enterprise positioning:

**Tagline / hero:** Emphasize *offline*, *no API keys*, *deterministic*, *CI/CD ready*.

**Positioning statement** (for the About or landing section):
> SkillScan is the only AI agent skill scanner that runs entirely on your machine. No model API, no cloud dependency, no telemetry. The same scan run twice on the same file produces the same result — always. That’s the property enterprise security teams need for audit trails and reproducible CI gates.

**Enterprise trust signals** to surface prominently:
- FPR 1.89% on enterprise benign skill corpus
- SARIF output for integration with existing SAST tooling
- Policy profiles for CI/CD gating
- Suppression file format for managing exceptions in PRs
- Provenance block in every JSON report (version, rules SHA, model version, scanned_at)

---

### 7. Feedback integration

Feedback is solved by GitHub Issues. Surface it everywhere a user might be stuck or frustrated:

- **Website footer:** "Report a false positive →" and "Report a missed attack →" links, both pointing to the respective GitHub Issue templates
- **Website nav:** "Feedback" link (or icon) in the top nav pointing to `https://github.com/kurtpayne/skillscan-security/issues/new/choose`
- **Docs page:** "Found a false positive? [Report it on GitHub →]" callout box at the top of the docs
- **Model page:** "Model missed an attack? [Open a false negative report →]" callout near the known limitations section
- **CLI output:** When a scan returns BLOCK, print: `False positive? https://github.com/kurtpayne/skillscan-security/issues/new/choose`
- **`skillscan feedback` command:** Opens the GitHub Issues new-issue page in the default browser, or prints the URL if no browser is available

The GitHub Issue templates (part of M10.12) are the backend for all of these links. M14.5 adds the website surface; M10.12 adds the templates and CLI command.

---

### 8. Navigation / structure changes

- Add `/model` to the top nav (between Docs and Rules, or as a Docs sub-page)
- Add `/docs` as a top-level nav item if not already present, with sub-sections: Getting Started, CLI Reference, Docker, CI/CD, Policy Profiles, Suppression, Custom Rules, Output Formats
- Add "Feedback" link in top nav pointing to GitHub Issues
- Add FP/FN report links in footer
- Ensure the HuggingFace model card link is visible on the Model page

---

### Acceptance criteria

- Homepage stats include F1 score and FPR
- Multi-layer detection framework is prominently displayed (homepage or dedicated section)
- Model page is live with architecture, performance table, version history, and limitations
- Docs page is complete enough to serve as the man page: installation (pip + Docker), full user journey, Docker examples, CI/CD workflow, policy profiles, suppression, custom rules, output formats
- Examples page groups examples by attack category
- Positioning copy calls out offline-only niche and enterprise trust signals
- Feedback links (GitHub Issues) are visible in nav, footer, docs page, and model page
- All metrics match `docs/MODEL_METRICS.md` (no hardcoded numbers that will go stale)
- All pages load in < 2s
- No broken links
- After this milestone: proceed to Trace as a Service

---

## Milestone 15 — skillscan-core Extraction

**Goal:** Extract shared logic into a `skillscan-core` package that both `skillscan` and `skillscan-lint` depend on.

Currently the two tools share code via direct imports. As the tool family grows, this becomes a maintenance burden. Extracting a `skillscan-core` package with the shared graph model, front-matter parser, SKILL.md schema, fingerprinting, and diff engine is the right architectural move. This is a prerequisite for `skillscan-provenance`.

**Acceptance criteria:** `skillscan-core` published to PyPI. Both `skillscan` and `skillscan-lint` depend on it. No user-visible behavior change.

---

## Milestone 16 — Behavioral Diff & Suppression Integration *(partially complete)*

PSV-001/002/003 are implemented in `skill_graph.py`. `skillscan diff` is implemented in `skill_diff.py`. Remaining work:
- Wire PSV rules through the standard rule YAML path (now Milestone 8).
- Add suppression file integration to `skillscan diff` output.
- Add a `--baseline` flag to `skillscan diff` that reads a suppression file and only reports new findings.

---

## Milestone 17 — Instruction-Level Similarity Hashing

**Goal:** Detect skills that are near-copies of known-good skills with malicious additions.

A malicious skill that is 95% identical to a popular trusted skill but with one added exfiltration instruction is invisible to the current static rules. Instruction-level similarity hashing against a known-good registry would catch this.

**Implementation:** MinHash or SimHash over the instruction tokens. A similarity score above 0.85 against a known-good skill triggers a warning; above 0.95 with a finding in the diff triggers a high-severity alert.

**Prerequisite:** Milestone 14 (public scan feed) builds the known-good registry as a side effect.

---

## Deferred

**VS Code Marketplace publish.** The publisher registration process at marketplace.visualstudio.com requires a Microsoft account with working captcha/account recovery, which has been broken for an extended period. The extension code is maintained in `editors/vscode/` and can be installed locally. Revisit if Microsoft fixes the registration flow.

**SaaS control plane / multi-tenant API.** The hosted service design is documented in `skillscan-trace/ROADMAP.md` Phase 3. Prerequisites before this becomes active: FPR ≤ 2% on benign skills, detection rate ≥ 85% on the malicious corpus, skillscan-trace v1.0 complete. None of these prerequisites are met today. The SaaS design is sound — token packs, permanent report URLs, async scan queue, GitHub Action integration — but building it before the product quality bar is met would damage trust faster than any marketing can recover.

**Automatic code remediation.** Out of scope. The scanner's job is to surface findings, not rewrite code.

**Public signing and transparency log workflow.** The SBOM pipeline (CycloneDX + cosign) is already in place. Full Sigstore/Rekor integration can wait until the project has meaningful downstream consumers.

**Dynamic analysis beyond skillscan-trace.** Indirect prompt injection from external content fetched at runtime, temporal/conditional payload detection via symbolic execution, MCP server infrastructure trust validation, and compositional safety analysis across a live agent session are all real gaps. They require cloud execution, infrastructure-level signals, or LLM semantic reasoning that cannot be fully local. These are not on the roadmap for the static tools.

---

## Risks & Guardrails

**False positives from ML detection.** Guardrail: ML findings are advisory by default; threshold is 0.70; current FPR is 1.89% (v9, 2026-03-25), below both the offline target (≤ 5%) and the SaaS target (≤ 2%). Milestone 7 resolved the FPR gap.

**Performance regressions from extra scanners.** Guardrail: strict budgets (timeout, bytes, files), benchmark gates in CI.

**Distribution drift / broken installs.** Guardrail: release smoke tests for `pip` and Docker on each tag (Milestone 11).

**Complexity creep.** Guardrail: keep features optional and policy-driven; preserve deterministic core.

**Thin intel data making the scanner look like a demo.** Guardrail: Milestone 5 is the highest-priority milestone. Do not ship v0.4.0 without credible IOC and vuln DB depth.

---

## Success Metrics

### Detection Quality

| Metric | Current (2026-03-25) | Target (v0.4.0) | Target (v1.0) |
|---|---|---|---|
| Static + chain rules | **137** (134 static + 15 chain + 17 multilang) | 150+ | 175+ |
| ML corpus size (training) | **18,161 examples** | 20,000+ | 25,000+ |
| ML macro F1 (held-out) | **0.9752** (v9, 2026-03-25, gate PASSED) ✅ | ≥ 0.97 ✅ | **≥ 0.97** |
| ML injection F1 | **—** (v9 per-class not yet extracted) | ≥ 0.95 | ≥ 0.97 |
| ML FPR | **1.89%** ✅ | ≤ 2% ✅ | ≤ 2% |
| IOC DB entries (bundled) | **5,507** | 10,000+ | 20,000+ |
| Vuln DB packages | **63** | 100+ | 150+ |
| Showcase examples | **119** | 130+ | 150+ |

### Ecosystem Coverage

| Metric | Current | Target (v1.0) |
|---|---|---|
| VS Code extension | scaffolded, not published | published (pending Microsoft fix) |
| Zed extension | not started | published |
| JetBrains plugin | not started | published |
| SARIF / JUnit / CycloneDX output | complete | complete |
| skillscan-core package | not extracted | PyPI published |
| Skill fingerprinting | not implemented | complete (M17) |
| PSV rules in rule YAML | **complete (M8)** | complete |
| Instruction-level diff | complete | + suppression integration (M16) |
| Similarity hashing | not implemented | complete (M17) |
| Public scan feed | scaffolded | daily cron, 50+ skills (M14) |
| SaaS scanner | not started | post-v1.0, when quality bar met |

### Milestone Priority Order (updated 2026-03-28)

M5, M6, M7, M7.5, M8, M10, M10.5, M10.7, M10.8, M10.9, M10.10, M11, M11.1, M12, M13, M14.0, M14 are complete. Priority order for remaining work:

| Priority | Milestone | Rationale |
|---|---|---|
| ✅ | **M10.7 — CLI UX Audit** ✅ | Completed 2026-03-25. |
| ✅ | **M10.10 — HuggingFace Model Card** ✅ | Completed 2026-03-25. |
| ✅ | **M14.0 — Unified Skill Index** ✅ | Completed 2026-03-27. |
| ✅ | **M14 — Public Scan Feed** ✅ | Completed 2026-03-27. |
| ✅ | **M10 — Documentation Accuracy** ✅ | Completed 2026-03-26. |
| ✅ | **M11 — Hardening & PyPI** ✅ | Completed 2026-03-26. v0.8.0, Apache-2.0. |
| ❌ | ~~**M17 — Similarity Hashing**~~ | Dropped — requires running a registry. |
| **1** | **Trace-A1 — Provider UX** | `--provider openrouter/ollama/openai` shortcuts; `OPENROUTER_API_KEY` env var; OpenRouter unlocks 200+ models. Small effort, high UX impact. |
| **2** | **Trace-A6 — Stale docs correction** | ROADMAP/README/IMPL_PLAN still say "spec only, no implementation" — wrong. 144 tests pass. Fix before public. |
| **3** | **Trace-A3 — PRIVACY.md + README transparency** | Keys never stored/transmitted by SkillScan. Core differentiator. Must be prominent before public release. |
| **4** | **M14.5 — Website Update (v1.0 docs + ML model + positioning)** | Primary trust signal for enterprise evaluators. Homepage stats, /model page, /docs page, /trace page. |
| **5** | **Trace-A2 — Config system** | Three-tier YAML (CLI flags > trace-config.yml > defaults). Enables CI/CD `skillscan-trace run .` with no flags. |
| **6** | **Trace-A5 — Bash AST upgrade** | Replace regex bash parsing with `bashlex`. Catches obfuscation patterns. Detection quality improvement. |
| **7** | **Trace-A4 — Docker image (`run` + `serve` modes)** | Single image, two modes. `run` = containerized single trace. `serve` = FastAPI wrapper (POST /v1/submit, GET /v1/report/{id}, GET /v1/health), SQLite-backed, ~150 lines. Same image for Fly.io hosted service AND enterprise self-hosting. Prerequisite for Phase C. |
| **8** | **Trace-B1 — Make `skillscan-trace` public** | Launch event. Prerequisites: A1–A3 complete, PRIVACY.md written, README accurate. |
| **9** | **Trace-B2 — Website /trace page** | Data flow diagram showing key goes only to provider, provider setup guides, sample report render, 3-command quick-start. |
| **10** | **Trace-B3 — GitHub Action** | `skillscan/trace-action` — OIDC-based for public repos, posts report URL as PR comment. Stickiest distribution mechanism. |
| **11** | **Trace-B4 — Multi-model trace** | Run against 2+ models via OpenRouter, report agreement/disagreement. |
| **12** | **Trace-B5 — `--remote` flag + `--remote-host` override** | CLI submits to hosted or self-hosted server. `source_url` URL-reachability check is the only auth for free OSS tier. |
| **13** | **M10.12 — Feedback Mechanism** | FP/FN GitHub issue templates. Link from website + CLI output. |
| **14** | **P4 — analysis.py refactor** ✅ | Decomposed 1404-line analysis.py into analysis_pkg/_archive.py, _text.py, _scanner.py with compatibility shim. All tests pass. Merged 2026-03-28. |
| **15** | **P10 — Website: Dedicated Domain** | skillscan-website currently hosts pages for both `skillscan` (security scanner) and `skillscan-lint` (linter). Dedicate the website to the full SkillScan suite: update nav, homepage hero, and meta copy to present both tools as first-class products. Add a `/lint` landing section to the homepage, ensure `/lint` and `/trace` are in the primary nav, and update the footer to list all three tools (scan, lint, trace). |
| **16** | **M10.6 — Organic Eval Pipeline** | Closes feedback loop between pattern-updater and model. |
| **17** | **M9 — Editor Extensions** | Distribution; lower priority than product quality. |
| **18** | **M15 — skillscan-core** | Architectural; not blocking any user feature. |
| **❌ DROPPED** | ~~**Private repo scanning**~~ | Requires GitHub App or PAT (security liability). Enterprise path is self-hosted Docker image (`--remote-host`). Do not build until explicitly needed. |
| **— (Phase C)** | **Trace-C1/C2 — Hosted Reporting (Fly.io + R2 + Workers)** | Deferred. Fly Machines (~$0.000132/trace) + CF R2 (free tier ≤ 10GB) + CF Workers (submission API + SHA cache keyed on skill_sha256 + model_id). Free for public OSS repos (URL-reachability check, no account). |
| **— (Phase C)** | **Trace-C3 — GitHub OIDC for Action** | Verify public-repo claims from GitHub JWKS. No pre-registration. |
| **— (Phase C)** | **Trace-C4/C5 — Paid tier + managed inference** | GitHub OAuth → opaque token (32-byte hex, no expiry, rate-limited). After C2 has demand data. |
| — | **SaaS (skillscan static hosted)** | Post-v1.0; FPR 1.89% ✅ and F1 0.9752 ✅ — quality thresholds met; prerequisite is product completeness (M14.5 + trace public). |

---

## Report Generation

### Overview

SkillScan can produce a structured enterprise security report combining static analysis output and dynamic trace data. The report is the primary commercial artifact — it is what an enterprise security team receives as the deliverable of a scan engagement.

Two canonical variants exist:

| Variant | When issued | Content |
|---|---|---|
| **PASS** | All checks pass, no findings | Clean bill of health, tool-surface adherence proof, 90-day approval, residual risk caveats |
| **BLOCK** | One or more findings | Per-finding detail with evidence, trace behavioral narrative, canary relay summary, remediation guidance |

Sample reports are stored in `skillscan-website/docs/sample-reports/` (private, not served by the website).

### Reproducibility

The report is compiled from three inputs:

1. `skillscan scan <dir> --output json` — static analysis JSON
2. `skillscan-trace <dir> --inputs 3 --output json` — dynamic trace JSON
3. An LLM compiler prompt that takes both JSONs and renders the Markdown report

The compiler prompt is the only component not yet built. Everything else is already implemented. Building the compiler is approximately a half-day task once the report format is finalized. The sample reports in `skillscan-website/docs/sample-reports/` are the canonical format specification.

### Value-add items identified (2026-03-22)

The following enhancements increase the report's credibility and utility for enterprise buyers. All are implementable with existing tooling.

**File integrity manifest (high priority).** Every file analyzed should be listed with its SHA-256 hash and the URL or path it was fetched from. For skills fetched from GitHub or a registry, the URL + commit SHA + file hash together constitute a tamper-evident provenance record. Implementation: add a `manifest` block to the scan JSON output (one entry per file: `{path, sha256, source_url, fetched_at}`). The report compiler includes this as an appendix table.

**Multi-model trace (high priority).** Run the dynamic trace against two or more models (e.g., claude-sonnet-4-5 + gpt-4.1) and report where they agree and diverge. A skill that behaves maliciously on one model but not another is a significant finding — it may indicate the skill was tuned to exploit a specific model's behavior. Agreement between models increases confidence in both PASS and BLOCK verdicts. The `skillscan-trace` harness already supports `--model`; the report compiler needs a multi-model comparison section and the runs can be parallelized.

**Confidence-weighted finding severity (medium priority).** Each static finding already has a `confidence` field (0.0–1.0). Surface this in the report as a visual indicator so the reader can distinguish a near-certain finding from a heuristic one. Especially important for semantic classifier findings, which are probabilistic by nature.

**Suppression audit trail (medium priority).** When a finding is suppressed, the report should include the suppression entry, the author, the date, and the documented rationale. This gives the customer an auditable record of what was reviewed and consciously accepted.

**Dependency vulnerability section (medium priority).** For skills that reference `pip install` or `npm install` commands, extract the package names and versions and cross-reference against the vuln DB. Surface any CVEs as a separate "Dependency Vulnerabilities" section. Natural complement to the existing supply chain detection rules.

**Token usage and skill cost estimate (medium priority).** Each trace run should record the token counts consumed by the traced model: prompt tokens, completion tokens, and total tokens per fuzz input, plus an aggregate for the full trace run. The report surfaces this as a "Skill Cost Profile" table:

| Model | Prompt tokens | Completion tokens | Total tokens | Est. cost (USD) |
|---|---|---|---|---|
| claude-sonnet-4-5 | 4,821 | 312 | 5,133 | ~$0.016 |
| gpt-4.1 | 4,756 | 298 | 5,054 | ~$0.013 |

This serves two purposes: (1) **model comparison** — a skill that consumes 3× more tokens on one model than another may be exploiting that model's verbosity or context-expansion behavior, which is itself a signal; (2) **enterprise cost estimation** — a security team deploying a skill across 1,000 users per day needs to know the per-invocation LLM cost before approving it. Implementation: `skillscan-trace` already calls the LLM API; capture `usage` from the API response and include it in the trace JSON output (`{model, input_tokens, output_tokens, total_tokens, estimated_cost_usd}` per fuzz run). The report compiler aggregates by model and renders the table. Estimated cost uses published API pricing at report generation time — include a note that pricing may change.

**Delta / baseline comparison (lower priority).** If a previous scan report exists for the same skill, include a delta section: "3 new findings since last scan, 1 resolved." Creates recurring scan value — a customer who scans on every PR merge needs to know what changed. Prerequisite: `skillscan diff` (already implemented).

### Report structure (canonical)

1. Cover / executive summary — verdict, risk score table, scan metadata
2. Detection layers active — table: layer, type, findings count
3. Per-skill findings — static findings with evidence + dynamic trace narrative
4. IOC and domain analysis — table: domain, skill, IOC listed, trace observed
5. **Skill cost profile** — token usage per model per fuzz run, aggregate totals, estimated USD cost
6. Methodology and limitations — honest caveats (required for enterprise credibility)
7. Remediation guidance — table: skill, priority, action
8. Appendix — scan configuration + file integrity manifest

### SaaS report delivery (future)

When the SaaS scanner is built, reports will be delivered as a signed PDF (tamper-evident, customer-specific watermark), a machine-readable JSON report (for SIEM/SOAR integration), and a SARIF file (for GitHub Advanced Security / Azure DevOps integration). The signing infrastructure and token system are out of scope until the offline product quality bar is met (FPR ≤ 2%, macro F1 ≥ 0.90).

---

## Product Wishlist (2026-03-22)

These items were identified during the report design session. They are not yet assigned to milestones. They are grouped by buyer persona — publisher, enterprise, and future SaaS — so the priority order can be set in context of which market segment is being served first.

### Publisher-facing features

**Publisher badge / attestation (highest ROI item on this list).** A scannable SVG badge that a publisher embeds in their skill's README or marketplace listing: "Scanned by SkillScan v0.3.1 — PASS — 2026-03-22 — report `a3f9b2c1`." The hash links to the full report. This is a direct commercial incentive for publishers to pay for scans — it is a trust signal they can display publicly. It also makes every badged skill README a distribution channel for SkillScan. Implementation: a small badge generator (SVG template + report hash) and a static registry of issued badges (JSON file in a private repo, or a simple lookup endpoint). The report already exists; the badge is the last 50 lines of code. Build this alongside the report compiler.

**Pre-commit / pre-publish scan hook.** A GitHub Action or CLI hook that runs the static scan on every commit and blocks the push if a Critical finding is present. Publishers want this because it catches mistakes before they become incidents. The static scanner already works as a CLI; the GitHub Action wrapper is approximately 50 lines of YAML. This is publisher-facing, self-serve, and should be free or very cheap — it drives adoption and surfaces the paid report tier when findings are found. Distinct from the enterprise CI integration (M11), which is buyer-facing.

**Regression alerts.** When a skill is re-scanned and a new finding appears that was not present in the previous scan, notify the publisher via email or webhook. "Your skill `onboarding-assistant` now triggers EXF-001 — this may have been introduced in the last commit." Publishers want to know when their skill regresses without having to remember to re-scan manually. Prerequisite: the delta/baseline comparison feature and a publisher account concept (even a simple email registration).

**Skill signing.** A publisher signs their SKILL.md with a keypair; the signature is embedded as front-matter. Enterprise buyers can verify the signature before loading the skill. SkillScan becomes the trust anchor — it issues a signed attestation that the skill passed at a specific version. This is a larger infrastructure investment (key management, revocation) and is a post-v1.0 item. Worth noting here because it is the natural endpoint of the publisher trust chain and informs the SaaS architecture.

### Enterprise buyer-facing features

**Policy profiles (high priority).** Right now there is a single `strict` profile. An enterprise should be able to define their own policy in a YAML file: "allow `http_fetch` to internal domains only," "require all skills to declare `allowed-tools`," "block any skill with a social engineering score above 0.7," "treat MEDIUM findings as WARN rather than BLOCK." The scanner already has all the underlying data (finding IDs, confidence scores, severity levels); a policy profile is a YAML mapping of finding IDs to PASS/WARN/BLOCK thresholds. This is a strong enterprise differentiator — it makes the tool configurable to the customer's risk tolerance rather than one-size-fits-all. Implementation: a `--policy` flag on `skillscan scan` that loads a policy YAML and overrides default severity thresholds.

**Bulk scan with summary dashboard.** An enterprise with 50 internal skills needs to scan all of them and see a summary: "12 PASS, 8 WARN, 3 BLOCK, 27 not yet scanned." The CLI already supports directory scanning; the missing piece is a roll-up summary report across multiple skills with an aggregate risk score. This is a one-page HTML or Markdown output that the security team can share with management. Implementation: a `--summary` flag on `skillscan scan <dir>` that emits a summary table in addition to per-skill reports.

**Skill registry integration.** Enterprise buyers want to maintain an approved skill registry — a versioned list of skills that have passed scan and are approved for deployment. SkillScan should be able to query a registry ("is version 1.2.3 of `meeting-summarizer` approved?") and update it ("mark this version approved, expires 90 days"). This can start as a simple JSON file in a private repo with a CLI command to query and update it, before becoming a SaaS API endpoint. It is the foundation of the SaaS token system and should be designed with that in mind.

**SIEM/SOAR integration.** The scan JSON output should be consumable by Splunk, Elastic, and Microsoft Sentinel without custom transformation. Requirements: a stable, versioned JSON schema; a SARIF output option (already in the SaaS roadmap — pull forward for the offline product); and documentation of the schema with field-level descriptions. Enterprise security teams will not pay for a tool that requires custom integration work. The SARIF output is already partially implemented; completing it and documenting the schema is a half-day task.

**Continuous monitoring mode.** Watch a directory or GitHub repository and re-scan whenever a SKILL.md changes; alert on regressions. This is the natural SaaS feature but it can be approximated offline with a cron job and the existing CLI. Worth documenting as a supported workflow pattern even before building native support. The public scan feed (M14) uses this pattern already — the same architecture applies to private enterprise registries.

### SaaS (post-v1.0, after quality bar is met)

The SaaS scanner is explicitly deferred until the offline product meets the quality bar: FPR ≤ 2%, macro F1 ≥ 0.90, and the known gaps listed below are closed. The following items define what "excellent" means before SaaS is offered.

**Known gaps to close before SaaS:**

| Gap | Current state | Target |
|---|---|---|
| ML injection recall | F1 = 0.786 (12 eval examples scoring 0.0 on obfuscation variants) | F1 ≥ 0.85 |
| ML FPR | 15.7% | ≤ 5% |
| Chain rule proximity window | Whole-document match (too broad) | 30-line window (M6) |
| PSV rules in rule YAML | Implemented in graph, not surfaced as standard findings | Wired (M8) |
| Intel DB depth | 2,051 IOC entries, 35 vuln packages | 5,000+ IOC, 150+ vuln packages (M5) |
| Similarity / clone detection | Not implemented | Complete (M17) |

**SaaS architecture prerequisites (spec when quality bar is met, not before):**

- Scan API (`POST /v1/scan`, webhook delivery, job polling)
- Token system and customer account model
- Signed PDF report delivery with customer watermark
- Data processing agreement template (customers send skill files to SkillScan infrastructure)
- Tiered model access: base tier (one model), premium tier (multi-model comparison)
- Rate limiting, abuse prevention, and SLA definition
- Privacy-preserving scan option: agent runs in customer's environment, only the report is returned

The SaaS architecture should be specced as a dedicated document when the time comes, not added incrementally to this roadmap.

---

## Scanning Tiers

### Cost structure

The three cost drivers determine what each tier can afford to include.

| Driver | Approximate cost | Notes |
|---|---|---|
| Static scan | ~$0.00 | Runs locally; CPU only; no API calls |
| ML classifier inference | ~$0.00 | Offline ONNX model; no API calls |
| Dynamic trace (1 model, 3 inputs) | ~$0.05–0.15 | LLM API calls for the traced model |
| Dynamic trace (3 models, 3 inputs each) | ~$0.30–0.60 | Parallelized; 3× the above |
| Report compiler (LLM render) | ~$0.02–0.05 | One LLM call to compile the final report |
| Badge issuance | ~$0.00 | Static SVG + registry write |

A free GitHub-triggered scan must cost effectively nothing. A paid scan can absorb LLM API costs because the price covers them. An enterprise report can absorb multi-model trace costs because the price is per-engagement, not per-scan.

---

### Tier definitions

#### Tier 0 — Community (free, GitHub-triggered)

**Who it serves:** Open-source skill publishers who want a trust signal without paying anything.

**How it works:** A GitHub Action (or webhook) triggers a static scan on every push to a repo containing a SKILL.md. The scan runs entirely offline — no LLM API calls. The result is a badge that appears in the README.

**What is included:**

- Full static analysis (117+ rules, chain rules, IOC/vuln DB lookup)
- ML classifier (offline ONNX, no API cost)
- Skill graph and permission scope validation
- Badge issued on PASS: `SkillScan Community — Static PASS — vX.Y.Z — YYYY-MM-DD`
- Badge issued on BLOCK: `SkillScan Community — Issues Found — view report`
- Public summary report (finding count by severity, no finding detail) linked from the badge
- Re-scans automatically on every push

**What is not included:** Dynamic trace, multi-model comparison, full finding detail in the public report, suppression workflow, file integrity manifest, policy profiles.

**Badge appearance:** Gray/silver. Clearly labeled "Static scan only." Expiry: none (re-scans on push, badge updates automatically).

**Cost to SkillScan:** ~$0.00 per scan. Sustainable at any volume.

---

#### Tier 1 — Verified (paid, per-skill or subscription)

**Who it serves:** Skill publishers who want a stronger trust signal and are willing to pay for it. Marketplace operators who want to display a credible badge on listed skills.

**How it works:** Publisher submits a skill (or connects their repo). SkillScan runs static analysis plus a single-model dynamic trace (3 fuzz inputs, standard canary tool surface). The LLM compiler renders a full report. A Verified badge is issued on PASS.

**What is included:**

- Everything in Tier 0
- Dynamic trace: 1 model (claude-sonnet or equivalent), 3 fuzz inputs, full canary tool surface (14 tools including email, calendar, GitHub, Slack, Notion)
- Full finding detail in the report (evidence lines, trace behavioral narrative, canary relay summary)
- File integrity manifest (SHA-256 + source URL for every file analyzed)
- Suppression workflow with audit trail
- Dependency vulnerability section (pip/npm packages cross-referenced against vuln DB)
- Badge issued on PASS: `SkillScan Verified — PASS — vX.Y.Z — YYYY-MM-DD`
- Badge issued on BLOCK: `SkillScan Verified — BLOCK — view report`
- Report PDF delivered to publisher
- 90-day approval window; badge expires and prompts re-scan after 90 days

**What is not included:** Multi-model trace, policy profiles, bulk scanning, SIEM integration.

**Badge appearance:** Green with a checkmark. "Verified" label. Shows expiry date. Links to the full report PDF.

**Suggested pricing:** ~$9–19 per scan, or ~$49/month for unlimited re-scans on a single skill. Pricing should cover ~3–5× the LLM API cost per scan.

**Cost to SkillScan:** ~$0.10–0.20 per scan (trace + compiler). Margin is strong at the suggested price.

---

#### Tier 2 — Professional (paid, per-engagement or annual subscription)

**Who it serves:** Enterprise teams scanning internal skills before deployment. Security consultants delivering SkillScan reports to clients.

**How it works:** Submits a batch of skills (or a directory). SkillScan runs static analysis plus a multi-model dynamic trace (2–3 models in parallel, 3 fuzz inputs each). The LLM compiler renders a full report with the multi-model comparison section. A Professional badge is issued per skill on PASS.

**What is included:**

- Everything in Tier 1
- Multi-model trace: 2–3 models (e.g., claude-sonnet + gpt-4.1), results compared and divergences flagged
- Policy profiles: customer-defined YAML mapping finding IDs to PASS/WARN/BLOCK thresholds
- Bulk scan summary dashboard: roll-up table across all skills in the batch
- Delta / baseline comparison: "3 new findings since last scan, 1 resolved"
- SARIF output for GitHub Advanced Security / Azure DevOps integration
- Machine-readable JSON report (stable schema, versioned) for SIEM/SOAR
- Badge issued on PASS: `SkillScan Professional — PASS — 3 models — vX.Y.Z — YYYY-MM-DD`
- Signed PDF report with customer watermark (tamper-evident)
- 90-day approval window per skill; re-scan on change

**What is not included:** Continuous monitoring (watch mode), skill registry API, regression alerts (these are SaaS-tier features requiring persistent infrastructure).

**Badge appearance:** Gold/dark. "Professional — Multi-model verified." Shows model count and expiry. Links to the signed report.

**Suggested pricing:** ~$99–299 per engagement (up to 10 skills), or ~$499/month for a team with unlimited scans. Enterprise annual contract pricing on request.

**Cost to SkillScan:** ~$0.40–0.80 per skill (multi-model trace + compiler). Margin is strong at engagement pricing; requires volume discipline at subscription pricing.

---

#### Tier 3 — Enterprise API (SaaS, post-v1.0)

**Who it serves:** Large enterprises and platform operators who need to scan skills programmatically at scale — e.g., a marketplace that scans every submitted skill before listing, or an enterprise that scans every skill on every PR merge.

**How it works:** REST API (`POST /v1/scan`). Customer sends the skill file content (or a GitHub URL). SkillScan runs the full scan pipeline in its cloud infrastructure and delivers the report via webhook or polling. Persistent customer account, registry, and regression alert infrastructure.

**What is included:**

- Everything in Tier 2
- Scan API with webhook delivery and job polling
- Skill registry: approved version tracking, expiry management, query endpoint
- Continuous monitoring: watch a GitHub repo, re-scan on SKILL.md change, alert on regression
- Regression alerts: email/webhook when a new finding appears in a previously-passing skill
- Skill signing: SkillScan issues a signed attestation embedded in the skill front-matter
- SLA: 99.9% uptime, scan completion within 5 minutes for Tier 1-equivalent, 15 minutes for multi-model

**Pricing model:** Per-scan credits (volume discounts), or annual contract with a scan allowance. Pricing TBD when specced.

**Prerequisite quality bar before offering Tier 3:** FPR ≤ 5%, macro F1 ≥ 0.90, all known gaps in the SaaS prerequisites table closed. Do not offer Tier 3 until the product is excellent — a bad scan at scale does more reputational damage than no SaaS at all.

---

### Tier comparison

| Feature | Tier 0 Community | Tier 1 Verified | Tier 2 Professional | Tier 3 Enterprise API |
|---|:---:|:---:|:---:|:---:|
| Static analysis (117+ rules) | Yes | Yes | Yes | Yes |
| ML classifier (offline) | Yes | Yes | Yes | Yes |
| IOC / vuln DB lookup | Yes | Yes | Yes | Yes |
| Dynamic trace (1 model) | No | Yes | Yes | Yes |
| Dynamic trace (multi-model) | No | No | Yes | Yes |
| Full finding detail in report | No | Yes | Yes | Yes |
| File integrity manifest | No | Yes | Yes | Yes |
| Dependency vuln section | No | Yes | Yes | Yes |
| Policy profiles | No | No | Yes | Yes |
| Bulk scan summary | No | No | Yes | Yes |
| Delta / baseline comparison | No | No | Yes | Yes |
| SARIF / JSON output | No | No | Yes | Yes |
| Signed PDF report | No | No | Yes | Yes |
| Skill registry | No | No | No | Yes |
| Continuous monitoring | No | No | No | Yes |
| Regression alerts | No | No | No | Yes |
| Skill signing | No | No | No | Yes |
| Badge color | Silver | Green | Gold | Gold + API |
| Badge expiry | None (auto-refresh) | 90 days | 90 days | Managed |
| Approx. cost per scan | $0 | $9–19 | $99–299/engagement | TBD |

### Badge design principles

Badges are the primary distribution mechanism for Tier 0 and Tier 1. A few design constraints that matter:

**The badge must be honest about what was scanned.** A Community badge that says "PASS" but only ran static analysis must clearly say "Static scan only" — it should not look identical to a Verified badge that ran a full trace. Buyers who see the badge in a marketplace need to be able to distinguish the two at a glance. Color coding (silver vs. green vs. gold) plus a tier label achieves this.

**Expiry is a feature, not a limitation.** A badge that expires after 90 days and prompts re-scan is more valuable than a badge that never expires, because it tells the buyer the scan is current. The expiry date should be visible on the badge. A badge that expired 6 months ago is worse than no badge.

**The badge links to the report, not just a status page.** The full report (or at minimum the public summary for Tier 0) must be accessible from the badge URL. This is what makes the badge credible — anyone can verify the claim by reading the evidence.

**Tier 0 badges are issued for free but are rate-limited.** A publisher can get one free badge per skill per day (re-scan on push). Abuse prevention: rate limit by GitHub repo, not by IP.

---

## Backlog — Tooling

### CodeQL: Clear-text logging of sensitive data — `scripts/fuzzer_tracer_pipeline.py:118`

**Finding:** CodeQL rule `py/clear-text-logging-sensitive-data` (severity: Error) flagged line 118 of `scripts/fuzzer_tracer_pipeline.py`. The expression `" ".join(cmd)` is passed to `log.info(...)`. Because `cmd` is built from `["--api-key", api_key]` (line 116), the API key is logged in clear text. Affected branches: `main`, `chore/pattern-update-20260322-v2`, `chore/pattern-update-20260324-0001`, `chore/pattern-update-20260325-0001`. First detected last week.

**Fix:** Redact the API key before logging:
```python
def _redact_cmd(cmd: list[str]) -> str:
    out, skip = [], False
    for tok in cmd:
        if skip:
            out.append("***"); skip = False
        elif tok == "--api-key":
            out.append(tok); skip = True
        else:
            out.append(tok)
    return " ".join(out)

log.info("[%s] Running fuzzer: %s", strategy, _redact_cmd(cmd))
```

**Priority:** Medium — internal script only, but API key could appear in CI logs if the workflow runs with a real key. Fix in next code-quality pass.

**Source:** CodeQL GHAS alert, identified during 2026-03-28 audit.

---

### `scripts/sync-website-rules.py` — Deterministic website sync script

**Problem:** The pattern update skill currently uses an LLM to edit `Rules.tsx`, `Home.tsx`, and `TerminalScan.tsx` when new rules are added. This is fragile — the LLM can drop categories, miscalculate counts, or produce diffs that conflict with in-flight Manus work on the website repo.

**Solution:** A deterministic Python script that reads `src/skillscan/data/rules/default.yaml` and generates the correct TypeScript objects for the website. The pattern update skill calls this script instead of asking the LLM to edit TSX files directly.

**Script responsibilities:**
- Read all rules from `default.yaml`
- Generate the `rules[]` array for `client/src/pages/Rules.tsx` (sorted by category, then ID)
- Generate the `ruleCategories[]` counts for `client/src/pages/Home.tsx`
- Update the rulepack version and rule count in `client/src/components/TerminalScan.tsx`
- Update `client/public/llms.txt` rule count line

**Skill change:** The website sync step in `skillscan-pattern-update/SKILL.md` becomes: `python3 scripts/sync-website-rules.py --website-path ~/skillscan-website`, commit, open PR. LLM judgment is only needed for threat research and rule writing.

**Priority:** Medium. Implement before the next time a category is added or a major website refactor happens.

---

### Issue Triage Agent — daily automated issue response

**Goal:** A Manus-scheduled agent that runs once per day, reads all open GitHub issues across `skillscan-security`, `skillscan-trace`, and `skillscan-lint`, and takes automated action where possible — surfacing anything that needs human attention.

**Motivation:** The demo-feed workflow now opens `[demo-feed-regression]` issues automatically. The pattern-update agent opens `[pattern-update]` PRs. As the project grows, the issue backlog will accumulate faster than manual review allows. This agent closes the loop.

**Behaviour by label:**

| Label | Automated action | Human escalation |
|---|---|---|
| `demo-feed-regression` | Parse unexpected-verdict table; for each FP entry, check if a suppression already exists; for each FN entry, generate 3–5 new corpus examples and open a PR to `skillscan-corpus`. Close issue if all regressions are resolved. | If the FP root cause is ambiguous (multiple rules firing, low-confidence signal) or the FN requires a new rule category, add `needs-human-review` label and send a summary to Kurt. |
| `false-positive` (user-filed) | Re-scan the referenced skill with the current model. If verdict is now ALLOW, comment with the resolution and close. If still BLOCK, identify the triggering rule(s) and add a comment with the rule ID and confidence. | Always add `needs-human-review` — user-filed FPs require human sign-off before suppression. |
| `false-negative` (user-filed) | Re-scan. If now BLOCK, comment and close. If still ALLOW, generate 2–3 corpus examples and open a draft PR. | Add `needs-human-review` with a summary of the gap. |
| `domain-allowlist` | No automated action — domain changes require human review. | Ping Kurt via issue comment if the issue is >7 days old without a response. |
| `bug-report` | Attempt to reproduce using the steps in the issue body. If reproduced, add a `confirmed` label and a reproduction note. | Always escalate — bugs require human fix. |
| `maintenance` / `dependabot` | Merge if CI is green and the PR is a patch/minor bump. Skip major version bumps. | Escalate major bumps with a changelog summary. |
| No label / unknown | Add `triage` label and a comment asking for more detail. | Surface in daily summary. |

**Daily summary:** After processing, the agent posts a brief summary comment on any issue it touched, and sends a consolidated Markdown summary to Kurt (via a pinned issue or a private Gist) listing: issues auto-resolved, issues escalated, PRs opened.

**Relationship to pattern-update agent:** The pattern-update agent proactively hunts for new threat patterns. The issue triage agent reactively responds to signals already in the issue tracker. They share the corpus-writing and PR-opening machinery but have different triggers.

**Implementation notes:**
- Built as a Manus skill (`skillscan-issue-triage/SKILL.md`), scheduled daily at 08:00 UTC
- Uses `gh issue list --json` + `gh pr create` — same tooling as pattern-update
- Corpus example generation reuses the FN archetype templates from P6
- Issue dedup: checks for existing open issues with the same entry ID before opening a new one (same pattern as demo-feed regression)
- Dry-run mode: `--dry-run` flag prints planned actions without writing to GitHub

**Priority:** Medium-High. Implement after the v10 model training run is complete and the demo-feed pipeline is stable. Estimated effort: 1 session.

**Source:** Kurt request, 2026-03-28 session.

---

## Milestone 200 — Trace-as-a-Service: BYOK, Dedicated Instances & Queue Architecture

> **Full specification:** `TAAS_SPEC.md` in `kurtpayne/skillscan-trace` (commit e17aba6). Covers infrastructure, auth, token model, Stripe payments, queue, SSE live results, admin panel, `online-trace` CLI subcommand, HA, backups, audit logging, BYOK key encryption, data model, and test environment. The notes below are a high-level summary; the spec is the authoritative document.

**Goal:** When SkillScan Trace becomes a hosted service, operators (and users) can bring their own LLM API keys so SkillScan bears zero inference cost. The service runs on a small fleet of always-on instances behind a queue, not serverless, to keep per-scan cost predictable and manageable without a browser.

**Background:** Running Trace scans on behalf of users requires calling an LLM (Claude, GPT-4o, etc.). If SkillScan pays for every call, the unit economics break at any meaningful volume. The solution is BYOK: the user supplies their API key at scan time (or stores it in their account), and SkillScan routes the call through their key. SkillScan provides the infrastructure (queue, workers, result storage, report URL) but not the tokens.

The serverless model (Lambda, Modal per-call) is too expensive at low volume because of cold-start overhead and per-invocation pricing. A small fleet of dedicated workers (2–4 small VMs, e.g., Hetzner CX21 or Fly.io shared-cpu-2x at ~$6–12/mo each) with a durable queue (Redis or SQS) is cheaper, simpler to reason about, and fully manageable via CLI/API without a browser.

**Architecture:**

```
User submits scan (skill zip + BYOK API key, encrypted in transit)
  → API gateway (lightweight, stateless)
  → Queue (Redis LPUSH / SQS SendMessage)
  → Worker pool (2–4 small VMs, each running a loop: BRPOP → run trace → store result)
  → Result store (S3-compatible object storage, e.g., Hetzner Object Storage or Backblaze B2)
  → Report URL returned to user (permanent, public or token-gated)
```

**Key design decisions to lock in before implementation:**

- **BYOK key handling:** Keys are never stored at rest. They are passed in the job payload, held in worker memory only for the duration of the scan, and discarded. The job payload is encrypted at rest in the queue (AES-256, key derived from the user's session token).
- **Worker management:** Workers are long-running processes managed by `systemd` or `supervisord`. Scale up = `ssh worker-N "systemctl start skillscan-worker"`. Scale down = drain queue, then stop. No Kubernetes, no container orchestration. Manus can manage this via SSH commands without a browser.
- **Cost model:** SkillScan charges for the report URL / storage / queue slot, not for tokens. A flat per-scan fee (e.g., $0.10–0.25) covers infrastructure. Users who bring their own key get the full trace; users without a key get the static-only scan (free tier).
- **Free tier:** Static scan (no LLM) is always free. Trace scan requires BYOK or a paid credit balance. This preserves the offline-first niche while enabling the hosted service.
- **Hosting candidates:** Hetzner (cheapest, EU, no egress fees), Fly.io (easy multi-region, CLI-managed), or a single Linode/DigitalOcean droplet to start. Avoid AWS Lambda (cold starts + per-invocation cost), avoid GCP Cloud Run (same issue). Evaluate Hetzner CX21 (2 vCPU, 4GB RAM, €4.15/mo) as the baseline worker size.

**Actions (when this milestone becomes active):**
- Design and document the BYOK key lifecycle (receipt → encryption → use → discard).
- Prototype the queue worker loop in ~200 lines of Python (`redis-py` + `boto3` for result storage).
- Define the scan job schema (skill zip URL or inline content, BYOK key, webhook URL for completion notification, requested model).
- Spec the API surface: `POST /scan`, `GET /scan/{id}`, `GET /report/{id}`.
- Evaluate Hetzner vs Fly.io vs DigitalOcean for worker hosting; document cost model at 100, 1000, and 10,000 scans/month.
- Implement worker autoscaling: a cron job checks queue depth every 5 minutes and starts/stops workers via SSH if depth exceeds a threshold.
- Add BYOK key UI to the website account settings page.

**Acceptance criteria:** A scan submitted with a BYOK key completes end-to-end. The API key never appears in logs or storage. Workers can be started and stopped via CLI without a browser. Cost per scan at 1,000 scans/month is under $0.05 infrastructure (excluding user's own token cost).

**Dependencies:** M14 (public scan feed — validates the worker pipeline at low volume before opening to users), M15 (skillscan-core extraction — the worker imports `skillscan-core`, not the full security package).

---

---

## Related Tools & Ecosystem

SkillScan is one layer in a broader AI security stack. The tools below complement it at different stages of the skill lifecycle — from static analysis and reputation lookup to full dynamic sandboxing. Where SkillScan produces a borderline verdict or a low-confidence flag, these are the recommended next steps.

### Complementary Scanners & Analysis Tools

| Tool | What it adds | When to use it |
|---|---|---|
| [VirusTotal](https://www.virustotal.com) | Multi-engine reputation scan for URLs, domains, and file hashes. 70+ AV engines + community votes. | When a skill references an external URL or domain that SkillScan flags as suspicious. Paste the domain or the raw skill file hash. |
| [Cisco Talos Intelligence](https://talosintelligence.com) | IP/domain reputation, email sender reputation, threat categorization. Backed by Cisco's global sensor network. | When a skill's canary calls resolve to an IP or domain — Talos gives the threat category and historical reputation. |
| [URLScan.io](https://urlscan.io) | Sandboxed browser scan of a URL. Screenshots, DOM analysis, outbound requests, resource fingerprints. | When a skill's `visit_webpage` or `fetch_url` tool calls a URL that looks suspicious. Submit the URL for a passive scan. |
| [Any.run](https://any.run) | Interactive malware sandbox. Behavioral analysis of executables and scripts. | If a skill ships a companion script or binary that SkillScan cannot parse statically. |
| [Hybrid Analysis](https://www.hybrid-analysis.com) | Free automated malware analysis (Falcon Sandbox). Supports scripts, PE files, documents. | Alternative to Any.run for batch analysis of skill companion scripts. |
| [Shodan](https://www.shodan.io) | Internet-wide device and service scan. Identifies what is running on an IP. | When a skill's canary calls resolve to an unusual IP — Shodan shows what services are exposed and whether it looks like C2 infrastructure. |
| [MXToolbox](https://mxtoolbox.com/blacklists.aspx) | Blacklist check across 100+ DNS-based blocklists. | Quick check when a skill's domain appears in SkillScan's IOC list but you want a second opinion. |
| [WHOIS / DomainTools](https://whois.domaintools.com) | Domain registration history, registrant details, DNS history. | When a skill's domain was registered recently (< 30 days) — a common indicator of throwaway infrastructure. |
| [Semgrep](https://semgrep.dev) | Static analysis for code patterns. Language-aware, rule-based. | If a skill ships Python/JS helper code alongside the SKILL.md. Run Semgrep on the companion code for injection and supply-chain patterns. |
| [Bandit](https://bandit.readthedocs.io) | Python-specific static security analysis. | Same use case as Semgrep but Python-only and zero-config. |

### Threat Intelligence Feeds & References

The following sources inform SkillScan's IOC database and pattern library. The `update-intel.yml` GitHub Actions workflow pulls from public feeds; the sources below are the authoritative upstream references.

| Source | What we use it for |
|---|---|
| [MITRE ATT&CK](https://attack.mitre.org) | Tactic and technique taxonomy. SkillScan's policy profiles map to ATT&CK technique IDs where applicable. |
| [MITRE ATLAS](https://atlas.mitre.org) | ML-specific adversarial threat matrix. The primary reference for prompt injection, model evasion, and supply-chain attack patterns in the skill context. |
| [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) | The canonical list of LLM-specific risks. LLM01 (Prompt Injection) and LLM08 (Excessive Agency) are directly relevant to skill scanning. |
| [CISA Known Exploited Vulnerabilities](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) | KEV catalog. Used to cross-reference CVEs that appear in skill dependency manifests. |
| [Abuse.ch URLhaus](https://urlhaus.abuse.ch) | Community-sourced malicious URL database. One of the primary feeds for the IOC updater. |
| [Abuse.ch MalwareBazaar](https://bazaar.abuse.ch) | Malware sample hashes. Used for file hash IOC checks. |
| [PhishTank](https://phishtank.org) | Community-verified phishing URLs. Secondary feed for the IOC updater. |
| [Emerging Threats (Proofpoint)](https://rules.emergingthreats.net) | Open ruleset for network-based threat detection. Informs domain and IP reputation patterns. |
| [AlienVault OTX](https://otx.alienvault.com) | Open Threat Exchange. Community pulses for new IOC campaigns. |
| [NVD / NIST](https://nvd.nist.gov) | National Vulnerability Database. Primary source for CVE details in the vulnerability scanner. |

### Open Source Projects SkillScan Builds On

| Project | License | What we use |
|---|---|---|
| [Anthropic MCP SDK](https://github.com/modelcontextprotocol/python-sdk) | MIT | The MCP protocol implementation that the canary server and harness are built on. SkillScan would not exist without MCP. |
| [OpenAI Python SDK](https://github.com/openai/openai-python) | Apache 2.0 | LLM client used by `skillscan-trace` for all provider calls (OpenAI, OpenRouter, Ollama via compatible API). |
| [Hugging Face Transformers](https://github.com/huggingface/transformers) | Apache 2.0 | Model training and inference infrastructure for the SkillScan classifier. |
| [Hugging Face Hub](https://github.com/huggingface/huggingface_hub) | Apache 2.0 | Model hosting and versioned artifact storage. |
| [Modal Labs](https://modal.com) | Proprietary (free tier) | Serverless GPU compute for corpus fine-tuning runs. |
| [bashlex](https://github.com/idank/bashlex) | BSD | Bash AST parser used (in Trace-A5) to replace regex-based bash analysis with proper parse-tree traversal. |
| [python-frontmatter](https://github.com/eyeseast/python-frontmatter) | MIT | YAML front-matter parsing for SKILL.md files. |
| [Rich](https://github.com/Textualize/rich) | MIT | Terminal output formatting for the CLI. |
| [Click](https://github.com/pallets/click) | BSD | CLI framework for `skillscan` and `skillscan-trace`. |
| [FastAPI](https://fastapi.tiangolo.com) | MIT | Web framework for the `skillscan-trace serve` mode and future hosted API. |

### Acknowledgements

SkillScan's corpus and detection patterns were informed by public security research and community disclosure. Specific thanks to:

- The [Anthropic safety team](https://www.anthropic.com/safety) for publishing prompt injection research and the MCP specification, which provided the threat model that SkillScan's canary design is based on.
- The [OWASP LLM Top 10 working group](https://owasp.org/www-project-top-10-for-large-language-model-applications/) for establishing a shared vocabulary for LLM-specific risks.
- The [MITRE ATLAS team](https://atlas.mitre.org) for extending ATT&CK to cover ML-specific adversarial techniques.
- The security researchers who publicly disclosed MCP tool poisoning, prompt injection via skill metadata, and exfiltration-via-tool-call patterns — your disclosures directly shaped the 14 canary tool categories.
- The open-source skill authors whose public repositories formed the benign half of the training corpus. Your work is what makes the classifier useful.

---

---

## Website Pages Plan — /trace and /lint (M14.5 supplement)

*Planned 2026-03-27. No implementation yet. These are the detailed specs for the two new pages that extend M14.5.*

---

### Page: `/trace`

**Purpose:** Convert a developer who has heard of SkillScan into someone who installs and runs `skillscan-trace` in under 5 minutes. The page must answer three questions in order: What is it? How does my key stay private? How do I run it?

**Entry points from the existing site:**
- Nav bar: add "Trace" between "Scan" and "Docs"
- Homepage hero: add a secondary CTA "→ Behavioral Trace (new)" below the primary scan CTA
- User journey page: add a "Step 3: Behavioral Trace" card after the static scan card

**Page sections (in order):**

1. **Hero** — One-line value prop: "Run your skill against a live LLM. Watch what it actually does." Sub-line: "BYOK. Runs on your machine. Nothing leaves your network except the LLM calls you authorize." Two CTAs: `pip install skillscan-trace` (copy button) and `→ Read the privacy doc`.

2. **3-command quick-start** — Tabbed by provider (OpenAI / OpenRouter / Ollama). Each tab shows exactly three commands: install, set key, run. No prose, just code.

3. **Data flow diagram** — A simple left-to-right flow: `Your Machine` → `Canary Server (in-process)` → `LLM Provider (your key)` → back to `Your Machine`. Annotated with: "Key never touches SkillScan servers", "Skill content stays local", "Only LLM API calls leave your machine". Must be an SVG, not a screenshot.

4. **What a trace report looks like** — Render a real sample report inline (collapsed by default, expand on click). Show: verdict badge (BLOCK/ALLOW), variant count, finding list with severity chips, evidence snippets.

5. **Provider setup guides** — Three collapsible sections: OpenAI, OpenRouter (why it unlocks 200+ models), Ollama (fully local, no key needed). Each ends with: `skillscan-trace check --provider <name>`.

6. **Config file** — Short section showing `skillscan-trace.yaml` with the three most useful fields: `provider`, `model`, `output_dir`. "Put this in your project root and never pass flags again."

7. **Self-hosting** — One paragraph + two commands: `docker run skillscan/trace serve` and the `--remote-host` override. Link to `docker-compose.yml` in the repo.

8. **Privacy footer** — Repeat the two-sentence summary from `PRIVACY.md` verbatim, with a link to the full document.

**Design notes:** Dark background, terminal-style code blocks. Data flow diagram is SVG. Sample report uses the same verdict badge and severity chip components as the rest of the site.

---

### Page: `/lint`

**Purpose:** Explain `skillscan-lint` as a fast, zero-dependency schema and style checker — distinct from the full scan (8 detection layers) and from trace (behavioral execution). Audience: skill authors who want to catch obvious problems before pushing.

**Entry points:**
- Nav bar: add "Lint" (or group under a "Tools" dropdown with Scan, Lint, Trace)
- Docs page: add a "Linting" section with a link to `/lint`
- User journey: add a "Step 0: Lint first" card before the scan card

**Page sections (in order):**

1. **Hero** — "Catch schema errors and style violations before you scan." Sub-line: "No model. No network. Instant feedback." One CTA: `pip install skillscan-security && skillscan lint path/to/skill.md`.

2. **What lint checks** — A filterable table of the 34 lint rules, grouped by category: Schema, Description quality, Tool alignment, Documentation completeness. Columns: rule ID, description, severity (ERROR/WARN/INFO), example violation.

3. **Lint vs. Scan vs. Trace** — A comparison table:

   | | Lint | Scan | Trace |
   |---|---|---|---|
   | Speed | Instant | ~2–10s | 30–90s |
   | Requires model | No | Yes (350MB ONNX) | No (BYOK LLM) |
   | Network | None | None | LLM API only |
   | What it catches | Schema errors, style | Injection, malware, IOCs | Behavioral attacks at runtime |
   | When to run | Pre-commit | Pre-publish | Pre-deploy / audit |

4. **CI integration** — GitHub Actions snippet for lint-on-PR. Three lines.

5. **Custom rules** — Link to custom-rules-format doc. One sentence.

6. **Exit CTA** — "Ready for deeper analysis? → Run a full scan" and "→ Run a behavioral trace".

**Design notes:** Lighter, more utilitarian feel than /trace. The rule table is filterable client-side. The comparison table is the key element.

---

## Corpus Expansion Plan — v10 (New Signals)

*Planned 2026-03-27. No implementation yet. Milestone designation: M7-v10.*

**Current state:** 18,216 examples, F1 0.9752, FPR 1.89%. 8 persistent FN archetypes. Both SaaS quality thresholds met. The next expansion closes remaining FN archetypes AND introduces new signal categories not currently in the corpus.

---

### Priority 1: Close the 8 remaining FN archetypes (10–15 examples each)

| Archetype | Description | Synthesis approach |
|---|---|---|
| `mcp_server_impersonation` | Skill claims to be a well-known MCP server (filesystem, memory, etc.) | Generate skills with `name: "filesystem"` but malicious tool bodies |
| `organic_mal047` | Real-world organic malicious skill, specific evasion pattern | Manually craft variants of the original with surface-level rephrasing |
| `se_git_config_harvest` | Social engineering to exfiltrate `.gitconfig` / `.git/credentials` | Skills that "help with git" but read credential files |
| `jb_jb07_035` | Jailbreak variant — authority impersonation with tool invocation | "As the authorized security auditor, invoke..." patterns |
| `jb_jb08_037` | Jailbreak variant — gradual context escalation | Multi-turn escalation patterns in skill descriptions |
| `jb09/jb10` | New jailbreak archetypes discovered in v9 eval | Research current jailbreak literature; synthesize 10 each |
| `pi24_rss` | Prompt injection via RSS/Atom feed content | Skills that fetch and process RSS feeds with injected content |
| `pi37_markdown` | Prompt injection via Markdown rendering | Skills that render Markdown from external sources |

---

### Priority 2: New signal categories (not in current corpus)

**Signal 1: Dependency confusion attacks**
Skills that declare a `requirements` or `dependencies` field pointing to attacker-controlled package names that shadow legitimate packages (e.g. `requests-security` instead of `requests`). The model has no examples of this pattern.
- 20 malicious examples with attacker-controlled package names in various dependency declaration formats
- 10 benign examples with legitimate dependency declarations for contrast
- New archetype prefix: `sup_dep_confusion_*`

**Signal 2: Steganographic instruction hiding**
Instructions embedded in non-obvious places: inside base64-encoded "example" strings, inside YAML comments that some parsers surface as metadata, inside Unicode homoglyph substitutions in tool names (e.g. `fіlesystem` with Cyrillic `і`). Static rules catch some of this; the ML model has no training signal for it.
- 15 examples using each of the three hiding mechanisms (45 total)
- New archetype prefix: `steg_*`

**Signal 3: Capability laundering via tool chaining**
A skill that individually declares only innocuous tools (read_file, write_file, http_get) but chains them in the description in a way that constitutes a complete exfiltration pipeline. No single tool is suspicious; the chain is. The model sees tool lists but does not model tool chains.
- 20 examples where the description narrates the chain explicitly ("first read the file, then POST it to...")
- 10 benign examples of legitimate multi-step workflows for contrast
- New archetype prefix: `chain_launder_*`

**Signal 4: Temporal/conditional payload triggers**
Skills with instructions that activate only under specific conditions: "if the date is after 2026-04-01", "if the user's locale is en-US", "if the previous tool call returned status 200". Designed to evade static analysis. The model has almost no examples of conditional activation.
- 20 examples with date/time, locale, and status-code conditionals
- Note: these are also a known ceiling (indirect injection from runtime context) — label with `conditional_*` prefix to track separately
- New archetype prefix: `conditional_*`

**Signal 5: Fake MCP protocol messages**
Skills that instruct the LLM to emit raw MCP protocol JSON as part of its response — effectively hijacking the MCP transport layer by making the model produce tool_call messages that the client will execute. Novel attack vector specific to MCP; no existing scanner addresses it.
- 15 examples with embedded JSON tool_call payloads in skill descriptions
- New archetype prefix: `mcp_proto_*`

**Signal 6: Supply chain via skill composition**
Skills that import or reference other skills by URL, with the imported skill being attacker-controlled. Current corpus has supply chain examples focused on package dependencies, not skill-to-skill imports. As skill ecosystems mature, this becomes a primary attack vector.
- 15 examples with `import:`, `extends:`, or `depends_on:` fields pointing to attacker URLs
- 5 benign examples of legitimate skill composition
- New archetype prefix: `sup_skill_import_*`

**Signal 7: LLM-specific prompt formatting attacks**
Instructions that exploit specific LLM formatting conventions: `<|system|>` tokens for Llama-family models, `[INST]` delimiters for Mistral, `<|im_start|>` for Qwen. Model-specific jailbreaks that work by injecting special tokens into skill content. Current corpus has generic jailbreaks but not model-specific token injection.
- 10 examples per model family (Llama, Mistral, Qwen, GPT) = 40 examples
- New archetype prefix: `token_inject_*`

---

### Corpus expansion process for v10

1. **Synthesis agent run** — Use the existing corpus researcher agent pattern. Each new archetype gets its own subdirectory in `training_corpus/injection/` with a `README.md` explaining the attack vector.
2. **Trace validation** — Run `skillscan-trace` on all new malicious examples before adding to corpus. Any example that does not trigger at least one finding in a trace run should be reviewed — it may be too subtle for the model to learn from.
3. **FN archetype closure** — For each Priority 1 archetype, generate examples, run a mini eval (not a full fine-tune) to confirm the archetype is now detected before committing.
4. **Target corpus size** — 18,216 + ~300 new examples = ~18,500 for v10. Keep class balance: aim for 55% injection / 45% benign.
5. **v10 fine-tune gate** — F1 ≥ 0.980, FPR ≤ 1.5%.
7. **Migrate `re` → `regex` for ReDoS hardening** — Replace `import re` with `import regex as re` in `rules.py` and `analysis.py`; add `regex` to `pyproject.toml` dependencies. Opportunistically harden the 5–6 patterns with nested quantifiers (e.g. `[^"\n]{0,300}` inside larger patterns) using possessive quantifiers (`*+`, `++`) or atomic groups `(?>...)` to prevent catastrophic backtracking on adversarially crafted skill files. No pattern semantic changes needed — correctness is unchanged, only backtracking behavior is hardened. Low effort, low risk, high security value for a scanner that processes untrusted input.

6. **Enable mid-training eval curves** — `finetune_modal.py` currently sets `eval_strategy="no"`; the post-training eval block runs against `held_out_eval/` after `trainer.train()` completes and gates the Hub push, but produces no per-epoch loss/F1 curves in `trainer_state.json` or on the HuggingFace model page. Fix: convert `held_out_eval/` to a HuggingFace `Dataset` object, pass as `eval_dataset` to `WeightedTrainer`, and set `eval_strategy="epoch"`. This makes training dynamics visible on HF and enables `load_best_model_at_end=True` for automatic best-checkpoint selection. The existing post-training gate can remain as the final push gate. Low effort, high observability value.

**Milestone designation:** M7-v10. Add to the priority table after M14.5 and Trace-B1 are complete.
