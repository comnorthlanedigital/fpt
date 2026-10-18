#!/usr/bin/env bash
# Builds the site, then makes one standalone Netlify-ready zip per page (that page becomes index.html).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build >/dev/null
mkdir -p zips && rm -f zips/*.zip
PAGES="index matchday lab drop liquid archive sound"
make_zip() { # page-file zip-name keep-spin keep-catalog
  local page=$1 name=$2 spin=$3 catalog=$4 tmp; tmp=$(mktemp -d)
  cp -r dist/. "$tmp/"
  rm -f "$tmp/data/products.json" "$tmp/data/collections.json"
  [ "$catalog" = yes ] || rm -rf "$tmp/data"
  for h in $PAGES; do [ "$h.html" = "$page" ] || rm -f "$tmp/$h.html"; done
  [ "$page" = "index.html" ] || mv "$tmp/$page" "$tmp/index.html"
  [ "$spin" = yes ] || rm -rf "$tmp/spin"
  (cd "$tmp" && zip -qr "$OLDPWD/zips/$name.zip" .)
  rm -rf "$tmp"
}
make_zip archive.html  A-football-archive      no  yes
make_zip sound.html    B-sound-experience      no  yes
make_zip matchday.html C-matchday-poster       no  no
make_zip liquid.html   D-matchday-liquid       no  no
make_zip index.html    old-dark-gold-stadium   no  no
make_zip drop.html     old-the-drop-shinguard  yes no
make_zip lab.html      old-liquid-logo-lab     no  no
ls -lh zips
