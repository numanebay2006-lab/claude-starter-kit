# PRODUCT PAGE CRO plan: `sections/pp-product.liquid`

## 0. Principles
- Mobile-first. One column under 990px. Two columns at 990px and up: gallery 58%, buy box 42%, sticky at `top: 88px`.
- A visitor should know what this is within 3 seconds: "A soldier costume that makes your small dog look like it's standing and holding a toy rifle."
- Order of content in the buy box: understand it, choose a size, choose a bundle, add to cart, then reassurance. The game and mascot never sit above the ATC button.

## 1. Gallery
- **Mobile:** full-bleed scroll-snap track (`scroll-snap-type: x mandatory`), 1:1 aspect ratio, `object-fit: cover`, background `#EFE9DC`. Dot pager under the track (8px dots, active one 22px pill in `#4B5E2A`). Counter chip "1/5" at top-right on a `rgba(31,36,24,.72)` background. Below the track, a thumbnail strip of 64×64px thumbs, 8px gap, horizontal scroll, active thumb with a 2px `#C8962E` border.
- **Desktop:** main image plus a vertical thumbnail rail on the left (72px). Click to swap. Arrow keys work when the gallery has focus.
- **Image order:** p1 (dachshund, front) first, then p4 (Milo, 6 lb, size S, which is real size proof), then the other angles, then lifestyle.
- **Overlay badge on image 1** (top-left chip): "Plush toy rifle · soft fabric". This answers the weapon question early.
- Tap to open a fullscreen `<dialog>` lightbox with swipe and Esc to close. Lazy-load every image except the first, which gets `fetchpriority="high"`. Use `srcset` widths of 600, 900 and 1200. Alt text comes from media alt, falling back to "Small dog wearing the Puppy Soldier costume, view N".
- When a variant has `featured_media`, scroll to it. The current product images are not size-specific, so ignore variant images unless they are set.

## 2. Title block
- Eyebrow (12px, uppercase, letter-spacing .12em, `#4B5E2A`): "SERGEANT PUP COSTUME CO." (or the shop name).
- H1 (display font, 28px mobile / 36px desktop): **Puppy Soldier Costume**. Subline (16px, `#3A3F33`): "Your small dog, standing at attention. Helmet, vest, plush arms and a soft toy rifle in one suit."
- **Price row:** `$42.00` at 26px/700 in `#1F2418`.
  - Show the compare-at price **only when** `variant.compare_at_price > variant.price` is really set in admin. Do not invent one.
  - When a compare-at exists, render it struck through in `#8A8F80` and add a "Save $X" chip (`#C8962E` background, `#1F2418` text).
  - When a bundle tier is selected, the price row shows that bundle's total and the per-suit price: "$71.40 · $35.70 each".
- Under the price, a 13px line: "Free 5–7 day shipping · Taxes calculated at checkout".

## 3. Rating line policy (no fake reviews)
- If `product.metafields.reviews.rating` exists and the count is 1 or more, render stars and the count.
- Otherwise, show the honest line "New drop: be one of the first squads to wear it. Send us your pup's photo and we may feature it." It links to `#pp-photo-wall` (homepage UGC placeholder) or to a mailto.
- Never render stars at 0, "4.9/5", or "1,000+ happy dogs".

## 4. "What's in the kit" strip (right under the subline)
Four inline icon chips, CSS/SVG, 36px icons:
- "Camo helmet + headset"
- "Flag-patch vest"
- "Plush arms + toy rifle"
- "Camo pants"

## 5. Size selector
- Radio pills (`<fieldset><legend>Size: <span>M</span></legend>`), 5 per row, min 56×48px tap target. Selected pill: `#4B5E2A` background, `#FFF` text. Unavailable pill: strikethrough, `opacity:.45`, still focusable, label "S, sold out".
- A hint line under the pills updates with the selection, e.g. "M · 7–11 lb · chest 14–16 in · Chihuahua, Yorkie, Toy Poodle".
- **Size guide** (open through a "Size guide" link in a `<dialog>`, and repeated in the accordion). Label it: "Guide only. Measure your dog's chest behind the front legs. Between sizes? Size up."

| Size | Weight | Chest | Typical breeds |
|---|---|---|---|
| S | up to 7 lb | 12–14 in | Chihuahua, teacup Yorkie |
| M | 7–11 lb | 14–16 in | Yorkie, Toy Poodle, Pomeranian |
| L | 11–15 lb | 16–18 in | Mini Dachshund, Shih Tzu, Maltese |
| XL | 15–20 lb | 18–20 in | Pug, Dachshund, small Frenchie |
| 2XL | 20–25 lb | 20–22 in | Frenchie, Boston Terrier, Beagle pup |

Proof line: "Milo is a 6-lb Chihuahua. He wears size S." The owner should check this table against CJ's chart before launch, and it should be editable through section block settings.

- **No default size:** do not preselect. The ATC reads "Choose a size" and stays disabled until a size is picked. This cuts wrong-size returns.
- **Find my size helper:** an inline expandable row reading "Not sure? Find my size in 5 seconds."
  - Inputs: number field "Weight" with a lb/kg toggle (kg × 2.2046), plus an optional "Chest (in)".
  - Logic: weight over 25 lb → message "This suit fits dogs up to about 25 lb. It may be too small." and no size gets selected. If chest is given and points to a larger size than weight does, pick the larger size.
  - Output: "Recommended: **L**" plus a "Select L" button that sets the radio and scrolls back up.
  - Remember the result in `localStorage` (wrapped in try/catch) as `pp_size`.

## 6. Bundle selector ("Pick your squad")
Three stacked radio cards, full width, 12px radius, 2px border `#D9D2C0`. Selected card: border `#4B5E2A` with background `#F3F5EC`.

1. **1 Suit:** $42.00
2. **2 Suits (Buddy Pack):** save 15% → $71.40. Badge "MOST POPULAR" is **not allowed** because there is no data behind it. Use "Best for siblings" instead.
3. **3 Suits (Full Squad):** save 25% → $94.50. Badge "Best value".

Rules:
- Percentages come from section settings and must match an Admin automatic discount (quantity-tier "Squad" discount), so the cart shows the same totals.
- For 2 or 3 suits, each unit gets its own size dropdown (defaulting to the main size) so a household with different dogs can mix sizes.
- ATC posts `items[]` to `/cart/add.js`, one line per size, merging quantities when sizes repeat.
- Copy under the cards: "Discount applied automatically in cart."
- No separate quantity stepper. The bundle cards are the quantity. The cart drawer allows editing afterwards.

## 7. ATC block
- **Primary button:** full width, 56px tall, `#C8962E` background, `#1F2418` text, 18px/700, 10px radius.
  - Label: "Add to cart · $42.00", updating with the bundle total.
  - Loading state: spinner plus "Adding…".
  - Success: open `pp-cart-drawer`.
  - Error: inline message in `#B3261E` showing the response's `description` (for example an inventory error), and focus moves to the message.
- **Dynamic checkout buttons:** do not render them, to protect bundle and protection logic. The buy box is a single-CTA design.
- **Delivery estimate line**, under the button, with a truck icon: "Free delivery: arrives **Tue, Oct 28 – Thu, Oct 30**".
  - JS adds 5 and 7 business days to today, skipping Sat and Sun, and formats with `toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'})`.
  - Second line: "Need it sooner? Express at checkout, $2.55."
  - Without JS, the static fallback reads "Free delivery in 5–7 business days".
  - Label it as an estimate: "Estimated. Ships worldwide."
- **Trust row** (3 columns of icon plus 12px label):
  - "Free 5–7 day shipping"
  - "Secure checkout"
  - "Package protection available"
  - Add returns only if the store policy exists, linking `shop.refund_policy.url` with the label "Easy returns". Do not state a day count unless the policy says it.

## 8. Mascot and mini-game placement
- **Sergeant Pup (SVG mascot):** 64px, sits at the left of a speech bubble placed directly under the trust row.
  - The bubble changes with state: "Pick a size, recruit!", then "Good choice. L fits most mini dachshunds." after selection, then a salute animation and "Welcome to the squad!" after ATC.
  - Turn off motion under `prefers-reduced-motion`.
- **Treat Drill game:** its own card *below* the accordions, before cross-sell.
  - Title "Treat Drill: tap 10 treats in 15 seconds, unlock 10% off".
  - The canvas only lazy-inits on a "Start drill" tap.
  - When the player wins, show a real Admin discount code (for example `TREATDRILL10`) with Copy and "Apply & add to cart" (`/discount/CODE?redirect=/products/handle`).
  - It never overlays the page and is fully skippable.
  - Optional: a 1-line teaser link under the ATC, "Play Treat Drill for 10% off ↓", that scrolls to the card.

## 9. Accordions (`<details>`, so they work without JS)
First one open by default.
1. **What you get:** helmet with ear-muff headset and mic, vest with US flag patches, camo sleeves with plush arms, plush toy rifle (soft fabric, not a real or replica weapon), camo pants.
2. **Sizing & fit:** the table plus how to measure.
3. **Shipping & delivery:**
   - Free standard shipping, 5–7 business days.
   - Express shipping for $2.55.
   - Package protection is optional, $3, chosen in the cart.
   - Two markets: US and worldwide.
4. **Care:** spot clean or hand wash cold, air dry. Supervise your dog while it's dressed. Not a chew toy. Remove for unsupervised time.
5. **FAQ:**
   - "Is the rifle real?" No. It's soft plush fabric.
   - "Will my dog tolerate it?" Most dogs do best with short, treat-rewarded try-ons.
   - "Can my dog walk in it?" Yes. The plush arms sit in front. Keep wear short.
   - "Great for?" Halloween, 4th of July, birthdays, photos.

## 10. Cross-sell
- Below the game, "Complete the mission": `recommendations` API (`/recommendations/products?product_id=&limit=4&intent=complementary`), excluding the hidden protection product by tag `pp-hidden`.
- If nothing comes back, hide the block entirely. Do not render an empty heading.
- At launch there is a single product, so the block is likely hidden. The bundle cards act as the upsell.

## 11. Sticky ATC (`sections/pp-sticky-atc` or a block in the product section)
- **When it shows:** an IntersectionObserver on the main ATC button. Show the bar when the button has scrolled *above* the viewport. Hide it when the main ATC is visible, when the footer is reached, or while the drawer or a dialog is open.
- **Mobile layout:** bottom bar 72px plus `env(safe-area-inset-bottom)`, background `#1F2418`. Contents:
  - 44px thumbnail
  - "Soldier Suit" and the current size and bundle ("M · 2 suits")
  - Price
  - Button "Add to cart" at 48px tall in `#C8962E`
- **No size chosen yet:** the button reads "Choose size" and scrolls to the size fieldset with a 600ms highlight pulse. It does not open a separate picker.
- **Desktop:** a top bar instead (64px) with the same contents plus a compact size select.
- It shares state with the main form through one JS store, using `CustomEvent('pp:variant-change')`.
- Add `body { padding-bottom: 80px }` while the bar is visible so the footer isn't covered.
- **Variant sold out:** the button is disabled and reads "Sold out in M · pick another size".

## 12. Edge cases
- **Sold-out variant:** the pill is crossed out but still selectable to show the message "M is sold out. Try L." The ATC is disabled with the label "Sold out".
- **Whole product unavailable:** the ATC reads "Sold out" and a "Notify me" `contact` form posts with tags `restock`.
- **No JS:**
  - A native `<form action="/cart/add">` with a `<select name="id">` of variants is rendered inside `<noscript>`, or progressively replaced.
  - The bundle cards degrade to a quantity input (1–3).
  - The accordions work through `<details>`.
  - The delivery line shows the static "5–7 business days".
  - The sticky bar and game do not render.
- **The second option** ("Puppy Soldier Clothes Suit", one value) is auto-selected and hidden. Variant lookup still matches on both options.
- **The hidden $3 protection product** must never appear in recommendations, search or the sticky bar.
- **Currency:** worldwide market prices use `{{ variant.price | money }}`. JS formatting reads `Shopify.currency.active` and a `money_format` passed in through a JSON script tag. Bundle math must be done in cents.
- **Error at `/cart/add.js` (422):** show the server message and keep the selection.
- **Accessibility:**
  - `aria-live="polite"` on the price and the delivery line.
  - Pills are radios.
  - 4.5:1 contrast checked: `#1F2418` on `#C8962E` passes.
  - Visible focus rings: 2px `#1F2418` outline, 2px offset.

## Palette and type used above
- Olive `#4B5E2A`, ink `#1F2418`, sand `#EFE9DC`, brass CTA `#C8962E`, muted `#8A8F80`, border `#D9D2C0`, error `#B3261E`.
- Display font: "Black Ops One" for the H1 only. Body font: "Inter" (or Nunito for a softer feel), loaded through Google Fonts.