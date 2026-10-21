---
name: product-scout
description: Find dropshipping products with proven demand, healthy margins and fast shipping, then report supplier links plus naming and store-theme ideas. Use when the user asks for product ideas, winning products, a product scouting run, store names, product names or a dropshipping store concept.
---

# Product scout

Follow `dropship/PLAYBOOK.md`. Run from the repo root.

1. `pip install -q requests beautifulsoup4` if needed.
2. Refresh `dropship/keywords.txt`: use `python3 dropship/signals.py discover "<seed>" ...` plus WebSearch for current seasonal trends (state the date; vendor blogs are opinion, not data).
3. `python3 dropship/scout.py dropship/keywords.txt` then `python3 dropship/rank.py` (a few minutes; run in the background).
4. Vet the top results for real: supplier page, 1-star review themes, WebSearch for problems/recalls, saturation via the Meta Ad Library and TikTok links.
5. Write the report to `dropship/reports/<date>-report.md`: 5-10 products, each with supplier link, cost -> price -> profit, break-even ROAS, why it should sell, 3 ad hooks, risks. Say plainly what is unverified.
6. When asked, add 2-3 store concepts: name options (check the .com with a DNS lookup), product renames, tagline, color/theme direction.
Never claim guaranteed winners. Flag brand/IP, regulated categories and slow shipping. Do not publish or change a Shopify store without the owner's go-ahead.
