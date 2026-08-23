# Capítulo 11: sprite definitivo de Ichika en su carrera de actriz

Estado: vestuario aprobado, lote expresivo producido, normalizado y registrado para runtime.

## Vestuario aprobado

Opción 3 de la hoja comparativa: top entallado azul noche con escote barco y mangas tres cuartos; falda midi cobriza de tiro alto y corte asimétrico, con panel cruzado drapeado; botines negros de cuero con tacón de bloque. Conserva la identidad adulta de Ichika, sus ojos azules y el cabello rosa corto con mechón frontal asimétrico.

Este atuendo corresponde al montaje profesional donde su representante le comunica la nominación. No se reutiliza durante la visita posterior a la panadería.

## Variantes

- `actress_award_surprise`: sorpresa contenida, labios entreabiertos y mano sobre el pecho al recibir la noticia.
- `actress_determined`: sonrisa confiada, mano en la cadera y pequeño gesto de ánimo para decidir seguir trabajando duro.

## Producción

- Modo: ImageGen integrado con preservación estricta de identidad y vestuario.
- Prompt resumido: conservar exactamente la identidad adulta de Ichika y la opción 3 aprobada; mantener peinado, top, falda, panel asimétrico, botines y proporciones; cambiar únicamente expresión y gesto; cuerpo completo sobre fondo verde plano, sin accesorios, texto, sombras ni escenario.
- Hoja de candidatos: `artwork/bocetos/characters/chapter_11_ichika_actress_candidates/ichika_chapter_11_actress_candidates.png`.
- Hoja final: `artwork/bocetos/characters/chapter_11_ichika_actress_final/ichika_actress_final_contact_sheet.png`.

### Procedencia de ImageGen

| Recurso | Fuente generada |
|---|---|
| Hoja de candidatos | `exec-141569df-3ced-4bfe-b4eb-ad6bdd65570c.png` |
| actress_award_surprise | `exec-3a661000-ba38-4a18-9201-294a57818b08.png` |
| actress_determined | `exec-f9e35732-db36-4622-af4a-3f2c88b69fd3.png` |

## Procesamiento y rutas

- Extracción del croma verde mediante mate suave, despill y contracción de borde.
- Normalización por altura visible contra `chapter_10/ichika_warm_smile.webp`, centrada en el lienzo para acomodar ambas posturas.
- Salida estándar `620 × 876`, alfa real y anclaje inferior común.
- Maestros PNG: `artwork/fuentes/production-originals/characters/ichika/chapter_11/`.
- Runtime WebP: `public/images/characters/ichika/chapter_11/`.
- Registro: `src/data/characterSprites.ts`.

El guion de `chapter_11.ink` permanece intacto mientras el montaje profesional continúe presentado mediante CG.
