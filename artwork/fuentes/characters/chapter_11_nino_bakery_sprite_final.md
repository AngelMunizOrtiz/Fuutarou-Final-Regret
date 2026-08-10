# Capítulo 11: sprite definitivo de Nino para la panadería

Estado: vestuario aprobado, lote expresivo producido, normalizado y registrado para runtime.

## Vestuario aprobado

Opción 5 de la hoja comparativa: vestido cruzado de punto acanalado color ciruela oscuro, manga larga, escote en V y largo bajo la rodilla; cinturón negro fino con hebilla rectangular dorada; medias opacas color carbón y botines de tacón borgoña. Conserva cabello coral rosado, flequillo recto, dos coletas bajas y dos grandes lazos oscuros con forma de mariposa.

## Variantes

- `teasing`: sonrisa burlona para la broma del uniforme de maid.
- `annoyed`: exige una explicación sobre el nombre de la panadería.
- `commanding`: ordena realizar la reunión familiar arriba.

## Producción

- Modo: ImageGen integrado con preservación de identidad y vestuario.
- Prompt resumido: conservar exactamente la identidad adulta de Nino, sus dos coletas, ambos lazos y la opción 5 aprobada; modificar únicamente expresión y gesto superior; cuerpo completo sobre fondo verde plano, sin accesorios, texto, sombras ni escenario.
- Hoja de candidatos: `artwork/bocetos/characters/chapter_11_nino_bakery_candidates/nino_chapter_11_bakery_candidates.png`.
- Hoja final: `artwork/bocetos/characters/chapter_11_nino_bakery_final/nino_final_contact_sheet.png`.

### Procedencia de ImageGen

| Variante | Fuente generada |
|---|---|
| teasing | `exec-3abfbcff-c4ab-43de-9454-ed1bcc3c3c84.png` |
| annoyed | `exec-f2caca02-d7a3-40bd-a1be-fa1ad93e5942.png` |
| commanding | `exec-e9abd66b-fda1-4f0a-9175-b4310edc9ce0.png` |

La primera generación de la pose burlona fue descartada porque ocultaba uno de los dos lazos; la versión registrada corrige esa deriva.

## Procesamiento y rutas

- Extracción del croma verde mediante mate suave, despill y contracción de borde.
- Normalización con una única escala por altura visible contra `chapter_10/nino_neutral.webp`.
- Salida estándar `620 × 876`, alfa real y anclaje inferior común.
- Maestros PNG: `artwork/fuentes/production-originals/characters/nino/chapter_11/`.
- Runtime WebP: `public/images/characters/nino/chapter_11/`.
- Registro: `src/data/characterSprites.ts`.

El guion de `chapter_11.ink` permanece intacto mientras la visita a la panadería continúe presentada mediante CG.
