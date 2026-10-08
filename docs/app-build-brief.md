# Docee loyalty app build brief

Prepared 7 October 2026; scope updated 8 October 2026. The interactive mockup establishes the visual direction and fifteen-screen coverage. It uses demo data and local interactions; it does not connect to an identity provider, POS system or loyalty service.

## Evidence and assumptions

Yo-Chi's official Australian listing confirms digital membership, points, offers, a venue finder, store-specific flavours, account management and Wallet support. Its official FAQ also confirms missed-receipt claims. These provide a useful competitor baseline. They do not establish Docee's programme or integration capabilities. See [competitor research](yochi-research.md), [App Store](https://apps.apple.com/au/app/yochi/id1539528624) and [receipt FAQ](https://yochi.com.au/contact-us/).

Docee mobile/OTP authentication, a points wallet, reward redemption, birthday benefits and receipt claims are proposed requirements. **The prototype's 180-point balance, one point per $1 earn rate and 100 points for a $5 reward are illustrative. They are not a verified official Docee scheme.** Product imagery and branding come from the separate brand/asset research; store and menu details still need owner approval before launch.

## Screen inventory

| # | Screen | Implementation purpose and minimum content |
|---|---|---|
| 01 | Welcome | Introduce membership benefits; join and sign-in actions; programme terms link. |
| 02 | Mobile sign-in | Country code/mobile input; validation; send-code action; clear consent explanation. |
| 03 | OTP | Code entry, expiry, resend countdown, edit-number action and verification result. |
| 04 | Profile setup | Name and any approved optional birthday/home-store fields; required terms and separate marketing preferences. |
| 05 | Home | Available balance, progress toward a chosen reward, scan shortcut, eligible offers and seasonal content. |
| 06 | Scan | Membership QR/barcode, readable member identifier and checkout instructions; optional Wallet action after feasibility review. |
| 07 | Rewards | Available and locked rewards, point costs, expiry and eligibility; helpful empty state. |
| 08 | Reward details | Value, point cost, terms, participating stores and confirmation before redemption. |
| 09 | Redemption success | Confirmed outcome, updated balance, redemption reference and clear instructions for staff/customer. |
| 10 | Receipt claim | Receipt reference entry, eligibility explanation, submission, duplicate/pending/approved/rejected feedback. |
| 11 | History | Earn, claim, redeem and adjustment events; timestamps, balances and empty history. |
| 12 | Discover | Approved categories, products, seasonal items and availability without promising checkout. |
| 13 | Product detail | Photo, name, description, approved allergen/dietary information and store availability. |
| 14 | Stores | Map, storefront photograph and location rows with addresses. Selecting a location opens that store's menu directly. |
| 15 | Account | Profile, preferences, help, programme/privacy information, sign-out and account deletion request. |

Store detail was removed on 8 October 2026. The menu's selected-location summary is informational; **Change location** opens the location picker.

## Core flows

- **Join:** welcome → mobile sign-in → OTP → profile → home. Existing members return to their existing account after verification; duplicate identities need a defined recovery process.
- **Earn:** home → scan → store checkout → POS-confirmed eligible transaction → updated balance/history. Scanning alone must not grant points.
- **Redeem:** rewards → details → explicit confirmation → server eligibility/balance check → success and history. Define whether this creates a voucher or redeems directly at checkout before implementing it.
- **Recover a missed purchase:** receipt claim → pending/approved/rejected result → history. Define claim windows, ownership proof and duplicate handling.
- **Choose a location:** discover's Change location action or product detail → stores → Select → the chosen store's menu. Account also opens the location picker. The menu summary displays the selected address without an intermediate Store detail screen.

## States required before production

Every data screen needs loading, empty, refresh failure and retry states. Distinguish an absent balance from zero points. Provide expired/invalid OTP, resend limits, session expiry, invalid mobile input and account recovery states.

Rewards need insufficient-points, expired/unavailable offer, changed eligibility, duplicate submission and uncertain transaction states. Do not display success until the backend confirms the outcome. A failed or interrupted request must allow reconciliation without deducting twice. Receipt claims need invalid reference, already claimed, outside the claim window, pending review and rejection explanations.

When offline, clearly label cached balances/menu information and disable operations requiring current eligibility. Define whether a cached membership credential remains valid with the POS provider. Include denied-location fallback, unknown/holiday hours, unavailable product details and deletion-request status. Use labelled inputs, readable contrast, large touch targets, keyboard support and screen-reader semantics.

## Decisions to confirm with Docee

- Programme economics: earn/redemption rates, thresholds, eligible purchases, discounts, refunds, adjustments and fraud handling.
- Birthday eligibility, required verification, issuance timing, expiry, reward limits and inactivity rules.
- POS vendor and supported interfaces: transaction events, membership lookup, scanning, reversals and receipt claims. No integration has been verified.
- Membership QR security: credential format, server validation, lifetime/rotation and controls against sharing or replay.
- Apple/Google Wallet feasibility and whether it belongs in the first release.
- Required identity data, optional birthday/location collection, separate marketing consent, notification controls, retention and account-deletion handling.
- Canonical store hours/holiday overrides, menu ownership, availability updates, and approved allergens/dietary claims.

## Suggested technical shape and milestones

Use a mobile client with an authenticated API and a server-owned programme/transaction ledger. Keep balance calculations, reward eligibility and redemption authoritative on the backend. Connect the POS through the vendor's verified interface or an approved intermediary; process transaction references idempotently and reconcile reversals. Keep approved menu/store content manageable separately from loyalty rules. Framework selection can follow platform, budget and existing POS constraints.

1. **Approve scope:** validate the fifteen screens, programme economics, identity requirements and source-of-truth content with Docee.
2. **Validate the prototype:** walk through joining, scanning, redeeming, claiming a receipt and finding a store; refine states and accessibility.
3. **Prove integrations:** verify POS capabilities and sandbox flows; choose identity and Wallet approach; agree transaction/security contracts.
4. **Build the MVP:** implement authenticated membership, ledger, earning/redemption, approved content, account controls and staff support tooling.
5. **Pilot and release:** test refund/retry/offline/duplicate cases with a store, reconcile real transaction totals, validate permissions and accessibility, then prepare app-store assets and a controlled launch.
