---
name: JB'S Pro Painters, Coats
description: Three coats of paint poured over each other as you scroll, in deep navy, royal blue and silver.
colors:
  navy-night: "#050a1c"
  navy-deep: "#0a1433"
  royal-blue: "#2459e6"
  royal-blue-pressed: "#1a47c2"
  silver: "#d5dcea"
  mist-ink: "#eef2fb"
  slate-mute: "#aab6d3"
  primer-grey: "#dfe3ec"
  focus-periwinkle: "#8fb0ff"
  placeholder-blue: "#8f9fc8"
  photo-well: "#0d1838"
typography:
  display:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: "clamp(44px, 8.6vw, 96px)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: "clamp(32px, 5vw, 68px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Unbounded, system-ui, sans-serif"
    fontSize: "clamp(20px, 2.6vw, 34px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Albert Sans, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  photo-inset: "8px"
  photo: "12px"
  card: "18px"
  portrait: "22px"
  pill: "99px"
spacing:
  gutter: "max(20px, 5vw)"
  section: "clamp(70px, 9vw, 130px)"
  strip-gap: "14px"
  coat-gap: "3vw"
components:
  button-primary:
    backgroundColor: "{colors.royal-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.royal-blue-pressed}"
  button-silver:
    backgroundColor: "{colors.silver}"
    textColor: "{colors.navy-deep}"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  photo-tag:
    backgroundColor: "{colors.navy-night}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  print:
    backgroundColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "8px"
  field:
    backgroundColor: "{colors.navy-night}"
    textColor: "{colors.mist-ink}"
    rounded: "12px"
    padding: "13px 15px"
    height: "52px"
---

# Design System: JB'S Pro Painters, Coats

## Overview

**Creative North Star: "Three Coats, Poured"**

The page is one job told in three coats: Primer, Base, Finish. A pinned stage holds three full-bleed panels (pale primer grey, royal blue, deep navy). Each next coat rises over the last through a liquid, dripping SVG edge as you scroll, with a thin white highlight line riding the edge. Around it the site is calm deep navy with silver type, so the real before/after photographs and the 3D logo carry the color.

The voice is wide, heavy Unbounded display set tight over a quiet Albert Sans body. Surfaces are flat tonal navy; depth comes only from photos laid like glossy prints on the stage. Chrome appears once, as cursor-following liquid blobs behind the hero logo.

**Key Characteristics:**
- Navy-first dark ground; royal blue is the single action color; silver is the neutral voice.
- Liquid wavy coat edges (SVG clipPath plus highlight stroke) are the signature device.
- Photos are white-matted prints, slightly rotated, drifting at different scroll speeds.
- Pill-shaped controls, generously rounded photo frames, no sharp corners on interactive things.
- Sound (drip, whoosh, scrape, pop) is part of the interaction grammar and is user-toggleable.

## Colors

A logo-derived palette: night navy, royal blue, silver and chrome, with one pale primer grey used for the first coat only.

### Primary
- **Royal Blue** (`royal-blue`): the primary button, the Base coat panel, the "Ready" photo captions, the service plus glyph, scrollbar and caret.
- **Pressed Blue** (`royal-blue-pressed`): button hover only.

### Neutral
- **Night Navy** (`navy-night`): page ground, hero base, form fields, photo tag chips.
- **Deep Navy** (`navy-deep`): the Finish coat, the drag strip, the estimate section, the mobile bar, and ink on the primer panel and silver button.
- **Silver** (`silver`): secondary text on navy, the silver button, Finish coat text, services headings at rest.
- **Mist Ink** (`mist-ink`): default body text on navy.
- **Slate Mute** (`slate-mute`): supporting paragraphs and footer.
- **Primer Grey** (`primer-grey`): the first coat panel background only.
- **Focus Periwinkle** (`focus-periwinkle`): focus outline (3px, 3px offset).
- **Placeholder Blue** (`placeholder-blue`) and **Photo Well** (`photo-well`): input placeholders and image loading wells.

### Named Rules
**The Logo Palette Rule.** Every color traces back to the logo: navy, silver/chrome, royal blue. A new hue needs a reason in the logo.

**The One Action Rule.** Royal blue (or silver on the blue-adjacent Finish panel) marks the one primary action. On the royal-blue coat the button flips to silver so it never disappears into its ground.

## Typography

**Display Font:** Unbounded (700, embedded, with system-ui fallback)
**Body Font:** Albert Sans (400-600 embedded, with system-ui fallback)

**Character:** Unbounded is wide and confident, a signage voice; Albert Sans is neutral and legible on phones. Display is always tight (-0.025 to -0.03em) and wrapped with text-wrap: balance.

### Hierarchy
- **Display** (700, clamp 44px to 96px max, 0.95): the one-word coat titles "Primer.", "Base.", "Finish.".
- **Hero headline** (700, clamp 40px to 84px, 0.98, single line on desktop): "Primer. Base. Finish."
- **Headline** (700, clamp 32px to 68px, 1.05): section titles (services, strip); owner and estimate headings run smaller or larger within the same family.
- **Title** (700, clamp 20px to 34px, 1.15): service accordion rows and the owner quote.
- **Body** (400, 17px desktop / 16px mobile, 1.6; supporting paragraphs 18-22px, capped at 30-52ch).
- **Label** (600, 12px, 0.12em, uppercase): photo tags and strip captions only, as chips on images.

### Named Rules
**The Wide-Over-Quiet Rule.** Only Unbounded carries emphasis; Albert Sans never goes display-size.

## Layout

Full-width bands with a 5vw (min 20px) gutter; text bands cap at 1100-1300px, the estimate form at 1200px. The coats stage is a 440svh scroll runway containing a 100svh sticky stage, split .9fr text / 1.1fr photo field on desktop; photos are absolutely positioned inside the field by percentage, so the collage reflows without breakpoints. At 900px and below the coat stacks to one column; at 700px and below the hero blobs are removed, the logo goes to full viewport width, the headline may wrap, one photo per coat is dropped and photo arrangements are reset. Section rhythm is clamp(70px, 9vw, 130px) vertical. Mobile gets a fixed pill contact bar (call, text, estimate). Tap targets are at least 44px, buttons 56px.

## Elevation & Depth

Flat tonal layering with one exception: photo prints. Backgrounds never carry shadows; the coats separate through color change and the liquid edge. Prints sit on a soft, offset-free, blurred shadow.

### Shadow Vocabulary
- **Print lift** (`box-shadow: 0 22px 40px -18px #050a1c88`): the white-matted photo on a coat panel.
- **Before inset** (`box-shadow: 0 8px 14px -6px #050a1c99`): the small "before" thumbnail on finished prints.

### Named Rules
**The Print Only Rule.** Shadow belongs to photographs lying on a coat. Buttons, cards and bands stay flat.

## Shapes

Pill (99px) for every button, tag, chip, mobile bar and the phone link. Photos: 18px outer frame with a 8px white mat and 12px inner image radius; strip frames 18px; owner portrait 22px; form card 20px, fields 12px; before thumbnails 8px with a 3px white border. The coat edge is an organic wave with narrow drips, drawn as a clip path, never a straight cut. Thin 1px translucent white rules divide the services list.

## Components

### Buttons
- **Shape:** full pill, 56px tall (50px in the mobile coat), 30px side padding, bold Albert Sans.
- **Primary:** royal blue fill, white text; hover to pressed blue over 0.2s.
- **Silver:** silver fill, deep-navy text; hover to white. Used on the Finish coat.
- **Focus:** 3px periwinkle outline, 3px offset, on all focusable elements.

### Photo prints and tags
White 8px mat, 18px radius, rotation of 1 to 2 degrees, scroll-linked vertical drift. Pill tag top-left names the stage ("Taped off", "Masked", "Cut in", "Mid-job", "Finished") in 11px uppercase on near-opaque navy. Finished prints carry a bordered "Before" thumbnail bottom-right.

### Services accordion
Hairline-ruled rows; Unbounded title in silver that turns white on hover or open; 64px minimum row height; answer panel animates height over 0.45s.

### Drag strip
A horizontal draggable row of 4:3 photos (240 to 420px wide, 14px gap) on deep navy. Captions: "Raw" on navy, "Ready" on royal blue.

### Estimate form
Translucent white card (5% white) with a 1px translucent border; fields navy with 12px radius and 52px height; uppercase 13px labels; full-width pill submit in royal blue. Errors in soft red (`#ff9d9d`).

### Coat progress nav
Three dots with labels (Primer, Base, Finish) at the bottom of the stage, 12px uppercase, current at full opacity, ink flips to navy on the primer panel.

### Hero logo and blobs
3D logo centered, radially masked into the navy with lighten blending, scaling 1 to 1.18 on scroll; seven chrome-gradient goo blobs follow the pointer with spring lag.

## Do's and Don'ts

### Do:
- **Do** keep one primary action per coat and per band, in royal blue (silver on the blue coat).
- **Do** lay real photographs as white-matted, slightly rotated prints and label them honestly with the stage they show.
- **Do** shape any new coat or section boundary as a liquid, dripping edge with a thin white highlight.
- **Do** honor prefers-reduced-motion: no blobs, no edge wobble.
- **Do** keep tap targets at 44px minimum and focus outlines visible.

### Don't:
- **Don't** introduce hues outside navy, royal blue, silver and primer grey.
- **Don't** add shadows to anything but photographs.
- **Don't** use Unbounded below title size for running text, or Albert Sans for display.
- **Don't** use straight, hard section cuts inside the coat sequence.

## Not canonized (defects the build carries)
- Albert Sans is embedded only for weights 400-600, but buttons and the submit use 700, so the browser synthesizes bold; fix by embedding 700 or using 600.
- Photo tag (11px) and "Before" label (10px) text is under comfortable legibility; do not inherit those sizes.
- The services expand control is a typed "+" glyph; new surfaces should use drawn SVG icons.
- The owner portrait carries a visible "Placeholder photo" label; remove when the real photo arrives.
- `.coat h2` declares two font-size rules (clamp then min/max); the latter wins, so the clamp is dead.
