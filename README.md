# Docee loyalty app concept

A clickable mobile loyalty app mockup in Docee's colours. The current UI uses a sketch style: Docee cobalt (`#2425D6`), cream (`#F3F1EA`) and a dark menu screen, white or blue line-art illustrations, and handwritten accents set in Gochi Hand beside DM Sans. The Docee mascot appears as white line art on the welcome screen. A separate research view includes Yo-Chi's logo.

The sketch theme is in `docee-sketch.css` and loads after the earlier stylesheets. The line-art drawings are inline SVGs in `sketches.js`. Gochi Hand is bundled under the SIL Open Font License (`public/fonts/OFL-Gochi-Hand.txt`).

Try the [live demo](https://docee-averse-s-projects.vercel.app/). The [Vercel project](https://vercel.com/averse-s-projects/docee) is connected to `main` in [13V/docee](https://github.com/13V/docee).

## Run locally

Node.js 24 is required. No package installation is needed.

```powershell
npm run dev
```

Open [the local demo](http://127.0.0.1:4173/). On desktop, choose **Preview** to try the app, **All screens** to review the fifteen-screen inventory, **Loyalty screens** to compare the club card and rewards, or **Brand & research** for the rationale. Use the screen navigator to inspect each step. All interactions use local demonstration state; no account, OTP, purchase or valid reward is created. Reset demo restores the initial state.

## Mobile browser preview

Preview fills the browser viewport at widths up to 760px, or up to 950px when the height is 500px or less. The review interface, mock phone border and simulated status/home bars are hidden. The app uses its own content scroller, responsive images, safe-area padding and bottom navigation, with 44px touch targets and 16px form text. Its height follows the visual viewport as browser chrome or the keyboard changes; pinch zoom remains available.

Use [review mode](http://127.0.0.1:4173/?review=1) to show the screen navigator and galleries on a phone. Desktop Preview and gallery screens retain the fixed 390 × 844 reference composition. Valid screen IDs can be opened directly, for example [Menu](http://127.0.0.1:4173/#discover) or [Club card](http://127.0.0.1:4173/#scan). Browser Back and Forward move between app screens while retaining the current in-memory demo state.

`mobile-browser.css` loads last and applies only to mobile Preview. The first Home photograph loads eagerly with high priority; product images decode asynchronously, and the next Home photograph loads lazily. DM Sans is preloaded.

Browser viewport checks covered all fifteen screens at 390 × 844, 320 × 568, 430 × 932 and 844 × 390. They confirmed viewport sizing, no horizontal page or content overflow, anchored navigation, 44px standalone button targets and 16px text fields. A 390 × 430 form viewport retained input focus and draft values; terms fit within their dialog. Back and Forward were checked between locations and Menu, retaining the selected Firle location. These checks used browser viewport resizing; physical iOS and Android devices were not exercised.

## Intro

On first load the app plays a short opening film (`cinematic.js`, about 9 seconds, skippable; a brief version on repeat visits and a still frame under reduced motion), then a three-card story intro about keeping regulars, more revenue and less time at the till (`intro.js`, `docee-intro.css`) that can be swiped, advanced with the next button or arrow keys, or skipped; **try the app** and **skip** land on Welcome unless a screen was linked, such as `#home`. Add `?nointro=1` to skip the intro and `?noloader=1` to skip the loader. The intro only appears in Preview, covering the phone on mobile and only the phone frame on desktop.

## Research and build preparation

- [Current art direction: cobalt sketch style with line art and handwritten accents](docs/art-direction.md)
- [Generated café artwork and complete prompts](docs/generated-assets.md)
- [Mockup screen board and validation](docs/mockups/README.md)
- [Docee branding and design direction](docs/docee-branding.md)
- [Yo-Chi competitor analysis](docs/yochi-research.md)
- [Screen requirements and production build brief](docs/app-build-brief.md)
- [Product photographs and their sources](docs/product-asset-sources.md)
- [Agent Reach installation and local tools](docs/local-tooling.md)

The loyalty name, point rates, reward costs, member balances and transaction examples are proposed concept data. Merchant verification is needed for business rules, prices, hours, availability and allergens before production.

This is an HTML/CSS/JavaScript prototype with no runtime dependencies. The future mobile framework, POS/loyalty provider and backend remain open decisions. Local credentials belong in `.env`; commit placeholder values only in `.env.example` or `.env.sample`.

## Deploy to Vercel

The repository is [13V/docee](https://github.com/13V/docee). Import it in Vercel with the **Other** framework preset. `vercel.json` sets the build command to `npm run build` and output directory to `dist`; use Node.js 24.x.

```powershell
npm run check
npm run build
```

The build copies the app, active styles, public assets and documentation into `dist`, retaining the existing URL paths. Navigation uses URL fragments, so no catch-all rewrite is required. The local server is for development only; Vercel serves the generated static files. Build output, local Vercel settings and credentials are ignored by Git.
