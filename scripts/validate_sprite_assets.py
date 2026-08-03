#!/usr/bin/env python3
"""Validate runtime sprite dimensions and transparent canvas corners."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--spec",
        action="append",
        required=True,
        metavar="DIRECTORY=WIDTHxHEIGHT",
        help="Sprite directory and required runtime canvas size.",
    )
    return parser.parse_args()


def parse_spec(value: str) -> tuple[Path, tuple[int, int]]:
    directory, separator, geometry = value.rpartition("=")
    width, size_separator, height = geometry.lower().partition("x")
    if not separator or not size_separator:
        raise ValueError(f"Invalid sprite spec: {value}")
    return Path(directory), (int(width), int(height))


def main() -> None:
    args = parse_args()
    failed = False

    for raw_spec in args.spec:
        directory, expected_size = parse_spec(raw_spec)
        files = sorted(directory.glob("*.webp"))
        if not files:
            print(f"FAIL {directory}: no WebP sprites found")
            failed = True
            continue

        for path in files:
            image = Image.open(path).convert("RGBA")
            corner_alpha = [
                image.getpixel((0, 0))[3],
                image.getpixel((image.width - 1, 0))[3],
                image.getpixel((0, image.height - 1))[3],
                image.getpixel((image.width - 1, image.height - 1))[3],
            ]
            valid = image.size == expected_size and corner_alpha == [0, 0, 0, 0]
            failed |= not valid
            result = "PASS" if valid else "FAIL"
            print(
                f"{result} {path.as_posix()}: size={image.size}, "
                f"bbox={image.getchannel('A').getbbox()}, corners={corner_alpha}"
            )

    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
