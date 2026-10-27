# FPTSPORTZ demo site

Standalone Vite + React site (GSAP, Lenis, three.js, framer-motion) that demos a redesign of fptsportz.myshopify.com.
Pitch quality bar: it must look like a six-figure agency build.

## Your job on this project
Website design, to the max. For every visual task, use the `ui-ux-pro-max` skill first (styles, palettes, type, UX rules),
then `frontend-design-direction`, `motion-*` and `accessibility` as needed. Brand = the logo: black, gold, deep green
(`assets/brand/logo.jpg`). Verify visually (screenshots at desktop and 390px) before calling anything done.

## Commands
- `npm run dev` / `npm run build` / `npm run zip` (builds and creates `fpt831-site.zip` for Netlify drop)
- `npm run sync` refreshes the catalog; `python3 scripts/prepare_assets.py` regenerates local images and `src/data/shop.json`

## Rules
- Use only the fptsportz.myshopify.com catalog. Do not invent policies, prices or claims; copy them from the real store.
- Product links go to the real store. Cart/checkout are not part of the demo yet.

---

# Behavioral guidelines (Karpathy)

**Tradeoff:** these bias toward caution over speed. For trivial tasks, use judgment.

1. **Think before coding.** State assumptions; if unclear, ask. Present multiple interpretations instead of picking silently. Push back when a simpler approach exists.
2. **Simplicity first.** Minimum code that solves the problem. No speculative features, single-use abstractions or impossible-case error handling.
3. **Surgical changes.** Touch only what you must; match existing style; remove only the orphans your own change created. Mention unrelated dead code, don't delete it.
4. **Goal-driven execution.** Turn tasks into verifiable goals, state a brief plan with a check per step, and loop until verified.

## Launch checklist (every finished client/demo site)
Run through this before calling any site done, and report each item as done / n/a / needs-owner-input:
1. Privacy policy page and Terms & Conditions page (use only facts from the client; flag missing legal details, don't invent them)
2. No secrets in front-end code (API keys, tokens); use server-side/env or the host's form handling
3. Force HTTPS (redirect rule for the host, e.g. Netlify `_redirects`/`netlify.toml`; HSTS where available)
4. Cookie consent banner (only needed if analytics/cookies are used; must gate analytics until accepted)
5. Meta title + description on every page, canonical URL
6. Social preview image (og:image / twitter:card, 1200x630)
7. Favicon (+ apple-touch-icon)
8. `sitemap.xml` and `robots.txt`
9. Alt text on every meaningful image (empty alt for decorative)
10. Compress images (WebP/AVIF or optimized JPEG, responsive sizes, lazy-load below the fold)
11. Check page load speed (Lighthouse/PageSpeed; fix LCP, CLS, blocking scripts)
12. Color contrast fixed to WCAG AA
13. Mobile friendly (verify at 390px, no horizontal scroll, tap targets)
14. Custom 404 page
15. Fix broken links (crawl internal and external links)
16. Form validation (client + server side, clear errors)
17. Spam/bot protection on forms (honeypot, optionally captcha/Turnstile) [asked as "ask ban protection", interpreted as anti-bot]
18. Analytics set up (privacy-friendly where possible; needs the client's account/ID)
19. One clear primary call to action per page/section
