# Docee mockups

The current direction is the sketch style, described in [art direction](../art-direction.md): Docee cobalt `#2425D6`, cream `#F3F1EA`, a dark menu screen, hand-drawn line-art illustration and Gochi Hand accents. It supersedes the biscuit beige and photography direction on 25 November 2026. The screenshots listed below were taken on that earlier direction, with biscuit beige `#EADCCA`, cream `#F7F1E5` and blue `#0000FB`, and do not show the current look. Open the local app to see the current screens.

The current app contains fifteen screens. Store detail was removed on 8 October 2026: Select opens the chosen store's menu directly, the selected-location summary is informational, and Change location opens the picker. The earlier sixteen-screen boards and validation records below document previous revisions.

Earlier beige-direction images:

- [Overview](overview.jpg): launch, Home, activity, saved reward, locations and menu, aligned with the latest reference.
- [Six reference screens](reference-screens.jpg): a closer view of those six mobile compositions.
- [Earlier sixteen-screen board](all-screens.jpg): historical screenshot from before Store detail was removed, including signup, rewards, receipt claims, menu, locations and account.
- [Loyalty screens](loyalty-screens.jpg): the redesigned membership pass, reward cards, reward detail, saved voucher and activity.
- [Art direction](../art-direction.md): current sketch palette, typography, illustration and components.
- [Generated artwork and prompts](../generated-assets.md): all eight generated assets and the complete prompt set.
- [Build brief](../app-build-brief.md): screen requirements, production states and integration decisions.

Open the local app at `http://127.0.0.1:4173/` and choose **All screens** to open any screen interactively. The screenshot board starts with the main visual screens; the numbered screen navigator follows the membership journey.

## Historical validation and revision records

Everything below describes the earlier beige and photography direction and does not show the current sketch look. These checks and images describe the revision named in each entry. Sixteen-screen records predate the current fifteen-screen inventory.

JavaScript syntax checks passed. All 16 screens and the complete gallery were checked for missing images and horizontal overflow. The 390 x 844 native composition scales consistently at 390px and 320px browser widths. Signup validation, draft retention through terms sheets, birthday display, OTP/profile completion, first-name greeting, location switching and menu filtering were verified. The existing single-use reward and receipt behavior also passed isolated state checks. Demo state was reset before capturing the final board.

After the beige/blue and generated artwork update, all 16 screens again passed image loading and horizontal overflow checks. App canvases, navigation and form fields resolve to the exact swatch. The three reward cards fit above navigation. Saving the 100-point credit changed 180 to 80 once; reopening preserved 80, activity showed one redemption, and a receipt claim added 18 to reach 98. The locked bowl reward stayed disabled. Updated layouts were verified at 320px, 390px and 1440px widths.

Screenshots use illustrative member data and reward rules. The QR and redemption reference are demo values.

The final reference pass replaces the ribbon/stamp drafts with a checkerboard club card and raised reward sheet. Launch navigation, the saved sheet, store selection, receipt claim and menu filtering were checked after the rebuild. The OpenStreetMap viewport includes visible attribution.

Final checks: all sixteen screens load their images and fit horizontally; the saved sheet and code fit at 320px and 390px browser widths. The 100-point credit changes 180 to 80 once, receipt recovery adds 18, and the bowl reward remains disabled until sufficient points are collected. Store selection carries through to menu filtering. Final boards use reset demo state.

Latest colour pass: [white surfaces](white-surfaces.jpg) shows white cards, fields, raised reward sheet and navigation over the retained beige canvas. All sixteen screens checked for image loading and horizontal overflow.

Full archive design pass (8 October 2026): [all sixteen updated screens](archive-style-all-screens.jpg). Uses the supplied 344-file archive for Account grouping, menu cards and rows, product panels, forms, card grids and button hierarchy. Checked menu filtering, product navigation, preference persistence, reward reveal/save, and 390px gallery overflow.

History reference correction: [Activity at native size](activity-ledger.jpg). Cream background, date-first records, larger titles, beige detail buttons, and on-demand filters. Verified transaction details, earned/redeemed/all filters and empty state. DM Sans loaded and all sixteen screens checked for horizontal overflow.

Locations reference correction: [storefront screen](locations-storefront.jpg). User-supplied hero image, full-colour map, continuous cream sheet, unboxed location details and larger type. Both store selections and the selected menu location were verified.

Menu reference correction: [updated menu](menu-reference-layout.jpg). Cream body, beige location header, storefront thumbnail, outlined product cards and enlarged typography/navigation. Verified category filters, both product-card layouts, store changes and horizontal sizing.

Club card reference correction: [updated membership screen](club-card-reference-layout.jpg). Separates the rounded checker card, member identity, beige QR frame and outlined points row on a continuous cream canvas. Uses Wallet #114, gift-card #65 and QR #129 from the archive; no equivalent loyalty QR layout exists there. Both beige action pills work. A demo receipt updated the displayed balance from 180 to 198; state was reset to 180 for the screenshot. The QR loads, both actions remain above navigation, and the native composition fits without horizontal or vertical overflow at 320px and 390px browser widths. JavaScript syntax checks passed.

Points emphasis refinement: the membership balance now has a solid beige fill and a 30px blue total with smaller neutral units. Its 58px footprint is preserved; the full default screen still fits above navigation without scrolling. The membership screenshot above is updated.

Direct location selection (8 October 2026): [Findon menu after selection](menu-direct-location.jpg). The featured Select button, both location rows and the storefront hero open the selected location's menu directly. Verified Findon and Firle names/addresses, the informational menu summary, fifteen gallery screens and the absence of Store detail links. Menu images load and the layout fits horizontally. JavaScript syntax checks passed.

Home membership refinement: [updated Home section](home-membership-reference.jpg). Uses the archive's pickup-status card #110, wallet button treatment #114 and account row #163. The cream membership card has a larger blue balance, neutral Scan card capsule and bold reward status. Receipt claim is a separate readable row. Verified View rewards, Scan card, receipt recovery and available/saved reward routes; saving the 100-point reward shows 80 points, and reopening it keeps 80. Reset state is used in the screenshot. Images load, horizontal sizing passes at 320px/390px browser widths, and the receipt row remains above navigation when scrolled to the bottom. JavaScript syntax checks passed.

Mobile browser refinement: [full-width Home](mobile-browser-home.png) and [full-width menu](mobile-browser-menu.png). Phone Preview uses the browser viewport rather than scaling the desktop mockup; review chrome and simulated device bars are hidden. All fifteen screens passed width/height and 44px standalone-button checks at 320 × 568, 390 × 844, 430 × 932 and 844 × 390 viewport sizes. A 390 × 430 viewport check retained form focus and entries; the signup/verification/profile flow completed. Terms restored scroll position and focus when closed. A saved reward scrolled, revealed and returned Home with 80 points in the short viewport. Location selection and browser Back/Forward preserved the selected store. Desktop native sizes and the fifteen-screen gallery remain intact; `?review=1` exposes review tools on a phone. JavaScript syntax checks passed. These are browser viewport checks, not physical iOS/Android device tests.
