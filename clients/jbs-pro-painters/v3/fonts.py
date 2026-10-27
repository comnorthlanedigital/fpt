#!/usr/bin/env python3
"""Embeds the latin subset of each site's Google Fonts as base64 @font-face CSS (no network needed to view the pages).
usage: python3 -I fonts.py"""
import base64, re, subprocess, os
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
SITES = {
 'roller': ['Gloock', 'Epilogue:wght@400;500;600'],
 'coats': ['Unbounded:wght@500;700;800', 'Albert+Sans:wght@400;500;600'],
 'board': ['Big+Shoulders+Display:wght@700;800;900', 'Barlow:wght@400;500;600', 'Permanent+Marker'],
 'lights': ['Bricolage+Grotesque:opsz,wght@12..96,500..800', 'Schibsted+Grotesk:wght@400;500;600'],
 'studio': ['Anybody:wdth,wght@100..150,500..900', 'Rethink+Sans:wght@400;500;600'],
}
def get(url, binary=False):
    r = subprocess.run(['curl', '-sS', '-m', '40', '-A', UA, url], capture_output=True, check=True)
    return r.stdout if binary else r.stdout.decode()
os.makedirs('fonts', exist_ok=True)
for site, fams in SITES.items():
    out = []; seen = {}
    for fam in fams:
        css = get(f'https://fonts.googleapis.com/css2?family={fam}&display=swap')
        for m in re.finditer(r'/\* (\S+) \*/\s*(@font-face \{.*?\})', css, re.S):
            if m.group(1) != 'latin': continue
            blk = m.group(2)
            url = re.search(r'url\((https://[^)]+)\)', blk).group(1)
            w = re.search(r'font-weight: (\d+)', blk)
            if url in seen:   # same variable-font file for several weights: widen the range instead of embedding twice
                i = seen[url]; ws = [int(x) for x in re.findall(r'font-weight: (\d+)( (\d+))?', out[i])[0] if x.isdigit()]
                lo = min(ws + [int(w.group(1))]); hi = max(ws + [int(w.group(1))])
                out[i] = re.sub(r'font-weight: [\d ]+;', f'font-weight: {lo} {hi};', out[i]); continue
            seen[url] = len(out)
            b64 = base64.b64encode(get(url, True)).decode()
            blk = blk.replace(url, 'data:font/woff2;base64,' + b64)
            blk = re.sub(r'unicode-range:[^;]+;', '', blk)
            out.append(blk)
    open(f'fonts/{site}.css', 'w').write('\n'.join(out))
    print(site, len(out), 'faces', round(os.path.getsize(f'fonts/{site}.css')/1024), 'KB')
