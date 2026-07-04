# ⚠️ RETIRED — no longer maintained

> Retired 2026-07-03. We benchmarked this product family honestly — including against our own tools — and the results said stop: static scanning of AI skills doesn't work as a security boundary. The full story and the measurements are at [skillscan.sh](https://skillscan.sh/about.html), which now lives on as an independent benchmark of skill-security scanners.
>
> No further updates, releases, or security fixes.
> skillscan.sh now serves the scanner benchmark from [`kurtpayne/skillscan-benchmark`](https://github.com/kurtpayne/skillscan-benchmark).


---

# skillscan.sh

[![Deploy](https://github.com/kurtpayne/skillscan-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/kurtpayne/skillscan-website/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Yoke](https://yoke.lol/badge/skillscan.sh.svg)](https://yoke.lol/skillscan.sh)

Website and documentation for [SkillScan Security](https://github.com/kurtpayne/skillscan-security) — a free, offline security scanner for AI agent skills and MCP tool bundles.

**Live:** [skillscan.sh](https://skillscan.sh)

## Stack

- React SPA (Vite 7, TypeScript)
- Tailwind CSS
- GitHub Pages + Cloudflare CDN
- Deployed via GitHub Actions

## Development

```bash
pnpm install
pnpm dev
```

## License

Apache 2.0
