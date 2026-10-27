// Builds each v3 site (React + framer-motion) into one self-contained HTML file in ../preview.
// usage: node clients/jbs-pro-painters/v3/build.mjs [roller coats board lights studio]
import { build } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const META = {
  roller: ['Watch a wall change', '#0a1433', 'Drag a paint roller across a real before photo and watch the finished job appear. JB\'S Pro Painters LLC: interior and exterior painting for homes and businesses across the East Valley. Free estimates.'],
  coats: ['Primer. Base. Finish.', '#050a1c', 'Scroll through the three coats of a JB\'S Pro Painters job, from taped and primed to finished. Interior and exterior painting across the East Valley. Free estimates.'],
  board: ['The Job Board', '#37373f', 'Real JB\'S Pro Painters jobs taped to the wall. Drag them around and flip one to see where it started. Interior and exterior painting in Gilbert, Mesa, Chandler and more.'],
  lights: ['Flip the switch', '#07080d', 'Flip the switch and watch dark rooms come alive. Real before and after interiors and warehouses by JB\'S Pro Painters LLC across the East Valley. Free estimates.'],
  home: ['Painters in the East Valley', '#0a1433', 'Roll a real before photo into the finished job, then watch a JB\'S Pro Painters job go on coat by coat. Interior and exterior painting for homes and businesses across the East Valley. Free estimates, call (602) 473-0415.'],
  models: ['3D Paint Studio', '#12141a', 'Pick a 3D model of a house, bathroom or kitchen, paint every surface in real colors and finishes, and send the plan straight into a free estimate request from JB\'S Pro Painters.'],
  texture: ['Texture Studio', '#16181f', 'Pick a real JB\'S Pro Painters project, choose a wall texture (smooth, sand, orange peel, knockdown, skip trowel) and color, and look closer with the magnifier. Then request the finish with a free estimate.'],
  studio: ['Color Studio', '#16181f', 'Spin a 3D house and try real JB\'S Pro Painters colors on the walls, trim and doors, then send the scheme with a free estimate request.'],
}
const sites = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(META)
const OUT = { home: 'JBS-home.html', studio: 'old-concepts/JBS-color-studio.html', texture: 'JBS-texture-studio.html', models: 'JBS-3d-studio.html' } // no-sound pages
const SILENT = new Set(['home', 'studio', 'texture', 'models'])
const b64 = (f) => fs.readFileSync(path.join(here, 'img', f)).toString('base64')
fs.mkdirSync(path.join(here, '..', 'preview'), { recursive: true })
fs.copyFileSync(path.join(here, 'img', 'og.jpg'), path.join(here, '..', 'preview', 'og.jpg'))

for (const s of sites) {
  const [name, color, desc] = META[s]
  const root = path.join(here, 'sites', s)
  const title = `JB'S Pro Painters LLC | ${name} | East Valley AZ`
  fs.writeFileSync(path.join(root, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${title}</title><meta name="description" content="${desc}"><meta name="theme-color" content="${color}">
<meta property="og:type" content="website"><meta property="og:title" content="${title}"><meta property="og:description" content="${desc}"><meta property="og:image" content="og.jpg"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/jpeg;base64,${b64('logo-sm.jpg')}"><link rel="apple-touch-icon" href="data:image/jpeg;base64,${b64('logo-sq.jpg')}">
</head><body><form name="quote" data-netlify="true" netlify-honeypot="bot" hidden><input name="form-name"><input name="request"><input name="name"><input name="phone"><input name="email"><input name="city"><input name="project"><input name="color"><input name="message"><input name="paint_plan"><input name="bot"></form><div id="root"></div><script type="module" src="./main.jsx"></script></body></html>`)
  const out = path.join(here, 'dist', s)
  await build({
    root, base: './', configFile: false, logLevel: 'warn', plugins: [react()],
    resolve: SILENT.has(s) ? { alias: [{ find: /^\.\/sound$/, replacement: path.join(here, 'shared', 'silent.js') }] } : {},
    build: { outDir: out, emptyOutDir: true, assetsInlineLimit: 1e9, cssCodeSplit: false, modulePreload: false, chunkSizeWarningLimit: 1e9,
      rollupOptions: { output: { codeSplitting: false } } },
  })
  let html = fs.readFileSync(path.join(out, 'index.html'), 'utf8')
  const js = html.match(/<script type="module"[^>]*src="\.\/([^"]+)"[^>]*><\/script>/)
  const css = html.match(/<link rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/)
  const code = fs.readFileSync(path.join(out, js[1]), 'utf8').replace(/<\/script/gi, '<\\/script')
  const styleTag = css ? `<style>${fs.readFileSync(path.join(out, css[1]), 'utf8')}</style>` : ''
  html = html.replace(js[0], () => '').replace(css ? css[0] : '', () => styleTag)
  html = html.replace('</body>', () => `<script type="module">${code}</script></body>`)
  const dest = path.join(here, '..', 'preview', OUT[s] || `JBS-v3-${s}.html`)
  fs.writeFileSync(dest, html)
  console.log(`${s}: ${(fs.statSync(dest).size / 1e6).toFixed(2)} MB`)
}
