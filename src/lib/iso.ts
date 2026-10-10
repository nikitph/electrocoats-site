/**
 * Tiny isometric drawing kit. World units map 1:1 to SVG px before projection.
 * Axes: +x runs down-right, +y runs down-left, +z is up. Viewer looks from +x,+y.
 * Every shape returns an SVG string so .astro components can compose scenes
 * and the client motion script can find strokes via [data-draw] / .ln.
 */
export const C = Math.cos(Math.PI / 6); // 0.8660
export const S = 0.5;

export type V3 = [number, number, number];

export const P = (x: number, y: number, z = 0): [number, number] => [
  +((x - y) * C).toFixed(2),
  +((x + y) * S - z).toFixed(2),
];

const pt = (p: V3) => P(...p).join(',');
export const poly = (pts: V3[], close = true) =>
  'M' + pts.map(pt).join('L') + (close ? 'Z' : '');
export const line = (a: V3, b: V3) => `M${pt(a)}L${pt(b)}`;

/** ellipse radii of a horizontal circle of radius r */
export const ER = (r: number) => ({ rx: +(r * Math.SQRT2 * C).toFixed(2), ry: +(r * Math.SQRT2 * S).toFixed(2) });

type Cls = { top?: string; left?: string; right?: string; ln?: string };

/** Solid box with tonal faces + hairline edges (back edges omitted). */
export function box(x: number, y: number, z: number, w: number, d: number, h: number, c: Cls = {}) {
  const t = z + h;
  const top = poly([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]]);
  const right = poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]]);
  const left = poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]]);
  const ln = c.ln ?? 'ln';
  return `<path class="${c.right ?? 'f-r'} ${ln}" d="${right}"/><path class="${c.left ?? 'f-l'} ${ln}" d="${left}"/><path class="${c.top ?? 'f-t'} ${ln}" d="${top}"/>`;
}

/** Open-top tray: back walls first, then floor, then front walls drawn later via trayFront. */
export function trayBack(x: number, y: number, z: number, w: number, d: number, h: number) {
  const t = z + h;
  return (
    `<path class="f-in ln" d="${poly([[x, y, z], [x + w, y, z], [x + w, y, t], [x, y, t]])}"/>` +
    `<path class="f-in2 ln" d="${poly([[x, y, z], [x, y + d, z], [x, y + d, t], [x, y, t]])}"/>` +
    `<path class="f-floor ln" d="${poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])}"/>`
  );
}
export function trayFront(x: number, y: number, z: number, w: number, d: number, h: number, wall = 6) {
  const t = z + h;
  return (
    `<path class="f-r glass ln" d="${poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]])}"/>` +
    `<path class="f-l glass ln" d="${poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]])}"/>` +
    // rim
    `<path class="f-t ln" d="${poly([[x - wall, y - wall, t], [x + w + wall, y - wall, t], [x + w + wall, y + d + wall, t], [x - wall, y + d + wall, t]])} ${poly([[x, y, t], [x, y + d, t], [x + w, y + d, t], [x + w, y, t]])}" fill-rule="evenodd"/>`
  );
}

/** Upright cylinder (axis z). */
export function cyl(cx: number, cy: number, z: number, r: number, h: number, c: Cls = {}) {
  const { rx, ry } = ER(r);
  const [bx, by] = P(cx, cy, z);
  const [tx, ty] = P(cx, cy, z + h);
  const ln = c.ln ?? 'ln';
  const body = `M${bx - rx},${ty}L${bx - rx},${by}A${rx},${ry} 0 0 0 ${bx + rx},${by}L${bx + rx},${ty}Z`;
  return `<path class="${c.right ?? 'f-r'} ${ln}" d="${body}"/><ellipse class="${c.top ?? 'f-t'} ${ln}" cx="${tx}" cy="${ty}" rx="${rx}" ry="${ry}"/>`;
}

/** Flat ellipse ring at height z (e.g. a lid seam). */
export function ring(cx: number, cy: number, z: number, r: number, cls = 'ln') {
  const { rx, ry } = ER(r);
  const [x, y] = P(cx, cy, z);
  return `<ellipse class="${cls}" fill="none" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`;
}
/** Front half of a horizontal circle — for bands on cylinders. */
export function band(cx: number, cy: number, z: number, r: number, cls = 'ln') {
  const { rx, ry } = ER(r);
  const [x, y] = P(cx, cy, z);
  return `<path class="${cls}" fill="none" d="M${x - rx},${y}A${rx},${ry} 0 0 0 ${x + rx},${y}"/>`;
}

/** Toroidal coil: core ring + copper winding strokes. */
export function toroid(cx: number, cy: number, z: number, R: number, r: number, h: number, turns = 28) {
  let s = cyl(cx, cy, z, R, h);
  const { rx, ry } = ER(r);
  const [hx, hy] = P(cx, cy, z + h);
  s += `<ellipse class="f-hole ln" cx="${hx}" cy="${hy}" rx="${rx}" ry="${ry}"/>`;
  let w = '';
  for (let i = 0; i < turns; i++) {
    const a = (i / turns) * Math.PI * 2;
    const ca = Math.cos(a), sa = Math.sin(a);
    const inner: V3 = [cx + ca * r, cy + sa * r, z + h];
    const outer: V3 = [cx + ca * R, cy + sa * R, z + h];
    w += line(inner, outer);
    if (ca + sa > 0.05) w += line(outer, [cx + ca * R, cy + sa * R, z]);
  }
  return s + `<path class="wind ln" fill="none" d="${w}"/>`;
}

/** Cylinder lying along the x axis (drums, rollers). */
export function cylX(x: number, cy: number, cz: number, r: number, len: number, c: Cls = {}) {
  const seg = 36;
  const end = (xx: number) => {
    const pts: V3[] = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push([xx, cy + Math.cos(a) * r, cz + Math.sin(a) * r]);
    }
    return pts;
  };
  const far = end(x), near = end(x + len);
  // silhouette = extremes perpendicular to the projected x axis (C, S)
  const perp = (p: V3) => { const [sx, sy] = P(...p); return -S * sx + C * sy; };
  const sil = (pts: V3[]) => {
    let lo = pts[0], hi = pts[0];
    for (const p of pts) {
      if (perp(p) < perp(lo)) lo = p;
      if (perp(p) > perp(hi)) hi = p;
    }
    return [lo, hi];
  };
  const [fl, fh] = sil(far), [nl, nh] = sil(near);
  const ln = c.ln ?? 'ln';
  return (
    `<path class="${c.left ?? 'f-l'} ${ln}" d="${poly([fl, nl, nh, fh])}"/>` +
    `<path class="${c.right ?? 'f-r'} ${ln}" d="${poly(near)}"/>`
  );
}

/** Iso floor grid as a single path. */
export function grid(n: number, step: number, z = 0) {
  let d = '';
  for (let i = 0; i <= n; i++) {
    d += line([i * step, 0, z], [i * step, n * step, z]);
    d += line([0, i * step, z], [n * step, i * step, z]);
  }
  return d;
}

/** Leader line + label anchor point for callouts. */
export function anchor(p: V3) {
  const [x, y] = P(...p);
  return { x, y };
}

/** Compute a viewBox that fits a set of world-space bounds. */
export function viewBox(min: V3, max: V3, pad = 20) {
  const corners: V3[] = [];
  for (const x of [min[0], max[0]]) for (const y of [min[1], max[1]]) for (const z of [min[2], max[2]]) corners.push([x, y, z]);
  const pts = corners.map((c) => P(...c));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - pad, y0 = Math.min(...ys) - pad;
  return `${x0.toFixed(0)} ${y0.toFixed(0)} ${(Math.max(...xs) - x0 + pad).toFixed(0)} ${(Math.max(...ys) - y0 + pad).toFixed(0)}`;
}
