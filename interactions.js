'use strict';
/* Docee interactions (loaded after app.js):
   A. Rails (.sk-rail, .sk-promos): the card nearest the snap position becomes .is-active;
      home and rewards rails also get tappable pager dots.
   B. Screen changes use the View Transitions API (feature-detected): tapped cards grow into
      the destination hero, other changes cross-fade. app.js calls window.doceeTransition(update, info). */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LIVE_APP = '.phone-frame > .mobile-app:not(.gallery-mobile)';
  const ITEM = '.sk-card, .sk-promo';
  let controllers = [];

  /* ---------- A. Rails ---------- */
  function setupRail(rail, live) {
    const items = [...rail.children].filter(el => el.matches(ITEM));
    if (!items.length) return;
    const isPromo = items[0].classList.contains('sk-promo');
    let active = -1, want = null, frame = 0, dots = [];

    function apply(index) {
      if (index === active) return;
      active = index;
      items.forEach((el, i) => {
        el.classList.toggle('is-active', i === index);
        if (isPromo) el.classList.toggle('is-outline', i !== index);
      });
      dots.forEach((dot, i) => {
        if (i === index) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current');
      });
    }

    // Scroll position that would put item i at the snap start, clamped to what the rail can reach.
    function snaps() {
      const max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
      const railLeft = rail.getBoundingClientRect().left;
      const sl = rail.scrollLeft;
      return items.map(el => {
        const r = el.getBoundingClientRect();
        // Centre is unaffected by the scale transform, so use it with the untransformed width.
        const left = r.left + r.width / 2 - el.offsetWidth / 2 - railLeft + sl;
        return Math.min(max, Math.max(0, left - pad));
      });
    }

    function update() {
      frame = 0;
      const sl = rail.scrollLeft;
      const pts = snaps();
      let best = 0, bestDist = Infinity;
      pts.forEach((p, i) => {
        const d = Math.abs(p - sl);
        if (d < bestDist - 0.5) { best = i; bestDist = d; }
        else if (d <= bestDist + 0.5) {
          // Tie (cards clamped at the end of the rail): honour a tapped dot, else take the later card.
          if (want === i || (want === null || best !== want)) { best = i; bestDist = Math.min(bestDist, d); }
        }
      });
      apply(best);
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };

    if (live) {
      if (!isPromo) {
        const wrap = document.createElement('div');
        wrap.className = 'sk-dots';
        wrap.setAttribute('role', 'group');
        wrap.setAttribute('aria-label', 'Choose a card');
        dots = items.map((el, i) => {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', `Show ${el.getAttribute('aria-label') || 'card ' + (i + 1)}`);
          b.addEventListener('click', () => {
            want = i;
            const target = snaps()[i];
            rail.scrollTo({ left: target, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
            apply(i);
          });
          wrap.append(b);
          return b;
        });
        rail.after(wrap);
      }
      rail.addEventListener('scroll', queue, { passive: true });
      ['pointerdown', 'touchstart', 'wheel'].forEach(t => rail.addEventListener(t, () => { want = null; }, { passive: true }));
      controllers.push({ rail, queue, update, snaps });
    }
    update();
    return { update, snaps };
  }

  function initRails() {
    controllers = controllers.filter(c => c.rail.isConnected);
    document.querySelectorAll('.sk-rail, .sk-promos').forEach(rail => {
      if (rail.dataset.dxReady) return;
      rail.dataset.dxReady = '1';
      setupRail(rail, !!rail.closest(LIVE_APP));
    });
  }
  window.docee = Object.assign(window.docee || {}, { refreshRails: initRails });

  const root = document.getElementById('app');
  if (root) new MutationObserver(initRails).observe(root, { childList: true });
  window.addEventListener('resize', () => controllers.forEach(c => c.queue()));
  initRails();

  /* ---------- B. View transitions ---------- */
  let animateNext = false, lastTap = null;
  const ANIMATED_ACTIONS = ['screen', 'product', 'reward', 'select-store'];
  const arm = () => { animateNext = true; setTimeout(() => { animateNext = false; }, 0); };

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target || target.closest('.gallery-open')) return;
    lastTap = { el: target, back: !!event.target.closest('.sk-top .sk-icon[aria-label="Back"], .map-back, .text-button') };
    if (ANIMATED_ACTIONS.includes(target.dataset.action)) arm();
  }, true);
  window.addEventListener('popstate', () => { lastTap = { el: null, back: true }; }, true);

  const isDetail = id => id === 'product' || id === 'reward-detail';
  const setName = (el, name) => { if (el) el.style.viewTransitionName = name; };
  const clearNames = () => document.querySelectorAll('[style*="view-transition-name"]').forEach(el => { el.style.viewTransitionName = ''; if (!el.getAttribute('style')) el.removeAttribute('style'); });
  const cardFor = el => el && el.closest('.sk-card, .sk-tile, .sk-promo');
  const artOf = el => el && el.querySelector('.sk-card-art, .sk-tile-art, .sk-promo-art');

  // On the destination of a Back, find the card for the item just left and bring it into view.
  function revealCard(id, kind) {
    const app = document.querySelector(LIVE_APP);
    if (!app) return null;
    const sel = kind === 'reward' ? `[data-reward="${CSS.escape(id)}"]` : `[data-product="${CSS.escape(id)}"]`;
    const cards = [...app.querySelectorAll(sel)].filter(el => el.matches('.sk-card, .sk-tile, .sk-promo'));
    if (!cards.length) return null;
    const scroller = app.querySelector('.app-scroll');
    for (const card of cards) {
      const rail = card.closest('.sk-rail, .sk-promos');
      if (rail) {
        const pad = parseFloat(getComputedStyle(rail).scrollPaddingLeft) || 0;
        rail.scrollLeft += card.getBoundingClientRect().left - rail.getBoundingClientRect().left - pad;
      }
      if (scroller) {
        const r = card.getBoundingClientRect(), s = scroller.getBoundingClientRect();
        if (r.bottom > s.bottom - 90) scroller.scrollTop += r.bottom - s.bottom + 120;
        else if (r.top < s.top + 60) scroller.scrollTop -= s.top + 60 - r.top;
        const r2 = card.getBoundingClientRect();
        if (r2.top < s.top || r2.bottom > s.bottom || r2.left < s.left - 1 || r2.right > s.right + 1) continue;
      }
      return card;
    }
    return null;
  }

  window.doceeTransition = function (update, info = {}) {
    const wanted = animateNext || !!info.pop;
    animateNext = false;
    const { from, to } = info;
    const oldApp = document.querySelector(LIVE_APP);
    if (!wanted || !oldApp || from === to || !document.startViewTransition || reduceMotion.matches) {
      update();
      return;
    }

    const tap = lastTap && lastTap.el && lastTap.el.isConnected ? lastTap : null;
    const goingIn = isDetail(to) && !isDetail(from);
    const coming = isDetail(from) && !isDetail(to);
    const kind = from === 'reward-detail' ? 'reward' : 'product';
    const returnId = coming && typeof state !== 'undefined' ? (kind === 'reward' ? state.rewardId : state.productId) : null;

    let morph = false;
    if (goingIn && tap) {
      const card = cardFor(tap.el);
      if (card && (tap.el.dataset.action === 'product' || tap.el.dataset.action === 'reward')) {
        setName(card, 'docee-hero'); setName(artOf(card), 'docee-art'); morph = true;
      }
    } else if (coming) {
      const hero = oldApp.querySelector('.sk-hero');
      if (hero) { setName(hero, 'docee-hero'); setName(hero.querySelector('.sk-hero-art'), 'docee-art'); morph = true; }
    }
    const direction = morph ? 'morph' : (info.pop || (tap && tap.back) || coming) ? 'back' : 'forward';
    document.documentElement.dataset.dnav = direction;
    setName(oldApp, 'docee-screen');

    let transition;
    try {
      transition = document.startViewTransition(() => {
        update();
        const newApp = document.querySelector(LIVE_APP);
        setName(newApp, 'docee-screen');
        if (goingIn && morph) {
          const hero = newApp && newApp.querySelector('.sk-hero');
          setName(hero, 'docee-hero'); setName(hero && hero.querySelector('.sk-hero-art'), 'docee-art');
        } else if (coming && morph) {
          const card = returnId ? revealCard(returnId, kind) : null;
          if (card) { window.docee.refreshRails(); setName(card, 'docee-hero'); setName(artOf(card), 'docee-art'); }
        }
      });
    } catch (err) {
      clearNames();
      delete document.documentElement.dataset.dnav;
      update();
      return;
    }
    const done = () => { clearNames(); delete document.documentElement.dataset.dnav; };
    transition.ready.catch(() => {});
    transition.updateCallbackDone.catch(() => {});
    transition.finished.then(done, done);
  };
})();
