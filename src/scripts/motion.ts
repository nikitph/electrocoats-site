import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

const C = Math.cos(Math.PI / 6);
const P = (x: number, y: number, z: number) => [(x - y) * C, (x + y) * 0.5 - z];
const poly = (pts: number[][]) => 'M' + pts.map((p) => P(p[0], p[1], p[2]).map((n) => n.toFixed(2)).join(',')).join('L') + 'Z';

let ctx: gsap.Context | null = null;
let cleanups: (() => void)[] = [];
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s) as NodeListOf<T>);
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('astro:before-swap', () => {
  ctx?.revert();
  cleanups.forEach((f) => f());
  cleanups = [];
});

export function boot() {
  ctx = gsap.context(() => {
    nav();
    enquiry();
    lightbox();
    finder();
    const rm = reduced();
    if (rm) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 });
      heroStatic();
      $$('[data-count]').forEach((el) => (el.textContent = el.dataset.count!));
      return;
    }
    splitHeads();
    drawSvgs();
    reveals();
    counters();
    hero();
    tilt();
    parallax();
    crosshair();
  });
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/* ───────────────── nav */
function nav() {
  const el = document.querySelector<HTMLElement>('[data-nav]');
  if (!el) return;
  const bar = el.querySelector<HTMLElement>('[data-progress]')!;
  let last = 0;
  const on = () => {
    const y = scrollY;
    el.classList.toggle('scrolled', y > 20);
    el.classList.toggle('hide', y > 400 && y > last && !el.classList.contains('open'));
    last = y;
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
  };
  addEventListener('scroll', on, { passive: true });
  cleanups.push(() => removeEventListener('scroll', on));
  on();
  const b = el.querySelector<HTMLButtonElement>('[data-burger]')!;
  b.onclick = () => {
    const open = el.classList.toggle('open');
    b.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  el.classList.remove('open');
  document.body.style.overflow = '';
  const tt = el.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (tt) tt.onclick = () => {
    const d = document.documentElement;
    const dark = d.dataset.theme !== 'dark';
    if (dark) d.dataset.theme = 'dark'; else delete d.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  };
}

/* ───────────────── split headings into masked words */
function splitHeads() {
  $$('[data-split]').forEach((h) => {
    if (!h.dataset.splitDone) {
      const walk = (node: Node) => {
        Array.from(node.childNodes).forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent!.split(/(\s+)/).forEach((t) => {
              if (!t) return;
              if (/^\s+$/.test(t)) return frag.append(t);
              const o = document.createElement('span');
              o.className = 'w';
              const i = document.createElement('span');
              i.textContent = t;
              o.append(i);
              frag.append(o);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && !(n as HTMLElement).classList.contains('w')) walk(n);
        });
      };
      walk(h);
      h.dataset.splitDone = '1';
    }
    const words = $$('.w > span', h);
    gsap.fromTo(words, { yPercent: 115, rotate: 4 }, {
      yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045,
      scrollTrigger: { trigger: h, start: 'top 88%', once: true },
    });
  });
}

/* ───────────────── line drawing */
function drawSvgs() {
  $$<SVGSVGElement>('svg[data-draw], [data-draw]').forEach((root) => {
    if (root.closest('[data-draw]') !== root) return; // outermost only
    if (root.closest('[data-finder]')) return; // finder cards animate via Flip; hidden ones would mis-trigger
    const strokes = $$<SVGGeometryElement>('path, ellipse, line, circle, polyline', root).filter((e) => !e.closest('.tags') && e.id !== 'stream' && !e.id.startsWith('resin'));
    const fills: SVGGeometryElement[] = [];
    strokes.forEach((e) => {
      let len = 0;
      try { len = e.getTotalLength(); } catch { len = 200; }
      len = Math.max(1, Math.ceil(len));
      const dashed = e.classList.contains('dash');
      if (!dashed) { e.style.strokeDasharray = `${len} ${len}`; e.style.strokeDashoffset = String(len); }
      else e.style.opacity = '0';
      fills.push(e);
    });
    gsap.set(fills, { fillOpacity: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 85%', once: true } });
    const total = Math.min(1.8, 0.6 + strokes.length * 0.012);
    tl.to(strokes, { strokeDashoffset: 0, opacity: 1, duration: 1.4, ease: 'power2.inOut', stagger: { amount: total } })
      .to(fills, { fillOpacity: 1, duration: 0.9, ease: 'power1.out', stagger: { amount: total * 0.6 } }, 0.5)
      .add(() => strokes.forEach((e) => { e.style.strokeDasharray = ''; e.style.strokeDashoffset = ''; }));
    const tags = $$('[data-tag]', root);
    if (tags.length) tl.from(tags, { opacity: 0, y: 10, duration: 0.6, stagger: 0.2 }, '-=0.6');
  });
}

/* ───────────────── reveals */
function reveals() {
  $$('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: +(el.dataset.delay || 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
  $$('[data-stagger]').forEach((g) => {
    const kids = Array.from(g.children) as HTMLElement[];
    gsap.fromTo(kids, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
      scrollTrigger: { trigger: g, start: 'top 85%', once: true },
    });
  });
}

/* ───────────────── counters */
function counters() {
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count!;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2, ease: 'power3.out',
      onUpdate: () => (el.textContent = Math.round(o.v).toLocaleString('en-IN')),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/* ───────────────── hero pour/cure */
function heroGeom() {
  const svg = document.querySelector<SVGSVGElement>('.hero-scene');
  if (!svg) return null;
  const d = svg.dataset;
  return {
    svg, W: +d.w!, D: +d.d!, H: +d.h!, L: +d.level!, nx: +d.nx!, ny: +d.ny!, nz: +d.nz!,
    side: svg.querySelector<SVGPathElement>('#resin-side')!,
    top: svg.querySelector<SVGPathElement>('#resin-top')!,
    sheen: svg.querySelector<SVGPathElement>('#resin-sheen')!,
    stream: svg.querySelector<SVGLineElement>('#stream')!,
    mark: svg.querySelector<SVGGElement>('#gauge-mark')!,
    parts: Array.from(svg.querySelectorAll<SVGGElement>('.part')),
  };
}
function setLevel(g: NonNullable<ReturnType<typeof heroGeom>>, h: number, sheenT = -1) {
  const { W, D } = g;
  if (h <= 0.01) { g.side.setAttribute('d', ''); g.top.setAttribute('d', ''); }
  else {
    g.side.setAttribute('d', poly([[W, 0, 0], [W, D, 0], [W, D, h], [W, 0, h]]) + poly([[0, D, 0], [W, D, 0], [W, D, h], [0, D, h]]));
    g.top.setAttribute('d', poly([[0, 0, h], [W, 0, h], [W, D, h], [0, D, h]]));
  }
  g.parts.forEach((p) => p.classList.toggle('sub', h >= +p.dataset.top!));
  const pct = Math.round((h / g.L) * 100);
  g.mark.setAttribute('transform', `translate(0, ${-(h / g.H) * g.H})`);
  const t = g.mark.querySelector('text');
  if (t) t.textContent = String(pct).padStart(2, '0') + '%';
  if (sheenT >= 0 && sheenT <= 1 && h > 0) {
    const x = -40 + sheenT * (W + 80);
    g.sheen.setAttribute('d', 'M' + [P(Math.max(0, Math.min(W, x)), 0, h), P(Math.max(0, Math.min(W, x - 60)), D, h)].map((p) => p.map((n) => n.toFixed(1)).join(',')).join('L'));
    g.sheen.style.opacity = String(Math.sin(sheenT * Math.PI));
  } else g.sheen.setAttribute('d', '');
}
function heroStatic() {
  const g = heroGeom();
  if (!g) return;
  setLevel(g, g.L);
  g.svg.classList.add('cured');
  $$('[data-proof]').forEach((e) => (e.style.opacity = '1'));
  const s = document.querySelector('[data-hero-state]');
  if (s) s.textContent = 'CURED';
}
function hero() {
  const g = heroGeom();
  const sec = document.querySelector<HTMLElement>('[data-hero]');
  if (!g || !sec) return;
  const state = sec.querySelector<HTMLElement>('[data-hero-state]');
  const proofs = $$('[data-proof]', sec);
  gsap.set(proofs, { opacity: 0, x: 24 });
  setLevel(g, 0);
  const S = { level: 0, s1: 0, s2: 0, sheen: -1 };
  const render = () => {
    setLevel(g, S.level, S.sheen);
    const y1 = g.ny + (g.nz - g.L) * S.s2;
    const y2 = g.ny + (g.nz - S.level) * S.s1 + 0;
    g.stream.setAttribute('y1', String(Math.min(y1 + (S.s2 > 0 ? 0 : 0), y2)));
    g.stream.setAttribute('y2', String(y2));
    g.stream.style.opacity = S.s1 > 0 && S.s2 < 1 ? '1' : '0';
  };
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      // phones: the hero is taller than the screen, so pin the drawing itself just under the nav
      ...(innerWidth < 1000
        ? { trigger: sec.querySelector('.hero__fig')!, start: 'top 84px', end: '+=160%' }
        : { trigger: sec, start: 'top top', end: '+=190%' }),
      pin: true, scrub: 0.8, anticipatePin: 1,
      onUpdate: (st) => {
        const p = st.progress;
        g.svg.classList.toggle('cured', p > 0.72);
        if (state) state.textContent = p < 0.04 ? 'READY' : p < 0.66 ? 'POURING' : p < 0.72 ? 'GELLING' : 'CURED';
        sec.classList.toggle('is-cured', p > 0.72);
      },
    },
    onUpdate: render,
  });
  tl.to(S, { s1: 1, duration: 0.06 })
    .to(S, { level: g.L, duration: 0.58, ease: 'power1.inOut' })
    .to(S, { s2: 1, duration: 0.06 })
    .to(S, { sheen: 1, duration: 0.14, ease: 'power2.inOut' }, '+=0.02')
    .to(proofs, { opacity: 1, x: 0, stagger: 0.04, duration: 0.08 }, '-=0.1')
    .to({}, { duration: 0.08 });
  // intro (not scrubbed)
  gsap.from('[data-hero-in]', { opacity: 0, y: 30, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.2 });
}

/* ───────────────── hover tilt */
function tilt() {
  if (!matchMedia('(hover: hover)').matches) return;
  $$('[data-tilt]').forEach((el) => {
    const qx = gsap.quickTo(el, 'rotateY', { duration: 0.6, ease: 'power3' });
    const qy = gsap.quickTo(el, 'rotateX', { duration: 0.6, ease: 'power3' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
      qx(((e.clientX - r.left) / r.width - 0.5) * 8);
      qy(-((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const leave = () => { qx(0); qy(0); };
    gsap.set(el, { transformPerspective: 900 });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    cleanups.push(() => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); });
  });
}

/* ───────────────── parallax */
function parallax() {
  $$('[data-parallax]').forEach((el) => {
    const f = +el.dataset.parallax!;
    gsap.fromTo(el, { yPercent: -f * 50 }, { yPercent: f * 50, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  $$('[data-marquee-text]').forEach((el) => {
    gsap.fromTo(el, { xPercent: 8 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ───────────────── crosshair readout in hero */
function crosshair() {
  const sec = document.querySelector<HTMLElement>('[data-crosshair]');
  if (!sec || !matchMedia('(hover: hover)').matches) return;
  const x = document.createElement('div'), y = document.createElement('div'), r = document.createElement('div');
  x.className = 'xh xh-x'; y.className = 'xh xh-y'; r.className = 'xh-r mono';
  sec.append(x, y, r);
  const move = (e: PointerEvent) => {
    const b = sec.getBoundingClientRect();
    const px = e.clientX - b.left, py = e.clientY - b.top;
    x.style.transform = `translateY(${py}px)`;
    y.style.transform = `translateX(${px}px)`;
    r.style.transform = `translate(${px + 12}px, ${py + 12}px)`;
    r.textContent = `X ${String(Math.round(px)).padStart(4, '0')}  Y ${String(Math.round(py)).padStart(4, '0')}`;
  };
  sec.addEventListener('pointermove', move);
  cleanups.push(() => { sec.removeEventListener('pointermove', move); x.remove(); y.remove(); r.remove(); });
}

/* ───────────────── product finder */
function finder() {
  const root = document.querySelector<HTMLElement>('[data-finder]');
  if (!root) return;
  const cards = $$('[data-card]', root);
  const grid = root.querySelector<HTMLElement>('[data-grid]')!;
  const countEl = root.querySelector<HTMLElement>('[data-count-out]')!;
  const empty = root.querySelector<HTMLElement>('[data-empty]')!;
  const q = root.querySelector<HTMLInputElement>('[data-q]')!;
  const state: Record<string, Set<string>> = { app: new Set(), process: new Set(), chem: new Set(), attr: new Set() };

  const params = new URLSearchParams(location.search);
  for (const k of Object.keys(state)) params.getAll(k).forEach((v) => v.split(',').forEach((x) => x && state[k].add(x)));
  q.value = params.get('q') || '';

  const chips = $$<HTMLButtonElement>('[data-f]', root);
  const sync = () => chips.forEach((c) => {
    const on = state[c.dataset.f!].has(c.dataset.v!);
    c.classList.toggle('on', on);
    c.setAttribute('aria-pressed', String(on));
  });

  const apply = (animate = true) => {
    const flip = animate && !reduced() ? Flip.getState(cards) : null;
    const term = q.value.trim().toLowerCase();
    let n = 0;
    cards.forEach((c) => {
      const d = c.dataset;
      const has = (k: string, field: string) => state[k].size === 0 || (d[field] || '').split(' ').some((x) => state[k].has(x));
      const allAttr = [...state.attr].every((a) => (d.attr || '').split(' ').includes(a));
      const ok = has('app', 'app') && has('process', 'process') && has('chem', 'chem') && allAttr && (!term || d.search!.includes(term));
      c.hidden = !ok;
      if (ok) n++;
    });
    countEl.textContent = String(n).padStart(2, '0');
    const active = Object.values(state).reduce((a, s) => a + s.size, 0) + (term ? 1 : 0);
    const fc = root.querySelector<HTMLElement>('[data-fcount]');
    if (fc) fc.textContent = active ? `· ${active} active` : '';
    empty.hidden = n > 0;
    sync();
    const u = new URLSearchParams();
    for (const [k, s] of Object.entries(state)) if (s.size) u.set(k, [...s].join(','));
    if (term) u.set('q', term);
    history.replaceState(history.state, '', u.toString() ? `?${u}` : location.pathname);
    if (flip) Flip.from(flip, { duration: 0.6, ease: 'expo.inOut', scale: true, absolute: true, onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.5 }), onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.3 }) });
    ScrollTrigger.refresh();
  };

  chips.forEach((c) => (c.onclick = () => {
    const s = state[c.dataset.f!];
    s.has(c.dataset.v!) ? s.delete(c.dataset.v!) : s.add(c.dataset.v!);
    apply();
  }));
  root.querySelector<HTMLButtonElement>('[data-reset]')!.onclick = () => {
    Object.values(state).forEach((s) => s.clear());
    q.value = '';
    apply();
  };
  const ft = root.querySelector<HTMLButtonElement>('[data-ftoggle]');
  if (ft) ft.onclick = () => {
    const open = root.querySelector('[data-filters]')!.classList.toggle('open');
    ft.setAttribute('aria-expanded', String(open));
    ScrollTrigger.refresh();
  };
  let t: number;
  q.oninput = () => { clearTimeout(t); t = window.setTimeout(() => apply(), 160); };
  apply(false);
  void grid;
}

/* ───────────────── enquiry form */
function enquiry() {
  $$<HTMLAnchorElement>('[data-need]').forEach((a) => (a.onclick = () => {
    const sel = document.querySelector<HTMLSelectElement>('#f-need');
    if (sel) sel.value = a.dataset.need!;
  }));
  $$<HTMLFormElement>('[data-enquiry]').forEach((f) => {
    const sel = f.querySelector<HTMLSelectElement>('[data-product-select]');
    const pre = new URLSearchParams(location.search).get('product');
    if (sel && pre && [...sel.options].some((o) => o.value === pre)) sel.value = pre;
    const status = f.querySelector<HTMLElement>('.enq__status')!;
    f.onsubmit = async (e) => {
      e.preventDefault();
      if (!f.reportValidity()) return;
      const data = Object.fromEntries(new FormData(f).entries()) as Record<string, string>;
      if (data._gotcha) return;
      delete data._gotcha;
      const productName = sel?.selectedOptions[0]?.text ?? '';
      const ep = f.dataset.endpoint;
      if (ep) {
        status.textContent = 'Sending…';
        try {
          const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...data, productName }) });
          if (!r.ok) throw new Error(String(r.status));
          status.textContent = 'Received. The lab will be in touch.';
          f.reset();
        } catch {
          status.textContent = `Could not send. Please email ${f.dataset.mailto}.`;
        }
        return;
      }
      const body = [`Name: ${data.name}`, `Company: ${data.company}`, `Email: ${data.email}`, `Phone: ${data.phone}`, `Product: ${productName}`, `Need: ${data.need}`, '', data.message].join('\n');
      location.href = `mailto:${f.dataset.mailto}?subject=${encodeURIComponent(`${data.need} request: ${productName}`)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Opening your mail app…';
    };
  });
}

/* ───────────────── award lightbox */
function lightbox() {
  const items = $$<HTMLAnchorElement>('[data-lightbox]');
  if (!items.length) return;
  let box = document.querySelector<HTMLDialogElement>('dialog.lb');
  if (!box) {
    box = document.createElement('dialog');
    box.className = 'lb';
    box.innerHTML = '<button class="lb__x mono" aria-label="Close">CLOSE ✕</button><img alt="" /><p class="mono"></p>';
    document.body.append(box);
    box.querySelector('button')!.onclick = () => box!.close();
    box.onclick = (e) => { if (e.target === box) box!.close(); };
  }
  items.forEach((a) => (a.onclick = (e) => {
    e.preventDefault();
    const img = box!.querySelector('img')!;
    img.src = a.href;
    img.alt = a.dataset.caption || '';
    box!.querySelector('p')!.textContent = a.dataset.caption || '';
    box!.showModal();
    if (!reduced()) gsap.fromTo(img, { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 0.7, ease: 'expo.out' });
  }));
}
