import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from './smooth-scroll.js'
import Customizer from './Customizer.jsx'

gsap.registerPlugin(ScrollTrigger)

type Product = { t: string; h: string; p: number; m: string; c: number[]; y: number; a: 0 | 1 }
type Collection = { handle: string; title: string; count: number; cover: string | null }
type Catalog = { cdn: string; collections: Collection[]; products: Product[] }

const STORE = 'https://fptsportz.myshopify.com'
const PAGE = 40
const FEATURED = ['Premier League', 'Liga MX', 'La Liga', 'World Cup', 'Player Issue', 'Retro / Vintage', 'Serie A', 'Bundesliga', 'Concept / Limited Edition']
const DECADES = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]
const MANIFESTO = "FPT isn't a jersey shop. It's where the stands get dressed. Retro legends and this season's drops, player issue and kids' kits, more than three thousand styles for fans who live the game. Name it. Number it. Wear it."
const FAQ = [
  ['How do I add a name and number?', 'Add the name and number you want in the Sellers Instructions box at checkout, or in the note on the cart. Forgot? Email customercare@fptsportz.com and we will fix it.'],
  ['How long does shipping take?', 'Orders ship in 6–10 working days and are guaranteed within 11–15 working days. Once an order is placed it is processed, shipped, and a tracking number is emailed to you.'],
  ['How do I track my order?', 'You get a tracking number by email once it ships. Order updates are also posted on our Instagram story, @fptsportz.'],
  ['Which size should I get?', 'Player Issue: skin-slim, so take your normal size or one up. Standard: fitted but a little loose, so go up one size if you like it baggy. Women: V-shaped slim fit, size up for a looser feel.'],
  ['Can I become an ambassador?', 'Yes. Sign up, get your shareable link, and earn on purchases made through it. Standout ambassadors can be invited to become official FPT Sportz ambassadors.'],
]

export default function Archive() {
  const root = useRef<HTMLDivElement>(null)
  const [cat, setCat] = useState<Catalog | null>(null)
  const [col, setCol] = useState<number | null>(null)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'featured' | 'low' | 'high'>('featured')
  const [stock, setStock] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  const [era, setEra] = useState<[number, number] | null>(null)
  const [decade, setDecade] = useState(1990)
  const [open, setOpen] = useState<Product | null>(null)
  const [faq, setFaq] = useState<number | null>(0)

  useEffect(() => initSmoothScroll(), [])
  useEffect(() => { fetch('/data/catalog.json').then((r) => r.json()).then(setCat) }, [])

  const img = (m: string, w = 520) => cat ? `${cat.cdn}${m}${m.includes('?') ? '&' : '?'}width=${w}` : ''
  const money = (n: number) => `$${n.toFixed(2)}`

  const list = useMemo(() => {
    if (!cat) return []
    const needle = q.trim().toLowerCase()
    let r = cat.products.filter((p) =>
      (col === null || p.c.includes(col)) && (!stock || p.a) && (!needle || p.t.toLowerCase().includes(needle)) &&
      (!era || (p.y >= era[0] && p.y <= era[1])))
    if (sort === 'featured') {
      // round-robin across the headline leagues so the default view is varied, not one collection
      const rank = (p: Product) => { const k = p.c.map((i) => FEATURED.indexOf(cat.collections[i].title)).filter((i) => i >= 0); return k.length ? Math.min(...k) : FEATURED.length }
      const buckets: Product[][] = Array.from({ length: FEATURED.length + 1 }, () => [])
      for (const p of r) buckets[rank(p)].push(p)
      const out: Product[] = []
      for (let n = 0; out.length < r.length; n++) for (const b of buckets) if (b[n]) out.push(b[n])
      r = out
    }
    if (sort === 'low') r = [...r].sort((a, b) => a.p - b.p)
    if (sort === 'high') r = [...r].sort((a, b) => b.p - a.p)
    return r
  }, [cat, col, q, stock, sort, era])
  useEffect(() => setLimit(PAGE), [col, q, stock, sort, era])

  const decadeItems = useMemo(() => cat ? cat.products.filter((p) => p.y >= decade && p.y < decade + 10).sort((a, b) => a.y - b.y) : [], [cat, decade])
  const histogram = useMemo(() => DECADES.map((d) => cat ? cat.products.filter((p) => p.y >= d && p.y < d + 10).length : 0), [cat])
  const hero = useMemo(() => cat ? ['Premier League', 'Liga MX', 'Retro / Vintage', 'World Cup', 'La Liga'].map((n) => cat.collections.find((c) => c.title === n)).filter(Boolean) as Collection[] : [], [cat])

  const browseEra = () => { setEra([decade, decade + 9]); setCol(null); setQ(''); document.getElementById('archive')?.scrollIntoView({ behavior: 'smooth' }) }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-word', { yPercent: 105, duration: 1.2, stagger: 0.07, ease: 'expo.out', delay: 0.2 })
      gsap.from('.arch', { y: 120, opacity: 0, duration: 1.4, stagger: 0.12, ease: 'expo.out', delay: 0.3 })
      gsap.from('.hero-sub, .hero-actions > *, .hero-stats > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.07, ease: 'power3.out', delay: 0.9 })
      gsap.utils.toArray<HTMLElement>('.arch').forEach((a, i) =>
        gsap.to(a, { yPercent: (i % 2 ? -1 : 1) * (6 + i * 3), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }))
      // manifesto: words light up as you scroll
      const words = gsap.utils.toArray<HTMLElement>('.mf-w')
      gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.5, ease: 'none', scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 55%', scrub: true } })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
      const mq = gsap.to('.mq-track', { xPercent: -50, repeat: -1, duration: 40, ease: 'none' })
      ScrollTrigger.create({ onUpdate: (s) => { gsap.to(mq, { timeScale: 1 + Math.abs(s.getVelocity()) / 400, duration: 0.2, overwrite: true }); gsap.to(mq, { timeScale: 1, duration: 1, delay: 0.2 }) } })
      gsap.utils.toArray<HTMLElement>('.num').forEach((el) => {
        const o = { v: 0 }, end = Number(el.dataset.n)
        ScrollTrigger.create({ trigger: el, start: 'top 95%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 2, ease: 'power2.out', onUpdate: () => { el.textContent = el.dataset.plain ? String(Math.round(o.v)) : Math.round(o.v).toLocaleString() } }) })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  useEffect(() => { if (cat) ScrollTrigger.refresh() }, [cat])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(null) }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [])

  const clubs = cat?.collections.map((c) => c.title) ?? []

  return (
    <div className="ar" ref={root}>
      <header className="nav">
        <a href="#top" className="brand"><img src="/img/logo.jpg" alt="FPTSPORTZ" /><span>FPT<i>SPORTZ</i></span></a>
        <nav><a href="#archive">Archive</a><a href="#time">Time machine</a><a href="#custom">Made for you</a><a href="#crew">Crew</a><a href="#faq">Help</a></nav>
        <a className="pill" href={`${STORE}/cart`} target="_blank" rel="noreferrer">Cart</a>
      </header>

      <section className="hero" id="top">
        <svg className="pitch" viewBox="0 0 1200 800" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="600" cy="400" r="170" /><circle cx="600" cy="400" r="6" fill="currentColor" /><path d="M600 0V800M0 120h210v560H0M1200 120H990v560h210M0 290h80v220H0M1200 290h-80v220h80" /></g></svg>
        <div className="hero-copy">
          <p className="mono hero-sub">FPTSPORTZ · EST. 2017 · THE FOOTBALL ARCHIVE</p>
          <h1 aria-label="Football is a language. We sell the vocabulary.">
            {['Football is', 'a language.'].map((l) => <span className="hl" key={l}>{l.split(' ').map((w) => <span className="hero-word" key={w}>{w}&nbsp;</span>)}</span>)}
            <span className="hl em">{['We sell', 'the vocabulary.'].join(' ').split(' ').map((w, i) => <span className="hero-word" key={i}>{w}&nbsp;</span>)}</span>
          </h1>
          <p className="hero-sub lede">Over 3,000 jerseys, from 1950s retro to this season's drops. Player issue, kids, training, windbreakers. All with your name and number.</p>
          <div className="hero-actions"><a className="btn btn-gold" href="#archive">Browse the archive</a><a className="btn btn-line" href="#time">Open the time machine</a></div>
        </div>
        <div className="arches" aria-hidden={!cat}>
          {hero.map((c, i) => (
            <figure className={`arch a${i}`} key={c.handle}>{cat && c.cover && <img src={img(c.cover, 520)} alt="" />}<figcaption className="mono">{c.title}</figcaption></figure>
          ))}
        </div>
        <div className="hero-stats">
          {[['270', 'K+', 'orders fulfilled'], ['3197', '', 'styles in the archive'], ['18', '', 'collections'], ['2017', '', 'founded']].map(([n, s, l]) => (
            <div key={l}><b className="num" data-n={n} data-plain={l === 'founded' ? '1' : undefined}>0</b><small>{s}</small><span className="mono">{l}</span></div>
          ))}
        </div>
      </section>

      <div className="mq" aria-hidden="true"><div className="mq-track">{[...Array(2)].flatMap((_, r) => clubs.concat(clubs).map((c, i) => <span key={`${r}${i}`}>{c}<em>✦</em></span>))}</div></div>

      <section className="manifesto">
        <p className="mono">THE MESSAGE</p>
        <p className="mf">{MANIFESTO.split(' ').map((w, i) => <span className="mf-w" key={i}>{w} </span>)}</p>
      </section>

      <section className="archive" id="archive">
        <div className="wrap">
          <div className="sec-head" data-reveal><div><p className="mono">THE ARCHIVE</p><h2 className="h2">Find <em>your</em> kit.</h2></div><p className="muted">{cat ? `${list.length.toLocaleString()} of ${cat.products.length.toLocaleString()} styles` : 'Loading the archive…'}</p></div>
          <div className="filters">
            <div className="chips" role="tablist" aria-label="Collections">
              <button className={col === null ? 'on' : ''} onClick={() => setCol(null)}>All</button>
              {cat?.collections.map((c, i) => <button key={c.handle} className={col === i ? 'on' : ''} onClick={() => setCol(col === i ? null : i)}>{c.title}<sup>{c.count}</sup></button>)}
            </div>
            <div className="tools">
              <input type="search" placeholder="Search a club, country or year…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the archive" />
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select>
              <label className="check"><input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} /> In stock</label>
              {era && <button className="chip-x" onClick={() => setEra(null)}>{era[0]}–{era[1]} ✕</button>}
            </div>
          </div>
          <div className="grid">
            {list.slice(0, limit).map((p) => (
              <button className="card" key={p.h} onClick={() => setOpen(p)}>
                <div className="card-img"><img src={img(p.m)} alt={p.t} loading="lazy" />{!p.a && <span className="sold mono">Sold out</span>}<span className="quick mono">Quick view +</span></div>
                <h3>{p.t}</h3><p>{money(p.p)}</p>
              </button>
            ))}
          </div>
          {cat && list.length === 0 && <p className="empty">Nothing matches. Try a different club or clear the filters.</p>}
          {list.length > limit && <div className="more"><button className="btn btn-line" onClick={() => setLimit((l) => l + PAGE)}>Load more · {list.length - limit} left</button></div>}
        </div>
      </section>

      <section className="time" id="time">
        <div className="wrap">
          <div className="sec-head" data-reveal><div><p className="mono">THE TIME MACHINE</p><h2 className="h2">Pick a <em>decade.</em></h2></div><p className="muted">Retro and vintage kits, sorted by the year on the shirt.</p></div>
          <div className="tm-years" role="tablist">
            {DECADES.map((d, i) => (
              <button key={d} className={d === decade ? 'on' : ''} onClick={() => setDecade(d)} role="tab" aria-selected={d === decade}>
                <i style={{ height: `${8 + (histogram[i] / Math.max(1, ...histogram)) * 60}px` }} /><b>{d}s</b><span className="mono">{histogram[i]}</span>
              </button>
            ))}
          </div>
          <div className="tm-stage"><span className="tm-big" aria-hidden="true" key={decade}>{decade}s</span>
            <div className="tm-strip">
              {decadeItems.slice(0, 16).map((p) => (
                <a className="tm-card" key={p.h} href={`${STORE}/products/${p.h}`} target="_blank" rel="noreferrer"><div><img src={img(p.m, 420)} alt={p.t} loading="lazy" /></div><span className="mono">{p.y}</span><h3>{p.t}</h3></a>
              ))}
            </div>
          </div>
          <div className="tm-cta"><button className="btn btn-gold" onClick={browseEra}>Browse all {decadeItems.length} from the {decade}s</button></div>
        </div>
      </section>

      <section className="custom" id="custom"><div className="wrap"><Customizer /></div></section>

      <section className="crew" id="crew">
        <div className="wrap crew-in">
          <div data-reveal><p className="mono">THE CREW</p><h2 className="h2">Rep it. <em>Get paid.</em></h2><p className="lede">Join the ambassador program: share your link and earn on every order made through it. Standout ambassadors can be invited to become official FPT Sportz ambassadors.</p><a className="btn btn-gold" href={`${STORE}/pages/join-and-get-paid`} target="_blank" rel="noreferrer">Join and get paid</a></div>
          <ol className="steps" data-reveal>
            {[['Order placed', 'Pick your kit, add your name and number.'], ['Processed', 'Your order is made and quality-checked.'], ['Shipped', 'Tracking number lands in your inbox.'], ['Delivered', '6–10 working days, guaranteed in 11–15.']].map(([t, d], i) => <li key={t}><b className="mono">0{i + 1}</b><div><h3>{t}</h3><p>{d}</p></div></li>)}
          </ol>
        </div>
      </section>

      <section className="faq" id="faq">
        <div className="wrap faq-in">
          <div data-reveal><p className="mono">HELP</p><h2 className="h2">Good <em>to know.</em></h2></div>
          <div className="acc" data-reveal>
            {FAQ.map(([qq, a], i) => (
              <div className={'acc-i' + (faq === i ? ' on' : '')} key={qq}>
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}><span>{qq}</span><i /></button>
                <div className="acc-b"><p>{a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap foot-in">
          <div className="foot-big" aria-hidden="true">FPTSPORTZ</div>
          <div><h4 className="mono">Shop</h4><a href={`${STORE}/collections`}>All collections</a><a href={`${STORE}/cart`}>Cart</a></div>
          <div><h4 className="mono">Help</h4><a href={STORE}>How to order</a><a href={STORE}>Track your order</a><a href="mailto:customercare@fptsportz.com">customercare@fptsportz.com</a></div>
          <div><h4 className="mono">Follow</h4><a href="https://instagram.com/fptsportz">@fptsportz</a></div>
        </div>
        <p className="copy mono">© 2017–{new Date().getFullYear()} FPTSPORTZ · CONCEPT PREVIEW</p>
      </footer>

      {open && cat && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={open.t} onClick={() => setOpen(null)}>
          <div className="modal-in" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            <div className="modal-img"><img src={img(open.m, 900)} alt={open.t} /></div>
            <div className="modal-copy">
              <p className="mono">{open.c.map((i) => cat.collections[i]?.title).filter(Boolean).slice(0, 3).join(' · ') || 'FPTSPORTZ'}{open.y ? ` · ${open.y}` : ''}</p>
              <h3>{open.t}</h3>
              <b className="price">{money(open.p)}</b>
              <p className="muted">{open.a ? 'In stock. Add your name and number at checkout.' : 'Currently sold out.'}</p>
              <a className="btn btn-gold" href={`${STORE}/products/${open.h}`} target="_blank" rel="noreferrer">View on FPTSPORTZ →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
