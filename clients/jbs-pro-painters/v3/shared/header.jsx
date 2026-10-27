import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'framer-motion'
import './header.css'
import { CONTACT, ease } from './ui'

/* Dark navy header that matches the logo's own background. Hides on scroll down, returns on scroll up. */
export function Header({ logo, links, current }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setSolid(y > 12)
    setHidden(!open && y > 160 && y > prev + 2 ? true : y < prev - 2 ? false : hidden)
  })

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
    <motion.header className="hd" data-solid={solid} data-open={open} animate={{ y: hidden && !open ? '-100%' : 0 }} transition={{ duration: 0.4, ease }}>
      <div className="hd__in">
        <a className="hd__logo" href="#top" aria-label="JB'S Pro Painters LLC, back to top"><img src={logo} alt="" height="46" /><span>JB&rsquo;S Pro Painters</span></a>
        <nav className="hd__nav" aria-label="Primary">
          {links.filter((l) => !l.cta).map((l) => {
            const on = (!!current && current === l.id) || (l.href.startsWith('#') && active === l.href.slice(1))
            return <a key={l.label} href={l.href} className="hd__a" aria-current={on ? 'true' : undefined}><span>{l.label}</span></a>
          })}
        </nav>
        <div className="hd__r">
          <a className="hd__tel" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
          <a className="btn btn--sm hd__cta" href={cta}>Free estimate</a>
          <button type="button" className="hd__burger" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="hd-panel" onClick={() => setOpen((o) => !o)}><i /><i /></button>
        </div>
      </div>
      <motion.i className="hd__bar" style={{ scaleX: p }} aria-hidden="true" />
      <AnimatePresence>
        {open && (
          <motion.div id="hd-panel" className="hd__panel" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.55, ease }}>
            <nav aria-label="Menu">
              {links.map((l, i) => (
                <motion.a key={l.label} href={l.href} onClick={() => setOpen(false)} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.6, ease }}>
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div className="hd__pcta" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6, ease }}>
              <a className="btn" href={cta} onClick={() => setOpen(false)}>Get a free estimate</a>
              <a className="hd__pphone" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
              <p>Licensed &bull; Insured &bull; Owner-operated</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
