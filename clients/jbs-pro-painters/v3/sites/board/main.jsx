import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, useReducedMotion } from 'framer-motion'
import '../../fonts/board.css'
import '../../shared/shared.css'
import './style.css'
import { SoundToggle, useSound, Estimate, Footer, MobileBar, Reveal, CONTACT, SERVICES, AREAS, REVIEW, sound, ease } from '../../shared/ui'
import logoSm from '../../img/logo-sm.jpg'
import homeB from '../../img/home-before-sm.jpg'; import homeA from '../../img/home-after-sm.jpg'
import kitchenB from '../../img/kitchen-before-sm.jpg'; import kitchenA from '../../img/kitchen-after-sm.jpg'
import tlB from '../../img/tl-before-sm.jpg'; import tlA from '../../img/tl-after-sm.jpg'
import doorB from '../../img/door-before-sm.jpg'; import doorA from '../../img/door-after-sm.jpg'
import bathB from '../../img/bath-before-sm.jpg'; import bathA from '../../img/bath-after-sm.jpg'
import gdoorB from '../../img/gdoor-before-sm.jpg'; import gdoorA from '../../img/gdoor-after-sm.jpg'
import stripeB from '../../img/stripe-before-sm.jpg'; import stripeA from '../../img/stripe-after-sm.jpg'
import twoB from '../../img/two-before-sm.jpg'; import twoA from '../../img/two-after-sm.jpg'
import garageB from '../../img/garage-before-sm.jpg'; import garageA from '../../img/garage-after-sm.jpg'
import whB2 from '../../img/wh-b2-sm.jpg'; import whB4 from '../../img/wh-b4-sm.jpg'; import whA1 from '../../img/wh-a1-sm.jpg'; import whA3 from '../../img/wh-a3-sm.jpg'; import whRail from '../../img/wh-rail-sm.jpg'; import whA2 from '../../img/wh-a2-sm.jpg'
import owner from '../../img/owner-sm.jpg'

// x/y are the desktop spot, xm/ym the phone spot (percent of the board)
const JOBS = [
  { id: 'home', t: 'Exterior repaint', p: 'Gilbert', b: homeB, a: homeA, x: 2, y: 1, xm: 3, ym: 0.5, r: -3 },
  { id: 'kitchen', t: 'Cabinet refinish', p: 'Queen Creek', b: kitchenB, a: kitchenA, x: 34, y: 5, xm: 51, ym: 5, r: 2.5 },
  { id: 'tl', t: 'Restaurant exterior', p: 'Commercial', b: tlB, a: tlA, x: 66, y: 0, xm: 4, ym: 19, r: -2 },
  { id: 'door', t: 'Front door stain', p: 'Wood refinish', b: doorB, a: doorA, x: 9, y: 33, xm: 50, ym: 24, r: 3 },
  { id: 'bath', t: 'Bold bathroom', p: 'Interior', b: bathB, a: bathA, x: 38, y: 38, xm: 3, ym: 38, r: -2.5 },
  { id: 'gdoor', t: 'Garage doors', p: 'Exterior', b: gdoorB, a: gdoorA, x: 67, y: 34, xm: 52, ym: 42, r: 2 },
  { id: 'stripe', t: 'Accent wall', p: 'Interior detail', b: stripeB, a: stripeA, x: 3, y: 66, xm: 4, ym: 57, r: 2.5 },
  { id: 'two', t: 'Two-story exterior', p: 'Residential', b: twoB, a: twoA, x: 35, y: 70, xm: 51, ym: 61, r: -3 },
  { id: 'garage', t: 'Garage refresh', p: 'Interior', b: garageB, a: garageA, x: 67, y: 67, xm: 4, ym: 76, r: 3 },
]
const WH = [
  { id: 'w1', t: 'Masked and ready', p: 'Warehouse, before', b: whB2, a: whB2, x: 3, y: 4, xm: 3, ym: 3, r: -2.5, only: 'Before' },
  { id: 'w2', t: 'Taped and tall', p: 'Warehouse, before', b: whB4, a: whB4, x: 36, y: 14, xm: 51, ym: 14, r: 2, only: 'Before' },
  { id: 'w3', t: 'Finished white', p: 'Warehouse, after', b: whA1, a: whA1, x: 66, y: 2, xm: 4, ym: 36, r: -1.5, only: 'After' },
  { id: 'w4', t: 'Dock doors', p: 'Warehouse, after', b: whA3, a: whA3, x: 6, y: 52, xm: 51, ym: 40, r: 2.5, only: 'After' },
  { id: 'w5', t: 'Railing', p: 'Painted white', b: whRail, a: whRail, x: 38, y: 56, xm: 3, ym: 62, r: -2, only: 'After' },
  { id: 'w6', t: 'Long wall', p: 'Warehouse, after', b: whA2, a: whA2, x: 68, y: 50, xm: 51, ym: 66, r: 2, only: 'After' },
]

function Print({ job, z, raise, boardRef }) {
  const reduce = useReducedMotion()
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer:coarse)').matches
  const [flip, setFlip] = useState(false)
  const canFlip = !job.only
  const dragged = useRef(false)
  const toggle = () => { if (!canFlip || dragged.current) return; setFlip((f) => !f); sound.whoosh(!flip, 0.35); setTimeout(() => sound.tick(1.2), 160) }
  const face = flip ? 'before' : 'finished'
  return (
    <motion.div className="pr" style={{ left: `var(--x)`, top: `var(--y)`, zIndex: z, '--x': `${job.x}%`, '--y': `${job.y}%`, '--xm': `${job.xm}%`, '--ym': `${job.ym}%` }}
      drag dragConstraints={boardRef} dragDirectionLock={coarse} dragMomentum dragElastic={0.12} dragTransition={{ power: 0.18, timeConstant: 220 }}
      onPointerDown={() => { raise(job.id); sound.tape() }} onDragStart={() => { dragged.current = true }} onDragEnd={() => { sound.thud(0.22, 110); setTimeout(() => { dragged.current = false }, 60) }} whileDrag={{ scale: 1.05, cursor: 'grabbing' }}>
      <motion.div className="pr__in" initial={reduce ? false : { y: -260, opacity: 0, rotate: job.r - 14 }} whileInView={{ y: 0, opacity: 1, rotate: job.r }} viewport={{ once: true, margin: '0px 0px -5% 0px' }} transition={{ type: 'spring', stiffness: 110, damping: 14, delay: (job.x % 7) * 0.05 }}>
        <button type="button" className="pr__card" onClick={toggle} onKeyDown={(e) => { if (e.key === ' ') e.preventDefault() }} aria-pressed={canFlip ? flip : undefined} aria-label={`${job.t}, ${job.p}. Showing ${job.only ? job.only.toLowerCase() : face} photo.${canFlip ? ' Press to flip.' : ''}`}>
          <motion.span className="pr__side" animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.7, ease }} style={{ transformStyle: 'preserve-3d' }}>
            <span className="pr__face"><img src={job.a} alt="" draggable={false} className={job.raw ? 'raw' : ''} /><i className="pr__tag">{job.only || 'After'}</i></span>
            <span className="pr__face pr__face--back"><img src={job.b} alt="" draggable={false} /><i className="pr__tag pr__tag--b">Before</i></span>
          </motion.span>
          <span className="pr__cap"><b>{job.t}</b><em>{job.p}</em></span>
        </button>
        <span className="tape tape--top" aria-hidden="true" />
      </motion.div>
    </motion.div>
  )
}

function Board({ jobs, height, label, hint }) {
  const ref = useRef(null)
  const [order, setOrder] = useState(jobs.map((j) => j.id))
  const raise = (id) => setOrder((o) => [...o.filter((x) => x !== id), id])
  return (
    <div className="board" ref={ref} style={{ '--h': height[0], '--hm': height[1] }} role="group" aria-label={label}>
      {jobs.map((j) => <Print key={j.id} job={j} z={10 + order.indexOf(j.id)} raise={raise} boardRef={ref} />)}
      {hint && <span className="hint" aria-hidden="true">drag me.<br />tap to flip</span>}
    </div>
  )
}

function Tape({ children, rot = 0, w, className = '' }) {
  return <motion.li className={`label ${className}`} style={{ rotate: rot, '--w': w }} whileHover={{ rotate: 0, y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} onHoverStart={() => sound.tape()}>{children}</motion.li>
}

function App() {
  const [on, toggle] = useSound('board')
  return (
    <>
      <SoundToggle on={on} toggle={toggle} />
      <header className="top"><a href="#top" aria-label="JB'S Pro Painters LLC"><img src={logoSm} alt="JB'S Pro Painters LLC logo" width="46" height="46" /></a><a className="top__tel" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></header>
      <main id="top">
        <section className="hero">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }}><span className="strip strip--a">The</span><span className="strip strip--b">job board.</span></motion.h1>
          <motion.div className="hero__side" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.2 }}>
            <p>Real JB&rsquo;S jobs, taped to the wall. Drag them around. Tap one to see where it started.</p>
            <p className="hero__hint" aria-hidden="true">Try it: drag a print, tap to flip.</p>
            <a className="tapebtn" href="#estimate">Get a free estimate</a>
          </motion.div>
        </section>

        <section className="wall" aria-label="Job photos">
          <Board jobs={JOBS} height={['1230px', '1560px']} label="Residential and commercial jobs. Drag to move, press to flip." hint />
        </section>

        <section className="labels" aria-labelledby="svc-t">
          <Reveal as="h2" id="svc-t">What we paint.</Reveal>
          <ul>
            {SERVICES.map(([name, text], i) => <Tape key={name} rot={[-2, 1.5, -1, 2, -1.5, 1][i]} w={['56%', '38%', '42%', '52%', '36%', '58%'][i]}><b>{name}</b><span>{text}</span></Tape>)}
          </ul>
        </section>

        <section className="wall wall--com" aria-labelledby="wh-t">
          <div className="wall__head"><Reveal as="h2" id="wh-t">Big walls.<br />Same tape.</Reveal><Reveal as="p" delay={0.1}>A warehouse, raw to finished. Look for the Before and After tags.</Reveal></div>
          <Board jobs={WH} height={['980px', '1060px']} label="Warehouse before and after photos. Drag to move." />
        </section>

        <section className="own" aria-labelledby="own-t">
          <Reveal className="own__card"><div className="own__ph"><img src={owner} alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy" /><span>Placeholder photo</span></div><span className="tape tape--top" aria-hidden="true" /></Reveal>
          <div>
            <Reveal as="h2" id="own-t">Owner-operated<br />by Jonathan Bernal.</Reveal>
            <Reveal delay={0.1} as="p" className="own__p">Operated by the owner, licensed and insured. Care and precision for homes and businesses across the East Valley, inside and out. Quality, precision, perfection.</Reveal>
            <Reveal delay={0.15} as="blockquote" className="note"><span className="tape tape--top" aria-hidden="true" />&ldquo;{REVIEW.quote}&rdquo;<footer>{REVIEW.who}</footer></Reveal>
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
