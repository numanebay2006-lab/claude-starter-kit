# Markets audit (Admin API 2026-01, read-only) — 2026-10-22 ~17:25 UTC

## Verified facts
| Item | United States (Market/65004994808, handle `us`) | Worldwide (Market/64989823224, handle `worldwide`) |
|---|---|---|
| status / type | ACTIVE / REGION | ACTIVE / REGION |
| regions | 1 (US) | 233 countries, TR included, US excluded, no duplicates |
| currency | base USD enabled, localCurrencies=false, rounding=false | base USD, localCurrencies=false, roundingEnabled=true (no effect without local currencies) |
| priceInclusions | null (inherits shop: taxesIncluded=true) | null (same) |
| web presence | MarketWebPresence/58392707320 (shared) | same one |
| catalogs | 1: "United States catalog" MarketCatalog/127955403000, ACTIVE, priceList=null, publication 224875249912 autoPublish=true, operation AddAllProductsOperation COMPLETE | 0 |

- Countries in NEITHER market (vs CountryCode enum): AC, AN, BV, CU, HM, IR, KP, SY, TA, UM, ZZ. CU/IR/KP/SY are sanctioned (Shopify blocks them), AN no longer exists, BV/HM have no people, ZZ means "unknown". Only AC (Ascension), TA (Tristan da Cunha) and UM (US Minor Outlying Islands) are real places, and they are tiny. PR/GU/VI/AS/MP aren't in the enum at all; Shopify treats them as part of US.
- shop.shipsToCountries now includes US. countriesInShippingZones includes US, includeRestOfWorld=true.
- marketsResolvedValues: US -> US catalog, USD, taxesIncluded=true, dutiesIncluded=false, web presence 58392707320 (tr default, no alternates). TR/DE/GB -> no catalog, USD.
- US catalog publication products: both products (Product/15436873138424, Product/15438753628408), both isPublished=true, publishDate 2026-10-22T17:01:28Z. Collections in catalog publication: none (Shopify docs: collections only support APP catalog publications, so this is expected and needs no fix).
- Main product resourcePublications: Online Store (224769442040) + POS (224769474808) + US catalog. unpublishedPublications = []. publishedInContext US/TR/DE/CA = true. contextualPricing US = DE = 42.0 USD.
- Package Protection: Online Store + US catalog, not on POS (does not matter). publishedInContext US/TR/DE/CA = true, $3.
- Worldwide does NOT need its own catalog: per Shopify docs "When a publication isn't associated with the catalog, product availability is determined by the sales channel" -> Online Store publication, which has both products.
- shopLocales: tr primary+published (web presence 58392707320); en NOT published, attached to no web presence. Web presence serves only `tr` (rootUrls: tr -> https://er1tj9-rh.myshopify.com/).
- Product content (title, body, SEO) is in ENGLISH but saved under locale `tr`. There are no `en` translations.
- Shop: currency USD only (enabledPresentmentCurrencies [USD], currencySettings empty, supportedDigitalWallets empty -> Shopify Payments / multi-currency not active), taxesIncluded=true, taxShipping=false.
- Primary market: API 2026-01 has no `primary` field (no Market.primary, no shop.primaryMarket), so I could not check it. It has no practical effect here.
- Events log: no market/catalog events are recorded. The last product events are from 12:19 UTC. The 17:01:28Z publish time of the catalog is the only timestamp for the owner's change.

## Findings
1. HIGH — Storefront and checkout are Turkish for US (and all) buyers. Root web presence default=tr, en unpublished. The product copy is English, so a US buyer sees English product text with Turkish theme labels and buttons and a Turkish checkout.
   Fix (recommended, admin only; I found no API to change the primary locale): Settings > Languages > Change default language > English. Content is already English, so it carries over unchanged. Then optionally add Turkish as a published secondary language for TR.
   API partial alternative (adds /en alternate; root stays tr):
   ```graphql
   mutation { shopLocaleUpdate(locale: "en", shopLocale: { published: true, marketWebPresenceIds: ["gid://shopify/MarketWebPresence/58392707320"] }) { shopLocale { locale published } userErrors { field message } } }
   ```
   Then for a US-only English web presence (unverified: a subfolder on a myshopify-only store may be rejected):
   ```graphql
   mutation { webPresenceCreate(input: { defaultLocale: "en", subfolderSuffix: "us" }) { webPresence { id rootUrls { locale url } } userErrors { field code message } } }
   mutation { marketUpdate(id: "gid://shopify/Market/65004994808", input: { webPresencesToAdd: ["<new id>"], webPresencesToDelete: ["gid://shopify/MarketWebPresence/58392707320"] }) { market { id webPresences(first:2){nodes{id}} } userErrors { field code message } } }
   ```
2. LOW — Tax display for US: shop taxesIncluded=true, so the US resolves to taxesIncluded=true. No effect unless the shop has US tax registrations (not checked, outside my area). If US tax is ever collected:
   ```graphql
   mutation { marketUpdate(id: "gid://shopify/Market/65004994808", input: { priceInclusions: { taxPricingStrategy: ADD_TAXES_AT_CHECKOUT } }) { market { priceInclusions { inclusiveTaxPricingStrategy } } userErrors { field code message } } }
   ```
3. LOW / info — Worldwide roundingEnabled=true has no effect (no local currencies). Local currencies need Shopify Payments, which isn't available for a TR merchant, so USD-only is expected.
4. LOW / info — AC, TA, UM are in neither market. Optional: add them to Worldwide via marketUpdate conditions if Shopify accepts them. Otherwise ignore.
5. INFO (risk) — The US catalog publication now controls US visibility. autoPublish=true covers new products. If anyone removes a product from this catalog, it disappears for US only. Never add US back into Worldwide: overlapping region markets get made DRAFT (see makeDuplicateUniqueMarketsDraft).

## Earlier "sold out in US" — cause (INFERENCE, not confirmed)
- Before: US was missing from shop.shipsToCountries. A country leaves shipsToCountries when it is in no ACTIVE market. Worldwide excludes US, so US could only be served by the US market. That market was most likely DRAFT, or US was in no market at all, so US visitors were in a non-selling country and Shopify showed the product as unavailable.
- Why not "missing catalog": Shopify docs say a market with no catalog publication falls back to the Online Store channel, as Worldwide does now. So the missing catalog alone would not have hidden the product.
- At 17:01:28Z the US catalog was created with AddAllProductsOperation, and both products were published to it. This matches the owner activating or creating the US market in admin (the new Markets admin creates a "<Market> catalog" on activation).
- Fully fixed on the market side? Yes (verified): US is ACTIVE, in shipsToCountries, publishedInContext(US)=true for both products, catalog holds both, price $42 USD.
- Not checked by me: the inventory/delivery side (General profile location group has only Ankara with 0 stock; all stock is at cjdropshipping). The shipping/inventory review must confirm this, and storefront tests must confirm real add-to-cart for US.
