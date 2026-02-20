import type { SvgData, Theme, AnimationType } from '../types/skeleton';
import { THEME_COLORS } from '../types/skeleton';

const SHAPE_TAGS = new Set([
  'path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line',
]);

const SKIP_TAGS = new Set([
  'defs', 'title', 'desc', 'metadata', 'text', 'textpath', 'tspan',
  'image', 'use', 'symbol', 'filter', 'style', 'script',
  'lineargradient', 'radialgradient', 'pattern', 'mask', 'clippath',
  'marker', 'switch', 'foreignobject',
]);

// --- Shape → path d conversion ---

function rectToPath(el: Element): string | null {
  const x = parseFloat(el.getAttribute('x') ?? '0');
  const y = parseFloat(el.getAttribute('y') ?? '0');
  const w = parseFloat(el.getAttribute('width') ?? '0');
  const h = parseFloat(el.getAttribute('height') ?? '0');
  let rx = parseFloat(el.getAttribute('rx') ?? '0');
  let ry = parseFloat(el.getAttribute('ry') ?? '0');
  if (!w || !h) return null;
  rx = Math.min(rx, w / 2);
  ry = Math.min(ry || rx, h / 2);
  if (rx && ry) {
    return `M${x + rx},${y} h${w - 2 * rx} a${rx},${ry} 0 0 1 ${rx},${ry} v${h - 2 * ry} a${rx},${ry} 0 0 1 -${rx},${ry} h-${w - 2 * rx} a${rx},${ry} 0 0 1 -${rx},-${ry} v-${h - 2 * ry} a${rx},${ry} 0 0 1 ${rx},-${ry}Z`;
  }
  return `M${x},${y} h${w} v${h} h-${w}Z`;
}

function circleToPath(el: Element): string | null {
  const cx = parseFloat(el.getAttribute('cx') ?? '0');
  const cy = parseFloat(el.getAttribute('cy') ?? '0');
  const r = parseFloat(el.getAttribute('r') ?? '0');
  if (!r) return null;
  return `M${cx - r},${cy} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 -${2 * r},0Z`;
}

function ellipseToPath(el: Element): string | null {
  const cx = parseFloat(el.getAttribute('cx') ?? '0');
  const cy = parseFloat(el.getAttribute('cy') ?? '0');
  const rx = parseFloat(el.getAttribute('rx') ?? '0');
  const ry = parseFloat(el.getAttribute('ry') ?? '0');
  if (!rx || !ry) return null;
  return `M${cx - rx},${cy} a${rx},${ry} 0 1 0 ${2 * rx},0 a${rx},${ry} 0 1 0 -${2 * rx},0Z`;
}

function polygonToPath(el: Element): string | null {
  const pts = el.getAttribute('points')?.trim();
  if (!pts) return null;
  const c = pts.split(/[\s,]+/);
  if (c.length < 4) return null;
  let d = `M${c[0]},${c[1]}`;
  for (let i = 2; i < c.length; i += 2) d += ` L${c[i]},${c[i + 1]}`;
  return d + 'Z';
}

function polylineToPath(el: Element): string | null {
  const pts = el.getAttribute('points')?.trim();
  if (!pts) return null;
  const c = pts.split(/[\s,]+/);
  if (c.length < 4) return null;
  let d = `M${c[0]},${c[1]}`;
  for (let i = 2; i < c.length; i += 2) d += ` L${c[i]},${c[i + 1]}`;
  return d;
}

function lineToPath(el: Element): string | null {
  return `M${el.getAttribute('x1') ?? '0'},${el.getAttribute('y1') ?? '0'} L${el.getAttribute('x2') ?? '0'},${el.getAttribute('y2') ?? '0'}`;
}

function shapeToPathD(el: Element): string | null {
  switch (el.tagName.toLowerCase()) {
    case 'path': return el.getAttribute('d') ?? null;
    case 'rect': return rectToPath(el);
    case 'circle': return circleToPath(el);
    case 'ellipse': return ellipseToPath(el);
    case 'polygon': return polygonToPath(el);
    case 'polyline': return polylineToPath(el);
    case 'line': return lineToPath(el);
    default: return null;
  }
}

/** Round all numbers in a path d-string */
function simplifyD(d: string, precision = 1): string {
  return d.replace(/-?\d+\.?\d*/g, (m) => {
    const n = parseFloat(m);
    return isNaN(n) ? m : n.toFixed(precision).replace(/\.0$/, '');
  });
}

/** Estimate bounding-box area of a path */
function estimatePathArea(d: string): number {
  const nums = d.match(/-?\d+\.?\d*/g)?.map(Number) ?? [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length - 1; i += 2) {
    if (nums[i] < minX) minX = nums[i];
    if (nums[i] > maxX) maxX = nums[i];
    if (nums[i + 1] < minY) minY = nums[i + 1];
    if (nums[i + 1] > maxY) maxY = nums[i + 1];
  }
  return (maxX - minX) * (maxY - minY);
}

function isHiddenElement(el: Element): boolean {
  if (el.getAttribute('display') === 'none') return true;
  if (el.getAttribute('visibility') === 'hidden') return true;
  const op = el.getAttribute('opacity');
  if (op !== null && parseFloat(op) === 0) return true;
  const style = el.getAttribute('style') ?? '';
  if (/display\s*:\s*none/i.test(style) || /visibility\s*:\s*hidden/i.test(style)) return true;
  const fill = el.getAttribute('fill'), stroke = el.getAttribute('stroke');
  if (fill === 'none' && (stroke === 'none' || !stroke)) return true;
  return false;
}

interface CollectedPath { d: string; transform?: string; }

function collectPaths(node: Element, parentTransform: string, minArea: number): CollectedPath[] {
  const tag = node.tagName.toLowerCase();
  if (SKIP_TAGS.has(tag) || isHiddenElement(node)) return [];
  const localT = node.getAttribute('transform') ?? '';
  const combined = [parentTransform, localT].filter(Boolean).join(' ');

  if (SHAPE_TAGS.has(tag)) {
    const d = shapeToPathD(node);
    if (!d || estimatePathArea(d) < minArea) return [];
    return [{ d: simplifyD(d, 1), transform: combined || undefined }];
  }
  if (tag === 'g' || tag === 'svg') {
    const r: CollectedPath[] = [];
    for (const ch of node.children) r.push(...collectPaths(ch, combined, minArea));
    return r;
  }
  return [];
}

export function parseSvgPrecise(svgString: string): SvgData {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  if (doc.querySelector('parsererror'))
    throw new Error('SVG inválido: ' + (doc.querySelector('parsererror')?.textContent ?? ''));

  const svgEl = doc.documentElement;
  const viewBox = svgEl.getAttribute('viewBox');
  let origW: number, origH: number;
  if (viewBox) { const p = viewBox.split(/[\s,]+/).map(Number); origW = p[2] || 100; origH = p[3] || 100; }
  else { origW = parseFloat(svgEl.getAttribute('width') ?? '100'); origH = parseFloat(svgEl.getAttribute('height') ?? '100'); }

  const width = String(origW), height = String(origH);
  const vb = viewBox ?? `0 0 ${width} ${height}`;
  const minArea = origW * origH * 0.001;
  const paths = collectPaths(svgEl, '', minArea);
  if (!paths.length) throw new Error('No se encontraron formas visibles en el SVG.');

  const lines = paths.map(p => {
    const t = p.transform ? ` transform="${p.transform}"` : '';
    return `        <path d="${p.d}"${t} fill="url(#skeletonGradient)" stroke="none" />`;
  });
  return { width, height, viewBox: vb, skeletonBody: lines.join('\n'), rawSvg: svgString };
}


// ═══════════════════════════════════════════════════════════════════════════
// MODE 2: "Silueta" — Canvas-based contour tracing
//   Flattens all colors, traces outer/inner boundaries with smooth Bézier.
//   Best for: complex/heavy SVGs where you want just the outline shape.
// ═══════════════════════════════════════════════════════════════════════════

function renderSvgToImageData(svgString: string, w: number, h: number): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(ctx.getImageData(0, 0, w, h));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('No se pudo renderizar el SVG')); };
    img.src = url;
  });
}

function buildAlphaGrid(data: ImageData, threshold = 10): Uint8Array {
  const g = new Uint8Array(data.width * data.height);
  for (let i = 0; i < g.length; i++) g[i] = data.data[i * 4 + 3] >= threshold ? 1 : 0;
  return g;
}

function dilate(g: Uint8Array, w: number, h: number, r: number): Uint8Array {
  const o = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let f = false;
      for (let dy = -r; dy <= r && !f; dy++)
        for (let dx = -r; dx <= r && !f; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < w && ny >= 0 && ny < h && g[ny * w + nx]) f = true;
        }
      o[y * w + x] = f ? 1 : 0;
    }
  return o;
}

function erode(g: Uint8Array, w: number, h: number, r: number): Uint8Array {
  const o = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let a = true;
      for (let dy = -r; dy <= r && a; dy++)
        for (let dx = -r; dx <= r && a; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h || !g[ny * w + nx]) a = false;
        }
      o[y * w + x] = a ? 1 : 0;
    }
  return o;
}

function morphClose(g: Uint8Array, w: number, h: number, r: number): Uint8Array {
  return erode(dilate(g, w, h, r), w, h, r);
}

type Pt = [number, number];

/** Extract directed boundary edges and chain them into closed contours */
function chainEdges(grid: Uint8Array, w: number, h: number): Pt[][] {
  const key = (x: number, y: number) => `${x},${y}`;
  const isFilled = (x: number, y: number) =>
    x >= 0 && x < w && y >= 0 && y < h ? grid[y * w + x] === 1 : false;

  const allEdges: { from: Pt; to: Pt; ek: string }[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!grid[y * w + x]) continue;
      if (!isFilled(x, y - 1))
        allEdges.push({ from: [x, y], to: [x + 1, y], ek: key(x, y) + '>' + key(x + 1, y) });
      if (!isFilled(x + 1, y))
        allEdges.push({ from: [x + 1, y], to: [x + 1, y + 1], ek: key(x + 1, y) + '>' + key(x + 1, y + 1) });
      if (!isFilled(x, y + 1))
        allEdges.push({ from: [x + 1, y + 1], to: [x, y + 1], ek: key(x + 1, y + 1) + '>' + key(x, y + 1) });
      if (!isFilled(x - 1, y))
        allEdges.push({ from: [x, y + 1], to: [x, y], ek: key(x, y + 1) + '>' + key(x, y) });
    }
  }

  const fromMap = new Map<string, { ek: string; to: Pt }[]>();
  for (const e of allEdges) {
    const fk = key(e.from[0], e.from[1]);
    if (!fromMap.has(fk)) fromMap.set(fk, []);
    fromMap.get(fk)!.push({ ek: e.ek, to: e.to });
  }

  const used = new Set<string>();
  const contours: Pt[][] = [];
  for (const e of allEdges) {
    if (used.has(e.ek)) continue;
    const contour: Pt[] = [e.from];
    used.add(e.ek);
    let cur = e.to;
    const startKey = key(e.from[0], e.from[1]);
    for (let s = 0; s < allEdges.length + 1; s++) {
      const ck = key(cur[0], cur[1]);
      if (ck === startKey) break;
      contour.push(cur);
      const nexts = fromMap.get(ck);
      if (!nexts) break;
      const next = nexts.find(n => !used.has(n.ek));
      if (!next) break;
      used.add(next.ek);
      cur = next.to;
    }
    if (contour.length >= 4) contours.push(contour);
  }
  return contours;
}

/** Douglas-Peucker simplification */
function simplify(pts: Pt[], eps: number): Pt[] {
  if (pts.length <= 2) return pts;
  let maxD = 0, maxI = 0;
  const [x1, y1] = pts[0], [x2, y2] = pts[pts.length - 1];
  for (let i = 1; i < pts.length - 1; i++) {
    const A = pts[i][0] - x1, B = pts[i][1] - y1, C = x2 - x1, D = y2 - y1;
    const lenSq = C * C + D * D;
    const d = lenSq === 0
      ? Math.sqrt(A * A + B * B)
      : Math.abs(A * D - B * C) / Math.sqrt(lenSq);
    if (d > maxD) { maxD = d; maxI = i; }
  }
  if (maxD > eps) {
    const l = simplify(pts.slice(0, maxI + 1), eps);
    const r = simplify(pts.slice(maxI), eps);
    return [...l.slice(0, -1), ...r];
  }
  return [pts[0], pts[pts.length - 1]];
}

/** Catmull-Rom → Cubic Bézier for smooth curves */
function smoothToBezierD(pts: Pt[], sx: number, sy: number): string {
  if (pts.length < 2) return '';
  const s = (p: Pt): [number, number] => [
    Math.round(p[0] * sx * 10) / 10,
    Math.round(p[1] * sy * 10) / 10,
  ];
  if (pts.length === 2) {
    const [x0, y0] = s(pts[0]), [x1, y1] = s(pts[1]);
    return `M${x0},${y0}L${x1},${y1}Z`;
  }
  const tension = 0.5, n = pts.length;
  const parts: string[] = [];
  const [mx, my] = s(pts[0]);
  parts.push(`M${mx},${my}`);
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const [c1x, c1y] = s([p1[0] + (p2[0] - p0[0]) * tension / 3, p1[1] + (p2[1] - p0[1]) * tension / 3]);
    const [c2x, c2y] = s([p2[0] - (p3[0] - p1[0]) * tension / 3, p2[1] - (p3[1] - p1[1]) * tension / 3]);
    const [ex, ey] = s(p2);
    parts.push(`C${c1x},${c1y} ${c2x},${c2y} ${ex},${ey}`);
  }
  parts.push('Z');
  return parts.join('');
}

const MAX_RENDER_DIM = 600;

function renderSize(w: number, h: number): { rw: number; rh: number } {
  const max = Math.max(w, h);
  if (max <= MAX_RENDER_DIM) return { rw: Math.round(w), rh: Math.round(h) };
  const sc = MAX_RENDER_DIM / max;
  return { rw: Math.round(w * sc), rh: Math.round(h * sc) };
}

export async function parseSvgContour(svgString: string): Promise<SvgData> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  if (doc.querySelector('parsererror'))
    throw new Error('SVG inválido: ' + (doc.querySelector('parsererror')?.textContent ?? ''));

  const svgEl = doc.documentElement;
  const viewBox = svgEl.getAttribute('viewBox');
  let origW: number, origH: number;
  if (viewBox) { const p = viewBox.split(/[\s,]+/).map(Number); origW = p[2] || 100; origH = p[3] || 100; }
  else { origW = parseFloat(svgEl.getAttribute('width') ?? '100'); origH = parseFloat(svgEl.getAttribute('height') ?? '100'); }

  const width = String(origW), height = String(origH);
  const vb = viewBox ?? `0 0 ${width} ${height}`;

  const { rw, rh } = renderSize(origW, origH);
  const imageData = await renderSvgToImageData(svgString, rw, rh);
  let grid = buildAlphaGrid(imageData, 10);
  grid = morphClose(grid, rw, rh, 1);

  const contours = chainEdges(grid, rw, rh);
  if (!contours.length) throw new Error('No se encontraron formas visibles en el SVG.');

  const scaleX = origW / rw, scaleY = origH / rh;
  const epsilon = 1.2;
  const pathDs: string[] = [];
  for (const c of contours) {
    const s = simplify(c, epsilon);
    if (s.length >= 3) {
      const d = smoothToBezierD(s, scaleX, scaleY);
      if (d) pathDs.push(d);
    }
  }
  if (!pathDs.length) throw new Error('No se pudieron generar contornos del SVG.');

  const combinedD = pathDs.join(' ');
  const skeletonBody = `        <path d="${combinedD}" fill="url(#skeletonGradient)" fill-rule="evenodd" stroke="none" />`;

  return { width, height, viewBox: vb, skeletonBody, rawSvg: svgString };
}


// ═══════════════════════════════════════════════════════════════════════════
// Shared: Gradient defs + skeleton SVG builder
// ═══════════════════════════════════════════════════════════════════════════

export function buildGradientDefs(
  start: string, mid: string, animation: AnimationType, duration: number,
): string {
  const dur = `${duration}s`;
  switch (animation) {
    case 'left-right':
      return `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1 0" to="1 0" dur="${dur}" repeatCount="indefinite" />
        </linearGradient>
    </defs>`;
    case 'right-left':
      return `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
            <animateTransform attributeName="gradientTransform" type="translate" from="1 0" to="-1 0" dur="${dur}" repeatCount="indefinite" />
        </linearGradient>
    </defs>`;
    case 'top-bottom':
      return `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
            <animateTransform attributeName="gradientTransform" type="translate" from="0 -1" to="0 1" dur="${dur}" repeatCount="indefinite" />
        </linearGradient>
    </defs>`;
    case 'bottom-top':
      return `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
            <animateTransform attributeName="gradientTransform" type="translate" from="0 1" to="0 -1" dur="${dur}" repeatCount="indefinite" />
        </linearGradient>
    </defs>`;
    case 'diagonal':
      return `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${start}" />
            <stop offset="50%" stop-color="${mid}" />
            <stop offset="100%" stop-color="${start}" />
            <animateTransform attributeName="gradientTransform" type="translate" from="-1 -1" to="1 1" dur="${dur}" repeatCount="indefinite" />
        </linearGradient>
    </defs>`;
    case 'radial':
      return `    <defs>
        <radialGradient id="skeletonGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${mid}">
                <animate attributeName="stop-color" values="${mid};${start};${mid}" dur="${dur}" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="${start}">
                <animate attributeName="stop-color" values="${start};${mid};${start}" dur="${dur}" repeatCount="indefinite" />
            </stop>
        </radialGradient>
    </defs>`;
    case 'pulse':
      return `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${start}">
                <animate attributeName="stop-color" values="${start};${mid};${start}" dur="${dur}" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="${start}">
                <animate attributeName="stop-color" values="${start};${mid};${start}" dur="${dur}" repeatCount="indefinite" />
            </stop>
        </linearGradient>
    </defs>`;
    case 'wave':
      return `    <defs>
        <linearGradient id="skeletonGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="${start}">
                <animate attributeName="stop-color" values="${start};${mid};${start}" dur="${dur}" repeatCount="indefinite" />
            </stop>
            <stop offset="33%" stop-color="${mid}">
                <animate attributeName="stop-color" values="${mid};${start};${mid}" dur="${dur}" begin="${(duration * 0.15).toFixed(2)}s" repeatCount="indefinite" />
            </stop>
            <stop offset="66%" stop-color="${start}">
                <animate attributeName="stop-color" values="${start};${mid};${start}" dur="${dur}" begin="${(duration * 0.3).toFixed(2)}s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stop-color="${mid}">
                <animate attributeName="stop-color" values="${mid};${start};${mid}" dur="${dur}" begin="${(duration * 0.45).toFixed(2)}s" repeatCount="indefinite" />
            </stop>
        </linearGradient>
    </defs>`;
  }
}

export function buildSkeletonSvgString(
  data: SvgData, theme: Theme = 'light', animation: AnimationType = 'left-right', duration = 1.5,
): string {
  const { start, mid } = THEME_COLORS[theme];
  const defs = buildGradientDefs(start, mid, animation, duration);
  return `<svg width="${data.width}" height="${data.height}" viewBox="${data.viewBox}" xmlns="http://www.w3.org/2000/svg">
${defs}
${data.skeletonBody}
</svg>`;
}