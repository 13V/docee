'use strict';

/* Docee motion: self-drawing line art and the opening loader.
   Listens for the `docee:render` event dispatched at the end of render() in app.js.
   Draw-on uses the Web Animations API, so no inline dash styles are left behind. */
(() => {
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceQuery.matches;
  const params = new URLSearchParams(window.location.search);
  const STROKES = 'path,circle,ellipse,line,polyline,polygon,rect';
  const EASE = 'cubic-bezier(.22,.7,.3,1)';

  /* ---------- gate: drawings wait until the loader starts to leave ---------- */
  let ready = false;
  const queue = [];
  const whenReady = fn => (ready ? fn() : queue.push(fn));
  const openGate = () => { ready = true; queue.splice(0).forEach(fn => fn()); };

  /* ---------- draw-on ---------- */
  function drawOn(svg, { dur = 520, step = 40, total = 1100 } = {}) {
    const items = [...svg.querySelectorAll(STROKES)].filter(el => !el.closest('defs,clipPath,mask,filter'));
    const n = items.length;
    svg.classList.remove('draw-pending');
    if (!n || typeof Element.prototype.animate !== 'function') return;
    const gap = n > 1 ? Math.min(step, Math.max(0, (total - dur) / (n - 1))) : 0;
    items.forEach((el, i) => {
      const delay = Math.round(i * gap);
      let len = 0;
      try { len = el.getTotalLength(); } catch (e) { len = 0; }
      const fadeOnly = el.hasAttribute('stroke-dasharray') || !(len > 1.5);
      let frames;
      if (fadeOnly) {
        const o = getComputedStyle(el).opacity;
        frames = [{ opacity: 0 }, { opacity: o }];
      } else {
        const L = Math.ceil(len) + 1;
        frames = [
          { strokeDasharray: `${L} ${L}`, strokeDashoffset: L },
          { strokeDasharray: `${L} ${L}`, strokeDashoffset: 0 },
        ];
      }
      el.animate(frames, { duration: fadeOnly ? dur * .6 : dur, delay, easing: EASE, fill: 'backwards' });
    });
  }

  /* ---------- per-render handling inside the phone frame ---------- */
  const seen = new Set();          // signatures of drawings already drawn
  const screensDone = new Set();   // screens whose first render has been handled
  let observer = null;
  const pending = new WeakMap();   // svg -> {sig, mode}

  function signature(svg, screen, counts) {
    const d = (svg.querySelector('path')?.getAttribute('d') || '').slice(0, 28);
    const text = (svg.parentElement?.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 30);
    const base = `${screen}|${d}|${text}`;
    const k = (counts[base] = (counts[base] || 0) + 1);
    return `${base}|${k}`;
  }

  function handleRender(detail) {
    if (observer) { observer.disconnect(); observer = null; }
    if (reduced()) return;
    const view = detail && detail.view;
    const screen = (detail && detail.screen) || '';
    if (view && view !== 'preview') return;
    const frame = document.querySelector('.phone-frame');
    if (!frame) return;

    const mode = screensDone.has(screen) ? { dur: 320, step: 18, total: 560 } : { dur: 520, step: 40, total: 1100 };
    screensDone.add(screen);
    const counts = {};
    const targets = [];
    frame.querySelectorAll('.sketch').forEach(svg => {
      const sig = signature(svg, screen, counts);
      if (seen.has(sig)) return;
      svg.classList.add('draw-pending');
      pending.set(svg, { sig, mode });
      targets.push(svg);
    });
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(svg => whenReady(() => { const p = pending.get(svg); seen.add(p.sig); drawOn(svg, p.mode); }));
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const svg = entry.target;
        if (observer) observer.unobserve(svg);
        const p = pending.get(svg);
        if (!p) return;
        whenReady(() => {
          if (!svg.isConnected || !svg.classList.contains('draw-pending')) return;
          seen.add(p.sig);
          drawOn(svg, p.mode);
        });
      });
    }, { threshold: 0.12 });
    targets.forEach(svg => observer.observe(svg));
  }

  document.addEventListener('docee:render', event => handleRender(event.detail));

  /* ---------- opening loader ---------- */
  function startLoader() {
    const loader = document.getElementById('docee-loader');
    const initialView = typeof state !== 'undefined' ? state.view : 'preview';
    if (!loader) return openGate();
    if (reduced() || params.get('noloader') === '1' || initialView !== 'preview' || typeof sketch !== 'function') {
      loader.remove();
      return openGate();
    }

    const app = document.getElementById('app');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const themeBefore = themeMeta && themeMeta.getAttribute('content');
    if (themeMeta) themeMeta.setAttribute('content', '#2425D6');
    if (app) app.inert = true;

    loader.innerHTML = `<div class="dl-inner">${sketch('mascot', 'dl-mascot')}<div class="dl-count" aria-hidden="true">loading <b>0</b>%</div></div>`;
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', 'Loading Docee');
    loader.removeAttribute('aria-hidden');
    loader.classList.remove('dl-pre');
    loader.classList.add('dl-on');
    const counter = loader.querySelector('b');
    const mascot = loader.querySelector('.dl-mascot');

    const mobileMode = () => document.body.classList.contains('mobile-app-mode');
    let raf = 0, done = false;
    const start = performance.now();
    const place = () => {
      const frame = document.querySelector('.phone-frame');
      const inner = frame && (frame.querySelector(':scope > .mobile-app') || frame);
      if (!frame || mobileMode()) {
        loader.style.cssText = '';
        loader.classList.remove('dl-boxed');
        return;
      }
      const r = inner.getBoundingClientRect();
      loader.classList.add('dl-boxed');
      loader.style.top = r.top + 'px';
      loader.style.left = r.left + 'px';
      loader.style.width = r.width + 'px';
      loader.style.height = r.height + 'px';
      loader.style.borderRadius = getComputedStyle(inner).borderRadius;
    };
    place();

    drawOn(mascot, { dur: 700, step: 42, total: 1500 });

    const COUNT_MS = 1800, HOLD_MS = 160;
    const ease = t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    let exitTimer = 0;

    function leave() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      clearTimeout(exitTimer);
      counter.textContent = '100';
      loader.classList.add('dl-out');
      if (app) app.inert = false;
      if (themeMeta && themeBefore) themeMeta.setAttribute('content', themeBefore);
      openGate();
      setTimeout(() => {
        loader.remove();
        window.removeEventListener('resize', place);
      }, 650);
    }

    const tick = now => {
      if (done) return;
      const t = Math.min(1, (now - start) / COUNT_MS);
      counter.textContent = String(Math.round(ease(t) * 100));
      place();
      if (t < 1) raf = requestAnimationFrame(tick);
      else { counter.textContent = '100'; exitTimer = setTimeout(leave, HOLD_MS); }
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('resize', place);
    loader.addEventListener('pointerdown', leave, { once: true });
    setTimeout(leave, 5000); // safety net
  }

  /* app.js has already rendered once by the time this deferred script runs */
  const initial = typeof state !== 'undefined' ? { screen: state.screen, view: state.view } : {};
  handleRender(initial);
  startLoader();
})();
