'use strict';

/* Docee bowl builder: build your own açaí bowl, order ahead (demo), live order ticket
   and a shareable story image. Loaded after app.js (defer). app.js only calls
   window.DoceeBuilder.* from renderScreen, never at parse time. State lives in app.js's
   `state` (build, order, placed); this file owns drawing, DOM updates and the share image. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = () => reducedQuery.matches;
  const STROKES = 'path,circle,ellipse,line,polyline,polygon,rect';
  const EASE = 'cubic-bezier(.22,.7,.3,1)';
  const MAX_TOPPINGS = 5;
  const ORDER_MS = 12000;      // sped-up demo: the whole order takes 12 seconds
  const MAKING_AT = 3000;
  const q = (root, sel) => root && root.querySelector(sel);

  /* ---------- menu data ---------- */
  const ico = inner => `<svg class="bw-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  const BASES = [
    {id:'acai', label:'açaí', pts:10, icon:'<path d="M3 12h18a9 8 0 0 1-18 0Z"/><path d="M7 12c0-4 2.2-6 5-6s5 2 5 6"/><path d="M12 6V3"/>'},
    {id:'pitaya', label:'pitaya', pts:10, icon:'<path d="M12 4c4 0 7 3.4 7 8s-3 8-7 8-7-3.4-7-8 3-8 7-8Z"/><path d="M9 11h.1M14 10h.1M12 14h.1M15 15h.1M9 16h.1"/>'},
    {id:'dubai', label:'dubai choc açaí', pts:12, icon:'<path d="m12 3 2 6 6 3-6 3-2 6-2-6-6-3 6-3Z"/>'},
  ];
  const TOPPINGS = [
    {id:'banana', label:'banana', icon:'<path d="M5 17c2 3 9 3 13-3 2-3 2-7 1-9l-2 1c0 3-2 7-6 9-3 1-5 0-6 2Z"/>'},
    {id:'strawberry', label:'strawberry', icon:'<path d="M12 21C5 17 4 11 6.5 9c2-1.600 4 0 5.500 1.500C13.500 9 15.500 7.400 17.500 9c2.500 2 1.500 8-5.500 12Z"/><path d="M9 6l3 2 3-2M12 8V3"/>'},
    {id:'blueberry', label:'blueberry', icon:'<circle cx="12" cy="13" r="7"/><path d="m9.500 7.500 2.500 2 2.500-2"/><path d="M12 13h.1"/>'},
    {id:'granola', label:'granola', icon:'<path d="m4 14 3-3 4 1 1 4-3 3-4-1Z"/><path d="m14 8 3-2 3 2-1 3-3 1Z"/><path d="M13 17l2-1 2 2"/>'},
    {id:'coconut', label:'coconut', icon:'<path d="M5 15c0-5 4-8 9-8-1 5-4 8-9 8Z"/><path d="M13 19c3-1 5-3 6-6"/>'},
    {id:'pistachio', label:'pistachio', icon:'<ellipse cx="12" cy="12" rx="5" ry="8" transform="rotate(25 12 12)"/><path d="M9 8c2 2 4 2 6 0"/>'},
    {id:'nutella', label:'nutella drizzle', icon:'<rect x="6" y="9" width="12" height="11" rx="2"/><path d="M7 9V6h10v3M9 14h6"/>'},
    {id:'bueno', label:'kinder bueno', icon:'<rect x="3" y="9" width="18" height="6" rx="1.500" transform="rotate(-25 12 12)"/><path d="m9 8 3 8M14 6l3 8"/>'},
    {id:'honey', label:'honey', icon:'<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/>'},
  ];
  const TIMES = [
    {id:'asap', label:'asap', note:'~6 min'},
    {id:'15', label:'in 15 min', note:''},
    {id:'30', label:'in 30 min', note:''},
  ];
  const baseOf = id => BASES.find(b => b.id === id) || BASES[0];
  const topOf = id => TOPPINGS.find(t => t.id === id);
  const timeOf = id => TIMES.find(t => t.id === id) || TIMES[0];
  const timeText = id => { const t = timeOf(id); return t.id === 'asap' ? 'asap, ~6 min' : t.label; };

  /* ---------- bowl line art (viewBox 0 0 160 160, strokes only) ---------- */
  const MOUND = '<path d="M22 90c-8-18 0-32 16-32 2-18 22-28 36-14 8-14 34-10 40 6 18-2 28 12 20 26 6 3 8 8 6 14" stroke-width="3"/><path d="M30 80c8-7 12 3 20-2s13 4 21-2 13 4 21-2 13 4 21-2 12 3 18-1" stroke-width="1.8"/>';
  const BASE_ART = {
    acai: MOUND + '<path d="M78 74l4-2M118 64l3 2M36 54l2-3M124 80l3-1M56 78l3 1" stroke-width="2"/>',
    pitaya: MOUND + '<path d="M40 68h.1M52 56h.1M70 70h.1M94 72h.1M126 70h.1M116 56h.1M60 82h.1M104 84h.1" stroke-width="3"/>',
    dubai: MOUND + '<path d="M44 60l8 7-3 8M110 58l-6 9 5 7M82 52l3 8-5 5" stroke-width="1.8"/><path d="M28 66l4-3M132 74l4-2" stroke-width="2"/>',
  };
  const BODY_ART = '<path d="M18 92c3 30 25 50 62 50s59-20 62-50" stroke-width="3.2"/><path d="M18 92c14 10 110 10 124 0" stroke-width="3.2"/><path d="M62 141l-3 8h42l-3-8" stroke-width="2.4"/><path d="M28 106c4 11 10 19 18 25" stroke-width="1.6"/><path d="M118 110c-4 9-10 17-18 23M128 104c-3 8-7 14-13 19" stroke-width="1.6"/><path d="M150 128l3-6 3 6-6-3h6Z" stroke-width="1.8"/><path d="M12 44l3-6 3 6-6-3h6Z" stroke-width="1.8"/>';
  // Each topping is drawn around (0,0) and placed on a mound slot.
  const TOP_ART = {
    banana: '<circle cx="-9" cy="3" r="9" stroke-width="2.4"/><circle cx="-9" cy="3" r="2.800" stroke-width="1.6"/><circle cx="9" cy="-3" r="9" stroke-width="2.4"/><circle cx="9" cy="-3" r="2.800" stroke-width="1.6"/>',
    strawberry: '<path d="M0 14C-14 7-13-6-6-7c3-1 5 1 6 3 1-2 3-4 6-3 7 1 8 14-6 21Z" stroke-width="2.4"/><path d="m-5-9 5 4 5-4M0-5v-6" stroke-width="2"/><path d="M-5 1h.1M2 0h.1M-1 6h.1M5 4h.1" stroke-width="2.4"/>',
    blueberry: '<circle cx="-8" cy="4" r="6" stroke-width="2.4"/><circle cx="7" cy="5" r="6" stroke-width="2.4"/><circle cx="-1" cy="-7" r="6" stroke-width="2.4"/><path d="M-10 2l2 2 2-2M5 3l2 2 2-2M-3-9l2 2 2-2" stroke-width="1.4"/>',
    granola: '<path d="M-15 5l4-4 5 2-1 5-6 1Z" stroke-width="2.2"/><path d="M-3-3l6-3 4 5-5 4-5-3Z" stroke-width="2.2"/><path d="M8 7l5-3 4 4-4 4-5-2Z" stroke-width="2.2"/><path d="M-9-11l4-2 3 3-3 3Z" stroke-width="2"/><path d="M-2 9h.1M14-6h.1" stroke-width="3"/>',
    coconut: '<path d="M-16 3c4-8 9-8 13 0" stroke-width="2.2"/><path d="M-3-6c4-6 9-6 13 1" stroke-width="2.2"/><path d="M2 7c4-6 10-5 14 0" stroke-width="2.2"/><path d="M-13 12c3-4 7-4 10 0" stroke-width="2"/><path d="M13-10h.1M-15-5h.1" stroke-width="2.8"/>',
    pistachio: '<ellipse cx="-9" cy="3" rx="3.800" ry="5.400" transform="rotate(-30 -9 3)" stroke-width="2.2"/><ellipse cx="5" cy="-4" rx="3.800" ry="5.400" transform="rotate(20 5 -4)" stroke-width="2.2"/><ellipse cx="9" cy="8" rx="3.800" ry="5.400" transform="rotate(-50 9 8)" stroke-width="2.2"/><path d="M-9 0v5M5-7v5" stroke-width="1.4"/><path d="M-1 10h.1M-4-9h.1M15-1h.1" stroke-width="3"/>',
    nutella: '<path d="M-20 0c3-9 7 9 10 0s7 9 10 0 7 9 10 0 7 9 10 0" stroke-width="2.8"/><path d="M-14 9c3-6 6 6 9 0s6 6 9 0 6 6 9 0" stroke-width="2.2"/>',
    bueno: '<g transform="rotate(-18)"><rect x="-16" y="-6" width="32" height="12" rx="2.500" stroke-width="2.4"/><path d="m-10-6 6 12M-2-6l6 12M6-6l6 12" stroke-width="1.5"/></g>',
    honey: '<path d="M-18 0c4-7 8-7 12 0s8 7 12 0 8-7 12 0" stroke-width="2.6"/><path d="M9 3v7" stroke-width="2"/><path d="M9 10c-3 3-2 6 0 6s3-3 0-6Z" stroke-width="2"/>',
  };
  const SLOTS = [[80, 68], [38, 82], [122, 82], [52, 52], [108, 50]];

  const newBuild = () => ({base:'acai', toppings:[], slots:{}, size:'regular'});
  const bw = () => (state.build || (state.build = newBuild()));
  const ord = () => (state.order || (state.order = {time:'asap', name:'', reward:false, store:null}));
  const earnPts = b => baseOf(b.base).pts + (b.size === 'large' ? 4 : 0) + b.toppings.length * 2;
  const describe = b => `${baseOf(b.base).label}${b.toppings.length ? ' with ' + b.toppings.map(id => topOf(id).label).join(', ') : ''}`;
  const orderStore = () => stores.find(s => s.id === (ord().store || state.storeId)) || stores[0];

  function assignSlots(b) {
    const slots = b.slots || (b.slots = {});
    Object.keys(slots).forEach(id => { if (!b.toppings.includes(id)) delete slots[id]; });
    b.toppings.forEach(id => {
      if (slots[id] != null) return;
      const used = new Set(Object.values(slots));
      let i = 0; while (used.has(i)) i++;
      slots[id] = i % SLOTS.length;
    });
  }
  function topHtml(id, b) {
    const [x, y] = SLOTS[(b.slots[id] ?? 0) % SLOTS.length];
    return `<g class="bw-top" data-top="${id}" transform="translate(${x} ${y}) scale(1.08)"><g class="bw-top-in">${TOP_ART[id]}</g></g>`;
  }
  function bowlInner(b) {
    assignSlots(b);
    return `<g filter="url(#sketch-rough)"><g class="bw-body">${BODY_ART}</g><g class="bw-base-layer" data-base="${b.base}">${BASE_ART[b.base]}</g><g class="bw-tops">${b.toppings.map(id => topHtml(id, b)).join('')}</g></g>`;
  }
  const bowlSvg = (b, cls = '') => `<svg class="sketch bw-bowl ${cls}" data-size="${b.size}" viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Your bowl: ${escapeHtml(describe(b))}">${bowlInner(b)}</svg>`;

  /* ---------- drawing animation (same idea as motion.js) ---------- */
  function drawStrokes(root, { dur = 440, step = 50 } = {}) {
    if (reduced() || typeof Element.prototype.animate !== 'function') return;
    [...root.querySelectorAll(STROKES)].forEach((el, i) => {
      let len = 0;
      try { len = el.getTotalLength(); } catch (e) { len = 0; }
      const frames = len > 1.5
        ? [{ strokeDasharray: `${Math.ceil(len) + 1} ${Math.ceil(len) + 1}`, strokeDashoffset: Math.ceil(len) + 1 }, { strokeDasharray: `${Math.ceil(len) + 1} ${Math.ceil(len) + 1}`, strokeDashoffset: 0 }]
        : [{ opacity: 0 }, { opacity: 1 }];
      el.animate(frames, { duration: len > 1.5 ? dur : dur * .6, delay: i * step, easing: EASE, fill: 'backwards' });
    });
  }
  function popIn(g) {
    if (reduced() || typeof Element.prototype.animate !== 'function') return;
    g.animate([{ transform: 'translateY(-20px) scale(.6)', opacity: 0 }, { transform: 'translateY(0) scale(1)', opacity: 1 }], { duration: 420, easing: 'cubic-bezier(.3,1.5,.5,1)' });
  }
  function dropOut(g) {
    g.classList.add('is-leaving');
    if (reduced() || typeof Element.prototype.animate !== 'function') { g.remove(); return; }
    const a = g.firstElementChild.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'translateY(-12px) scale(.6)', opacity: 0 }], { duration: 200, easing: 'ease-in', fill: 'forwards' });
    a.onfinish = () => g.remove();
    setTimeout(() => g.remove(), 400);
  }

  /* Bring a live bowl svg in line with a build: add or remove layers without re-rendering. */
  function syncBowl(svg, b, animate = true) {
    assignSlots(b);
    const baseG = q(svg, '.bw-base-layer');
    if (baseG && baseG.dataset.base !== b.base) {
      baseG.dataset.base = b.base;
      baseG.innerHTML = BASE_ART[b.base];
      if (animate) drawStrokes(baseG, { dur: 420, step: 20 });
    }
    const tops = q(svg, '.bw-tops');
    if (tops) {
      [...tops.children].forEach(g => { if (!g.classList.contains('is-leaving') && !b.toppings.includes(g.dataset.top)) dropOut(g); });
      b.toppings.forEach(id => {
        if (tops.querySelector(`[data-top="${id}"]:not(.is-leaving)`)) return;
        tops.insertAdjacentHTML('beforeend', topHtml(id, b));
        const g = tops.lastElementChild;
        if (animate) { drawStrokes(g); popIn(g.firstElementChild); }
      });
    }
    svg.dataset.size = b.size;
    svg.setAttribute('aria-label', `Your bowl: ${describe(b)}`);
  }

  /* ---------- screens ---------- */
  function chipBase(b, base) {
    const on = b.base === base.id;
    return `<button class="bw-chip bw-chip-base ${on ? 'is-on' : ''}" role="radio" aria-checked="${on}" data-action="bw-base" data-base="${base.id}">${ico(base.icon)}<span>${base.label}</span></button>`;
  }
  function chipTop(b, t) {
    const on = b.toppings.includes(t.id);
    const locked = !on && b.toppings.length >= MAX_TOPPINGS;
    return `<button class="bw-chip ${on ? 'is-on' : ''}" aria-pressed="${on}" ${locked ? 'aria-disabled="true"' : ''} data-action="bw-top" data-top="${t.id}">${ico(t.icon)}<span>${t.label}</span></button>`;
  }
  function chipSize(b, id, text, note) {
    const on = b.size === id;
    return `<button class="bw-chip bw-chip-size ${on ? 'is-on' : ''}" role="radio" aria-checked="${on}" data-action="bw-size" data-size="${id}"><span>${text}</span><small>${note}</small></button>`;
  }

  function buildScreen(gallery = false) {
    const b = bw();
    assignSlots(b);
    const full = b.toppings.length >= MAX_TOPPINGS;
    return `${skHeader('Build your bowl', 'discover')}
<div class="bw-hero-wrap"><div class="bw-hero" data-bw-hero><span class="bw-kicker hand">your bowl</span>${bowlSvg(b, 'bw-hero-art')}<span class="bw-note hand ${full ? 'is-on' : ''}" data-bw-note aria-live="polite">${full ? 'that’s a big bowl!' : ''}</span><span class="bw-pts hand" data-bw-pts aria-live="polite">earns ~${earnPts(b)} pts</span></div></div>
<h2 class="sk-section hand">pick a base</h2>
<div class="bw-bases" role="radiogroup" aria-label="Base">${BASES.map(base => chipBase(b, base)).join('')}</div>
<h2 class="sk-section hand bw-label-row">add toppings <small data-bw-count>${b.toppings.length} of ${MAX_TOPPINGS}</small></h2>
<div class="bw-chips" role="group" aria-label="Toppings, up to ${MAX_TOPPINGS}">${TOPPINGS.map(t => chipTop(b, t)).join('')}</div>
<h2 class="sk-section hand">choose a size</h2>
<div class="bw-sizes" role="radiogroup" aria-label="Size">${chipSize(b, 'regular', 'regular', 'just right')}${chipSize(b, 'large', 'large', 'a bit more of everything')}</div>
<p class="sk-fine bw-fine">Price confirmed in store. Points are an estimate for this demo.</p>
<button class="button primary sk-cta bw-cta" data-action="screen" data-screen="order">order ahead ${icon('arrow')}</button>`;
  }

  function orderScreen(gallery = false) {
    const b = bw(), o = ord(), st = orderStore();
    const name = o.name !== '' ? o.name : state.name;
    const rewardName = state.voucher ? getSavedRewardName() : '';
    return `${skHeader('Order ahead', 'build')}
<div class="sk-headline compact"><h1><span>Skip the queue,</span><span class="indent">pick up</span><em class="hand">fresh.</em></h1></div>
<div class="sk-note bw-demo">${icon('shield')}<p><strong>Demo only.</strong> No payment is taken and no order is sent to the café.</p></div>
<h2 class="sk-section hand">your bowl</h2>
<div class="bw-summary">${bowlSvg(b, 'bw-mini')}<div class="bw-summary-copy"><strong>${escapeHtml(baseOf(b.base).label)} bowl · ${b.size}</strong><span>${b.toppings.length ? escapeHtml(b.toppings.map(id => topOf(id).label).join(', ')) : 'no extra toppings'}</span><em class="hand">earns ~${earnPts(b)} pts</em></div><button class="bw-edit" data-action="screen" data-screen="build">edit</button></div>
<h2 class="sk-section hand">pick up from</h2>
<div class="bw-stores" role="radiogroup" aria-label="Pickup store">${stores.map(s => `<button class="bw-store ${s.id === st.id ? 'is-on' : ''}" role="radio" aria-checked="${s.id === st.id}" data-action="bw-store" data-store="${s.id}"><strong>${escapeHtml(s.name)}</strong><small>${escapeHtml(s.suburb)}</small></button>`).join('')}</div>
<h2 class="sk-section hand">pickup time</h2>
<div class="bw-times" role="radiogroup" aria-label="Pickup time">${TIMES.map(t => `<button class="bw-chip bw-chip-time ${o.time === t.id ? 'is-on' : ''}" role="radio" aria-checked="${o.time === t.id}" data-action="bw-time" data-time="${t.id}"><span>${t.label}</span>${t.note ? `<small>${t.note}</small>` : ''}</button>`).join('')}</div>
<h2 class="sk-section hand">name for the order</h2>
<div class="sk-form"><label class="sk-field"><span class="bw-sr">Name for the order</span><input data-bw-name name="pickup-name" autocomplete="given-name" maxlength="30" placeholder="Your name" value="${escapeHtml(name)}" aria-label="Name for the order"/></label></div>
${state.voucher ? `<button class="bw-reward ${o.reward ? 'is-on' : ''}" role="switch" aria-checked="${Boolean(o.reward)}" data-action="bw-reward"><span class="bw-switch" aria-hidden="true"></span><span><strong>use a reward</strong><small>${escapeHtml(rewardName)}, applied at pickup</small></span></button>` : ''}
${inlineError()}
<p class="sk-fine bw-fine">Demo checkout: nothing is charged. Price confirmed in store.</p>
<button class="button primary sk-cta bw-cta" data-action="bw-place">place order (demo)</button>`;
  }

  function progressSvg(initial, stage) {
    const node = (i, cx, art) => `<g class="bw-node ${i <= stage ? 'is-on' : ''} ${i === stage ? 'is-now' : ''}" data-node><circle cx="${cx}" cy="40" r="25"/><g transform="translate(${cx - 12} 28)">${art}</g></g>`;
    const nodes = [
      node(0, 50, '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2Z"/><path d="M9 8h6M9 12h6"/>'),
      node(1, 150, '<path d="M3 12h18a9 8 0 0 1-18 0Z"/><path d="M8 12c0-3 2-5 4-5s4 2 4 5"/><path d="m16 5 3-3"/>'),
      node(2, 250, '<path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
    ];
    return `<svg class="bw-prog" viewBox="0 0 300 80" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="bw-track" d="M50 40C80 16 120 64 150 40S220 16 250 40" pathLength="100"/><path class="bw-line" data-bw-line d="M50 40C80 16 120 64 150 40S220 16 250 40" pathLength="100" style="stroke-dasharray:100;stroke-dashoffset:${initial}"/>${nodes.join('')}</svg>`;
  }

  function stageFor(elapsed) { return elapsed >= ORDER_MS ? 2 : elapsed >= MAKING_AT ? 1 : 0; }
  const STAGE_TEXT = ['order received, the team has it', 'making your bowl right now', 'fresh, finished and waiting'];

  function demoPlaced() {
    return { num:'DC-4821', store:state.storeId, time:'asap', name:state.name, build:JSON.parse(JSON.stringify(bw())), pts:earnPts(bw()), t0:Date.now(), done:false, celebrated:false, reward:'' };
  }
  function ticketScreen(gallery = false) {
    let p = state.placed;
    if (!p && !gallery) {
      return `${skHeader('Your order', 'home')}<div class="bw-empty"><p class="hand bw-empty-title">no order yet</p>${bowlSvg(newBuild(), 'bw-empty-art')}<p class="sk-sub">Build a bowl and place a demo order to follow it here.</p><button class="button primary sk-cta" data-action="screen" data-screen="build">build your bowl</button></div>`;
    }
    p = p || demoPlaced();
    const st = stores.find(s => s.id === p.store) || stores[0];
    const elapsed = gallery ? 6000 : Math.min(ORDER_MS + 1, Date.now() - p.t0);
    const stage = p.done ? 2 : stageFor(elapsed);
    const offset = [100, 50, 0][stage];
    const labels = ['received', 'making', 'ready'];
    return `${skHeader('Your order', 'home')}
<section class="bw-ticket" data-bw-ticket aria-label="Order status" data-stage="${stage}">
<p class="bw-no"><span class="hand">order</span> <b>${escapeHtml(p.num)}</b></p>
<h1 class="bw-title hand" data-bw-title aria-live="polite">${stage === 2 ? `Ready, ${escapeHtml(p.name || 'you')}!` : 'Your bowl is being made!'}</h1>
<p class="bw-where" data-bw-where>${stage === 2 ? `ready for pickup at ${escapeHtml(st.name)}` : `${escapeHtml(st.name)} · pickup ${escapeHtml(timeText(p.time))}`}</p>
<div class="bw-ticket-bowl">${bowlSvg(p.build, 'bw-ticket-art')}<div class="bw-steam" aria-hidden="true"></div></div>
${progressSvg(offset, stage)}
<ol class="bw-steps" aria-label="Order progress">${labels.map((l, i) => `<li class="${i < stage ? 'is-done' : ''} ${i === stage ? 'is-now' : ''}" ${i === stage ? 'aria-current="step"' : ''}>${l}</li>`).join('')}</ol>
<p class="bw-stage hand" data-bw-stage>${STAGE_TEXT[stage]}</p>
<p class="bw-earned hand" data-bw-earned ${stage === 2 && p.done ? '' : 'hidden'}>${stage === 2 && p.done ? earnedText(p) : ''}</p>
</section>
<div class="sk-ghost-actions stack bw-actions"><button data-action="bw-share">${icon('external')} share my bowl</button><button class="text-button bw-home" data-action="screen" data-screen="home">back to home</button></div>`;
  }
  const earnedText = p => {
    const more = [p.stampAdded ? 'berry stamp added' : '', p.reward ? 'reward applied' : ''].filter(Boolean).join(' · ');
    return `<span>+${p.pts} pts added · ${state.points} points now</span>${more ? `<span>${more}</span>` : ''}`;
  };

  /* ---------- entry points ---------- */
  const promo = () => `<button class="bw-promo" data-action="screen" data-screen="build"><span class="bw-promo-copy"><span>Your bowl, your way</span><em class="hand">build your own</em></span>${sketch('acai', 'bw-promo-art')}<span class="bw-promo-cta">${icon('arrow')}</span></button>`;
  const productLink = () => `<button class="bw-secondary" data-action="screen" data-screen="build">build your own ${icon('arrow')}</button>`;

  /* ---------- live behaviour ---------- */
  function syncBuildUI(root) {
    const b = bw();
    root.querySelectorAll('[data-action="bw-base"]').forEach(el => { const on = el.dataset.base === b.base; el.classList.toggle('is-on', on); el.setAttribute('aria-checked', on); });
    root.querySelectorAll('[data-action="bw-size"]').forEach(el => { const on = el.dataset.size === b.size; el.classList.toggle('is-on', on); el.setAttribute('aria-checked', on); });
    const full = b.toppings.length >= MAX_TOPPINGS;
    root.querySelectorAll('[data-action="bw-top"]').forEach(el => {
      const on = b.toppings.includes(el.dataset.top);
      el.classList.toggle('is-on', on); el.setAttribute('aria-pressed', on);
      if (!on && full) el.setAttribute('aria-disabled', 'true'); else el.removeAttribute('aria-disabled');
    });
    const count = q(root, '[data-bw-count]'); if (count) count.textContent = `${b.toppings.length} of ${MAX_TOPPINGS}`;
    const pts = q(root, '[data-bw-pts]'); if (pts) pts.textContent = `earns ~${earnPts(b)} pts`;
    const note = q(root, '[data-bw-note]');
    if (note) { note.textContent = full ? 'that’s a big bowl!' : ''; note.classList.toggle('is-on', full); }
    const svg = q(root, '.bw-hero-art'); if (svg) syncBowl(svg, b, true);
  }
  function shake(el) {
    if (!el || reduced() || !el.animate) return;
    el.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 320 });
  }

  function onAction(target, root) {
    const b = bw(), o = ord();
    switch (target.dataset.action) {
      case 'bw-base': b.base = target.dataset.base; syncBuildUI(root); break;
      case 'bw-size': b.size = target.dataset.size; syncBuildUI(root); break;
      case 'bw-top': {
        const id = target.dataset.top, at = b.toppings.indexOf(id);
        if (at >= 0) b.toppings.splice(at, 1);
        else if (b.toppings.length >= MAX_TOPPINGS) {
          const note = q(root, '[data-bw-note]');
          if (note) { note.textContent = 'that’s a big bowl!'; note.classList.add('is-on'); shake(note); }
          shake(target);
          return;
        } else b.toppings.push(id);
        syncBuildUI(root);
        break;
      }
      case 'bw-store':
        o.store = target.dataset.store;
        root.querySelectorAll('[data-action="bw-store"]').forEach(el => { const on = el.dataset.store === o.store; el.classList.toggle('is-on', on); el.setAttribute('aria-checked', on); });
        break;
      case 'bw-time':
        o.time = target.dataset.time;
        root.querySelectorAll('[data-action="bw-time"]').forEach(el => { const on = el.dataset.time === o.time; el.classList.toggle('is-on', on); el.setAttribute('aria-checked', on); });
        break;
      case 'bw-reward':
        o.reward = !o.reward; target.classList.toggle('is-on', o.reward); target.setAttribute('aria-checked', o.reward);
        break;
      case 'bw-place': placeOrder(root); break;
      case 'bw-share': shareBowl(target); break;
      case 'bw-share-close': closeShare(); break;
    }
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('[data-action^="bw-"]');
    if (!target || target.closest('.gallery-open') || target.closest('[inert]')) return;
    onAction(target, target.closest('.mobile-app'));
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-action="reset"]')) resetBuilder();
  });
  document.addEventListener('input', event => {
    if (event.target.matches('[data-bw-name]')) ord().name = event.target.value;
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && document.querySelector('.bw-share')) closeShare(); });

  /* ---------- placing the order and the live ticket ---------- */
  let finishTimer = 0;
  function placeOrder(root) {
    const o = ord(), b = bw();
    const name = (o.name !== '' ? o.name : state.name).trim();
    if (!name) { state.error = 'Add a name so the team knows whose bowl it is.'; render(true); document.querySelector('[data-bw-name]')?.focus(); return; }
    state.error = '';
    const useReward = Boolean(o.reward && state.voucher);
    const copy = JSON.parse(JSON.stringify(b));
    state.placed = { num: 'DC-' + (1000 + Math.floor(Math.random() * 9000)), store: o.store || state.storeId, time: o.time, name, build: copy, pts: earnPts(b), t0: Date.now(), done: false, celebrated: false, reward: useReward ? getSavedRewardName() : '', stampAdded: false };
    if (useReward) { state.voucher = null; state.rewardRevealed = false; o.reward = false; }
    shareCache.key = ''; shareCache.promise = null;
    scheduleFinish(state.placed);
    go('ticket');
  }
  function scheduleFinish(p) {
    clearTimeout(finishTimer);
    finishTimer = setTimeout(() => { if (state.placed === p) finishOrder(p); }, Math.max(0, ORDER_MS - (Date.now() - p.t0)));
  }
  function finishOrder(p) {
    if (p.done) return;
    p.done = true;
    state.points += p.pts;
    if (typeof state.stamps === 'number') { state.stamps = (state.stamps >= 10 ? 0 : state.stamps) + 1; p.stampAdded = true; }
    const st = stores.find(s => s.id === p.store) || stores[0];
    state.history.unshift({ id: 'order-' + p.num, type: 'earned', title: `Order ahead at ${st.name}`, date: '25 Nov 2026', points: p.pts, caption: `Bowl order ${p.num} · ready for pickup` });
    paintTicket();
  }

  let tickTimer = 0, lineAnim = null;
  const ticketRoot = () => document.querySelector('.phone-frame > .mobile-app:not(.gallery-mobile) [data-bw-ticket]');
  function stopTicket() { clearInterval(tickTimer); tickTimer = 0; if (lineAnim) { try { lineAnim.cancel(); } catch (e) { /* ignore */ } lineAnim = null; } }
  function paintTicket() {
    const root = ticketRoot(); const p = state.placed;
    if (!root || !p) return;
    const elapsed = Date.now() - p.t0;
    if (elapsed >= ORDER_MS && !p.done) finishOrder(p);
    const stage = p.done ? 2 : stageFor(elapsed);
    const prev = Number(root.dataset.stage);
    root.dataset.stage = stage;
    const st = stores.find(s => s.id === p.store) || stores[0];
    root.querySelectorAll('.bw-steps li').forEach((li, i) => {
      li.classList.toggle('is-done', i < stage); li.classList.toggle('is-now', i === stage);
      if (i === stage) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    root.querySelectorAll('[data-node]').forEach((n, i) => { n.classList.toggle('is-on', i <= stage); n.classList.toggle('is-now', i === stage); });
    const title = q(root, '[data-bw-title]'), where = q(root, '[data-bw-where]'), stg = q(root, '[data-bw-stage]'), earned = q(root, '[data-bw-earned]');
    if (title) title.textContent = stage === 2 ? `Ready, ${p.name || 'you'}!` : 'Your bowl is being made!';
    if (where) where.textContent = stage === 2 ? `ready for pickup at ${st.name}` : `${st.name} · pickup ${timeText(p.time)}`;
    if (stg) stg.textContent = STAGE_TEXT[stage];
    if (earned) { if (p.done) { earned.hidden = false; earned.innerHTML = earnedText(p); } else earned.hidden = true; }
    if (stage === 2 && prev !== 2 && !p.celebrated) { p.celebrated = true; celebrate(root); }
    if (stage === 2) { clearInterval(tickTimer); tickTimer = 0; }
  }
  function startTicket() {
    stopTicket();
    const root = ticketRoot(); const p = state.placed;
    if (!root || !p) return;
    const elapsed = Date.now() - p.t0;
    const line = q(root, '[data-bw-line]');
    if (line && !p.done && elapsed < ORDER_MS && !reduced() && line.animate) {
      lineAnim = line.animate([{ strokeDashoffset: 100 }, { offset: MAKING_AT / ORDER_MS, strokeDashoffset: 50 }, { strokeDashoffset: 0 }], { duration: ORDER_MS, easing: 'linear', fill: 'forwards' });
      lineAnim.currentTime = Math.max(0, elapsed);
    } else if (line) {
      line.style.strokeDashoffset = [100, 50, 0][p.done ? 2 : stageFor(elapsed)];
    }
    if (p.done) p.celebrated = true;
    paintTicket();
    if (!p.done) tickTimer = setInterval(paintTicket, 200);
    prefetchShare();
  }

  /* Berry, spark and heart confetti, in the same spirit as the demo scan. */
  function celebrate(root) {
    const app = root.closest('.mobile-app');
    if (!app || reduced() || !app.animate) return;
    const layer = document.createElement('div'); layer.className = 'dl-burst'; app.append(layer);
    const art = q(root, '.bw-ticket-art');
    const a = app.getBoundingClientRect(), r = (art || root).getBoundingClientRect();
    const scale = a.width / app.offsetWidth || 1;
    const ox = (r.left + r.width / 2 - a.left) / scale, oy = (r.top + r.height / 2 - a.top) / scale;
    const shapes = [
      '<path d="M12 7.500c-4 0-6.500 2.600-6.500 6.200 0 3.700 2.900 6.300 6.500 6.300s6.500-2.600 6.500-6.300c0-3.600-2.500-6.200-6.500-6.200Z"/><path d="M12 7.500c-.5-2 .8-3.700 3-4.200"/>',
      '<path d="M12 2c.8 5.500 4.500 9.200 10 10-5.500.8-9.200 4.500-10 10-.8-5.500-4.500-9.200-10-10 5.500-.8 9.200-4.500 10-10Z"/>',
      '<path d="M12 20.500s-8-5-8-11.200A4.500 4.500 0 0 1 12 6.600a4.500 4.500 0 0 1 8 2.700c0 6.200-8 11.200-8 11.200Z"/>',
    ];
    const duration = 1400, gravity = 760;
    for (let i = 0; i < 28; i++) {
      const size = 18 + Math.random() * 16;
      const node = document.createElementNS(NS, 'svg');
      node.setAttribute('viewBox', '0 0 24 24'); node.setAttribute('width', size); node.setAttribute('height', size);
      node.setAttribute('fill', 'none'); node.setAttribute('stroke', i % 5 === 0 ? '#E8D2AE' : '#fff'); node.setAttribute('stroke-width', '1.8');
      node.setAttribute('stroke-linecap', 'round'); node.setAttribute('stroke-linejoin', 'round'); node.setAttribute('aria-hidden', 'true');
      node.innerHTML = shapes[i % 3];
      node.style.left = `${ox - size / 2}px`; node.style.top = `${oy - size / 2}px`;
      layer.append(node);
      const angle = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.3, speed = 150 + Math.random() * 240;
      const vx = Math.cos(angle) * speed, vy = Math.sin(angle) * speed, spin = (Math.random() - .5) * 540;
      const frames = [0, .12, .3, .55, .8, 1].map(t => { const s = t * duration / 1000; return { offset: t, opacity: t === 0 ? 0 : t > .72 ? Math.max(0, 1 - (t - .72) / .28) : 1, transform: `translate(${vx * s}px, ${vy * s + .5 * gravity * s * s}px) rotate(${spin * t}deg) scale(${t === 0 ? .3 : 1})` }; });
      node.animate(frames, { duration, delay: Math.random() * 90, easing: 'linear', fill: 'both' });
    }
    try { navigator.vibrate && navigator.vibrate([20, 40, 20]); } catch (e) { /* unsupported */ }
    setTimeout(() => layer.remove(), duration + 300);
  }

  document.addEventListener('docee:render', event => {
    const d = event.detail || {};
    if (d.screen === 'ticket' && d.view === 'preview') startTicket(); else stopTicket();
  });

  function resetBuilder() {
    clearTimeout(finishTimer); stopTicket(); closeShare();
    shareCache.key = ''; shareCache.promise = null;
  }

  /* ---------- share my bowl: 1080x1920 story image ---------- */
  const shareCache = { key: '', promise: null };
  const loadImage = src => new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('image failed')); img.src = src; });
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  async function makeStoryBlob(p) {
    const b = p.build; assignSlots(b);
    const svgText = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="840" height="840" fill="none" stroke="#2425D6" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><defs><filter id="sketch-rough"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter></defs>${bowlInner(b)}</svg>`;
    const [bowlImg, mascot] = await Promise.all([
      loadImage('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText)),
      loadImage(assets + 'docee-mascot-white.png'),
    ]);
    try { await Promise.all([document.fonts.load("120px 'Docee Hand'"), document.fonts.load("500 48px 'Docee Sans'")]); } catch (e) { /* fall back to system fonts */ }
    const W = 1080, H = 1920;
    const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2425D6'; ctx.fillRect(0, 0, W, H);
    // cream card
    ctx.fillStyle = '#F3F1EA'; roundRect(ctx, 60, 150, 960, 1370, 64); ctx.fill();
    ctx.strokeStyle = '#FFFFFF66'; ctx.lineWidth = 3; roundRect(ctx, 44, 134, 992, 1402, 78); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#2425D6';
    ctx.font = "132px 'Docee Hand', 'Comic Sans MS', cursive";
    ctx.fillText('my docee bowl', W / 2, 340);
    ctx.drawImage(bowlImg, (W - 840) / 2, 380, 840, 840);
    // base + toppings
    ctx.font = "500 52px 'Docee Sans', Arial, sans-serif";
    ctx.fillText(`${baseOf(b.base).label} · ${b.size}`, W / 2, 1262);
    ctx.font = "400 44px 'Docee Sans', Arial, sans-serif"; ctx.fillStyle = '#5D5D7A';
    const items = b.toppings.length ? b.toppings.map(id => topOf(id).label) : ['just açaí, plain and simple'];
    const rows = []; let row = [];
    items.forEach(it => { const t = [...row, it].join(' · '); if (row.length && ctx.measureText(t).width > 820) { rows.push(row); row = [it]; } else row.push(it); });
    if (row.length) rows.push(row);
    rows.slice(0, 3).forEach((r, i) => ctx.fillText(r.join(' · ') + (i < rows.length - 1 ? ' ·' : ''), W / 2, 1332 + i * 58));
    ctx.font = "56px 'Docee Hand', 'Comic Sans MS', cursive"; ctx.fillStyle = '#2425D6';
    ctx.fillText('made fresh at docee, adelaide', W / 2, 1478);
    // footer
    const mw = 250, mh = mw * (mascot.naturalHeight / mascot.naturalWidth || 1);
    ctx.drawImage(mascot, (W - mw) / 2, 1560, mw, mh);
    ctx.fillStyle = '#FFFFFF'; ctx.font = "500 60px 'Docee Sans', Arial, sans-serif";
    ctx.fillText('docee.co', W / 2, 1560 + mh + 70 > 1860 ? 1860 : 1560 + mh + 70);
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('no blob')), 'image/png'));
  }
  const shareKey = p => p ? p.num + JSON.stringify(p.build) : '';
  function prefetchShare() {
    const p = state.placed; if (!p) return null;
    const key = shareKey(p);
    if (shareCache.key === key && shareCache.promise) return shareCache.promise;
    shareCache.key = key;
    shareCache.promise = makeStoryBlob(p).catch(err => { shareCache.key = ''; shareCache.promise = null; throw err; });
    shareCache.promise.catch(() => {});
    return shareCache.promise;
  }
  let sharing = false;
  async function shareBowl(button) {
    if (sharing) return;
    const p = state.placed || (state.screen === 'ticket' ? demoPlaced() : null);
    if (!p) return;
    sharing = true;
    const label = button.innerHTML;
    button.disabled = true; button.textContent = 'drawing your bowl…';
    try {
      const blob = await (state.placed ? prefetchShare() : makeStoryBlob(p));
      const file = new File([blob], 'my-docee-bowl.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: 'my docee bowl', text: `my docee bowl: ${describe(p.build)}. docee.co` }); return; }
        catch (err) { if (err && err.name === 'AbortError') return; /* otherwise show the preview */ }
      }
      openShare(blob, button);
    } catch (err) {
      showToast('Could not draw the share image. Try again.');
    } finally {
      sharing = false;
      if (button.isConnected) { button.disabled = false; button.innerHTML = label; }
    }
  }
  let shareUrl = '';
  function openShare(blob, opener) {
    closeShare();
    const app = document.querySelector('.phone-frame > .mobile-app'); if (!app) return;
    shareUrl = URL.createObjectURL(blob);
    app.insertAdjacentHTML('beforeend', `<div class="bw-share" role="presentation"><section class="bw-share-card" role="dialog" aria-modal="true" aria-labelledby="bw-share-title"><button class="sk-icon bw-share-close" data-action="bw-share-close" aria-label="Close">${icon('close')}</button><h2 id="bw-share-title" class="hand">your bowl, ready to share</h2><img src="${shareUrl}" alt="Your Docee bowl story image: ${escapeHtml(describe((state.placed || demoPlaced()).build))}" width="1080" height="1920"/><p class="sk-fine">Save it, then post it to your story.</p><a class="button secondary bw-download" href="${shareUrl}" download="my-docee-bowl.png">save image</a></section></div>`);
    app.querySelector('.bw-share-close')?.focus();
    app.querySelector('.bw-share')._opener = opener;
  }
  function closeShare() {
    const el = document.querySelector('.bw-share');
    if (el) { const opener = el._opener; el.remove(); opener && opener.isConnected && opener.focus({ preventScroll: true }); }
    if (shareUrl) { URL.revokeObjectURL(shareUrl); shareUrl = ''; }
  }

  window.DoceeBuilder = {
    build: buildScreen, order: orderScreen, ticket: ticketScreen, promo, productLink,
    newBuild, earnPts, bowlSvg,
  };
  // app.js rendered once before this deferred script ran: redraw screens that use these helpers.
  if (['home', 'product', 'build', 'order', 'ticket'].includes(state.screen) && state.view === 'preview') render();
})();
