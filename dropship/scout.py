#!/usr/bin/env python3
"""Dropshipping product scout.

Takes keyword ideas, pulls AliExpress search results (price, real units sold, rating, delivery estimate),
scores each candidate for margin / demand / shipping / risk, and writes a ranked shortlist.

    python3 dropship/scout.py dropship/keywords.txt            # -> dropship/reports/<date>-shortlist.{csv,md}
    python3 dropship/scout.py dropship/keywords.txt --top 40

Limits (be honest in reports): AliExpress units sold is LIFETIME and lagging, so it shows proven demand,
not what is about to trend. Rank is a screen for margin + proof; novelty, angle and creative come from the human/Claude pass.
"""
import argparse, csv, datetime, json, math, re, sys, time, urllib.parse
import requests

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
HEAD = {"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"}

# things that get stores banned, sued or refunded to death
BRAND = re.compile(r"\b(nike|adidas|apple|iphone|airpods|samsung|disney|marvel|pokemon|gucci|louis vuitton|lv|chanel|rolex|yeti|stanley|dyson|lego|sony|nintendo|hello kitty|labubu|jordan|supreme|oem|brand new original)\b", re.I)
RISKY = re.compile(r"\b(supplement|vitamin|weight loss|diet|slimming|medical|cure|therapy|laser|knife|dagger|weapon|gun|taser|vape|cbd|nicotine|lithium battery pack|power bank|e-?cig|sex|adult|whitening|teeth|baby formula|pesticide|hearing aid)\b", re.I)

def fetch(url, tries=3):
    for i in range(tries):
        try:
            r = requests.get(url, headers=HEAD, timeout=40)
            if r.status_code == 200 and "itemList" in r.text:
                return r.text
        except requests.RequestException:
            pass
        time.sleep(2 + 3 * i)
    return None

def parse_items(html):
    i = html.find('"itemList":{"content":[')
    if i < 0:
        return []
    i += len('"itemList":{"content":')
    depth = 0
    for j in range(i, len(html)):
        c = html[j]
        depth += (c == "[") - (c == "]")
        if depth == 0:
            break
    try:
        return json.loads(html[i : j + 1])
    except json.JSONDecodeError:
        return []

def num(x, default=0.0):
    try:
        return float(x)
    except (TypeError, ValueError):
        return default

def clean(it, kw):
    t = it.get("trace", {}).get("utLogMap", {})
    price = num(it.get("prices", {}).get("salePrice", {}).get("minPrice"))
    orig = num(it.get("prices", {}).get("originalPrice", {}).get("minPrice"))
    sold = int(num(t.get("real_trade_count")))
    if not sold:  # fall back to "5K+ sold"
        m = re.match(r"([\d.]+)\s*([KkMm]?)", it.get("trade", {}).get("tradeDesc", "") or "")
        if m:
            sold = int(float(m.group(1)) * {"": 1, "k": 1e3, "m": 1e6}[m.group(2).lower()])
    d = (t.get("delivery_info") or "").split(",")
    dmin, dmax = (int(d[0]), int(d[1])) if len(d) >= 2 and d[0].isdigit() and d[1].isdigit() else (None, None)
    pid = it.get("productId")
    return {
        "keyword": kw, "title": (it.get("title", {}).get("displayTitle") or "").strip(), "cost": price, "list_price": orig,
        "sold": sold, "rating": num(it.get("evaluation", {}).get("starRating")), "ship_min": dmin, "ship_max": dmax,
        "choice": bool(t.get("isChoice")), "id": pid, "link": f"https://www.aliexpress.com/item/{pid}.html",
        "image": ("https:" + it["image"]["imgUrl"]) if it.get("image", {}).get("imgUrl", "").startswith("//") else it.get("image", {}).get("imgUrl"),
    }

def price_for(cost):
    """Retail price target: ~3.2x landed cost, snapped into the $19.99-$69.99 impulse band."""
    p = max(19.99, min(69.99, cost * 3.2))
    return math.floor(p) + 0.99 if p >= 20 else 19.99

def score(c):
    cost = c["cost"]
    if cost <= 0:
        return None
    retail = price_for(cost)
    fees = retail * 0.029 + 0.30 + retail * 0.02         # card + checkout/app drag
    ship_cost = 0.0 if c["choice"] else 3.0               # AliExpress Choice usually ships free; else assume ~$3
    refunds = retail * 0.05                               # returns / chargebacks reserve
    profit = retail - cost - ship_cost - fees - refunds
    margin = profit / retail
    be_roas = 1 / margin if margin > 0 else 99
    s = 0.0
    s += min(40, 8 * math.log10(max(c["sold"], 10)))                      # proven demand (log scale, max 40)
    s += 20 * max(0, min(1, (c["rating"] - 4.4) / 0.5))                    # quality 4.4 -> 4.9
    s += 25 * max(0, min(1, (margin - 0.30) / 0.30))                       # margin 30% -> 60%
    if c["ship_max"]:
        s += 15 * max(0, min(1, (18 - c["ship_max"]) / 10))                # delivery <=8d full, >=18d none
    if cost < 1.5:  s -= 12                                                # commodity trash
    if cost > 22:   s -= 10                                                # too pricey for impulse
    if c["sold"] > 300_000: s -= 8                                         # saturated everywhere
    flags = []
    if BRAND.search(c["title"]): s -= 40; flags.append("brand/IP risk")
    if RISKY.search(c["title"]): s -= 25; flags.append("regulated/risky category")
    if c["rating"] < 4.5: flags.append("rating<4.5")
    if c["ship_max"] and c["ship_max"] > 15: flags.append("slow shipping")
    c.update(retail=retail, profit=round(profit, 2), margin=round(margin, 3), be_roas=round(be_roas, 2), score=round(s, 1), flags="; ".join(flags))
    return c

def research_links(kw):
    q = urllib.parse.quote_plus(kw)
    return {
        "meta_ads": f"https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=US&q={q}&search_type=keyword_unordered",
        "tiktok": f"https://www.tiktok.com/search?q={q}",
        "amazon": f"https://www.amazon.com/s?k={q}",
        "google_shop": f"https://www.google.com/search?tbm=shop&q={q}",
        "trends": f"https://trends.google.com/trends/explore?geo=US&q={q}",
    }

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("keywords")
    ap.add_argument("--top", type=int, default=30)
    ap.add_argument("--per", type=int, default=8, help="candidates kept per keyword")
    a = ap.parse_args()
    kws = [l.strip() for l in open(a.keywords, encoding="utf-8") if l.strip() and not l.startswith("#")]
    rows, seen = [], set()
    for n, kw in enumerate(kws, 1):
        url = "https://www.aliexpress.com/w/wholesale-" + urllib.parse.quote(kw.replace(" ", "-")) + ".html?SortType=total_tranpro_desc"
        html = fetch(url)
        got = 0
        for it in parse_items(html or ""):
            c = clean(it, kw)
            if not c["id"] or c["id"] in seen or c["sold"] < 300:
                continue
            c = score(c)
            if c and c["margin"] > 0.25:
                seen.add(c["id"]); rows.append(c); got += 1
                if got >= a.per:
                    break
        print(f"[{n}/{len(kws)}] {kw}: {got} candidates" + ("" if html else "  (blocked / no data)"), file=sys.stderr)
        time.sleep(2.5)
    rows.sort(key=lambda r: r["score"], reverse=True)
    day = datetime.date.today().isoformat()
    base = f"dropship/reports/{day}-shortlist"
    cols = ["score", "keyword", "title", "cost", "retail", "profit", "margin", "be_roas", "sold", "rating", "ship_min", "ship_max", "choice", "flags", "link", "image"]
    with open(base + ".csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore"); w.writeheader(); w.writerows(rows)
    with open(base + ".md", "w", encoding="utf-8") as f:
        f.write(f"# Product scout shortlist {day}\n\nScreen only: margin, proven demand, rating, delivery. Not a promise. Vet each one with the links before spending.\n\n")
        for r in rows[: a.top]:
            L = research_links(r["keyword"])
            f.write(f"## {r['score']:>5}  {r['title'][:90]}\n- cost ${r['cost']:.2f} -> sell ${r['retail']:.2f} | profit ${r['profit']:.2f} ({r['margin']:.0%}) | break-even ROAS {r['be_roas']}\n"
                    f"- {r['sold']:,} sold, {r['rating']} stars, ships {r['ship_min']}-{r['ship_max']} days{' (Choice)' if r['choice'] else ''}"
                    f"{' | FLAGS: ' + r['flags'] if r['flags'] else ''}\n- [Supplier]({r['link']}) | [Meta ads]({L['meta_ads']}) | [TikTok]({L['tiktok']}) | [Amazon]({L['amazon']}) | [Google Shopping]({L['google_shop']})\n\n")
    print(f"wrote {base}.md / .csv with {len(rows)} candidates", file=sys.stderr)

if __name__ == "__main__":
    main()
