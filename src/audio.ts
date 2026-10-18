// Procedural stadium sound design (Web Audio, zero asset files).
// Ambient bed = chord pad + low heartbeat + crowd noise; events = whistle, tick, click, whoosh, chime, roar.

const CHORDS = [
  [110.0, 164.81, 220.0, 261.63], // Am
  [87.31, 130.81, 174.61, 220.0], // F
  [130.81, 196.0, 261.63, 329.63], // C
  [98.0, 146.83, 196.0, 246.94], // G
]

class SoundEngine {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private analyser!: AnalyserNode
  private noise!: AudioBuffer
  private padFilter!: BiquadFilterNode
  private padOsc: OscillatorNode[] = []
  private crowdGain!: GainNode
  private timers: number[] = []
  private chord = 0
  private on = false
  private beat = 0

  get enabled() { return this.on }

  async enable() {
    if (!this.ctx) this.build()
    const ctx = this.ctx!
    if (ctx.state === 'suspended') await ctx.resume()
    this.on = true
    this.master.gain.cancelScheduledValues(ctx.currentTime)
    this.master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.4)
    if (!this.timers.length) this.startLoops()
  }

  disable() {
    this.on = false
    if (!this.ctx) return
    this.master.gain.cancelScheduledValues(this.ctx.currentTime)
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15)
  }

  /** RMS level 0..1 of the master output (for visualisers and verification). */
  level() {
    if (!this.ctx) return 0
    const buf = new Uint8Array(this.analyser.fftSize)
    this.analyser.getByteTimeDomainData(buf)
    let sum = 0
    for (const v of buf) { const x = (v - 128) / 128; sum += x * x }
    return Math.sqrt(sum / buf.length)
  }

  private build() {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    this.ctx = ctx
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18; comp.ratio.value = 4
    this.master = ctx.createGain(); this.master.gain.value = 0
    this.analyser = ctx.createAnalyser(); this.analyser.fftSize = 1024
    this.master.connect(comp); comp.connect(this.analyser); this.analyser.connect(ctx.destination)

    // 2s of noise, softened toward pink
    this.noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0
    for (let i = 0; i < d.length; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.2
    }

    // pad
    this.padFilter = ctx.createBiquadFilter(); this.padFilter.type = 'lowpass'; this.padFilter.frequency.value = 700; this.padFilter.Q.value = 0.7
    const padGain = ctx.createGain(); padGain.gain.value = 0.055
    this.padFilter.connect(padGain); padGain.connect(this.master)
    for (let i = 0; i < 4; i++) {
      for (const detune of [-7, 7]) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = CHORDS[0][i]; o.detune.value = detune
        const g = ctx.createGain(); g.gain.value = 0.25
        o.connect(g); g.connect(this.padFilter); o.start(); this.padOsc.push(o)
      }
    }
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07
    const lfoG = ctx.createGain(); lfoG.gain.value = 260
    lfo.connect(lfoG); lfoG.connect(this.padFilter.frequency); lfo.start()

    // crowd bed
    const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.5
    this.crowdGain = ctx.createGain(); this.crowdGain.gain.value = 0.05
    src.connect(bp); bp.connect(this.crowdGain); this.crowdGain.connect(this.master); src.start()
    const swell = ctx.createOscillator(); swell.frequency.value = 0.09
    const swellG = ctx.createGain(); swellG.gain.value = 0.03
    swell.connect(swellG); swellG.connect(this.crowdGain.gain); swell.start()
  }

  private startLoops() {
    const ctx = this.ctx!
    // chord changes every 6s with a glide
    this.timers.push(window.setInterval(() => {
      if (!this.on) return
      this.chord = (this.chord + 1) % CHORDS.length
      this.padOsc.forEach((o, i) => o.frequency.setTargetAtTime(CHORDS[this.chord][Math.floor(i / 2)], ctx.currentTime, 1.2))
    }, 6000))
    // low heartbeat, 72 bpm
    this.timers.push(window.setInterval(() => {
      if (!this.on) return
      const t = ctx.currentTime
      const o = ctx.createOscillator(); o.type = 'sine'
      o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.28)
      const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(this.beat % 4 === 0 ? 0.32 : 0.2, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34)
      o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.4); this.beat++
    }, 833))
  }

  /** 0..1 scroll-driven intensity: opens the pad filter and lifts the crowd. */
  setIntensity(x: number) {
    if (!this.ctx || !this.on) return
    const t = this.ctx.currentTime
    this.padFilter.frequency.setTargetAtTime(500 + x * 1700, t, 0.4)
    this.crowdGain.gain.setTargetAtTime(0.04 + x * 0.06, t, 0.5)
  }

  private env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  }

  whistle() {
    if (!this.ctx || !this.on) return
    const ctx = this.ctx, t = ctx.currentTime
    const g = ctx.createGain(); this.env(g, t, 0.22, 0.03, 0.62)
    const trem = ctx.createGain(); trem.gain.value = 0.7
    const lfo = ctx.createOscillator(); lfo.frequency.value = 31
    const lfoG = ctx.createGain(); lfoG.gain.value = 0.3
    lfo.connect(lfoG); lfoG.connect(trem.gain)
    for (const f of [2720, 3010]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * 1.025, t + 0.5)
      o.connect(trem); o.start(t); o.stop(t + 0.75)
    }
    trem.connect(g); g.connect(this.master); lfo.start(t); lfo.stop(t + 0.75)
    this.noiseBurst(t, 0.5, 3200, 0.06, 5)
  }

  private noiseBurst(t: number, dur: number, freq: number, gain: number, q = 1) {
    const ctx = this.ctx!
    const s = ctx.createBufferSource(); s.buffer = this.noise
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q
    const g = ctx.createGain(); this.env(g, t, gain, dur * 0.2, dur * 0.8)
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + dur + 0.1)
  }

  tick(pitch = 1) {
    if (!this.ctx || !this.on) return
    const ctx = this.ctx, t = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = 1500 * pitch
    const g = ctx.createGain(); this.env(g, t, 0.07, 0.003, 0.05)
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.08)
  }

  click() {
    if (!this.ctx || !this.on) return
    const ctx = this.ctx, t = ctx.currentTime
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.2)
    const g = ctx.createGain(); this.env(g, t, 0.4, 0.004, 0.22)
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 0.3)
    this.noiseBurst(t, 0.08, 2400, 0.12, 1)
  }

  whoosh(up = true) {
    if (!this.ctx || !this.on) return
    const ctx = this.ctx, t = ctx.currentTime
    const s = ctx.createBufferSource(); s.buffer = this.noise
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.4
    f.frequency.setValueAtTime(up ? 250 : 3000, t); f.frequency.exponentialRampToValueAtTime(up ? 3200 : 250, t + 0.7)
    const g = ctx.createGain(); this.env(g, t, 0.2, 0.3, 0.45)
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t, Math.random()); s.stop(t + 0.9)
  }

  chime() {
    if (!this.ctx || !this.on) return
    const ctx = this.ctx, t = ctx.currentTime
    ;[880, 1318.5, 1760].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f
      const g = ctx.createGain(); this.env(g, t + i * 0.09, 0.09, 0.01, 1.4)
      o.connect(g); g.connect(this.master); o.start(t + i * 0.09); o.stop(t + 1.7)
    })
  }

  roar() {
    if (!this.ctx || !this.on) return
    const ctx = this.ctx, t = ctx.currentTime
    const s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.6
    f.frequency.setValueAtTime(380, t); f.frequency.exponentialRampToValueAtTime(1500, t + 0.9); f.frequency.exponentialRampToValueAtTime(600, t + 2.4)
    const g = ctx.createGain(); this.env(g, t, 0.34, 0.8, 1.9)
    s.connect(f); f.connect(g); g.connect(this.master); s.start(t); s.stop(t + 3)
  }
}

export const sound = new SoundEngine()
