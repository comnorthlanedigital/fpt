---
name: JB'S Pro Painters, Lights
description: A night-ground page that a physical wall switch and dimmer bring up into a bright gallery of finished rooms.
colors:
  night-ground: "#07080d"
  dusk-ground: "#14141a"
  dawn-ground: "#d9d4c8"
  day-ground: "#efeae0"
  tungsten-cream: "#f1e4cc"
  tungsten-mute: "#bfb49f"
  day-ink: "#17171c"
  day-mute: "#4a4a55"
  tungsten-glow: "#ffd9a0"
  day-hint-brown: "#6a4300"
  switch-blue: "#2459e6"
  switch-blue-hover: "#1a47c2"
  plate-light: "#f4f1ea"
  plate-shade: "#d9d4c8"
  slot-grey: "#2b2b30"
  estimate-ground: "#0b0c12"
  field-ground: "#06070b"
  field-ink: "#f6ecd8"
  placeholder: "#9a927f"
  error-peach: "#ffb1a0"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(50px, 7.4vw, 96px)"
    fontWeight: 800
    lineHeight: 0.94
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(40px, 6vw, 88px)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(34px, 4.4vw, 64px)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  row-title:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontSize: "clamp(22px, 2.8vw, 36px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  sm: "10px"
  md: "18px"
  lg: "22px"
  xl: "26px"
  pill: "99px"
spacing:
  xs: "10px"
  sm: "18px"
  md: "30px"
  lg: "clamp(60px, 8vw, 110px)"
  gutter: "max(20px, 3vw)"
components:
  button-primary:
    backgroundColor: "{colors.switch-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.switch-blue-hover}"
  switch-plate:
    backgroundColor: "{colors.plate-light}"
    rounded: "{rounded.sm}"
    width: "92px"
  segmented-toggle:
    textColor: "{colors.tungsten-cream}"
    rounded: "{rounded.pill}"
    height: "44px"
  photo-frame:
    backgroundColor: "#000000"
    rounded: "{rounded.lg}"
  estimate-field:
    backgroundColor: "{colors.field-ground}"
    textColor: "{colors.field-ink}"
    rounded: "12px"
    height: "52px"
---

# Design System: JB'S Pro Painters, Lights

## Overview

**Creative North Star: "The Wall Switch"**

The page is a dark room until you light it. The ground starts at near-black blue, a flashlight follows the pointer over the hero photo, and a physical switch plate and a header dimmer raise the whole page toward a warm bright gallery. Light is the one state variable: a single motion value (0 to 1) drives the page background, the photo brightness, the hero darkness mask and the ink flip. Everything else is quiet so the finished rooms carry the proof.

The voice is tungsten and plain: cream ink on night, graphite ink on day, one saturated blue reserved for the action. Type is large, heavy and tightly tracked over a calm grotesque body. Photos are big rounded frames; the interface objects (switch plate, mini switches, pill dimmer) are the only places that imitate real hardware.

**Key Characteristics:**
- One light level (0 to 1) governs ground color, photo brightness, hero mask radius and ink flip.
- Dark by default, bright when lit; both states are fully designed, not inverted by filter.
- Heavy, tight display type over a regular grotesque body at 19px.
- Photo-first sections with 18 to 26px rounded frames; flat except for hardware objects.
- Pill-shaped controls, one blue action color.

## Colors

A night-ground and tungsten palette with a single brand-blue action color; the ground and ink are tied to the light level.

### Primary
- **Switch Blue** (`switch-blue`): the only action color. Primary button, Before/After pill, Estimate submit, scrollbar, caret, legal close. Hover darkens to `switch-blue-hover`.

### Secondary
- **Tungsten Glow** (`tungsten-glow`): the light itself. Dimmer track fill, focus ring, hero hint text at night.

### Neutral
- **Night Ground** (`night-ground`): page ground at light 0, header at night (95% alpha), footer.
- **Dusk Ground** (`dusk-ground`): ground at light 0.5.
- **Dawn Ground** (`dawn-ground`): ground at light 0.85, also the lower stop of the switch plate gradient.
- **Day Ground** (`day-ground`): ground at light 1; the day header uses it at 95% alpha.
- **Tungsten Cream** (`tungsten-cream`) and **Tungsten Mute** (`tungsten-mute`): night ink and secondary text.
- **Day Ink** (`day-ink`) and **Day Mute** (`day-mute`): ink flips to these when light exceeds 0.68 (`data-day`). Hero hint becomes `day-hint-brown` in day.
- **Plate Light / Plate Shade / Slot Grey**: the switch hardware (plate gradient 160deg, slot behind the rocker).
- **Estimate Ground, Field Ground, Field Ink, Placeholder, Error Peach**: the always-dark estimate form region; error text is peach.

### Named Rules
**The One Light Rule.** Background, photo brightness and ink are functions of the single light value, never separate toggles. Ground stops: 0 night, 0.5 dusk, 0.85 dawn, 1 day. Photo brightness is 0.5 + 0.5 * light^0.8. Ink flips at 0.68.
**The One Action Rule.** Switch Blue is the only saturated color on the page. Warm tungsten is light, never a button.
**The Two Ink Rule.** Text is either cream on dark or graphite on light; secondary text uses the matching mute value. Never leave cream text on a day ground.

## Typography

**Display Font:** Bricolage Grotesque (embedded, weights 500 to 800, with system-ui fallback)
**Body Font:** Schibsted Grotesk (embedded, with system-ui fallback)

**Character:** a characterful heavy grotesque for statements against a neutral, readable grotesque for the working copy.

### Hierarchy
- **Display** (800, clamp 50px to 96px, 0.94): hero headline "Flip the switch."
- **Headline** (800, clamp 40px to 88px, 0.98): section titles in charcoal, warehouse, services, estimate.
- **Title** (800, clamp 34px to 64px, 1): room names.
- **Row title** (700, clamp 22px to 36px, 1.1): service rows and the owner quote (clamp 22px to 32px); 55% opacity until the row is on.
- **Body** (400, 19px, 1.6): section copy at 30 to 48ch; base page text is 17px (16px on mobile).
- **Label** (600, 13px, 0.08em, uppercase): control captions only: the Dimmer label, form field labels, the switch state label (700, 17px, 0.1em), Before/After inset tag. 

### Named Rules
**The Heavy Tight Rule.** Every heading is Bricolage 800 (700 for row titles) with -0.03em tracking and balanced wrapping.
**The Controls Only Rule.** Uppercase tracked labels belong to controls and form fields, not to introduce sections.

## Layout

Single column of full-width bands inside a 1300px content max (1000px for services, 1200px for the estimate). Side gutter is max(20px, 3vw). Section rhythm is clamp(60px, 8vw, 110px) vertical, rooms separated by clamp(60px, 9vw, 130px). The hero is a .95/1.05 text and photo split at 100svh; rooms alternate 1.1/.9 and .9/1.1 with a 4:3 or tall 4:5 photo. Charcoal is a three-up photo row (.8/1.2/1), warehouse a 16:9 stage over a three-up row, owner a .7/1.3 split.

Below 900px every split becomes one column; below 700px the hero reorders to headline, photo (42svh), copy, actions, hint; the header phone link is replaced by a fixed pill contact bar at the bottom; spare photos are dropped (third charcoal frame, third warehouse figure). The fixed header leaves 150px (64px on mobile) at right for the sound toggle. Tap targets are at least 44px; the primary button and submit are 56px.

## Elevation & Depth

Tonal and photographic: sections are flat on the ground. Depth appears only on hardware objects and photo insets: the switch plate (`0 6px 14px #0008` plus an inner 1px highlight), rocker (`0 3px 5px #0008`), mini switch (`0 3px 8px #0007`), dimmer thumb (`0 2px 6px #000a`), hero panel (`0 30px 60px -30px #000`), Before/After inset (`0 8px 16px -6px #000a` with a 3px white border). All shadows are soft and blurred.

### Named Rules
**The Hardware Only Rule.** Shadow belongs to things you can press (switch, rocker, thumb) and to the hero panel; text, sections and the estimate form carry none.

## Shapes

Pills for every control (99px: button, dimmer, segmented toggle, phone link, sound toggle, mobile bar). Photos use 18, 20, 22, 24 and 26px radii by size (large stage and hero 24 to 26, rooms and owner 22, row photos 18 to 20). Hardware is small-radius (plate 10px, rocker 3px, slot 5px, mini switch 6px). Form fields 12px, estimate card 20px. Borders are 1px hairlines at low alpha, 1.5px currentColor on the segmented toggle and phone link.

## Components

### Buttons
- **Primary:** Switch Blue pill, 56px tall, 30px horizontal padding, white text, 700 weight; hover darkens to the hover blue over .2s. Appears in the hero and as the estimate submit (hover brightens 10%).

### Wall Switch (signature)
A 92px light plate (84px on mobile) with two screws, a dark slot and a rocker that tilts on a spring (stiffness 500, damping 22) between lit and unlit, with a 17px uppercase state label ("Lights on" / "Lights off"). It is a `role=switch` button with a 3px tungsten focus ring. Reused on the warehouse stage inside a translucent dark chip. On flip-on the light value flickers 0.4, 0.06, 0.7, 0.2 then 1 over 1.5s (single step under reduced motion); flip-off eases to 0 over 0.7s.

### Dimmer
A pill in the header with an uppercase caption and a range input; the track fills with Tungsten Glow to the value; the thumb is a 22px white disc. Sliding sets the light directly; above 0.5 the switch reads as on.

### Hero light
The hero photo sits under a radial dark mask that follows the pointer (spring 260/28). Radius runs 190, 520, 2600px across light 0, 0.5, 1 and mask alpha falls from 0.965 to 0.

### Before/After
Each room shows the finished photo by default with a small white-bordered inset of the other state; a pill segmented toggle (Before | After, 44px minimum height, sliding blue pill on a spring) swaps them with a .5s cross-fade.

### Service switches
Hairline-divided rows, each a mini switch plus a row title; turning one on lifts the title to full opacity and slides in its description.

### Estimate form
A permanently dark card region (Estimate Ground) with 20px radius, uppercase 13px field labels, 52px fields on Field Ground, error text in Error Peach, and a Switch Blue pill submit.

## Do's and Don'ts

### Do:
- **Do** derive ground, photo brightness and ink from the one light value; keep the 0.68 ink flip.
- **Do** use Switch Blue only for the primary action and its state (toggle pill, submit).
- **Do** set headings in Bricolage Grotesque 800 at -0.03em and body in Schibsted Grotesk.
- **Do** keep controls pill-shaped and at least 44px tall, primary actions 56px.
- **Do** keep photos in rounded frames with real alt text; place new hardware-like objects on the plate gradient with soft shadow.
- **Do** show both lit and unlit states of any new component.

### Don't:
- **Don't** put cream text on the day ground or graphite text on the night ground; use the matching ink pair.
- **Don't** use a second saturated color for actions; tungsten is only light, focus and track fill.
- **Don't** apply shadows to sections, headings or the estimate form.
- **Don't** use hard offset shadows, glyph icons or uppercase intros above headings.
- **Don't** use filter inversion to fake the day state; define the day values.
