Build the TALVREN agency landing page — a single-page marketing site for a
two-person design/build agency (websites, redesigns, and AI automation)
targeting small businesses in Ireland.

Follow these two docs exactly, in this project folder:
- `PRD.md` — requirements, section structure, copy rules, what to include
  and exclude
- `design-brief.md` — full visual system: color, typography, spacing,
  components, animation

Use `blob-demo.jsx` in this folder as the base technique for the 3D
elements — same approach (Three.js, MeshPhysicalMaterial for glossy
translucency, continuous float + rotate animation) — but integrate it
properly into the page sections instead of a standalone demo. Do not use
Spline, any external 3D tool, or stock 3D assets.

Requirements:
1. Build all 7 sections in the exact order defined in PRD.md section 6:
   Hero, Who We Help, Services, Why Work With Us, How It Works, FAQ, Final
   CTA.
2. Use the color palette exactly as specified in design-brief.md section 2
   — blue `#6EA8FF`, orange `#FF9D5C`, purple `#B18AFF`, off-white
   `#F4F4F4`, near-black `#212121`. No yellow, green, or red anywhere.
3. Typography: Anton (or Archivo Black if Anton is unavailable) for all
   headlines, Geist for body/UI text. Follow the hierarchy and line-height
   rules in design-brief.md section 3.
4. Place the 3D blob shapes per section as described in design-brief.md
   section 6 — bleeding off edges, not centered like a screenshot. Confirm
   with me which specific blob (torus / organic / clover) goes in which
   section before finalizing placement if it's not obvious from context.
5. Implement the scroll-scrubbed headline fill effect (light-to-dark
   text-fill tied to scroll position) on ONE section only — the hero or
   the "Who We Help" section, whichever reads stronger. Every other section
   uses standard scroll-triggered fade/slide entrance.
6. Service cards and "Who We Help" scenario cards use the card shell
   pattern from design-brief.md section 5, filled with TALVREN's own copy
   — no live data, counters, or rotating logs.
7. Fully responsive down to mobile. Visible keyboard focus states.
   Respect `prefers-reduced-motion` — fall back to simple fades, no
   floating/rotating 3D or scroll-scrubbing when that's set.
8. Do not add sections, features, or content beyond what's in PRD.md
   without flagging it to me first.

Copy: I'll provide the final section-by-section copy separately — for now,
use the placeholder copy already drafted in our earlier conversation as a
starting structure, and flag clearly wherever you're inferring content
that wasn't explicitly given.

Before writing code, summarize back your understanding of the color
system, section order, and 3D placement plan so I can confirm before you
build.
