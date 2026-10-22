# Store review brief (read-only review)

Owner report: "some people can't buy the product, it shows out of stock".

## Store
- Shop: er1tj9-rh.myshopify.com (Basic plan, store currency USD, owner in Turkey, primary locale `tr`, `en` enabled but unpublished).
- Shopify Admin API: load tools with ToolSearch `select:mcp__Shopify__graphql_query,mcp__Shopify__graphql_schema` (use graphql_schema to discover fields; never guess). READ-ONLY: do NOT call graphql_mutation, do NOT change anything.
- Main product: `gid://shopify/Product/15436873138424` handle `puppy-soldier-clothes-suit`, $42, 5 variants (Size S/M/L/XL/2XL + option "Color" with single value). Variant ids: 2XL 67765307408632, L 67765307441400, M 67765307474168, S 67765307506936, XL 67765307539704. inventoryPolicy DENY, stock ~5,000–9,000 per variant at location "cjdropshipping".
- Package Protection product `gid://shopify/Product/15438753628408` variant 67770384613624, $3, requiresShipping false, not tracked.
- Locations: "Ankara" gid://shopify/Location/96125485304 (TR, ships inventory, NO stock), "cjdropshipping" gid://shopify/Location/96125649144 (fulfillment service of CJ Dropshipping app, address TR, holds ALL stock).
- Delivery: General profile gid://shopify/DeliveryProfile/117340504312. Its only location group (119203528952) contains ONLY Ankara. Zones: "United States" (US) and "Worldwide" (rest of world). Each: Free Standard Shipping $0 "5–7 business days", Express Shipping $2.55.
- Markets: "United States" gid://shopify/Market/65004994808 (US, USD, catalog "United States catalog" gid://shopify/MarketCatalog/127955403000 / publication gid://shopify/Publication/224875249912 created today). "Worldwide" gid://shopify/Market/64989823224 (primary, former "Türkiye" market, 232 countries incl. TR, USD). Web presence gid://shopify/MarketWebPresence/58392707320.
- History: US was missing from shop.shipsToCountries and product showed sold out for US until the owner changed something in admin ~minutes ago; now US shows available. Root cause not confirmed.
- Discounts: automatic 15% off 2+ suits, automatic 25% off 3+ suits (product-scoped, don't combine with each other), code TREAT10 (10% order, min $35, once per customer).
- Required by owner: 2 markets (USA, Worldwide); Free shipping + Express $2.55; package protection $3; shipping shown as 5–7 days.
- Themes: LIVE theme is "Horizon" gid://shopify/OnlineStoreTheme/188307865848 (what real customers see now). New theme "Puppy Platoon v1" gid://shopify/OnlineStoreTheme/188335325432 is UNPUBLISHED; preview with `?preview_theme_id=188335325432`. Theme source: /home/user/claude-starter-kit/projects/puppy-platoon/theme/

## Storefront testing
- Playwright + Chromium are installed. Run scripts with `NODE_PATH=/opt/node22/lib/node_modules node script.js`. Example: /tmp/claude-0/-home-user-claude-starter-kit/6519d79f-6353-52d9-8c4a-525131922c51/scratchpad/qa/avail.js (`node avail.js US,DE`). Copy it into your own file; do not edit the shared one.
- Set country with `?country=XX` on the first page load in a fresh browser context, then `fetch('/products/puppy-soldier-clothes-suit.js')` inside the page. Use `/cart/add.js` inside the page to test adding.
- Shopify shows a bot challenge ("Verifying your connection...", HTTP 200 HTML) if requests come too fast. Never use curl loops. Wait >= 3 s between countries, max ~25 countries per agent. If you hit the challenge, wait 60 s and slow down; report any result that came back as challenge HTML as "unknown", never as a negative.

## Output
Write your full report to /tmp/claude-0/-home-user-claude-starter-kit/6519d79f-6353-52d9-8c4a-525131922c51/scratchpad/qa/reports/<your-area>.md and return a short summary: each finding with severity (CRITICAL/HIGH/MEDIUM/LOW), evidence (query result or test output), and the exact fix (the Admin mutation or admin-click steps). Separate verified facts from guesses.
