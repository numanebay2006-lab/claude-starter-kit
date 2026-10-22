# inventory-locations audit (Admin API only, read-only)

Run at 2026-10-22 against Admin API 2026-01. No mutations were called.

## Bottom line
- The premise "General profile's location group contains ONLY Ankara" is wrong. Both locations are in it. `cjdropshipping` is a fulfillment-service location, and the GraphQL API calls those "legacy" locations. `DeliveryLocationGroup.locations` hides them unless you pass `includeLegacy: true`.
- Today the CJ stock (36,609 units) counts as sellable through the General profile. The profile has rates to the US and to Rest of World. **No inventory or location fix is needed.**
- The data offers no inventory or location reason for "out of stock". The earlier US sold-out was most likely the missing US shipping zone, i.e. US not in shipsToCountries (see Guesses).

## Evidence

### Location group membership (the key question)
```
deliveryProfile(117340504312).profileLocationGroups[0].locationGroup (119203528952):
  locationsCount            = { count: 2, precision: EXACT }
  locations(first:10)       = [Ankara]                      <- default hides legacy FS locations
  locations(includeLegacy:true, includeInactive:true) = [Ankara, cjdropshipping(isFulfillmentService:true)]
deliveryProfile.originLocationCount = 2
deliveryProfile.unassignedLocations / unassignedLocationsPaginated = []
deliveryProfile.locationsWithoutRatesCount = 0
locations(includeLegacy:true, query:"legacy:true") = [cjdropshipping]
locations() (default)                              = [Ankara]
locationsAvailableForDeliveryProfilesConnection    = [Ankara, cjdropshipping]
```
The schema describes `DeliveryLocationGroup.locations(includeLegacy)` as "Whether to include the legacy locations of fulfillment services." So the CJ location is a member of the group. The default query only hides it.

### Rule (docs)
Shopify changelog, Aug 1 2025, "Removal of support for the 'Sell from all locations' fulfillable inventory setting": "customers can only purchase products that are available at fulfillment locations configured to deliver to their shipping zone ... apps managing shipping settings or inventory should ensure that inventory is in stock at locations with valid delivery methods in order to be available for purchase."
-> Stock at a location that is in no location group with rates for the buyer's zone is NOT sellable to that buyer. That is not the case here: CJ is in the group, and the group has active rates for US and ROW.

### Locations
| Location | id | active | fulfillsOnlineOrders | shipsInventory (legacy field) | isFulfillmentService | address | stock |
|---|---|---|---|---|---|---|---|
| Ankara | 96125485304 | true | true | true | false | Ankara, TR 06145 | 0 for the suit; Package Protection level 0 (untracked) |
| cjdropshipping | 96125649144 | true | true | **false** | **true** | countryCode TR only, no street/city/zip | all suit stock |

`shipsInventory` is documented as "Legacy field ... All locations with valid addresses can now ship". It is false for CJ, which is normal for FS locations and does not matter here. CJ FulfillmentService: type THIRD_PARTY, inventoryManagement true (Shopify fetches stock from CJ callback `fetch_stock`), trackingSupport false, requiresShippingMethod true, permitsSkuSharing true.

### Variants
Product 15436873138424 "Puppy Soldier Dog Costume": status ACTIVE, tracksInventory true, totalInventory 36,609. Delivery profile is General for all variants.

| Variant | id | SKU | tracked | requiresShipping | policy | available | committed | on_hand | reserved/incoming/damaged/safety/QC | availableForSale | sellableOnlineQty | weight | origin / HS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 2XL | 67765307408632 | CJYD321915108HS | true | true | DENY | 7170 | 0 | 7170 | 0 | true | 7170 | 440 g | null / null |
| L | 67765307441400 | CJYD321915106FU | true | true | DENY | 9440 | 0 | 9440 | 0 | true | 9440 | 420 g | null / null |
| M | 67765307474168 | CJYD321915105EV | true | true | DENY | 5671 | 0 | 5671 | 0 | true | 5671 | 410 g | null / null |
| S | 67765307506936 | CJYD321915104DW | true | true | DENY | 6683 | 0 | 6683 | 0 | true | 6683 | 400 g | null / null |
| XL | 67765307539704 | CJYD321915107GT | true | true | DENY | 7645 | 0 | 7645 | 0 | true | 7645 | 430 g | null / null |

Every suit variant has one inventory level, at cjdropshipping only. There is no level at Ankara.

Package Protection 15438753628408 / variant 67770384613624, SKU PP-PROTECT: ACTIVE, tracked false, requiresShipping false, policy CONTINUE, availableForSale true. It has a level at Ankara with everything at 0, which doesn't matter because it is untracked. Weight 0 kg is fine because the item is not shipped. Origin/HS null. It is listed in the General profile's profileItems, but `variant.deliveryProfile` is null, as expected for a non-shipping item.

### Delivery profiles
- Only ONE profile exists: General profile 117340504312 (default). No second profile.
- productVariantsCount 6 (5 suit + Package Protection). zoneCountryCount 244. activeMethodDefinitionsCount 4.
- Zones: "United States" [US] and "Worldwide" [Rest of World]. Each has Free Standard Shipping $0 ("5–7 business days") and Express Shipping $2.55 ("Priority processing, tracked. 5–7 business days"). All rates are flat, active, `methodConditions: []`, with no weight or price conditions. So the 400–440 g weights cannot hide a rate, and a 0 weight would not either.
- shop.shipsToCountries includes US and TR. The only CountryCode enum values missing are AC, AN, BV, CU, HM, IR, KP, SY, TA, UM and ZZ (sanctioned, uninhabited or placeholder). That is expected.

### Publications / markets
- Online Store (Publication 224769442040): published for both products.
- Point of Sale (224769474808): suit only.
- US market catalog "United States catalog" (MarketCatalog 127955403000, Publication 224875249912, autoPublish true): `publishedOnPublication` returns true for both products. `resourcePublicationsV2(onlyPublished:false)` does not list market-catalog publications, so use `publishedOnPublication` to check.
- The Worldwide market has no catalog, so it sees the whole Online Store assortment.
- `publishedInContext` is true for US, DE, TR, GB, CA and AU (suit) and for US and DE (Package Protection).
- `contextualPricing` returns $42 USD for US and DE.

## Findings
1. **INFO, no action needed:** the CJ location IS in the General profile's location group. It is hidden only by the API's default `includeLegacy:false`, and the admin UI may also list it separately. Its stock is sellable to US and ROW. Verified: locationsCount=2, includeLegacy listing, originLocationCount=2, unassignedLocations=[], locationsWithoutRatesCount=0.
2. **MEDIUM, risk to monitor:** all stock depends on CJ's inventory sync (inventoryManagement=true, callback fetch_stock). If CJ pushes 0 or deletes the levels, the policy is DENY and every variant goes sold out everywhere at once. No fix needed now. If it happens, check the CJ app's stock sync, or temporarily set inventoryPolicy CONTINUE. There is no evidence that this has happened.
3. **LOW:** countryCodeOfOrigin and harmonizedSystemCode are null on all suit variants. This doesn't affect availability. It only affects customs and duty estimates on international orders. Fix with `inventoryItemUpdate(id:"gid://shopify/InventoryItem/<id>", input:{countryCodeOfOrigin: CN, harmonizedSystemCode:"420100"})`. HS 4201.00 covers dog clothing/harness, but the owner should confirm it.
4. **LOW:** the CJ location has no street address, city or zip (countryCode TR only). Flat rates don't need it. It would matter only with carrier-calculated rates. There is nothing to fix with flat rates.

## Fix mutation (only if the CJ location is ever really missing from the group; it is NOT now)
```graphql
mutation { deliveryProfileUpdate(id:"gid://shopify/DeliveryProfile/117340504312",
  profile:{ locationGroupsToUpdate:[{ id:"gid://shopify/DeliveryLocationGroup/119203528952",
    locationsToAdd:["gid://shopify/Location/96125649144"] }] }) { profile { id } userErrors { field message } } }
```
Before running it, re-check membership with `locations(first:10, includeLegacy:true)`. Do NOT move stock to Ankara: CJ fulfils the orders, and moving stock would break the CJ fulfilment routing.

## Verified vs guesses
- Verified: every number and flag above comes from live Admin queries.
- Guess: the earlier US sold-out was caused by the US shipping zone being absent from the profile, matching "US missing from shipsToCountries" in the brief. The owner then added the "United States" zone (DeliveryZone 515752165624). Under "sell only within configured shipping zones", US buyers had no zone and saw sold out. That fits the facts, but I can't see the profile's change history through the API. A missing US catalog publication would also have caused it, but the suit is published there now.
- Not tested: the storefront and checkout. Draft-order rate calculation is a mutation and was skipped because this review is read-only.
