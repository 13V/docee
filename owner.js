'use strict';

/* Owner's view: what Docee would see and control (sales demo, all sample data).
   app.js delegates here: window.DoceeOwner.render(screen, gallery) returns the screen body markup.
   Timers (feed ticker, count-up, banner) only run for the live preview and are cleared on every render. */
window.DoceeOwner = (() => {
  const A = 'public/assets/';
  const initial = () => ({
    store:'both', aud:'all', tpl:'matcha', msg:'', edited:false, when:'now',
    sent:null, counted:false, feed:[], feedSeq:0, banner:null,
  });
  let st = initial();

  /* ---------- sample data ---------- */
  const STORES = [['both','Both stores'],['findon','Findon Fair'],['firle','Firle Plaza']];
  const STORE_NAME = {findon:'Findon Fair', firle:'Firle Plaza'};
  const SHARE = {both:1, findon:.566, firle:.434};
  const KPI = {
    both:  {members:1240, week:86, repeat:62, points:18420, redeemed:64, extra:212},
    findon:{members:702,  week:49, repeat:64, points:10150, redeemed:37, extra:121},
    firle: {members:538,  week:37, repeat:59, points:8270,  redeemed:27, extra:91},
  };
  const WEEKS = ['W1','W2','W3','W4','W5','W6','W7','W8'];
  const VISITS_M = [310,330,352,371,402,431,455,486];
  const VISITS_N = [420,415,422,410,418,405,412,408];
  const HOURS = [18,34,42,30,26,48,61,44,29,33,40,22]; // 7am..6pm, both stores
  const HOUR_SHIFT = {both:0, findon:1, firle:-1};
  const PRODUCTS = [
    ['Dubai chocolate açaí','acai',412],['Ocean boost smoothie','smoothie',318],
    ['Iced matcha','matcha',287],['Ice Bueno kinder cream','cream',196],
  ];
  const AUDIENCES = [
    {id:'all', label:'all members', n:1240, rate:.6},
    {id:'lapsed', label:'lapsed 30 days', n:210, rate:.45},
    {id:'bday', label:'birthday this week', n:18, rate:.8},
    {id:'matcha', label:'matcha lovers', n:340, rate:.68},
  ];
  const TEMPLATES = [
    {id:'matcha', label:'2-for-1 matcha after 3pm', text:'2-for-1 iced matcha after 3pm today. Bring a friend, show your club card. 🍵', conv:.075},
    {id:'double', label:'Double points this weekend', text:'Double points this weekend at Findon Fair and Firle Plaza. Every little treat counts twice.', conv:.065},
    {id:'miss', label:'We miss you — a treat on us', text:'We miss you! Pop in this week and your next little treat is on us.', conv:.09},
  ];
  const WHEN = [['now','Right now'],['5pm','Today 5pm'],['sat','Saturday 9am']];
  const FEED_SEQ = [
    ['Sam','just redeemed a free coffee','firle'],['Priya','earned 18 points','findon'],
    ['Jo','joined the treat club','firle'],['Mia','scanned in and earned 32 points','findon'],
    ['Tom','just redeemed a $5 Docee credit','findon'],['Ana','earned 24 points','firle'],
    ['Lee','joined the treat club','findon'],['Kai','just redeemed a free açaí bowl','firle'],
  ];

  const n = v => Number(v).toLocaleString('en-AU');
  const esc = v => (typeof escapeHtml==='function'?escapeHtml(v):String(v));
  const ic = (name,cls) => (typeof icon==='function'?icon(name,cls):'');
  const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const scaleFor = () => SHARE[st.store];
  const live = () => document.querySelector('.phone-frame .mobile-app');

  /* ---------- feed ---------- */
  function feedItem(i, agoSec) {
    const [who,what,store] = FEED_SEQ[i % FEED_SEQ.length];
    const at = st.store==='both' ? store : st.store;
    return {who, what, store:at, ts:Date.now() - agoSec*1000};
  }
  function seedFeed() {
    st.feed = [feedItem(0,120), feedItem(1,420), feedItem(2,900), feedItem(3,1500)];
    st.feedSeq = 4;
  }
  function ago(ts) {
    const s = Math.max(0, Math.round((Date.now()-ts)/1000));
    if (s < 10) return 'just now';
    if (s < 60) return `${s}s ago`;
    return `${Math.round(s/60)}m ago`;
  }
  const feedHtml = fresh => st.feed.slice(0,5).map((f,i)=>`<li class="${fresh&&i===0?'is-new':''}"><span class="ow-dot" aria-hidden="true"></span><span class="ow-feed-copy"><strong>${esc(f.who)}</strong> ${esc(f.what)}<small>${STORE_NAME[f.store]} · ${ago(f.ts)}</small></span></li>`).join('');

  /* ---------- hand-drawn charts ---------- */
  const R = 'filter="url(#sketch-rough)"';
  function lineChart() {
    const k = scaleFor();
    const m = VISITS_M.map(v=>Math.round(v*k)), nn = VISITS_N.map(v=>Math.round(v*k));
    const W=300,H=176,L=34,Rr=70,T=12,B=26, max = st.store==='both'?500:st.store==='findon'?300:250, step = max/2;
    const x = i => L + i*((W-L-Rr)/7), y = v => T + (H-T-B)*(1-v/max);
    const pts = a => a.map((v,i)=>`${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
    const grid = [0,1,2].map(g=>{const v=g*step;return `<path d="M${L} ${y(v).toFixed(1)}H${W-Rr+8}" stroke="#2425D6" stroke-opacity=".18" stroke-width="1.2"/><text x="${L-6}" y="${(y(v)+4).toFixed(1)}" text-anchor="end" class="ow-ax">${v}</text>`}).join('');
    const xl = [0,3,7].map(i=>`<text x="${x(i).toFixed(1)}" y="${H-6}" text-anchor="middle" class="ow-ax">${WEEKS[i]}</text>`).join('');
    const lm=m[7], ln=nn[7];
    return `<svg class="ow-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Weekly visits over 8 weeks. Members grew from ${m[0]} to ${lm} visits a week while non-members stayed near ${ln}.">
      <g>${grid}${xl}</g>
      <g class="ow-draw" ${R} fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="${pts(nn)}" stroke="#5D5D7A" stroke-width="2"/>
        <polyline points="${pts(m)}" stroke="#2425D6" stroke-width="3.4"/>
        <circle cx="${x(7)}" cy="${y(lm)}" r="4.5" stroke="#2425D6" stroke-width="2.4" fill="#F3F1EA"/>
        <circle cx="${x(7)}" cy="${y(ln)}" r="3.5" stroke="#5D5D7A" stroke-width="2" fill="#F3F1EA"/>
      </g>
      <text x="${x(7)+10}" y="${y(lm)-6}" class="ow-hand ow-l-blue">members</text>
      <text x="${x(7)+10}" y="${y(lm)+7}" class="ow-ax ow-l-blue">${lm}/wk</text>
      <text x="${x(7)+10}" y="${y(ln)+12}" class="ow-hand ow-l-grey">not yet</text>
      <text x="${x(7)+10}" y="${y(ln)+25}" class="ow-ax ow-l-grey">${ln}/wk</text>
    </svg>`;
  }
  function barChart() {
    const sh = HOUR_SHIFT[st.store], k = scaleFor();
    const vals = HOURS.map((v,i)=>Math.max(6,Math.round((v + (i%2?sh*4:-sh*3))*k*(st.store==='both'?1:1.6))));
    const max = Math.max(...vals), peak = vals.indexOf(max);
    const W=300,H=150,L=8,T=26,B=24,gap=(W-L*2)/vals.length,bw=14;
    const bars = vals.map((v,i)=>{
      const h=(H-T-B)*v/max, cx=L+gap*i+gap/2, x0=cx-bw/2, y0=H-B-h;
      const p=`M${x0} ${H-B}L${x0+.8} ${y0}Q${cx} ${y0-2.5} ${x0+bw} ${y0+.5}L${x0+bw-.6} ${H-B}`;
      return i===peak ? `<path d="${p}" stroke="#2425D6" stroke-width="2" fill="#2425D6"/>` : `<path d="${p}" stroke="#2425D6" stroke-width="2" fill="none"/>`;
    }).join('');
    const lab = [[0,'7a'],[5,'12p'],[9,'4p'],[11,'6p']].map(([i,t])=>`<text x="${L+gap*i+gap/2}" y="${H-6}" text-anchor="middle" class="ow-ax">${t}</text>`).join('');
    const px = L+gap*peak+gap/2, hr = 7+peak, hl = hr>12?`${hr-12}pm`:hr===12?'12pm':`${hr}am`;
    return `<svg class="ow-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Busiest times by hour. The peak is around ${hl}, about ${vals[peak]} visits an hour.">
      <g ${R} stroke-linecap="round" stroke-linejoin="round">${bars}<path d="M${L} ${H-B+1}H${W-L}" stroke="#2425D6" stroke-opacity=".5" stroke-width="1.6" fill="none"/></g>
      ${lab}
      <text x="${Math.min(px+12,W-86)}" y="14" class="ow-hand ow-l-blue">busiest around ${hl}</text>
    </svg>`;
  }
  function products() {
    const k = scaleFor(), top = PRODUCTS[0][2]*k;
    return `<ol class="ow-rank">${PRODUCTS.map(([name,art,v],i)=>{
      const val = Math.round(v*k), w = Math.max(8, Math.round(val/top*100));
      return `<li><span class="ow-rank-n hand">${i+1}</span>${typeof sketch==='function'?sketch(art,'ow-rank-art'):''}<span class="ow-rank-main"><strong>${name}</strong><span class="ow-bar" aria-hidden="true"><i style="width:${w}%"></i></span></span><span class="ow-rank-v">${val}<small>sold</small></span></li>`;
    }).join('')}</ol>`;
  }

  /* ---------- shared owner chrome ---------- */
  const tabs = active => `<nav class="ow-tabs" aria-label="Owner sections"><button data-action="screen" data-screen="owner" ${active==='owner'?'class="is-on" aria-current="page"':''}>Dashboard</button><button data-action="screen" data-screen="owner-push" ${active==='owner-push'?'class="is-on" aria-current="page"':''}>Campaigns</button></nav>`;
  const top = active => `<div class="ow-top"><button class="ow-back" data-action="screen" data-screen="account">${ic('back')}<span>back to customer app</span></button><span class="ow-chip hand">sample data</span></div>${tabs(active)}`;
  const fine = () => `<p class="ow-fine">Sample data for demonstration only. These are not real Docee figures, members or sales.</p>`;

  /* ---------- screens ---------- */
  function dashboard(gallery) {
    if (!st.feed.length) seedFeed();
    const d = KPI[st.store];
    const tile = (label,val,sub,key) => `<div class="ow-tile"><span class="ow-tile-l">${label}</span><strong class="ow-num hand" data-count="${val}" ${key||''}>${n(val)}</strong><small>${sub}</small></div>`;
    return `${top('owner')}
    <div class="ow-head"><h1><span>Good morning,</span><em class="hand">Docee.</em></h1></div>
    <div class="ow-seg" role="group" aria-label="Store">${STORES.map(([id,l])=>`<button data-owner="store" data-v="${id}" aria-pressed="${st.store===id}" class="${st.store===id?'is-on':''}">${l}</button>`).join('')}</div>
    <section class="ow-kpis" aria-label="Key numbers, ${STORES.find(s=>s[0]===st.store)[1]}">
      <div class="ow-tile ow-hero"><div><span class="ow-tile-l">club members</span><strong class="ow-num ow-big hand" data-count="${d.members}">${n(d.members)}</strong></div><span class="ow-up hand">+<b data-count="${d.week}">${d.week}</b> this week</span></div>
      <div class="ow-tile"><span class="ow-tile-l">repeat visit rate</span><strong class="ow-num hand"><b data-count="${d.repeat}">${d.repeat}</b>%</strong><small>members back within 14 days</small></div>
      ${tile('points earned',d.points,'this week')}
      ${tile('rewards redeemed',d.redeemed,'this week')}
      ${tile('est. extra visits',d.extra,'because of the club')}
    </section>
    <button class="button primary sk-cta ow-cta" data-action="screen" data-screen="owner-push">send a campaign ${ic('arrow')}</button>
    <h2 class="ow-h hand">weekly visits</h2>
    <section class="ow-card" aria-label="Weekly visits">${lineChart()}<p class="ow-cap">Members now make up ${Math.round(VISITS_M[7]/(VISITS_M[7]+VISITS_N[7])*100)}% of visits, up from ${Math.round(VISITS_M[0]/(VISITS_M[0]+VISITS_N[0])*100)}% eight weeks ago.</p></section>
    <h2 class="ow-h hand">busiest times</h2>
    <section class="ow-card" aria-label="Busiest times">${barChart()}<p class="ow-cap">Visits by hour, an average day.</p></section>
    <h2 class="ow-h hand">top sellers this week</h2>
    <section class="ow-card" aria-label="Top products">${products()}</section>
    <h2 class="ow-h hand">happening now</h2>
    <section class="ow-card" aria-label="Recent activity"><ul class="ow-feed" ${gallery?'':'aria-live="off"'}>${feedHtml(false)}</ul></section>
    ${fine()}`;
  }

  const audience = () => AUDIENCES.find(a=>a.id===st.aud);
  const template = () => TEMPLATES.find(t=>t.id===st.tpl);
  const message = () => st.edited ? st.msg : (template()?.text || '');
  const reach = () => Math.round(audience().n * audience().rate);
  const projected = () => Math.max(1, Math.round(audience().n * (template()?.conv||.07) * (st.edited?.9:1)));
  const whenLabel = () => WHEN.find(w=>w[0]===st.when)[1].toLowerCase();
  function notif(text, cls='') {
    return `<div class="ow-notif ${cls}"><img src="${A}docee-mascot-line.png" alt="" width="40" height="40"/><div><p class="ow-notif-top"><strong>Docee</strong><span>now</span></p><p class="ow-notif-body" data-ow-preview>${esc(text) || 'Your message appears here.'}</p></div></div>`;
  }
  function push() {
    if (st.sent) return sentView();
    const a = audience(), msg = message();
    const label = st.when==='now' ? `send to ${n(a.n)} members (demo)` : `schedule for ${whenLabel()} · ${n(a.n)} (demo)`;
    return `${top('owner-push')}
    <div class="ow-head"><h1><span>Send a little</span><em class="hand">nudge.</em></h1></div>
    <h2 class="ow-h hand">who gets it</h2>
    <div class="ow-chips" role="group" aria-label="Audience">${AUDIENCES.map(x=>`<button data-owner="aud" data-v="${x.id}" aria-pressed="${st.aud===x.id}" class="${st.aud===x.id?'is-on':''}">${x.label}<small>${n(x.n)}</small></button>`).join('')}</div>
    <h2 class="ow-h hand">what to say</h2>
    <div class="ow-tpls" role="group" aria-label="Message templates">${TEMPLATES.map(t=>`<button data-owner="tpl" data-v="${t.id}" aria-pressed="${st.tpl===t.id&&!st.edited}" class="${st.tpl===t.id&&!st.edited?'is-on':''}">${t.label}</button>`).join('')}</div>
    <label class="ow-field"><span class="ow-field-l">your message <small data-ow-count>${msg.length}/120</small></span><textarea data-owner-msg rows="3" maxlength="120" aria-label="Message">${esc(msg)}</textarea></label>
    <h2 class="ow-h hand">how it looks</h2>
    <div class="ow-lock" aria-label="Lock screen preview"><span class="ow-lock-time">9:41</span><span class="ow-lock-date">Wednesday 25 November</span>${notif(msg)}</div>
    <h2 class="ow-h hand">when</h2>
    <div class="ow-chips" role="group" aria-label="Schedule">${WHEN.map(([id,l])=>`<button data-owner="when" data-v="${id}" aria-pressed="${st.when===id}" class="${st.when===id?'is-on':''}">${l}</button>`).join('')}</div>
    <div class="ow-reach"><div><strong class="hand" data-ow-reach>~${n(reach())}</strong><span>of ${n(a.n)} members will see it</span></div><div class="ow-bar" aria-hidden="true"><i style="width:${Math.round(a.rate*100)}%"></i></div></div>
    <button class="button primary sk-cta ow-cta" data-owner="send" ${msg.trim()?'':'disabled'}>${label}</button>
    ${fine()}`;
  }
  function sentView() {
    const s = st.sent;
    return `${top('owner-push')}
    <div class="ow-sent"><p class="ow-sent-word hand">sent!</p><p class="ow-sent-sub">${s.when==='now'?'Your message is on its way to':'Scheduled for '+esc(s.whenLabel)+' to'} <strong>${n(s.n)} members</strong>.</p></div>
    ${notif(s.msg)}
    <div class="ow-proj"><span class="ow-proj-l">projected extra visits</span><strong class="ow-num ow-big hand">~${n(s.visits)}</strong><small>sample estimate based on typical club response</small></div>
    <button class="button primary sk-cta ow-cta" data-owner="see-customer">see it as a customer</button>
    <button class="ow-link" data-owner="again">write another</button>
    ${fine()}`;
  }

  function render(screen, gallery = false) {
    return screen === 'owner-push' ? push() : dashboard(gallery);
  }

  /* ---------- live behaviour ---------- */
  let feedTimer = 0, rafId = 0, bannerTimer = 0;
  function stopTimers() { clearInterval(feedTimer); feedTimer = 0; cancelAnimationFrame(rafId); clearTimeout(bannerTimer); }

  function countUp(root) {
    const els = [...root.querySelectorAll('[data-count]')];
    if (!els.length) return;
    const t0 = performance.now(), D = 1000;
    const step = now => {
      const p = Math.min(1, (now-t0)/D), e = 1-Math.pow(1-p,3);
      els.forEach(el=>{ el.textContent = n(Math.round(Number(el.dataset.count)*e)); });
      if (p < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
  }
  function tickFeed() {
    const list = document.querySelector('.phone-frame .ow-feed');
    if (!list) return;
    st.feed.unshift(feedItem(st.feedSeq++, 0));
    st.feed = st.feed.slice(0,6);
    list.innerHTML = feedHtml(!reduced());
  }
  function showBanner(app) {
    const text = st.banner; st.banner = null;
    if (!text || !app) return;
    app.querySelector('.ow-banner')?.remove();
    const b = document.createElement('div');
    b.className = 'ow-banner';
    b.setAttribute('role','status');
    b.innerHTML = notif(text,'in-app');
    b.addEventListener('click', () => b.remove());
    app.append(b);
    bannerTimer = setTimeout(() => b.remove(), 8000);
  }

  document.addEventListener('docee:render', event => {
    stopTimers();
    const app = live();
    if (!app) return;
    const screen = event.detail?.screen;
    if (event.detail?.view === 'preview' && screen === 'owner') {
      if (!st.counted) { st.counted = true; if (!reduced()) countUp(app); }
      feedTimer = setInterval(tickFeed, 4500);
    }
    if (screen === 'home') showBanner(app);
  });

  function rerender(focusSel) {
    window.render?.(true);
    if (focusSel) document.querySelector(`.phone-frame ${focusSel}`)?.focus({preventScroll:true});
  }

  document.addEventListener('click', event => {
    const t = event.target.closest('[data-owner]');
    if (!t) return;
    const act = t.dataset.owner, v = t.dataset.v;
    if (act === 'store') { st.store = v; st.feed = []; rerender(`[data-owner="store"][data-v="${v}"]`); }
    else if (act === 'aud') { st.aud = v; rerender(`[data-owner="aud"][data-v="${v}"]`); }
    else if (act === 'tpl') { st.tpl = v; st.edited = false; st.msg = ''; rerender(`[data-owner="tpl"][data-v="${v}"]`); }
    else if (act === 'when') { st.when = v; rerender(`[data-owner="when"][data-v="${v}"]`); }
    else if (act === 'send') {
      const a = audience();
      st.sent = {n:a.n, msg:message().trim(), visits:projected(), when:st.when, whenLabel:whenLabel()};
      rerender();
      document.querySelector('.phone-frame .app-scroll')?.scrollTo?.({top:0});
    }
    else if (act === 'again') { st.sent = null; rerender(); }
    else if (act === 'see-customer') { st.banner = st.sent?.msg || message(); if (typeof go === 'function') go('home'); }
  });

  /* Typing updates the preview in place so the textarea keeps focus. */
  document.addEventListener('input', event => {
    const ta = event.target.closest?.('[data-owner-msg]');
    if (!ta) return;
    st.msg = ta.value; st.edited = true;
    document.querySelectorAll('.phone-frame [data-ow-preview]').forEach(p => { p.textContent = ta.value || 'Your message appears here.'; });
    const c = document.querySelector('.phone-frame [data-ow-count]'); if (c) c.textContent = `${ta.value.length}/120`;
    document.querySelectorAll('.phone-frame .ow-tpls button').forEach(b => { b.classList.remove('is-on'); b.setAttribute('aria-pressed','false'); });
    const send = document.querySelector('.phone-frame [data-owner="send"]'); if (send) send.disabled = !ta.value.trim();
  });

  /* app.js renders once before this deferred script runs; repaint if a deep link opened an owner screen. */
  if (/^#owner/.test(location.hash)) queueMicrotask(() => window.render?.());

  return { render, reset(){ stopTimers(); st = initial(); } };
})();
