# private-docs

Internal planning, strategy, and research documents for the SkillScan project.

These files are **not** part of the public `skillscan-security` repository. They live here (in the private `skillscan-website` repo) to keep internal context accessible without exposing it to users or contributors.

## Contents

```
skillscan-security/
  ROADMAP.md                    — Full milestone roadmap with pricing and SaaS architecture
  TOMORROW.md                   — Active work queue and corpus gap notes
  PATTERN_UPDATES.md            — Internal log of pattern additions (detection evasion risk if public)
  docs/
    PRD.md                      — Product strategy and market positioning
    GAP_ANALYSIS.md             — Internal eval gap analysis and F1 targets
    THREAT_MODEL.md             — Internal threat modeling
    ORG_MIGRATION_PLAYBOOK.md   — skillscan-dev org migration plan
    DISTRIBUTION.md             — Distribution strategy and channel notes
    MODEL_METRICS.md            — Model performance history across training runs
    TRACE_RESEARCH.md           — Behavioral trace design research
    benchmark-guide.md          — Internal benchmark methodology
    corpus-contribution-format.md — Internal corpus labeling format
    design/
      llm-as-recon-detection.md — Design research: LLM-as-recon detection
    specs/
      rule-metadata-v0.5.md
      rule-metadata.schema.json
      sarif-code-scanning-v0.5.md
      skillscan-lint-v0.5.md
```

## Sync policy

When updating any of these documents, edit the copy here and do **not** re-add them to the public repo.
The `skillscan-trace` repo (also private) holds `TAAS_SPEC.md` and `ARCHITECTURE.md` separately.
