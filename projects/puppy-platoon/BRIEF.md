# Store build brief: Puppy Soldier Clothes Suit

## Store facts (live, verified via Admin API)
- Shop: "Mağazam" — er1tj9-rh.myshopify.com — Shopify Basic plan — store currency USD — owner based in Turkey.
- Live theme: Horizon (Shopify's 2025 flagship theme, blocks-based, `sections/*.liquid`, `blocks/*.liquid`, `snippets/*.liquid`, `templates/*.json`, `assets/*.js|css`, `config/settings_schema.json`, `config/settings_data.json`).
- Build target: unpublished duplicate "Puppy Platoon v1" (gid://shopify/OnlineStoreTheme/188335325432). Theme files are edited via Admin GraphQL `themeFilesUpsert` (no Shopify CLI login available). Theme publishing through the API tool may be blocked; owner may need to click Publish.
- No third-party apps can be installed. Everything (sticky ATC, cart drawer upsells, bundles UI, package protection toggle, mini-game, mascot animation) must be built natively in theme Liquid/JS/CSS. Discounts can be created with Admin API (automatic discounts / codes).
- Higgsfield image generation: only 10 credits on free plan (≈1–2 images at most). No ChatGPT/browser available in this cloud session. Plan primarily around the 5 existing product photos + code-drawn graphics (SVG/CSS).

## The single product
- "Puppy Soldier Clothes Suit" — handle `puppy-soldier-clothes-suit` — $42.00 — dropshipped (CJ, SKU CJYD3219151xx), inventory high.
- Variants (option "Size"): S, M, L, XL, 2XL (second option has one value "Puppy Soldier Clothes Suit").
- What it is: a novelty dog costume that makes a small dog look like a little soldier standing upright: camo helmet with ear-muff headset + mic, tan plate-carrier vest with US flag patches, camo sleeves with stuffed plush "arms" holding a plush toy rifle in front of the dog, camo pants. Front-mounted fake arms create the illusion the dog is standing and holding the rifle. Photos: dachshund in hallway wearing it; Chihuahua held by a man with caption "Milo is an 6-lb Chihuahua, he is wearing size S". Very viral/funny TikTok-style product. Use cases: Halloween, 4th of July, Veterans Day, birthday photos, social media content, dog parties.
- Existing images (5): 
  1. dachshund full costume, hallway, front view
  2–3. other angles
  4. man holding Chihuahua "Milo, 6 lb, size S"
  5. lifestyle
- Target: US pet owners (small breeds: Chihuahua, Dachshund, Yorkie, Frenchie, Pomeranian, Shih Tzu, Pug), gift buyers, content creators.

## Hard requirements from the owner
1. Two markets: **United States** and **Worldwide** (rest of world). (Current only market is Türkiye — replace/realign.)
2. Shipping: **Free Standard shipping (5–7 business days)** and **Express shipping $2.55**. Shipping must be shown as 5–7 days.
3. **Package protection $3** (theme-native toggle in cart; implemented as a hidden $3 product added/removed from cart). Must comply with EU/consumer law → opt-in, clearly labeled, easy to remove.
4. Character animations if a fitting character exists (e.g., an animated SVG/CSS mascot: "Sergeant Pup" saluting dog).
5. Better sticky add-to-cart, better cart (drawer) with upsells, progress bar, protection.
6. Better offers + bundles (e.g., buy 2 save X%, "Squad" bundles), honest urgency only.
7. A little game on the product page (e.g., "Treat Drill": tap the falling treats in 15s; win a discount code). Must be lightweight, accessible, not block buying.
8. Better colors and fonts (military-cute theme), easy to understand instantly what is sold, strong copywriting, size guide (by weight/breed), FAQ, reviews section placeholder that does NOT invent fake reviews.
9. Special things unique to this store.
10. Everything high-converting, mobile-first (most traffic will be TikTok/Meta mobile).

## Compliance guardrails
- No fake reviews, no fake "X people viewing", no fake countdown timers that reset. Honest scarcity only.
- No invented statistics. Do not claim "Made in USA" or military affiliation/endorsement.
- Toy rifle: describe as "plush toy rifle (soft fabric, not a real or replica weapon)".
- Copy: say what the product is plainly. Short sentences. Avoid em dash overuse. Avoid AI tells ("it's not X, it's Y").
