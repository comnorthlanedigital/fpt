import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sound, BEDS } from './sound'
import './shared.css'

export const CONTACT = { phone: '(602) 473-0415', tel: '+16024730415', email: 'jbspropainters@gmail.com' }
export const AREAS = ['Gilbert', 'Mesa', 'Chandler', 'Tempe', 'Scottsdale', 'Queen Creek']
export const SERVICES = [
  ['Exterior painting', 'Stucco, trim and garage doors with crisp lines and clean finishes.'],
  ['Interior painting', 'Walls, ceilings, doors and trim, from soft neutrals to bold color.'],
  ['Cabinet refinishing', 'A new kitchen look without the remodel.'],
  ['Doors and wood stain', 'Weathered wood brought back to a rich, even color.'],
  ['Commercial repaints', 'Restaurants, warehouses and shops, planned around your space.'],
  ['Accent walls and details', 'Stripes and color blocks, taped and cut sharp.'],
]
export const REVIEW = { quote: 'JB’S Pro Painters LLC did an outstanding job painting the exterior…', who: 'Kenneth R., Facebook review (excerpt)' }

/* ---------- sound ---------- */
export function useSound(bedName) {
  const [on, setOn] = useState(false)
  const toggle = async () => {
    if (sound.enabled) { sound.disable(); setOn(false) } else { await sound.enable(BEDS[bedName]); setOn(true); sound.chime(76) }
  }
  return [on, toggle]
}

export function SoundToggle({ on, toggle, className = '' }) {
  const bars = useRef([])
  useEffect(() => {
    if (!on) return
    const id = setInterval(() => {
      const l = sound.level()
      bars.current.forEach((b, i) => { if (b) b.style.transform = `scaleY(${0.25 + Math.min(1, l * (1.2 + i * 0.35) + Math.random() * 0.15) * 0.75})` })
    }, 70)
    return () => clearInterval(id)
  }, [on])
  return (
    <button type="button" className={`snd ${className}`} onClick={toggle} aria-pressed={on} aria-label={on ? 'Turn sound off' : 'Turn sound on'}>
      <svg className="snd__ic" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" />
        {on ? <><path d="M15.5 9a4 4 0 0 1 0 6" /><path d="M18 6.5a7.5 7.5 0 0 1 0 11" /></> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
      </svg>
      <span className="snd__bars" aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} ref={(el) => (bars.current[i] = el)} style={on ? undefined : { transform: 'scaleY(.25)' }} />)}</span>
      <span className="snd__t">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}

/* ---------- estimate form ---------- */
async function sendLead(form) {
  const data = new URLSearchParams(new FormData(form))
  try {
    const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() })
    if (r.ok) return 'sent'
  } catch (_) { /* previews and offline: fall through to email */ }
  const body = [...new FormData(form)].filter(([k, v]) => v && !['form-name', 'bot'].includes(k)).map(([k, v]) => `${k}: ${v}`).join('\n')
  location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent('Free estimate request')}&body=${encodeURIComponent(body)}`
  return 'mailto'
}

export function Estimate({ id = 'estimate', title, lead, extra, aside, children }) {
  const [errs, setErrs] = useState({})
  const [state, setState] = useState('idle')
  const [msg, setMsg] = useState('')
  const ref = useRef(null)
  const submit = async (e) => {
    e.preventDefault()
    const f = ref.current
    if (f.bot.value) return
    const e2 = {}
    if (f.name.value.trim().length < 2) e2.name = 'Please enter your name.'
    if (f.phone.value.replace(/\D/g, '').length < 10) e2.phone = 'Enter a 10-digit phone number.'
    if (f.email.value.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value.trim())) e2.email = 'Check the email address.'
    setErrs(e2)
    const first = Object.keys(e2)[0]
    if (first) { f[first].focus(); sound.tick(0.7); return }
    setState('sending')
    const r = await sendLead(f)
    setMsg(r === 'sent' ? 'Thanks! We’ll be in touch soon.' : `Your email app should open with your details. You can also call or text ${CONTACT.phone}.`)
    setState('done'); sound.chime(79); f.reset()
  }
  return (
    <section className="est" id={id} aria-labelledby={`${id}-t`}>
      <div className="est__in">
        <div className="est__copy">
          <h2 id={`${id}-t`}>{title}</h2>
          <p>{lead}</p>
          <a className="est__phone" href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a>
          <p className="est__sub">Call or text. {CONTACT.email}</p>
          {aside}
        </div>
        <form ref={ref} name="quote" method="post" onSubmit={submit} noValidate className="est__form">
          <input type="hidden" name="form-name" value="quote" /><input type="hidden" name="request" value="Free estimate" />
          {extra}
          <p className="hp" aria-hidden="true"><label>Leave empty<input name="bot" tabIndex={-1} autoComplete="off" /></label></p>
          <label>Name<input name="name" autoComplete="name" required aria-invalid={!!errs.name} aria-describedby="e-name" /><span id="e-name" className="err" role="alert">{errs.name}</span></label>
          <label>Phone<input name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={!!errs.phone} aria-describedby="e-phone" /><span id="e-phone" className="err" role="alert">{errs.phone}</span></label>
          <label>Email (optional)<input name="email" type="email" autoComplete="email" aria-invalid={!!errs.email} aria-describedby="e-email" /><span id="e-email" className="err" role="alert">{errs.email}</span></label>
          <label>City<select name="city">{[...AREAS, 'Other'].map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="full">Project<select name="project">{['Exterior painting', 'Interior painting', 'Cabinets', 'Doors / wood stain', 'Commercial', 'Something else'].map((c) => <option key={c}>{c}</option>)}</select></label>
          {children}
          <label className="full">Details<textarea name="message" placeholder="Rooms, size, timing, colors you like" /></label>
          <button className="est__go" type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Send my estimate request'}</button>
          <p className="ok full" role="status">{state === 'done' ? msg : ''}</p>
          <p className="note full">We’ll use these details to reply about your estimate. <LegalLink which="privacy">Privacy policy</LegalLink></p>
        </form>
      </div>
    </section>
  )
}

/* ---------- legal ---------- */
const LEGAL = {
  privacy: ['Privacy policy', 'When you send the estimate form we collect your name, phone number, optional email, city and the project details you type. We use them only to reply to your request and quote the job. We do not sell your information. Questions, or want your details removed? Email jbspropainters@gmail.com.'],
  terms: ['Terms of use', 'The photos and descriptions on this site show past JB’S Pro Painters LLC projects and are for general information. Colors on screen can differ from paint in person. Estimates are provided separately and are not binding until agreed in writing. Content on this site belongs to JB’S Pro Painters LLC; please do not copy it without permission.'],
}
let openLegal = () => {}
export function LegalLink({ which, children }) {
  return <button type="button" className="linkbtn" onClick={() => openLegal(which)}>{children}</button>
}
export function Footer() {
  const [which, setWhich] = useState(null)
  const dlg = useRef(null)
  useEffect(() => { openLegal = (w) => setWhich(w) }, [])
  useEffect(() => { if (which) dlg.current?.showModal() }, [which])
  return (
    <>
      <footer className="foot">
        <span>&copy; JB&rsquo;S Pro Painters LLC. Licensed &bull; Insured. Quality &bull; Precision &bull; Perfection.</span>
        <span><LegalLink which="privacy">Privacy</LegalLink><LegalLink which="terms">Terms</LegalLink></span>
      </footer>
      <dialog ref={dlg} className="legal" onClose={() => setWhich(null)} onClick={(e) => e.target === dlg.current && dlg.current.close()}>
        {which && <><h3>{LEGAL[which][0]}</h3><p>{LEGAL[which][1]}</p><p className="legal__n">Sample draft for owner review. Not legal advice.</p></>}
        <button type="button" className="legal__x" onClick={() => dlg.current.close()}>Close</button>
      </dialog>
    </>
  )
}

export function MobileBar() {
  // appears once the first screen has been scrolled past, so it never covers the hero's own action
  const [show, setShow] = useState(false)
  useEffect(() => {
    const f = () => setShow(window.scrollY > window.innerHeight * 0.75)
    f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f)
  }, [])
  return (
    <nav className="mbar" data-show={show} aria-label="Contact">
      <a href={`tel:${CONTACT.tel}`}>Call</a><a href={`sms:${CONTACT.tel}`}>Text</a><a href="#estimate" className="mbar__go">Free estimate</a>
    </nav>
  )
}

/* ---------- small helpers ---------- */
export const ease = [0.16, 1, 0.3, 1]
export function Reveal({ children, delay = 0, y = 28, className, as = 'div', ...rest }) {
  const M = motion[as]
  return <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 0.8, ease, delay }} {...rest}>{children}</M>
}
export { motion, AnimatePresence, sound }
if (typeof window !== 'undefined') window.__jbsSound = sound // exposed for automated checks of the audio graph
