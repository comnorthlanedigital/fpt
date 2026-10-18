import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type SpinHandle = { setProgress: (p: number) => void; release: () => void }

type Meta = { count: number; w: number; h: number }
let cache: Promise<{ meta: Meta; frames: HTMLImageElement[] }> | null = null

/** Loads the turntable frame sequence once and shares it between canvases. */
export function loadSpin(onProgress?: (done: number, total: number) => void) {
  if (!cache) {
    cache = (async () => {
      const meta: Meta = await (await fetch('/spin/meta.json')).json()
      let done = 0
      const frames = await Promise.all(
        Array.from({ length: meta.count }, (_, i) => new Promise<HTMLImageElement>((res) => {
          const im = new Image()
          im.onload = im.onerror = () => { done++; onProgress?.(done, meta.count); res(im) }
          im.src = `/spin/${String(i).padStart(3, '0')}.webp`
        })),
      )
      return { meta, frames }
    })()
  }
  return cache
}

type Props = { className?: string; draggable?: boolean; auto?: boolean; label?: string }

/** Canvas turntable: idles back and forth, drag to spin like a globe, or drive it with setProgress (scroll). */
const SpinCanvas = forwardRef<SpinHandle, Props>(function SpinCanvas({ className, draggable = false, auto = false, label }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useRef({ cur: 0, target: 0, auto, dir: 1, dragging: false, lastX: 0, resume: 0, ready: false, max: 0 })

  useImperativeHandle(ref, () => ({
    setProgress: (p) => { const s = state.current; s.auto = false; s.target = p * (s.max || 1) },
    release: () => { state.current.auto = true },
  }))

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const s = state.current
    let frames: HTMLImageElement[] = []
    let meta: Meta = { count: 1, w: 1, h: 1 }
    let raf = 0, last = performance.now(), alive = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { clientWidth: w, clientHeight: h } = canvas
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr)
    }
    const ro = new ResizeObserver(fit); ro.observe(canvas); fit()

    const draw = () => {
      const im = frames[Math.round(s.cur)]
      if (!im || !im.naturalWidth) return
      const cw = canvas.width, ch = canvas.height
      const sc = Math.min(cw / meta.w, ch / meta.h)
      const w = meta.w * sc, h = meta.h * sc
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, cw, ch)
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    const tick = (t: number) => {
      if (!alive) return
      const dt = Math.min((t - last) / 1000, 0.05); last = t
      if (s.ready) {
        const max = meta.count - 1
        if (s.auto && !s.dragging && t > s.resume && !reduce) {
          s.target += s.dir * dt * 26
          if (s.target >= max) { s.target = max; s.dir = -1 }
          if (s.target <= 0) { s.target = 0; s.dir = 1 }
        }
        s.cur += (s.target - s.cur) * (1 - Math.pow(0.0008, dt))
        draw()
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    loadSpin().then((r) => { frames = r.frames; meta = r.meta; s.ready = true; s.max = meta.count - 1; s.cur = s.target; draw() })

    const down = (e: PointerEvent) => { if (!draggable) return; s.dragging = true; s.lastX = e.clientX; canvas.setPointerCapture(e.pointerId); canvas.classList.add('grab') }
    const move = (e: PointerEvent) => {
      if (!s.dragging) return
      const dx = e.clientX - s.lastX; s.lastX = e.clientX
      s.target = Math.min(meta.count - 1, Math.max(0, s.target + dx * (meta.count / (canvas.clientWidth * 0.9))))
      s.dir = dx >= 0 ? 1 : -1
    }
    const up = () => { s.dragging = false; s.resume = performance.now() + 1800; canvas.classList.remove('grab') }
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up)

    return () => {
      alive = false; cancelAnimationFrame(raf); ro.disconnect()
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up)
    }
  }, [draggable])

  return <canvas ref={canvasRef} className={className} role="img" aria-label={label ?? 'FPT mini shin guards, 360 degree view'} style={{ touchAction: draggable ? 'pan-y' : undefined }} />
})

export default SpinCanvas
