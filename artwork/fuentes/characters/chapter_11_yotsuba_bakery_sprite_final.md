# Capítulo 11: sprite definitivo de Yotsuba para la panadería

Estado: vestuario aprobado, lote expresivo producido, normalizado y registrado para runtime.

## Vestuario aprobado

Opción 1 de la hoja comparativa: chaqueta bomber ligera color marfil con cuello, puños y cintura verde bosque; top de punto verde oscuro; pantalón recto beige de tiro alto hasta el tobillo; zapatillas verdes y blancas. Conserva su cinta crema, cabello naranja corto, coleta lateral y ojos azules.

## Variantes

- `cheerful_wave`: saludo alegre y cálido.
- `curious_notice`: observa con curiosidad y repara en el anillo de Miku.
- `shocked_reveal`: reacción abierta al anuncio de la nueva familia.
- `playful_pout`: puchero ligero para «Fweh. Fine».

## Producción

- Modo: ImageGen integrado con preservación de identidad y vestuario.
- Prompt resumido: conservar exactamente la identidad adulta de Yotsuba y la opción 1 aprobada; modificar solamente expresión y gesto superior; cuerpo completo sobre fondo magenta plano, sin accesorios, texto, sombras ni escenario.
- Hoja de candidatos: `artwork/bocetos/characters/chapter_11_yotsuba_bakery_candidates/yotsuba_chapter_11_bakery_candidates.png`.
- Hoja final: `artwork/bocetos/characters/chapter_11_yotsuba_bakery_final/yotsuba_final_contact_sheet.png`.

### Procedencia de ImageGen

| Variante | Fuente generada |
|---|---|
| cheerful_wave | `exec-7f084073-1f57-4499-8a77-a8873d3f684b.png` |
| curious_notice | `exec-20a2a6df-970e-4664-99ae-531a44cf1529.png` |
| shocked_reveal | `exec-4c5d5a30-62ad-40c2-a136-fb8bb1508202.png` |
| playful_pout | `exec-d48609e6-0d45-43aa-a1c2-ecc59f6f3579.png` |

## Procesamiento y rutas

- Extracción del croma magenta mediante mate suave, despill y contracción de borde.
- Normalización por altura visible contra `chapter_10/yotsuba_cheerful.webp`.
- Salida estándar `620 × 876`, alfa real y anclaje inferior común.
- Maestros PNG: `artwork/fuentes/production-originals/characters/yotsuba/chapter_11/`.
- Runtime WebP: `public/images/characters/yotsuba/chapter_11/`.
- Registro: `src/data/characterSprites.ts`.

El guion de `chapter_11.ink` permanece intacto mientras la visita a la panadería continúe presentada mediante CG.
