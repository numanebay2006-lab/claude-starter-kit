# Sergeant Pup: mascot and animation build spec

Verification: I rendered every pose in headless Chromium at 40, 64, 96 and 140px, on sand and olive backgrounds. I also tested the event wiring. With reduced motion on, 0 animations run and the poses show as still frames. I deleted the temporary render files afterwards.

## 1. Character
- **Name: "Sergeant Pup"**. Bubble signature: "– Sgt. Pup". plan_copy, plan_home and plan_pdp all use this name. plan_brand says "Sgt. Biscuit". **The lead dev should pick one.** Changing it only touches copy strings.
- **Look:** a black-and-tan dachshund, matching hero photo p1. It wears a camo helmet with an olive ear-muff headset and a mic boom. It also has a tan plate carrier with a US flag patch, 3 gold sergeant chevrons (the rank joke), cream plush paws, camo pants and a long tail.
- **No rifle on the mascot.** This keeps the brand symbol gentle and keeps weapon imagery out of the logo. The product photos already show the plush toy rifle.
- **Palette:** fur `#2B211B`, tan `#C98A4B`, ears `#46332A`, feet `#A8693A`, eyes/nose `#15100D`, tongue `#E9737B`. Helmet `#8C9A5E` with spots `#5E6B3A`/`#C7B58A`, band `#B49E6E`. Muffs `#6F7F45`/`#4B5D2A`. Vest `#C9A877`, pouches `#7A6646`. Sleeves/pants `#7F8E53`, plush paws `#EAD3AE`. Flag `#B91C1C`/`#FFF`/`#1E3A5F`. Chevrons and stars `#F2C14E`. Outline ink `#1F2A1C` at 2 units.
- **Class hooks instead of ids, on purpose.** The mascot renders 2 or 3 times per page (hero or PDP, plus the drawer), and duplicate ids are invalid. The SVG has no `<defs>`, clipPath or gradients, so instances can never collide.

**Parts and pivots** (viewBox user units, `transform-box: view-box`):

| Class | Pivot | Motion |
|---|---|---|
| `.sp-rig` | 60 112 (feet) | breathe, jump, hop |
| `.sp-shadow` | 60 113 | shrinks when airborne |
| `.sp-tail` | 76 92 | wag |
| `.sp-ear-l` / `.sp-ear-r` | 37 52 / 83 52 | twitch outward |
| `.sp-eyes` | 60 50.5 | blink (scaleY .1) |
| `.sp-head` | 60 66 | sad tilt |
| `.sp-uarm` | 80 69 (shoulder) | salute `rotate(-150deg)` |
| `.sp-farm` (nested inside `.sp-uarm`) | 77.4 83.8 (elbow) | salute `rotate(-111deg)` |
| `.sp-star` ×3 | fill-box centre | burst |
| `.sp-rank` | – | glint on promotion |
| `.sp-tongue` | – | opacity, happy state |

## 2. Files
- `snippets/pp-mascot.liquid`: the SVG (4.3KB raw, 1.6KB gzip). Params: `variant` (`'peek'` drops legs and tail and crops to head and shoulders), `size` (px height; leave it out to size with CSS), `pose` (`'salute'` for a still pose).
- `assets/pp-mascot.css` (1.5KB gzip): load it in `<head>`.
- `assets/pp-mascot.js` (1.9KB gzip): load it with `defer`.

```liquid
{%- liquid
  assign peek = false
  if variant == 'peek'
    assign peek = true
  endif
-%}
<svg class="sp{% if pose %} is-{{ pose }}{% endif %}" {% if peek %}viewBox="24 8 76 64" width="76" height="64"{% else %}viewBox="22 6 80 112" width="80" height="112"{% endif %}{% if size %} style="--sp-h:{{ size }}px"{% endif %} aria-hidden="true" focusable="false">{% unless peek %}<ellipse class="sp-shadow" cx="60" cy="113" rx="24" ry="3.5" fill="#1F2A1C" opacity=".14"/>{% endunless %}
<g class="sp-rig" stroke="#1F2A1C" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
{% unless peek %}<path class="sp-tail" d="M76 92C86 94 94 88 97 78" fill="none" stroke="#2B211B" stroke-width="5.5"/><g class="sp-legs" fill="#7F8E53"><rect x="47" y="89" width="11" height="18" rx="5"/><rect x="62" y="89" width="11" height="18" rx="5"/><path d="M49 95h4v3h-4zM66 99h4v3h-4z" fill="#5E6B3A" stroke="none"/><g fill="#A8693A"><ellipse cx="52.5" cy="108" rx="6.5" ry="3.8"/><ellipse cx="67.5" cy="108" rx="6.5" ry="3.8"/></g></g>{% endunless %}
<g class="sp-body"><rect x="41" y="63" width="38" height="31" rx="10" fill="#C9A877"/><path d="M45 63h6v6h-6zM69 63h6v6h-6z" fill="#A88B5B" stroke="none"/><g stroke="none"><path fill="#B91C1C" d="M45 70h11v7.5H45z"/><path fill="#fff" d="M45 72.3h11v1.2H45zm0 2.5h11V76H45z"/><path fill="#1E3A5F" d="M45 70h4.6v3.9H45z"/></g><path class="sp-rank" d="M64 74l4-3 4 3m-8 3.5l4-3 4 3M64 81l4-3 4 3" fill="none" stroke="#F2C14E" stroke-width="1.7"/><path d="M49 83h6.5v8H49zm7.75 0h6.5v8h-6.5zm7.75 0H71v8h-6.5z" fill="#7A6646" stroke-width="1.2"/></g>
<g class="sp-head"><path class="sp-ear-l" d="M36 50c-7 8-6 19 0 21 5 1 7-8 6-17z" fill="#46332A"/><path class="sp-ear-r" d="M84 50c7 8 6 19 0 21-5 1-7-8-6-17z" fill="#46332A"/><path d="M42 50c0-10 8-16 18-16s18 6 18 16c0 9-8 20-18 20S42 59 42 50z" fill="#2B211B"/><g fill="#C98A4B" stroke="none"><path d="M50 59c0-4 4-6 10-6s10 2 10 6c0 5.5-4 10-10 10s-10-4.5-10-10z"/><ellipse cx="52" cy="45.6" rx="2.6" ry="1.6"/><ellipse cx="68" cy="45.6" rx="2.6" ry="1.6"/></g><g class="sp-eyes" stroke="none"><circle cx="52.5" cy="50.5" r="3.6" fill="#15100D"/><circle cx="67.5" cy="50.5" r="3.6" fill="#15100D"/><circle cx="53.7" cy="49.2" r="1.2" fill="#fff"/><circle cx="68.7" cy="49.2" r="1.2" fill="#fff"/></g><path class="sp-tongue" d="M58 65.2q2 5.5 4 0z" fill="#E9737B" stroke-width="1" opacity="0"/><ellipse cx="60" cy="59" rx="4.6" ry="3.3" fill="#15100D" stroke="none"/><path d="M56 64q2 2.4 4 .4 2 2 4-.4" fill="none" stroke-width="1.4"/><path d="M36 41c0-17 11-27 24-27s24 10 24 27z" fill="#8C9A5E"/><path d="M42 30c3-4 8-3 8 0s-5 4-8 2zm22-11c4-2 9 0 8 3s-6 2-8 0zm6 12c3-2 8-1 7 2s-5 3-7 1zM48 21c2-2 5-1 4 1s-4 2-4-1z" fill="#5E6B3A" stroke="none"/><path d="M55 32c2-2 6-1 6 1s-4 3-6 1zm21-8c1-1 3 0 3 2l-3 1zm-36 12c1-2 4-2 5 0s-3 2-5 0z" fill="#C7B58A" stroke="none"/><rect x="55" y="21" width="10" height="6.5" rx="1.5" fill="#A49163" stroke-width="1.2"/><rect x="34" y="36" width="52" height="7" rx="3.5" fill="#B49E6E"/><g fill="#6F7F45"><circle cx="37" cy="48" r="8"/><circle cx="83" cy="48" r="8"/></g><g fill="#4B5D2A" stroke="none"><circle cx="37" cy="48" r="4"/><circle cx="83" cy="48" r="4"/></g><path d="M85 55.5q-1 8-11 8.5" fill="none" stroke-width="1.6"/><circle cx="73" cy="64" r="2.2" fill="#1F2A1C"/></g>
<g class="sp-arm-l" fill="#7F8E53"><rect x="-4.5" y="-3" width="9" height="21" rx="4.5" transform="translate(40 69) rotate(-10)"/><rect x="-4.25" y="-2" width="8.5" height="16" rx="4.25" transform="translate(42.6 83.8) rotate(-48)"/><circle cx="54.5" cy="94.5" r="5.5" fill="#EAD3AE"/></g>
<g class="sp-uarm" fill="#7F8E53"><rect x="-4.5" y="-3" width="9" height="21" rx="4.5" transform="translate(80 69) rotate(10)"/><g class="sp-farm"><rect x="-4.25" y="-2" width="8.5" height="16" rx="4.25" transform="translate(77.4 83.8) rotate(48)"/><circle cx="65.5" cy="94.5" r="5.5" fill="#EAD3AE"/></g></g></g>
<g fill="#F2C14E" stroke="#1F2A1C" stroke-width="1"><path class="sp-star" opacity="0" d="M30 20l1.5 4.5L36 26l-4.5 1.5L30 32l-1.5-4.5L24 26l4.5-1.5z"/><path class="sp-star" opacity="0" d="M93 16l1.5 4.5L99 22l-4.5 1.5L93 28l-1.5-4.5L87 22l4.5-1.5z"/><path class="sp-star" opacity="0" d="M98 52l1.2 3.8L103 57l-3.8 1.2L98 62l-1.2-3.8L93 57l3.8-1.2z"/></g></svg>
```

## 3. CSS (`assets/pp-mascot.css`)
```css
.sp-wrap{position:relative;display:flex;align-items:center;gap:10px}
.sp-btn{all:unset;display:block;line-height:0;cursor:pointer;border-radius:12px;-webkit-tap-highlight-color:transparent}
.sp-btn:focus-visible{outline:3px solid #C2410C;outline-offset:4px}
.sp{--sp-h:96px;height:var(--sp-h);width:auto;display:block;overflow:visible}
.sp *{transform-box:view-box}
.sp-rig{transform-origin:60px 112px;animation:sp-breathe 3.2s ease-in-out infinite}
.sp-eyes{transform-origin:60px 50.5px;animation:sp-blink 5.4s infinite}
.sp-tail{transform-origin:76px 92px;animation:sp-wag 3s ease-in-out infinite}
.sp-ear-l{transform-origin:37px 52px;animation:sp-ear 7s infinite}
.sp-ear-r{--d:-1;transform-origin:83px 52px;animation:sp-ear 7s 3.3s infinite}
.sp-head{transform-origin:60px 66px;transition:transform .3s}
.sp-uarm{transform-origin:80px 69px;transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.sp-farm{transform-origin:77.4px 83.8px;transition:transform .35s cubic-bezier(.34,1.56,.64,1) .06s}
.sp.is-salute .sp-uarm{transform:rotate(-150deg)}
.sp.is-salute .sp-farm{transform:rotate(-111deg)}
@media (hover:hover) and (pointer:fine){.sp-btn:hover .sp-uarm{transform:rotate(-150deg)}.sp-btn:hover .sp-farm{transform:rotate(-111deg)}}
.sp-btn:focus-visible .sp-uarm{transform:rotate(-150deg)}
.sp-btn:focus-visible .sp-farm{transform:rotate(-111deg)}
.sp-tongue{transition:opacity .2s}
.sp.is-happy .sp-tongue{opacity:1}
.sp.is-happy .sp-tail{animation:sp-wag-fast .32s ease-in-out infinite alternate}
.sp.is-sad .sp-head{transform:translateY(1.5px) rotate(-5deg)}
.sp.is-jump .sp-rig{animation:sp-jump .9s cubic-bezier(.3,.7,.4,1)}
.sp.is-jump .sp-shadow{transform-origin:60px 113px;animation:sp-shadow .9s cubic-bezier(.3,.7,.4,1)}
.sp.is-hop .sp-rig{animation:sp-hop .3s ease-out}
.sp .sp-star{transform-box:fill-box;transform-origin:center}
.sp.is-jump .sp-star,.sp.is-stars .sp-star{animation:sp-star .9s ease-out both}
.sp .sp-star:nth-of-type(2){animation-delay:.08s}
.sp .sp-star:nth-of-type(3){animation-delay:.16s}
.sp.is-promo .sp-rank{animation:sp-glint .4s 4 alternate}
.sp.is-paused *{animation-play-state:paused!important}
.sp.is-rest .sp-rig,.sp.is-rest .sp-eyes,.sp.is-rest .sp-tail,.sp.is-rest .sp-ear-l,.sp.is-rest .sp-ear-r{animation:none}
@keyframes sp-breathe{50%{transform:scale(1.012,1.024)}}
@keyframes sp-blink{0%,93%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}
@keyframes sp-wag{0%,45%,100%{transform:rotate(0)}5%,15%,25%{transform:rotate(16deg)}10%,20%,30%{transform:rotate(-10deg)}35%{transform:rotate(4deg)}}
@keyframes sp-wag-fast{from{transform:rotate(-12deg)}to{transform:rotate(18deg)}}
@keyframes sp-ear{0%,84%,93%,100%{transform:rotate(0)}87%{transform:rotate(calc(16deg*var(--d,1)))}90%{transform:rotate(calc(-5deg*var(--d,1)))}}
@keyframes sp-jump{0%,100%{transform:none}14%{transform:scale(1.08,.9)}42%{transform:translateY(-20px) scale(.95,1.07)}68%{transform:scale(1.1,.88)}84%{transform:translateY(-3px) scale(.98,1.03)}}
@keyframes sp-shadow{42%{transform:scale(.6);opacity:.06}}
@keyframes sp-hop{50%{transform:translateY(-6px)}}
@keyframes sp-star{0%{opacity:0;transform:scale(0)}30%{opacity:1;transform:scale(1.15) rotate(30deg)}100%{opacity:0;transform:scale(.6) rotate(90deg)}}
@keyframes sp-glint{to{opacity:.35}}
.sp-bubble{position:relative;margin:0;max-width:230px;min-height:calc(2.6em + 20px);box-sizing:border-box;display:flex;align-items:center;padding:8px 12px;background:#fff;color:#1F2A1C;border:2px solid #1F2A1C;border-radius:14px;box-shadow:3px 3px 0 #1F2A1C;font:600 14px/1.3 "DM Sans",system-ui,sans-serif;transition:opacity .18s,transform .18s}
.sp-bubble::before{content:"";position:absolute;inset-inline-start:-8px;top:50%;width:12px;height:12px;background:#fff;border:solid #1F2A1C;border-width:0 0 2px 2px;transform:translateY(-50%) rotate(45deg)}
.sp-bubble.is-swap{opacity:0;transform:translateY(4px)}
.sp-peek{position:absolute;inset-inline-end:10px;bottom:0;width:60px;height:56px;overflow:hidden;pointer-events:none}
.sp-peek .sp{width:100%;height:auto;transform:translateY(46%);transition:transform .45s cubic-bezier(.34,1.56,.64,1)}
.sp-peek.is-in .sp{transform:translateY(4%)}
.sp-peek--corner{inset:auto auto 0 0;width:88px;height:88px}
.sp-peek--corner .sp{transform-origin:0 100%;transform:translate(-100%,45%) rotate(-25deg)}
.sp-peek--corner.is-in .sp{transform:translate(-8%,6%) rotate(12deg)}
@media (prefers-reduced-motion:reduce){.sp *,.sp-peek .sp,.sp-bubble{animation:none!important;transition:none!important}}
```

## 4. JS (`assets/pp-mascot.js`, deferred)
It starts automatically on every `[data-sp]` element. Each mascot only reacts to events for its own `data-sp-ctx`. Copy lives in `data-sp-say-*` attributes, so it can be edited from section settings. The `{size}` token is filled in from the event.
```js
(() => {
  const RM = matchMedia('(prefers-reduced-motion: reduce)');
  const IDLE_MS = 20000, LINE_MS = 4500, HAPPY_MS = 1800, SWAP_MS = 180;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    const api = e.target.spApi; if (!api) return;
    api.sp.classList.toggle('is-paused', !e.isIntersecting);
    if (e.isIntersecting && e.intersectionRatio >= 0.4) api.seen();
  }), { threshold: [0, 0.4] }) : null;
  const pulse = (sp, cls, ms) => {
    sp.classList.remove(cls); void sp.getBoundingClientRect(); sp.classList.add(cls);
    clearTimeout(sp['t' + cls]); sp['t' + cls] = setTimeout(() => sp.classList.remove(cls), ms);
  };
  function init(w) {
    if (w.spApi) return w.spApi;
    const sp = w.querySelector('.sp'); if (!sp) return null;
    const bubble = w.querySelector('[data-sp-bubble]');
    const peek = w.matches('.sp-peek') ? w : null;
    let lines = []; try { lines = JSON.parse(w.dataset.spLines || '[]'); } catch (e) { lines = []; }
    let i = 0, rot = 0, idle = 0, last = 0, seenOnce = false;
    const wake = () => { sp.classList.remove('is-rest'); clearTimeout(idle); idle = setTimeout(() => sp.classList.add('is-rest'), IDLE_MS); };
    const say = (text, live) => {
      if (!bubble || !text) return;
      bubble.setAttribute('aria-live', live ? 'polite' : 'off');
      if (RM.matches) { bubble.textContent = text; return; }
      bubble.classList.add('is-swap');
      setTimeout(() => { bubble.textContent = text; bubble.classList.remove('is-swap'); }, SWAP_MS);
    };
    const line = (key, vars = {}) => (w.dataset['spSay' + key] || '').replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
    const stopRotate = () => clearInterval(rot);
    const startRotate = () => {
      stopRotate(); if (RM.matches || lines.length < 2) return;
      let shown = 1;
      rot = setInterval(() => {
        if (document.hidden || sp.classList.contains('is-paused')) return;
        i = (i + 1) % lines.length; say(lines[i]);
        if (++shown >= lines.length) stopRotate();
      }, LINE_MS);
    };
    const show = ms => { if (!peek) return; peek.classList.add('is-in'); clearTimeout(peek.tOut); peek.tOut = setTimeout(() => peek.classList.remove('is-in'), ms); };
    const salute = (ms = 1400) => { wake(); pulse(sp, 'is-salute', ms); };
    const celebrate = () => {
      const now = Date.now(); if (now - last < 1000) return; last = now;
      wake(); show(3200); pulse(sp, 'is-happy', HAPPY_MS);
      if (RM.matches) { pulse(sp, 'is-salute', HAPPY_MS); return; }
      pulse(sp, peek ? 'is-stars' : 'is-jump', 900);
      setTimeout(() => pulse(sp, 'is-salute', 1300), peek ? 200 : 380);
    };
    const hop = () => { if (!RM.matches) pulse(sp, 'is-hop', 300); };
    const sad = () => { wake(); pulse(sp, 'is-sad', 1400); };
    const seen = () => { if (seenOnce) return; seenOnce = true; if (w.dataset.spOnView === 'salute') setTimeout(() => salute(), 600); };
    const btn = w.querySelector('.sp-btn');
    if (btn) btn.addEventListener('click', () => {
      salute(); stopRotate();
      if (lines.length > 1) { i = (i + 1) % lines.length; say(lines[i], true); }
    });
    ['pointerenter', 'focusin'].forEach(ev => w.addEventListener(ev, () => { stopRotate(); wake(); }));
    w.spApi = { sp, say, line, salute, celebrate, hop, sad, show, seen };
    if (io) io.observe(w); else seen();
    wake(); startRotate();
    return w.spApi;
  }
  const scan = root => root.querySelectorAll('[data-sp]').forEach(init);
  const each = (ctx, fn) => document.querySelectorAll(`[data-sp][data-sp-ctx="${ctx}"]`).forEach(w => { const a = init(w); if (a) fn(a); });
  const on = (ev, fn) => document.addEventListener(ev, e => fn(e.detail || {}));
  on('pp:variant-change', d => each('pdp', a => a.say(a.line('Size', d), true)));
  on('pp:bundle-change', d => each('pdp', a => a.say(a.line(d.qty > 1 ? 'Squad' : 'Solo', d), true)));
  on('pp:cart:added', d => { each('pdp', a => { a.say(a.line('Added', d), true); a.celebrate(); }); each('drawer', a => a.celebrate()); });
  on('pp:cart:error', d => each('pdp', a => { a.say(a.line('Error', d), true); a.sad(); }));
  on('pp:drawer:open', d => each('drawer', a => { if (d.itemCount > 0 && !sessionStorageSafe('sp-peeked')) a.show(2600); }));
  on('pp:protection', d => { if (d.on) each('drawer', a => { a.show(2600); a.salute(); }); });
  on('pp:milestone', () => each('drawer', a => { a.show(3200); a.salute(); pulse(a.sp, 'is-promo', 1700); }));
  on('pp:game:start', () => each('game', a => { a.show(2600); a.say(a.line('Start'), true); }));
  on('pp:game:catch', () => each('game', a => a.hop()));
  on('pp:game:win', () => each('game', a => { a.say(a.line('Win'), true); a.celebrate(); }));
  on('pp:game:lose', () => each('game', a => { a.show(2600); a.say(a.line('Lose'), true); a.sad(); }));
  function sessionStorageSafe(key) {
    try { if (sessionStorage.getItem(key)) return true; sessionStorage.setItem(key, '1'); } catch (e) { return false; }
    return false;
  }
  window.PPMascot = { init, scan };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scan(document)); else scan(document);
  document.addEventListener('shopify:section:load', e => scan(e.target));
})();
```
**Event contract.** The PDP, drawer and game modules must dispatch these on `document` with `CustomEvent`:
- `pp:variant-change {size}`
- `pp:bundle-change {qty}`
- `pp:cart:added {qty}`
- `pp:cart:error`
- `pp:drawer:open {itemCount}`: dispatch about 250ms after the open transition ends.
- `pp:protection {on}`
- `pp:milestone`
- `pp:game:start|catch|win|lose`

## 5. Where it appears
Base markup: `<div class="sp-wrap" data-sp data-sp-ctx="…" data-sp-lines="{{ lines | json | escape }}"><button class="sp-btn" type="button" aria-label="Tap Sergeant Pup for a salute">{% render 'pp-mascot' %}</button><p class="sp-bubble" data-sp-bubble aria-live="off">FIRST LINE</p></div>`

Use a double-quoted, escaped attribute. Lines contain apostrophes, which would break a single-quoted attribute.

1. **Home hero (`pp-hero`)**
   - `data-sp-ctx="hero" data-sp-on-view="salute"`.
   - Position: absolute, left 8px, bottom 8px, over the empty floor at the bottom-left of p1.
   - `.sp` size: 80px on mobile, 112px at 750px and up, 140px at 990px and up.
   - The bubble is hidden under 750px so the photo stays clean; on phones, tapping only salutes.
   - Put the mascot after the hero `<img>` in the DOM. The image stays the LCP.
   - Lines, rotated once and then stopped:
     - "Ten-hut! This suit turns small dogs into tiny soldiers."
     - "Plush arms up front. Your pup looks like it's standing guard."
     - "Sizes S to 2XL. Pick by weight with the size chart."
     - "Free standard shipping. Arrives in 5–7 business days."
     - "The rifle is a plush toy. Not a real or replica weapon."
     - "I salute on command. Tap me!"
2. **Home final CTA section (olive background)**
   - 120px on mobile, 160px on desktop, `data-sp-on-view="salute"`.
   - One line: "Reporting for cuteness duty!"
3. **PDP, under the trust row, never above the ATC button**
   - 64px plus the bubble, `data-sp-ctx="pdp"`, lines `["Pick a size, recruit!"]`.
   - `data-sp-say-size="Size {size} locked in. Not sure? Tap Size guide."`
   - `data-sp-say-squad="A whole squad! Your savings show in the cart."`
   - `data-sp-say-solo="One tiny soldier, coming up."`
   - `data-sp-say-added="Welcome to the squad! Mission: checkout."`
   - `data-sp-say-error="Hmm, that didn't go through. Try again?"`
   - Do not put the mascot in the sticky ATC bar. Adds from the sticky bar celebrate in the drawer instead.
4. **Cart drawer**
   - Use the peek variant inside the progress card: `<div class="sp-peek" data-sp data-sp-ctx="drawer">{% render 'pp-mascot', variant: 'peek' %}</div>`.
   - The card needs `position:relative; overflow:hidden; padding-inline-end:76px`.
   - At rest, the helmet and eyes "lurk" above the card edge. On an add, the mascot pops up, salutes and shows stars. It also pops up for a milestone (chevrons glint as a "promotion") and when protection is switched on.
   - It does not react when protection is switched off. No guilt-tripping.
   - Empty cart: full mascot at 96px, centred, with the bubble "No gear yet. Let's suit up your pup." and a "Shop the suit" button.
   - The peek is `pointer-events:none` and is never placed in the checkout footer.
5. **Treat Drill game**
   - Use `sp-peek sp-peek--corner` with `data-sp-ctx="game"` in the bottom-left of the board. The board needs `overflow:hidden`.
   - It hops on every catch, celebrates on a win and shows a sad tilt on a loss.
   - The game's own UI shows the text, so the peek has no bubble.
6. **404 page (optional extra)**
   - `{% render 'pp-mascot', size: 120, pose: 'salute' %}`
   - H1 "This page went AWOL." Body "Sergeant Pup searched everywhere. Let's get you back to base." Button "Back to the suit".

## 6. Reduced motion, accessibility and performance
- **Reduced motion:** every animation and transition is off. States show as still poses: salute and tongue for 1.8s. There is no jump, hop, stars or automatic line rotation; tapping cycles the lines. The peek appears without sliding.
- **Accessibility:**
  - The SVG is `aria-hidden`. The button has a label and a 64px or larger hit area. On keyboard focus it salutes and shows an orange `#C2410C` ring.
  - The bubble uses `aria-live="off"` while lines rotate automatically and `"polite"` for state messages.
  - Motion stops on its own after 20s idle (`is-rest`) and pauses on hover or focus. This addresses WCAG 2.2.2.
- **Performance:**
  - Only `transform` and `opacity` are animated. There is no SMIL, filter, stroke-dash or layout property animation, and no `will-change`.
  - Animations pause off-screen (IntersectionObserver adds `is-paused`) and while the tab is hidden.
  - `width`/`height` attributes mean zero layout shift. The peek variant uses 76×64 attributes; with the 80×112 attributes it renders with empty space above and below.
  - Keep it to 3 or fewer instances per page.
  - Touch screens: the hover salute only applies under `(hover:hover) and (pointer:fine)`, so it never sticks on phones.
- **Edge cases:**
  - Without JS, the SVG and idle CSS still work and the bubble shows the first line. Buying never depends on the mascot.
  - Repeated adds celebrate at most once per second.
  - The theme editor re-initialises on `shopify:section:load`.
  - Test on a real iPhone with the tab in front. Background tabs tick no animation frames.