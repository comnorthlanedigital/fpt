#!/usr/bin/env python3
"""Resizes the photo pool (../sites-v2/_pool, built by ../build-v2.py) into v3/img and writes img/index.js re-exports."""
import os, re
from PIL import Image
POOL = '../sites-v2/_pool'
NAMES = ('home-before home-after kitchen-before kitchen-after tl-before tl-after door-before door-after bath-before bath-after '
 'stripe-before stripe-after gdoor-before gdoor-after garage-before garage-after two-before two-after tone-before tone-after '
 'wh-b1 wh-b2 wh-b3 wh-b4 wh-a1 wh-a2 wh-a3 wh-a4 wh-rail wh-stairs char-stairs char-fire char-door char-french char-kitchen '
 'cream-room navy-island navy-corner navy-wide tl-patio tl-door tl-front owner lion-process').split()
def save(src, dst, edge, q):
    im = Image.open(src).convert('RGB'); im.thumbnail((edge, edge), Image.LANCZOS)
    im.save(dst, 'JPEG', quality=q, optimize=True, progressive=True)
os.makedirs('img', exist_ok=True)
lines = []
camel = lambda n: re.sub(r'-(\w)', lambda m: m.group(1).upper(), n)
for n in NAMES:
    src = f'{POOL}/{n}.jpg' if os.path.exists(f'{POOL}/{n}.jpg') else f'../web-img/{n}.jpg'
    save(src, f'img/{n}.jpg', 1100, 66); save(src, f'img/{n}-sm.jpg', 520, 60)
    lines += [f"export {{ default as {camel(n)} }} from './{n}.jpg'", f"export {{ default as {camel(n)}Sm }} from './{n}-sm.jpg'"]
Image.open(f'{POOL}/logo3d.jpg').convert('RGB').save('img/logo3d.jpg', quality=78, optimize=True, progressive=True)
for n in ('logo-sm', 'logo-sq'): save(f'{POOL}/{n}.jpg', f'img/{n}.jpg', 512, 84)
Image.open(f'{POOL}/og.jpg').save('img/og.jpg', quality=80)
lines += ["export { default as logo3d } from './logo3d.jpg'", "export { default as logoSm } from './logo-sm.jpg'", "export { default as logoSq } from './logo-sq.jpg'"]
open('img/index.js', 'w').write('\n'.join(lines) + '\n')
print(len(NAMES) * 2 + 3, 'images', round(sum(os.path.getsize('img/' + f) for f in os.listdir('img')) / 1e6, 1), 'MB')
