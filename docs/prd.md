# TALVREN — Landing Page PRD (v1)

## 1. Overview

TALVREN is a two-person design/build agency (Angel + Effie) targeting small
businesses in Ireland that either have no website, have an outdated/underperforming
website, or need AI automation to reduce repetitive manual work.

This document defines the requirements for the agency's own marketing website —
a single-page site that exists to build credibility and generate contact
requests before the agency has a portfolio or testimonials to show.

## 2. Goals

- Establish credibility with zero portfolio and zero testimonials
- Clearly communicate the two service lines: (1) websites/redesigns, (2) AI
  automation
- Convert visitors into a contact/inquiry, not just a browse
- Feel premium and current — visual quality is itself evidence of the
  agency's design capability

## 3. Non-goals (v1)

- No portfolio/case studies section (no work exists yet)
- No testimonials or client logos
- No live/dynamic data displays (no real usage data to show)
- No disclosure of the automation outsourcing arrangement on the page

## 4. Audience

Small business owners in Ireland. Not a technical audience — copy must be
plain, benefit-first, and free of agency jargon or SaaS-speak.

## 5. Services offered

1. **Website Design & Development** — new builds for businesses with no
   website
2. **Website Redesign** — for businesses with an outdated or underperforming
   site
3. **Automated Workflows** — AI automation to reduce repetitive tasks.
   Delivered in partnership with a third-party specialist agency (Effie's
   contact); TALVREN earns commission. **This arrangement is not disclosed
   on the site** — automation is presented as a TALVREN service.

## 6. Site structure (locked, 7 sections)

1. **Hero** — headline, one-line supporting copy, single CTA
2. **Who We Help** — three self-qualifying scenarios (no website / outdated
   website / too much manual work)
3. **Services** — three cards: Website Design & Development, Website
   Redesign, Automated Workflows
4. **Why Work With Us** — four short differentiators (clarity, real-needs
   focus, ease of use, modern-without-complexity)
5. **How It Works** — four-step process (Tell us what you need → We plan
   the right solution → We design and build → Review and launch)
6. **FAQ** — five questions max, covering: new builds, redesigns, what
   automation covers, what's needed to start, how pricing works
7. **Final CTA** — headline + supporting line + CTA, mirrors hero CTA

Section order is fixed. No additional sections without a specific reason
tied to a business need (see "Non-goals").

## 7. Copy rules

- No sentence opens with "I"
- Benefit-driven framing throughout (what the business gets, not what
  TALVREN does)
- Plain language — avoid SaaS/enterprise jargon (no "leverage," "seamless,"
  "unlock," "empower," "solutions" as filler)
- Hyphens allowed only where standard as a compound modifier
- Avoid clichés ("one-size-fits-all," "take it to the next level")

## 8. Visual direction (summary — full spec in design-brief.md)

Visual system is adapted from a reference site's structure and motion
patterns (not its copy or exact section breakdown). See
`design-brief.md` for the full token system.

- **Palette:** near-monochrome canvas (off-white `#F4F4F4` / near-black
  `#212121`) with three accent colors — **blue, orange, purple** (soft/light
  tones, not saturated). No yellow, no green, no red.
- **Typography:** heavy compressed uppercase display face (Anton or
  Archivo Black) + Geist for body/UI text
- **Layout:** contained content column (~1100–1200px), full-bleed color
  panels between sections, generous vertical spacing, floating pill nav
- **Motion:** scroll-triggered fade/slide entrances; one signature
  scroll-scrubbed headline fill effect (reserved for hero or one key
  section); hover micro-interactions on buttons/cards

## 9. 3D elements

- Built with code (Three.js), not an external 3D tool (Spline) or stock
  assets — for full control and easy integration into the Claude Code
  build
- Reference implementation: `blob-demo.jsx` (torus, organic blob, and
  four-petal clover shapes, glossy MeshPhysicalMaterial, float + rotate
  animation loop)
- Colors locked to the site's three accents (blue, orange, purple) — no
  green/red/yellow
- Placement: per-section, bleeding off edges where appropriate, not
  centered/contained like a product screenshot

## 10. Explicitly dropped from reference site's pattern

- Infinite client-logo marquee (no clients yet)
- Live/dynamic dashboard data — numbers, counters, rotating status logs
  (nothing real to show; risks looking fabricated). **Card shell/style is
  kept — contents replaced with TALVREN's own service or scenario copy.**
- Large-scale 3D wordmark section
- Dense multi-column feature grids sized for a 20+ integration SaaS
  product

## 11. Success criteria for v1

- Site clearly answers, within the hero, what TALVREN does and who it's
  for
- A visitor with no website and a visitor with an outdated website can
  each self-identify within the "Who We Help" section
- Automation is presented as a core offering, not an afterthought
- No section requires portfolio/testimonial content to make sense
- Single clear CTA repeated at top and bottom
