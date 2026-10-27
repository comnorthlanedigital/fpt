// A small procedural stucco house (three.js). Four paintable zones: walls, trim, garage door, front door.
import {
  Scene, PerspectiveCamera, WebGLRenderer, Mesh, Group, BoxGeometry, CylinderGeometry, SphereGeometry, ExtrudeGeometry, Shape,
  PlaneGeometry, CircleGeometry, MeshStandardMaterial, HemisphereLight, DirectionalLight, Color, CanvasTexture, RepeatWrapping,
  PCFShadowMap, SRGBColorSpace, ACESFilmicToneMapping, Fog,
} from 'three'

const noiseTex = (size, repeat) => {
  const c = document.createElement('canvas'); c.width = c.height = size
  const x = c.getContext('2d'), d = x.createImageData(size, size)
  for (let i = 0; i < d.data.length; i += 4) { const v = 110 + Math.random() * 145; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255 }
  x.putImageData(d, 0, 0)
  const t = new CanvasTexture(c); t.wrapS = t.wrapT = RepeatWrapping; t.repeat.set(repeat, repeat); return t
}

export function createHouse(canvas, colors) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = PCFShadowMap
  renderer.outputColorSpace = SRGBColorSpace; renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05
  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 120)

  scene.add(new HemisphereLight(0xdbe8ff, 0x6f6b5a, 1.05))
  const sun = new DirectionalLight(0xfff1dc, 2.6); sun.position.set(9, 13, 11); sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 50 }); sun.shadow.bias = -0.0006; sun.shadow.normalBias = 0.02
  scene.add(sun)

  const stucco = noiseTex(256, 5)
  const mats = {
    walls: new MeshStandardMaterial({ color: colors.walls, roughness: 0.96, bumpMap: stucco, bumpScale: 1.6 }),
    trim: new MeshStandardMaterial({ color: colors.trim, roughness: 0.7 }),
    garage: new MeshStandardMaterial({ color: colors.garage, roughness: 0.6 }),
    door: new MeshStandardMaterial({ color: colors.door, roughness: 0.5 }),
  }
  const roofMat = new MeshStandardMaterial({ color: 0x9a4a34, roughness: 0.85, bumpMap: noiseTex(128, 6), bumpScale: 1.2 })
  const glass = new MeshStandardMaterial({ color: 0x86a3bf, roughness: 0.22, metalness: 0.15, emissive: 0x243447, emissiveIntensity: 0.6 })
  const metal = new MeshStandardMaterial({ color: 0xc9ced8, roughness: 0.3, metalness: 0.9 })
  const grass = new MeshStandardMaterial({ color: 0x66735a, roughness: 1 })
  const pavers = new MeshStandardMaterial({ color: 0xb7a78d, roughness: 0.95, bumpMap: noiseTex(128, 10), bumpScale: 1 })
  const leaf = new MeshStandardMaterial({ color: 0x4b6a45, roughness: 0.9 }), bark = new MeshStandardMaterial({ color: 0x4c3a2c, roughness: 1 })

  const house = new Group(); scene.add(house)
  const box = (w, h, d, x, y, z, m, cast = true, parent = house) => { const b = new Mesh(new BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = cast; b.receiveShadow = true; parent.add(b); return b }

  // ground, drive, walk
  const ground = new Mesh(new CircleGeometry(18, 64), grass); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; house.add(ground)
  box(5.2, 0.06, 8, -5.7, 0.03, 7.3, pavers, false); box(1.7, 0.06, 6, 1.4, 0.03, 6.2, pavers, false)

  // bodies
  box(8, 3.2, 6, 1, 1.6, 0, mats.walls); box(5.4, 2.9, 6.6, -5.7, 1.45, 0.3, mats.walls)
  // roofs (triangular prisms)
  const prism = (w, h, l, m) => {
    const s = new Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath()
    const g = new ExtrudeGeometry(s, { depth: l, bevelEnabled: false }); g.translate(0, 0, -l / 2)
    const r = new Mesh(g, m); r.castShadow = true; r.receiveShadow = true; return r
  }
  const roofA = prism(7.2, 1.7, 9, roofMat); roofA.rotation.y = Math.PI / 2; roofA.position.set(1, 3.2, 0); house.add(roofA)
  const roofB = prism(6.1, 1.4, 7.4, roofMat); roofB.position.set(-5.7, 2.9, 0.3); house.add(roofB)
  // fascia / trim
  box(9.1, 0.2, 0.16, 1, 3.18, 3.62, mats.trim); box(9.1, 0.2, 0.16, 1, 3.18, -3.62, mats.trim)
  box(6.1, 0.24, 0.14, -5.7, 2.84, 3.66, mats.trim)
  box(0.16, 0.2, 7.4, -8.78, 2.88, 0.3, mats.trim); box(0.16, 0.2, 7.4, -2.62, 2.88, 0.3, mats.trim)
  // windows
  const win = (x) => {
    box(1.7, 1.4, 0.1, x, 1.95, 3.02, glass, false)
    box(1.9, 0.14, 0.2, x, 2.7, 3.06, mats.trim); box(1.9, 0.14, 0.2, x, 1.2, 3.06, mats.trim); box(0.14, 1.6, 0.2, x - 0.9, 1.95, 3.06, mats.trim); box(0.14, 1.6, 0.2, x + 0.9, 1.95, 3.06, mats.trim); box(0.08, 1.4, 0.16, x, 1.95, 3.06, mats.trim)
  }
  win(-0.4); win(3.6)
  // front door + frame + handle
  box(1.05, 2.25, 0.12, 1.6, 1.13, 3.04, mats.door); box(1.35, 0.14, 0.22, 1.6, 2.33, 3.08, mats.trim); box(0.14, 2.4, 0.22, 0.97, 1.2, 3.08, mats.trim); box(0.14, 2.4, 0.22, 2.23, 1.2, 3.08, mats.trim)
  const knob = new Mesh(new SphereGeometry(0.06, 16, 16), metal); knob.position.set(2.0, 1.1, 3.14); house.add(knob)
  // garage door + panels + frame
  box(4.5, 2.3, 0.12, -5.7, 1.15, 3.66, mats.garage)
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) box(0.95, 0.42, 0.05, -7.2 + c * 1.0 + 0.5, 0.35 + r * 0.55, 3.74, mats.garage)
  box(4.8, 0.16, 0.22, -5.7, 2.38, 3.7, mats.trim); box(0.16, 2.4, 0.22, -8.04, 1.2, 3.7, mats.trim); box(0.16, 2.4, 0.22, -3.36, 1.2, 3.7, mats.trim)
  // landscape
  const tree = (x, z, s) => { const g = new Group(); const t = new Mesh(new CylinderGeometry(0.12 * s, 0.18 * s, 1.6 * s, 8), bark); t.position.y = 0.8 * s; t.castShadow = true; g.add(t); [[0, 2.1, 0, 1.2], [0.5, 1.7, 0.2, 0.8], [-0.45, 1.8, -0.1, 0.85]].forEach(([a, b, c, r]) => { const l = new Mesh(new SphereGeometry(r * s, 16, 12), leaf); l.position.set(a * s, b * s, c * s); l.castShadow = true; g.add(l) }); g.position.set(x, 0, z); house.add(g) }
  tree(8.6, 3.6, 1.1); tree(-11, 2, 0.9)
  ;[[-1.2, 3.5], [2.2, 3.7], [4.2, 3.5]].forEach(([x, z]) => { const b = new Mesh(new SphereGeometry(0.42, 14, 10), leaf); b.position.set(x, 0.3, z); b.scale.y = 0.75; b.castShadow = true; house.add(b) })

  // orbit camera
  const target = { x: -1.6, y: 1.5, z: 1.2 }
  const cam = { az: 0.6, pol: 1.22, dist: 27, vaz: 0, vpol: 0 }
  const want = {}; Object.entries(mats).forEach(([k, m]) => { want[k] = new Color(m.color) })
  let auto = true, raf = 0, running = false, w = 1, h = 1
  const place = () => {
    const s = Math.sin(cam.pol)
    camera.position.set(target.x + cam.dist * s * Math.sin(cam.az), target.y + cam.dist * Math.cos(cam.pol), target.z + cam.dist * s * Math.cos(cam.az))
    camera.lookAt(target.x, target.y, target.z)
  }
  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (auto) cam.az += 0.0016
    cam.az += cam.vaz; cam.pol = Math.min(1.5, Math.max(0.95, cam.pol + cam.vpol)); cam.vaz *= 0.92; cam.vpol *= 0.9
    for (const k in mats) mats[k].color.lerp(want[k], 0.14)
    place(); renderer.render(scene, camera)
  }
  place()
  return {
    setColor: (zone, hex) => { want[zone] = new Color(hex) },
    drag: (dx, dy) => { auto = false; cam.vaz = -dx * 0.0018; cam.vpol = -dy * 0.0012; cam.az += -dx * 0.004; cam.pol = Math.min(1.5, Math.max(0.95, cam.pol - dy * 0.003)) },
    zoom: (d) => { cam.dist = Math.min(34, Math.max(14, cam.dist + d)) },
    setAuto: (v) => { auto = v },
    resize: (W, H) => { w = W; h = H; renderer.setSize(W, H, false); camera.aspect = W / H; camera.fov = W / H < 0.9 ? 44 : 32; camera.updateProjectionMatrix() },
    start: () => { if (!running) { running = true; frame() } },
    stop: () => { running = false; cancelAnimationFrame(raf) },
    dispose: () => { cancelAnimationFrame(raf); renderer.dispose() },
  }
}
