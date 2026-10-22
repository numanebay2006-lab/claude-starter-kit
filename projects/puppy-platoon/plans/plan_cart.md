# Cart drawer, sticky ATC and package protection: build plan

## 0. Hooking into Horizon (checked against theme 188335325432)
- **Set the theme setting `cart_type: "page"`.** With that setting, Horizon does not render `theme-drawer#cart-drawer`, and the header cart becomes `<a href="/cart" class="header-actions__action action__cart">`. If JS fails, that link still goes to /cart.
- **`layout/theme.liquid`:** right after `{% render 'cart-drawer', render_wrapper: true %}`, add `{% unless template.name == 'cart' %}{% render 'pp-cart-drawer' %}{% endunless %}`.
- **Opening the drawer:** add one capture-phase listener, `document.addEventListener('click', h, true)`.
  - It matches `a.action__cart, a[href$="/cart"], [data-pp-cart-open]`.
  - It skips the click if `metaKey`, `ctrlKey` or `shiftKey` is held, or if `button !== 0`. Otherwise it calls `preventDefault()` and `PPCart.open(trigger)`.
  - On init, it sets `aria-haspopup="dialog" aria-controls="pp-cart"` on the header link.
- **Standard actions:** call `Shopify.actions.openCart.configure({ handler: () => PPCart.open() })` from a DOMContentLoaded listener. Register it after Horizon's `standard-actions-override.js` so ours runs last. If `readyState` is no longer `loading`, call it right away.
- **Cart bubble:** Horizon's `cart-icon` listens for `shopify:cart:lines-update` and reads `cart.totalQuantity`. After every render, dispatch this:
```js
import { CartLinesUpdateEvent as E } from '@shopify/events';
const { promise, resolve } = E.createPromise();
const ev = new E({ action: 'update', lines: [], promise }); ev.ppOrigin = true;
document.dispatchEvent(ev);
resolve({ cart: E.createCartFromAjaxResponse({ ...cart, item_count: visibleCount }) });
```
  - `visibleCount` is `item_count` minus the protection quantity.
  - Also edit the server render in `snippets/cart-bubble.liquid`. Assign `pp_count` (cart count minus protection quantity) **before** `<div ref="cartBubble">`, because Liquid does not hoist. Replace `cart.item_count` with `pp_count` and `cart == empty` with `pp_count == 0`. Without this edit, Horizon's sessionStorage and bfcache checks show suits + 1.
  - If a `shopify:cart:lines-update` event arrives without `ppOrigin`, call `PPCart.refresh()`.
- **`templates/product.json`:** do not include Horizon's sticky-add-to-cart block. Its script still loads on product pages but does nothing.
- **`/cart` page:** use `sections/pp-cart-page.liquid` with `{% render 'pp-cart-drawer', mode: 'page' %}`. It is the same renderer, shown inline instead of in a dialog, so protection works the same way there.

## 1. Files and config
- **`snippets/pp-cart-drawer.liquid`:** the dialog shell, the `<template>`s, and `<script type="application/json" id="pp-cart-config">` holding:
  - `cart: {{ cart | json }}`
  - `protectionVariantId`, from a new theme setting `pp_protection_product` (product picker). The protection row is hidden if this is blank or unavailable.
  - `protectionPrice` (cents), `suitProductId`, `productUrl`, `variants: [{id, size, available, price}]`
  - `tiers: [{qty:2,pct:15},{qty:3,pct:20}]`. These must match the Admin automatic discounts exactly.
  - `maxQty: 10`, `currency`, `locale`, `shop.email`, the policy URLs, and the UI strings.
- **Assets:** `pp-cart.js` (ES module, exposes `window.PPCart`), `pp-cart.css`, and `pp-sticky-atc.js` (product template only).
- **Routes:** build them as `(Shopify.routes?.root || '/') + 'cart/add.js'` so market subfolders work.
- **Money:** format with `Intl.NumberFormat(locale, {style:'currency', currency: cart.currency})`. Do not calculate discounts in the browser. Show only the amounts /cart.js returns.
- **Product strings:** insert them with `textContent` only, never `innerHTML`.

## 2. Drawer UX
Use a native `<dialog id="pp-cart" aria-labelledby="pp-cd-title">` opened with `showModal()`.

- **Panel:** slides in from the right.
  - Width 420px on desktop, `min(92vw, 420px)` on mobile. Height 100dvh. Background #FFFDF8. Left corners 16px radius.
  - Backdrop rgba(20,24,14,.55).
  - Opens with translateX(100%)→0 over 280ms, `cubic-bezier(.2,.8,.2,1)`. Closes in 200ms. With reduced motion, use a 120ms fade.
  - Rows: header, progress bar, scrolling body, sticky footer. Below `max-height: 520px` the footer stops being sticky.
- **Header (56px):** "Your cart" (18px/700), a count chip showing suits only, and a 44×44 close button labelled "Close cart".
- **Bundle progress:** sticks under the header. Background #F5EFE2, padding 12px 16px, text 14px/600.
  - Bar: 8px tall, track #E3DACA, fill #4A5A2B, fill width = min(suits,3)/3.
  - Milestone labels: "1", "2 · 15% off", "3 · 20% off".
  - Copy by suit count:
    - 1 suit: "Add 1 more suit to save 15%"
    - 2 suits: "15% off unlocked. Add 1 more for 20% off."
    - 3 or more: "Squad deal unlocked: 20% off every suit."
  - When a tier is reached: the milestone scales 1→1.15→1 over 300ms and the live region says "15% off unlocked".
  - Markup: `role="progressbar"`, `aria-valuemin=0`, `aria-valuemax=3`, `aria-valuenow=n`, `aria-valuetext` set to the copy above.
- **Line item:**
  - Image 80×80, radius 12px, background #F5EFE2, `featured_image.url&width=160`.
  - Title 15px/600, clamped to 2 lines, links to `?variant=`.
  - Size select "Size: M ▾". Changing it swaps the variant in one atomic call: `/cart/update.js {updates:{[old]:0,[new]:existing+qty}}`.
  - Take the size from `options_with_values` (name "Size"). Never show `variant_title`, because it includes the placeholder second option "Puppy Soldier Clothes Suit".
  - Price: `final_line_price` in bold. If it is lower than `original_line_price`, show the original struck through (13px #6B6F5E) and a badge with `line_level_discount_allocations[0].discount_application.title` (11px uppercase, #F5EFE2 on #4A5A2B).
  - Stepper: 32px tall with a 44px hit area. "−" is disabled at 1 and "+" at maxQty. "Remove" link, 13px.
  - Remove replaces the line with "Size M suit removed. Undo" for 6 seconds. Undo re-adds the suit but never re-adds protection.
- **Upsell card:** in the body. Border 1.5px dashed #D8C49B, radius 14px, padding 14px.
  - 1 suit: "Got a second pup?" / "Add another suit in any size. 15% off both, applied automatically."
  - 2 suits: "Make it a squad of 3" / "A 3rd suit takes 20% off all three."
  - Hidden at 0 suits or 3 or more.
  - Size chips are native radios in a `<fieldset>` with a visually hidden legend "Size for extra suit". Chips are 44px tall. Sold-out sizes are disabled. Sizes already in the cart are tagged "in cart". Nothing is preselected.
  - Button starts disabled as "Pick a size", then reads "Add size L · $42.00". Use the full variant price, not a discounted one.
  - Link: "Not sure? Size guide" goes to `productUrl#size-guide`.
- **Package protection row:** top of the footer. Border 1px #E3DACA, radius 12px, 24px shield icon.
  - Line: "Package protection" and "+$3.00" (from config), plus a switch `<button role="switch" aria-checked="false">` at 48×28 (off #C9C2B2, on #2F7A3E).
  - Subtext (13px): "Free replacement if your package is stolen after delivery or arrives damaged."
  - A "What's covered?" button (aria-expanded) opens an inline panel, not a hover tooltip:
    "Optional. $3.00 per order, not per item. If your package is marked delivered but stolen, or arrives damaged, email {shop.email} within 14 days and we send a free replacement. Lost in transit is always covered by our Shipping Policy, with or without protection. This is our own guarantee, not insurance. Remove it anytime before checkout." This is followed by a "Shipping Policy" link.
  - **Rules:**
    - Off by default. Never added automatically. Never re-added after an auto-removal or an Undo.
    - Turning it on calls add.js `{id:protId, quantity:1}`. Turning it off calls change.js with qty 0.
    - The switch is disabled and `aria-busy` while a request runs. On error it flips back and shows the error.
    - Announcements: "Package protection added, $3.00" and "Package protection removed".
    - It never renders as a line item. It is left out of the count chip, the bubble, the progress bar and the upsell math. The bundle discounts are limited to the suit product, so protection is never discounted.
    - `syncProtection()` runs after every render. If there are 0 suits and protection is present, it removes protection. If protection qty is above 1, it sets it to 1. Only one fix runs at a time.
    - Removing the last suit while protection is on uses one call, `/cart/update.js {updates:{[suit]:0,[prot]:0}}`, so the drawer doesn't flicker.
  - **Setup tasks (lead dev or owner):**
    - Create a hidden product "Package Protection" at $3.00, with requires shipping off and inventory not tracked.
    - Give it a shield image, because that image shows at checkout.
    - Set `seo.hidden` to 1, tag it `pp-hidden`, keep it out of all collections, and publish it to the Online Store.
    - Add the guarantee terms to the Shipping Policy.
- **Summary rows:**
  - "Bundle savings": −`total_discount` in #2F7A3E, shown only when above 0.
  - Discount code pill (for the game reward), from `cart.discount_codes`: "TREAT10 applied", or "TREAT10 can't combine with your bundle deal" when `applicable` is false.
  - "Shipping": "FREE", with the subline "Standard 5–7 business days. Express $2.55 at checkout." If the currency is not USD, use "Express option at checkout." instead.
  - Optional setting: "Estimated delivery: Thu, Oct 29 – Mon, Nov 2", computed as today plus 5 and plus 7 business days.
  - "Total": `total_price` at 20px/800. Below it: "Taxes calculated at checkout."
- **Checkout button:** `<form action="/cart" method="post"><button name="checkout">`.
  - 56px tall, radius 14px, background #C8431A with white text (4.9:1 contrast), lock icon.
  - Label: "Secure checkout · $83.40".
  - On submit, `await PPCart.idle()` first. Show a spinner while requests are still queued.
- **Trust row (12px, #6B6F5E):** "Secure checkout" · "Free 5–7 day shipping" · "Easy returns" (links to `shop.refund_policy.url`, and must match that policy). Below it, payment icons from `shop.enabled_payment_types | payment_type_svg_tag`, 20px tall, at most 6.
- **Empty state:** the Sergeant Pup salute (96px), "Your cart is empty", "Your pup is still out of uniform.", a "Shop the Soldier Suit" button, and "Free 5–7 day shipping on every order." The progress bar, upsell and protection row are hidden.

## 3. Add-to-cart flow
1. The button gets `aria-busy`, changes to "Adding…" and is disabled.
2. POST `/cart/add.js` with JSON headers.
3. On a 422, show `description` under the ATC with `role="alert"` and do not open the drawer.
4. Otherwise GET `/cart.js` with `no-store`, render, run `syncProtection()`, and open the drawer (except in the theme editor).
5. Focus the close button and announce "Added Puppy Soldier Clothes Suit, size M." The ATC shows "Added" with a check for 1.2 seconds.
6. If the response is HTML rather than JSON (Shopify's bot check), fall back to a normal form POST.

## 4. JS and race conditions
- **API:** `refresh`, `add`, `change(key, qty)`, `swap`, `setProtection`, `applyCode` (update.js `{discount}`), `open`, `close`, `idle`. Events: `pp:cart:updated` `{cart, suits, visibleCount}`, `pp:cart:open`, `pp:cart:close`, `pp:cart:error`.
- **Ordering:** all writes go through one promise queue. Each response carries a revision number, and only the newest revision renders.
- **Stepper:** the quantity updates on screen immediately. After a 400ms pause per line, one change.js call is queued, using the line key from the latest cart (or matching by variant_id if the key is gone). Totals dim to opacity .5 with `aria-busy` until the server answers. Totals are never updated before the server responds.
- **Errors:**
  - A 422 on a line puts the old quantity back and shows the server's `description` inline.
  - A 429 is retried once after 1 second.
  - A network error shows "Couldn't update your cart. Check your connection and try again." and then refreshes the cart.
- **Refresh triggers:** `pageshow` when restored from bfcache, `visibilitychange` back to visible, and lines-update events from other code.
- **Scroll lock:** `html.pp-lock{overflow:hidden}` while open, plus `overscroll-behavior: contain` on the body.

## 5. Accessibility
- `showModal()` makes the background inert and keeps focus inside the dialog.
- Escape (the `cancel` event) runs the animated close. Clicking the backdrop (`target === dialog`) closes it. Focus goes back to the element that opened it.
- A polite `role=status` region announces adds, quantity changes, tiers and protection changes. Errors use `role=alert`.
- Stepper labels: "Decrease quantity, size M" and "Increase quantity, size M".
- Focus ring 3px #1E2416 with a 2px offset. All tap targets at least 44px. Reduced motion respected.

## 6. Sticky ATC
- **When it shows:** an IntersectionObserver watches `[data-pp-atc]`. The bar shows when `!isIntersecting && boundingClientRect.top < 0`, meaning the shopper has scrolled past the main button, not merely not reached it yet. It slides in translateY(110%)→0 over 240ms.
- **When it hides:**
  - The drawer is open (`pp:cart:open`), or a size guide or game overlay is open (`pp:overlay:open`).
  - The keyboard is up (`visualViewport.height < innerHeight * .75`), or the main ATC is back on screen.
  - While hidden it has `inert` and `aria-hidden`. It is an `<aside aria-label="Quick add to cart">` and never takes focus.
- **Mobile (<750px):**
  - Pinned to the bottom. Background #FFFDF8, top border 1px #E3DACA, shadow 0 -6px 20px rgba(30,36,22,.12), padding `10px 12px calc(10px + env(safe-area-inset-bottom))`.
  - Row:
    - 44px thumbnail (radius 8px), hidden below 380px.
    - Native size select, 96×48, showing "Size M ▾". Sold-out options read "XL (sold out)" and are disabled.
    - Button: flex 1, 48px tall, radius 12px, #C8431A, 16px/700, "Add to cart · $42.00".
  - While visible: `body.pp-sticky-on{padding-bottom:calc(72px + env(safe-area-inset-bottom))}`.
- **Desktop (≥750px):**
  - Floating bar, max-width 880px, centered, 20px from the bottom, radius 16px, shadow 0 12px 32px rgba(30,36,22,.18).
  - Contents:
    - 56px thumbnail.
    - "Puppy Soldier Clothes Suit", with "Free 5–7 day shipping · 2+ suits save 15%" under it.
    - Size select, price, and an "Add to cart" button.
- **State:** the product section owns the state through `PP.pdp.getSelection()`, which returns `{items, label, priceCents, ready, soldOut}`.
  - The sticky bar mirrors it via `pp:pdp:change`, and its size select writes back through `PP.pdp.setSize()`.
  - If the bundle has mixed sizes, the select is replaced by the text "Squad of 2 · S + M" and the button reads "Add 2 suits · $71.40".
- **Button states:**
  - No size chosen: "Choose your size". Tapping it focuses the select and calls `showPicker()` inside try/catch.
  - Sold out: disabled "Sold out".
  - While working: "Adding…". After success: "Added".
  - A tap calls `PP.pdp.submit({source:'sticky'})`, which uses the same `PPCart.add` path and opens the drawer.