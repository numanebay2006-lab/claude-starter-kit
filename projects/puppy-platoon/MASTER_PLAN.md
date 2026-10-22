# MASTER PLAN: Puppy Platoon (Puppy Soldier Clothes Suit)

This file has two parts. Part 1 is the MASTER PROMPT, a self-contained build instruction. Part 2 is the BUILD SPEC: every final decision, verbatim copy, code and operations list. Where any of the ten specialist plans disagree with this file, this file wins.

Inputs that were reconciled: plan_brand, plan_copy, plan_home, plan_pdp, plan_offers, plan_cart, plan_mascot, plan_game, plan_ops, plan_assets, BRIEF.md, the supplier size chart (`sizechart.jpg`), and the pp-* files already in `theme/`.

---

# PART 1: MASTER PROMPT

You are a senior Shopify theme developer. Build and ship a high-converting, mobile-first, single-product store called **Puppy Platoon**. It sells one product: the **Puppy Soldier Dog Costume** (handle `puppy-soldier-clothes-suit`, $42.00, sizes S, M, L, XL, 2XL, dropshipped by CJ). It is a novelty costume. A camo helmet with an ear-muff headset and mic, a tan vest with US flag patches, camo sleeves, camo pants, and two plush front "arms" holding a **plush toy rifle (soft fabric, not a real or replica weapon)** make the dog look like a tiny soldier standing on duty. Most traffic comes from TikTok and Meta on phones. A visitor must understand "soldier costume for dogs, $42, free shipping" within 3 seconds.

**Platform constraints.** The store runs Shopify Basic with the Horizon theme. Build in the unpublished duplicate "Puppy Platoon v1" (`gid://shopify/OnlineStoreTheme/188335325432`) by pushing files with Admin GraphQL `themeFilesUpsert`. No apps can be installed. The sticky add to cart, cart drawer, bundles, package protection, mascot and mini-game are all native Liquid, JS and CSS under the `pp-` prefix. Use automatic discounts and one discount code made through the Admin API. The `theme/` folder already contains a first pass of the pp-* files. Treat it as the starting point and bring it into line with this spec.

**Brand.** Keep the name Puppy Platoon, the tagline "Tiny soldier. Huge laughs." and the mascot **Sergeant Pup**, a cartoon dachshund in a camo helmet (bubble signature "– Sgt. Pup"). The voice is a drill sergeant who melts for puppies: short, warm, plain sentences. Use a warm sand base with olive and khaki for theme colour. **Signal orange #C2410C is used only on buy actions.** Lilita One is the display face and DM Sans is the body face. Black Ops One appears only in the wordmark and in stamp labels of three words or fewer.

**Hard business rules.**
1. **Two markets:** United States, and Worldwide (every other country). Both already exist and both are USD. Verify them; do not recreate them.
2. **Shipping:** "Free Standard Shipping" at $0 and "Express Shipping" at $2.55 in both zones. Show "5–7 business days" everywhere. Express gives priority handling and tracking, not faster transit, so never write "sooner" or "faster".
3. **Package protection:** a hidden $3 product (already created) toggled in the cart. It is off by default, flat $3 per order, clearly labelled, removable in one tap, never shown as a normal line, and removed automatically when no suits remain.
4. **Bundles:** 1 suit $42.00, 2 suits 15% off ($71.40), 3 or more 25% off ($94.50). Customers can mix sizes. The discount applies automatically through two Admin automatic discounts limited to the suit product.
5. **Game reward:** code `TREAT10`, 10% off the order, $35 minimum, one use per customer. It combines with the bundle discounts.
6. **Compliance:** no fake reviews, stars, viewer counts, stock counters, resetting timers, compare-at prices, "Most popular" badges, invented statistics, "Made in USA", or any military affiliation. The footer carries the disclaimer. Avoid the words gun, combat, war, army, official. "Weapon" appears only inside "not a real or replica weapon". Urgency must be real: seasonal order-by dates computed from shipping days.

**Build these pieces** (exact copy and numbers are in Part 2):
- **Header and announcement:** an olive bar rotating 3 messages, a sticky cream header with the wordmark, a 5-item nav, and a cart bubble that counts suits only. No search.
- **Homepage, in this order:** Hero, What's in the suit, Photo strip, Bundles teaser, Size finder, Occasions, Trust strip, FAQ, Final CTA. Price always comes from `product.price | money`.
- **Product page:**
  - Gallery: a swipe track on mobile and a thumbnail rail on desktop. Image 1 is p1 with the chip "Plush toy rifle · soft fabric".
  - Buy box, in this order: title, price, kit chips, size pills (no default size), Find-my-size helper, three bundle tiles with per-suit size rows, ATC with live label and price, delivery-date estimate, Treat Drill teaser link, trust row, then Sergeant Pup's speech bubble.
  - Below the buy box: accordions, an honest reviews placeholder, the Treat Drill card, the trust strip and the FAQ.
  - No dynamic checkout buttons, no Horizon sticky block, no rating stars.
- **Sticky ATC:**
  - Appears only after the main ATC has scrolled above the viewport. Mobile shows a bottom bar; desktop shows a floating bar.
  - It mirrors size, bundle and price, and has its own size select.
  - It hides while the drawer is open, while a dialog is open, while the keyboard is up, and during active game play.
  - It is `inert` when hidden.
- **Cart drawer:**
  - A native `<dialog>` opened from every cart link.
  - Contents: a 3-node bundle progress bar; line items showing size (never the variant title), stepper, remove and undo; an upsell card priced at the true change in total ("Add a 2nd suit · +$29.40"); the protection switch; and summary rows taken from `/cart.js` only, including bundle savings and the TREAT10 row.
  - The checkout button reads "Secure checkout · {total}".
  - All writes go through one promise queue.
  - The `/cart` page renders the same component inline.
- **Sergeant Pup:**
  - Use the SVG, CSS and JS in Part 2 verbatim.
  - Placements: hero (salutes on view), PDP bubble (reacts to size, bundle, add and error), drawer peek (celebrates adds, milestones and protection-on), final CTA, empty cart and 404.
  - Reduced motion gives still poses. Never more than 3 instances per page.
- **Treat Drill:** use the snippet, CSS and JS in Part 2 verbatim. It is a collapsed card below the accordions. The goal is 10 points in 15 seconds. "Skip the drill, show my code" is always reachable. It auto-applies TREAT10 and never auto-opens or plays sound.
- **Size finder:** the weight (lb or kg) and optional chest inputs map to the supplier chart. Milo (6 lb) gives S and Louie (22 lb) gives M. Over 90 lb shows a "too big" message. An edge-of-size note suggests sizing up. An optional "Recruit name" personalises the mascot line and is stored in localStorage only.

**Operations (Admin GraphQL, in order):**
1. Switch the storefront locale to English. If the API refuses, this is an owner task, and the theme forces English strings in the meantime.
2. Delete the dummy second option and reorder sizes to S, M, L, XL, 2XL.
3. Set the product title, description and SEO.
4. Create the 2 automatic discounts and TREAT10, then verify their values.
5. Give the protection product an image and the `protection` template.
6. Publish the shipping, refund, terms, privacy and contact policies.
7. Create the pages, collection and menus.
8. Verify markets with a query and shipping with `draftOrderCalculate` for US, DE and TR addresses.
9. Publish the theme. If the API refuses, list it as an owner task.
10. Test real carts with 1, 2 and 3 suits, with protection on and off, and with TREAT10.

**Quality bar:**
- Lighthouse mobile: Performance at least 80, Accessibility at least 95, SEO at least 95. LCP under 2.5s, CLS under 0.05.
- No horizontal scroll at 320px.
- Every tap target at least 44px. Contrast at least 4.5:1 for text.
- Native radios for sizes and bundles. Live regions for cart changes.
- `prefers-reduced-motion` honoured everywhere.
- Zero console errors.
- All money formatted by Shopify money filters or the shop money format in JS. Bundle math done in integer cents.

When you finish, run the QA checklist in Part 2 §17 at 375px and 1280px, fix every failure, and record what the owner must still do by hand.

---

# PART 2: BUILD SPEC

## 0. Conflict resolutions

| Topic | Final decision | Rejected alternatives |
|---|---|---|
| Brand name | **Puppy Platoon** | Pawtrol Squad, Sgt. Snout, "Sergeant Pup Costume Co." |
| Mascot name | **Sergeant Pup** ("Sgt. Pup"). This name is already in the theme code and 4 of 6 plans use it. | Sgt. Biscuit (plan_brand, plan_game) |
| Palette | plan_brand sand / olive / signal-orange CTA, which `pp-base.css` already uses | plan_home amber CTA #E8A33D, plan_pdp brass #C8962E |
| Fonts | **Lilita One** (display) + **DM Sans** (body). Black Ops One is limited to the wordmark and stamps. | Black Ops One headings, Nunito, Inter |
| Bundle ladder | **1 = $42 / 2 = 15% off / 3+ = 25% off** (plan_offers, which matches `pp-config` tiers) | 10/20 (home), 15/20 (cart) |
| Bundle names | Recruit / Battle Buddies / The Squad | Solo Recruit / Buddy Pair / Full Squad |
| Badges | Only "Best value" on 3 suits, which is true because it has the lowest price per suit | "Most popular" (no data) |
| Default bundle | 1 suit | Pre-selecting 2 |
| Default size | None. The ATC reads "Choose your size" and focuses the size picker when tapped. It is not disabled. | Pre-selecting the first available size |
| Size table | **Supplier chart** (S 5–12 lb … 2XL 55–90 lb). It is consistent with Milo 6 lb in S and Louie 22 lb in M. | plan_pdp's invented table (S up to 7 lb, 2XL 20–25 lb), which puts Louie in 2XL |
| Target size claims | "Sizes S to 2XL fit dogs from about 5 to 90 lb. Cutest on small breeds." | "Made only for small dogs" |
| Game rule | Score **10 in 15 s** (calibrated, tested) | 8 in 20 s |
| Game code | **TREAT10**: order discount, 10%, $35 minimum, once per customer, combines with product discounts | TREATDRILL10 |
| Protection coverage copy | Covers **marked delivered but missing, or arrived damaged** (free replacement). Lost in transit is always covered by the Shipping Policy. | "Covers loss, theft or damage in transit" (overlaps the seller's own duty) |
| Express copy | "Priority handling and tracking · $2.55 · 5–7 business days" | "Need it sooner?", "gives you extra days" |
| Returns | **30-day returns**, as in the REFUND_POLICY pushed in ops §7. Show only after that policy is live. | No guarantee badge |
| Sticky ATC desktop | Floating bottom bar | Top bar |
| Upsell price | True marginal change in total ("+$29.40") computed from tiers in cents. Summary totals always come from `/cart.js`. | Full $42 price |
| Primary CTA labels | "Shop the Suit · {price}" (home), "Add to cart · {price}" (PDP) | "Enlist My Dog" (less clear) |
| Delivery estimate | Today + processing (1–2 business days, a setting) + transit (5–7 business days), skipping weekends and US holidays. Copy still says "5–7 business days shipping". | Today + 5–7 with processing ignored |
| Announcement | Rotates 3 messages every 4 s, pauses on hover and focus, static with reduced motion | Static single line |
| Care copy | "Hand wash cold with mild soap. Air dry flat. Do not tumble dry or iron." | Spot clean only |
| Closures / material | "Adjustable straps", "soft fabric". These are not verified as Velcro or polyester. | "Velcro on in a minute", "polyester" |
| Newsletter | Hidden. There is no second public code. | "10% off first order" |
| Veterans Day | No sale tie-in | Veterans Day promo |
| Event names | Colon style (§9). The existing `pp:cart`, `pp:cart-open`, `pp:cart-close` and `pp:added` must be renamed. | Mixed names |

**Dropped for compliance:** star ratings, "Most popular", compare-at prices, stock counters ("Only n left" is shown only if real inventory is under 5, and CJ inventory is high, so effectively never), "Real dogs" claims, "Tag @puppyplatoon" until the handle exists, the `sizechart.jpg` raster, "Made in USA", military endorsement, and the word "army". The p3 box branding ("K9 COMMANDO GEAR") must never be presented as ours.

---

## 1. Brand tokens

### 1.1 Identity
- **Name:** Puppy Platoon. The wordmark reads `PUPPY PLATOON` in Black Ops One with letter-spacing .04em. "PUPPY" is ink `#1F2A1C` and "PLATOON" is olive `#4B5D2A`. On dark backgrounds both are cream `#FBF6EC`. Height is 22px on mobile and 28px on desktop. `aria-label="Puppy Platoon home"`.
- **Logo mark** (`snippets/pp-logo-mark.liquid`, favicon `assets/pp-favicon.svg`): an olive dog tag (rounded rect 28×40, rx 10) with a cream hole and a cream paw print.
- **Tagline:** Tiny soldier. Huge laughs.
- **Mascot:** Sergeant Pup (§12).
- **Disclaimer** (footer, 12px): `Novelty pet costume for photos and fun. Not affiliated with or endorsed by any military organization.`
- The store name in Admin is still "Mağazam". That is an owner task. Until it changes, the theme hardcodes "Puppy Platoon" in the wordmark, `<title>` suffix and footer.

### 1.2 Colour tokens (`:root` in `assets/pp-base.css`)
```css
:root{
  --pp-bg:#FBF6EC;          /* page (warm sand) */
  --pp-surface:#FFFFFF;     /* cards, drawer, inputs */
  --pp-cream:#FFFDF8;       /* header, sticky bar, drawer panel */
  --pp-khaki:#EFE5CF;       /* alt sections, photo cards */
  --pp-ink:#1F2A1C;         /* text 13.9:1 on bg */
  --pp-muted:#55604E;       /* secondary text 6.2:1 on bg */
  --pp-olive:#4B5D2A;       /* brand: announcement, badges, selected states; white text 7.25:1 */
  --pp-olive-dk:#2F3A1F;    /* footer, trust strip */
  --pp-cta:#C2410C;         /* BUY ACTIONS ONLY; white text 5.18:1 */
  --pp-cta-dk:#9A3412;      /* hover, "boot" shadow */
  --pp-gold:#F2C14E;        /* highlights, progress, game; ink text only (8.9:1) */
  --pp-success:#15803D;     /* unlocked, protection on */
  --pp-alert:#B91C1C;       /* errors */
  --pp-navy:#1E3A5F;        /* flag accents only */
  --pp-line:#DCCFB4;        /* dividers only */
  --pp-line-strong:#8A7A5C; /* control borders (chips, inputs, selects, progress track) 3.9:1 */
  --pp-save-bg:#FFE3B8; --pp-save-ink:#7A3E00; /* "Save $x" chip */
  --pp-display:"Lilita One","Arial Rounded MT Bold","Arial Black",system-ui,sans-serif;
  --pp-body:"DM Sans",system-ui,-apple-system,"Segoe UI",sans-serif;
  --pp-stamp:"Black Ops One","Impact",system-ui,sans-serif;
  --pp-r-sm:8px; --pp-r-md:14px; --pp-r-lg:24px; --pp-r-pill:999px;
  --pp-gutter:16px; --pp-max:1200px;
  --pp-shadow:0 10px 30px rgba(31,42,28,.12);
}
@media (min-width:750px){:root{--pp-gutter:32px}}
```
Rules:
- Orange is only for ATC, sticky ATC, checkout, the bundle CTA and "Shop the Suit".
- Never put white text on gold.
- **Focus ring on light backgrounds:** `outline:3px solid var(--pp-ink);outline-offset:2px;box-shadow:0 0 0 6px var(--pp-gold)`. On olive backgrounds, use a gold outline.
- An orange button on an olive or ink background gets a 2px cream border.
- The camo SVG texture is allowed only as a decorative `::before` at 6–8% opacity, never behind body text.

### 1.3 Typography
- **Google Fonts:** keep the preconnects, then `https://fonts.googleapis.com/css2?family=Black+Ops+One&family=DM+Sans:wght@400;500;700&family=Lilita+One&display=swap`. Remove the `opsz` axis to cut bytes.
- **Horizon `settings_data.json`:** set `type_body_font: dm_sans_n4`, `type_subheading_font: dm_sans_n7`, `type_heading_font: dm_sans_n7` and `type_accent_font: dm_sans_n7`. This stops Inter from downloading and makes checkout use DM Sans.
- **Scale** (`clamp`, mobile → desktop ≥990px):

| Style | Size | Line-height | Font |
|---|---|---|---|
| H1 | 34 → 58px | 1.04 | Lilita One 400 |
| H2 | 27 → 42px | 1.1 | Lilita One |
| H3 | 20 → 24px | 1.2 | Lilita One |
| PDP price | 30 → 36px | 1 | Lilita One, `tabular-nums` |
| Body | 16 → 17px | 1.55 | DM Sans 400 |
| Small | 13 → 14px | 1.4 | DM Sans |
| Stamp | 12–13px, uppercase, .08–.1em | 1 | Black Ops One (≤3 words) |
| Button | 17 → 18px | 1 | DM Sans 700 |

- Line length stays at 60–68ch. Nothing smaller than 13px. Inputs are 16px.

### 1.4 Components
- **Primary button:**
  - `--pp-cta` background, white text. Height 56px on mobile and 52px on desktop. Radius 14px. Full width on the PDP on mobile.
  - Shadow `0 4px 0 var(--pp-cta-dk)`. `:active` moves `translateY(3px)` with shadow `0 1px 0`. Hover uses `--pp-cta-dk`.
  - Loading: `aria-busy`, spinner and "Adding…". Success: "Added ✓" on `--pp-success` for 1.2s.
- **Secondary button:** transparent with a 2px ink border, 48px tall.
- **Tertiary:** underlined ink link with a 3px offset.
- **Size chip:** 56×48 pill with a 2px `--pp-line-strong` border. Selected: olive background, white text and a check icon. Sold out: strikethrough, `aria-disabled="true"`, visible text "sold out".
- **Spacing:** 4px base. Sections are 48px padding on mobile and 96px on desktop. Gutter 16/32px.
- **Icons:** inline SVG, 24px, 2px stroke, `currentColor`, `aria-hidden="true" focusable="false"`. The set is truck, bolt, shield-check, ruler, scale, paw, gift, return, lock and camera. **No star icons.**
- **Motifs:**
  - Dog-tag badge: olive tag with cream stamp text. Labels: `SQUAD DEAL`, `BEST VALUE`, `MISSION`.
  - Embroidered patch: a 64px olive circle with a 2px dashed cream ring. Labels: `Soft plush arms`, `Adjustable straps`, `Sizes S–2XL`.
  - Masking-tape caption: gold background, ink text, rotated -2deg.
  - Paw-trail divider: 24px SVG.

---

## 2. Final copy: global

### 2.1 Announcement bar (olive, cream text, 13px/600, 36px tall, rotates every 4s, pauses on hover and focus, shows message 1 only under reduced motion)
1. `Free shipping on every order · Arrives in 5–7 business days`
2. `Express shipping with priority handling: only $2.55`
3. `Buy 2, save 15% · Buy 3+, save 25%`

The $2.55 figure is section-setting text and matches the Admin rate. Everything else is plain text.

### 2.2 Header
- Sticky, `--pp-cream` background, 1px `--pp-line` bottom border, 60px on mobile and 72px on desktop. It shows again when the visitor scrolls up and hides on scroll down after 200px, so fixed UI never takes more than 25% of the screen.
- **Desktop nav:** `Shop the Suit` (product) · `Size Guide` (/pages/size-guide) · `FAQ` (/pages/faq) · `Track Order` (/pages/track-order) · `Contact` (/pages/contact).
- **Mobile:** hamburger on the left, wordmark in the centre, cart on the right. The cart bubble is gold with ink text and counts **suits only**.
- No search, no country selector in the header, and no account icon on mobile.

### 2.3 Footer (`--pp-olive-dk` background, cream text)
- **Col 1, Puppy Platoon:** `Puppy Platoon makes one thing: a funny soldier costume for dogs. Made for big smiles and great photos. Questions? We reply to every email.`
- **Col 2, Shop:** Shop the Suit · Bundles (/products/puppy-soldier-clothes-suit#bundles) · Size Guide
- **Col 3, Help** (menu `footer`): FAQ · Size Guide · Track Order · Shipping Policy · Returns & Refunds · Contact
- **Col 4, Legal** (menu `footer-legal`): Privacy Policy · Terms of Service · Your privacy choices
- **Bottom row:** country selector (localization form; markets US and Worldwide, both USD), payment icons (`shop.enabled_payment_types`, at most 6), `© {{ 'now' | date: '%Y' }} Puppy Platoon`, then the disclaimer (§1.1).
- Social icons only appear once the accounts exist. No newsletter block.

### 2.4 SEO

| Page | Title | Meta |
|---|---|---|
| Home | `Puppy Soldier Dog Costume for Small Dogs \| Puppy Platoon` | `Camo soldier costume for dogs with plush arms and a soft toy rifle. Sizes S-2XL. Free shipping, 5-7 business days. 30-day returns.` |
| Product | `Puppy Soldier Dog Costume with Plush Rifle \| Puppy Platoon` | `Dress your dog as a tiny soldier. Helmet, vest, plush arms and a soft toy rifle. Sizes S-2XL. Free shipping in 5-7 business days.` |

- Use plain hyphens in SEO strings and en dashes (5–7) in visible copy.
- Social share image: Higgsfield image A cropped to 1200×630, or p1 as a fallback.

---

## 3. Homepage (`templates/index.json`, pp-* sections only)

**Order:** `pp-announcement` (header group) → `pp-header` (header group) → **1 hero → 2 explainer → 3 photos → 4 bundles → 5 sizer → 6 occasions → 7 trust → 8 faq → 9 final** → `pp-footer` (footer group). This matches the current `index.json` order.

Remove every default Horizon section (slideshow, featured collection, image-with-text, collage, blog, newsletter, "Talk about your brand").

### 3.1 Hero (`pp-hero`)
- **Layout:**
  - Mobile: image first (4:5, full width, 16px radius, `loading="eager" fetchpriority="high"`), then the copy below with 20px padding.
  - Desktop: 55/45 columns with the image on the left.
  - Image: Higgsfield studio image A if it passes the check in §15, otherwise p1.
  - Sergeant Pup sits after the `<img>` in the DOM, absolute at bottom-left 8px. Sizes are 80, 112 and 140px. The bubble is hidden under 750px. `data-sp-ctx="hero" data-sp-on-view="salute"`.
- **Copy:**
  - Eyebrow (stamp): `Dog costume · Sizes S–2XL`
  - H1: `Turn your dog into a tiny soldier.`
  - Sub: `A camo soldier costume with a helmet, vest and plush arms that hold a soft toy rifle. From the front, your dog looks like it's standing on duty.`
  - Price row: `{{ product.price | money_without_trailing_zeros }}`, plus the pill `Free shipping` (olive text on `#E6EDD8`), plus the link `Save up to 25% with Squad bundles` (→ product `#bundles`).
  - Primary CTA (orange): `Shop the Suit · {{ product.price | money_without_trailing_zeros }}`, `data-pp-cta="hero"`.
  - Secondary link: `Not sure of the size? Find it in 10 seconds →` (→ `#size-finder`)
  - Trust row (13px, with icons): `Free 5–7 day shipping` · `30-day returns` · `Secure checkout`
- **Sold-out state:** if the product is unavailable, the CTA reads `Sold out` and is styled as disabled.
- **Hero mascot lines** (rotate once, then stop):
```json
["Ten-hut! This suit turns dogs into tiny soldiers.","Plush arms up front. Your pup looks like it's standing guard.","Sizes S to 2XL. Pick by weight with the size chart.","Free standard shipping. Arrives in 5–7 business days.","The rifle is a plush toy. Not a real or replica weapon.","I salute on command. Tap me!"]
```

### 3.2 What's in the suit (`pp-explainer`)
- **H2:** `Everything in one set`
- **Tiles:** inline SVG icons at 40px. 2×3 on mobile; on desktop 5 in a row plus a p3 thumbnail.
  1. `Camo helmet + headset`
  2. `Tan vest with flag patches`
  3. `Camo sleeves + plush arms`
  4. `Plush toy rifle (soft fabric, not a real or replica weapon)`
  5. `Camo pants`
- **p3 caption:** `What's in the set. Shown on a display form. Packaging may differ.`
- **Strip H3:** `Suit up in 3 steps`
  1. `Pick a size` / `Use your dog's weight and chest. Our size finder makes it quick.`
  2. `Dress your pup` / `Slip on the suit, close the straps, add the helmet.`
  3. `Take the photo` / `Grab your phone. Your feed gets a new recruit.`

### 3.3 Photo strip (`pp-photos`)
- **Layout:** a scroll-snap row on mobile (4:5 cards at 78% width with a peek of the next card; overflow on the row only). A 4-column grid on desktop.
- **H2:** `Reporting for duty`
- **Sub:** `Two fit examples from our size chart: Milo, a 6 lb Chihuahua, wears S. Louie, a 22 lb French Bulldog, wears M.`
- **Cards** (masking-tape captions):
  - p4: `Milo · 6 lb Chihuahua · Size S`
  - p5: `Louie · 22 lb French Bulldog · Size M`
  - p1: `Dachshund on patrol`
  - p7: `Dress the whole squad`
- **CTA:** `Get the suit →`. No stars, no review counts.

### 3.4 Bundles teaser (`pp-bundles`, `id="bundles"`)
- **H2:** `Got more than one pup? Suit up the squad.`
- p7 image above the cards on mobile and to the left on desktop. Alt: `Three small dogs in matching soldier costumes walking across a living room`.
- **Cards:** stacked on mobile, 3 columns on desktop. The 3-suit card has an olive 2px border and a `BEST VALUE` dog-tag. Prices are computed in Liquid in cents from `product.price`.
  - `Recruit` · `1 suit` · `$42.00`
  - `Battle Buddies` · `2 suits` · `$71.40` · ~~`$84.00`~~ · chip `Save $12.60` · `Two dogs? Or one for a friend's pup.`
  - `The Squad` · `3 suits` · `$94.50` · ~~`$126.00`~~ · chip `Save $31.50` · `$31.50 each`
- **Card CTA:** `Choose` → `/products/puppy-soldier-clothes-suit?bundle=1|2|3`, with `data-pp-cta="bundle-N"`. The PDP preselects the bundle from that query param.
- **Note:** `Mix sizes freely. Savings apply automatically in your cart. 4+ suits? Every suit stays 25% off.`
- Struck prices get the screen-reader text `Price if bought one at a time: $84.00`.

### 3.5 Size finder (`pp-sizer`, `id="size-finder"`)
- **Layout:** a khaki band. Desktop has two columns: a crop of p4 on the left and the tool on the right.
- **H2:** `Find your dog's size in 10 seconds`
- **Inputs:**
  - `Your dog's name (optional)`: a text input with maxlength 20, stored in localStorage `pp_name` and inserted with `textContent` only.
  - `Weight`: number input, `inputmode="decimal"`, with an lb/kg toggle (kg × 2.2046).
  - `Chest (optional)`: with an in/cm toggle (cm ÷ 2.54).
  - Breed chips are a quick-fill helper. Each one fills in a typical weight: Chihuahua 5, Yorkie 6, Pomeranian 6, Dachshund 11, Shih Tzu 12, Pug 16, French Bulldog 22, Beagle 24.
- **Logic** (data from `snippets/pp-size-data.liquid`, mode `json`):
  - weightSize = the first row where `weight <= max`. Maxes: S 12, M 22, L 35, XL 60, 2XL 90.
  - chestSize = the first row where `chest <= chestMax`. Maxes: 17, 21, 25, 30, 34.
  - result = the larger of the two.
  - Weight above 90 or chest above 34: `This suit fits dogs up to about 90 lb. It may be too small for your pup.` No CTA.
  - Weight below 5: show S with `Very small pups may find S roomy. Check the chest size.`
  - Empty or invalid input: inline error `Enter your dog's weight`, with `aria-invalid` and focus on the field.
  - Edge note, shown when the weight is within 1 lb of the row max or inside the XL/2XL overlap (55–60): `On the edge? If your dog is deep-chested or fluffy, go one size up to {next}.`
- **Output:** `{name}'s size: M`, or `Your size: M` without a name. Then the CTA `Get size M · $42` → `{{ variant.url }}` with `data-pp-cta="size-result"`. The result is saved to localStorage `pp_size`, and the PDP preselects it.
- **Weight ruler (SVG):** a bar from 0 to 90 lb in 5 segments, with pins `Milo 6 lb → S` and `Louie 22 lb → M`. A "You" pin moves with the input.
- **Checks:** 6 lb gives S, 22 lb gives M with the edge note offering L, 57 lb gives XL with the edge note offering 2XL, and 95 lb gives the "too big" message.

### 3.6 Occasions (`pp-occasions`)
- **H2:** `Made for the moments you'll photograph`
- **Cards:** horizontal chips on mobile, 3×2 on desktop, olive icons on `#E6EDD8` tiles, no emoji.
  - `Halloween` / `The costume people ask about all night.`
  - `4th of July` / `Flag patches already on the vest.`
  - `Birthdays & dog parties` / `The party outfit for the birthday pup.`
  - `Photos & short videos` / `Easy content. Just press record.`
  - `Holiday cards` / `Your holiday card photo, sorted.`
  - `Gift for a dog lover` / `A gift that makes them laugh first.`
- **CTA:** `Shop the Suit`
- **Honest seasonal line** (JS, §8.3). Show the next event whose order-by date is today or later and no more than 60 days away. Otherwise hide it. Text: `Order by {Fri, Dec 11} for estimated delivery before {Christmas} with free standard shipping.` On 2026-10-22 the Halloween cutoff (Oct 19) has passed, so Christmas shows from Oct 12 onward, with order-by Fri, Dec 11.

### 3.7 Trust strip (`pp-trust`, olive-dk with cream text)
- 2×2 plus 1 on mobile, one row on desktop. Icons 28px, labels 14px/600:
  - `Free shipping · 5–7 business days`
  - `Express shipping · $2.55`
  - `Package protection · $3, optional`
  - `30-day returns`
  - `Secure checkout`
- Each item links to the matching policy.

### 3.8 FAQ (`pp-faq`, `id="faq"`)
- `<details>` items with a 56px minimum tap height, max width 760px.
- FAQPage JSON-LD built from the same strings (§11).
- Show the first 8 on the homepage and all 12 on `/pages/faq`.

### 3.9 Final CTA (`pp-final`, olive background, cream text)
- p5 at full width on mobile and on the right on desktop.
- Sergeant Pup at 120/160px, salutes on view (`data-sp-on-view="salute"`), with the line `Reporting for cuteness duty!`
- **H2:** `Ready for the cutest salute on your street?`
- **Sub:** `{price} · Sizes S–2XL · Free 5–7 day shipping · 30-day returns`
- **Button** (orange with a 2px cream border): `Shop the Suit`, `data-pp-cta="final"`.
- **Mobile home sticky bar** (optional P2):
  - 64px tall plus the safe area. Contents: p2 thumbnail, price and `Shop the Suit`.
  - Appears after the hero CTA leaves the viewport. Hides at the footer and while the drawer is open.

---

## 4. Product page (`templates/product.json`: `pp-product`, `pp-trust`, `pp-game` or game inside pp-product, `pp-faq`)

### 4.1 Product data (Admin)
- **Title:** `Puppy Soldier Dog Costume`. The handle stays.
- **Option 2:** delete it ("Color: Puppy Soldier Clothes Suit"). Size order: S, M, L, XL, 2XL.
- **Description** (`descriptionHtml`):
```html
<p><strong>Meet your new recruit.</strong></p>
<p>This is a soldier costume for dogs. It comes with a camo helmet with an ear-muff headset and mic, a tan vest with US flag patches, camo sleeves and camo pants.</p>
<p>Two plush arms attach to the front and hold a soft plush toy rifle. From the front, your dog looks like it is standing up on patrol. Underneath, your dog stands and walks on four legs as usual.</p>
<ul>
<li><strong>In the set:</strong> helmet with headset, vest, sleeves with plush arms, pants, plush toy rifle.</li>
<li><strong>Material:</strong> soft fabric with plush-stuffed arms and rifle.</li>
<li><strong>Fit:</strong> adjustable straps. Check the size chart before you order.</li>
<li><strong>Care:</strong> hand wash cold with mild soap. Air dry flat.</li>
<li><strong>Safety:</strong> always supervise your dog while it wears a costume. Remove the helmet if your dog paws at it. Not a chew toy.</li>
</ul>
<p>The rifle is a plush toy made of soft fabric. It is not a real or replica weapon.</p>
```
- **Tag:** `pp-main`.

### 4.2 Layout and order
- One column under 990px. At 990px and up, the gallery takes 58% and the buy box 42%, with the buy box `position:sticky; top:88px`.

1. **Gallery**
   - **Mobile:** a scroll-snap track (1:1, `object-fit:cover`, khaki background) with dots underneath (active dot is a 22px olive pill). Counter chip "1/6". A 64px thumbnail strip with a gold active border.
   - **Desktop:** a 72px thumbnail rail on the left. Arrow keys work.
   - Thumbnails are plain `<button>`s with `aria-label="Show photo N of M"` and `aria-current="true"` on the active one. They do not use `role="tab"`.
   - Tapping an image opens a fullscreen `<dialog>` lightbox with swipe and Esc.
   - **Image order:** p1, p4, p5, p7, p3 (HTML caption "Shown on a display form. Packaging may differ."), p2, then an HTML card: ruler icon + `Not sure of the size? Measure in 30 seconds →`, which opens the size dialog.
   - **Image 1 chip** (top-left, HTML): `Plush toy rifle · soft fabric`
   - **Image loading:** `widths: '360, 540, 720, 948'` with `sizes="(min-width: 990px) calc(56vw - 48px), calc(100vw - 32px)"`. Only image 1 is eager with `fetchpriority="high"`. The others are lazy with `decoding="async"` and have width and height set.
2. **Eyebrow** (stamp, olive): `PUPPY PLATOON`
3. **H1:** `{{ product.title }}`. **Subline:** `Your dog, standing at attention. Helmet, vest, plush arms and a soft toy rifle in one suit.`
4. **Price row** (`aria-live="polite"`):
   - The live total for the selected bundle. When 2 or more are selected, add `· $35.70 each`.
   - Under it: `Free 5–7 day shipping · Ships worldwide`
   - Show a compare-at price only when `variant.compare_at_price > variant.price` (none exists, and none should be created).
5. **Honest review line:** `New drop. Be one of the first squads to wear it.` (→ `#pp-reviews`)
6. **Kit chips** (4, 36px icons): `Camo helmet + headset` · `Flag-patch vest` · `Plush arms + toy rifle` · `Camo pants`
7. **Bullets** (check icon):
   - `Full camo soldier outfit: helmet with headset, vest, sleeves and pants`
   - `Plush front arms create the "standing up" look`
   - `Soft plush toy rifle. Not a real or replica weapon`
   - `Sizes S to 2XL for dogs from about 5 to 90 lb`
   - `Free shipping, arrives in 5–7 business days`
8. **Size selector** (`<fieldset data-pp-sizes><legend>Size: <span>Choose</span></legend>`)
   - 5 radio pills, at least 56×48px. **No default selection**, unless `?variant=` is in the URL, `pp_size` is in localStorage, or there is a single available variant.
   - **Hint under the pills** (`aria-live="polite"`):
     - Before a size is chosen: `Not sure? Milo, a 6 lb Chihuahua, wears S. Louie, a 22 lb Frenchie, wears M.` followed by the link `Size guide`.
     - After a size is chosen: `M · 12–22 lb · chest 17–21 in · e.g. French Bulldog, Pug, Shih Tzu`
   - **Sold out:** the pill is crossed out but still focusable. Selecting it shows `M is sold out. Try L.` and the ATC reads `Sold out`.
   - **Find my size** (inline `<details>`): `Not sure? Find my size in 10 seconds`. It uses the same logic as §3.5 and ends with a `Select M` button that checks the radio and scrolls back up.
   - **Size guide `<dialog>`** (`id="size-guide"`, opened by the link and by the gallery card): the §5 table, the measurement SVG and the note.
9. **Bundle selector** (`<fieldset id="bundles" data-pp-bundles><legend>Pick your squad</legend>`): three radio tiles (§6.1), default 1 suit. When 2 or 3 is chosen, per-suit size rows appear (`Suit 1`, `Suit 2`, `Suit 3`). Each row defaults to the main size. Helper: `Mix sizes freely. Savings apply automatically in your cart.`
10. **ATC button** (`data-pp-atc`, orange, full width)
    - **Labels:**
      - No size: `Choose your size`. A tap focuses the fieldset, gives it a 600ms olive pulse and announces "Pick a size first".
      - 1 suit: `Add to cart · $42.00`
      - 2 suits: `Add 2 suits · $71.40`
      - 3 suits: `Add 3 suits · $94.50`
      - Sold out: `Sold out` (disabled)
      - Busy: `Adding…`
      - Done: `Added ✓`, then the drawer opens.
    - **Error:** an inline `role="alert"` under the button showing the server's `description`. Focus moves there, and the selection is kept.
11. **Delivery estimate** (truck icon, `aria-live="polite"`):
    - Line 1: `Free delivery: arrives Fri, Oct 30 – Wed, Nov 4 (estimate)`, calculated as described in §8.3.
    - Line 2: `Express at checkout: priority handling + tracking, $2.55.`
    - Without JS: `Free shipping · 5–7 business days`.
12. **Game teaser link:** `Play Treat Drill for 10% off ↓` (`data-td-open`)
13. **Trust row** (3 columns of icon + 12px label): `Free 5–7 day shipping` · `30-day returns` (→ `shop.refund_policy.url`) · `Package protection available`
14. **Sergeant Pup bubble** (64px, `data-sp-ctx="pdp"`, §12.5). It never sits above the ATC.
15. **Accordions** (`<details>`, the first one open):
    - `What you get`: the kit list and plush rifle line from the description.
    - `Sizing & fit`: the §5 table, `How to measure`, and the Milo and Louie examples.
    - `Shipping & delivery`: `Free standard shipping: 5–7 business days. Express shipping: $2.55, priority handling and tracking, 5–7 business days. Orders ship within 1–2 business days. Tracking link by email. We ship to the US and worldwide. Prices in USD. Duties outside the US may apply.`
    - `Returns`: `Our 30-day promise. If the suit does not fit or your dog does not love it, return it within 30 days of delivery. Unused and unwashed, in original packaging. Wrong size? Ask for an exchange.` followed by the link `Full refund policy`.
    - `Care & safety`: `Hand wash cold with mild soap. Air dry flat. Do not tumble dry or iron. Always supervise your dog while it is dressed up. Remove the helmet if your dog paws at it. Not a chew toy.`
16. **Reviews placeholder** (`id="pp-reviews"`):
    - H2 `Squad photos`.
    - Body: `No reviews yet. Got your pup suited up? Email us a photo and it could be featured here.` followed by a mailto link to `{{ shop.email }}`.
    - Render stars only if `product.metafields.reviews.rating` exists and its count is at least 1.
17. **Treat Drill card** (§13)
18. **Trust strip** (§3.7), then the **FAQ** (§11)
19. **Cross-sell:** hidden at launch. Use the recommendations API and exclude the tag `pp-hidden`. Never render an empty heading.

### 4.3 Product page edge cases
- **Whole product unavailable:** the ATC reads `Sold out`, the game is not rendered, and a contact form `Email me when it's back` posts with tag `restock`.
- **No JS:**
  - A `<noscript>` form `action="/cart/add"` with `<select name="id">` (size names) and a quantity input from 1 to 3.
  - Accordions work natively.
  - The sticky bar and game are not rendered.
- **Query params:** `?bundle=N` preselects a tile. `?variant=ID` preselects a size.
- **Never output:** the protection product, `variant.title` (use `option1`), dynamic checkout buttons or Horizon's sticky block.

---

## 5. Size guide (single source: `snippets/pp-size-data.liquid`)

| Size | Weight | Chest | Neck | Back | Typical breeds |
|---|---|---|---|---|---|
| S | 5–12 lb | 14–17 in | 10–12 in | 9–12 in | Chihuahua, Yorkie, Maltese, Mini Dachshund |
| M | 12–22 lb | 17–21 in | 12–15 in | 12–15 in | French Bulldog, Pug, Shih Tzu, Dachshund |
| L | 22–35 lb | 21–25 in | 15–18 in | 15–18 in | Corgi, Beagle, Cocker Spaniel |
| XL | 35–60 lb | 25–30 in | 18–21 in | 18–22 in | Bulldog, Border Collie, Pit Bull |
| 2XL | 55–90 lb | 29–34 in | 21–24 in | 22–27 in | Labrador, Golden Retriever, Boxer |

- **Note under the table:** `Measure your dog, not the fur. Chest = widest part behind the front legs. Back = base of neck to base of tail. Between sizes? Size up. Breeds are a rough guide only.`
- **Examples:** `Milo is a 6 lb Chihuahua. He wears S. Louie is a 22 lb French Bulldog. He wears M.`
- **Contact line:** `Still unsure? Email us your dog's weight, chest and breed. We reply with the right size.`
- The table is live HTML. Never use `sizechart.jpg`. Draw a measurement SVG (side silhouette with Neck, Chest girth and Back length lines).

---

## 6. Offers, bundles and discounts

### 6.1 Bundle tiles (PDP)
- **Tile style:** min height 76px, radius 14px, 1.5px `--pp-line-strong` border, `--pp-cream` background.
- **Selected tile:** 2px olive border, `#F1EEDC` background, olive radio dot.
- **Save chip:** `--pp-save-bg` with `--pp-save-ink`, 12px/700.
- **Best value ribbon:** olive background, white text, 11px uppercase.
- **Struck price:** `#8A8676` with screen-reader text.

| Value | Name | Total | Struck | Each | Chip | Helper |
|---|---|---|---|---|---|---|
| 1 | Recruit | $42.00 | – | $42.00 each | – | – |
| 2 | Battle Buddies | $71.40 | $84.00 | $35.70 each | Save $12.60 | Two dogs? Or one for a friend's pup. |
| 3 | The Squad | $94.50 | $126.00 | $31.50 each | Save $31.50 + ribbon `Best value` | – |

- **Under the tiles:** `4+ suits? Every suit stays 25% off.`
- **Money math in integer cents:** `total(k) = Math.round(k * p * (1 - r(k)))` with `r(1)=0`, `r(2)=.15`, `r(≥3)=.25`. Format with `PP_CFG.moneyFormat`. Never hardcode amounts.
- **Add to cart:**
  - Group the suit rows by variant and make one `POST /cart/add.js` with `{items:[{id,quantity}]}`.
  - Use **no line-item properties**, so lines merge and quantity discounts apply.
  - After the add, trust `/cart.js`.

### 6.2 Admin discounts (create, then verify with a query)
**A. Automatic discount, 2 suits:**
```graphql
mutation($d: DiscountAutomaticBasicInput!){ discountAutomaticBasicCreate(automaticBasicDiscount:$d){ automaticDiscountNode{id} userErrors{field code message} } }
```
```json
{"d":{"title":"Battle Buddies: 15% off 2 suits","startsAt":"2026-10-22T00:00:00Z","context":{"all":"ALL"},
"customerGets":{"value":{"percentage":0.15},"items":{"products":{"productsToAdd":["gid://shopify/Product/15436873138424"]}}},
"minimumRequirement":{"quantity":{"greaterThanOrEqualToQuantity":"2"}},
"combinesWith":{"productDiscounts":false,"orderDiscounts":true,"shippingDiscounts":true}}}
```
**B. Automatic discount, 3+ suits:** identical except `"title":"Squad: 25% off 3+ suits"`, `"percentage":0.25` and `"greaterThanOrEqualToQuantity":"3"`. A and B never stack (`productDiscounts:false`), so Shopify applies the best one: 25% at 3 or more.

**C. Code TREAT10:**
```graphql
mutation($d: DiscountCodeBasicInput!){ discountCodeBasicCreate(basicCodeDiscount:$d){ codeDiscountNode{id} userErrors{field code message} } }
```
```json
{"d":{"title":"TREAT10: Treat Drill reward","code":"TREAT10","startsAt":"2026-10-22T00:00:00Z","context":{"all":"ALL"},
"customerGets":{"value":{"percentage":0.10},"items":{"all":true}},
"minimumRequirement":{"subtotal":{"greaterThanOrEqualToSubtotal":"35.00"}},
"appliesOncePerCustomer":true,
"combinesWith":{"productDiscounts":true,"orderDiscounts":false,"shippingDiscounts":true}}}
```
- This is an order discount, so it stacks on A or B. It takes 10% off the $3 protection line too (−$0.30), which is accepted.
- No end date and no usage cap.
- **Stacked totals:**

| Suits | With TREAT10 |
|---|---|
| 1 | $37.80 |
| 2 | $64.26 |
| 3 | $85.05 |

- **Margin guard (owner):** 3 suits with TREAT10 works out to $28.35 per suit. If CJ's landed cost per suit is above about $17, change B to 20% and update `PP_CFG.tiers` and every copy string that says 25%.
- **No other public codes.** Compare-at prices stay empty on every variant.

### 6.3 Honest urgency
- Order-by dates are computed from shipping days (§8.3). Dates only, never a seconds countdown, never a resetting timer, never stock counts.
- **Events config:**
```js
[{n:'Christmas',d:'2026-12-25'},{n:'4th of July',d:'2027-07-04'},{n:'National Dog Day',d:'2027-08-26'},{n:'Halloween',d:'2027-10-31'}]
```

---

## 7. Cart drawer, package protection, sticky ATC

### 7.1 Wiring
- `layout/theme.liquid` already renders `{% render 'pp-cart-drawer' %}` instead of Horizon's drawer. Keep it that way and skip it on `template.name == 'cart'`.
- `/cart` uses `sections/pp-cart-page.liquid`, which renders the same markup inline (`mode: 'page'`).
- **Opening the drawer:**
  - One capture-phase click listener matches `a[href$="/cart"], .action__cart, [data-pp-cart-open]`.
  - It skips the click when a modifier key is held or the button is not the main button. Otherwise it calls `preventDefault()` and `PPCart.open(trigger)`.
  - It sets `aria-haspopup="dialog" aria-controls="pp-cart"` on the trigger.
- **Cart bubble:**
  - Server render: `pp_count = cart.item_count - protection qty`, assigned before the bubble markup.
  - Client: update the bubble after every render. If Horizon's `cart-icon` is present, dispatch Horizon's `CartLinesUpdateEvent` with `item_count: visibleCount`.
- **Routes:** `(window.Shopify?.routes?.root || '/') + 'cart/add.js'`.
- **Config** (`snippets/pp-config.liquid` → `window.PP_CFG`):
```liquid
{%- liquid
  assign pp_main = all_products['puppy-soldier-clothes-suit']
  assign pp_prot = all_products['package-protection']
  assign pp_prot_variant = pp_prot.selected_or_first_available_variant
-%}
<script>
  window.PP_CFG = {
    moneyFormat: {{ shop.money_format | strip_html | json }},
    currency: {{ cart.currency.iso_code | json }},
    locale: {{ request.locale.iso_code | json }},
    mainProductId: {{ pp_main.id | default: 0 | json }},
    productUrl: {{ pp_main.url | default: '/' | json }},
    productImage: {{ pp_main.featured_image | image_url: width: 160 | json }},
    protectionVariantId: {{ pp_prot_variant.id | default: 0 | json }},
    protectionPrice: {{ pp_prot_variant.price | default: 300 | json }},
    tiers: [{ qty: 2, pct: 15 }, { qty: 3, pct: 25 }], /* MUST match Admin automatic discounts */
    maxQty: 10,
    ship: { procMin: 1, procMax: 2, min: 5, max: 7, expressCents: 255 },
    gameCode: 'TREAT10',
    email: {{ shop.email | json }},
    shippingPolicyUrl: {{ shop.shipping_policy.url | json }},
    refundPolicyUrl: {{ shop.refund_policy.url | json }},
    variants: [
      {%- for v in pp_main.variants -%}
        { id: {{ v.id }}, size: {{ v.option1 | json }}, available: {{ v.available | json }}, price: {{ v.price | json }} }{% unless forloop.last %},{% endunless %}
      {%- endfor -%}
    ]
  };
</script>
```

### 7.2 Drawer UX (native `<dialog id="pp-cart" aria-labelledby="pp-cart-title">`, `showModal()`)
- **Panel:**
  - Slides in from the right. Width `min(92vw, 420px)`, height `100dvh`, `--pp-cream` background, 16px left radius. Backdrop `rgba(20,24,14,.55)`.
  - Opens with `translateX(100%)→0` over 280ms, `cubic-bezier(.2,.8,.2,1)`. Closes in 200ms. Reduced motion uses a 120ms fade.
  - Rows: header, progress, scrolling body, sticky footer. The footer stops being sticky below 520px of viewport height.
  - Scroll lock: `html.pp-lock{overflow:hidden}`.
  - Esc (the `cancel` event) closes with the animation. Clicking the backdrop closes. Focus returns to the trigger.
- **Header (56px):** `Your cart`, a count chip (suits only), and a 44×44 close button labelled `Close cart`.
- **Bundle progress** (sticky under the header, khaki background):
  - Three nodes, each with chevron icons (1, 2 and 3 chevrons): `1 suit · Free shipping`, `2 suits · 15% off`, `3 suits · 25% off`.
  - Track 8px `#E6DFCB` with a 1px `--pp-line-strong` border. Olive fill, `scaleX(min(n,3)/3)` using transform only.
  - `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=3`, `aria-valuenow=n` and `aria-valuetext` set to the message.
  - Messages (amounts from `/cart.js`):
    - n=1: `Free shipping unlocked. Add 1 more suit and save 15% on both.`
    - n=2: `15% off unlocked: you save {saved}. Add 1 more for 25% off all 3.`
    - n≥3: `Squad deal unlocked: 25% off every suit. You save {saved}.`
  - **When a tier is reached:** the node scales 1→1.15→1 over 300ms, the live region says `15% off unlocked`, and `pp:milestone {tier}` is dispatched. Sergeant Pup gets "promoted".
  - **When the quantity drops a tier:** toast `Add 1 more suit to get your 15% back.` The action is never blocked.
  - The Sergeant Pup peek sits inside this card (`.sp-peek`). The card has `position:relative; overflow:hidden; padding-inline-end:76px`.
- **Line item:**
  - 80×80 image (radius 12, khaki background, `&width=160`).
  - Title 15px/600, clamped to 2 lines, linking to `?variant=`.
  - **Size select** `Size: M ▾`, built from `options_with_values` (never `variant_title`). Changing it is one atomic call: `POST /cart/update.js {updates:{[old]:0,[new]:existingQtyOfNew+qty}}`.
  - **Price:** `final_line_price` in bold. If it is lower than `original_line_price`, show the original struck through (13px `#6B6F5E`) and a badge with `line_level_discount_allocations[0].discount_application.title` (11px uppercase, khaki on olive).
  - **Stepper:** 32px visible with a 44px hit area. `−` is disabled at 1 and `+` at `maxQty`. Labels: `Decrease quantity, size M` and `Increase quantity, size M`.
  - **Remove:** the link `Remove`. The line is replaced by `Size M suit removed. Undo` for 6 seconds. Undo re-adds the suit and never re-adds protection.
- **Upsell card** (dashed 1.5px `#D8C49B` border, radius 14, shown only when n is 1 or 2):
  - n=1: `Got a second pup?` / `Add another suit in any size. Both suits drop to $35.70 each.`
  - n=2: `Make it a squad of 3` / `A 3rd suit takes 25% off all three.`
  - **Size chips:** native radios in a fieldset with a hidden legend `Size for extra suit`. No preselection. Sold out sizes are disabled. Sizes already in the cart get the tag `in cart`.
  - **Button:** disabled `Pick a size`, then `Add size L · +$29.40` (n=1) or `Add size L · +$23.10` (n=2). The figure is `total(n+1) − total(n)` in cents from `PP_CFG.tiers`.
  - Link: `Not sure? Size guide` → `productUrl#size-guide`.
- **Package protection row** (top of the footer; 1px `#E3DACA` border, radius 12, 24px shield icon):
  - `<input type="checkbox" role="switch" id="pp-protect">` with label `Package protection · $3.00` (from config, via money format).
  - Sub (13px): `Free replacement if your package is marked delivered but goes missing, or arrives damaged. Optional. One price per order.`
  - A `What's covered?` button (`aria-expanded`) opens an inline panel:
    > Optional. $3.00 per order, not per item. If your package is marked delivered but goes missing, or arrives damaged, email {shop.email} within 14 days of delivery with your order number (and a photo if damaged). We send a free replacement. Lost in transit is always covered by our Shipping Policy, with or without protection. This is our own guarantee, not insurance. Remove it anytime before checkout. **Shipping Policy** link.
  - **Rules:**
    - Off by default in every market. Never auto-added. Never re-added after an auto-removal or an Undo.
    - On: `add.js {id:prot, quantity:1}`. Off: `change.js` quantity 0.
    - The switch is disabled with `aria-busy` while the request runs. On error it reverts and shows the error.
    - Live announcements: `Package protection added, $3.00` and `Package protection removed`.
    - It never renders as a line item. It is excluded from the count, bubble, progress and upsell math.
    - `syncProtection()` runs after every render. If n=0 and protection is present, remove it. If its quantity is above 1, set it to 1. Only one fix runs at a time.
    - Removing the last suit while protection is on is one call: `update.js {updates:{[suit]:0,[prot]:0}}`.
    - Fires `pp:protection {on}`. Sergeant Pup salutes only on "on". There is no guilt copy on "off".
- **Summary rows:**
  - `Bundle savings` −`{sum of suit line discounts}` in success green, shown only when above 0.
  - Code row from `cart.cart_level_discount_applications`: `TREAT10 −$x.xx`. If `cart.discount_codes[].applicable` is false: `TREAT10 needs a $35+ order`.
  - `Protection` `$3.00`, only when it is on.
  - `Shipping` `FREE`, with the sub `Standard 5–7 business days. Express $2.55 at checkout.`
  - `Estimated delivery` `{Fri, Oct 30 – Wed, Nov 4}` (§8.3).
  - `Total` = `total_price`, 20px/800. Under it: `Taxes and duties, if any, calculated at checkout.`
- **Checkout:**
  - `<form action="{{ routes.cart_url }}" method="post"><button name="checkout">`. Orange, 56px, radius 14, lock icon.
  - Label: `Secure checkout · {total}`.
  - On submit, `await PPCart.idle()` with a spinner. If TREAT10 has been won and is not applied, the fallback is `?discount=TREAT10` appended to `/checkout`.
- **Trust row (12px muted):** `Secure checkout` · `Free 5–7 day shipping` · `30-day returns` (links to the refund policy). Then payment icons, 20px tall.
- **Empty state:** Sergeant Pup at full size (96px), centred. `Your cart is empty.` / `Your pup is still out of uniform.` / button `Shop the Suit` / `Free 5–7 day shipping on every order.` The progress bar, upsell and protection row are hidden.
- **Errors:**
  - Generic: `Something went wrong. Please try again.`
  - Network: `Couldn't update your cart. Check your connection and try again.`, then a refresh.
  - A 422 restores the old quantity and shows the server `description`.
  - A 429 is retried once after 1s.

### 7.3 Add-to-cart flow
1. The button gets `aria-busy` and the label `Adding…`.
2. `POST cart/add.js` (JSON).
3. On a 422, show `description` in the `role="alert"` under the ATC and do not open the drawer.
4. Otherwise `GET cart.js` (`cache:'no-store'`), render, `syncProtection()`. If `localStorage.pp_td_won` is set, call `window.ppTreatDrill?.apply()`; when that function is absent, `POST cart/update.js {discount:'TREAT10'}`.
5. Open the drawer (not in the theme editor) and focus the close button. Announce `Added {n} suit(s), size M. Cart has {visibleCount} items.`
6. The ATC shows `Added ✓` for 1.2s. Dispatch `pp:cart:added {qty,size}`.
7. If the response is HTML (bot check), fall back to a native form POST.

### 7.4 JS architecture and race conditions
- **`window.PPCart` API:** `refresh`, `add(items)`, `change(key, qty)`, `swap(oldId,newId,qty)`, `setProtection(on)`, `applyCode(code)`, `open(trigger)`, `close()`, `idle()`.
- **One promise queue for all writes.** Each response carries a revision number, and only the newest revision renders.
- **Stepper:**
  - The quantity updates on screen immediately.
  - After a 400ms pause, one `change.js` call per line is queued, using the latest line key (or matching by variant_id).
  - Totals dim to .5 with `aria-busy` until the server answers.
- **Refresh triggers:** `pageshow` (persisted), `visibilitychange` back to visible, and foreign `shopify:cart:lines-update`.
- **Safety:** product strings are inserted with `textContent` only. Money is formatted with `PP_CFG.moneyFormat`. Discounts are never computed for the summary.

### 7.5 Sticky ATC (`data-pp-sticky`, `<aside aria-label="Quick add to cart">`)
- **Show** when an IntersectionObserver on `[data-pp-atc]` reports `!isIntersecting && boundingClientRect.top < 0`. Slide `translateY(110%)→0` over 240ms.
- **Hide** when any of these is true:
  - The drawer is open (`pp:cart:open`).
  - A dialog is open (`pp:overlay:open`).
  - The keyboard is up (`visualViewport.height < innerHeight*.75`).
  - The main ATC is visible.
  - The game is being played (`html.pp-td-playing`).

  While hidden it has `inert` and `aria-hidden="true"`.
- **Mobile (<750px):**
  - Bottom bar, `--pp-cream` background, 1px `#E3DACA` top border, shadow `0 -6px 20px rgba(30,36,22,.12)`, padding `10px 12px calc(10px + env(safe-area-inset-bottom))`.
  - Row:
    - 44px thumbnail (radius 8), hidden under 380px.
    - Native size select, 96×48: `Size M ▾`, with sold-out options showing `XL (sold out)` and disabled.
    - Orange button, flex 1, 48px tall, radius 12, 16px/700, with the same labels as the main ATC.
- **Desktop (≥750px):**
  - Floating bar, max width 880px, centred, 20px from the bottom, radius 16, shadow `0 12px 32px rgba(30,36,22,.18)`.
  - Contents:
    - 56px thumbnail.
    - `Puppy Soldier Dog Costume` with `Free 5–7 day shipping · 2+ suits save 15%` under it.
    - Size select, price and button.
- **Layout reserve:** always keep `padding-bottom: calc(76px + env(safe-area-inset-bottom))` on `.template-product`, so nothing jumps when the bar appears. Add `html{scroll-padding-bottom:96px}` on the PDP.
- **State:** the product section owns it through `window.PP.pdp`:
  - `getSelection()` returns `{items, label, priceCents, ready, soldOut, qty}`.
  - `setSize(size)` and `submit({source})` are the other two methods.
  - Changes are broadcast with `pp:pdp:change`.
  - Mixed sizes replace the select with the text `Squad of 2 · S + M`.
- **Button behaviour:**
  - No size chosen: `Choose your size`. A tap focuses the sticky select and calls `showPicker()` in a try/catch.
  - Otherwise `PP.pdp.submit({source:'sticky'})`.
  - No mascot in the bar.

---

## 8. Shipping display and delivery estimate

### 8.1 Where the shipping text appears
Announcement · hero trust row · PDP price row · PDP delivery line · accordion · trust strip · drawer · FAQ · shipping policy. Every one of these says **5–7 business days** for both rates, and the Express rate is always **$2.55**.

### 8.2 Express wording
`Express shipping · $2.55 · priority handling and tracking · 5–7 business days`. It never says "faster", "sooner" or "arrives earlier".

### 8.3 Delivery and order-by JS (shared `pp-ui.js`)
```js
const PP_HOL = ['2026-11-26','2026-12-25','2027-01-01','2027-05-31','2027-07-05','2027-09-06','2027-11-25','2027-12-24'];
const iso = d => d.toISOString().slice(0,10);
const isBiz = d => d.getDay() % 6 !== 0 && !PP_HOL.includes(iso(d));
function addBiz(from, n){ const d = new Date(from.getFullYear(), from.getMonth(), from.getDate(), 12); let a = 0; while (a < n){ d.setDate(d.getDate()+1); if (isBiz(d)) a++; } return d; }
const fmt = d => d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' });
function deliveryRange(s = PP_CFG.ship, now = new Date()){ return [addBiz(now, s.procMin + s.min), addBiz(now, s.procMax + s.max)]; }
function orderBy(eventISO, s = PP_CFG.ship, now = new Date()){
  const [y,m,dd] = eventISO.split('-').map(Number); const ev = new Date(y, m-1, dd, 12); const latest = new Date(ev); latest.setDate(latest.getDate()-1);
  let d = new Date(latest); while (d > now){ if (isBiz(d) && addBiz(d, s.procMax + s.max) <= latest) return d; d.setDate(d.getDate()-1); } return null;
}
```
- **Check (today, Thu 2026-10-22):** `deliveryRange()` returns Fri, Oct 30 – Wed, Nov 4. `orderBy('2026-12-25')` returns Fri, Dec 11. `orderBy('2026-10-31')` returns null, so the line is hidden.
- **Settings:** processing min/max (default 1/2) and transit min/max (5/7) are section settings. If the owner sets processing to 0/0, the estimate becomes today + 5–7.

---

## 9. Event contract (`CustomEvent` on `document`)

| Event | Detail | Fired by | Used by |
|---|---|---|---|
| `pp:pdp:change` | `{items,label,priceCents,ready,soldOut,qty}` | pp-product.js | sticky ATC |
| `pp:variant-change` | `{size, variantId, available}` | pp-product.js | mascot |
| `pp:bundle-change` | `{qty}` | pp-product.js | mascot |
| `pp:cart:updated` | `{cart, suits, visibleCount}` | pp-cart.js | bubble, home bar |
| `pp:cart:added` | `{qty, size}` | pp-cart.js | mascot |
| `pp:cart:error` | `{message}` | pp-cart.js | mascot, PDP |
| `pp:cart:open` / `pp:cart:close` | `{itemCount}` | pp-cart.js (open fires about 250ms after the transition) | sticky, mascot, home bar |
| `pp:protection` | `{on}` | pp-cart.js | mascot |
| `pp:milestone` | `{tier}` | pp-cart.js | mascot |
| `pp:discount` | `{code, applied}` | pp-game.js | pp-cart.js (re-render) |
| `pp:overlay:open` / `pp:overlay:close` | – | size dialog, lightbox | sticky |
| `pp:game:start` / `catch` / `win` / `lose` | – | pp-game.js | mascot |

**Renames in the existing code:** `pp:cart` → `pp:cart:updated`, `pp:cart-open` → `pp:cart:open`, `pp:cart-close` → `pp:cart:close`, `pp:added` → `pp:cart:added`.

---

## 10. Special features unique to Puppy Platoon
1. **Sergeant Pup**, the living mascot (§12). He salutes on add, gets "promoted" (chevrons glint) when a bundle tier unlocks, salutes when protection is switched on, hosts the empty cart and the 404 page, and reacts to the size chosen.
2. **Treat Drill** (§13): a 15-second lane game with an honest, always-reachable 10% reward that stacks with bundles.
3. **Rank-chevron progress bar** in the cart: 1, 2 and 3 chevrons map to Free shipping, 15% and 25%.
4. **Size finder with "Recruit name"**: personal results (`Milo's size: S`) and a weight ruler pinned with Milo and Louie. The PDP mascot greets the dog by name: `Private {name}, reporting for duty! Pick a size.` The name is stored only in localStorage, never in the cart.
5. **Honest order-by dates** computed from real shipping days for holidays.
6. **404 "This page went AWOL."** with a saluting Sergeant Pup.
7. **Masking-tape fit captions** on photos showing true facts (dog, weight, size).
8. **Optional P2:** a downloadable "Certificate of Enlistment" PNG on the game win screen (canvas, dog name, date). Build it only if the size budget allows.

---

## 11. FAQ (final, verbatim; the homepage shows 1–8 and the FAQ page shows all)
1. **Which size should I choose?** Weigh your dog and measure around the widest part of the chest, just behind the front legs. Match both to the size chart. Between sizes? Go one size up. Milo is a 6 lb Chihuahua and wears S. Louie is a 22 lb French Bulldog and wears M.
2. **Is the rifle real?** No. It is a plush toy rifle made of soft stuffed fabric. It is not a real or replica weapon.
3. **Can my dog walk in it?** Yes. Your dog stands and walks on all four legs. The plush arms hang in front to create the standing look. It is made for photos, parties and short outings, so keep wear short and supervise your dog.
4. **How long does shipping take?** Standard shipping is free and takes 5–7 business days. Orders ship within 1–2 business days, and you get a tracking link by email.
5. **Do you offer express shipping?** Yes. Choose Express at checkout for $2.55. Your order gets priority handling and tracking. Delivery takes 5–7 business days.
6. **What is package protection?** An optional $3 add-on in your cart, one price per order. If your package is marked delivered but goes missing, or arrives damaged, email us within 14 days and we send a free replacement. Lost-in-transit orders are always covered by our Shipping Policy, with or without protection. You can turn it on or off before checkout.
7. **What is your return policy?** You have 30 days from delivery. Items must be unused and unwashed, in original packaging. Wrong size? Ask for an exchange. Email us with your order number and we reply within 1 business day.
8. **How do bundle discounts work?** Buy 2 suits and save 15% on both. Buy 3 or more and save 25% on every suit. Mix any sizes. The discount applies automatically in your cart.
9. **Which dogs does it fit?** Sizes S to 2XL fit dogs from about 5 to 90 lb. The standing-soldier look is especially cute on small breeds like Chihuahuas, Dachshunds, Yorkies, Pomeranians, Pugs and French Bulldogs.
10. **Is it comfortable?** The suit is soft fabric with adjustable straps. For the first try, put it on for a few minutes with treats and praise. Take it off if your dog seems stressed.
11. **Do you ship worldwide?** Yes. We ship to the United States and worldwide. Prices are in USD. Orders outside the US may be charged import duties or taxes by the destination country.
12. **How do I wash it?** Hand wash in cold water with mild soap. Air dry flat. Do not tumble dry or iron.

The FAQPage JSON-LD text must match this wording exactly. Shipping, protection and returns answers must match the policies in §14.7.

---

## 12. Sergeant Pup: SVG, CSS and JS (verbatim from plan_mascot; only the drawer event name changed)

### 12.1 Character
A black-and-tan dachshund (matching p1) in a camo helmet with an olive ear-muff headset and mic boom. He wears a tan plate carrier with a US flag patch and 3 gold sergeant chevrons, cream plush paws and camo pants. **He carries no rifle.**

The SVG uses classes, not ids, so several instances can sit on one page. It has no defs or gradients. 4.3KB raw.

| Class | Pivot | Motion |
|---|---|---|
| `.sp-rig` | 60 112 | breathe, jump, hop |
| `.sp-shadow` | 60 113 | shrink |
| `.sp-tail` | 76 92 | wag |
| `.sp-ear-l` / `.sp-ear-r` | 37 52 / 83 52 | twitch |
| `.sp-eyes` | 60 50.5 | blink |
| `.sp-head` | 60 66 | sad tilt |
| `.sp-uarm` | 80 69 | salute −150deg |
| `.sp-farm` | 77.4 83.8 | salute −111deg |
| `.sp-star` ×3 | fill-box | burst |
| `.sp-rank` | – | glint on promotion |
| `.sp-tongue` | – | happy |

### 12.2 `snippets/pp-mascot.liquid`
Params: `variant` (`'peek'`), `size` (px), `pose` (`'salute'`).
```liquid
{%- liquid
  assign peek = false
  if variant == 'peek'
    assign peek = true
  endif
-%}
<svg class="sp{% if pose %} is-{{ pose }}{% endif %}" {% if peek %}viewBox="24 8 76 64" width="76" height="64"{% else %}viewBox="22 6 80 112" width="80" height="112"{% endif %}{% if size %} style="--sp-h:{{ size }}px"{% endif %} aria-hidden="true" focusable="false">{% unless peek %}<ellipse class="sp-shadow" cx="60" cy="113" rx="24" ry="3.5" fill="#1F2A1C" opacity=".14"/>{% endunless %}
<g class="sp-rig" stroke="#1F2A1C" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
{% unless peek %}<path class="sp-tail" d="M76 92C86 94 94 88 97 78" fill="none" stroke="#2B211B" stroke-width="5.5"/><g class="sp-legs" fill="#7F8E53"><rect x="47" y="89" width="11" height="18" rx="5"/><rect x="62" y="89" width="11" height="18" rx="5"/><path d="M49 95h4v3h-4zM66 99h4v3h-4z" fill="#5E6B3A" stroke="none"/><g fill="#A8693A"><ellipse cx="52.5" cy="108" rx="6.5" ry="3.8"/><ellipse cx="67.5" cy="108" rx="6.5" ry="3.8"/></g></g>{% endunless %}
<g class="sp-body"><rect x="41" y="63" width="38" height="31" rx="10" fill="#C9A877"/><path d="M45 63h6v6h-6zM69 63h6v6h-6z" fill="#A88B5B" stroke="none"/><g stroke="none"><path fill="#B91C1C" d="M45 70h11v7.5H45z"/><path fill="#fff" d="M45 72.3h11v1.2H45zm0 2.5h11V76H45z"/><path fill="#1E3A5F" d="M45 70h4.6v3.9H45z"/></g><path class="sp-rank" d="M64 74l4-3 4 3m-8 3.5l4-3 4 3M64 81l4-3 4 3" fill="none" stroke="#F2C14E" stroke-width="1.7"/><path d="M49 83h6.5v8H49zm7.75 0h6.5v8h-6.5zm7.75 0H71v8h-6.5z" fill="#7A6646" stroke-width="1.2"/></g>
<g class="sp-head"><path class="sp-ear-l" d="M36 50c-7 8-6 19 0 21 5 1 7-8 6-17z" fill="#46332A"/><path class="sp-ear-r" d="M84 50c7 8 6 19 0 21-5 1-7-8-6-17z" fill="#46332A"/><path d="M42 50c0-10 8-16 18-16s18 6 18 16c0 9-8 20-18 20S42 59 42 50z" fill="#2B211B"/><g fill="#C98A4B" stroke="none"><path d="M50 59c0-4 4-6 10-6s10 2 10 6c0 5.5-4 10-10 10s-10-4.5-10-10z"/><ellipse cx="52" cy="45.6" rx="2.6" ry="1.6"/><ellipse cx="68" cy="45.6" rx="2.6" ry="1.6"/></g><g class="sp-eyes" stroke="none"><circle cx="52.5" cy="50.5" r="3.6" fill="#15100D"/><circle cx="67.5" cy="50.5" r="3.6" fill="#15100D"/><circle cx="53.7" cy="49.2" r="1.2" fill="#fff"/><circle cx="68.7" cy="49.2" r="1.2" fill="#fff"/></g><path class="sp-tongue" d="M58 65.2q2 5.5 4 0z" fill="#E9737B" stroke-width="1" opacity="0"/><ellipse cx="60" cy="59" rx="4.6" ry="3.3" fill="#15100D" stroke="none"/><path d="M56 64q2 2.4 4 .4 2 2 4-.4" fill="none" stroke-width="1.4"/><path d="M36 41c0-17 11-27 24-27s24 10 24 27z" fill="#8C9A5E"/><path d="M42 30c3-4 8-3 8 0s-5 4-8 2zm22-11c4-2 9 0 8 3s-6 2-8 0zm6 12c3-2 8-1 7 2s-5 3-7 1zM48 21c2-2 5-1 4 1s-4 2-4-1z" fill="#5E6B3A" stroke="none"/><path d="M55 32c2-2 6-1 6 1s-4 3-6 1zm21-8c1-1 3 0 3 2l-3 1zm-36 12c1-2 4-2 5 0s-3 2-5 0z" fill="#C7B58A" stroke="none"/><rect x="55" y="21" width="10" height="6.5" rx="1.5" fill="#A49163" stroke-width="1.2"/><rect x="34" y="36" width="52" height="7" rx="3.5" fill="#B49E6E"/><g fill="#6F7F45"><circle cx="37" cy="48" r="8"/><circle cx="83" cy="48" r="8"/></g><g fill="#4B5D2A" stroke="none"><circle cx="37" cy="48" r="4"/><circle cx="83" cy="48" r="4"/></g><path d="M85 55.5q-1 8-11 8.5" fill="none" stroke-width="1.6"/><circle cx="73" cy="64" r="2.2" fill="#1F2A1C"/></g>
<g class="sp-arm-l" fill="#7F8E53"><rect x="-4.5" y="-3" width="9" height="21" rx="4.5" transform="translate(40 69) rotate(-10)"/><rect x="-4.25" y="-2" width="8.5" height="16" rx="4.25" transform="translate(42.6 83.8) rotate(-48)"/><circle cx="54.5" cy="94.5" r="5.5" fill="#EAD3AE"/></g>
<g class="sp-uarm" fill="#7F8E53"><rect x="-4.5" y="-3" width="9" height="21" rx="4.5" transform="translate(80 69) rotate(10)"/><g class="sp-farm"><rect x="-4.25" y="-2" width="8.5" height="16" rx="4.25" transform="translate(77.4 83.8) rotate(48)"/><circle cx="65.5" cy="94.5" r="5.5" fill="#EAD3AE"/></g></g></g>
<g fill="#F2C14E" stroke="#1F2A1C" stroke-width="1"><path class="sp-star" opacity="0" d="M30 20l1.5 4.5L36 26l-4.5 1.5L30 32l-1.5-4.5L24 26l4.5-1.5z"/><path class="sp-star" opacity="0" d="M93 16l1.5 4.5L99 22l-4.5 1.5L93 28l-1.5-4.5L87 22l4.5-1.5z"/><path class="sp-star" opacity="0" d="M98 52l1.2 3.8L103 57l-3.8 1.2L98 62l-1.2-3.8L93 57l3.8-1.2z"/></g></svg>
```

### 12.3 `assets/pp-mascot.css` (load in `<head>`, or append to `pp-base.css`)
```css
.sp-wrap{position:relative;display:flex;align-items:center;gap:10px}
.sp-btn{all:unset;display:block;line-height:0;cursor:pointer;border-radius:12px;-webkit-tap-highlight-color:transparent}
.sp-btn:focus-visible{outline:3px solid #C2410C;outline-offset:4px}
.sp{--sp-h:96px;height:var(--sp-h);width:auto;display:block;overflow:visible}
.sp *{transform-box:view-box}
.sp-rig{transform-origin:60px 112px;animation:sp-breathe 3.2s ease-in-out infinite}
.sp-eyes{transform-origin:60px 50.5px;animation:sp-blink 5.4s infinite}
.sp-tail{transform-origin:76px 92px;animation:sp-wag 3s ease-in-out infinite}
.sp-ear-l{transform-origin:37px 52px;animation:sp-ear 7s infinite}
.sp-ear-r{--d:-1;transform-origin:83px 52px;animation:sp-ear 7s 3.3s infinite}
.sp-head{transform-origin:60px 66px;transition:transform .3s}
.sp-uarm{transform-origin:80px 69px;transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.sp-farm{transform-origin:77.4px 83.8px;transition:transform .35s cubic-bezier(.34,1.56,.64,1) .06s}
.sp.is-salute .sp-uarm{transform:rotate(-150deg)}
.sp.is-salute .sp-farm{transform:rotate(-111deg)}
@media (hover:hover) and (pointer:fine){.sp-btn:hover .sp-uarm{transform:rotate(-150deg)}.sp-btn:hover .sp-farm{transform:rotate(-111deg)}}
.sp-btn:focus-visible .sp-uarm{transform:rotate(-150deg)}
.sp-btn:focus-visible .sp-farm{transform:rotate(-111deg)}
.sp-tongue{transition:opacity .2s}
.sp.is-happy .sp-tongue{opacity:1}
.sp.is-happy .sp-tail{animation:sp-wag-fast .32s ease-in-out infinite alternate}
.sp.is-sad .sp-head{transform:translateY(1.5px) rotate(-5deg)}
.sp.is-jump .sp-rig{animation:sp-jump .9s cubic-bezier(.3,.7,.4,1)}
.sp.is-jump .sp-shadow{transform-origin:60px 113px;animation:sp-shadow .9s cubic-bezier(.3,.7,.4,1)}
.sp.is-hop .sp-rig{animation:sp-hop .3s ease-out}
.sp .sp-star{transform-box:fill-box;transform-origin:center}
.sp.is-jump .sp-star,.sp.is-stars .sp-star{animation:sp-star .9s ease-out both}
.sp .sp-star:nth-of-type(2){animation-delay:.08s}
.sp .sp-star:nth-of-type(3){animation-delay:.16s}
.sp.is-promo .sp-rank{animation:sp-glint .4s 4 alternate}
.sp.is-paused *{animation-play-state:paused!important}
.sp.is-rest .sp-rig,.sp.is-rest .sp-eyes,.sp.is-rest .sp-tail,.sp.is-rest .sp-ear-l,.sp.is-rest .sp-ear-r{animation:none}
@keyframes sp-breathe{50%{transform:scale(1.012,1.024)}}
@keyframes sp-blink{0%,93%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes sp-wag{0%,45%,100%{transform:rotate(0)}5%,15%,25%{transform:rotate(16deg)}10%,20%,30%{transform:rotate(-10deg)}35%{transform:rotate(4deg)}}
@keyframes sp-wag-fast{from{transform:rotate(-12deg)}to{transform:rotate(18deg)}}
@keyframes sp-ear{0%,84%,93%,100%{transform:rotate(0)}87%{transform:rotate(calc(16deg*var(--d,1)))}90%{transform:rotate(calc(-5deg*var(--d,1)))}}
@keyframes sp-jump{0%,100%{transform:none}14%{transform:scale(1.08,.9)}42%{transform:translateY(-20px) scale(.95,1.07)}68%{transform:scale(1.1,.88)}84%{transform:translateY(-3px) scale(.98,1.03)}}
@keyframes sp-shadow{42%{transform:scale(.6);opacity:.06}}
@keyframes sp-hop{50%{transform:translateY(-6px)}}
@keyframes sp-star{0%{opacity:0;transform:scale(0)}30%{opacity:1;transform:scale(1.15) rotate(30deg)}100%{opacity:0;transform:scale(.6) rotate(90deg)}}
@keyframes sp-glint{to{opacity:.35}}
.sp-bubble{position:relative;margin:0;max-width:230px;min-height:calc(2.6em + 20px);box-sizing:border-box;display:flex;align-items:center;padding:8px 12px;background:#fff;color:#1F2A1C;border:2px solid #1F2A1C;border-radius:14px;box-shadow:3px 3px 0 #1F2A1C;font:600 14px/1.3 "DM Sans",system-ui,sans-serif;transition:opacity .18s,transform .18s}
.sp-bubble::before{content:"";position:absolute;inset-inline-start:-8px;top:50%;width:12px;height:12px;background:#fff;border:solid #1F2A1C;border-width:0 0 2px 2px;transform:translateY(-50%) rotate(45deg)}
.sp-bubble.is-swap{opacity:0;transform:translateY(4px)}
.sp-peek{position:absolute;inset-inline-end:10px;bottom:0;width:60px;height:56px;overflow:hidden;pointer-events:none}
.sp-peek .sp{width:100%;height:auto;transform:translateY(46%);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
.sp-peek.is-in .sp{transform:translateY(4%)}
.sp-peek--corner{inset:auto auto 0 0;width:88px;height:88px}
.sp-peek--corner .sp{transform-origin:0 100%;transform:translate(-100%,45%) rotate(-25deg)}
.sp-peek--corner.is-in .sp{transform:translate(-8%,6%) rotate(12deg)}
@media (prefers-reduced-motion:reduce){.sp *,.sp-peek .sp,.sp-bubble{animation:none!important;transition:none!important}}
```

### 12.4 `assets/pp-mascot.js` (deferred; can be merged into `pp-ui.js`)
The only change from plan_mascot: the drawer listener is now `pp:cart:open`, matching the §9 contract.
```js
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const IDLE_MS = 20000, LINE_MS = 4500, HAPPY_MS = 1800, SWAP_MS = 180;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    const api = e.target.spApi; if (!api) return;
    api.sp.classList.toggle('is-paused', !e.isIntersecting);
    if (e.isIntersecting && e.intersectionRatio >= 0.4) api.seen();
  }), { threshold: [0, 0.4] }) : null;
  const pulse = (sp, cls, ms) => {
    sp.classList.remove(cls); void sp.getBoundingClientRect(); sp.classList.add(cls);
    clearTimeout(sp['t' + cls]); sp['t' + cls] = setTimeout(() => sp.classList.remove(cls), ms);
  };
  function init(w) {
    if (w.spApi) return w.spApi;
    const sp = w.querySelector('.sp'); if (!sp) return null;
    const bubble = w.querySelector('[data-sp-bubble]');
    const peek = w.matches('.sp-peek') ? w : null;
    let lines = []; try { lines = JSON.parse(w.dataset.spLines || '[]'); } catch (e) { lines = []; }
    let i = 0, rot = 0, idle = 0, last = 0, seenOnce = false;
    const wake = () => { sp.classList.remove('is-rest'); clearTimeout(idle); idle = setTimeout(() => sp.classList.add('is-rest'), IDLE_MS); };
    const say = (text, live) => {
      if (!bubble || !text) return;
      bubble.setAttribute('aria-live', live ? 'polite' : 'off');
      if (RM.matches) { bubble.textContent = text; return; }
      bubble.classList.add('is-swap');
      setTimeout(() => { bubble.textContent = text; bubble.classList.remove('is-swap'); }, SWAP_MS);
    };
    const line = (key, vars = {}) => (w.dataset['spSay' + key] || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
    const stopRotate = () => clearInterval(rot);
    const startRotate = () => {
      stopRotate(); if (RM.matches || lines.length < 2) return;
      let shown = 1;
      rot = setInterval(() => {
        if (document.hidden || sp.classList.contains('is-paused')) return;
        i = (i + 1) % lines.length; say(lines[i]);
        if (++shown >= lines.length) stopRotate();
      }, LINE_MS);
    };
    const show = ms => { if (!peek) return; peek.classList.add('is-in'); clearTimeout(peek.tOut); peek.tOut = setTimeout(() => peek.classList.remove('is-in'), ms); };
    const salute = (ms = 1400) => { wake(); pulse(sp, 'is-salute', ms); };
    const celebrate = () => {
      const now = Date.now(); if (now - last < 1000) return; last = now;
      wake(); show(3200); pulse(sp, 'is-happy', HAPPY_MS);
      if (RM.matches) { pulse(sp, 'is-salute', HAPPY_MS); return; }
      pulse(sp, peek ? 'is-stars' : 'is-jump', 900);
      setTimeout(() => pulse(sp, 'is-salute', 1300), peek ? 200 : 380);
    };
    const hop = () => { if (!RM.matches) pulse(sp, 'is-hop', 300); };
    const sad = () => { wake(); pulse(sp, 'is-sad', 1400); };
    const seen = () => { if (seenOnce) return; seenOnce = true; if (w.dataset.spOnView === 'salute') setTimeout(() => salute(), 600); };
    const btn = w.querySelector('.sp-btn');
    if (btn) btn.addEventListener('click', () => {
      salute(); stopRotate();
      if (lines.length > 1) { i = (i + 1) % lines.length; say(lines[i], true); }
    });
    ['pointerenter', 'focusin'].forEach(ev => w.addEventListener(ev, () => { stopRotate(); wake(); }));
    w.spApi = { sp, say, line, salute, celebrate, hop, sad, show, seen };
    if (io) io.observe(w); else seen();
    wake(); startRotate();
    return w.spApi;
  }
  const scan = root => root.querySelectorAll('[data-sp]').forEach(init);
  const each = (ctx, fn) => document.querySelectorAll(`[data-sp][data-sp-ctx="${ctx}"]`).forEach(w => { const a = init(w); if (a) fn(a); });
  const on = (ev, fn) => document.addEventListener(ev, e => fn(e.detail || {}));
  on('pp:variant-change', d => each('pdp', a => a.say(a.line('Size', d), true)));
  on('pp:bundle-change', d => each('pdp', a => a.say(a.line(d.qty > 1 ? 'Squad' : 'Solo', d), true)));
  on('pp:cart:added', d => { each('pdp', a => { a.say(a.line('Added', d), true); a.celebrate(); }); each('drawer', a => a.celebrate()); });
  on('pp:cart:error', d => each('pdp', a => { a.say(a.line('Error', d), true); a.sad(); }));
  on('pp:cart:open', d => each('drawer', a => { if (d.itemCount > 0 && !sessionStorageSafe('sp-peeked')) a.show(2600); }));
  on('pp:protection', d => { if (d.on) each('drawer', a => { a.show(2600); a.salute(); }); });
  on('pp:milestone', () => each('drawer', a => { a.show(3200); a.salute(); pulse(a.sp, 'is-promo', 1700); }));
  on('pp:game:start', () => each('game', a => { a.show(2600); a.say(a.line('Start'), true); }));
  on('pp:game:catch', () => each('game', a => a.hop()));
  on('pp:game:win', () => each('game', a => { a.say(a.line('Win'), true); a.celebrate(); }));
  on('pp:game:lose', () => each('game', a => { a.show(2600); a.say(a.line('Lose'), true); a.sad(); }));
  function sessionStorageSafe(key) {
    try { if (sessionStorage.getItem(key)) return true; sessionStorage.setItem(key, '1'); } catch (e) { return false; }
    return false;
  }
  window.PPMascot = { init, scan };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scan(document)); else scan(document);
  document.addEventListener('shopify:section:load', e => scan(e.target));
})();
```

### 12.5 Placements (at most 3 per page)
**Base markup** (double-quoted, escaped attribute, because the lines contain apostrophes):
```liquid
<div class="sp-wrap" data-sp data-sp-ctx="pdp" data-sp-lines="{{ lines | json | escape }}" data-sp-say-size="Size {size} locked in. Not sure? Tap Size guide." data-sp-say-squad="A whole squad! Your savings show in the cart." data-sp-say-solo="One tiny soldier, coming up." data-sp-say-added="Welcome to the squad! Mission: checkout." data-sp-say-error="Hmm, that didn't go through. Try again?"><button class="sp-btn" type="button" aria-label="Tap Sergeant Pup for a salute">{% render 'pp-mascot', size: 64 %}</button><p class="sp-bubble" data-sp-bubble aria-live="off">Pick a size, recruit!</p></div>
```
1. **Home hero:** `ctx="hero"`, `data-sp-on-view="salute"`, lines from §3.1. Bubble hidden under 750px.
2. **Home final CTA:** 120/160px, salutes on view, line `Reporting for cuteness duty!`
3. **PDP:** under the trust row, never above the ATC. Uses the markup above. If `pp_name` is set, the first line becomes `Private {name}, reporting for duty! Pick a size.` (set with `textContent`).
4. **Cart drawer:**
   - Peek: `<div class="sp-peek" data-sp data-sp-ctx="drawer">{% render 'pp-mascot', variant: 'peek' %}</div>` inside the progress card.
   - Empty cart: the full mascot at 96px with the bubble `No gear yet. Let's suit up your pup.`
5. **Treat Drill:** the game board uses its own small helmeted-dog sprite (§13) and no peek, so the dog's lane stays clear. Game events are still dispatched for future use.
6. **404 page:** `{% render 'pp-mascot', size: 120, pose: 'salute' %}`, H1 `This page went AWOL.`, body `Sergeant Pup searched everywhere. Let's get you back to base.`, button `Back to the suit`.

**Reduced motion and accessibility:** with reduced motion, poses are static and salute plus tongue show for 1.8s. The SVG is `aria-hidden`. The button has a label and a hit area of 64px or more. Motion rests after 20s idle and pauses off-screen. Only transform and opacity are animated.

---

## 13. Treat Drill (plan_game code with fixes)

### 13.1 Rules
- **Goal:** score **10 points in 15 seconds**. The game has 3 lanes, and Sergeant Pup's head sits at the bottom of the play area.
- **Points:** bone +1; gold star +3 (7% of drops); cat or vacuum −2. The score never goes below 0.
- **Difficulty** (linear over the 15 seconds):
  - Fall time goes from 1900 to 1050ms.
  - Gap between drops goes from 620 to 380ms.
  - Hazard share goes from 24% to 38%, and 60% of hazards aim at the dog's lane.
  - Two drops in a row never use the same lane.
  - Frame time is capped at 50ms.
- **Calibration:** casual players win 71% of the time and average players 96%.
- **Controls:**
  - Tap a lane or drag across lanes.
  - Keyboard: ← → / A D / 1 2 3 move; Space, Esc or P pause. Keys only work while the board has focus.
  - `touch-action:none` applies only during play.
- **Auto-pause:** when the tab is hidden, when less than 30% of the board is visible, or when the card is collapsed.
- **Reduced motion:** drops are 35% slower, and the skip link shows from the start. Everyone else sees "Skip the drill, show my code" after their first attempt.
- **Win:**
  - Show the code with a Copy button.
  - Auto-apply: `GET discount/TREAT10?redirect=cart.js`, then `cart/update.js {discount}` if the cart has items.
  - Status: `Applied to your cart.` or `Saved. It applies at checkout once a suit is in your cart.`
  - Fires `pp:discount`.
- **localStorage:** `pp_td_won`, `pp_td_best` and `pp_td_plays`, all in try/catch. On a return visit the card goes straight to the code.
- **Never:** auto-open, sound, vibration, expiry or a fake timer. The game is not rendered when the product is unavailable or when JS is off (the root starts `hidden`).

**Fixes applied to the plan_game code:**
1. The host is renamed Sergeant Pup.
2. The discount URL goes through `Shopify.routes.root`.
3. It dispatches `pp:game:start|catch|win|lose`.
4. A replay that scores under 10 after a win goes back to the code instead of the "try again" screen.
5. IntersectionObserver is guarded.
6. The fine print states the $35 minimum.
7. Re-init on `shopify:section:load` cleans up through the guard on `R.dataset.on`.

### 13.2 Section hook (in `pp-product` or `pp-game`)
```liquid
{%- if section.settings.game_enabled and product.available -%}<a href="#pp-td" class="pp-td-teaser" data-td-open>Play Treat Drill for 10% off ↓</a>{%- endif -%}
{%- if section.settings.game_enabled -%}{% render 'pp-treat-drill', product: product, code: section.settings.game_code %}{%- endif -%}
```
Schema: `{"type":"checkbox","id":"game_enabled","label":"Show Treat Drill","default":true}` and `{"type":"text","id":"game_code","label":"Game discount code","default":"TREAT10"}`.

Teaser CSS: `.pp-td-teaser{display:inline-block;min-height:44px;line-height:44px;font:500 14px "DM Sans",system-ui;color:#4B5D2A;text-decoration:underline}`

### 13.3 `snippets/pp-treat-drill.liquid`
```liquid
{%- assign td_code = code | default: 'TREAT10' | upcase | escape -%}
{%- if product.available -%}
{{ 'pp-game.css' | asset_url | stylesheet_tag }}
<script src="{{ 'pp-game.js' | asset_url }}" defer></script>
<div class="pp-td" id="pp-td" data-code="{{ td_code }}" hidden>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="pp-i-bone" viewBox="0 0 48 48"><path d="M14 18a5 5 0 1 0-5 6 5 5 0 1 0 5 6h20a5 5 0 1 0 5-6 5 5 0 1 0-5-6z" fill="#E9B872" stroke="#8A5A2B" stroke-width="2.5"/></symbol>
<symbol id="pp-i-gold" viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="#F2C14E" stroke="#A16207" stroke-width="3"/><path d="M24 13l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#FFF"/></symbol>
<symbol id="pp-i-cat" viewBox="0 0 48 48"><path d="M10 10l8 8h12l8-8v22a14 12 0 0 1-28 0z" fill="#4B5563"/><g fill="#F2C14E"><circle cx="18" cy="28" r="2.6"/><circle cx="30" cy="28" r="2.6"/></g></symbol>
<symbol id="pp-i-vac" viewBox="0 0 48 48"><path d="M31 5v14" stroke="#1F2A1C" stroke-width="4"/><rect x="20" y="16" width="16" height="19" rx="4" fill="#1E3A5F"/><rect x="7" y="34" width="34" height="8" rx="4" fill="#B91C1C"/></symbol>
<symbol id="pp-i-dog" viewBox="0 0 64 64"><g fill="#46332A"><ellipse cx="14" cy="38" rx="7" ry="13"/><ellipse cx="50" cy="38" rx="7" ry="13"/></g><ellipse cx="32" cy="38" rx="17" ry="16" fill="#2B211B"/><ellipse cx="32" cy="47" rx="9" ry="7" fill="#C98A4B"/><g fill="#15100D"><ellipse cx="32" cy="43" rx="4" ry="3"/></g><g fill="#fff"><circle cx="25" cy="35" r="2.6"/><circle cx="39" cy="35" r="2.6"/></g><g fill="#15100D"><circle cx="25.6" cy="35.4" r="1.6"/><circle cx="39.6" cy="35.4" r="1.6"/></g><path d="M12 29a20 18 0 0 1 40 0z" fill="#8C9A5E"/><rect x="9" y="27" width="46" height="5" rx="2.5" fill="#4B5D2A"/></symbol>
</svg>
<button type="button" class="td-hd" aria-expanded="false" aria-controls="pp-td-b"><span class="td-tag">Mission</span><span class="td-h">Play Treat Drill: win 10% off</span><span class="td-s">15-second game. Score 10 to win.</span><svg class="td-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.5"/></svg></button>
<div class="td-b" id="pp-td-b" hidden>
<div class="td-play">
<p class="td-s" id="pp-td-r">Tap a lane or use the arrow keys to move Sergeant Pup. Score 10 in 15 seconds to unlock 10% off (that's {{ product.selected_or_first_available_variant.price | divided_by: 10 | money }} on one suit).</p>
<div class="td-hud"><span aria-hidden="true">Score <b class="td-sc">0</b>/10</span><span class="td-bar" aria-hidden="true"><i></i></span><span aria-hidden="true"><b class="td-tm">15</b>s</span><button type="button" class="td-pz" aria-label="Pause game" disabled>II</button></div>
<div class="td-ar" tabindex="0" role="application" aria-label="Treat Drill game" aria-describedby="pp-td-r">
<div class="td-dog"><svg><use href="#pp-i-dog"/></svg></div>
<div class="td-ov"><div class="td-lg" aria-hidden="true"><span><svg><use href="#pp-i-bone"/></svg>+1</span><span><svg><use href="#pp-i-gold"/></svg>+3</span><span><svg><use href="#pp-i-cat"/></svg>&minus;2</span><span><svg><use href="#pp-i-vac"/></svg>&minus;2</span></div>
<p class="td-msg">Catch bones and gold stars. Dodge cats and vacuums.</p>
<button type="button" class="td-btn td-go">Start drill</button>
<button type="button" class="td-ln td-skip" hidden>Skip the drill, show my code</button></div></div></div>
<div class="td-win" hidden><span class="td-tag">Mission complete</span>
<h3 class="td-h" tabindex="-1">Drill complete, Recruit! 10% off unlocked.</h3><p class="td-s td-ws"></p>
<div class="td-code"><b>{{ td_code }}</b><button type="button" class="td-btn td-cp">Copy code</button></div>
<p class="td-s td-st" role="status"></p>
<p class="td-s">10% off orders of $35+. Stacks with Squad bundle savings. One use per customer.</p>
<button type="button" class="td-btn td-buy">Choose your size</button><button type="button" class="td-ln td-again">Play again for fun</button></div>
<p class="td-sr" aria-live="polite"></p></div></div>
{%- endif -%}
```

### 13.4 `assets/pp-game.css`
```css
.pp-td{--o:#4B5D2A;--i:#1F2A1C;--l:#DCCFB4;--d:"Lilita One","Arial Rounded MT Bold",system-ui;margin:24px 0;background:#EFE5CF;border:1.5px solid var(--l);border-radius:16px;color:var(--i);font:16px/1.5 "DM Sans",system-ui,sans-serif}
.pp-td[hidden],.pp-td [hidden]{display:none!important}
.pp-td :focus-visible{outline:3px solid var(--i);outline-offset:2px}
.td-hd{all:unset;box-sizing:border-box;display:grid;grid-template-columns:1fr 24px;gap:2px 12px;width:100%;padding:16px;cursor:pointer}
.pp-td .td-hd:focus-visible,.pp-td .td-ar:focus-visible{outline-offset:-4px;border-radius:14px}
.td-tag{font:12px/1 "Black Ops One",system-ui;letter-spacing:.08em;text-transform:uppercase;color:var(--o)}
.td-h{margin:0;font:20px/1.2 var(--d)}
.td-s{margin:0;font-size:14px;color:#55604E}
.td-chev{grid-area:1/2/4;align-self:center;width:24px;height:24px;transition:transform .2s}
[aria-expanded=true] .td-chev{transform:rotate(180deg)}
.td-b{padding:0 16px 16px}
.td-hud{display:flex;align-items:center;gap:10px;margin:12px 0 8px;font:18px/1 var(--d)}
.td-bar{flex:1;height:8px;border-radius:8px;background:#E6DFCB;overflow:hidden}
.td-bar i{display:block;height:100%;background:#F2C14E;transform-origin:0}
.is-goal .td-bar i{background:#15803D}
.td-pz{width:44px;height:44px;border:1.5px solid #8A7A5C;border-radius:12px;background:#fff;color:var(--i);font:inherit}
.td-pz:disabled{opacity:.4}
.td-ar{position:relative;height:clamp(300px,85vw,380px);overflow:hidden;border-radius:12px;background:#FBF6EC linear-gradient(90deg,#0000 33%,#E6DFCB 0 33.6%,#0000 0 66.4%,#E6DFCB 0 67%,#0000 0);-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation}
.td-ar.is-play{touch-action:none}
.td-ar.is-hurt{box-shadow:inset 0 0 0 4px #B91C1C}
.td-it,.td-dog,.td-pop{position:absolute;left:0;width:33.333%;display:flex;justify-content:center;pointer-events:none}
.td-it{top:0;will-change:transform}
.td-it svg{width:44px;height:44px}
.td-dog{bottom:8px;transition:transform .12s}
.td-dog svg{width:64px;height:64px}
.td-pop{font:22px/1 var(--d);color:#15803D;animation:tdpop .6s forwards}
.td-pop.neg{color:#B91C1C}
@keyframes tdpop{to{transform:translateY(-40px);opacity:0}}
.td-ov{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px;text-align:center;background:#FBF6ECF0}
.td-lg{display:flex;gap:14px;font:18px/1 var(--d)}
.td-lg span{display:grid;justify-items:center;gap:4px}
.td-lg svg{width:36px;height:36px}
.td-msg{margin:0;font-weight:500}
.td-btn{min-height:48px;padding:0 24px;border:0;border-radius:12px;background:var(--o);color:#FBF6EC;font:700 17px/1 "DM Sans",system-ui;cursor:pointer}
.td-ln{min-height:44px;border:0;background:none;color:var(--i);text-decoration:underline;font:500 15px "DM Sans",system-ui;cursor:pointer}
.td-win{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center}
.td-code{display:flex;align-items:center;justify-content:space-between;gap:12px;box-sizing:border-box;width:100%;max-width:360px;padding:8px 8px 8px 16px;border:2px dashed var(--o);border-radius:12px;background:#fff}
.td-code b{font:24px/1 "Black Ops One",system-ui;letter-spacing:.12em}
.td-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.pp-td-playing [data-pp-sticky]{transform:translateY(120%)!important}
@media (prefers-reduced-motion:reduce){.pp-td *{animation:none!important;transition:none!important}}
```
The game buttons are olive on purpose, because orange is reserved for buying.

### 13.5 `assets/pp-game.js` (fixed)
```js
(()=>{function init(){const R=document.getElementById('pp-td');if(!R||R.dataset.on)return;R.dataset.on=1;
const $=s=>R.querySelector('.td-'+s),L=(k,v)=>{try{if(v==null)return localStorage.getItem('pp_td_'+k);localStorage.setItem('pp_td_'+k,v)}catch(e){}},
C=R.dataset.code||'TREAT10',G=10,MS=15e3,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,SL=RM?1.35:1,
RT=window.Shopify?.routes?.root||'/',V={bone:1,gold:3,cat:-2,vac:-2},nf={preventScroll:true},
hd=$('hd'),bd=$('b'),pl=$('play'),A=$('ar'),dog=$('dog'),ov=$('ov'),msg=$('msg'),go=$('go'),sk=$('skip'),pz=$('pz'),
win=$('win'),sc=$('sc'),tm=$('tm'),bar=$('bar i'),live=$('sr'),cp=$('cp'),stt=$('st'),
sm=b=>({behavior:RM?'auto':'smooth',block:b}),show=(e,on)=>e.hidden=!on,
ev=(n,d)=>document.dispatchEvent(new CustomEvent(n,{detail:d||{}})),
say=s=>{live.textContent='';setTimeout(()=>live.textContent=s,60)};
let st='idle',S=0,t=0,last=0,next=0,lane=1,ll=-1,I=[],raf=0,H=0,drag=0,best=+L('best')||0,plays=+L('plays')||0;
R.hidden=false;
const setLane=l=>{lane=Math.max(0,Math.min(2,l));dog.style.transform='translateX('+lane*100+'%)'},
clear=()=>{I.forEach(i=>i.el.remove());I=[]},
playing=on=>{A.classList.toggle('is-play',on);document.documentElement.classList.toggle('pp-td-playing',on);pz.disabled=!on};
function spawn(k){// k: 0..1. Hazards 24%->38%, 60% aimed at the dog's lane. Never the same lane twice in a row.
const r=Math.random(),hz=.24+.14*k,type=r<hz?(r<hz/2?'cat':'vac'):r<hz+.07?'gold':'bone',el=document.createElement('div');
let l=V[type]<0&&Math.random()<.6?lane:Math.random()*3|0;if(l==ll)l=(l+1+(Math.random()*2|0))%3;ll=l;
el.className='td-it';el.style.left=l*33.333+'%';el.style.transform='translateY(-44px)';el.innerHTML='<svg><use href="#pp-i-'+type+'"/></svg>';
A.insertBefore(el,ov);I.push({el,l,type,b:t,d:(1900-850*k)*SL})}
function grab(it){const v=V[it.type],p=document.createElement('span');it.done=1;it.el.remove();S=Math.max(0,S+v);sc.textContent=S;
p.className='td-pop'+(v<0?' neg':'');p.textContent=(v>0?'+':'')+v;p.style.left=it.l*33.333+'%';p.style.top=H-120+'px';A.append(p);setTimeout(()=>p.remove(),650);
if(v<0){A.classList.add('is-hurt');setTimeout(()=>A.classList.remove('is-hurt'),260)}else ev('pp:game:catch');
if(S>=G&&!R.classList.contains('is-goal'))say('Goal reached! Keep going.');R.classList.toggle('is-goal',S>=G)}
function loop(now){t+=Math.min(50,now-last);last=now;const k=Math.min(1,t/MS),left=Math.ceil((MS-t)/1e3);
if(t>=next){spawn(k);next=t+(620-240*k)*SL}
for(const it of I){const y=-44+(t-it.b)/it.d*(H+44);it.el.style.transform='translateY('+y+'px)';
if(it.l==lane&&y>H-92&&y<H-58)grab(it);else if(y>=H){it.done=1;it.el.remove()}}
I=I.filter(i=>!i.done);if(tm.textContent!=left)tm.textContent=left;bar.style.transform='scaleX('+(1-k)+')';
if(k>=1)return end();raf=requestAnimationFrame(loop)}
function start(){clear();S=t=0;next=250;setLane(1);sc.textContent=0;tm.textContent=15;bar.style.transform='';R.classList.remove('is-goal');
show(win,0);show(pl,1);show(ov,0);H=A.clientHeight;st='play';playing(1);A.scrollIntoView(sm('center'));A.focus(nf);
last=performance.now();raf=requestAnimationFrame(loop);L('plays',++plays);ev('pp:game:start');say('Drill started. 15 seconds. Arrow keys move. Space pauses.')}
function overlay(m,b,s){msg.textContent=m;go.textContent=b;show(sk,s);show(ov,1);go.focus(nf)}
function end(){st='over';playing(0);clear();if(S>best)L('best',best=S);
if(S>=G){L('won',1);ev('pp:game:win');reveal('You scored '+S+'. Best: '+best+'.')}
else if(L('won')){ev('pp:game:lose');reveal('You scored '+S+'. Your code is still ready.')}
else{ev('pp:game:lose');overlay('Good effort, recruit. You scored '+S+'. You need 10.','Try again',1);say('Time. You scored '+S+'.')}}
function pause(){if(st!='play')return;st='pause';cancelAnimationFrame(raf);playing(0);overlay('Paused. Score '+S+'.','Resume',0)}
function resume(){st='play';show(ov,0);playing(1);A.focus(nf);last=performance.now();raf=requestAnimationFrame(loop)}
function reveal(m){st='won';show(pl,0);show(win,1);$('ws').textContent=m;$('hd .td-h').textContent='Treat Drill: 10% off unlocked';
$('hd .td-s').textContent='Your code: '+C;$('win .td-h').focus(nf);apply()}
const J=(u,o)=>fetch(RT+u,o).then(r=>r.json());
function apply(){if(!L('won'))return;stt.textContent='Applying your code...';
fetch(RT+'discount/'+encodeURIComponent(C)+'?redirect='+encodeURIComponent(RT+'cart.js')).catch(()=>0)
.then(()=>J('cart.js')).then(c=>c.item_count&&J('cart/update.js',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({discount:C})})
.then(u=>(u.discount_codes||[]).some(d=>d.code.toUpperCase()==C&&d.applicable))).catch(()=>0)
.then(ok=>{stt.textContent=ok?'Applied to your cart.':'Saved. It applies at checkout once a suit is in your cart.';
ev('pp:discount',{code:C,applied:!!ok})})}
window.ppTreatDrill={apply,code:C};
hd.onclick=()=>{const o=hd.getAttribute('aria-expanded')!='true';hd.setAttribute('aria-expanded',o);show(bd,o);
if(!o)return pause();if(st=='idle')L('won')?reveal('Your code is ready. Best score: '+best+'.'):show(sk,RM||plays>0)};
go.onclick=()=>st=='pause'?resume():start();
sk.onclick=()=>{L('won',1);reveal('Here is your code anyway, recruit.')};
pz.onclick=pause;$('again').onclick=start;
cp.onclick=()=>{const ok=()=>{cp.textContent='Copied!';setTimeout(()=>cp.textContent='Copy code',2e3)},
fb=()=>{getSelection().selectAllChildren(cp.previousElementSibling);try{document.execCommand('copy')&&ok()}catch(e){}};
navigator.clipboard?navigator.clipboard.writeText(C).then(ok,fb):fb()};
$('buy').onclick=()=>{const b=document.querySelector('[data-pp-buybox]');if(!b)return;b.scrollIntoView(sm('center'));
(b.querySelector('input:checked')||b.querySelector('input,select,button'))?.focus(nf)};
document.addEventListener('click',e=>{if(!e.target.closest('[data-td-open]'))return;e.preventDefault();if(bd.hidden)hd.click();R.scrollIntoView(sm('start'));hd.focus(nf)});
const px=e=>{const r=A.getBoundingClientRect();setLane((e.clientX-r.left)/r.width*3|0)};
A.onpointerdown=e=>{if(st=='play'){drag=1;px(e)}};A.onpointermove=e=>{drag&&st=='play'&&px(e)};
addEventListener('pointerup',()=>drag=0);addEventListener('pointercancel',()=>drag=0);
A.onkeydown=e=>{if(st!='play')return;const k=e.key;
if(k=='ArrowLeft'||k=='a')setLane(lane-1);else if(k=='ArrowRight'||k=='d')setLane(lane+1);
else if(k=='1'||k=='2'||k=='3')setLane(k-1);else if(k==' '||k=='Escape'||k=='p')pause();else return;e.preventDefault()};
document.addEventListener('visibilitychange',()=>document.hidden&&pause());
addEventListener('resize',()=>{if(st=='play')H=A.clientHeight});
if('IntersectionObserver' in window)new IntersectionObserver(e=>e[0].intersectionRatio<.3&&pause(),{threshold:[0,.3]}).observe(A)}
init();document.addEventListener('shopify:section:load',init)})();
```
**Requirements on other files:**
- The buy box wrapper has `data-pp-buybox`, and the sticky root has `data-pp-sticky`.
- The cart listens for `pp:discount` (and re-renders) and applies the code after an add when `pp_td_won` is set (§7.3).

---

## 14. Markets, shipping, checkout and policies: operations list (Admin GraphQL)

Store state as verified by plan_ops on 2026-10-22:
- **Markets:** United States (`gid://shopify/Market/65004994808`) and Worldwide (`…/64989823224`, 221 countries) are both ACTIVE and USD.
- **Shipping:** the General profile has a US zone (`…/DeliveryZone/515688825080`) and a Rest of World zone (`…/515688857848`). Each zone has "Free Standard Shipping" at $0 (5–7 business days) and "Express Shipping" at $2.55 ("Priority processing, tracked. 5–7 business days").
- **Protection product:** `…/Product/15438753628408`, variant `…/ProductVariant/67770384613624`. It is $3, SKU PP-PROTECT, `requiresShipping:false`, untracked, `taxable:false`, `seo.hidden=1`, and published to the Online Store.
- **Suit product:** `gid://shopify/Product/15436873138424`.

**Run in this order:**

1. **Language (P0).**
   - `shopLocaleEnable(locale:"en", marketWebPresenceIds:["gid://shopify/MarketWebPresence/58392707320"])`
   - `shopLocaleUpdate(locale:"en", shopLocale:{published:true})`
   - `webPresenceUpdate(id:"gid://shopify/MarketWebPresence/58392707320", input:{defaultLocale:"en", alternateLocales:[]})`
   - Verify with `shopLocales{locale primary published}`.
   - **If the API refuses:** the owner changes it under Settings > Languages > Change default > English. In the meantime, copy `locales/en.default.json` to `locales/tr.json` in the build theme and set `<html lang="en">`. Make sure no Turkish strings render on the storefront.
2. **Product options.**
   - `productOptionsDelete(productId:"gid://shopify/Product/15436873138424", options:["gid://shopify/ProductOption/17906217746680"], strategy:DEFAULT)`. Fallback: rename the value to "Camo".
   - `productOptionsReorder` to S, M, L, XL, 2XL.
   - `productUpdate`: title `Puppy Soldier Dog Costume`, description from §4.1, tag `pp-main`, SEO title and description from §2.4.
   - Verify with `product{title options{name optionValues{name}} variants{title sku} seo{title description}}`. SKUs must be unchanged so CJ mapping keeps working.
3. **Media.**
   - `productReorderMedia` to p1, p4, p5, p7, p3, p2.
   - Delete p6, the duplicate box shot.
   - Set the alt texts from §15.
   - Upload the Higgsfield image only for home and social use (§15). It is not added to product media.
4. **Discounts:** create A, B and C (§6.2). Query back the titles, percentages, minimums and `combinesWith`. Check that `PP_CFG.tiers` matches.
5. **Protection product.**
   - Add an 800×800 olive shield PNG (#4B5D2A on #F4EFE3) via `stagedUploadsCreate` → PUT → `productUpdate(media)`, with alt `Package protection shield`.
   - Set `descriptionHtml` to the "What's covered?" text from §7.2.
   - Set `templateSuffix:"protection"`. `templates/product.protection.json` holds a small info section, no buy button, and a link to the suit.
   - Tag it `pp-hidden`.
   - Set theme setting `pp_protection_product`, or rely on `all_products['package-protection']`.
6. **Policies** (`shopPolicyUpdate`): push these before the menus.
   - **SHIPPING_POLICY:**
     > **Free Standard Shipping** on every order: 5–7 business days. **Express Shipping, $2.55:** priority handling and tracking, 5–7 business days. Orders are processed within 1–2 business days. You get a tracking link by email when your order ships, and you can track it at /pages/track-order. We ship to the United States and worldwide. All prices are in USD. Orders shipped outside the US may be charged import duties or taxes by the destination country. The recipient pays these, and they are not included in our prices. **Delays:** if your order will arrive late, we email you a new estimate and you can cancel for a full refund. **Lost in transit:** if your order has not arrived 30 days after the latest estimated date, email us and we reship or refund it. This applies with or without Package Protection. **Package Protection ($3, optional, per order):** if your package is marked delivered but is missing, or arrives damaged, email {shop email} within 14 days of delivery with your order number (and a photo if it is damaged). We send a free replacement. This is our own guarantee, not insurance. You can remove it in your cart before checkout.
   - **REFUND_POLICY:**
     > **30-day returns.** Email {shop email} within 30 days of delivery with your order number. We reply within 1 business day with return instructions. Items must be unused and unwashed, in their original packaging. You pay return shipping, unless the item arrived damaged, faulty or wrong. In that case we cover it or refund without a return. **Wrong size?** Ask for an exchange within 30 days. We refund to your original payment method within 5 business days after we receive the return. The Express fee and the Package Protection fee are not refundable, unless the item was damaged, faulty or wrong. For EU and UK customers, your 14-day right of withdrawal is included in this 30-day window.
   - **PRIVACY_POLICY:** a faithful English translation of the current Shopify text. "Mağazam" becomes "Puppy Platoon". Keep the opt-out links, the email and the address. Last updated October 22, 2026.
   - **TERMS_OF_SERVICE:** must include:
     - The seller's identity, email and address.
     - USD pricing.
     - Links to the shipping and returns policies.
     - Safety: `Always supervise your dog while it wears the costume. Remove it if it restricts breathing or movement or causes stress. The rifle is a plush toy made of soft fabric, not a real or replica weapon. Not a chew toy.`
     - `Not affiliated with or endorsed by any military organization.`
     - Limitation of liability.
     - Governing law: Türkiye (the owner confirms).
   - **CONTACT_INFORMATION:** `Puppy Platoon · {shop email} · Ankara, 06145, Türkiye`. The owner adds their legal name.
   - Verify with `shop{shopPolicies{type url body}}`.
7. **Pages** (`pageCreate` / `pageUpdate`; SEO through `global.title_tag` and `global.description_tag`):

| Handle | Title | Template | Content |
|---|---|---|---|
| about | About Puppy Platoon | page | `We sell one thing: a soldier costume for dogs. Helmet, vest, plush arms and a soft plush toy rifle. Put it on and your dog looks like a tiny soldier on duty. We're a small online shop. Questions go to a real person at {email}, usually answered within 1 business day. Not affiliated with any military organization.` |
| size-guide | Size Guide | page.size-guide | §5 |
| faq | FAQ | page.faq | §11 (all 12) |
| track-order | Track Your Order | page.track | Tracking number input that opens `https://t.17track.net/en#nums={n}` in a new tab. Link `View your orders` → `{{ routes.account_url }}`. Line `No tracking email after 3 business days? Email us.` |
| contact | Contact Us | contact | Update the title only. Lead line `Questions about sizing, an order or a return? Send us a message. We reply to every email.` |
| data-sharing-opt-out | Your privacy choices | (keep) | Rename only. Never delete it. |

8. **Collection:**
   - Smart collection "Dog Costumes", `dog-costumes`, rule TAG = `pp-main`, SEO `Dog Costumes for Small Dogs | Puppy Platoon`. Publish it.
   - Rename the frontpage collection to "Featured".
   - Menus never link to `/collections/all`.
9. **Menus** (`menuUpdate` replaces the whole item list):
   - `main-menu`: Shop the Suit (PRODUCT), Size Guide, FAQ, Track Order, Contact (PAGE).
   - `footer` (title "Help"): FAQ, Size Guide, Track Order, Shipping Policy and Returns & Refunds (SHOP_POLICY), Contact.
   - `menuCreate` "Legal" (`footer-legal`): Privacy Policy, Terms of Service, Your privacy choices.
   - `customer-account-main-menu`: Orders, Profile.
10. **Verify markets:** `markets{nodes{name status conditions{regionsCondition{regions(first:250){nodes{...on MarketRegionCountry{code}}}}} currencySettings{baseCurrency{currencyCode}}}}`. Expect exactly 2 markets, US present only in United States, Worldwide covering the rest, and USD. Do not recreate them. Removing RU and BY is optional and up to the owner.
11. **Verify shipping:**
    - Run `draftOrderCalculate` (nothing is saved) with 1 suit to New York 10118 US, Berlin 10115 DE and Ankara 06145 TR.
    - Expect exactly `Free Standard Shipping 0.00 USD` and `Express Shipping 2.55 USD` for every address, each showing 5–7 business days.
    - With only the protection variant in the cart, expect no rates.
    - If rates come back empty, check `deliveryProfile.productVariantsCount` (should include the 5 suits) and that the `cjdropshipping` location is in the location group. If both are fine, it is an owner task.
12. **Theme settings and publish:**
    - Set the Horizon type fonts to DM Sans and the colour schemes (Scheme 1: bg #FBF6EC with ink #1F2A1C; Scheme 2: olive #4B5D2A with cream #FBF6EC; button #C2410C).
    - Remove Horizon's sticky ATC block.
    - `themePublish(id:"gid://shopify/OnlineStoreTheme/188335325432")`. If that is refused, the owner clicks Publish.
    - Verify with `themes(roles:[MAIN]){nodes{id name}}`.
13. **Real-cart tests:**
    - `/cart/add.js` with 1, 2 and 3 suits, with protection on and off, then TREAT10. Read `cart.js`: line discounts should be 0, 15% and 25%; protection undiscounted by A and B; TREAT10 `applicable:true` with $35 or more.
    - A mobile checkout preview in English with a US address and a non-US address shows both rates.

**Owner-only (cannot be done through the API; report these):**
- Default language, if the API refuses.
- Store name: set it to "Puppy Platoon".
- Checkout branding: logo, accent #4B5D2A, button #C2410C, DM Sans.
- An active payment provider (Shopify Payments is unavailable in TR).
- Notification sender name and email templates.
- Theme publish, if refused.
- Confirm the 1–2 day processing time and 5–7 day transit with CJ (FTC Mail Order Rule).
- Governing law and legal name.
- The CJ landed-cost margin check (§6.2).
- Fulfil PP-PROTECT lines by hand, because CJ does not map it.

---

## 15. Asset plan

### 15.1 Gallery (product media)

| Pos | Photo | Alt (exact) |
|---|---|---|
| 1 | p1 dachshund, hallway (LCP) | `Dachshund wearing the Puppy Soldier dog costume: camo helmet with headset, tan vest with US flag patches, plush arms holding a soft plush toy rifle` |
| 2 | p4 Milo | `Man holding Milo, a 6 lb Chihuahua, in the soldier costume, size S` |
| 3 | p5 Louie | `Louie, a 22 lb French Bulldog, sitting in the soldier costume, size M` |
| 4 | p7 three dogs | `Three small dogs in matching soldier costumes walking across a living room` |
| 5 | p3 set on display form | `Complete soldier costume set on a display form: camo helmet with headset, tan vest, sleeves with plush arms, plush toy rifle, camo pants` |
| 6 | p2 Frenchie on white | `French Bulldog in the soldier costume, front view on a white background` |

- **Delete p6** (duplicate box shot).
- **p3 caption** (HTML): `Shown on a display form. Packaging may differ.`
- On cards, the white background of p2 gets `mix-blend-mode:multiply` on khaki.
- Source files are 948px. Do not request widths larger than 948.
- **Section usage:**
  - Hero: image A or p1.
  - Explainer: p3.
  - Photo strip: p4, p5, p1, p7.
  - Bundles: p7.
  - Size finder: p4 crop.
  - Final CTA: p5.
  - Sticky bar, drawer and home bar thumbnails: p2 (`&width=160`).

### 15.2 Higgsfield (10 credits; hard cap 8, keep 2)
- **Image A (do this): studio version of p1** for the hero and social share. The PDP still opens on the real p1.
  - `media_import_url` on `https://cdn.shopify.com/s/files/1/0860/5306/0856/files/be781724-68f2-4eab-adcf-95d067d883b7_water.jpg`.
  - `generate_image` with `{model:"nano_banana_2_1", aspect_ratio:"4:5", resolution:"2k", seed:4242, medias:[{value:<id>, role:"image_references"}]}`.
  - **Prompt:**
    > Edit this exact photo. Keep the dog and costume pixel-faithful to the reference: same black-and-tan dachshund, same face and tan markings, same upright pose facing the camera, same camo helmet with olive ear-muff headset and black mic boom, same tan vest with exactly two small US flag patches (one on the chest, one on the right side of the vest as the viewer sees it), same camo sleeves with cream plush stuffed arms holding the same black soft plush toy rifle, same camo pants, same paws. Do not redraw, restyle, add or remove any part of the dog or costume. Replace only the background: remove the hallway, doors and floor tiles. Place the dog on a seamless warm khaki studio paper sweep, colour #E9DFC6, no horizon line. Soft large softbox from front-left, gentle contact shadow under the paws. Extend to 4:5 portrait, dog centred in the lower two-thirds, plain backdrop above the helmet. Photorealistic product photo, sharp focus, true colours. No text, letters, logos, watermark, props, people, hands or extra dogs.
  - **Reject it** if the flag count is not 2, the rifle looks metallic or realistic, there are extra limbs, the face changed, the headset or mic is lost, or any text appears. One retry.
  - Alt: `Dachshund in the Puppy Soldier costume standing on a khaki studio backdrop`.
  - Upload it to Shopify Files. Hero `widths: '450, 720, 1080, 1600'`, 120KB or less at 720w.
- **Image B (optional, 2 credits): p3 without the box**, 1:1 on #EFE5CF:
  > Remove the cardboard box, window frame and all printed text. Keep the costume on its invisible display form exactly as shown. Place it on a plain #EFE5CF background with a soft shadow. No text, logos or hands.

  If it passes, it replaces p3 in the explainer and at gallery position 5.
- If Higgsfield fails or credits run out, use p1 as is. No ChatGPT or browser is available for this session.

### 15.3 Code-drawn graphics (all text is live HTML)
1. **Camo tile:** a 160×160 SVG data-URI with blobs in `#C8B88E #7D7A4E #6B5A3E #3E3B2A` on `#B9AB82`, kept 8px inside the edges. Used at 8% opacity only.
2. Dog-tag badges, embroidered patches, masking-tape captions and the paw-trail divider (§1.4).
3. Icon set (§1.4). No stars.
4. Measurement diagram SVG (§5) and weight ruler SVG (§3.5).
5. Rank-chevron progress nodes and the shield icon for protection.
6. Image-1 chip `Plush toy rifle · soft fabric`.
7. Sergeant Pup (§12) and the game sprites (§13).
8. **Favicon:** `pp-favicon.svg` (dog tag + paw). Optional 96px PNG in settings.
9. **Social share:** image A at 1200×630.

---

## 16. Performance, accessibility and structured data

- **Budgets:**
  - Lighthouse mobile: Performance ≥80, Accessibility ≥95, SEO ≥95. LCP <2.5s, CLS <0.05, INP <200ms.
  - Above-the-fold images ≤250KB.
  - pp JS ≤50KB raw (≤15KB gzip); pp CSS ≤55KB raw.
  - At most 4 font files.
- **Images:** exactly one eager `fetchpriority="high"` image per page. Every other image is lazy with width and height set, and never placed inside `display:none`.
- **Scripts:** all `pp-*.js` load with `defer`. `pp-game.js` loads only when the game is enabled and runs only after a tap.
- **Stability:** `aspect-ratio` boxes for gallery, hero and game board. `tabular-nums` prices. A fixed-height progress area in the drawer.
- **Motion:**
  - Animate only transform and opacity.
  - Loops pause off-screen and on `visibilitychange`.
  - `prefers-reduced-motion` gives zero animation.
- **Accessibility:**
  - Native radios in a fieldset with a legend for sizes, bundles and upsell sizes.
  - Visible selected state beyond colour (a check icon).
  - `role="status"` live region for cart changes and `role="alert"` for errors.
  - Drawer: `showModal`, Esc closes, focus returns to the trigger.
  - Sticky ATC `inert` while hidden, plus `scroll-padding-bottom`.
  - Tap targets ≥44×44 with 8px gaps. Inputs at 16px.
  - Contrast fixes from §1.2: ink focus ring with gold halo, `--pp-line-strong` control borders, a cream border on orange-on-olive buttons, and a bordered gold track.
  - Emoji sit in `aria-hidden` spans. Strikethrough prices get screen-reader text.
  - The game is keyboard playable with a skip path, and nothing flashes more than 3 times per second.
- **JSON-LD:**
  - **Product** (one node): name, `image` (`width: 948`), description, sku, brand `Puppy Platoon`, `color: Camouflage`, offers per variant (price, USD, availability, url).
  - `shippingDetails`: free rate, `shippingDestination: {"@type":"DefinedRegion","addressCountry":"US"}`, transitTime 5–7 business days.
  - `hasMerchantReturnPolicy`: 30 days, `applicableCountry: US`, `returnMethod: ReturnByMail`. Only output this once the refund policy is live.
  - **No `aggregateRating` or `review`.**
  - Home: Organization (name, url, logo) and WebSite.
  - FAQPage text matches the visible copy word for word.
  - Validate with Rich Results: 0 errors.

---

## 17. QA checklist (10-agent review uses this)

**Commerce and operations**
- [ ] Exactly 2 markets: United States, and Worldwide (every other country). Both USD and ACTIVE. US is not in Worldwide.
- [ ] Checkout to a US address and a non-US address shows only `Free Standard Shipping $0.00` (5–7 business days) and `Express Shipping $2.55` (5–7 business days).
- [ ] Protection: off by default, adds $3 once, shows as a toggle (not a line), stays at qty 1, survives reload, is removed with the last suit, is never discounted by A or B, and is excluded from the bubble count.
- [ ] Bundles: 2 suits show $71.40 and 3 suits show $94.50 in `cart.js`, with mixed sizes. Removing one suit reverts to the right tier. 4 suits are 25% off.
- [ ] TREAT10: 10%, $35 minimum, once per customer. Stacks with A and B. Applied automatically after a win. The drawer shows `TREAT10 −$x`.
- [ ] Refund, shipping, terms, privacy and contact policies are published in English and match the FAQ text.
- [ ] Storefront and checkout are in English. Store name is Puppy Platoon (or flagged to the owner).
- [ ] Product: title `Puppy Soldier Dog Costume`, single "Size" option in order S–2XL, SKUs unchanged, no compare-at prices, p6 deleted, alt texts set.
- [ ] Menus and pages exist (about, size-guide, faq, track-order, contact, privacy choices). No links to `/collections/all`. No 404s.
- [ ] The theme is published (or flagged).

**Product page and cart**
- [ ] With no size chosen, the ATC shows "Choose your size" and focuses the picker. Sold-out sizes behave as specified.
- [ ] ATC labels and prices update for 1, 2 and 3 suits. Per-suit size rows work. `?bundle=2` and `?variant=` preselect.
- [ ] Add → `Adding…` → drawer opens → Sergeant Pup celebrates → the live region announces → the bubble count equals suits only.
- [ ] Sticky ATC: appears only after scrolling past the main ATC. Hidden while the drawer, a dialog, the keyboard or game play is active. Respects the safe area. Never covers the focused element. Mirrors size, bundle and price.
- [ ] Drawer: stepper debounce, remove and undo, size swap, upsell price `+$29.40` / `+$23.10`, progress copy and milestones, empty state, Esc and backdrop close, focus return, works on `/cart`.
- [ ] Delivery estimate on 2026-10-22 shows Fri, Oct 30 – Wed, Nov 4. The Christmas order-by is Fri, Dec 11. No Halloween line.
- [ ] Size finder: 6 lb → S, 22 lb → M (edge note offers L), 57 lb → XL (edge note offers 2XL), 95 lb → too big, empty → error. Name personalisation is escaped.
- [ ] Treat Drill: start, pause and resume, keyboard, tap lanes, auto-pause on collapse and scroll, lose → retry and skip, win → copy and apply, return visit shows the code, iPhone does not scroll during play.
- [ ] Mascot: hero salute on view, PDP lines change, drawer peek, reduced motion is static, at most 3 instances, no layout shift.

**Content and compliance**
- [ ] No stars, ratings, "Most popular", viewer or stock counters, resetting timers, invented stats, "Made in USA", military affiliation, or "army/gun/combat/war/official". Weapon wording only in "not a real or replica weapon".
- [ ] Express is never called faster or sooner. Every shipping mention says 5–7 business days.
- [ ] The footer disclaimer is present. The p3 box branding is never presented as ours.
- [ ] Prices come from money filters or JS money format. No hardcoded "$42" in Liquid output.

**Technical**
- [ ] Viewports 320, 360, 375, 390, 430 and 1280. iOS Safari and Chrome Android. `scrollWidth === innerWidth`.
- [ ] Lighthouse thresholds pass on home, PDP and with the drawer open. Console 0 errors. 0 image 404s.
- [ ] Inter is not downloaded. At most 4 font files.
- [ ] Reduced motion means zero animation. VoiceOver passes on gallery, sizes, bundles, ATC, drawer, protection and game skip.
- [ ] Rich Results: Product and FAQPage valid with 0 errors and no rating markup.

---

## 18. File map (Puppy Platoon v1; push order: assets → snippets → sections → templates → config → layout)

| File | Status | Notes |
|---|---|---|
| `layout/theme.liquid` | exists | Google font URL (§1.3), `pp-config`, `pp-cart-drawer` (skip on cart template), defer `pp-cart.js`, `pp-ui.js` (+ mascot) |
| `assets/pp-base.css` | exists | Tokens §1.2, focus ring fix, `--pp-line-strong`, mascot CSS §12.3 |
| `assets/pp-home.css`, `pp-product.css` | exist | §3, §4, §7.5 |
| `assets/pp-cart.js` | exists | §7. Rename events per §9. Tiers 15/25. Marginal upsell. Protection rules. |
| `assets/pp-product.js` | exists | `PP.pdp` state, bundles, size finder, sticky, delivery estimate |
| `assets/pp-ui.js` | exists | Announcement rotation, header hide on scroll, home bar, date utilities §8.3, mascot JS §12.4 |
| `assets/pp-game.js` / `pp-game.css` | update | Replace with §13.4 and §13.5 |
| `snippets/pp-mascot.liquid` | update | Replace with §12.2 |
| `snippets/pp-treat-drill.liquid` | new | §13.3 (or keep it inside `sections/pp-game.liquid`) |
| `snippets/pp-config.liquid` | update | §7.1 |
| `snippets/pp-size-data.liquid` | keep | It already matches the supplier chart (§5) |
| `snippets/pp-cart-drawer.liquid` | update | Native `<dialog>`, progress, upsell, protection switch, summary rows, empty state |
| `sections/pp-*.liquid` | exist | Bring copy in line with §2–§4 and §11 verbatim |
| `sections/pp-cart-page.liquid` | new | Inline cart |
| `templates/index.json` | exists | Order from §3 |
| `templates/product.json` | exists | `pp-product`, `pp-trust`, `pp-game`, `pp-faq` |
| `templates/product.protection.json` | new | Info-only section |
| `templates/page.*.json`, `404.json` | exist | §14 step 7, 404 copy §12.5 |
| `config/settings_data.json` | update | DM Sans fonts, colour schemes |
