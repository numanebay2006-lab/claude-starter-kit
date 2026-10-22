// Live Horizon theme buyer walkthrough (no preview param). Read-only except a storefront cart add.
const { chromium } = require('playwright');
const fs = require('fs');
const BASE = 'https://er1tj9-rh.myshopify.com';
const OUT = '/tmp/claude-0/-home-user-claude-starter-kit/6519d79f-6353-52d9-8c4a-525131922c51/scratchpad/qa/reports';
const LOCALES = { US: 'en-US', GB: 'en-GB', TR: 'tr-TR' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isChallenge = async (p) => { for (let i = 0; i < 12; i++) { const ch = /Verifying your connection/i.test(await p.content().catch(() => 'Verifying your connection')); if (!ch) return false; await sleep(5000); } return true; };

async function runCountry(b, c) {
  const r = { country: c };
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, locale: LOCALES[c], hasTouch: true });
  const p = await ctx.newPage();
  // HOME
  const resp = await p.goto(`${BASE}/?country=${c}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(4000);
  if (await isChallenge(p)) { r.home = 'CHALLENGE'; await ctx.close(); return r; }
  r.homeStatus = resp.status(); r.homeUrl = p.url(); r.passwordPage = /\/password/.test(p.url());
  await p.screenshot({ path: `${OUT}/live-${c}-home.png` });
  await p.screenshot({ path: `${OUT}/live-${c}-home-full.png`, fullPage: true });
  r.homeInfo = await p.evaluate(() => {
    const txt = (s) => [...document.querySelectorAll(s)].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const countries = [...new Set([...document.querySelectorAll('.localization-form__list-item[data-value]')].map((e) => e.dataset.value))];
    const current = [...new Set([...document.querySelectorAll('.localization-form__list-item[aria-current="true"]')].map((e) => e.dataset.value))];
    const langs = [...new Set([...document.querySelectorAll('select[name="language_code"] option')].map((o) => o.value))];
    return {
      htmlLang: document.documentElement.lang, title: document.title,
      announcement: [...new Set(txt('.announcement-bar__message, [class*="announcement"] p, [class*="announcement"] .text'))].slice(0, 5),
      cookieLocalization: document.cookie.match(/localization=([^;]+)/)?.[1] || null,
      countryCount: countries.length, countriesSample: countries.slice(0, 12), hasUS: countries.includes('US'), hasGB: countries.includes('GB'), hasTR: countries.includes('TR'),
      currentCountry: current, languages: langs,
      localizationButton: [...new Set(txt('.localization-selector, [class*="localization"] button'))].slice(0, 4),
      shopifyCountry: window.Shopify?.country, shopifyCurrency: window.Shopify?.currency?.active, shopifyLocale: window.Shopify?.locale,
      soldOutBadges: txt('.badge, [class*="sold-out"], [class*="badge"]').slice(0, 8),
      priceTexts: [...new Set(txt('product-price, .price'))].slice(0, 6),
      bodyStart: document.body.innerText.replace(/\s+/g, ' ').slice(0, 400),
    };
  });
  await sleep(3500);
  // PRODUCT
  await p.goto(`${BASE}/products/puppy-soldier-clothes-suit`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(4000);
  if (await isChallenge(p)) { r.pdp = 'CHALLENGE'; await ctx.close(); return r; }
  r.pdpUrl = p.url();
  await p.screenshot({ path: `${OUT}/live-${c}-pdp.png` });
  await p.screenshot({ path: `${OUT}/live-${c}-pdp-full.png`, fullPage: true });
  r.pdp = await p.evaluate(async () => {
    const txt = (s) => [...document.querySelectorAll(s)].map((e) => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const sizeInputs = [...document.querySelectorAll('variant-picker input[type=radio]')].map((i) => ({ opt: i.dataset.optionName, val: i.value, available: i.dataset.optionAvailable, ariaDisabled: i.getAttribute('aria-disabled'), checked: i.checked }));
    const single = txt('[data-testid="variant-option-single"]');
    const atc = [...document.querySelectorAll('button[name="add"]')].map((bt) => ({ text: bt.textContent.replace(/\s+/g, ' ').trim(), disabled: bt.disabled, visible: !!bt.offsetParent }));
    const j = await (await fetch('/products/puppy-soldier-clothes-suit.js')).text();
    let pj; try { pj = JSON.parse(j); } catch (e) { pj = { error: 'non-json ' + j.slice(0, 60) }; }
    const body = document.body.innerText;
    return {
      title: txt('h1').slice(0, 2), price: [...new Set(txt('product-price, .price'))].slice(0, 4),
      sizeInputs, singleValueOptions: single, addToCart: atc,
      soldOutTextOnPage: /sold out|tükendi|unavailable|kullanılamıyor|stokta yok/i.test(body),
      soldOutMatches: (body.match(/.{0,40}(sold out|tükendi|unavailable|kullanılamıyor|stokta yok).{0,40}/gi) || []).slice(0, 5),
      quantityInput: (() => { const q = document.querySelector('input[name="quantity"]'); return q ? { value: q.value, min: q.min, max: q.max, step: q.step } : null; })(),
      inventoryText: (body.match(/.{0,30}(in stock|stokta|left|kaldı|low stock).{0,30}/gi) || []).slice(0, 3),
      productJs: pj.error ? pj : { available: pj.available, price: pj.price, sizes: pj.variants.map((v) => v.option1 + ':' + v.available).join(' ') },
      htmlLang: document.documentElement.lang, currency: window.Shopify?.currency?.active, country: window.Shopify?.country,
    };
  });
  // Select size M and add to cart via the UI button
  try {
    const m = p.locator('variant-picker label:has(input[value="M"])').first();
    if (await m.count()) { await m.click(); await sleep(2500); }
    r.pdp.afterSelectM = await p.evaluate(() => ({ url: location.search, atc: [...document.querySelectorAll('button[name="add"]')].map((bt) => ({ text: bt.textContent.replace(/\s+/g, ' ').trim(), disabled: bt.disabled })) }));
    const btn = p.locator('button[name="add"]:visible').first();
    await btn.click({ timeout: 10000 });
    await sleep(5000);
    await p.screenshot({ path: `${OUT}/live-${c}-cart-drawer.png` });
    r.cartDrawer = await p.evaluate(() => {
      const d = document.querySelector('cart-drawer-component, .cart-drawer, dialog[open], [class*="cart-drawer"]');
      const open = !!document.querySelector('dialog[open]');
      return { found: !!d, dialogOpen: open, text: d ? d.innerText.replace(/\s+/g, ' ').trim().slice(0, 700) : null, cartCount: document.querySelector('.cart-bubble__text-count, [class*="cart-count"], [class*="cart-bubble"]')?.textContent.trim() };
    });
  } catch (e) { r.cartUiError = String(e).slice(0, 200); }
  r.cartJs = await p.evaluate(async () => { const t = await (await fetch('/cart.js')).text(); try { const c = JSON.parse(t); return { item_count: c.item_count, currency: c.currency, total: c.total_price, items: c.items.map((i) => i.title + ' x' + i.quantity + ' @' + i.final_price) }; } catch (e) { return 'non-json ' + t.slice(0, 60); } });
  await ctx.close();
  return r;
}

(async () => {
  const b = await chromium.launch();
  const all = [];
  for (const c of (process.argv[2] || 'US,GB,TR').split(',')) {
    try { all.push(await runCountry(b, c)); } catch (e) { all.push({ country: c, error: String(e).slice(0, 300) }); }
    console.log(JSON.stringify(all[all.length - 1], null, 1));
    await sleep(15000);
  }
  fs.writeFileSync(`${OUT}/live-theme-raw.json`, JSON.stringify(all, null, 1));
  await b.close();
})();
