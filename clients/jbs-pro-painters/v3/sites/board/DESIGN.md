---
name: JB'S Pro Painters, The Job Board
description: A charcoal drywall wall where real jobs are taped up as white photo prints with blue painter's tape.
colors:
  drywall-charcoal: "#3a3a3e"
  drywall-deep: "#1d1e24"
  footer-charcoal: "#2c2d33"
  warm-paper-ink: "#f3f0e8"
  mute-lilac-grey: "#c5c6d0"
  tape-blue: "#2f6bd6"
  print-white: "#fbfaf6"
  form-card: "#f6f4ee"
  field-white: "#ffffff"
  field-ink: "#1d1e24"
  caption-grey: "#585a66"
  placeholder-grey: "#6b6d78"
  sticky-note-yellow: "#ffe27a"
  sticky-note-ink: "#2a2400"
  focus-and-hint-gold: "#ffd24a"
  error-red: "#b3261e"
typography:
  display:
    fontFamily: "Big Shoulders Display, Impact, sans-serif"
    fontSize: "clamp(56px, 9vw, 96px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "0em"
  headline:
    fontFamily: "Big Shoulders Display, Impact, sans-serif"
    fontSize: "clamp(54px, 8vw, 96px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "0em"
  body:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  lead:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.35
  label:
    fontFamily: "Barlow, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.1em"
  marker:
    fontFamily: "Permanent Marker, cursive"
    fontSize: "26px"
    fontWeight: 400
    lineHeight: 1.1
rounded:
  print: "3px"
  note: "2px"
  form: "6px"
  field: "12px"
  pill: "99px"
spacing:
  xs: "6px"
  sm: "12px"
  md: "22px"
  lg: "30px"
  section: "clamp(60px, 8vw, 110px)"
components:
  button-tape:
    backgroundColor: "{colors.tape-blue}"
    textColor: "#ffffff"
    typography: "{typography.body}"
    height: "58px"
    padding: "0 34px"
  print-card:
    backgroundColor: "{colors.print-white}"
    textColor: "{colors.drywall-deep}"
    rounded: "{rounded.print}"
    padding: "10px 10px 0"
  tape-label:
    backgroundColor: "{colors.tape-blue}"
    textColor: "#ffffff"
    typography: "{typography.marker}"
    padding: "20px 26px 22px"
  sticky-note:
    backgroundColor: "{colors.sticky-note-yellow}"
    textColor: "{colors.sticky-note-ink}"
    rounded: "{rounded.note}"
    padding: "26px 24px 20px"
  estimate-form:
    backgroundColor: "{colors.form-card}"
    textColor: "{colors.drywall-deep}"
    rounded: "{rounded.form}"
  field:
    backgroundColor: "{colors.field-white}"
    textColor: "{colors.field-ink}"
    rounded: "{rounded.field}"
    height: "52px"
    padding: "13px 15px"
---

# Design System: JB'S Pro Painters, The Job Board

## Overview

**Creative North Star: "The Job Wall"**

The page is a charcoal drywall wall in a job trailer. Work is taped to it: white photo prints with marker captions, strips of blue painter's tape carrying the headline, the buttons and the service labels, and one yellow sticky note for the review. Everything that matters is a physical object stuck to the wall, and the visitor can move the prints and flip them from finished to before. Depth comes from real, soft drop shadows under paper; the wall itself is flat charcoal with a faint noise grain and a darker left-hand band.

The mood is workmanlike and confident, not polished-corporate. Big condensed uppercase type is set tight, blue tape is the only saturated color, and the marker hand is reserved for things someone would write on a wall. The system deliberately leaves the logo's navy-and-silver palette for charcoal and tape blue; the logo stays visible in the header.

**Key Characteristics:**
- Charcoal drywall ground, grain overlay, one saturated blue (tape) as the sole action color.
- Torn-edge tape shapes (clip-path polygons plus fine stripe texture) for every primary action and label.
- White prints, slight rotations (about 1.5 to 3 degrees), soft paper shadows.
- Condensed all-caps display type at 0.9 line height; Barlow for everything readable.
- Motion is physical: spring drop-in, drag with momentum, 3D flip, tape and thud sounds; reduced motion removes entrance and hover transitions.

## Colors

A near-monochrome charcoal wall, warm paper whites, and a single working blue; yellow appears only as paper (sticky note) and as the focus/hint gold.

### Primary
- **Tape Blue** (#2f6bd6): painter's tape. Fills the CTA strip, the headline strips, service labels, the "After" tags, the phone chip, the form-top tape, scrollbar and selection. The only saturated action color.

### Secondary
- **Sticky Note Yellow** (#ffe27a) with ink #2a2400: the single review note. Paper only, never a button or fill for UI chrome.
- **Focus and Hint Gold** (#ffd24a): focus ring (3px) and the handwritten "drag me" hint on the dark wall.

### Neutral
- **Drywall Charcoal** (#3a3a3e): page and estimate-section ground. **Drywall Deep** (#1d1e24): sound toggle, mobile bar, "Before" tags, ink on paper. **Footer Charcoal** (#2c2d33).
- **Warm Paper Ink** (#f3f0e8): body text on the wall; **Mute Lilac-Grey** (#c5c6d0): secondary copy on the wall.
- **Print White** (#fbfaf6): photo print and owner card stock; **Form Card** (#f6f4ee): estimate form surface; **Field White** (#ffffff) fields.
- **Caption Grey** (#585a66), **Placeholder Grey** (#6b6d78), **Error Red** (#b3261e) for small text on paper.

### Named Rules
**The One Tape Rule.** Blue is tape. If something is blue it must look like a strip of tape (torn ends, stripe texture); no blue flat fills, outlines or links.

**The Paper Is Never Dark Rule.** Prints, form and note are light paper on the dark wall; text on paper uses #1d1e24 or darker greys, text on the wall uses the warm and lilac whites.

## Typography

**Display Font:** Big Shoulders Display (Impact, sans-serif), weights 700 to 900, embedded
**Body Font:** Barlow (system-ui), weights 400, 500, 600 (700 and 800 via synthesized/system weight where used), embedded
**Label/Mono Font:** Permanent Marker (cursive), weight 400, embedded

**Character:** A signwriter's condensed block face against a plain humanist sans, with a marker pen for hand-written moments.

### Hierarchy
- **Display** (900, clamp(56px, 9vw, 96px), 0.9): the hero headline, uppercase, each line on its own tape strip.
- **Headline** (900, clamp(48px to 54px, 7 to 8vw, 96px), 0.9): section h2s, uppercase, letter-spacing 0, balanced wrap. The estimate phone number is the same face at 800, clamp(40px, 5vw, 64px).
- **Lead** (400, 22px, 1.35): hero and section support copy, max 30 to 32ch; owner paragraph 21px/1.45 at 46ch.
- **Body** (400, 17px (16px on phones), 1.6): default Barlow.
- **Label** (700, 12px, 0.1em, uppercase): print tags; form labels are 13px, 600, 0.08em uppercase.
- **Marker** (400): print captions (clamp(17px, 1.6vw, 22px)), tape labels (26px), the sticky note (clamp(20px, 2vw, 26px)), the gold hint (18 to 19px).

### Named Rules
**The Hand Is Written Rule.** Marker type is for text that could plausibly be written on tape, a print or a note. Running copy, navigation and form text stay in Barlow.

## Layout

A single wall column, max-width 1360px (1100 to 1260px for text sections), side padding max(14 to 20px, 3 to 4vw). The hero is a 1.15fr / 0.85fr grid, headline left and CTA right, bottom aligned. Print boards are absolutely positioned fields with fixed heights (1230px and 980px desktop; 1560px and 1060px phone); each print is 29% wide on desktop and 45% on phones, placed by percentage coordinates so a wall reads as a loose scatter in three columns, then two on phones. The owner section is a .6fr / 1.4fr grid; the estimate section is a two-column copy and form split. Section rhythm is clamp(60px, 8vw, 110px). Below 900px grids collapse to one column; below 700px the prints re-scatter to the phone coordinates, the hint swaps to an inline line, labels go full width, and a fixed pill contact bar appears (shared).

## Elevation & Depth

Hybrid: a flat wall, with real shadows only on objects that are paper or tape. Depth says "stuck to the wall", never "floating UI".

### Shadow Vocabulary
- **Print** (`box-shadow: 0 18px 30px -14px #000a, 0 2px 5px #0006`): photo prints; the owner card uses the first layer alone.
- **Note** (`0 14px 24px -12px #000a`): the sticky note.
- **Tape label** (`0 6px 10px #0005`): service labels.
- **Form** (`0 24px 40px -20px #0008`): the estimate form card.

### Named Rules
**The Paper Casts, The Wall Doesn't Rule.** Only paper and tape objects carry shadows; no shadow on text, the wall, or the sound toggle and mobile bar.

## Shapes

Paper is nearly square (3px prints, 2px note, 6px estimate form). Tape is the signature silhouette: a rectangle with notched, torn ends made by clip-path polygons, varied per element, with a faint 90-degree stripe texture. Tilt (-3 to 3 degrees) is part of the shape language. Form fields (12px) and the sound toggle, mobile bar, and submit button (99px pill) come from the shared kit and are softer than the world's own forms.

## Components

### Buttons
- **Tape button (primary CTA):** 58px min height, 0 34px padding, Barlow 800 22px uppercase, tape blue with stripe texture, torn-end clip-path. Hover rotates -1.5 degrees and scales 1.03 (200ms); removed under reduced motion. One per view: "Get a free estimate".
- **Phone chip:** tape blue, Barlow 700 18px, notched right edge, tabular numerals.
- **Estimate submit and mobile bar (shared):** pill, tape blue fill, brightness 1.1 on hover.

### Prints (signature)
White card with 10px border and a 4:3 photo; torn tape strip centered on top edge; marker title with a Barlow place line. Tap flips in 3D (0.7s) between After and Before; "After" tag is blue, "Before" tag is deep charcoal. Drag with spring momentum and raise-to-front; focusable buttons with descriptive aria-labels.

### Tape labels
Blue torn strips with Marker 26px title and Barlow 17px line in pale blue-white (#eaf0ff). Hovering straightens and lifts by 3px.

### Sticky note
Yellow, 1.5 degree tilt, Marker quote, Barlow attribution, tape strip on top.

### Inputs / Fields
White field, 12px radius, 52px min height, grey placeholder, uppercase 13px labels above; invalid state uses error red border and message. Focus is the global 3px gold outline with 3px offset.

### Navigation
No nav bar: a logo (12px radius) and phone chip float at the top; a pill sound toggle sits at top-right.

## Do's and Don'ts

### Do:
- **Do** put every primary action and label on a torn tape strip in #2f6bd6.
- **Do** keep text on paper dark (#1d1e24) and text on the wall warm white (#f3f0e8) or #c5c6d0.
- **Do** keep display type uppercase at 0.9 line height and 0 tracking.
- **Do** use the gold #ffd24a for focus rings.
- **Do** disable hover and entrance motion under prefers-reduced-motion.

### Don't:
- **Don't** introduce another saturated color; yellow is paper only.
- **Don't** use marker type for running copy or navigation.
- **Don't** put shadows on the wall or on UI chrome.
- **Don't** make photos or tape perfectly rectangular and axis-aligned.
