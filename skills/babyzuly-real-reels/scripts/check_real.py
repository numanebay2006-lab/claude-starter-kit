"""Realism colour check for a draft clip or still, against the measured @cloudfel house look.

Usage:
    python -I -X utf8 check_real.py <video.mp4 | image.png> [more files...]

For a video, frames are sampled at 1 fps with ffmpeg. Prints PASS/FAIL per metric and a verdict.
Targets come from measuring the 3 top cloudfel reels (19.2M / 4.3M / 1.1M views):
neutral ~6500 K whites, whites ~75 % not blown, true blacks, low saturation.
"""
from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from dataclasses import dataclass

import numpy as np
from PIL import Image

WHITE_R_OVER_B = (0.98, 1.02)   # neutral whites; > 1.03 = warm AI cast
WHITE_Y = (178.0, 200.0)        # duvet brightness, not blown
BLACK_P1_MAX = 6.0              # real black shadows; higher = milky "cinematic" fade
CLIP_PCT_MAX = 0.5              # % of pixels with any channel >= 250
SAT_MEAN_MAX = 30.0             # HSV saturation mean %, costume-dependent; > 30 = graded
FRAME_Y = (110.0, 140.0)        # overall exposure


@dataclass(frozen=True)
class FrameStats:
    white_r_over_b: float
    white_y: float
    black_p1: float
    clip_pct: float
    sat_mean: float
    frame_y: float


def measure(rgb: np.ndarray) -> FrameStats:
    a = rgb.astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    y = 0.2126 * r + 0.7152 * g + 0.0722 * b
    mx, mn = a.max(-1), a.min(-1)
    sat = (mx - mn) / np.maximum(mx, 1)
    white = (y > np.percentile(y, 75)) & (y > 150) & (sat < 0.18) & (mx < 250)
    if white.sum() < 500:
        white = (y > np.percentile(y, 85)) & (mx < 252)
    wr, wg, wb = r[white].mean(), g[white].mean(), b[white].mean()
    return FrameStats(
        white_r_over_b=wr / wb,
        white_y=0.2126 * wr + 0.7152 * wg + 0.0722 * wb,
        black_p1=float(np.percentile(y, 1)),
        clip_pct=float(100 * (mx >= 250).mean()),
        sat_mean=float(100 * sat.mean()),
        frame_y=float(y.mean()),
    )


def load_frames(path: str) -> list[np.ndarray]:
    if path.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
        return [np.asarray(Image.open(path).convert("RGB").resize((540, 960)))]
    with tempfile.TemporaryDirectory() as tmp:
        cmd = ["ffmpeg", "-loglevel", "error", "-i", path, "-vf", "fps=1,scale=540:960",
               os.path.join(tmp, "f_%03d.png")]
        subprocess.run(cmd, check=True)
        names = sorted(os.listdir(tmp))
        if not names:
            raise RuntimeError(f"no frames extracted from {path}")
        return [np.asarray(Image.open(os.path.join(tmp, n)).convert("RGB")) for n in names]


def check(label: str, value: float, lo: float | None, hi: float | None, fix: str) -> bool:
    ok = (lo is None or value >= lo) and (hi is None or value <= hi)
    rng = f"{lo if lo is not None else '-'}..{hi if hi is not None else '-'}"
    print(f"  [{'PASS' if ok else 'FAIL'}] {label:<22} {value:7.2f}   target {rng}" + ("" if ok else f"   -> {fix}"))
    return ok


def report(path: str) -> bool:
    frames = [measure(f) for f in load_frames(path)]
    avg = {k: float(np.mean([getattr(s, k) for s in frames])) for k in FrameStats.__dataclass_fields__}
    print(f"\n{path}  ({len(frames)} frame(s))")
    results = [
        check("white R/B (warmth)", avg["white_r_over_b"], *WHITE_R_OVER_B,
              "CapCut Temp -8..-15 (warm) / +5 (blue); start still must be neutral"),
        check("white brightness Y", avg["white_y"], *WHITE_Y, "Highlights -10, Whites -5 (or Exposure +3 if low)"),
        check("black point p1", avg["black_p1"], None, BLACK_P1_MAX, "Blacks -15, Fade 0 (milky = cinematic look)"),
        check("clipped pixels %", avg["clip_pct"], None, CLIP_PCT_MAX, "Highlights -10"),
        check("saturation mean %", avg["sat_mean"], None, SAT_MEAN_MAX, "Saturation -5..-8, no filter/LUT"),
        check("frame brightness Y", avg["frame_y"], *FRAME_Y, "Exposure +/-3"),
    ]
    verdict = all(results)
    print(f"  VERDICT: {'REAL-LOOK PASS' if verdict else 'FIX COLOUR (or regenerate the start still if R/B > 1.06)'}")
    return verdict


def main(argv: list[str]) -> int:
    if not argv:
        print(__doc__)
        return 2
    outcomes = [report(p) for p in argv]
    return 0 if all(outcomes) else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
