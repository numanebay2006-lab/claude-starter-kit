# Store-config audit (Admin API, read-only), 2026-10-22

Scope: product data, Package Protection, discounts, policies, pages and menus, shop settings, payments/checkout (where the API allows it), customer accounts, limits for international selling.
Nothing was changed. Every mutation below is a PROPOSED fix. None was run.

Legend: [V] = verified by query or storefront test. [G] = guess or inference, not verified.

---

## Summary table

| # | Sev | Finding |
|---|-----|---------|
| 1 | CRITICAL (check) | Payment provider can't be checked through the API. Shopify Payments isn't offered in Turkey and PayPal doesn't operate there, so whatever provider is set up may not take foreign cards. |
| 2 | HIGH | Only 1 of 5 policies exists (Privacy), and it is in Turkish. No Refund, Shipping, Terms or Contact policy. The 30-day returns promise has no policy behind it. |
| 3 | HIGH | Default language is Turkish and English is unpublished. Storefront `lang="tr"`, checkout, customer emails and system text are Turkish for US and worldwide buyers. |
| 4 | HIGH | Store name is "Mağazam" ("My store"). It shows in the browser tab, the checkout header (no checkout branding) and emails. |
| 5 | HIGH | Size order is 2XL, L, M, S, XL. Variant 1 = 2XL, so 2XL is the size selected by default on the product page. |
| 6 | MEDIUM | Single-value "Color" option "Puppy Soldier Clothes Suit". It shows in variant titles in cart, checkout and emails, and as a pointless selector. |
| 7 | MEDIUM | Turkish leftovers in menus, pages and collection: Ana menü, Ana sayfa, Katalog, İletişim, Arama, Gizlilik tercihleriniz, Altbilgi menüsü, Siparişler, Profil; collection "Ana sayfa". |
| 8 | MEDIUM | The new theme links to /pages/size-guide (404 verified) and has templates page.faq, page.size-guide and page.track, but those pages don't exist. |
| 9 | MEDIUM | Package Protection shows up in /collections/all, which the "Katalog" menu item links to. |
| 10 | MEDIUM | "Express Shipping" $2.55 has the same "5–7 business days" as free shipping. Worldwide 5–7 days from CJ is probably unrealistic. |
| 11 | MEDIUM | Discount stacking: automatic 25%/15% combine with TREAT10. 3 suits = $28.35 each against a unit cost of $18.28, before shipping and fees. |
| 12 | MEDIUM | Product category is not set on either product. |
| 13 | MEDIUM | Realistic black AR-style plush rifle in photos and "Plush Rifle" in the SEO title: risk with ad and Merchant Center weapon policies. Not a Shopify restriction. |
| 14 | MEDIUM | International tax and customs: no country of origin or HS code, no taxes collected, buyers pay duties on delivery (EU VAT, UK seller VAT rule). |
| 15 | LOW | No custom domain (myshopify.com), Gmail sender address, no homepage meta description. |
| 16 | LOW | SEO description says "S-XXL" but the size option is "2XL". |
| 17 | LOW | Package Protection has no image. TREAT10 applies to it. Its claim terms aren't in any policy. |
| 18 | LOW | Privacy policy has an empty phone number ("lütfen  numarasını arayın") and the owner's home city address. |
| 19 | LOW | CJ app has write_markets, write_shipping and write_publications scopes. It may be the actor that removed US earlier. |
| 20 | INFO | Product photos look like another brand's marketing (caption "Louie is a 22-lb French Bulldog"; filenames `_water`). Possible copyright or IP risk. |

Things that are FINE [V]: the main product is ACTIVE, published to Online Store and POS and to the US catalog publication, availableForSale true on all 5 variants, inventoryPolicy DENY with 5,671–9,440 available at "cjdropshipping", tracked. Media alt texts are present and descriptive (7 images). Title, description, vendor (Puppy Platoon), product type (Dog Costume) and tags are fine. Package Protection is $3, requiresShipping false, not tracked, CONTINUE, taxable false, seo.hidden = 1, in no collection, published to Online Store and the US catalog. Discount titles, values and minimums match the brief, and the 15%/25% discounts don't combine with each other. Customer accounts are the new version, optional, no login required at checkout. No checkout validations. No orders, customers or abandoned checkouts yet (count 0).

---

## 1. CRITICAL (needs checking): payment provider
- [V] `shopifyPaymentsAccount` and `paymentCustomizations` are blocked for this API token (missing scope), so gateways can't be read. Billing country is TR (Ankara).
- [V] ordersCount = 0 and abandonedCheckoutsCount = 0, so no buyer has finished a checkout yet.
- [G] Shopify Payments isn't offered to merchants in Turkey, and PayPal has not operated in Turkey since 2016. If the store relies on a Turkish provider (iyzico, PayTR and others), it may reject foreign cards or not settle USD. If no provider is active, nobody can pay. A storefront "available" check won't catch this.
- Fix (admin): Settings > Payments. Confirm an active provider that accepts international Visa/MC/Amex in USD (for example iyzico with international cards and USD enabled, 2Checkout/Verifone, or a Stripe-supported entity). Then place a real $1 test order from a US card or address and from an EU one. If none is active: activate one, then test.

## 2. HIGH: policies missing or in the wrong language
- [V] `shop.shopPolicies` returns only PRIVACY_POLICY. It is Turkish, auto-generated, dated 22 Ekim 2026, and names the store "Mağazam". There is no REFUND_POLICY, SHIPPING_POLICY, TERMS_OF_SERVICE or CONTACT_INFORMATION.
- [V] The theme promises "30-day returns" and "5–7 business days" in 8 places, and `pp-product.liquid` shows "Full refund policy" only `{% if shop.refund_policy %}`, so that link is hidden today.
- Impact: checkout footer policy links are missing. Payment providers, Google Merchant Center and Meta Shops require refund, shipping and contact policies. It also raises chargeback and consumer-law exposure.
- Fix (one call per policy type; English body):
```graphql
mutation { shopPolicyUpdate(shopPolicy:{type:REFUND_POLICY, body:"<h2>30-day returns</h2><p>You have 30 days from delivery to return an unworn costume in its original condition and packaging. Email support@<domain> with your order number to start a return or swap sizes. [Who pays return shipping] [Return address]. Refunds go to the original payment method within 5–10 business days after we receive the item. Damaged or wrong item: email us within 7 days of delivery with a photo and we reship or refund at no cost. EU/UK customers keep their statutory 14-day right of withdrawal.</p>"}) { shopPolicy{id type url} userErrors{field message} } }
```
  Repeat with `type:SHIPPING_POLICY` (free standard shipping and $2.55 Express; processing time plus transit time stated separately and honestly; countries served; tracking; import duties and taxes paid by the buyer unless stated; Package Protection claims: report within X days, reship or refund), `type:TERMS_OF_SERVICE` (Settings > Policies > "Create from template" after switching the default language to English), and `type:CONTACT_INFORMATION` (business name, email, phone, trade or business address; EU and UK law requires this).
  Then replace the privacy policy: Settings > Policies > Privacy policy. Regenerate it in English after step 3, or call `shopPolicyUpdate(shopPolicy:{type:PRIVACY_POLICY, body:"<English body>"})`.

## 3. HIGH: default language Turkish, English unpublished
- [V] `shopLocales`: tr primary and published; en published:false with no web presence. The web presence `58392707320` has defaultLocale tr and alternateLocales []. The live storefront returned `<html lang="tr">` and `<title>Mağazam</title>`.
- Impact: checkout UI, order confirmation and shipping emails, cart and system strings (Horizon: "Sepete ekle", "Tükendi" and so on) are in Turkish for every buyer, including the US. Google and Bing see lang=tr. [G] Some shoppers may read Turkish UI or a "Tükendi" label as "can't buy".
- Fix (admin, recommended): Settings > Languages > English > Publish, then "Change default" to English. Optionally unpublish Turkish. Product content is already written in English, so it becomes the English default content.
  API part (publish en and attach it to the web presence):
```graphql
mutation { shopLocaleUpdate(locale:"en", shopLocale:{published:true, marketWebPresenceIds:["gid://shopify/MarketWebPresence/58392707320"]}) { shopLocale{locale published} userErrors{field message} } }
mutation { webPresenceUpdate(id:"gid://shopify/MarketWebPresence/58392707320", input:{defaultLocale:"en", alternateLocales:[]}) { userErrors{field message} } }
```
  [G] `webPresenceUpdate` may refuse to change the default locale of the primary domain presence. If so, use the admin "Change default" button. There is no API field to change the shop's primary locale (`ShopLocaleInput` has only published and marketWebPresenceIds).

## 4. HIGH: store name "Mağazam"
- [V] `shop.name = "Mağazam"`, checkout profile "Mağazam configuration", `checkoutBranding.customizations = null` (no logo). The checkout header therefore shows the text "Mağazam".
- Fix (admin only; no shop-name mutation exists): Settings > General > Store name = "Puppy Platoon". Then Settings > Checkout > Customize: add the logo and brand colours (or `checkoutBrandingUpsert` on `gid://shopify/CheckoutProfile/8273363192`).

## 5. HIGH: 2XL is the default selected size
- [V] Variant positions 1–5 = 2XL, L, M, S, XL. Option values are in the same order. `selected_or_first_available_variant` is 2XL, and the theme `upsellVariants` loop uses this order as well.
- Impact: small-dog buyers who don't change the selector order 2XL. That means returns, plus a size selector that reads out of order.
- Fix:
```graphql
mutation { productOptionsReorder(productId:"gid://shopify/Product/15436873138424", options:[
  {id:"gid://shopify/ProductOption/17906217713912", values:[{name:"S"},{name:"M"},{name:"L"},{name:"XL"},{name:"2XL"}]},
  {id:"gid://shopify/ProductOption/17906217746680"} ]) { product{ variants(first:10){nodes{title position}} } userErrors{field message code} } }
```
  (If you also do finding 6, delete Color first and then reorder only Size.) [G] Consider making M the default in the theme instead of relying on variant 1.

## 6. MEDIUM: single-value "Color" option
- [V] Option 2 is "Color" with one value, "Puppy Soldier Clothes Suit". Variant titles read "2XL / Puppy Soldier Clothes Suit". That text shows in the cart, checkout, order emails and the Horizon variant picker.
- Fix (variant IDs are kept; no duplicate variants result):
```graphql
mutation { productOptionsDelete(productId:"gid://shopify/Product/15436873138424", options:["gid://shopify/ProductOption/17906217746680"], strategy:DEFAULT) { deletedOptionsIds product{options{name values}} userErrors{field message code} } }
```
  [G] The CJ app maps by variant ID and SKU, so this should be safe, but a CJ "re-sync product" can add the option back. Check in CJ after the change.

## 7. MEDIUM: Turkish leftovers (menus, pages, collection)
- [V] Menus: main-menu "Ana menü" (Ana sayfa / Katalog / İletişim); footer "Altbilgi menüsü" (Arama / Gizlilik tercihleriniz); customer-account-main-menu (Siparişler / Profil). Pages: "İletişim" (/pages/contact, empty body) and "Gizlilik tercihleriniz" (/pages/data-sharing-opt-out, Turkish body). Collection "Ana sayfa" (/collections/frontpage).
- Fix:
```graphql
mutation { menuUpdate(id:"gid://shopify/Menu/275742261496", title:"Main menu", items:[
  {title:"Home", type:FRONTPAGE, url:"/"},
  {title:"Shop", type:PRODUCT, resourceId:"gid://shopify/Product/15436873138424"},
  {title:"Size guide", type:PAGE, resourceId:"<new size-guide page id>"},
  {title:"FAQ", type:PAGE, resourceId:"<new faq page id>"},
  {title:"Contact", type:PAGE, resourceId:"gid://shopify/Page/164551819512"} ]) { menu{id} userErrors{field message} } }
mutation { menuUpdate(id:"gid://shopify/Menu/275742294264", title:"Footer menu", items:[
  {title:"Search", type:SEARCH, url:"/search"},
  {title:"Track order", type:PAGE, resourceId:"<new track page id>"},
  {title:"Refund policy", type:SHOP_POLICY, url:"/policies/refund-policy"},
  {title:"Shipping policy", type:SHOP_POLICY, url:"/policies/shipping-policy"},
  {title:"Privacy policy", type:SHOP_POLICY, url:"/policies/privacy-policy"},
  {title:"Terms of service", type:SHOP_POLICY, url:"/policies/terms-of-service"},
  {title:"Your privacy choices", type:PAGE, resourceId:"gid://shopify/Page/164582064376"} ]) { menu{id} userErrors{field message} } }
mutation { menuUpdate(id:"gid://shopify/Menu/275742327032", title:"Customer account main menu", items:[
  {title:"Orders", type:CUSTOMER_ACCOUNT_PAGE, resourceId:"gid://shopify/CustomerAccountPage/117347188984"},
  {title:"Profile", type:CUSTOMER_ACCOUNT_PAGE, resourceId:"gid://shopify/CustomerAccountPage/117347221752"} ]) { menu{id} userErrors{field message} } }
mutation { pageUpdate(id:"gid://shopify/Page/164551819512", page:{title:"Contact"}) { page{id title} userErrors{field message} } }
mutation { collectionUpdate(input:{id:"gid://shopify/Collection/511633654008", title:"Home page"}) { collection{id title} userErrors{field message} } }
```
  (Policy menu items need type SHOP_POLICY with the policy's resourceId once the policies exist. Check the `MenuItemType` values and resourceId requirements before running.) For the opt-out page, the simplest fix is to delete it and let Shopify recreate it after the default language is English (Settings > Customer privacy). Otherwise call `pageUpdate` with an English title and body.

## 8. MEDIUM: pages the new theme needs don't exist
- [V] Theme templates: page.faq.json, page.size-guide.json, page.track.json, page.contact.json. Only the contact page exists. `pp-sizer.liquid` links to /pages/size-guide, and the storefront returned **404** for it.
- Fix (once per page):
```graphql
mutation { pageCreate(page:{title:"Size guide", handle:"size-guide", templateSuffix:"size-guide", isPublished:true, body:""}) { page{id handle} userErrors{field message} } }
mutation { pageCreate(page:{title:"FAQ", handle:"faq", templateSuffix:"faq", isPublished:true, body:""}) { page{id handle} userErrors{field message} } }
mutation { pageCreate(page:{title:"Track your order", handle:"track", templateSuffix:"track", isPublished:true, body:""}) { page{id handle} userErrors{field message} } }
```
  Before publishing the theme, also give the contact page an English body or intro.

## 9. MEDIUM: Package Protection visible in /collections/all
- [V] Storefront `/collections/all/products.json` (live theme, country=US) returned `["package-protection","puppy-soldier-clothes-suit"]`. `seo.hidden` only hides from search and sitemaps. The main menu "Katalog" points to /collections/all.
- Fix: point the menu to the product, not /collections/all (see finding 7). Optionally redirect /collections/all to the product:
```graphql
mutation { urlRedirectCreate(urlRedirect:{path:"/collections/all", target:"/products/puppy-soldier-clothes-suit"}) { urlRedirect{id} userErrors{field message} } }
```
  [G] Shopify may not allow a redirect on the built-in /collections/all route while it resolves. If so, filter the product out in the theme's collection template (for example `unless product.handle == 'package-protection'`).

## 10. MEDIUM: Express is not faster; 5–7 days worldwide is questionable
- [V] General profile, both zones: "Free Standard Shipping" $0 "5–7 business days" and "Express Shipping" $2.55 "Priority processing, tracked. 5–7 business days".
- Impact: paying $2.55 for "Express" with the same delivery estimate is misleading. [G] CJ shipping from China usually takes 7–15+ business days to the US and longer elsewhere, and the US FTC Mail Order Rule requires a reasonable basis for shipping-time claims.
- Fix: rename Express to "Priority Shipping (tracked, ships first)" or give it a real faster estimate (for example 3–5 days). Make the copy match the CJ method actually used, and state processing time and transit time separately in the Shipping policy. Edit via Settings > Shipping and delivery > General profile, or `deliveryProfileUpdate` → `methodDefinitionsToUpdate` (name, description).

## 11. MEDIUM: discount stacking and margin
- [V] "Battle Buddies: 15% off 2 suits" and "The Squad: 25% off 3+ suits": automatic, PRODUCT class, product-scoped, minimum quantity 2 / 3, combinesWith {order:true, product:false, shipping:true}, start 2026-10-22, no end date. TREAT10: ORDER class, 10%, all items, minimum $35, once per customer, combinesWith {order:false, product:true, shipping:true}.
- [V] Unit cost for variant M is $18.28. 3 suits + TREAT10 = $42 × 0.75 × 0.9 = **$28.35 per suit**, with free shipping. [G] After CJ shipping (often $5–10 per item) and payment fees, the margin is close to zero.
- Fix (if stacking isn't intended): turn off order-discount combination on TREAT10 (or on the two automatic discounts):
```graphql
mutation { discountCodeBasicUpdate(id:"gid://shopify/DiscountCodeNode/1581329514744", basicCodeDiscount:{combinesWith:{productDiscounts:false, orderDiscounts:false, shippingDiscounts:true}}) { codeDiscountNode{id} userErrors{field message} } }
```
  Also consider limiting TREAT10 to the suit only (customerGets.items.products), so the $3 protection isn't discounted.

## 12. MEDIUM: product category not set
- [V] `category: null` on both products. Taxonomy match: `gid://shopify/TaxonomyCategory/ap-2-6-5` = Animals & Pet Supplies > Pet Supplies > Pet Apparel > **Pet Costumes**. Protection: `gid://shopify/TaxonomyCategory/pa-6` = Product Add-Ons > **Shipping Insurance**.
- Fix:
```graphql
mutation { productUpdate(product:{id:"gid://shopify/Product/15436873138424", category:"gid://shopify/TaxonomyCategory/ap-2-6-5"}) { product{category{fullName}} userErrors{field message} } }
mutation { productUpdate(product:{id:"gid://shopify/Product/15438753628408", category:"gid://shopify/TaxonomyCategory/pa-6"}) { product{category{fullName}} userErrors{field message} } }
```
  Setting Pet Costumes also guards against Google or Meta auto-classifying the product from "rifle" text and images.

## 13. MEDIUM: "rifle" and weapon look (ads and feeds, not Shopify)
- [V] Nothing in the Admin API marks the product as restricted. The product is ACTIVE and sellable. The description already says "Plush toy rifle … Not a real or replica weapon". The images show a realistic black AR-style silhouette. SEO title: "Puppy Soldier Dog Costume with Plush Rifle | Puppy Platoon".
- [G] Shopify won't block this, but Google Merchant Center (weapons and realistic toy guns), Meta ads (weapons policy) and TikTok can disapprove it automatically on "rifle" plus realistic gun images. Some payment providers also screen for weapon keywords.
- Fix: in the SEO title and feed text, use "plush toy" instead of "rifle":
```graphql
mutation { productUpdate(product:{id:"gid://shopify/Product/15436873138424", seo:{title:"Puppy Soldier Dog Costume with Plush Arms | Puppy Platoon", description:"Dress your dog as a tiny soldier: camo helmet with headset, vest, plush arms and a soft plush toy. Sizes S–2XL. Free shipping."}}) { product{seo{title description}} userErrors{field message} } }
```
  For ads, use photos where the plush prop is not the focus, or lead with an image that clearly reads as a plush toy.

## 14. MEDIUM: international tax and customs readiness
- [V] inventoryItem countryCodeOfOrigin null, harmonizedSystemCode null, countryHarmonizedSystemCodes empty. All variants taxable:false. shop.taxesIncluded:true. Only USD (localCurrencies false). Basic plan.
- [G] Shipments go out DDU (buyer pays on delivery). The EU charges import VAT on every parcel (no €22 exemption since 2021), and without IOSS the buyer pays VAT plus a carrier fee, which leads to refused parcels. For the UK, parcels ≤ £135 legally require the seller to register for UK VAT and charge it at checkout. Australia, Norway and Switzerland have similar rules for low-value imports.
- Fix: set the origin and HS code on all 5 inventory items, for example:
```graphql
mutation { productVariantsBulkUpdate(productId:"gid://shopify/Product/15436873138424", variants:[
  {id:"gid://shopify/ProductVariant/67765307408632", inventoryItem:{countryCodeOfOrigin:CN, harmonizedSystemCode:"420100"}},
  {id:"gid://shopify/ProductVariant/67765307441400", inventoryItem:{countryCodeOfOrigin:CN, harmonizedSystemCode:"420100"}},
  {id:"gid://shopify/ProductVariant/67765307474168", inventoryItem:{countryCodeOfOrigin:CN, harmonizedSystemCode:"420100"}},
  {id:"gid://shopify/ProductVariant/67765307506936", inventoryItem:{countryCodeOfOrigin:CN, harmonizedSystemCode:"420100"}},
  {id:"gid://shopify/ProductVariant/67765307539704", inventoryItem:{countryCodeOfOrigin:CN, harmonizedSystemCode:"420100"}} ]) { productVariants{id} userErrors{field message} } }
```
  (Confirm the HS code with CJ. 4201.00 covers articles for animals, including dog coats. Confirm the origin is CN.) Add a duties disclaimer to the Shipping policy. Get tax advice on UK VAT and IOSS before advertising in the UK or EU, or exclude those countries until you do.

## 15. LOW: trust basics
- [V] primaryDomain = er1tj9-rh.myshopify.com (no custom domain). email and contactEmail = numanshopify2006@gmail.com. shop.description = null.
- Fix: connect a domain (Settings > Domains) and set a sender email on that domain (Settings > Notifications > Sender email, with domain authentication). Add a homepage title and meta description under Online Store > Preferences.

## 16. LOW: size naming mismatch
- [V] The SEO description says "Sizes S-XXL" but the option value is "2XL". The finding 13 mutation fixes this ("S–2XL").

## 17. LOW: Package Protection details
- [V] It has no media (blank thumbnail in cart and checkout unless the theme hides it). TREAT10 (all items) discounts it. Its description promises "we reship it or refund you", but no policy defines the claim window or process.
- Fix: upload a small shield icon (productCreateMedia or admin). Put the claim terms in the Shipping policy (finding 2). Optionally exclude it from TREAT10 (finding 11).

## 18. LOW: privacy policy text defects
- [V] The contact sentence reads "lütfen  numarasını arayın" (empty phone number), followed by the email and "Ankara, 06145 Ankara TR-06, Türkiye". It is resolved by regenerating in English (finding 2) after adding a phone number and business address under Settings > General > Store details.

## 19. LOW: CJ app scopes
- [V] App "CJdropshipping: Much Faster" has write_markets, write_shipping, write_publications, write_products and write_inventory.
- [G] It is a possible actor behind US disappearing from shipsToCountries or the catalog earlier. Watch the markets and delivery profile after any CJ sync, and don't let CJ "manage shipping".

## 20. INFO: image provenance
- [V] Filenames end in `_water`. Image 2 has a burned-in caption, "Louie is a 22-lb French Bulldog, he is wearing size M". [G] These look like supplier or competitor marketing photos. Make sure you have the rights to use them, and avoid using them in paid ads.

---

## Not queryable with this token
- Payment gateways (`shopifyPaymentsAccount`, `paymentCustomizations` access denied).
- Script tags (`scriptTags` access denied). Cart transforms (`cartTransforms` access denied).
- Shop name, primary locale and checkout settings (contact method, address fields, tipping): no Admin API mutation or field for most of them. Use admin Settings > Checkout.

## Relevant to the "out of stock" report (for other areas)
Nothing in store config explains "out of stock" at the moment: variants are availableForSale with stock of 5k–9k, the product is published to Online Store and the US catalog, and shipsToCountries now includes US. Cross-check items owned by other reviewers: the "cjdropshipping" location (which holds all stock) is NOT in the General profile's location group. That group has only Ankara, which has zero stock.
