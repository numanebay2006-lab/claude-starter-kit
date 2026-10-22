/* Puppy Platoon cart drawer: AJAX cart, bundle progress, package protection, upsell. */
(() => {
  const cfg = window.PP_CFG || {};
  const PROTECT_ID = Number(cfg.protectionVariantId);
  const MAIN_PRODUCT_ID = Number(cfg.mainProductId);
  const TIERS = cfg.tiers || [{ qty: 2, pct: 15 }, { qty: 3, pct: 25 }];
  const root = () => document.getElementById('pp-cart');
  const money = (cents) => {
    const fmt = cfg.moneyFormat || '${{amount}}';
    const v = (cents / 100).toFixed(2);
    return fmt.replace(/\{\{\s*amount\s*\}\}/, v).replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100));
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  let cart = null;
  let busy = Promise.resolve();
  let lastFocus = null;

  // Serialize every cart mutation so rapid clicks can't race each other.
  const queue = (fn) => (busy = busy.then(fn, fn));

  async function api(url, body) {
    const res = await fetch(url, {
      method: body ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.description || data.message || 'Cart error');
    return data;
  }

  const getCart = () => api('/cart.js');
  const isProtection = (item) => item.variant_id === PROTECT_ID;
  const realItems = (c) => c.items.filter((i) => !isProtection(i));
  const mainQty = (c) => realItems(c).filter((i) => i.product_id === MAIN_PRODUCT_ID).reduce((n, i) => n + i.quantity, 0);

  async function refresh() {
    cart = await getCart();
    // Protection never sits alone in a cart, and never more than once.
    const prot = cart.items.find(isProtection);
    if (prot && (!realItems(cart).length || prot.quantity > 1)) {
      cart = await api('/cart/change.js', { id: prot.key, quantity: realItems(cart).length ? 1 : 0 });
    }
    render();
    updateBubbles();
    document.dispatchEvent(new CustomEvent('pp:cart', { detail: cart }));
    return cart;
  }

  function updateBubbles() {
    const n = realItems(cart).reduce((s, i) => s + i.quantity, 0);
    document.querySelectorAll('[data-pp-count]').forEach((el) => {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }

  function tierFor(q) {
    let t = null;
    TIERS.forEach((x) => { if (q >= x.qty) t = x; });
    return t;
  }

  const unitPrice = () => {
    const v = (cfg.upsellVariants || [])[0];
    return v ? v.price : 4200;
  };
  const rate = (k) => { const t = tierFor(k); return t ? t.pct / 100 : 0; };
  const totalFor = (k) => Math.round(k * unitPrice() * (1 - rate(k)));

  function progressHTML() {
    const q = mainQty(cart);
    if (!q) return '';
    const next = TIERS.find((t) => q < t.qty);
    const max = TIERS[TIERS.length - 1].qty;
    const pct = Math.min(100, Math.round((Math.min(q, max) / max) * 100));
    const lineSave = suitSavings();
    let msg;
    if (!next) msg = `<b>Squad unlocked:</b> ${tierFor(q).pct}% off every suit. You save <b>${money(lineSave)}</b>.`;
    else if (q === 1) msg = `Add <b>1 more suit</b> and save <b>${next.pct}%</b> on both.`;
    else msg = `<b>Battle Buddies unlocked:</b> you save ${money(lineSave)}. Add 1 more for <b>${next.pct}% off</b> all ${next.qty}.`;
    const nodes = [{ qty: 1, label: 'Free shipping' }].concat(TIERS.map((t) => ({ qty: t.qty, label: `${t.pct}% off` })));
    const ticks = nodes.map((t) => `<span class="pp-prog__tick${q >= t.qty ? ' is-on' : ''}" style="left:${(t.qty / max) * 100}%"><i></i><em>${t.label}</em></span>`).join('');
    return `<div class="pp-prog" role="status"><p class="pp-prog__msg">${msg}</p><div class="pp-prog__bar"><span style="width:${pct}%"></span>${ticks}</div></div>`;
  }

  function suitSavings() {
    return realItems(cart).reduce((sum, i) => sum + (i.line_level_discount_allocations || []).reduce((s, d) => s + d.amount, 0), 0);
  }

  function lineHTML(item) {
    const size = (item.variant_options || []).find((o) => /^(xs|s|m|l|xl|2xl|xxl)$/i.test(o)) || item.variant_title || '';
    const img = item.image ? `${item.image}${item.image.includes('?') ? '&' : '?'}width=160` : '';
    const was = item.original_line_price > item.final_line_price ? `<s>${money(item.original_line_price)}</s>` : '';
    const disc = (item.line_level_discount_allocations || []).map((d) => `<span class="pp-line__tag">${esc(d.discount_application.title)}</span>`).join('');
    return `<li class="pp-line" data-key="${esc(item.key)}">
      <a class="pp-line__img" href="${esc(item.url)}">${img ? `<img src="${esc(img)}" alt="${esc(item.product_title)}" width="80" height="80" loading="lazy">` : ''}</a>
      <div class="pp-line__info">
        <a class="pp-line__title" href="${esc(item.url)}">${esc(item.product_title)}</a>
        ${size ? `<span class="pp-line__size">Size ${esc(size)}</span>` : ''}
        ${disc}
        <div class="pp-line__row">
          <div class="pp-qty" role="group" aria-label="Quantity">
            <button type="button" data-qty="${item.quantity - 1}" aria-label="Decrease quantity">−</button>
            <span aria-live="polite">${item.quantity}</span>
            <button type="button" data-qty="${item.quantity + 1}" aria-label="Increase quantity">+</button>
          </div>
          <span class="pp-line__price">${was}<b>${money(item.final_line_price)}</b></span>
        </div>
      </div>
      <button type="button" class="pp-line__rm" data-qty="0" aria-label="Remove ${esc(item.product_title)}">×</button>
    </li>`;
  }

  function upsellHTML() {
    const q = mainQty(cart);
    const next = TIERS.find((t) => q < t.qty);
    if (!q || !next || !cfg.upsellVariants || !cfg.upsellVariants.length) return '';
    const lastSize = (realItems(cart)[0] || {}).variant_id;
    const opts = cfg.upsellVariants.filter((v) => v.available).map((v) => `<option value="${v.id}"${v.id === lastSize ? ' selected' : ''}>Size ${esc(v.title)}</option>`).join('');
    const extra = totalFor(q + 1) - totalFor(q);
    const ord = q === 1 ? '2nd' : '3rd';
    return `<div class="pp-upsell">
      <div class="pp-upsell__txt"><b>${q === 1 ? 'Got a second pup?' : 'Complete the squad'}</b><span>Add a ${ord} suit for just <strong>${money(extra)}</strong>. Mix any sizes.</span></div>
      <div class="pp-upsell__row"><label class="pp-sr" for="pp-upsell-size">Size for the extra suit</label>
      <select id="pp-upsell-size">${opts}</select>
      <button type="button" class="pp-btn pp-btn--sm" data-upsell>+ Add for ${money(extra)}</button></div>
    </div>`;
  }

  function protectionHTML() {
    if (!PROTECT_ID || !realItems(cart).length) return '';
    const on = cart.items.some(isProtection);
    return `<label class="pp-protect">
      <span class="pp-protect__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" fill="currentColor"/><path d="m8.5 12 2.5 2.5 4.5-5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg></span>
      <span class="pp-protect__txt"><b>Package Protection <em>${money(cfg.protectionPrice || 300)}</em></b><span>Lost, stolen or damaged in transit? We reship or refund. Optional, one price per order.</span></span>
      <input type="checkbox" class="pp-switch" data-protect ${on ? 'checked' : ''} aria-label="Add package protection for ${money(cfg.protectionPrice || 300)}">
    </label>`;
  }

  function render() {
    const el = root();
    if (!el || !cart) return;
    const body = el.querySelector('[data-pp-body]');
    const foot = el.querySelector('[data-pp-foot]');
    const items = realItems(cart);
    const count = items.reduce((s, i) => s + i.quantity, 0);
    el.querySelector('[data-pp-title-count]').textContent = count ? `(${count})` : '';
    if (!items.length) {
      const tpl = document.getElementById('pp-mascot-tpl');
      body.innerHTML = `<div class="pp-empty">${tpl ? tpl.innerHTML : ''}<p><b>No recruits yet.</b><br>Every pup needs a uniform.</p><a class="pp-btn" href="${esc(cfg.productUrl || '/')}">Shop the Suit</a></div>`;
      foot.hidden = true;
      return;
    }
    const prot = cart.items.find(isProtection);
    body.innerHTML = `${progressHTML()}<ul class="pp-lines">${items.map(lineHTML).join('')}</ul>${upsellHTML()}`;
    const savings = suitSavings();
    const applied = (cart.cart_level_discount_applications || []).map((d) => `<div class="pp-sum pp-sum--save"><span>Code ${esc(d.title)}</span><b>−${money(d.total_allocated_amount)}</b></div>`).join('');
    const blocked = (cart.discount_codes || []).filter((d) => !d.applicable).map((d) => `<p class="pp-cart__note" style="text-align:left">Code ${esc(d.code)} needs a cart of $35 or more. It applies automatically once you reach it.</p>`).join('');
    const codes = applied + blocked;
    foot.hidden = false;
    foot.querySelector('[data-pp-protect-slot]').innerHTML = protectionHTML();
    foot.querySelector('[data-pp-savings]').innerHTML = savings ? `<span>Bundle savings</span><b>−${money(savings)}</b>` : '';
    foot.querySelector('[data-pp-savings]').hidden = !savings;
    foot.querySelector('[data-pp-codes]').innerHTML = codes;
    foot.querySelector('[data-pp-protect-line]').innerHTML = prot ? `<span>Package protection</span><b>${money(prot.final_line_price)}</b>` : '';
    foot.querySelector('[data-pp-protect-line]').hidden = !prot;
    foot.querySelector('[data-pp-total]').textContent = money(cart.total_price);
    foot.querySelector('[data-pp-checkout]').textContent = `Checkout · ${money(cart.total_price)}`;
  }

  function open() {
    const el = root();
    if (!el) return;
    lastFocus = document.activeElement;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-open'));
    document.documentElement.classList.add('pp-lock');
    el.querySelector('.pp-cart__close').focus();
    document.dispatchEvent(new CustomEvent('pp:cart-open'));
  }

  function close() {
    const el = root();
    if (!el || el.hidden) return;
    el.classList.remove('is-open');
    document.documentElement.classList.remove('pp-lock');
    setTimeout(() => { el.hidden = true; }, 280);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    document.dispatchEvent(new CustomEvent('pp:cart-close'));
  }

  function setBusy(on) {
    const el = root();
    if (el) el.classList.toggle('is-busy', on);
  }

  function tierDrop(before, after) {
    const lost = TIERS.slice().reverse().find((t) => before >= t.qty && after < t.qty);
    if (lost && after > 0) setTimeout(() => toast(`Add ${lost.qty - after} more suit${lost.qty - after > 1 ? 's' : ''} to get your ${lost.pct}% back.`, 'info'), 50);
  }

  function toast(msg, type) {
    const el = root() && root().querySelector('[data-pp-error]');
    if (!el) return;
    el.classList.toggle('is-info', type === 'info');
    el.textContent = msg;
    el.hidden = !msg;
    if (msg) setTimeout(() => { el.hidden = true; }, 5000);
  }

  const run = (fn) => queue(async () => {
    setBusy(true);
    try { await fn(); await refresh(); } catch (e) { toast(e.message); await refresh().catch(() => {}); } finally { setBusy(false); }
  });

  // Public API used by the product page and sticky bar.
  window.PPCart = {
    open, close, refresh,
    add: (items, { openDrawer = true } = {}) => queue(async () => {
      setBusy(true);
      try {
        await api('/cart/add.js', { items });
        await refresh();
        if (openDrawer) open();
        document.dispatchEvent(new CustomEvent('pp:added', { detail: items }));
        return true;
      } catch (e) {
        if (openDrawer) open();
        toast(e.message);
        return false;
      } finally { setBusy(false); }
    }),
  };

  document.addEventListener('click', (e) => {
    const el = root();
    // Any link or button that points at the cart opens the drawer instead.
    const trigger = e.target.closest('a[href="/cart"], a[href$="/cart"], [data-pp-open-cart]');
    if (trigger && el && !el.contains(trigger)) {
      e.preventDefault();
      open();
      return;
    }
    if (!el || !el.contains(e.target)) return;
    if (e.target.closest('[data-pp-close]')) { close(); return; }
    const q = e.target.closest('[data-qty]');
    if (q) {
      const key = q.closest('[data-key]').dataset.key;
      const qty = Math.max(0, Number(q.dataset.qty));
      const prot = cart.items.find(isProtection);
      const others = realItems(cart).filter((i) => i.key !== key);
      const before = mainQty(cart);
      // Removing the last suit takes protection with it in one request.
      if (qty === 0 && prot && !others.length) run(() => api('/cart/update.js', { updates: { [key]: 0, [prot.key]: 0 } }));
      else run(() => api('/cart/change.js', { id: key, quantity: qty }).then((c) => { tierDrop(before, mainQty(c)); return c; }));
      return;
    }
    if (e.target.closest('[data-upsell]')) {
      const id = Number(el.querySelector('#pp-upsell-size').value);
      run(() => api('/cart/add.js', { items: [{ id, quantity: 1 }] }));
    }
  });

  document.addEventListener('change', (e) => {
    if (!e.target.matches('[data-protect]')) return;
    const on = e.target.checked;
    run(async () => {
      const prot = cart.items.find(isProtection);
      if (on && !prot) await api('/cart/add.js', { items: [{ id: PROTECT_ID, quantity: 1 }] });
      if (!on && prot) await api('/cart/change.js', { id: prot.key, quantity: 0 });
    });
  });

  document.addEventListener('keydown', (e) => {
    const el = root();
    if (!el || el.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const f = [...el.querySelectorAll('a[href],button:not([disabled]),input,select')].filter((x) => x.offsetParent);
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // Back/forward cache can restore a stale cart.
  window.addEventListener('pageshow', (e) => { if (e.persisted) refresh(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && cart) refresh().catch(() => {}); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => refresh().catch(() => {}));
  else refresh().catch(() => {});
})();
