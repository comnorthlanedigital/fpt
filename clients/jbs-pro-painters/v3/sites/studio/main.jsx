import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import '../../fonts/studio.css'
import '../../shared/shared.css'
import './style.css'
import { createHouse } from './house'
import { Estimate, Footer, MobileBar, Reveal, CONTACT, AREAS, REVIEW, sound, ease } from '../../shared/ui'
import { Header } from '../../shared/header'
import logoSm from '../../img/logo-sm.jpg'
import kitchenA from '../../img/kitchen-after-sm.jpg'; import gdoorA from '../../img/gdoor-after-sm.jpg'; import doorA from '../../img/door-after-sm.jpg'; import stripeA from '../../img/stripe-after-sm.jpg'; import homeA from '../../img/home-after.jpg'
import kitchenB from '../../img/kitchen-before-sm.jpg'; import gdoorB from '../../img/gdoor-before-sm.jpg'; import doorB from '../../img/door-before-sm.jpg'; import stripeB from '../../img/stripe-before-sm.jpg'
import owner from '../../img/owner-sm.jpg'

// Colors sampled by eye from real JB'S jobs plus a few neutrals. Names describe the look, not a paint brand.
const PALETTE = [
  ['Deep navy', '#1f3563'], ['Garage-door green', '#46594f'], ['Charcoal', '#54535a'], ['Racing red', '#b01f2a'], ['Walnut stain', '#5b3720'], ['Stone neutral', '#b7ab98'], ['Bone white', '#ece8df'],
  ['Soft gray', '#9a9ca3'], ['Warm sand', '#cdb99a'], ['Sage', '#8a9a82'], ['Slate blue', '#5c7185'], ['Near black', '#1b1b1f'], ['Bright white', '#f7f7f4'], ['Clay', '#a9715a'],
]
const LINKS = [
  { label: 'Home', href: 'JBS-home.html', id: 'home' }, { label: 'Color studio', href: '#top', id: 'studio' }, { label: 'Real colors', href: '#real' }, { label: 'Estimate', href: '#estimate', cta: true },
]
const ZONES = [['walls', 'Walls'], ['trim', 'Trim'], ['garage', 'Garage door'], ['door', 'Front door']]
const PRESETS = [
  ['Neutral and brown', { walls: '#b7ab98', trim: '#ece8df', garage: '#5b3720', door: '#5b3720' }],
  ['Deep green doors', { walls: '#d6cfbf', trim: '#f7f7f4', garage: '#46594f', door: '#46594f' }],
  ['Charcoal and red', { walls: '#54535a', trim: '#ece8df', garage: '#1b1b1f', door: '#b01f2a' }],
]
const START = { walls: '#b7ab98', trim: '#ece8df', garage: '#46594f', door: '#5b3720' }
const nameOf = (hex) => (PALETTE.find((p) => p[1].toLowerCase() === hex.toLowerCase()) || ['Custom'])[0]
const NOTES = [60, 62, 64, 67, 69, 72, 74]

function Stage({ house, setHouse, colors }) {
  const wrap = useRef(null), cv = useRef(null)
  const reduce = useReducedMotion()
  const [gl, setGl] = useState(true)
  const [touched, setTouched] = useState(false)
  useEffect(() => {
    let h
    try { h = createHouse(cv.current, colors) } catch (e) { setGl(false); return }
    setHouse(h)
    h.setAuto(!reduce)
    const ro = new ResizeObserver(() => h.resize(wrap.current.clientWidth, wrap.current.clientHeight)); ro.observe(wrap.current)
    h.resize(wrap.current.clientWidth, wrap.current.clientHeight)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? h.start() : h.stop()), { threshold: 0.05 }); io.observe(wrap.current)
    return () => { ro.disconnect(); io.disconnect(); h.dispose() }
    // eslint-disable-next-line
  }, [])
  const pt = useRef(null)
  const down = (e) => { pt.current = { x: e.clientX, y: e.clientY }; e.currentTarget.setPointerCapture(e.pointerId); setTouched(true); sound.whoosh(true, 0.4) }
  const move = (e) => { if (!pt.current || !house) return; house.drag(e.clientX - pt.current.x, e.clientY - pt.current.y); pt.current = { x: e.clientX, y: e.clientY } }
  const up = () => { pt.current = null }
  return (
    <div className="stage" ref={wrap} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={(e) => { house?.zoom(e.deltaY * 0.01) }}>
      {gl ? <canvas ref={cv} role="img" aria-label="A 3D illustration of a stucco house you can spin and recolor" /> : <img className="stage__fallback" src={homeA} alt="A finished Gilbert home by JB'S Pro Painters" />}
      {!gl && <p className="stage__nogl">3D preview needs WebGL. Showing a real finished home instead.</p>}
      <AnimatePresence>{gl && !touched && <motion.span className="stage__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Drag to spin the house</motion.span>}</AnimatePresence>
      {gl && <div className="stage__zoom" onPointerDown={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Zoom in" onClick={() => house?.zoom(-3)}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button>
        <button type="button" aria-label="Zoom out" onClick={() => house?.zoom(3)}><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button></div>}
    </div>
  )
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

function Studio({ colors, setColors, house }) {
  const [zone, setZone] = useState('walls')
  const apply = (z, hex, i) => { setColors((c) => ({ ...c, [z]: hex })); house?.setColor(z, hex); sound.pluck(NOTES[(i ?? 0) % NOTES.length] + 0) }
  const preset = (p) => { setColors(p); Object.entries(p).forEach(([z, hex]) => house?.setColor(z, hex)); sound.chime(79) }
  return (
    <div className="kit">
      <div className="kit__zones" role="tablist" aria-label="What to paint">
        {ZONES.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={zone === id} onClick={() => { setZone(id); sound.tick(1.1) }}>
            {zone === id && <motion.span layoutId="zonepill" className="kit__pill" transition={{ type: 'spring', stiffness: 460, damping: 36 }} />}
            <i style={{ background: colors[id] }} /><span>{label}</span>
          </button>
        ))}
      </div>
      <div className="kit__sw" role="radiogroup" aria-label={`Color for ${ZONES.find((z) => z[0] === zone)[1]}`}>
        {PALETTE.map(([name, hex], i) => (
          <motion.button key={hex} type="button" role="radio" aria-checked={colors[zone].toLowerCase() === hex.toLowerCase()} aria-label={name} title={name} style={{ background: hex }} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={() => apply(zone, hex, i)} />
        ))}
      </div>
      <p className="kit__now"><b>{ZONES.find((z) => z[0] === zone)[1]}:</b> {nameOf(colors[zone])}</p>
      <div className="kit__pre"><span>Starter schemes</span>{PRESETS.map(([n, p]) => <button key={n} type="button" onClick={() => preset(p)}>{n}</button>)}</div>
    </div>
  )
}

function App() {
  const [colors, setColors] = useState(START)
  const [house, setHouse] = useState(null)
  const summary = useMemo(() => ZONES.map(([id, l]) => `${l}: ${nameOf(colors[id])}`).join(', '), [colors])
  useEffect(() => { document.documentElement.style.setProperty('--wall', colors.walls) }, [colors.walls])
  return (
    <>
      <Header logo={logoSm} current="studio" links={LINKS} />
      <main id="top">
        <section className="hero">
          <div className="hero__l">
            <motion.h1 initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>Try the color first.</motion.h1>
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.15 }}>Spin a house, then repaint the walls, trim and doors with colors from real JB&rsquo;S jobs.</motion.p>
            <Studio colors={colors} setColors={setColors} house={house} />
            <div className="hero__cta"><a className="btn" href="#estimate" onClick={() => sound.chime(81)}>Request this scheme</a><span>Free estimate. No obligation to book.</span></div>
          </div>
          <Stage house={house} setHouse={setHouse} colors={START} />
        </section>
        <p className="fine">3D illustration only. Real paint looks different outdoors, so we always bring samples.</p>

        <section className="real" id="real" aria-labelledby="real-t">
          <Reveal as="h2" id="real-t">The same colors, on real walls.</Reveal>
          <div className="real__row">
            {[[kitchenA, kitchenB, 'Deep navy', 'Kitchen cabinets, Queen Creek', 'Kitchen cabinets painted deep navy', 'Oak kitchen cabinets before painting'], [gdoorA, gdoorB, 'Garage-door green', 'Garage doors, exterior', 'Garage doors painted deep green-gray on a stucco home', 'Tan garage doors before painting'], [doorA, doorB, 'Walnut stain', 'Front door refinish', 'A front door restained in rich brown', 'A weathered gray wood front door before'], [stripeA, stripeB, 'Racing red', 'Accent wall, interior', 'An accent wall with bold red and white stripes', 'A wall taped off for stripes']].map(([a, b, c, cap, alt, altB], i) => (
              <Reveal key={c} delay={i * 0.08} as="figure"><Pair after={a} before={b} alt={alt} altBefore={altB} /><figcaption><i style={{ background: PALETTE.find((p) => p[0] === c)[1] }} /><span><b>{c}</b>{cap}</span></figcaption></Reveal>
            ))}
          </div>
        </section>

        <section className="own" aria-labelledby="own-t">
          <Reveal className="own__ph"><img src={owner} alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy" /><span>Placeholder photo</span></Reveal>
          <div>
            <Reveal as="h2" id="own-t">Owner-operated<br />by Jonathan Bernal.</Reveal>
            <Reveal delay={0.1} as="p" className="own__p">Licensed and insured. Care and precision for homes and businesses across the East Valley, inside and out. Interior, exterior, cabinets, doors and commercial. Quality, precision, perfection.</Reveal>
            <Reveal delay={0.15} as="blockquote">&ldquo;{REVIEW.quote}&rdquo;<footer>{REVIEW.who}</footer></Reveal>
            <Reveal delay={0.2} as="p" className="own__areas">Serving {AREAS.join(', ')} and more.</Reveal>
          </div>
        </section>

        <Estimate title="Get a free estimate." lead="Tell us about the project and the colors you are picturing. Jonathan will get back to you.">
          <label className="full">Color scheme<input key={summary} name="color" defaultValue={summary} /></label>
        </Estimate>
      </main>
      <Footer /><MobileBar />
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
