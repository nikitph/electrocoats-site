import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger, Flip);

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
    crumbSwitch();
    search();
    carousels();
    enquiry();
    lightbox();
    finder();
    const rm = reduced();
    if (rm) {
      gsap.set('[data-reveal]', { opacity: 1, y: 0 });
      $$('[data-count]').forEach((el) => (el.textContent = el.dataset.count!));
      return;
    }
    splitHeads();
    drawSvgs();
    reveals();
    counters();
    tilt();
    parallax();
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
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((tt) => tt.onclick = () => {
    const d = document.documentElement;
    const dark = d.dataset.theme !== 'dark';
    if (dark) d.dataset.theme = 'dark'; else delete d.dataset.theme;
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch {}
  });
}

/* ───────────────── breadcrumb switchers: close on outside click / Escape */
function crumbSwitch() {
  const close = (except?: EventTarget | null) => $$<HTMLDetailsElement>('[data-crumb-switch][open]').forEach((d) => { if (!d.contains(except as Node)) d.open = false; });
  const onClick = (e: MouseEvent) => close(e.target);
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKey);
  cleanups.push(() => { document.removeEventListener('click', onClick); document.removeEventListener('keydown', onKey); });
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
    const dp = (el.dataset.count!.split('.')[1] || '').length;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 2, ease: 'power3.out',
      onUpdate: () => (el.textContent = dp ? o.v.toFixed(dp) : Math.round(o.v).toLocaleString('en-IN')),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/* ───────────────── carousels (hero products, testimonials) */
function carousels() {
  $$('[data-carousel]').forEach((root) => {
    const imgs = $$('[data-slide]', root);
    const texts = $$('[data-slide-text]', root);
    const tabs = $$('[data-tab]', root);
    const n = Math.max(imgs.length, texts.length);
    if (n < 2) return;
    const interval = +(root.dataset.interval || 6500);
    const scan = root.querySelector<HTMLElement>('[data-scan]');
    const cur = root.querySelector<HTMLElement>('[data-cur]');
    const toggleIco = root.querySelector<HTMLElement>('[data-toggle-ico]');
    const rm = reduced();
    let i = 0, paused = rm, hovering = false, bar: gsap.core.Tween | null = null;

    const words = (el: Element) => {
      const h = el.querySelector('.hc__h, [data-split-slide]');
      if (!h || (h as HTMLElement).dataset.splitDone) return;
      h.innerHTML = h.textContent!.split(/(\s+)/).map((t) => (/^\s+$/.test(t) ? t : `<span class="w"><span>${t}</span></span>`)).join('');
      (h as HTMLElement).dataset.splitDone = '1';
    };
    texts.forEach(words);

    const setTabs = (k: number) => tabs.forEach((t, j) => {
      t.classList.toggle('on', j === k);
      t.classList.toggle('done', j < k);
      t.setAttribute('aria-selected', String(j === k));
      gsap.set(t.querySelector('.hc__bar i, [data-bar]'), { scaleX: 0 });
    });
    const runBar = () => {
      bar?.kill();
      const el = tabs[i]?.querySelector('.hc__bar i, [data-bar]');
      if (!el || paused || hovering) return;
      bar = gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: interval / 1000, ease: 'none', onComplete: () => go(i + 1) });
    };
    const go = (k: number, dir = 1) => {
      const next = (k + n) % n;
      if (next === i) return runBar();
      const prevI = i; i = next;
      if (cur) cur.textContent = String(i + 1).padStart(2, '0');
      setTabs(i);
      // text
      texts.forEach((t, j) => {
        const on = j === i;
        t.toggleAttribute('aria-hidden', !on);
        t.querySelectorAll('a').forEach((a) => (on ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
      });
      const tOut = texts[prevI], tIn = texts[i];
      if (rm) {
        tOut?.classList.remove('on'); tIn?.classList.add('on');
        imgs[prevI]?.classList.remove('on'); imgs[i]?.classList.add('on');
        return;
      }
      if (tOut) gsap.to(tOut, { opacity: 0, y: -14 * dir, duration: 0.35, ease: 'power2.in', onComplete: () => { tOut.classList.remove('on'); gsap.set(tOut, { clearProps: 'all' }); } });
      if (tIn) {
        tIn.classList.add('on');
        gsap.fromTo(tIn, { opacity: 0, y: 14 * dir }, { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: 'expo.out' });
        gsap.fromTo($$('.w > span', tIn), { yPercent: 110 }, { yPercent: 0, duration: 0.9, delay: 0.3, ease: 'expo.out', stagger: 0.05 });
      }
      // image: angled wipe + scan line + slow push-in
      const out = imgs[prevI], inn = imgs[i];
      if (inn) {
        inn.classList.add('on');
        gsap.set(inn, { zIndex: 1 });
        if (out) gsap.set(out, { zIndex: 0 });
        const from = dir > 0 ? 'polygon(100% 0, 100% 0, 85% 100%, 85% 100%)' : 'polygon(0 0, 0 0, 15% 100%, 15% 100%)';
        const to = dir > 0 ? 'polygon(-20% 0, 100% 0, 100% 100%, -35% 100%)' : 'polygon(0 0, 120% 0, 135% 100%, 0 100%)';
        gsap.fromTo(inn, { clipPath: from }, { clipPath: to, duration: 1.1, ease: 'expo.inOut', onComplete: () => { out?.classList.remove('on'); gsap.set(inn, { clearProps: 'clipPath' }); } });
        const img = inn.querySelector('img');
        if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 7, ease: 'power1.out' });
        const chips = inn.querySelectorAll('.chip');
        gsap.fromTo(chips, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.8, stagger: 0.1 });
        if (scan) gsap.fromTo(scan, { left: dir > 0 ? '100%' : '0%', opacity: 1 }, { left: dir > 0 ? '-2%' : '100%', opacity: 0, duration: 1.1, ease: 'expo.inOut' });
      }
      runBar();
    };
    tabs.forEach((t, j) => (t.onclick = () => go(j, j >= i ? 1 : -1)));
    const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-next]');
    if (prev) prev.onclick = () => go(i - 1, -1);
    if (next) next.onclick = () => go(i + 1, 1);
    const toggle = root.querySelector<HTMLButtonElement>('[data-toggle]');
    const setPaused = (p: boolean) => {
      paused = p;
      if (toggleIco) toggleIco.textContent = p ? '▶' : '❚❚';
      toggle?.setAttribute('aria-label', p ? 'Play autoplay' : 'Pause autoplay');
      if (p) bar?.pause(); else runBar();
    };
    if (toggle) toggle.onclick = () => setPaused(!paused);
    const stage = root.querySelector<HTMLElement>('[data-stage]') ?? root;
    stage.addEventListener('pointerenter', () => { hovering = true; bar?.pause(); });
    stage.addEventListener('pointerleave', () => { hovering = false; if (!paused) bar?.paused() ? bar.resume() : runBar(); });
    root.addEventListener('focusin', () => bar?.pause());
    root.addEventListener('focusout', () => { if (!paused && !hovering) bar?.resume(); });
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(i + 1, 1);
      if (e.key === 'ArrowLeft') go(i - 1, -1);
    });
    // swipe
    let sx = 0;
    stage.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    stage.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
    // pause when off-screen
    const io = new IntersectionObserver(([en]) => { if (!en.isIntersecting) bar?.pause(); else if (!paused && !hovering) bar?.resume(); });
    io.observe(root);
    cleanups.push(() => { io.disconnect(); bar?.kill(); });
    setTabs(0);
    if (!rm) {
      const first = texts[0];
      if (first) gsap.fromTo($$('.w > span', first), { yPercent: 110 }, { yPercent: 0, duration: 1.1, delay: 0.2, ease: 'expo.out', stagger: 0.06 });
      const img = imgs[0]?.querySelector('img');
      if (img) gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: 7, ease: 'power1.out' });
    }
    runBar();
  });
}

/* ───────────────── search overlay */
function search() {
  const dlg = document.querySelector<HTMLDialogElement>('[data-search]');
  if (!dlg) return;
  const q = dlg.querySelector<HTMLInputElement>('[data-search-q]')!;
  const res = dlg.querySelector<HTMLElement>('[data-search-res]')!;
  const idx: { t: string; s: string; h: string; k: string }[] = JSON.parse(dlg.querySelector('[data-search-index]')!.textContent!);
  let sel = 0;
  const esc = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const render = () => {
    const term = q.value.trim().toLowerCase();
    const hits = (term ? idx.filter((x) => (x.t + ' ' + x.s).toLowerCase().includes(term)) : idx.filter((x) => x.k === 'Page')).slice(0, 12);
    sel = 0;
    res.innerHTML = hits.length
      ? hits.map((x, j) => `<li><a href="${x.h}" class="${j === 0 ? 'sel' : ''}"><b>${esc(x.t)}</b><span class="k">${x.k}</span>${x.s ? `<small>${esc(x.s)}</small>` : ''}</a></li>`).join('')
      : `<li><a href="/contact/#enquiry"><b>No match. Ask the lab</b><span class="k">Enquiry</span><small>We formulate to order.</small></a></li>`;
  };
  const open = () => { render(); dlg.showModal(); q.focus(); if (!reduced()) gsap.fromTo(dlg, { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }); };
  $$('[data-search-open]').forEach((b) => (b.onclick = open));
  dlg.querySelector<HTMLButtonElement>('[data-search-close]')!.onclick = () => dlg.close();
  dlg.onclick = (e) => { if (e.target === dlg) dlg.close(); };
  q.oninput = render;
  q.onkeydown = (e) => {
    const links = $$<HTMLAnchorElement>('a', res);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links.forEach((a, j) => a.classList.toggle('sel', j === sel));
    }
    if (e.key === 'Enter' && links[sel]) { e.preventDefault(); dlg.close(); links[sel].click(); }
  };
  res.onclick = () => dlg.close();
  const key = (e: KeyboardEvent) => {
    if (e.key === '/' && !dlg.open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) { e.preventDefault(); open(); }
  };
  addEventListener('keydown', key);
  cleanups.push(() => removeEventListener('keydown', key));
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
