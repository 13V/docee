'use strict';

/* Docee notifications + sound. Loaded after delight.js.
   A. window.DoceeNotify.show({title, body, screen}): an iOS-style in-app push banner inside the phone.
   B. Synthesized Web Audio sounds and short haptics. No audio files; the AudioContext is created
      lazily on the first user gesture and everything is silent before that.
   Listens for: docee:render, docee:points-earned, docee:stamp-card-full, docee:reward-unlocked
   (dispatched by delight.js). Test hook: ?notifydelay=<ms> shortens the home notification timer. */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const LIVE = '.phone-frame > .mobile-app:not(.gallery-mobile)';
  const AUTO_MS = 5000;
  const soundsOn = () => { try { return state.sounds !== false; } catch (e) { return true; } };
  const inPreview = () => { try { return state.view === 'preview'; } catch (e) { return true; } };

  /* ---------- B. Sound & haptics ---------- */
  let ctx = null, gestured = false, noiseBuf = null;
  function arm() {
    gestured = true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!ctx && AC) ctx = new AC();
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    } catch (e) { ctx = null; }
  }
  ['pointerdown', 'touchend', 'keydown', 'click'].forEach(type => document.addEventListener(type, arm, { capture: true, passive: true }));

  const audio = () => (gestured && ctx && soundsOn() ? ctx : null);

  function tone(c, { freq, to, start = 0, dur = .2, gain = .06, type = 'sine' }) {
    const t0 = c.currentTime + start, osc = c.createOscillator(), g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (to) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(Math.min(gain, .08), t0 + .012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + .03);
  }

  const SOUNDS = {
    tick: c => tone(c, { freq: 1300, to: 800, dur: .05, gain: .05 }),
    soft: c => tone(c, { freq: 900, to: 700, dur: .04, gain: .03 }),
    chime: c => { tone(c, { freq: 784, dur: .22, gain: .06 }); tone(c, { freq: 1175, start: .1, dur: .26, gain: .06 }); },
    arpeggio: c => [523.25, 659.25, 783.99].forEach((freq, i) => tone(c, { freq, start: i * .085, dur: .2, gain: .07, type: 'triangle' })),
    whoosh: c => {
      if (!noiseBuf) {
        noiseBuf = c.createBuffer(1, Math.floor(c.sampleRate * .35), c.sampleRate);
        const d = noiseBuf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      const t0 = c.currentTime, src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
      src.buffer = noiseBuf;
      f.type = 'bandpass'; f.Q.value = 1.2;
      f.frequency.setValueAtTime(350, t0);
      f.frequency.exponentialRampToValueAtTime(2600, t0 + .28);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(.06, t0 + .1);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + .3);
      src.connect(f).connect(g).connect(c.destination);
      src.start(t0); src.stop(t0 + .34);
    },
  };
  function play(name) {
    const c = audio();
    if (!c) return;
    try { SOUNDS[name](c); } catch (e) { /* audio unavailable */ }
  }
  function buzz(ms) {
    if (reduced.matches) return;
    try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* unsupported */ }
  }

  document.addEventListener('click', event => {
    const el = event.target.closest && event.target.closest('.sk-cta, .bottom-nav .nav-item');
    if (!el || el.disabled) return;
    play(el.classList.contains('sk-cta') ? 'tick' : 'soft');
    if (!el.classList.contains('dl-demo')) buzz(8); // delight.js already vibrates on the demo scan
  });
  document.addEventListener('change', event => {
    if (event.target.dataset && event.target.dataset.setting === 'sounds' && event.target.checked) { arm(); play('tick'); }
  });
  document.addEventListener('docee:points-earned', () => play('chime'));
  document.addEventListener('docee:stamp-card-full', () => play('arpeggio'));
  document.addEventListener('docee:reward-unlocked', () => play('arpeggio'));

  /* ---------- A. Banner ---------- */
  let current = null; // { el, timer, data }

  function remove(animate = true) {
    if (!current) return;
    const { el, timer } = current;
    clearTimeout(timer);
    current = null;
    if (!animate) { el.remove(); return; }
    el.classList.add('is-out');
    el.style.transform = '';
    setTimeout(() => el.remove(), 320);
  }

  function rearm() {
    if (!current) return;
    clearTimeout(current.timer);
    current.timer = setTimeout(() => remove(), AUTO_MS);
  }

  function build(data) {
    const el = document.createElement('div');
    el.className = 'dn-banner';
    el.setAttribute('role', 'status');
    el.innerHTML = `<button type="button" class="dn-body" aria-label="${escapeHtml(data.title)}. ${escapeHtml(data.body || '')}"><span class="dn-icon"><img src="public/assets/docee-mascot-line.png" alt="" /></span><span class="dn-copy"><span class="dn-meta"><span class="dn-app">DOCEE</span><span class="dn-now">now</span></span><strong class="dn-title">${escapeHtml(data.title)}</strong><span class="dn-text">${escapeHtml(data.body || '')}</span></span></button><span class="dn-grip" aria-hidden="true"></span>`;
    let startY = null, dy = 0, moved = false;
    el.addEventListener('pointerdown', e => {
      startY = e.clientY; dy = 0; moved = false;
      if (current) clearTimeout(current.timer);
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    });
    el.addEventListener('pointermove', e => {
      if (startY === null) return;
      dy = Math.min(0, e.clientY - startY);
      if (Math.abs(e.clientY - startY) > 6) moved = true;
      if (moved) el.style.transform = `translateY(${dy}px)`;
    });
    const end = () => {
      if (startY === null) return;
      startY = null;
      if (dy < -24) { remove(); return; }
      el.style.transform = '';
      if (current && current.el === el) rearm();
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('click', () => {
      if (moved) { moved = false; return; }
      const screen = data.screen;
      remove();
      let here = null;
      try { here = state.screen; } catch (err) { /* ignore */ }
      if (screen && screen !== here && typeof go === 'function') go(screen);
    });
    el.addEventListener('keydown', e => { if (e.key === 'Escape') remove(); });
    return el;
  }

  function show(data) {
    if (!data || !data.title) return false;
    const app = document.querySelector(LIVE);
    if (!app || !inPreview()) return false;
    remove(false);
    const el = build(data);
    app.append(el);
    current = { el, timer: 0, data };
    rearm();
    play('whoosh');
    buzz(10);
    return true;
  }

  /* ---------- Triggers ---------- */
  document.addEventListener('docee:stamp-card-full', () => {
    show({ title: 'Your 10th drink is on us \u{1F389}', body: 'Show your club card at the counter.', screen: 'scan' });
  });
  document.addEventListener('docee:reward-unlocked', event => {
    const name = event.detail && event.detail.name;
    show({ title: `You unlocked ${name || 'a reward'}!`, body: 'Tap to see it in Rewards.', screen: 'rewards' });
  });

  let homeTimer = 0, homeDone = false;
  const delayParam = Number(new URLSearchParams(location.search).get('notifydelay'));
  const homeDelay = delayParam > 0 ? delayParam : 20000;
  function fireHome() {
    homeTimer = 0;
    if (!show({ title: 'Double points this weekend ✨', body: 'Treat yourself at Findon Fair or Firle Plaza.', screen: 'discover' })) {
      homeTimer = setTimeout(fireHome, 3000); // not in the live preview right now, try again shortly
      return;
    }
    homeDone = true;
  }

  function onRender(detail) {
    const { screen, view } = detail || {};
    if (!homeDone && !homeTimer && screen === 'home' && view === 'preview') homeTimer = setTimeout(fireHome, homeDelay);
    if (!current) return;
    // render() rebuilt the phone: move the live banner into the new one, or drop it in gallery views.
    const app = document.querySelector(LIVE);
    if (!app || view !== 'preview') { remove(false); return; }
    if (!current.el.isConnected) { current.el.classList.add('is-restored'); app.append(current.el); }
  }
  document.addEventListener('docee:render', event => onRender(event.detail));
  // app.js renders once before this deferred script runs, so catch up with that first render.
  try { onRender({ screen: state.screen, view: state.view }); } catch (e) { /* state not ready */ }

  window.DoceeNotify = { show, dismiss: () => remove(), active: () => Boolean(current), audioReady: () => Boolean(ctx) };
})();
