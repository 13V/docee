# Docee app design

Updated 8 October 2026. The user-supplied 344-file Blank Street archive is the direct visual reference. All decodable unique screens were reviewed on numbered contact sheets, with the main layouts inspected at mobile size. [Archive index and component mapping](references/blank-street-344/README.md) records the source of each component treatment. Docee colours and content replace the reference brand.

## Current palette

| Role | Value |
|---|---|
| App backgrounds and secondary accents | Biscuit beige `#EADCCA` |
| Cards, form fields, raised reward sheet and navigation | Cream `#F7F1E5` |
| Identity, signup, verification, redemption and active navigation | Docee blue `#0000FB` |
| Standard primary buttons | Charcoal `#222020` |
| Main text | Warm ink `#493B29` |
| Supporting text | Warm brown `#6D5E49` |
| Quiet edges and separators | Warm beige `#D2BEA2` |

The launch screen uses solid Docee blue with a beige wordmark. Beige remains the main canvas, while cream separates content cards, form fields and navigation from it. The location screen uses a continuous cream sheet over a full-colour map. Its featured photo has rounded corners, with unboxed store details below and compact outlined location rows. The club-card checkerboard uses cream and blue, with its label aligned to the middle row of the grid. There are no green UI accents. Photographs retain natural food colours.

## Layout and components

Desktop Preview and the review galleries use a 390 × 844 native canvas. Gallery frames scale the full canvas without an inset mock-phone border. The wide review board presents six screens across, in the order of the latest reference: launch, Home, activity, saved reward, locations and menu. The current inventory contains fifteen screens; Store detail was removed on 8 October 2026. Measurements below describe this reference composition; mobile browsers use the responsive mode described separately.

Home follows the reference geometry: small member avatar, centred 18px wordmark, 27px greeting, 21px section heading and 330 × 496 campaign cards. Photo captions and headings sit over a gentle dark gradient; a 47px beige capsule opens the relevant product. Its membership section adapts the compact pickup-status card from archive #110 and neutral wallet pills from #114: 21px heading, 354 × 143px cream card with 18px corners, small uppercase club label, 32px blue balance, beige Scan card capsule and a readable reward-status row. Claim a receipt is a separate 54px cream row with a circular beige chevron, following Account #163. Home navigation uses 21px icons and 10px labels. The balance, available reward and saved reward actions retain the existing behaviour.

Menu uses a beige location header over a cream body, a 155px rounded location summary with the supplied storefront thumbnail, a downward location chevron, underlined categories, a pair of 173 × 229px outlined cards with 96px images, and horizontal rows for the remaining products. The selected-location summary is informational. Change location opens the location picker, where Select opens the chosen store's menu directly. Product titles are 16px and supporting descriptions 13px; bottom navigation is enlarged on this screen. Filtering shows the chosen category. Product detail places a rounded information panel under the product visual. Rewards reuse the product-card treatment, with the two available rewards above a full-width bowl reward row. Cost, saved status and points shortfall stay clear.

Membership combines the cream canvas and title hierarchy of archive Wallet #114, the standalone physical card from Gift #65 and the independent QR frame from Scan for help #129. The archive has no equivalent loyalty QR screen, so this is an adaptation of those three layouts. The former tall combined card is replaced by a 258 × 166 rounded checker card, quiet member identity, separate 232px beige QR panel, 58px beige balance row with a prominent 30px blue total, and two beige action pills. The title sits at native y96; the full default composition fits above navigation without scrolling. The QR remains the original demo asset, with its quiet zone intact. Reward detail uses the selected artwork, a centred title and cost, a quiet three-row points summary and one primary action. Saved rewards follow the supplied gift-card reference: a 258 × 166 checkerboard card with seven broad columns, a centred two-line message, and three 55px capsule actions. Reveal reward is charcoal black; View club card and Save for later are cream-beige. Revealing replaces the card face with the code without changing the layout or deducting points again. Saving returns Home and retains the voucher.

Activity follows the user's direct [Orders history](https://storage.gummble.com/prod/content/app_screens/367f0e53-99d6-4807-ab9f-551f62078aec.png) and [Gift history](https://storage.gummble.com/prod/content/app_screens/ce2800bd-7ed2-4ff0-9393-5dff460d4519.png) references. Its main surface is cream, with a back button, 28px heading, date-first entries, 18px transaction titles and values, and beige View details capsules. Filters and individual transaction details open sheets. The former balance panel, inline tabs, pin icons and bottom navigation were removed from this secondary screen. Account follows the archive's centred avatar and identity, with compact grouped Membership, Settings and Support rows.

Forms use 55px fields with thin neutral edges and 7px corners. Headings are 27–28px, most section titles 17–18px, Home's feature title 21px, and supporting text generally 11–13px. The app uses the bundled DM Sans font with explicit weights; the exact font used by the screenshots has not been verified. The review interface retains its original font.

## Mobile browser mode

Preview becomes a full-width browser app at widths up to 760px, or up to 950px when the height is 500px or less. `body.mobile-app-mode` scopes this layout. The review header, sidebar, notes, stage labels, footer, mock phone edges and simulated status/home bars are hidden. App content scrolls within the viewport, while navigation stays at the bottom. A `?review=1` URL opts back into the review interface on phones; desktop and gallery sizing remain unchanged.

The viewport includes `viewport-fit=cover` and `interactive-widget=resizes-content`. Safe-area insets protect content and navigation. The app height follows `visualViewport.height` at normal zoom, including browser chrome and keyboard size changes; height updates do not override pinch zoom. Mobile text fields use 16px type, small standalone actions have at least 44px touch targets, and navigation uses 21px icons with 11px labels. Home photography preserves its 330:496 aspect ratio at a responsive width. Cards and QR panels stay within the available width. Saved rewards and dialogs scroll internally with safe-area clearance, and the saved sheet's top offset adapts to viewport height.

Valid `#screen` routes open specific app screens, such as `#discover` and `#scan`. Browser Back and Forward restore screen navigation while the selected location and other demo values remain in memory. The first Home image loads eagerly with high fetch priority; image decoding is asynchronous and the next Home photograph loads lazily. The bundled DM Sans font is preloaded.

## Map and imagery

Locations use the official [OpenStreetMap embed](https://wiki.openstreetmap.org/wiki/Export), covering both existing street addresses with bbox `138.515,-34.942,138.675,-34.862`. The viewport retains its natural map colours and a visible [OpenStreetMap attribution link](https://www.openstreetmap.org/copyright). Storefront pins are omitted because exact storefront coordinates have not been established. The map requires an internet connection.

The location hero uses the storefront photograph supplied by the user on 8 October 2026 (`public/assets/docee-storefront.png`). The same image appears in the featured Findon row. The featured location remains fixed when the selected menu store changes, so this image is not relabelled as Firle Plaza. The location sheet has no bottom navigation; its close control returns to the menu. The authentic mascot remains unchanged. Current campaign and product art and its full prompt set are documented in [generated assets](generated-assets.md). Original merchant photographs remain preserved in [historical product provenance](product-asset-sources.md). The two rejected charm assets are retained as drafts and are not loaded by the current app.

## Files and verification

The base styles are in `docee-reference.css`, with the final reference refinements in `docee-polish.css` and the compact activity treatment in `activity-polished.css`. `mobile-browser.css` loads last and applies only to mobile Preview. Older theme and creative-draft stylesheets remain unloaded.

The latest reference is preserved at [Blank Street polished reference](references/blank-street-polished-latest.png). Earlier onboarding and menu references remain in the same directory.

Check all fifteen screens for image loading, horizontal overflow and consistent native sizing. Verify signup and profile routes, one-time reward deduction, disabled insufficient-points actions, receipt recovery, history filters, direct location selection into the menu and menu filtering. Earlier sixteen-screen screenshots and checks are historical records from before Store detail was removed. Demo data is illustrative; the app does not create accounts or valid merchant vouchers.

Mobile browser viewport checks covered all fifteen screens at 390 × 844, 320 × 568, 430 × 932 and 844 × 390. Viewport sizing, horizontal page and content overflow, anchored navigation, standalone button targets of at least 44px and 16px text fields were checked. A reduced 390 × 430 form viewport retained focus and draft values; the terms dialog fit. Browser Back and Forward between locations and Menu retained the selected Firle location. These checks used browser viewport resizing rather than physical iOS or Android devices.
