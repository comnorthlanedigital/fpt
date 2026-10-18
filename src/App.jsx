import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from './smooth-scroll.js'
import Emblem from './Emblem.jsx'
import Customizer from './Customizer.jsx'
import data from './data/shop.json'

gsap.registerPlugin(ScrollTrigger)

const STORE = 'https://fptsportz.myshopify.com'
const LEAGUES = ['Premier League', 'La Liga', 'Liga MX', 'Serie A', 'Bundesliga', 'Ligue 1', 'MLS', 'World Cup', 'Retro / Vintage', 'Player Issue']
const STATS = [
  { n: 270, suffix: 'K+', label: 'Orders fulfilled' },
  { n: 7, suffix: '+', label: 'Years in the game' },
  { n: 3000, suffix: '+', label: 'Styles in stock' },
  { n: 2017, suffix: '', label: 'Founded', plain: true },
]
const STEPS = [
  ['01', 'Order placed', 'Pick your kit, add your name and number.'],
  ['02', 'Supplier processing', 'Your order is made and quality-checked.'],
  ['03', 'Shipped', 'Tracking number lands in your inbox.'],
  ['04', 'Delivered', 'Wear it. Post it. Tag us.'],
]
const money = (n) => `$${Number(n).toFixed(2)}`

function Split({ text, className }) {
  return (
    <span className={className} aria-label={text}>
      {[...text].map((c, i) => (
        <span className="ch" aria-hidden="true" key={i}>{c === ' ' ? ' ' : c}</span>
      ))}
    </span>
  )
}

export default function App() {
  const root = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const destroy = initSmoothScroll()
    return destroy
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Preloader -> hero intro
      const count = { v: 0 }
      const pre = gsap.timeline({ onComplete: () => setLoaded(true) })
      pre
        .to(count, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { const e = document.querySelector('.pre-n'); if (e) e.textContent = Math.round(count.v) } })
        .to('.pre-logo', { scale: 1.08, duration: 1.3, ease: 'power2.inOut' }, 0)
        .to('.pre', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' })
        .from('.hero .ch', { yPercent: 115, rotate: 6, opacity: 0, duration: 1, stagger: 0.035, ease: 'expo.out' }, '-=0.45')
        .from('.hero-sub, .hero-cta > *, .hero-badge', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, '-=0.7')
        .from('.emblem', { scale: 0.7, opacity: 0, duration: 1.4, ease: 'expo.out' }, '-=1.3')
        .from('.nav', { yPercent: -100, duration: 0.8, ease: 'power3.out' }, '-=1')

      // Generic reveals
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }),
      )

      // Counters
      gsap.utils.toArray('.stat b').forEach((el) => {
        const end = Number(el.dataset.n)
        const o = { v: 0 }
        ScrollTrigger.create({
          trigger: el, start: 'top 90%', once: true,
          onEnter: () => gsap.to(o, { v: end, duration: 2, ease: 'power2.out', onUpdate: () => { el.textContent = el.dataset.plain ? Math.round(o.v) : Math.round(o.v).toLocaleString() } }),
        })
      })

      // Marquee speeds up with scroll velocity
      const mq = gsap.to('.mq-track', { xPercent: -50, repeat: -1, duration: 30, ease: 'none' })
      ScrollTrigger.create({ onUpdate: (s) => gsap.to(mq, { timeScale: 1 + Math.abs(s.getVelocity()) / 400, duration: 0.3, overwrite: true }).then?.(() => gsap.to(mq, { timeScale: 1, duration: 1 })) })

      // Pinned horizontal gallery (desktop)
      mm.add('(min-width: 900px)', () => {
        const track = document.querySelector('.gal-track')
        const dist = () => track.scrollWidth - window.innerWidth + 120
        gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.gal', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true } })
        gsap.utils.toArray('.gal-card img').forEach((img) =>
          gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: undefined, start: 'top bottom', end: 'bottom top', scrub: true } }),
        )
      })

      // Process line
      gsap.fromTo('.steps-line i', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 70%', end: 'bottom 70%', scrub: true } })
      gsap.from('.step', { y: 50, opacity: 0, stagger: 0.18, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.steps', start: 'top 80%' } })

      // Big type parallax
      gsap.to('.ghost', { xPercent: -18, ease: 'none', scrollTrigger: { trigger: '.ghost', start: 'top bottom', end: 'bottom top', scrub: true } })

      // Magnetic buttons
      document.querySelectorAll('.magnetic').forEach((b) => {
        const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' })
        const yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' })
        b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.3); yTo((e.clientY - r.top - r.height / 2) * 0.4) })
        b.addEventListener('pointerleave', () => { xTo(0); yTo(0) })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Cursor-follow preview for the collections list
  const [hover, setHover] = useState(0)
  const previews = data.featured

  return (
    <div ref={root} className={loaded ? 'is-loaded' : ''}>
      <div className="pre" aria-hidden="true">
        <img className="pre-logo" src="/img/logo.jpg" alt="" />
        <div className="pre-n">0</div>
      </div>

      <div className="topbar">Buy 1, get 1 25% off · use code <b>FPTSPORTZ</b></div>
      <header className="nav">
        <a href="#top" className="nav-logo"><img src="/img/logo.jpg" alt="FPTSPORTZ" /></a>
        <nav>
          <a href="#new">New drops</a><a href="#customize">Customize</a><a href="#leagues">Leagues</a><a href="#how">How it works</a>
        </nav>
        <a className="btn btn-gold btn-sm" href={`${STORE}/cart`} target="_blank" rel="noreferrer">Cart</a>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow" />
        <div className="hero-grid" />
        <div className="hero-copy">
          <div className="hero-badge"><i /> 2026/27 kits are live</div>
          <h1>
            <span className="line"><Split text="WEAR THE" /></span>
            <span className="line gold"><Split text="LEGENDS." /></span>
          </h1>
          <p className="hero-sub">Every club. Every country. Every era. Over 3,000 jerseys, priced for the stands, with your name and number made right.</p>
          <div className="hero-cta">
            <a className="btn btn-gold magnetic" href="#new">Shop new drops</a>
            <a className="btn btn-ghost magnetic" href="#customize">Customize yours</a>
          </div>
        </div>
        <Emblem src="/img/logo.jpg" />
        <div className="scroll-cue"><i /> Scroll</div>
      </section>

      <div className="mq" aria-hidden="true">
        <div className="mq-track">
          {[...LEAGUES, ...LEAGUES, ...LEAGUES, ...LEAGUES].map((l, i) => (<span key={i}>{l}<em>✦</em></span>))}
        </div>
      </div>

      <section className="stats">
        {STATS.map((s) => (
          <div className="stat" data-reveal key={s.label}>
            <div><b data-n={s.n} data-plain={s.plain ? '1' : undefined}>0</b><small>{s.suffix}</small></div>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      <section className="gal" id="featured">
        <div className="gal-head" data-reveal>
          <p className="eyebrow">The lineup</p>
          <h2 className="h2">Pieces that <span className="gold">turn heads.</span></h2>
        </div>
        <div className="gal-track">
          {data.featured.map((f, i) => (
            <a className="gal-card" key={f.img} href={`${STORE}/collections/world-cup-jerseys`} target="_blank" rel="noreferrer">
              <div className="gal-img"><img src={f.img} alt={f.label} /></div>
              <span className="gal-n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{f.label}</h3>
            </a>
          ))}
          <a className="gal-card gal-end" href={STORE} target="_blank" rel="noreferrer"><span>See everything &rarr;</span></a>
        </div>
      </section>

      <section className="shop" id="new">
        <div className="wrap">
          <div className="sec-head" data-reveal>
            <div><p className="eyebrow">Fresh off the press</p><h2 className="h2">New <span className="gold">drops.</span></h2></div>
            <a className="link" href={`${STORE}/collections`} target="_blank" rel="noreferrer">All collections &rarr;</a>
          </div>
          <div className="grid">
            {data.shop.map((p) => (
              <a className="card" key={p.handle} href={`${STORE}/products/${p.handle}`} target="_blank" rel="noreferrer" data-reveal>
                <div className="card-img"><img src={p.img} alt={p.title} loading="lazy" /><span className="card-quick">Quick view +</span></div>
                <h3>{p.title}</h3>
                <p>{money(p.price)}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="cz-sec" id="customize"><div className="wrap"><Customizer /></div></section>

      <section className="leagues" id="leagues">
        <div className="ghost" aria-hidden="true">LEAGUES LEAGUES LEAGUES</div>
        <div className="wrap lg">
          <ul>
            {data.collections.map((c, i) => (
              <li key={c.handle} onMouseEnter={() => setHover(i % previews.length)}>
                <a href={`${STORE}/collections/${c.handle}`} target="_blank" rel="noreferrer"><span>{c.title}</span><small>{c.count}</small></a>
              </li>
            ))}
          </ul>
          <div className="lg-prev"><img key={hover} src={previews[hover].img} alt="" /></div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="wrap">
          <div data-reveal><p className="eyebrow">No surprises</p><h2 className="h2">From click to <span className="gold">doorstep.</span></h2></div>
          <div className="steps">
            <div className="steps-line"><i /></div>
            {STEPS.map(([n, t, d]) => (<div className="step" key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></div>))}
          </div>
          <p className="ship" data-reveal>Orders ship in <b>6–10 business days</b>, guaranteed within <b>11–15</b>. Tracking sent to your email. Questions? <a href="mailto:customercare@fptsportz.com">customercare@fptsportz.com</a></p>
        </div>
      </section>

      <section className="amb">
        <div className="wrap amb-in" data-reveal>
          <div><p className="eyebrow">Join the crew</p><h2 className="h2">Become an <span className="gold">ambassador.</span></h2>
            <p className="lede">Share your link, earn on every order made through it. Outstanding ambassadors can be invited to rep FPT Sportz officially.</p></div>
          <a className="btn btn-gold magnetic" href={`${STORE}/pages/join-and-get-paid`} target="_blank" rel="noreferrer">Join and get paid &rarr;</a>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <img src="/img/logo.jpg" alt="FPTSPORTZ" />
          <div><h4>Help</h4><a href={STORE}>How to order</a><a href={STORE}>Track your order</a><a href={STORE}>Returns &amp; refunds</a><a href={STORE}>Sizing</a></div>
          <div><h4>Shop</h4><a href={`${STORE}/collections/retro-vintage-jerseys`}>Retro / Vintage</a><a href={`${STORE}/collections`}>All collections</a><a href={`${STORE}/cart`}>Cart</a></div>
          <div><h4>Follow</h4><a href="https://instagram.com/fptsportz">@fptsportz</a><a href="mailto:customercare@fptsportz.com">Email us</a></div>
        </div>
        <p className="copy">© 2017–{new Date().getFullYear()} FPTSPORTZ · Concept preview</p>
      </footer>
    </div>
  )
}
