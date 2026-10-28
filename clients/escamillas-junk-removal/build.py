#!/usr/bin/env python3
"""Builds dist/ and ../../zips/escamillas-netlify.zip from src/index.template.html. Run: python3 -I build.py
Real media: put truck.jpg and loading-trailer.mp4 in assets/ (this folder) and rebuild; the page picks them up automatically."""
import base64, os, shutil, zipfile
G = 'src/gen/'
b64 = lambda f, mime='image/jpeg': f'data:{mime};base64,' + base64.b64encode(open(G + f, 'rb').read()).decode()
html = open('src/index.template.html', encoding='utf-8').read()
for k, v in {'__FONTS__': open(G + 'fonts.css').read(), '__LOGO_SM__': b64('logo-circle-sm.jpg'), '__LOGO__': b64('logo-circle.jpg'), '__FAVICON__': b64('favicon.jpg'), '__APPLE__': b64('apple-touch-icon.jpg')}.items():
    html = html.replace(k, v)
shutil.rmtree('dist', ignore_errors=True); os.makedirs('dist/assets')
open('dist/index.html', 'w', encoding='utf-8').write(html)
shutil.copy(G + 'og.jpg', 'dist/og.jpg')
for f in os.listdir('assets') if os.path.isdir('assets') else []:
    if f.lower().endswith(('.jpg', '.jpeg', '.mp4', '.webp')): shutil.copy('assets/' + f, 'dist/assets/' + f)
open('dist/404.html', 'w').write("""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Escamilla's Junk Removal</title><meta name="robots" content="noindex">
<style>*{box-sizing:border-box;margin:0}body{min-height:100svh;display:grid;place-items:center;padding:24px;background:#011937;color:#fff;font:400 18px/1.6 system-ui,sans-serif;text-align:center}h1{font-size:clamp(34px,7vw,56px);font-weight:900;text-transform:uppercase;line-height:1;margin-bottom:14px}p{color:#b9c9e2;margin:0 auto 26px;max-width:34ch}a{display:inline-flex;align-items:center;min-height:48px;padding:0 24px;background:#fdd006;color:#011937;font-weight:800;text-decoration:none;text-transform:uppercase;margin:4px}a.o{background:none;color:#fff;border:2px solid #fff}</style></head>
<body><main><h1>That page is not here.</h1><p>The link may be old. Need junk hauled? Call or text us.</p><a href="/">Back to home</a><a class="o" href="tel:+18316823458">831-682-3458</a></main></body></html>""")
open('dist/robots.txt', 'w').write('User-agent: *\nAllow: /\n')
open('dist/_headers', 'w').write('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n')
os.makedirs('../../zips', exist_ok=True); z = '../../zips/escamillas-netlify.zip'
with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, _, files in os.walk('dist'):
        for f in files:
            p = os.path.join(root, f); zf.write(p, os.path.relpath(p, 'dist'))
print('index.html', round(os.path.getsize('dist/index.html') / 1024), 'KB;', 'zip', round(os.path.getsize(z) / 1024), 'KB;', sorted(zipfile.ZipFile(z).namelist()))
