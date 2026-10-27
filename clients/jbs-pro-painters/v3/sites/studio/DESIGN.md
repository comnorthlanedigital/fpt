---
name: JB'S Pro Painters - Color Studio
description: A dark, near-black page that recolors itself to the wall color you pick on a spinning 3D stucco house.
colors:
  ink-night: "#12141a"
  ink-deep: "#0b0c10"
  paper-warm: "#f4f2ec"
  mute-cool: "#c4c7d2"
  placeholder-gray: "#979bab"
  royal-blue: "#2459e6"
  royal-blue-pressed: "#1c47c0"
  error-blush: "#ffb1b1"
  wall-stone: "#b7ab98"
  swatch-deep-navy: "#1f3563"
  swatch-garage-green: "#46594f"
  swatch-charcoal: "#54535a"
  swatch-racing-red: "#b01f2a"
  swatch-walnut: "#5b3720"
  swatch-bone-white: "#ece8df"
  swatch-soft-gray: "#9a9ca3"
  swatch-warm-sand: "#cdb99a"
  swatch-sage: "#8a9a82"
  swatch-slate-blue: "#5c7185"
  swatch-near-black: "#1b1b1f"
  swatch-bright-white: "#f7f7f4"
  swatch-clay: "#a9715a"
typography:
  display:
    fontFamily: "Anybody, Impact, sans-serif"
    fontSize: "clamp(34px, 5vw, 72px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 122"
  headline-hero:
    fontFamily: "Anybody, Impact, sans-serif"
    fontSize: "clamp(36px, 4.2vw, 62px)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  title:
    fontFamily: "Anybody, Impact, sans-serif"
    fontSize: "clamp(20px, 2.2vw, 28px)"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Rethink Sans, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  body-lead:
    fontFamily: "Rethink Sans, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  control:
    fontFamily: "Rethink Sans, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.6
  label:
    fontFamily: "Rethink Sans, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  sm: "12px"
  md: "14px"
  lg: "20px"
  xl: "22px"
  stage: "28px"
  pill: "99px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "34px"
  gutter: "max(20px, 3vw)"
  section: "clamp(60px, 8vw, 110px)"
components:
  button-primary:
    backgroundColor: "{colors.royal-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.royal-blue-pressed}"
  zone-tab:
    backgroundColor: "#ffffff12"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: "48px"
    padding: "0 14px"
  zone-tab-selected:
    backgroundColor: "{colors.paper-warm}"
    textColor: "{colors.ink-night}"
  preset-chip:
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    height: "40px"
    padding: "0 16px"
  preset-chip-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink-night}"
  swatch:
    rounded: "{rounded.pill}"
    size: "40px"
  kit-panel:
    backgroundColor: "#0b0c1099"
    rounded: "{rounded.xl}"
    padding: "16px"
  stage:
    rounded: "{rounded.stage}"
  photo-pair:
    backgroundColor: "{colors.ink-deep}"
    rounded: "{rounded.lg}"
  field:
    backgroundColor: "{colors.ink-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    height: "52px"
    padding: "13px 15px"
---

# Design System: JB'S Pro Painters - Color Studio

## Overview

**Creative North Star: "The Turntable Showroom"**

A dark showroom with one lit object: a 3D stucco house on a turntable. The page is deliberately near-black so that every color that appears is a paint color the visitor chose. The hero background is a 34% mix of the current wall color into night ink, so picking walls repaints the room around the house. The swatches are the colors of real JB'S jobs (navy cabinets, garage-door green, walnut door, racing red), not a generic palette; the same colors reappear as dots beside the real before/after photos.

Personality is confident, tactile and playful-but-credible: wide, heavy Anybody headlines over a calm Rethink Sans, pill controls sized for a thumb, and marimba plucks (opt-in sound) per swatch. Density is low on the first screen (a headline, one panel, one button, one house) and opens into photo proof and an owner block.

**Key Characteristics:**
- Near-black ground; color comes only from the stage, the swatches and the photos.
- Page tint follows the chosen wall color (hero background, 0.9s transition).
- Pill geometry for every action; large soft radii for panels and media.
- One blue action color, used for the primary button and form submit.
- Wide extended display type (width axis 112-122%) over a neutral humanist body.

## Colors

A near-black stage with warm paper ink, one royal-blue action color, and a 14-swatch job palette that is the real content.

### Primary
- **Royal Blue** (#2459e6): the single action color. Primary button ("Request this scheme"), form submit, scrollbar, caret, selection. Hover deepens to Pressed Blue (#1c47c0); form submit instead brightens by filter.

### Neutral
- **Night Ink** (#12141a): page ground, selected-tab text, tooltip/hint pills.
- **Deep Ink** (#0b0c10): footer, form fields, photo-frame backing, sound toggle.
- **Warm Paper** (#f4f2ec): body text and the selected-tab/selected-segment fill.
- **Cool Mute** (#c4c7d2): secondary copy, fine print, footer text.
- **Placeholder Gray** (#979bab) and **Error Blush** (#ffb1b1): form placeholder and invalid states.
- **Stone Wall** (#b7ab98): starting wall color; feeds the hero tint through the live `--wall` property.

### Job Swatches (content palette)
Deep navy #1f3563, garage-door green #46594f, charcoal #54535a, racing red #b01f2a, walnut stain #5b3720, stone neutral #b7ab98, bone white #ece8df, soft gray #9a9ca3, warm sand #cdb99a, sage #8a9a82, slate blue #5c7185, near black #1b1b1f, bright white #f7f7f4, clay #a9715a. These are user-selectable content, not UI chrome; the frontmatter lists them as `swatch-*`.

### Named Rules
**The Chosen Color Rule.** Outside the swatch palette and the single blue action, no saturated color appears in the interface. The page's only changing hue is the wall color the visitor picked.
**The Honest Swatch Rule.** A swatch is added only when it matches a color from a real job or a plain neutral, and it is named by its look, never by a paint brand.

## Typography

**Display Font:** Anybody (variable, weight 500-900, width 100-150%), fallback Impact, sans-serif
**Body Font:** Rethink Sans (variable, weight 400-600), fallback system-ui, sans-serif

**Character:** Anybody stretched wide and set heavy at 800 with tight tracking reads like a showroom sign; Rethink Sans stays quiet beneath it. Both are embedded in the file.

### Hierarchy
- **Display** (800, clamp(34px,5vw,72px), 0.98, width 122%, -0.02em): section h1/h2 such as "The same colors, on real walls." The estimate heading scales to clamp(40px,6vw,88px).
- **Headline** (800, clamp(36px,4.2vw,62px), 1.08, width 112%): hero h1 "Try the color first."; 34-46px on phones.
- **Title** (700, clamp(20px,2.2vw,28px), 1.3, width 112%): the owner quote, max 28ch.
- **Body** (400, 17px/1.6, 16px under 700px): default copy; lead paragraphs 18-19px, capped at 34-48ch.
- **Control** (600, 14-15px): tab, chip, segment and hint text.
- **Label** (600, 13px, 0.08em, uppercase): form field labels only.

### Named Rules
**The Wide Heading Rule.** Headings use Anybody with the width axis raised (112-122%) and weight 800; never a narrow or default-width cut, and never Impact except as the failure fallback.

## Layout

Sections are centered in a 1300px max column (estimate form 1200px) with a fluid side gutter of max(20px, 3vw) and vertical rhythm of clamp(60px, 8vw, 110px). The hero is a two-column grid at 0.8fr / 1.2fr (min 380px for the panel) filling at least 100svh, aligned center; the 3D stage takes the larger column (about 60% rather than the two thirds in the contract). Real-work proof is a four-column row with every second figure dropped 40px for a staggered shelf; the owner block is a 0.7fr / 1.3fr split. Gaps run 6, 8, 14, 18px inside controls and clamp-based between columns.

Responsive: at 1000px the hero stacks with the stage first (height min(56svh,520px)) and the panel after; proof goes to two columns; owner stacks. At 700px the hero lead paragraph is hidden, the stage drops to min(38svh,340px), the sticky contact bar appears, and the swatch grid stays seven across with 40px minimum targets.

## Elevation & Depth

Mostly tonal and flat: depth comes from translucent white overlays on near-black (#ffffff12 to #ffffff22 for tabs, 1px #ffffff2e panel borders) and from the lit 3D scene itself. The single shadow is a soft downward lift under the stage.

### Shadow Vocabulary
- **Stage lift** (`box-shadow: 0 30px 60px -30px #000c`): the 3D stage only.

### Named Rules
**The Lit Object Rule.** Only the 3D house is allowed real lighting and shadow; all interface surfaces stay flat, separated by translucency and hairline borders.

## Shapes

Pill (99px) for every action: buttons, chips, segmented controls, hints, phone link, form submit. Circles for swatches and zoom buttons. Soft rounded rectangles for containers in descending size: stage 28px, panel and owner photo 22px, photo pair and form card 20px, zone tabs 14px, form fields and logo 12px. Borders are hairline (1px, 1.5px on the phone link, 2px on swatches); the selected swatch gets a white 3px outline with 2px offset.

## Components

### Buttons
- **Shape:** full pill (99px), 56px minimum height.
- **Primary:** Royal Blue fill, white bold text, 0 30px padding; one per view ("Request this scheme", form submit).
- **Hover / Focus:** background to #1c47c0 over .2s; focus is a 3px white outline with 3px offset (accent-blue on the shared pages).
- **Ghost:** the phone link and preset chips use a 1-1.5px translucent white outline; chips invert to white fill with Night Ink text on hover.

### Zone Tabs and Swatches (signature)
A four-tab group (Walls, Trim, Garage door, Front door) in a two-by-two grid; each tab shows a ring that fills with its current color. The selected tab's Warm Paper pill glides between tabs on a spring. Below, a seven-column grid of 40px minimum circular swatches scales on hover (1.12) and tap (0.92), names appear as aria-labels and titles, and a plain-language line states the current choice.

### Cards / Containers
- **Kit panel:** 22px radius, 16px padding, 60%-opaque Deep Ink fill, 1px white-18% border.
- **Photo pair:** 3:4, 20px radius; a two-part Before/After segmented pill sits inside at the bottom, with an opacity cross-fade (0.45s). A caption row shows a 34px swatch dot with the color name in bold.

### Inputs / Fields
Deep Ink fill, 12px radius, 1px translucent border, 52px minimum height, 17px text; labels are 13px uppercase tracked. Invalid state swaps the border and message to Error Blush. The color-scheme field is prefilled from the current four choices.

### Navigation
No menu. A top bar carries the logo (46px, 12px radius) and an outlined pill phone link, with an opt-in sound toggle at the right; on phones a sticky pill bar (call, text, estimate) slides up.

## Do's and Don'ts

### Do:
- **Do** keep the ground near-black (#12141a, #0b0c10) and let swatches, photos and the house carry color.
- **Do** make every action a pill with at least 40px height (56px for the primary).
- **Do** name colors by their look ("Garage-door green") and tie them to a real job photo where one exists.
- **Do** keep the 3D illustration disclaimer ("3D illustration only") under the hero.
- **Do** keep one Royal Blue primary action per view.

### Don't:
- **Don't** use a second saturated UI accent next to Royal Blue.
- **Don't** put shadows on interface surfaces; the stage lift is the only one.
- **Don't** set headings in a narrow or default-width face, or in the Impact fallback by choice.
- **Don't** name paint brands or show third-party brands in photos without owner approval (PRODUCT.md).

## Not canonized

- The pressed-blue hover (#1c47c0) is hard-coded in the button rule rather than a token; recorded as a value, not a pattern to extend.
- The "Placeholder photo" pill on the owner image marks an unresolved asset; it is a defect carried by the build, not a component.
- Hero text colors #e6e4dd and #dcdad2 are one-off values near Warm Paper and are not recorded as tokens.
