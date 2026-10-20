---
name: "seedance-realistic-baby-reels"
description: "Write prompts and run Seedance 2.5 on Higgsfield so baby-clothing Reels look like real phone footage, not AI. Use for any Baby Zuly video or when a clip looks AI."
---

# Seedance 2.5 — realistic baby-clothing Reels

Goal: clips that pass as real iPhone footage of a baby in the product. The model is never the problem; the **start frame, the prompt vocabulary, and how much you ask the baby to do** are.

## 0. The three laws (read before every prompt)

1. **Start from a real photo.** `omni_reference` with a real supplier/phone photo as `start_image`. Text-to-video, or a start frame that was itself AI-generated, produces the "Christmas card" render every time. If no real photo exists, first generate a *phone-photo-style* still (section 5), review it, then animate it.
2. **Ugly words make real footage.** Never write: cinematic, beautiful, cozy, warm glow, magical, high quality, professional, 8K, hyperrealistic, stunning, dreamy, soft lighting, perfect. Always write: shot on iPhone, handheld, phone video, overcast window light, blown-out window, hard shadow, slightly messy, unedited, no grade.
3. **One pose. One camera move. One expression change. One hand.** Four seconds of a baby doing almost nothing beats ten seconds of a baby "dancing". Every extra action is where buttons move and belts change color.

## 1. Verified Seedance 2.5 settings (Higgsfield MCP, checked Oct 2026)

| Setting | Value | Why |
|---|---|---|
| `model` | `seedance_2_5` | |
| `mode` | `omni_reference` | accepts `start_image`, `end_image`, `image_references`, `video_references`, `audio_references` |
| `aspect_ratio` | `9:16` | Reels / TikTok |
| `duration` | 4–7 s (model allows 4–30) | drift grows with length; competitors cut every 2–3 s |
| `resolution` + `draft` | `480p`, `draft: true` first | ~3 credits/sec. Review, then finalize |
| finalize | same job: `draft_job_id`, `resolution: 1080p`, `bitrate_mode: high` | within 7 days; same video upscaled, not a re-roll (~12 credits/sec) |
| `generate_audio` | `true` | natural room tone + coo; replace with trending audio in CapCut anyway |
| frame rate | export 30 fps for the final | 60 fps is fine too; not a tell by itself |

Cost rule: **always preflight with `get_cost: true` and state the credits before generating.** Never spend credits unasked. 4 s draft ≈ 12, 5 s ≈ 15, 7 s ≈ 21; 1080p final ≈ 4× the draft.

Reference roles: product photos → `image_references`; a competitor clip for camera/pose transfer → `video_references` (risk: it can pull the competitor's garment colors — if the draft shows their outfit, re-run without it).

## 2. Workflow (do it in this order)

1. **Collect the real photo.** Best: supplier photo of a real baby in the garment. OK: the garment laid on your own bed, shot with your phone. Last resort: section 5.
2. **Upload**: `media_upload` → curl PUT → `media_confirm` → get `media_id`.
3. **Write the prompt** with the template for the pose (section 3). Fill `[OUTFIT]` from the photo: exact colors, closure type, trim, character details (snowman face / star / buttons). Never describe the garment from imagination.
4. **Self-review the prompt** against the checklist (section 6).
5. **Quote**: `generate_video` with `get_cost: true`. Tell the user the credits. Wait for yes.
6. **Draft** at 480p. Show it. Check: first frame identical to photo? garment unchanged at 2 s, 4 s, end? baby anatomy sane? expression changes once? no extra hands?
7. **Finalize** only the approved take (`draft_job_id`, 1080p, high bitrate).
8. **Post**: hook text static in top third, added in CapCut (not generated). Caption with a comment keyword for auto-DM.

## 3. Pose templates (copy, fill `[OUTFIT]`, keep the structure)

All templates assume `start_image` is a real photo, so the prompt **keeps** the photo rather than describing a new scene.

### A. Flat-lay reveal (no baby) · 4 s — the zero-risk opener
```
Shot on iPhone, handheld phone video. Keep the garment, the bed and the light exactly as in the photo: the [OUTFIT] lies flat, face-down, hood at top, feet at bottom. Hard window sunlight from the upper left throws a sharp shadow of the hood across the fabric. The camera slowly pushes in by about fifteen percent over the clip with a small natural hand wobble. The shadow edge creeps a little. Nothing else moves. No people. Unedited phone colors.
```

### B. Baby on back, parent's hands · 5 s — for sack / cocoon style garments
```
Shot on iPhone, handheld phone video, camera held above the baby. Keep the baby, the [OUTFIT], the blanket and the light exactly as in the photo. The baby lies on its back and looks up at the camera with a calm face. After two seconds it gives a small smile and kicks one leg once under the fabric, so the lower part of the garment shifts slightly. The head turns a little to one side and back. In the last second a parent's hand enters from the right edge and gently touches the baby's cheek. The camera sways slightly, no zoom. Overcast window daylight, unchanged. Garment colors, trim and details stay identical to the photo.
```

### C. Sitting, supported · 5 s — baby propped against a cushion or parent's leg
```
Shot on iPhone, handheld phone video, slightly above the baby's eye level. Keep the baby, the [OUTFIT], the sofa and the light exactly as in the photo. The baby sits propped against the cushion, hood up, hands resting on the garment. It looks slightly to the left, then turns to the camera and blinks, then gives a small open-mouth smile. The body does not move. In the last second and a half a parent's hand enters from the left and straightens the hood. The camera drifts a little closer with a natural hand wobble. Window daylight, unchanged. Garment details identical to the photo.
```

### D. Held upright on the shoulder · 5 s — safe "standing" look
```
Shot on iPhone, handheld phone video. Keep the parent, the baby, the [OUTFIT] and the room exactly as in the photo. The parent, seen from behind and out of focus, holds the baby upright against the shoulder; the baby faces the camera over the shoulder with the hood up, the back of the garment fully visible. The parent takes one slow step to the left. The baby looks at the camera, blinks, and gives a small smile. The camera follows at walking pace with a natural hand wobble. Light does not change. Garment details identical to the photo.
```

### E. On all fours, push-in + hand · 7 s — ONLY for onesies with real arms and legs (not sacks)
```
Shot on iPhone, handheld phone video, camera resting at mattress height. Keep the baby, the [OUTFIT], the bedroom and the daylight exactly as in the photo. The baby stays on all fours, hood up, facing the camera. For the first second it looks slightly down, then lifts its head and breaks into a wide open-mouth smile. The camera slowly pushes in toward the face over the whole clip with a small hand wobble. In the last two seconds a parent's hand enters from the right and touches the cheek; the baby laughs. The baby does not crawl or change pose. Unedited phone colors.
```

### F. Night by the tree · 5 s — brand rule: Christmas scenes at night with snow
```
Shot on iPhone, handheld phone video, night. Keep the baby, the [OUTFIT] and the room exactly as in the photo. A single warm lamp lights the baby's face from the front-left; the Christmas tree lights behind are small and out of focus; snow falls past a dark window at the edge of frame. The baby [one action from B/C/D]. The camera drifts a little with a natural hand wobble. Garment details identical to the photo.
```
(Night still needs the "boring room" rule: tree at the edge, not centered; no gift piles; a sofa, a remote, a folded blanket.)

## 4. Worked rewrites (bad → good) from real prompts

### Example 1 — the "dancing Santa star" prompt
**Before (produced a plush-toy render):**
> Animate the baby naturally while keeping the exact same star-shaped Santa Claus outfit, sitting position, camera angle, face, background, Christmas tree, and wrapped presents unchanged. The baby looks extremely happy and excited, gently giggling and smiling throughout the video. Since the baby is inside a star-shaped outfit with no visible hands, make the arms and star-shaped side sections move playfully from side to side, as if the baby is happily dancing in place. The baby slightly wiggles its body, gently bounces with excitement, moves its legs subtly, and makes cute joyful movements. Add natural baby laughter and cheerful facial expressions. Keep the movement soft, adorable, realistic, and spontaneous. The camera remains fixed with no zoom or camera movement. Warm Christmas atmosphere, cozy lighting, realistic baby motion, high-quality cinematic video.

What went wrong, line by line:
- start frame was an AI image with gifts in every corner → render look locked in before motion
- "smiling throughout" → one frozen laugh for 10 s
- "star sections move side to side, dancing" → asked fabric to dance = puppet wobble
- "wiggles, bounces, moves legs, joyful movements" → five motions, buttons/belt drift
- "camera remains fixed" → reads as a photo with jitter
- "warm, cozy, cinematic, high-quality" → the glow

**After (template B):**
> Shot on iPhone, handheld phone video, camera held above the baby. Keep the baby, the red crochet star Santa romper with white trim, red buttons and black belt, the sofa and the light exactly as in the photo. The baby lies back against the cushion and looks at the camera with a calm face. After two seconds it gives a small smile and kicks one leg once under the fabric, so the star point shifts slightly. The head turns a little to one side and back. In the last second a parent's hand enters from the right and touches the cheek. The camera sways slightly, no zoom. Overcast window daylight, unchanged. Buttons, belt and stitch pattern stay identical to the photo.

Settings: omni_reference, start_image = supplier photo, 5 s, 480p draft.

### Example 2 — the "Christmas tree romper under the tree" clip
**Before (symptoms):** warm golden grade, bokeh fairy lights, fluffy rug, baby laughing open-mouth for the last 5 s, belt buckle changing gold→brown→gold, buttons changing count, star points stiff like a pillow, push-in + hand (the only good parts).

**After:** keep the push-in and the hand, change everything else:
> Shot on iPhone, handheld phone video, camera above the baby. Keep the baby, the green crochet tree romper with white trim, red buttons, gold belt and star on the hood, the quilt and the light exactly as in the photo. Flat overcast daylight from a window on the left; the small tree is out of focus at the top edge. The baby lies on its back looking up, calm, then after two seconds breaks into a small smile and lifts one arm under the fabric. The camera pushes in slowly with a hand wobble. In the last two seconds a parent's hand enters from the right and strokes the cheek; the baby laughs briefly. Buttons, belt and star stay identical to the photo.

### Example 3 — why a competitor's "real" clip works (train / nursing pillow)
Observed: boring location (train, bags on the rack, a stranger behind), flat grey window light, desaturated colors, tiny motions (eyes close, smile, one hand adjusts a strap), cuts every 2–3 s. It is AI (the woman and baby are cloned in the background), but the first frame looks like a phone photo, so the video does. Copy the **choices**, not the scene.

### Example 4 — why a competitor's turtle-onesie clip works
Shot 1 (3 s): garment flat on a bed, hard sun, slow push-in, no baby. Shot 2 (7 s): one pose on all fours, slow push-in, expression neutral→grin, hand enters at the end. "Best Mom" pillow, map, folded flag = real-home clutter. The baby never crawls.

## 5. When there is no real photo: generate a phone-style still first

Image model (e.g. `gpt_image_2_5` or `soul_2` on Higgsfield), 9:16. Review the still before animating; regenerate until it looks like a photo someone's sister took.
```
iPhone photo, not a studio shot. A baby in the [OUTFIT] lying on a beige sofa in an ordinary living room. Overcast daylight from a window on the left, slightly blown-out window, flat colors, no grade. A phone charger cable, a folded blanket and a remote on the sofa. A small Christmas tree out of focus at the edge of frame. Real skin texture with slight redness on the cheeks, fine hair. Garment matches the reference photo exactly: colors, trim, buttons, character details. Unedited, slightly soft.
```
Pass the product photo as an image reference so the garment stays exact. Then use the still as `start_image` in Seedance.

## 6. Review checklist (run on every prompt and every draft)

Prompt:
- [ ] `start_image` is a real photo or an approved phone-style still — never a glossy render
- [ ] Zero banned words (cinematic, cozy, warm glow, beautiful, high quality, professional, 8K, hyperrealistic, dreamy, soft lighting, perfect)
- [ ] Phone words present (shot on iPhone, handheld, phone video, unedited)
- [ ] Exactly one pose, one camera move, one expression change, at most one hand
- [ ] Baby action is age-appropriate: sack/cocoon garments = on back or held; onesies = all fours / supported sit; no unsupported sitting or standing
- [ ] Garment described from the photo, with "stays identical to the photo"
- [ ] Light described as a flaw (overcast, blown-out, hard shadow), and "does not change"
- [ ] Room is boring: one non-theme object named (cable, remote, laundry); decorations at the edge, not centered
- [ ] 4–7 s

Draft:
- [ ] Frame 1 matches the photo
- [ ] Garment identical at 0 s / 2 s / 4 s / end (buttons count, belt color, trim)
- [ ] Hands: correct number, five fingers, enter from one edge
- [ ] Expression changes once, not held
- [ ] No cloned people or duplicate babies in the background
- [ ] Camera drifts; nothing "swims"

## 7. Hooks and captions (added in the editor, not generated)
- "DO NOT let a new mom see this 😱🥺⛄"
- "Every pregnant mom NEEDS this.. 😄💕"
- "POV: baby's first Christmas outfit arrived 🎄"
- Caption: "Comment SNOW for the link ⛄" (keyword → auto-DM)