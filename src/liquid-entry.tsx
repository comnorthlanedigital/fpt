import React from 'react'
import ReactDOM from 'react-dom/client'
import Matchday from './Matchday.jsx'
import SculptureHero from '@/components/ui/liquid-sculpture-hero'
import './matchday.css'

// Matchday, with the FPT badge as a liquid-gold interactive hero.
const hero = (
  <SculptureHero
    src="/img/logo-cut.png"
    darkSrc="/img/logo-cut.png"
    mobileSrc="/img/logo-cut.png"
    mobileDarkSrc="/img/logo-cut.png"
    imageAlt="FPTSPORTZ badge"
    theme="light"
    themeToggle={false}
    showNav={false}
    background="#f2ecdc"
    textColor="#0a0a08"
    accentColor="#f0cf6a"
    headingFont="'Anton', Impact, sans-serif"
    accentFont="'Anton', Impact, sans-serif"
    eyebrow="Since 2017 · 270K+ orders"
    headline={'KITS FOR\nTHE STANDS.'}
    headlineAccent="THE STANDS."
    body="Every club. Every country. Every era. Over 3,000 jerseys with your name and number made right."
    primaryCta={{ label: 'Shop new drops', href: '#drops' }}
    secondaryCta={{ label: 'Customize yours', href: '#customize' }}
    hint="Move across the badge"
    backdropText=""
    particleDensity={0.8}
    mobileSculptureScale={0.68}
    sculptureScale={0.9}
    height="calc(100svh - 110px)"
    className="md-liquid"
  />
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Matchday hero={hero} />
  </React.StrictMode>,
)
