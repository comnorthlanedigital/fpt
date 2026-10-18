import json, html
P = json.load(open('public/data/products.json'))
LOGO = ''

def pick(kws, store='fpt'):
    out = []
    for kw in kws:
        for x in P:
            if x['store'] == store and x['images'] and kw in x['title'].lower() and 'shorts' not in x['title'].lower() and x not in out:
                out.append(x); break
    return out

NEW = pick(['liverpool 26', 'man utd 26/27 special 1', 'arsenal 26/27 special 1', 'r. madrid 26/27 special 5', 'mexico home 2026', 'argentina last dance'])
VAULT = pick(['retro'])
VAULT += [x for x in P if x['store'] == 'fpt' and x['images'] and 'retro' in x['title'].lower() and x not in VAULT][:5]
ALL = (NEW + VAULT)[:12]

def card(p, cls='card'):
    t = html.escape(p['title'].replace('Stantard', 'Standard').replace('(SALE) ', ''))
    return f'<a class="{cls}" href="https://fptsportz.myshopify.com/products/{p["handle"]}" target="_blank"><div class="img"><img loading="lazy" src="{p["images"][0]}" alt="{t}"></div><h3>{t}</h3><p>${p["price"]:.2f}</p></a>'

CATS = ['Premier League', 'La Liga', 'Liga MX', 'Retro / Vintage', 'World Cup', 'Kids & Women']
REVEAL = '<script>const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add("in")),{threshold:.15});document.querySelectorAll(".rv").forEach(n=>io.observe(n))</script>'

# ---------- 1. STADIUM NIGHT ----------
c1 = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FPT SPORTZ — Stadium Night</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;600&display=swap" rel="stylesheet"><style>
*{{margin:0;box-sizing:border-box}}body{{background:#06080d;color:#fff;font-family:Inter,sans-serif}}a{{color:inherit;text-decoration:none}}
nav{{position:fixed;inset:0 0 auto;display:flex;justify-content:space-between;align-items:center;padding:14px 5vw;background:#06080dcc;backdrop-filter:blur(14px);z-index:9;border-bottom:1px solid #ffffff14}}
nav .wm{{font:30px Anton;letter-spacing:.04em}}nav .wm span{{color:#19ff94}}nav div{{display:flex;gap:28px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#aab}}
.hero{{min-height:100vh;display:grid;place-items:center;text-align:center;padding:120px 5vw 60px;position:relative;overflow:hidden;background:radial-gradient(60% 50% at 50% 0,#00ff8844,transparent),radial-gradient(40% 40% at 85% 80%,#2b6bff55,transparent)}}
.hero:before{{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,#ffffff06 0 1px,transparent 1px 90px);mask:linear-gradient(#000,transparent)}}
.hero h1{{font:clamp(64px,13vw,200px)/.88 Anton;text-transform:uppercase;position:relative}}.hero h1 span{{color:transparent;-webkit-text-stroke:2px #19ff94}}
.hero p{{max-width:520px;margin:28px auto;color:#9aa4b5;position:relative}}
.btn{{display:inline-block;background:#19ff94;color:#04140b;padding:16px 36px;font-weight:600;border-radius:99px;position:relative;box-shadow:0 0 40px #19ff9466;transition:.3s}}.btn:hover{{transform:scale(1.06)}}
.float{{position:absolute;width:19vw;max-width:260px;border-radius:18px;box-shadow:0 30px 80px #000;animation:fl 6s ease-in-out infinite}}.f1{{left:5vw;top:30%;transform:rotate(-8deg)}}.f2{{right:5vw;top:24%;transform:rotate(7deg);animation-delay:-3s}}
@keyframes fl{{50%{{translate:0 -18px}}}}
.mq{{overflow:hidden;border-block:1px solid #ffffff18;padding:18px 0;white-space:nowrap;font:34px Anton;color:#19ff94;text-transform:uppercase}}.mq div{{display:inline-block;animation:mq 25s linear infinite}}@keyframes mq{{to{{transform:translateX(-50%)}}}}
section{{padding:110px 5vw}}h2{{font:clamp(44px,7vw,100px)/.95 Anton;text-transform:uppercase;margin-bottom:50px}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:22px}}
.card{{background:linear-gradient(#ffffff0d,#ffffff04);border:1px solid #ffffff16;border-radius:20px;padding:14px;transition:.4s}}.card:hover{{border-color:#19ff94;transform:translateY(-8px);box-shadow:0 20px 60px #19ff9422}}
.img{{aspect-ratio:1;background:#fff;border-radius:12px;overflow:hidden;display:grid;place-items:center}}.img img{{width:100%;height:100%;object-fit:contain;transition:.5s}}.card:hover img{{transform:scale(1.08)}}
.card h3{{font-size:14px;margin:14px 4px 4px;line-height:1.3}}.card p{{color:#19ff94;font-weight:600;margin:0 4px 6px}}
.cats{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}}.cats a{{padding:60px 24px;border:1px solid #ffffff1c;border-radius:20px;font:34px Anton;text-transform:uppercase;transition:.3s}}.cats a:hover{{background:#19ff94;color:#04140b}}
.rv{{opacity:0;translate:0 40px;transition:1s}}.rv.in{{opacity:1;translate:0}}
footer{{padding:60px 5vw;color:#667;border-top:1px solid #ffffff14;display:flex;justify-content:space-between}}
@media(max-width:800px){{.float{{display:none}}.cats{{grid-template-columns:1fr 1fr}}nav div{{display:none}}}}
</style></head><body>
<nav><b class="wm">FPT<span>SPORTZ</span></b><div><span>Shop</span><span>Retro</span><span>Custom</span><span>Cart</span></div></nav>
<header class="hero"><img class="float f1" src="{NEW[0]['images'][0]}"><img class="float f2" src="{NEW[1]['images'][0]}">
<div><h1>Wear the<br><span>Game.</span></h1><p>Official-quality kits for every club, country and era. Affordable prices. Custom names &amp; numbers. Shipped fast.</p><a class="btn" href="#new">Shop 26/27 Kits →</a></div></header>
<div class="mq"><div>{'  ★  New 26/27 Kits  ★  Retro Vault  ★  Custom Names &amp; Numbers  ★  From $12  '*8}</div></div>
<section id="new"><h2 class="rv">New season.<br>Fresh drops.</h2><div class="grid">{''.join(card(p) for p in NEW)}</div></section>
<section><h2 class="rv">Find your club</h2><div class="cats">{''.join(f'<a href="#">{c}</a>' for c in CATS)}</div></section>
<section><h2 class="rv">From the vault</h2><div class="grid">{''.join(card(p) for p in VAULT[:4])}</div></section>
<footer><span>© FPT SPORTZ Sportz — Concept 1: Stadium Night</span><span>Worldwide shipping</span></footer>{REVEAL}</body></html>'''

# ---------- 2. MATCHDAY EDITORIAL ----------
c2 = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FPT SPORTZ — Matchday Editorial</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Inter:wght@400;600&display=swap" rel="stylesheet"><style>
*{{margin:0;box-sizing:border-box}}body{{background:#f4f0e8;color:#111;font-family:Inter,sans-serif}}a{{color:inherit;text-decoration:none}}
.top{{background:#d4202a;color:#fff;text-align:center;padding:9px;font-size:12px;letter-spacing:.15em;text-transform:uppercase}}
nav{{display:flex;justify-content:space-between;align-items:center;padding:18px 5vw;border-bottom:2px solid #111;position:sticky;top:0;background:#f4f0e8;z-index:9}}nav .wm{{font:900 28px 'Playfair Display'}}nav .wm span{{color:#d4202a}}nav div{{display:flex;gap:30px;font-size:13px;text-transform:uppercase;letter-spacing:.1em;font-weight:600}}
.hero{{display:grid;grid-template-columns:1.1fr 1fr;min-height:88vh;border-bottom:2px solid #111}}
.hero .l{{padding:7vw 5vw;display:flex;flex-direction:column;justify-content:center}}.hero small{{letter-spacing:.2em;text-transform:uppercase;color:#d4202a;font-weight:600}}
.hero h1{{font:900 clamp(56px,9vw,150px)/.9 'Playfair Display';margin:20px 0}}.hero h1 em{{color:#d4202a}}.hero p{{max-width:440px;color:#555;line-height:1.6;margin-bottom:30px}}
.btn{{align-self:flex-start;background:#111;color:#f4f0e8;padding:16px 34px;text-transform:uppercase;letter-spacing:.12em;font-size:13px;font-weight:600;transition:.3s}}.btn:hover{{background:#d4202a}}
.hero .r{{background:#e6dfd0;display:grid;place-items:center;overflow:hidden;position:relative}}.hero .r img{{width:78%;transform:rotate(-4deg);filter:drop-shadow(0 40px 40px #0004);transition:1s}}.hero .r:hover img{{transform:rotate(2deg) scale(1.05)}}
.hero .r b{{position:absolute;font:900 22vw/1 'Playfair Display';color:#0000000a;right:-2vw;bottom:-4vw}}
section{{padding:100px 5vw}}.hd{{display:flex;justify-content:space-between;align-items:end;border-bottom:2px solid #111;padding-bottom:18px;margin-bottom:40px}}.hd h2{{font:900 clamp(40px,6vw,86px)/1 'Playfair Display'}}.hd span{{font-size:13px;text-transform:uppercase;letter-spacing:.1em}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:40px 28px}}
.card .img{{background:#e6dfd0;aspect-ratio:4/5;display:grid;place-items:center;overflow:hidden}}.card img{{width:90%;mix-blend-mode:multiply;transition:.6s}}.card:hover img{{transform:scale(1.1) rotate(-2deg)}}
.card h3{{font:700 20px 'Playfair Display';margin:14px 0 4px}}.card p{{color:#d4202a;font-weight:600}}
.quote{{background:#111;color:#f4f0e8;text-align:center;padding:120px 8vw}}.quote q{{font:italic 700 clamp(30px,5vw,70px)/1.15 'Playfair Display'}}.quote p{{margin-top:30px;letter-spacing:.2em;font-size:12px;text-transform:uppercase;color:#d4202a}}
.rv{{opacity:0;translate:0 40px;transition:1s}}.rv.in{{opacity:1;translate:0}}
footer{{padding:50px 5vw;display:flex;justify-content:space-between;font-size:13px;border-top:2px solid #111}}
@media(max-width:800px){{.hero{{grid-template-columns:1fr}}nav div{{display:none}}}}
</style></head><body><div class="top">Free shipping over $75 · Custom names &amp; numbers on every kit</div>
<nav><b class="wm">FPT<span>SPORTZ</span></b><div><span>New</span><span>Clubs</span><span>Retro</span><span>Kids</span><span>Cart</span></div></nav>
<header class="hero"><div class="l"><small>Matchday Issue · 26/27</small><h1>Kits for<br>the <em>real</em><br>fans.</h1><p>Every club. Every era. Priced for the stands, not the boardroom — and shipped fast.</p><a class="btn" href="#new">Shop the issue</a></div><div class="r"><b>26</b><img src="{NEW[2]['images'][0]}"></div></header>
<section id="new"><div class="hd"><h2 class="rv">New Arrivals</h2><span>26/27 Season</span></div><div class="grid">{''.join(card(p) for p in NEW)}</div></section>
<div class="quote"><q class="rv">Football isn't a luxury. The shirt shouldn't be either.</q><p>— The FPT SPORTZ promise</p></div>
<section><div class="hd"><h2 class="rv">Retro Classics</h2><span>From the archive</span></div><div class="grid">{''.join(card(p) for p in VAULT[:4])}</div></section>
<footer><span>© FPT SPORTZ Sportz — Concept 2: Matchday Editorial</span><span>Instagram · TikTok · Facebook</span></footer>{REVEAL}</body></html>'''

# ---------- 3. THE VAULT ----------
c3 = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FPT SPORTZ — The Vault</title>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display&family=Inter:wght@400;600&display=swap" rel="stylesheet"><style>
*{{margin:0;box-sizing:border-box}}body{{background:#14110d;color:#efe6d2;font-family:Inter,sans-serif}}a{{color:inherit;text-decoration:none}}
nav{{display:flex;justify-content:space-between;align-items:center;padding:16px 5vw;position:fixed;inset:0 0 auto;z-index:9;mix-blend-mode:difference}}nav .wm{{font:34px 'Bebas Neue';letter-spacing:.06em}}nav div{{display:flex;gap:30px;font:20px 'Bebas Neue';letter-spacing:.12em}}
.hero{{height:100vh;display:grid;place-items:center;text-align:center;position:relative;overflow:hidden;background:radial-gradient(circle at 50% 55%,#3a2a14,#14110d 70%)}}
.hero h1{{font:clamp(70px,16vw,260px)/.85 'Bebas Neue';color:#d9b25c;letter-spacing:.02em;position:relative;z-index:2}}.hero h1 i{{font:italic 400 .35em 'DM Serif Display';display:block;color:#efe6d2;letter-spacing:0}}
.hero p{{position:relative;z-index:2;margin-top:24px;color:#a99d85;letter-spacing:.2em;text-transform:uppercase;font-size:12px}}
.hero img{{position:absolute;width:21vw;max-width:300px;opacity:.55;filter:sepia(.5);animation:dr 14s linear infinite}}
@keyframes dr{{from{{translate:0 110vh;rotate:-12deg}}to{{translate:0 -120vh;rotate:12deg}}}}
.eras{{display:flex;gap:0;border-block:1px solid #efe6d233}}.eras a{{flex:1;padding:36px;font:50px 'Bebas Neue';border-right:1px solid #efe6d233;transition:.3s;text-align:center}}.eras a:hover{{background:#d9b25c;color:#14110d}}
section{{padding:110px 5vw}}h2{{font:clamp(50px,8vw,120px)/.9 'Bebas Neue';color:#d9b25c;margin-bottom:12px}}.sub{{font:italic 26px 'DM Serif Display';margin-bottom:50px;color:#a99d85}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:28px}}
.card{{position:relative;background:#1d1812;border:1px solid #d9b25c33;padding:16px 16px 20px;transition:.4s}}.card:hover{{border-color:#d9b25c;translate:0 -8px}}
.card .img{{background:#efe6d2;aspect-ratio:1;display:grid;place-items:center;overflow:hidden}}.card img{{width:100%;height:100%;object-fit:contain;filter:sepia(.25);transition:.5s}}.card:hover img{{filter:none;transform:scale(1.07)}}
.card:before{{content:"VAULT";position:absolute;top:26px;left:26px;background:#14110d;color:#d9b25c;font:15px 'Bebas Neue';letter-spacing:.2em;padding:3px 10px;z-index:2}}
.card h3{{font:italic 20px 'DM Serif Display';margin:16px 0 4px}}.card p{{font:22px 'Bebas Neue';color:#d9b25c;letter-spacing:.06em}}
.btn{{display:inline-block;margin-top:50px;border:1px solid #d9b25c;color:#d9b25c;padding:18px 46px;font:22px 'Bebas Neue';letter-spacing:.14em;transition:.3s}}.btn:hover{{background:#d9b25c;color:#14110d}}
.rv{{opacity:0;translate:0 40px;transition:1s}}.rv.in{{opacity:1;translate:0}}
footer{{padding:50px 5vw;color:#7a705d;display:flex;justify-content:space-between;border-top:1px solid #d9b25c33}}
@media(max-width:800px){{.eras{{flex-direction:column}}nav div{{display:none}}.hero img{{width:42vw}}}}
</style></head><body>
<nav><b class="wm">FPT<span>SPORTZ</span></b><div><span>VAULT</span><span>NEW</span><span>CUSTOM</span><span>CART</span></div></nav>
<header class="hero"><img style="left:6%;animation-delay:0s" src="{VAULT[0]['images'][0]}"><img style="right:6%;animation-delay:-7s" src="{VAULT[1]['images'][0]}">
<div><h1>The Vault<i>Legends never go out of style</i></h1><p>700+ retro &amp; vintage kits · from $12</p></div></header>
<div class="eras"><a href="#">80s</a><a href="#">90s</a><a href="#">00s</a><a href="#">Now</a></div>
<section><h2 class="rv">Hall of Fame</h2><p class="sub">Classics, restored for the stands.</p><div class="grid">{''.join(card(p) for p in VAULT[:8])}</div><a class="btn" href="#">ENTER THE FULL ARCHIVE →</a></section>
<section style="background:#1d1812"><h2 class="rv">New Season</h2><p class="sub">The 26/27 drop is live.</p><div class="grid">{''.join(card(p) for p in NEW[:4])}</div></section>
<footer><span>© FPT SPORTZ Sportz — Concept 3: The Vault</span><span>Custom names &amp; numbers on request</span></footer>{REVEAL}</body></html>'''

for n, h in (('1-stadium-night', c1), ('2-matchday-editorial', c2), ('3-the-vault', c3)):
    open(f'concepts/{n}.html', 'w').write(h)
print([p['title'] for p in VAULT[:8]])
