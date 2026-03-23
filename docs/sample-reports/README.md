# SkillScan Sample Reports

Private reference artifacts. Not served by the website.

These are the canonical sample reports for SkillScan's enterprise offering. They demonstrate the two report variants a customer would receive: a BLOCK report (malicious/misconfigured skills found) and a PASS report (clean skill approved for deployment).

---

## Files

| File | Description |
|---|---|
| `report_block_acme_corp.md` | BLOCK report — 4 skills, 3 blocked, 1 false positive. Includes static findings + dynamic trace section. |
| `report_pass_meeting_summarizer.md` | PASS report — 1 clean skill, approved for 90 days. Includes trace tool-surface adherence section. |
| `SkillScan_Report_BLOCK_Acme_Corp.pdf` | PDF render of the BLOCK report |
| `SkillScan_Report_PASS_Meeting_Summarizer.pdf` | PDF render of the PASS report |

---

## How to regenerate

The reports are compiled from three sources:

1. **Static scan output** — `skillscan scan <skill_dir> --output json`
2. **Dynamic trace output** — `skillscan-trace <skill_dir> --judge --inputs 3 --output json`
3. **LLM report compiler** — a prompt that takes the two JSON outputs and renders the Markdown report

The skill files used for the sample reports are in `/tmp/acme-skills/` (local sandbox only — not committed). To recreate:

```bash
mkdir -p /tmp/acme-skills/{code-review-assistant,dependency-updater,onboarding-assistant,incident-responder,meeting-summarizer}
# Write SKILL.md files (see report body for content)
skillscan scan /tmp/acme-skills/ --output json > /tmp/acme_static.json
skillscan-trace /tmp/acme-skills/ --inputs 3 --output json > /tmp/acme_trace.json
# Feed both JSONs to the report compiler prompt (see ROADMAP.md §Report Generation)
```

---

## Key design decisions (for future reference)

- **False positive included deliberately.** The `code-review-assistant` finding is a Markdown formatting false positive. Including it and labeling it honestly is more credible than hiding it.
- **Canary relay narrative.** The `onboarding-assistant` trace shows the model prompting for credentials twice when the first request was ignored. This is the most compelling behavioral finding — it demonstrates social engineering retry behavior, not just a pattern match.
- **Tool surface adherence section in PASS report.** The `meeting-summarizer` called only `read_file` and `write_file` across all 9 observed calls, even though all 14 canary tool surfaces were available. This is a meaningful behavioral guarantee that no other tool provides.
- **90-day approval with re-scan on change.** Creates a natural renewal touchpoint for the eventual SaaS offering.
- **Indirect prompt injection caveat in PASS report.** The meeting-summarizer reads user-controlled content (transcripts). The report explicitly flags this as a residual risk and recommends adversarial input testing for skills that process untrusted content.
