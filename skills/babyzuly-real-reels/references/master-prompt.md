# MASTER PROMPT: BabyZuly realistic reel (Seedance 2.5 via Higgsfield)

Fill in the [BRACKETS]. Keep the order. Use plain words only (no banned words; see realism.md §4).

## A. Start frame: edit the real store photo (gpt_image_2_5, 9:16, quality high)
`image_references` = the babyzuly.com variant photo (from products.json `featured_image`).

```
Edit the reference photo. Keep the baby and the [COLOR] crochet star bodysuit EXACTLY as they are in the reference: same size, same shape, same plump wide star points, same hood, trim and pompom, same [BUTTONS/BELT/DETAILS FROM GARMENT LOCK], same pose, same baby face. Do not redraw or restyle the suit.

Replace everything around them: [SET PRESET, e.g. "the baby now lies on a plain white crinkled cotton duvet on an ordinary bed, seen from above like a phone photo a mom took standing at the bed, slightly crooked framing, extra white sheet visible above and below to fill a vertical 9:16 frame"]. Remove [ALL PROPS IN THE STORE PHOTO: gifts, fairy lights, candy cane, fluffy blanket…]. [2–3 everyday items far from the face: a corner of a plain pillow at the top edge, a phone charger cable at the top right].

Change the light to plain neutral window daylight: the white sheet looks plain white, shadows neutral grey, no warm glow, no orange, no fairy lights, no colour grading. Unedited phone photo look, mild phone noise, background in focus.
```

**Different pose** (back view, held upright, sitting with a parent's hand): add "Change only the pose to: [POSE]. The suit keeps exactly the reference proportions." Then compare it side by side with the store photo (ffmpeg hstack) and regenerate if the points got thinner or longer, or the hood got smaller.

## B. Video (seedance_2_5, omni_reference, 9:16, 480p, 4–7 s)
`start_image` = the colour-fixed frame from §A/§C. `image_references` = the store photo.

```
Unedited iPhone video, handheld, auto white balance, neutral daylight white, no color grading, no filter, background in focus, slight sensor noise, ordinary home.

The start image is the first frame; keep the bed, the light, the baby and the crochet star suit exactly as in it. The image reference shows the same suit; it is the exact product.

0 to [t1] s: [STARTING STATE, e.g. the awake baby lies on its back laughing], small natural hand wobble.
[t1] to [t2] s: [ONE EXPRESSION CHANGE, e.g. the laugh calms to a soft smile, the baby looks straight up at the camera].
At [t2] s: [ONE CAMERA MOVE, e.g. the view leans a little closer, slightly uneven].
[OPTIONAL, ONE HAND: At [t3] s an adult's bare hand with short unpolished nails, nothing in it, comes in from the [EDGE] and gently touches the [DETAIL: pompom / bell / peppermint / carrot nose] once, then leaves.]
[t4] to [END] s: [PAYOFF, e.g. the baby giggles and looks into the lens].

The suit never changes shape: [GARMENT LOCK SHORT FORM: plump wide five-point star with short rounded points, …exact details and counts…]. The bottom of the star stays one piece; hands and feet stay hidden inside the points. Face always fully visible, eyes open, nothing over the face.

Audio: only quiet room tone and soft baby [giggles/coos], no music, no voices.

Whites stay white, not warm, not golden. Not cinematic, not glossy, not a render.
```

Rules:
- One expression arc, one camera move, at most one hand.
- Never write "phone" in the action lines: it makes a hand holding a phone appear. Say "the view" or "the camera".
- Never "kick" or "leg lifts": that splits the star into legs.

## C. Local colour fix for the start frame (before upload)
Run `check_real.py frame.png`, then adjust:

| Symptom | Fix |
|---|---|
| R/B < 0.98 (cool) | `colorbalance=rs=0.02:bs=-0.02:rm=0.02:bm=-0.02:rh=0.03:bh=-0.03` |
| R/B > 1.02 (warm) | swap the signs |
| Too bright, or black point > 6 | `curves=all='0/0 0.13/0.008 0.5/0.37 0.9/0.77 1/0.90'` |

Then add `noise=alls=3:allf=u` and re-check.

Verified example (Santa test 2 start frame, all PASS):
```
ffmpeg -i start_raw.png -vf "colorbalance=rs=0.02:bs=-0.02:rm=0.02:bm=-0.02:rh=0.03:bh=-0.03,curves=all='0/0 0.13/0.008 0.5/0.37 0.9/0.77 1/0.90',noise=alls=3:allf=u" start_fixed.png
```

Light finishing grade on the finished clip (Santa test 2 → PASS):
```
ffmpeg -i v.mp4 -vf "curves=all='0/0 0.06/0.01 0.5/0.52 0.9/0.93 1/1',noise=alls=3:allf=t" -c:v libx264 -crf 16 -pix_fmt yuv420p -c:a copy v_graded.mp4
```

## D. Filled example: Starry Santa, one-clip 6 s test
- Store photo: `https://cdn.shopify.com/s/files/1/0851/4355/2236/files/santaclaus.png`
- Start frame: §A with "red crochet star bodysuit… five red buttons, black belt and yellow square buckle, white cuffs" on a white crinkled duvet, then the §C fix.
- Video: §B with the action "laughing → calms → looks up → leans closer → giggles". Leave out the hand and the leg move; see the SKILL lessons.
- Files: `<your-project>/cloudfel/tests/santa_01/`

## E. Full 3-clip reel (the cloudfel structure)
See formula.md "Reference structure":
- Clip A (hook, face hidden: the empty star (M1) or a back view (M2));
- Clip B (the reveal at ~4.5–6 s);
- Clip C (close-up payoff with eye contact + one hand on a garment detail).

Each clip is made with §A + §B. Join them in CapCut with hard cuts at about 3 s and 7 s.
