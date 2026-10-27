import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useScroll, useTransform, useTime, useMotionValue, useSpring, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import '../../fonts/coats.css'
import '../../shared/shared.css'
import './style.css'
import { SoundToggle, useSound, Estimate, Footer, MobileBar, Reveal, CONTACT, SERVICES, AREAS, REVIEW, sound, ease } from '../../shared/ui'
import logoSm from '../../img/logo-sm.jpg'
import logo3d from '../../img/logo3d.jpg'
import stripeBefore from '../../img/stripe-before-sm.jpg'; import whB2 from '../../img/wh-b2-sm.jpg'; import whB4 from '../../img/wh-b4-sm.jpg'
import bathBefore from '../../img/bath-before-sm.jpg'; import lionProcess from '../../img/lion-process-sm.jpg'
import bathAfter from '../../img/bath-after-sm.jpg'; import doorAfter from '../../img/door-after-sm.jpg'; import tlAfter from '../../img/tl-after-sm.jpg'; import homeAfter from '../../img/home-after-sm.jpg'
import doorBefore from '../../img/door-before-sm.jpg'; import tlBefore from '../../img/tl-before-sm.jpg'; import homeBefore from '../../img/home-before-sm.jpg'
import whB1 from '../../img/wh-b1-sm.jpg'; import whB3 from '../../img/wh-b3-sm.jpg'
import whA1 from '../../img/wh-a1-sm.jpg'; import whA2 from '../../img/wh-a2-sm.jpg'; import whA3 from '../../img/wh-a3-sm.jpg'; import whA4 from '../../img/wh-a4-sm.jpg'
import owner from '../../img/owner-sm.jpg'

const clamp01 = (v) => Math.min(1, Math.max(0, v))

/* A wavy coat edge with drips, as a clip path in bounding-box units. p = how far this coat has risen. */
const DRIPS = [[0.12, 0.016, 0.1], [0.31, 0.022, 0.17], [0.47, 0.014, 0.08], [0.66, 0.02, 0.15], [0.83, 0.016, 0.11], [0.94, 0.012, 0.07]]
function edgeY(x, p, t) {
  const base = 1.1 - p * 1.32, amp = Math.sin(p * Math.PI)
  let y = base + 0.028 * Math.sin(x * 7 + t) * (0.3 + amp) + 0.01 * Math.sin(x * 17 - t * 1.4) * amp
  for (const [xc, w, len] of DRIPS) y += len * amp * Math.exp(-(((x - xc) / w) ** 2)) * (0.75 + 0.25 * Math.sin(t + xc * 20))
  return y
}
function wave(p, t, edgeOnly = false) {
  const N = 110
  let d = ''
  for (let i = 0; i <= N; i++) { const x = i / N; d += `${i ? 'L' : 'M'}${x.toFixed(4)},${edgeY(x, p, t).toFixed(4)}` }
  return edgeOnly ? d : `${d}L1,1.3L0,1.3Z`
}

function Blobs({ mx, my }) {
  const reduce = useReducedMotion()
  const time = useTime()
  const cfg = [[46, 90, 16], [34, 64, 14], [26, 46, 13], [20, 32, 12], [15, 24, 11], [11, 18, 10], [8, 14, 9]]
  return (
    <svg className="hero__blobs" aria-hidden="true">
      <defs>
        <filter id="goo"><feGaussianBlur stdDeviation="11" /><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10" /></filter>
        <radialGradient id="chrome" cx=".32" cy=".28" r=".85"><stop offset="0" stopColor="#ffffff" /><stop offset=".18" stopColor="#dfe6f3" /><stop offset=".5" stopColor="#8ea1c4" /><stop offset=".82" stopColor="#2f4f9e" /><stop offset="1" stopColor="#0d1c4a" /></radialGradient>
      </defs>
      <g filter="url(#goo)" fill="url(#chrome)">
        {cfg.map(([r, k, d], i) => <Blob key={i} r={r} k={k} d={d} i={i} mx={mx} my={my} time={time} reduce={reduce} />)}
      </g>
    </svg>
  )
}
function Blob({ r, k, d, i, mx, my, time, reduce }) {
  const sx = useSpring(mx, { stiffness: 140 - i * 18, damping: d + 6, mass: 0.8 + i * 0.15 })
  const sy = useSpring(my, { stiffness: 140 - i * 18, damping: d + 6, mass: 0.8 + i * 0.15 })
  const ox = useTransform(time, (t) => (reduce ? 0 : Math.cos(t / (900 + i * 350) + i * 2) * (20 + i * 10)))
  const oy = useTransform(time, (t) => (reduce ? 0 : Math.sin(t / (1100 + i * 300) + i) * (16 + i * 9)))
  const cx = useTransform([sx, ox], ([a, b]) => a + b), cy = useTransform([sy, oy], ([a, b]) => a + b)
  return <motion.circle cx={cx} cy={cy} r={r} />
}

function Hero() {
  const ref = useRef(null)
  const mx = useMotionValue(0), my = useMotionValue(0)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  const last = useRef(0)
  useEffect(() => { const r = ref.current.getBoundingClientRect(); mx.set(r.width * 0.5); my.set(r.height * 0.4) }, [mx, my])
  const move = (e) => {
    const r = ref.current.getBoundingClientRect(); mx.set(e.clientX - r.left); my.set(e.clientY - r.top)
    const now = performance.now(); if (now - last.current > 420) { last.current = now; sound.drip() }
  }
  return (
    <section className="hero" ref={ref} onPointerMove={move} onPointerDown={move}>
      <Blobs mx={mx} my={my} />
      <motion.img className="hero__logo" src={logo3d} alt="JB'S Pro Painters LLC logo: silver lettering, blue roof outline and a paintbrush swoosh on deep navy" style={{ scale: logoScale }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.4, ease }} />
      <div className="hero__txt">
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.2 }}>Primer. Base. Finish.</motion.h1>
        <motion.div className="hero__side" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.45 }}>
          <p>Interior and exterior painting for homes and businesses across the East Valley. Scroll to watch a job go on, coat by coat.</p>
          <a className="btn" href="#estimate">Get a free estimate</a>
        </motion.div>
      </div>
    </section>
  )
}

function Print({ src, alt, p, range, rot = 0, className = '', tag, before, beforeAlt }) {
  const y = useTransform(p, [0, 1], range)
  return (
    <motion.figure className={`print ${className}`} style={{ y, rotate: rot }}>
      <img src={src} alt={alt} loading="lazy" />
      {tag && <figcaption className="print__tag">{tag}</figcaption>}
      {before && <span className="print__before"><img src={before} alt={beforeAlt} loading="lazy" /><i>Before</i></span>}
    </motion.figure>
  )
}

function Coats() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const time = useTime()
  const d1 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.2) / 0.3), reduce ? 0 : t / 1400))
  const d2 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.55) / 0.3), reduce ? 0 : t / 1400))
  const e1 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.2) / 0.3), reduce ? 0 : t / 1400, true))
  const e2 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.55) / 0.3), reduce ? 0 : t / 1400, true))
  const t1 = useTransform(p, [0.14, 0.32], [1, 0]), t2 = useTransform(p, [0.5, 0.68], [1, 0])
  const [at, setAt] = useState(0)
  const seen = useRef(0)
  useMotionValueEvent(p, 'change', (v) => {
    const i = v > 0.62 ? 2 : v > 0.3 ? 1 : 0
    if (i !== seen.current) { seen.current = i; setAt(i); sound.whoosh(true, 0.9); setTimeout(() => sound.drip(), 350) }
    sound.intensity(v)
  })
  return (
    <section className="coats" ref={ref} aria-label="The three coats of a job">
      <div className="coats__stick">
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs>
          <clipPath id="cp1" clipPathUnits="objectBoundingBox"><motion.path d={d1} /></clipPath>
          <clipPath id="cp2" clipPathUnits="objectBoundingBox"><motion.path d={d2} /></clipPath>
        </defs></svg>

        <div className="coat coat--1">
          <motion.div className="coat__txt" style={{ opacity: t1 }}><h2>Primer.</h2><p>Floors masked, edges taped, surfaces patched and primed before any color goes on.</p></motion.div>
          <div className="coat__prints">
            <Print src={stripeBefore} alt="A bedroom wall taped off with blue painter's tape for stripes" p={p} range={[20, -50]} rot={-2} className="a" tag="Taped off" />
            <Print src={whB2} alt="A raw gray warehouse wall with the floor masked in paper and tape" p={p} range={[60, -80]} rot={1.5} className="b" tag="Masked" />
            <Print src={whB4} alt="A tall gray warehouse wall and door, masked before painting" p={p} range={[0, -30]} rot={-1} className="c" tag="Masked" />
          </div>
        </div>
        <div className="coat coat--2" style={{ clipPath: 'url(#cp1)' }}>
          <motion.div className="coat__txt" style={{ opacity: t2 }}><h2>Base.</h2><p>Edges cut in by hand, then the first color goes on.</p></motion.div>
          <div className="coat__prints coat__prints--2">
            <Print src={bathBefore} alt="A bathroom with deep green cut in along the trim and ceiling, walls still cream" p={p} range={[80, -40]} rot={1.5} className="a" tag="Cut in" />
            <Print src={lionProcess} alt="A restaurant exterior partway through repainting" p={p} range={[20, -70]} rot={-1.5} className="b" tag="Mid-job" />
          </div>
        </div>
        <div className="coat coat--3" style={{ clipPath: 'url(#cp2)' }}>
          <div className="coat__txt"><h2>Finish.</h2><p>The last coat, the clean lines, the result.</p><a className="btn btn--ink" href="#estimate">Get a free estimate</a></div>
          <div className="coat__prints coat__prints--3">
            <Print src={bathAfter} alt="The finished bathroom in deep green" p={p} range={[90, -30]} rot={-1} className="a" tag="Finished" before={bathBefore} beforeAlt="The same bathroom with deep green cut in and the walls still cream" />
            <Print src={doorAfter} alt="A front door restained in rich brown" p={p} range={[40, -60]} rot={1} className="b" tag="Finished" before={doorBefore} beforeAlt="The same front door, weathered gray wood" />
            <Print src={tlAfter} alt="A restaurant exterior finished in white with black trim" p={p} range={[110, -20]} rot={-1.5} className="c" tag="Finished" before={tlBefore} beforeAlt="The same restaurant exterior before repainting" />
            <Print src={homeAfter} alt="A Gilbert home finished in neutral tones" p={p} range={[10, -50]} rot={1.5} className="d" tag="Finished" before={homeBefore} beforeAlt="The same Gilbert home in orange stucco before repainting" />
          </div>
        </div>
        <svg className="edge" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><motion.path d={e1} className="edge__hi" /></svg>
        <svg className="edge" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true"><motion.path d={e2} className="edge__hi" /></svg>
        <ol className="coats__nav" data-at={at} aria-label="Progress">
          {['Primer', 'Base', 'Finish'].map((n, i) => <li key={n} data-on={at >= i} data-now={at === i}><i />{n}</li>)}
        </ol>
      </div>
    </section>
  )
}

function Services() {
  const [open, setOpen] = useState(0)
  return (
    <section className="svc" aria-labelledby="svc-t">
      <Reveal as="h2" id="svc-t" className="svc__h">What goes on the wall.</Reveal>
      <div className="svc__list">
        {SERVICES.map(([name, text], i) => (
          <div key={name} className="svc__item" data-open={open === i}>
            <h3><button type="button" aria-expanded={open === i} onClick={() => { setOpen(open === i ? -1 : i); sound.pop() }}><span>{name}</span><motion.i animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.3, ease }} aria-hidden="true">+</motion.i></button></h3>
            <AnimatePresence initial={false}>{open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease }}>{text}</motion.p>}</AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}

function Strip() {
  const wrap = useRef(null), inner = useRef(null)
  const [lim, setLim] = useState(0)
  useEffect(() => { const f = () => setLim(Math.max(0, inner.current.scrollWidth - wrap.current.clientWidth)); f(); addEventListener('resize', f); return () => removeEventListener('resize', f) }, [])
  const items = [[whB1, 'Raw concrete warehouse wall with the floor masked', 1], [whB2, 'Gray warehouse wall with pipes, masked for painting', 1], [whB3, 'A long raw concrete warehouse wall', 1], [whB4, 'A tall gray wall and door masked for painting', 1], [whA1, 'Warehouse interior with white walls and yellow-banded columns'], [whA2, 'A long warehouse wall painted clean white'], [whA3, 'Dock doors and walls painted white'], [whA4, 'A warehouse with white walls and finished columns']]
  return (
    <section className="strip" aria-labelledby="strip-t">
      <div className="strip__head"><Reveal as="h2" id="strip-t">Raw to ready,<br />by the wall.</Reveal><p>A warehouse, start to finish. Drag along the strip.</p></div>
      <div className="strip__wrap" ref={wrap}>
        <motion.div className="strip__in" ref={inner} drag="x" dragConstraints={{ left: -lim, right: 0 }} dragElastic={0.12} whileTap={{ cursor: 'grabbing' }} onDragStart={() => sound.scrape()}>
          {items.map(([s, a, raw], i) => <figure key={i} className={raw ? 'raw' : ''}><img src={s} alt={a} loading="lazy" draggable={false} /><figcaption>{raw ? 'Raw' : 'Ready'}</figcaption></figure>)}
        </motion.div>
      </div>
    </section>
  )
}

function App() {
  const [on, toggle] = useSound('coats')
  return (
    <>
      <SoundToggle on={on} toggle={toggle} />
      <header className="top"><a href="#top" aria-label="JB'S Pro Painters LLC"><img src={logoSm} alt="JB'S Pro Painters LLC logo" width="46" height="46" /></a><a className="top__tel" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></header>
      <main id="top">
        <Hero />
        <Coats />
        <Services />
        <Strip />
        <section className="own" aria-labelledby="own-t">
          <Reveal className="own__ph"><img src={owner} alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy" /><span>Placeholder photo</span></Reveal>
          <div>
            <Reveal as="h2" id="own-t">Owner-operated by Jonathan Bernal.</Reveal>
            <Reveal delay={0.1} as="p" className="own__p">Jonathan Bernal brings care and precision to homes and businesses across the East Valley, inside and out. Licensed and insured. Quality, precision, perfection.</Reveal>
            <Reveal delay={0.15} as="blockquote">&ldquo;{REVIEW.quote}&rdquo;<footer>{REVIEW.who}</footer></Reveal>
            <Reveal delay={0.2} as="p" className="own__areas">Serving {AREAS.join(', ')} and more.</Reveal>
          </div>
        </section>
        <Estimate title="Get a free estimate." lead="Tell us about the project. Jonathan will get back to you." />
      </main>
      <Footer /><MobileBar />
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
