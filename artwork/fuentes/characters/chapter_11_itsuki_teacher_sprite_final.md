# Capítulo 11: sprite definitivo de Itsuki como profesora

Estado: vestuario aprobado, lote expresivo producido, normalizado y registrado para runtime.

## Vestuario aprobado

Opción 4 de la hoja comparativa: blusa verde salvia con lazo suave al cuello; cárdigan largo de punto color avena, llevado abierto; falda amplia de línea A color carbón y largo midi; mocasines marrón oscuro de tacón bajo. Conserva la identidad adulta de Itsuki, sus ojos azules, gafas azul oscuro, cabello rojo anaranjado largo y ahoge curvado.

Este atuendo corresponde a la breve escena laboral previa al salto de un año. No se reutiliza durante la visita posterior a la panadería.

## Variantes

- `teacher_attentive`: sonrisa atenta, ligera inclinación de cabeza y palma abierta para preguntar qué sucede.
- `teacher_eager_help`: sonrisa luminosa, gesto de ánimo y mano extendida para ofrecer ayuda.

## Producción

- Modo: ImageGen integrado con preservación estricta de identidad y vestuario.
- Prompt resumido: conservar exactamente la identidad adulta de Itsuki y la opción 4 aprobada; mantener cabello, ahoge, gafas, blusa, lazo, cárdigan, falda, calzado y proporciones; cambiar únicamente expresión y gesto; cuerpo completo sobre fondo magenta plano, sin accesorios, texto, sombras ni escenario.
- Hoja de candidatos: `artwork/bocetos/characters/chapter_11_itsuki_teacher_candidates/itsuki_chapter_11_teacher_candidates.png`.
- Hoja final: `artwork/bocetos/characters/chapter_11_itsuki_teacher_final/itsuki_teacher_final_contact_sheet.png`.

### Procedencia de ImageGen

| Recurso | Fuente generada |
|---|---|
| Hoja de candidatos | `exec-ed92c9a7-88d6-453b-8b96-e6abcd38bffe.png` |
| teacher_attentive | `exec-8c70ab94-d1d5-4db8-be2b-8050152340f7.png` |
| teacher_eager_help | `exec-5ec92e5f-42b6-41c6-a19d-2af0f464a7cf.png` |

## Procesamiento y rutas

- Extracción del croma magenta mediante mate suave, despill y contracción de borde para preservar la blusa verde.
- Normalización por altura visible contra `chapter_10/itsuki_warm.webp`, centrada en el lienzo para acomodar los gestos laterales.
- Salida estándar `620 × 876`, alfa real y anclaje inferior común.
- Maestros PNG: `artwork/fuentes/production-originals/characters/itsuki/chapter_11/`.
- Runtime WebP: `public/images/characters/itsuki/chapter_11/`.
- Registro: `src/data/characterSprites.ts`.

El guion de `chapter_11.ink` permanece intacto mientras el montaje profesional continúe presentado mediante CG.
