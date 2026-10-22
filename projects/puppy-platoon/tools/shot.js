const { chromium } = require('playwright');
(async () => {
  const [,, url, out, w, h, ...rest] = process.argv;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: +w || 390, height: +h || 844 }, deviceScaleFactor: 1 });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(e => console.log('goto', e.message));
  if (rest.includes('salute')) { await p.evaluate(() => document.querySelectorAll('.pp-mascot').forEach(m => m.classList.add('is-salute'))); await p.waitForTimeout(800); }
  await p.screenshot({ path: out, fullPage: rest.includes('full') });
  await b.close();
})();
