import type { AnimationType, SvgData, Theme } from '../types/skeleton'
import { THEME_COLORS } from '../types/skeleton'

/** Interpola entre dos colores hex (#rrggbb) en t ∈ [0, 1] */
function lerpColor(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const ar = (pa >> 16) & 0xff, ag = (pa >> 8) & 0xff, ab = pa & 0xff
  const br = (pb >> 16) & 0xff, bg = (pb >> 8) & 0xff, bb = pb & 0xff
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const b2 = Math.round(ab + (bb - ab) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b2.toString(16).padStart(2, '0')}`
}

/** t ∈ [0,1] → factor 0→1→0 (curva seno, igual que values="A;B;A") */
function sinFactor(t: number): number {
  return Math.sin(t * Math.PI)
}

/**
 * Construye un SVG estático (sin SMIL) con el gradiente en la posición/color
 * correspondiente a `progress` (0→1, un ciclo completo de animación).
 */
export function buildFrameSvg(
  data: SvgData,
  animation: AnimationType,
  theme: Theme,
  progress: number,
): string {
  const { start, mid } = THEME_COLORS[theme]
  const p = progress // 0→1

  let defs: string

  switch (animation) {
    case 'left-right': {
      const tx = -1 + 2 * p
      defs = `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0" gradientTransform="translate(${tx.toFixed(4)}, 0)">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
        </linearGradient>
    </defs>`
      break
    }
    case 'right-left': {
      const tx = 1 - 2 * p
      defs = `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0" gradientTransform="translate(${tx.toFixed(4)}, 0)">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
        </linearGradient>
    </defs>`
      break
    }
    case 'top-bottom': {
      const ty = -1 + 2 * p
      defs = `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="0" y2="1" gradientTransform="translate(0, ${ty.toFixed(4)})">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
        </linearGradient>
    </defs>`
      break
    }
    case 'bottom-top': {
      const ty = 1 - 2 * p
      defs = `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="0" y2="1" gradientTransform="translate(0, ${ty.toFixed(4)})">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
        </linearGradient>
    </defs>`
      break
    }
    case 'diagonal': {
      const td = -1 + 2 * p
      defs = `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="1" gradientTransform="translate(${td.toFixed(4)}, ${td.toFixed(4)})">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
        </linearGradient>
    </defs>`
      break
    }
    case 'pulse': {
      const c = lerpColor(start, mid, sinFactor(p))
      defs = `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${c}" />
            <stop offset="100%" stop-color="${c}" />
        </linearGradient>
    </defs>`
      break
    }
    case 'wave': {
      // 4 stops con phase offsets: 0, 0.15, 0.3, 0.45
      const phase = (offset: number) => {
        const shifted = (p - offset + 1) % 1
        return sinFactor(shifted)
      }
      const c0 = lerpColor(start, mid, phase(0))
      const c1 = lerpColor(mid, start, phase(0.15))
      const c2 = lerpColor(start, mid, phase(0.3))
      const c3 = lerpColor(mid, start, phase(0.45))
      defs = `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${c0}" />
            <stop offset="33%" stop-color="${c1}" />
            <stop offset="66%" stop-color="${c2}" />
            <stop offset="100%" stop-color="${c3}" />
        </linearGradient>
    </defs>`
      break
    }
    case 'radial': {
      // center: mid→start→mid, edge: start→mid→start
      const centerColor = lerpColor(mid, start, sinFactor(p))
      const edgeColor = lerpColor(start, mid, sinFactor(p))
      defs = `    <defs>
        <radialGradient id="skeletonGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${centerColor}" />
            <stop offset="100%" stop-color="${edgeColor}" />
        </radialGradient>
    </defs>`
      break
    }
  }

  return `<svg width="${data.width}" height="${data.height}" viewBox="${data.viewBox}" xmlns="http://www.w3.org/2000/svg">
${defs}
${data.skeletonBody}
</svg>`
}

/** Renderiza un SVG string en un canvas existente */
export function renderSvgToCanvas(svgString: string, canvas: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve()
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to render SVG frame'))
    }
    img.src = url
  })
}
