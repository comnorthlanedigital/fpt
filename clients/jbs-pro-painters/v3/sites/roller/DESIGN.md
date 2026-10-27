---
name: JB'S Pro Painters, Roller
description: A primer-white wall you paint yourself with a navy roller, in royal blue and silver, set in Gloock over Epilogue.
colors:
  primer-white: "#f3f2ee"
  wall-gray: "#cfd3dc"
  paper-white: "#ffffff"
  deep-navy: "#0a1433"
  field-navy: "#06102a"
  slate-mute: "#47506b"
  royal-blue: "#2459e6"
  royal-blue-pressed: "#1c47c0"
  roller-blue-light: "#3b63d6"
  roller-blue-mid: "#1b2f78"
  silver-hardware: "#cdd5e3"
  est-ink: "#f3f5fb"
  footer-ink: "#c9d3ee"
  placeholder-periwinkle: "#9fb0dc"
  error-blush: "#ffb1b1"
typography:
  display:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(44px, 7vw, 96px)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(40px, 6vw, 88px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Gloock, Georgia, serif"
    fontSize: "clamp(28px, 3.6vw, 50px)"
    fontWeight: 400
    lineHeight: 1.05
  body:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  body-lead:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.6
  button:
    fontFamily: "Epilogue, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.2
rounded:
  sm: "10px"
  md: "12px"
  lg: "16px"
  xl: "22px"
  pill: "99px"
spacing:
  gutter: "max(20px, 3vw)"
  gap-sm: "10px"
  gap-md: "14px"
  gap-lg: "32px"
  section: "clamp(70px, 9vw, 130px)"
components:
  button-primary:
    backgroundColor: "{colors.royal-blue}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.royal-blue-pressed}"
  chip-button:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    padding: "0 22px"
    height: "46px"
  chip-button-solid:
    backgroundColor: "{colors.royal-blue}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    height: "46px"
  chip-button-hover:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.deep-navy}"
  phone-pill:
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  stage-wall:
    backgroundColor: "{colors.wall-gray}"
    rounded: "{rounded.xl}"
  stage-tag:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.lg}"
    padding: "10px 16px"
  service-row:
    textColor: "{colors.deep-navy}"
    padding: "26px 20px"
  service-row-hover:
    backgroundColor: "{colors.deep-navy}"
    textColor: "{colors.paper-white}"
  estimate-field:
    backgroundColor: "{colors.field-navy}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    height: "52px"
---

# Design System: JB'S Pro Painters, Roller

## Overview

**Creative North Star: "The Wall You Paint"**

The page is a painter's wall. A primer-white ground carries deep-navy ink, and the one thing that changes it is a navy roller the visitor drags. Everything else is quiet so the real before/after photographs can be the proof: a finished photo exists only where the roller has been. The mood is confident, tactile and trade-honest, not corporate-tech.

Density is generous. Large Gloock headlines sit on wide primer-white margins, content blocks are separated by 70 to 130px of air, and rounded navy "paint-can" chips float over photography. Depth is soft and physical (one wet-edge sheen and lap shadow on the paint front, one broad floor shadow under the stage), never graphic.

The brand colors come from the owner's logo: navy, silver, royal blue. They are used as materials (navy roller, silver ferrule and handle, blue paint accent), not as decoration.

**Key Characteristics:**
- Primer-white ground with a faint fractal-noise grain, navy ink, one royal-blue accent.
- Gloock display over Epilogue body; headlines large, tight, balanced.
- Pill-shaped controls over rounded 22px photo stages.
- Interaction is the hero: drag-to-paint, hover-to-paint list rows, spring-tilted roller.
- Real job photography only; navy chips carry captions over it.

## Colors

A restrained navy-on-white palette with a single saturated blue and silver as metal.

### Primary
- **Royal Blue** (`{colors.royal-blue}`): the only accent. Primary call-to-action fill, the selected-job underline, the "Roll it for me" chip, focus ring, selection and scrollbar. Pressed/hover shade is Pressed Royal (`{colors.royal-blue-pressed}`).

### Secondary
- **Deep Navy** (`{colors.deep-navy}`): ink, the roller body, caption chips (at about 90% opacity), the hover "paint" fill of service rows, the estimate section ground. Field Navy (`{colors.field-navy}`) is the deeper well for form inputs and footer.

### Neutral
- **Primer White** (`{colors.primer-white}`): page ground, with a faint noise grain.
- **Paper White** (`{colors.paper-white}`): the owner section ground, hint pill, text on navy.
- **Wall Gray** (`{colors.wall-gray}`): placeholder ground behind photos while they load.
- **Slate Mute** (`{colors.slate-mute}`): secondary body text on primer white.
- **Silver Hardware** (`{colors.silver-hardware}`): roller ferrule, frame and handle only. Roller body gradient runs Roller Blue Light, Roller Blue Mid, Deep Navy.
- **Estimate Ink / Footer Ink / Placeholder Periwinkle / Error Blush**: text, placeholder and error tones used on the navy estimate form and footer.

### Named Rules
**The One Blue Rule.** Royal Blue is the sole accent and marks the next action or the current selection. Navy is structure, never a second accent.

**The Silver Is Metal Rule.** Silver appears only as roller hardware, never as a UI fill or border.

## Typography

**Display Font:** Gloock (with Georgia, serif), weight 400 only
**Body Font:** Epilogue (with system-ui, sans-serif), 400 to 700 (embedded 400 to 600 variable; 700 on buttons is synthesized or nearest)

**Character:** A high-contrast, sturdy display serif for signage-like headlines against a clean grotesque for reading and controls. Gloock carries the warmth and authority; Epilogue stays out of the way.

### Hierarchy
- **Display** (400, clamp(44px, 7vw, 96px), 0.98): the hero headline only; -0.015em tracking, balanced wrapping.
- **Headline** (400, clamp(38px to 40px, 5.2 to 6vw, 76 to 88px), 1): section h2s (services, warehouse, owner, estimate).
- **Title** (400, clamp(28px, 3.6vw, 50px), 1.05): service names; the pull quote runs smaller at clamp(24px, 2.8vw, 36px) / 1.2.
- **Body** (400, 17px (16px under 700px), 1.6): running copy; lead paragraphs 19px, in Slate Mute, max 30 to 50ch.
- **Label** (600, 13 to 16px): caption chips, progress pill, job picker, hint. Tabular numerals for phone and percent.
- **Button** (700, 15 to 17px): all calls to action.

### Named Rules
**The Serif Speaks, Sans Works Rule.** Gloock for headlines, service names and the quote; Epilogue for everything the visitor reads or taps.

## Layout

Full-width sections with a fluid gutter of max(20px, 3vw); the shared estimate form alone is constrained to 1200px. Vertical rhythm is clamp(70px, 9vw, 130px) between major sections.

The hero is a two-column header (1.25fr headline, 0.75fr supporting copy plus the primary "Get a free estimate" button, aligned to the bottom) above an inset stage card of height clamp(380px, 62svh, 640px). The headline sits above the stage, not over it, and on desktop the "Roll it for me" control lives in the stage's bottom-right corner next to the progress pill (documented adaptation of the original full-bleed-stage intent; the build wins). A horizontally scrolling job picker of 4:3 thumbnails sits beneath the stage.

Services are a full-width ruled list (two columns: name, description). The warehouse section repeats a shorter stage (clamp(320px, 56svh, 600px)) plus a 3-up photo row. The owner section is an asymmetric 0.7fr / 1.3fr grid on white.

Responsive: at 900px two-column grids collapse to one; the third warehouse photo is dropped. At 700px the hero side copy hides, the hint pill moves to the bottom, the caption's place line hides, the stage height becomes clamp(300px, 100svh - 330px, 520px), and a fixed pill contact bar appears. Tap targets are at least 44px.

## Elevation & Depth

Hybrid, with depth reserved for the physical objects. The photo stage has one broad floor shadow (`0 30px 60px -30px #0a143399`) and a 1px top highlight; the roller carries a drop shadow (`drop-shadow(0 12px 10px #0a143366)`). The paint front gets a wet edge: a 55% white sheen on the lit side and a 32% navy lap shadow on the other, drawn in canvas. Everything else is flat: sections are separated by color change (primer white, white, navy) and 1.5px navy rules.

### Named Rules
**The Wet Edge Rule.** Depth belongs to the roller, the paint front and the stage. Cards, chips and rows stay flat.

## Shapes

Soft and pill-based. Controls, chips and pills are fully rounded (99px). Photos and stages are cleanly rounded: 22px for stage and owner portrait, 16px for the warehouse photo tiles and caption tag, 12px for job thumbnails, logo and form fields. The roller's brush footprint is a 10px-radius rounded rectangle and its SVG body uses 14px corners. Dividers are 1.5px solid navy; the selected-job underline is a 3px rounded bar that springs between tabs.

## Components

### Buttons
- **Shape:** full pill (99px), minimum height 56px.
- **Primary:** Royal Blue fill, white 700 text, 30px side padding. Hover darkens to Pressed Royal. One per view ("Get a free estimate").
- **Chip button (on photography):** 46px pill, 1.5px white border, navy 90% fill, white text; hover inverts to white fill with navy text. The solid variant ("Roll it for me") is Royal Blue and inverts to white with blue text on hover. Disabled drops to 70% opacity with a progress cursor.
- **Phone pill (header):** transparent, 1.5px navy outline, 10px 20px padding, tabular numerals.

### Cards / Containers
- **Stage:** 22px radius, Wall Gray ground, floor shadow, grab cursor; carries the before photo, a canvas of the revealed after photo, the roller, a navy caption tag (top-left), a hint pill (top-center, white), and a bar with the progress pill and action chip.
- **Photo tiles:** 4:3, 16px radius, no border or shadow.

### Inputs / Fields
- 52px minimum height, 12px radius, Field Navy fill with white text and a hairline white-20% border on the navy estimate section. Labels are small 13px 600 caps. Errors turn the border and message Error Blush. Focus uses the global 3px Royal Blue outline with 3px offset.

### Navigation
- Slim header: logo (46px, 12px radius) with Gloock wordmark at 24px (wordmark hidden under 700px), phone pill at right, sound toggle fixed top right. Under 700px a fixed navy pill bar offers call, text and estimate.

### Job picker
- Tab list of 4:3 thumbnails at 72% opacity; selected goes to full opacity, ink-colored label and a 3px Royal Blue underline that slides via shared layout animation.

### Roller (signature)
- An SVG roller: blue-to-navy gradient sleeve with a specular highlight, silver ferrule and bent frame, navy handle. It tracks the pointer with a spring (stiffness 700, damping 45) and tilts up to 9 degrees with velocity. Idle, it bobs mid-wall. Painting completes at 74% coverage, the full photo fades in, the roller exits downward, and the chime plays. Reduced motion skips the bob and paints instantly.

### Service rows
- Ruled rows with a navy "paint" layer that scales from the left on hover or focus (0.55s), text flipping to white. Hidden under reduced motion.

## Do's and Don'ts

### Do:
- **Do** use Royal Blue (`#2459e6`) for the single next action and the current selection only.
- **Do** keep every photograph real and let the roller reveal it; captions go in navy chips over the image, never baked into it.
- **Do** make controls pill-shaped (99px) and photo containers 12 to 22px radius.
- **Do** set headlines in Gloock 400 with -0.015em tracking and balanced wrapping; body and controls in Epilogue.
- **Do** keep tap targets at least 44px and keep the 3px Royal Blue focus ring.
- **Do** honor reduced motion: no bobbing, no hover paint, instant reveal.

### Don't:
- **Don't** add a second accent color or use silver as a UI fill.
- **Don't** put shadows on chips, rows or section cards; depth belongs to the roller, wet edge and stage.
- **Don't** use a before/after drag-divider slider; the reveal is always painted by the visitor or by "Roll it for me".
- **Don't** show third-party brands from photos, or invent licenses, years, prices or review counts.
- **Don't** set Gloock below headline scale or in bold; it is single-weight.

### Not canonized (defects the build carries)
- The "Placeholder photo" badge on the owner portrait stands in for an unresolved owner photo and is not a pattern.
- The first-viewport contract called for a full-bleed stage with the headline lower left; the shipped inset-stage layout is recorded as built.
