# Capítulo 10: sprites formales definitivos de las hermanas

Fecha: 2026-08-09

## Alcance

Este lote completa los sprites de recepción de Ichika, Nino, Yotsuba e Itsuki. La secuencia transcurre durante el mismo día, así que cada personaje conserva un único vestuario desde que reaparece después de cambiarse el disfraz de novia hasta la despedida y la lectura de las cartas. Los CG no se modificaron: los futuros CG deberán alinearse con estos diseños definitivos.

## Vestuarios bloqueados

- Ichika: mono sastre sin mangas y de pierna ancha, cuello drapeado, malva ahumado medio, cinturón rosa dorado y zapatos malva oscuro. Deriva de la opción 3, recoloreada para reservar el blanco a Miku.
- Nino: vestido midi de satén burdeos, hombros descubiertos, corpiño entallado y falda drapeada asimétrica; zapatos negros.
- Yotsuba: vestido verde esmeralda de encaje, manga corta, cintura definida, falda evasé hasta la rodilla y zapatos verde oscuro.
- Itsuki: vestido midi azul empolvado con encaje, mangas transparentes de tres cuartos, falda en A y zapatos azul plateado.

Se conservaron los rasgos aprobados: corte asimétrico de Ichika; flequillo y lazos mariposa oscuros de Nino; coleta lateral y gran cinta blanca de Yotsuba; cabello muy largo, ahoge y lentes azules de Itsuki.

## Variantes finales

- Ichika (4): `warm_smile`, `teasing`, `embarrassed`, `laughing`.
- Nino (5): `neutral`, `annoyed`, `angry`, `soft`, `emotional`.
- Yotsuba (4): `cheerful`, `nervous`, `shocked`, `determined`.
- Itsuki (4): `warm`, `serious`, `surprised`, `thoughtful`.

## Producción

- Herramienta: ImageGen integrado, modo de preservación de identidad; una llamada independiente por imagen.
- Anclas iniciales: sprites neutrales aprobados y láminas de candidatos del capítulo 10.
- Variantes: cada base definitiva se reutilizó como bloqueo absoluto de identidad, vestuario, paleta y render; los sprites anteriores se usaron únicamente como guía expresiva y gestual.
- Fondos de trabajo: `#00FF00`; para Yotsuba se usó `#FF00FF` para no interferir con su vestido verde.
- Extracción: mate suave, umbral transparente 40, umbral opaco 160, despill y contracción de borde de 1 px.
- Normalización: `scripts/normalize_sprite_pose_variant.py`, centrada sobre lienzo de `620x876`, usando un sprite aprobado del mismo personaje como ancla.
- Runtime: PNG maestro transparente y WebP transparente.

## Fuentes generadas

### Ichika

- `warm_smile`: `exec-2affd4dc-d43a-4ca5-af1b-2394679d6822.png`
- `teasing`: `exec-1d9c7586-a347-404c-8f99-ee8bc77e596a.png`
- `embarrassed`: `exec-22905f94-5292-4647-8132-22ba922fd9f1.png`
- `laughing`: `exec-e85d6c23-bf85-4f0c-bf67-34e5bdc3db3d.png`

### Nino

- `neutral`: `exec-7ecb765c-a851-4cef-a782-3deed8d0630b.png`
- `annoyed`: `exec-a3e1a5d8-ea66-4b3c-a060-b002675e4175.png`
- `angry`: `exec-283bcf71-4580-4c4c-901e-2516df811093.png`
- `soft`: `exec-5386fde1-c7bc-4f9c-96f8-9d2ee8cbdbf6.png`
- `emotional`: `exec-ac557cbc-82ba-4ab2-8c8d-9de88acfd585.png`

### Yotsuba

- `cheerful`: `exec-0760d086-39e4-4631-9ca3-339417dc759d.png`
- `nervous`: `exec-9b29f15b-f3bf-4b18-a98d-c16c94a1c6a9.png`
- `shocked`: `exec-43b34ad9-0d4b-40d5-9e5b-11f64e0cc128.png`
- `determined`: `exec-4ba849c1-0905-41b2-924c-a679ef7eaca4.png`

### Itsuki

- `warm`: `exec-f94fce1d-b253-48e2-99e7-bb6cf3f50fbb.png`
- `serious`: `exec-c6e95cea-a735-43ff-b808-cc6cca89c789.png`
- `surprised`: `exec-d0b36ce7-c6e8-4e1f-b8fc-6cc4b9799f03.png`
- `thoughtful`: `exec-bec262d1-9c21-496f-92c1-5742fbd8799a.png`

## Ubicaciones

- Fuentes cromáticas y recortes: `artwork/bocetos/characters/chapter_10_<personaje>_wedding_sprites/`.
- Maestros: `artwork/fuentes/production-originals/characters/<personaje>/chapter_10/`.
- Runtime: `public/images/characters/<personaje>/chapter_10/`.
- Láminas de revisión: `artwork/bocetos/characters/chapter_10_<personaje>_wedding_sprites/<personaje>_chapter_10_expression_sheet.png`.

## Integración narrativa

Las variantes se registraron con prefijo `chapter_10_` y se distribuyeron en cuatro bloques de `src/ink/chapters/chapter_10.ink`:

- reencuentro con Raiha y explicación del Quint Game;
- conversación durante el discurso del padrino;
- despedida en el patio y lanzamiento del ramo;
- lectura de cartas, anillos, pulsera y amuleto.

Las acciones ya ilustradas por CG se mantienen sin sprites superpuestos.
