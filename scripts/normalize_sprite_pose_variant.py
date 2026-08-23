#!/usr/bin/env python3
"""Normalize a pose-changing VN sprite while preserving character height."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Match a generated pose variant to an approved sprite's visible "
            "height and bottom anchor without shrinking wider arm gestures."
        )
    )
    parser.add_argument("--input", required=True, help="Transparent pose variant.")
    parser.add_argument("--anchor", required=True, help="Approved runtime sprite.")
    parser.add_argument("--png-out", required=True, help="Normalized master PNG.")
    parser.add_argument("--webp-out", required=True, help="Normalized runtime WebP.")
    parser.add_argument("--alpha-threshold", type=int, default=8)
    parser.add_argument("--quality", type=int, default=92)
    parser.add_argument(
        "--source-visible-ratio",
        type=float,
        default=1.0,
        help=(
            "Fraction of the source character height to retain from the top "
            "before matching the anchor height. Use values below 1 for "
            "full-body generations that must match a cropped VN sprite set."
        ),
    )
    parser.add_argument(
        "--center-on-canvas",
        action="store_true",
        help=(
            "Center the generated pose on the runtime canvas instead of "
            "reusing an off-center anchor bbox. Useful for wider gestures."
        ),
    )
    return parser.parse_args()


def content_bbox(image: Image.Image, threshold: int) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("No visible sprite pixels were detected.")
    return bbox


def main() -> None:
    args = parse_args()
    if not 0 < args.source_visible_ratio <= 1:
        raise ValueError("--source-visible-ratio must be greater than 0 and at most 1.")

    source = Image.open(args.input).convert("RGBA")
    anchor = Image.open(args.anchor).convert("RGBA")

    source_bbox = content_bbox(source, args.alpha_threshold)
    anchor_bbox = content_bbox(anchor, args.alpha_threshold)
    content = source.crop(source_bbox)
    retained_height = max(1, round(content.height * args.source_visible_ratio))
    content = content.crop((0, 0, content.width, retained_height))

    target_height = anchor_bbox[3] - anchor_bbox[1]
    scale = target_height / content.height
    resized_width = max(1, round(content.width * scale))
    resized_height = max(1, round(content.height * scale))
    resized = content.resize(
        (resized_width, resized_height),
        Image.Resampling.LANCZOS,
    )

    anchor_center_x = (
        anchor.width / 2
        if args.center_on_canvas
        else (anchor_bbox[0] + anchor_bbox[2]) / 2
    )
    left = round(anchor_center_x - resized_width / 2)
    top = anchor_bbox[3] - resized_height
    if left < 0 or left + resized_width > anchor.width:
        raise ValueError(
            "Normalized pose exceeds the runtime canvas horizontally: "
            f"left={left}, right={left + resized_width}, canvas={anchor.width}."
        )

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
        f"source_visible_ratio={args.source_visible_ratio:.4f}, "
        f"output_bbox={output_bbox}, scale={scale:.4f}, "
        f"corner_alpha={corner_alpha}"
    )


if __name__ == "__main__":
    main()
