## Offers, bundles and pricing plan

**Checked live on the store (read-only):** product `gid://shopify/Product/15436873138424`. All 5 variants are $42.00 and none has a compare-at price. The store has no discounts yet. The only policy on file is the privacy policy, so there is **no refund policy**.

**Checked in the Shopify docs:**
- A minimum quantity counts only qualifying items. One suit plus the protection product does not trigger the 2-suit discount.
- Below the Plus plan, a cart line gets only one product discount. Shopify applies the best one.
- `/cart/update.js` accepts a `discount` parameter (added May 2025).

### 1. Bundle ladder

The price is per suit. Customers can mix sizes, and the discount applies automatically.

| Tile | Name | Total | Struck price | Each | Chip |
|---|---|---|---|---|---|
| 1 suit | Recruit | $42.00 | none | $42.00 each | none |
| 2 suits | Battle Buddies | $71.40 | ~~$84.00~~ | $35.70 each | **Save $12.60** |
| 3 suits | The Squad | $94.50 | ~~$126.00~~ | $31.50 each | **Save $31.50** + ribbon **Best value** |

- Orders of 4 or more stay at 25% off (the ≥3 rule). Line under the tiles: "4+ suits? Every suit stays 25% off."
- **Default selection is 1 suit.** Most traffic will be single-dog TikTok impulse buyers. Pre-selecting 2 risks accidental double orders and costly dropship returns. The 2-suit tile carries the helper line "Two dogs? Or one for a friend's pup."
- **Never use "Most popular".** There is no data behind it. "Best value" on the 3-suit tile is true because it has the lowest price per suit.
- **Compare-at price:** leave it empty on all variants. There was never a higher price, and both the FTC and the EU Omnibus rules forbid a fake reference price. The only strikethrough is on the bundle tiles: quantity × the current $42. Give it the screen-reader label "Price if bought one at a time: $84.00".
- When 2 or 3 is selected, show one size row per suit ("Suit 1", "Suit 2", "Suit 3") using pills S/M/L/XL/2XL. Each row defaults to the size currently selected.
  - Helper: "Mix sizes freely. Savings apply automatically in your cart."
  - Group the rows by variant and send one `/cart/add.js` call with `items:[{id,quantity}]`.
  - Use no line-item properties, so lines merge and the quantity-based discount still applies.
- **ATC button label:** "Add 1 suit · $42.00", "Add 2 suits · $71.40" or "Add 3 suits · $94.50".
  - Sub-line: "Free 5–7 business day shipping · Bundle savings applied automatically".
  - The sticky ATC mirrors it: "Add 2 · $71.40".
- **Styling** (override with the design tokens if they differ):
  - Tile: min-height 76px, radius 14px, 1.5px border #D9CFB6, background #FFFDF7.
  - Selected tile: 2px border #4B5D2A, background #F1EEDC, olive radio dot.
  - Save chip: background #FFE3B8, text #7A3E00, 12px/700, radius 999px, padding 3px 8px.
  - Best value ribbon: background #4B5D2A, text #FFFFFF, 11px uppercase.
  - Struck price: #8A8676.
- **Money:** do all price math in JS from `variant.price` in presentment-currency cents and format it with the shop money format. Never hardcode "$71.40". Prices in other markets convert, and percentages convert cleanly, which is one reason to use % over fixed-amount discounts. After an add, trust `cart.js`, because rounding can differ by ±1 cent.

### 2. Discount setup (Admin API, Basic plan, no apps)

**A. Automatic discount, 2 suits**

```graphql
mutation($d: DiscountAutomaticBasicInput!){ discountAutomaticBasicCreate(automaticBasicDiscount:$d){ automaticDiscountNode{id} userErrors{field code message} } }
```

```json
{"d":{"title":"Battle Buddies: 15% off 2 suits","startsAt":"2026-10-22T00:00:00Z","context":{"all":"ALL"},
"customerGets":{"value":{"percentage":0.15},"items":{"products":{"productsToAdd":["gid://shopify/Product/15436873138424"]}}},
"minimumRequirement":{"quantity":{"greaterThanOrEqualToQuantity":"2"}},
"combinesWith":{"productDiscounts":false,"orderDiscounts":true,"shippingDiscounts":true}}}
```

**B. Automatic discount, 3 or more suits:** same mutation with title `"Squad: 25% off 3+ suits"`, `percentage: 0.25` and `greaterThanOrEqualToQuantity: "3"`.

- With `productDiscounts:false`, A and B never stack. At 3 suits Shopify applies the best one, which is 25%.
- Neither has an end date.
- The protection product is not in `productsToAdd`, so it is never discounted and never counts toward the minimum.

**C. Game reward code TREAT10**

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

- `items:{all:true}` makes this an **order** discount. It stacks on top of A or B because both sides allow the combination.
- Using a product-discount code would fail on non-Plus plans: only one product discount per line, so the code would be rejected on bundles. A buyer who "won" a code that then doesn't work is the worst possible UX.
- **Side effect:** a 10% order discount also takes $0.30 off the $3 protection line. That is acceptable.
- The $35 minimum blocks a cart that holds only protection.
- No usage limit and no end date. It is evergreen, with no fake expiry.
- **Code to verify after creating:** confirm the title and value with a query, then test real carts with 1, 2 and 3 suits (with and without protection) and TREAT10. LESSONS §6: a code's name is not its value.

**Stacked prices to show in the game win modal:**

| Suits | With TREAT10 | Discount |
|---|---|---|
| 1 | $37.80 | 10% |
| 2 | $64.26 | 23.5% effective |
| 3 | $85.05 | 32.5% effective |

**Margin guard:** 3 suits with TREAT10 is $28.35 per suit, and standard shipping is paid by the store. If CJ's landed cost (product plus shipping) is above ~$17 per suit, change B to 20% ($100.80 for 3, "Save $25.20"). This is the only number that depends on cost.

**No second public code.** If any popup collects emails, it offers TREAT10 or no discount. Two competing % codes confuse buyers and invite stacking errors.

### 3. Game reward mechanics

- **Win rule:** catch 8 treats in 20 seconds. Retries are unlimited.
- After the first attempt, show the link "Skip the drill, show my code". This is the accessibility path, and it also makes the "everyone can earn it" message true.
- **Win copy:**
  - Headline: "Drill complete, Recruit! 10% off unlocked."
  - Body: "Code TREAT10 is on your cart. It stacks with bundle savings. One use per customer."
- **Apply the code:**
  1. `POST /cart/update.js {"discount":"TREAT10"}` and read `cart.discount_codes[].applicable`.
  2. Fallback: save the code in localStorage and append `?discount=TREAT10` to the drawer's checkout URL.
  3. Show a "Copy code" button either way.
- If the cart is empty, show: "Saved. It applies when a suit is in your cart."

### 4. Cart drawer: progress bar sells bundles

Standard shipping is always free, so free shipping is the first milestone and is reached at once. The bar then pushes quantity.

- **Count:** `n` = total quantity of the suit product across all variants.
- **Bar:** three nodes labelled "Free shipping", "15% off" and "25% off". Fill = min(n,3)/3, so 33%, 67% or 100%.
  - Track: 8px high, #E6DFCB. Fill: #4B5D2A. Transition: `transform` only.
  - Nodes: 18px circles. A reached node shows a white check on olive.

| n | Message | Upsell button |
|---|---|---|
| 0 | "Every order ships free (5–7 business days). 2 suits save 15%. 3+ save 25%." | none |
| 1 | "Free shipping unlocked. Add 1 more suit and save 15% on both." | **"+ Add a 2nd suit for $29.40"** |
| 2 | "Battle Buddies unlocked: you save $12.60. Add 1 more for 25% off all 3." | **"+ Add a 3rd for $23.10"** |
| ≥3 | "Squad unlocked: 25% off every suit. You save $X." | none (shows "Max savings") |

- **Upsell price = the true marginal cost.** It is total(n+1) − total(n), where total(k) = k·p·(1−r(k)), with r(1)=0, r(2)=0.15 and r(≥3)=0.25. The button sits next to a size select that defaults to the size of the last line added.
- The "You save" amount is the sum of the suit lines' `line_level_discount_allocations`. Each line shows `original_line_price` struck through and `final_line_price`.
- Show TREAT10 from `cart_level_discount_applications` as its own summary row: "TREAT10 −$x.xx".
- **When the quantity drops a tier**, show a toast such as "Add 1 more suit to get your 15% back." Never block the action.
- **Shipping row:** "Free standard (5–7 business days) · Express $2.55 at checkout".

### 5. Package protection, $3

- **Hidden product:** "Package Protection", handle `package-protection`, $3.00, one variant.
  - `requiresShipping:false`, so it does not change shipping rates.
  - Inventory not tracked. Published to the Online Store (required for `cart/add.js`).
  - Metafield `seo.hidden=1`. Kept out of all collections.
  - Taxable: owner's or accountant's call. The default is not taxable.
- **Toggle behaviour:**
  - **OFF by default** in every market. Pre-ticked paid add-ons are illegal in the EU.
  - Turning it on adds quantity 1. Turning it off sets the quantity to 0.
  - The quantity is always forced to 1, at a flat $3 per order whatever the bundle size.
  - It is removed automatically when n = 0.
  - It is shown only as the toggle row, not as a normal line, so nobody mistakes it for a second item.
- **Toggle copy:**
  - Title: "Package protection · $3.00"
  - Body: "Lost, stolen or damaged in transit? We reship your order free or refund it. Optional, one price per order."
  - Link: "How it works" goes to the FAQ: "Email us within 14 days of the delivery date (or 30 days after the latest estimated date if it never arrives) with a photo or your tracking number."
- **Never imply that unprotected orders have no recourse.** The EU puts transit risk on the seller.

### 6. Honest urgency (no stock counters, no resetting timers)

The urgency is real seasonal deadlines, computed in JS from a config of `{event, date}`.

- **Delivery estimate:** today + 5 to 7 business days. Skip weekends and US carrier holidays (Nov 26, Dec 25, Jan 1, Jul 4). Today (Thu Oct 22) that gives "Order today, estimated delivery Thu, Oct 29 – Mon, Nov 2."
- **Order-by date** = event date − 7 business days − 1 buffer day. If it is still ahead, show "Order by {date} for delivery before {event} (standard shipping)." Show the date only, never a seconds countdown.
- **Halloween right now:** the deadline has already passed (Halloween is Saturday, Oct 31). Show the honest version: "Halloween is Sat, Oct 31. Standard delivery takes 5–7 business days, so orders placed now may arrive after Halloween. Still perfect for the costume parade pics and your holiday card."
- **Next events:**

| Event | Order-by date | Message |
|---|---|---|
| Christmas | Mon, Dec 14 | "Holiday card photo, sorted." |
| National Dog Day | Aug 26 | |
| 4th of July | | |
| Halloween 2027 | | |

- Skip Veterans Day. A sale tie-in risks implying military affiliation.
- Do not claim Express delivers in time unless the shipping agent sets real Express transit days. The estimator reads its min/max days from section settings.

### 7. Guarantee

- No refund policy exists, so **show no guarantee badge yet.** Flag this to the lead: fill in Settings > Policies > Refund policy (recommended: 30 days, unworn, return shipping paid by the buyer unless the item is faulty). Then mirror its exact terms near the ATC.
- A zero-cost reassurance that can go live now: "Not sure on size? Send us your dog's weight and chest size. We'll reply with the right fit."
- No free physical gifts, because we can't ship them reliably. No "worth $X" claims.

### 8. Expected AOV

These are planning assumptions, to be re-checked after 100+ orders.

**Assumed mix:** 65% buy 1 suit, 25% buy 2, 10% buy 3.

| Component | Per order |
|---|---|
| Product | 0.65×42 + 0.25×71.40 + 0.10×94.50 = **$54.60** (1.45 suits per order) |
| Protection (35% take it) | +$1.05 |
| Express (20% choose it) | +$0.51 shipping revenue |
| TREAT10 (15% use it) | −$0.83 |
| **Net AOV** | **≈ $55.30** |

That is about +32% over the $42 baseline.

**Main levers:** the drawer upsell priced at the marginal cost ("2nd suit for $29.40") and the 3-suit tile's "Save $31.50".

**Track:** units per order, share of orders at 2 or more suits, protection take rate, and TREAT10 redemption rate (Shopify discount reports).