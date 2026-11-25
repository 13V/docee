'use strict';

const assets = 'public/assets/';
const icons = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
  gift: '<path d="M3 8h18v4H3zM5 12v9h14v-9M12 8v13"/><path d="M12 8H8a3 3 0 1 1 3-3Zm0 0h4a3 3 0 1 0-3-3Z"/>',
  scan: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3z"/>',
  discover: '<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  back: '<path d="m15 5-7 7 7 7"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  receipt: '<path d="M5 3h14v18l-3-2-4 2-4-2-3 2Zm4 5h6m-6 4h6m-6 4h3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  star: '<path d="m12 3 2.8 5.7L21 10l-4.5 4.4 1 6.3L12 17.8l-5.5 2.9 1-6.3L3 10l6.2-1.3Z"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3Zm4 12h4"/>',
  heart: '<path d="M20.5 4.5a5 5 0 0 0-7 0L12 6l-1.5-1.5a5 5 0 0 0-7 7L12 20l8.5-8.5a5 5 0 0 0 0-7Z"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  external: '<path d="M14 3h7v7m0-7L10 14M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  shield: '<path d="m12 3 8 3v6c0 6-8 10-8 10s-8-4-8-10V6Zm-4 9 3 3 5-6"/>',
};
const icon = (name, className = '') => `<svg class="icon ${className}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.star}</svg>`;
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const logo = className => `<span class="brand-lockup ${className || ''}"><img class="brand-logo" src="${assets}docee-mascot.png" alt="Docee berry mascot" /><span class="brand-wordmark">docee.</span></span>`;
const productImage = (file, alt, className = '', {loading='eager',fetchPriority='auto'} = {}) => `<img class="${className}" src="${assets}${file}" alt="${alt}" decoding="async" loading="${loading}" fetchpriority="${fetchPriority}" />`;
const charm = (name, className = '') => `<img class="charm ${className}" src="${assets}charms/${({'iced-cup':'iced-drink',spoon:'spoon-heart'})[name] || name}.svg" alt="" aria-hidden="true" />`;
const handNote = (text, className = '') => `<span class="hand-note ${className}">${text}</span>`;

const screens = [
  {id:'welcome',name:'Welcome',group:'Join the club',detail:'A cobalt welcome with a mixed sans and handwritten headline, the white line-art mascot and a short menu list.',behavior:'Tap the round arrow to continue. Signed-in members open Home; signed-out members open signup.'},
  {id:'signin',name:'Sign up / Sign in',group:'Join the club',detail:'A cream form with a sans-and-script “Join the treat club.” headline, a berry sketch, handwritten field labels, outlined inputs and a sign up / sign in toggle.',behavior:'Complete the signup fields and consent checkbox, or switch to Sign in. No account is created and no messages are sent.'},
  {id:'verify',name:'Verify code',group:'Join the club',detail:'A cream code screen with a “Check your phone.” headline, a phone sketch and one large outlined code field, with resend and change-number links.',behavior:'Use 123456 to continue. Any other code shows a validation message.'},
  {id:'profile',name:'Your profile',group:'Join the club',detail:'A cream profile form with a script headline, optional email and birthday fields and an outlined marketing opt-in card.',behavior:'Signup details carry through. Save your name to personalise the home screen.'},
  {id:'home',name:'Home',group:'Everyday moments',detail:'Member header, a sans-and-script headline, a highlighter category list and a rail of line-art product cards, with the points card below.',behavior:'Choose a category to filter the rail, open a product, or scroll to your points, club card and receipt claim.'},
  {id:'scan',name:'Membership scan',group:'Everyday moments',detail:'A full cobalt club card: white QR, handwritten points balance and a line-art cup.',behavior:'The QR encodes a demo-only membership value. It is not a valid merchant membership.'},
  {id:'rewards',name:'Rewards',group:'Everyday moments',detail:'Points progress card and a rail of rewards that reuse the line-art product card, with points shown as handwritten tags.',behavior:'Choose a reward to review the balance impact before redeeming.'},
  {id:'reward-detail',name:'Reward details',group:'Everyday moments',detail:'Line-art reward hero, a sans-and-script title and a compact points summary.',behavior:'Confirm once to deduct points and add a history entry. Insufficient points prevents redemption.'},
  {id:'redeem',name:'Reward ready',group:'Everyday moments',detail:'A cobalt saved-reward screen that reveals a white QR and code to show at the counter.',behavior:'The voucher is illustrative only. Reopening this screen never deducts points again.'},
  {id:'claim',name:'Claim receipt',group:'Everyday moments',detail:'A cream recovery screen with a “Missed a scan?” headline and receipt sketch, outlined fields and a blue handwritten “+18 points” success card.',behavior:'Enter receipt DCE-1048 and amount 18.50. The demo receipt earns 18 points once.'},
  {id:'activity',name:'Activity',group:'Everyday moments',detail:'A cream ledger with a sans-and-script headline, a filter pill that opens the bottom sheet, and outlined rows with handwritten blue point amounts.',behavior:'Filter by All, Earned, and Redeemed; the list reflects demo transactions immediately.'},
  {id:'discover',name:'Discover menu',group:'Explore Docee',detail:'A dark menu with cobalt promo cards, a handwritten season heading, a highlighter category list with counts and line-art tiles.',behavior:'Change locations, filter the menu or open a product detail. This concept supports browsing only.'},
  {id:'product',name:'Product detail',group:'Explore Docee',detail:'A cobalt line-art hero, sans-and-script product name, concise story and a route to the stores.',behavior:'Product descriptions are concept copy. In-store menu and availability must be confirmed.'},
  {id:'stores',name:'Find us',group:'Explore Docee',detail:'The Adelaide OpenStreetMap on top, then a raised cream sheet with a handwritten Adelaide heading and outlined store cards; the chosen store is filled blue.',behavior:'Select a location to open its menu directly. The selected store and address appear at the top of the menu.'},
  {id:'account',name:'Account & settings',group:'Your membership',detail:'A cobalt profile card with the line-art mascot and handwritten name, followed by outlined groups under handwritten membership, settings and support headings.',behavior:'Toggle demo preferences, revisit your profile, or sign out. Reset demo clears all changes.'},
];
const products = [
  {id:'acai',art:'acai',lead:'Dubai Chocolate',script:'Açaí',name:'Dubai Chocolate Acai',posterTop:'DUBAI CHOC',posterBottom:'ACAI',category:'Açaí',file:'generated/product-acai.jpg',tag:'Meet your next favourite',description:'Chocolate, pistachio and açaí. A very good combination.',detail:'Choose your toppings in store. Our team can help with ingredients and allergens.'},
  {id:'smoothie',art:'smoothie',lead:'Ocean Boost',script:'Smoothie',name:'Ocean Boost Smoothie',posterTop:'OCEAN',posterBottom:'BOOST',category:'Smoothies',file:'generated/product-smoothie.jpg',tag:'Out of the blue',description:'A bright blue break from the everyday.',detail:'Discover the smoothie range at your local Docee. Ask our team about ingredients and available options.'},
  {id:'matcha',art:'matcha',lead:'Iced',script:'Matcha',name:'Iced Matcha',posterTop:'ICED',posterBottom:'MATCHA',category:'Matcha',file:'generated/product-matcha.jpg',tag:'Your daily green',description:'For the matcha people. You know who you are.',detail:'Made in store. Ask our team about the matcha selection and milk options.'},
  {id:'cold-cream',art:'cream',lead:'Ice Bueno Kinder',script:'Cream',name:'Ice Bueno Kinder Cream',posterTop:'BUENO',posterBottom:'CREAM',category:'Cold cream',file:'generated/product-cream.jpg',tag:'A sweet decision',description:'Cool, creamy, and worth stopping for.',detail:'Explore the current cream range and toppings in store. Ask our team about ingredients and allergens.'},
];
const rewards = [
  {id:'credit',name:'$5 Docee credit',cost:100,subtitle:'Put it towards something good.',kind:'credit',art:'gift',lead:'$5 Docee',script:'Credit'},
  {id:'coffee',name:'Coffee, on us',cost:120,subtitle:'Your daily ritual, covered.',kind:'coffee',art:'coffee',lead:'Coffee,',script:'On us'},
  {id:'bowl',name:'Your açaí bowl',cost:250,subtitle:'A good reason to stop by.',kind:'bowl',art:'acai',lead:'Your açaí',script:'Bowl'},
];
const stores = [
  {id:'findon',name:'Findon Fair',suburb:'Woodville South',address:'Shop 3, 115 Findon Road',city:'Woodville South SA 5011',tag:'Your neighbourhood Docee.',full:'Shop 3, 115 Findon Road, Woodville South SA 5011'},
  {id:'firle',name:'Firle Plaza',suburb:'Firle',address:'Shop 9, 171 Glynburn Road',city:'Firle SA 5070',tag:'Your neighbourhood Docee.',full:'Shop 9, 171 Glynburn Road, Firle SA 5070'},
];

const initialState = () => ({
  screen:'home',view:'preview',points:180,name:'Alex',email:'',phone:'0412 345 678',birthday:'',signedIn:true,
  authMode:'signup',authDraft:{name:'',email:'',phone:'',birthday:'',consent:false},
  marketing:false,notifications:true,category:'All',historyFilter:'All',rewardId:'credit',productId:'acai',storeId:'findon',
  error:'',toast:'',claimed:false,voucher:null,sheet:null,rewardRevealed:false,activityId:null,
  history:[
    {id:'h1',type:'earned',title:'A visit to Findon Fair',date:'5 Oct 2026',points:48,caption:'Membership scanned in store'},
    {id:'h2',type:'earned',title:'A visit to Firle Plaza',date:'29 Sep 2026',points:32,caption:'Membership scanned in store'},
    {id:'h3',type:'earned',title:'A visit to Findon Fair',date:'21 Sep 2026',points:60,caption:'Membership scanned in store'},
    {id:'h4',type:'earned',title:'A visit to Firle Plaza',date:'12 Sep 2026',points:40,caption:'Membership scanned in store'},
  ],
});
let state = initialState();
const screenFromUrl = () => screens.find(screen=>screen.id===window.location.hash.slice(1))?.id || 'home';
state.screen = screenFromUrl();
const mobileViewport = window.matchMedia('(max-width:760px), (max-width:950px) and (max-height:500px)');
const reviewRequested = new URLSearchParams(window.location.search).get('review')==='1';
let toastTimer;
const getReward = () => rewards.find(r => r.id === state.rewardId) || rewards[0];
const getProduct = () => products.find(p => p.id === state.productId) || products[0];
const getStore = () => stores.find(s => s.id === state.storeId) || stores[0];
const firstName = () => state.name.trim().split(/\s+/)[0] || 'you';
const normalisePhone = value => {
  let phone=String(value).replace(/[\s()-]/g,'');
  if(phone.startsWith('+61'))phone='0'+phone.slice(3);
  return phone;
};
const validMobile = value => /^04\d{8}$/.test(normalisePhone(value));
const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
const validSignup = draft => draft.name.trim().length>=2&&validEmail(draft.email)&&validMobile(draft.phone)&&(!draft.birthday||draft.birthday<='2026-10-07')&&draft.consent;

function authSwitch(mode = 'signup') {
  return `<div class="auth-switch">${mode==='signup'?'Already have an account?':'New to Docee?'} <button data-action="${mode==='signup'?'signin-mode':'signup'}">${mode==='signup'?'sign in':'sign up'}</button></div>`;
}
function authHeader(back = 'welcome') {
  return `<div class="auth-header"><button class="icon-button" data-action="screen" data-screen="${back}" aria-label="Back">${icon('back')}</button></div>`;
}

function button(label, action, classes = 'primary', extra = '') {
  return `<button class="button ${classes}" data-action="${action}" ${extra}>${label}</button>`;
}
function heading(title, eyebrow = '', sub = '') {
  return `${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1>${title}</h1>${sub ? `<p class="screen-intro">${sub}</p>` : ''}`;
}
function pageHeader(title, back = 'home', right = '') {
  return `<div class="page-header"><button class="icon-button" data-action="screen" data-screen="${back}" aria-label="Back">${icon('back')}</button><span>${title}</span><div class="header-end">${right}</div></div>`;
}
function inlineError() { return state.error ? `<div class="form-error" role="alert">${icon('shield')}<span>${escapeHtml(state.error)}</span></div>` : ''; }
function arrowRow(title, caption, action, extra = '', symbol = 'arrow') {
  return `<button class="action-row" data-action="${action}" ${extra}><span><strong>${title}</strong>${caption ? `<small>${caption}</small>` : ''}</span>${icon(symbol)}</button>`;
}
function clubArtwork(className = '') {
  return `<div class="club-art ${className}" aria-label="Docee club card"><span>DOCEE.</span></div>`;
}
function rewardArt(reward) {
  if (reward.kind === 'credit') return clubArtwork('credit-card-art');
  const file = reward.kind === 'coffee' ? 'generated/reward-coffee.jpg' : 'generated/product-acai.jpg';
  return `<div class="reward-photo">${productImage(file,reward.name)}</div>`;
}
function masthead(left = 'MENU', destination = 'discover') {
  return `<div class="app-masthead"><button class="member-avatar" data-action="screen" data-screen="account" aria-label="Open account">${escapeHtml(state.name.slice(0,1).toUpperCase())}</button>${logo()}<button class="icon-button" data-action="screen" data-screen="scan" aria-label="Open membership">${icon('scan')}</button></div>`;
}
function featureCard(product, file, caption, title, actionLabel) {
  return `<button class="home-feature feature-${product}" data-action="product" data-product="${product}"><div class="feature-photo">${productImage(file,caption,'',{loading:product==='acai'?'eager':'lazy',fetchPriority:product==='acai'?'high':'auto'})}</div><span class="home-feature-copy"><small>${caption}</small><strong>${title}</strong><span class="feature-cta">${actionLabel}</span></span></button>`;
}
function homeMembership() {
  const rewardStatus = state.voucher ? 'Your saved reward is ready' : state.points>=100 ? 'Your $5 reward is ready' : `${100-state.points} points to your $5 reward`;
  return `<section class="home-membership-section" aria-labelledby="home-membership-title"><div class="home-membership-heading"><h2 id="home-membership-title">Your membership</h2><button class="home-membership-pill" data-action="screen" data-screen="rewards">VIEW REWARDS</button></div><div class="home-membership-card" role="group" aria-label="Docee Treat Club membership"><div class="home-membership-summary"><div><span class="home-membership-label">Docee Treat Club</span><p class="home-membership-points"><strong>${state.points}</strong><span>points</span></p></div><button class="home-membership-pill" data-action="screen" data-screen="scan">SCAN CARD</button></div><button class="home-membership-reward" data-action="${state.voucher?'screen':'reward'}" ${state.voucher?'data-screen="redeem"':'data-reward="credit"'}><span>${rewardStatus}</span>${icon('arrow')}</button></div><button class="home-membership-receipt" data-action="screen" data-screen="claim">${icon('receipt')}<span>Claim a receipt</span>${icon('arrow')}</button></section>`;
}
function productPoster(product, isButton = true) {
  const tag = isButton ? 'button' : 'div';
  return `<${tag} class="product-poster poster-${product.id}" ${isButton?`data-action="product" data-product="${product.id}"`:''}>${handNote(product.id==='acai'?'a little obsessed':product.id==='matcha'?'your daily green':product.id==='smoothie'?'a blue mood':'sweet on you','poster-note')}${productImage(product.file,product.name)}${charm(product.id==='matcha'?'sparkles':'spoon','poster-charm')}<span class="oval-sticker">Made<br/>at Docee</span>${isButton?`<span class="poster-open">Take a look ${icon('arrow')}</span>`:''}</${tag}>`;
}
function menuProductCard(product, compact = false) {
  return `<button class="${compact?'menu-product-row':'product-card'}" data-action="product" data-product="${product.id}">${compact?'':'<span class="product-card-options" aria-hidden="true">•••</span>'}<div class="product-thumb">${productImage(product.file,product.name)}</div><div class="menu-product-copy"><h2>${product.name}</h2>${compact?`<p>${product.description}</p>`:`<span class="product-category">${product.category}</span>`}</div></button>`;
}
function qr() {
  return `<img class="qr-code" src="${assets}demo-qr.svg" alt="Demo-only membership QR code" />`;
}
function nav(screen) {
  const onboarding = ['welcome','signin','verify','profile','reward-detail','redeem','activity','stores'];
  if(onboarding.includes(screen)) return '';
  const active = screen==='welcome' ? 'home' : ['reward-detail','redeem'].includes(screen) ? 'rewards' : ['product','stores'].includes(screen) ? 'discover' : ['activity','claim'].includes(screen) ? 'account' : screen;
  return `<nav class="bottom-nav sk-nav" aria-label="App navigation">${[['home','home','for you'],['rewards','gift','rewards'],['scan','scan','club card'],['discover','discover','menu'],['account','user','account']].map(([id,symbol,name])=>`<button class="nav-item ${id===active?'active':''}" data-action="screen" data-screen="${id}" aria-label="${name}" ${id===active?'aria-current="page"':''}>${icon(symbol)}<small>${name}</small></button>`).join('')}</nav>`;
}


/* Sketch theme building blocks */
const nextReward = () => rewards.find(r=>r.cost>state.points) || null;
function skHeader(title, back = 'home', right = '') {
  return `<div class="sk-top"><button class="sk-icon" data-action="screen" data-screen="${back}" aria-label="Back">${icon('back')}</button><span class="sk-top-title">${title}</span><div class="sk-top-end">${right}</div></div>`;
}
function skCard(item, {action='product', active=false, tag=''} = {}) {
  const data = action==='product' ? `data-action="product" data-product="${item.id}"` : `data-action="reward" data-reward="${item.id}"`;
  return `<button class="sk-card ${active?'is-active':''}" ${data} aria-label="${escapeHtml(item.name)}"><span class="sk-card-lead">${escapeHtml(item.lead)}</span><span class="sk-card-script hand">${escapeHtml(item.script)}</span>${sketch(item.art,'sk-card-art')}${tag?`<span class="sk-tag hand">${tag}</span>`:''}<span class="sk-card-cta">${action==='product'?'take a look':'redeem'} ${icon('arrow')}</span></button>`;
}
function skTile(product) {
  return `<button class="sk-tile" data-action="product" data-product="${product.id}"><span class="sk-tile-name">${escapeHtml(product.lead.toLowerCase())}</span><small>${escapeHtml(product.category.toLowerCase())}</small>${sketch(product.art,'sk-tile-art')}<span class="sk-tile-cta">take a look ${icon('arrow')}</span></button>`;
}
function skList(items, selected, action, counts = {}) {
  return `<div class="sk-list" role="group" aria-label="Filter">${items.map(([value,label])=>`<button class="${selected===value?'is-on':''}" aria-pressed="${selected===value}" data-action="${action}" data-category="${value}"><span>${label}</span>${counts[value]!=null&&selected===value?`<small>(${counts[value]})</small>`:''}</button>`).join('')}</div>`;
}
function skPointsCard() {
  const next = nextReward();
  const ready = rewards.filter(r=>r.cost<=state.points).length;
  const pct = next ? Math.round(state.points/next.cost*100) : 100;
  return `<section class="sk-points" aria-label="Your points"><div class="sk-points-top"><div><span class="sk-points-label">Docee Treat Club</span><p class="sk-points-num hand">${state.points}<small> pts</small></p></div>${sketch('gift','sk-points-art')}</div><div class="sk-progress" role="progressbar" aria-valuemin="0" aria-valuemax="${next?next.cost:state.points}" aria-valuenow="${state.points}" aria-label="Progress to next reward"><span style="width:${pct}%"></span></div><p class="sk-points-note">${next?`${next.cost-state.points} points to ${escapeHtml(next.name.toLowerCase())}`:'Every reward is unlocked'}${ready?` · ${ready} ready now`:''}</p><div class="sk-points-actions"><button data-action="screen" data-screen="scan">${icon('scan')} scan card</button><button data-action="screen" data-screen="rewards">rewards ${icon('arrow')}</button></div></section>`;
}

function skField(label, control, {optional=false, className=''} = {}) {
  return `<label class="sk-field ${className}"><span class="sk-label hand">${label}${optional?'<small>optional</small>':''}</span>${control}</label>`;
}
function skHeadline(lines, art = '') {
  const [first,...rest] = lines, last = rest.pop(), middle = rest[0];
  return `<div class="sk-headline ${art?'has-art':''} ${middle?'':'two'}"><h1><span>${first}</span>${middle?`<span class="indent">${middle}</span>`:''}<em class="hand">${last}</em></h1>${art?sketch(art,'sk-headline-art'):''}</div>`;
}

function renderScreen(screen, gallery = false) {
  let body = '';
  const reward = getReward();
  const product = getProduct();
  const store = getStore();
  switch(screen) {
    case 'welcome':
      body = `<div class="sk-welcome"><h1 class="sk-welcome-title"><span>Welcome to</span><span class="indent">your little</span><em class="hand">treat club!</em></h1><p class="sk-welcome-addr">Findon Fair &amp; Firle Plaza<br/>Adelaide, SA</p><div class="sk-welcome-art"><img src="${assets}docee-mascot-white.png" alt="Docee berry mascot"/></div><ul class="sk-welcome-menu"><li class="hand">made fresh</li><li>Açaí</li><li>Smoothies</li><li>Coffee</li><li>Viral desserts</li></ul><button class="sk-next" data-action="screen" data-screen="${state.signedIn?'home':'signin'}" aria-label="Continue to Docee">${icon('arrow')}</button></div>`;
      break;
    case 'signin': {
      const signup=state.authMode==='signup',draft=state.authDraft;
      body = `${skHeader(signup?'Sign up':'Sign in','welcome')}${skHeadline(signup?['Join the','treat','club.']:['Welcome','back to the','club.'],'berry')}<form data-form="signin" class="form auth-form sk-form" novalidate>${signup?`${skField('full name',`<input name="name" autocomplete="name" value="${escapeHtml(draft.name)}" placeholder="Full name" maxlength="60" required/>`)}${skField('email',`<input type="email" name="email" autocomplete="email" value="${escapeHtml(draft.email)}" placeholder="Email" required/>`)}`:''}${skField('mobile',`<div class="phone-field"><span>AU +61</span><input type="tel" name="phone" inputmode="tel" autocomplete="tel-national" value="${escapeHtml(draft.phone)}" placeholder="Mobile" aria-label="Mobile number" required/></div>`)}${signup?`${skField('birthday',`<input type="date" name="birthday" value="${escapeHtml(draft.birthday)}" max="2026-10-07" aria-label="Birthday, optional"/>`,{optional:true,className:`birthday-field ${draft.birthday?'has-value':''}`})}<p class="field-note birthday-note">So we can celebrate your birthday</p><label class="auth-terms check-label sk-check"><input type="checkbox" name="consent" ${draft.consent?'checked':''} required/><span>By creating an account, you agree to our <a href="#club-terms" data-action="sheet" data-sheet="terms">Terms</a> &amp; <a href="#privacy" data-action="sheet" data-sheet="privacy">Privacy Policy</a>.</span></label>`:''}${inlineError()}${button(signup?'SIGN UP':'SIGN IN','submit','primary',`type="submit" ${signup&&!validSignup(draft)?'disabled':''}`)}</form>${authSwitch(signup?'signup':'signin')}`;
      break;
    }
    case 'verify':
      body = `${skHeader('Verify','signin')}${skHeadline(['Check your','phone.'],'phone')}<p class="sk-sub">Enter the 6-digit code sent to ${escapeHtml(state.phone)}.</p><form data-form="verify" class="form sk-form">${skField('6-digit code',`<input class="otp-input" name="code" type="text" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" autocomplete="one-time-code" placeholder="000000" aria-label="6-digit verification code" required/>`)}${inlineError()}${button('VERIFY & CONTINUE','submit','primary','type="submit"')}</form><div class="sk-text-actions"><button class="text-button" data-action="resend">Send a new code</button><button class="text-button muted" data-action="screen" data-screen="signin">Change mobile number</button></div>`;
      break;
    case 'profile':
      body = `${skHeader('Profile',state.signedIn?'account':'signin')}${skHeadline(['Your','profile.'],'berry')}<form data-form="profile" class="form sk-form">${skField('full name',`<input name="name" autocomplete="name" placeholder="Your name" value="${escapeHtml(state.name)}" maxlength="60" required/>`)}${skField('email',`<input type="email" name="email" autocomplete="email" placeholder="Email" value="${escapeHtml(state.email)}"/>`,{optional:true})}${skField('birthday',`<input type="date" name="birthday" value="${escapeHtml(state.birthday)}" max="2026-10-07"/>`,{optional:true})}<p class="field-note birthday-note">A birthday reward, if you want one.</p><label class="check-label sk-check sk-check-card"><input type="checkbox" name="marketing" ${state.marketing?'checked':''}/><span>Send me Docee news and offers.<small>You can change this any time.</small></span></label>${inlineError()}${button('SAVE & CONTINUE','submit','primary','type="submit"')}</form><p class="legal-note"><button data-action="sheet" data-sheet="terms">Club terms</button> · <button data-action="sheet" data-sheet="privacy">Privacy</button></p>`;
      break;
    case 'home':
      {
        const list = state.category==='All' ? products : products.filter(p=>p.category===state.category);
        body = `<div class="sk-hello"><button class="sk-avatar" data-action="screen" data-screen="account" aria-label="Open account"><img src="${assets}docee-mascot-line.png" alt=""/></button><div class="sk-hello-copy"><strong>${escapeHtml(state.name)}</strong><span>${escapeHtml(store.name)} · ${escapeHtml(store.suburb)}</span></div><button class="sk-icon" data-action="screen" data-screen="scan" aria-label="Open club card">${icon('scan')}</button></div><div class="sk-headline"><button class="sk-showall" data-action="screen" data-screen="discover">show all</button><h1><span>Hey ${escapeHtml(firstName())}, a little</span><span class="indent">more sweet with</span><em class="hand">Docee.</em></h1></div>${skList([['All','what’s new'],['Açaí','açaí'],['Smoothies','smoothies'],['Matcha','matcha'],['Cold cream','cold cream']],state.category,'category')}<div class="sk-rail" aria-label="Featured treats">${list.map((p,i)=>skCard(p,{active:i===0,tag:p.category.toLowerCase()})).join('')}</div>${skPointsCard()}<button class="sk-link-row" data-action="screen" data-screen="claim">${icon('receipt')}<span>Missed a scan? Claim a receipt</span>${icon('arrow')}</button>`;
      }
      break;
    case 'scan':
      body = `${skHeader('Your club card','home',`<button class="sk-icon" data-action="screen" data-screen="claim" aria-label="Claim a receipt">${icon('receipt')}</button>`)}<div class="sk-qr">${qr()}<span>scan at the counter</span></div><div class="sk-scan-copy"><p class="hand sk-scan-name">${escapeHtml(firstName())}, you have</p><p class="hand sk-scan-points">${state.points} points</p><small>Member 0000147 · Docee Treat Club</small></div>${sketch('coffee','sk-scan-art')}<div class="sk-ghost-actions"><button data-action="screen" data-screen="rewards">view rewards</button><button data-action="screen" data-screen="claim">claim a receipt</button></div>`;
      break;
    case 'rewards':
      body = `${skHeader('Rewards','home')}<div class="sk-headline compact"><h1><span>Turn your points</span><span class="indent">into a little</span><em class="hand">treat.</em></h1></div>${skPointsCard()}${state.voucher?`<button class="sk-link-row is-blue" data-action="screen" data-screen="redeem">${icon('gift')}<span>Your saved reward is ready</span>${icon('arrow')}</button>`:''}<h2 class="sk-section hand">ready to redeem</h2><div class="sk-rail">${rewards.map(r=>{const saved=state.voucher?.rewardId===r.id;const available=state.points>=r.cost;return skCard(r,{action:'reward',active:available&&!saved&&r.id===rewards.find(x=>x.cost<=state.points)?.id,tag:saved?'saved':`${r.cost} pts`});}).join('')}</div><p class="sk-fine">1 point for every $1. Rewards are concept data for review.</p>`;
      break;
    case 'reward-detail': {
      const available = state.points>=reward.cost;
      body = `${skHeader('Reward','rewards')}<div class="sk-hero">${sketch(reward.art,'sk-hero-art',reward.name)}<span class="sk-tag hand">${reward.cost} pts</span></div><div class="sk-title-pair"><span>${escapeHtml(reward.lead)}</span><em class="hand">${escapeHtml(reward.script)}</em><p>${escapeHtml(reward.subtitle)}</p></div><section class="reference-redemption" aria-label="Points after redemption"><div><span>Your points</span><strong>${state.points}</strong></div><div><span>${available?'This reward':'Points needed'}</span><strong>${available?'−'+reward.cost:reward.cost-state.points}</strong></div><div><span>${available?'Your new balance':'Reward cost'}</span><strong>${available?state.points-reward.cost:reward.cost}</strong></div></section><p class="reference-reward-help">Save this reward, then show it to our team in store.</p>${available?button('REDEEM · '+reward.cost+' POINTS','redeem-reward'):button((reward.cost-state.points)+' MORE POINTS TO GO','no-op','primary disabled','disabled')}<button class="text-button" data-action="screen" data-screen="rewards">Back to rewards</button>`;
      break;
    }
    case 'redeem': {
      const voucher = state.voucher || (gallery ? {rewardId:'credit',code:'DCE · 8K2M4P'} : null);
      const savedReward = voucher ? rewards.find(r=>r.id===voucher.rewardId) : rewards[0];
      const revealed = Boolean(voucher && state.rewardRevealed && !gallery);
      body = `${skHeader(voucher?'Your reward':'Rewards','rewards')}<div class="sk-redeem" id="saved-reward-card" aria-live="polite">${revealed?`<div class="sk-qr">${qr()}<span>scan at the counter</span></div><p class="sk-code">${escapeHtml(voucher.code)}</p>`:sketch(voucher?savedReward.art:'gift','sk-redeem-art')}</div><div class="sk-scan-copy"><p class="hand sk-scan-points">${voucher?`${escapeHtml(savedReward.lead)} ${escapeHtml(savedReward.script.toLowerCase())}`:'Your next treat'}</p><p class="hand sk-scan-name">${voucher?'just for you':'is waiting'}</p><small>${voucher?(revealed?'Show this code to our team in store.':'Reveal it at the counter when you’re ready.'):'Find your next favourite.'}</small></div><div class="sk-ghost-actions stack">${voucher?`<button class="is-solid" data-action="reveal-reward" aria-expanded="${revealed}" aria-controls="saved-reward-card">${revealed?'hide reward':'reveal reward'}</button>`:`<button class="is-solid" data-action="screen" data-screen="rewards">explore rewards</button>`}<button data-action="screen" data-screen="scan">${icon('scan')} view club card</button><button data-action="save-reward-later">${voucher?'save for later':'back to home'}</button></div>`;
      break;
    }
    case 'claim':
      body = `${skHeader('Claim a receipt','home')}${skHeadline(['Missed a','scan?'],'receipt')}${state.claimed?`<div class="sk-claim-success"><p class="hand sk-claim-plus">+18 points</p><p>All caught up. They’ve been added to your membership.</p><span class="sk-claim-balance">${icon('check')} ${state.points} points now</span></div>${button('See my activity','screen','primary','data-screen="activity"')}`:`<p class="sk-sub">Add your receipt and collect the points from your visit.</p><form data-form="claim" class="form sk-form">${skField('receipt number','<input name="receipt" placeholder="e.g. DCE-1048" autocomplete="off" required/>')}${skField('receipt total','<div class="amount-field"><span>AUD $</span><input name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="18.50" required/></div>')}${inlineError()}${button('Find my points '+icon('arrow'),'submit','primary','type="submit"')}</form><div class="sk-note">${icon('receipt')}<p>Your receipt number is on your Docee receipt. Each receipt can be claimed once.</p></div>`}`;
      break;
    case 'activity': {
      const entries = state.history.filter(h=>state.historyFilter==='All'||h.type===state.historyFilter.toLowerCase());
      const lines = state.historyFilter==='Earned'?['Every little','point you’ve','earned.']:state.historyFilter==='Redeemed'?['Every little','treat you’ve','redeemed.']:['Your points,','every little','moment.'];
      const filterName = state.historyFilter==='Earned'?'points earned':state.historyFilter==='Redeemed'?'rewards redeemed':'all activity';
      const emptyWhat = state.historyFilter==='Redeemed'?'redeemed rewards':state.historyFilter==='Earned'?'earned points':'activity';
      body = `${skHeader('Activity','account')}${skHeadline(lines,'')}<div class="sk-filter-row"><button class="sk-pill" data-action="sheet" data-sheet="activity-filter" aria-label="Filter activity"><span>${filterName}</span>${icon('back','sk-chev')}</button><span class="sk-balance hand">${state.points} pts</span></div>${entries.length?`<div class="sk-ledger">${entries.map(h=>`<button class="sk-ledger-row" data-action="activity-detail" data-activity="${h.id}" aria-label="View details for ${escapeHtml(h.title)} on ${escapeHtml(h.date)}"><span class="sk-ledger-copy"><small>${escapeHtml(activityDate(h.date))}</small><strong>${escapeHtml(h.title.replace(/^A visit to /,''))}</strong><small>${escapeHtml(h.caption)}</small></span><span class="sk-ledger-pts hand ${h.points<0?'is-minus':''}">${h.points>0?'+':'−'}${Math.abs(h.points)}</span></button>`).join('')}</div>`:`<div class="sk-empty">${sketch('gift','sk-empty-art')}<h2 class="hand">No ${emptyWhat} yet</h2><p>Your ${state.historyFilter==='Redeemed'?'redeemed rewards':'visits and points'} will appear here.</p>${button('VIEW REWARDS','screen','primary','data-screen="rewards"')}</div>`}`;
      break;
    }

    case 'discover': {
      const all = state.category==='All';
      const counts = {All:products.length};products.forEach(p=>counts[p.category]=(counts[p.category]||0)+1);
      const shown = all ? products : products.filter(p=>p.category===state.category);
      body = `${skHeader(`<button class="sk-store-switch" data-action="screen" data-screen="stores">${escapeHtml(store.name)} ${icon('back','sk-chev')}</button>`,'home',`<button class="sk-icon" data-action="screen" data-screen="stores" aria-label="Find a store">${icon('pin')}</button>`)}<div class="sk-promos" aria-label="What's on">${[['acai','A little indulgence,','every day','make time for a treat'],['matcha','Your next daily','ritual','meet your matcha'],['cold-cream','Cool, creamy &amp;','worth it','sweet on you']].map(([id,a,b,c],i)=>`<button class="sk-promo ${i?'is-outline':''}" data-action="product" data-product="${id}"><span class="sk-promo-copy"><span>${a}</span><em class="hand">${b}</em></span>${sketch(products.find(p=>p.id===id).art,'sk-promo-art')}<span class="sk-promo-cta">${c} ${icon('arrow')}</span></button>`).join('')}</div><h1 class="sk-season hand">Summer 2026</h1><div class="sk-menu-filter"><button class="sk-showall ${all?'is-on':''}" data-action="category" data-category="All" aria-pressed="${all}">show all</button>${skList([['Açaí','açaí'],['Smoothies','smoothies'],['Matcha','matcha'],['Cold cream','cold cream']],state.category,'category',counts)}</div><div class="sk-tiles">${shown.map(skTile).join('')}</div><p class="sk-fine">${escapeHtml(store.full)}</p>`;
      break;
    }
    case 'product':
      body = `${skHeader('The menu','discover')}<div class="sk-hero">${sketch(product.art,'sk-hero-art',product.name)}<span class="sk-tag hand">${escapeHtml(product.category.toLowerCase())}</span></div><div class="product-detail-copy sk-title-pair"><span>${escapeHtml(product.lead)}</span><em class="hand">${escapeHtml(product.script)}</em><p class="product-story">${product.description}</p><div class="product-info-line"><span>Made at Docee</span><span>${product.category}</span></div><p class="product-detail-note">${product.detail}</p>${button('Find a store '+icon('pin'),'screen','primary','data-screen="stores"')}<p class="field-note">Menu and options can vary by store.</p></div>`;
      break;
    case 'stores':
      body = `<div class="location-map" role="group" aria-label="Adelaide area map"><div class="store-map-viewport"><iframe class="store-map-frame" title="OpenStreetMap of the Adelaide area" src="https://www.openstreetmap.org/export/embed.html?bbox=138.515%2C-34.942%2C138.675%2C-34.862&amp;layer=mapnik" loading="eager" referrerpolicy="no-referrer"></iframe></div><a class="store-map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap contributors</a><button class="icon-button map-back" data-action="screen" data-screen="discover" aria-label="Back to menu">${icon('close')}</button></div><div class="stores-sheet sk-stores-sheet"><div class="sk-stores-head"><div><p class="sk-sub">find your nearest docee</p><h1 class="hand">Adelaide</h1></div>${sketch('pin','sk-stores-art')}</div><h2 class="sk-section hand">our locations</h2><div class="stores-list sk-stores-list">${stores.map(s=>{const on=s.id===state.storeId;return `<button class="sk-store ${on?'is-active':''}" data-action="select-store" data-store="${s.id}" aria-label="Select ${s.name} location" aria-pressed="${on}"><img class="sk-store-thumb" src="${assets}${s.id==='findon'?'docee-storefront.png':'docee-mascot-line.png'}" alt=""/><span class="sk-store-copy"><strong>${s.name}</strong><small>${s.address}</small><small>${s.city}</small></span><span class="sk-store-select hand">${on?'your store':'select'}</span></button>`;}).join('')}</div><p class="sk-fine">Tap a location to open its menu.</p></div>`;
      break;
    case 'account':
      body = `${skHeader('Account','home')}<div class="sk-account-head"><button class="sk-account-avatar" data-action="screen" data-screen="profile" aria-label="Edit profile"><img src="${assets}docee-mascot-line.png" alt=""/></button><div class="sk-account-copy"><h1 class="hand">${escapeHtml(state.name)}</h1><p>${state.points} points · Docee Treat Club</p></div><span class="sk-account-tag hand">edit</span></div><section class="account-section"><h2>membership</h2><div class="account-links account-group">${arrowRow('Your profile','','screen','data-screen="profile"')}${arrowRow('Your club card','','screen','data-screen="scan"')}${arrowRow('Your saved reward',state.voucher?getSavedRewardName():'','screen','data-screen="redeem"')}${arrowRow('Your activity','','screen','data-screen="activity"')}${arrowRow('Claim a receipt','','screen','data-screen="claim"')}</div></section><section class="account-section settings-section"><h2>settings</h2><div class="account-group"><label class="toggle-row"><span><strong>Reward reminders</strong></span><input type="checkbox" data-setting="notifications" ${state.notifications?'checked':''} aria-label="Reward reminders"/><span class="toggle-ui" aria-hidden="true"></span></label><label class="toggle-row"><span><strong>Docee news & offers</strong></span><input type="checkbox" data-setting="marketing" ${state.marketing?'checked':''} aria-label="Docee news and offers"/><span class="toggle-ui" aria-hidden="true"></span></label>${arrowRow('Your location',store.name,'screen','data-screen="stores"')}</div></section><section class="account-section"><h2>support</h2><div class="account-group">${arrowRow('Help & support','','sheet','data-sheet="help"')}${arrowRow('Club terms','','sheet','data-sheet="terms"')}${arrowRow('Privacy','','sheet','data-sheet="privacy"')}${arrowRow('Request account deletion','','sheet','data-sheet="delete"')}</div></section>${button('LOG OUT','signout','secondary signout')}<p class="legal-note">Docee Treat Club · Member 0000147</p>`;
      break;
    default: return renderScreen('home',gallery);
  }
  const tone = ['welcome','scan','redeem'].includes(screen)?'sk-blue':screen==='discover'?'sk-dark':'sk-cream';
  return `<div class="mobile-app sk ${tone} screen-${screen} ${gallery?'gallery-mobile':''}"><div class="status-bar" aria-hidden="true"><span>9:41</span><div><svg viewBox="0 0 24 16" fill="currentColor"><rect x="1" y="11" width="3" height="4" rx="1"/><rect x="6" y="8" width="3" height="7" rx="1"/><rect x="11" y="4" width="3" height="11" rx="1"/><rect x="16" y="1" width="3" height="14" rx="1"/></svg><svg viewBox="0 0 20 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 5a14 14 0 0 1 18 0M4 8a9 9 0 0 1 12 0m-9 3a4 4 0 0 1 6 0"/><circle cx="10" cy="14" r="1" fill="currentColor" stroke="none"/></svg><span class="battery"></span></div></div><div class="app-scroll">${body}</div>${nav(screen)}<div class="home-indicator" aria-hidden="true"></div>${!gallery&&state.toast?`<div class="toast" role="status">${icon('check')}${escapeHtml(state.toast)}</div>`:''}</div>`;
}
function getSavedRewardName() { return rewards.find(r=>r.id===state.voucher?.rewardId)?.name || 'Your next little treat'; }

function activityDate(value) {
  const months={Jan:'January',Feb:'February',Mar:'March',Apr:'April',May:'May',Jun:'June',Jul:'July',Aug:'August',Sep:'September',Oct:'October',Nov:'November',Dec:'December'};
  const match=value.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  return match?`${months[match[2]]||match[2]} ${match[1]}, ${match[3]}`:value;
}
function renderSheet(){
  const activity=state.history.find(entry=>entry.id===state.activityId);

  const content={
    'activity-filter':['Show activity', '<div class="ledger-filter-options">'+['All','Earned','Redeemed'].map(filter=>button(filter==='All'?'ALL ACTIVITY':filter==='Earned'?'POINTS EARNED':'REWARDS REDEEMED','history-filter',state.historyFilter===filter?'primary':'secondary',`data-filter="${filter}" aria-pressed="${state.historyFilter===filter}"`)).join('')+'</div>'],
    'activity-detail':['Activity details',activity?`<p class="ledger-detail-date">${escapeHtml(activityDate(activity.date))}</p><div class="ledger-detail-card"><span>${activity.type==='redeemed'?'REWARD':'VISIT DETAILS'}</span><h3>${escapeHtml(activity.title.replace(/^A visit to /,''))}</h3><p>${escapeHtml(activity.caption)}</p><div><span>${activity.type==='redeemed'?'Points used':'Points earned'}</span><strong>${activity.points>0?'+':''}${activity.points}</strong></div></div>${button('DONE','close-sheet','primary')}`:'<p>This activity could not be found.</p>'],
    help:['A little help?', '<p>Our team can help with your membership, receipts, and rewards.</p><p>Drop into Findon Fair or Firle Plaza and bring your membership or receipt.</p>'+button('Find your Docee','screen','primary','data-screen="stores"')],
    terms:['Your club terms','<p>Collect points with eligible visits. Turn them into little treats and show saved rewards to our team.</p><p>Ask in store about eligible purchases and the conditions that apply to an offer.</p><p class="sheet-footnote">Illustrative club information for concept review. Final terms must be approved before launch.</p>'],
    privacy:['Your privacy','<p>Your membership details help us recognise you and personalise your visits.</p><p>You control news and offers in your account preferences. Speak with our team about your membership information.</p><p class="sheet-footnote">Illustrative privacy information for concept review. A complete privacy notice is required before launch.</p>'],
    delete:['Close your membership?','<p>Closing a membership would remove your personal details and unused points. We would confirm your request before processing it.</p>'+button('Preview deletion request','request-delete','danger')+'<p class="sheet-footnote">This demo does not send a request or delete an account.</p>'],
    'delete-complete':['Request previewed.','<p>Your account is unchanged and no request has been sent.</p><p>A live app would verify your identity, record your request, and explain what happens next.</p>'+button('Back to my account','close-sheet')],
  }[state.sheet];
  if(!content)return '';
  return `<div class="sheet-scrim"><section class="app-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><button class="icon-button sheet-close" data-action="close-sheet" aria-label="Close">${icon('close')}</button><h2 id="sheet-title">${content[0]}</h2>${content[1]}</section></div>`;
}

function renderSidebar() {
  let currentGroup = '';
  return `<aside class="screen-sidebar"><div class="sidebar-heading"><span>THE APP</span><span>${screens.length} screens</span></div><div class="screen-list">${screens.map((s,index)=>{
    let group = s.group!==currentGroup?`<p class="screen-group">${s.group}</p>`:'';currentGroup=s.group;
    return `${group}<button class="screen-link ${s.id===state.screen?'selected':''}" data-action="screen" data-screen="${s.id}"><span class="screen-index">${String(index+1).padStart(2,'0')}</span><span>${s.name}</span>${s.id===state.screen?'<span class="selected-dot"></span>':''}</button>`;
  }).join('')}</div><button class="reset-button" data-action="reset">${icon('clock')} Reset demo</button></aside>`;
}
function notes() {
  const current = screens.find(s=>s.id===state.screen)||screens[4];
  return `<aside class="screen-notes"><span class="overline">SCREEN ${String(screens.indexOf(current)+1).padStart(2,'0')} / ${screens.length}</span><h2>${current.name}</h2><p>${current.detail}</p><div class="note-divider"></div><span class="overline">TRY IT</span><p>${current.behavior}</p>${['signin','verify','profile'].includes(state.screen)?'<div class="demo-hint"><strong>Signup demo</strong><span>Use any full name and a valid email.<br/>Australian mobile: 0412 345 678<br/>Tick the terms checkbox to enable Sign up.<br/>Verification code: <b>123456</b><br/>Terms and privacy sheets are illustrative. Details stay in browser memory only.</span></div>':''}${state.screen==='claim'?'<div class="demo-hint"><strong>Receipt demo</strong><span>Receipt: <b>DCE-1048</b><br/>Total: <b>18.50</b><br/>Adds 18 points once.</span></div>':''}<div class="note-divider"></div><span class="overline">CONCEPT SETTINGS</span><div class="economy-note"><p>Proposed loyalty economy</p><span>$1 spent → 1 point</span><span>100 points → $5 credit</span><span>120 points → a coffee</span><span>250 points → an açaí bowl</span></div><p class="note-small">Illustrative balances, rewards, products, and membership data. Business rules, reward terms, privacy, and live integrations need approval before launch.</p><div class="local-pill"><span></span> Browser memory only</div></aside>`;
}
function renderGallery() {
  const galleryScreens = ['welcome','home','activity','redeem','stores','discover','scan','rewards','signin','verify','profile','reward-detail','claim','product','account'].map(id=>screens.find(screen=>screen.id===id));
  return `<section class="gallery-view"><div class="gallery-heading"><div><span class="overline">THE FULL JOURNEY</span><h1>Your Docee.<br/>The whole journey.</h1></div><p>${screens.length} connected screens.<br/>Choose one to try the flow.</p></div><div class="screen-gallery">${galleryScreens.map(s=>`<article class="gallery-card"><div class="gallery-open" role="button" tabindex="0" data-action="screen" data-screen="${s.id}" aria-label="Preview ${s.name}"><div class="gallery-phone" inert>${renderScreen(s.id,true)}</div><div class="gallery-label"><span>${String(screens.indexOf(s)+1).padStart(2,'0')} ${s.name}</span>${icon('arrow')}</div></div></article>`).join('')}</div></section>`;
}
function renderLoyaltyGallery() {
  const reviewScreens = ['scan','rewards','reward-detail','redeem','activity'].map(id=>screens.find(screen=>screen.id===id));
  return `<section class="gallery-view loyalty-gallery"><div class="gallery-heading"><div><span class="overline">THE TREAT CLUB</span><h1>Your membership.<br/>Your rewards.</h1></div><p>Your club card, rewards and every visit.<br/>Choose a screen to try it.</p></div><div class="screen-gallery">${reviewScreens.map(s=>`<article class="gallery-card"><div class="gallery-open" role="button" tabindex="0" data-action="screen" data-screen="${s.id}" aria-label="Preview ${s.name}"><div class="gallery-phone" inert>${renderScreen(s.id,true)}</div><div class="gallery-label"><span>${s.name}</span>${icon('arrow')}</div></div></article>`).join('')}</div></section>`;
}
function renderResearch() {
  return `<section class="research-view"><div class="research-hero"><div><span class="overline">BRAND & PRODUCT DIRECTION</span><h1>A little treat.<br/><em>A reason to return.</em></h1><p>A loyalty concept built around Docee’s playful identity, editorial product artwork, and a clear path from visit to reward.</p></div><div class="research-logo-card">${logo()}<span>DOCEE · BRAND REFERENCE</span></div></div><div class="research-grid"><article class="research-card"><span class="overline">01 / DOCEE</span><h2>Small rituals.<br/>Big personality.</h2><p>The berry mascot makes the brand recognisable. Warm biscuit beige, cream cards, authentic logo blue, clear sans serif type, and cohesive café imagery carry that character into the app.</p><div class="brand-swatches"><span style="background:#0000fb"><b>Logo blue</b><small>#0000FB</small></span><span style="background:#eadcca;color:#493b29"><b>Biscuit beige</b><small>#EADCCA</small></span><span style="background:#f7f1e5;color:#493b29"><b>Surface cream</b><small>#F7F1E5</small></span></div><a class="research-link" href="docs/docee-branding.md" target="_blank">Brand and source notes ${icon('external')}</a></article><article class="research-card competitor-card"><span class="overline">02 / COMPETITOR REFERENCE</span><div class="competitor-logo"><img src="${assets}yochi-logo.svg" alt="Yo-Chi logo"/></div><h2>Make the regular’s<br/>journey effortless.</h2><p>Yo-Chi’s current app listing describes Home, Account, Offers, and More, with receipt claims and transaction history supporting the loyalty journey.</p><ul><li>Membership and value are easy to find.</li><li>Missed scans have a receipt recovery route.</li><li>History helps members understand their points.</li></ul><p class="research-caption">Docee uses its own brand and product language; Yo-Chi appears here as a research reference only.</p><a class="research-link" href="docs/yochi-research.md" target="_blank">Competitor research & sources ${icon('external')}</a></article><article class="research-card"><span class="overline">03 / THE Membership</span><h2>Every visit,<br/>a little closer.</h2><div class="research-economy"><div><strong>1</strong><span>point per $1 spent</span></div><div><strong>100</strong><span>points for $5 credit</span></div><div><strong>120</strong><span>points for a coffee</span></div><div><strong>250</strong><span>points for an açaí bowl</span></div></div><p class="research-caption">Proposed economy for this prototype. Starting balance: 180 points. Values, eligible spend, expiry, and reward terms must be confirmed by Docee.</p></article><article class="research-card"><span class="overline">04 / FROM CONCEPT TO PRODUCT</span><h2>Ready to review.<br/>Ready to refine.</h2><ul class="research-checks"><li>${icon('check')} Mobile signup and profile</li><li>${icon('check')} Membership and rewards</li><li>${icon('check')} Receipt claim and activity</li><li>${icon('check')} Menu, locations, and preferences</li></ul><p>The prototype keeps state in browser memory. Authentication, transactional reward handling, receipt verification, member codes, and store fulfilment need production services.</p><p class="research-caption">Product descriptions are concept copy. Opening hours, menu details, prices, allergens, privacy, and club terms remain to be confirmed.</p></article></div></section>`;
}

function render(preserveScroll = false) {
  const previousScrollTop = preserveScroll ? document.querySelector('.phone-frame .app-scroll')?.scrollTop || 0 : 0;
  document.getElementById('app').innerHTML = `<header class="review-header"><button class="review-identity" data-action="screen" data-screen="home" aria-label="Docee loyalty home"><span class="review-mark">d.</span><span><strong>Docee Loyalty</strong><small>APP CONCEPT</small></span></button><nav class="review-tabs" aria-label="Prototype views">${[['preview','Preview'],['gallery','All screens'],['loyalty','Loyalty screens'],['research','Brand & research']].map(([id,name])=>`<button data-action="view" data-view="${id}" class="${state.view===id?'active':''}" ${state.view===id?'aria-current="page"':''}>${name}</button>`).join('')}</nav><span class="prototype-badge"><span></span> Prototype · demo data</span></header>${state.view==='preview'?`<main class="preview-layout">${renderSidebar()}<section class="phone-stage" aria-label="${screens.find(s=>s.id===state.screen)?.name} app preview"><div class="stage-caption"><span>DOCEE / MOBILE APP</span><span>390 × 844</span></div><div class="phone-frame">${renderScreen(state.screen)}</div><p class="stage-footnote">DOCEE / THE TREAT CLUB</p></section>${notes()}</main>`:state.view==='gallery'?renderGallery():state.view==='loyalty'?renderLoyaltyGallery():renderResearch()}<footer class="review-footer"><span>DOCEE · LOYALTY CONCEPT</span><span>Local prototype / October 2026</span></footer>`;
  scaleGallery();
  if(preserveScroll){
    const content = document.querySelector('.phone-frame .app-scroll');
    if(content)content.scrollTop=previousScrollTop;
  }
  if(state.sheet&&state.view==='preview')document.querySelector('.phone-frame .mobile-app').insertAdjacentHTML('beforeend',renderSheet());
}
function closeSheet(){
  const closedSheet = state.sheet;
  state.sheet=null;
  render(true);
  const selector = closedSheet==='activity-detail' ? `[data-action="activity-detail"][data-activity="${CSS.escape(state.activityId || '')}"]` : `[data-action="sheet"][data-sheet="${CSS.escape(closedSheet || '')}"]`;
  document.querySelector(`.phone-frame ${selector}`)?.focus({preventScroll:true});
}
function scaleGallery(){
  const mobilePreview = mobileViewport.matches && !reviewRequested && state.view==='preview';
  document.body.classList.toggle('mobile-app-mode',mobilePreview);
  if(mobilePreview){
    const viewport = window.visualViewport;
    if(!viewport || Math.abs(viewport.scale-1)<.01){
      document.documentElement.style.setProperty('--app-height',`${Math.round(viewport?.height || window.innerHeight)}px`);
    }
  }else{
    document.documentElement.style.removeProperty('--app-height');
  }
  document.querySelectorAll('.phone-frame').forEach(phone=>{
    const app=phone.querySelector(':scope > .mobile-app');
    if(!app)return;
    if(mobilePreview){
      app.style.removeProperty('transform');
      app.style.removeProperty('transform-origin');
      phone.style.removeProperty('height');
      return;
    }
    const scale=phone.getBoundingClientRect().width/390;
    app.style.transformOrigin='top left';
    app.style.transform=`scale(${scale})`;
    phone.style.height=`${844*scale}px`;
  });
  document.querySelectorAll('.gallery-phone').forEach(phone=>{
    const style=getComputedStyle(phone);
    const paddingX=parseFloat(style.paddingLeft)+parseFloat(style.paddingRight);
    const paddingY=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
    const borders=parseFloat(style.borderTopWidth)+parseFloat(style.borderBottomWidth);
    const scale=(phone.clientWidth-paddingX)/390;
    phone.querySelector('.gallery-mobile').style.transform=`scale(${scale})`;
    phone.style.height=`${844*scale+paddingY+borders}px`;
  });
}
let layoutFrame;
function queueLayout(){
  cancelAnimationFrame(layoutFrame);
  layoutFrame=requestAnimationFrame(scaleGallery);
}
window.addEventListener('resize',queueLayout);
window.visualViewport?.addEventListener('resize',queueLayout);
mobileViewport.addEventListener('change',queueLayout);
window.addEventListener('popstate',()=>go(screenFromUrl(),false));
document.addEventListener('keydown',event=>{
  if(state.sheet){
    if(event.key==='Escape'){closeSheet();return;}
    if(event.key==='Tab'){
      const focusable=[...document.querySelectorAll('.app-sheet button,.app-sheet a')];
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
  }
  if((event.key==='Enter'||event.key===' ')&&event.target.matches('.gallery-open')){
    event.preventDefault();go(event.target.dataset.screen);
  }
});
function go(screen,updateUrl = true) {
  if(!screens.some(item=>item.id===screen))return;
  clearTimeout(toastTimer);
  if(updateUrl && window.location.hash!==`#${screen}`)window.history.pushState(null,'',`#${screen}`);
  if(state.screen==='welcome'&&screen==='signin')state.signedIn=false;
  state.screen=screen;state.view='preview';state.error='';state.toast='';state.sheet=null;state.rewardRevealed=false;render();
}
function showToast(message) {
  state.toast=message;
  const app=document.querySelector('.phone-frame .mobile-app');
  if(!app)return;
  app.querySelector('.toast')?.remove();
  const toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');
  toast.innerHTML=icon('check')+escapeHtml(message);app.append(toast);
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>{state.toast='';document.querySelectorAll('.toast').forEach(node=>node.remove());},3500);
}
document.addEventListener('click',event=>{
  const target=event.target.closest('[data-action]');if(!target)return;
  // Gallery cards open their outer preview; static inner previews do not trigger transactions.
  const galleryOuter=target.closest('.gallery-open');
  if(galleryOuter){go(galleryOuter.dataset.screen);return;}
  const action=target.dataset.action;
  if(action==='submit'||action==='no-op')return;
  event.preventDefault();
  switch(action){
    case 'screen':go(target.dataset.screen);break;
    case 'signup':state.authMode='signup';state.signedIn=false;go('signin');break;
    case 'signin-mode':state.authMode='signin';state.signedIn=false;go('signin');break;
    case 'view':state.view=target.dataset.view;state.error='';render();window.scrollTo({top:0,behavior:'instant'});break;
    case 'reward':state.rewardId=target.dataset.reward;go('reward-detail');break;
    case 'product':state.productId=target.dataset.product;go('product');break;
    case 'select-store':state.storeId=target.dataset.store;go('discover');break;
    case 'category':state.category=target.dataset.category;render();break;
    case 'history-filter':state.historyFilter=target.dataset.filter;state.sheet=null;render();document.querySelector('[aria-label="Filter activity"]')?.focus();break;
    case 'activity-detail':state.activityId=target.dataset.activity;state.sheet='activity-detail';render(true);document.querySelector('.sheet-close')?.focus();break;
    case 'reveal-reward':
      if(state.screen==='redeem'&&state.voucher){state.rewardRevealed=!state.rewardRevealed;render();document.querySelector('[data-action="reveal-reward"]')?.focus();}
      break;
    case 'save-reward-later':go('home');if(state.voucher)showToast('Your reward is saved. Find it in Rewards any time.');break;
    case 'redeem-reward':{
      if(state.screen!=='reward-detail')break;
      const selected=getReward();if(state.points<selected.cost){state.error='Keep collecting points to unlock this treat.';render();break;}
      if(state.voucher){showToast('You already have a reward ready. Show it in store first.');break;}
      state.points-=selected.cost;
      state.voucher={rewardId:selected.id,code:'DCE · 8K2M4P'};
      state.history.unshift({id:'redeem-1',type:'redeemed',title:selected.name,date:'7 Oct 2026',points:-selected.cost,caption:'Reward saved to your membership'});
      go('redeem');break;
    }
    case 'resend':showToast('Demo code ready: 123456');break;
    case 'signout':state.signedIn=false;go('welcome');break;
    case 'sheet':state.sheet=target.dataset.sheet;render(true);document.querySelector('.sheet-close')?.focus();break;
    case 'close-sheet':closeSheet();break;
    case 'request-delete':state.sheet='delete-complete';render(true);document.querySelector('.sheet-close')?.focus();break;
    case 'reset':clearTimeout(toastTimer);state=initialState();window.history.replaceState(null,'','#home');render();break;
  }
});
document.addEventListener('submit',event=>{
  const form=event.target.closest('[data-form]');if(!form)return;event.preventDefault();
  const data=new FormData(form);state.error='';
  switch(form.dataset.form){
    case 'signin':{
      captureAuthDraft(form);
      const draft=state.authDraft,phone=normalisePhone(draft.phone);
      if(state.authMode==='signup'){
        if(draft.name.trim().length<2){state.error='Enter your full name.';render();return;}
        if(!validEmail(draft.email)){state.error='Enter a valid email address.';render();return;}
        if(draft.birthday&&draft.birthday>'2026-10-07'){state.error='Your birthday must be today or earlier.';render();return;}
        if(!draft.consent){state.error='Agree to the terms and privacy policy to continue.';render();return;}
      }
      if(!validMobile(phone)){state.error='Enter an Australian mobile number, e.g. 0412 345 678.';render();return;}
      if(state.authMode==='signup'){
        state.name=draft.name.trim();state.email=draft.email.trim();state.birthday=draft.birthday;
      }
      state.signedIn=false;state.phone=phone.slice(0,4)+' '+phone.slice(4,7)+' '+phone.slice(7);go('verify');break;
    }
    case 'verify':
      if(data.get('code')!=='123456'){state.error='That code doesn’t match. Try the demo code 123456.';render();return;}
      go('profile');break;
    case 'profile':{
      const name=String(data.get('name')).trim();
      if(!name){state.error='Add your name so we can say hello.';render();return;}
      const destination=state.signedIn?'account':'home';
      state.name=name;state.email=String(data.get('email')||'').trim();state.birthday=String(data.get('birthday'));state.marketing=data.has('marketing');state.signedIn=true;go(destination);break;
    }
    case 'claim':{
      if(state.claimed){showToast('This receipt has already been claimed.');return;}
      if(String(data.get('receipt')).trim().toUpperCase()!=='DCE-1048'||Math.abs(Number(data.get('amount'))-18.5)>.001){state.error='For this demo, use receipt DCE-1048 with a total of $18.50.';render();return;}
      state.points+=18;state.claimed=true;
      state.history.unshift({id:'receipt-demo',type:'earned',title:'Receipt points claimed',date:'7 Oct 2026',points:18,caption:'Receipt DCE-1048 · Findon Fair'});render();break;
    }
  }
});
function captureAuthDraft(form) {
  const data=new FormData(form);
  for(const key of ['name','email','phone','birthday']){
    if(data.has(key))state.authDraft[key]=String(data.get(key));
  }
  if(state.authMode==='signup')state.authDraft.consent=data.has('consent');
}
function updateAuthDraft(event) {
  const form=event.target.closest('[data-form="signin"]');
  if(!form)return;
  captureAuthDraft(form);
  form.querySelector('.birthday-field')?.classList.toggle('has-value', Boolean(state.authDraft.birthday));
  const submit=form.querySelector('button[type="submit"]');
  if(submit)submit.disabled=state.authMode==='signup'&&!validSignup(state.authDraft);
}
document.addEventListener('input',updateAuthDraft);
document.addEventListener('change',event=>{
  updateAuthDraft(event);
  if(event.target.dataset.setting){state[event.target.dataset.setting]=event.target.checked;}
});
render();
