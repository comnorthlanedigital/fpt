import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence } from 'framer-motion'
import '../../fonts/texture.css'
import '../../shared/shared.css'
import './style.css'
import '../../shared/buttons.css'
import { createViewer, MODELS, FIXED_NOTE } from './models'
import { Estimate, Footer, MobileBar, Reveal, Words, ease } from '../../shared/ui'
import { Header } from '../../shared/header'
import logoSm from '../../img/logo-sq.jpg'

// Colors sampled by eye from real JB'S jobs plus a few neutrals. Names describe the look, not a paint brand.
const PALETTE = [
  ['Deep navy', '#1f3563'], ['Garage-door green', '#46594f'], ['Charcoal', '#54535a'], ['Racing red', '#b01f2a'], ['Walnut stain', '#5b3720'], ['Stone neutral', '#b7ab98'], ['Bone white', '#ece8df'],
  ['Soft gray', '#9a9ca3'], ['Warm sand', '#cdb99a'], ['Sage', '#8a9a82'], ['Slate blue', '#5c7185'], ['Near black', '#1b1b1f'], ['Bright white', '#f7f7f4'], ['Clay', '#a9715a'],
]

const nameOf = (hex) => (PALETTE.find((p) => p[1].toLowerCase() === hex.toLowerCase()) || [hex.toUpperCase()])[0]
const LINKS = [
  { label: 'Home', href: 'JBS-home.html', id: 'home' }, { label: '3D studio', href: '#top', id: 'studio' }, { label: 'Texture studio', href: 'JBS-texture-studio.html', id: 'texture' }, { label: 'Estimate', href: '#estimate', cta: true },
]
const FINISHES = [['flat', 'Flat'], ['satin', 'Satin'], ['gloss', 'Gloss']]
const initPaint = () => Object.fromEntries(Object.entries(MODELS).map(([k, m]) => [k, Object.fromEntries(m.zones.map((z) => [z.id, { color: z.color, finish: z.finish }]))]))

function Stage({ modelId, paint, selected, onPick, viewerRef, hoverLabel }) {
  const wrap = useRef(null), cv = useRef(null)
  const [gl, setGl] = useState(true)
  const [touched, setTouched] = useState(false)
  const paintRef = useRef(paint); paintRef.current = paint
  useEffect(() => {
    let v
    try { v = createViewer(cv.current, { onPick: (z) => { setTouched(true); onPick(z) }, onHover: (z) => hoverLabel(z) }) } catch (e) { setGl(false); return }
    viewerRef.current = v
    const ro = new ResizeObserver(() => v.resize(wrap.current.clientWidth, wrap.current.clientHeight)); ro.observe(wrap.current); v.resize(wrap.current.clientWidth, wrap.current.clientHeight)
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.start() : v.stop()), { threshold: 0.05 }); io.observe(wrap.current)
    v.load(modelId, paintRef.current[modelId])
    return () => { ro.disconnect(); io.disconnect(); v.dispose(); viewerRef.current = null }
    // eslint-disable-next-line
  }, [])
  useEffect(() => { viewerRef.current && viewerRef.current.load(modelId, paintRef.current[modelId]) }, [modelId, viewerRef])
  return (
    <div className="stage" ref={wrap}>
      {gl ? <canvas ref={cv} role="img" aria-label={`A 3D scale model of a ${MODELS[modelId].label.toLowerCase()} you can rotate and paint`} /> : <p className="stage__nogl">The 3D view needs WebGL. Your browser blocked it, but you can still choose colors from the list and send the plan.</p>}
      <AnimatePresence>{gl && !touched && <motion.span className="stage__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Drag to turn it &middot; tap a surface to paint it</motion.span>}</AnimatePresence>
      {gl && <div className="stage__zoom"><button type="button" aria-label="Zoom in" onClick={() => viewerRef.current?.zoom(-1.6)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg></button><button type="button" aria-label="Zoom out" onClick={() => viewerRef.current?.zoom(1.6)}><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /></svg></button></div>}
      <AnimatePresence mode="wait"><motion.span key={selected} className="stage__chip" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>Painting: <b>{MODELS[modelId].zones.find((z) => z.id === selected)?.label}</b></motion.span></AnimatePresence>
    </div>
  )
}

function Panel({ modelId, setModelId, paint, setPaint, selected, setSelected, viewerRef, reset }) {
  const m = MODELS[modelId], p = paint[modelId], cur = p[selected], custom = useRef(null)
  const set = (patch) => { const next = { ...cur, ...patch }; setPaint((s) => ({ ...s, [modelId]: { ...s[modelId], [selected]: next } })); viewerRef.current?.setColor(selected, next) }
  return (
    <div className="kit">
      <div className="kit__row" role="tablist" aria-label="Choose a model">
        {Object.entries(MODELS).map(([k, mm]) => (
          <button key={k} role="tab" aria-selected={modelId === k} className="kit__model" onClick={() => setModelId(k)}>
            {modelId === k && <motion.span layoutId="mpill" className="kit__pill" transition={{ type: 'spring', stiffness: 460, damping: 36 }} />}
            <span>{mm.label}</span>
          </button>
        ))}
      </div>
      <fieldset className="kit__f"><legend>What to paint</legend>
        <div className="kit__zones" role="radiogroup" aria-label="Surface to paint">
          {m.zones.map((z) => (
            <motion.button key={z.id} type="button" role="radio" aria-checked={selected === z.id} className="kit__zone" whileTap={{ scale: 0.97 }} onClick={() => { setSelected(z.id); viewerRef.current?.select(z.id) }}>
              <i style={{ background: p[z.id].color }} /><span>{z.label}</span>
            </motion.button>
          ))}
        </div>
      </fieldset>
      <fieldset className="kit__f"><legend>Color for {m.zones.find((z) => z.id === selected).label.toLowerCase()}</legend>
        <div className="kit__sw" role="radiogroup" aria-label="Color">
          {PALETTE.map(([name, hex]) => <motion.button key={hex} type="button" role="radio" aria-checked={cur.color.toLowerCase() === hex.toLowerCase()} aria-label={name} title={name} style={{ background: hex }} whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.92 }} onClick={() => set({ color: hex })} />)}
          <button type="button" className="kit__custom" aria-label="Pick any color" title="Pick any color" onClick={() => custom.current.click()}><span>Any</span><input ref={custom} type="color" value={cur.color} onChange={(e) => set({ color: e.target.value })} tabIndex={-1} aria-hidden="true" /></button>
        </div>
        <p className="kit__now"><b>{nameOf(cur.color)}</b></p>
      </fieldset>
      <fieldset className="kit__f"><legend>Finish</legend>
        <div className="seg" role="radiogroup" aria-label="Paint finish">
          {FINISHES.map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={cur.finish === k} onClick={() => set({ finish: k })}>{cur.finish === k && <motion.i layoutId="fpill" className="seg__pill" transition={{ type: 'spring', stiffness: 460, damping: 36 }} />}<span>{l}</span></button>)}
        </div>
      </fieldset>
      <p className="kit__fix">{FIXED_NOTE[modelId]}</p>
      <div className="kit__act"><a className="btn" href="#estimate" onClick={() => { const sel = document.querySelector('#estimate [name=project]'); if (sel) sel.value = m.project }}>Send this paint plan</a><button type="button" className="btn btn--ghost" onClick={reset}>Reset model</button></div>
    </div>
  )
}

function App() {
  const [modelId, setModelId] = useState('bath')
  const [paint, setPaint] = useState(initPaint)
  const [selMap, setSelMap] = useState({ house: 'walls', bath: 'walls', kitchen: 'lower' })
  const viewerRef = useRef(null)
  const selected = selMap[modelId]
  const setSelected = useCallback((z) => setSelMap((s) => ({ ...s, [modelId]: z })), [modelId])
  const m = MODELS[modelId]
  const reset = () => { setPaint((s) => ({ ...s, [modelId]: Object.fromEntries(m.zones.map((z) => [z.id, { color: z.color, finish: z.finish }])) })); m.zones.forEach((z) => viewerRef.current?.setColor(z.id, { color: z.color, finish: z.finish })) }
  const plan = useMemo(() => {
    const p = paint[modelId]
    const lines = m.zones.map((z) => { const c = p[z.id], same = c.color === z.color && c.finish === z.finish; return same ? `${z.label}: original` : `${z.label}: ${nameOf(c.color)}, ${c.finish}` })
    return `3D studio paint plan. Model: ${m.label}. ${lines.join('; ')}.`
  }, [paint, modelId, m])
  const changed = useMemo(() => m.zones.filter((z) => { const c = paint[modelId][z.id]; return c.color !== z.color || c.finish !== z.finish }).length, [paint, modelId, m])
  const hoverLabel = useCallback(() => {}, [])
  return (
    <>
      <Header logo={logoSm} current="studio" links={LINKS} />
      <main id="top">
        <section className="hero">
          <div className="hero__l">
            <Words as="h1" text="Paint it before you book it." delay={0.1} />
            <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.3 }}>Pick a model, tap any surface and try colors and finishes. Your plan is written into the estimate request for you.</motion.p>
            <motion.div initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.45 }}>
              <Panel {...{ modelId, setModelId, paint, setPaint, selected, setSelected, viewerRef, reset }} />
            </motion.div>
          </div>
          <motion.div className="hero__r" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.1, ease, delay: 0.25 }}>
            <Stage {...{ modelId, paint, selected, viewerRef, hoverLabel }} onPick={setSelected} />
          </motion.div>
        </section>
        <p className="fine">A simplified 3D model to try ideas. Real paint looks different in your light, so we always bring samples.</p>

        <section className="how" aria-labelledby="how-t">
          <Reveal as="h2" id="how-t">From model to estimate.</Reveal>
          <div className="how__row">
            {[['Pick a model', 'House, bathroom or kitchen, whichever is closest to your project.'], ['Paint every surface', 'Tap a wall, cabinet or door, then choose a color and finish.'], ['Send the plan', 'Your choices are filled into the estimate form. Add details and send.']].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08}><h3>{t}</h3><p>{d}</p></Reveal>
            ))}
          </div>
        </section>

        <Estimate title="Get a free estimate." lead={`Your ${m.label.toLowerCase()} plan is filled in below (${changed} change${changed === 1 ? '' : 's'}). Add anything else and send.`}>
          <label className="full">Paint plan<textarea key={plan} name="paint_plan" rows="5" defaultValue={plan} /></label>
        </Estimate>
      </main>
      <Footer /><MobileBar />
    </>
  )
}
createRoot(document.getElementById('root')).render(<App />)
