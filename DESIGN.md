# Design System: Happy Birthday Didi 🎂
**Theme:** Cartoonish Crayon-Drawn Lilo & Stitch Birthday Celebration

## 1. Visual Theme & Atmosphere

A **warm, hand-drawn, crayon-textured** celebration that feels like opening a birthday card crafted with love. The aesthetic channels the whimsical, tropical spirit of Lilo & Stitch — playful island vibes with wobbly hand-drawn borders, sketch-like illustrations, and a color palette pulled straight from a box of beloved crayons. Every element should feel **imperfect-on-purpose** — slightly tilted cards, wobbly borders, and textured fills that mimic real crayon strokes on craft paper.

**Mood:** Joyful, nostalgic, hand-crafted, tropically warm, lovingly imperfect.
**Density:** Generous whitespace with chunky, confident elements that breathe.

## 2. Color Palette & Roles

- **Stitch Blue** (#4A90D9) — Primary brand color, used for Stitch character elements and primary accents
- **Tropical Sunset Pink** (#FF6B9D) — Secondary accent for highlights, "Happy" text, and warm emphasis
- **Hibiscus Purple** (#A78BFA) — Tertiary accent for variety, "Birthday" text elements
- **Crayon Sunshine Yellow** (#FFD93D) — Sticky notes default, joyful highlights, star bursts
- **Island Leaf Green** (#4ECDC4) — Fresh accent for fun cards and success states
- **Warm Coral Orange** (#FF8A65) — Warm accent for balloon pops and energetic moments
- **Craft Paper Cream** (#FFF8EE) — Page background, mimicking off-white craft paper
- **Crayon Sketch Brown** (#5D4E37) — Primary text color, like a dark brown crayon
- **Soft Pencil Gray** (#8B7E74) — Secondary text, labels, subtle elements
- **Coconut White** (#FFFFFF) — Card backgrounds, clean surfaces

## 3. Typography Rules

- **Headings:** "Fredoka" (Google Fonts) — Rounded, bubbly, childlike weight (600-700). Like writing with a thick marker.
- **Body / Handwritten:** "Caveat" (Google Fonts) — Cursive, handwritten feel (400-600). Like someone actually wrote it.
- **Interactive / Labels:** "Patrick Hand" (Google Fonts) — Clean handwriting for inputs and buttons.
- **Letter-spacing:** Slightly loose for headings (+0.02em), natural for body.
- **Line-height:** Generous (1.6-1.8) for that airy, sketchbook feel.

## 4. Component Stylings

* **Borders (Crayon Borders):** Every container uses a hand-drawn border effect — 3px solid Crayon Sketch Brown with slight border-radius variance (12-20px) and a subtle CSS shadow to mimic crayon pressure. Optional: wavy/rough borders via SVG filters.
* **Buttons:** Pill-shaped (border-radius: 50px), Stitch Blue or Tropical Sunset Pink fill, Coconut White text, hand-drawn border, playful hover with slight scale(1.05) bounce and rotation(-1deg).
* **Cards / Containers:** Coconut White background, Crayon Border, slight random rotation (transform: rotate(-2deg to 2deg)), soft inner padding (1.5-2rem), paper-like texture.
* **Sticky Notes:** Colored squares with a slight rotation, tape/pin decoration at top, drop shadow mimicking paper lifted off surface, handwritten font.
* **Inputs / Forms:** Craft Paper Cream background, dashed Crayon Border, handwritten placeholder text, focus state adds Stitch Blue glow.

## 5. Layout Principles

- **Centered, single-column flow** for storytelling progression (hero → countdown → letter → fun cards → sticky wall)
- **Maximum content width:** 900px with generous side padding
- **Section spacing:** 4-6rem between major sections
- **Playful asymmetry:** Cards and notes slightly rotated for that "pinned to a board" feel
- **Mobile-first responsive:** Stacks gracefully, maintains crayon charm at all sizes
- **Scroll-driven reveal:** Sections fade-in as they enter viewport

## 6. Design System Notes for Generation

This is a **celebration microsite** — single-page, scroll-driven, no complex navigation. The visual language is a love letter disguised as a website: hand-drawn, crayon-textured, tropically warm with Stitch (Lilo & Stitch) character elements built in pure CSS. Every interaction should feel like unwrapping a gift — small delights, bouncy animations, and genuine warmth.
