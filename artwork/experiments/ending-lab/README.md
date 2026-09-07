# Derivados de Miku para la prueba de ending

Fecha: 6 de septiembre de 2026. Herramienta: ImageGen integrada (sin CLI/API).

Fuente: `public/images/cg/chapter_08/cg_041a_miku_answer_permission.png`.
Solo prototipo; estos derivados no son assets finales aprobados ni se importan al juego.

- `street-clean.png`: fondo reconstruido sin Miku.
- `miku-mask.png`: máscara generada; se aplica al CG original para conservar sus colores y diseño.
- `miku-closed.png`: variante de parpadeo; solo se empaquetan dos zonas pequeñas de los ojos.
- Un intento de recorte directo devolvió un damero opaco (sin canal alfa) y fue descartado. No se usa en el proyecto.

Los WebP de ejecución se generan con `scripts/prepare-ending-lab-assets.mjs`. Las variantes ligeras miden 1152 px de ancho. El script no cambia los maestros.

## Prompts utilizados

### background

Use case: precise-object-edit. Asset type: clean background plate for a layered visual-novel animation prototype. Input image is the edit target. Remove ONLY Miku, the orange-haired woman centered in the foreground, including her entire coat, body, head, hair and hands. Reconstruct the wet cobblestone street underneath with the existing perspective. Keep every visible street/building/plant/reflection detail outside her silhouette unchanged. Preserve the original camera, framing, canvas aspect 16:9 and image registration exactly; do not zoom, crop, shift or invent a new street. Same anime painting style and overcast light. No people, no text. Output one full-frame background image, preferably 1672 x 941.

### miku (intento descartado)

Use case: background-extraction. Asset type: transparent character plate for a layered visual-novel animation prototype. Input image is the edit target. Extract ONLY Miku, the orange-haired woman in the foreground, onto a genuinely transparent alpha background. Preserve her exact original pixels/design, position and scale on the original full 16:9 canvas: top of hair is cropped by the top border, lower coat cropped by bottom border. Keep her blue eyes OPEN, facial expression, eyebrows, mouth, tear detail, hairstyle, coat, right hand over chest and other hand at her side identical. Remove all scenery outside her silhouette. Do NOT recenter, resize, change pose, add feet, invent hair above the top border or place a checkerboard. Preserve full-frame image registration for compositing over the source. Prefer 1672 x 941 canvas.

### mask

Use case: precise-object-edit. Asset type: grayscale alpha matte for compositing the supplied image. Produce ONLY a perfectly registered binary silhouette mask: every pixel occupied by Miku (hair, face, body, coat and both hands) pure solid WHITE (#ffffff), every background street pixel pure solid BLACK (#000000). Include the gaps between her arms/hair as black wherever original scenery is visible. Her hair touches the top canvas edge and her coat touches the bottom edge. Exact 1672 x 941 original frame, exact silhouette position and contour; do not move, crop or resize the subject. No internal details, no face lines, no checkerboard, no shading, no scenery, no text, just white foreground silhouette on pure black.

### closed

Use case: precise-object-edit. Asset type: closed-eye blink frame for the supplied visual-novel CG. Change ONLY Miku's two eyes to naturally closed eyelids in a relaxed blink: delicate curved upper lash lines following her tilted face, eyelashes matching the source. Keep her eyebrow positions/expression, smile, tears, cheeks and all face landmarks exactly as original. Preserve the rest of the entire image pixel-for-pixel, identical frame 1672 x 941, exact pose, camera, hair, face scale and registration. No head movement, no change in lighting, no text. This will be overlaid only at the eye region, so exact alignment is essential.
