# Garment locks: one per colorway (from agent 15, product-fidelity teardown)

Real product photos live in <your-project>/images/user/ (garment references only, NEVER as start_image or style reference: they are warm, staged, 600x600). Studio flat-lays (2048px) in <your-project>/images/bz-studio-*.png.

## 0. Reality check: read this before using any photo

1. **Every product photo is AI-generated, including the ones in the "real" folder.** None of the 12 files in `images/user/` is a camera photo. The tells: identical open-mouth laughing babies with waxy skin, fairy-light bokeh, perfectly placed props (cookies, cocoa, a toy train), and square 600×600 files.
   - These images are still the **canonical product spec**, because the live store sells against them. Treat them as the spec, not as realism references.
2. **Resolution.** The hero files are only **600×600 and square**. A 9:16 crop of 600 px gives a frame about 338×600, which is below Seedance's 480×854 draft. Using a hero file directly as `start_image` will therefore look soft and upscaled.
   - The `bz-studio-*` flat-lays are 2048×2048 and crisp, which makes them excellent detail references.
3. **The photos disagree with each other.** Lock everything to the **variant hero photo**, which is what the buyer clicks. Never mix references from different images inside one generation.

| Colorway | Hero (LOCK) | Conflicting images (do NOT pass together with hero) |
|---|---|---|
| Santa | `santaclaus.png`: **5 red** 4-hole buttons in a line *beside* the white strip | `bz-studio-santa`: 4 red buttons *on* the strip. `handmade.png` / `all_*.png` / `all2.png`: **brown wooden** buttons. |
| Elf | `elf_…png`: 5 red buttons, **solid red** floppy hood tip + gold bell, **one** striped leg | `bz-studio-elf`: red/white **striped** hood tip, **both** legs striped. `all2.png`: whole legs striped, brown buttons, zig-zag collar. |
| Tree | `christmastree.png`: 5 red buttons, gold belt, gold zig-zag garlands, red + gold dots, gold star tip | `all2.png` tree is a different design (concentric swirl garland, brown feet, no belt). Do not use it. |
| Gingerbread | `ginger_…png` | `bz-studio-gingerbread` matches well and is the best detail reference. |
| Snowman | `snowman_4406…png`: **4** black buttons | `smowman_2.png` (sitting) shows **3** buttons. `bz-studio-snowman` shows 4 and matches the hero. |
| Pink | `star_a753…png`: 2 ring buttons, green legs, purple puff dots | `bz-studio-pink.png` is **ALL PINK with no green legs**, so it is wrong for this variant; never use it. `patrick_2.png` has 3 buttons, a pompom and flower motifs, so it conflicts too. `1.png` (flat in a basket) matches the hero except that its motifs are purple *stars*. |

---

## (a) GARMENT LOCK blocks (copy-paste; each is 60–90 words)

Paste the block verbatim into every Seedance prompt for that colorway. The wording is matched to the **hero photo**, because the hero is what you pass as the reference.

### Starry Santa (`santaclaus.png`)
```
Hand-crocheted five-point star bodysuit in deep Santa red yarn, chunky matte single-crochet bumps in countable rows, real yarn not fleece. Bumpy white bobble-yarn trim circles the hood opening and runs straight down the center front. One white yarn pompom on the hood tip. Exactly five round red buttons in one line beside the white strip. One black belt with a matte mustard-yellow crocheted square buckle, black center. White bobble cuffs on all four points; colors, trims, buttons and shape stay identical to the reference photo
```

### Christmas Elf Star (`elf_5fa6be22-….png`)
```
Hand-crocheted five-point star bodysuit in emerald green yarn, chunky matte single-crochet bumps, real yarn not fleece. Red bobble trim circles the hood opening; long floppy solid-red hood tip ending in one small gold jingle bell. Red-and-white striped collar band. Red strip down the center front with exactly five round red buttons beside it. One black belt, matte mustard-yellow crocheted square buckle. Red edging on both arm points; one leg point red-and-white striped; colors, trims, buttons and shape stay identical to the reference photo
```

### Christmas Tree (`christmastree.png`)
```
Hand-crocheted five-point star bodysuit in deep pine-green yarn, chunky matte single-crochet bumps, real yarn not fleece. White bobble trim around the hood opening and down the center front; one small gold crocheted star on the hood tip. Thin gold zig-zag garlands on arms and legs, small red and gold bauble dots. Exactly five round red buttons beside the white strip. One gold yarn belt with a mustard-yellow square buckle, brown center. White cuffs on all four points; colors, trims, buttons and shape stay identical to the reference photo
```

### Gingerbread Baby (`ginger_4fea85bd-….png`)
```
Hand-crocheted five-point star bodysuit in warm cinnamon-brown yarn, chunky matte single-crochet bumps, real yarn not fleece. White bobble trim around the hood opening and one white stripe down the center front; one white pompom on the hood tip. Red crocheted bow at the collar. Exactly four round peppermint-swirl buttons, top to bottom red-white, green-white, green-white, red-white. One large red-and-white peppermint swirl on the right belly. White wavy icing line plus white cuff on all four points; colors, trims, buttons and shape stay identical to the reference photo
```

### Snowman Baby Star (`snowman_4406cfdd-….png`)
```
Hand-crocheted five-point star bodysuit in warm ivory-cream yarn, chunky matte single-crochet bumps, real yarn not fleece. Hood is a snowman face: red hat top, black hat band, one white pompom, two black dot eyes, small orange carrot nose, black stitched smile, all above the face opening. Red crocheted scarf, black fringe on both hanging ends. Exactly four round black coal buttons in one vertical line. Two black rectangular patches, one above each leg point; colors, trims, buttons and shape stay identical to the reference photo
```

### Pink (`star_a7532e19-….png`, internal nickname "Patrick style")
```
Hand-crocheted five-point star bodysuit, real cotton yarn, chunky matte stitches in visible concentric pentagon rounds radiating from the chest center. Upper half and pointed hood candy pink, no pompom. One short pink strip on the left shoulder with exactly two large round pink ring buttons. Lower half and both leg points olive-lime green with six puffy purple crocheted dots, three per leg. Thin pink edging on the leg tips; arm points plain pink triangles; colors, trims, buttons and shape stay identical to the reference photo
```
> If you use `1.png` instead of the hero, swap "six puffy purple crocheted dots" for "six small purple crocheted five-point star patches". Never pass `bz-studio-pink.png`.

**Universal suffix (all colorways).** Append this to every prompt, outside the lock block:
> "baby's hands and feet stay hidden inside the soft closed star points, no fingers or toes visible, one baby only, hood opening around the face, face fully uncovered".

---

## (b) Which file goes where, and how good each one is as a start frame

**Seedance roles**
- `start_image` = the first frame. It sets composition, light and baby.
- `image_references` = product detail. Use 1–2, and they must agree with each other.

**Recommended pipeline.** Build a new 9:16 phone-style still: the hero photo as reference, cloudfel lighting (hard morning sun, white cotton duvet). Approve it by hand against the lock checklist. Use that approved still as `start_image`. Pass the hero (and the studio file only where it agrees) as `image_references`.

The hero photos are too small, too square and too "AI Christmas card" to be direct start frames for the cloudfel realism look.

| Colorway | `start_image` (direct-use fallback) | `image_references` | Start-frame quality of hero (1–5) | Notes |
|---|---|---|---|---|
| Santa | `santaclaus.png`, reframed/outpainted to 9:16 | `santaclaus.png` only (studio has 4 buttons on the strip, which conflicts) | **2.5** | Near top-down at ~80°, baby on its back, warm tungsten plus fairy-light bokeh. Busy props (candy cane, gifts, cookie). Waxy baby; strongly AI. Garment detail is crisp and the buttons are countable. |
| Elf | `elf_…png` → 9:16 | `elf_…png` only (studio tip and legs differ) | **2.5** | Top-down at ~75°, shaggy cream rug, "North Pole Gift Workshop" sign. **Text in frame, so crop it out.** Strongly AI. |
| Tree | `christmastree.png` → 9:16 | `christmastree.png` + `bz-studio-tree.png` (both have 5 red buttons, gold belt, gold star tip; garland is close) | **2.5** | Top-down, warm glow, many props. Garland and dot detail is fine and **will drift**, so the 2048 studio file helps. |
| Gingerbread | `ginger_…png` → 9:16 | `ginger_…png` + `bz-studio-gingerbread.png` (they agree) | **3** | Top-down, softer sherpa background. Cookie and cocoa props echo the theme. Still AI; buttons are very legible. |
| Snowman | `snowman_4406…png` (lying) → 9:16. For held or sitting shots use `smowman_2.png` | `snowman_4406…png` + `bz-studio-snowman.png` (4 buttons, agrees). **Not** `smowman_2` together with the lying shot (3 vs 4 buttons). | lying **2.5**, sitting **2** | Sitting shot: eye-level and frontal, but the baby sits unsupported in a 0–6 month garment, so it needs a parent's hand added to be safe. Heavy red cushions in the lying shot. |
| Pink | `star_a753…png` → 9:16 | `star_a753…png` + `1.png` only if motifs are not critical (stars vs dots). **Never** `bz-studio-pink`. | **3.5 (best of the set)** | Soft cool daylight, floral cotton quilt, muted palette. Closest to a real nursery phone photo and to the cloudfel white-bed look. The bunny plush in frame helps the "toy" read. Baby skin is still smooth (AI). |
| Pink (empty) | `1.png` as the **plush shot start frame** | `star_a753…png` | **4 as a still-life** | No baby, in a wicker basket on a muslin quilt, warm sun. Reads as a real product photo and is perfect for the "is it a toy?" opener. |

**Never use as references:**
- `handmade.png`, `patrick_2.png` and `all*.png`: they are infographic or group composites with text, icons and conflicting buttons.
- `bz-studio-pink.png`: the colorway is wrong.

**Group shots.** `all_18c8…png` (5 flat) and `all2.png` are OK only as **mood** for a "pick your colorway" carousel, never as per-variant fidelity references.

---

## (c) PLUSH FAKE-OUT analysis

**Cloudfel mechanic.** Beat 1: an object on a white bed reads as a plush toy. Beat 2: a small movement or turn shows a real baby inside.

**Safety constraint.** We cannot hide the face by putting the baby face-down, burying it in bedding or pulling the hood over the face. The face must instead be hidden by **camera geometry or editing**.

**Safe concealment methods (ranked)**
- **M1: Empty-garment match-cut (safest, most honest).**
  - Clip A: the empty star lies flat on the duvet as a still-life with a slow handheld push. It is a toy, and literally true.
  - Hard cut on a duvet ripple or hand pass to clip B: the same framing with the baby inside, on its back and awake, the parent's hand straightening a point.
  - The stitch is done in CapCut, which suits 4 s clip limits.
- **M2: Foot-end low angle.**
  - The camera sits at mattress height (~10 cm) at the foot of the bed, about 40 cm from the leg points, with a 24 mm phone wide lens.
  - The baby lies on its back with the hood at the far end. The belly mound and leg points fill the frame and hide the face behind the body curve, so the shape reads as a plush starfish or cookie.
  - The reveal: the camera rises or tilts over the belly, or the parent lifts the baby to a supported sit.
  - The face is never covered; it is simply out of line of sight.
- **M3: Over-the-shoulder back view.**
  - The parent holds the baby upright against their chest, so the camera sees the star's back (hood back and plain points) over the parent's shoulder, like holding a big plush.
  - The parent turns 180°, and the baby's face appears in the hood opening.
  - This needs a clear "awake" read: eyes open, head up.
- **M4: Crop-then-tilt.** Open tight on the body (buttons, belt, points) with the hood above frame, then tilt up to the face. This is the weakest fake-out, because a baby body silhouette reads quickly.

**Per colorway**

| Colorway | What it can read as | Best method | Toy-read strength |
|---|---|---|---|
| **Pink** | **Patrick Star plush** / crochet starfish. The sharp triangular points, concentric rounds and two-tone pink/green body are a cultural toy silhouette. `1.png` already *is* the toy shot. | M1, with `1.png` (empty) as the start of clip A. M2 also works because the green legs plus pink body read as a starfish from the foot end. | **5/5. STRONGEST.** The audience pattern-matches "Patrick plush" instantly, so the reveal of a real baby is the biggest surprise. The soft daylight hero is also the closest to the cloudfel light. In public copy say "pink starfish", never "Patrick" (trademark; see e). |
| **Gingerbread** | A giant gingerbread-man cookie or cookie pillow. The star silhouette already *is* the gingerbread-man shape, and the icing wave, peppermints and bow are cookie decorations. | M2 (foot-end, icing waves on the legs in the foreground) or M1. | **4.5/5.** The "is that a cookie?" hook works for a wide audience. Brown on a white duvet gives a great contrast pop. |
| **Snowman** | A snowman plush or cushion. The hood carries its **own face** (eyes, carrot, smile), so with the hood front tilted toward the camera from a high angle the toy face reads first and the baby's face appears just below it. | M3 (held upright, back view: ivory body plus pompom hat reads as a stuffed snowman over the shoulder). Alternatively M1. | **4/5.** Ivory on a white duvet is low contrast, which is good for "hidden in plain sight" but means the points can blur into the bedding. Use a cream or grey duvet, or a hard side light for edge shadows. |
| **Santa** | A Santa plush or a red star pillow. | M1 / M2 | **3/5.** It reads as "a costume" more than "a toy", because the belt and buttons look like clothing. |
| **Elf** | An elf plush or stuffed elf. The bell and floppy tip help. | M3 (the floppy tip and bell seen from behind over the shoulder is cute) | **3/5.** |
| **Tree** | A plush Christmas-tree ornament or tree pillow. The gold star on the tip helps. | M1 | **3/5.** Lots of detail invites AI drift during motion. |

**Recommendation**
- **Pink** is the lead fake-out reel. Clip A uses `1.png` styled as an empty star on a white duvet; clip B is the baby reveal from `star_…png`.
- **Gingerbread** is the Christmas-themed second reel.
- Snowman is the third, using the held-upright back-view turn.

---

## (d) Known AI failure modes and the words that prevent them

Seedance has no reliable negative prompt, so state the **positive physical fact** and repeat it in both the lock block and the action line.

| Failure | What happens | Prevention wording | Process fix |
|---|---|---|---|
| **Points turn into arms, hands or fingers** | Star arm points sprout baby hands, or the legs grow feet and toes; a second pair of real arms appears outside the star. Most likely when the baby "waves" or "kicks". | "baby's hands and feet stay hidden inside the soft closed star points, no fingers or toes visible"; "the star points are stuffed-looking crochet triangles that flex as one piece"; "one baby only, two arm points, two leg points". | Use motion verbs that move the *whole point*: "the right arm point lifts and flops down", not "waves hand". Keep motion small (≤10 cm). Avoid close-ups on the limb tips during motion. |
| **Button count drift** | 5 becomes 4 or 6, buttons merge into the placket, or the buttons change color (red → brown/wood, as in `handmade.png`). | "exactly five round red buttons in one line beside the white strip" (state the count, color, shape and position). For Gingerbread, list the swirl order. | Frame medium-wide so all buttons stay in frame. No rotation of the torso beyond about 20°. Reject any draft whose first and last frames show different counts (count them in frame 1 and frame last). |
| **Belt buckle changes color or material** | The crocheted mustard-yellow square turns into shiny metal gold, silver or brass, gains a prong, or becomes round. | "matte mustard-yellow **crocheted** square buckle, black center, made of yarn, not metal". Tree: "gold yarn belt, mustard-yellow square buckle, brown center". | Avoid hard specular sun directly on the buckle. If it still turns metallic, add "flat yarn texture on the buckle". |
| **Stitch texture becomes fleece, plush or minky** | The crochet bumps smooth into velour, faux-fur or polar fleece; the garment turns into a sewn onesie (the Cloudfel reference garment *is* plush, so it pulls this way hard when a cloudfel video is used as `video_reference`). | "chunky matte single-crochet bumps in countable rows, real yarn not fleece, small gaps between stitches, no fuzz, no sheen". White trims: "bumpy **bobble-yarn** trim, not fur". | Never pass a cloudfel clip as `video_reference` together with a generic "plush" word; use it for camera/light only and say "crochet" twice. Use a flat cotton duvet, not sherpa or faux fur (fur bedding bleeds into the garment texture; all the hero photos sit on sherpa). Hard side light reveals the stitch relief. |
| Colorway or trim swap mid-shot | The Elf tip becomes striped (studio version); white trim turns red; Tree garland disappears. | Lock block plus "colors, trims, buttons and shape stay identical to the reference photo". | Pass only references that agree (table in §0). One colorway per clip. |
| Hood morphs | The hood becomes a beanie or hat, slides over the eyes, or the pompom or bell disappears. | "hood opening frames the whole face, forehead to chin, face fully uncovered"; name the tip object ("one white pompom", "one gold bell"). | Reject any frame where fabric crosses the eyes, nose or mouth (this is also the safety rule). |
| Snowman face doubles | The snowman hood face and the baby face merge, or the hood face vanishes. | "snowman face (eyes, carrot nose, smile) is on the hood **above** the baby's face opening". | Keep the camera above the hood front so both are separate. |
| Text artifacts | The "Gift Workshop" sign or book titles from the hero become garbled text. | (none) | Crop or outpaint text out of the start image; text goes in CapCut. |
| Shape drift | The star becomes a 6-point star or a sleeping-bag rectangle, or the legs fuse. | "five points: hood on top, two arm points, two separate leg points". | (none) |

**QA checklist per draft (check frames 1, mid and last)**
- point count is 5
- button count matches the lock
- the buckle is matte yellow
- the stitches are still visible bumps
- the face is fully uncovered
- the baby's eyes are open
- one baby only
- no hands or feet outside the points

---
