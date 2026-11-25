'use strict';

/* Docee cinematic opening: "from a sketch to your app".
   One SVG scene, one requestAnimationFrame timeline. Only transform, opacity,
   stroke-dashoffset and clip rect widths are animated (no filters, no layout).
   motion.js calls window.doceeCinematic.start(ctx) from its loader section.
   Modes: full (first visit this session, ~6.6s), short (repeat visit, 0.8s),
   static (prefers-reduced-motion: a composed frame for ~1.2s).
   QA: ?cine=full forces the full version, ?noloader=1 skips (handled by motion.js). */
(() => {
  const SEEN_KEY = 'docee-cinematic-seen';
  const COBALT = '#2425D6', CREAM = '#F3F1EA', BEIGE = '#E8D2AE';
  const CX = 180, CY = 365;
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, p) => a + (b - a) * p;
  const eo3 = p => 1 - Math.pow(1 - p, 3);
  const eio = p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const spring = p => (p >= 1 ? 1 : p <= 0 ? 0 : 1 - Math.exp(-7 * p) * Math.cos(11 * p));
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { return fallback; } };
  const f1 = n => Math.round(n * 100) / 100;

  const T_HANDOFF = 5950, T_END = 6850;      // full timeline
  const T_STATIC = 5300;                      // frame used for the reduced-motion composition

  function sparkPath(r) { return `M0 ${-r}L${r * .25} ${-r * .25}L${r} 0L${r * .25} ${r * .25}L0 ${r}L${-r * .25} ${r * .25}L${-r} 0L${-r * .25} ${-r * .25}Z`; }

  function build(mode, who, esc) {
    const full = mode !== 'short';
    const hasWho = !!who;
    const art = n => sketchArt[n] || '';
    const fontHand = "font-family=\"'Docee Hand','Comic Sans MS',cursive\"";
    const fontSans = "font-family=\"'Docee Sans','DM Sans',Arial,sans-serif\"";
    const y1 = 44, y2 = hasWho ? 84 : 72, y3 = hasWho ? 132 : 124;

    const products = ['acai', 'smoothie', 'matcha', 'cream'].map((n, i) =>
      `<g id="cs-p${i}"><g class="cs-g cs-prod" style="--k:1.1"><g transform="translate(-80 -80)">${art(n)}</g></g></g>`).join('');
    const sparks = Array.from({ length: 8 }, (_, i) => `<path id="cs-sp${i}" d="${sparkPath(i % 3 === 0 ? 9 : 7)}" stroke-width="1.8"/>`).join('');
    const berries = [0, 1, 2].map(i => `<g id="cs-b${i}" stroke-width="7"><g transform="translate(-80 -100)">${art('berryStamp')}</g></g>`).join('');
    const stamps = [0, 1, 2, 3].map(i => `<g id="cs-st${i}" stroke-width="4.6"><g transform="translate(-80 -100)">${art('berryStamp')}</g></g>`).join('');

    const shop = `
      <g id="cs-shop">
        <path id="cs-pen" d="M-18 512C10 534 28 490 39.4 471.4" stroke-width="2.4"/>
        <g class="cs-g" style="--k:.5"><g transform="translate(28 194) scale(1.9)">
          <g id="cs-shopart">${art('storefront')}</g>
          <g clip-path="url(#cs-c-sign)"><text id="cs-sign" x="80" y="27.5" text-anchor="middle" font-size="19" fill="#fff" stroke="none" ${fontHand}>docee.</text></g>
        </g></g>
      </g>`;

    const mascotG = `<g id="cs-mascot"><g id="cs-mcol" stroke="#fff" stroke-width="2.7"><g transform="translate(-80 -140)">${art('mascot')}</g></g></g>`;

    const phone = `
      <g id="cs-phone">
        <path id="cs-outline" d="M180 160H262a30 30 0 0 1 30 30V554a30 30 0 0 1-30 30H98a30 30 0 0 1-30-30V190a30 30 0 0 1 30-30Z" stroke-width="3"/>
        <path id="cs-island" d="M163 177h34" stroke-width="4"/>
      </g>
      <g clip-path="url(#cs-c-scr)"><rect id="cs-cream" x="74" y="166" width="212" height="412" fill="${CREAM}" stroke="none"/></g>`;

    const ui = `
      <g id="cs-ui" stroke="${COBALT}" fill="none">
        <g id="cs-card"><rect id="cs-cardbox" x="92" y="272" width="176" height="110" rx="16" stroke-width="2.4"/>
          <text x="106" y="297" font-size="12" font-weight="600" fill="${COBALT}" fill-opacity=".72" stroke="none" ${fontSans}>your points</text>
          <text id="cs-num" x="104" y="350" font-size="58" fill="${COBALT}" stroke="none" ${fontHand}>0</text>
          <text id="cs-pts" x="190" y="350" font-size="19" fill="${COBALT}" stroke="none" ${fontHand}>pts</text>
          <text x="106" y="371" font-size="11" fill="${COBALT}" fill-opacity=".72" stroke="none" ${fontSans}>20 to your next treat</text>
          <g id="cs-gift" class="cs-g" style="--k:2.2" transform="translate(222 292) scale(.26)">${art('gift')}</g>
        </g>
        <text id="cs-lbl" x="94" y="421" font-size="17" fill="${COBALT}" stroke="none" ${fontHand}>your berries</text>
        ${stamps}
        <circle id="cs-ghost" cx="248" cy="459" r="14" stroke-width="1.6" stroke-opacity=".38"/>
        <g id="cs-pill">
          <rect x="92" y="486" width="176" height="56" rx="28" fill="${BEIGE}" stroke="none"/>
          <path d="M120 504v-8h8M148 496h8v8M156 524v8h-8M128 532h-8v-8" stroke-width="2"/>
          <text x="216" y="522" text-anchor="middle" font-size="27" fill="${COBALT}" stroke="none" ${fontHand}>scan</text>
        </g>
        <rect id="cs-ring" x="92" y="486" width="176" height="56" rx="28" stroke-width="2"/>
      </g>`;

    const head = `
      <g id="cs-head" stroke="none">
        ${hasWho ? `<g clip-path="url(#cs-c-h0)"><text x="28" y="${y1}" font-size="19" font-weight="600" fill="#fff" fill-opacity=".86" ${fontSans}>Hi ${esc(who)} —</text></g>` : ''}
        <g clip-path="url(#cs-c-h1)"><text x="${hasWho ? 48 : 28}" y="${y2}" font-size="${hasWho ? 30 : 33}" font-weight="600" letter-spacing="-.6" fill="#fff" ${fontSans}>your regulars,</text></g>
        <g clip-path="url(#cs-c-h2)"><text x="334" y="${y3}" text-anchor="end" font-size="52" fill="${BEIGE}" ${fontHand}>rewarded.</text></g>
        <path id="cs-under" d="M150 ${y3 + 9}c40-6 110-8 182-1" stroke="${BEIGE}" stroke-width="2.2" fill="none"/>
      </g>
      <text id="cs-sign-off" x="${CX}" y="618" text-anchor="middle" font-size="21" fill="${BEIGE}" fill-opacity=".92" stroke="none" ${fontHand}>${hasWho ? `made for ${esc(who)}` : 'your little treat club'}</text>`;

    const clips = `
      <clipPath id="cs-c-sign"><rect id="cs-cs" x="0" y="0" width="0" height="40"/></clipPath>
      <clipPath id="cs-c-scr"><rect x="74" y="166" width="212" height="412" rx="24"/></clipPath>
      <clipPath id="cs-c-h0"><rect id="cs-ch0" x="0" y="0" width="0" height="60"/></clipPath>
      <clipPath id="cs-c-h1"><rect id="cs-ch1" x="0" y="${y2 - 40}" width="0" height="54"/></clipPath>
      <clipPath id="cs-c-h2"><rect id="cs-ch2" x="0" y="${y3 - 52}" width="0" height="70"/></clipPath>`;

    const body = full
      ? `${shop}<g id="cs-zoom">${phone}<g id="cs-prods">${products}</g><g id="cs-fx">${sparks}${berries}</g>${mascotG}${ui}</g>${head}`
      : `${mascotG}`;
    return `<svg class="cs-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><defs>${clips}</defs>${body}</svg>`;
  }

  function start(ctx) {
    const { loader, openGate, loaderDone, who = '', esc, reduced } = ctx;
    const params = new URLSearchParams(window.location.search);
    const seen = safe(() => sessionStorage.getItem(SEEN_KEY) === '1', false);
    const mode = reduced ? 'static' : (seen && params.get('cine') !== 'full') ? 'short' : 'full';
    safe(() => sessionStorage.setItem(SEEN_KEY, '1'));

    const app = document.getElementById('app');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const themeBefore = themeMeta && themeMeta.getAttribute('content');
    if (themeMeta) themeMeta.setAttribute('content', COBALT);
    if (app) app.inert = true;

    loader.innerHTML = `<div class="cs">${build(mode, who, esc)}<button type="button" class="cs-skip">skip</button></div>`;
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', who ? `Opening Docee, made for ${who}` : 'Opening Docee');
    loader.removeAttribute('aria-hidden');
    loader.classList.remove('dl-pre');
    loader.classList.add('dl-on', 'cs-on', 'cs-' + mode);

    const mobileMode = () => document.body.classList.contains('mobile-app-mode');
    const place = () => {
      const frame = document.querySelector('.phone-frame');
      const inner = frame && (frame.querySelector(':scope > .mobile-app') || frame);
      if (!frame || mobileMode()) { loader.style.cssText = ''; loader.classList.remove('dl-boxed'); return; }
      const r = inner.getBoundingClientRect();
      loader.classList.add('dl-boxed');
      loader.style.top = r.top + 'px';
      loader.style.left = r.left + 'px';
      loader.style.width = r.width + 'px';
      loader.style.height = r.height + 'px';
      loader.style.borderRadius = getComputedStyle(inner).borderRadius;
    };
    place();
    window.addEventListener('resize', place);

    const $ = id => loader.querySelector('#' + id);
    const set = (el, name, v) => { if (el) el.setAttribute(name, v); };

    /* ---------- timeline engine ---------- */
    const tracks = [];
    const add = (a, b, fn, live) => tracks.push({ a, b, fn, live: !!live, last: -1 });
    const step = t => {
      for (const k of tracks) {
        const p = clamp((t - k.a) / (k.b - k.a));
        if (p === k.last && !(k.live && p > 0 && p < 1)) continue;
        k.last = p;
        k.fn(p, t);
      }
    };

    const SHAPES = 'path,circle,ellipse,line,polyline,rect';
    const prep = (root, scale = 1) => [...(root.matches(SHAPES) ? [root] : []), ...root.querySelectorAll(SHAPES)]
      .filter(el => !el.closest('clipPath,defs'))
      .map(el => {
        let L = 0;
        try { L = el.getTotalLength(); } catch (e) { L = 0; }
        if (!(L > 1.5)) { el.setAttribute('opacity', 0); return { el, L: 6 * scale, dot: true, D: 0 }; }
        const D = Math.ceil(L) + 1;
        el.setAttribute('stroke-dasharray', `${D} ${D}`);
        el.setAttribute('stroke-dashoffset', D);
        return { el, L: L * scale, dot: false, D };
      });
    const drawTrack = (items, t0, t1, ease = eo3) => {
      if (!items.length) return;
      const W = t1 - t0;
      const tot = items.reduce((s, i) => s + i.L + 8, 0);
      let cum = 0;
      const sched = items.map(it => { const w = it.L + 8; const a = cum / tot * W * .8; cum += w; return { it, a, d: W * .2 + w / tot * W * .8, q: -1 }; });
      add(t0, t1, (p, t) => {
        const tt = t - t0;
        for (const s of sched) {
          const q = ease(clamp((tt - s.a) / s.d));
          if (q === s.q) continue;
          s.q = q;
          if (s.it.dot) s.it.el.setAttribute('opacity', f1(q));
          else s.it.el.setAttribute('stroke-dashoffset', f1(s.it.D * (1 - q)));
        }
      });
    };
    const popTrack = (el, a, b, place) => add(a, b, p => place(el, spring(p), p));

    /* ---------- short version (repeat visit) ---------- */
    if (mode === 'short') {
      const m = $('cs-mascot');
      set(m, 'transform', `translate(${CX} ${CY + 80}) scale(1.15)`);
      drawTrack(prep(m, 1.15), 0, 520);
      return run(800, 560);
    }

    /* ---------- full / static scene ---------- */
    const shopItems = prep($('cs-shop').querySelector('.cs-g'), 1.9);
    const pen = prep($('cs-pen'), 1);
    drawTrack([...pen, ...shopItems], 0, 1500);
    const sign = $('cs-sign'), signClip = $('cs-cs');
    add(980, 1450, p => set(signClip, 'width', f1(160 * eio(p))));
    const shop = $('cs-shop');
    add(1200, 3200, p => {
      const s = lerp(1, 1.55, eio(p));
      set(shop, 'transform', `translate(${CX} 340) scale(${f1(s * 1000) / 1000}) translate(${-CX} -340)`);
      const o = p < .4 ? lerp(1, .08, eio(p / .4)) : lerp(.08, 0, (p - .4) / .6);
      set(shop, 'opacity', f1(o));
    });

    /* mascot: draw, hop in with squash and stretch, bob, then move up into the phone */
    const mg = $('cs-mascot'), mcol = $('cs-mcol');
    drawTrack(prep(mg, .95), 1550, 2150);
    const FOOT0 = CY + 62, SC0 = .95, FOOT1 = 258, SC1 = .46;
    const hop = p => {
      if (p < .42) { const q = p / .42; return [-260 * (1 - q * q), 1 - .06 * (1 - q), 1 + .1 * q]; }
      if (p < .58) { const q = Math.sin(Math.PI * (p - .42) / .16); return [0, 1 + .2 * q, 1 - .28 * q]; }
      if (p < .78) { const q = Math.sin(Math.PI * (p - .58) / .2); return [-36 * q, 1 - .05 * q, 1 + .07 * q]; }
      if (p < .9) { const q = Math.sin(Math.PI * (p - .78) / .12); return [0, 1 + .07 * q, 1 - .1 * q]; }
      return [0, 1, 1];
    };
    add(1550, 3600, (p, t) => {
      const tt = t - 1550;
      let dy = 0, sx = 1, sy = 1;
      if (tt < 1100) [dy, sx, sy] = hop(clamp(tt / 1100));
      else dy = Math.sin((tt - 1100) / 250) * 2.6;
      const m = eio(clamp((t - 2950) / 650));
      const sc = lerp(SC0, SC1, m);
      const foot = lerp(FOOT0, FOOT1, m) + dy * (1 - m);
      set(mg, 'transform', `translate(${CX} ${f1(foot)}) scale(${f1(sc * sx * 1000) / 1000} ${f1(sc * sy * 1000) / 1000})`);
    }, true);
    add(3300, 3800, p => {
      const e = eio(p);
      const c = [Math.round(lerp(255, 36, e)), Math.round(lerp(255, 37, e)), Math.round(lerp(255, 214, e))];
      set(mcol, 'stroke', `rgb(${c})`);
    });

    /* products float in an orbit, then are drawn into the phone */
    const slots = [[CX - 104, CY - 116, -6], [CX + 104, CY - 106, 5], [CX - 104, CY + 112, -4], [CX + 104, CY + 116, 6]];
    slots.forEach(([sx, sy, r0], i) => {
      const g = $('cs-p' + i);
      const a = 1850 + i * 170;
      drawTrack(prep(g, .66), a, a + 760);
      add(a, 3350, (p, t) => {
        const pop = Math.max(.001, spring(clamp((t - a) / 650)));
        const ab = eio(clamp((t - 2700 - i * 40) / 520));
        const fx = Math.cos(t / 520 + i * 1.3) * 3, fy = Math.sin(t / 430 + i * 1.9) * 5;
        const x = lerp(sx + fx, CX, ab), y = lerp(sy + fy, CY - 10, ab);
        const rot = r0 + Math.sin(t / 600 + i) * 3 + (1 - Math.min(1, pop)) * -18 + ab * 40;
        const s = .66 * pop * (1 - .85 * ab);
        set(g, 'transform', `translate(${f1(x)} ${f1(y)}) rotate(${f1(rot)}) scale(${f1(s * 1000) / 1000})`);
        set(g, 'opacity', f1(1 - ab * ab));
      }, true);
    });

    /* sparkles and berries pop with staggered springs */
    const sparkAt = [[58, 300, 1950], [306, 292, 2080], [CX, 214, 2200], [46, 452, 2300], [318, 470, 2420], [CX - 20, 548, 2540], [112, 226, 2650], [262, 540, 2750]];
    sparkAt.forEach(([x, y, a], i) => {
      const el = $('cs-sp' + i);
      add(a, a + 560, p => {
        const s = Math.pow(Math.sin(Math.PI * p), .8) * 1.15;
        set(el, 'transform', `translate(${x} ${y}) rotate(${f1(p * 100)}) scale(${f1(Math.max(.001, s) * 1000) / 1000})`);
      });
    });
    const berryAt = [[CX - 34, CY - 98, 2100, -12], [CX + 44, CY - 86, 2260, 14], [CX + 6, CY + 100, 2420, 6]];
    berryAt.forEach(([x, y, a, r], i) => {
      const el = $('cs-b' + i);
      add(a, 3300, (p, t) => {
        const pop = Math.max(.001, spring(clamp((t - a) / 520)));
        const ab = eio(clamp((t - 2800) / 420));
        const bob = Math.sin(t / 380 + i * 2) * 3;
        const s = .2 * pop * (1 - ab);
        set(el, 'transform', `translate(${f1(lerp(x, CX, ab))} ${f1(lerp(y + bob, CY - 10, ab))}) rotate(${r}) scale(${f1(s * 1000) / 1000})`);
        set(el, 'opacity', f1(1 - ab));
      }, true);
    });

    /* phone draws itself, the screen fills with cream from the bottom */
    drawTrack(prep($('cs-phone'), 1), 2500, 3300);
    const cream = $('cs-cream');
    add(2950, 3700, p => { set(cream, 'opacity', p > 0 ? 1 : 0); set(cream, 'transform', `translate(0 578) scale(1 ${f1(Math.max(.0005, eio(p)) * 1000) / 1000}) translate(0 -578)`); });

    /* mini app UI */
    const ui = $('cs-ui');
    set(ui, 'opacity', 0);
    add(3450, 3500, p => set(ui, 'opacity', p > 0 ? 1 : 0));
    const cardTexts = [...$('cs-card').querySelectorAll('text')];
    drawTrack(prep($('cs-cardbox'), 1), 3500, 4000);
    cardTexts.forEach(el => add(3560, 3900, p => set(el, 'opacity', f1(p))));
    const gift = prep($('cs-gift'), .26);
    drawTrack(gift, 3750, 4250);
    const num = $('cs-num');
    let lastN = -1;
    add(3650, 4450, p => { const n = Math.round(180 * eo3(p)); if (n !== lastN) { lastN = n; num.textContent = String(n); } });
    set($('cs-lbl'), 'opacity', 0);
    add(3850, 4150, p => set($('cs-lbl'), 'opacity', f1(p)));
    for (let i = 0; i < 4; i++) {
      const el = $('cs-st' + i);
      const a = 3900 + i * 180;
      const x = 112 + i * 34;
      add(a, a + 420, p => {
        const s = Math.max(.001, spring(p)) * .34;
        set(el, 'transform', `translate(${x} 460) scale(${f1(s * 1000) / 1000})`);
        set(el, 'opacity', p > 0 ? 1 : 0);
      });
    }
    const ghost = $('cs-ghost');
    set(ghost, 'opacity', 0);
    add(4550, 4850, p => set(ghost, 'opacity', f1(p)));
    const pill = $('cs-pill'), ring = $('cs-ring');
    add(4300, 4800, p => {
      const s = Math.max(.001, spring(p));
      set(pill, 'transform', `translate(${CX} 514) scale(${f1(s * 1000) / 1000}) translate(${-CX} -514)`);
      set(pill, 'opacity', f1(clamp(p * 3)));
    });
    set(ring, 'opacity', 0);
    add(4800, 30000, (p, t) => {
      if (p <= 0) return;
      const q = ((t - 4800) % 1000) / 1000;
      const s = 1 + .16 * eo3(q);
      set(ring, 'transform', `translate(${CX} 514) scale(${f1(s * 1000) / 1000}) translate(${-CX} -514)`);
      set(ring, 'opacity', f1(.55 * (1 - q)));
    }, true);

    /* headline writes itself across the top */
    const clip = (id, a, b, w) => add(a, b, p => set($(id), 'width', f1(w * eio(p))));
    if (who) clip('cs-ch0', 3500, 3900, 360);
    clip('cs-ch1', 3750, 4400, 360);
    clip('cs-ch2', 4350, 5000, 360);
    const underItems = prep($('cs-under'));
    drawTrack(underItems, 4900, 5250);
    const signoff = $('cs-sign-off');
    set(signoff, 'opacity', 0);
    add(4400, 4900, p => set(signoff, 'opacity', f1(p * .92)));
    add(5600, 5950, p => { if (p > 0) set(signoff, 'opacity', f1(.92 * (1 - p))); });
    const head = $('cs-head');
    add(5650, 6000, p => { if (p > 0) set(head, 'opacity', f1(1 - p)); });

    /* zoom: the phone rushes up to fill the screen and dissolves into the cobalt behind */
    const zoom = $('cs-zoom');
    add(5600, 6450, p => {
      set(zoom, 'transform', `translate(${CX} 340) scale(${f1((1 + 1.8 * p * p) * 1000) / 1000}) translate(${-CX} -340)`);
      set(zoom, 'opacity', f1(1 - clamp((p - .3) / .45)));
    });

    return run(T_END, T_HANDOFF);

    /* ---------- player ---------- */
    function run(END, HANDOFF) {
      let raf = 0, t0 = 0, handed = false, gone = false, timer = 0;

      const handoff = fast => {
        if (handed) return;
        handed = true;
        if (fast) loader.classList.add('cs-fast');
        if (mode === 'static') {
          loader.style.pointerEvents = 'none';
          if (loader.animate) loader.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, easing: 'ease', fill: 'forwards' });
        } else loader.classList.add('dl-out');
        if (app) app.inert = false;
        if (themeMeta && themeBefore) themeMeta.setAttribute('content', themeBefore);
        openGate();
        loaderDone();
      };
      const remove = () => {
        if (gone) return;
        gone = true;
        cancelAnimationFrame(raf);
        clearTimeout(timer);
        window.removeEventListener('resize', place);
        document.removeEventListener('keydown', onKey, true);
        loader.remove();
      };
      const skip = () => {
        if (!handed) handoff(true);
        cancelAnimationFrame(raf);
        clearTimeout(timer);
        timer = setTimeout(remove, 300);
      };
      const onKey = e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); skip(); } };
      loader.addEventListener('pointerdown', skip, { once: true });
      loader.querySelector('.cs-skip').addEventListener('click', skip);
      document.addEventListener('keydown', onKey, true);
      window.doceeCinematicSkip = skip;

      const frame = ts => {
        if (gone) return;
        if (!t0) t0 = ts;
        const t = ts - t0;
        step(t);
        if (!handed && t >= HANDOFF) handoff(false);
        if (t >= END) return remove();
        raf = requestAnimationFrame(frame);
      };

      step(0);
      if (mode === 'static') {
        step(T_STATIC);
        ['cs-ch0', 'cs-ch1', 'cs-ch2'].forEach(id => set($(id), 'width', 360));
        underItems.forEach(i => set(i.el, 'stroke-dashoffset', 0));
        set(shop, 'opacity', .22);
        set(shop, 'transform', '');
        set(zoom, 'transform', '');
        if (loader.animate) loader.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out', fill: 'backwards' });
        timer = setTimeout(() => handoff(false), 760);
        setTimeout(remove, 1280);
        return { skip };
      }
      // Wait (briefly) for the handwritten font so the sign and headline never flash a fallback.
      const go = () => { if (!raf && !t0 && !gone) raf = requestAnimationFrame(frame); };
      const fonts = document.fonts && document.fonts.load
        ? Promise.race([
          Promise.all([document.fonts.load("24px 'Docee Hand'", 'docee.'), document.fonts.load("600 24px 'Docee Sans'", 'Hi')]),
          new Promise(r => setTimeout(r, 800)),
        ]) : Promise.resolve();
      fonts.then(go, go);
      setTimeout(() => { if (!handed) skip(); }, 12000); // safety net
      return { skip };
    }
  }

  window.doceeCinematic = { start };
})();
