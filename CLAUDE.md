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
