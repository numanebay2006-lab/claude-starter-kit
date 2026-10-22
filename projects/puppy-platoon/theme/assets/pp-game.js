/* Treat Drill: catch falling bones with Sergeant Pup. Win = discount code. */
(() => {
  const game = document.querySelector('[data-pp-game]');
  if (!game) return;
  const board = game.querySelector('[data-board]');
  const player = game.querySelector('[data-player]');
  const scoreEl = game.querySelector('[data-score]');
  const timeEl = game.querySelector('[data-time]');
  const live = game.querySelector('[data-live]');
  const mascot = player.querySelector('[data-pp-mascot]');
  const CODE = game.dataset.code;
  const GOAL = Number(game.dataset.goal) || 10;
  const SECONDS = Number(game.dataset.seconds) || 15;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const BONE = (gold) => `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M10 8a5 5 0 0 1 8 4l10 10a5 5 0 1 1 2 8 5 5 0 1 1-8 2L12 22a5 5 0 1 1-4-8 5 5 0 0 1 2-6z" fill="${gold ? '#F2C14E' : '#FFF8E8'}" stroke="${gold ? '#9A6B00' : '#8A5A2B'}" stroke-width="2.5" stroke-linejoin="round"/></svg>`;

  let W = 0, H = 0, px = 0, target = 0, score = 0, timeLeft = SECONDS, running = false;
  let treats = [], lastSpawn = 0, lastT = 0, raf = 0, tick = 0, attempts = 0, keys = { l: false, r: false };
  const PW = 78;

  const show = (name) => game.querySelectorAll('[data-screen]').forEach((s) => { s.hidden = s.dataset.screen !== name; });
  const measure = () => { W = board.clientWidth; H = board.clientHeight; };
  const place = () => { player.style.transform = `translateX(${px}px)`; };

  function reset() {
    measure();
    treats.forEach((t) => t.el.remove());
    treats = [];
    score = 0;
    timeLeft = SECONDS;
    px = target = (W - PW) / 2;
    scoreEl.textContent = '0';
    timeEl.textContent = String(SECONDS);
    place();
  }

  function spawn(now) {
    const gold = Math.random() < 0.15;
    const el = document.createElement('div');
    el.className = 'pp-game__treat';
    el.innerHTML = BONE(gold);
    board.appendChild(el);
    const progress = 1 - timeLeft / SECONDS;
    treats.push({ el, x: 10 + Math.random() * (W - 54), y: -40, vy: (reduce ? 120 : 150) + progress * 140 + Math.random() * 40, gold, rot: Math.random() * 360 });
    lastSpawn = now;
  }

  function pop(x, y, txt) {
    const p = document.createElement('span');
    p.className = 'pp-game__pop';
    p.textContent = txt;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    board.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - lastT) / 1000 || 0);
    lastT = now;
    const speed = 520;
    if (keys.l) target -= speed * dt;
    if (keys.r) target += speed * dt;
    target = Math.max(0, Math.min(W - PW, target));
    px += (target - px) * Math.min(1, dt * 14);
    place();

    const gap = Math.max(380, 820 - (1 - timeLeft / SECONDS) * 440);
    if (now - lastSpawn > gap) spawn(now);

    const catchTop = H - 70, catchBottom = H - 10;
    treats = treats.filter((t) => {
      t.y += t.vy * dt;
      t.rot += 90 * dt;
      t.el.style.transform = `translate(${t.x}px, ${t.y}px) rotate(${t.rot}deg)`;
      const cx = t.x + 17, cy = t.y + 17;
      if (cy > catchTop && cy < catchBottom && cx > px + 4 && cx < px + PW - 4) {
        const pts = t.gold ? 2 : 1;
        score += pts;
        scoreEl.textContent = String(score);
        pop(cx, t.y, `+${pts}`);
        if (mascot && !reduce) { mascot.classList.remove('is-jump'); void mascot.offsetWidth; mascot.classList.add('is-jump'); }
        t.el.remove();
        if (score >= GOAL) { end(true); return false; }
        return false;
      }
      if (t.y > H) { t.el.remove(); return false; }
      return true;
    });
    raf = requestAnimationFrame(frame);
  }

  function start() {
    attempts++;
    reset();
    show('none');
    running = true;
    lastT = performance.now();
    lastSpawn = lastT - 600;
    board.focus({ preventScroll: true });
    live.textContent = `Drill started. Catch ${GOAL} treats in ${SECONDS} seconds.`;
    clearInterval(tick);
    tick = setInterval(() => {
      if (!running) return;
      timeLeft--;
      timeEl.textContent = String(Math.max(0, timeLeft));
      if (timeLeft <= 0) end(score >= GOAL);
    }, 1000);
    raf = requestAnimationFrame(frame);
  }

  function end(won) {
    if (!running) return;
    running = false;
    clearInterval(tick);
    cancelAnimationFrame(raf);
    treats.forEach((t) => t.el.remove());
    treats = [];
    if (won) win();
    else {
      game.querySelector('[data-final]').textContent = String(score);
      game.querySelector('[data-skip]').hidden = attempts < 1;
      show('lose');
      live.textContent = `Time's up. You caught ${score} of ${GOAL}.`;
    }
  }

  function win() {
    try { localStorage.setItem('pp_game_won', '1'); } catch (e) {}
    show('win');
    live.textContent = `You won! Code ${CODE} unlocked.`;
    if (window.PPSalute && mascot) window.PPSalute(mascot, 1800);
  }

  // Controls: pointer drag/tap, arrow keys.
  const toX = (clientX) => {
    const r = board.getBoundingClientRect();
    target = Math.max(0, Math.min(W - PW, clientX - r.left - PW / 2));
  };
  board.addEventListener('pointerdown', (e) => { if (running) { toX(e.clientX); board.setPointerCapture && board.setPointerCapture(e.pointerId); } });
  board.addEventListener('pointermove', (e) => { if (running && (e.pointerType === 'mouse' || e.buttons)) toX(e.clientX); });
  board.addEventListener('keydown', (e) => {
    if (!running) return;
    if (e.key === 'ArrowLeft') { keys.l = true; e.preventDefault(); }
    if (e.key === 'ArrowRight') { keys.r = true; e.preventDefault(); }
    if (e.key === 'Escape') end(false);
  });
  board.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.l = false;
    if (e.key === 'ArrowRight') keys.r = false;
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) end(score >= GOAL); });
  window.addEventListener('resize', () => { if (!running) { measure(); px = target = (W - PW) / 2; place(); } });

  game.querySelectorAll('[data-start]').forEach((b) => b.addEventListener('click', start));
  game.querySelector('[data-skip]').addEventListener('click', win);

  game.querySelector('[data-copy]').addEventListener('click', async (e) => {
    try { await navigator.clipboard.writeText(CODE); e.target.textContent = 'Copied!'; }
    catch (err) { e.target.textContent = CODE; }
  });

  game.querySelector('[data-apply]').addEventListener('click', async (e) => {
    const msg = game.querySelector('[data-msg]');
    const btn = e.currentTarget;
    btn.classList.add('is-loading');
    try {
      const res = await fetch('/cart/update.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ discount: CODE }) });
      const cart = await res.json();
      const c = (cart.discount_codes || []).find((d) => d.code.toUpperCase() === CODE.toUpperCase());
      if (!cart.item_count) msg.textContent = 'Saved! It applies once a suit is in your cart.';
      else if (c && c.applicable) msg.textContent = 'Applied! Your savings show in the cart.';
      else msg.textContent = 'Saved! It applies at checkout on orders from $35.';
      if (window.PPCart) { await window.PPCart.refresh(); if (cart.item_count) window.PPCart.open(); }
    } catch (err) {
      msg.textContent = `Use code ${CODE} at checkout.`;
    }
    btn.classList.remove('is-loading');
  });

  // Returning winners see their code straight away.
  let won = false;
  try { won = localStorage.getItem('pp_game_won') === '1'; } catch (e) {}
  measure();
  px = target = (W - PW) / 2;
  place();
  if (won) show('win');
})();
