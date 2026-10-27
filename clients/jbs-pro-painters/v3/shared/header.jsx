import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import './header.css'
import { CONTACT, ease } from './ui'

/* Clean two-part header: a quiet trust strip (scrolls away) over a sticky white bar. */
export function Header({ logo, links, current }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })

  useEffect(() => {
    const ids = links.filter((l) => l.href.startsWith('#')).map((l) => l.href.slice(1))
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    ids.forEach((id) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [links])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const k = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', k); return () => { removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [open])

  const cta = links.find((l) => l.cta)?.href || '#estimate'
  return (
    <>
      <div className="tb"><div className="tb__in">
        <span>Licensed &bull; Insured &bull; Owner-operated</span>
        <span className="tb__r">East Valley, Arizona &nbsp;&middot;&nbsp; <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></span>
      </div></div>
      <header className="hd" data-open={open}>
        <div className="hd__in">
          <a className="hd__logo" href="#top" aria-label="JB'S Pro Painters LLC, back to top"><img src={logo} alt="" width="48" height="48" /><span>JB&rsquo;S Pro Painters</span></a>
          <nav className="hd__nav" aria-label="Primary">
            {links.map((l) => {
              const on = (!!current && current === l.id) || (l.href.startsWith('#') && active === l.href.slice(1))
              return <a key={l.label} href={l.href} className="hd__a" aria-current={on ? 'true' : undefined} onClick={() => setOpen(false)}>{l.label}</a>
            })}
          </nav>
          <div className="hd__r">
            <a className="hd__tel" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
            <a className="hd__cta" href={cta}>Free estimate</a>
            <button type="button" className="hd__menu" aria-expanded={open} aria-controls="hd-panel" onClick={() => setOpen((o) => !o)}>{open ? 'Close' : 'Menu'}</button>
          </div>
        </div>
        <motion.i className="hd__bar" style={{ scaleX: p }} aria-hidden="true" />
        <AnimatePresence>
          {open && (
            <motion.div id="hd-panel" className="hd__panel" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3, ease }}>
              <nav aria-label="Menu">{links.map((l) => <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}</nav>
              <div className="hd__pcta">
                <a className="hd__pbtn" href={cta} onClick={() => setOpen(false)}>Get a free estimate</a>
                <a href={`tel:${CONTACT.tel}`}>Call {CONTACT.phone}</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
