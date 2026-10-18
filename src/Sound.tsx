import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { initSmoothScroll } from './smooth-scroll.js'
import { sound } from './audio'

gsap.registerPlugin(ScrollTrigger)

type Collection = { handle: string; title: string; count: number; cover: string | null }
type Catalog = { cdn: string; collections: Collection[] }

const STORE = 'https://fptsportz.myshopify.com'
const STAGES = ['Premier League', 'La Liga', 'Liga MX', 'Serie A', 'World Cup', 'Retro / Vintage']
const LIST = ['Premier League', 'La Liga', 'Liga MX', 'Serie A', 'Bundesliga', 'Ligue 1', 'World Cup', 'Retro / Vintage', 'Player Issue', 'Kids / Baby / Woman', 'Training / Warm Up Sets', 'MLS']
const CLUBS = [
  ['LIVERPOOL', 'ARSENAL', 'REAL MADRID', 'CHIVAS', 'CLUB AMÉRICA', 'MAN UNITED'],
  ['ARGENTINA', 'BRAZIL', 'MEXICO', 'COLOMBIA', 'PORTUGAL', 'GERMANY'],
  ['AC MILAN', 'BAYERN', 'INTER MIAMI', 'FRANCE', 'TIGRES', 'NAPOLI'],
]
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))

function Emblem() {
  return (
    <svg className="emblem" viewBox="0 0 220 220" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <circle className="d" cx="110" cy="110" r="100" /><circle className="d" cx="110" cy="110" r="86" />
      <path className="d" d="M36 128 L72 92 L92 106 L112 66 L138 108 L156 96 L184 128" />
      {[-60, -40, -20, 0, 20, 40, 60].map((a) => <line className="d" key={a} x1="110" y1="140" x2={110 + Math.sin((a * Math.PI) / 180) * 78} y2={140 + Math.cos((a * Math.PI) / 180) * 56} />)}
      <path className="d" d="M30 128 H190" />
      <text x="110" y="122" textAnchor="middle" fill="currentColor" stroke="none" fontSize="13" letterSpacing="5" fontFamily="Inter Tight, sans-serif" fontWeight="700">FPTSPORTZ</text>
      <text x="110" y="168" textAnchor="middle" fill="currentColor" stroke="none" fontSize="6.5" letterSpacing="3" fontFamily="JetBrains Mono, monospace">EST. 2017</text>
    </svg>
  )
}

export default function Sound() {
  const root = useRef<HTMLDivElement>(null)
  const [cat, setCat] = useState<Catalog | null>(null)
  const [entered, setEntered] = useState(false)
  const [snd, setSnd] = useState(false)
  const [stage, setStage] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => { fetch('/data/catalog.json').then((r) => r.json()).then(setCat) }, [])
  useEffect(() => initSmoothScroll(), [])
  useEffect(() => { if (location.search.includes('debug')) (window as unknown as { __sound: typeof sound }).__sound = sound }, [])

  const find = (t: string) => cat?.collections.find((c) => c.title === t)
  const img = (c: Collection | undefined, w = 1400) => (cat && c?.cover ? `${cat.cdn}${c.cover}${c.cover.includes('?') ? '&' : '?'}width=${w}` : '')
  const stages = STAGES.map(find)
  const list = LIST.map(find).filter(Boolean) as Collection[]

  const enter = async (withSound: boolean) => {
    if (withSound) { await sound.enable(); setSnd(true); sound.whistle() }
    gsap.timeline({ onComplete: () => setEntered(true) })
      .to('.gate-ui', { opacity: 0, y: -20, duration: 0.5 })
      .to('.gate', { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, '-=0.1')
      .set('.gate', { display: 'none' })
  }
  const toggleSound = async () => { if (snd) { sound.disable(); setSnd(false) } else { await sound.enable(); setSnd(true); sound.tick(1.2) } }

  // gate intro
  useEffect(() => {
    gsap.from('.emblem .d', { strokeDasharray: 700, strokeDashoffset: 700, duration: 2.6, ease: 'power2.out', stagger: 0.06 })
    gsap.from('.gate-ui > *', { opacity: 0, y: 16, duration: 1, stagger: 0.12, delay: 1.1, ease: 'power3.out' })
  }, [])

  // custom cursor
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    const dot = document.querySelector<HTMLElement>('.cursor'); if (!dot) return
    const x = gsap.quickTo(dot, 'x', { duration: 0.25, ease: 'power3' }), y = gsap.quickTo(dot, 'y', { duration: 0.25, ease: 'power3' })
    const move = (e: PointerEvent) => { x(e.clientX); y(e.clientY); dot.classList.toggle('hot', !!(e.target as HTMLElement).closest('a,button,.row')) }
    window.addEventListener('pointermove', move); return () => window.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    if (!entered || !cat) return
    const ctx = gsap.context(() => {
      // hero: square window expands to full screen while the jerseys change
      const media = document.querySelector<HTMLElement>('.hz-media')!
      const imgs = gsap.utils.toArray<HTMLElement>('.hz-img')
      const ease = gsap.parseEase('power3.inOut')
      let last = -1
      const apply = (p: number) => {
        const vw = innerWidth, vh = innerHeight, sq = Math.min(vw * 0.32, vh * 0.5), e = ease(clamp(p / 0.38))
        media.style.clipPath = `inset(${(1 - e) * ((vh - sq) / 2)}px ${(1 - e) * ((vw - sq) / 2)}px round ${(1 - e) * 8}px)`
        const idx = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length * 0.999))
        imgs.forEach((im, i) => { im.style.opacity = i === idx ? '1' : '0'; im.style.transform = `scale(${1.04 + p * 0.18})` })
        if (idx !== last) { if (last >= 0) { sound.tick(1 + idx * 0.12); sound.whoosh(idx > last) } last = idx; setStage(idx) }
      }
      apply(0)
      ScrollTrigger.create({ trigger: '.hz', start: 'top top', end: '+=520%', pin: true, scrub: true, onUpdate: (s) => apply(s.progress), onRefresh: (s) => apply(s.progress) })
      gsap.from('.hz-word span', { yPercent: 110, duration: 1.4, stagger: 0.06, ease: 'expo.out' })
      gsap.from('.hz-top > *, .hz-cap', { opacity: 0, y: 14, duration: 1, stagger: 0.08, delay: 0.6 })

      // kinetic statement
      const rows = gsap.utils.toArray<HTMLElement>('.ks-row')
      rows.forEach((r, i) => gsap.fromTo(r, { xPercent: i === 1 ? -22 : 14 }, { xPercent: i === 1 ? 10 : -26, ease: 'none', scrollTrigger: { trigger: '.ks', start: 'top bottom', end: 'bottom top', scrub: true } }))
      gsap.to('.ks-img', { yPercent: -18, rotate: 6, ease: 'none', scrollTrigger: { trigger: '.ks', start: 'top bottom', end: 'bottom top', scrub: true } })
      ScrollTrigger.create({ trigger: '.ks', start: 'top 60%', once: true, onEnter: () => { sound.whoosh(true) } })

      // list
      ScrollTrigger.create({ trigger: '.idx', start: 'top 60%', once: true, onEnter: () => sound.chime() })
      gsap.utils.toArray<HTMLElement>('.row').forEach((r) => gsap.from(r, { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 95%' } }))

      // clubs
      gsap.utils.toArray<HTMLElement>('.cl-row').forEach((r, i) => gsap.fromTo(r, { xPercent: i % 2 ? -30 : 0 }, { xPercent: i % 2 ? 0 : -30, ease: 'none', scrollTrigger: { trigger: '.cl', start: 'top bottom', end: 'bottom top', scrub: true } }))
      ScrollTrigger.create({ trigger: '.cl', start: 'top 50%', once: true, onEnter: () => sound.roar() })

      // numbers
      gsap.utils.toArray<HTMLElement>('.n').forEach((el) => {
        const o = { v: 0 }, end = Number(el.dataset.n)
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => { gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = el.dataset.plain ? String(Math.round(o.v)) : Math.round(o.v).toLocaleString() } }); if (el.dataset.chime) sound.chime() } })
      })
      gsap.from('.fin-word span', { yPercent: 105, duration: 1.2, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: '.fin', start: 'top 70%' } })
      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => sound.setIntensity(s.progress) })

      // magnetic CTA
      const cta = document.querySelector<HTMLElement>('.cta')
      if (cta) {
        const xt = gsap.quickTo(cta, 'x', { duration: 0.5, ease: 'power3' }), yt = gsap.quickTo(cta, 'y', { duration: 0.5, ease: 'power3' })
        cta.addEventListener('pointermove', (e) => { const r = cta.getBoundingClientRect(); xt((e.clientX - r.left - r.width / 2) * 0.35); yt((e.clientY - r.top - r.height / 2) * 0.35) })
        cta.addEventListener('pointerleave', () => { xt(0); yt(0) })
      }
    }, root)
    return () => ctx.revert()
  }, [entered, cat])

  const hoverCol = hover !== null ? list[hover] : null

  return (
    <div className="so" ref={root}>
      <div className="cursor" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <div className="gate" role="dialog" aria-label="Enter FPTSPORTZ">
        <Emblem />
        <div className="gate-ui">
          <p className="mono">FPTSPORTZ — THE SOUND OF THE STANDS</p>
          <button className="gbtn" onClick={() => enter(true)}>Enter with sound</button>
          <button className="glink" onClick={() => enter(false)}>Enter without sound</button>
          <p className="mono dim">Best with headphones</p>
        </div>
      </div>

      <button className={'snd' + (snd ? ' on' : '')} onClick={toggleSound} aria-pressed={snd} aria-label={snd ? 'Turn sound off' : 'Turn sound on'}>
        <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span><span className="mono">Sound {snd ? 'on' : 'off'}</span>
      </button>

      <section className="hz">
        <div className="hz-media" aria-hidden="true">
          {stages.map((c, i) => <div className="hz-img" key={i} style={{ opacity: i === 0 ? 1 : 0 }}><img className="bg" src={img(c, 500)} alt="" /><img className="fg" src={img(c, 1000)} alt="" /></div>)}
        </div>
        <div className="hz-top mono"><span>FPTSPORTZ®</span><span>EST. 2017 — 270K+ ORDERS</span><span aria-hidden="true">SCROLL</span></div>
        <h1 className="hz-word" aria-label="FPTSPORTZ">{[...'FPTSPORTZ'].map((c, i) => <span key={i} aria-hidden="true">{c}</span>)}</h1>
        <p className="hz-cap mono"><b>{String(stage + 1).padStart(2, '0')}</b> / 06 — {STAGES[stage]}</p>
      </section>

      <section className="ks" aria-label="Statement">
        <div className="ks-img" aria-hidden="true">{cat && <img src={img(find('World Cup'), 700)} alt="" />}</div>
        <div className="ks-line"><div className="ks-row">WEAR THE WEAR THE WEAR THE</div></div>
        <div className="ks-line"><div className="ks-row ser">legends <i>legends</i> legends</div></div>
        <div className="ks-line"><div className="ks-row">LIVE THE GAME LIVE THE GAME</div></div>
        <p className="ks-copy">Not just a jersey shop. A place where the stands get dressed. Over 3,000 styles, 270K+ orders and every era of the game, from 1950s retro to this season.</p>
      </section>

      <section className="idx" aria-label="Collections">
        <div className="idx-head mono"><span>THE COLLECTIONS</span><span>{list.length} / 18</span></div>
        <ul className="list" onMouseLeave={() => setHover(null)}>
          {list.map((c, i) => (
            <li className="row" key={c.handle} data-dim={hover !== null && hover !== i} onMouseEnter={() => { setHover(i); sound.tick(0.9 + (i % 6) * 0.1) }}>
              <a href={`${STORE}/collections/${c.handle}`} target="_blank" rel="noreferrer" onClick={() => sound.click()}>
                <span className="mono no">{String(i + 1).padStart(2, '0')}</span><span className="nm">{c.title}</span><span className="mono ct">{c.count}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className={'preview' + (hoverCol ? ' show' : '')} aria-hidden="true">{hoverCol && <img key={hoverCol.handle} src={img(hoverCol, 900)} alt="" />}</div>
      </section>

      <section className="cl" aria-label="Clubs and nations">
        <div className="cl-bg" aria-hidden="true">{cat && <img src={img(find('Liga MX'), 1200)} alt="" />}</div>
        {CLUBS.map((row, i) => <div className="cl-line" key={i}><div className="cl-row">{[...row, ...row].map((c, j) => <span key={j} className={(i + j) % 3 === 0 ? 'o' : ''}>{c}</span>)}</div></div>)}
      </section>

      <section className="fin">
        <div className="nums">
          {[['270', 'K+', 'orders fulfilled', '1'], ['3197', '', 'styles in the archive', ''], ['7', '+', 'years in the game', ''], ['2017', '', 'founded', '']].map(([n, s, l, ch]) => (
            <div key={l}><b><span className="n" data-n={n} data-chime={ch || undefined} data-plain={l === 'founded' ? '1' : undefined}>0</span><small>{s}</small></b><span className="mono">{l}</span></div>
          ))}
        </div>
        <h2 className="fin-word" aria-label="Enter the store">{[...'ENTER THE'].map((c, i) => <span key={i} aria-hidden="true">{c === ' ' ? ' ' : c}</span>)}<br />{[...'STORE'].map((c, i) => <span className="ser" key={i} aria-hidden="true">{c}</span>)}</h2>
        <a className="cta" href={STORE} target="_blank" rel="noreferrer" onClick={() => sound.click()} onMouseEnter={() => sound.tick(1.3)}><span>Shop<br />now</span></a>
        <footer className="foot mono"><span>© 2017–{new Date().getFullYear()} FPTSPORTZ</span><a href="https://instagram.com/fptsportz">@fptsportz</a><a href="mailto:customercare@fptsportz.com">customercare@fptsportz.com</a><span>CONCEPT PREVIEW</span></footer>
      </section>
    </div>
  )
}
