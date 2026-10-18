#!/usr/bin/env bash
# Builds the site, then makes one standalone Netlify-ready zip per page (that page becomes index.html).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build >/dev/null
mkdir -p zips && rm -f zips/*.zip
make_zip() { # page-file zip-name keep-spin
  local page=$1 name=$2 spin=$3 tmp; tmp=$(mktemp -d)
  cp -r dist/. "$tmp/"
  rm -rf "$tmp/data"
  for h in index matchday lab drop; do [ "$h.html" = "$page" ] || rm -f "$tmp/$h.html"; done
  [ "$page" = "index.html" ] || mv "$tmp/$page" "$tmp/index.html"
  [ "$spin" = yes ] || rm -rf "$tmp/spin"
  (cd "$tmp" && zip -qr "$OLDPWD/zips/$name.zip" .)
  rm -rf "$tmp"
}
make_zip index.html    1-dark-gold-stadium no
make_zip matchday.html 2-matchday-poster   no
make_zip drop.html     3-the-drop-shinguard yes
make_zip lab.html      4-liquid-logo-lab   no
ls -lh zips
