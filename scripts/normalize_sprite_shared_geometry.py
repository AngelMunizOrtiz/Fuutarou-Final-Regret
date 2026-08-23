#!/usr/bin/env python3
"""Normalize VN sprites with one fixed canvas transform shared by a whole set."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Apply a fixed scale and offset to a transparent sprite so related "
            "variants keep identical in-game geometry."
        )
    )
    parser.add_argument("--input", required=True, help="Transparent source sprite.")
    parser.add_argument("--geometry", required=True, help="Shared geometry JSON file.")
    parser.add_argument("--png-out", required=True, help="Normalized PNG output.")
    parser.add_argument("--webp-out", required=True, help="Normalized WebP output.")
    parser.add_argument("--quality", type=int, default=92)
    return parser.parse_args()


def content_bbox(image: Image.Image, threshold: int) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A").point(lambda value: 255 if value > threshold else 0)
    bbox = alpha.getbbox()
    if bbox is None:
        raise ValueError("No visible sprite pixels were detected.")
    return bbox


def composite_clipped(
    canvas: Image.Image,
    source: Image.Image,
    offset_x: int,
    offset_y: int,
) -> None:
    source_left = max(0, -offset_x)
    source_top = max(0, -offset_y)
    source_right = min(source.width, canvas.width - offset_x)
    source_bottom = min(source.height, canvas.height - offset_y)
    if source_right <= source_left or source_bottom <= source_top:
        raise ValueError("The shared transform places the sprite outside the canvas.")

    fragment = source.crop((source_left, source_top, source_right, source_bottom))
    destination = (max(0, offset_x), max(0, offset_y))
    canvas.alpha_composite(fragment, destination)


def main() -> None:
    args = parse_args()
    geometry_path = Path(args.geometry)
    geometry = json.loads(geometry_path.read_text(encoding="utf-8"))

    source = Image.open(args.input).convert("RGBA")
    expected_size = (
        int(geometry["source_canvas"]["width"]),
        int(geometry["source_canvas"]["height"]),
    )
    if source.size != expected_size:
        raise ValueError(
            f"Source canvas {source.size} does not match shared geometry {expected_size}."
        )

    canvas_size = (
        int(geometry["runtime_canvas"]["width"]),
        int(geometry["runtime_canvas"]["height"]),
    )
    scale = float(geometry["scale"])
    if scale <= 0:
        raise ValueError("Geometry scale must be greater than zero.")

    resized = source.resize(
        (
            max(1, round(source.width * scale)),
            max(1, round(source.height * scale)),
        ),
        Image.Resampling.LANCZOS,
    )
    offset_x = int(geometry["offset"]["x"])
    offset_y = int(geometry["offset"]["y"])
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    composite_clipped(canvas, resized, offset_x, offset_y)

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

    threshold = int(geometry.get("alpha_threshold", 8))
    output_bbox = content_bbox(canvas, threshold)
    corner_alpha = [
        canvas.getpixel((0, 0))[3],
        canvas.getpixel((canvas.width - 1, 0))[3],
        canvas.getpixel((0, canvas.height - 1))[3],
        canvas.getpixel((canvas.width - 1, canvas.height - 1))[3],
    ]
    print(
        f"{png_out.name}: source={source.size}, canvas={canvas.size}, "
        f"scale={scale:.4f}, offset=({offset_x},{offset_y}), "
        f"output_bbox={output_bbox}, corner_alpha={corner_alpha}"
    )


if __name__ == "__main__":
    main()
