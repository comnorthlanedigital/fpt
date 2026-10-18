import { useState } from 'react'

const THEMES = [
  { id: 'gold', label: 'Black & Gold', body: '#0c0c0b', trim: '#d6a93f', text: '#f0cf6a', stripe: '#d6a93f' },
  { id: 'green', label: 'El Tri Green', body: '#0f7a3a', trim: '#ffffff', text: '#ffffff', stripe: '#c8102e' },
  { id: 'sky', label: 'Albiceleste', body: '#6cb4e8', trim: '#ffffff', text: '#0d2a52', stripe: '#ffffff' },
  { id: 'yellow', label: 'Seleção', body: '#f7d117', trim: '#0a8a3c', text: '#0a3d91', stripe: '#0a8a3c' },
  { id: 'white', label: 'Clean White', body: '#f3f1ec', trim: '#111111', text: '#111111', stripe: '#111111' },
]

export default function Customizer() {
  const [name, setName] = useState('LEGEND')
  const [num, setNum] = useState('10')
  const [theme, setTheme] = useState(THEMES[0])
  const nm = name.toUpperCase().slice(0, 12)
  const nameSize = Math.min(44, 330 / Math.max(nm.length, 1) * 1.45)

  return (
    <div className="cz">
      <div className="cz-stage" data-reveal>
        <svg viewBox="0 0 400 460" role="img" aria-label={`Jersey back with ${nm} ${num}`}>
          <defs>
            <linearGradient id="fab" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".18" />
              <stop offset=".5" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity=".28" />
            </linearGradient>
            <pattern id="mesh" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="6" fill="none" /><rect width="1" height="6" fill="#000" opacity=".07" />
            </pattern>
          </defs>
          <ellipse cx="200" cy="440" rx="130" ry="12" fill="#000" opacity=".5" />
          <g style={{ transition: 'fill .5s' }}>
            <path d="M118 40 L56 72 L14 156 L68 184 L96 146 L96 408 Q200 430 304 408 L304 146 L332 184 L386 156 L344 72 L282 40 Q200 92 118 40Z" fill={theme.body} />
            <path d="M14 156 L68 184 L78 164 L30 138Z M386 156 L332 184 L322 164 L370 138Z" fill={theme.stripe} />
            <path d="M118 40 Q200 92 282 40 L272 36 Q200 78 128 36Z" fill={theme.trim} />
            <path d="M96 392 Q200 414 304 392 L304 408 Q200 430 96 408Z" fill={theme.stripe} />
          </g>
          <path d="M118 40 L56 72 L14 156 L68 184 L96 146 L96 408 Q200 430 304 408 L304 146 L332 184 L386 156 L344 72 L282 40 Q200 92 118 40Z" fill="url(#mesh)" />
          <path d="M118 40 L56 72 L14 156 L68 184 L96 146 L96 408 Q200 430 304 408 L304 146 L332 184 L386 156 L344 72 L282 40 Q200 92 118 40Z" fill="url(#fab)" />
          <text x="200" y="136" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize={nameSize} letterSpacing="3" fill={theme.text}>{nm}</text>
          <text x="200" y="298" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="170" fill={theme.text}>{num || '0'}</text>
        </svg>
      </div>

      <div className="cz-panel" data-reveal>
        <p className="eyebrow">Made for you</p>
        <h2 className="h2">Your name.<br /><span className="gold">Your number.</span></h2>
        <p className="lede">See it before you buy it. Personalization is picked right here, no hunting for a note box at checkout.</p>
        <label>Name<input value={name} maxLength={12} onChange={(e) => setName(e.target.value)} /></label>
        <label>Number<input value={num} inputMode="numeric" maxLength={2} onChange={(e) => setNum(e.target.value.replace(/\D/g, ''))} /></label>
        <div className="swatches" role="radiogroup" aria-label="Kit style">
          {THEMES.map((t) => (
            <button key={t.id} role="radio" aria-checked={t.id === theme.id} className={t.id === theme.id ? 'on' : ''} onClick={() => setTheme(t)} title={t.label}>
              <i style={{ background: `linear-gradient(135deg, ${t.body} 55%, ${t.stripe} 55%)` }} />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <a className="btn btn-gold magnetic" href="https://fptsportz.myshopify.com/collections" target="_blank" rel="noreferrer">Find your kit &rarr;</a>
      </div>
    </div>
  )
}
