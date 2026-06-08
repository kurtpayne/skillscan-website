# SkillScan Adversarial Panel Review

**Date:** 2026-06-08  
**Reviewed:** skillscan.sh website + kurtpayne/skillscan-security repo  
**Composite Yoke Score:** 85/100 (Strong)

---

## Panel: HN Heckler

### Persona
Cynical, technically sharp HN commenter. Zero tolerance for hype. Views source first.

### Top "Gotcha" Comments

1. **"250+ rules… or 338… or 77… or 140… or 288? Pick a number."** (severity: high)
   - The hero badge dynamically fetches rule count but the regex `^  - id: ` doesn't match the actual YAML indent (`- id:` at root), so it falls back to the hardcoded `288`. The `features` array says "250+ Detection Rules". The suite card says "140+ rules". The OG meta tags and structured data say "77+". The README says "121 static + 17 multilang + 15 chain". The `ruleCategories` static array sums to `336`. The actual rules repo has `338`.
   - **Five different numbers across the same site for the same thing.** HN will have a field day.
   - Fix: One source of truth (the live fetch, when it works). Fix the regex. Kill all hardcoded counts.

2. **"This is a Manus-generated Replit project with the serial numbers filed off."** (severity: medium)
   - `ManusDialog.tsx` is in the components directory with "Login with Manus" button text. The `ideas.md` reads like AI-generated brainstorming with `<response>` and `<probability>` tags. 46 Radix UI wrapper components are scaffolded but only 11 are actually imported by pages. `shared/const.ts` exports `COOKIE_NAME` and `ONE_YEAR_MS` that nothing uses.
   - This looks like a Manus/Replit template that was skinned. Not a crime, but claiming "enterprise-grade" while shipping a scaffold with 35 unused UI components is ironic for a security tool.
   - Fix: Delete unused components and Manus artifacts. Own the origin or clean it up.

3. **"The website LICENSE file says Apache 2.0. Everything else says MIT."** (severity: high)
   - `LICENSE` file: Apache 2.0. `package.json`: MIT. Footer: MIT. Legal page: MIT. `index.html` structured data: MIT. GitHub repo: Apache 2.0.
   - This is a legal compliance issue, not a nitpick. Someone forking this doesn't know which license applies.
   - Fix: Pick one. Both repos use Apache 2.0 — update the website references to match, or switch the LICENSE file to MIT.

4. **"The About page says 'No machine learning inference' — the home page sells an ML classifier."** (severity: medium)
   - About.tsx: "No machine learning inference, no cloud calls — just pattern matching you can audit yourself."
   - Home.tsx: Entire section on "ML classifier" with "Fine-tuned Qwen2.5-1.5B generative detector."
   - The About page is stale or was written for an earlier version. It directly contradicts the product's marquee feature.
   - Fix: Update the About page.

5. **"LCP is 31.7 seconds. For a site selling security tooling."** (severity: high)
   - A security tool's website that can't load in under 30 seconds doesn't inspire confidence. Likely the hero background image (`hero-bg.png`) and/or render-blocking resources.

6. **"Four GitHub stars and you're calling it 'enterprise-grade'?"** (severity: low)
   - Footer: "Enterprise-grade." 4 stars. 0 forks. 1 watcher. 216 PyPI downloads/month.
   - The tool may genuinely be good, but the label is aspirational. HN hates premature self-promotion.

7. **"`CORS: *` on a proxy that fetches arbitrary GitHub paths?"** (severity: medium)
   - The CF Worker returns `Access-Control-Allow-Origin: *` on proxied raw GitHub content. Combined with the path traversal discussion below, this is the kind of thing HN security people immediately flag.

### Show HN Readiness: 5/10
Solid tool, genuine utility, real CI/CD use case — but the website undermines it with contradictory numbers, stale copy, and scaffold bloat. Fix the numbers and the About page before posting.

### What Would Make HN Love It
Live-scan the MCP tools directory and show real results. A demo that catches something real in a popular repo is the kind of thing that gets 300 upvotes.

---

## Panel: Security & Privacy

### Key Findings

1. **Cloudflare Worker path traversal — partial protection** (severity: medium)
   - The worker blocks `..` and `//` in `filePath`, but:
     - URL-encoded `..` (`%2e%2e`) may bypass the string check depending on when Cloudflare decodes the URL. The `new URL()` constructor normalizes some but not all encoded sequences.
     - The worker fetches from `raw.githubusercontent.com` which has its own protections, so the practical risk is low (GitHub won't serve files outside the repo). But the defense-in-depth isn't complete.
   - Fix: Allowlist the file path to known prefixes (`src/`, `docs/`, etc.) instead of blocklisting patterns.

2. **CORS `Access-Control-Allow-Origin: *` on the proxy worker** (severity: low)
   - Any origin can use the proxy to fetch raw GitHub content. Since it's public GitHub content anyway, the actual risk is low — but it means the proxy could be used as an open redirect/proxy by third parties to bypass corporate firewalls that block `raw.githubusercontent.com`.
   - Fix: Restrict to `skillscan.sh` origin.

3. **CSP has `unsafe-inline` for scripts** (severity: medium)
   - Yoke flagged this. The SPA likely needs inline scripts for the Vite dev setup and the `spa-redirect.js` in `index.html`. In production, these could use nonces or hashes instead.
   - Note: This is a GitHub Pages deployment — CSP is set by Cloudflare, not by the HTML. Check the CF page rules.

4. **Analytics endpoint uses Umami** (severity: info/good)
   - Self-hosted Umami via `%VITE_ANALYTICS_ENDPOINT%` — no third-party tracking. The Legal page correctly discloses this. This is actually a positive finding.

5. **No cookies set by the application** (severity: info/good)
   - The `COOKIE_NAME` / `ONE_YEAR_MS` exports are dead code from the template. The sidebar cookie is in an unused UI component. No actual cookies are set.

6. **Inline `<script>` for SPA routing** (severity: low)
   - `spa-redirect.js` runs before React to handle GitHub Pages 404 routing. This is a standard pattern but contributes to the CSP issue.

### Security Posture: 7/10
For a static site behind Cloudflare, the attack surface is small. The CF Worker is the only real entry point and it's adequately (if not perfectly) protected. No user data collected, no auth flows, no state.

### Top 3 Risks
1. Worker path traversal bypass via URL encoding
2. CSP `unsafe-inline` (looks bad for a security tool)
3. Open CORS on the proxy worker

---

## Panel: Code Quality

### Key Findings

1. **Massive dependency bloat — 35 unused UI components** (severity: medium)
   - 46 Radix UI wrapper components exist in `components/ui/`. Only 11 are imported by actual pages: button, card, dialog, input, label, separator, sheet, skeleton, textarea, toggle, tooltip.
   - 21 Radix packages are in `package.json` as dependencies. Most are only imported by their own unused wrapper file.
   - This is textbook scaffolding waste. Every one of these ships to the client if tree-shaking doesn't eliminate them, and they clutter the codebase.
   - Fix: Delete the 35 unused UI components and their corresponding Radix dependencies. Keep what's actually imported.

2. **Unused npm dependencies** (severity: medium)
   - `axios` — never imported by any page or component (native `fetch` is used instead)
   - `react-hook-form` + `@hookform/resolvers` + `zod` — form library stack, never used
   - `nanoid` — never imported
   - `streamdown` — never imported
   - `@types/google.maps` — no Google Maps usage anywhere
   - `class-variance-authority` — only in unused UI components
   - Fix: `pnpm remove` the unused packages.

3. **Dead code: ManusDialog.tsx** (severity: low)
   - Never imported by any page or route. Contains Manus-specific login flow. Leftover from the project scaffold.
   - Fix: Delete it.

4. **Dead code: `shared/const.ts`** (severity: low)
   - Exports `COOKIE_NAME` and `ONE_YEAR_MS`. `COOKIE_NAME` is re-exported in `client/src/const.ts` but never used by any page. The sidebar component has its own cookie name.
   - Fix: Delete both files.

5. **Dead code: `server/index.ts`** (severity: low)
   - An Express server that serves static files. The site deploys to GitHub Pages — this server is never used in production. It was likely from the Replit/Manus development flow.
   - Fix: Delete the server directory or document its purpose (local dev only).

6. **Wouter patch exposes routes to `window.__WOUTER_ROUTES__`** (severity: low)
   - The patched wouter collects all route paths into a global variable. This is presumably for the 404.html SPA redirect. It's a functional hack but leaks internal routing to the client.

7. **Inline style objects everywhere** (severity: low)
   - Home.tsx has 229 `style={{...}}` attributes vs 345 `className=` usages. The oklch color system is applied via inline styles rather than Tailwind CSS variables or a theme file. This makes theming and maintenance harder.
   - Not a bug, but a design debt that compounds.

8. **No tests** (severity: medium)
   - `vitest` is in devDependencies but there are zero test files. For a security tool's website, at least smoke tests for route rendering would be appropriate.

9. **Good: Lazy loading and code splitting** (severity: info/good)
   - All routes use `React.lazy()` — good practice for SPA performance.

### Code Health: 5/10
The actual page code is competent — well-structured components, proper lazy loading, good a11y basics (skip link, aria-live). But the codebase is 60% scaffold bloat. The signal-to-noise ratio is poor.

### Top 5 Refactors
1. Delete 35 unused UI components and their Radix deps
2. Remove 6+ unused npm packages
3. Delete ManusDialog, server/, shared/const.ts
4. Extract oklch color values into CSS custom properties
5. Add basic route smoke tests

---

## Panel: Business & Product

### What Is SkillScan?

SkillScan is a genuine, actively maintained security scanner for AI agent skill files. It's a real tool:
- **338 detection rules** across 12 categories, automatically synced daily
- **ML classifier** (fine-tuned Qwen2.5-1.5B) for semantic attack detection
- **3 separate packages** (scan, lint, trace) covering the full lifecycle
- **CI/CD integration** with GitHub Actions, SARIF output
- **269 merged PRs**, daily automated rule syncing, active development
- **216 PyPI downloads/month**, 90/week — modest but real traction

### Key Findings

1. **The website oversells and the tool undersells** (severity: medium)
   - The website uses "enterprise-grade" and has a polished SaaS-style design that implies a VC-backed product. The tool is actually a solo developer's well-crafted open source project with genuine utility.
   - The README is far more honest and effective: "catches the obvious stuff so you don't have to pay Claude to find it" is a brilliant positioning line.
   - Recommendation: Match the website's tone to the README's honesty. Drop "enterprise-grade." Use "production-ready" if you need a qualifier.

2. **Stale metadata everywhere** (severity: high)
   - OG tags say "77+ detection rules" — was true months ago, now 338
   - Structured data says version "0.3" — was true months ago
   - About page contradicts the home page on ML features
   - Fix: These are what people see in link previews, Google results, and social shares. They're your first impression and they're wrong.

3. **Real product, portfolio-grade website** (severity: medium)
   - The tool has genuine utility — the threat intel is current (rules reference the May 2026 Shai-Hulud/TeamPCP supply chain attack, Nx Console compromise), the CI is green, PRs merge daily.
   - The website, however, was built fast (Manus scaffold) and hasn't been maintained to match the tool's evolution.
   - The disconnect between tool quality and website quality is the main product issue.

4. **No demo or playground** (severity: low)
   - The terminal animations are nice but fake. There's no way to try SkillScan without installing it. A "paste a skill file and scan it" web demo would dramatically increase conversion.

### Verdict
Genuine tool with real users and active development, dressed in a website that both oversells (enterprise-grade) and undersells (stale numbers) at the same time. The fix is honesty: accurate numbers, honest tone, updated metadata.

---

## Panel: FOSS Legal

### Key Findings

1. **LICENSE file contradicts every other license reference** (severity: critical)
   - The `LICENSE` file in the website repo is **Apache 2.0**
   - `package.json` says **MIT**
   - Footer says **MIT**
   - Legal page says **MIT** and links to the main repo's LICENSE (which is also Apache 2.0)
   - Structured data (`index.html`) says **MIT**
   - The GitHub API reports the main repo as **Apache 2.0**
   - **Someone could argue they're bound by MIT (which the UI claims) while the actual file says Apache 2.0.** These are different licenses with different obligations (Apache 2.0 includes patent grants and a patent retaliation clause that MIT doesn't).
   - Fix: Decide on one license. The main repo is Apache 2.0 — either change the website to match, or intentionally dual-license (and document why).

2. **No NOTICE file** (severity: medium)
   - Apache 2.0 requires a NOTICE file if one exists in the original work. The Apache license template appendix is present but the `[yyyy] [name of copyright owner]` placeholders were never filled in.
   - Fix: Either add a proper NOTICE with copyright attribution, or switch to MIT.

3. **IOC/threat intel data source attribution** (severity: low)
   - The Legal page attributes MITRE ATT&CK, OWASP, and CWE. But the tool also uses:
     - URLhaus (abuse.ch — CC0)
     - FeodoTracker (abuse.ch)
     - Spamhaus DROP
     - HaGeZi domain blocklist
     - Phishing Army
     - KADhosts
     - OSV.dev
   - Most of these have permissive terms, but some (Spamhaus) have commercial use restrictions.
   - Fix: Add the threat feed attributions to the Legal page.

4. **VirusTotal ToS compliance** (severity: low)
   - VirusTotal's API ToS restricts redistribution of results. SkillScan uses it as an optional BYOK integration, not redistributing VT data — likely fine, but worth noting.

5. **"No telemetry, no tracking" claim + Umami analytics** (severity: low)
   - Footer says "No telemetry. No tracking." The Legal page discloses Umami analytics.
   - Umami is privacy-respecting (no cookies, no PII), so the claim is defensible — but "no tracking" while running analytics is a semantic stretch that a pedantic reader would flag.
   - Fix: Footer → "No telemetry. Privacy-respecting analytics only." or just remove the tracking claim.

### License Health: 3/10
The license contradiction is a real problem. Everything else is minor, but this needs to be resolved before anyone forks the repo.

---

## Synthesis

### The Big Picture

SkillScan is a **legitimately useful tool** with **active development** (269 PRs, daily rule syncs, current threat intel) and **real traction** (216 downloads/month, 4 stars) for a solo open-source project in a niche space. The underlying engineering is solid — the CI pipeline, rule management, and ML integration show genuine effort and competence.

The website is the weak link. It was scaffolded quickly (Manus/Replit template), skinned with a good design system, but never cleaned up. The result is a codebase that's 60% dead weight and a presentation layer that contradicts itself on basic facts.

### Critical Issues (fix before any public push)

| # | Issue | Panel | Severity |
|---|-------|-------|----------|
| 1 | License file (Apache 2.0) contradicts all UI references (MIT) | FOSS Legal | Critical |
| 2 | Five different rule counts across the site (77, 140, 250, 288, 338) | HN Heckler | High |
| 3 | OG/Twitter meta tags show stale "77+ rules", version "0.3" | Business | High |
| 4 | About page says "no ML inference" while home page sells ML classifier | HN Heckler | Medium |
| 5 | Live rule count fetch regex broken (matches 0, falls back to 288) | HN Heckler | Medium |

### Recommended Cleanup (before next feature work)

| # | Issue | Panel | Effort |
|---|-------|-------|--------|
| 6 | Delete 35 unused UI components + Radix deps | Code Quality | 30min |
| 7 | Remove unused npm packages (axios, react-hook-form, zod, nanoid, streamdown, google.maps types) | Code Quality | 15min |
| 8 | Delete ManusDialog.tsx, server/, shared/const.ts dead code | Code Quality | 10min |
| 9 | Restrict CF Worker CORS to skillscan.sh origin | Security | 5min |
| 10 | Add URL-encoded path traversal protection to CF Worker | Security | 10min |
| 11 | Add threat feed attributions to Legal page | FOSS Legal | 15min |
| 12 | Update footer "no tracking" language | FOSS Legal | 5min |

### What's Actually Good

- **Real threat intel.** Rules reference the May 2026 TeamPCP supply chain attacks, Nx Console compromise, and current IOCs. This isn't static content — it's a living threat database.
- **Honest architecture.** Offline-first, no phone-home, self-hosted analytics. The privacy story is real.
- **Active CI/CD.** Green builds, daily rule syncs, CodeQL analysis, regression testing.
- **Good SPA patterns.** Lazy loading, error boundaries, skip-to-content link, code splitting.
- **The README positioning is excellent.** "Catches the obvious stuff so you don't have to pay Claude to find it" is a better pitch than anything on the website.

### One-Line Verdict

A real tool wearing a costume that doesn't quite fit — fix the contradictions and shed the scaffold, and you've got something worth promoting.
