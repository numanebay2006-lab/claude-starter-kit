# Puppy Platoon store: status (updated 2026-10-22 16:55 UTC)

Store: `er1tj9-rh.myshopify.com` ("Mağazam", Basic plan, USD). Product: `puppy-soldier-clothes-suit` ($42, sizes S/M/L/XL/2XL).
Build theme: **Puppy Platoon v1** `gid://shopify/OnlineStoreTheme/188335325432` (UNPUBLISHED). Live theme: Horizon `188307865848` (do not write to it).
Local source of truth for theme code: `projects/puppy-platoon/theme/` (mirrors theme paths). `manifest.txt` = md5 + size of every local file.

## Done and verified via Admin API
- Markets: **United States** (US, USD) and **Worldwide** (old Türkiye market renamed, 232 countries incl. TR, USD). Both attached to web presence `58392707320`.
- Shipping (General profile): zones "United States" and "Worldwide" (rest of world). Each: Free Standard Shipping $0 "5–7 business days" + Express Shipping $2.55. Old TRY zones deleted.
- Package Protection product `gid://shopify/Product/15438753628408`, variant `67770384613624`, $3, no shipping, not tracked, `seo.hidden=1`, published to Online Store.
- Main product: title "Puppy Soldier Dog Costume", vendor Puppy Platoon, SEO title/description, new English description, media reordered + alt texts.
- Discounts: automatic "Battle Buddies: 15% off 2 suits" (`1581329449208`), automatic "The Squad: 25% off 3+ suits" (`1581329481976`), code TREAT10 10% order, $35 min, once per customer (`1581329514744`).
- Locale `en` enabled (NOT yet published / NOT primary; `tr` is still primary).

## Theme upload state (checked by checksum)
Uploaded and matching local md5: `assets/pp-base.css`, `assets/pp-cart.js`, `assets/pp-favicon.svg`, all 5 `snippets/pp-*.liquid`.
NOT uploaded yet: `assets/pp-ui.js`, `pp-product.css`, `pp-product.js`, `pp-home.css`, `pp-game.js`, all `sections/pp-*.liquid`, `sections/header-group.json`, `footer-group.json`, all `templates/*.json`, `layout/theme.liquid`, `config/settings_data.json`.
Upload order: assets → snippets → sections → section groups → templates → layout → config.

## Next
1. Upload the remaining files, verify md5 against `manifest.txt`.
2. Publish `en` and make it the default locale for web presence 58392707320.
3. Pages (size-guide, faq, track, contact, about), menus (main-menu, footer-shop, footer-help, footer-policies), policies (refund 30 days, shipping 5–7 business days, terms, contact).
4. Preview + browser QA, then publish theme (API publish is blocked by the tool: owner may need to click Publish).
5. 10-agent review of store/markets/shipping/theme, then fix all findings.

Plans: `plans/*.md` (10 specialists), consolidated spec in `MASTER_PLAN.md`.
