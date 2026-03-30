---
name: skillscan-pattern-update
description: Automated security pattern update agent for the skillscan-security repository. Use when asked to update SkillScan rules, IOCs, vulnerability database, or run the pattern update agent. Searches for recent threats, adds detection rules, and creates PRs across the security, website, and corpus repos.
---

# SkillScan Pattern Update Agent

Run the full update cycle for `kurtpayne/skillscan-security`, `kurtpayne/skillscan-website`, and `kurtpayne/skillscan-corpus`.

## Repos

- **Security:** `kurtpayne/skillscan-security` — rules, IOCs, vuln DB, showcases, tests
- **Website:** `kurtpayne/skillscan-website` — static site at skillscan.sh, deployed via GitHub Pages on push to main
- **Corpus:** `kurtpayne/skillscan-corpus` (private) — training corpus, held-out eval samples, and organic eval holdouts. The `corpus/` directory in the security repo is gitignored; all corpus data lives here.

## Update Cycle

> **WARNING: The update cycle is NOT complete until ALL THREE repos are updated and PRs merged.**
> Every run MUST complete ALL steps 1–12, including the corpus update (step 9), website update (step 10), and deployment verification (step 11).

### 0. Recover GitHub credentials (ALWAYS run first)

The sandbox resets between sessions. The GitHub PAT and all other secrets are stored encrypted in the website repo. **Run this before any `gh` or `git push` command:**

```bash
# Guard: OWNER_OPEN_ID must be set — it is always injected by Manus
if [ -z "$OWNER_OPEN_ID" ]; then
  echo "ERROR: OWNER_OPEN_ID is not set. Cannot decrypt secrets. Aborting."
  exit 1
fi

# Clone the website repo if not already present (needed for the secrets file)
if [ ! -f ~/skillscan-website/private-docs/.secrets.enc ]; then
  # GH_TOKEN may be empty; use OWNER_OPEN_ID-derived auth is not yet available,
  # so try the Manus-injected GH_TOKEN first, then fall back to unauthenticated clone.
  GH_TOKEN="" gh repo clone kurtpayne/skillscan-website ~/skillscan-website 2>/dev/null || \
  git clone https://github.com/kurtpayne/skillscan-website.git ~/skillscan-website
fi

# Decrypt secrets — writes key=value pairs to ~/.skillscan-secrets
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 \
  -in ~/skillscan-website/private-docs/.secrets.enc \
  -pass env:OWNER_OPEN_ID \
  -out ~/.skillscan-secrets 2>&1
DECRYPT_EXIT=$?
if [ $DECRYPT_EXIT -ne 0 ] || grep -q 'Error getting password' ~/.skillscan-secrets 2>/dev/null; then
  echo "ERROR: Secrets decryption failed (exit $DECRYPT_EXIT). Check OWNER_OPEN_ID value."
  rm -f ~/.skillscan-secrets
  exit 1
fi
chmod 600 ~/.skillscan-secrets
source ~/.skillscan-secrets

# Guard: PAT must be non-empty after sourcing
if [ -z "$GITHUB_PAT" ]; then
  echo "ERROR: GITHUB_PAT is empty after sourcing secrets. Decryption may have produced garbage output."
  exit 1
fi

# Authenticate gh CLI
unset GH_TOKEN
echo "$GITHUB_PAT" | gh auth login --with-token

# Verify — this must show 'Logged in to github.com account kurtpayne'
gh auth status
```

> **Why this is needed:** `gh auth login` state is lost on sandbox reset. The encrypted secrets file in the private website repo is the canonical source of truth for the PAT. `OWNER_OPEN_ID` is always injected by Manus and never expires. The guards above ensure the skill fails loudly (exit 1) rather than silently proceeding with an empty PAT.

### 1. Clone and install

```bash
gh repo clone kurtpayne/skillscan-security ~/skillscan-security
cd ~/skillscan-security && sudo pip3 install -e ".[dev]"
gh repo clone kurtpayne/skillscan-website ~/skillscan-website
gh repo clone kurtpayne/skillscan-corpus ~/skillscan-corpus
```

Python 3.12 is required by pyproject.toml but 3.11 works for running. If install fails, temporarily `sed -i 's/requires-python = ">=3.12"/requires-python = ">=3.11"/' pyproject.toml`, install, then `git checkout pyproject.toml`.

### 2. Examine current state

Note the highest rule IDs per prefix (MAL-NNN, PINJ-NNN, etc.), current rulepack version in `default.yaml` line 1, and existing IOC/vuln entries.

### 3. Search for threats

Use `search` tool (not browser) with parallel subtasks for efficiency. Search categories:
- MCP/AI agent supply chain attacks
- npm/PyPI malware campaigns
- Prompt injection and tool poisoning
- IDE/editor security vulnerabilities
- OpenClaw/ClawHub flagged skills

Prefer `curl` and search APIs over browser for cost efficiency.

### 4. Determine actionable updates

For each threat, check if an existing rule already covers it. Only add rules for genuinely new patterns.

### 5. Apply changes — full checklist

When adding new rules, **all** of the following must be updated in a single PR. The `Pattern Update Guard` CI check enforces this:

| File | What to update |
|---|---|
| `src/skillscan/data/rules/default.yaml` | Bump `version:` (format `YYYY.MM.DD.N`), add new rule entries in `static_rules` |
| `src/skillscan/data/intel/ioc_db.json` | Add new domains, IPs, URLs |
| `src/skillscan/data/intel/vuln_db.json` | Add new vulnerability entries |
| `examples/showcase/{NN}_{name}/SKILL.md` | One showcase per new rule — must trigger the rule when scanned |
| `examples/showcase/INDEX.md` | Add row for each new showcase |
| `docs/EXAMPLES.md` | Add row for each new showcase in the coverage map table |
| `tests/test_rules.py` | Add test function with positive and negative assertions |
| `tests/test_showcase_examples.py` | Add `findings_NN = _scan(...)` + `assert any(f.id == ...)` for each showcase |
| `PATTERN_UPDATES.md` | Prepend new dated entry with sources, event summary, rule details, IOC/vuln/corpus updates |

### 6. Validate showcases match rules

Before committing, verify each showcase triggers its rule:

```python
from pathlib import Path
from skillscan.analysis import scan
from skillscan.policies import load_builtin_policy
p = load_builtin_policy('strict')
r = scan(Path('examples/showcase/NN_name'), p, 'builtin:strict')
assert any(f.id == 'RULE-ID' for f in r.findings)
```

Common pitfalls:
- Regex `\b` word boundary won't match if the keyword is inside a variable name (e.g., `$denoPath` won't match `\bdeno\b`)
- Content inside JSON strings with `\n` escapes won't match patterns that expect real newlines
- Put trigger content on actual lines, not embedded in JSON strings
- Patterns using `[_-]?` between words won't match spaces — use `[_\s-]?` if the trigger text may contain spaces (e.g., `ai-powered stealth`)
- When testing patterns with `process.env` + exfiltration keywords, ensure both parts appear on the same line if the regex uses `[^\n]` lookahead
- Some rule IDs may have two entries (e.g., MAL-035 has both gatewayUrl and asar variants). When writing tests, use list comprehension `[r for r in compiled.static_rules if r.id == "ID"]` to find all entries, not `next()` which only returns the first

### 7. Run CI locally

```bash
ruff check src tests
pytest tests/test_rules.py tests/test_showcase_examples.py -q --tb=short
```

Run only the rule and showcase tests (not the full suite) to save time — they take ~2 minutes. The only allowed pre-existing failure is `test_scan_json_stdout_and_auto_intel_message` (JSON control char bug on main).

### 8. Commit, push, create PR, and MERGE

Branch naming: `chore/pattern-update-YYYYMMDD-XXXX`

**The update is not complete until the PR is merged.** After pushing:
1. Resolve any merge conflicts (main may advance while working):
   ```bash
   git fetch origin main && git merge origin/main
   ```
   Resolve conflicts keeping both sides (ours on top for PATTERN_UPDATES.md, theirs for manifest.json — re-run corpus sync after resolving).
2. Wait for CI or use `--admin` flag if checks are pending:
   ```bash
   gh pr merge NNN --merge --delete-branch
   ```

### 9. Update the corpus (REQUIRED)

For each new rule, add an organic eval holdout to `kurtpayne/skillscan-corpus`:

```bash
cd ~/skillscan-corpus
git checkout -b chore/organic-eval-YYYYMMDD
```

Add one file per new rule to `held_out_eval/organic/`. These are **eval-only** — never training data.

> **⚠️ If you also create a new `training_corpus/` subdirectory**, you MUST register it in `index/skill-index.yaml` in the same PR. The finetune script will abort with an error if any subdirectory containing `.md` files is not listed there. Add an entry under `corpus_dirs:` with the correct `label: injection` or `label: benign` and an `archetype_family` and `description`.

**File format** (YAML frontmatter + realistic SKILL.md body):

```yaml
---
label: injection
source: pattern-update-YYYY-MM-DD
rule_id: MAL-NNN
description: One-line description of the attack pattern
---
```

Followed by a realistic SKILL.md body that embeds the attack pattern naturally.

**Naming convention:** `injection_organic_{rule_id_lower}_{short_description}.md`

Example: `injection_organic_mal045_stoatwaffle_vscode.md`

Commit, push, create PR, and **merge immediately**:
```bash
gh pr create --title "chore: organic eval holdouts for pattern update YYYY-MM-DD" --body "..."
gh pr merge NNN --squash --admin
```

### 10. Update the website and MERGE (REQUIRED)

This step is **mandatory** whenever new rules are added. The update cycle is **not complete** until the website PR is merged to main and deployed.

```bash
cd ~/skillscan-website
```

Files to update:

| File | What to update |
|---|---|
| `client/src/pages/Rules.tsx` | Add new rules to `rules[]` array. If new category prefix (e.g., `PINJ`, `SUP`), also add to `Category` type union, `categoryColors` record |
| `client/src/pages/Updates.tsx` | If new category prefix, add to `ruleMatches` regex and `CATEGORY_COLORS` record |
| `client/src/pages/Home.tsx` | If new category prefix, add to `ruleCategories` array. Update existing category counts |
| `client/src/components/TerminalScan.tsx` | Update rulepack version and rule count in the terminal animation |
| `client/public/llms.txt` | Update rule count and detection coverage list |

Pages that auto-update (no changes needed unless new categories):
- Updates page — fetches `PATTERN_UPDATES.md` from GitHub raw (but regex must include new prefixes)
- Home page — fetches live rule count from `default.yaml` (but static category cards need manual update)

Create a PR and **merge it immediately**:
```bash
gh pr create --title "chore: sync website with pattern update YYYY-MM-DD" --body "..."
gh pr merge NNN --merge --delete-branch
```
Website deploys automatically via GitHub Pages on push to main.

### 11. Verify deployment

Confirm **all three** PRs are merged (not just opened):
- Security repo PR → merged to main
- Corpus repo PR → merged to main
- Website repo PR → merged to main (triggers GitHub Pages deploy)

Visit https://skillscan.sh/rules and confirm new rules appear.

### 12. Completion checklist

Before reporting results to the user, confirm ALL of the following:

- [ ] Security repo PR created AND merged to main
- [ ] Corpus repo PR created AND merged to main (organic eval holdouts in `held_out_eval/organic/`)
- [ ] Website repo PR created AND merged to main
- [ ] `Rules.tsx` updated with new rule entries
- [ ] `Home.tsx` category counts updated
- [ ] `TerminalScan.tsx` rulepack version and count updated
- [ ] `Updates.tsx` regex and colors updated (if new prefix)
- [ ] `llms.txt` updated (if detection coverage changed)
- [ ] All three repos on main reflect the changes

If any item is incomplete, go back and finish it before ending the task.

## Known Issues

- `ioc_db.json` has had duplicate entries and missing commas in the past. Always validate JSON after editing: `python3 -c "import json; json.load(open('src/skillscan/data/intel/ioc_db.json'))"`
- `tests/test_rules.py` may have pre-existing broken assertions from prior updates (e.g., string concatenation without `\n`, GlassWorm assertions assigned to wrong rule ID). Fix these when encountered and include fixes in the PR.
- Showcase numbering may have duplicates (e.g., two `89_*` and two `90_*` directories exist). Continue numbering from the highest existing number.
- `pytest` takes ~2 minutes for rule+showcase tests. Use `timeout 180` wrapper to avoid hanging.
- `test_corpus.py` will fail in CI because `_corpus_manager_bundled` is in the private corpus repo. This is a pre-existing failure on main — ignore it.

## Pattern Update Guard (CI)

The `scripts/validate_pattern_update.py` check runs on PRs that touch `default.yaml`. It requires all files in the checklist above to be in the diff. If no new rule IDs are added (enrichment-only change), the showcase/doc requirements are skipped.

## Cost Optimization

- Use `search` tool and `curl` instead of browser for threat research
- Use parallel subtasks (`map`) for searching multiple threat categories simultaneously
- Only open browser when search results are insufficient and a specific article needs deep reading
- Run only `tests/test_rules.py` and `tests/test_showcase_examples.py` instead of the full test suite
