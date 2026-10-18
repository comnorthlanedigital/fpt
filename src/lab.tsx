import React from 'react'
import ReactDOM from 'react-dom/client'
import SculptureHero from '@/components/ui/liquid-sculpture-hero'
import { SplineSceneBasic } from '@/components/ui/spline-demo'
import './lab.css'

// Component lab: the FPT logo run through the liquid-particle hero, plus the Spline 3D card.
function Lab() {
  return (
    <main>
      <SculptureHero
        src="/img/logo-alpha.png"
        darkSrc="/img/logo-alpha.png"
        mobileSrc="/img/logo-alpha.png"
        mobileDarkSrc="/img/logo-alpha.png"
        imageAlt="FPTSPORTZ logo"
        theme="dark"
        themeToggle={false}
        darkBackground="#050605"
        accentColor="#e8c35a"
        brand="FPTSPORTZ"
        navLinks={[{ label: 'New drops', href: '#' }, { label: 'Customize', href: '#' }, { label: 'Leagues', href: '#' }]}
        navCta={{ label: 'Cart', href: 'https://fptsportz.myshopify.com/cart' }}
        eyebrow="Since 2017 · 270K+ orders"
        headline={'Wear the\nlegends.'}
        headlineAccent="legends."
        body="Every club. Every country. Every era. Over 3,000 jerseys with your name and number made right."
        primaryCta={{ label: 'Shop new drops', href: 'https://fptsportz.myshopify.com/collections' }}
        secondaryCta={{ label: 'Customize yours', href: '#' }}
        hint="Move across the badge"
        backdropText="fpt"
        particleDensity={0.5}
      />
      <section style={{ padding: '80px 4vw' }}>
        <SplineSceneBasic />
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Lab />)
