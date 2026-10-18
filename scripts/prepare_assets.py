"""Resizes owner photos + curated catalog products into public/img and writes src/data/shop.json."""
import glob, json, os, re, urllib.request, io
from PIL import Image

os.makedirs('public/img', exist_ok=True); os.makedirs('src/data', exist_ok=True)

def save(im, path, size, q=80):
    im = im.convert('RGB'); im.thumbnail((size, size)); im.save(path, 'JPEG', quality=q, optimize=True)

save(Image.open('assets/brand/logo.jpg'), 'public/img/logo.jpg', 900, 88)

# owner-provided jersey photos (sorted order == the order reviewed with the owner)
files = sorted(f for f in glob.glob('assets/jerseys/*') if os.path.isfile(f))
FEATURED = [  # (index in sorted list, label)
    (3, 'Mexico · Black & Gold'), (8, 'Mexico · Aztec Green'), (7, 'Argentina · Midnight'),
    (6, 'Brazil · Seleção'), (15, 'France · Les Bleus'), (17, 'Argentina · Three Stars'),
    (11, 'Brazil · Jordan Blue'), (18, 'Mexico · Maroon'),
]
feat = []
for n, (idx, label) in enumerate(FEATURED):
    save(Image.open(files[idx - 1]), f'public/img/j{n}.jpg', 800)
    feat.append({'img': f'/img/j{n}.jpg', 'label': label})

# curated real products from the fptsportz catalog
P = [p for p in json.load(open('public/data/products.json')) if p['store'] == 'fpt' and p['images']]
KW = ['liverpool 26/27', 'man utd 26/27', 'arsenal 26/27', 'r. madrid 26/27', 'mexico home 2026', 'argentina last dance',
      'chivas de guadalajara 3rd', 'brazil home 2014', 'portugal away 2004', 'kids', 'mexico 3rd 2026', 'bayern']
shop, seen = [], set()
for kw in KW:
    for p in P:
        t = p['title'].lower()
        if kw in t and 'short' not in t and 'socks' not in t and p['id'] not in seen:
            seen.add(p['id'])
            raw = urllib.request.urlopen(urllib.request.Request(p['images'][0], headers={'User-Agent': 'Mozilla/5.0'}), timeout=30).read()
            i = len(shop); save(Image.open(io.BytesIO(raw)), f'public/img/p{i}.jpg', 600, 78)
            title = re.sub(r'\(SALE\)\s*', '', p['title']).replace('Stantard', 'Standard')
            shop.append({'title': title, 'price': p['price'], 'handle': p['handle'], 'img': f'/img/p{i}.jpg'})
            break

cols = [c for c in json.load(open('public/data/collections.json')) if c['store'] == 'fpt']
skip = re.compile(r'sale|merch|hot|nfl$|mlb', re.I)
cols = [{'title': c['title'], 'count': c['count'], 'handle': c['handle']} for c in cols if not skip.search(c['title']) and c['count'] > 5]
json.dump({'featured': feat, 'shop': shop, 'collections': cols}, open('src/data/shop.json', 'w'), indent=1)
print(len(feat), 'featured,', len(shop), 'products,', len(cols), 'collections')
