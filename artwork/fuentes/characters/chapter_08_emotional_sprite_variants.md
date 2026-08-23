# Chapter 8 emotional sprite variants

Date: 2026-08-03

## Scope decision

This pass adds the missing emotional acting while preserving the currently approved outfits. A weather-specific coat or rainwear redesign is intentionally deferred to a separate wardrobe pass.

## Production mode

- Tool: built-in ImageGen.
- Use case: `identity-preserve` edits from approved local sprite anchors.
- Working background: flat chroma key `#00FF00`.
- Matte extraction: soft matte, transparent threshold 40, opaque threshold 160, despill, and 1 px edge contraction.
- Runtime normalization: `scripts/normalize_sprite_pose_variant.py` against the approved character/outfit anchor, centered on a `620x876` canvas.

## Shared prompt contract

All six prompts required one centered three-quarter visual-novel character, matching the approved anime cel shading, apparent age, face, hair, eyes, body proportions, clothing design, and palette. They prohibited scenery, rain effects, floor, cast shadow, text, watermark, props, extra anatomy, and wardrobe changes. The lower body was allowed to continue beyond the bottom crop so the generated character scale would match the existing sprites instead of becoming a small full-body figure.

## Miku

Anchor wardrobe: beige long-sleeve turtleneck beneath the established deep indigo/navy sleeveless dress; long loose reddish-orange hair; blue eyes; no headphones or outerwear.

Prompt deltas:

- `chapter_08_startled_retreat`: eyes wide, intense blush, mouth slightly open, torso leaning backward, and two compact defensive open palms. Emotionally overwhelmed rather than frightened.
- `chapter_08_crying_guarded`: lowered head, streaming tears, trembling mouth, one hand partially covering her eyes, and the other arm supporting that elbow across her torso.
- `chapter_08_playful_resolved`: warm knowing smile, open eyes, moderate blush, one hand at her waist and the other near her chest; affectionate confidence without changing her gentle personality.

ImageGen source files:

- `exec-4ea5b784-e6c6-46e8-9c9c-381786f949ca.png`
- `exec-bbc99d80-5284-4cb1-9587-1c2c7c1135ef.png`
- `exec-c92d5209-c00d-4767-b41c-c109f52d96e6.png`

Runtime directory: `public/images/characters/miku/chapter_08/`

Review sheet: `artwork/bocetos/characters/chapter_08_miku_emotional_sprites/miku_chapter_08_expression_sheet.png`

## Fuutarou

Anchor wardrobe: the approved Chapter 1 travel outfit—open taupe-gray lightweight zip jacket, plain dark navy crew-neck T-shirt, and black trousers.

Prompt deltas:

- `chapter_01_worried`: concerned lowered gaze, restrained sweat, shoulders slightly forward, one hand gripping the jacket near his chest, and the other in a pocket.
- `chapter_01_determined`: squared posture, focused sincere expression, one hand against his heart, and the other offered forward with an open palm.
- `chapter_01_soft_smile`: small relieved smile, relaxed shoulders, one hand in a pocket, and the other arm resting openly at his side; no notebook.

ImageGen source files:

- `exec-80364f7c-a87a-4b41-873d-9cbe4d3c44dd.png`
- `exec-13bfe95d-ea0f-463f-b6b1-e1834f4e3987.png`
- `exec-7fc6a193-2198-4e9f-9451-538a24c825e8.png`

Runtime directory: `public/images/characters/fuutarou/chapter_01/`

Review sheet: `artwork/bocetos/characters/chapter_08_fuutarou_emotional_sprites/fuutarou_chapter_08_expression_sheet.png`

## Story integration

- Existing Miku poses now cover ordinary conversation, teasing, reflection, embarrassment, pain, and relief instead of leaving one expression on screen for long stretches.
- The new Miku poses mark the accidental confession, her guarded breakdown, and her confident acceptance.
- Fuutarou now appears on the left during the main conversation using the same outfit established immediately before this chapter.
- The new Fuutarou poses mark guilt, deliberate confession, and post-acceptance relief.
- The Chapter 8 extra now displays and changes both characters rather than remaining sprite-free.
