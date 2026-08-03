#!/usr/bin/env python3
"""Normalize one transparent VN sprite variant against an approved anchor."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Match a generated full-body sprite to an existing runtime sprite's "
            "visible width and top position, then export PNG and WebP variants."
        )
    )
    parser.add_argument("--input", required=True, help="Transparent generated sprite.")
    parser.add_argument("--anchor", required=True, help="Approved runtime sprite.")
    parser.add_argument("--png-out", required=True, help="Normalized master PNG.")
    parser.add_argument("--webp-out", required=True, help="Normalized runtime WebP.")
    parser.add_argument("--alpha-threshold", type=int, default=8)
    parser.add_argument(
        "--scale-multiplier",
        type=float,
        default=1.0,
        help=(
            "Optional adjustment after matching the anchor width. Useful for "
            "sprites whose silhouette is widened by props such as large hats."
        ),
    )
    parser.add_argument("--quality", type=int, default=92)
    return parser.parse_args()


def content_bbox(image: Image.Image, threshold: int) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("No visible sprite pixels were detected.")
    return bbox


def main() -> None:
    args = parse_args()
    source = Image.open(args.input).convert("RGBA")
    anchor = Image.open(args.anchor).convert("RGBA")

    source_bbox = content_bbox(source, args.alpha_threshold)
    anchor_bbox = content_bbox(anchor, args.alpha_threshold)
    content = source.crop(source_bbox)

    target_width = anchor_bbox[2] - anchor_bbox[0]
    if args.scale_multiplier <= 0:
        raise ValueError("--scale-multiplier must be greater than zero.")

    scale = (target_width / content.width) * args.scale_multiplier
    resized_width = max(1, round(content.width * scale))
    resized_height = max(1, round(content.height * scale))
    resized = content.resize(
        (resized_width, resized_height),
        Image.Resampling.LANCZOS,
    )

    anchor_center_x = (anchor_bbox[0] + anchor_bbox[2]) / 2
    left = round(anchor_center_x - resized_width / 2)
    top = anchor_bbox[1]

    canvas = Image.new("RGBA", anchor.size, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (left, top))

    png_out = Path(args.png_out)
    webp_out = Path(args.webp_out)
    png_out.parent.mkdir(parents=True, exist_ok=True)
    webp_out.parent.mkdir(parents=True, exist_ok=True)

    canvas.save(png_out, optimize=True)
    canvas.save(
        webp_out,
        format="WEBP",
        quality=args.quality,
        method=6,
        exact=True,
    )

    output_bbox = content_bbox(canvas, args.alpha_threshold)
    corner_alpha = [
        canvas.getpixel((0, 0))[3],
        canvas.getpixel((canvas.width - 1, 0))[3],
        canvas.getpixel((0, canvas.height - 1))[3],
        canvas.getpixel((canvas.width - 1, canvas.height - 1))[3],
    ]
    print(
        f"{png_out.name}: canvas={canvas.width}x{canvas.height}, "
        f"source_bbox={source_bbox}, anchor_bbox={anchor_bbox}, "
        f"output_bbox={output_bbox}, scale={scale:.4f}, "
        f"scale_multiplier={args.scale_multiplier:.4f}, "
        f"corner_alpha={corner_alpha}"
    )


if __name__ == "__main__":
    main()
