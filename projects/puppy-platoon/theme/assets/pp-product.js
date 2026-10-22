/* Product page: gallery, size + bundle picker, add to cart, sticky bar, size finder. */
(() => {
  const root = document.querySelector('[data-pp-pdp]');
  if (!root) return;
  const cfg = window.PP_CFG || {};
  const TIERS = cfg.tiers || [{ qty: 2, pct: 15 }, { qty: 3, pct: 25 }];
  const variants = JSON.parse(root.querySelector('[data-pp-variants]').textContent);
  const sizes = JSON.parse(root.querySelector('[data-pp-sizes]').textContent);
  const $ = (s) => root.querySelector(s);
  const $$ = (s) => [...root.querySelectorAll(s)];
  const money = (c) => (cfg.moneyFormat || '${{amount}}').replace(/\{\{\s*amount\s*\}\}/, (c / 100).toFixed(2)).replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(c / 100));

  const form = $('[data-pp-form]');
  form.noValidate = true;
  const atc = $('[data-pp-atc]');
  const err = $('[data-pp-err]');
  const say = $('[data-pp-say]');
  const mascot = root.querySelector('.pp-sarge [data-pp-mascot]');
  const sticky = $('[data-pp-sticky]');
  const stickyBtn = $('[data-pp-sticky-btn]');
  const stickySel = $('[data-pp-sticky-size]');
  const sizeRadios = $$('input[name="id"]');
  const qtyRadios = $$('input[name="quantity"]');

  const state = { variant: null, qty: 1 };
  const byId = (id) => variants.find((v) => String(v.id) === String(id));
  const bySize = (label) => variants.find((v) => v.size === label);
  const rate = (q) => { let r = 0; TIERS.forEach((t) => { if (q >= t.qty) r = t.pct / 100; }); return r; };
  const unit = () => (state.variant || variants.find((v) => v.available) || variants[0]).price;
  const total = (q) => Math.round(q * unit() * (1 - rate(q)));

  const speak = (msg) => { if (say) say.textContent = msg; };

  // ---------- State -> UI ----------
  function render() {
    const q = state.qty;
    const t = total(q);
    const orig = q * unit();
    const v = state.variant;
    $('[data-pp-price]').textContent = money(t);
    const was = $('[data-pp-was]');
    const save = $('[data-pp-save]');
    was.hidden = save.hidden = orig === t;
    if (orig !== t) { was.textContent = money(orig); save.textContent = `Save ${money(orig - t)}`; }

    const label = $('[data-pp-size-label]');
    label.textContent = v ? v.size : 'choose one';

    const hint = $('[data-pp-hint]');
    if (v) {
      const s = sizes.find((x) => x.label === v.size);
      if (s) hint.innerHTML = `<b>${s.label}</b> fits ${s.min}–${s.max} lb · chest ${s.chest} · e.g. ${s.breeds}`;
    }

    const extra = $('[data-pp-extra]');
    extra.hidden = q < 2;
    $$('[data-pp-extra-row]').forEach((row) => { row.hidden = Number(row.dataset.ppExtraRow) > q; });

    const word = q === 1 ? 'Add to cart' : `Add ${q} suits`;
    let label2;
    if (!variants.some((x) => x.available)) label2 = 'Sold out';
    else if (!v) label2 = 'Choose your size';
    else if (!v.available) label2 = `Size ${v.size} is sold out`;
    else label2 = `${word} · ${money(t)}`;
    atc.textContent = label2;
    atc.setAttribute('aria-disabled', v && v.available ? 'false' : 'true');

    // Sticky bar mirrors the main form.
    $('[data-pp-sticky-meta]').textContent = v ? `Size ${v.size}${q > 1 ? ` · ${q} suits` : ''}` : 'Choose your size';
    $('[data-pp-sticky-price]').textContent = money(t);
    stickySel.value = v ? String(v.id) : '';
    stickyBtn.textContent = !v ? 'Choose size' : !v.available ? 'Sold out' : (q === 1 ? `Add · ${money(t)}` : `Add ${q} · ${money(t)}`);
  }

  function setVariant(id, { fromUser = true } = {}) {
    const v = byId(id);
    if (!v) return;
    state.variant = v;
    const r = sizeRadios.find((x) => x.value === String(v.id));
    if (r && !r.checked) r.checked = true;
    // Extra suit selects default to the main size until the shopper changes them.
    $$('[data-pp-extra-select]').forEach((sel) => { if (!sel.dataset.touched) sel.value = String(v.id); });
    if (fromUser) {
      const s = sizes.find((x) => x.label === v.size);
      speak(v.available ? `Good choice! ${v.size} fits ${s ? `${s.min}–${s.max} lb pups` : 'your pup'}.` : `${v.size} is sold out. Try another size.`);
      try { localStorage.setItem('pp_size', v.size); } catch (e) {}
      const url = new URL(location.href);
      url.searchParams.set('variant', v.id);
      history.replaceState(history.state, '', url);
    }
    err.hidden = true;
    render();
  }

  sizeRadios.forEach((r) => r.addEventListener('change', () => setVariant(r.value)));
  qtyRadios.forEach((r) => r.addEventListener('change', () => {
    state.qty = Number(r.value);
    if (state.qty === 2) speak('Battle Buddies! 15% off both suits.');
    if (state.qty === 3) speak('A full squad! 25% off every suit.');
    render();
  }));
  $$('[data-pp-extra-select]').forEach((sel) => sel.addEventListener('change', () => { sel.dataset.touched = '1'; }));

  // ---------- Add to cart ----------
  function needSize() {
    const field = $('[data-pp-sizes-field]');
    field.scrollIntoView({ behavior: 'smooth', block: 'center' });
    field.classList.remove('is-flash');
    void field.offsetWidth;
    field.classList.add('is-flash');
    speak('Pick a size first, recruit!');
    if (window.PPSalute) window.PPSalute(mascot, 900);
    setTimeout(() => { const first = sizeRadios.find((x) => !x.disabled); if (first) first.focus({ preventScroll: true }); }, 450);
  }

  function buildItems() {
    const counts = new Map();
    const add = (id) => counts.set(String(id), (counts.get(String(id)) || 0) + 1);
    add(state.variant.id);
    $$('[data-pp-extra-row]').forEach((row) => {
      if (Number(row.dataset.ppExtraRow) <= state.qty) add(row.querySelector('select').value);
    });
    return [...counts].map(([id, quantity]) => ({ id: Number(id), quantity }));
  }

  async function addToCart(btn) {
    if (!state.variant) { needSize(); return; }
    if (!state.variant.available) { needSize(); return; }
    const items = buildItems();
    const bad = items.find((i) => !(byId(i.id) || {}).available);
    if (bad) { err.textContent = `Size ${byId(bad.id).size} is sold out. Please pick another size.`; err.hidden = false; err.focus(); return; }
    if (!window.PPCart) { form.submit(); return; }
    const label = btn.textContent;
    btn.classList.add('is-loading');
    btn.textContent = 'Adding…';
    const ok = await window.PPCart.add(items);
    btn.classList.remove('is-loading');
    if (ok) {
      btn.classList.add('is-done');
      btn.textContent = 'Added ✓';
      speak('Welcome to the squad! 🎖️');
      setTimeout(() => { btn.classList.remove('is-done'); render(); }, 1400);
    } else {
      btn.textContent = label;
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); addToCart(atc); });
  stickyBtn.addEventListener('click', () => {
    if (!state.variant) {
      try { stickySel.focus(); if (window.innerWidth >= 750 && stickySel.showPicker) { stickySel.showPicker(); return; } } catch (e) {}
      needSize();
      return;
    }
    addToCart(stickyBtn);
  });
  stickySel.addEventListener('change', () => { if (stickySel.value) setVariant(stickySel.value); });

  // ---------- Sticky bar visibility ----------
  if ('IntersectionObserver' in window) {
    let atcAbove = false, footerIn = false, drawerOpen = false;
    const sync = () => {
      const on = atcAbove && !footerIn && !drawerOpen;
      sticky.classList.toggle('is-on', on);
      sticky.inert = !on;
      document.body.classList.toggle('pp-sticky-on', on);
    };
    new IntersectionObserver(([en]) => { atcAbove = !en.isIntersecting && en.boundingClientRect.top < 0; sync(); }).observe(atc);
    const footer = document.querySelector('.pp-footer');
    if (footer) new IntersectionObserver(([en]) => { footerIn = en.isIntersecting; sync(); }).observe(footer);
    document.addEventListener('pp:cart-open', () => { drawerOpen = true; sync(); });
    document.addEventListener('pp:cart-close', () => { drawerOpen = false; sync(); });
  }

  // ---------- Size finder ----------
  const finder = $('[data-pp-finder]');
  if (finder) {
    const out = $('[data-pp-find-out]');
    const run = () => {
      let w = parseFloat($('[data-pp-weight]').value);
      const kg = finder.querySelector('input[type="radio"][value="kg"]').checked;
      if (!w || w <= 0) { out.innerHTML = '<div class="pp-finder__out is-warn" role="alert">Enter your dog\'s weight.</div>'; return; }
      if (kg) w *= 2.2046;
      w = Math.round(w * 10) / 10;
      const max = sizes[sizes.length - 1].max;
      if (w > max) { out.innerHTML = `<div class="pp-finder__out is-warn">This suit fits dogs up to about ${max} lb. It may be too small.</div>`; return; }
      const pick = sizes.find((s) => w <= s.max) || sizes[sizes.length - 1];
      const near = w > pick.max - 1 && pick !== sizes[sizes.length - 1];
      const small = w < sizes[0].min;
      const v = bySize(pick.label);
      out.innerHTML = `<div class="pp-finder__out"><span>Recommended: <b>${pick.label}</b><br><small>${near ? 'Right at the top of this size. Measure the chest, and size up if it is over ' + pick.chest.split('–')[1] + '.' : small ? 'Small pup! S may fit a little loose.' : `Fits ${pick.min}–${pick.max} lb, chest ${pick.chest}.`}</small></span>${v && v.available ? `<button type="button" class="pp-btn pp-btn--sm" data-pp-pick="${v.id}">Select ${pick.label}</button>` : '<span>Sold out right now</span>'}</div>`;
    };
    $('[data-pp-find]').addEventListener('click', run);
    $('[data-pp-weight]').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    out.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pp-pick]');
      if (!b) return;
      setVariant(b.dataset.ppPick);
      $('[data-pp-sizes-field]').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // ---------- Size guide + zoom dialogs ----------
  const guide = $('[data-pp-guide]');
  const openDialog = (d) => { if (d.showModal) d.showModal(); else d.setAttribute('open', ''); };
  const closeDialog = (d) => { if (d.close) d.close(); else d.removeAttribute('open'); };
  root.querySelectorAll('[data-pp-open-guide]').forEach((b) => b.addEventListener('click', () => openDialog(guide)));
  $('[data-pp-close-guide]').addEventListener('click', () => closeDialog(guide));
  const zoom = $('[data-pp-zoom]');
  const zoomImg = $('[data-pp-zoom-img]');
  $('[data-pp-close-zoom]').addEventListener('click', () => closeDialog(zoom));
  [guide, zoom].forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) closeDialog(d); }));

  // ---------- Gallery ----------
  const track = $('[data-track]');
  const slides = $$('.pp-gallery__slide');
  const thumbs = $$('[data-thumb]');
  const count = $('[data-count]');
  let current = 0;
  const go = (i) => {
    i = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: slides[i].offsetLeft, behavior: 'smooth' });
  };
  const markActive = (i) => {
    current = i;
    if (count) count.textContent = i + 1;
    thumbs.forEach((t, k) => { t.classList.toggle('is-active', k === i); t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    const t = thumbs[i];
    if (t) t.parentElement.scrollTo({ left: t.offsetLeft - 40, behavior: 'smooth' });
  };
  let raf;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i !== current) markActive(i);
    });
  }, { passive: true });
  thumbs.forEach((t, k) => t.addEventListener('click', () => go(k)));
  const prev = $('[data-prev]'); const next = $('[data-next]');
  if (prev) prev.addEventListener('click', () => go(current - 1));
  if (next) next.addEventListener('click', () => go(current + 1));
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
  });
  track.addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    zoomImg.src = img.currentSrc || img.src;
    zoomImg.alt = img.alt;
    openDialog(zoom);
  });

  // ---------- Init ----------
  const params = new URLSearchParams(location.search);
  const checked = sizeRadios.find((r) => r.checked);
  let saved = null;
  try { saved = localStorage.getItem('pp_size'); } catch (e) {}
  if (checked) setVariant(checked.value, { fromUser: false });
  else if (params.get('variant') && byId(params.get('variant'))) setVariant(params.get('variant'), { fromUser: false });
  else if (saved && bySize(saved) && bySize(saved).available) { setVariant(bySize(saved).id, { fromUser: false }); speak(`Size ${saved} picked from your size check.`); }
  const b = Number(params.get('bundle'));
  if ([2, 3].includes(b)) {
    const r = qtyRadios.find((x) => Number(x.value) === b);
    if (r) { r.checked = true; state.qty = b; }
  }
  render();
})();
