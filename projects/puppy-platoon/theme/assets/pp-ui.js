/* Puppy Platoon global UI: announcement, menu, mascot, reveal, delivery estimate. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Rotating announcement bar (pauses on hover/focus).
  document.querySelectorAll('[data-pp-announce]').forEach((bar) => {
    const msgs = [...bar.querySelectorAll('.pp-announce__msg')];
    if (msgs.length < 2) return;
    let i = 0, paused = false;
    bar.addEventListener('mouseenter', () => { paused = true; });
    bar.addEventListener('mouseleave', () => { paused = false; });
    bar.addEventListener('focusin', () => { paused = true; });
    bar.addEventListener('focusout', () => { paused = false; });
    setInterval(() => {
      if (paused || document.hidden) return;
      msgs[i].setAttribute('aria-hidden', 'true');
      i = (i + 1) % msgs.length;
      msgs[i].removeAttribute('aria-hidden');
    }, 4500);
  });

  // Mobile menu.
  const menu = document.getElementById('pp-menu');
  const opener = document.querySelector('[data-pp-menu-open]');
  if (menu && opener) {
    const openMenu = () => {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      opener.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('pp-lock');
      menu.querySelector('[data-pp-menu-close]:not(.pp-menu__scrim)').focus();
    };
    const closeMenu = () => {
      menu.classList.remove('is-open');
      opener.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('pp-lock');
      setTimeout(() => { menu.hidden = true; }, 280);
      opener.focus();
    };
    opener.addEventListener('click', openMenu);
    menu.addEventListener('click', (e) => {
      if (e.target.closest('[data-pp-menu-close]')) closeMenu();
      else if (e.target.closest('a[href*="#"]')) closeMenu();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) closeMenu(); });
  }

  // Mascot: salute on tap, on scroll-in, and when something is added to cart.
  const salute = (m, ms = 1300) => {
    if (!m || reduce) return;
    wake(m);
    m.classList.add('is-salute', 'is-jump');
    clearTimeout(m._t);
    m._t = setTimeout(() => m.classList.remove('is-salute', 'is-jump'), ms);
  };
  window.PPSalute = salute;
  // Idle loops stop after 15s so motion never runs forever (WCAG 2.2.2).
  const rest = () => document.querySelectorAll('[data-pp-mascot]').forEach((m) => m.classList.add('is-rest'));
  let restT = setTimeout(rest, 15000);
  const wake = (m) => { m.classList.remove('is-rest'); clearTimeout(restT); restT = setTimeout(rest, 15000); };

  // Speech bubbles that rotate through a few lines once, then stop.
  document.querySelectorAll('[data-pp-lines]').forEach((el) => {
    let lines = [];
    try { lines = JSON.parse(el.dataset.ppLines); } catch (e) {}
    if (lines.length < 2) return;
    let i = 0;
    const next = () => { i = (i + 1) % lines.length; el.textContent = lines[i]; };
    el._next = next;
    if (reduce) return;
    let shown = 1;
    const t = setInterval(() => { if (document.hidden) return; next(); if (++shown >= lines.length) clearInterval(t); }, 3800);
  });
  document.addEventListener('click', (e) => {
    const m = e.target.closest('[data-pp-mascot]');
    if (!m) return;
    salute(m);
    const bubble = m.parentElement && m.parentElement.querySelector('[data-pp-lines]');
    if (bubble && bubble._next) bubble._next();
  });
  document.addEventListener('pp:added', () => {
    document.querySelectorAll('[data-pp-mascot]').forEach((m) => salute(m, 1600));
  });

  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      if (en.target.matches('[data-pp-salute-on-view]')) {
        const m = en.target.querySelector('[data-pp-mascot]') || en.target;
        setTimeout(() => salute(m), 350);
      }
      io.unobserve(en.target);
    });
  }, { threshold: 0.2 }) : null;
  document.querySelectorAll('.pp-reveal, [data-pp-salute-on-view]').forEach((el) => {
    if (io) io.observe(el); else el.classList.add('is-in');
  });

  // Delivery estimate: today + N business days (skips weekends).
  const addBiz = (d, n) => {
    const x = new Date(d);
    let added = 0;
    while (added < n) {
      x.setDate(x.getDate() + 1);
      const day = x.getDay();
      if (day !== 0 && day !== 6) added++;
    }
    return x;
  };
  const fmt = (d) => d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  document.querySelectorAll('[data-pp-eta]').forEach((el) => {
    const [a, b] = (el.dataset.ppEta || '5-7').split('-').map(Number);
    const now = new Date();
    el.textContent = `${fmt(addBiz(now, a))} – ${fmt(addBiz(now, b))}`;
  });

  // Mobile sticky bar on the homepage: appears after the hero CTA scrolls away.
  const homeBar = document.querySelector('[data-pp-home-sticky]');
  const heroCta = document.querySelector('[data-pp-hero-cta]');
  if (homeBar && heroCta && io) {
    const footer = document.querySelector('.pp-footer');
    let ctaGone = false, footerIn = false;
    const sync = () => {
      const on = ctaGone && !footerIn;
      homeBar.classList.toggle('is-on', on);
      homeBar.inert = !on;
      document.body.classList.toggle('pp-sticky-on', on);
    };
    new IntersectionObserver(([en]) => { ctaGone = !en.isIntersecting && en.boundingClientRect.top < 0; sync(); }).observe(heroCta);
    if (footer) new IntersectionObserver(([en]) => { footerIn = en.isIntersecting; sync(); }).observe(footer);
    document.addEventListener('pp:cart-open', () => homeBar.classList.remove('is-on'));
    document.addEventListener('pp:cart-close', sync);
  }

  // Size finder (homepage + size guide page).
  document.querySelectorAll('[data-pp-sizer]').forEach((box) => {
    const form = box.querySelector('form');
    const out = box.querySelector('[data-pp-sizer-out]');
    const sizes = JSON.parse(box.querySelector('[data-pp-sizes]').textContent);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const unit = form.querySelector('[name="unit"]:checked').value;
      let w = parseFloat(form.querySelector('[name="weight"]').value);
      if (!w || w <= 0) { out.innerHTML = '<p class="pp-sizer__err" role="alert">Enter your dog\'s weight.</p>'; return; }
      if (unit === 'kg') w *= 2.2046;
      w = Math.round(w * 10) / 10;
      const max = sizes[sizes.length - 1].max;
      if (w > max) { out.innerHTML = `<p class="pp-sizer__err" role="alert">This suit fits dogs up to about ${max} lb. It may be too small for your pup.</p>`; return; }
      // Sizes overlap at the edges, so take the first size whose top weight covers the dog.
      const pick = sizes.find((s) => w <= s.max) || sizes[sizes.length - 1];
      const edge = sizes.some((s) => s !== pick && w >= s.min && w <= s.max) || w > pick.max - 1;
      try { localStorage.setItem('pp_size', pick.label); } catch (err) {}
      out.innerHTML = `<div class="pp-sizer__res"><p class="pp-sizer__big">Your size: <b>${pick.label}</b></p>
        <p>${pick.label} fits ${pick.min}–${pick.max} lb, chest ${pick.chest}.${edge ? ' Between sizes? Size up for comfort.' : ''}</p>
        <a class="pp-btn" href="${pick.url}" data-pp-cta="size-result">Get size ${pick.label} →</a></div>`;
    });
  });
})();
