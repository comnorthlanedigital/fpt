#!/usr/bin/env bash
# Builds the three current pages and packs them into zips/jbs-pro-painters-netlify.zip (drag the zip onto Netlify Drop).
set -euo pipefail
cd "$(dirname "$0")/../.."
node clients/jbs-pro-painters/v3/build.mjs home >/dev/null
P=clients/jbs-pro-painters/preview; D=$(mktemp -d)
cp $P/JBS-home.html $D/index.html; cp $P/og.jpg $D/
cat > $D/404.html <<'HTML'
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | JB'S Pro Painters LLC</title><meta name="robots" content="noindex">
<style>*{box-sizing:border-box;margin:0}body{min-height:100svh;display:grid;place-items:center;padding:24px;background:#060d1b;color:#eef2fb;font:400 18px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center}
h1{font-size:clamp(34px,7vw,56px);font-weight:600;letter-spacing:-.03em;line-height:1.1;margin-bottom:14px}p{color:#aab6d3;max-width:34ch;margin:0 auto 28px}
a{display:inline-flex;align-items:center;height:44px;padding:0 22px;border-radius:8px;background:#2459e6;color:#fff;font-weight:600;text-decoration:none;margin:4px}a.o{background:none;border:1.5px solid #ffffff66}a:hover{filter:brightness(1.1)}</style></head>
<body><main><h1>That page isn't here.</h1><p>The link may be old or mistyped. Head back and keep exploring, or call us on (602) 473-0415.</p><a href="/">Back to home</a></main></body></html>
HTML
printf '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n' > $D/_headers
printf 'User-agent: *\nAllow: /\n' > $D/robots.txt
mkdir -p zips; rm -f zips/jbs-pro-painters-netlify.zip; (cd $D && zip -qr "$OLDPWD/zips/jbs-pro-painters-netlify.zip" .)
unzip -l zips/jbs-pro-painters-netlify.zip | tail -12; rm -rf "$D"
