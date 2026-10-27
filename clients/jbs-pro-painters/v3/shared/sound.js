// Procedural sound for the JB'S sites (Web Audio, zero asset files). Same engine idea as src/audio.ts:
// a quiet ambient bed (pad + filtered noise + optional pulse) plus one-shot events, each site tuning its own bed.

const midi = (n) => 440 * 2 ** ((n - 69) / 12)

class Sound {
  ctx = null
  on = false
  timers = []
  beds = null

  get enabled() { return this.on }

  async enable(bed) {
    if (!this.ctx) this.build()
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    this.on = true
    this.master.gain.cancelScheduledValues(this.ctx.currentTime)
    this.master.gain.setTargetAtTime(0.9, this.ctx.currentTime, 0.35)
    this.setBed(bed)
  }

  disable() {
    this.on = false
    if (!this.ctx) return
    this.master.gain.cancelScheduledValues(this.ctx.currentTime)
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.12)
  }

  level() {
    if (!this.ctx || !this.on) return 0
    const buf = new Uint8Array(this.analyser.fftSize)
    this.analyser.getByteTimeDomainData(buf)
    let sum = 0
    for (const v of buf) { const x = (v - 128) / 128; sum += x * x }
    return Math.min(1, Math.sqrt(sum / buf.length) * 5)
  }

  build() {
    const ctx = (this.ctx = new (window.AudioContext || window.webkitAudioContext)())
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -20; comp.ratio.value = 4
    this.master = ctx.createGain(); this.master.gain.value = 0
    this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 1024
    this.master.connect(comp); comp.connect(this.analyser); this.analyser.connect(ctx.destination)
    // 2s pink-ish noise
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2
    }
    // always-on layers, volumes set by setBed
    this.padFilter = ctx.createBiquadFilter(); this.padFilter.type = 'lowpass'; this.padFilter.Q.value = 0.7
    this.padGain = ctx.createGain(); this.padGain.gain.value = 0
    this.padFilter.connect(this.padGain); this.padGain.connect(this.master)
    this.padOsc = []
    for (let i = 0; i < 4; i++) for (const detune of [-6, 6]) {
      const o = ctx.createOscillator(); o.frequency.value = 220; o.detune.value = detune
      const g = ctx.createGain(); g.gain.value = 0.25
      o.connect(g); g.connect(this.padFilter); o.start(); this.padOsc.push(o)
    }
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07
    this.lfoG = ctx.createGain(); this.lfoG.gain.value = 200
    lfo.connect(this.lfoG); this.lfoG.connect(this.padFilter.frequency); lfo.start()
    const air = ctx.createBufferSource(); air.buffer = this.noise; air.loop = true
    this.airF = ctx.createBiquadFilter(); this.airF.type = 'bandpass'; this.airF.Q.value = 0.5
    this.airG = ctx.createGain(); this.airG.gain.value = 0
    air.connect(this.airF); this.airF.connect(this.airG); this.airG.connect(this.master); air.start()
    // continuous roller / scrape layer (silent until driven)
    const rl = ctx.createBufferSource(); rl.buffer = this.noise; rl.loop = true
    this.rollF = ctx.createBiquadFilter(); this.rollF.type = 'bandpass'; this.rollF.frequency.value = 900; this.rollF.Q.value = 0.8
    this.rollG = ctx.createGain(); this.rollG.gain.value = 0
    rl.connect(this.rollF); this.rollF.connect(this.rollG); this.rollG.connect(this.master); rl.start()
  }

  /** bed = { chord:[midi notes x4], chords?:[[...]], wave, cutoff, pad, air:{freq,gain}, pulse?:ms } */
  setBed(bed) {
    if (!this.ctx || !bed) return
    const ctx = this.ctx, t = ctx.currentTime
    this.timers.forEach(clearInterval); this.timers = []
    this.bed = bed
    this.padOsc.forEach((o, i) => { o.type = bed.wave || 'sawtooth'; o.frequency.setTargetAtTime(midi(bed.chords[0][Math.floor(i / 2)]), t, 0.3) })
    this.padFilter.frequency.setTargetAtTime(bed.cutoff || 700, t, 0.3)
    this.padGain.gain.setTargetAtTime(bed.pad ?? 0.05, t, 0.6)
    this.airF.frequency.value = bed.air?.freq || 600
    this.airG.gain.setTargetAtTime(bed.air?.gain ?? 0.03, t, 0.6)
    let c = 0
    if (bed.chords.length > 1) this.timers.push(setInterval(() => {
      if (!this.on) return
      c = (c + 1) % bed.chords.length
      this.padOsc.forEach((o, i) => o.frequency.setTargetAtTime(midi(bed.chords[c][Math.floor(i / 2)]), this.ctx.currentTime, 1.4))
    }, bed.change || 7000))
    if (bed.pulse) this.timers.push(setInterval(() => { if (this.on) this.thud(0.16, 62) }, bed.pulse))
  }

  /** 0..1 intensity: opens the pad filter and lifts the air layer. */
  intensity(x) {
    if (!this.ctx || !this.on || !this.bed) return
    const t = this.ctx.currentTime, base = this.bed.cutoff || 700
    this.padFilter.frequency.setTargetAtTime(base * (0.7 + x * 1.8), t, 0.4)
    this.airG.gain.setTargetAtTime((this.bed.air?.gain ?? 0.03) * (0.6 + x * 1.6), t, 0.5)
  }

  env(g, t, peak, attack, decay) {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  }

  burst(t, dur, freq, gain, q = 1, type = 'bandpass') {
    const ctx = this.ctx
    const s = ctx.createBufferSource(); s.buffer = this.noise
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q
    const g = ctx.createGain(); this.env(g, t, gain, dur * 0.2, dur * 0.8)
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + dur + 0.1)
  }

  tone(freq, t, peak, attack, decay, type = 'sine', slideTo) {
    const ctx = this.ctx
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(freq, t)
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + attack + decay)
    const g = ctx.createGain(); this.env(g, t, peak, attack, decay)
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + attack + decay + 0.1)
  }

  ok() { return this.ctx && this.on }

  /** Drive the continuous roller/brush layer: speed 0..1 (call on pointer move, then roll(0) to stop). */
  roll(speed, bright = 1) {
    if (!this.ok()) return
    const t = this.ctx.currentTime
    this.rollG.gain.setTargetAtTime(Math.min(0.5, speed * 0.5), t, 0.05)
    this.rollF.frequency.setTargetAtTime((500 + speed * 1500) * bright, t, 0.05)
  }

  tick(p = 1) { if (this.ok()) this.tone(1500 * p, this.ctx.currentTime, 0.06, 0.003, 0.05, 'triangle') }
  thud(g = 0.3, f = 90) { if (this.ok()) { const t = this.ctx.currentTime; this.tone(f * 2, t, g, 0.005, 0.28, 'sine', f * 0.45) } }
  click() { if (!this.ok()) return; const t = this.ctx.currentTime; this.tone(180, t, 0.35, 0.004, 0.2, 'sine', 50); this.burst(t, 0.07, 2400, 0.1) }
  clack() { // wall switch: hard plastic click + body knock
    if (!this.ok()) return; const t = this.ctx.currentTime
    this.burst(t, 0.03, 3800, 0.32, 3); this.tone(120, t, 0.38, 0.002, 0.1, 'square', 70); this.burst(t + 0.012, 0.05, 900, 0.18, 2)
  }
  pop() { // paint can lid
    if (!this.ok()) return; const t = this.ctx.currentTime
    this.tone(260, t, 0.35, 0.004, 0.12, 'sine', 90); this.burst(t, 0.05, 1800, 0.2, 2)
    ;[1400, 2100, 3100].forEach((f, i) => this.tone(f, t + 0.015, 0.05 / (i + 1), 0.002, 0.5, 'sine'))
  }
  drip() {
    if (!this.ok()) return; const t = this.ctx.currentTime
    this.tone(900 + Math.random() * 500, t, 0.14, 0.003, 0.16, 'sine', 260)
  }
  whoosh(up = true, dur = 0.7) {
    if (!this.ok()) return
    const ctx = this.ctx, t = ctx.currentTime
    const s = ctx.createBufferSource(); s.buffer = this.noise
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.3
    f.frequency.setValueAtTime(up ? 250 : 3000, t); f.frequency.exponentialRampToValueAtTime(up ? 3200 : 250, t + dur)
    const g = ctx.createGain(); this.env(g, t, 0.18, dur * 0.4, dur * 0.6)
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + dur + 0.2)
  }
  tape() { // pulling painter's tape
    if (!this.ok()) return; const t = this.ctx.currentTime
    const ctx = this.ctx, s = ctx.createBufferSource(); s.buffer = this.noise
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.setValueAtTime(1800, t); f.frequency.linearRampToValueAtTime(5200, t + 0.35)
    const g = ctx.createGain(); this.env(g, t, 0.2, 0.04, 0.34)
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + 0.5)
  }
  scrape() { if (this.ok()) this.burst(this.ctx.currentTime, 0.25, 700, 0.14, 0.9) }
  step() { if (this.ok()) { const t = this.ctx.currentTime; this.tone(80, t, 0.2, 0.004, 0.12, 'sine', 50); this.burst(t, 0.06, 500, 0.06) } }
  buzz() { // fluorescent tube warming up
    if (!this.ok()) return; const t = this.ctx.currentTime
    for (let i = 0; i < 5; i++) this.tone(120, t + i * 0.07 + Math.random() * 0.03, 0.06, 0.002, 0.04, 'square')
    const o = this.ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 120
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0.0001, t + 0.35); g.gain.exponentialRampToValueAtTime(0.03, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + 3)
    o.connect(g); g.connect(this.master); o.start(t + 0.35); o.stop(t + 3.1)
  }
  pluck(note = 60, g = 0.16) { // marimba-ish pluck
    if (!this.ok()) return; const t = this.ctx.currentTime, f = midi(note)
    this.tone(f, t, g, 0.003, 0.7, 'triangle'); this.tone(f * 4, t, g * 0.25, 0.002, 0.12, 'sine')
  }
  chime(root = 81) {
    if (!this.ok()) return; const t = this.ctx.currentTime
    ;[0, 4, 7, 12].forEach((n, i) => this.tone(midi(root + n), t + i * 0.09, 0.08, 0.01, 1.5, 'sine'))
  }
}

export const sound = new Sound()
export const BEDS = {
  roller: { chords: [[48, 55, 59, 64], [45, 52, 57, 62], [41, 48, 52, 57], [43, 50, 55, 59]], wave: 'sine', cutoff: 900, pad: 0.07, air: { freq: 1800, gain: 0.012 }, change: 8000 },
  coats: { chords: [[38, 45, 50, 53], [34, 41, 46, 50], [36, 43, 48, 52]], wave: 'sawtooth', cutoff: 520, pad: 0.05, air: { freq: 420, gain: 0.03 }, change: 9000 },
  board: { chords: [[45, 52, 57, 60], [43, 50, 55, 59], [41, 48, 53, 57]], wave: 'triangle', cutoff: 800, pad: 0.06, air: { freq: 700, gain: 0.025 }, change: 7000 },
  lights: { chords: [[36, 43, 48, 51], [34, 41, 46, 50]], wave: 'sine', cutoff: 450, pad: 0.07, air: { freq: 300, gain: 0.04 }, change: 10000 },
  studio: { chords: [[48, 52, 55, 59], [45, 48, 52, 55], [41, 45, 48, 52], [43, 47, 50, 55]], wave: 'triangle', cutoff: 1100, pad: 0.055, air: { freq: 2200, gain: 0.008 }, change: 6000 },
}
