import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import '../../fonts/texture.css'
import '../../shared/shared.css'
import './style.css'
import '../../shared/buttons.css'
import { SCENES } from './scenes'
import { KINDS, loadScene, render, tile } from './texture'
import { Estimate, Footer, MobileBar, Reveal, Words, AREAS, REVIEW, ease } from '../../shared/ui'
import { Header } from '../../shared/header'
import logoSm from '../../img/logo-sq.jpg'
import kitchenA from '../../img/kitchen-after-sm.jpg'; import gdoorA from '../../img/gdoor-after-sm.jpg'; import doorA from '../../img/door-after-sm.jpg'; import stripeA from '../../img/stripe-after-sm.jpg'
import kitchenB from '../../img/kitchen-before-sm.jpg'; import gdoorB from '../../img/gdoor-before-sm.jpg'; import doorB from '../../img/door-before-sm.jpg'; import stripeB from '../../img/stripe-before-sm.jpg'
import owner from '../../img/owner-new.jpg'

// Colors sampled by eye from real JB'S jobs plus a few neutrals. Names describe the look, not a paint brand.
const PALETTE = [
  ['Deep navy', '#1f3563'], ['Garage-door green', '#46594f'], ['Charcoal', '#54535a'], ['Racing red', '#b01f2a'], ['Walnut stain', '#5b3720'], ['Stone neutral', '#b7ab98'], ['Bone white', '#ece8df'],
  ['Soft gray', '#9a9ca3'], ['Warm sand', '#cdb99a'], ['Sage', '#8a9a82'], ['Slate blue', '#5c7185'], ['Near black', '#1b1b1f'], ['Bright white', '#f7f7f4'], ['Clay', '#a9715a'],
]
const nameOf = (hex) => (PALETTE.find((p) => p[1].toLowerCase() === hex.toLowerCase()) || ['Custom'])[0]

const LINKS = [
  { label: 'Home', href: 'JBS-home.html', id: 'home' }, { label: 'Texture studio', href: '#top', id: 'texture' }, { label: 'Real jobs', href: '#real' }, { label: 'Estimate', href: '#estimate', cta: true },
]
const cache = new Map()
const getScene = (def) => { if (!cache.has(def.id)) cache.set(def.id, loadScene(def)); return cache.get(def.id) }
const LENS = 190, ZOOM = 2.6

/* The real photo. Only the wall changes; a magnifier shows the texture up close. */
function Stage({ def, kind, strength, color, compare }) {
  const wrap = useRef(null), cv = useRef(null), lens = useRef(null), sc = useRef(null), raf = useRef(0), pos = useRef(null)
  const [loaded, setLoaded] = useState(null) // id of the scene the canvas data belongs to
  const ready = loaded === def.id
  const [lensOn, setLensOn] = useState(false)
  const [touched, setTouched] = useState(false)
  const debug = typeof location !== 'undefined' && /[?&]mask/.test(location.search)

  const drawLens = useCallback(() => {
    const L = lens.current, s = sc.current, p = pos.current
    if (!L || !s || !p) return
    const r = wrap.current.getBoundingClientRect(), k = s.W / r.width, src = (LENS / ZOOM) * k, cx = L.getContext('2d')
    cx.clearRect(0, 0, L.width, L.height)
    cx.drawImage(cv.current, p.x * k - src / 2, p.y * k - src / 2, src, src, 0, 0, L.width, L.height)
  }, [])
  const draw = useCallback(() => {
    const s = sc.current; if (!s) return
    const c = cv.current; if (c.width !== s.W) { c.width = s.W; c.height = s.H }
    c.getContext('2d').putImageData(compare ? s.orig : render(s, { kind, strength, color, showMask: debug }), 0, 0)
    drawLens()
  }, [kind, strength, color, compare, debug, drawLens, loaded])

  useEffect(() => { let live = true; getScene(def).then((s) => { if (live) { sc.current = s; setLoaded(def.id) } }); return () => { live = false } }, [def])
  useEffect(() => { if (!ready) return; cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(draw) }, [draw, ready, def.id])

  const move = (e) => {
    const r = wrap.current.getBoundingClientRect()
    pos.current = { x: Math.min(r.width, Math.max(0, e.clientX - r.left)), y: Math.min(r.height, Math.max(0, e.clientY - r.top)) }
    setLensOn(true); setTouched(true)
    lens.current.parentElement.style.transform = `translate(${pos.current.x - LENS / 2}px, ${pos.current.y - LENS - 26}px)`
    drawLens()
  }
  return (
    <div className="stage" ref={wrap} style={{ aspectRatio: `${(sc.current?.W || 1100)} / ${(sc.current?.H || 826)}` }}
      onPointerMove={move} onPointerDown={move} onPointerLeave={(e) => e.pointerType === 'mouse' && setLensOn(false)} onPointerUp={(e) => e.pointerType !== 'mouse' && setLensOn(false)}>
      <canvas ref={cv} role="img" aria-label={`${def.alt}. Wall texture and color preview.`} />
      {!ready && <p className="stage__load">Loading the photo...</p>}
      <div className="lens" data-on={lensOn} aria-hidden="true"><canvas ref={lens} width={LENS * 2} height={LENS * 2} style={{ width: LENS, height: LENS }} /><i>{ZOOM}x</i></div>
      <AnimatePresence>{ready && !touched && <motion.span className="stage__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Move over the wall to look closer</motion.span>}</AnimatePresence>
      {compare && <span className="stage__tag">Original photo</span>}
    </div>
  )
}

function Tile({ kind }) {
  const ref = useRef(null)
  useEffect(() => { ref.current.getContext('2d').putImageData(tile(kind, 96), 0, 0) }, [kind])
  return <canvas ref={ref} width="96" height="96" aria-hidden="true" />
}

function Pair({ after, before, alt, altBefore }) {
  const [b, setB] = useState(false)
  return (
    <div className="pair">
      <AnimatePresence initial={false}><motion.img key={b ? 'b' : 'a'} src={b ? before : after} alt={b ? altBefore : alt} loading="lazy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} /></AnimatePresence>
      <div className="pair__seg" role="group" aria-label="Before or after"><button aria-pressed={b} onClick={() => { setB(true); sound.tick(0.8) }}>Before</button><button aria-pressed={!b} onClick={() => { setB(false); sound.tick(1.3) }}>After</button></div>
    </div>
  )
}


function Kit({ sceneId, setSceneId, kind, setKind, strength, setStrength, color, setColor, setCompare }) {
  const colorName = color ? nameOf(color) : 'Original color'
  return (
    <div className="kit">
      <div className="kit__row" role="tablist" aria-label="Choose a project photo">
        {SCENES.map((s) => (
          <button key={s.id} role="tab" aria-selected={sceneId === s.id} className="kit__scene" onClick={() => setSceneId(s.id)}>
            {sceneId === s.id && <motion.span layoutId="scenepill" className="kit__pill" transition={{ type: 'spring', stiffness: 460, damping: 36 }} />}
            <img src={s.thumb} alt="" /><span>{s.title}</span>
          </button>
        ))}
      </div>
      <fieldset className="kit__f"><legend>Wall texture</legend>
        <div className="kit__tex" role="radiogroup" aria-label="Wall texture">
          {KINDS.map((k) => (
            <motion.button key={k.id} type="button" role="radio" aria-checked={kind === k.id} className="kit__tile" whileTap={{ scale: 0.95 }} onClick={() => setKind(k.id)}>
              <Tile kind={k.id} /><span>{k.label}</span>
            </motion.button>
          ))}
        </div>
        <label className="kit__str">Texture depth<input type="range" min="15" max="100" value={Math.round(strength * 100)} disabled={kind === 'smooth'} onChange={(e) => setStrength(+e.target.value / 100)} style={{ '--v': `${((strength * 100 - 15) / 85) * 100}%` }} /></label>
      </fieldset>
      <fieldset className="kit__f"><legend>Wall color</legend>
        <div className="kit__sw" role="radiogroup" aria-label="Wall color">
          <button type="button" role="radio" aria-checked={!color} aria-label="Original color" className="kit__orig" onClick={() => setColor(null)}>Original</button>
          {PALETTE.map(([name, hex]) => <motion.button key={hex} type="button" role="radio" aria-checked={color === hex} aria-label={name} title={name} style={{ background: hex }} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={() => setColor(hex)} />)}
        </div>
      </fieldset>
      <p className="kit__now"><b>{KINDS.find((k) => k.id === kind).label}</b> &bull; {colorName}</p>
      <div className="hero__cta">
        <a className="btn" href="#estimate">Request this finish</a>
        <button type="button" className="btn btn--ghost" onPointerDown={() => setCompare(true)} onPointerUp={() => setCompare(false)} onPointerLeave={() => setCompare(false)} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setCompare(true)} onKeyUp={() => setCompare(false)}>Hold to see original</button>
      </div>
    </div>
  )
}

function App() {
  const [sceneId, setSceneId] = useState('gilbert')
  const [kind, setKind] = useState('knock')
  const [strength, setStrength] = useState(0.75)
  const [color, setColor] = useState(null)
  const [compare, setCompare] = useState(false)
  const def = SCENES.find((s) => s.id === sceneId)
  const summary = useMemo(() => `Wall texture: ${KINDS.find((k) => k.id === kind).label}. Wall color: ${color ? nameOf(color) : 'original'}. Photo: ${def.title}.`, [kind, color, def])
  useEffect(() => { document.documentElement.style.setProperty('--wall', color || '#b7ab98') }, [color])
  return (
    <>
      <Header logo={logoSm} current="texture" links={LINKS} />
      <main id="top">
        <section className="hero">
          <div className="hero__l">
            <Words as="h1" text="Feel the finish first." delay={0.1} />
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 }}>Pick a real project, choose a wall texture and color, then slide the magnifier over the wall to see it up close.</motion.p>
            <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.35 }}><Kit {...{ sceneId, setSceneId, kind, setKind, strength, setStrength, color, setColor, setCompare }} /></motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease, delay: 0.25 }}><Stage def={def} kind={kind} strength={strength} color={color} compare={compare} /></motion.div>
        </section>
        <p className="fine">Preview only. Textures are simulated on the photo and edges are approximate, so we always bring real samples to your wall.</p>

        <section className="real" id="real" aria-labelledby="real-t">
          <Reveal as="h2" id="real-t">The same finishes, on real walls.</Reveal>
          <div className="real__row">
            {[[kitchenA, kitchenB, 'Deep navy', 'Kitchen cabinets, Queen Creek', 'Kitchen cabinets painted deep navy', 'Oak kitchen cabinets before painting'], [gdoorA, gdoorB, 'Garage-door green', 'Garage doors, exterior', 'Garage doors painted deep green-gray on a stucco home', 'Tan garage doors before painting'], [doorA, doorB, 'Walnut stain', 'Front door refinish', 'A front door restained in rich brown', 'A weathered gray wood front door before'], [stripeA, stripeB, 'Racing red', 'Accent wall, interior', 'An accent wall with bold red and white stripes', 'A wall taped off for stripes']].map(([a, b, c, cap, alt, altB], i) => (
              <Reveal key={c} delay={i * 0.08} as="figure"><Pair after={a} before={b} alt={alt} altBefore={altB} /><figcaption><i style={{ background: PALETTE.find((p) => p[0] === c)[1] }} /><span><b>{c}</b>{cap}</span></figcaption></Reveal>
            ))}
          </div>
        </section>

        <section className="own" aria-labelledby="own-t">
          <Reveal className="own__ph"><img src={owner} alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy" /></Reveal>
          <div>
            <Reveal as="h2" id="own-t">Owner-operated<br />by Jonathan Bernal.</Reveal>
            <Reveal delay={0.1} as="p" className="own__p">Licensed and insured. Care and precision for homes and businesses across the East Valley, inside and out. Interior, exterior, cabinets, doors and commercial. Quality, precision, perfection.</Reveal>
            <Reveal delay={0.15} as="blockquote">&ldquo;{REVIEW.quote}&rdquo;<footer>{REVIEW.who}</footer></Reveal>
            <Reveal delay={0.2} as="p" className="own__areas">Serving {AREAS.join(', ')} and more.</Reveal>
          </div>
        </section>

        <Estimate title="Get a free estimate." lead="Tell us about the project and the finish you are picturing. Jonathan will get back to you.">
          <label className="full">Wall finish<input key={summary} name="color" defaultValue={summary} /></label>
        </Estimate>
      </main>
      <Footer /><MobileBar />
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
