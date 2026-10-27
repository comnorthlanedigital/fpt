// Wall texture + color engine. Works on a real photo: a hand-placed wall mask (polygons with holes, gated by wall chroma),
// procedural stucco height fields, and light-from-top-left shading. Color keeps the photo's real light and shadow.

const rngOf = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

function valueNoise(W, H, cell, rng) {
  const gw = Math.ceil(W / cell) + 2, gh = Math.ceil(H / cell) + 2, g = new Float32Array(gw * gh)
  for (let i = 0; i < g.length; i++) g[i] = rng()
  const out = new Float32Array(W * H)
  for (let y = 0; y < H; y++) {
    const fy = y / cell, y0 = Math.floor(fy); let ty = fy - y0; ty = ty * ty * (3 - 2 * ty)
    for (let x = 0; x < W; x++) {
      const fx = x / cell, x0 = Math.floor(fx); let tx = fx - x0; tx = tx * tx * (3 - 2 * tx)
      const a = g[y0 * gw + x0], b = g[y0 * gw + x0 + 1], c = g[(y0 + 1) * gw + x0], d = g[(y0 + 1) * gw + x0 + 1]
      out[y * W + x] = a + (b - a) * tx + (c - a + (a - b - c + d) * tx) * ty
    }
  }
  return out
}

function plates(W, H, count, rmin, rmax, edge, seed) {
  const rng = rngOf(seed), h = new Float32Array(W * H)
  for (let n = 0; n < count; n++) {
    const cx = rng() * W, cy = rng() * H, r = rmin + rng() * (rmax - rmin), top = 0.5 + rng() * 0.5
    const p1 = rng() * 6.28, p2 = rng() * 6.28, a1 = 0.12 + rng() * 0.14, a2 = 0.05 + rng() * 0.1
    const x0 = Math.max(0, Math.floor(cx - r * 1.35)), x1 = Math.min(W - 1, Math.ceil(cx + r * 1.35)), y0 = Math.max(0, Math.floor(cy - r * 1.35)), y1 = Math.min(H - 1, Math.ceil(cy + r * 1.35))
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy), ang = Math.atan2(dy, dx)
      const rr = r * (1 + a1 * Math.sin(3 * ang + p1) + a2 * Math.sin(5 * ang + p2)), t = 1 - d / rr
      if (t <= 0) continue
      const v = Math.min(1, t * edge) * top, i = y * W + x
      if (v > h[i]) h[i] = v
    }
  }
  return h
}

export const KINDS = [
  { id: 'smooth', label: 'Smooth' },
  { id: 'sand', label: 'Fine sand' },
  { id: 'peel', label: 'Orange peel' },
  { id: 'knock', label: 'Knockdown' },
  { id: 'trowel', label: 'Skip trowel' },
]
const PARAMS = { smooth: { a: 0, b: 0 }, sand: { a: 1.0, b: 0.25 }, peel: { a: 0.95, b: 0.25 }, knock: { a: 1.45, b: 0.4 }, trowel: { a: 2.3, b: 0.6 } }

const hfCache = new Map()
export function heightfield(kind, W, H) {
  const key = `${kind}|${W}|${H}`
  if (hfCache.has(key)) return hfCache.get(key)
  let h
  if (kind === 'smooth') h = new Float32Array(W * H)
  else if (kind === 'sand') { const a = valueNoise(W, H, 1.6, rngOf(11)), b = valueNoise(W, H, 3.2, rngOf(12)); h = a.map((v, i) => v * 0.7 + b[i] * 0.3) }
  else if (kind === 'peel') { const a = valueNoise(W, H, 5.5, rngOf(21)), b = valueNoise(W, H, 2.8, rngOf(22)); h = a.map((v, i) => { const n = v * 0.6 + b[i] * 0.4; return n * n * 1.6 }) }
  else if (kind === 'knock') { const base = plates(W, H, Math.round((1.25 * W * H) / (Math.PI * 16 * 16)), 9, 24, 2.6, 31), fine = valueNoise(W, H, 2, rngOf(32)); h = base.map((v, i) => v + fine[i] * 0.12) }
  else { const base = plates(W, H, Math.round((0.85 * W * H) / (Math.PI * 42 * 42)), 26, 66, 2.2, 41), mid = valueNoise(W, H, 9, rngOf(42)); h = base.map((v, i) => v * 1.05 + mid[i] * 0.16) }
  hfCache.set(key, h)
  return h
}

function boxBlur(src, W, H, r, ch = 4) {
  const out = new Float32Array(src.length), tmp = new Float32Array(src.length), n = 2 * r + 1
  for (let c = 0; c < 3; c++) {
    for (let y = 0; y < H; y++) { let s = 0; for (let x = -r; x <= r; x++) s += src[(y * W + Math.min(W - 1, Math.max(0, x))) * ch + c]; for (let x = 0; x < W; x++) { tmp[(y * W + x) * ch + c] = s / n; s += src[(y * W + Math.min(W - 1, x + r + 1)) * ch + c] - src[(y * W + Math.max(0, x - r)) * ch + c] } }
    for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[(Math.min(H - 1, Math.max(0, y)) * W + x) * ch + c]; for (let y = 0; y < H; y++) { out[(y * W + x) * ch + c] = s / n; s += tmp[(Math.min(H - 1, y + r + 1) * W + x) * ch + c] - tmp[(Math.max(0, y - r) * W + x) * ch + c] } }
  }
  return out
}
function blurMask(m, W, H, r) {
  const a = new Float32Array(m.length), o = new Float32Array(m.length), n = 2 * r + 1
  for (let y = 0; y < H; y++) { let s = 0; for (let x = -r; x <= r; x++) s += m[y * W + Math.min(W - 1, Math.max(0, x))]; for (let x = 0; x < W; x++) { a[y * W + x] = s / n; s += m[y * W + Math.min(W - 1, x + r + 1)] - m[y * W + Math.max(0, x - r)] } }
  for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += a[Math.min(H - 1, Math.max(0, y)) * W + x]; for (let y = 0; y < H; y++) { o[y * W + x] = s / n; s += a[Math.min(H - 1, y + r + 1) * W + x] - a[Math.max(0, y - r) * W + x] } }
  return o
}

/* ---- scene: photo + wall mask ---- */
export async function loadScene(def) {
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = def.src })
  const W = img.naturalWidth, H = img.naturalHeight
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(img, 0, 0)
  const orig = cx.getImageData(0, 0, W, H)
  // polygon mask with holes
  const mc = document.createElement('canvas'); mc.width = W; mc.height = H
  const mx = mc.getContext('2d', { willReadFrequently: true })
  const path = (pts) => { mx.beginPath(); pts.forEach(([x, y], i) => (i ? mx.lineTo((x / 100) * W, (y / 100) * H) : mx.moveTo((x / 100) * W, (y / 100) * H))); mx.closePath() }
  mx.fillStyle = '#fff'; def.walls.forEach((p) => { path(p); mx.fill() })
  mx.globalCompositeOperation = 'destination-out'; def.holes.forEach((p) => { path(p); mx.fill() })
  const md = mx.getImageData(0, 0, W, H).data
  let m = new Float32Array(W * H); for (let i = 0; i < m.length; i++) m[i] = md[i * 4 + 3] / 255
  // chroma gate (on a blurred copy so the photo's own stucco grain does not punch holes): keep wall-colored pixels, drop roof, stone, greenery, sky
  const gate = boxBlur(Float32Array.from(orig.data), W, H, 5)
  const cr = [], cb = []
  for (let i = 0; i < m.length; i += 9) if (m[i] > 0.99) { const r = gate[i * 4], g = gate[i * 4 + 1], b = gate[i * 4 + 2], s = r + g + b + 1; cr.push(r / s); cb.push(b / s) }
  cr.sort((a, b) => a - b); cb.sort((a, b) => a - b)
  const mr = cr[cr.length >> 1] ?? 0.4, mb = cb[cb.length >> 1] ?? 0.25, tol = def.tol ?? 0.06
  for (let i = 0; i < m.length; i++) if (m[i] > 0) {
    const r = gate[i * 4], g = gate[i * 4 + 1], b = gate[i * 4 + 2], s = r + g + b + 1, lum = (r + g + b) / 3
    const d = Math.hypot(r / s - mr, b / s - mb)
    m[i] *= Math.max(0, Math.min(1, 1 - (d - tol * 1.35) / (tol * 0.9))) * (lum < 14 ? 0 : 1)
  }
  m = blurMask(m, W, H, 2)
  // softened copy of the photo, used to replace the photo's own stucco grain
  const soft = boxBlur(Float32Array.from(orig.data), W, H, 3)
  let sumL = 0, sumM = 0
  for (let i = 0; i < m.length; i++) if (m[i] > 0.5) { sumL += (soft[i * 4] * 0.3 + soft[i * 4 + 1] * 0.59 + soft[i * 4 + 2] * 0.11); sumM++ }
  return { W, H, orig, soft, mask: m, Lm: sumL / Math.max(1, sumM) }
}

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]

/* ---- render: returns ImageData ---- */
export function render(scene, { kind, strength = 0.7, color = null, showMask = false }) {
  const { W, H, orig, soft, mask, Lm } = scene
  const out = new ImageData(new Uint8ClampedArray(orig.data), W, H)
  const hf = heightfield(kind, W, H), P = PARAMS[kind], c = color ? hex(color) : null
  const keep = kind === 'smooth' ? 0 : 0.35 // how much of the photo's own grain survives
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const p = y * W + x, m = mask[p]
    if (m < 0.01) continue
    const i = p * 4
    let r = soft[i] + (orig.data[i] - soft[i]) * keep, g = soft[i + 1] + (orig.data[i + 1] - soft[i + 1]) * keep, b = soft[i + 2] + (orig.data[i + 2] - soft[i + 2]) * keep
    if (c) { const L = (soft[i] * 0.3 + soft[i + 1] * 0.59 + soft[i + 2] * 0.11) / Lm; let k = Math.min(1.25, Math.pow(L, 1.15)); const lc = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255; if (lc < 0.35) k *= 0.8 + lc * 0.5; r = c[0] * k; g = c[1] * k; b = c[2] * k }
    if (P.a) {
      const sh = (hf[p + 1] - hf[p - 1]) + (hf[p + W] - hf[p - W]), mod = 1 + strength * (P.a * 0.55 * sh + P.b * (hf[p] - 0.35))
      r *= mod; g *= mod; b *= mod
    }
    out.data[i] = orig.data[i] + (r - orig.data[i]) * m; out.data[i + 1] = orig.data[i + 1] + (g - orig.data[i + 1]) * m; out.data[i + 2] = orig.data[i + 2] + (b - orig.data[i + 2]) * m
    if (showMask) { out.data[i] = out.data[i] * 0.4 + 255 * 0.6 * m; out.data[i + 1] *= 1 - 0.5 * m }
  }
  return out
}

/* small grayscale tile that previews a texture */
export function tile(kind, size = 96) {
  const hf = heightfield(kind, size + 2, size + 2), W = size + 2, P = PARAMS[kind]
  const d = new ImageData(size, size)
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const p = (y + 1) * W + x + 1, sh = P.a ? (hf[p + 1] - hf[p - 1]) + (hf[p + W] - hf[p - W]) : 0
    const v = Math.max(0, Math.min(255, 168 * (1 + 0.8 * (P.a * 0.55 * sh + P.b * (hf[p] - 0.35)))))
    const i = (y * size + x) * 4; d.data[i] = v; d.data[i + 1] = v * 0.97; d.data[i + 2] = v * 0.92; d.data[i + 3] = 255
  }
  return d
}
