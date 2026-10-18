import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// The FPT logo as a layered, light-reactive gold hologram with floating gold dust.
export default function Emblem({ src }) {
  const host = useRef(null)

  useEffect(() => {
    const el = host.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.z = 7

    const tex = new THREE.TextureLoader().load(src)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8

    const group = new THREE.Group()
    scene.add(group)
    const plane = new THREE.PlaneGeometry(4, 4)
    const layers = 5
    for (let i = 0; i < layers; i++) {
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: i === layers - 1 ? 0.95 : 0.07,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
      const m = new THREE.Mesh(plane, mat)
      m.position.z = (i - (layers - 1)) * 0.09
      group.add(m)
    }

    const N = 260
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 2.2 + Math.random() * 2.2
      pos.set([Math.cos(a) * r, (Math.random() - 0.5) * 5, Math.sin(a) * r * 0.6 - 1], i * 3)
    }
    const dustGeo = new THREE.BufferGeometry()
    dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xf0cf6a, size: 0.035, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }),
    )
    scene.add(dust)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = el
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    const clock = new THREE.Clock()
    let raf
    const loop = () => {
      const t = clock.getElapsedTime()
      const s = reduce ? 0 : 1
      group.rotation.y += ((Math.sin(t * 0.7) * 0.5 * s + mouse.x * 0.45) - group.rotation.y) * 0.06
      group.rotation.x += ((mouse.y * 0.3 + Math.min(window.scrollY / 1500, 0.6)) - group.rotation.x) * 0.06
      group.position.y = Math.sin(t * 1.1) * 0.12 * s
      dust.rotation.y = t * 0.05 * s
      dust.position.y = Math.sin(t * 0.4) * 0.1 * s
      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [src])

  return <div ref={host} className="emblem" aria-hidden="true" />
}
