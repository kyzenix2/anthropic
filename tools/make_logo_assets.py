#!/usr/bin/env python3
"""Rebuild every logo-derived asset from ONE source image.

Usage (from the site root):
    python3 tools/make_logo_assets.py path/to/logo.png

Writes:
  assets/logo.png          square master (1024px, transparent padding if needed)
  assets/logo.webp         512px webp used in the page
  assets/logo-round.png    512px circular crop (used for the hero coin)
  assets/logo-round.webp   same, webp
  favicon.ico              16/32/48 multi-size
  favicon-32.png, apple-touch-icon.png (180), icon-192.png, icon-512.png
  assets/og-image.png      1200x630 social preview card
Requires Pillow (pip install pillow).
"""
import sys, os, glob
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = os.path.join(ROOT, "assets")

def square(im, size):
    im = im.convert("RGBA")
    w, h = im.size
    s = max(w, h)
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    canvas.paste(im, ((s - w) // 2, (s - h) // 2), im)
    return canvas.resize((size, size), Image.LANCZOS)

def round_crop(im, size):
    im = square(im, size)
    mask = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, size * 4 - 1, size * 4 - 1], fill=255)
    mask = mask.resize((size, size), Image.LANCZOS)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(im, (0, 0), Image.composite(im.split()[3], Image.new("L", (size, size), 0), mask))
    return out

def font(sz):
    for pat in ["/usr/share/fonts/**/BarlowCondensed-Bold.ttf", "/usr/share/fonts/**/DejaVuSans-Bold.ttf",
                "/System/Library/Fonts/Supplemental/Arial Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        hits = glob.glob(pat, recursive=True)
        if hits:
            return ImageFont.truetype(hits[0], sz)
    return ImageFont.load_default()

def og(im):
    W, H = 1200, 630
    bg = Image.new("RGB", (W, H), (22, 13, 8))
    d = ImageDraw.Draw(bg)
    for y in range(H):  # soil gradient
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(22 + 40 * t), int(13 + 18 * t), int(8 + 6 * t)))
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse([60, 80, 560, 580], fill=(255, 170, 40, 90))
    bg = Image.alpha_composite(bg.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(70)))
    logo = round_crop(im, 420)
    bg.paste(logo, (100, 105), logo)
    d = ImageDraw.Draw(bg)
    d.text((590, 190), "$ANT", font=font(150), fill=(255, 190, 70))
    d.text((596, 360), "The colony on Ethereum", font=font(54), fill=(240, 220, 190))
    d.text((596, 440), "Community meme token. Not affiliated with any company.", font=font(28), fill=(170, 140, 110))
    return bg.convert("RGB")

def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = Image.open(sys.argv[1])
    os.makedirs(A, exist_ok=True)
    master = square(src, 1024)
    master.save(os.path.join(A, "logo.png"))
    square(src, 512).save(os.path.join(A, "logo.webp"), "WEBP", quality=90)
    r = round_crop(src, 512)
    r.save(os.path.join(A, "logo-round.png"))
    r.save(os.path.join(A, "logo-round.webp"), "WEBP", quality=90)
    square(src, 256).save(os.path.join(ROOT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
    square(src, 32).save(os.path.join(ROOT, "favicon-32.png"))
    for n, s in (("apple-touch-icon.png", 180), ("icon-192.png", 192), ("icon-512.png", 512)):
        square(src, s).save(os.path.join(ROOT, n))
    og(src).save(os.path.join(A, "og-image.png"), optimize=True)
    print("Logo assets rebuilt from", sys.argv[1])

if __name__ == "__main__":
    main()
