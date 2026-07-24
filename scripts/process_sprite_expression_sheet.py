#!/usr/bin/env python3
"""Split and normalize a transparent expression sheet against an approved sprite."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Split a horizontal expression sheet, match every expression to an "
            "approved anchor sprite, and export transparent PNG/WebP assets."
        )
    )
    parser.add_argument("--input", required=True, help="Transparent expression sheet.")
    parser.add_argument("--anchor", required=True, help="Approved transparent sprite.")
    parser.add_argument("--frames", required=True, type=int, help="Number of sheet slots.")
    parser.add_argument(
        "--names",
        required=True,
        help="Comma-separated expression names in left-to-right order.",
    )
    parser.add_argument("--png-dir", required=True, help="Master PNG output directory.")
    parser.add_argument("--webp-dir", required=True, help="Runtime WebP output directory.")
    parser.add_argument(
        "--alpha-threshold",
        type=int,
        default=8,
        help="Minimum alpha used to detect sprite content. Default: 8.",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=92,
        help="Runtime WebP quality. Default: 92.",
    )
    return parser.parse_args()


def content_bbox(image: Image.Image, threshold: int) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("No visible sprite pixels were detected.")
    return bbox


def split_horizontal(image: Image.Image, frames: int) -> list[Image.Image]:
    step = image.width / frames
    return [
        image.crop(
            (
                round(index * step),
                0,
                round((index + 1) * step),
                image.height,
            )
        )
        for index in range(frames)
    ]


def normalize_frame(
    frame: Image.Image,
    anchor: Image.Image,
    anchor_bbox: tuple[int, int, int, int],
    alpha_threshold: int,
) -> Image.Image:
    frame_bbox = content_bbox(frame, alpha_threshold)
    content = frame.crop(frame_bbox)

    target_width = anchor_bbox[2] - anchor_bbox[0]
    target_height = anchor_bbox[3] - anchor_bbox[1]
    scale = min(target_width / content.width, target_height / content.height)
    width = max(1, round(content.width * scale))
    height = max(1, round(content.height * scale))
    resized = content.resize((width, height), Image.Resampling.LANCZOS)

    anchor_center_x = (anchor_bbox[0] + anchor_bbox[2]) / 2
    left = round(anchor_center_x - width / 2)
    top = anchor_bbox[3] - height

    canvas = Image.new("RGBA", anchor.size, (0, 0, 0, 0))
    canvas.alpha_composite(resized, (left, top))
    return canvas


def main() -> None:
    args = parse_args()
    names = [name.strip() for name in args.names.split(",") if name.strip()]

    if args.frames < 1:
        raise SystemExit("--frames must be at least 1.")
    if len(names) != args.frames:
        raise SystemExit("--names must contain exactly one name per frame.")

    sheet = Image.open(args.input).convert("RGBA")
    anchor = Image.open(args.anchor).convert("RGBA")
    anchor_bbox = content_bbox(anchor, args.alpha_threshold)
    frames = split_horizontal(sheet, args.frames)

    png_dir = Path(args.png_dir)
    webp_dir = Path(args.webp_dir)
    png_dir.mkdir(parents=True, exist_ok=True)
    webp_dir.mkdir(parents=True, exist_ok=True)

    for name, frame in zip(names, frames, strict=True):
        normalized = normalize_frame(frame, anchor, anchor_bbox, args.alpha_threshold)
        normalized.save(png_dir / f"{name}.png", optimize=True)
        normalized.save(
            webp_dir / f"{name}.webp",
            format="WEBP",
            quality=args.quality,
            method=6,
            exact=True,
        )
        print(f"{name}: {normalized.width}x{normalized.height}")


if __name__ == "__main__":
    main()
