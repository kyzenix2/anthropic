#!/usr/bin/env python3
"""Generate a neutral placeholder coin logo reading 'ANT' (amber coin on soil tones).
Usage: python3 tools/make_placeholder_logo.py [out.png]   (default: tools/placeholder_logo.png)
This is ONLY a stand-in until the real logo.png arrives."""
import sys, math, os, glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

S = 1024
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "placeholder_logo.png")

def font(size):
    for pat in ["/usr/share/fonts/**/BarlowCondensed-Bold.ttf", "/usr/share/fonts/**/DejaVuSans-Bold.ttf"]:
        hits = glob.glob(pat, recursive=True)
        if hits:
            return ImageFont.truetype(hits[0], size)
    return ImageFont.load_default()

img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
c = S // 2
# outer rim gradient
for r in range(c - 8, 0, -2):
    t = r / (c - 8)
    col = (int(255 - 70 * (1 - t)), int(176 - 90 * (1 - t) ** 0.8), int(40 + 10 * t), 255)
    d.ellipse([c - r, c - r, c + r, c + r], fill=col)
# dark rim ring
d.ellipse([16, 16, S - 16, S - 16], outline=(58, 30, 14, 255), width=22)
d.ellipse([70, 70, S - 70, S - 70], outline=(120, 62, 22, 255), width=8)
# notches around the rim (like a coin edge / ant segments)
for i in range(48):
    a = i / 48 * math.tau
    x1, y1 = c + math.cos(a) * (c - 44), c + math.sin(a) * (c - 44)
    d.ellipse([x1 - 7, y1 - 7, x1 + 7, y1 + 7], fill=(92, 46, 16, 255))
# inner face
d.ellipse([110, 110, S - 110, S - 110], fill=(40, 22, 12, 255))
d.ellipse([124, 124, S - 124, S - 124], outline=(255, 190, 70, 255), width=6)
# text
f = font(330)
txt = "ANT"
bb = d.textbbox((0, 0), txt, font=f)
w, h = bb[2] - bb[0], bb[3] - bb[1]
d.text((c - w / 2 - bb[0], c - h / 2 - bb[1] - 10), txt, font=f, fill=(255, 196, 72, 255))
f2 = font(64)
for t, yy in (("$ANT", 250), ("ETHEREUM", 730)):
    bb = d.textbbox((0, 0), t, font=f2)
    d.text((c - (bb[2] - bb[0]) / 2 - bb[0], yy), t, font=f2, fill=(220, 150, 60, 255))
# soft highlight
hl = Image.new("RGBA", (S, S), (0, 0, 0, 0))
ImageDraw.Draw(hl).ellipse([200, 120, 620, 380], fill=(255, 255, 255, 40))
img = Image.alpha_composite(img, hl.filter(ImageFilter.GaussianBlur(40)))
img.save(out)
print("wrote", out)
