# JB'S Pro Painters LLC: website concepts

Three standalone sample sites (plain HTML/CSS/JS, no build step) in `sites/`. Each folder is a complete site.

| Folder | Idea |
|---|---|
| `1-midnight-chrome` | Dark, premium, cinematic navy and chrome. Drag before/after slider, pinned project gallery. |
| `2-fresh-coat` | Bright, friendly, modern. "Pick a color, see it on a house" tool, flip-card projects. |
| `3-quote-first` | Lead-gen first. 4-step free-estimate wizard in the hero, city picker, scroll-driven case files. |

## Host a sample
Zip a site folder's contents (so `index.html` is at the top) and drop it on https://app.netlify.com/drop.

## Free estimate form -> email (jbspropainters@gmail.com)
All three forms are Netlify Forms (`data-netlify="true"`, form name `quote`).
1. Deploy to Netlify.
2. Netlify dashboard > Site > Forms > Form notifications > Add notification > Email > jbspropainters@gmail.com.
If the site is hosted somewhere else (or the post fails) the form opens the visitor's email app with the details pre-filled so a lead is never silently lost.
Each submission has `request = Free estimate`.

## Still needed from the owner (not invented anywhere)
Arizona ROC license number, insurance details, years in business, a proper owner/job-site photo (the current owner image is a placeholder from his Facebook), more reviews, approval to show Thirsty Lion / homeowner photos and the Kenneth R. review text, final domain.
Do not publish the Ducati design-plan image (the end client's spec and trademark).

## Domain ideas (public-registry check on 2026-10-25: no registration or DNS found; confirm at a registrar)
jbspropainters.com (best), jbspropaintersaz.com, jbspaintingaz.com, jbsprofinishes.com, jbspropaintingaz.com, jbsprosaz.com

## Round 2 sites (new photos, new logo)
Source in `sites-v2/`, standalone single-file versions (double-click to open) in `preview/`. Rebuild with `python3 -I clients/jbs-pro-painters/build-v2.py` (add `--pool` to reprocess photos from `assets/`).
- `JBS-a-proof.html`: brand-true navy/silver/blue. Proof-first: hero before/after slider plus 10 drag-to-compare projects with filters, commercial mosaic.
- `JBS-b-swatch.html`: new idea, light paper palette. Paint-chip deck: tap a color chip to open the real job in that color (before/after toggle), "one color, every surface" interior story, from-to cards.
- `JBS-c-raw-to-ready.html`: brand-true cinematic scroll story. 3D logo hero, pinned scroll-scrubbed before/after chapters, raw-vs-ready warehouse rows, service list with photo peek.
All three: free-estimate form with validation, honeypot and Netlify/mailto fallback, meta/OG tags, favicon, alt text, privacy and terms dialogs (sample drafts for owner review), mobile call/text/estimate bar, reduced-motion support.
Still to do per launch checklist once a site is chosen: real domain (canonical, sitemap.xml, robots.txt, HTTPS redirect), analytics + cookie banner, custom 404, final privacy/terms text, higher-res originals of the photos (most are 480px wide).

## Round 3 sites (React + framer-motion, synthesized sound)
Source in `v3/` (shared pieces in `v3/shared/`, one folder per site in `v3/sites/`), single-file builds in `preview/JBS-v3-*.html` (fonts, photos and code all inline, no network needed).
Build: `python3 -I clients/jbs-pro-painters/v3/fonts.py && python3 -I clients/jbs-pro-painters/v3/images.py && node clients/jbs-pro-painters/v3/build.mjs [roller coats board lights studio]` (images.py reads `sites-v2/_pool`, made by `build-v2.py --pool`).
- `roller`: drag a paint roller to reveal the finished photo (canvas mask), jobs picker, auto "Roll it for me", warehouse rolls itself.
- `coats`: 3D logo hero with chrome liquid blobs; Primer / Base / Finish coats pour over each other on scroll, finish prints carry their before; draggable warehouse strip.
- `board`: jobs taped to a charcoal wall, drag prints, tap to flip to the before; taped headline, tape labels.
- `lights`: dark page with a flashlight, a working wall switch, global dimmer, rooms with before/after, services as switches.
- `studio`: procedural 3D house (three.js), recolor walls/trim/garage/front door with real job colors, scheme goes into the estimate form; same colors on real walls with before/after.
Sound is opt-in (Sound button), synthesized with Web Audio (`v3/shared/sound.js`, adapted from `src/audio.ts`).
Design contracts: `.impeccable/surfaces/`. Open items before launch: owner photo, full review text and permission, approval to show the restaurant (signage is visible in the photos), original hi-res photos, real domain, analytics + cookie banner, custom 404, final legal text.

## Current picks (round 4)
- `preview/JBS-home.html`: the main site. Roller hero (drag to roll a real photo into the finished job), a compact Primer / Base / Finish section, services, warehouse, owner, estimate with the 3D logo. New header with a paint line that a roller rolls across as you scroll, painted-swipe nav hover, full-screen mobile menu. No sound.
- `preview/JBS-color-studio.html`: separate page with the 3D house color studio (same header, no sound). Linked from the main site's nav as "Color studio"; keep both files in the same folder.
- The other round 3 concepts moved to `preview/old-concepts/` (sources still in `v3/sites/`).
- Build: `node clients/jbs-pro-painters/v3/build.mjs home studio` (no-sound pages alias `shared/sound.js` to `shared/silent.js`).
- New owner photo candidate saved at `assets/batch-10/` (now used as the owner photo on both pages).

## Texture studio (round 5)
- `preview/JBS-texture-studio.html` replaces the 3D house page. A real JB'S project photo (Gilbert home finished, the same home before, a stucco corner) with a hand-placed wall mask; pick a texture (smooth, fine sand, orange peel, knockdown, skip trowel), texture depth and a real job color; a 2.6x magnifier follows the pointer; "Hold to see original". The chosen finish goes into the estimate form. Linked from the main site nav as "Texture studio".
- Engine: `v3/sites/texture/texture.js` (procedural height fields, light-from-top-left relief, color that keeps the photo's own light and shadow), scenes and wall polygons in `scenes.js` (percent coordinates, add `?mask` to the page URL to see the mask in pink). Edges are approximate; it is labelled a preview.
- The 3D house version lives on in `preview/old-concepts/JBS-color-studio.html` and `v3/sites/studio-house/`.
- To add a project photo: add a scene in `scenes.js` with wall polygons and holes (windows, doors, garage doors).
