# Bases de personajes jovenes

Fecha de produccion: 2026-07-24

Las imagenes se generaron con la herramienta integrada de ImageGen sobre un fondo chroma `#00ff00`.
Los fondos se retiraron localmente con `remove_chroma_key.py`, conservando un PNG maestro con transparencia y un WebP para el runtime.

## Isanari joven

Referencias:

- `codex-clipboard-d0f67425-5cd8-4723-850c-575fc35aa618.png`: rostro adolescente del manga.
- `codex-clipboard-5e7e62d1-0cee-4195-8254-63e056f7f387.png`: rostro junto a Aoi y el bebe.
- `public/images/characters/isanari/isanari_neutral.webp`: continuidad del sprite adulto.

Prompt final:

```text
Use case: identity-preserve
Asset type: production character sprite seed for a 2D anime visual novel
Input images: Image 1 and Image 2 are identity and age references for teenage Isanari Uesugi from the manga; Image 3 is the existing adult Isanari in-game sprite and establishes the project's clean anime rendering, amber eye color, blond palette, body scale, line quality, and visual continuity.
Primary request: create teenage/young Isanari Uesugi as one clean character sprite, clearly the younger version of Image 3 and faithfully recognizable from Images 1–2.
Subject: teenage Japanese boy, short spiky sandy-blond hair, amber eyes, slightly sharp eyebrows, confident delinquent smirk, small silver ear piercing, lean youthful build. Dark charcoal open-collar school shirt layered over a plain light undershirt, simple dark trousers. Relaxed three-quarter-front stance, one hand resting casually near a pocket, the other arm visible and relaxed. No goggles yet, no beard, no adult muscular build.
Style/medium: polished clean 2D anime visual-novel sprite, crisp controlled line art, moderate cel shading, matching the existing in-game sprite family rather than manga screentones.
Composition/framing: single character only, full figure from head to approximately mid-thigh, centered, facing mostly forward, generous padding around hair, elbows and torso, bottom-center anchor suitable for the dialogue stage.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later removal. One uniform color only, no floor plane.
Constraints: preserve the character identity cues from the references; anatomically natural hands; production asset tone; crisp silhouette; no scenery, no text, no speech bubbles, no panel border, no labels, no watermark, no cast shadow, no contact shadow, no reflection. Do not use #00ff00 anywhere in the subject.
Avoid: extra characters, baby, Aoi, glasses or goggles, modern adult outfit, photorealism, 3D rendering, cropped hair, cropped hands, exaggerated action pose.
```

## Fuutarou nino

Referencias:

- `codex-clipboard-39f36d6a-af8c-4cb1-8018-89c479bfd0d6.png`: apariencia y vestuario canonico.
- `codex-clipboard-ba48a301-8425-4c77-a69e-5fce3fcea086.png`: fotografia completa de la escena.
- `public/images/characters/fuutarou/fuutarou_neutral.webp`: continuidad con su version adulta.

Prompt final:

```text
Use case: identity-preserve
Asset type: production character sprite seed for a 2D anime visual novel
Input images: Images 1–2 are the canonical appearance and outfit references for child Fuutarou Uesugi; Image 3 is the existing adult Fuutarou in-game sprite and establishes the project's clean anime rendering, amber eyes, facial lineage, body staging, line quality, and visual continuity.
Primary request: create child Fuutarou Uesugi as one clean character sprite, faithfully recognizable as the guarded blond boy in Images 1–2 and clearly the younger version of Image 3.
Subject: Japanese boy around eleven years old, age-appropriate child proportions and slim build, short tousled dyed blond hair with uneven spikes, amber-gold eyes, slightly lowered sharp eyebrows, small guarded neutral scowl with a hint of stubbornness, one small silver hoop earring. Wear the same dark burgundy zip hoodie over a plain white shirt and the same light beige diagonal shoulder-bag strap seen in Images 1–2. Hands relaxed and fully visible; no bag body necessary if it falls below the crop.
Style/medium: polished clean 2D anime visual-novel sprite, crisp controlled line art and moderate cel shading, matching the existing in-game sprite family rather than a screenshot or manga panel.
Composition/framing: single character only, full figure from head to approximately mid-thigh, centered and facing mostly forward, neutral reusable dialogue pose, generous padding around hair, shoulders, elbows and torso, bottom-center anchor suitable for the dialogue stage.
Scene/backdrop: perfectly flat solid #00ff00 chroma-key background for later removal. One uniform color only, no floor plane.
Constraints: preserve child age and identity, outfit colors and earring from the references; production asset tone; anatomically natural age-appropriate hands; crisp silhouette; no scenery, no text, no speech bubbles, no panel border, no labels, no watermark, no cast shadow, no contact shadow, no reflection. Do not use #00ff00 anywhere in the subject.
Avoid: extra characters, pink-haired girl, adult or teenage body, black hair, adult blue jacket, muscular build, photorealism, 3D rendering, cropped hair, cropped hands, exaggerated action pose.
```

## Hojas de expresiones

Fecha de produccion: 2026-07-24

Modo de herramienta: edicion con ImageGen integrado, usando cada PNG neutral aprobado como ancla de identidad. Cada personaje se genero en una sola hoja horizontal para mantener rostro, pose, vestuario y escala. Despues se retiro el chroma localmente y cada cuadro se normalizo contra el lienzo neutral con `scripts/process_sprite_expression_sheet.py`.

### Isanari joven: cuatro expresiones

```text
EDIT the supplied approved young Isanari anime visual-novel sprite into one production expression sheet. Keep his identity EXACTLY the same as the reference: same facial structure, short sandy-blond hair, amber eyes, silver ear stud, black open short-sleeve shirt over a plain white T-shirt, same proportions, line quality, cel shading, body pose, camera angle, and head-to-mid-thigh framing. Output ONE wide horizontal strip containing EXACTLY FOUR equal-width character slots in one row, left to right, with one isolated full figure per slot and generous separation; no overlap and every body fully inside its slot. Expressions in exact order: (1) visibly flustered and embarrassed during a confession, blush, slightly tense mouth; (2) shocked and panicked, widened eyes and open mouth; (3) sincere, earnest and determined, focused eyes, firm but gentle mouth; (4) warm tender smile, relaxed eyes, affectionate calm. Expression changes only: do not redesign the pose, hair, clothing, accessories, or anatomy. Use a perfectly flat uniform chroma-key background of pure #00FF00 behind the entire strip. No shadows on the background, no gradient, no texture, no glow, no border, no panel lines, no labels, no text, no props, no extra characters, no duplicate limbs, no transparent checkerboard. Clean high-resolution polished 2D anime visual-novel sprite art.
```

### Fuutarou nino: dos expresiones

```text
EDIT the supplied approved child Fuutarou anime visual-novel sprite into one production expression sheet. Keep his identity EXACTLY the same as the reference: same young facial structure, short sandy-blond hair, amber eyes, silver hoop earring, burgundy zip hoodie over a white shirt, beige diagonal shoulder strap, dark shorts, child proportions, clean line quality, cel shading, body pose, camera angle, and full-body framing. Output ONE wide horizontal strip containing EXACTLY TWO equal-width character slots in one row, left to right, with one isolated full figure per slot and generous separation; no overlap and every body fully inside its slot including shoes. Expressions in exact order: (1) cheerful and genuinely excited while admiring his father's cool hair, bright eyes and an open delighted smile; (2) worried and frightened while asking whether his mother is okay, raised inner eyebrows, tense eyes, small uncertain mouth, restrained sadness but no tears. Expression changes only: do not redesign the pose, hair, clothing, shoulder strap, earring, or anatomy. Use a perfectly flat uniform chroma-key background of pure #00FF00 behind the entire strip. No shadows on the background, no gradient, no texture, no glow, no border, no panel lines, no labels, no text, no props, no extra characters, no duplicate limbs, no transparent checkerboard. Clean high-resolution polished 2D anime visual-novel sprite art.
```
