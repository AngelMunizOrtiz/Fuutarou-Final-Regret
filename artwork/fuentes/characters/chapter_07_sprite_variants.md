# Chapter 7 sprite variants

Date: 2026-08-03

## Generation pipeline

- Tool mode: built-in ImageGen, identity-preserving edits for existing characters and a reference-aligned base design for young Maruo.
- Working background: flat chroma key `#00FF00`.
- Matte extraction: `remove_chroma_key.py` with soft matte, transparent threshold 40, opaque threshold 160, despill, and 1 px edge contraction.
- Runtime normalization: `scripts/normalize_sprite_pose_variant.py` against an approved sprite from the same character set.
- Runtime formats: transparent PNG production masters plus transparent WebP game assets.

## Shared visual contract

All prompts requested a single centered visual-novel character, polished modern anime cel shading, clean line art, coherent anatomy, no text, no props, no cast shadow, no floor, and no background elements. Character identity, age, hair, eyes, wardrobe colors, and recurring accessories were locked between variants. Only expression, pose, and the story-specific wardrobe layer were allowed to change.

## Aoi — adult bakery wardrobe

Identity and wardrobe prompt:

> Preserve adult Aoi's face, pink hair, blue eyes, proportions, and established anime rendering. Dress her in the same pink/cream/navy outfit used by her younger design, now adapted for bakery work with one consistent cream apron. Keep the full sprite centered on a flat `#00FF00` background.

Variant deltas:

- `bakery_ill`: visibly exhausted and unwell, weak posture, one hand near her chest, subdued worried expression.
- `bakery_maternal`: gentle reassuring smile, relaxed nurturing posture, hands held softly near the apron.
- `bakery_cheerful_peace`: bright smile with a playful peace sign and an energetic bakery-owner silhouette.
- `bakery_determined`: renewed resolve, confident expression, one compact fist near her chest.

Runtime directory: `public/images/characters/aoi/bakery/`

Review sheet: `artwork/bocetos/characters/chapter_07_aoi_bakery_sprites/aoi_bakery_expression_sheet.png`

ImageGen source files:

- `exec-252e92a0-0a06-495d-a960-d82c68fc26e1.png`
- `exec-f607daa5-de46-4910-8ab4-cb469753ab9e.png`
- `exec-85e7a2fe-93a4-4d3f-b5e2-a37edf3c95af.png`
- `exec-66408b48-d736-4f80-94fb-55fd7196741d.png`

## Isanari — young pose diversity

Identity and wardrobe prompt:

> Preserve young Isanari exactly: short spiky sandy-blond hair, amber-brown eyes, small black stud earring, slim-athletic teenage proportions, open black long-sleeve button-up shirt, plain white crew-neck T-shirt, and black trousers. Match the approved visual-novel sprite rendering and keep each gesture compact enough for the runtime canvas.

Variant deltas:

- `flustered`: strong blush and embarrassed tension, one hand behind his neck, the other in his pocket.
- `determined`: focused expression, one fist held against his chest, the other hand in his pocket.
- `shocked`: very wide eyes, open mouth, sweat drops, torso recoiling, one open palm raised in a startled stop gesture, and the other hand against his upper chest.

The `shocked` generation arrived as a full-body composition. It uses `--source-visible-ratio 0.72 --center-on-canvas` so its head and torso match the established cropped VN framing instead of appearing smaller.

Runtime directory: `public/images/characters/isanari_young/`

Review sheet: `artwork/bocetos/characters/chapter_07_isanari_young_pose_sprites/isanari_young_expression_sheet.png`

Previous runtime and production versions are preserved under `artwork/bocetos/characters/chapter_07_isanari_young_pose_sprites/iterations/v1_before_pose_diversity/`.

ImageGen source files:

- `exec-788f7c57-b9c8-4eb8-8aa0-6d4a232b7b01.png`
- `exec-42c14e21-b32e-4686-9a2e-91a2cdfaa416.png`
- `exec-13b028f5-91f3-4356-b61b-f9f2d1e92509.png`

## Maruo — young base set

Base-design prompt:

> Create a recognizable younger Maruo as a disciplined Japanese high-school student: center-parted black hair, narrow gray-brown eyes, slim teenage build, restrained facial acting, and an immaculate traditional black gakuran. Match the line weight, proportions, and cel shading of the approved young Isanari sprites. Keep one character centered on flat `#00FF00`.

Variant deltas:

- `neutral`: composed posture, one hand holding the opposite wrist in front.
- `stern`: skeptical expression with arms crossed.
- `awkward`: glancing aside with faint blush and sweat, one hand adjusting his collar.

Runtime directory: `public/images/characters/maruo_young/`

Review sheet: `artwork/bocetos/characters/chapter_07_maruo_young_sprites/maruo_young_expression_sheet.png`

ImageGen source files:

- `exec-209abce5-167a-4525-986c-41054efd9087.png`
- `exec-208183ca-77de-4eea-9290-d065b6c91c89.png`
- `exec-b954ae71-afa8-4386-b666-5e510c062bbb.png`

## Story integration

- Teen school sequence: young Isanari now changes between `neutral`, `determined`, and `shocked`; young Maruo changes between `neutral`, `stern`, and `awkward`.
- Adult bakery sequence: Aoi now uses the bakery wardrobe and switches between `ill`, `maternal`, `cheerful_peace`, and `determined` acting beats.
- The integration is intentionally limited to Chapter 7; later chapters can reuse a design only when wardrobe, day continuity, and dramatic beat support it.
