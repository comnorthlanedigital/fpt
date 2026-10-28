#!/usr/bin/env python3
"""Prepares embedded fonts (latin subset, base64) and optimized logo images into src/gen. Run: python3 -I prepare.py"""
import base64, os, re, subprocess
from PIL import Image
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
os.makedirs('src/gen', exist_ok=True)
def get(url, binary=False):
    r = subprocess.run(['curl', '-sS', '-m', '40', '-A', UA, url], capture_output=True, check=True)
    return r.stdout if binary else r.stdout.decode()
out = []
for fam in ['Archivo:wdth,wght@100..125,500..900', 'Hanken+Grotesk:wght@400..700']:
    css = get(f'https://fonts.googleapis.com/css2?family={fam}&display=swap')
    for m in re.finditer(r'/\* (\S+) \*/\s*(@font-face \{.*?\})', css, re.S):
        if m.group(1) != 'latin': continue
        blk = m.group(2); url = re.search(r'url\((https://[^)]+)\)', blk).group(1)
        blk = blk.replace(url, 'data:font/woff2;base64,' + base64.b64encode(get(url, True)).decode())
        out.append(re.sub(r'unicode-range:[^;]+;', '', blk))
open('src/gen/fonts.css', 'w').write('\n'.join(out)); print('fonts', len(out), 'faces', round(os.path.getsize('src/gen/fonts.css') / 1024), 'KB')
def save(src, dst, w, q=84, fmt='JPEG'):
    im = Image.open(src).convert('RGB'); im.thumbnail((w, w), Image.LANCZOS); im.save(dst, fmt, quality=q, optimize=True)
save('src/logo-circle.png', 'src/gen/logo-circle-sm.jpg', 220)     # header
save('src/logo-circle.png', 'src/gen/logo-circle.jpg', 640)        # footer
save('src/logo-circle.png', 'src/gen/apple-touch-icon.jpg', 180)
save('src/logo-circle.png', 'src/gen/favicon.jpg', 64)
w = Image.open('src/logo-wide.png').convert('RGB'); w.thumbnail((945, 630), Image.LANCZOS)
og = Image.new('RGB', (1200, 630), (0, 0, 0)); og.paste(w, ((1200 - w.width) // 2, (630 - w.height) // 2)); og.save('src/gen/og.jpg', 'JPEG', quality=84, optimize=True)
print({f: os.path.getsize('src/gen/' + f) // 1024 for f in os.listdir('src/gen')})
