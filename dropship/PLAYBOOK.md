# Dropshipping product scouting playbook

Goal: hand the owner a short list of products with proof of demand, healthy margin and fast-enough shipping, each with the links to verify in 60 seconds. The owner decides and runs the store.

## What a product must clear (screen)
| Test | Bar | Why |
|---|---|---|
| Landed cost | $3-$22 | Under $3 is a commodity; over $22 kills impulse buys |
| Retail price | ~3.2x cost, snapped to $19.99-$69.99 | Pays for ads + fees + refunds |
| Margin after card fees, ~5% returns, shipping | >= 35% (target 50%+) | Break-even ROAS = 1 / margin |
| Proof of demand | >= 300 lifetime orders on AliExpress, rating >= 4.5 | Someone already buys it and it does not fall apart |
| Shopper demand | Shows in Amazon autocomplete; many long-tail queries; YouTube videos with real views | Search volume proxy and social proof |
| Delivery to the US | <= 12 days, or a US warehouse | Long shipping = refunds and chargebacks |
| Risk | Not branded/IP, not regulated (supplements, medical claims, blades, lithium packs, whitening) | Account bans, lawsuits, Shopify Payments freezes |
| Demo-able | Obvious benefit in 5 seconds of video | Creative is the real lever |
| Necessity | Solves a stated problem (Google "how to stop my..." phrasing) or is a clear gift | Problem-solvers convert on cold traffic |

## Pipeline
1. **Discover** - `python3 dropship/signals.py discover "dog" "car" "back pain"` expands a seed into ranked shopper queries (Amazon autocomplete) plus `[pain]` phrasing (Google suggest). Put the best into `dropship/keywords.txt`.
2. **Scout** - `python3 dropship/scout.py dropship/keywords.txt` pulls AliExpress price, real units sold, rating, delivery and scores margin/proof/shipping/risk.
3. **Rank** - `python3 dropship/rank.py` adds demand (Amazon suggest + YouTube) and writes `dropship/reports/<date>-ranked.md`.
4. **Vet (Claude)** - read the top ~15: open the supplier page, scan 1-star reviews for a deal-breaker, WebSearch for "<product> problems / recall / banned", check how crowded it is (Meta Ad Library link, TikTok link), pick an angle that is not "the same ad everyone runs".
5. **Report** - top 5-10 with: product, supplier link, cost -> price -> profit, break-even ROAS, why it should sell, ad hooks, risks, the 60-second checks.
6. **Test** (owner) - 3 products x 2-3 creatives, small daily budget, 3 days. Rough kill rules (heuristics, not guarantees): outbound CTR under ~1%, add-to-cart under ~5% of clicks, or spend of ~1.5x the product price with no sale. Scale only what beats break-even ROAS with room to spare.

## Honest limits
- AliExpress "sold" is lifetime and lagging: it proves demand, it does not predict what is *about* to trend. Saturation shows up there too.
- Free sources cannot see ad spend, store revenue or true sales velocity. Paid tools (Minea, PiPiAds, Sell The Trend, Kalodata, EchoTik) can; a Scrapfly or CJ API key would let Claude reach more.
- Reddit, CJ, 1688, Taobao, eBay, Walmart block automated access from this environment.
- Nothing here guarantees a winner. The edge is picking an under-served angle, strong creative and fast shipping.

## Sources reached (Oct 2026)
Works: AliExpress search, Amazon autocomplete, Google suggest, YouTube search, Hacker News, Alibaba/Temu pages (not parsed yet).
Blocked or login-walled: Reddit, CJ Dropshipping ("human verification"), 1688/Taobao search, DHgate, eBay, Walmart, Meta Ad Library (open the link by hand), Google Trends (rate-limited).
