# shipping-rates audit (Admin API only, read-only)

Run 2026-10-22 through the Shopify MCP Admin GraphQL tool, which is pinned to API 2026-01. No mutations were called.
Owner requirement: Free Standard shipping, Express $2.55, shown as 5–7 days, and Package Protection ($3) must not need shipping.

## Bottom line

**CRITICAL: what checkout really charges is not what the General delivery profile says.**
- The delivery profile (`deliveryProfiles`) shows the owner's intended setup: Free Standard $0 and Express $2.55 in both zones.
- Shopify's rate engine returns something else (`draftOrderAvailableDeliveryOptions`, same engine as checkout):
  - **US** (all states, PR, GU, HI, APO/AE): one option only, **"Ekonomi" $5.00**. No free shipping, no Express.
  - **Worldwide** (DE, GB, CA, AU, TR): **"Standart" $3.00** and **"Hızlı" $5.00**. No free shipping, and Express is $5 instead of $2.55.
  - The names are Turkish and have no description or delivery estimate, so "5–7 days" is not shown.
- These three rates exist as separate method definitions that appear in NO zone of the only delivery profile. Most likely explanation: the shop is on Shopify's new **market-driven shipping**, where rates live on each Market (`Market.delivery.shipping`) and the old DeliveryProfile API no longer drives checkout. Details are under Guesses.
- Practical consequence: **fixing this via `deliveryProfileUpdate` will NOT change checkout.** The earlier Free/Express zones were created that way and are ignored. The fix has to go through Markets: admin, or Admin API **2026-07+** `marketUpdate(... delivery.shipping ...)`. The MCP tool's pinned schema (2026-01) has no `Market.delivery` and no `MarketUpdateInput.delivery`, so this tool can neither read nor fix it.

Coverage is fine. shipsToCountries = 234 countries = exactly US + all 233 Worldwide-market countries. US territories and military addresses are covered.

## Verified facts (with evidence)

### 1. Delivery profiles (legacy API view)
- `deliveryProfiles(merchantOwnedOnly: true|false)` returns only one profile: **General profile** `gid://shopify/DeliveryProfile/117340504312`.
  - default, version 5, activeMethodDefinitionsCount 4, locationsWithoutRatesCount 0, originLocationCount 2, zoneCountryCount 244, productVariantsCount 6, unassignedLocations [].
- Location group `119203528952`, locationsCount 2:
  - Ankara (96125485304, TR-06): manual, active, fulfillsOnlineOrders.
  - **cjdropshipping** (96125649144): FS location, legacy=true, address countryCode TR only. It shows up only with `locations(includeLegacy:true)`. So the brief's "only Ankara" is wrong. Both locations are in the group.
- Zone "United States" (DeliveryZone 515752165624): country US with 62 provinces. These include **AS, GU, MP, PR, VI, FM, MH, PW, AA, AE, AP** and DC. All territories and military addresses are covered.
- Zone "Worldwide" (515688857848): Rest of World.
- Method definitions in the profile, all active, flat, `methodConditions: []`, all in USD:

| Zone | Method def | Name | Description | Price |
|---|---|---|---|---|
| United States | 939266408696 | Free Standard Shipping | 5–7 business days | 0.00 USD |
| United States | 939266441464 | Express Shipping | Priority processing, tracked. 5–7 business days | 2.55 USD |
| Worldwide | 939187142904 | Free Standard Shipping | 5–7 business days | 0.00 USD |
| Worldwide | 939187175672 | Express Shipping | Priority processing, tracked. 5–7 business days | 2.55 USD |

- `translatableResources(resourceType: DELIVERY_METHOD_DEFINITION)` lists **7** method definitions, not 4. The 3 extra ones appear in no profile zone:
  - 938930045176 "Standart" (no description)
  - 938930077944 "Hızlı" (no description)
  - 939267784952 "Ekonomi" (no description). Its id is higher than the US-zone ids, so it was created after the US zone (today).
- No translations exist for any method (locale tr has no translations; `en` is unpublished).

### 2. What the rate engine really returns (`draftOrderAvailableDeliveryOptions`, read-only)
Line item: 1x suit M (67765307474168) unless noted.

| Destination | availableShippingRates |
|---|---|
| US NY 10118 | Ekonomi 5.00 USD |
| US CA 94043 (also with `marketRegionCountryCode: US`) | Ekonomi 5.00 USD |
| US, qty 5 ($210 cart) | Ekonomi 5.00 USD (flat, no free-over threshold) |
| US PR 00901 | Ekonomi 5.00 USD |
| US GU 96910 | Ekonomi 5.00 USD |
| US HI 96814 | Ekonomi 5.00 USD |
| US AE (APO) 09096 | Ekonomi 5.00 USD |
| DE Berlin | Standart 3.00, Hızlı 5.00 USD |
| GB London | Standart 3.00, Hızlı 5.00 USD |
| CA Toronto | Standart 3.00, Hızlı 5.00 USD |
| AU Sydney | Standart 3.00, Hızlı 5.00 USD |
| TR Ankara | Standart 3.00, Hızlı 5.00 USD |
| Package Protection only (US or DE) | [] (no rates: item needs no shipping, correct) |
| 2 suits + Package Protection (US) | Ekonomi 5.00 USD (PP adds nothing, correct) |

- All rates have `source: "shopify"`.
- The decoded rate handle shows `estimated_delivery_time_range: null`. No transit time is set, so checkout shows no "5–7 days".
- No local delivery or pickup options were returned.
- Other checks:
  - `orders` and `draftOrders` are empty, so there is no real checkout to compare against.
  - `deliveryCustomizations` could not be checked because the token lacks `read_delivery_customizations`. Note that a delivery customization can only hide, rename or reorder rates. It cannot create a $5 rate with a new name, so it does not explain this.

### 3. Shop-level coverage
- `shop.shipsToCountries` has 234 codes and includes **US** and **TR**. `shop.countriesInShippingZones` lists the same 234, with `includeRestOfWorld: true`.
- Market regions: "United States" market = [US]; "Worldwide" market = 233 countries (incl. TR).
  - `comm` diff of market countries vs shipsToCountries: **0 missing in either direction**.
- CountryCode enum values not shipped: AC, AN, BV, CU, HM, IR, KP, SY, TA, UM, ZZ. These are sanctioned, uninhabited, obsolete or placeholder codes. Expected, no action.
- PR, GU, VI, AS and MP are not separate countries in Shopify. They are provinces of US, are in the US zone, and returned rates (PR and GU tested).

### 4. Currency / display
- `shop.currencyCode` USD and `enabledPresentmentCurrencies` [USD] only. Both markets: base currency USD, `localCurrencies: false`. US rounding is off, Worldwide rounding is on (no effect with USD).
- All rates are defined in USD. **Every buyer (DE, GB, CA, AU, TR, …) sees and pays $ amounts in USD.** There is no local-currency conversion, and the card issuer converts.
  - LOW: "$" can read as CAD/AUD to Canadian or Australian buyers. Optional fix: enable local currencies on the Worldwide market. It is not required.
- `taxShipping: false`, `taxesIncluded: true` (out of scope; tax-inclusive pricing for US buyers is unusual, flag for the taxes reviewer).

### 5. Carrier services, local delivery, pickup, origin
- `carrierServices`: none. No carrier-calculated rates anywhere.
- `localPickupSettingsV2`: null on both locations. No local delivery rates. No pickup. Correct for a dropshipper.
- `deliverySettings`: legacyModeProfiles false. `deliveryPromiseSettings`: deliveryDatesEnabled false, processingTime null.
- Shipping origin: shop address and Ankara are Ankara, TR. The CJ location has only countryCode TR (no street or city). Flat rates ignore origin, so this does not matter for rates. LOW: CJ really ships from its own warehouses.

### 6. Package Protection
- Variant 67770384613624: `requiresShipping: false`, tracked false, weight 0. It is in the General profile items. A PP-only cart returns no shipping rates, and adding PP to a suit cart does not change the rate. **Meets requirement.**

### 7. Description text
- The profile descriptions are fine as text, but **they never reach the buyer** because the rates actually served (Ekonomi, Standart, Hızlı) have empty descriptions and no transit time.
- MEDIUM (copy): Express's description "Priority processing, tracked. 5–7 business days" has the **same delivery window as free Standard**. Buyers will ask why they should pay $2.55 for the same 5–7 days, and some who pay may complain it was not faster. Recommendation:
  - Standard: "Free · 5–7 business days".
  - Express: a benefit that isn't speed, or a shorter honest window. Examples: "Ships first (priority handling) + tracking · 5–7 business days" or, if CJ really is faster, "3–5 business days".

## Guesses (not verified)
- **Market-driven shipping**:
  - Shopify's docs say merchant opt-in started 2026-10-01 and that merchant shipping then lives on `Market.delivery.shipping`. They also say the merchant DeliveryProfile API is deprecated for merchant config.
  - That fits every observation:
    - The rate engine ignores the profile's Free/Express.
    - It serves 3 definitions that sit in no profile zone.
    - The US rate "Ekonomi" was created minutes ago, matching the owner's "changed something in admin and US started working".
    - US was missing from shipsToCountries before that, because the US market had no shipping option of its own.
  - It cannot be confirmed with the 2026-01-pinned tool: `ShopFeatures.marketDrivenShipping` and `Market.delivery` are not in its schema.
  - Alternative (less likely): some other hidden rate source the 2026-01 API cannot see. The fix path (admin Markets/Shipping screen) is the same either way.
- "5–7 business days" may be optimistic for CJ Dropshipping to the US and worldwide. That is a business check, not a config one.

## Fix

### Option 1: admin clicks (works regardless of API version) — recommended
Shopify admin → **Settings → Markets → United States → Shipping**. On market-driven shipping, "Settings → Shipping and delivery" sends you there.
1. Edit "Ekonomi":
   - name **Free Standard Shipping**, price **$0.00**, transit time **5–7 business days**
   - description "Free · 5–7 business days"
2. Add a flat rate:
   - name **Express Shipping**, price **$2.55**, currency USD
   - description per item 7 above; transit as appropriate
Then do the same in **Settings → Markets → Worldwide → Shipping**:
3. "Standart" → **Free Standard Shipping**, $0.00, 5–7 business days.
4. "Hızlı" → **Express Shipping**, **$2.55**.
Leave the legacy General-profile zones alone. They are harmless, and deleting them is unnecessary.

### Option 2: Admin API 2026-07 or later
This needs `read_markets` and `write_markets`. It can't be run through this MCP tool (pinned 2026-01). Shapes are from shopify.dev docs and were not validated against a live schema.

Read the current options first to get their ids:
```graphql
query {
  markets(first: 10) { nodes { id name
    delivery { shipping { isEnabled
      optionDefinitions(first: 20) { nodes { __typename id name description isActive currency } } } } } }
}
```
Replace the options on each market (repeat with `gid://shopify/Market/64989823224` for Worldwide, deleting the Standart and Hızlı option ids):
```graphql
mutation {
  marketUpdate(id: "gid://shopify/Market/65004994808", input: { delivery: { shipping: {
    isEnabled: true
    optionDefinitionsToDelete: ["<Ekonomi option id from the query above>"]
    optionDefinitionsToCreate: [
      { flatRate: { name: "Free Standard Shipping", description: "Free · 5–7 business days", currency: USD, isActive: true,
          rateGroups: [{ rate: { price: { amount: "0.00", currencyCode: USD }, transitTimeMinSeconds: 432000, transitTimeMaxSeconds: 604800 } }] } },
      { flatRate: { name: "Express Shipping", description: "Priority handling + tracking", currency: USD, isActive: true,
          rateGroups: [{ rate: { price: { amount: "2.55", currencyCode: USD } } }] } }
    ] } } }) {
    market { id delivery { shipping { optionDefinitions(first: 10) { nodes { __typename isActive currency } } } } }
    userErrors { field message }
  }
}
```
(432000 s = 5 days, 604800 s = 7 days. Check how checkout renders "business days".)

### Verify after the fix (read-only, works with this tool)
```graphql
fragment R on DraftOrderAvailableDeliveryOptions { availableShippingRates { title price { amount currencyCode } } }
query {
  us: draftOrderAvailableDeliveryOptions(input: {lineItems: [{variantId: "gid://shopify/ProductVariant/67765307474168", quantity: 1}], shippingAddress: {address1: "350 5th Ave", city: "New York", provinceCode: "NY", zip: "10118", countryCode: US}}) { ...R }
  de: draftOrderAvailableDeliveryOptions(input: {lineItems: [{variantId: "gid://shopify/ProductVariant/67765307474168", quantity: 1}], shippingAddress: {address1: "Unter den Linden 1", city: "Berlin", zip: "10117", countryCode: DE}}) { ...R }
}
```
Expected for both: Free Standard Shipping 0.00 USD and Express Shipping 2.55 USD. Also confirm once in a real storefront checkout (shipping step) for a US and a DE address.

## Findings summary
| # | Severity | Finding |
|---|---|---|
| 1 | CRITICAL | Checkout rates are US "Ekonomi" $5 only; Worldwide "Standart" $3 and "Hızlı" $5. No free shipping, no $2.55 Express. The profile's Free/Express rates are not used. |
| 2 | HIGH | Served rates have Turkish names, no description and no transit time, so "5–7 days" never shows to buyers. |
| 3 | HIGH (process) | Edits via deliveryProfileUpdate don't reach checkout. The fix must go through Markets shipping (admin, or API 2026-07+). The MCP tool can't do it. |
| 4 | MEDIUM | Express and Standard both say 5–7 business days, which is a confusing value proposition. |
| 5 | LOW | All buyers see USD ($). No local currency. Acceptable. |
| 6 | LOW | CJ location has no address. Brief's "Ankara only" location-group claim is wrong (CJ is in the group, hidden as legacy). |
| OK | — | Coverage: 234 countries = US + all 233 Worldwide countries; PR/GU/VI/AS/MP/AA/AE/AP covered. Package Protection needs no shipping. No carrier services, pickup or local delivery (fine). |
