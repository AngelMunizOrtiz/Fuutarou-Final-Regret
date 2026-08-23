#!/usr/bin/env python3
"""Create a compact labeled contact sheet for transparent sprite expressions."""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input-dir", required=True)
    parser.add_argument("--files", required=True, help="Comma-separated filenames.")
    parser.add_argument("--out", required=True)
    parser.add_argument("--title", default="Expression sheet")
    parser.add_argument("--columns", type=int, default=3)
    parser.add_argument("--cell-width", type=int, default=310)
    parser.add_argument("--cell-height", type=int, default=438)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    files = [name.strip() for name in args.files.split(",") if name.strip()]
    if not files:
        raise SystemExit("--files must contain at least one filename.")
    if args.columns < 1:
        raise SystemExit("--columns must be at least 1.")

    margin = 24
    title_height = 44
    label_height = 28
    rows = math.ceil(len(files) / args.columns)
    width = margin * 2 + args.columns * args.cell_width
    height = margin * 2 + title_height + rows * (args.cell_height + label_height)
    sheet = Image.new("RGB", (width, height), (42, 45, 53))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    draw.text((margin, margin), args.title, fill=(245, 245, 247), font=font)

    source_dir = Path(args.input_dir)
    for index, filename in enumerate(files):
        row, column = divmod(index, args.columns)
        x = margin + column * args.cell_width
        y = margin + title_height + row * (args.cell_height + label_height)
        draw.rectangle(
            (x, y, x + args.cell_width - 1, y + args.cell_height - 1),
            fill=(65, 68, 77),
            outline=(111, 115, 126),
        )

        sprite = Image.open(source_dir / filename).convert("RGBA")
        sprite.thumbnail((args.cell_width, args.cell_height), Image.Resampling.LANCZOS)
        left = x + (args.cell_width - sprite.width) // 2
        top = y + args.cell_height - sprite.height
        sheet.paste(sprite, (left, top), sprite)

        label = Path(filename).stem.split("_rena_", 1)[-1].replace("_", " ")
        draw.text(
            (x + 8, y + args.cell_height + 7),
            label,
            fill=(238, 239, 242),
            font=font,
        )

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, optimize=True)
    print(f"Wrote {out} ({sheet.width}x{sheet.height})")


if __name__ == "__main__":
    main()
