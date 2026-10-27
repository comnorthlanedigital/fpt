import React, { useEffect, useRef, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useVelocity, animate, useReducedMotion, useInView } from 'framer-motion'
import '../../fonts/roller.css'
import '../../shared/shared.css'
import './style.css'
import { SoundToggle, useSound, Estimate, Footer, MobileBar, Reveal, CONTACT, SERVICES, AREAS, REVIEW, sound, ease } from '../../shared/ui'
import logoSm from '../../img/logo-sm.jpg'
import homeBefore from '../../img/home-before.jpg'; import homeAfter from '../../img/home-after.jpg'; import homeSm from '../../img/home-after-sm.jpg'
import kitchenBefore from '../../img/kitchen-before.jpg'; import kitchenAfter from '../../img/kitchen-after.jpg'; import kitchenSm from '../../img/kitchen-after-sm.jpg'
import doorBefore from '../../img/door-before.jpg'; import doorAfter from '../../img/door-after.jpg'; import doorSm from '../../img/door-after-sm.jpg'
import bathBefore from '../../img/bath-before.jpg'; import bathAfter from '../../img/bath-after.jpg'; import bathSm from '../../img/bath-after-sm.jpg'
import gdoorBefore from '../../img/gdoor-before.jpg'; import gdoorAfter from '../../img/gdoor-after.jpg'; import gdoorSm from '../../img/gdoor-after-sm.jpg'
import tlBefore from '../../img/tl-before.jpg'; import tlAfter from '../../img/tl-after.jpg'; import tlSm from '../../img/tl-after-sm.jpg'
import stripeBefore from '../../img/stripe-before.jpg'; import stripeAfter from '../../img/stripe-after.jpg'; import stripeSm from '../../img/stripe-after-sm.jpg'
import whB3 from '../../img/wh-b3.jpg'; import whA2 from '../../img/wh-a2.jpg'
import whA3 from '../../img/wh-a3-sm.jpg'; import whRail from '../../img/wh-rail-sm.jpg'; import tlPatio from '../../img/tl-patio-sm.jpg'
import owner from '../../img/owner-sm.jpg'

const JOBS = [
  { id: 'home', title: 'Exterior repaint', place: 'Gilbert', before: homeBefore, after: homeAfter, thumb: homeSm },
  { id: 'kitchen', title: 'Cabinet refinish', place: 'Queen Creek', before: kitchenBefore, after: kitchenAfter, thumb: kitchenSm },
  { id: 'door', title: 'Front door stain', place: 'Wood refinish', before: doorBefore, after: doorAfter, thumb: doorSm },
  { id: 'bath', title: 'Bold bathroom', place: 'Interior', before: bathBefore, after: bathAfter, thumb: bathSm },
  { id: 'gdoor', title: 'Garage doors', place: 'Exterior', before: gdoorBefore, after: gdoorAfter, thumb: gdoorSm },
  { id: 'tl', title: 'Restaurant exterior', place: 'Commercial, Gilbert', before: tlBefore, after: tlAfter, thumb: tlSm },
  { id: 'stripe', title: 'Accent wall', place: 'Interior detail', before: stripeBefore, after: stripeAfter, thumb: stripeSm },
]
const WAREHOUSE = { id: 'wh', title: 'Warehouse walls', place: 'Commercial', before: whB3, after: whA2 }
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
          <span className="stage__pct" aria-live="polite">{done ? 'Finished. A real JB’S job.' : `${Math.round(pct * 100)}% painted`}</span>
          {done ? <button type="button" className="chipbtn" onClick={reset}>Roll it again</button> : <button type="button" className="chipbtn chipbtn--solid" onClick={auto} disabled={busy}>{busy ? 'Rolling...' : 'Roll it for me'}</button>}
        </div>
      </div>
    </div>
  )
}

function Services() {
  return (
    <section className="svc" aria-labelledby="svc-t">
      <Reveal as="h2" id="svc-t" className="svc__h">Inside. Outside.<br />Home. Business.</Reveal>
      <ul className="svc__list">
        {SERVICES.map(([name, text]) => (
          <motion.li key={name} className="svc__row" initial="rest" whileHover="hover" whileFocus="hover" animate="rest" onHoverStart={() => sound.roll(0.5, 1.2)} onHoverEnd={() => sound.roll(0)}>
            <motion.span className="svc__paint" variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.55, ease }} />
            <motion.span className="svc__name" variants={{ rest: { color: 'var(--ink)' }, hover: { color: '#fff' } }} transition={{ duration: 0.3 }}>{name}</motion.span>
            <motion.span className="svc__txt" variants={{ rest: { color: 'var(--mute)' }, hover: { color: '#dbe4ff' } }} transition={{ duration: 0.3 }}>{text}</motion.span>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

function App() {
  const [on, toggle] = useSound('roller')
  const [job, setJob] = useState(JOBS[0])
  return (
    <>
      <SoundToggle on={on} toggle={toggle} />
      <header className="top"><a href="#top" className="top__logo" aria-label="JB'S Pro Painters LLC"><img src={logoSm} alt="" width="46" height="46" /><span>JB&rsquo;S Pro Painters</span></a><a className="top__tel" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></header>
      <main id="top">
        <section className="hero">
          <div className="hero__top">
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>Watch a wall change.</motion.h1>
            <motion.div className="hero__side" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.2 }}>
              <p>Every photo here is a real JB&rsquo;S job. Roll it on and see the finish.</p>
              <a className="btn" href="#estimate">Get a free estimate</a>
            </motion.div>
          </div>
          <AnimatePresence mode="wait"><motion.div key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}><RollStage job={job} hero /></motion.div></AnimatePresence>
          <div className="jobs" role="tablist" aria-label="Choose a job">
            {JOBS.map((j) => (
              <button key={j.id} role="tab" aria-selected={job.id === j.id} className="jobs__b" onClick={() => { setJob(j); sound.thud(0.2, 140) }}>
                <img src={j.thumb} alt="" loading="lazy" />
                <span>{j.title}</span>
                {job.id === j.id && <motion.i layoutId="jobline" className="jobs__line" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
              </button>
            ))}
          </div>
        </section>

        <Services />

        <section className="wh" aria-labelledby="wh-t">
          <Reveal as="h2" id="wh-t" className="wh__h">Raw concrete.<br />Finished white.</Reveal>
          <Reveal className="wh__p"><p>Restaurants, warehouses and shops get the same care as a front door. This wall paints itself when you reach it.</p></Reveal>
          <RollStage job={WAREHOUSE} autoStart />
          <div className="wh__row">
            {[[whA3, 'Dock doors and walls painted white'], [whRail, 'A freshly painted white stair railing'], [tlPatio, 'Restaurant patio and entry after painting']].map(([s, a], i) => <Reveal key={a} delay={i * 0.08} as="figure"><img src={s} alt={a} loading="lazy" /></Reveal>)}
          </div>
        </section>

        <section className="own" aria-labelledby="own-t">
          <Reveal className="own__ph"><img src={owner} alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy" /><span>Placeholder photo</span></Reveal>
          <div>
            <Reveal as="h2" id="own-t">Owner-operated<br />by Jonathan Bernal.</Reveal>
            <Reveal delay={0.1} as="p" className="own__p">Operated by the owner, licensed and insured. Jonathan brings care and precision to homes and businesses across the East Valley, inside and out. Quality, precision and perfection on every wall.</Reveal>
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
