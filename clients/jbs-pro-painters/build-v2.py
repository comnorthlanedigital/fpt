#!/usr/bin/env python3
"""v2 sites: processes the owner photo batches into a pool, copies what each site uses, and writes a
self-contained single-file HTML per site into preview/.   usage: python3 -I clients/jbs-pro-painters/build-v2.py [--pool]"""
import base64, io, os, re, shutil, sys
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
R = os.path.dirname(os.path.abspath(__file__))
A = f'{R}/assets'; W = f'{R}/web-img'
SITES = [s for s in ['a-proof', 'b-swatch', 'c-raw-to-ready'] if os.path.exists(f'{R}/sites-v2/{s}/index.html')]
SRC = {  # name -> (source path, brighten)
 'door-before': ('batch-9/2-wood-door-before.jpg',0), 'door-after': ('batch-9/5-wood-door-restained-after.jpg',0),
 'bath-before': ('batch-3/6-bath-prep.jpg',0), 'bath-after': ('batch-3/4-bath-green-after.jpg',1.25),
 'garage-before': ('batch-4/5-garage-before.jpg',0), 'garage-after': ('batch-4/9-garage-after-epoxy.jpg',0),
 'gdoor-before': ('batch-7/9-garage-doors-tan-before.jpg',0), 'gdoor-after': ('batch-7/5-garage-doors-green-after.jpg',0),
 'stripe-before': ('batch-9/9-pink-wall-taped-stripes.jpg',0), 'stripe-after': ('batch-9/12-red-stripe-accent-wall.jpg',0),
 'ranch-before': ('batch-3/1-ranch-before.jpg',0), 'ranch-after': ('batch-3/3-ranch-after.jpg',0),
 'two-before': ('batch-9/7-two-story-tan-before.jpg',0), 'two-after': ('batch-9/8-two-story-cream-after.jpg',0),
 'tone-before': ('batch-7/6-stucco-arches-before.jpg',0), 'tone-after': ('batch-8/2-stucco-two-tone-navy-after.jpg',0),
 'navy-island': ('batch-7/7-navy-island.jpg',0), 'navy-corner': ('batch-8/5-navy-cabinets-corner.jpg',0), 'navy-wide': ('batch-7/8-navy-cabinets-wide.jpg',0),
 'wh-b1': ('batch-5/1-warehouse-wall-masked-before.jpg',0), 'wh-b2': ('batch-5/2-warehouse-pipes-masked-before.jpg',0),
 'wh-b3': ('batch-5/3-warehouse-wall-rail-before.jpg',0), 'wh-b4': ('batch-5/9-warehouse-door-masked-before.jpg',0),
 'wh-a1': ('batch-5/5-warehouse-yellow-columns.jpg',0), 'wh-a2': ('batch-5/8-warehouse-white-wall-after.jpg',0),
 'wh-a3': ('batch-5/7-warehouse-dock-doors-after.jpg',0), 'wh-a4': ('batch-5/6-warehouse-white-walls.jpg',0), 'wh-rail': ('batch-5/4-white-railing-after.jpg',0),
 'wh-stairs': ('batch-4/7-warehouse-stairs.jpg',0),
 'char-stairs': ('batch-6/5-living-charcoal-stairs.jpg',1.18), 'char-fire': ('batch-6/6-living-charcoal-fireplace.jpg',1.18),
 'char-door': ('batch-6/7-bath-door-charcoal.jpg',1.25), 'char-french': ('batch-6/8-french-doors-office.jpg',1.2),
 'char-kitchen': ('batch-7/1-kitchen-charcoal-white-cabinets.jpg',1.12), 'cream-room': ('batch-6/3-upstairs-room-window.jpg',0),
 'tl-before': ('batch-9/4-thirsty-lion-corner-before.jpg',0), 'tl-after': ('batch-9/6-thirsty-lion-corner-patio-after.jpg',0),
 'tl-patio': ('batch-8/8-thirsty-lion-patio.jpg',0), 'tl-door': ('batch-8/9-thirsty-lion-door-detail.jpg',0), 'tl-front': ('batch-8/1-thirsty-lion-front-after.jpg',0),
 'navy-cap': ('batch-9/1-navy-column-cap-roof.jpg',0),
 'logo3d': ('batch-9/10-logo-new-3d.jpg',0), 'card': ('batch-9/11-business-card.jpg',0),
}
OLD = ['home-before','home-after','kitchen-before','kitchen-after','owner','shop-wall']  # from web-img
def enhance(im, b):
    if im.width < 700:
        im = im.resize((im.width*2, im.height*2), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 60, 2))
    if b: im = ImageEnhance.Brightness(ImageOps.autocontrast(im, cutoff=0.4)).enhance(b)
    return im
def save(im, path, edge, q):
    im = im.copy(); im.thumbnail((edge, edge), Image.LANCZOS); im.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
def build_pool():
    P = f'{R}/sites-v2/_pool'; os.makedirs(P, exist_ok=True)
    for n,(p,b) in SRC.items():
        im = enhance(Image.open(f'{A}/{p}').convert('RGB'), b)
        save(im, f'{P}/{n}.jpg', 1500, 80); save(im, f'{P}/{n}-sm.jpg', 700, 74)
    for n in OLD:
        im = Image.open(f'{W}/{n}.jpg').convert('RGB'); save(im, f'{P}/{n}.jpg', 1500, 80); save(im, f'{P}/{n}-sm.jpg', 700, 74)
    lg = Image.open(f'{A}/batch-9/10-logo-new-3d.jpg').convert('RGB')
    lg.save(f'{P}/logo3d.jpg', quality=84, optimize=True, progressive=True)
    save(lg.crop((236, 70, 1300, 1000)), f'{P}/logo-sq.jpg', 512, 86)
    lg.crop((168, 0, 1368, 630)).save(f'{P}/og.jpg', quality=84, optimize=True)  # 1200x630 social preview
    save(lg.crop((300, 90, 1270, 1000)), f'{P}/logo-sm.jpg', 96, 90)
def uri(P, n, edge, q):
    im = Image.open(f'{P}/{n}.jpg'); im.thumbnail((edge, edge), Image.LANCZOS); b = io.BytesIO()
    im.save(b, 'JPEG', quality=q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
def build_sites():
    P = f'{R}/sites-v2/_pool'; os.makedirs(f'{R}/preview', exist_ok=True)
    for s in SITES:
        d = f'{R}/sites-v2/{s}'; html = open(f'{d}/index.html', encoding='utf-8').read()
        used = sorted(set(re.findall(r'img/([\w-]+)\.jpg', html)))
        os.makedirs(f'{d}/img', exist_ok=True); os.makedirs(f'{d}/js', exist_ok=True)
        for f in os.listdir(f'{d}/img'): os.remove(f'{d}/img/{f}')
        for n in used: shutil.copy(f'{P}/{n}.jpg', f'{d}/img/{n}.jpg')
        for lib in ('gsap.min.js','ScrollTrigger.min.js','lenis.min.js'):
            shutil.copy(f'{R}/sites/1-midnight-chrome/js/{lib}', f'{d}/js/{lib}')
        # standalone
        def js(m): return '<script>' + open(f'{d}/js/{m.group(1)}', encoding='utf-8').read().replace('</script', '<\\/script') + '</script>'
        out = re.sub(r'<script src="js/([\w.-]+)"></script>', js, html)
        out = re.sub(r'img/([\w-]+)\.jpg', lambda m: uri(P, m.group(1), 520 if m.group(1).endswith('-sm') else 1000, 62 if m.group(1).endswith('-sm') else 64) if m.group(1) not in ('logo3d','og') else uri(P, m.group(1), 1500, 78), out)
        open(f'{R}/preview/JBS-{s}.html', 'w', encoding='utf-8').write(out)
        left = len(re.findall(r'(?:src|href)="(?:img|js)/', out))
        print(f'{s}: {os.path.getsize(f"{R}/preview/JBS-{s}.html")/1e6:.1f} MB, images {len(used)}, leftover refs {left}')
if __name__ == '__main__':
    if '--pool' in sys.argv or not os.path.isdir(f'{R}/sites-v2/_pool'): build_pool()
    build_sites()
