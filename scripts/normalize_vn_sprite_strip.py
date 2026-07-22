#!/usr/bin/env python3
"""Normalize a horizontal VN sprite strip against an approved anchor frame."""

from __future__ import annotations

import argparse
from pathlib import Path

import cv2
import numpy as np
from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--anchor", required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument("--names", required=True, help="Comma-separated output names without .png")
    parser.add_argument("--width", type=int, default=620)
    parser.add_argument("--height", type=int, default=876)
    parser.add_argument("--alpha-threshold", type=int, default=8)
    parser.add_argument("--padding", type=int, default=10)
    return parser.parse_args()


def content_bbox(image: Image.Image, threshold: int) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("No visible sprite content was detected")
    return bbox


def split_strip(strip: Image.Image, frame_count: int) -> list[Image.Image]:
    step = strip.width / frame_count
    return [
        strip.crop(
            (
                round(index * step),
                0,
                round((index + 1) * step),
                strip.height,
            )
        )
        for index in range(frame_count)
    ]


def keep_largest_component(image: Image.Image, threshold: int) -> Image.Image:
    """Discard disconnected spill from characters crossing adjacent slots."""
    pixels = np.array(image)
    mask = (pixels[:, :, 3] > threshold).astype(np.uint8)
    component_count, labels, stats, _ = cv2.connectedComponentsWithStats(mask, connectivity=8)
    if component_count <= 1:
        return image

    largest_label = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
    keep = labels == largest_label
    pixels[~keep] = 0
    return Image.fromarray(pixels, "RGBA")


def main() -> None:
    args = parse_args()
    names = [name.strip() for name in args.names.split(",") if name.strip()]
    if not names:
        raise SystemExit("--names must contain at least one output name")

    strip = Image.open(args.input).convert("RGBA")
    anchor = Image.open(args.anchor).convert("RGBA")
    anchor_bbox = content_bbox(anchor, args.alpha_threshold)
    anchor_width = anchor_bbox[2] - anchor_bbox[0]
    anchor_height = anchor_bbox[3] - anchor_bbox[1]
    anchor_center_x = (anchor_bbox[0] + anchor_bbox[2]) / 2
    anchor_bottom = anchor_bbox[3]

    slots = split_strip(strip, len(names))
    cropped: list[Image.Image] = []
    for slot in slots:
        slot = keep_largest_component(slot, args.alpha_threshold)
        bbox = content_bbox(slot, args.alpha_threshold)
        cropped.append(slot.crop(bbox))

    max_width = max(image.width for image in cropped)
    max_height = max(image.height for image in cropped)
    scale = min(
        anchor_height / max_height,
        (args.width - args.padding * 2) / max_width,
        (args.height - args.padding * 2) / max_height,
    )

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    for name, sprite in zip(names, cropped, strict=True):
        new_width = max(1, round(sprite.width * scale))
        new_height = max(1, round(sprite.height * scale))
        resized = sprite.resize((new_width, new_height), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", (args.width, args.height), (0, 0, 0, 0))
        x = round(anchor_center_x - new_width / 2)
        y = round(anchor_bottom - new_height)
        x = max(0, min(args.width - new_width, x))
        y = max(0, min(args.height - new_height, y))
        canvas.alpha_composite(resized, (x, y))
        canvas.save(out_dir / f"{name}.png")

    print(
        f"Normalized {len(names)} sprites at shared scale {scale:.4f} "
        f"against anchor content {anchor_width}x{anchor_height}."
    )


if __name__ == "__main__":
    main()
