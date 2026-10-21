#!/usr/bin/env python3
"""Join the scout shortlist (margin / proof / shipping) with demand signals (Amazon suggest + YouTube).

    python3 dropship/rank.py                       # uses today's shortlist csv
    python3 dropship/rank.py reports/2026-10-21-shortlist.csv --top 25

final = screen score (0-100ish) + 0.45 * demand (0-100). Writes <date>-ranked.md / .csv and caches demand by keyword.
"""
import csv, datetime, json, os, sys, time, urllib.parse
sys.path.insert(0, os.path.dirname(__file__))
import signals, scout, re

def main():
    argv = sys.argv[1:]
    top = int(argv[argv.index("--top") + 1]) if "--top" in argv else 25
    if "--top" in argv:
        i = argv.index("--top"); del argv[i:i + 2]
    args = [a for a in argv if not a.startswith("--")]
    day = datetime.date.today().isoformat()
    src = args[0] if args else f"dropship/reports/{day}-shortlist.csv"
    rows = list(csv.DictReader(open(src, encoding="utf-8")))
    cache_f = "dropship/cache/demand.json"
    os.makedirs("dropship/cache", exist_ok=True)
    cache = json.load(open(cache_f)) if os.path.exists(cache_f) else {}
    kws = sorted({r["keyword"] for r in rows})
    for i, kw in enumerate(kws, 1):
        if kw not in cache or cache[kw].get("day") != day:
            cache[kw] = {"day": day, **signals.demand_score(kw)}
            json.dump(cache, open(cache_f, "w"), indent=1)
        print(f"[{i}/{len(kws)}] {kw}: demand {cache[kw]['demand']}", file=sys.stderr)
        time.sleep(0.5)
    kept = []
    for r in rows:                                   # re-score with current rules + drop off-topic matches
        toks = [t.rstrip("s") for t in re.findall(r"[a-z]+", r["keyword"].lower()) if len(t) > 2]
        title = r["title"].lower()
        if toks and sum(t in title for t in toks) / len(toks) < 0.5:
            continue
        c = {"cost": float(r["cost"]), "sold": int(float(r["sold"])), "rating": float(r["rating"]), "title": r["title"],
             "choice": str(r["choice"]).lower() == "true", "ship_max": int(float(r["ship_max"])) if r["ship_max"] not in ("", "None") else None}
        sc = scout.score(c)
        if not sc or sc["margin"] < 0.3:
            continue
        r.update(score=sc["score"], retail=sc["retail"], profit=sc["profit"], margin=sc["margin"], be_roas=sc["be_roas"], flags=sc["flags"])
        kept.append(r)
    rows = kept
    for r in rows:
        d = cache[r["keyword"]]
        r["demand"] = d["demand"]; r["amazon_rank"] = d["amazon_rank"]; r["yt_median_views"] = d["yt_median_views"]
        r["final"] = round(float(r["score"]) + 0.45 * float(d["demand"]), 1)
    rows.sort(key=lambda r: r["final"], reverse=True)
    base = f"dropship/reports/{day}-ranked"
    with open(base + ".csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    best_per_kw, out = set(), []
    for r in rows:                       # one best listing per keyword so the report is not 8x the same lamp
        if r["keyword"] not in best_per_kw:
            best_per_kw.add(r["keyword"]); out.append(r)
    with open(base + ".md", "w", encoding="utf-8") as f:
        f.write(f"# Ranked products {day}\n\nfinal = margin/proof score + 0.45 x demand. One best supplier listing per idea. Always vet before spending.\n\n")
        for r in out[:top]:
            q = urllib.parse.quote_plus(r["keyword"])
            f.write(f"## {r['final']}  {r['keyword']}\n- **{r['title'][:100]}**\n- cost ${float(r['cost']):.2f} -> sell ${float(r['retail']):.2f}, profit ${float(r['profit']):.2f} ({float(r['margin']):.0%}), break-even ROAS {r['be_roas']}\n"
                    f"- {int(float(r['sold'])):,} sold, {r['rating']} stars, ships {r['ship_min']}-{r['ship_max']} d | demand {r['demand']} (Amazon rank {r['amazon_rank']}, YouTube median {int(float(r['yt_median_views'])):,} views){' | FLAGS: ' + r['flags'] if r['flags'] else ''}\n"
                    f"- [Supplier]({r['link']}) | [Meta ads](https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q={q}&search_type=keyword_unordered) | [TikTok](https://www.tiktok.com/search?q={q}) | [Amazon](https://www.amazon.com/s?k={q})\n\n")
    print(f"wrote {base}.md", file=sys.stderr)

if __name__ == "__main__":
    main()
