'use strict';

/* Docee intro: a three-card story that opens once, after the loader, plus the
   one-time "hi <name>" sticky note on Home for personal links (?for=Sam).
   - Starts on `docee:loader-done` (or at once if motion.js already finished).
   - Skip for QA with ?nointro=1. Only in the Preview view, never in the galleries.
   - Covers the viewport on phones and only the phone frame in the desktop review shell.
   - Needs globals from app.js / sketches.js: state, forName, escapeHtml, go, sketch. */
(() => {
  const params = new URLSearchParams(window.location.search);
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reduceQuery.matches;
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { return fallback; } };
  const who = typeof forName === 'string' ? forName : '';
  const esc = value => (typeof escapeHtml === 'function' ? escapeHtml(value) : String(value).replace(/[&<>"']/g, ''));

  let root = null;
  let introOpen = false;

  /* ---------- sticky note on Home (personal links only) ---------- */
  const NOTE_KEY = 'docee-note-done';
  let noteDone = safe(() => sessionStorage.getItem(NOTE_KEY) === '1', false);
  let noteSeen = false;
  const finishNote = () => {
    noteDone = true;
    safe(() => sessionStorage.setItem(NOTE_KEY, '1'));
    document.querySelectorAll('.dn').forEach(el => el.remove());
  };

  function showNote(screen, view) {
    if (!who || noteDone || introOpen) return;
    if (view !== 'preview' || screen !== 'home') {
      if (noteSeen && view === 'preview') finishNote(); // left Home after seeing it: that was its one showing
      return;
    }
    const app = document.querySelector('.phone-frame > .mobile-app');
    const card = app && app.querySelector('.sk-points');
    if (!card || app.querySelector('.dn')) return;
    noteSeen = true;
    card.insertAdjacentHTML('beforebegin', `<aside class="dn" role="note" aria-label="A note from Docee"><p class="dn-text">hi ${esc(who)}! this is what your regulars would see</p><button type="button" class="dn-x" aria-label="Dismiss note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button><svg class="dn-arrow" viewBox="0 0 40 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 4c18 4 24 16 18 32"/><path d="M14 30l12 10 6-14"/></svg></aside>`);
    const note = app.querySelector('.dn');
    note.querySelector('.dn-x').addEventListener('click', finishNote);
    // Bring the note and the card it points at into view, once, unless the visitor has already scrolled.
    const scroller = app.querySelector('.app-scroll');
    if (scroller && !reduced() && scroller.scrollTop < 8) {
      setTimeout(() => { if (note.isConnected && scroller.scrollTop < 8) note.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 1100);
    }
  }

  document.addEventListener('docee:render', event => {
    const d = event.detail || {};
    showNote(d.screen, d.view);
  });

  /* ---------- intro ---------- */
  const TONES = ['blue', 'cream', 'dark'];
  const THEME = { blue: '#2425D6', cream: '#F3F1EA', dark: '#101018' };

  const scanArt = `<svg class="sketch di-step-art" viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g filter="url(#sketch-rough)"><rect x="44" y="14" width="72" height="132" rx="12"/><path d="M70 24h20"/><path d="M60 52v-8h8M100 44h8v8M108 92v8h-8M68 100h-8v-8"/><path d="M72 62h6v6h-6zM84 62h4M72 76h4M82 76h6v6h-6zM92 70v4"/><path d="M66 128h28"/></g></svg>`;
  const arrowArt = `<svg class="di-step-arrow" viewBox="0 0 28 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 11c7-3 14-3 22-1M18 3l7 7-7 7"/></svg>`;
  const tickArt = `<svg class="di-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13c3 1 5 4 6 6 3-7 6-11 11-14"/></svg>`;

  function cardsHtml() {
    const hi = who
      ? `<span>Hi ${esc(who)} —</span><span class="indent">your regulars,</span><em class="hand">rewarded.</em>`
      : `<span>Your regulars,</span><em class="hand">rewarded.</em>`;
    return `
      <section class="di-card" data-tone="blue" role="group" aria-roledescription="slide" aria-label="1 of 3">
        <div class="di-body">
          <h2 class="di-title">${hi}</h2>
          ${sketch('mascot', 'di-mascot')}
          <p class="di-lead">A Docee app that turns every visit into a reason to come back.</p>
        </div>
      </section>
      <section class="di-card" data-tone="cream" role="group" aria-roledescription="slide" aria-label="2 of 3">
        <div class="di-body">
          <h2 class="di-title"><span>Every visit</span><em class="hand">counts.</em></h2>
          <ol class="di-steps">
            <li>${scanArt}<span class="hand">scan</span></li>
            <li class="di-sep" aria-hidden="true">${arrowArt}</li>
            <li>${sketch('berryStamp', 'di-step-art')}<span class="hand">collect berries</span></li>
            <li class="di-sep" aria-hidden="true">${arrowArt}</li>
            <li>${sketch('gift', 'di-step-art')}<span class="hand">free treat</span></li>
          </ol>
          <p class="di-lead">Scan at the counter, collect a berry with every visit, then enjoy a treat on the house.</p>
        </div>
      </section>
      <section class="di-card" data-tone="dark" role="group" aria-roledescription="slide" aria-label="3 of 3">
        <div class="di-body">
          <h2 class="di-title"><span>Built for</span><em class="hand">Docee.</em></h2>
          <ul class="di-list">
            <li>${tickArt}<span><b>Order ahead</b><small>skip the queue</small></span></li>
            <li>${tickArt}<span><b>Rewards</b><small>berries, treats and birthdays</small></span></li>
            <li>${tickArt}<span><b>Your own dashboard</b><small>and push offers to your regulars</small></span></li>
          </ul>
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
    root.setAttribute('aria-label', who ? `Welcome ${who}: about Docee` : 'About Docee');
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
        showNote(state.screen, state.view);
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
    if (initialScreen) showNote(initialScreen.screen, initialScreen.view);
  } else if (window.doceeLoaderDone) start();
  else document.addEventListener('docee:loader-done', start, { once: true });
})();
