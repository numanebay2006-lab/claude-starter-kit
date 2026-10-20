# REALISM: kill the AI look (warm grade, cinematic angles, glossy skin)

The user's #1 complaint: Higgsfield/Seedance keeps making warm colours, "photographer" camera angles and glossy footage. The target is **normal, real footage, the kind a mom shoots on her phone.** This file is the fix. It overrides any other style guidance.

## 1. The measured truth: real-looking ≠ warm

@cloudfel (14 reels; the top one has 19.2M views) was measured pixel by pixel:

| Metric | Cloudfel top 3 | Our old AI still (start_v1) | Meaning |
|---|---|---|---|
| White duvet R/B | **0.985–1.00** (≈ 6500 K, neutral) | 1.055 (≈ 6050 K, warm) | Warm cast = AI tell |
| White duvet brightness Y | 181–188 | 205 | AI whites run too hot |
| Black point (1st percentile Y) | **1–4** | 17.9 | Lifted, milky blacks = the "cinematic fade" |
| Shaded white sheet RGB | 146/146/145 | n/a | Shadows are grey, not orange |
| Sun-stripe RGB | 239/233/230 | n/a | Even the sunlight is only faintly warm |
| Saturation (SATAVG) | 7–9 | n/a | Muted, true-to-life colour |

The warm cloudfel reels (golden-hour / fall nook, R/B 1.06–1.08) are their **weakest** performers. The "warmth" in the winners comes from the brown costume, never from the light.

**Seedance copies the colour of the start image.** A warm, glossy start still always produces a warm, glossy video. Fix the still first.

`scripts/check_real.py` measures any still or clip against these targets and prints PASS/FAIL with the CapCut fix.

## 2. Why the models drift warm and cinematic

1. The image and video models are tuned on "beautiful" data (stock footage, ads, film stills). With no constraint, they default to golden light, teal-orange, bokeh and centred subjects.
2. Light words like "morning sun", "sunlight streaming" and "warm light" pull toward 3000–4000 K amber.
3. Mood and quality words ("cinematic", "cozy", "magical", "4K", "beautiful") pull toward commercial polish.
4. Lens words ("50mm", "85mm", "bokeh", "shallow depth of field") describe a photographer's camera, not a phone.
5. Camera words ("dolly", "orbit", "push-in", "gimbal", "tracking") describe a cinema rig, not a hand.
6. **AI start stills** (biggest cause) are warm and glossy, and Seedance amplifies them. The 600×600 BabyZuly product photos are AI and warm too, so they are **garment references only**.
7. Lit lamps or fairy lights in frame make the model warm the whole scene.
8. Centred, symmetric "hero" compositions read as a tripod or catalogue.
9. Long, flowery prompts read as an ad brief. Short, plain, slightly ugly prompts read as a phone clip.

## 3. Copy-paste blocks (put LOOK first in every prompt, still and video)

**LOOK**
```
Raw iPhone video a mom took on her phone, unedited, no filter, no colour grading. Neutral daylight white balance: the white sheets look plain white, shadows are neutral grey, not orange or cream. Plain window daylight. Phone auto-exposure, true dark shadows, whites bright but not blown. Normal phone wide lens, background mostly in focus. Mild phone sharpening, a little noise in the shadows, muted true-to-life colours.
```

**CAMERA**: pick one per clip:
- *Standing over*: "phone held by mom standing at the bed, looking down at about 45–60 degrees, slightly crooked, baby a bit off-centre, some empty sheet on one side, small hand wobble"
- *Sitting at the edge*: "mom sits on the bed edge, phone at her chest height angled slightly down, small hand wobble"
- *Low on the bed* (cloudfel close-up): "phone resting low near the mattress about 30–40 cm from the baby, casual and a little crooked, small breathing wobble"
- *POV / selfie / walking behind / phone propped on furniture*, as in concept-library C5.
- To get closer: "mom leans in a bit closer with the phone, slightly uneven". **Never** use "push-in", "dolly" or "orbit".

**LIGHT**: default, then fallback:
- Default (cloudfel streak, without the gold): "one patch of direct daylight from a window on the left falls across the white duvet as a bright, almost pure-white stripe; the rest of the bed is in neutral grey-white shade; no lamps switched on"
- Fallback, if the result is still warm after one retry: "bright overcast daylight from a big window, even and slightly cool, no direct sun"
- Night: "dim living room filmed on a phone, visible grain, one table lamp blown to white, mixed orange lamp and blue TV light, tree bulbs as small blown dots, tree cut off by the frame edge". It must look like a Tuesday-night clip, not a Christmas card.

**SKIN**
```
Real baby skin: slightly blotchy pink cheeks, faint redness around nose and lips, fine peach fuzz, uneven tone, a little drool shine on the lower lip. Normal-size baby eyes, short sparse lashes, not glassy. No retouching, no smoothing, no beauty filter.
```

**ROOM**
```
Ordinary lived-in bedroom: rumpled white crinkled cotton muslin duvet with fine wrinkle lines, plain wall, simple upholstered headboard, a phone charger cable and a water glass on the nightstand, a folded burp cloth at the bed edge. Pillows pushed up at the headboard, far from the baby.
```

**END LINE**
```
No colour grading, no beauty filter, no text.
```
(Do not list the banned words as negatives. Naming them primes them.)

## 4. Never write these words (in stills or videos)

- **Grade:** golden, golden hour, warm, warm tones, amber, honey, glow, glowing, sun-kissed, sunrays, god rays, volumetric, haze, dreamy, cozy, filmic, film look, Portra, teal-orange, moody, HDR
- **Polish:** cinematic, editorial, commercial, ad, product shot, hero shot, photoshoot, professional, studio, luxury, premium, aesthetic, beautiful, stunning, perfect, flawless, magical, adorable, angelic, masterpiece, 4K, 8K, ultra-detailed, hyperrealistic
- **Lens:** 35/50/85 mm, portrait lens, f/1.x, bokeh, shallow depth of field, creamy background, rim light, backlit, lens flare, symmetrical, centred, rule of thirds
- **Camera:** dolly, push-in, orbit, arc shot, crane, tracking, gimbal, steadicam, slow motion, smooth, sweeping, rack focus
- **Skin:** smooth skin, porcelain, flawless, glowing skin, big sparkling eyes, long lashes, doll-like

## 5. Motion rules (real-baby physics)

- One pose, one phone move, one action, at most one adult hand per clip.
- Movements are small, slow and slightly jerky like a real infant, with pauses between them.
- Name the cause and its effect: "mom's finger taps the pom-pom, the baby grins".
- The garment moves as whole points: "the right arm point lifts and flops down", never "waves hand" (that sprouts fingers).
- The duvet dimples where the baby presses, and the creases stay put.
- No pose changes inside a clip (no sit → lie, no crawl).
- Audio: `generate_audio: false`, or "only quiet room tone, one small baby coo, no music".

## 6. CapCut "de-AI" grade (measured recipe; verify afterwards)

Go to Adjust → Basic. These are starting values for a warm, glossy Seedance clip:

| Slider | Value | Why |
|---|---|---|
| Temp | **−10** (−8 to −15) | Bring the white duvet to R = B |
| Tint | +3 (toward magenta) | AI whites run green-yellow; go back to 0 if the result looks pink |
| **Blacks** (or Shadows) | **−15** | Kills the milky lifted blacks, the #1 "cinematic" tell |
| Fade | 0 | Fade is what lifts the blacks |
| Contrast | +8 | Real phone contrast |
| Highlights / Whites | −10 / −5 | Bring texture back into the duvet |
| Exposure | 0 (+3 only if the duvet reads dark) | AI is usually already too bright |
| Saturation | −5 | |
| Brilliance / Clarity | 0 | These add the glossy HDR look |
| Vignette | 0 | |
| Sharpen | 0–8 | Phone footage on Instagram is soft |
| Grain | 8–12 | Breaks the plastic smoothness |
| Filters / LUTs | **none** | Any "warm" or "film" preset brings the problem back |

Batch fallback (ffmpeg):
```
ffmpeg -i in.mp4 -vf "colorbalance=rs=-0.03:bs=0.03:rm=-0.04:bm=0.04:rh=-0.03:bh=0.03,eq=contrast=1.06:saturation=0.94:gamma=0.98,curves=all='0/0 0.07/0.015 0.5/0.49 0.85/0.80 1/0.96',noise=alls=4:allf=t" -c:v libx264 -crf 16 -pix_fmt yuv420p out.mp4
```

**A grade fixes colour only.** It cannot fix a glossy, centred, bokeh "photographer" frame. If the framing looks staged, regenerate the start still.

Then run: `python -I -X utf8 <skill>/scripts/check_real.py out.mp4`

## 7. Realism QA (score 0–10; ship at 8 or above, regenerate at 6 or below; ★ = auto-reject)

| # | Check |
|---|---|
| 1★ | Safety: awake, on its back or supported/held upright, whole face visible, nothing over or near the face |
| 2★ | Garment identical in the first, middle and last frames: point count 5, button count, buckle colour, stitches still visible bumps (not fleece) |
| 3 | check_real.py: white R/B 0.98–1.02 |
| 4 | check_real.py: black point ≤ 6, whites not blown, saturation OK |
| 5 | Phone optics: wide lens, background recognisable, no creamy bokeh, no flare |
| 6 | Casual camera: hand wobble, off-centre or slightly tilted, no smooth glide |
| 7 | Skin and eyes: blotchy, natural, not waxy; eyes normal-size |
| 8 | Texture: duvet crinkle lines and dimples; slight noise in the shadows |
| 9 | Continuity: no pose teleport, no props popping in, no extra fingers on the adult hand |
| 10 | Behaviour: motions small and infant-plausible; no text artifacts |

**What a score means:**
- 9–10: reads as a mom's phone clip.
- 7–8: fix with the CapCut grade.
- 5–6: the start still is wrong; regenerate it.
- ≤ 4: rewrite the prompt.
