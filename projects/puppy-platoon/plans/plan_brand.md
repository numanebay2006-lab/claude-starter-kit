# Brand & Visual Identity Plan: Puppy Platoon

## 1. Name, wordmark, tagline

**Store name: Puppy Platoon** (domain idea: puppyplatoon.com, or a fallback like puppyplatoonshop.com). It matches the theme name the lead dev already uses ("Puppy Platoon v1"). It alliterates, sticks after one TikTok view, and says "dog + soldier" before anyone reads the product title. Backups if the name is taken: **Pawtrol Squad**, **Sgt. Snout**.

**Wordmark (inline SVG, `snippets/pp-logo.liquid`):**
- Icon: a **dog tag** (rounded rect 28x40, rx 10, olive `#4B5D2A` fill, a 5px cream hole at the top) with a cream **paw print** in the middle. The same icon is the favicon (export a 96x96 PNG of it to settings > favicon).
- Text: `PUPPY PLATOON` in **Black Ops One** (stencil), on one line, letter-spacing 0.04em, colour `#1F2A1C`. "PLATOON" uses olive `#4B5D2A`.
- Sizes: 22px tall on mobile, 28px on desktop. Use `aria-label="Puppy Platoon home"`.
- On dark backgrounds, swap to cream `#FBF6EC` for text and the tag.

**Tagline: "Tiny soldier. Huge laughs."**
Supporting line under the hero H1: *"The camo costume with plush arms that makes your small dog look like it's standing guard."*
Why: say what it is first, then the feeling. A TikTok visitor has about 3 seconds before bouncing.

**Mascot: Sgt. Biscuit**, a SVG/CSS dachshund in a camo helmet. It salutes when an item is added to cart, gets "promoted" when the free gift unlocks, and hosts the Treat Drill game. All mascot copy is signed "– Sgt. Biscuit".

## 2. Colour tokens (in `:root` of `assets/pp-base.css`)

| Token | Hex | Role | Contrast check |
|---|---|---|---|
| `--pp-bg` | `#FBF6EC` | Page background (warm sand) | – |
| `--pp-surface` | `#FFFFFF` | Cards, drawer, inputs | – |
| `--pp-khaki` | `#EFE5CF` | Alternate section bg, photo cards | – |
| `--pp-ink` | `#1F2A1C` | Headings, body text | ~14:1 on bg |
| `--pp-ink-muted` | `#55604E` | Secondary text, captions | ~6.3:1 on bg |
| `--pp-olive` | `#4B5D2A` | Brand: announcement bar, header accents, badges, sticky ATC frame | white/cream text ~7:1 |
| `--pp-cta` | `#C2410C` | **Primary CTA only** (signal orange) | white 5.2:1 |
| `--pp-cta-hover` | `#9A3412` | CTA hover/pressed, button "boot" shadow | white 7.3:1 |
| `--pp-gold` | `#F2C14E` | Highlights: "Most popular", progress bar fill, game | ink text ~10:1 |
| `--pp-success` | `#15803D` | "Unlocked", in-stock, protection ON | white 5.0:1 |
| `--pp-alert` | `#B91C1C` | Savings labels ("Save $8"), errors | white 6.5:1 |
| `--pp-navy` | `#1E3A5F` | 4th July/Veterans Day accents, links in footer | white 11:1 |
| `--pp-line` | `#DCCFB4` | Borders, dividers | – |

Rules:
- **Orange is used only for buy actions** (ATC, sticky ATC, checkout, bundle "Add squad"). It stays the one hot colour on the page, so the next step is always obvious.
- Olive and camo set the theme. They never become buttons.
- Never put white text on gold.

**Horizon settings:** set the colour schemes to these hex values. Scheme 1 is bg/ink. Scheme 2 is olive with cream text (header bar and footer). Button colour = `#C2410C`.

**Why it converts:** a warm sand base reads friendly and giftable rather than aggressive military. Orange against olive and khaki is the strongest complementary contrast available, so CTAs stand out. Real camo colours tie directly to the product photos.

## 3. Typography (Google Fonts)

- **Display: Lilita One 400.** Chunky, rounded and cute. Use it for H1 to H3, prices, bundle titles and game UI.
- **Body/UI: DM Sans 400/500/700.** Very readable at 15 to 16px on phones. Use it for body text, buttons, inputs and the drawer.
- **Stamp accent: Black Ops One.** Only for the wordmark, dog-tag badges and 1 to 3 word labels ("MISSION", "SQUAD DEAL"). Never use it for sentences.

Load with one `<link>` in `layout/theme.liquid`, using preconnect and `display=swap`:
`https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Lilita+One&family=Black+Ops+One&display=swap`
Also set Horizon's body font_picker to DM Sans (it is in Shopify's library, so checkout matches).
Fallbacks: `"Lilita One", "Arial Rounded MT Bold", system-ui` and `"DM Sans", system-ui, sans-serif`.

**Scale** (mobile → desktop ≥990px, using `clamp()`):

| Style | Mobile | Desktop | Line-height |
|---|---|---|---|
| H1 hero | 34px | 56px | 1.05 |
| H2 section | 26px | 40px | 1.1 |
| H3 card | 20px | 24px | 1.2 |
| Price (PDP) | 30px | 36px (Lilita) | 1 |
| Body | 16px | 17px | 1.55 |
| Small/caption | 13px | 14px | 1.4 |
| Stamp label | 12px | 13px, uppercase, 0.08em tracking | 1 |
| Button | 17px / 700 | 18px / 700 | 1 |

Keep the measure to 60 to 68ch. Never go below 13px. Text inputs are 16px so iOS does not zoom.

## 4. Buttons, radius, spacing

- **Primary:** bg `--pp-cta`, white text in DM Sans 700. Height **56px** on mobile and 52px on desktop. Full width on PDP mobile. Radius **14px**. Shadow `0 4px 0 var(--pp-cta-hover)` (the "boot" step). On `:active`: `translateY(3px)` and shadow `0 1px 0`. Hover uses bg `--pp-cta-hover`. Focus: `outline: 3px solid var(--pp-gold); outline-offset: 2px`. Loading state: disable the button and show a spinner plus "Adding…". Success: show "Added ✓" for 1.2s on `--pp-success`.
- **Secondary:** transparent bg, 2px `--pp-ink` border, ink text, 48px tall, same radius.
- **Tertiary:** text link in ink with an underline and 3px underline offset.
- **Radius tokens:** `--r-sm 8px` (inputs, chips), `--r-md 14px` (buttons, cards), `--r-lg 24px` (photo cards, drawer top on mobile), `--r-pill 999px` (size chips, badges).
- **Spacing:** 4px base. Section padding is 48px on mobile and 96px on desktop. Side gutter is 16px on mobile and 32px on desktop. Tap targets are at least 44px.
- **Size chips:** 52x48 pills with a 2px `--pp-line` border. The selected chip has a 2px ink border, khaki bg and a small olive check. Sold-out chips get a strikethrough and `aria-disabled`.

## 5. Iconography and graphic motifs

- Icons are inline SVG, 24px, 2px stroke, round caps, `currentColor`. Set: truck, bolt (express), shield (protection), ruler (size guide), paw, gift, return-arrow, chat.
- **Dog-tag badges** for offers: an olive tag shape with stamp-font cream text, e.g. "SQUAD DEAL".
- **Embroidered patch** for trust points: a circle with a 2px dashed inner border in cream on olive, which looks like stitching. Examples: "Soft plush arms", "Velcro on/off", "Sizes S to 2XL".
- **Camo texture:** an SVG of 4 blob shapes in olive and khaki tones, used only as a 6–8% opacity background on the hero and announcement strips. Never place it behind body text.
- Optional: a paw-print trail divider between sections (a dotted SVG, 24px tall).

## 6. Photo treatment

- Show product photos **as shot**. Do not recolour or retouch them, because buyers have to trust what arrives.
- Use 1:1 cards on `--pp-khaki` with radius 24px. For white-background cutouts (p2), add `mix-blend-mode: multiply` so the white melts into the khaki and they match the other cards.
- Captions use a "masking tape" label (gold bg, ink text, rotated -2deg) with true facts only: *"Milo · 6 lb Chihuahua · size S"*.
- Gallery: swipe with dots on mobile and thumbnails on desktop. Use `loading="eager"` for the first image and `fetchpriority="high"`.
- Avoid heavy filters, fake "studio" composites and AI dogs presented as customers. If Higgsfield credits allow one image, use it for a clearly labelled lifestyle hero, not as a review.

## 7. Tone of voice

**Character:** a drill sergeant who melts for puppies. Short, punchy and warm.
- Use: *recruit, squad, mission, report for duty, at ease, promoted, salute, on patrol*.
- Use real specifics: "Velcro closures", "plush toy rifle (soft fabric, not a real or replica weapon)", "Free shipping, 5–7 business days", "Express for $2.55".
- **Banned:** *gun, weapon, combat, war, army-issued, official, military-approved*, invented numbers, "viral sensation", and fake urgency.
- Be respectful on Veterans Day: celebrate, never mock.
- Footer disclaimer: *"Novelty pet costume for photos and fun. Not affiliated with or endorsed by any military branch."*
- Keep buttons clear and put the fun around them. The ATC says **"Add to cart · $42.00"**. A playful line can sit under it: *"Your pup's about to get promoted."*

**Microcopy samples:**
- Announcement bar: `Free shipping (5–7 days) · Express just $2.55`
- Cart empty: `No recruits yet. Let's fix that.`
- Free-gift progress: `$X away from a promotion 🎖️` / `Promoted! Free shipping locked in.`
- Protection toggle: `Package protection · $3 · Covers loss, theft or damage in transit. Optional.`

## 8. Why this converts for a TikTok impulse buy

1. **Instant recognition:** the name, camo palette and photo-first hero match the video the visitor just watched, so it feels like the same "that dog!" moment.
2. **One hot colour equals one action:** orange appears only on buy buttons, so there is no doubt about where to tap.
3. **Cute over tactical:** rounded type and warm sand lower the "is this aggressive?" hesitation and make it feel giftable.
4. **Recognisable legit cues:** clean type, true facts, dog-tag trust badges and a disclaimer replace fake hype.
5. **Delight hooks:** Sgt. Biscuit's salute on add-to-cart and the patch/tag motifs give screenshot-worthy moments that feed back into TikTok.