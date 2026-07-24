#!/usr/bin/env python3
"""Normalize a generated CG into the project's master PNG and runtime WebP."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export one visual-novel CG as a fixed-size PNG and WebP."
    )
    parser.add_argument("--input", required=True, help="Generated source image.")
    parser.add_argument("--png", required=True, help="Master PNG output.")
    parser.add_argument("--webp", required=True, help="Runtime WebP output.")
    parser.add_argument("--width", type=int, default=1672)
    parser.add_argument("--height", type=int, default=941)
    parser.add_argument("--quality", type=int, default=90)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.width < 1 or args.height < 1:
        raise SystemExit("--width and --height must be positive.")

    source = Image.open(args.input).convert("RGB")
    target = ImageOps.fit(
        source,
        (args.width, args.height),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )

    png_path = Path(args.png)
    webp_path = Path(args.webp)
    png_path.parent.mkdir(parents=True, exist_ok=True)
    webp_path.parent.mkdir(parents=True, exist_ok=True)

    target.save(png_path, format="PNG", optimize=True)
    target.save(
        webp_path,
        format="WEBP",
        quality=args.quality,
        method=6,
    )
    print(
        f"Wrote {png_path} and {webp_path} "
        f"({target.width}x{target.height}, WebP quality {args.quality})."
    )


if __name__ == "__main__":
    main()
