# Nino — capítulo 11: jefa de cocina

## Diseño aprobado

Se adoptó la opción 4 del muestrario: chaqueta profesional blanca de cuello mandarín, panel frontal asimétrico y puños borgoña, botones oscuros, delantal negro largo, pantalón de trabajo negro y calzado profesional negro antideslizante.

Los dos grandes lazos mariposa negro carbón forman parte de la identidad visual bloqueada. Ambos deben permanecer completos y visibles en cualquier variante futura de este vestuario.

## Variantes finales

- `chapter_11_chef_unfazed`: seguridad serena y desafiante; una mano en la cadera y la otra abierta en un gesto casual de “¿y qué?”.
- `chapter_11_chef_rallying`: liderazgo enérgico; puño determinado cerca del pecho y brazo contrario extendido para movilizar al equipo.

## Fuentes y proceso

- Muestrario aprobado: `artwork/bocetos/characters/chapter_11_nino_chef_candidates/nino_chapter_11_chef_candidates.png`
- Lámina final: `artwork/bocetos/characters/chapter_11_nino_chef_final/nino_chef_final_contact_sheet.png`
- Referencia de identidad: `artwork/fuentes/production-originals/characters/nino/chapter_11/nino_commanding.png`
- Generación: ImageGen integrado, modo edición con referencias locales.
- Identificadores de salida: `exec-f1b50b47-b526-4c00-b691-3b7380cdc7de` y `exec-ff02652d-ab98-414e-96c8-4fe80e85ab71`.
- Resumen del prompt: conservar la identidad adulta de Nino, ambos lazos, el uniforme exacto de la opción 4 y producir dos poses corporales diferenciadas sobre croma verde puro.
- El fondo `#00FF00` se retiró con borde suavizado, contracción de un píxel y limpieza de derrame verde.
- Las poses se normalizaron a `620x876`, centradas en el lienzo y ancladas contra `public/images/characters/nino/chapter_10/nino_neutral.webp`.

## Archivos de producción

- Máster PNG: `artwork/fuentes/production-originals/characters/nino/chapter_11/nino_chef_unfazed.png`
- Máster PNG: `artwork/fuentes/production-originals/characters/nino/chapter_11/nino_chef_rallying.png`
- Runtime WebP: `public/images/characters/nino/chapter_11/nino_chef_unfazed.webp`
- Runtime WebP: `public/images/characters/nino/chapter_11/nino_chef_rallying.webp`
- Registro: `src/data/characterSprites.ts`

No se modificó `chapter_11.ink`: el montaje actual sigue conducido por CG y este lote queda listo para una integración narrativa posterior, cuando corresponda.
