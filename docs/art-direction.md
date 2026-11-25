# Docee app design

Updated 25 November 2026. The app uses the sketch direction: Docee cobalt, cream and a dark menu screen, hand-drawn line-art illustration, and handwritten accent words beside a clean sans. It supersedes the biscuit beige, cream and photography direction of 8 October 2026, which is no longer used on the redesigned screens.

The style follows a user-supplied screen recording of a third-party coffee-app concept ("Brew Bliss" by lay.the.designer). Layout, mood and type pairing were followed; no assets were copied. Docee colours, content and drawings replace the reference brand. Signin, verify, profile, claim, activity, stores and account follow the same system as the screens described below.

## Palette

| Role | Value |
|---|---|
| Docee cobalt: blue screens, outlines, active states, buttons | `#2425D6` |
| Deep cobalt: pressed and hover states | `#1A1BA6` |
| Cream: main canvas on cream screens | `#F3F1EA` |
| Paper: raised surfaces and fields | `#FBFAF6` |
| Ink: dark menu screen | `#101018` |
| Ink, second level: dark cards and sheets | `#1B1B26` |
| Main text | `#16163A` |
| Supporting text | `#5D5D7A` |

On blue and dark screens text is white, with supporting text in a pale blue-grey or lilac. Edges are 1.5px lines in cobalt (a translucent cobalt for quiet dividers) or translucent white. The tokens are defined at the top of `docee-sketch.css`.

## Type

- **DM Sans** (`Docee Sans`) for the interface and headlines, in regular and medium weights.
- **Gochi Hand** (`Docee Hand`) for handwritten accent words, price and points tags, and lowercase section labels. It is bundled at `public/fonts/gochi-hand.ttf` under the SIL Open Font License (`public/fonts/OFL-Gochi-Hand.txt`).

Headline pattern: two or three sans lines at about 28px, the second line indented, and a final word set large (about 44px) in the handwritten face and aligned right. Use the handwriting sparingly: one accent word per headline, plus tags and labels. Body copy, forms and numbers stay in DM Sans.

## Illustration

- Hand-drawn line-art inline SVGs, kept in `sketches.js`: açaí bowl, smoothie, iced matcha, cold cream, coffee cup, gift and a splash mark.
- A subtle displacement filter gives the lines a wobble. Strokes are uniform and round-ended, with no fills beyond the surface colour.
- Colour is white on blue and dark screens, and blue on cream.
- The mascot appears as white or blue line art (`public/assets/docee-mascot-white.png`, `public/assets/docee-mascot-line.png`), derived from the authentic `docee-mascot.png`. Do not redraw it.
- Product photographs and generated photographic artwork are not used on redesigned screens.
- Prices are not shown, because Docee prices are unverified. Tags show a category or a points cost.

## Surfaces per screen

| Screen | Surface |
|---|---|
| Welcome | Blue, white line art and mascot |
| Club card (scan) | Blue, with the QR on a paper panel |
| Saved reward (redeem) | Blue |
| Menu (discover) | Dark ink |
| Home and the remaining screens | Cream |

## Components

- **Outlined cards**: 1.5px cobalt outline on cream, white outline on dark. The active card fills solid cobalt.
- **Highlighter-bar list**: category and option lists are indented to the right, and the selected item takes a solid bar (white on blue screens).
- **Product rail**: horizontally snapping cards with a lead line, a handwritten word, a line-art drawing, a tag and a call to action.
- **Tags**: small outlined handwritten labels showing a category or points cost.
- **Header**: 44px back and action buttons around a centred 15px title.
- **Floating pill navigation**: a rounded pill above the screen content. The active item becomes a blue pill that shows its label.
- **Forms**: 16px fields on paper or cream, with cobalt outlines.

## Accessibility

- Touch targets are at least 44px, including header icons, list rows and standalone buttons.
- White on `#2425D6` has a contrast ratio of about 9:1, which passes WCAG AA and AAA for normal text. Supporting text on blue uses a pale tint and should be checked if the tint changes. Muted `#5D5D7A` on cream passes AA for body text.
- Handwritten text is decorative or short. Do not set it below about 17px, and do not use it for essential instructions.
- Text fields use 16px type so iOS Safari does not zoom on focus.
- Illustrations are decorative and should not carry meaning alone; tags and labels give the text equivalent.

## Mobile browser mode

Preview becomes a full-width browser app at widths up to 760px, or up to 950px when the height is 500px or less. `body.mobile-app-mode` scopes this layout. The review header, sidebar, notes, stage labels, footer, mock phone edges and simulated status/home bars are hidden. App content scrolls within the viewport. A `?review=1` URL opts back into the review interface on phones; desktop and gallery sizing remain unchanged.

The viewport includes `viewport-fit=cover` and `interactive-widget=resizes-content`, and safe-area insets protect content and navigation. The app height follows `visualViewport.height` at normal zoom. Valid `#screen` routes open specific screens, such as `#discover` and `#scan`, and Browser Back and Forward restore screen navigation while demo values stay in memory. DM Sans is preloaded.

Desktop Preview and the review galleries use a 390 × 844 native canvas, scaled without an inset phone border. The inventory is fifteen screens; Store detail was removed on 8 October 2026.

## Map and storefront

Locations use the official [OpenStreetMap embed](https://wiki.openstreetmap.org/wiki/Export) with bbox `138.515,-34.942,138.675,-34.862`, a visible [attribution link](https://www.openstreetmap.org/copyright), and no storefront pins because exact coordinates have not been established. The map needs an internet connection. The storefront photograph supplied on 8 October 2026 (`public/assets/docee-storefront.png`) is a real photograph and may still appear where a location needs one. Selecting a location opens that store's menu directly.

## Files and verification

`docee-sketch.css` holds the theme and loads after the earlier stylesheets (`docee-reference.css`, `activity-polished.css`, `docee-polish.css`, `mobile-browser.css`), which still supply shared layout. The `sk*` helpers and `renderScreen` in `app.js` build the screens. Older theme and creative-draft stylesheets remain unloaded.

Check all fifteen screens for horizontal overflow and consistent native sizing. Verify signup and profile routes, one-time reward deduction, disabled insufficient-points actions, receipt recovery, history filters, direct location selection into the menu and menu filtering. Demo data is illustrative; the app does not create accounts or valid merchant vouchers.

The previous direction's reference material remains for provenance: the [Blank Street archive index](references/blank-street-344/README.md), the [polished reference image](references/blank-street-polished-latest.png), and the beige-era mockups in [mockups](mockups/README.md).
