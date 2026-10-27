import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion'
import './header.css'
import { CONTACT, ease } from './ui'

/* Fixed header whose bottom edge is a paint line: a roller rolls it across as you scroll. */
export function Header({ logo, links, current }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 })
  const left = useTransform(p, (v) => `${v * 100}%`)

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

  return (
    <header className="hd" data-open={open}>
      <div className="hd__in">
        <a className="hd__logo" href="#top" aria-label="JB'S Pro Painters LLC, back to top"><img src={logo} alt="" width="46" height="46" /><span>JB&rsquo;S Pro Painters</span></a>
        <nav className="hd__nav" aria-label="Primary">
          {links.map((l) => {
            const on = (!!current && current === l.id) || (l.href.startsWith('#') && active === l.href.slice(1))
            return (
              <motion.a key={l.label} href={l.href} className="hd__a" data-on={on} initial="rest" whileHover="hover" whileFocus="hover" animate={on ? 'hover' : 'rest'} onClick={() => setOpen(false)}>
                <motion.i className="hd__swipe" variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.45, ease }} aria-hidden="true" />
                <span>{l.label}</span>
              </motion.a>
            )
          })}
        </nav>
        <div className="hd__r">
          <a className="hd__tel" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
          <a className="hd__cta" href={links.find((l) => l.cta)?.href || '#estimate'}>Free estimate</a>
          <button type="button" className="hd__menu" aria-expanded={open} aria-controls="hd-panel" onClick={() => setOpen((o) => !o)}>
            <span>{open ? 'Close' : 'Menu'}</span><i aria-hidden="true" data-open={open} />
          </button>
        </div>
      </div>
      <div className="hd__line" aria-hidden="true"><motion.i style={{ scaleX: p }} /><motion.span style={{ left }} className="hd__roll">
        <svg viewBox="0 0 40 24" width="34" height="20"><rect x="1" y="1" width="30" height="10" rx="4" fill="#0a1433" /><rect x="4" y="3" width="24" height="2.5" rx="1.2" fill="#ffffff55" /><path d="M31 6 H36 V15 H20 V20" fill="none" stroke="#9aa6c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </motion.span></div>
      <AnimatePresence>
        {open && (
          <motion.div id="hd-panel" className="hd__panel" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.6, ease }}>
            <nav aria-label="Menu">
              {links.map((l, i) => <motion.a key={l.label} href={l.href} onClick={() => setOpen(false)} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease }}>{l.label}</motion.a>)}
            </nav>
            <motion.div className="hd__pcta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <a className="hd__pbtn" href={links.find((l) => l.cta)?.href || '#estimate'} onClick={() => setOpen(false)}>Get a free estimate</a>
              <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
