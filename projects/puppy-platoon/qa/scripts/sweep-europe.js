const { chromium } = require('playwright');
const fs = require('fs');
const OUT = '/tmp/claude-0/-home-user-claude-starter-kit/6519d79f-6353-52d9-8c4a-525131922c51/scratchpad/qa/sweep-europe.json';
const M_VARIANT = 67765307474168;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  let out = {};
  try { out = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch (e) {}
  for (const c of process.argv[2].split(',')) {
   for (let attempt = 0; attempt < 2; attempt++) {
    const ctx = await b.newContext({ locale: 'en-US' });
    const p = await ctx.newPage();
    try {
      await p.goto(`https://er1tj9-rh.myshopify.com/?country=${c}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      const title = await p.title();
      out[c] = await p.evaluate(async (vid) => {
        const res = {};
        const r = await fetch('/products/puppy-soldier-clothes-suit.js'); const t = await r.text();
        let d; try { d = JSON.parse(t); } catch (e) { return { unknown: 'non-json product: ' + t.slice(0, 80) }; }
        res.available = d.available;
        res.sizes = d.variants.map((v) => v.option1 + ':' + v.available).join(' ');
        res.price = d.price;
        let cart0; try { cart0 = await (await fetch('/cart.js')).json(); res.currency = cart0.currency; } catch (e) { res.currency = 'cart.js non-json'; }
        res.cookieLoc = document.cookie.match(/localization=([^;]+)/)?.[1] || null;
        res.htmlCountry = window.Shopify?.country || null;
        res.htmlCurrency = window.Shopify?.currency?.active || null;
        const a = await fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items: [{ id: vid, quantity: 1 }] }) });
        const at = await a.text();
        res.addStatus = a.status;
        try { const aj = JSON.parse(at); res.add = a.ok ? ('OK price=' + aj.items?.[0]?.final_price + ' ' + (aj.items?.[0]?.variant_title || '')) : (aj.description || aj.message || at.slice(0, 120)); } catch (e) { res.add = 'non-json: ' + at.slice(0, 80); }
        try { const c2 = await (await fetch('/cart.js')).json(); res.cartAfter = c2.item_count + ' items, total ' + c2.total_price + ' ' + c2.currency; } catch (e) {}
        const cl = await fetch('/cart/clear.js', { method: 'POST', headers: { Accept: 'application/json' } });
        try { const cj = await cl.json(); res.cleared = cj.item_count === 0; } catch (e) { res.cleared = 'status ' + cl.status; }
        return res;
      }, M_VARIANT);
      out[c].pageTitle = title;
    } catch (e) { out[c] = { unknown: 'error: ' + e.message.slice(0, 100) }; }
    await ctx.close();
    console.log(c, 'attempt' + attempt, JSON.stringify(out[c]));
    fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
    if (out[c].unknown) { await sleep(90000); continue; }
    await sleep(20000); break;
   }
  }
  await b.close();
})();
