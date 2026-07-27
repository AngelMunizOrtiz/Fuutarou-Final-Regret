#!/usr/bin/env python3
"""Create a labeled before/after contact sheet for VN sprites."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--original-dir", required=True)
    parser.add_argument("--variant-dir", required=True)
    parser.add_argument(
        "--files",
        required=True,
        help="Comma-separated filenames shared by both directories.",
    )
    parser.add_argument("--out", required=True)
    parser.add_argument("--original-label", default="Original")
    parser.add_argument("--variant-label", default="Variant")
    parser.add_argument("--cell-width", type=int, default=310)
    parser.add_argument("--cell-height", type=int, default=438)
    return parser.parse_args()


def fit_sprite(path: Path, size: tuple[int, int]) -> Image.Image:
    image = Image.open(path).convert("RGBA")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", size, (0, 0, 0, 0))
    left = (size[0] - image.width) // 2
    top = size[1] - image.height
    canvas.alpha_composite(image, (left, top))
    return canvas


def main() -> None:
    args = parse_args()
    files = [name.strip() for name in args.files.split(",") if name.strip()]
    if not files:
        raise SystemExit("--files must contain at least one filename.")

    margin = 24
    header_height = 46
    row_label_width = 150
    width = row_label_width + len(files) * args.cell_width + margin * 2
    height = header_height + args.cell_height * 2 + margin * 2
    sheet = Image.new("RGB", (width, height), (236, 232, 224))
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()

    original_dir = Path(args.original_dir)
    variant_dir = Path(args.variant_dir)
    rows = [
        (args.original_label, original_dir),
        (args.variant_label, variant_dir),
    ]

    for column, filename in enumerate(files):
        x = margin + row_label_width + column * args.cell_width
        label = Path(filename).stem.removeprefix("maruo_").replace("_", " ")
        draw.text((x + 10, margin + 14), label, fill=(42, 39, 36), font=font)

    for row, (row_label, directory) in enumerate(rows):
        y = margin + header_height + row * args.cell_height
        fill = (246, 243, 237) if row == 0 else (225, 232, 222)
        draw.rectangle(
            (
                margin + row_label_width,
                y,
                width - margin,
                y + args.cell_height,
            ),
            fill=fill,
        )
        draw.text(
            (margin, y + 18),
            row_label,
            fill=(42, 39, 36),
            font=font,
        )

        for column, filename in enumerate(files):
            sprite = fit_sprite(
                directory / filename,
                (args.cell_width, args.cell_height),
            )
            x = margin + row_label_width + column * args.cell_width
            sheet.paste(sprite, (x, y), sprite)
            draw.rectangle(
                (x, y, x + args.cell_width, y + args.cell_height),
                outline=(188, 181, 169),
                width=1,
            )

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out, optimize=True)
    print(f"Wrote {out} ({sheet.width}x{sheet.height})")


if __name__ == "__main__":
    main()
