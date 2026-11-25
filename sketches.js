'use strict';

/* Hand-drawn line illustrations for the sketch theme. Each drawing inherits
   colour from currentColor so the same art works white-on-blue or blue-on-cream. */
const sketchArt = {
  acai: `
    <path d="M20 82c2 34 28 56 60 56s58-22 60-56"/>
    <path d="M22 84c3 31 27 51 58 51" opacity=".55"/>
    <ellipse cx="80" cy="81" rx="60" ry="13"/>
    <path d="M62 137l-3 9h42l-3-9"/>
    <path d="M118 100c-4 12-12 22-22 27M126 96c-3 10-8 17-15 23M132 92c-2 7-5 12-9 16"/>
    <path d="M26 79c-4-20 14-32 30-22 2-20 30-26 38-8 10-12 32-6 32 12 10 0 14 10 8 18"/>
    <path d="M36 74c14 4 28 4 42 0s28-4 44 2" stroke-dasharray="1 7"/>
    <circle cx="48" cy="62" r="9"/><circle cx="48" cy="62" r="2.6"/>
    <circle cx="70" cy="50" r="8.5"/><circle cx="70" cy="50" r="2.4"/>
    <path d="M92 46c0-12 16-14 18-4 4 9-4 19-11 22-5-6-7-12-7-18Z"/>
    <path d="M97 40l1-6m4 6 4-5m-6 13h.1m4 4h.1m-8 2h.1"/>
    <path d="M60 70l3-2m22-4 3 1m-56 6 3 1m82-8 3-2m-16 6 2 2"/>
    <path d="M118 62l30-38"/><path d="M144 28c2-10 10-14 13-11 2 4-3 12-12 14"/>`,
  smoothie: `
    <path d="M46 62h68"/>
    <path d="M44 60c2-26 70-26 72 0"/>
    <path d="M80 40V34"/>
    <path d="M86 44l16-38 7 3-15 37"/>
    <path d="M48 64l11 78h42l11-78"/>
    <path d="M55 94c8-6 15 6 25 0s18-6 25-1"/>
    <path d="M58 112c10-4 18 4 26 0" opacity=".7"/>
    <circle cx="70" cy="124" r="3"/><circle cx="88" cy="128" r="2"/><circle cx="92" cy="110" r="2.6"/><circle cx="66" cy="104" r="1.8"/>
    <path d="M104 72l-8 64M98 72l-6 50" opacity=".6"/>
    <path d="M60 78h40" stroke-dasharray="2 6"/>`,
  matcha: `
    <ellipse cx="80" cy="38" rx="30" ry="6"/>
    <path d="M50 38l7 104h46l7-104"/>
    <path d="M86 42l20-38 6 3-19 38"/>
    <path d="M58 50l14-4 4 14-14 4Z"/><path d="M80 52l13 2-2 13-13-2Z"/><path d="M66 66l13 5-5 12-13-4Z"/>
    <path d="M55 96c10-8 18 6 26-1s16-6 24 0"/>
    <path d="M58 104c4 10 10 6 14 14s10 4 14 12" opacity=".7"/>
    <path d="M100 100l-4 38M94 104l-2 30" opacity=".6"/>
    <path d="M122 122c8-12 22-12 26-4-10 10-20 10-26 4Zm0 0c8-4 16-6 26-4" />`,
  cream: `
    <ellipse cx="80" cy="102" rx="34" ry="7"/>
    <path d="M46 104l10 40h48l10-40"/>
    <path d="M44 98c-10-12 4-24 16-20 6-12 36-14 42-2 14-4 24 12 14 22"/>
    <path d="M56 80c-6-14 8-24 20-20 8-8 28-4 24 12"/>
    <path d="M70 60c-4-12 8-20 18-16 6-6 2-16-6-18"/>
    <path d="M54 92c16 4 38 2 54-6M64 74c12 4 24 2 34-4" opacity=".7"/>
    <path d="M60 84c2 8 6 6 6 14M92 78c2 9 7 7 6 16M78 62c0 6 3 6 3 10"/>
    <path d="M100 112l-4 28M94 114l-2 24" opacity=".6"/>
    <path d="M62 122h36" stroke-dasharray="2 6"/>
    <path d="M124 44l4-8 4 8-8-4h8Z"/><path d="M30 60l3-6 3 6-6-3h6Z"/>`,
  coffee: `
    <path d="M50 46h60l-3-10H53Z"/>
    <path d="M48 48h64v6H48Z"/>
    <path d="M52 54l10 92h36l10-92"/>
    <path d="M55 80h50l-3 30H58Z"/>
    <path d="M70 92c0-6 9-6 10 0 1-6 10-6 10 0 0 6-10 11-10 11s-10-5-10-11Z"/>
    <path d="M98 118l-3 24M104 118l-2 18" opacity=".6"/>
    <path d="M68 28c-6-6 6-10 0-18M82 26c-6-6 6-10 0-18M96 28c-6-6 6-10 0-18"/>
    <path d="M30 130c4-8 14-8 16 0-4 6-12 6-16 0Zm2 0h12M120 132c4-8 14-8 16 0-4 6-12 6-16 0Zm2 0h12"/>`,
  gift: `
    <path d="M30 66h100v22H30Z"/>
    <path d="M38 88v52h84V88"/>
    <path d="M80 66v74M72 66v74" opacity=".6"/>
    <path d="M78 64c-18-2-34-14-24-26 10-10 22 6 24 26Zm4 0c18-2 34-14 24-26-10-10-22 6-24 26Z"/>
    <path d="M110 96l-4 40M116 96l-3 30" opacity=".6"/>
    <path d="M24 40l4-8 4 8-8-4h8ZM132 34l3-6 3 6-6-3h6Z"/>`,
  splash: `
    <path d="M44 120l14 34h52l14-34"/>
    <ellipse cx="84" cy="118" rx="42" ry="9"/>
    <path d="M50 114c-10-20 0-34 10-30-4-14 10-26 18-16 2-18 22-22 26-6 12-8 24 6 16 22 10 2 12 16 6 26"/>
    <circle cx="44" cy="62" r="7"/><circle cx="118" cy="50" r="5"/><circle cx="72" cy="38" r="4"/><circle cx="100" cy="30" r="8"/><circle cx="34" cy="92" r="4"/><circle cx="136" cy="84" r="6"/>
    <path d="M98 128l-6 24M108 126l-5 18" opacity=".6"/>
    <path d="M60 134h52" stroke-dasharray="2 6"/>`,
  receipt: `
    <path d="M38 20h84v120l-10.5-8-10.5 8-10.5-8-10.5 8-10.5-8-10.5 8-10.5-8-10.5 8Z"/>
    <path d="M52 42h38M52 58h56M52 74h30M52 90h46"/>
    <path d="M100 42h8M92 74h16" opacity=".6"/>
    <path d="M52 112h56" stroke-dasharray="2 6"/>
    <circle cx="126" cy="100" r="17"/><path d="M126 91v18M117 100h18"/>
    <path d="M132 28l4-8 4 8-8-4h8ZM26 52l3-6 3 6-6-3h6Z"/>`,
  phone: `
    <path d="M52 14h56a10 10 0 0 1 10 10v112a10 10 0 0 1-10 10H52a10 10 0 0 1-10-10V24a10 10 0 0 1 10-10Z"/>
    <path d="M70 24h20"/><path d="M50 34h60v92H50Z" opacity=".5"/>
    <path d="M60 48h40a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H82l-10 9v-9H60a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6Z"/>
    <path d="M66 61h.1M80 61h.1M94 61h.1"/>
    <path d="M58 100h44M58 112h28" opacity=".7"/>
    <path d="M80 136h.1"/>
    <path d="M128 36c6 4 8 10 6 16M136 28c10 8 12 20 8 32"/>
    <path d="M24 92l3-6 3 6-6-3h6Z"/>`,
  pin: `
    <path d="M80 146C50 112 38 94 38 74a42 42 0 1 1 84 0c0 20-12 38-42 72Z"/>
    <circle cx="80" cy="74" r="16"/>
    <path d="M52 148c10-5 46-5 56 0" opacity=".6"/>
    <path d="M120 140h28" stroke-dasharray="2 6"/>
    <path d="M122 28l4-8 4 8-8-4h8ZM28 38l3-6 3 6-6-3h6Z"/>`,
  berry: `
    <path d="M80 50c-26 0-44 18-44 44 0 28 20 48 44 48s44-20 44-48c0-26-18-44-44-44Z"/>
    <path d="M80 52c-4-14 4-26 18-30 2 14-6 26-18 30Zm0 0c-10-12-24-12-32-6 8 10 22 12 32 6Z"/>
    <circle cx="64" cy="94" r="3.4"/><circle cx="96" cy="94" r="3.4"/>
    <path d="M68 108c8 8 16 8 24 0"/>
    <path d="M50 80c2-8 8-14 16-16" opacity=".7"/>
    <path d="M52 112h.1M108 112h.1M84 124h.1M70 122h.1M96 122h.1" opacity=".6"/>
    <path d="M128 40l4-8 4 8-8-4h8ZM26 70l3-6 3 6-6-3h6Z"/>`,
  mascot: `
    <g transform="translate(8 7.2) scale(.9)">
    <circle cx="80" cy="76" r="41"/>
    <path d="M43.5,59.7C37.1,49.2 28.2,46.8 18.8,48.7C23.6,57 31.4,62 43.5,59.7Z"/><path d="M43.5,59.7L24,51.1"/>
    <path d="M57.6,42.8C57.9,28 50.2,19.6 39.2,15.5C38.9,27.2 43.8,37.5 57.6,42.8Z"/><path d="M57.6,42.8L43.1,21.3"/>
    <path d="M80,36C89.5,21.7 87.6,8.4 80,-3C72.4,8.4 70.5,21.7 80,36Z"/><path d="M80,36L80,5.4"/>
    <path d="M102.4,42.8C116.2,37.5 121.1,27.2 120.8,15.5C109.8,19.6 102.1,28 102.4,42.8Z"/><path d="M102.4,42.8L116.9,21.3"/>
    <path d="M116.5,59.7C128.6,62 136.4,57 141.2,48.7C131.8,46.8 122.9,49.2 116.5,59.7Z"/><path d="M116.5,59.7L136,51.1"/>
    <circle cx="65" cy="72" r="7"/><circle cx="95" cy="72" r="7"/>
    <circle cx="66.5" cy="73" r="2.4"/><circle cx="93.5" cy="73" r="2.4"/>
    <path d="M56 60c3-4 8-5 12-3M92 57c4-2 9-1 12 3"/>
    <path d="M73 85c4 4 10 4 14 0"/>
    <path d="M72 116V131M88 116V131"/>
    <ellipse cx="64" cy="139" rx="12" ry="8"/><ellipse cx="96" cy="139" rx="12" ry="8"/>
    <path d="M48 148h64"/>
    </g>`,
  bag: `<path d="M5 8h14l-1 13H6Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>`,
};
const sketch = (name, className = '', label = '') => `<svg class="sketch ${className}" viewBox="0 0 160 160" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" ${label?`role="img" aria-label="${label}"`:'aria-hidden="true"'}><g filter="url(#sketch-rough)">${sketchArt[name] || sketchArt.acai}</g></svg>`;
