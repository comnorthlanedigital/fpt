import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity, animate, useReducedMotion, useInView, useScroll, useTime, useMotionValueEvent } from 'framer-motion'
import '../../fonts/home.css'
import '../../shared/shared.css'
import './style.css'
import '../../shared/buttons.css'
import { Estimate, Footer, MobileBar, Reveal, Words, CONTACT, SERVICES, AREAS, REVIEW, sound, ease } from '../../shared/ui'
import { Header } from '../../shared/header'
import logoSm from '../../img/logo-sq.jpg'
import logo3d from '../../img/logo3d.jpg'
import stripeBeforeSm from '../../img/stripe-before-sm.jpg'; import whB2 from '../../img/wh-b2-sm.jpg'; import whB4 from '../../img/wh-b4-sm.jpg'
import bathBeforeSm from '../../img/bath-before-sm.jpg'; import lionProcess from '../../img/lion-process-sm.jpg'
import bathAfterSm from '../../img/bath-after-sm.jpg'; import doorAfterSm from '../../img/door-after-sm.jpg'; import tlAfterSm from '../../img/tl-after-sm.jpg'; import homeAfterSm from '../../img/home-after-sm.jpg'
import doorBeforeSm from '../../img/door-before-sm.jpg'; import tlBeforeSm from '../../img/tl-before-sm.jpg'; import homeBeforeSm from '../../img/home-before-sm.jpg'
import homeBefore from '../../img/home-before.jpg'; import homeAfter from '../../img/home-after.jpg'; import homeSm from '../../img/home-after-sm.jpg'
import kitchenBefore from '../../img/kitchen-before.jpg'; import kitchenAfter from '../../img/kitchen-after.jpg'; import kitchenSm from '../../img/kitchen-after-sm.jpg'
import doorBefore from '../../img/door-before.jpg'; import doorAfter from '../../img/door-after.jpg'; import doorSm from '../../img/door-after-sm.jpg'
import bathBefore from '../../img/bath-before.jpg'; import bathAfter from '../../img/bath-after.jpg'; import bathSm from '../../img/bath-after-sm.jpg'
import gdoorBefore from '../../img/gdoor-before.jpg'; import gdoorAfter from '../../img/gdoor-after.jpg'; import gdoorSm from '../../img/gdoor-after-sm.jpg'
import tlBefore from '../../img/tl-before.jpg'; import tlAfter from '../../img/tl-after.jpg'; import tlSm from '../../img/tl-after-sm.jpg'
import stripeBefore from '../../img/stripe-before.jpg'; import stripeAfter from '../../img/stripe-after.jpg'; import stripeSm from '../../img/stripe-after-sm.jpg'
import owner from '../../img/owner-new.jpg'

const LINKS = [
  { label: 'Work', href: '#work' }, { label: 'Process', href: '#process' }, { label: 'Services', href: '#services' }, { label: 'About', href: '#about' }, { label: 'Estimate', href: '#estimate', cta: true },
]
const JOBS = [
  { id: 'bath', title: 'Bathroom', place: 'Interior', before: bathBefore, after: bathAfter, thumb: bathSm },
  { id: 'home', title: 'Exterior repaint', place: 'Gilbert', before: homeBefore, after: homeAfter, thumb: homeSm },
  { id: 'kitchen', title: 'Cabinet refinish', place: 'Queen Creek', before: kitchenBefore, after: kitchenAfter, thumb: kitchenSm },
  { id: 'door', title: 'Front door stain', place: 'Wood refinish', before: doorBefore, after: doorAfter, thumb: doorSm },
  { id: 'gdoor', title: 'Garage doors', place: 'Exterior', before: gdoorBefore, after: gdoorAfter, thumb: gdoorSm },
  { id: 'tl', title: 'Restaurant exterior', place: 'Commercial, Gilbert', before: tlBefore, after: tlAfter, thumb: tlSm },
]
const ROLL_H = 64
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const loadImg = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = src })

function drawCover(c, img, W, H) {
  const s = Math.max(W / img.width, H / img.height), w = img.width * s, h = img.height * s
  c.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
}

/* The signature moment: the finished photo only exists where the roller has been. */
function RollStage({ job, autoStart = false, hero = false }) {
  const reduce = useReducedMotion()
  const wrap = useRef(null), cv = useRef(null), mask = useRef(null), tiny = useRef(null), after = useRef(null), edge = useRef(null)
  const last = useRef(null), stamps = useRef(0), dpr = useRef(1), lastCalc = useRef(0)
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)
  const [touched, setTouched] = useState(false)
  const [busy, setBusy] = useState(false)
  const x = useMotionValue(-300), y = useMotionValue(-300)
  const sx = useSpring(x, { stiffness: 700, damping: 45, mass: 0.35 }), sy = useSpring(y, { stiffness: 700, damping: 45, mass: 0.35 })
  const vx = useVelocity(sx)
  const rot = useSpring(useTransform(vx, [-1600, 1600], [-9, 9]), { stiffness: 200, damping: 20 })
  const inView = useInView(wrap, { once: true, amount: 0.55 })
  const rollW = () => clamp(wrap.current.clientWidth * 0.2, 104, 230)

  const redraw = useCallback(() => {
    const c = cv.current?.getContext('2d'); if (!c || !after.current) return
    const W = cv.current.width, H = cv.current.height
    c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, W, H)
    c.drawImage(mask.current, 0, 0)
    c.globalCompositeOperation = 'source-in'; drawCover(c, after.current, W, H)
    c.globalCompositeOperation = 'source-over'
    // wet edge: a thin sheen on the lit side of the paint front and a soft lap shadow on the other
    const e = edge.current, ex = e.getContext('2d'), d = dpr.current * 3
    if (e.width !== W || e.height !== H) { e.width = W; e.height = H }
    ex.globalCompositeOperation = 'source-over'; ex.clearRect(0, 0, W, H)
    ex.drawImage(mask.current, 0, 0); ex.globalCompositeOperation = 'destination-out'; ex.drawImage(mask.current, d, d)
    ex.globalCompositeOperation = 'source-in'; ex.fillStyle = '#fff'; ex.fillRect(0, 0, W, H)
    c.globalAlpha = 0.55; c.drawImage(e, 0, 0); c.globalAlpha = 1
    ex.globalCompositeOperation = 'source-over'; ex.clearRect(0, 0, W, H)
    ex.drawImage(mask.current, 0, 0); ex.globalCompositeOperation = 'destination-out'; ex.drawImage(mask.current, -d, -d)
    ex.globalCompositeOperation = 'source-in'; ex.fillStyle = '#0a1433'; ex.fillRect(0, 0, W, H)
    c.globalAlpha = 0.32; c.drawImage(e, 0, 0); c.globalAlpha = 1
  }, [])

  const fit = useCallback(() => {
    const el = wrap.current; if (!el) return
    const d = (dpr.current = Math.min(2, window.devicePixelRatio || 1))
    const W = Math.round(el.clientWidth * d), H = Math.round(el.clientHeight * d)
    if (cv.current.width === W && cv.current.height === H) return
    const old = document.createElement('canvas'); old.width = mask.current.width || 1; old.height = mask.current.height || 1
    old.getContext('2d').drawImage(mask.current, 0, 0)
    cv.current.width = mask.current.width = W; cv.current.height = mask.current.height = H
    if (old.width > 1) mask.current.getContext('2d').drawImage(old, 0, 0, W, H)
    redraw()
  }, [redraw])

  useEffect(() => {
    mask.current = document.createElement('canvas'); edge.current = document.createElement('canvas'); tiny.current = document.createElement('canvas'); tiny.current.width = 40; tiny.current.height = 25
    fit()
    const ro = new ResizeObserver(fit); ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [fit])

  useEffect(() => { let live = true; loadImg(job.after).then((i) => { if (live) { after.current = i; redraw() } }); return () => { live = false } }, [job, redraw])

  // idle roller parked mid-wall, bobbing, until the visitor takes over
  useEffect(() => {
    if (touched || done || busy) return
    const r = wrap.current.getBoundingClientRect()
    x.set(r.width * 0.5); y.set(r.height * 0.58)
    if (reduce) return
    const a = animate(y, [r.height * 0.58, r.height * 0.52, r.height * 0.58], { duration: 2.6, repeat: Infinity, ease: 'easeInOut' })
    return () => a.stop()
  }, [touched, done, busy, reduce, x, y])

  const coverage = useCallback((force) => {
    const now = performance.now(); if (!force && now - lastCalc.current < 140) return
    lastCalc.current = now
    const t = tiny.current.getContext('2d', { willReadFrequently: true }); t.clearRect(0, 0, 40, 25); t.drawImage(mask.current, 0, 0, 40, 25)
    const d = t.getImageData(0, 0, 40, 25).data; let n = 0
    for (let i = 3; i < d.length; i += 4) if (d[i] > 110) n++
    const p = n / 1000; setPct(p); return p
  }, [])

  const finish = useCallback(() => {
    setDone(true); setPct(1); sound.roll(0); sound.chime(81)
    animate(y, wrap.current.clientHeight + 160, { duration: 0.7, ease })
  }, [y])

  const stampTo = (px, py) => {
    const m = mask.current.getContext('2d'), d = dpr.current, w = rollW() * d, h = ROLL_H * d
    const from = last.current || { x: px, y: py }
    const dist = Math.hypot(px - from.x, py - from.y), steps = Math.max(1, Math.ceil(dist / 8))
    m.fillStyle = '#000'
    for (let i = 1; i <= steps; i++) {
      const cx = (from.x + ((px - from.x) * i) / steps) * d, cy = (from.y + ((py - from.y) * i) / steps) * d
      m.beginPath(); m.roundRect(cx - w / 2, cy - h / 2, w, h, 10 * d); m.fill()
    }
    last.current = { x: px, y: py }
    redraw()
    if (++stamps.current % 6 === 0) { const p = coverage(); if (p > 0.74 && !done) finish() }
  }

  const point = (e) => { const r = wrap.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const down = useRef(false), t0 = useRef(0)
  const onDown = (e) => {
    if (done || busy) return
    e.currentTarget.setPointerCapture(e.pointerId); down.current = true; setTouched(true)
    const p = point(e); x.set(p.x); y.set(p.y); last.current = null; t0.current = performance.now(); stampTo(p.x, p.y)
  }
  const onMove = (e) => {
    if (!down.current || done) return
    const p = point(e), dt = Math.max(8, performance.now() - t0.current); t0.current = performance.now()
    const lp = last.current || p, speed = Math.hypot(p.x - lp.x, p.y - lp.y) / dt
    sound.roll(clamp(speed / 1.4, 0, 1))
    const py = clamp(p.y, ROLL_H, wrap.current.clientHeight - 16)
    x.set(p.x); y.set(py); stampTo(p.x, py)
  }
  const onUp = () => { down.current = false; last.current = null; sound.roll(0); const p = coverage(true); if (p > 0.74 && !done) finish() }

  const auto = useCallback(async () => {
    if (busy || done) return
    setBusy(true); setTouched(true)
    const el = wrap.current, W = el.clientWidth, H = el.clientHeight, w = rollW()
    if (reduce) { const m = mask.current.getContext('2d'); m.fillRect(0, 0, mask.current.width, mask.current.height); redraw(); setBusy(false); finish(); return }
    const cols = Math.ceil(W / (w * 0.8)); let up = false
    x.set(w / 2); y.set(-ROLL_H); last.current = null
    for (let c = 0; c < cols; c++) {
      const cx = Math.min(W - w / 2, w / 2 + c * w * 0.8)
      if (c) await animate(x, cx, { duration: 0.28, ease: 'easeInOut', onUpdate: (v) => stampTo(v, y.get()) })
      sound.roll(0.55, 0.9)
      await animate(y, up ? -ROLL_H / 2 : H + ROLL_H / 2, { duration: 0.85, ease: 'easeInOut', onUpdate: (v) => stampTo(x.get(), v) })
      up = !up
    }
    sound.roll(0); last.current = null
    const m = mask.current.getContext('2d'); m.fillRect(0, 0, mask.current.width, mask.current.height); redraw()
    setBusy(false); finish()
  }, [busy, done, reduce, finish, redraw, x, y])

  useEffect(() => { if (autoStart && inView) { const t = setTimeout(auto, 500); return () => clearTimeout(t) } }, [autoStart, inView, auto])

  const reset = () => {
    mask.current.getContext('2d').clearRect(0, 0, mask.current.width, mask.current.height); redraw()
    setDone(false); setPct(0); setTouched(false); last.current = null; stamps.current = 0; sound.whoosh(false, 0.5)
  }

  return (
    <div className={`stage${hero ? ' stage--hero' : ''}`}>
      <div ref={wrap} className="stage__wall" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} data-done={done}>
        <img className="stage__img" src={job.before} alt={`${job.title}, before painting`} draggable={false} />
        <canvas ref={cv} className="stage__cv" role="img" aria-label={`${job.title}, finished, revealed where you roll`} />
        <motion.img className="stage__full" src={job.after} alt="" aria-hidden="true" draggable={false} initial={false} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: 0.9, ease }} />
        <motion.div className="roller" style={{ x: sx, y: sy, rotate: rot, width: 'var(--rw)' }} aria-hidden="true">
          <svg viewBox="0 0 240 150" width="100%"><defs><linearGradient id="rg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#3b63d6" /><stop offset=".45" stopColor="#1b2f78" /><stop offset="1" stopColor="#0a1433" /></linearGradient></defs>
            <rect x="8" y="10" width="206" height="62" rx="14" fill="url(#rg)" /><rect x="20" y="18" width="182" height="9" rx="4.5" fill="#ffffff2e" />
            <rect x="214" y="30" width="14" height="22" rx="5" fill="#cdd5e3" /><path d="M221 52 V86 H122 V100" fill="none" stroke="#cdd5e3" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
            <rect x="110" y="98" width="24" height="46" rx="9" fill="#0a1433" /><rect x="110" y="98" width="24" height="9" rx="4" fill="#cdd5e3" /></svg>
        </motion.div>
        <div className="stage__tag"><b>{job.title}</b><span>{job.place}</span></div>
        <AnimatePresence>{!touched && !done && <motion.div className="stage__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Drag the roller across the wall</motion.div>}</AnimatePresence>
        <div className="stage__bar" onPointerDown={(e) => e.stopPropagation()}>
          <span className="stage__pct" aria-live="polite">{done ? 'Finished. A real project.' : `${Math.round(pct * 100)}% painted`}</span>
          {done ? <button type="button" className="chipbtn" onClick={reset}>Roll it again</button> : <button type="button" className="chipbtn chipbtn--solid" onClick={auto} disabled={busy}>{busy ? 'Rolling...' : 'Roll it for me'}</button>}
        </div>
      </div>
    </div>
  )
}

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

function CoatPrint({ src, alt, p, range, rot = 0, className = '', tag, before, beforeAlt }) {
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
  const d1 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.18) / 0.3), reduce ? 0 : t / 1400))
  const d2 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.52) / 0.3), reduce ? 0 : t / 1400))
  const e1 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.18) / 0.3), reduce ? 0 : t / 1400, true))
  const e2 = useTransform([p, time], ([v, t]) => wave(clamp01((v - 0.52) / 0.3), reduce ? 0 : t / 1400, true))
  const t1 = useTransform(p, [0.12, 0.3], [1, 0]), t2 = useTransform(p, [0.46, 0.64], [1, 0])
  const [at, setAt] = useState(0)
  useMotionValueEvent(p, 'change', (v) => setAt(v > 0.6 ? 2 : v > 0.28 ? 1 : 0))
  return (
    <section className="coats" id="process" ref={ref} aria-label="How a job goes on: primer, base, finish">
      <div className="coats__stick">
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs>
          <clipPath id="cp1" clipPathUnits="objectBoundingBox"><motion.path d={d1} /></clipPath>
          <clipPath id="cp2" clipPathUnits="objectBoundingBox"><motion.path d={d2} /></clipPath>
        </defs></svg>
        <div className="coat coat--1">
          <motion.div className="coat__txt" style={{ opacity: t1 }}><h2>Primer.</h2><p>Floors masked, edges taped, surfaces patched and primed before any color goes on.</p></motion.div>
          <div className="coat__prints">
            <CoatPrint src={stripeBeforeSm} alt="A bedroom wall taped off with blue painter's tape for stripes" p={p} range={[20, -40]} rot={-2} className="a" tag="Taped off" />
            <CoatPrint src={whB2} alt="A raw gray warehouse wall with the floor masked in paper and tape" p={p} range={[50, -60]} rot={1.5} className="b" tag="Masked" />
            <CoatPrint src={whB4} alt="A tall gray warehouse wall and door, masked before painting" p={p} range={[0, -24]} rot={-1} className="c" tag="Masked" />
          </div>
        </div>
        <div className="coat coat--2" style={{ clipPath: 'url(#cp1)' }}>
          <motion.div className="coat__txt" style={{ opacity: t2 }}><h2>Base.</h2><p>Edges cut in by hand, then the first color goes on.</p></motion.div>
          <div className="coat__prints coat__prints--2">
            <CoatPrint src={bathBeforeSm} alt="A bathroom with deep green cut in along the trim and ceiling, walls still cream" p={p} range={[60, -30]} rot={1.5} className="a" tag="Cut in" />
            <CoatPrint src={lionProcess} alt="A restaurant exterior partway through repainting" p={p} range={[20, -50]} rot={-1.5} className="b" tag="Mid-job" />
          </div>
        </div>
        <div className="coat coat--3" style={{ clipPath: 'url(#cp2)' }}>
          <div className="coat__txt"><h2>Finish.</h2><p>The last coat, the clean lines, the result.</p><a className="btn btn--ink" href="#estimate">Get a free estimate</a></div>
          <div className="coat__prints coat__prints--3">
            <CoatPrint src={bathAfterSm} alt="The finished bathroom in deep green" p={p} range={[70, -20]} rot={-1} className="a" tag="Finished" before={bathBeforeSm} beforeAlt="The same bathroom with deep green cut in and the walls still cream" />
            <CoatPrint src={doorAfterSm} alt="A front door restained in rich brown" p={p} range={[30, -40]} rot={1} className="b" tag="Finished" before={doorBeforeSm} beforeAlt="The same front door, weathered gray wood" />
            <CoatPrint src={tlAfterSm} alt="A restaurant exterior finished in white with black trim" p={p} range={[80, -14]} rot={-1.5} className="c" tag="Finished" before={tlBeforeSm} beforeAlt="The same restaurant exterior before repainting" />
            <CoatPrint src={homeAfterSm} alt="A Gilbert home finished in neutral tones" p={p} range={[10, -36]} rot={1.5} className="d" tag="Finished" before={homeBeforeSm} beforeAlt="The same Gilbert home in orange stucco before repainting" />
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

/* the headline's last word repaints itself in real job colors */
const WORD_COLORS = ['#7da3ff', '#f0848d', '#8fc7a6', '#d6ad84']
function Cycle() {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => { if (reduce) return; const id = setInterval(() => setI((v) => (v + 1) % WORD_COLORS.length), 2400); return () => clearInterval(id) }, [reduce])
  return <motion.span className="h1__w" animate={{ color: WORD_COLORS[i] }} transition={{ duration: 0.9, ease }}>change.</motion.span>
}

const SVC_IMG = [homeSm, bathSm, kitchenSm, doorSm, tlSm, stripeSm]
const SVC_ALT = ['A stucco home repainted in neutral tones', 'A bathroom finished in deep green', 'Kitchen cabinets painted deep navy', 'A front door restained in rich brown', 'A restaurant exterior finished in white with black trim', 'An accent wall with red and white stripes']

function SvcRow({ name, text, i, on, setOn }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  return (
    <motion.li ref={ref} className="svc__row" data-on={on} initial="hidden" animate={seen ? 'rest' : 'hidden'} whileHover="hover" whileFocus="hover"
      onHoverStart={() => setOn(i)} onFocus={() => setOn(i)} tabIndex={0}
      variants={{ hidden: { opacity: 0, y: 28 }, rest: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay: i * 0.05 } }, hover: { opacity: 1, y: 0 } }}>
      <motion.span className="svc__paint" variants={{ hidden: { scaleX: 0 }, rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.55, ease }} />
      <motion.span className="svc__name" variants={{ hidden: { x: 0 }, rest: { x: 0 }, hover: { x: 12 } }} transition={{ duration: 0.4, ease }}>{name}</motion.span>
      <span className="svc__txt">{text}</span>
    </motion.li>
  )
}

function Services() {
  const [on, setOn] = useState(0)
  return (
    <section className="svc" id="services" aria-labelledby="svc-t">
      <div className="svc__in">
        <div className="svc__l">
          <Reveal as="h2" id="svc-t" className="svc__h">Inside. Outside.<br />Home. Business.</Reveal>
          <ul className="svc__list">
            {SERVICES.map(([name, text], i) => <SvcRow key={name} name={name} text={text} i={i} on={on === i} setOn={setOn} />)}
          </ul>
          <Reveal className="svc__cta"><a className="btn" href="#estimate">Get a free estimate</a></Reveal>
        </div>
        <div className="svc__r" aria-hidden="true">
          <AnimatePresence mode="popLayout"><motion.img key={on} src={SVC_IMG[on]} alt={SVC_ALT[on]} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease }} /></AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [['Tell us about the job', 'Send the short form, or just call or text Jonathan.'], ['Get your free estimate', 'Jonathan looks at what you need and gets back to you.'], ['We paint, you enjoy it', 'Prep, protect and paint, inside or out, home or business.']]
  return (
    <section className="how" aria-labelledby="how-t">
      <div className="how__in">
        <Reveal as="h2" id="how-t">Three steps to a finished wall.</Reveal>
        <ol className="how__row">{steps.map(([t, d], i) => <Reveal as="li" key={t} delay={i * 0.08}><span>{i + 1}</span><h3>{t}</h3><p>{d}</p></Reveal>)}</ol>
        <Reveal className="how__cta"><a className="btn" href="#estimate">Start with a free estimate</a><a className="how__tel" href={`tel:${CONTACT.tel}`}>or call {CONTACT.phone}</a></Reveal>
      </div>
    </section>
  )
}

function Areas() {
  return (
    <section className="areas" aria-labelledby="areas-t">
      <div className="areas__in">
        <Reveal as="h2" id="areas-t">Painting across the East Valley.</Reveal>
        <Reveal as="p" delay={0.08}>We paint homes and businesses in these cities and nearby. Not sure we cover you? Call or text and ask.</Reveal>
        <ul>{[...AREAS, 'And nearby'].map((a, i) => <motion.li key={a} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: i * 0.05 }}>{a}</motion.li>)}</ul>
      </div>
    </section>
  )
}

const FAQS = [
  ['Is the estimate really free?', 'Yes. Send the form or call or text (602) 473-0415 and ask for a free estimate.'],
  ['Do you paint homes and businesses?', 'Both. We paint houses, restaurants, warehouses and shops, inside and out.'],
  ['What can you paint?', 'Exteriors, interiors, kitchen cabinets, doors and wood stain, accent walls, and commercial repaints.'],
  ['Where do you work?', 'Gilbert, Mesa, Chandler, Tempe, Scottsdale, Queen Creek and nearby. If you are close, just ask.'],
  ['Are you licensed and insured?', 'Yes, JB\u2019S Pro Painters is licensed and insured. Ask Jonathan for details when he contacts you.'],
  ['Who will I deal with?', 'The business is owner-operated by Jonathan Bernal, so you talk with the owner.'],
]
function Faq() {
  return (
    <section className="faq" aria-labelledby="faq-t">
      <div className="faq__in">
        <Reveal as="h2" id="faq-t">Questions people ask.</Reveal>
        <div className="faq__list">
          {FAQS.map(([q, a], i) => (
            <Reveal key={q} delay={i * 0.04}><details><summary><span>{q}</span><i aria-hidden="true" /></summary><p>{a}</p></details></Reveal>
          ))}
        </div>
        <Reveal className="faq__cta"><p>Still have a question? Jonathan is happy to answer it.</p><a className="btn" href={`tel:${CONTACT.tel}`}>Call or text {CONTACT.phone}</a></Reveal>
      </div>
    </section>
  )
}

function App() {
  const [job, setJob] = useState(JOBS[0])
  return (
    <>
      <Header logo={logoSm} links={LINKS} />
      <main id="top">
        <section className="hero" id="work">
          <div className="hero__top">
            <Words as="h1" text="Watch a wall" delay={0.1}><span className="wd"><motion.span className="wd__i" initial={{ y: '115%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.9, ease, delay: 0.37 }}><Cycle /></motion.span></span></Words>
            <motion.div className="hero__side" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.2 }}>
              <p className="hero__lead">Interior and exterior painting for homes and businesses across the East Valley. Licensed, insured and owner-operated.</p>
              <div className="hero__cta"><a className="btn" href="#estimate">Get a free estimate</a><a className="btn btn--ghost" href={`tel:${CONTACT.tel}`}>Call or text {CONTACT.phone}</a></div>
              <p className="hero__proof"><b>&ldquo;{REVIEW.quote}&rdquo;</b> {REVIEW.who}</p>
              <p className="hero__note">Every photo below is a real project. Roll it on and see the finish.</p>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.1, ease, delay: 0.35 }}><AnimatePresence mode="wait"><motion.div key={job.id} initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.35 }}><RollStage job={job} hero /></motion.div></AnimatePresence></motion.div>
          <motion.div className="jobs" role="tablist" aria-label="Choose a job" initial="hide" animate="show" variants={{ hide: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.9 } } }}>
            {JOBS.map((j) => (
              <motion.button key={j.id} role="tab" aria-selected={job.id === j.id} className="jobs__b" variants={{ hide: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} onClick={() => { setJob(j); sound.thud(0.2, 140) }}>
                <img src={j.thumb} alt="" loading="lazy" />
                <span>{j.title}</span>
                {job.id === j.id && <motion.i layoutId="jobline" className="jobs__line" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
              </motion.button>
            ))}
          </motion.div>
        </section>

        <div className="band" aria-hidden="true">{['Licensed', 'Insured', 'Owner-operated', 'Quality', 'Precision', 'Perfection'].map((t, i) => <span key={t}>{t}{i < 5 && <i />}</span>)}</div>

        <Coats />

        <HowItWorks />

        <Services />

        <Areas />

        <Faq />
        <section className="own" id="about" aria-labelledby="own-t">
          <motion.div className="own__ph" initial={{ clipPath: 'inset(12% 12% 12% 12% round 22px)', opacity: 0 }} whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 22px)', opacity: 1 }} viewport={{ once: true, margin: '0px 0px -12% 0px' }} transition={{ duration: 1.1, ease }}><motion.img initial={{ scale: 1.25 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease }} src={owner} alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy" /></motion.div>
          <div>
            <Reveal as="h2" id="own-t">Owner-operated<br />by Jonathan Bernal.</Reveal>
            <Reveal delay={0.1} as="p" className="own__p">Operated by the owner, licensed and insured. Jonathan brings care and precision to homes and businesses across the East Valley, inside and out. Quality, precision and perfection on every wall.</Reveal>
            <Reveal delay={0.15} as="blockquote">&ldquo;{REVIEW.quote}&rdquo;<footer>{REVIEW.who}</footer></Reveal>
            <Reveal delay={0.2} as="p" className="own__areas">Serving {AREAS.join(', ')} and more.</Reveal>
          </div>
        </section>

        <Estimate compact title="Get your free estimate." lead="Name, phone and the type of job is all we need. Jonathan will get back to you." aside={<img className="est__logo" src={logo3d} alt="JB'S Pro Painters LLC logo: silver lettering, blue roof outline and a paintbrush swoosh on deep navy" loading="lazy" />} />
      </main>
      <Footer /><MobileBar />
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
