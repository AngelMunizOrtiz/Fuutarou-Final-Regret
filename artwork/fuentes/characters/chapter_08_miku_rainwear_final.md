# Miku: parka definitiva del capítulo 8

Estado: integrado.

## Diseño elegido

- Candidato seleccionado: opción 2.
- Vestuario: parka impermeable ligera camel/taupe, corte A hasta medio muslo, cintura suavemente marcada, cierre central oculto, capucha descansando detrás de los hombros, detalles azul marino y capa interior azul marino.
- Modo: ImageGen integrado, edición con preservación de identidad.
- Referencia de vestuario: `artwork/bocetos/characters/chapter_08_miku_rainwear_candidates/chroma/02_taupe_hooded_parka.png`.

## Prompt final común

Cada generación usó dos entradas: Image 1 como objetivo exacto de pose y expresión, e Image 2 únicamente como referencia del vestuario. Se pidió reemplazar sólo la ropa de Image 1 por la parka elegida y preservar exactamente rostro, ojos, expresión, lágrimas o rubor, cabello, anatomía, proporciones de busto, pose, manos, dedos, cámara, recorte, línea, color y sombreado. Se prohibió copiar el rostro o la pose neutral de Image 2.

Todas las salidas se solicitaron con una sola Miku sobre fondo uniforme `#00FF00`, sin audífonos, sombrero, paraguas, bolso, utilería, lluvia, escenario, texto ni marcas de agua; la capucha debía descansar detrás de los hombros.

## Variantes y fuentes ImageGen

- `chapter_08_startled_retreat`: retirada sorprendida, ojos abiertos y dos manos elevadas.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-aa174366-2051-4631-ab0c-c944f26ebd87.png`
- `chapter_08_crying_guarded`: llanto, mano sobre el ojo y brazo protegiendo el cuerpo.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-fccc943e-c024-40c7-a5b5-a972003a4118.png`
- `chapter_08_playful_resolved`: sonrisa decidida, mano al pecho y mano a la cadera.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-a2289075-6ec8-41a2-a134-3efb965bd897.png`
- `chapter_08_gentle`: sonrisa suave y mano cerca del pecho.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-eb9b069c-acbc-446f-9da7-a496b1f16fc9.png`
- `chapter_08_serious`: mirada serena y brazos cruzados.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-d7b76461-0864-4f72-8db3-089924ca7ea0.png`
- `chapter_08_embarrassed`: postura tímida y manos juntas.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-5db520fe-7105-4f6f-bad0-f8444afd80c1.png`
- `chapter_08_warm_laugh`: ojos cerrados, mano cubriendo la risa.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-e084ab34-3164-4dc6-84c0-823f21fc8db5.png`
- `chapter_08_thoughtful`: mirada baja, mano en el mentón y brazo de apoyo.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-378b7530-9c9c-428f-ac01-1147b37ea29c.png`
- `chapter_08_hurt`: expresión dolida, mano al pecho y postura protectora.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-3f000350-3fcf-4aec-843d-dbf2db496f06.png`
- `chapter_08_teary_smile`: sonrisa con lágrimas y manos entrelazadas.
  - `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-fd80c3e1-c9c3-4f42-bd90-24e4425208aa.png`

## Procesamiento e integración

- Chroma retirado con soft matte, despill, umbrales 40/160 y contracción de borde de 1 px.
- Cada pose normalizada contra su sprite anterior a un canvas `620x876`.
- Maestros PNG: `artwork/fuentes/production-originals/characters/miku/chapter_08/`.
- Runtime WebP: `public/images/characters/miku/chapter_08/`.
- Registro: siete claves adicionales `chapter_08_*` en `src/data/characterSprites.ts`.
- Ink: las 32 llamadas genéricas de Miku se cambiaron a sus variantes exclusivas del capítulo 8.
- Lámina final: `artwork/bocetos/characters/chapter_08_miku_rainwear_final/miku_chapter_08_rainwear_expression_sheet.png`.
- Validación de assets y compilación de producción: aprobadas.
