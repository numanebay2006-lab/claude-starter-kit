# Homepage Structure & CRO Plan: Puppy Soldier Clothes Suit

**What a visitor must get in 5 seconds:** "A soldier costume for small dogs. $42. Free shipping." These three facts stay in the hero on every screen size.

**Photo notes (from viewing p1 to p5):**
- **p1**: dachshund standing in a hallway. This is the clearest shot of the whole costume, so it is the hero image.
- **p2**: the p5 French Bulldog cut out on white. Good for cards, the bundles teaser and the sticky bar thumbnail.
- **p3**: an in-box packaging shot branded "K9 COMMANDO GEAR / DOGGY SOLDIER OUTFIT". It looks AI-made and may not match what ships. Use it only as "What's in the set" with the caption "Set includes: helmet with headset, vest, sleeves with plush arms, plush toy rifle, pants." Never caption it "what arrives" or show the box branding as our brand.
- **p4**: man holding Milo, a 6-lb Chihuahua in size S (caption is already burned into the image).
- **p5**: Louie, a 22-lb French Bulldog in size M (caption burned in). p4 and p5 are the only real size data we have. The size finder must use them plus the product's size chart, and nothing invented.

---

## 0. Header (Horizon header, restyled)
- **Announcement bar** (`#2F3A23` background, `#F4EBD9` text, 13px/600, 36px tall, static and not rotating): `FREE 5–7 day shipping · Express just $2.55`
- **Logo**: text wordmark "Puppy Platoon" in Display font. Use a 28px saluting mascot icon on the left only if the mascot SVG exists.
- **Nav, desktop** (5 items max): `Shop the Suit` (product URL) · `Size Guide` (#size-finder) · `Bundles` (#bundles) · `FAQ` (#faq) · `Track Order` (/pages/track or the contact page).
- **Nav, mobile**: hamburger on the left, logo in the centre, cart icon with count bubble (`#E8A33D`) on the right. Hide search, because there is only one product.
- Remove the country/currency switcher from the header (the footer handles it). Remove the account icon on mobile.
- Header is sticky, white `#FFFDF8` with a 1px bottom border `#E4DCC8`, 60px on mobile and 72px on desktop.

## 1. Hero: product, price, mascot (`pp-hero`)
**Purpose:** answer what it is, the price and the next step, with nothing to scroll past.
- **Mobile:** stacked. The p1 image comes first (square, full width, 16px radius, eager-loaded with `fetchpriority=high`). The text block sits under it with 20px padding. The animated mascot "Sergeant Pup" (96px SVG) sits over the bottom-left corner of the image. It salutes once on load (about 1.2s) and again on tap. Use `prefers-reduced-motion` to show a static pose.
- **Desktop (≥990px):** two columns at 55/45. Image on the left (max 620px), copy on the right, vertically centred. Mascot is 140px.
- **Copy:**
  - Eyebrow (12px uppercase, letter-spacing .12em, `#5B6B3A`): `DOG COSTUME · SIZES S–2XL`
  - H1 (Display, 34px mobile / 56px desktop, line-height 1.05, `#1F2615`): `Turn your little dog into a tiny soldier.`
  - Sub (17px/1.5): `Full camo suit with helmet, headset, vest and soft plush arms that "hold" a plush toy rifle. Your dog looks like it's standing on duty.`
  - Price row: `$42` (28px/800) with the pill `Free shipping` (`#E6EDD8` bg, `#3C4A26` text). If the bundle discount exists, add a third item: `Save up to 20% with Squad bundles` as an underlined link to #bundles. The 20% figure must match the real discount.
  - Primary CTA button (full width on mobile, 56px tall, `#E8A33D` bg, `#1F2615` text, 18px/800, 12px radius): `Enlist My Dog – $42`, linking to the product URL.
  - Secondary text link: `Not sure of the size? Find it in 10 seconds →` to #size-finder.
  - Micro-trust line (13px, icons drawn inline as SVG): `5–7 day free shipping · 30-day returns · Secure checkout`. Show the returns claim only if the store's refund policy says so; otherwise use `Easy returns`.
- **Edge cases:** if the product is unavailable, the CTA becomes `Sold out – notify me` and is disabled-styled. Read the price with `product.price | money` so the Worldwide market converts it. Never hardcode "$42"; that applies to the CTA label too.

## 2. Instant Explainer: "What's in the suit" (`pp-explainer`)
**Purpose:** kill confusion ("is it a toy? a real gun?").
- **Mobile:** a 2x3 grid of icon tiles (icons are inline SVG, 40px), 12px gap. **Desktop:** one row of 5 tiles plus a p3 thumbnail.
- **Heading:** `Everything in one set`
- **Tiles:**
  - `Camo helmet + headset`
  - `Tan vest with flag patches`
  - `Camo sleeves + plush arms`
  - `Plush toy rifle (soft fabric, not a real or replica weapon)`
  - `Camo pants`
- p3 sits beside the tiles at 1:1, captioned `What's in the set`.
- **Three-step strip underneath:**
  1. `Pick a size by weight`
  2. `Velcro on in about a minute`
  3. `Take the photo`

  Do not state a time if it is unverified. In that case use `Velcro on, no fuss`.

## 3. Photo strip: "Reporting for duty" (`pp-squad-photos`)
**Purpose:** real-world proof without fake reviews.
- **Mobile:** a horizontal scroll-snap row of 4:5 cards, 78% card width, 12px gap, showing the next card's edge as a peek. Use `overflow-x:auto` on the row only, never on the body. **Desktop:** a 4-column grid.
- **Cards:**
  - p4: `Milo · 6 lb Chihuahua · Size S`
  - p5: `Louie · 22 lb French Bulldog · Size M`
  - p1: `Dachshund on patrol`
  - p2: `Frenchie, front view`
- **Heading:** `Reporting for duty`
- **Sub:** `Real dogs, real sizes. Tag @puppyplatoon to join the squad.` Use this only once the handle exists; otherwise drop the second sentence.
- **CTA:** `Get the suit →` linking to the product.
- **Reviews:** no stars and no review counts until real reviews exist.

## 4. Bundles teaser (`pp-bundles-teaser`, id `bundles`)
**Purpose:** raise AOV before the visitor reaches the product page.
- **Layout:** three cards stacked on mobile, three columns on desktop. The middle card is raised with a 2px `#E8A33D` border and the badge `MOST POPULAR`. That badge is only allowed if it is true; otherwise use `BEST VALUE` on the 3-pack.
- **Cards** (prices come from the real automatic discount and are computed in Liquid from the product price):
  - `Solo Recruit` – 1 suit – `$42`
  - `Buddy Pair` – 2 suits – `Save 10%` – for multi-dog homes and gifts
  - `Full Squad` – 3 suits – `Save 20%`
- **Heading:** `Got more than one pup? Suit up the squad.`
- **Each card's CTA:** `Choose` links to `/products/puppy-soldier-clothes-suit?bundle=2`, and the product section preselects that bundle from the query param.
- **Note under the cards:** `Mix sizes freely. Discount applies automatically at checkout.`

## 5. Size finder CTA (`pp-size-finder`, id `size-finder`)
**Purpose:** remove the number-one hesitation, which is fit.
- **Layout:** a band in `#F4EBD9` with 24px padding. On mobile it is a single card. On desktop it is two columns: the p4 crop on the left and the tool on the right.
- **Heading:** `Find your dog's size in 10 seconds`
- **Interaction:** a weight input in lb (with a kg toggle) and an optional breed chip row: Chihuahua, Yorkie, Pomeranian, Dachshund, Frenchie, Pug, Shih Tzu. On submit it shows `Your size: M`.
  - The weight bands come from the supplier size chart.
  - Anchor the examples to p4/p5: `Milo, 6 lb → S · Louie, 22 lb → M`.
- **Result CTA:** `Get size M – $42` links to `/products/...?variant={id}`.
- **Edge cases:**
  - Between sizes: `Between sizes? Go one size up.`
  - Over the 2XL limit: `This suit fits small and medium dogs up to [max] lb.` with no CTA.
  - Empty input: an inline error, `Enter your dog's weight`.

## 6. Occasions (`pp-occasions`)
**Purpose:** give the visitor a reason to buy now.
- **Layout:** chips in a horizontal scroll on mobile, a 4-up grid of illustrated cards on desktop (SVG or emoji-free icons, `#E6EDD8` tiles).
- **Heading:** `Made for the moments you'll photograph`
- **Cards:**
  - `Halloween – the costume everyone asks about`
  - `4th of July – stars, stripes, tiny helmet`
  - `Birthdays & dog parties`
  - `TikTok & Reels – instant reaction content`
- **CTA:** `Shop the Suit`
- **Seasonal line:** if the current date is before Oct 31, show `Order by Oct 20 for Halloween with free shipping. Express ($2.55) gives you a few extra days.` Compute the cutoff dates from the 5–7 day window, and hide the line after the cutoff. This is honest urgency only.

## 7. Guarantee & shipping strip (`pp-trust-strip`)
- **Layout:** `#2F3A23` background, `#F4EBD9` text. Four items in a 2x2 grid on mobile, one row on desktop. Icons are 28px with 14px/600 labels.
- **Items:**
  - `Free shipping · 5–7 business days`
  - `Express shipping · $2.55`
  - `Package protection · $3, optional`
  - `Secure checkout`
- Add `Easy returns` as a fifth item only if the policy supports it. Each item's microcopy link goes to the shipping policy.

## 8. FAQ (`pp-faq`, id `faq`)
- Use `<details>` accordions, 56px min tap height, one column at max 760px. Add FAQPage schema.
- **Questions:**
  1. `How do I pick the right size?` → link to #size-finder, plus the Milo and Louie examples.
  2. `Is the rifle real?` → `No. It's a plush toy rifle made of soft fabric. It is not a real or replica weapon.`
  3. `Can my dog walk in it?` → state honestly that it is made for photos and short wear, and to supervise your dog.
  4. `How long does shipping take?` → `Free standard: 5–7 business days. Express: $2.55.`
  5. `What is package protection?` → `An optional $3 add-on in your cart that covers lost or damaged parcels. Untick it any time.`
  6. `Do you ship outside the US?` → `Yes, worldwide.`
  7. `Can I return it?` → follow the actual policy.
  8. `How do I wash it?` → `Spot clean or hand wash cold. Air dry.`
- Do not invent coverage terms for package protection beyond what the owner defines.

## 9. Final CTA (`pp-final-cta`)
- **Layout:** p5 at full width on mobile and on the right on desktop. Background `#5B6B3A`, text `#FFFDF8`. The mascot salutes when the section scrolls into view (IntersectionObserver, once).
- **H2** (40px desktop / 28px mobile): `Ready for the cutest salute on your street?`
- **Sub:** `$42 · Sizes S–2XL · Free 5–7 day shipping`
- **Button:** `Enlist My Dog` in amber `#E8A33D`.
- **Sticky homepage bar (mobile only):** a 64px bar showing a p2 thumbnail, `$42` and the button `Shop Now`. It appears after the hero CTA scrolls out of view and hides while the footer is visible. Respect the safe area with `padding-bottom: env(safe-area-inset-bottom)`.

## 10. Footer (Horizon footer, restyled `#1F2615` / `#E4DCC8`)
- **Col 1, Puppy Platoon:** `Costumes that make small dogs look like tiny soldiers.` Add social icons only if the accounts exist.
- **Col 2, Shop:** Shop the Suit · Bundles · Size Guide
- **Col 3, Help:** FAQ · Shipping (5–7 days) · Returns & Refunds · Track Order · Contact
- **Col 4, Legal:** Privacy · Terms · Refund Policy · Shipping Policy
- **Bottom row:** country/currency selector (US and Worldwide markets), payment icons, `© 2026 Puppy Platoon`. Disclaimer, 12px: `Novelty pet costume. Not affiliated with or endorsed by any military organization.`
- Hide the newsletter block unless email capture is planned. If it is kept, use `Get 10% off your first order` and back it with a real code.

## Remove from the default Horizon homepage
- Remove the slideshow/hero image, the featured collection grid, the generic "Image with text" sections, the collage/collection list, the blog posts, the default newsletter section and the placeholder "Talk about your brand" text.
- Remove search from the header, because there is only one product.
- `templates/index.json` should contain only `pp-*` sections in the order 1 to 9. Header and footer stay as section groups.

## Design tokens
- **Colors:**

  | Token | Hex |
  |---|---|
  | olive-900 | `#1F2615` |
  | olive-800 | `#2F3A23` |
  | olive-600 | `#5B6B3A` |
  | sage-100 | `#E6EDD8` |
  | sand-100 | `#F4EBD9` |
  | paper | `#FFFDF8` |
  | amber CTA | `#E8A33D` (hover `#D48F27`) |
  | flag-red accent | `#B23A2E` (badges only) |

- **Fonts:** Display is "Black Ops One" for headings, with 800 weight limited to H1/H2 at 28px or larger. Body is "Nunito" 400/700/800. Check that amber text on olive and dark text on amber both pass AA.
- **Spacing:** section padding is 48px mobile and 96px desktop. Content max width is 1200px, with 16px gutters on mobile. No horizontal page scroll; test on iOS.
- **Measurement:** track clicks on each CTA with `data-pp-cta="hero|bundle-2|size-result|final"` so A/B tests can come later.