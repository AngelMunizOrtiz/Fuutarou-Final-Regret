# Capítulo 11: sprite definitivo de Ichika para la panadería

Estado: vestuario aprobado, lote expresivo producido, normalizado y registrado para runtime.

## Vestuario aprobado

Opción 1 de la hoja comparativa: abrigo trench ligero color camel, llevado abierto; top negro entallado de punto con cuello alto; pantalón marfil de tiro alto y corte recto hasta el tobillo; mocasines de cuero color tostado. Conserva la identidad adulta de Ichika, sus ojos azules y el cabello rosa corto con mechón frontal asimétrico.

## Variantes

- `warm_explain`: sonrisa cálida y gesto abierto para explicar que la panadería también es su hogar y hablar de las remodelaciones.
- `awkward_reaction`: media sonrisa incómoda, gota de sudor sutil y mano en el cuello para reaccionar al nombre de la panadería.

## Producción

- Modo: ImageGen integrado con preservación de identidad y vestuario.
- Prompt resumido: conservar exactamente la identidad adulta de Ichika y la opción 1 aprobada; mantener abrigo, top, pantalón, calzado, proporciones y peinado; variar únicamente la expresión y el gesto; cuerpo completo sobre fondo verde plano, sin accesorios, texto, sombras ni escenario.
- Hoja de candidatos: `artwork/bocetos/characters/chapter_11_ichika_bakery_candidates/ichika_chapter_11_bakery_candidates.png`.
- Hoja final: `artwork/bocetos/characters/chapter_11_ichika_bakery_final/ichika_final_contact_sheet.png`.

### Procedencia de ImageGen

| Variante | Fuente generada |
|---|---|
| warm_explain | `exec-7c0d49ea-aa6c-4841-abd9-cefe2ca8eb8c.png` |
| awkward_reaction | `exec-f9a443da-e7b6-4a05-9334-82704d62d0f4.png` |

## Procesamiento y rutas

- Extracción del croma verde mediante mate suave, despill y contracción de borde.
- Normalización por altura visible contra `chapter_10/ichika_warm_smile.webp`, centrada en el lienzo para acomodar el gesto abierto.
- Salida estándar `620 × 876`, alfa real y anclaje inferior común.
- Maestros PNG: `artwork/fuentes/production-originals/characters/ichika/chapter_11/`.
- Runtime WebP: `public/images/characters/ichika/chapter_11/`.
- Registro: `src/data/characterSprites.ts`.

El guion de `chapter_11.ink` permanece intacto mientras la visita a la panadería continúe presentada mediante CG.
