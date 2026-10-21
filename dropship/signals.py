#!/usr/bin/env python3
"""Demand / necessity signals that work without logins.

  amazon_suggest(prefix)  ranked autocomplete = what shoppers actually type (best free demand proxy)
  google_suggest(prefix)  "how to ..." problem phrasing = necessity / pain
  youtube_stats(query)    social proof: views + recency of videos about the product

CLI:
  python3 dropship/signals.py discover "dog" "car" "back pain"   # expand seeds into ranked shopper queries
  python3 dropship/signals.py score "posture corrector"           # demand score for one keyword
"""
import json, re, statistics, string, sys, time, urllib.parse
import requests

H = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36", "Accept-Language": "en-US,en;q=0.9"}

def get(url, **kw):
    for i in range(3):
        try:
            r = requests.get(url, headers=H, timeout=30, **kw)
            if r.status_code == 200:
                return r
        except requests.RequestException:
            pass
        time.sleep(1.5 * (i + 1))
    return None

def amazon_suggest(prefix):
    r = get("https://completion.amazon.com/api/2017/suggestions", params={"mid": "ATVPDKIKX0DER", "alias": "aps", "prefix": prefix})
    if not r:
        return []
    try:
        return [s["value"] for s in r.json().get("suggestions", []) if s.get("type") == "KEYWORD"]
    except ValueError:
        return []

def google_suggest(prefix):
    r = get("https://suggestqueries.google.com/complete/search", params={"client": "firefox", "q": prefix})
    try:
        return r.json()[1] if r else []
    except ValueError:
        return []

def _views(txt):
    m = re.match(r"([\d,.]+)\s*([KMB]?)", (txt or "").replace(" views", ""))
    if not m:
        return 0
    return int(float(m.group(1).replace(",", "")) * {"": 1, "K": 1e3, "M": 1e6, "B": 1e9}[m.group(2)])

def _recent(txt):
    t = (txt or "").lower()
    if "hour" in t or "day" in t or "minute" in t: return True
    m = re.match(r"(\d+)\s*(week|month|year)", t)
    if not m: return False
    n, u = int(m.group(1)), m.group(2)
    return (u == "week") or (u == "month" and n <= 3)

def youtube_stats(query):
    r = get("https://www.youtube.com/results", params={"search_query": query})
    if not r:
        return {"videos": 0, "median_views": 0, "recent_share": 0.0, "top_views": 0}
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", r.text, re.S)
    vids = []
    if m:
        def walk(o):
            if isinstance(o, dict):
                if "videoRenderer" in o:
                    v = o["videoRenderer"]
                    vids.append((_views((v.get("viewCountText") or {}).get("simpleText", "")), (v.get("publishedTimeText") or {}).get("simpleText", "")))
                for x in o.values(): walk(x)
            elif isinstance(o, list):
                for x in o: walk(x)
        try: walk(json.loads(m.group(1)))
        except ValueError: pass
    vids = vids[:20]
    if not vids:
        return {"videos": 0, "median_views": 0, "recent_share": 0.0, "top_views": 0}
    vs = [v for v, _ in vids]
    return {"videos": len(vids), "median_views": int(statistics.median(vs)), "recent_share": round(sum(_recent(t) for _, t in vids) / len(vids), 2), "top_views": max(vs)}

def demand_score(kw):
    """0-100. Amazon suggestion presence/rank + breadth of long-tail queries + YouTube proof."""
    a = amazon_suggest(kw)
    pos = next((i for i, s in enumerate(a) if kw.lower() in s.lower()), None)
    s = 0.0
    if pos is not None: s += 30 * (1 - pos / 10)                    # showing up near the top = high search volume
    longtail = len({x for l in string.ascii_lowercase[:6] for x in amazon_suggest(f"{kw} {l}")})
    s += min(25, longtail * 1.2)                                   # many distinct shopper queries = broad demand
    time.sleep(0.4)
    yt = youtube_stats(f"{kw} review")
    s += 25 * min(1, yt["median_views"] / 500_000)                     # median video reach (500K = max)
    s += 20 * yt["recent_share"]                                    # videos made lately = still live
    return {"demand": round(min(100, s), 1), "amazon_rank": pos, "longtail": longtail, **{f"yt_{k}": v for k, v in yt.items()}}

def discover(seeds):
    out = {}
    for seed in seeds:
        for pre in [seed, f"{seed} for", f"best {seed}", f"{seed} organizer", f"{seed} gadget"]:
            for i, s in enumerate(amazon_suggest(pre)):
                out.setdefault(s, []).append(i)
            time.sleep(0.3)
        for pre in [f"how to stop {seed}", f"why does my {seed}", f"{seed} hack", f"{seed} annoying"]:
            for s in google_suggest(pre):
                out.setdefault("[pain] " + s, []).append(5)
            time.sleep(0.3)
    return sorted(out.items(), key=lambda kv: (-len(kv[1]), min(kv[1])))

if __name__ == "__main__":
    cmd, *args = sys.argv[1:] or ["help"]
    if cmd == "discover":
        for q, ranks in discover(args)[:60]:
            print(f"{len(ranks):>2}x  {q}")
    elif cmd == "score":
        print(json.dumps(demand_score(" ".join(args)), indent=1))
    else:
        print(__doc__)
