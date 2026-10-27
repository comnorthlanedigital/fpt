import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useTransform, useMotionValueEvent, useSpring, animate, useReducedMotion } from 'framer-motion'
import '../../fonts/lights.css'
import '../../shared/shared.css'
import './style.css'
import { SoundToggle, useSound, Estimate, Footer, MobileBar, Reveal, CONTACT, SERVICES, AREAS, REVIEW, sound, ease } from '../../shared/ui'
import logoSm from '../../img/logo-sm.jpg'
import charStairs from '../../img/char-stairs.jpg'; import charDoor from '../../img/char-door.jpg'; import charFire from '../../img/char-fire-sm.jpg'; import charKitchen from '../../img/char-kitchen-sm.jpg'
import bathB from '../../img/bath-before.jpg'; import bathA from '../../img/bath-after.jpg'
import stripeB from '../../img/stripe-before.jpg'; import stripeA from '../../img/stripe-after.jpg'
import garageB from '../../img/garage-before.jpg'; import garageA from '../../img/garage-after.jpg'
import kitchenB from '../../img/kitchen-before.jpg'; import kitchenA from '../../img/kitchen-after.jpg'
import whB3 from '../../img/wh-b3.jpg'; import whA2 from '../../img/wh-a2.jpg'; import whA1 from '../../img/wh-a1-sm.jpg'; import whA3 from '../../img/wh-a3-sm.jpg'; import whB2 from '../../img/wh-b2-sm.jpg'
import owner from '../../img/owner-sm.jpg'

const ROOMS = [
  { id: 'bath', t: 'Bold bathroom', p: 'Interior', b: bathB, a: bathA, tall: true, copy: 'Cream walls cut in with deep green, then the whole room finished in it.' },
  { id: 'stripe', t: 'Accent wall', p: 'Interior detail', b: stripeB, a: stripeA, copy: 'Taped off and cut sharp: red and white stripes on a pink room.' },
  { id: 'kitchen', t: 'Cabinet refinish', p: 'Queen Creek', b: kitchenB, a: kitchenA, tall: true, copy: 'Oak cabinets to deep navy without a remodel.' },
  { id: 'garage', t: 'Garage refresh', p: 'Interior', b: garageB, a: garageA, copy: 'Bare walls and floor to a clean, finished garage.' },
]

/* ---- the wall switch ---- */
function WallSwitch({ lit, onFlip }) {
  return (
    <button type="button" role="switch" aria-checked={lit} aria-label="Lights" className="sw" onClick={onFlip}>
      <span className="sw__plate"><span className="sw__screw" /><span className="sw__slot"><motion.span className="sw__rocker" animate={{ rotateX: lit ? 24 : -24, y: lit ? -10 : 10 }} transition={{ type: 'spring', stiffness: 500, damping: 22 }} /></span><span className="sw__screw" /></span>
      <span className="sw__label">{lit ? 'Lights on' : 'Lights off'}</span>
    </button>
  )
}

function useLight() {
  const light = useMotionValue(0)
  const [day, setDay] = useState(false)
  useMotionValueEvent(light, 'change', (v) => {
    const r = document.documentElement.style
    r.setProperty('--b', (0.22 + 0.78 * v ** 0.8).toFixed(3))
    setDay(v > 0.6)
    sound.intensity(v)
  })
  useEffect(() => { document.documentElement.style.setProperty('--b', '0.22') }, [])
  return [light, day]
}

function Hero({ light, lit, flip }) {
  const reduce = useReducedMotion()
  const panel = useRef(null)
  const mx = useMotionValue(-999), my = useMotionValue(-999)
  const sx = useSpring(mx, { stiffness: 260, damping: 28 }), sy = useSpring(my, { stiffness: 260, damping: 28 })
  const r = useTransform(light, [0, 0.5, 1], [190, 520, 2600])
  const a = useTransform(light, [0, 1], [0.965, 0])
  const mask = useMotionTemplate`radial-gradient(circle ${r}px at ${sx}px ${sy}px, rgba(7,8,13,0) 0%, rgba(7,8,13,${a}) 100%)`
  const [used, setUsed] = useState(false)
  useEffect(() => { const b = panel.current.getBoundingClientRect(); mx.set(b.width * 0.62); my.set(b.height * 0.42) }, [mx, my])
  const move = (e) => { const b = panel.current.getBoundingClientRect(); mx.set(e.clientX - b.left); my.set(e.clientY - b.top) }
  return (
    <section className="hero">
      <div className="hero__txt">
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease }}>Flip the switch.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.2 }}>Interior and exterior painting across the East Valley. Shine the light around, or just turn it on: a dark room becomes a finished one.</motion.p>
        <motion.div className="hero__row" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.35 }}>
          <WallSwitch lit={lit} onFlip={() => { flip(); setUsed(true) }} />
          <a className="btn" href="#estimate">Get a free estimate</a>
        </motion.div>
        <AnimatePresence>{!used && !reduce && <motion.span className="hero__hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>It&rsquo;s dark in here.</motion.span>}</AnimatePresence>
      </div>
      <div className="hero__panel" ref={panel} onPointerMove={move} onPointerDown={move}>
        <img className="lit" src={charStairs} alt="An open living space with charcoal walls, stairs and a fireplace, finished by JB'S Pro Painters" fetchpriority="high" />
        <motion.div className="hero__dark" style={{ background: mask }} aria-hidden="true" />
      </div>
    </section>
  )
}

function Room({ room, i }) {
  const [after, setAfter] = useState(true)
  const swap = (v) => { setAfter(v); sound.tick(v ? 1.3 : 0.8) }
  return (
    <article className={`room${i % 2 ? ' room--r' : ''}${room.tall ? ' room--tall' : ''}`}>
      <Reveal className="room__ph" y={40}>
        <AnimatePresence initial={false} mode="popLayout"><motion.img key={after ? 'a' : 'b'} className="lit" src={after ? room.a : room.b} alt={`${room.t}, ${after ? 'finished' : 'before'}`} loading="lazy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} /></AnimatePresence>
      </Reveal>
      <div className="room__txt">
        <Reveal as="h3">{room.t}</Reveal>
        <Reveal as="p" delay={0.08}>{room.copy}</Reveal>
        <Reveal delay={0.14} className="seg" role="group" aria-label={`${room.t}: before or after`}>
          <button aria-pressed={!after} onClick={() => swap(false)}>Before</button><button aria-pressed={after} onClick={() => swap(true)}>After</button>
          <motion.i className="seg__pill" animate={{ x: after ? '100%' : '0%' }} transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
        </Reveal>
        <span className="room__place">{room.p}</span>
      </div>
    </article>
  )
}

function Charcoal() {
  return (
    <section className="char" aria-labelledby="char-t">
      <div className="char__txt"><Reveal as="h2" id="char-t">One deep color.<br />Every surface.</Reveal><Reveal as="p" delay={0.1}>Walls, doors and trim in a single charcoal for a whole-home look. Turn the lights up to see the detail.</Reveal></div>
      <div className="char__row">
        <Reveal y={50} className="char__a"><img className="lit" src={charDoor} alt="A charcoal interior door and trim with a tiled shower beyond" loading="lazy" /></Reveal>
        <Reveal y={70} delay={0.1} className="char__b"><img className="lit" src={charFire} alt="A living room with charcoal walls and a fireplace" loading="lazy" /></Reveal>
        <Reveal y={50} delay={0.2} className="char__c"><img className="lit" src={charKitchen} alt="A kitchen with gray walls and white cabinets" loading="lazy" /></Reveal>
      </div>
    </section>
  )
}

function Warehouse() {
  const [on, setOn] = useState(false)
  const flip = () => { setOn((v) => !v); sound.clack(); setTimeout(() => sound.buzz(), 60) }
  return (
    <section className="wh" aria-labelledby="wh-t">
      <div className="wh__head"><Reveal as="h2" id="wh-t">Big rooms need<br />big switches.</Reveal><Reveal as="p" delay={0.1}>A warehouse wall, raw concrete to finished white.</Reveal></div>
      <div className="wh__stage">
        <AnimatePresence initial={false}><motion.img key={on ? 'a' : 'b'} className="wh__img" src={on ? whA2 : whB3} alt={on ? 'A long warehouse wall painted clean white' : 'A long raw gray concrete warehouse wall before painting'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: on ? 0.9 : 0.4 }} /></AnimatePresence>
        <div className="wh__sw"><WallSwitch lit={on} onFlip={flip} /></div>
      </div>
      <div className="wh__row">{[[whA1, 'Warehouse interior with white walls and yellow-banded columns'], [whA3, 'Dock doors and walls painted white'], [whB2, 'Raw gray warehouse wall with pipes, masked for painting']].map(([s, a], i) => <Reveal key={i} delay={i * 0.08} as="figure"><img className="lit" src={s} alt={a} loading="lazy" /></Reveal>)}</div>
    </section>
  )
}

function MiniSwitch({ on }) {
  return <span className="mini" data-on={on} aria-hidden="true"><motion.i animate={{ y: on ? -6 : 6, rotateX: on ? 20 : -20 }} transition={{ type: 'spring', stiffness: 500, damping: 24 }} /></span>
}
function Services() {
  const [on, setOn] = useState({})
  return (
    <section className="svc" aria-labelledby="svc-t">
      <Reveal as="h2" id="svc-t">Flip a few more.</Reveal>
      <ul>
        {SERVICES.map(([name, text]) => (
          <li key={name} data-on={!!on[name]}>
            <button type="button" role="switch" aria-checked={!!on[name]} onClick={() => { setOn((o) => ({ ...o, [name]: !o[name] })); sound.clack() }}>
              <MiniSwitch on={!!on[name]} /><span className="svc__n">{name}</span>
              <AnimatePresence initial={false}>{on[name] && <motion.span className="svc__t" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>{text}</motion.span>}</AnimatePresence>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function App() {
  const [snd, toggleSnd] = useSound('lights')
  const [light, day] = useLight()
  const [lit, setLit] = useState(false)
  const reduce = useReducedMotion()
  const bg = useTransform(light, [0, 0.6, 1], ['#07080d', '#1a1a20', '#efeae0'])
  const flip = () => {
    const next = !lit; setLit(next)
    sound.clack()
    if (next) {
      setTimeout(() => sound.buzz(), 70)
      animate(light, reduce ? 1 : [light.get(), 0.4, 0.06, 0.7, 0.2, 1], { duration: reduce ? 0.01 : 1.5, times: reduce ? undefined : [0, 0.12, 0.26, 0.46, 0.62, 1], ease: 'easeOut' })
    } else animate(light, 0, { duration: 0.7, ease })
  }
  const slide = (v) => { light.set(v); setLit(v > 0.5) }
  return (
    <motion.div className="app" data-day={day} style={{ background: bg }}>
      <SoundToggle on={snd} toggle={toggleSnd} />
      <header className="head">
        <a href="#top" aria-label="JB'S Pro Painters LLC"><img src={logoSm} alt="JB'S Pro Painters LLC logo" width="44" height="44" /></a>
        <label className="dim"><span>Dimmer</span><DimmerInput light={light} onSlide={slide} /></label>
        <a className="head__tel" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
      </header>
      <main id="top">
        <Hero light={light} lit={lit} flip={flip} />
        <section className="rooms" aria-label="Rooms">{ROOMS.map((r, i) => <Room key={r.id} room={r} i={i} />)}</section>
        <Charcoal />
        <Warehouse />
        <Services />
        <section className="own" aria-labelledby="own-t">
          <Reveal className="own__ph"><img className="lit" src={owner} alt="Jonathan Bernal, owner of JB'S Pro Painters LLC" loading="lazy" /><span>Placeholder photo</span></Reveal>
          <div>
            <Reveal as="h2" id="own-t">Jonathan Bernal<br />runs every job.</Reveal>
            <Reveal delay={0.1} as="p" className="own__p">Operated by the owner, licensed and insured. Care and precision for homes and businesses across the East Valley, inside and out. Quality, precision, perfection.</Reveal>
            <Reveal delay={0.15} as="blockquote">&ldquo;{REVIEW.quote}&rdquo;<footer>{REVIEW.who}</footer></Reveal>
            <Reveal delay={0.2} as="p" className="own__areas">Serving {AREAS.join(', ')} and more.</Reveal>
          </div>
        </section>
        <Estimate title="Get a free estimate." lead="Tell us about the project. Jonathan will get back to you." />
      </main>
      <Footer /><MobileBar />
    </motion.div>
  )
}

function DimmerInput({ light, onSlide }) {
  const [v, setV] = useState(0)
  useMotionValueEvent(light, 'change', (x) => setV(Math.round(x * 100)))
  return <input type="range" min="0" max="100" value={v} aria-label="Dimmer, room brightness" onChange={(e) => { const n = +e.target.value; if (n % 10 === 0) sound.tick(0.8 + n / 160); onSlide(n / 100) }} style={{ '--v': `${v}%` }} />
}
createRoot(document.getElementById('root')).render(<App />)
