import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from './smooth-scroll.js'
import SpinCanvas, { loadSpin, type SpinHandle } from './SpinCanvas'
import Customizer from './Customizer.jsx'
import data from './data/shop.json'

gsap.registerPlugin(ScrollTrigger)

const STORE = 'https://fptsportz.myshopify.com'
const PRODUCT = `${STORE}/products/sale-mini-shin-guards`
const TICKER = ['FPT mini shin guards', '$6.99', 'Ships in 1–2 business days', 'Since 2017', '270K+ orders']
const STORY = [
  ['01', 'Gloss black shell.', 'A deep mirror-black finish that catches every light on the pitch.'],
  ['02', 'The FPT mark.', 'White on black. Your crest on every pass, impossible to miss.'],
  ['03', 'Mini by design.', 'A compact profile that stays out of your way.'],
  ['04', 'Ships fast.', 'Out the door in 1–2 business days. Add it to your next kit.'],
]
const money = (n: number) => `$${Number(n).toFixed(2)}`

export default function Drop() {
  const root = useRef<HTMLDivElement>(null)
  const storySpin = useRef<SpinHandle>(null)
  const [pct, setPct] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    const t0 = performance.now()
    loadSpin((d, n) => setPct(Math.round((d / n) * 100))).then(() => {
      const wait = Math.max(0, 900 - (performance.now() - t0))
      setTimeout(() => setReady(true), wait)
    })
  }, [])

  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.to('.pre', { yPercent: -100, duration: 1, ease: 'expo.inOut' })
        .from('.hero-ghost span', { opacity: 0, y: 80, duration: 1.4, stagger: 0.1, ease: 'expo.out' }, '-=0.5')
        .from('.hero-stage', { scale: 0.82, opacity: 0, duration: 1.6, ease: 'expo.out' }, '-=1.1')
        .from('.hero .ch', { yPercent: 115, rotate: 5, opacity: 0, duration: 1, stagger: 0.03, ease: 'expo.out' }, '-=1.2')
        .from('.hero-meta > *, .hero-cta > *, .nav', { y: 26, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, '-=0.8')

      // Ghost type parallax
      gsap.to('.hero-ghost', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero-stage', { yPercent: -8, scale: 0.94, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })

      // Pinned scroll-driven spin
      const steps = gsap.utils.toArray<HTMLElement>('.story-step')
      const ui = { p: 0 }
      ScrollTrigger.create({
        trigger: '.story', start: 'top top', end: '+=360%', pin: true, scrub: 0.6,
        onUpdate: (self) => {
          ui.p = self.progress
          storySpin.current?.setProgress(self.progress)
          const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length))
          steps.forEach((el, i) => el.classList.toggle('on', i === idx))
          gsap.set('.story-bar i', { scaleY: self.progress })
          const n = document.querySelector('.story-n'); if (n) n.textContent = String(idx + 1).padStart(2, '0')
        },
        onLeave: () => storySpin.current?.release(),
        onEnterBack: () => storySpin.current?.setProgress(1),
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }),
      )
      gsap.to('.photo img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.photo', start: 'top bottom', end: 'bottom top', scrub: true } })
      const mq = gsap.to('.mq-track', { xPercent: -50, repeat: -1, duration: 28, ease: 'none' })
      ScrollTrigger.create({ onUpdate: (s) => { gsap.to(mq, { timeScale: 1 + Math.abs(s.getVelocity()) / 380, duration: 0.2, overwrite: true }); gsap.to(mq, { timeScale: 1, duration: 1, delay: 0.2 }) } })

      gsap.utils.toArray<HTMLElement>('.num').forEach((el) => {
        const o = { v: 0 }, end = Number(el.dataset.n)
        ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = el.dataset.plain ? String(Math.round(o.v)) : Math.round(o.v).toLocaleString() } }) })
      })
      document.querySelectorAll<HTMLElement>('.magnetic').forEach((b) => {
        const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' }), yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' })
        b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4) })
        b.addEventListener('pointerleave', () => { xTo(0); yTo(0) })
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <div ref={root} className="drop">
      <div className="pre" aria-hidden={ready}>
        <img src="/img/logo.jpg" alt="" />
        <div className="pre-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></div>
        <b>{pct}%</b>
      </div>

      <header className="nav">
        <a href="#top" className="nav-logo"><img src="/img/logo.jpg" alt="FPTSPORTZ" /></a>
        <nav><a href="#story">The guard</a><a href="#details">Details</a><a href="#kits">Kits</a><a href="#customize">Customize</a></nav>
        <a className="btn btn-gold btn-sm" href={`${STORE}/cart`} target="_blank" rel="noreferrer">Cart</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-ghost" aria-hidden="true">{[...'FPT'].map((c, i) => <span key={i}>{c}</span>)}</div>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-stage">
          <SpinCanvas draggable auto className="hero-canvas" />
          <div className="floor" aria-hidden="true" />
        </div>
        <div className="hero-meta">
          <p className="eyebrow">New · FPT mini shin guards</p>
          <h1 aria-label="Guard the legend.">
            <span className="line">{[...'GUARD THE'].map((c, i) => <span className="ch" aria-hidden="true" key={i}>{c === ' ' ? ' ' : c}</span>)}</span>
            <span className="line gold">{[...'LEGEND.'].map((c, i) => <span className="ch" aria-hidden="true" key={i}>{c}</span>)}</span>
          </h1>
        </div>
        <div className="hero-cta">
          <div className="price"><small>From</small><b>$6.99</b></div>
          <a className="btn btn-gold magnetic" href={PRODUCT} target="_blank" rel="noreferrer">Shop shin guards</a>
          <a className="btn btn-ghost magnetic" href="#story">See it spin</a>
        </div>
        <div className="drag-hint" aria-hidden="true"><i /> Drag to spin</div>
      </section>

      <div className="mq" aria-hidden="true">
        <div className="mq-track">{[...Array(4)].flatMap((_, r) => TICKER.map((t) => <span key={r + t}>{t}<em>✦</em></span>))}</div>
      </div>

      <section className="story" id="story">
        <div className="story-glow" aria-hidden="true" />
        <div className="story-stage"><SpinCanvas ref={storySpin} className="story-canvas" label="Scroll to rotate the FPT mini shin guards" /></div>
        <div className="story-bar" aria-hidden="true"><i /></div>
        <div className="story-count" aria-hidden="true"><b className="story-n">01</b><span>/ 04</span></div>
        <div className="story-copy">
          {STORY.map(([n, t, d], i) => (
            <div className={'story-step' + (i === 0 ? ' on' : '')} key={n}>
              <p className="eyebrow">{n}</p>
              <h2 className="h2">{t}</h2>
              <p className="lede">{d}</p>
            </div>
          ))}
        </div>
        <p className="story-hint" aria-hidden="true">Keep scrolling</p>
      </section>

      <section className="photo" id="details">
        <div className="photo-in">
          <div className="photo-img" data-reveal>
            <img src="/img/shin.jpg" alt="Pair of black FPT mini shin guards on a grey surface" />
            <span className="hot hs1" tabIndex={0}><i /><em>The FPT mark</em></span>
            <span className="hot hs2" tabIndex={0}><i /><em>Gloss black shell</em></span>
          </div>
          <div className="photo-copy" data-reveal>
            <p className="eyebrow">Look closer</p>
            <h2 className="h2">Small guard.<br /><span className="gold">Big presence.</span></h2>
            <p className="lede">Every pair carries the FPT mark. Clean, bold and built to be seen from the stands.</p>
            <div className="buy">
              <div><small>Mini shin guards</small><b>$6.99</b></div>
              <a className="btn btn-gold magnetic" href={PRODUCT} target="_blank" rel="noreferrer">Add to cart &rarr;</a>
            </div>
            <ul className="facts"><li>Ships in 1–2 business days</li><li>Sold as is</li><li>No personalization</li></ul>
          </div>
        </div>
      </section>

      <section className="kits" id="kits">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <div><p className="eyebrow">Complete the look</p><h2 className="h2">Now the <span className="gold">kit.</span></h2></div>
            <a className="link" href={`${STORE}/collections`} target="_blank" rel="noreferrer">All collections &rarr;</a>
          </div>
          <div className="grid">
            {data.shop.slice(0, 8).map((p) => (
              <a className="card" key={p.handle} href={`${STORE}/products/${p.handle}`} target="_blank" rel="noreferrer" data-reveal>
                <div className="card-img"><img src={p.img} alt={p.title} loading="lazy" /></div>
                <h3>{p.title}</h3><p>{money(p.price)}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cz-sec" id="customize"><div className="wrap"><Customizer /></div></section>

      <section className="stats">
        {[['270', 'K+', 'Orders fulfilled'], ['7', '+', 'Years in the game'], ['3000', '+', 'Styles in stock'], ['2017', '', 'Founded']].map(([n, s, l]) => (
          <div className="stat" data-reveal key={l}><div><b className="num" data-n={n} data-plain={l === 'Founded' ? '1' : undefined}>0</b><small>{s}</small></div><span>{l}</span></div>
        ))}
      </section>

      <section className="final">
        <div className="wrap" data-reveal>
          <h2 className="h2 big">Gear up.<br /><span className="gold">Own the pitch.</span></h2>
          <a className="btn btn-gold magnetic" href={STORE} target="_blank" rel="noreferrer">Shop FPTSPORTZ &rarr;</a>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <img src="/img/logo.jpg" alt="FPTSPORTZ" />
          <div><h4>Help</h4><a href={STORE}>How to order</a><a href={STORE}>Track your order</a><a href={STORE}>Returns &amp; refunds</a></div>
          <div><h4>Shop</h4><a href={PRODUCT}>Shin guards</a><a href={`${STORE}/collections`}>All collections</a><a href={`${STORE}/cart`}>Cart</a></div>
          <div><h4>Follow</h4><a href="https://instagram.com/fptsportz">@fptsportz</a><a href="mailto:customercare@fptsportz.com">Email us</a></div>
        </div>
        <p className="copy">© 2017–{new Date().getFullYear()} FPTSPORTZ · Concept preview</p>
      </footer>
    </div>
  )
}
