'use strict';

/* Hand-drawn line illustrations for the sketch theme. Each drawing inherits
   colour from currentColor so the same art works white-on-blue or blue-on-cream.
   Every mark is a stroked primitive (no fills, no dasharray) so it can be drawn on
   with stroke-dashoffset. Outer contours are 3-3.2, details 1.5-2.4. */
const sketchArt = {
  acai: `
    <path d="M18 92c3 30 25 50 62 50s59-20 62-50" stroke-width="3.2"/>
    <path d="M18 92c14-9 110-9 124 0" stroke-width="3.2"/>
    <path d="M62 141l-3 8h42l-3-8" stroke-width="2.4"/>
    <path d="M22 90c-8-18 0-32 16-32 2-18 22-28 36-14 8-14 34-10 40 6 18-2 28 12 20 26 6 3 8 8 6 14" stroke-width="3"/>
    <circle cx="86" cy="38" r="5.5" stroke-width="2"/><path d="M70 50l4-3M98 44l3 3M60 40l-2-4M110 52l4 1" stroke-width="2"/>
    <path d="M28 104c4 11 10 19 18 25" stroke-width="1.6"/>
    <path d="M118 108c-4 9-10 17-18 23M128 102c-3 8-7 14-13 19M135 98c-2 5-4 8-8 12" stroke-width="1.6"/>
    <ellipse cx="42" cy="72" rx="12" ry="9" transform="rotate(-18 42 72)" stroke-width="2.4"/>
    <circle cx="42" cy="72" r="3" stroke-width="1.6"/>
    <ellipse cx="64" cy="58" rx="11" ry="8.5" transform="rotate(12 64 58)" stroke-width="2.4"/>
    <circle cx="64" cy="58" r="2.6" stroke-width="1.6"/>
    <path d="M92 56c0-8 22-8 24 0 0 11-8 20-12 24-5-3-12-13-12-24Z" stroke-width="2.4"/>
    <path d="M94 56l6-6 4 4 5-5 5 6" stroke-width="1.8"/>
    <path d="M99 64v3M107 64v3M103 71v3M110 70v3" stroke-width="1.5"/>
    <path d="M30 80c8-7 12 3 20-2s13 4 21-2 13 4 21-2 13 4 21-2 12 3 18-1" stroke-width="1.8"/>
    <path d="M78 74l4-2M118 64l3 2M36 54l2-3M82 40l3-3M124 80l3-1M56 78l3 1" stroke-width="2"/>
    <path d="M122 74l24-44" stroke-width="2.6"/>
    <path d="M142 32c0-9 9-14 13-10 2 4-3 12-11 15" stroke-width="2.4"/>
    <path d="M150 128l3-6 3 6-6-3h6Z" stroke-width="1.8"/>`,
  smoothie: `
    <path d="M38 66h84" stroke-width="3.2"/>
    <path d="M42 66c0-26 76-26 76 0" stroke-width="3.2"/>
    <path d="M80 42v-6" stroke-width="2"/>
    <path d="M86 44l16-38 8 3-16 38" stroke-width="2.6"/>
    <path d="M91 28l7 3" stroke-width="1.6"/>
    <path d="M47 70l10 76h46l10-76" stroke-width="3.2"/>
    <path d="M50 96c8-7 14 7 22 0s14-7 22 0 14 6 20-1" stroke-width="2.2"/>
    <path d="M54 112c8-5 14 5 20 0s14-5 20 0" stroke-width="1.6"/>
    <circle cx="68" cy="128" r="3.4" stroke-width="1.6"/>
    <circle cx="88" cy="132" r="2.2" stroke-width="1.6"/>
    <circle cx="94" cy="118" r="2.8" stroke-width="1.6"/>
    <circle cx="66" cy="106" r="1.8" stroke-width="1.5"/>
    <path d="M106 78l-7 62M99 80l-5 40M92 80l-4 24" stroke-width="1.6"/>
    <path d="M52 72l1 8" stroke-width="1.6"/>
    <path d="M138 70c4 0 6 3 6 6s-6 8-6 8-6-5-6-8 2-6 6-6Z" stroke-width="1.6"/>
    <path d="M26 44l3-7 3 7-7-3h8Z" stroke-width="1.8"/>`,
  matcha: `
    <ellipse cx="80" cy="36" rx="34" ry="7" stroke-width="3.2"/>
    <path d="M46 36l8 108h52l8-108" stroke-width="3.2"/>
    <path d="M88 40l20-38 7 4-19 38" stroke-width="2.6"/>
    <path d="M52 56c10 5 18-4 28 0s20 4 28-1" stroke-width="2.2"/>
    <path d="M58 52l12-5 5 13-12 5Z" stroke-width="2.2"/>
    <path d="M60 56l5-2" stroke-width="1.4"/>
    <path d="M82 54l13 3-3 13-13-3Z" stroke-width="2.2"/>
    <path d="M70 72l12 4-4 12-12-4Z" stroke-width="2.2"/>
    <path d="M54 98c10-6 16 6 26 0s18-6 28 0" stroke-width="2.4"/>
    <path d="M62 98c0 10 1 14 5 14M84 99c0 7 1 10 4 10M98 98c0 8-1 12-4 14" stroke-width="1.8"/>
    <path d="M58 118c10 5 20-4 30 0 6 3 12 2 18-1" stroke-width="1.6"/>
    <path d="M56 62l2 10M58 80l2 8" stroke-width="1.5"/>
    <path d="M106 108l-4 30M100 112l-2 20" stroke-width="1.6"/>
    <path d="M122 134c0-16 14-26 28-22 0 16-12 28-28 22Z" stroke-width="2.4"/>
    <path d="M126 132c8-4 14-10 20-16" stroke-width="1.6"/>
    <path d="M24 56l3-7 3 7-7-3h8Z" stroke-width="1.8"/>`,
  cream: `
    <ellipse cx="80" cy="112" rx="36" ry="7" stroke-width="2.4"/>
    <path d="M44 114l8 32h56l8-32" stroke-width="3.2"/>
    <path d="M40 106c-12-10-2-26 14-26h52c16 0 26 16 14 26" stroke-width="3.2"/>
    <path d="M52 80c-6-10 0-22 14-22h28c14 0 20 12 14 22" stroke-width="3"/>
    <path d="M64 58c-4-9 2-18 12-18h8c10 0 14 9 10 18" stroke-width="2.8"/>
    <path d="M76 40c0-10 6-16 10-26 7 6 9 16 6 26" stroke-width="2.6"/>
    <path d="M44 94c12 6 24-2 36 2s22 0 34-4" stroke-width="1.8"/>
    <path d="M58 72c10 4 18-2 28 0s14 0 22-3" stroke-width="1.8"/>
    <path d="M54 96v6c0 4 5 4 5 0v-4M96 94v8c0 4 5 4 5 0v-6" stroke-width="1.8"/>
    <path d="M70 72v7c0 3 4 3 4 0v-6" stroke-width="1.6"/>
    <path d="M102 56l22-14 7 9-22 14Z" stroke-width="2.4"/>
    <path d="M116 46l7 9M109 50l6 8" stroke-width="1.4"/>
    <path d="M56 122l4 20M66 122l3 20" stroke-width="1.6"/>
    <path d="M100 122l-3 20" stroke-width="1.6"/>
    <path d="M30 70h.1M36 60h.1M128 82h.1M134 92h.1" stroke-width="3.4"/>
    <path d="M24 38l3-7 3 7-7-3h8Z" stroke-width="1.8"/>`,
  coffee: `
    <path d="M46 44h68l-3-12H49Z" stroke-width="3.2"/>
    <path d="M44 44h72v8H44Z" stroke-width="3.2"/>
    <path d="M70 32c4-6 16-6 20 0" stroke-width="1.8"/>
    <path d="M50 52l10 94h40l10-94" stroke-width="3.2"/>
    <path d="M54 82h52l-3 32H57Z" stroke-width="2.4"/>
    <path d="M80 106c-4-3-11-8-11-14 0-6 8-8 11-2 3-6 11-4 11 2 0 6-7 11-11 14Z" stroke-width="2.2"/>
    <path d="M62 126l3 18M74 128l2 16" stroke-width="1.6"/>
    <path d="M104 122l-3 22M98 124l-2 16" stroke-width="1.6"/>
    <path d="M66 24c-6-5 5-9-1-17M82 22c-6-5 5-9-1-17M98 24c-6-5 5-9-1-17" stroke-width="2"/>
    <ellipse cx="32" cy="134" rx="9" ry="6" transform="rotate(-30 32 134)" stroke-width="2.4"/>
    <path d="M25 139c4-3 10-3 14-9" stroke-width="1.5"/>
    <ellipse cx="130" cy="136" rx="9" ry="6" transform="rotate(25 130 136)" stroke-width="2.4"/>
    <path d="M123 131c6 2 8 4 14 8" stroke-width="1.5"/>
    <path d="M130 70l3-7 3 7-7-3h8Z" stroke-width="1.8"/>`,
  gift: `
    <path d="M26 62h108v24H26Z" stroke-width="3.2"/>
    <path d="M34 86v54h92V86" stroke-width="3.2"/>
    <path d="M72 62v78M88 62v78" stroke-width="2.2"/>
    <path d="M80 60c-20 2-38-8-30-22 8-12 24 2 30 22Z" stroke-width="2.8"/>
    <path d="M80 60c20 2 38-8 30-22-8-12-24 2-30 22Z" stroke-width="2.8"/>
    <path d="M62 48c4-2 8 0 10 4M98 48c-4-2-8 0-10 4" stroke-width="1.5"/>
    <path d="M76 62c-4 6-8 8-14 10M84 62c4 6 8 8 14 10" stroke-width="1.8"/>
    <path d="M104 96l-6 40M112 96l-5 32M120 96l-3 20" stroke-width="1.6"/>
    <path d="M44 74h12M96 74h28" stroke-width="1.4"/>
    <path d="M22 36l3-8 3 8-8-3h10Z" stroke-width="1.8"/>
    <path d="M134 30l3-8 3 8-8-3h10Z" stroke-width="1.8"/>
    <path d="M142 56h.1M18 110h.1" stroke-width="3.4"/>`,
  splash: `<g transform="translate(-14 -14) scale(1.18)">
    <path d="M44 74c0-4 4-6 8-6h56c4 0 8 2 8 6 0 20-14 34-36 34S44 94 44 74Z" stroke-width="3.2"/>
    <path d="M80 108v26" stroke-width="3"/>
    <path d="M54 142c6-8 46-8 52 0" stroke-width="3"/>
    <path d="M48 66c-8-12 0-24 12-22 2-14 22-18 28-6 12-6 26 4 22 18" stroke-width="3"/>
    <path d="M56 62c6 3 12 0 18 2s12 2 18-1" stroke-width="1.8"/>
    <circle cx="82" cy="28" r="9" stroke-width="2.6"/>
    <path d="M86 20c4-8 10-10 14-8" stroke-width="2"/>
    <path d="M78 24l2-2" stroke-width="1.5"/>
    <path d="M56 78v12M68 80v16M92 80v14" stroke-width="1.5"/>
    <path d="M30 60c4 2 6 6 4 10-4 0-6-4-4-10ZM132 56c-4 2-6 6-4 10 4 0 6-4 4-10Z" stroke-width="2"/>
    <path d="M26 92l8-3M134 90l8-4M120 30l6-6M40 30l-6-6" stroke-width="2"/>
    <path d="M142 112l3-7 3 7-7-3h8Z" stroke-width="1.8"/></g>`,
  receipt: `
    <path d="M36 18h88v124l-11-8-11 8-11-8-11 8-11-8-11 8-11-8-11 8Z" stroke-width="3.2"/>
    <path d="M52 42h36M52 58h54M52 74h28M52 90h44" stroke-width="2.6"/>
    <path d="M100 42h8M92 74h14" stroke-width="2"/>
    <path d="M52 108h14M72 108h12M90 108h10M106 108h4" stroke-width="1.6"/>
    <path d="M104 24l-2 24" stroke-width="1.4"/>
    <circle cx="126" cy="102" r="18" stroke-width="3"/>
    <path d="M126 92v20M116 102h20" stroke-width="2.6"/>
    <path d="M134 26l3-7 3 7-7-3h8Z" stroke-width="1.8"/>
    <path d="M24 56l3-6 3 6-6-3h6Z" stroke-width="1.8"/>`,
  phone: `
    <path d="M52 12h56a11 11 0 0 1 11 11v114a11 11 0 0 1-11 11H52a11 11 0 0 1-11-11V23a11 11 0 0 1 11-11Z" stroke-width="3.2"/>
    <path d="M70 22h20" stroke-width="2.4"/>
    <path d="M50 34h60v90H50Z" stroke-width="1.6"/>
    <path d="M62 46h38a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H84l-10 9v-9H62a6 6 0 0 1-6-6V52a6 6 0 0 1 6-6Z" stroke-width="2.6"/>
    <path d="M67 59h.1M81 59h.1M95 59h.1" stroke-width="3.4"/>
    <path d="M58 98h44M58 110h28" stroke-width="2"/>
    <path d="M96 84l8 8M92 90l6 6" stroke-width="1.5"/>
    <path d="M80 137h.1" stroke-width="3.4"/>
    <path d="M128 38c5 4 7 9 5 14M136 30c9 7 11 19 7 31" stroke-width="2.2"/>
    <path d="M24 92l3-7 3 7-7-3h8Z" stroke-width="1.8"/>`,
  pin: `
    <path d="M80 146C50 114 36 96 36 74a44 44 0 1 1 88 0c0 22-14 40-44 72Z" stroke-width="3.2"/>
    <circle cx="80" cy="74" r="17" stroke-width="2.8"/>
    <path d="M70 70c2-5 6-7 10-7" stroke-width="1.5"/>
    <path d="M46 56c3-9 9-14 17-16" stroke-width="1.6"/>
    <path d="M106 96c-4 8-9 15-16 22M114 88c-2 5-5 9-9 14" stroke-width="1.6"/>
    <path d="M46 150c10-5 58-5 68 0" stroke-width="2"/>
    <path d="M124 146h8M138 146h6" stroke-width="2"/>
    <path d="M128 26l4-8 4 8-8-4h8Z" stroke-width="1.8"/>
    <path d="M26 40l3-7 3 7-7-3h8Z" stroke-width="1.8"/>`,
  berry: `
    <path d="M80 56c30-8 54 8 50 36-4 26-28 48-50 54-22-6-46-28-50-54-4-28 20-44 50-36Z" stroke-width="3.2"/>
    <path d="M80 56c-4-12 2-24 16-30 2 12-4 24-16 30Z" stroke-width="2.6"/>
    <path d="M80 56c-8-10-22-12-32-6 8 10 22 12 32 6Z" stroke-width="2.6"/>
    <path d="M80 56c10-10 24-10 32-2-8 10-22 10-32 2Z" stroke-width="2.6"/>
    <circle cx="64" cy="94" r="3.6" stroke-width="2.6"/>
    <circle cx="96" cy="94" r="3.6" stroke-width="2.6"/>
    <path d="M68 108c7 8 17 8 24 0" stroke-width="2.4"/>
    <path d="M44 80c2-8 8-14 16-16" stroke-width="1.6"/>
    <path d="M52 112h.1M108 110h.1M80 128h.1M66 124h.1M94 124h.1M112 76h.1" stroke-width="3"/>
    <path d="M122 118c-4 10-10 18-18 22M130 106c-1 4-3 8-6 12" stroke-width="1.5"/>
    <path d="M136 36l3-7 3 7-7-3h8Z" stroke-width="1.8"/>
    <path d="M24 70l3-6 3 6-6-3h6Z" stroke-width="1.8"/>`,
  bag: `<path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>`,
};
const sketch = (name, className = '', label = '') => `<svg class="sketch ${className}" viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}><g filter="url(#sketch-rough)">${sketchArt[name] || sketchArt.acai}</g></svg>`;
