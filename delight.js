'use strict';

/* Docee delight: demo scan celebration (scan line, +N, count-up, berry burst,
   stamp thump, reward-unlocked moment). Loaded after app.js; app.js only calls
   window.DoceeDelight.scan(info) from a click, never at parse time.
   No libraries: DOM + inline SVG + the Web Animations API. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const vibrate = pattern => { try { navigator.vibrate && navigator.vibrate(pattern); } catch (e) { /* unsupported */ } };
  const announce = (name, detail) => document.dispatchEvent(new CustomEvent(name, { detail }));
  const phone = () => document.querySelector('.phone-frame .mobile-app');
  let running = false;
  let run = 0;

  const SHAPES = {
    berry: '<path d="M12 7.5c-4 0-6.5 2.6-6.5 6.2 0 3.7 2.9 6.3 6.5 6.3s6.5-2.6 6.5-6.3c0-3.6-2.5-6.2-6.5-6.2Z"/><path d="M12 7.5c-.5-2 .8-3.7 3-4.2M12 7.5c-1.6-1.7-3.8-1.7-5-.8"/>',
    spark: '<path d="M12 2c.8 5.5 4.5 9.2 10 10-5.5.8-9.2 4.5-10 10-.8-5.5-4.5-9.2-10-10 5.5-.8 9.2-4.5 10-10Z"/>',
    heart: '<path d="M12 20.5s-8-5-8-11.2A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8 2.7c0 6.2-8 11.2-8 11.2Z"/>',
  };

  function svg(inner, size, stroke, width = 1.8, viewBox = '0 0 24 24') {
    const el = document.createElementNS(NS, 'svg');
    el.setAttribute('viewBox', viewBox);
    if (size) { el.setAttribute('width', size); el.setAttribute('height', size); }
    el.setAttribute('fill', 'none');
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', width);
    el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = inner;
    return el;
  }

  /* Centre of an element in the phone's own (unscaled) coordinates. */
  function centreIn(app, el) {
    const a = app.getBoundingClientRect(), r = el.getBoundingClientRect();
    const scale = a.width / app.offsetWidth || 1;
    return { x: (r.left + r.width / 2 - a.left) / scale, y: (r.top + r.height / 2 - a.top) / scale };
  }

  function burst(app, origin, count = 26) {
    const layer = document.createElement('div');
    layer.className = 'dl-burst';
    app.append(layer);
    const kinds = ['berry', 'spark', 'heart'];
    const duration = 1350, gravity = 760;
    for (let i = 0; i < count; i++) {
      const size = 18 + Math.random() * 16;
      const node = svg(SHAPES[kinds[i % kinds.length]], size, '#fff');
      node.style.left = `${origin.x - size / 2}px`;
      node.style.top = `${origin.y - size / 2}px`;
      layer.append(node);
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
      const speed = 150 + Math.random() * 230;
      const vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed;
      const spin = (Math.random() - 0.5) * 540;
      const frames = [0, .12, .3, .55, .8, 1].map(t => {
        const s = t * duration / 1000;
        return {
          offset: t,
          opacity: t === 0 ? 0 : t > .72 ? Math.max(0, 1 - (t - .72) / .28) : 1,
          transform: `translate(${vx * s}px, ${vy * s + .5 * gravity * s * s}px) rotate(${spin * t}deg) scale(${t === 0 ? .3 : 1})`,
        };
      });
      node.animate(frames, { duration, delay: Math.random() * 90, easing: 'linear', fill: 'both' });
    }
    setTimeout(() => layer.remove(), duration + 250);
  }

  function countUp(el, from, to, duration) {
    const start = performance.now();
    return new Promise(resolve => {
      const tick = now => {
        const t = Math.min(1, (now - start) / duration);
        el.textContent = Math.round(from + (to - from) * easeOut(t));
        if (t < 1) requestAnimationFrame(tick); else { el.textContent = to; resolve(); }
      };
      requestAnimationFrame(tick);
    });
  }

  function pops(info) {
    const copy = document.querySelector('.phone-frame .sk-scan-copy');
    if (!copy) return;
    const plus = document.createElement('span');
    plus.className = 'dl-plus';
    plus.setAttribute('aria-hidden', 'true');
    plus.textContent = `+${info.amount}`;
    const scribble = svg('<path d="M3 6c14-4 28 2 44-2 14-3 26 1 44-1"/>', 0, '#E8D2AE', 2.2, '0 0 94 10');
    scribble.setAttribute('preserveAspectRatio', 'none');
    plus.append(scribble);
    copy.append(plus);
    plus.animate([
      { opacity: 0, transform: 'translateY(14px) scale(.3) rotate(-18deg)' },
      { opacity: 1, transform: 'translateY(-4px) scale(1.28) rotate(-6deg)', offset: .28 },
      { opacity: 1, transform: 'translateY(0) scale(1) rotate(-8deg)', offset: .55 },
      { opacity: 1, transform: 'translateY(-6px) scale(1) rotate(-8deg)', offset: .82 },
      { opacity: 0, transform: 'translateY(-26px) scale(.96) rotate(-8deg)' },
    ], { duration: 1300, easing: 'ease-out', fill: 'both' }).finished.then(() => plus.remove(), () => plus.remove());
    scribble.animate([{ clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0 0 0)' }], { duration: 320, delay: 260, easing: 'ease-out', fill: 'both' });
  }

  function thump(stampEl) {
    if (!stampEl) return;
    const rot = parseFloat(getComputedStyle(stampEl).getPropertyValue('--rot')) || 0;
    stampEl.animate([
      { opacity: 0, transform: `scale(1.4) rotate(${rot + 16}deg)` },
      { opacity: 1, transform: `scale(.9) rotate(${rot - 4}deg)`, offset: .55 },
      { opacity: 1, transform: 'scale(1) rotate(0deg)' },
    ], { duration: 420, easing: 'cubic-bezier(.3,1.4,.5,1)' });
    // Ink splat: a ring and a few flicks, stroked only.
    const ink = getComputedStyle(stampEl).getPropertyValue('--dl-disc').trim() || 'currentColor';
    const splat = svg('<circle cx="40" cy="40" r="26"/><path d="M40 6v7M40 67v7M6 40h7M67 40h7M16 16l5 5M64 64l-5-5M64 16l-5 5M16 64l5-5"/>', 0, ink, 2.4, '0 0 80 80');
    splat.setAttribute('class', 'dl-splat');
    stampEl.append(splat);
    splat.animate([{ opacity: .85, transform: 'scale(.45)' }, { opacity: 0, transform: 'scale(1.05)' }], { duration: 520, delay: 120, easing: 'ease-out', fill: 'both' }).finished.then(() => splat.remove(), () => splat.remove());
  }

  function swapStamps(html) {
    const old = document.querySelector('.phone-frame .dl-stamps');
    if (!old || !html) return null;
    old.outerHTML = html;
    return document.querySelector('.phone-frame .dl-stamps .dl-stamp.is-new');
  }

  function closeUnlock(restoreFocus = true) {
    const node = document.querySelector('.dl-unlock');
    if (!node) return;
    node.remove();
    if (restoreFocus) document.querySelector('.phone-frame .dl-demo')?.focus({ preventScroll: true });
  }

  function showUnlock(app, reward, animate) {
    closeUnlock(false);
    const wrap = document.createElement('div');
    wrap.className = 'dl-unlock';
    wrap.innerHTML = `<div class="dl-unlock-card" role="dialog" aria-modal="true" aria-labelledby="dl-unlock-title"><div class="dl-unlock-art">${sketch('gift', 'dl-unlock-art-svg')}</div><p class="dl-unlock-kicker">you unlocked</p><h2 id="dl-unlock-title">${escapeHtml(reward.name.toLowerCase())}!</h2><button class="dl-view sk-cta" data-action="reward" data-reward="${reward.id}">view it</button><button data-dl-close>keep scanning</button></div>`;
    app.append(wrap);
    wrap.querySelector('.dl-view').focus({ preventScroll: true });
    if (!animate) return;
    wrap.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, fill: 'both' });
    wrap.querySelector('.dl-unlock-card').animate([{ transform: 'scale(.86)', opacity: 0 }, { transform: 'scale(1.03)', opacity: 1, offset: .65 }, { transform: 'scale(1)', opacity: 1 }], { duration: 380, easing: 'ease-out', fill: 'both' });
    const art = wrap.querySelector('.dl-unlock-art');
    art.animate([{ transform: 'scale(.2) rotate(-24deg)' }, { transform: 'scale(1.25) rotate(8deg)', offset: .6 }, { transform: 'scale(1) rotate(0)' }], { duration: 600, delay: 120, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'both' });
    burst(app, centreIn(app, art), 16);
  }

  async function scan(info) {
    const app = phone();
    const ptsEl = document.querySelector('.phone-frame [data-dl="pts"]');
    if (!app || !ptsEl) { render(true); return; }
    const mine = ++run;
    const live = () => run === mine && ptsEl.isConnected;
    running = true;
    const button = document.querySelector('.phone-frame .dl-demo');
    button?.setAttribute('aria-busy', 'true');
    try {
      if (reducedQuery.matches) {
        ptsEl.textContent = info.after;
        swapStamps(info.stampsHtml);
        announce('docee:points-earned', info);
        if (info.free) announce('docee:stamp-card-full', info);
        showToast(`+${info.amount} points${info.free ? ' · free drink unlocked' : ''}`);
        if (info.unlocked) { showUnlock(app, info.unlocked, false); announce('docee:reward-unlocked', info.unlocked); }
        return;
      }
      // 1. QR pulse and scan line (~600ms)
      const qrBox = document.querySelector('.phone-frame .sk-qr');
      const qrCode = qrBox?.querySelector('.qr-code');
      vibrate(10);
      if (qrBox && qrCode) {
        qrCode.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.05)', offset: .4 }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-in-out' });
        const line = document.createElement('div');
        line.className = 'dl-scanline';
        qrBox.append(line);
        const h = qrCode.offsetHeight || 184;
        line.animate([
          { opacity: 0, transform: 'translateY(0)' },
          { opacity: 1, transform: 'translateY(8px)', offset: .1 },
          { opacity: 1, transform: `translateY(${h - 8}px)`, offset: .9 },
          { opacity: 0, transform: `translateY(${h}px)` },
        ], { duration: 600, easing: 'ease-in-out', fill: 'both' }).finished.then(() => line.remove(), () => line.remove());
      }
      await wait(600);
      if (!live()) return;
      // 2-4. +N pops, points count up, burst flies out
      vibrate([18, 40, 24]);
      announce('docee:points-earned', info);
      pops(info);
      burst(app, centreIn(app, ptsEl.parentElement));
      ptsEl.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)', offset: .3 }, { transform: 'scale(1)' }], { duration: 650, easing: 'ease-out' });
      const counting = countUp(ptsEl, info.before, info.after, 650);
      await wait(380);
      if (!live()) { await counting; return; }
      // 5. the stamp thumps in
      thump(swapStamps(info.stampsHtml));
      if (info.free) { vibrate([20, 50, 20]); announce('docee:stamp-card-full', info); }
      await counting;
      await wait(900);
      if (!live()) return;
      if (info.unlocked) {
        vibrate([24, 60, 24, 60, 50]);
        showUnlock(app, info.unlocked, true);
        announce('docee:reward-unlocked', info.unlocked);
      }
    } finally {
      if (run === mine) running = false;
      button?.removeAttribute('aria-busy');
    }
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-dl-close]')) closeUnlock();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.querySelector('.dl-unlock')) closeUnlock();
  });

  window.DoceeDelight = { scan, busy: () => running };
})();
