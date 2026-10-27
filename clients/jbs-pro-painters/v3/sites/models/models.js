// Three paintable scale models (house, bathroom, kitchen) and a small orbit/pick viewer. Every painted surface is a "zone".
import {
  Scene, PerspectiveCamera, WebGLRenderer, Mesh, Group, BoxGeometry, CylinderGeometry, SphereGeometry, ExtrudeGeometry, Shape, CircleGeometry,
  MeshStandardMaterial, HemisphereLight, DirectionalLight, Color, CanvasTexture, RepeatWrapping, PCFShadowMap, SRGBColorSpace, NoToneMapping, Raycaster, Vector2,
} from 'three'

export const FINISH = { flat: 0.95, satin: 0.5, gloss: 0.2 }

function gridTex(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 256
  const x = c.getContext('2d'); x.fillStyle = '#f6f5f2'; x.fillRect(0, 0, 256, 256)
  if (kind === 'tile') { x.strokeStyle = '#a7a49d'; x.lineWidth = 5; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, 256); x.moveTo(0, i * 64); x.lineTo(256, i * 64); x.stroke() } }
  else {
    x.strokeStyle = '#b6b1a8'; x.lineWidth = 4
    for (let r = 0; r < 4; r++) { x.beginPath(); x.moveTo(0, r * 64); x.lineTo(256, r * 64); x.stroke(); const j = (r * 97 + 40) % 200 + 20; x.beginPath(); x.moveTo(j, r * 64); x.lineTo(j, r * 64 + 64); x.stroke() }
    for (let i = 0; i < 700; i++) { x.fillStyle = `rgba(120,110,95,${Math.random() * 0.08})`; x.fillRect(Math.random() * 256, Math.random() * 256, 30 + Math.random() * 40, 1) }
  }
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t
}
const noise = (size, rep) => {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d'), d = x.createImageData(size, size)
  for (let i = 0; i < d.data.length; i += 4) { const v = 120 + Math.random() * 135; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255 }
  x.putImageData(d, 0, 0); const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(rep, rep); return t
}

const C = (m, n) => { m.userData.cut = n; return m } // hidden when the camera is on that side (dollhouse cutaway)
const fixed = (hex, rough = 0.5, metal = 0) => new MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal })
function helpers(mats) {
  const fx = { white: fixed(0xf4f4f1, 0.3), metal: fixed(0xc8ccd4, 0.28, 0.85), steel: fixed(0xb8bcc4, 0.35, 0.8), glass: new MeshStandardMaterial({ color: 0xa9c0d4, roughness: 0.15, metalness: 0.1, emissive: 0x243447, emissiveIntensity: 0.5 }), mirror: fixed(0xd9e3ec, 0.08, 0.6), plinth: fixed(0xe9e6df, 0.9), dark: fixed(0x2b2d33, 0.5), shrub: fixed(0xa5b09d, 0.95) }
  const box = (g, w, h, d, x, y, z, mat, cast = true) => { const m = new Mesh(new BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = cast; m.receiveShadow = true; if (mat.userData.zone) m.userData.zone = mat.userData.zone; g.add(m); return m }
  const cyl = (g, r, h, x, y, z, mat, seg = 16) => { const m = new Mesh(new CylinderGeometry(r, r, h, seg), mat); m.position.set(x, y, z); m.castShadow = true; g.add(m); return m }
  return { fx, box, cyl, mats }
}

/* ---------------- HOUSE ---------------- */
function buildHouse(mats) {
  const { fx, box, cyl } = helpers(mats), g = new Group()
  const disc = new Mesh(new CylinderGeometry(17, 17.4, 0.5, 72), fx.plinth); disc.position.y = -0.25; disc.receiveShadow = true; g.add(disc)
  const lawn = new Mesh(new CircleGeometry(16.4, 64), fixed(0xe3e0d8, 1)); lawn.rotation.x = -Math.PI / 2; lawn.position.y = 0.01; lawn.receiveShadow = true; g.add(lawn)
  box(g, 5.2, 0.06, 8, -5.7, 0.04, 7.3, fixed(0xcfcbc2, 0.95), false); box(g, 1.6, 0.06, 6, 1.4, 0.04, 6.2, fixed(0xcfcbc2, 0.95), false)
  box(g, 8, 3.2, 6, 1, 1.6, 0, mats.walls); box(g, 5.4, 2.9, 6.6, -5.7, 1.45, 0.3, mats.walls)
  const prism = (w, h, l, m) => { const s = new Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath(); const geo = new ExtrudeGeometry(s, { depth: l, bevelEnabled: false }); geo.translate(0, 0, -l / 2); const r = new Mesh(geo, m); r.castShadow = true; r.receiveShadow = true; r.userData.zone = 'roof'; return r }
  const rA = prism(7.2, 1.7, 9, mats.roof); rA.rotation.y = Math.PI / 2; rA.position.set(1, 3.2, 0); g.add(rA)
  const rB = prism(6.1, 1.4, 7.4, mats.roof); rB.position.set(-5.7, 2.9, 0.3); g.add(rB)
  box(g, 9.1, 0.2, 0.16, 1, 3.18, 3.62, mats.trim); box(g, 9.1, 0.2, 0.16, 1, 3.18, -3.62, mats.trim); box(g, 6.1, 0.24, 0.14, -5.7, 2.84, 3.66, mats.trim)
  box(g, 0.16, 0.2, 7.4, -8.78, 2.88, 0.3, mats.trim); box(g, 0.16, 0.2, 7.4, -2.62, 2.88, 0.3, mats.trim)
  const win = (x) => { box(g, 1.7, 1.4, 0.1, x, 1.95, 3.02, fx.glass, false); box(g, 1.9, 0.14, 0.2, x, 2.7, 3.06, mats.trim); box(g, 1.9, 0.14, 0.2, x, 1.2, 3.06, mats.trim); box(g, 0.14, 1.6, 0.2, x - 0.9, 1.95, 3.06, mats.trim); box(g, 0.14, 1.6, 0.2, x + 0.9, 1.95, 3.06, mats.trim); box(g, 0.08, 1.4, 0.16, x, 1.95, 3.06, mats.trim) }
  win(-0.4); win(3.6)
  box(g, 1.05, 2.25, 0.12, 1.6, 1.13, 3.04, mats.door); box(g, 1.35, 0.14, 0.22, 1.6, 2.33, 3.08, mats.trim); box(g, 0.14, 2.4, 0.22, 0.97, 1.2, 3.08, mats.trim); box(g, 0.14, 2.4, 0.22, 2.23, 1.2, 3.08, mats.trim)
  box(g, 0.4, 3.0, 0.5, 0.45, 1.5, 3.3, mats.accent); box(g, 0.4, 3.0, 0.5, 2.75, 1.5, 3.3, mats.accent); box(g, 2.7, 0.38, 0.5, 1.6, 2.75, 3.3, mats.accent)
  const knob = new Mesh(new SphereGeometry(0.06, 16, 16), fx.metal); knob.position.set(2.0, 1.1, 3.14); g.add(knob)
  box(g, 4.5, 2.3, 0.12, -5.7, 1.15, 3.66, mats.garage)
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) box(g, 0.95, 0.42, 0.05, -7.2 + c * 1.0 + 0.5, 0.35 + r * 0.55, 3.74, mats.garage)
  box(g, 4.8, 0.16, 0.22, -5.7, 2.38, 3.7, mats.trim); box(g, 0.16, 2.4, 0.22, -8.04, 1.2, 3.7, mats.trim); box(g, 0.16, 2.4, 0.22, -3.36, 1.2, 3.7, mats.trim)
  ;[[-1.2, 3.5], [4.2, 3.5], [8.8, 2.2], [-10.5, 2]].forEach(([x, z]) => { const b = new Mesh(new SphereGeometry(0.45, 14, 10), fx.shrub); b.position.set(x, 0.3, z); b.scale.y = 0.75; b.castShadow = true; g.add(b) })
  return { group: g, shadow: 22 }
}

/* ---------------- BATHROOM ---------------- */
function buildBath(mats) {
  const { fx, box, cyl } = helpers(mats), g = new Group()
  box(g, 6.4, 0.3, 5.8, 0, -0.17, -0.1, fx.plinth, false)
  const floor = box(g, 5.4, 0.08, 4.8, 0, 0.04, 0, mats.floor)
  C(box(g, 5.8, 3.9, 0.2, 0, 1.95, -2.5, mats.accent), [0, 0, -1]); C(box(g, 0.2, 3.9, 4.8, -2.8, 1.95, 0, mats.walls), [-1, 0, 0]); C(box(g, 0.2, 3.9, 4.8, 2.8, 1.95, 0, mats.walls), [1, 0, 0])
  C(box(g, 5.4, 0.22, 0.08, 0, 0.19, -2.36, mats.trim), [0, 0, -1]); C(box(g, 0.08, 0.22, 4.8, -2.66, 0.19, 0, mats.trim), [-1, 0, 0]); C(box(g, 0.08, 0.22, 4.8, 2.66, 0.19, 0, mats.trim), [1, 0, 0])
  C(box(g, 0.07, 3.1, 1.3, -2.66, 1.63, 0.8, mats.door), [-1, 0, 0]); C(box(g, 0.1, 0.12, 1.55, -2.66, 3.22, 0.8, mats.trim), [-1, 0, 0]); C(box(g, 0.1, 3.2, 0.1, -2.66, 1.68, 0.1, mats.trim), [-1, 0, 0]); C(box(g, 0.1, 3.2, 0.1, -2.66, 1.68, 1.5, mats.trim), [-1, 0, 0])
  const h = new Mesh(new SphereGeometry(0.05, 12, 12), fx.metal); h.position.set(-2.6, 1.6, 1.3); C(h, [-1, 0, 0]); g.add(h)
  box(g, 2.0, 1.45, 0.9, -0.7, 0.8, -1.95, mats.vanity); box(g, 0.9, 1.1, 0.04, -1.2, 0.84, -1.48, mats.vanity); box(g, 0.9, 1.1, 0.04, -0.2, 0.84, -1.48, mats.vanity)
  box(g, 0.25, 0.04, 0.04, -1.2, 1.2, -1.44, fx.metal); box(g, 0.25, 0.04, 0.04, -0.2, 1.2, -1.44, fx.metal)
  box(g, 2.1, 0.1, 0.98, -0.7, 1.58, -1.92, mats.counter); box(g, 0.7, 0.03, 0.5, -0.7, 1.64, -1.96, fx.white); cyl(g, 0.03, 0.22, -0.7, 1.76, -2.28, fx.metal)
  C(box(g, 1.5, 1.0, 0.06, -0.7, 2.6, -2.37, mats.mirror), [0, 0, -1]); C(box(g, 1.28, 0.8, 0.03, -0.7, 2.6, -2.33, fx.mirror, false), [0, 0, -1])
  box(g, 1.4, 0.55, 2.6, 2.0, 0.36, -1.1, fx.white); box(g, 1.1, 0.12, 2.3, 2.0, 0.64, -1.1, fx.mirror, false); cyl(g, 0.04, 0.5, 2.55, 1.0, -2.25, fx.metal)
  box(g, 0.55, 0.5, 0.2, 1.1, 0.4, -2.25, fx.white); const bowl = new Mesh(new CylinderGeometry(0.22, 0.2, 0.4, 20), fx.white); bowl.position.set(1.1, 0.3, -1.95); bowl.scale.z = 1.35; bowl.castShadow = true; g.add(bowl)
  return { group: g, shadow: 9 }
}

/* ---------------- KITCHEN ---------------- */
function buildKitchen(mats) {
  const { fx, box } = helpers(mats), g = new Group()
  box(g, 9.2, 0.3, 7.6, 0, -0.17, 0, fx.plinth, false)
  box(g, 8, 0.08, 6.4, 0, 0.04, 0, mats.floor)
  C(box(g, 8.4, 4.2, 0.2, 0, 2.1, -3.3, mats.walls), [0, 0, -1]); C(box(g, 0.2, 4.2, 6.4, -4.1, 2.1, 0, mats.walls), [-1, 0, 0])
  C(box(g, 8, 0.12, 0.12, 0, 4.14, -3.14, mats.trim), [0, 0, -1]); C(box(g, 0.12, 0.12, 6.4, -3.94, 4.14, 0, mats.trim), [-1, 0, 0])
  for (let i = 0; i < 5; i++) {
    const x = -2.75 + i, range = i === 2
    if (range) { box(g, 0.98, 1.45, 0.75, x, 0.805, -2.825, fx.steel); box(g, 0.9, 0.04, 0.6, x, 1.55, -2.82, fx.dark); box(g, 1.0, 0.3, 0.6, x, 3.4, -2.9, fx.steel); box(g, 0.5, 0.9, 0.4, x, 3.9, -3.0, fx.steel) }
    else { box(g, 0.98, 1.45, 0.75, x, 0.805, -2.825, mats.lower); box(g, 0.84, 1.15, 0.04, x, 0.84, -2.43, mats.lower); box(g, 0.2, 0.04, 0.04, x, 1.25, -2.4, fx.metal) }
  }
  for (let i = 0; i < 3; i++) { const z = -1.95 + i; box(g, 0.75, 1.45, 0.98, -3.625, 0.805, z, mats.lower); box(g, 0.04, 1.15, 0.84, -3.24, 0.84, z, mats.lower); box(g, 0.04, 0.04, 0.2, -3.22, 1.25, z, fx.metal) }
  box(g, 5.1, 0.1, 0.8, -0.75, 1.58, -2.82, mats.counter); box(g, 0.8, 0.1, 3.0, -3.6, 1.58, -0.95, mats.counter)
  C(box(g, 5.0, 0.77, 0.04, -0.75, 2.02, -3.18, mats.backsplash), [0, 0, -1]); C(box(g, 0.04, 0.77, 3.0, -3.98, 2.02, -0.95, mats.backsplash), [-1, 0, 0])
  ;[-2.75, -1.75, 0.25, 1.25].forEach((x) => { C(box(g, 0.98, 1.25, 0.45, x, 3.03, -2.97, mats.upper), [0, 0, -1]); C(box(g, 0.84, 1.05, 0.04, x, 3.03, -2.72, mats.upper), [0, 0, -1]); C(box(g, 0.2, 0.04, 0.04, x, 2.62, -2.69, fx.metal), [0, 0, -1]) })
  C(box(g, 0.04, 1.1, 1.6, -3.97, 3.0, -0.95, fx.glass, false), [-1, 0, 0]); C(box(g, 0.1, 0.1, 1.8, -3.94, 3.62, -0.95, mats.trim), [-1, 0, 0]); C(box(g, 0.1, 0.1, 1.8, -3.94, 2.42, -0.95, mats.trim), [-1, 0, 0]); C(box(g, 0.1, 1.3, 0.1, -3.94, 3.0, -1.85, mats.trim), [-1, 0, 0]); C(box(g, 0.1, 1.3, 0.1, -3.94, 3.0, -0.05, mats.trim), [-1, 0, 0])
  box(g, 3.2, 1.45, 1.1, 0.6, 0.805, 0.3, mats.island); box(g, 1.4, 1.1, 0.04, -0.05, 0.84, 0.87, mats.island); box(g, 1.4, 1.1, 0.04, 1.25, 0.84, 0.87, mats.island)
  box(g, 3.6, 0.1, 1.45, 0.6, 1.58, 0.45, mats.counter)
  ;[-0.1, 1.3].forEach((x) => { const s = new Mesh(new CylinderGeometry(0.17, 0.17, 0.05, 20), fx.dark); s.position.set(x, 1.0, 1.4); s.castShadow = true; g.add(s); const l = new Mesh(new CylinderGeometry(0.03, 0.03, 0.97, 8), fx.metal); l.position.set(x, 0.5, 1.4); g.add(l) })
  box(g, 1.1, 3.1, 0.9, 2.6, 1.63, -2.75, fx.steel); box(g, 0.03, 1.4, 0.03, 2.1, 1.9, -2.28, fx.metal)
  return { group: g, shadow: 11 }
}

const WALL = (c) => ({ color: c, finish: 'flat' })
export const MODELS = {
  house: {
    label: 'House', project: 'Exterior painting', build: buildHouse, cam: { az: 0.6, pol: 1.2, dist: 23.5, min: 14, max: 36, t: [-1.6, 1.2, 1.2] },
    zones: [
      { id: 'walls', label: 'Walls', ...WALL('#d9d2c3') }, { id: 'accent', label: 'Entry accent', ...WALL('#b7ab98') }, { id: 'trim', label: 'Trim', color: '#f2eee6', finish: 'satin' },
      { id: 'garage', label: 'Garage door', color: '#5b3720', finish: 'satin' }, { id: 'door', label: 'Front door', color: '#5b3720', finish: 'satin' }, { id: 'roof', label: 'Roof tiles', color: '#9a4a34', finish: 'flat' },
    ],
  },
  bath: {
    label: 'Bathroom', project: 'Interior painting', build: buildBath, cam: { az: 0.45, pol: 1.08, dist: 9.8, min: 6, max: 14, t: [0, 1.3, -0.2] },
    zones: [
      { id: 'walls', label: 'Walls', ...WALL('#e9e5da') }, { id: 'accent', label: 'Accent wall', ...WALL('#e0dbcf') }, { id: 'trim', label: 'Trim and door frame', color: '#f6f4ef', finish: 'satin' },
      { id: 'door', label: 'Door', color: '#f1efe9', finish: 'satin' }, { id: 'vanity', label: 'Vanity cabinet', color: '#8b6b4e', finish: 'satin' }, { id: 'counter', label: 'Countertop', color: '#d9d6d0', finish: 'gloss' },
      { id: 'mirror', label: 'Mirror frame', color: '#3a3a3e', finish: 'satin' }, { id: 'floor', label: 'Floor tile', color: '#c9c5bc', finish: 'satin' },
    ],
  },
  kitchen: {
    label: 'Kitchen', project: 'Cabinets', build: buildKitchen, cam: { az: 0.5, pol: 1.1, dist: 12.6, min: 8, max: 18, t: [-0.3, 1.5, -0.2] },
    zones: [
      { id: 'walls', label: 'Walls', ...WALL('#ece8dc') }, { id: 'upper', label: 'Upper cabinets', color: '#f1efe9', finish: 'satin' }, { id: 'lower', label: 'Lower cabinets', color: '#f1efe9', finish: 'satin' },
      { id: 'island', label: 'Island', color: '#f1efe9', finish: 'satin' }, { id: 'counter', label: 'Countertops', color: '#cfcac2', finish: 'gloss' }, { id: 'backsplash', label: 'Backsplash', color: '#e8e5df', finish: 'gloss' },
      { id: 'trim', label: 'Trim and window', color: '#f6f4ef', finish: 'satin' }, { id: 'floor', label: 'Floor', color: '#b99a75', finish: 'satin' },
    ],
  },
}
export const FIXED_NOTE = { house: 'Windows and landscaping stay as shown.', bath: 'The tub, toilet, sink and mirror glass stay as shown.', kitchen: 'Appliances, handles and stools stay as shown.' }

/* ---------------- viewer ---------------- */
export function createViewer(canvas, cb) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = PCFShadowMap
  renderer.outputColorSpace = SRGBColorSpace; renderer.toneMapping = NoToneMapping
  const scene = new Scene(), camera = new PerspectiveCamera(32, 1, 0.1, 200)
  scene.add(new HemisphereLight(0xf3f6ff, 0x9a9588, 1.9))
  const sun = new DirectionalLight(0xfff4e6, 1.25); sun.position.set(9, 14, 11); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02; scene.add(sun)
  const ray = new Raycaster(), ndc = new Vector2()
  const tile = gridTex('tile'), plank = gridTex('plank'), stucco = noise(256, 5)
  let root = null, mats = {}, cur = null, id = null, cuts = []
  const cam = { az: 0.6, pol: 1.2, dist: 20, min: 10, max: 30, t: [0, 1, 0], vaz: 0, vpol: 0, fit: 1 }
  let auto = true, raf = 0, running = false, down = null, dragged = false, hover = null, sel = null, pulse = 0
  const want = {}, glow = {}

  const place = () => {
    const s = Math.sin(cam.pol), d = cam.dist * cam.fit
    camera.position.set(cam.t[0] + d * s * Math.sin(cam.az), cam.t[1] + d * Math.cos(cam.pol), cam.t[2] + d * s * Math.cos(cam.az)); camera.lookAt(cam.t[0], cam.t[1], cam.t[2])
  }
  function apply(zone, state) {
    const m = mats[zone]; if (!m) return
    want[zone] = new Color(state.color); m.roughness = FINISH[state.finish] ?? 0.6
  }
  function load(modelId, paint) {
    if (root) { scene.remove(root); root.traverse((o) => { if (o.geometry) o.geometry.dispose() }) }
    id = modelId; cur = MODELS[modelId]; mats = {}
    cur.zones.forEach((z) => {
      const p = paint[z.id]; const m = new MeshStandardMaterial({ color: p.color, roughness: FINISH[p.finish] ?? 0.6, emissive: 0x000000 }); m.userData.zone = z.id
      if (z.id === 'floor') { m.map = modelId === 'kitchen' ? plank : tile; m.map.repeat.set(modelId === 'kitchen' ? 4 : 2.25, modelId === 'kitchen' ? 4 : 2) }
      if (modelId === 'house' && (z.id === 'walls' || z.id === 'accent')) { m.bumpMap = stucco; m.bumpScale = 1.4 }
      mats[z.id] = m; want[z.id] = new Color(p.color); glow[z.id] = 0
    })
    const built = cur.build(mats); root = built.group; scene.add(root); cuts = []; root.traverse((o) => { if (o.userData.cut) cuts.push(o) })
    const sc = sun.shadow.camera; Object.assign(sc, { left: -built.shadow, right: built.shadow, top: built.shadow, bottom: -built.shadow, near: 1, far: 60 }); sc.updateProjectionMatrix()
    Object.assign(cam, { az: cur.cam.az, pol: cur.cam.pol, dist: cur.cam.dist, min: cur.cam.min, max: cur.cam.max, t: cur.cam.t, vaz: 0, vpol: 0 }); hover = null; sel = null
    place()
  }
  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (auto) cam.az += 0.0012
    cam.az += cam.vaz; cam.pol = Math.min(1.45, Math.max(0.85, cam.pol + cam.vpol)); cam.vaz *= 0.93; cam.vpol *= 0.9
    const now = performance.now()
    { const dx = Math.sin(cam.az) * Math.sin(cam.pol), dz = Math.cos(cam.az) * Math.sin(cam.pol); for (const o of cuts) { const n = o.userData.cut; o.visible = n[0] * dx + n[2] * dz < 0.28 } }
    for (const k in mats) {
      mats[k].color.lerp(want[k], 0.12)
      const target = (k === hover ? 0.1 : 0) + (k === sel ? 0.16 * Math.max(0, 1 - (now - pulse) / 800) : 0)
      glow[k] += (target - glow[k]) * 0.2; mats[k].emissive.setRGB(glow[k], glow[k], glow[k])
    }
    place(); renderer.render(scene, camera)
  }
  const zoneAt = (cx, cy) => {
    const r = canvas.getBoundingClientRect(); ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera)
    if (!root) return null
    const hit = ray.intersectObjects(root.children, true).find((h) => h.object.userData.zone); return hit ? hit.object.userData.zone : null
  }
  const onDown = (e) => { down = { x: e.clientX, y: e.clientY, t: e.pointerType }; dragged = false; auto = false; canvas.setPointerCapture(e.pointerId) }
  const onMove = (e) => {
    if (!down) { const z = e.pointerType === 'mouse' ? zoneAt(e.clientX, e.clientY) : null; if (z !== hover) { hover = z; canvas.style.cursor = z ? 'pointer' : 'grab'; cb.onHover && cb.onHover(z) } return }
    const dx = e.clientX - down.x, dy = e.clientY - down.y
    if (!dragged && Math.hypot(dx, dy) > 5) dragged = true
    if (dragged) { cam.az -= (e.clientX - (down.lx ?? down.x)) * 0.006; if (down.t === 'mouse') cam.pol = Math.min(1.45, Math.max(0.85, cam.pol - (e.clientY - (down.ly ?? down.y)) * 0.004)) }
    down.lx = e.clientX; down.ly = e.clientY
  }
  const onUp = (e) => { if (down && !dragged) { const z = zoneAt(e.clientX, e.clientY); if (z) { sel = z; pulse = performance.now(); cb.onPick && cb.onPick(z) } } down = null }
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointermove', onMove); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointercancel', () => { down = null })
  canvas.addEventListener('pointerleave', () => { if (!down) { hover = null; cb.onHover && cb.onHover(null) } })
  return {
    load, setColor: (zone, state) => apply(zone, state), select: (zone) => { sel = zone; pulse = performance.now() },
    zoom: (d) => { cam.dist = Math.min(cam.max, Math.max(cam.min, cam.dist + d)) }, setAuto: (v) => { auto = v },
    resize: (w, h) => { renderer.setSize(w, h, false); camera.aspect = w / h; camera.fov = w / h < 0.9 ? 46 : 32; cam.fit = w / h < 1 ? 1.25 : 1; camera.updateProjectionMatrix() },
    start: () => { if (!running) { running = true; frame() } }, stop: () => { running = false; cancelAnimationFrame(raf) },
    dispose: () => { cancelAnimationFrame(raf); renderer.dispose() },
  }
}
