const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = {};
  for (const c of (process.argv[2] || 'US,DE').split(',')) {
    const ctx = await b.newContext({ locale: 'en-US' });
    const p = await ctx.newPage();
    await p.goto(`https://er1tj9-rh.myshopify.com/?country=${c}&preview_theme_id=188335325432`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    out[c] = await p.evaluate(async () => {
      const r = await fetch('/products/puppy-soldier-clothes-suit.js'); const t = await r.text();
      let d; try { d = JSON.parse(t); } catch (e) { return 'non-json: ' + t.slice(0, 60); }
      const loc = await (await fetch('/browsing_context_suggestions.json').catch(() => null))?.text?.();
      return { available: d.available, sizes: d.variants.map((v) => v.option1 + ':' + v.available).join(' '), country: document.cookie.match(/localization=([^;]+)/)?.[1] };
    });
    await ctx.close();
  }
  console.log(JSON.stringify(out));
  await b.close();
})();
