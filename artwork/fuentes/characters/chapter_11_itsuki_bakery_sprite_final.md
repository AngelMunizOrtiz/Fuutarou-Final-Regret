# Capítulo 11: sprite definitivo de Itsuki para la panadería

Estado: vestuario aprobado, lote expresivo producido, normalizado y registrado para runtime.

## Vestuario aprobado

Opción 2 de la hoja comparativa: blazer entallado rojo ladrillo con solapas y botones oscuros; top crema de punto acanalado con cuello alto; pantalón recto color carbón de tiro alto hasta el tobillo; mocasines negros de tacón bajo. Conserva la identidad adulta de Itsuki, sus ojos azules, gafas azul oscuro, cabello rojo anaranjado largo y ahoge curvado.

Este diseño corresponde únicamente a la visita familiar a la panadería. Su breve escena laboral como profesora ocurre antes del salto de un año y requiere un vestuario docente separado.

## Variantes

- `hopeful_wish`: sonrisa cálida y mano sobre el pecho para expresar su deseo de que la panadería tenga éxito.
- `baffled_reaction`: ojos abiertos, mano ajustando las gafas y palma interrogante para reaccionar al nombre del establecimiento.

## Producción

- Modo: ImageGen integrado con preservación estricta de identidad y vestuario.
- Prompt resumido: conservar exactamente la identidad adulta de Itsuki y la opción 2 aprobada; mantener cabello, ahoge, gafas, blazer, top, pantalón, calzado y proporciones; cambiar únicamente expresión y gesto; cuerpo completo sobre fondo verde plano, sin accesorios, texto, sombras ni escenario.
- Hoja de candidatos: `artwork/bocetos/characters/chapter_11_itsuki_bakery_candidates/itsuki_chapter_11_bakery_candidates.png`.
- Hoja final: `artwork/bocetos/characters/chapter_11_itsuki_bakery_final/itsuki_final_contact_sheet.png`.

### Procedencia de ImageGen

| Recurso | Fuente generada |
|---|---|
| Hoja de candidatos | `exec-41242c65-fbf2-48fb-83da-3594b98274cf.png` |
| hopeful_wish | `exec-2d1a4a80-9d15-49c1-83ab-98f2e568f2d8.png` |
| baffled_reaction | `exec-8a8f01be-f45e-4e55-8170-a9541a3b1a76.png` |

## Procesamiento y rutas

- Extracción del croma verde mediante mate suave, despill y contracción de borde.
- Normalización por altura visible contra `chapter_10/itsuki_warm.webp`, centrada en el lienzo para conservar ambos gestos.
- Salida estándar `620 × 876`, alfa real y anclaje inferior común.
- Maestros PNG: `artwork/fuentes/production-originals/characters/itsuki/chapter_11/`.
- Runtime WebP: `public/images/characters/itsuki/chapter_11/`.
- Registro: `src/data/characterSprites.ts`.

El guion de `chapter_11.ink` permanece intacto mientras la visita a la panadería continúe presentada mediante CG.
