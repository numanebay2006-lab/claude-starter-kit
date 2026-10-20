---
name: babyzuly-real-reels
description: Turn a simple idea into a realistic, viral Instagram/TikTok reel for BabyZuly products (babyzuly.com Star Crochet Kit, 6 colorways) with Higgsfield Seedance 2.5. Built from a 20-agent frame-by-frame teardown of @cloudfel (19.2M-view "plush reveal" reels). Use when the user asks for a BabyZuly video, reel, TikTok, ad clip, test video, a concept from a one-line idea, or says the output looks too warm, cinematic, AI or fake.
---

# BabyZuly real-looking reels

Goal: clips that look like a mom filmed her baby on her phone, with the **exact babyzuly.com product**. The look the user does not want: warm grade, cinematic angles, glossy AI. Read `references/realism.md` before writing any prompt.

## Hard rules (never break)
1. **Product = babyzuly.com, pixel-faithful.**
   - Pull the live variant photo first: `https://babyzuly.com/products.json`; the variant's `featured_image` is the truth.
   - Build the start frame by **editing that exact photo**: keep the baby and suit, replace only the background and light.
   - **Never re-draw the suit from a text description.** Redrawing changed the proportions in test 1 (thinner points, smaller hood).
   - Garment lock text: `references/garment-locks.md`.
2. **Real, not cinematic.**
   - The LOOK block goes first in every prompt.
   - Never use the banned words (realism.md §4).
   - Start frames must pass `scripts/check_real.py` (neutral whites R/B 0.98–1.02, real blacks) **before** animating, because Seedance copies the start frame's colour.
3. **Safety.**
   - The baby is awake, eyes open, on its back or supported or held upright, face fully visible.
   - Never: face-down or prone, the hood over the face, sleeping, standing or crawling, loose bedding or pillows near the face.
4. **Honesty.**
   - It is a DIY crochet KIT: "what you'll make". Never claim it ships finished or that a pattern, hook or buttons are included.
   - Turn on the AI label. See `references/copy-rules.md`.
5. **Credits.**
   - Check `balance`, then state the cost before generating. Generate only what the user asked for.
   - Costs: Seedance 2.5 = 3 credits/s at 480p, 7 at 720p, 12 at 1080p. A GPT Image 2.5 still ≈ 0.5–3.
   - On a connector timeout, check `show_generations` and the balance before resubmitting.

## Workflow: idea → reel
1. **Expand the idea** with the 10-step method in `references/concept-library.md` Part E:
   - slots → hook mechanism → realism pass → safety pass → honesty pass → beat map → set preset → shots → text/caption/audio → score.
   - Use the winning structure in `references/formula.md`: hide the face (safe method M1–M4) → reveal at ~4.5–6 s → close-up eye contact + one hand → end on a smile.
   - Ready-made concepts: D1–D19.
2. **Product reference:** download the live variant photo, then `media_upload` → curl PUT → `media_confirm`.
3. **Start frame:** `generate_image` with `gpt_image_2_5`, 9:16, quality high.
   - Pass the store photo as `image_references`.
   - The prompt is an EDIT: "Keep the baby and the suit EXACTLY as in the reference (same size, shape, plump points, hood, trim, buttons, pose). Replace everything around them: [set preset]. Change the light to plain neutral window daylight…" (see `references/master-prompt.md` §A).
   - For a pose different from the store photo (back view, held upright, sitting), generate it, then compare it side by side with the store photo. If the proportions drifted, regenerate.
4. **Colour-check the start frame:** `python -I -X utf8 <skill>/scripts/check_real.py frame.png`.
   - If it fails, fix it locally with ffmpeg `colorbalance` + `curves` (examples in master-prompt.md §C) and re-check until it passes.
   - Then upload the fixed frame.
5. **Video:** `generate_video` with:
   - `seedance_2_5`, `mode: omni_reference`, 9:16, `resolution: 480p`, 4–7 s;
   - `start_image` = the fixed frame, `image_references` = the store photo;
   - prompt from `references/master-prompt.md` §B.
   - One action, one phone move, at most one hand.
6. **QA:**
   - Download the clip and make a frame sheet: `ffmpeg -i v.mp4 -vf "fps=2,scale=240:-2,tile=6x2" -frames:v 1 sheet.jpg`.
   - Look at it. Run check_real.py.
   - Score with realism.md §7. Auto-reject on a safety problem or garment drift.
7. **Grade** if needed (realism.md §6, CapCut recipe or the ffmpeg fallback). Re-check.
8. **Finalize** only an approved take: same params + `draft_job_id`, or regenerate at 1080p. The edit in CapCut follows `references/formula.md`: 3 clips, cuts at about 3 s and 7 s, soft music bed, at most one text line, no warm filters.

## Lessons from live tests (Oct 2026)
- **Test 1:** the suit was redrawn from a text description, so the proportions drifted. The fix is the edit-the-store-photo start frame (rule 1).
- **Test 2:** the line "mom's hand comes in… taps pompom" made a hand **holding a black phone** appear, and "leg point lifts" split the star into real legs. So:
  - Don't mention "phone" anywhere except the LOOK line; describe the hand as "an adult's bare hand, nothing in it".
  - Prefer a facial-only action (laugh → calm → look → smile) for one-clip tests.
  - If a limb moves, write "the whole bottom point of the star wiggles as one piece, the two leg points never separate".
- **Test 3, "walking" (the one that worked):**
  - Babies in this suit can't walk: the legs are fused star points and the kit fits 0–6 months.
  - Upright or carried poses (over the shoulder, held in front) made the image model turn the star into a normal onesie with sleeves. Hands-under holds looked like holding a doll and read as unsafe.
  - **What worked:** keep the store pose (lying flat on its back) and let the camera walk. Start frame = the same bed seen from the doorway about 2.5 m away (pass the approved bed frame + the store photo as references). Prompt: "walks from the doorway toward the bed… view bobs with each step… arrives and tilts down… baby giggles". Also add "No hands in the frame" and "the two bottom points never turn into legs".
  - Result: star intact, natural walk-in motion. Use this camera-moves, baby-stays-flat pattern for any "movement" idea.
- If Higgsfield suggests a preset (e.g. "IN THE DARK"), decline it with `declined_preset_id`: presets add the cinematic look.
- GPT Image stills come out slightly cool and too bright, with lifted blacks. One ffmpeg pass fixes this (master-prompt.md §C).

## Files
- `references/master-prompt.md`: fill-in master prompts (start frame, video, colour fix) plus the filled Santa example.
- `references/realism.md`: kill-the-AI-look rules, measured targets, banned words, CapCut recipe, QA score.
- `references/formula.md`: what made cloudfel go viral, anti-patterns, safe face-hiding methods, colorway ranking.
- `references/garment-locks.md`: per-colorway lock text, which photo to use, AI failure modes.
- `references/concept-library.md`: 19 ready concepts + the idea-expansion method.
- `references/copy-rules.md`: caption honesty and safety copy.
- `scripts/check_real.py`: colour realism checker (calibrated: cloudfel top reels PASS, warm AI stills FAIL).
- Source research: `<your-project>/cloudfel/` (14 per-reel ANALYSIS.md files, agents/15–20 reports, test renders in tests/).
