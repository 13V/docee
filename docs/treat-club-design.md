# The Docee Treat Club — design and copy system

Historical design direction from 7 October 2026. The current beige, cream and Docee blue revision is documented in [art direction](art-direction.md). The current prototype has fifteen screens: Store detail was removed on 8 October 2026, and selecting a location now opens its menu directly. The selected-location summary is informational, with Change location retaining access to the picker.

Approved direction, 7 October 2026: a warm-beige loyalty app with vivid-blue personality, authentic Docee food/brand imagery and a collectible Treat Club character. This refines the current useful card/photo layout; it does not introduce ordering, social feeds or a different points programme. “Docee Treat Club” is the proposed concept name, not a verified existing programme.

## Visual system

| Role | Treatment |
|---|---|
| Main canvas and welcome | Warm beige `#EFE1CF` |
| Cards, forms and photo surrounds | Pale beige `#F8F2E9` |
| Identity and actions | Mascot blue `#0000FB`; darker pressed/hover state `#0000C4` |
| Reading | Warm ink `#433A31` |
| Headline hierarchy | DM Sans, strong weight, rounded feel, mixed case; approximately 32–40px for a short screen headline |
| Body/buttons | Clear DM Sans; approximately 14–15px, with strong readable action labels |
| Containers | Generous 20–24px internal space, comfortably rounded corners, quiet border/shadow |

Beige occupies most of the screen. Blue identifies the name, mascot, buttons, point emphasis and small decorative details. Keep the native-style bottom navigation and familiar forms. Strong headlines should be short enough to breathe, with product images doing most of the storytelling.

## Original charm vocabulary

Draw a small coherent family of blue-outline charms with rounded caps and consistent line weight: **berry, spoon, soft-serve swirl, iced cup and small heart**. Use original simple forms, rather than borrowing characters from the references. A supporting berry charm can be a faceless fruit outline; preserve the genuine Docee mascot as a separate, unchanged brand asset.

- Berry: membership/club accent.
- Spoon: açaí/reward accent.
- Swirl: dessert/category accent.
- Iced cup: drinks/discovery accent.
- Small heart: a warm decorative detail on a ticket or greeting, rather than a new favourite action.

Use one or two charms per major screen, usually along a card edge or as an oval sticker. Keep form and account screens quiet. Decorative charms should not look like tappable controls or replace meaningful labels; exclude them from screen-reader navigation. Avoid a sticker on every card.

## Cards, notes and collectible tickets

Home keeps the personal greeting, useful point balance and real photo feature. Add one small blue charm near the balance heading or featured photo. Keep points, progress and Scan immediately legible; a decorative sequence of charms must not imply a stamp-based programme.

Rewards become collectible pale tickets: scalloped side edges, a fine blue dashed separator, a small charm and clear reward name/cost. Keep a regular rectangular content area inside the ticket so the text does not compete with the edge. Use blue/beige checks as a narrow membership border or corner detail, not a full-screen pattern. Preserve a plain high-contrast scan area and its quiet zone.

Product notes should feel handwritten but stay brief: three to five words, one style, slightly angled, with enough contrast. They are accents rather than instructions. Use at most one note per product/photo; do not use the handwritten style for prices, point costs, forms or buttons.

## Final copy to implement

| Placement | Copy |
|---|---|
| Welcome headline | **Good taste. Great perks.** (break after “taste.”) |
| Welcome body | Join the Docee Treat Club. Earn points when you visit, then turn them into your next treat. |
| Welcome actions | **Join the club** / **Sign in** |
| Mobile sign-in headline | **Let's get you in.** |
| Mobile sign-in label/action | Mobile number / **Continue** |
| Code screen headline/action | **Enter your code.** / **Verify code** |
| Code secondary actions | Resend code / Change number |
| Profile headline | **Make it yours.** |
| Profile body/action | A name for your membership. / **Join the club** |
| Home greeting | **Hey, Sam.** (use the member's actual name) |
| Balance label/action | Your points / **View rewards** |
| Balance progress | 70 points to your açaí bowl (derive the number from the selected reward and balance) |
| Home product section | **Something sweet awaits** |
| Two-cup lifestyle photo caption | Two cups. Good company. |
| Home actions | **View menu** / **Scan card** / **Claim a receipt** |
| Rewards headline/body | **Pick your next perk.** / Turn your points into something good. |
| Available reward status/action | Ready to claim / **View reward** |
| Locked reward status | 70 points to go (derive the number) |
| Reward detail action | **Use 100 points** (derive the cost) |
| Confirmation headline/action | **Your reward is ready.** / **View scan card** |
| Membership heading/helper | **Your club card** / Show this at the counter to earn points. |
| Menu headline/body | **Find your next favourite.** / Açaí, smoothies, matcha and more. |
| Product detail action | **Find a store** |

Use literal helper/error copy: “That code doesn't look right”, “This reward needs more points”, “You've already claimed this receipt”, and “Try again”. Retain explicit demo guidance in the prototype; never imply a real verification code was sent or a real reward issued. Birthday copy must wait for agreed eligibility and reward rules.

### Reward ticket copy

| Ticket | Supporting line | Illustrative cost |
|---|---|---|
| **$5 Docee credit** | Put it towards your next treat. | 100 points |
| **Coffee, on us** | Your next coffee is covered. | 120 points |
| **Your açaí bowl** | A good reason to stop by. | 250 points |

The starting 180 points and these reward costs remain the existing illustrative concept economy. Do not change economics to suit the art treatment. Show a reward's terms near its detail/confirmation, not as decorative fine print.

### Menu copy and handwritten accents

| Product | Short description | Handwritten note |
|---|---|---|
| **Dubai Chocolate Açaí** | Chocolate crunch. Açaí swirl. | save room for this |
| **Ocean Boost Smoothie** | A bright blue break from the everyday. | out of the blue |
| **Iced Matcha** | Cool, creamy matcha. | matcha, always |
| **Ice Bueno Kinder Cream** | Cold, creamy and worth a pause. | the creamy one |

These are concept descriptions; exact ingredients, allergens, availability and serving details require merchant approval. Use product names consistently across home, menu and detail screens. Avoid repeated “little”, forced trend slang and unsupported claims about health or dietary suitability.

## Photo and crop choices

| Current real asset | Recommended use and crop |
|---|---|
| `public/assets/docee-acai-moment.jpg` | Main lifestyle feature: two cups held in front of the Docee mascot. Preserve both hands, cups and swirl tips. Use a portrait window or contain the full portrait within a pale panel; a tight square cover crop loses much of the mascot. Place copy beneath the photograph rather than over busy cups. Caption: “Two cups. Good company.” |
| `public/assets/docee-acai.jpg` | Açaí product tile/detail and optional welcome product. Contain the square photo within a generous pale panel; preserve the tall chocolate swirl, strawberry and branded cup. The reflection can be trimmed before the product itself. |
| `public/assets/docee-smoothie.jpg` | Drinks feature/menu tile. Centre the blue-and-white cup, keeping its top and base intact; use its natural white surround as breathing space. One small oval note may sit beside the cup, not across the print. |
| `public/assets/docee-matcha.jpg` | Matcha menu/detail. Contain the cup, preserve the white Docee printing and leave room near the top for the handwritten note. Its green is product colour, not a replacement UI accent. |
| `public/assets/docee-cold-cream.jpg` | Cold-cream menu/detail. Keep the dome lid and cup base; use the same product-panel scale as the other drinks rather than aggressively enlarging this smaller cup. |
| `public/assets/docee-matcha-moment.jpg` | Secondary human/store moment. Keep the member of staff's face, hands and drink together; do not crop it into an anonymous hand or use it as the primary product packshot. |

Merchant photographs and Instagram moments remain actual source images, with provenance in [product asset sources](product-asset-sources.md). Add charms, panels and notes in the interface layer; preserve the underlying photographs and `public/assets/docee-mascot.png`.

## Finish criteria

The design should feel collectible without making loyalty harder to use. Check that every screen has one clear primary action, warm space, readable labels and consistent cards. The real mascot must remain recognisable; reward tickets should look related; handwritten notes should be sparse. Test small-device headline wrapping, untouched scan contrast, intact photo subjects and clear available/locked reward states. This historical draft originally covered sixteen screens; use the current fifteen-screen scope in [art direction](art-direction.md) and keep all prototype limitations explicit.
