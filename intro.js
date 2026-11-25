'use strict';

/* Docee intro: a three-card story that opens once, after the opening film.
   Each card is one benefit for the owner: keep regulars, more revenue, less time at the till.
   - Starts on `docee:loader-done` (or at once if motion.js already finished).
   - Skip for QA with ?nointro=1. Only in the Preview view, never in the galleries.
   - Covers the viewport on phones and only the phone frame in the desktop review shell.
   - Needs globals from app.js / sketches.js: state, go, sketch. */
(() => {
  const params = new URLSearchParams(window.location.search);
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceQuery.matches;

  let root = null;
  let introOpen = false;

  /* ---------- intro ---------- */
  const TONES = ['blue', 'cream', 'dark'];
  const THEME = { blue: '#2425D6', cream: '#F3F1EA', dark: '#101018' };


  /* Small line-art illustrations, drawn on like the app's other sketches */
  const sk = (inner, cls = '') => `<svg class="sketch di-art-svg ${cls}" viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g filter="url(#sketch-rough)">${inner}</g></svg>`;
  const chartArt = sk('<path d="M18 16V140H146"/><path d="M34 140v-26h18v26M62 140v-40h18v40M90 140v-62h18v62M118 140v-84h18v84" stroke-width="2.6"/><path d="M30 84c22-4 40-18 58-42 8-11 18-18 32-22M104 18h18v16" stroke-width="2.4"/><path d="M130 66l3-7 3 7-7-3h8Z" stroke-width="1.8"/><path d="M40 60h.1M52 44h.1" stroke-width="3.4"/>');
  const arrowArt = `<svg class="di-step-arrow" viewBox="0 0 28 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 11c7-3 14-3 22-1M18 3l7 7-7 7"/></svg>`;

  function cardsHtml() {
    return `
      <section class="di-card" data-tone="blue" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="di-body">
          <h2 class="di-title"><span>Keep your</span><span class="indent">regulars coming</span><em class="hand">back.</em></h2>
          <div class="di-art" aria-hidden="true">${sketch('berryStamp', 'di-art-svg')}${sketch('berryStamp', 'di-art-svg')}${sketch('berryStamp', 'di-art-svg')}<span class="di-art-arrow">${arrowArt}</span>${sketch('gift', 'di-art-svg')}</div>
          <p class="di-lead">Points, berry stamps and birthday treats give every customer a reason to return.</p>
        </div>
      </section>
      <section class="di-card" data-tone="cream" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="di-body">
          <h2 class="di-title"><span>More visits,</span><span class="indent">more</span><em class="hand">revenue.</em></h2>
          <div class="di-art di-art-solo" aria-hidden="true">${chartArt}</div>
          <p class="di-lead">Offers fill quiet hours. Rewards lift the order. See who is back in your dashboard.</p>
        </div>
      </section>
      <section class="di-card" data-tone="dark" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="di-body">
          <h2 class="di-title"><span>Less time at</span><em class="hand">the till.</em></h2>
          <div class="di-art" aria-hidden="true">${sketch('receipt', 'di-art-svg')}<span class="di-art-arrow">${arrowArt}</span>${sketch('acai', 'di-art-svg')}</div>
          <p class="di-lead">Bowls are made before they arrive. Scan in a second, no punch cards, fewer phone calls.</p>
        </div>
      </section>`;
  }

  function openIntro() {
    if (introOpen || root) return;
    if (typeof state === 'undefined' || state.view !== 'preview' || typeof sketch !== 'function') return;
    if (params.get('nointro') === '1' || document.getElementById('docee-intro')) return;

    const app = document.getElementById('app');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const themeBefore = themeMeta && themeMeta.getAttribute('content');
    const opener = document.activeElement;
    const mobileMode = () => document.body.classList.contains('mobile-app-mode');
    introOpen = true;

    root = document.createElement('div');
    root.id = 'docee-intro';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', 'About Docee');
    root.tabIndex = -1;
    root.dataset.tone = 'blue';
    root.innerHTML = `<div class="di-track" aria-live="off">${cardsHtml()}</div>
      <button type="button" class="di-skip">skip</button>
      <div class="di-foot"><div class="di-dots" role="group" aria-label="Choose a card">${TONES.map((t, i) => `<button type="button" class="di-dot" aria-label="Card ${i + 1} of 3"><i></i></button>`).join('')}</div><button type="button" class="di-next sk-cta"><span>next</span></button></div>`;
    document.body.appendChild(root);
    if (app) app.inert = true;

    const track = root.querySelector('.di-track');
    const cards = [...root.querySelectorAll('.di-card')];
    const dots = [...root.querySelectorAll('.di-dot')];
    const nextBtn = root.querySelector('.di-next');
    const skipBtn = root.querySelector('.di-skip');
    let idx = 0;
    const drawn = new Set();

    const place = () => {
      const frame = document.querySelector('.phone-frame');
      const inner = frame && (frame.querySelector(':scope > .mobile-app') || frame);
      if (!frame || mobileMode()) {
        root.style.cssText = '';
        root.classList.remove('di-boxed');
      } else {
        const r = inner.getBoundingClientRect();
        root.classList.add('di-boxed');
        root.style.top = r.top + window.scrollY + 'px';   // absolute, so it scrolls with the phone frame
        root.style.left = r.left + window.scrollX + 'px';
        root.style.width = r.width + 'px';
        root.style.height = r.height + 'px';
        root.style.borderRadius = getComputedStyle(inner).borderRadius;
      }
      const b = root.getBoundingClientRect();
      root.style.setProperty('--cw', b.width + 'px');
      root.style.setProperty('--ch', b.height + 'px');
      if (track.clientWidth) track.scrollLeft = idx * track.clientWidth; // keep the card centred after a resize
    };

    const draw = i => {
      if (drawn.has(i) || reduced() || typeof window.doceeDrawOn !== 'function') return;
      drawn.add(i);
      cards[i].querySelectorAll('.sketch').forEach((svg, n) => {
        svg.classList.add('draw-pending');
        setTimeout(() => window.doceeDrawOn(svg, svg.classList.contains('di-mascot') ? { dur: 700, step: 42, total: 1400 } : { dur: 520, step: 36, total: 800 }), 120 + n * 140);
      });
    };

    const setActive = i => {
      if (i === idx && root.dataset.ready) return;
      idx = i;
      root.dataset.ready = '1';
      const tone = TONES[i];
      root.dataset.tone = tone;
      if (themeMeta) themeMeta.setAttribute('content', THEME[tone]);
      dots.forEach((d, n) => { if (n === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
      const last = i === cards.length - 1;
      nextBtn.querySelector('span').textContent = last ? 'try the app' : 'next';
      nextBtn.setAttribute('aria-label', last ? 'Try the app' : `Next card, ${i + 2} of 3`);
      nextBtn.classList.toggle('di-final', last);
      cards.forEach((c, n) => { c.classList.toggle('is-active', n === i); });
      draw(i);
    };

    const goTo = (i, smooth = true) => {
      const n = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: n * track.clientWidth, behavior: smooth && !reduced() ? 'smooth' : 'auto' });
      setActive(n);
    };

    let raf = 0;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = track.clientWidth || 1;
        setActive(Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / w))));
      });
    }, { passive: true });

    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('resize', place);
      if (app) app.inert = false;
      if (themeMeta && themeBefore) themeMeta.setAttribute('content', themeBefore);
      introOpen = false;
      root.classList.add('di-out');
      const gone = root;
      root = null;
      setTimeout(() => gone.remove(), reduced() ? 0 : 420);
      // Same destination as the welcome screen's own logic: land on Welcome unless a screen was linked (#home etc.).
      if (!window.location.hash && typeof go === 'function') go('welcome');
      requestAnimationFrame(() => {
        const target = document.querySelector('.phone-frame .sk-next, .phone-frame .sk-hello button');
        const back = target || (opener && opener.isConnected && opener !== document.body ? opener : null);
        if (back) back.focus({ preventScroll: true });
      });
      document.dispatchEvent(new CustomEvent('docee:intro-done'));
    }

    function onKey(e) {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); goTo(idx + 1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(idx - 1); }
      else if (e.key === 'Tab') {
        const items = [skipBtn, ...dots, nextBtn].filter(el => !el.hidden);
        const at = items.indexOf(document.activeElement);
        if (!root.contains(document.activeElement)) { e.preventDefault(); items[0].focus(); return; }
        const to = e.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : (at === items.length - 1 ? 0 : at + 1);
        e.preventDefault();
        items[to].focus();
      }
    }

    skipBtn.addEventListener('click', close);
    nextBtn.addEventListener('click', () => (idx >= cards.length - 1 ? close() : goTo(idx + 1)));
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
    document.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', place);

    place();
    if (root.classList.contains('di-boxed')) root.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    setActive(0);
    root.focus({ preventScroll: true });
    requestAnimationFrame(() => root && root.classList.add('di-in'));
  }

  /* ---------- start ---------- */
  const start = () => { try { openIntro(); } catch (e) { introOpen = false; if (root) { root.remove(); root = null; } const a = document.getElementById('app'); if (a) a.inert = false; } };
  const initialScreen = typeof state !== 'undefined' ? state : null;
  if (params.get('nointro') === '1' || !initialScreen || initialScreen.view !== 'preview') {
    /* nothing to open */
  } else if (window.doceeLoaderDone) start();
  else document.addEventListener('docee:loader-done', start, { once: true });
})();
