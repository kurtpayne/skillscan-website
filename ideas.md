# SkillScan Website Design Brainstorm

## Chosen Design: Concept B — Deep Navy Gradient (Refined)

The user selected Concept B. Below are three distinct stylistic approaches explored, with B selected.

---

<response>
<text>
**Design A: Dark Terminal**
- **Design Movement:** Cyberpunk/Hacker Aesthetic
- **Core Principles:** Raw technical authority, monospace-first, zero decoration
- **Color Philosophy:** Pure black + neon green + electric cyan — the palette of trust in security circles
- **Layout Paradigm:** Full-bleed terminal window as hero, content below as documentation
- **Signature Elements:** Blinking cursor, color-coded CLI output, scan progress bars
- **Interaction Philosophy:** Everything feels like operating a real tool
- **Animation:** Typewriter text, scan line animations, blinking cursors
- **Typography System:** JetBrains Mono or Fira Code for all headings, Inter for body
</text>
<probability>0.07</probability>
</response>

<response>
<text>
**Design B: Deep Navy Gradient — SELECTED**
- **Design Movement:** Modern DevSecOps SaaS (Snyk/Wiz/Datadog aesthetic)
- **Core Principles:** Dark authority, violet accent energy, code-first hero, enterprise credibility
- **Color Philosophy:** Deep navy (#0f1729) to indigo (#1a0a2e) gradient conveys depth and security. Violet (#7c3aed) signals innovation and intelligence. Orange (#f97316) highlights critical findings — the color of alerts.
- **Layout Paradigm:** Asymmetric hero — headline left, code block right. Feature grid below. Docs section with left nav. No centered hero clichés.
- **Signature Elements:** Floating code block with highlighted malicious patterns, rule count badge, glow border cards
- **Interaction Philosophy:** Hover states reveal depth (glow intensifies). CTAs feel consequential. Code blocks are interactive.
- **Animation:** Subtle entrance animations (fade-up on scroll), code block syntax highlight pulse, card hover glow
- **Typography System:** Space Grotesk (bold display) + Inter (body) — technical but human. Monospace for code snippets.
</text>
<probability>0.08</probability>
</response>

<response>
<text>
**Design C: Minimal Light Editorial**
- **Design Movement:** Premium Developer Tool (Stripe/Linear/Vercel aesthetic)
- **Core Principles:** Typography-first, white space as luxury, red for danger signals
- **Color Philosophy:** White background lets content breathe. Crimson red (#dc2626) for security emphasis creates urgency without aggression.
- **Layout Paradigm:** Left-aligned editorial layout, massive display type, GitHub Actions panel as hero visual
- **Signature Elements:** Large serif display headline, horizontal rule dividers, CI/CD panel mockup
- **Interaction Philosophy:** Confident restraint — nothing moves unless it must
- **Animation:** Minimal — subtle fade-ins only, no decorative motion
- **Typography System:** Playfair Display or Fraunces (display) + DM Sans (body)
</text>
<probability>0.06</probability>
</response>

---

## Selected Design: B — Deep Navy Gradient

**Design philosophy committed:** Modern DevSecOps SaaS with deep navy/indigo background, violet primary accent, orange for security alerts. Space Grotesk + Inter typography. Asymmetric hero layout with code block. Glow border cards. Enterprise credibility with developer energy.

**Color tokens:**
- Background: `oklch(0.12 0.025 265)` (deep navy)
- Background gradient end: `oklch(0.09 0.035 280)` (deep indigo)
- Primary (violet): `oklch(0.55 0.22 290)` 
- Accent (orange): `oklch(0.72 0.19 45)`
- Foreground: `oklch(0.95 0.005 265)`
- Muted foreground: `oklch(0.65 0.015 265)`
- Card background: `oklch(0.16 0.02 265 / 0.8)`
- Border: `oklch(0.55 0.22 290 / 0.25)` (violet-tinted border)
