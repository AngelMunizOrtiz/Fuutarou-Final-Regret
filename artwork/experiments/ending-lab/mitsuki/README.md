# Capas de Mitsuki para el ending interactivo

Generadas el 6 de septiembre de 2026 con ImageGen integrado, sin CLI/API.
Fuente: `public/images/cg/epilogue-mitsuki/background-fixed/mitsuki-pov-sad-normal-eyes-house-bg-cg-draft-v2.png`.

- `mask.png`: silueta blanca de Mitsuki sobre negro. El color del personaje se extrae del CG original.
- `room.png`: suelo reconstruido sin Mitsuki, conservando el adulto del primer plano.
- `blink.png`: variante de ojos cerrados. Solo se utilizan dos regiones de ojos con bordes suavizados.

Empaquetado: `scripts/prepare-mitsuki-live-assets.mjs`. Los derivados WebP y sus coordenadas están en `experiments/ending-lab/assets/mitsuki/`.
Maestros originales conservados. El tratamiento neón se aplica en Canvas a las texturas durante la ejecución, sin reemplazar estos PNG.

## Prompts exactos

### mask

Edit target: the attached anime CG. Create a precise binary segmentation matte for animation, same full canvas 1672x941 and EXACT same registration. Solid white only for the entire small black-haired child standing in the center, including every hair tuft, face, orange bear pajamas, hands and feet. Solid pure black for everything else, including tile floor, shadows, wooden step, and the adult in the lower foreground. No gray shading, no line details inside white silhouette, no borders, no labels. Do not shift, crop, enlarge or redraw the silhouette. This is a technical black/white alpha matte, not an illustration.

### room

Edit target: the attached anime CG. Produce a clean background plate for subtle parallax animation. Remove ONLY the small black-haired child in orange bear pajamas in the center and her cast shadow. Seamlessly reconstruct the warm tiled genkan floor, continuing the exact perspective grid and warm light. Keep the adult suit/hand in the lower foreground and wooden step left EXACTLY unchanged. Keep exact original 1672x941 frame, perspective, color, lighting, anime line style and all other pixels as closely as possible. No other edits, no new objects, no zoom or camera change.

### blink

Edit target: the attached anime CG. Make ONE very small edit for an animation frame: the black-haired child has both eyes gently CLOSED in a natural blink, thin curved closed eyelids in exactly the positions of her open eyes. Preserve the original timid neutral mouth and expression. Preserve her identity, hair strands, head tilt, cheeks, face shape, pose, body, pajamas, adult foreground, floor, lighting, colors and ALL framing EXACTLY. Same 1672x941 full canvas. No smiling change, no camera or head movement. Only replace the two open eye regions with natural closed eyelids matching the anime line art.

