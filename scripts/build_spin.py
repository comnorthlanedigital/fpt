"""Turns the product turntable video (pure-black background, no alpha channel) into a cropped WebP frame sequence.

usage: python3 scripts/build_spin.py <frames_dir> <out_dir>
The product bodies are black too, so no clean matte exists: the pages that use these frames
sit on pure #000 so the frame edges disappear.
"""
import sys, glob, json, os
import numpy as np, cv2

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
files = sorted(glob.glob(os.path.join(src, 'f*.png')))
frames, boxes = [], []
for f in files:
    im = cv2.imread(f)
    lum = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
    ys, xs = np.where(lum > 3)
    frames.append(im); boxes.append((xs.min(), ys.min(), xs.max(), ys.max()))
pad = 24
x0 = max(0, min(b[0] for b in boxes) - pad); y0 = max(0, min(b[1] for b in boxes) - pad)
x1 = min(frames[0].shape[1], max(b[2] for b in boxes) + pad); y1 = min(frames[0].shape[0], max(b[3] for b in boxes) + pad)
for i, im in enumerate(frames):
    cv2.imwrite(os.path.join(out, f'{i:03d}.webp'), im[y0:y1, x0:x1], [cv2.IMWRITE_WEBP_QUALITY, 80])
json.dump({'count': len(frames), 'w': int(x1 - x0), 'h': int(y1 - y0)}, open(os.path.join(out, 'meta.json'), 'w'))
print(len(frames), 'frames', x1 - x0, 'x', y1 - y0)
