# Yo-Chi competitor research

Research date: 7 October 2026 (Australia/Adelaide). Public sources accessed through Agent Reach's Jina Reader, then official Apple metadata and page HTML for media. No app account was created and no live authenticated app flow was tested.

## Verified product behaviour

The Australian app listing describes membership registration/linking, a digital loyalty card, point tracking, exclusive offers, store-specific flavours, a venue finder, and account settings. It also declares Apple Wallet support. These are competitor features rather than confirmed Docee requirements. [Australian App Store listing](https://apps.apple.com/au/app/yochi/id1539528624)

The official programme currently earns one Chi Point per $10 of eligible venue spending; redemption becomes available at 10 points. The birthday benefit is a voucher worth up to $10, usable within 14 days including issue day. Membership must be active and verified by 3:30am on the birthday. The terms exclude online, supermarket and gift-card transactions and point accrual when promotional discounts apply; inactive memberships are cancelled after two years. Docee reward amounts, thresholds and validity periods require separate business decisions. [Programme terms](https://yochi.com.au/tnc/)

Members can recover missed purchase credit by entering their receipt number through the app. This suggests a useful support flow for a loyalty MVP. [Official FAQ](https://yochi.com.au/contact-us/)

## Visual and navigation evidence

The App Store HTML contains five screenshots named as captured on 9 September 2025. These are the newer public listing evidence, not a guarantee of every screen in the installed 2026 app.

- The login screen combines a large black wordmark and white form panel with vivid, outlined lifestyle illustration behind it.
- The main navigation has four tabs: Home, Account, Offers and More. The campaign feed uses monthly content, photography, generous imagery, and a green/purple promotional treatment.
- The offers screen explicitly shows an empty state.
- The store finder provides a list/map switch and venue pins.
- The settings area includes receipt claims, loyalty history, profile/password controls, product and story content, social links, support and permanent account deletion.

These observations are based on the images themselves. They suggest that Docee should prioritise an easily reached scan card, clear reward progress, complete account flows, and useful empty states; they do not imply copying Yo-Chi's graphics or programme. [Listing screenshot gallery](https://apps.apple.com/au/app/yochi/id1539528624)

## Recommended Docee mockup coverage (design inference)

1. Welcome and programme introduction.
2. Registration, sign-in, verification and password recovery.
3. Home with point progress, scan shortcut and campaign content.
4. Membership barcode/QR card and optional wallet action.
5. Rewards list, reward conditions, redemption confirmation and success.
6. Products/flavours, dietary details and venue availability.
7. Store list/map and individual store details.
8. Purchase/points history and missed-receipt claim.
9. Profile, preferences, support, terms, privacy and account deletion.
10. Empty, loading, offline, invalid-code and expired-reward states.

The mockup may use sample balances and offers but must label them as demo assumptions. A receipt claim, Wallet integration and reward redemption remain prototypes until a POS/loyalty backend and programme rules are chosen.

## Real assets and provenance

- `public/assets/yochi-logo.svg`: official wordmark, [website SVG](https://yochi.com.au/wp-content/uploads/2022/07/logo.svg), discovered in official site structured data.
- `public/assets/yochi-app-icon.jpg`: Apple [lookup API](https://itunes.apple.com/lookup?id=1539528624&country=au) artwork; black wordmark on white.
- `public/assets/yochi-current-screen-1.jpg`: current listing login screenshot; [Apple media](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/f8/6a/de/f86ade47-4e74-a1e8-6d41-c5a526c3131e/Simulator_Screenshot_-_iPhone_14_Plus_-_2025-09-09_at_11.35.11.png/600x1300bb-60.jpg).
- `public/assets/yochi-current-screen-2.jpg`: campaign feed; [Apple media](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/f9/97/73/f997738d-e06a-6cfd-eea6-5eb32ba3cd82/Simulator_Screenshot_-_iPhone_14_Plus_-_2025-09-09_at_11.36.18.png/600x1300bb-60.jpg).
- `public/assets/yochi-current-screen-3.jpg`: offers empty state; [Apple media](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/53/97/e1/5397e1c9-36fe-cd49-50ac-c6a30a7aa466/Simulator_Screenshot_-_iPhone_14_Plus_-_2025-09-09_at_11.36.26.png/600x1300bb-60.jpg).
- `public/assets/yochi-current-screen-4.jpg`: store map; [Apple media](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/ab/05/c3/ab05c362-4204-5700-a36b-8c17f0483168/Simulator_Screenshot_-_iPhone_14_Plus_-_2025-09-09_at_11.37.22.png/600x1300bb-60.jpg).
- `public/assets/yochi-current-screen-5.jpg`: settings menu; [Apple media](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/87/ec/a3/87eca355-d13e-22bd-4f6a-71fec5941b7f/Simulator_Screenshot_-_iPhone_14_Plus_-_2025-09-09_at_11.36.29.png/600x1300bb-60.jpg).

Apple's lookup API also returned five older images saved as `yochi-app-screen-1.png` through `yochi-app-screen-5.png`. They show 2020/2021 content and version 1.0.1, so they are historical references and should not drive the current competitor comparison. Use the newer `yochi-current-screen-*` gallery for that purpose. Logos and screenshots remain their respective owners' assets and are used here as research references.
