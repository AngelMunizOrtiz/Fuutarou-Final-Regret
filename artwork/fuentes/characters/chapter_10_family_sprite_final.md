# Capítulo 10: sprites definitivos de la familia

Fecha: 2026-08-09

## Alcance

Este lote completa los sprites visibles de Raiha, Isanari y Maruo durante la boda. Los tres conservan un solo vestuario durante todo el capítulo. Los CG no se modificaron y deberán alinearse posteriormente con estos diseños definitivos.

## Vestuarios bloqueados

- Raiha: uniforme marinero azul marino de manga corta, ribetes y gran pañuelo amarillo mostaza, falda plisada azul marino, cabello casi negro muy largo y moño rosa.
- Isanari: traje azul marino de dos piezas, camisa blanca, corbata lisa plateada muy clara y gafas negras sobre la cabeza.
- Maruo: traje carbón muy oscuro de dos piezas, camisa blanca y corbata lisa plateada muy clara.

Referencias aportadas por el usuario:

- `artwork/fuentes/characters/chapter_10_raiha_uniform_reference.png`.
- `artwork/fuentes/characters/chapter_10_isanari_maruo_wedding_reference.png`.

## Variantes finales

- Raiha (4): `bright_laugh`, `surprised_shy`, `exasperated`, `cheerful_wave`.
- Isanari (3): `protective_alarm`, `boisterous_laugh`, `proud_emotional`.
- Maruo (3): `composed`, `pained_reflection`, `soft_smile`.

## Producción

- Herramienta: ImageGen integrado, modo de preservación de identidad; una llamada independiente por variante.
- Cada base se produjo con la referencia de vestuario aportada y un sprite aprobado como ancla de identidad.
- Las variantes posteriores reutilizaron la base definitiva como bloqueo de vestuario y los sprites antiguos únicamente como guía de expresión y gesto.
- Fondo de trabajo: `#00FF00`.
- Extracción: mate suave, umbral transparente 40, umbral opaco 160, despill y contracción de borde de 1 px.
- Normalización: `scripts/normalize_sprite_pose_variant.py`, centrada sobre lienzo de `620x876`.
- Runtime: PNG maestro transparente y WebP transparente.

## Fuentes generadas

### Raiha

- `bright_laugh`: `exec-f85e4104-5659-47e2-a162-98f9bd1524c1.png`.
- `surprised_shy`: `exec-bfb6801c-56fc-4ca5-9dda-6b33b278130b.png`.
- `exasperated`: `exec-442d1669-4edb-46ac-bd31-872c877d1755.png`.
- `cheerful_wave`: `exec-b3606d23-3ec8-4afd-aed4-6728b7e45938.png`.

### Isanari

- `protective_alarm`: `exec-b13db4de-efc2-477b-a67c-9b7352d8a33a.png`.
- `boisterous_laugh`: `exec-3067efa1-e021-4d5b-9162-9dbf535341a5.png`.
- `proud_emotional`: `exec-834c9b09-41b5-4527-b987-1d0ddfc38d80.png`.

### Maruo

- `composed`: `exec-e6dfd84b-90cd-4e5c-9707-63b80ac34ff3.png`.
- `pained_reflection`: `exec-a92bddab-1634-4ddc-bb31-4c93cd6b5353.png`.
- `soft_smile`: `exec-08107cdd-5bf4-4724-a3e3-f5bc63901f1a.png`.

## Ubicaciones

- Fuentes cromáticas y recortes: `artwork/bocetos/characters/chapter_10_<personaje>_wedding_sprites/`.
- Maestros: `artwork/fuentes/production-originals/characters/<personaje>/chapter_10/`.
- Runtime: `public/images/characters/<personaje>/chapter_10/`.
- Láminas de revisión: `artwork/bocetos/characters/chapter_10_<personaje>_wedding_sprites/<personaje>_chapter_10_expression_sheet.png`.

## Integración narrativa

- Raiha cambia entre alegría, ilusión romántica, vergüenza ante su padre y saludo al entregar las cartas.
- Isanari aparece con alarma protectora, risa festiva y calidez durante el baile con Miku.
- Maruo aparece compuesto, incómodo por haber llorado y finalmente afectuoso al pedirle a Fuutarou que cuide de Miku.
- Las diez claves usan el prefijo `chapter_10_` en `src/data/characterSprites.ts` y se distribuyen dentro de `src/ink/chapters/chapter_10.ink`.
