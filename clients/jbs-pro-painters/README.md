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
