# TALVREN — Visual Design & Motion Brief

A style system reverse-engineered from a reference site's homepage, adapted
for TALVREN. This captures **look and motion only** — TALVREN's own copy,
structure, and section order (defined in `PRD.md`) take priority wherever
they conflict with this brief.

---

## 1. The overall feel

Confident, "designed-toy" energy. A near-monochrome canvas (warm off-white +
near-black) that lets three things do the talking: **huge compressed
all-caps display type**, **vivid full-bleed soft-colored section panels**,
and **glossy translucent 3D "gummy" blobs** that float and rotate. Type is
oversized and tight; motion is smooth and physics-y rather than snappy;
color arrives in big flat blocks that alternate as you scroll.

---

## 2. Color palette (TALVREN — locked)

| Role | Hex | Notes |
|---|---|---|
| Canvas / base background | `#F4F4F4` | Warm light gray. Default page ground between colored panels. |
| Ink / primary text | `#212121` | Near-black. Headlines, body, dark buttons, dark panels. |
| Card white | `#FFFFFF` | Service cards, feature cards. |
| **Accent — Blue** | `#6EA8FF` | Full-bleed panel background, badges, bullets. |
| **Accent — Orange** | `#FF9D5C` | Full-bleed panel background, badges, bullets. |
| **Accent — Purple** | `#B18AFF` | Full-bleed panel background, badges, bullets. |
| Dark section | `#212121` | Footer + any full dark panel. |
| Muted text | ~`#8A8A8A` | Small labels, footer headers, card metadata. |

**No yellow, no green, no red.** Backgrounds alternate in flat blocks as you
scroll: off-white → blue → orange → purple → off-white → dark. Each panel is
a single flat fill — no gradients on backgrounds. Gloss/gradient lives only
inside the 3D blobs.

---

## 3. Typography

Two families, hard split between display and everything else.

**Display face — Anton (or Archivo Black as alternate).**
- Every section headline + hero. Weight max, uppercase, color `#212121`.
- Hero H1: large, line-height ≈ 0.85–0.9 (very tight), letter-spacing
  normal.
- Always uppercase. Hero centered; other section headlines left-aligned.

**Text/UI face — Geist.**
- Body: 16px / line-height 24px (1.5), weight 400, color `#212121`.
- Subheads/taglines: same family, bold (~600–700), 18–24px.
- Labels/metadata: 13–14px, muted gray.
- Nav + buttons: 14–18px, weight 600.

**Hierarchy pattern:** large display headline (tight line-height, uppercase)
→ one short bold Geist tagline directly under it → smaller gray Geist body.
No "medium" tier between headline and body — the jump in scale is
intentional.

---

## 4. Spacing & layout

- **Content width:** contained, centered column, max-width ~1100–1200px,
  generous side gutters. Cards centered, max-width ~800px.
- **Full-bleed exception:** colored panels and dark sections run edge-to-edge
  (100vw), inner content still contained. Large rounded outer corners
  (~24–32px) so panels read as giant cards on the off-white page.
- **Vertical rhythm:** generous. Section padding ~120–160px top/bottom on
  desktop.
- **Grid:** service cards as a 3-column row (desktop) / stacked (mobile).
  "Why Work With Us" as a 2x2 or 4-column row of short items.
- **Nav:** floating white pill-shaped bar, rounded full radius, inset from
  top, wordmark left, links center, CTA right. Stays pinned on scroll.

---

## 5. Component patterns

**Primary button** — bg `#212121`, text `#F4F4F4`, 14px / weight 600,
padding 10px 20px, fully rounded pill (`border-radius: 9999px`). Subtle
hover (slight scale/opacity).

**Secondary/ghost button** — transparent bg, dark text `#212121`, border-radius
16px, padding 12px, weight 600.

**Badges** — small pill, bg `#212121`, colored text (blue/orange/purple
depending on which service or category the card maps to), ~12px.

**Cards** — white, rounded ~16–20px corners, soft/minimal shadow, generous
internal padding (~24–32px). **Content inside cards is TALVREN's own
copy — service descriptions or "who we help" scenarios, not live/dynamic
data** (see PRD section 10).

**Corner dots** — small dots at the four inner corners of key panels (CTA
box, "why work with us" panel) — a registration-mark motif.

---

## 6. 3D elements

- Built in code (Three.js), not an external 3D tool. See `PRD.md` section 9
  and the reference file `blob-demo.jsx`.
- Shapes: torus, organic icosahedron-based blob, four-petal clover — glossy,
  translucent (MeshPhysicalMaterial: transmission, clearcoat, low
  roughness).
- Colors: locked to blue `#6EA8FF`, orange `#FF9D5C`, purple `#B18AFF` only.
- Motion: continuous slow float (vertical sine drift) + continuous slow
  rotation. No snapping, no fast movement.
- Placement: bleeding off section edges, overlapping type where it doesn't
  hurt legibility — not centered like a product screenshot.

---

## 7. Animation catalog

| Where | Animation | Trigger | Feel |
|---|---|---|---|
| Global | 3D blobs drift/float | Always (idle loop) | Slow, smooth, physics-y |
| Hero / on load | Elements fade + settle in | Page load | Gentle, ~0.4–0.6s |
| One key section (hero or "problem" section) | Headline text fill light→dark, left→right | Scroll-linked (scrubbed) | Tracks scroll position exactly |
| Service cards | Fade/slide-in | Scroll into view | Staggered entrance |
| Cards / buttons | Hover lift / subtle scale | Hover | Small, ~150ms |
| Sections generally | Content fade/slide up | Scroll into view | Smooth, eased |

**Timing character:** smooth and eased, not snappy. Long durations on
floats/rotations (multi-second loops), gentle ease-in-out on entrances
(~0.4–0.6s). Reserve the scroll-scrubbed fill effect for one section only —
it's the signature move, not a default for every headline.

---

## 8. Explicitly not used (see PRD section 10 for reasoning)

- Infinite logo marquee
- Live/dynamic dashboard data (rolling numbers, rotating status logs, stat
  counters)
- Large-scale dark 3D wordmark section
- Dense multi-column feature grids

---

## 9. Fonts — practical notes

- **Geist** — free, use as-is.
- **Anton** — free, closest match for the heavy compressed display look.
  Set uppercase, tightest line-height, max weight. Don't pair more than
  these two families.
