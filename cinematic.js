'use strict';

/* Docee cinematic opening: "what the app does for your café".
   One SVG scene, one requestAnimationFrame timeline. Only transform, opacity,
   stroke-dashoffset, clip rect widths and a colour are animated (no filters, no layout).
   motion.js calls window.doceeCinematic.start(ctx) from its loader section.

   Beats (design time, ms; real time is design time x K):
     0      shopfront is drawn, "docee." sign, light sweep
     1700   RETAIN    "keep them coming back."   berry stamps fill, the 10th bursts into a free drink
     4300   MORE $    "more visits, bigger orders."  stamp card becomes the phone, offer arrives, bars rise
     6700   SAVE TIME "orders in, no queue."     order ticket, queue shrinks, clock sweeps, ready
     8700   FINALE    "your regulars, rewarded."  mascot, then a dissolve into the intro
   Modes: full (first visit this session, ~9.4s), short (repeat visit, 0.8s),
   static (prefers-reduced-motion: one composed frame with the three benefit lines).
   QA: ?cine=full forces the full version, ?noloader=1 skips (handled by motion.js). */
(() => {
  const SEEN_KEY = 'docee-cinematic-seen';
  const COBALT = '#2425D6', CREAM = '#F3F1EA', BEIGE = '#E8D2AE', PAPER = '#FBFAF6';
  const CX = 180;
  const K = .86;                              // design ms -> real ms
  const T_HANDOFF = 10500, T_END = 11300;      // design ms
  const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, p) => a + (b - a) * p;
  const eo3 = p => 1 - Math.pow(1 - p, 3);
  const eo5 = p => 1 - Math.pow(1 - p, 5);
  const eio = p => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const back = p => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const spring = p => (p >= 1 ? 1 : p <= 0 ? 0 : 1 - Math.exp(-7 * p) * Math.cos(11 * p));
  const safe = (fn, fallback) => { try { return fn(); } catch (e) { return fallback; } };
  const f1 = n => Math.round(n * 100) / 100;
  const f3 = n => Math.round(n * 1000) / 1000;
  const mix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], p)))})`;

  function sparkPath(r) { return `M0 ${-r}L${r * .25} ${-r * .25}L${r} 0L${r * .25} ${r * .25}L0 ${r}L${-r * .25} ${r * .25}L${-r} 0L${-r * .25} ${-r * .25}Z`; }

  /* ---------- scene geometry ---------- */
  const STAMP_T = [2200, 2430, 2640, 2830, 3000, 3150, 3285, 3405, 3515, 3615];  // landing times of the 10 berries
  const SLOT = i => [80 + (i % 5) * 50, i < 5 ? 346 : 392];
  const MASC_FOOT = 566, MASC_S = .8;
  const CARD_Y = 352;
  const BARS = [[110, 110], [148, 148], [128, 128], [60, 128], [52, 150], [138, 138], [104, 104]]; // [start, end] heights
  const BAR_X = i => 104 + i * 24, BASE = 530;
  const PEOPLE_X = [112, 146, 180, 214, 248], PEOPLE_Y = 540;

  const caps = [
      { id: 'cap1', lines: [{ t: 'keep them coming', y: 54 }], hand: { t: 'back.', y: 114, s: 56 } },
      { id: 'cap2', lines: [{ t: 'more visits,', y: 52 }, { t: 'bigger', y: 90, x: 52 }], hand: { t: 'orders.', y: 144, s: 54 } },
      { id: 'cap3', lines: [{ t: 'orders in,', y: 54 }], hand: { t: 'no queue.', y: 114, s: 56 } },
      { id: 'cap4', lines: [{ t: 'your regulars,', y: 54 }], hand: { t: 'rewarded.', y: 116, s: 56 } },
    ];

  function build(mode) {
    const art = n => sketchArt[n] || '';
    const fontHand = "font-family=\"'Docee Hand','Comic Sans MS',cursive\"";
    const fontSans = "font-family=\"'Docee Sans','DM Sans',Arial,sans-serif\"";
    const open = `<svg class="cs-svg" viewBox="0 0 360 640" preserveAspectRatio="xMidYMid meet" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">`;

    const mascotG = (id, sw) => `<g id="${id}"><g id="${id}-c" stroke="#fff" stroke-width="${sw}"><g transform="translate(-80 -140)">${art('mascot')}</g></g></g>`;
    if (mode === 'short') return `${open}${mascotG('cs-mascot', 2.7)}</svg>`;

    if (mode === 'static') {
      const row = (y, icon, l1, l2) => `<g transform="translate(34 ${y})"><g class="cs-g" style="--k:2.1"><g transform="translate(-6 -22) scale(.3)">${icon}</g></g>
        <text x="62" y="6" font-size="19" font-weight="600" fill="#fff" stroke="none" ${fontSans}>${l1}</text>
        <text x="62" y="30" font-size="25" fill="${BEIGE}" stroke="none" ${fontHand}>${l2}</text></g>`;
      const chart = '<path d="M18 16V140H146"/><path d="M34 140v-26h18v26M62 140v-40h18v40M90 140v-62h18v62M118 140v-84h18v84" stroke-width="2.6"/><path d="M30 84c22-4 40-18 58-42 8-11 18-18 32-22M104 18h18v16" stroke-width="2.4"/>';
      return `${open}
        <text x="28" y="62" font-size="32" font-weight="600" letter-spacing="-.6" fill="#fff" stroke="none" ${fontSans}>your regulars,</text>
        <text x="334" y="120" text-anchor="end" font-size="54" fill="${BEIGE}" stroke="none" ${fontHand}>rewarded.</text>
        <path d="M168 129c40-6 110-8 166-1" stroke="${BEIGE}" stroke-width="2.2"/>
        <g transform="translate(${CX} 292) scale(.82)"><g stroke="#fff" stroke-width="2.9"><g transform="translate(-80 -140)">${art('mascot')}</g></g></g>
        <path d="M34 322H326M34 404H326M34 486H326" stroke="#fff" stroke-opacity=".22" stroke-width="1.4"/>
        ${row(344, art('berryStamp').replace(/stroke-width/g, 'data-w'), 'keep them coming', 'back.')}
        ${row(426, chart, 'more visits, bigger', 'orders.')}
        ${row(508, art('receipt'), 'orders in', 'no queue.')}
      </svg>`;
    }

    /* captions: sans lines (optionally indented) and one Docee Hand accent word, each written in by a clip */
    let clips = '';
    const capSvg = caps.map(c => {
      const lines = c.lines.map((l, i) => {
        const x = l.x || 28;
        clips += `<clipPath id="${c.id}-c${i}"><rect id="${c.id}-r${i}" x="${x - 6}" y="${l.y - 40}" width="0" height="54"/></clipPath>`;
        return `<g clip-path="url(#${c.id}-c${i})"><text x="${x}" y="${l.y}" font-size="32" font-weight="600" letter-spacing="-.6" fill="#fff" stroke="none" ${fontSans}>${l.t}</text></g>`;
      }).join('');
      const h = c.hand;
      clips += `<clipPath id="${c.id}-ch"><rect id="${c.id}-rh" x="80" y="${h.y - 60}" width="0" height="82"/></clipPath>`;
      return `<g id="${c.id}" stroke="none">${lines}<g clip-path="url(#${c.id}-ch)"><text id="${c.id}-t" x="334" y="${h.y}" text-anchor="end" font-size="${h.s}" fill="${BEIGE}" ${fontHand}>${h.t}</text></g><path id="${c.id}-u" d="" stroke="${BEIGE}" stroke-width="2.2" fill="none"/></g>`;
    }).join('');

    /* beat 0: shopfront */
    clips += `<clipPath id="cs-c-sign"><rect id="cs-cs" x="0" y="0" width="0" height="40"/></clipPath>
      <clipPath id="cs-c-shop"><rect x="20" y="192" width="320" height="300"/></clipPath>
      <clipPath id="cs-c-scr"><rect x="78" y="178" width="204" height="408" rx="25"/></clipPath>
      <linearGradient id="cs-sweepg" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".32"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
    const shop = `
      <g id="cs-shop"><g id="cs-shopcam">
        <path id="cs-pen" d="M-18 512C10 534 28 490 39.4 471.4" stroke-width="2.4"/>
        <g class="cs-g" style="--k:.5"><g transform="translate(28 194) scale(1.9)">
          <g id="cs-shopart">${art('storefront')}</g>
          <g clip-path="url(#cs-c-sign)"><text id="cs-sign" x="80" y="27.5" text-anchor="middle" font-size="19" fill="#fff" stroke="none" ${fontHand}>docee.</text></g>
        </g></g>
        <g clip-path="url(#cs-c-shop)"><rect id="cs-sweep" x="-60" y="180" width="64" height="330" fill="url(#cs-sweepg)" stroke="none" transform="translate(-100 0) skewX(-18)"/></g>
      </g></g>`;

    /* beat 1: stamp card, mascot, gift */
    const slots = Array.from({ length: 10 }, (_, i) => `<circle id="cs-gh${i}" cx="${SLOT(i)[0]}" cy="${SLOT(i)[1]}" r="17" stroke-width="1.6" stroke-opacity=".4"/>`).join('');
    const stamps = Array.from({ length: 10 }, (_, i) => `<g id="cs-st${i}" class="cs-stamp"><g stroke-width="6.4"><g transform="translate(-80 -88)">${art('berryStamp')}</g></g></g>`).join('');
    const rings = Array.from({ length: 10 }, (_, i) => `<circle id="cs-rg${i}" cx="${SLOT(i)[0]}" cy="${SLOT(i)[1]}" r="17" stroke-width="1.8" opacity="0"/>`).join('');
    const rays = Array.from({ length: 10 }, (_, i) => `<path d="M0 -30L0 -${i % 2 ? 40 : 46}" transform="rotate(${i * 36})" stroke-width="2.2"/>`).join('');
    const stage = `
      <g id="cs-card" style="color:#fff" stroke="currentColor">
        <rect id="cs-cardbox" x="52" y="289" width="256" height="126" rx="20" stroke-width="2.6"/>
        <text id="cs-cardlbl" x="68" y="314" font-size="19" fill="currentColor" stroke="none" ${fontHand}>your berries</text>
        ${slots}${rings}${stamps}
      </g>
      <g id="cs-fx1" stroke="${BEIGE}"><g id="cs-burst">${rays}</g></g>
      <g id="cs-gift" class="cs-g" style="--k:1.25"><g transform="translate(-80 -84)">${art('gift')}</g></g>
      <text id="cs-giftlbl" x="0" y="0" text-anchor="middle" font-size="25" fill="${BEIGE}" stroke="none" ${fontHand}>a free drink!</text>
      ${mascotG('cs-mascot', 3.1)}`;

    /* phone: outline, cream screen, beat 2 UI, beat 3 UI */
    const bars = BARS.map((b, i) => `<rect id="cs-bar${i}" x="0" y="-1" width="16" height="1" vector-effect="non-scaling-stroke" stroke-width="2" fill="${i === 3 || i === 4 ? BEIGE : 'none'}" transform="translate(${BAR_X(i)} ${BASE}) scale(1 .001)"/>`).join('');
    const coins = [3, 4, 5].map(i => `<g id="cs-coin${i}"><circle r="11.5" fill="${BEIGE}" stroke-width="2"/><circle r="7.5" stroke-width="1.2"/><text y="5" text-anchor="middle" font-size="13" fill="${COBALT}" stroke="none" ${fontHand}>$</text></g>`).join('');
    const ui2 = `
      <g id="cs-ui2" stroke="${COBALT}" fill="none">
        <g id="cs-notif">
          <rect id="cs-notifbox" x="88" y="204" width="184" height="66" rx="16" fill="${PAPER}" stroke-width="2.2"/>
          <rect x="99" y="217" width="40" height="40" rx="11" fill="${CREAM}" stroke-width="1.6"/>
          <g class="cs-g" style="--k:2.4"><g transform="translate(106 223) scale(.26)">${art('matcha')}</g></g>
          <text x="149" y="229" font-size="10.5" font-weight="600" fill="${COBALT}" fill-opacity=".62" stroke="none" ${fontSans}>docee. · now</text>
          <text x="149" y="247" font-size="14.5" font-weight="600" fill="${COBALT}" stroke="none" ${fontSans}>2-for-1 matcha</text>
          <text x="149" y="263" font-size="13" fill="${COBALT}" stroke="none" ${fontSans}>after 3pm</text>
        </g>
        <g id="cs-chart">
          <text id="cs-ctitle" x="96" y="322" font-size="20" fill="${COBALT}" stroke="none" ${fontHand}>visits today</text>
          <path id="cs-axis" d="M94 ${BASE}H266"/>
          ${bars}
          <text id="cs-3pm" x="196" y="553" text-anchor="middle" font-size="17" fill="${COBALT}" stroke="none" ${fontHand}>3pm</text>
          ${coins}
        </g>
      </g>`;

    const people = PEOPLE_X.map((x, i) => `<g id="cs-pp${i}"><g transform="translate(${x} ${PEOPLE_Y})"><circle cx="0" cy="-40" r="9" stroke-width="2.2"/><path d="M-13 0V-10a13 13 0 0 1 26 0V0Z" stroke-width="2.2"/></g></g>`).join('');
    const ui3 = `
      <g id="cs-ui3" stroke="${COBALT}" fill="none">
        <g id="cs-ticket">
          <path id="cs-tkbox" d="M92 214H268V386l-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8-11-8Z" fill="${PAPER}" stroke-width="2.4"/>
          <text id="cs-tk1" x="108" y="240" font-size="12" font-weight="600" fill="${COBALT}" fill-opacity=".7" stroke="none" ${fontSans}>your order</text>
          <g id="cs-tkbowl" class="cs-g" style="--k:1.4"><g transform="translate(106 268) scale(.5)">${art('acai')}</g></g>
          <text id="cs-tk2" x="108" y="360" font-size="13.5" font-weight="600" fill="${COBALT}" stroke="none" ${fontSans}>açaí bowl</text>
          <text id="cs-tk3" x="192" y="296" font-size="19" fill="${COBALT}" stroke="none" ${fontHand}>ready at</text>
          <text id="cs-tk4" x="190" y="338" font-size="44" fill="${COBALT}" stroke="none" ${fontHand}>2:15</text>
          <g id="cs-ok"><circle cx="246" cy="357" r="14" fill="${BEIGE}" stroke-width="2"/><path d="M239 357l5 5 9-11" stroke-width="2.6"/></g>
        </g>
        <g id="cs-watch">
          <circle cx="252" cy="212" r="19" fill="${CREAM}" stroke-width="2.2"/>
          <path d="M246 190h12M252 190v3" stroke-width="2.2"/>
          <path d="M252 212V200" id="cs-hand" stroke-width="2.4"/>
          <path d="M252 195.5v2M252 226.5v2M237.5 212h2M264.5 212h2" stroke-width="1.6"/>
        </g>
        <text id="cs-qlbl" x="96" y="464" font-size="20" fill="${COBALT}" stroke="none" ${fontHand}>the queue</text>
        <path id="cs-qline" d="M94 ${PEOPLE_Y + 8}H266" stroke-width="1.8"/>
        ${people}
      </g>`;
    const phone = `
      <g id="cs-zoom">
        <path id="cs-outline" d="M180 172H258a30 30 0 0 1 30 30V562a30 30 0 0 1-30 30H102a30 30 0 0 1-30-30V202a30 30 0 0 1 30-30Z" stroke-width="3"/>
        <path id="cs-island" d="M163 188h34" stroke-width="4"/>
        <g clip-path="url(#cs-c-scr)"><rect id="cs-cream" x="78" y="178" width="204" height="408" fill="${CREAM}" stroke="none"/></g>
        <g clip-path="url(#cs-c-scr)">${ui2}${ui3}</g>
      </g>`;

    const final = `
      <g id="cs-final">
        <g id="cs-fsp">${Array.from({ length: 7 }, (_, i) => `<path id="cs-fs${i}" d="${sparkPath(i % 2 ? 8 : 10)}" stroke-width="1.8" stroke="${i % 3 === 0 ? BEIGE : '#fff'}"/>`).join('')}</g>
        ${mascotG('cs-mascot2', 3)}
        <text id="cs-signoff" x="${CX}" y="572" text-anchor="middle" font-size="24" fill="${BEIGE}" stroke="none" ${fontHand}>your little treat club</text>
      </g>`;

    return `${open}<defs>${clips}</defs>${shop}<g id="cs-s1">${stage}</g>${phone}${final}${capSvg}</svg>`;
  }

  function start(ctx) {
    const { loader, openGate, loaderDone, reduced } = ctx;
    const params = new URLSearchParams(window.location.search);
    const seen = safe(() => sessionStorage.getItem(SEEN_KEY) === '1', false);
    const mode = reduced ? 'static' : (seen && params.get('cine') !== 'full') ? 'short' : 'full';
    safe(() => sessionStorage.setItem(SEEN_KEY, '1'));

    const app = document.getElementById('app');
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const themeBefore = themeMeta && themeMeta.getAttribute('content');
    if (themeMeta) themeMeta.setAttribute('content', COBALT);
    if (app) app.inert = true;

    loader.innerHTML = `<div class="cs">${build(mode)}<button type="button" class="cs-skip">skip</button></div>`;
    loader.setAttribute('role', 'status');
    loader.setAttribute('aria-label', mode === 'full' || mode === 'static'
      ? 'Opening Docee: keep your regulars coming back, more visits and bigger orders, less time at the till'
      : 'Opening Docee');
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
    const xf = (el, x, y, sx = 1, sy = sx, rot = 0) => set(el, 'transform', `translate(${f1(x)} ${f1(y)})${rot ? ` rotate(${f1(rot)})` : ''} scale(${f3(sx)} ${f3(sy)})`);
    const xfAbout = (el, cx, cy, sx, sy = sx, dx = 0, dy = 0) => set(el, 'transform', `translate(${f1(cx + dx)} ${f1(cy + dy)}) scale(${f3(sx)} ${f3(sy)}) translate(${-cx} ${-cy})`);

    /* ---------- timeline engine (design ms) ---------- */
    const tracks = [];
    const add = (a, b, fn, live) => tracks.push({ a, b, fn, live: !!live, last: -1 });
    const step = rt => {
      const t = rt / K;
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
    const drawTrack = (items, t0, t1, ease = eo3, overlap = .8) => {
      if (!items.length) return;
      const W = t1 - t0;
      const tot = items.reduce((s, i) => s + i.L + 8, 0);
      let cum = 0;
      const sched = items.map(it => { const w = it.L + 8; const a = cum / tot * W * overlap; cum += w; return { it, a, d: W * (1 - overlap) + w / tot * W * overlap, q: -1 }; });
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
    const fade = (el, a, b, from, to, ease = eio) => add(a, b, p => set(el, 'opacity', f3(lerp(from, to, ease(p)))));
    const hidden = (...els) => els.forEach(el => set(el, 'opacity', 0));

    /* ---------- short version (repeat visit) ---------- */
    if (mode === 'short') {
      const m = $('cs-mascot');
      xf(m, CX, 440, 1.15);
      drawTrack(prep(m, 1.15), 0, 520);
      return run(800, 560);
    }
    if (mode === 'static') return run(0, 0);

    /* ---------- captions ---------- */
    const capIn = (id, a) => {
      const g = $(id);
      const lines = [...Array(caps.find(c => c.id === id).lines.length).keys()].map(i => $(`${id}-r${i}`));
      const hand = $(id + '-rh'), u = $(id + '-u'), ht = $(id + '-t');
      lines.forEach((r, i) => add(a + i * 220, a + i * 220 + 460, p => set(r, 'width', f1(340 * eo3(p)))));
      const ha = a + lines.length * 220;
      add(ha, ha + 520, p => set(hand, 'width', f1(280 * eio(p))));
      const b = ht.getBBox();
      set(u, 'd', `M${f1(b.x + 6)} ${f1(b.y + b.height - 4)}c${f1(b.width * .32)}-5 ${f1(b.width * .7)}-7 ${f1(b.width - 6)}-1`);
      drawTrack(prep(u), ha + 380, ha + 740, eo3);
      return { out: (t0, t1) => add(t0, t1, p => { set(g, 'opacity', f3(1 - eio(p))); set(g, 'transform', `translate(0 ${f1(-12 * eio(p))})`); }), g };
    };
    const c1 = capIn('cap1', 1850), c2 = capIn('cap2', 4650), c3 = capIn('cap3', 7200), c4 = capIn('cap4', 9500);
    c1.out(4300, 4600); c2.out(6900, 7150); c3.out(9150, 9400);

    /* ---------- beat 0: shopfront ---------- */
    const shopItems = prep($('cs-shop').querySelector('.cs-g'), 1.9);
    drawTrack([...prep($('cs-pen')), ...shopItems], 0, 1250, eo5, .72);
    add(780, 1150, p => set($('cs-cs'), 'width', f1(160 * eio(p))));
    add(1050, 1700, p => xfAbout($('cs-sweep'), 0, 0, 1, 1, 520 * eio(p), 0));
    add(0, 1700, p => xfAbout($('cs-shopcam'), CX, 342, 1 + .08 * p));
    add(1350, 1900, p => {
      const e = eio(p);
      const g = $('cs-shop');
      xfAbout(g, CX, 342, 1 + .5 * e, 1 + .5 * e, 0, -30 * e);
      set(g, 'opacity', f3(1 - eio(clamp((p - .1) / .8))));
    });

    /* ---------- beat 1: keep them coming back ---------- */
    const card = $('cs-card'), mascot = $('cs-mascot'), mcol = $('cs-mascot-c');
    set(card, 'opacity', 0);
    add(1900, 1950, p => set(card, 'opacity', p > 0 ? 1 : 0));
    drawTrack(prep($('cs-cardbox')), 1900, 2350, eo5);
    set($('cs-cardlbl'), 'opacity', 0);
    add(2050, 2350, p => set($('cs-cardlbl'), 'opacity', f3(p)));
    for (let i = 0; i < 10; i++) {
      const gh = $('cs-gh' + i), st = $('cs-st' + i), rg = $('cs-rg' + i);
      const [x, y] = SLOT(i);
      set(gh, 'opacity', 0); set(st, 'opacity', 0);
      add(2000 + i * 22, 2200 + i * 22, p => set(gh, 'opacity', f3(p)));
      const t = STAMP_T[i];
      add(t - 40, t + 340, p => {          // the stamp comes down hard: big, then thump to size
        const q = clamp(p * 380 / 300);
        const s = lerp(1.9, 1, eo5(q));
        set(st, 'opacity', f3(clamp(q * 5)));
        xf(st, x, y + 1, .335 * s);
      });
      add(t, t + 420, p => {
        set(rg, 'opacity', p > 0 && p < 1 ? f3(.7 * (1 - p)) : 0);
        xfAbout(rg, x, y, 1 + .8 * eo3(p));
      });
    }
    /* the card taps down a hair on every thump */
    add(STAMP_T[0] - 50, STAMP_T[9] + 200, (p, t) => {
      let dip = 0;
      for (const st of STAMP_T) { const q = (t - st) / 160; if (q > 0 && q < 1) dip = Math.max(dip, Math.sin(Math.PI * q) * 2.6); }
      xfAbout(card, CX, CARD_Y, 1, 1, 0, dip);
    }, true);

    /* mascot: draws in, then lands a hop on every berry (the rhythm of coming back again and again) */
    drawTrack(prep(mascot, MASC_S), 1950, 2450, eo3);
    const hops = STAMP_T.map((t, i) => { const gap = i ? t - STAMP_T[i - 1] : 330; return { t, d: Math.min(250, gap * .96) }; });
    add(1950, 4650, (p, t) => {
      let dy = 0, sx = 1, sy = 1;
      for (const h of hops) {
        const q = (t - (h.t - h.d)) / h.d;
        if (q > 0 && q < 1) { dy = -30 * 4 * q * (1 - q); sy = 1 + .06 * Math.sin(Math.PI * q); sx = 1 - .04 * Math.sin(Math.PI * q); }
        const r = (t - h.t) / 130;
        if (r > 0 && r < 1) { sx = 1 + .13 * Math.sin(Math.PI * r); sy = 1 - .17 * Math.sin(Math.PI * r); }
      }
      const out = eio(clamp((t - 4400) / 380));   // after the gift: hop up into the phone
      const gh = t > 3640 && t < 4060 ? -14 * Math.sin(Math.PI * clamp((t - 3640) / 420)) : 0;
      const s = MASC_S * lerp(1, .3, out);
      set(mascot, 'opacity', f3(1 - clamp((out - .5) * 2)));
      xf(mascot, CX, lerp(MASC_FOOT, 440, out) + (dy + gh) * (1 - out), s * sx, s * sy);
    }, true);

    /* the 10th berry bursts into a free drink */
    const burst = $('cs-burst'), gift = $('cs-gift'), glbl = $('cs-giftlbl');
    set(burst, 'opacity', 0); set(gift, 'opacity', 0); set(glbl, 'opacity', 0); xf(glbl, CX, 272, 1);
    const G0 = STAMP_T[9] + 20;
    add(G0, G0 + 520, p => {
      set(burst, 'opacity', p > 0 && p < 1 ? f3(1 - p) : 0);
      xf(burst, SLOT(9)[0], SLOT(9)[1], lerp(.3, 1.5, eo3(p)), lerp(.3, 1.5, eo3(p)), p * 40);
    });
    add(G0 + 40, G0 + 600, p => {
      const e = eio(p), s = Math.max(.001, spring(clamp(p * 1.25)));
      const x = lerp(SLOT(9)[0], CX, e), y = lerp(SLOT(9)[1], 214, eo3(p)) - Math.sin(Math.PI * p) * 46;
      set(gift, 'opacity', p > 0 ? f3(clamp(p * 6)) : 0);
      xf(gift, x, y, .8 * s);
    });
    add(G0 + 220, G0 + 520, p => { set(glbl, 'opacity', f3(p)); xf(glbl, CX, 272 + 10 * (1 - eo3(p)), 1); });
    add(4400, 4700, p => { if (p > 0) { set(gift, 'opacity', f3(1 - eio(p))); set(glbl, 'opacity', f3(1 - eio(p))); } });

    /* ---------- match cut: the card becomes the phone ---------- */
    add(4350, 5000, p => {
      const e = eio(p);
      const s = lerp(1, .78, e);
      xfAbout(card, CX, CARD_Y, s, s, 0, lerp(0, 30, e));
      card.style.color = mix([255, 255, 255], [36, 37, 214], clamp((p - .35) / .5));
    });
    const outline = prep($('cs-outline')), isl = prep($('cs-island'));
    drawTrack([...outline, ...isl], 4450, 5050, eo5, .5);
    const cream = $('cs-cream');
    add(4750, 5300, p => { set(cream, 'opacity', p > 0 ? 1 : 0); xfAbout(cream, 0, 586, 1, Math.max(.0008, eio(p))); });
    add(5150, 5450, p => { if (p > 0) { set(card, 'opacity', f3(1 - eio(p))); xfAbout(card, CX, CARD_Y, .78, .78, 0, 30 - 26 * eio(p)); } });

    /* ---------- beat 2: more visits, bigger orders ---------- */
    const ui2 = $('cs-ui2'), notif = $('cs-notif'), chart = $('cs-chart');
    hidden(ui2, notif, chart);
    add(5150, 5190, p => set(ui2, 'opacity', p > 0 ? 1 : 0));
    add(5200, 5800, p => {                       // the offer drops onto the phone with a little overshoot
      set(notif, 'opacity', f3(clamp(p * 5)));
      xfAbout(notif, CX, 237, 1, 1, 0, -64 * (1 - spring(p)));
    });
    add(5650, 5690, p => set(chart, 'opacity', p > 0 ? 1 : 0));
    set($('cs-ctitle'), 'opacity', 0);
    add(5650, 6000, p => set($('cs-ctitle'), 'opacity', f3(p)));
    drawTrack(prep($('cs-axis')), 5650, 6000, eo3);
    BARS.forEach(([a, b], i) => {
      const el = $('cs-bar' + i);
      const t0 = 5750 + i * 70;
      const boost = i === 3 || i === 4;
      add(t0, t0 + 420, p => set(el, 'transform', `translate(${BAR_X(i)} ${BASE}) scale(1 ${f3(Math.max(.001, a * eo5(p)))})`));
      if (boost) {                               // the quiet afternoon bars grow once the offer lands
        const t1 = 6300 + (i - 3) * 170;
        add(t1, t1 + 620, p => set(el, 'transform', `translate(${BAR_X(i)} ${BASE}) scale(1 ${f3(lerp(a, b, back(p)))})`));
      }
    });
    set($('cs-3pm'), 'opacity', 0);
    add(6200, 6460, p => set($('cs-3pm'), 'opacity', f3(p)));
    [3, 4, 5].forEach((i, n) => {
      const el = $('cs-coin' + i);
      const x = BAR_X(i) + 8, y0 = BASE - BARS[i][1] - 24;
      set(el, 'opacity', 0);
      const a = 6650 + n * 150;
      add(a, a + 700, p => {
        set(el, 'opacity', f3(clamp(p * 7)));
        xf(el, x, y0 - eo3(p) * 16, Math.max(.001, spring(clamp(p * 1.2))));
      });
    });

    /* ---------- beat 3: orders in, no queue ---------- */
    const ui3 = $('cs-ui3'), ticket = $('cs-ticket'), watch = $('cs-watch'), ok = $('cs-ok');
    hidden(ui3, ticket, watch, ok);
    add(7000, 7300, p => { if (p > 0) { set(ui2, 'opacity', f3(1 - eio(p))); xfAbout(ui2, CX, 380, 1, 1, 0, -18 * eio(p)); } });
    add(7300, 7340, p => set(ui3, 'opacity', p > 0 ? 1 : 0));
    add(7300, 7900, p => {                       // the order ticket slides in from below
      set(ticket, 'opacity', f3(clamp(p * 4)));
      xfAbout(ticket, CX, 300, 1, 1, 0, 80 * (1 - eo5(p)));
    });
    add(7750, 8150, p => { set(watch, 'opacity', f3(clamp(p * 5))); xfAbout(watch, 252, 212, Math.max(.001, spring(p))); });
    add(8000, 8800, p => set($('cs-hand'), 'transform', `rotate(${f1(eio(p) * 360)} 252 212)`));
    set($('cs-qlbl'), 'opacity', 0);
    add(7650, 7950, p => set($('cs-qlbl'), 'opacity', f3(p)));
    drawTrack(prep($('cs-qline')), 7650, 7950, eo3);
    PEOPLE_X.forEach((x, i) => {
      const el = $('cs-pp' + i);
      set(el, 'opacity', 0);
      const a = 7700 + i * 80;
      add(a, a + 380, p => { const s = Math.max(.001, spring(p)); set(el, 'opacity', f3(clamp(p * 6))); xfAbout(el, x, PEOPLE_Y, s, s); });
      if (i < 4) {                               // the queue shrinks: one by one they are served and leave to the right
        const l = 8500 + i * 170;
        add(l, l + 420, p => {
          if (p <= 0) return;
          set(el, 'opacity', f3(1 - clamp((p - .35) / .65)));
          xfAbout(el, x, PEOPLE_Y, 1, 1, 90 * eio(p), 0);
        });
      }
    });
    add(8950, 9300, p => { set(ok, 'opacity', f3(clamp(p * 5))); xfAbout(ok, 246, 357, Math.max(.001, spring(p))); });

    /* ---------- finale: your regulars, rewarded. ---------- */
    const zoom = $('cs-zoom');
    add(9200, 9850, p => {
      const e = eio(p);
      xfAbout(zoom, CX, 382, 1 + 1.6 * e * e, 1 + 1.6 * e * e);
      set(zoom, 'opacity', f3(1 - clamp((p - .1) / .55)));
    });
    const fin = $('cs-final'), m2 = $('cs-mascot2');
    set(fin, 'opacity', 0);
    add(9350, 9390, p => set(fin, 'opacity', p > 0 ? 1 : 0));
    drawTrack(prep(m2, 1.6), 9650, 10150, eo3);
    add(9650, 12000, (p, t) => {
      const tt = t - 9650;
      let dy = 0, sx = 1, sy = 1;
      if (tt < 660) {
        const q = clamp(tt / 660);
        if (q < .62) { const r = q / .62; dy = -170 * (1 - r * r); sy = 1 + .08 * r; sx = 1 - .05 * r; }
        else { const r = (q - .62) / .38; sx = 1 + .2 * Math.sin(Math.PI * r); sy = 1 - .26 * Math.sin(Math.PI * r); }
      } else dy = Math.sin((tt - 660) / 260) * 3;
      xf(m2, CX, 480 + dy, 1.6 * sx, 1.6 * sy);
    }, true);
    set($('cs-signoff'), 'opacity', 0);
    add(10150, 10500, p => set($('cs-signoff'), 'opacity', f3(.95 * p)));
    [[66, 330, 10100], [296, 300, 10180], [CX, 236, 10260], [50, 470, 10330], [312, 480, 10380], [96, 250, 10430], [268, 540, 10480]].forEach(([x, y, a], i) => {
      const el = $('cs-fs' + i);
      add(a, a + 520, p => {
        const s = Math.max(.001, Math.pow(Math.sin(Math.PI * p), .8) * 1.15);
        xf(el, x, y, s, s, p * 100);
      });
    });
    // handoff dissolve: the finale eases forward while the loader fades and the intro fades in beneath
    add(T_HANDOFF - 100, T_END, p => { if (p > 0) xfAbout(fin, CX, 400, 1 + .2 * eio(p), 1 + .2 * eio(p)); });
    add(T_HANDOFF - 100, T_HANDOFF + 350, p => { if (p > 0) set(c4.g, 'opacity', f3(1 - eio(p))); });

    return run(T_END * K, T_HANDOFF * K);

    /* ---------- player ---------- */
    function run(END, HANDOFF) {
      let raf = 0, t0 = 0, handed = false, gone = false, timer = 0;

      const handoff = fast => {
        if (handed) return;
        handed = true;
        loader.classList.add('cs-handoff');            // hides this skip button at once so it never overlaps the intro's
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
        if (loader.animate) loader.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out', fill: 'backwards' });
        timer = setTimeout(() => handoff(false), 2300);
        setTimeout(remove, 2900);
        return { skip };
      }
      // Wait (briefly) for the handwritten font so captions never flash a fallback face.
      const go = () => { if (!raf && !t0 && !gone) raf = requestAnimationFrame(frame); };
      const fonts = document.fonts && document.fonts.load
        ? Promise.race([
          Promise.all([document.fonts.load("24px 'Docee Hand'", 'docee.'), document.fonts.load("600 24px 'Docee Sans'", 'Hi')]),
          new Promise(r => setTimeout(r, 800)),
        ]) : Promise.resolve();
      fonts.then(go, go);
      setTimeout(() => { if (!handed) skip(); }, 14000); // safety net
      return { skip };
    }
  }

  window.doceeCinematic = { start };
})();
