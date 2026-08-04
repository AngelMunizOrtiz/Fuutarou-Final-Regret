# Fuutarou: parka definitiva del capítulo 8

Estado: integrado.

## Diseño elegido

- Candidato seleccionado: opción 6.
- Vestuario: parka larga grafito/carbón hasta medio muslo, tela impermeable mate, silueta masculina ligeramente entallada, cierre y broches ocultos, cuello alto, capucha descansando detrás del cuello, forro azul marino discreto y bolsillos verticales.
- Capas conservadas: camiseta azul marino y pantalón negro.
- Modo: ImageGen integrado, edición con preservación de identidad.
- Referencia de vestuario: `artwork/bocetos/characters/chapter_08_fuutarou_rainwear_candidates/chroma/06_graphite_longline_parka.png`.

## Prompt final común

Cada generación usó Image 1 como objetivo exacto de identidad, expresión y pose, e Image 2 únicamente como referencia de vestuario. Se solicitó reemplazar sólo la chaqueta corta por la parka grafito y preservar rostro, ojos dorados, cabello y ahoge, anatomía, expresión, postura, manos, dedos, utilería propia de la pose, cámara, recorte, línea y sombreado. Se prohibió copiar la expresión o postura neutral de Image 2.

Las salidas se pidieron con un único Fuutarou adulto sobre fondo uniforme `#00FF00`, sin lentes, paraguas, bolso, motocicleta, lluvia, escenario, texto ni marcas de agua; la capucha debía permanecer detrás del cuello.

## Variantes y fuentes ImageGen

- `chapter_08_neutral`: expresión neutral y cuaderno sostenido a la altura del pecho.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-8068ced0-b938-4965-a37a-8e39fc8813e8.png`
- `chapter_08_annoyed`: ceño molesto y ambas manos en los bolsillos.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-73809478-52ce-4af1-a8fb-db6b580dc2ba.png`
- `chapter_08_surprised`: ojos abiertos, boca entreabierta y brazos relajados.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-2e058e60-1d9e-4e55-8e10-2eaecd194d05.png`
- `chapter_08_hand_cover`: rubor, mano cubriendo la boca y otra mano elevada.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-2370b52c-8672-4a90-b683-d6d71474a2ff.png`
- `chapter_08_neck_scratch`: gesto incómodo, mano detrás de la nuca y mano en el bolsillo.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-d41e4074-d263-4479-89a7-5b51e4e8b4f5.png`
- `chapter_08_worried`: mirada baja, mano sujetando el borde de la parka y mano en el bolsillo.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-71b5c703-2fb0-42ea-8bee-f712d8cd87fe.png`
- `chapter_08_determined`: puño al pecho y mano abierta extendida.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-f4c2df8e-ce4f-494b-9d24-4758fd9861f5.png`
- `chapter_08_soft_smile`: sonrisa suave, una mano en el bolsillo y otra relajada.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-79ce02e7-4dc6-4329-9a3b-9f9ba4b1688b.png`

## Procesamiento e integración

- Chroma retirado con soft matte, despill, umbrales 40/160 y contracción de borde de 1 px.
- Cada pose normalizada contra su equivalente `chapter_01` a un canvas `620x876`.
- Maestros PNG: `artwork/fuentes/production-originals/characters/fuutarou/chapter_08/`.
- Runtime WebP: `public/images/characters/fuutarou/chapter_08/`.
- Registro: ocho claves nuevas `chapter_08_*` en `src/data/characterSprites.ts`.
- Ink: las 33 llamadas de Fuutarou en el capítulo 8 usan las variantes exclusivas de parka.
- Lámina final: `artwork/bocetos/characters/chapter_08_fuutarou_rainwear_final/fuutarou_chapter_08_rainwear_expression_sheet.png`.
- Validación de assets: aprobada.
