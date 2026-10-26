#!/usr/bin/env python3
"""Builds one self-contained HTML file per site (images, scripts and favicon embedded) so it opens by double-click.
usage: python3 clients/jbs-pro-painters/build-preview.py   ->  clients/jbs-pro-painters/preview/*.html"""
import base64, io, json, os, re
from PIL import Image
ROOT = os.path.dirname(os.path.abspath(__file__))
SITES = ['1-midnight-chrome', '2-fresh-coat', '3-quote-first']
cache = {}
def uri(name):
    if name not in cache:
        im = Image.open(f'{ROOT}/web-img/{name}.jpg').convert('RGB')
        im.thumbnail((1300, 1300) if not name.endswith('-sm') else (720, 720))
        b = io.BytesIO(); im.save(b, 'JPEG', quality=72, optimize=True, progressive=True)
        cache[name] = 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
    return cache[name]
os.makedirs(f'{ROOT}/preview', exist_ok=True)
for s in SITES:
    html = open(f'{ROOT}/sites/{s}/index.html', encoding='utf-8').read()
    used = sorted(set(re.findall(r'img/([\w-]+)\.jpg', html)))
    # <script src="js/x.js"> -> inline
    def inline_js(m):
        return '<script>' + open(f'{ROOT}/sites/{s}/js/{m.group(1)}', encoding='utf-8').read().replace('</script', '<\\/script') + '</script>'
    html = re.sub(r'<script src="js/([\w.-]+)"></script>', inline_js, html)
    # favicon
    html = re.sub(r'<link rel="icon" href="img/logo-sm.jpg">', f'<link rel="icon" href="{uri("logo-sm")}">', html)
    # JS string refs 'img/x.jpg' -> IMG["x"]
    html = re.sub(r"""(['"])img/([\w-]+)\.jpg\1(?=\s*[,}+)\]])""", lambda m: f'IMG["{m.group(2)}"]', html)
    # <img src="img/x.jpg"> -> data-i
    html = re.sub(r'src="img/([\w-]+)\.jpg"', lambda m: f'src="{uri(m.group(1))}"', html)
    # put the table first in <head> so JS strings can use IMG; assign <img> sources once DOM exists
    head_js = '<script>const IMG=' + json.dumps({n: uri(n) for n in used}, separators=(',', ':')) + ';</script>'
    html = html.replace('</title>', '</title>' + head_js, 1)
    out = f'{ROOT}/preview/JBS-{s}.html'
    open(out, 'w', encoding='utf-8').write(html)
    left = re.findall(r'(?:src|href)="(?:img|js)/', html)
    print(f'{s}: {os.path.getsize(out)/1e6:.1f} MB, images {len(used)}, leftover file refs: {len(left)}')
