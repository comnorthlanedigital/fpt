import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from './smooth-scroll.js'
import Customizer from './Customizer.jsx'
import data from './data/shop.json'

gsap.registerPlugin(ScrollTrigger)

const STORE = 'https://fptsportz.myshopify.com'
const TICKER = ['New 26/27 kits', 'Custom name & number', '270K+ orders', 'Since 2017', 'Every club. Every era.']
const STEPS = [
  ['1', 'Order', 'Pick your kit and your name & number.'],
  ['2', 'Made', 'Processed and quality-checked.'],
  ['3', 'Shipped', 'Tracking lands in your inbox.'],
  ['4', 'Yours', 'Wear it. Post it. Tag us.'],
]
const TILE_COLORS = ['ink', 'green', 'amber', 'paper']
const money = (n) => `$${Number(n).toFixed(2)}`
const BADGE = 'SINCE 2017 ✦ 270K+ ORDERS ✦ 3,000+ STYLES ✦ '

export default function Matchday() {
  const root = useRef(null)

  useEffect(() => initSmoothScroll(), [])

  // Headline reveals: IntersectionObserver + CSS so they can never get stuck hidden
  useEffect(() => {
    const els = root.current.querySelectorAll('.big-line')
    els.forEach((el) => el.querySelectorAll('.h-word').forEach((w, i) => w.style.setProperty('--i', i)))
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.2 })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Curtain intro: four colour bars wipe up, then the hero builds
      const tl = gsap.timeline()
      tl.from('.curtain-logo', { scale: 0.6, opacity: 0, duration: 0.7, ease: 'back.out(1.8)' })
        .to('.curtain-logo', { opacity: 0, y: -30, duration: 0.4, delay: 0.2 })
        .to('.curtain i', { yPercent: -100, duration: 0.9, stagger: 0.09, ease: 'expo.inOut' }, '-=0.1')
        .set('.curtain', { display: 'none' })
        .from('.hero .h-word', { yPercent: 110, duration: 1, stagger: 0.1, ease: 'expo.out' }, '-=0.5')
        .from('.fan-card', { y: 160, opacity: 0, rotate: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' }, '-=0.8')
        .from('.badge, .sticker', { scale: 0, rotate: -90, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }, '-=0.6')
        .from('.hero-foot > *, .md-nav', { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, '-=0.6')

      gsap.to('.badge-ring', { rotate: 360, duration: 18, repeat: -1, ease: 'none' })
      gsap.to('.sticker', { rotate: '+=8', yoyo: true, repeat: -1, duration: 2.2, ease: 'sine.inOut' })

      // Hero fan parallax
      gsap.utils.toArray('.fan-card').forEach((c, i) =>
        gsap.to(c, { yPercent: -10 - i * 8, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }),
      )

      // Ticker reacts to scroll speed
      const mq = gsap.to('.tick-track', { xPercent: -50, repeat: -1, duration: 24, ease: 'none' })
      ScrollTrigger.create({ onUpdate: (s) => { gsap.to(mq, { timeScale: 1 + Math.abs(s.getVelocity()) / 350, duration: 0.2, overwrite: true }); gsap.to(mq, { timeScale: 1, duration: 1, delay: 0.2 }) } })

      // Reveals
      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }),
      )
      // Polaroid wall: scattered cards drift at different speeds
      gsap.utils.toArray('.wall-card').forEach((c) => {
        const s = Number(c.dataset.speed)
        gsap.fromTo(c, { y: 80 * s }, { y: -80 * s, ease: 'none', scrollTrigger: { trigger: '.wall', start: 'top bottom', end: 'bottom top', scrub: true } })
      })

      // Stat counters
      gsap.utils.toArray('.num').forEach((el) => {
        const o = { v: 0 }, end = Number(el.dataset.n)
        ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power2.out', onUpdate: () => { el.textContent = el.dataset.plain ? Math.round(o.v) : Math.round(o.v).toLocaleString() } }) })
      })

      // Footer word
      gsap.from('.foot-word span', { yPercent: 100, stagger: 0.05, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.foot-word', start: 'top 95%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  const wall = data.featured

  return (
    <div className="md" ref={root}>
      <div className="curtain" aria-hidden="true">
        <i /><i /><i /><i />
        <img className="curtain-logo" src="/img/logo.jpg" alt="" />
      </div>

      <div className="strip">Buy 1, get 1 25% off — code <b>FPTSPORTZ</b></div>
      <header className="md-nav">
        <a href="#top" className="brand"><img src="/img/logo.jpg" alt="FPTSPORTZ" /></a>
        <nav><a href="#drops">New drops</a><a href="#wall">Lookbook</a><a href="#customize">Customize</a><a href="#leagues">Leagues</a></nav>
        <a className="pill" href={`${STORE}/cart`} target="_blank" rel="noreferrer">Cart</a>
      </header>

      <section className="hero" id="top">
        <h1 aria-label="Kits for the stands.">
          <span className="h-line"><span className="h-word">KITS</span> <span className="h-word">FOR</span></span>
          <span className="h-line"><span className="h-word mark">THE&nbsp;STANDS.</span></span>
        </h1>
        <div className="fan" aria-hidden="true">
          {[1, 5, 3].map((k, i) => (
            <div className={`fan-card fc${i}`} key={k}><img src={wall[k].img} alt="" /></div>
          ))}
          <div className="badge">
            <svg viewBox="0 0 200 200" className="badge-ring"><defs><path id="c" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs><text><textPath href="#c" textLength="495" lengthAdjust="spacing">{BADGE}</textPath></text></svg>
            <img src="/img/logo.jpg" alt="" />
          </div>
          <div className="sticker">from<b>$16</b></div>
        </div>
        <div className="hero-foot">
          <p>Every club. Every country. Every era. Over 3,000 jerseys with your name and number made right.</p>
          <a className="btn btn-ink" href="#drops">Shop new drops <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
          <a className="btn btn-line" href="#customize">Customize yours</a>
        </div>
      </section>

      <div className="tick" aria-hidden="true">
        <div className="tick-track">{[...Array(4)].flatMap((_, r) => TICKER.map((t) => <span key={r + t}>{t}<em>✦</em></span>))}</div>
      </div>

      <section className="stats">
        {[['270', 'K+', 'Orders fulfilled'], ['7', '+', 'Years in the game'], ['3000', '+', 'Styles in stock'], ['2017', '', 'Founded']].map(([n, s, l]) => (
          <div className="stat" data-reveal key={l}>
            <div><span className="num" data-n={n} data-plain={l === 'Founded' ? '1' : undefined}>0</span><small>{s}</small></div>
            <p>{l}</p>
          </div>
        ))}
      </section>

      <section className="drops" id="drops">
        <div className="side">
          <div className="sticky">
            <p className="kicker">Fresh off the press</p>
            <h2 className="big big-line"><span className="h-line"><span className="h-word">NEW</span></span><span className="h-line"><span className="h-word">DROPS.</span></span></h2>
            <p className="muted">26/27 kits, player issue and more, with real prices.</p>
            <a className="btn btn-ink" href={`${STORE}/collections`} target="_blank" rel="noreferrer">All collections</a>
          </div>
        </div>
        <div className="pgrid">
          {data.shop.map((p, i) => (
            <a className="pcard" key={p.handle} href={`${STORE}/products/${p.handle}`} target="_blank" rel="noreferrer" data-reveal>
              <div className="pimg"><img src={p.img} alt={p.title} loading="lazy" /><b className="tag">{money(p.price)}</b></div>
              <h3>{p.title}</h3>
              <span className="go">View kit <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </a>
          ))}
        </div>
      </section>

      <section className="wall" id="wall">
        <h2 className="big big-line center"><span className="h-line"><span className="h-word">THE</span> <span className="h-word mark">LOOKBOOK</span></span></h2>
        <div className="wall-grid">
          {wall.map((w, i) => (
            <figure className="wall-card" data-speed={[1.1, 0.5, 1.4, 0.8, 1.2, 0.6, 1.5, 0.9][i]} style={{ rotate: `${[-4, 3, -2, 5, -5, 2, -3, 4][i]}deg` }} key={w.img}>
              <img src={w.img} alt={w.label} />
              <figcaption>{w.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="cz-sec" id="customize"><div className="wrap"><Customizer /></div></section>

      <section className="leagues" id="leagues">
        <div className="wrap">
          <h2 className="big big-line"><span className="h-line"><span className="h-word">PICK YOUR</span> <span className="h-word mark">LEAGUE</span></span></h2>
          <div className="tiles">
            {data.collections.slice(0, 12).map((c, i) => (
              <a className={`tile ${TILE_COLORS[(i + Math.floor(i / 4)) % 4]}`} key={c.handle} href={`${STORE}/collections/${c.handle}`} target="_blank" rel="noreferrer">
                <span className="tn">{String(i + 1).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <span className="tc">{c.count} styles <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M7 17L17 7M8 7h9v9" /></svg></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="how">
        <div className="wrap">
          <h2 className="big big-line"><span className="h-line"><span className="h-word">CLICK TO</span> <span className="h-word mark">DOORSTEP</span></span></h2>
          <div className="steps">
            {STEPS.map(([n, t, d]) => (<div className="step" data-reveal key={n}><b>{n}</b><h3>{t}</h3><p>{d}</p></div>))}
          </div>
          <p className="ship" data-reveal>Ships in <b>6–10 business days</b>, guaranteed within <b>11–15</b>. Questions? <a href="mailto:customercare@fptsportz.com">customercare@fptsportz.com</a></p>
        </div>
      </section>

      <section className="crew">
        <div className="wrap crew-in" data-reveal>
          <div><p className="kicker">Join the crew</p><h2 className="big">AMBASSADOR<br />PROGRAM.</h2><p className="muted">Share your link, earn on every order made through it.</p></div>
          <a className="btn btn-gold" href={`${STORE}/pages/join-and-get-paid`} target="_blank" rel="noreferrer">Join and get paid <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <div><h4>Help</h4><a href={STORE}>How to order</a><a href={STORE}>Track your order</a><a href={STORE}>Returns &amp; refunds</a><a href={STORE}>Sizing</a></div>
          <div><h4>Shop</h4><a href={`${STORE}/collections/retro-vintage-jerseys`}>Retro / Vintage</a><a href={`${STORE}/collections`}>All collections</a><a href={`${STORE}/cart`}>Cart</a></div>
          <div><h4>Follow</h4><a href="https://instagram.com/fptsportz">@fptsportz</a><a href="mailto:customercare@fptsportz.com">Email us</a></div>
        </div>
        <div className="foot-word" aria-label="FPTSPORTZ">{[...'FPTSPORTZ'].map((c, i) => <span key={i}>{c}</span>)}</div>
        <p className="copy">© 2017–{new Date().getFullYear()} FPTSPORTZ · Concept preview</p>
      </footer>
    </div>
  )
}
