# Live theme (Horizon) review: INCOMPLETE

## What happened with the storefront tests
- I waited 300 s, then ran /tmp/claude-0/-home-user-claude-starter-kit/6519d79f-6353-52d9-8c4a-525131922c51/scratchpad/qa/live-theme.js for US, GB, TR (390x844, fresh context per country, 8 s apart).
- All 3 homepage loads came back as the Shopify bot challenge ("Verifying your connection..."). So the result is UNKNOWN for: price, currency, language, sold-out state, Add to cart, cart drawer, announcement, password page and country selector, for all three countries. No screenshots were captured.
- The script is now patched: no spoofed iOS user agent, it waits up to 60 s for the challenge to clear, and countries are 15 s apart. It has NOT been re-run (the run was cut short). To re-run after a cool-down: `NODE_PATH=/opt/node22/lib/node_modules node live-theme.js US,GB,TR`. It writes live-<CC>-home/pdp/cart-drawer.png and live-theme-raw.json into reports/.

## Verified with read-only Admin API queries (theme files + config)
1. Live theme = "Horizon" (role MAIN, themeStoreId 2481), updated 2026-10-21. It is close to the untouched Horizon default.
2. The PDP template (templates/product.json) has NO setting that can make the product look out of stock:
   - variant-picker block: buttons, show_swatches false.
   - The product has no templateSuffix, so it uses the default product template.
   - In Horizon's variant-main-picker.liquid, an option with only one value is drawn as plain text ("Color  Puppy Soldier Clothes Suit"), not as a disabled button. So the single-value "Color" option does NOT cause a sold-out look. It is only an odd label.
   - Sizes are struck through and get the aria-label "Sold out" only when `product_option_value.available == false`. That depends purely on Shopify availability for the buyer's market/country, not on a theme setting.
   - No inventory/stock-count block, and no quantity rules in the template (the quantity block is default). buy-buttons: pickup availability off, accelerated checkout on. Sticky add-to-cart is on.
   - Add to cart is disabled only when `can_add_to_cart` is false, which again comes from variant availability.
   - Conclusion: if a buyer sees "sold out" on the live theme, the cause is availability or market data (catalog, publication, shipping/location for that country), not Horizon settings.
3. Admin data: all 5 variants have availableForSale true, inventoryPolicy DENY, stock 5,671 to 9,440, price 42.00. shop.shipsToCountries (234 codes) includes US, GB and TR.
4. Markets: "United States" (US only, USD) and "Worldwide" (232 regions incl. TR and GB, USD, primary). localCurrencies is false in both, so every buyer sees USD. enabledPresentmentCurrencies = [USD].
5. Language: the web presence default locale is `tr`, there are no alternate locales, and `en` is unpublished. As a result:
   - Every visitor (US, GB, TR) gets the Turkish storefront UI (buttons, cart, checkout labels). Product text is in English ("Puppy Soldier Dog Costume").
   - The shop name is "Mağazam" (Turkish for "My store").
6. Placeholder content customers see:
   - Announcement bar: "Welcome to our store".
   - Homepage hero: "Browse our latest products" / "Shop all", with no image set.
   - Product grid shows collection "all", so it will likely include the $3 Package Protection product as if it were a normal product (not verified on the storefront because of the challenge).
   - Password template text is "Opening soon". Whether the password page is ENABLED could not be confirmed (the storefront was blocked, and the Admin API has no field for it).
7. Header: show_country true, show_language true. The language selector would list only `tr` because en is unpublished. The country list would contain all countries in the 2 markets (233). There is no currency column, because there is only one currency.

## Issues and fixes (based on config; the buyer view is still unverified)
- HIGH, language: US/GB buyers get a Turkish UI. Fix: Settings > Languages > English > Publish. Then Settings > Markets > United States (and Worldwide) > Languages > set English as the default. Admin API: `shopLocaleUpdate(locale:"en", shopLocale:{published:true, marketWebPresenceIds:[...]})`, then a web presence update to make en the default (for example a separate web presence for the US market).
- MEDIUM, placeholder content hurts trust: "Welcome to our store", the "Browse our latest products" hero with no image, the store name "Mağazam". Fix: Online Store > Themes > Customize > Header announcement: set real text (for example "Free shipping, 5–7 business days"). Hero: add an image and a real heading. Settings > General > Store name.
- MEDIUM (guess, unverified): the Package Protection product shows in the homepage "all" grid and in search. Fix: set the homepage product list to a collection without it, or remove it from the Online Store sales channel if the protection app adds it on its own.
- LOW: the "Color" option has a single value, "Puppy Soldier Clothes Suit", and shows as a confusing label. Fix: delete the Color option in the product admin (Options > Color > Delete) so the variants become Size only.
- UNKNOWN (re-run needed): password page state, real sold-out display per country, whether Add to cart works, cart drawer contents.
