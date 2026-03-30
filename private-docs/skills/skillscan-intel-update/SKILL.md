---
name: skillscan-intel-update
description: Daily update skill for the SkillScan security scanner bundled IOC and vulnerability databases. Use when asked to refresh, update, or re-seed the SkillScan intel DBs (ioc_db.json, vuln_db.json), or when running the scheduled daily intel update.
---

# SkillScan Intel Update

Refreshes the bundled IOC and vulnerability databases in `skillscan-security` by re-running the seed scripts against live threat feeds, verifying CI gates pass, and committing the updated DB files.

## Workflow

### 0. Recover GitHub credentials (ALWAYS run first)

The sandbox resets between sessions. Run this before any `git push` or `gh` command:

```bash
# Guard: OWNER_OPEN_ID must be set — it is always injected by Manus
if [ -z "$OWNER_OPEN_ID" ]; then
  echo "ERROR: OWNER_OPEN_ID is not set. Cannot decrypt secrets. Aborting."
  exit 1
fi

# Clone the website repo if not already present (needed for the secrets file)
if [ ! -f ~/skillscan-website/private-docs/.secrets.enc ]; then
  GH_TOKEN="" gh repo clone kurtpayne/skillscan-website ~/skillscan-website 2>/dev/null || \
  git clone https://github.com/kurtpayne/skillscan-website.git ~/skillscan-website
fi

# Decrypt secrets
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

# Guard: PAT must be non-empty
if [ -z "$GITHUB_PAT" ]; then
  echo "ERROR: GITHUB_PAT is empty after sourcing secrets."
  exit 1
fi

unset GH_TOKEN
echo "$GITHUB_PAT" | gh auth login --with-token
gh auth status
```

### 1. Pull latest from remote

```bash
cd ~/skillscan-security
git pull --rebase origin main
```

### 2. Run the seed scripts

Run both in sequence (each takes ~30s):

```bash
python3 scripts/seed_ioc_db.py 2>&1 | tee /tmp/seed_ioc_output.txt
python3 scripts/seed_vuln_db.py 2>&1 | tee /tmp/seed_vuln_output.txt
```

Expected output from `seed_ioc_db.py`: final total must be >= 5,000 entries across urlhaus_hosts, feodotracker_ips, spamhaus_drop, and hagezi_doh_domains.

Expected output from `seed_vuln_db.py`: >= 20 Python packages with vuln data from OSV.dev.

### 3. Verify CI gates pass

```bash
python3 -m pytest tests/test_intel.py -v 2>&1 | tail -15
```

All 10 tests must pass. If `test_bundled_ioc_db_minimum_entries` fails, a feed went offline — report to user and do not push.

### 4. Commit and push

```bash
git add src/skillscan/data/intel/ioc_db.json \
        src/skillscan/data/intel/vuln_db.json \
        src/skillscan/data/intel/managed_sources.json
git commit -m "chore: daily intel DB refresh $(date +%Y-%m-%d)"
git pull --rebase origin main && git push origin main
```

### 5. Report summary

Report: IOC DB total entry count, vuln DB Python package count, any feeds that returned 0 entries, and the git commit hash.

## Feed Health Expectations

| Feed | Expected size | Notes |
|---|---|---|
| urlhaus_hosts | 400-600 domains | Active malware hosts; fluctuates daily |
| feodotracker_ips | 1-60 IPs | Active C2 IPs; very high precision |
| spamhaus_drop | 1,400-1,600 CIDRs | Hijacked IP blocks; stable |
| hagezi_doh_domains | 3,400-3,600 domains | DoH bypass domains; updates daily |

If any feed returns 0 entries, note it in the commit message but do not fail the update.

## Troubleshooting

**seed_ioc_db.py hangs**: Each feed has a 30s timeout. Kill and re-run with --dry-run to validate the existing DB without network fetches.

**test_bundled_ioc_db_minimum_entries fails**: A feed went offline. Check /tmp/seed_ioc_output.txt for which feed returned 0 entries. Do not push below the gate threshold.

**Git push rejected**: Run `git pull --rebase origin main` first, then push again.
