# Field Lessons

What we learned building DTC e-commerce brands with Claude Code: Shopify stores,
Meta ads, AI image and video creative. Every rule here came from a real mistake that cost
time, money or a rejected deliverable. Business numbers, accounts and client details
have been removed. Only the reusable lessons are left.

---

## 1. Working with Claude (process)

- **Validate the concept on one cheap artifact before building a pipeline.** Show one
  still, one 5-second clip or one screenshot to the decision-maker first. We once spent
  about 300 video credits across three sessions on a claymation direction that the
  owner killed with one line: "can we do normal ads?"
- **Freeze the rules before you generate.** A quarter of one video budget was wasted
  because rules (no AI humans, which hook variants were needed) arrived *after* the
  renders. Settle the rule set, the shot list (after voice timing) and the method first,
  run review agents on the script, *then* spend credits.
- **Check what already exists before making anything new.** A brief that says
  "generate 5 images" is a guess about what's missing, not a fact. Three of the five
  shots already existed as real product mockups. Unused clips on disk fixed another
  problem.
- **Get approval on one frame before a full build.** People judge by eye, not by
  description. Deliver 2–3 visual variants as screenshots and let them pick.
- **When the owner decides something, write it down once and stop raising it.**
  Bringing a settled decision back up reads as pressure.
- **Don't thrash.** Changing the same copy four times in one afternoon is worse than
  waiting for the research that's on its way.
- **Briefs to another session or agent need restraint, not only content.** Cap the
  number of elements ("net +1 slim element"), name the brand tokens, ban default-UI
  looks, and require screenshot variants. Without that you get "looks like a form,
  not a brand."
- **"Done" from another session is not evidence.** Frame-sample every generated clip at
  0/25/50/75/100% yourself before it goes anywhere final.

## 2. Copywriting

- **Say what the product is.** "Sleep strips for comfortable nights" beats
  "Dissolvable oral strips for the nights the day keeps replaying." Treat a moody,
  atmospheric line as a bug.
- **The museum test:** one guide walks you past every painting until you're too tired to
  care about the Mona Lisa. The other takes you straight to it. Be the second guide.
- Compliance almost never *requires* vagueness. Reach for the blunt, true line first.
- Avoid overusing em dashes in customer-facing copy. Use short sentences and periods.
- **Headlines name a pain.** Tag every ad with the pain it targets, so you can count
  your coverage. We found 6 of 11 ads aimed at the same pain.
- **Make meaning a pass condition.** If you only check against a list of what's banned,
  you end up with ads that break no rules and give nobody a reason to buy.
- **Imperatives:** safe when they *invite* ("Turn the day off."), risky when they
  *presuppose* the reader's state ("Stop doing sleep math").
- **A borrowed pain can attack your own catalogue.** Check every customer-research line
  against your own products before using it.
- **Tick rows must be phrased positively.** A tick beside "Sugar" reads as *has sugar*.
  Write "No sugar".

## 3. AI image and video creative

- **Nothing text-shaped comes from an image model.** Models garble label text about half
  the time ("30 Guminies", "NON-OMO"). Generate the *scene* with AI, then draw the type,
  product cutouts, ticks and arrows in code on top.
- **Words fix a category; only a reference image fixes an instance.** If the same
  character or product must appear across shots, pass a reference image for each one,
  plus "this exact X … it is NOT a Y". Check every output against the reference.
- **Naming a material imports its whole shape.** "Film" gave the strip sprocket holes;
  "amber gelatin" gave a cube. Describe geometry ("paper-thin, flat, square,
  translucent") and rule out the lookalikes ("not a cube, no holes").
- **No AI-generated humans in paid social, and that includes hands, mouths and tongues.**
  Audit every generated asset for body parts *and* garbled labels at full size. Both
  defects are invisible in a thumbnail.
- **Image-to-video redraws the label on every frame.** Generate a base with no product
  label and a static camera, then composite the real product photo in post.
- **Format names are not templates.** Many AI "formats" have a proof slot they fill with
  invented statistics. Look at the preview art, not the name.
- **Never burn prices into artwork.** Put offers in the ad platform's headline and
  description fields. Prices change; JPEGs don't.
- **Nothing covers the product.** No type, chip or leader line crosses the label. If it
  doesn't fit, make the product smaller.
- **Cutout padding is a measurement trap.** A cutout with 34% transparent padding makes
  every size spec read about 1.5× too small. When migrating, scale the width *and* adjust y.
- **A repair is not always a regeneration.** Two wrong letters can be fixed by editing
  pixels and sampling the glyph colour. Apply all fixes in one encode pass.
- **Re-lighting a pasted label:** apply the lighting gain *per colour channel*, not as
  one brightness value, or the patch looks cold under warm light.
- For a DTC product ad, **real product photos plus code-driven motion** take hours, cost
  no credits, and are where a small brand should start. Real phone footage beats all of it.

## 4. Video editing (ffmpeg, TTS)

- **Time the voice first, then size the clips.** TTS runs about 40% longer than brief
  row lengths. Budget about 1.6 s per 10 words.
- Run `ffmpeg -af volumedetect` on every TTS take. A max below −50 dB means the take is
  empty (it happens with lines that start with an ellipsis).
- `atempo → adelay → atrim` silently drops the delay. Add `asetpts=N/SR/TB` after every
  `adelay`. Measure where the voice actually lands, not just loudness.
- One-pass `loudnorm` lands 0.6–1.3 LU under target. Use a measure-then-adjust second pass.
- `framemd5` with `-c copy` hashes packets, not pixels.
- libass on Windows: use forward slashes in paths and `ass=file.ass:fontsdir=...`.
- 9:16 and 1:1 crops don't share a caption line. Work out the caption position from the
  layout instead of hard-coding it.
- **The speaker is always on screen** with their mouth moving, and captions match the
  spoken words.

## 5. Automated checks ("guards")

- **A check that cannot fail is worse than no check.** A kill-list regex had its `\b`
  collapsed into a backspace byte by a shell heredoc, so it matched nothing and reported
  every file clean.
- Every guard runs against a **known-bad fixture** as well as a known-good one. The
  build fails if the guard accepts the bad one. Prove the self-test works by turning off
  each guard in turn.
- A fixture never spells the banned word. Reference it indirectly, or the test itself
  breaks the rule it checks for.
- **A guard that reads a record is only as complete as the recording.** List *every*
  code path that can produce the thing it inspects.
- **Truncation is never the answer to "doesn't fit"; a smaller size is.** Check that
  every approved word actually reached the canvas.

## 6. Shopify gotchas

- **Preview cookies lie.** Your browser may show a preview theme on the live domain.
  Check the asset path (theme id) to see which theme is actually rendering.
- An anonymous fetch of `?preview_theme_id=` silently serves the **live** theme. Verify
  previews with an admin session, or pull the files back off the theme.
- **Liquid doesn't hoist.** An `{% assign %}` below the loop that uses it produces
  nothing, silently.
- **Push order:** push the section (which declares the setting in its schema) before the
  template that uses it, or Shopify drops the setting silently.
- Pull a fresh copy before every edit; never edit a stale local file. Replace blocks with
  start/end marker slices, not `.replace()`. Pull back and verify after each push.
  An `npx` CLI push can exit 0 and upload nothing.
- Don't blindly delete what's after `{% endschema %}`; it can hold critical layout CSS.
- Dawn hides every empty `<div>` (`div:empty { display:none }`).
- Selling plan groups are owned by the app that made them. Third-party API reads see an
  empty list. Verify subscriptions with `cart/add.js` and a `selling_plan`.
- `customersCount(query:)` **ignores its filter.** Never size an email audience with it.
- Checkout text overrides can live as *market-scoped* translations. Query with `marketId`.
- A burst of curl cart calls trips a bot challenge (HTML "Verifying your connection" with
  HTTP 200). Check every response for it before trusting a negative result.
- A discount code's *name* is not its *value*: "SAVE20" may be 15%. Query it. Never trust
  a computed price, only a charged one.

## 7. Front-end and browser-testing traps

- **A hidden/background browser tab ticks no animation frames.** Transitions, smooth
  scrolls, `Image.decode()` and WAAPI `animation.finished` never settle there. Front the
  tab or screenshot it before measuring. The Claude browser pane reads 0×0 while hidden.
- Static HTML checks are not enough for anything interactive. Drive a real browser.
- CSS `scroll-behavior: smooth` turns programmatic `scrollLeft=` into a no-op in Chrome.
- A replaced element ignores `aspect-ratio` when its height isn't `auto`.
- The `hidden` attribute loses to any author `display` rule. Add `.x[hidden]{display:none}`.
- `loading="lazy"` inside a `display:none` panel may never load.
- CSS custom properties inherit *down* the tree, not *across* sibling sections.
- Two `!important` rules: the later one wins. Editing the first changes nothing.
- When you change an element's `position`, check its `::before` and `::after`. Absolute
  pseudo-elements escape a host that is no longer positioned.
- An infinite animation on a non-compositor property (like `mask-position`) keeps the
  main thread busy forever. Animate `transform` instead. Use `document.getAnimations()`
  to find the culprit.
- iOS Safari ignores `body { overflow-x:hidden }` for the viewport. Test horizontal
  motion on a real iPhone.
- Rasterising SVG text through `sharp` silently swaps fonts. Convert text to paths first.

## 8. Paid ads measurement (Meta + Shopify)

- **Shopify sessions are the source of truth for visitors, carts and checkouts.** Meta's
  landing-page-view under-reports by a factor that changes from 2.6× to 9×. Never apply a
  fixed correction; pull Shopify each time.
- "Direct" traffic on a new store is *you* (owner, testers). Don't compare paid ads to it.
  Segment by country to remove your own visits.
- **An API error is not evidence that a number is unavailable.** Retry metrics at every
  decision point instead of quoting an old figure.
- Small samples prove nothing about a page: 26 sessions and 1 cart is normal.
- Never compare cost or purchase rates across different optimization events (ATC vs
  Purchase). CPM varies up to 90× between them.
- Turn off Audience Network and Advantage+ Audience age expansion, and set age max 64,
  or spend drifts to 65+ at very high CPMs.
- Small "trickle" budgets can't produce a readable result. Short concentrated bursts on
  one CBO campaign work better.
- Video UGC (real people on camera, product in hand) out-converted everything else.
- Meta's `date_preset: "today"` can fail. Use an explicit `time_range`.

## 9. Files and tooling

- **Write files atomically** (temp file + `os.replace`). Concurrent sessions reading a
  file mid-write see it empty (a "torn write"). Commit new folders early so you have a
  restore point.
- Shell heredocs can mangle backslashes (`\b`, `\an5`). Write backslash-heavy code with
  the Write/Edit tools and check with `cat -A`.
- PIL's `Image.fromarray` can share a read-only buffer. Call `.copy()` before `floodfill`.
- Pass API keys inline as environment variables for one command. Never write them to
  files, logs or messages.
