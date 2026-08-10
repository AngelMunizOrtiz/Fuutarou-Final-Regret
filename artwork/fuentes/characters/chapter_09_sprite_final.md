# Capítulo 9: lote definitivo de sprites

Estado: producido, normalizado, registrado e integrado en el guion.

## Continuidad aprobada

- El capítulo 9 transcurre durante un único día, por lo que Miku y Fuutarou conservan un solo atuendo base desde el reencuentro hasta la propuesta.
- Miku se quita el cárdigan, recoge su cabello en una coleta baja y añade un delantal crema únicamente durante la clase de cocina. Después recupera el atuendo base.
- Raiha aparece dentro de Asahiyama con uniforme escolar.
- Los grandes movimientos físicos siguen reservados para los CG existentes; este lote cubre conversación, reacción y transición.

## Diseños finales

### Miku — opción 4

Mujer joven adulta, ojos azules, cabello castaño rojizo largo hasta la cintura y sin audífonos. Tejido acanalado terracota de cuello alto, cárdigan camel abierto y falda midi azul marino de línea A.

Variantes: `neutral`, `gentle`, `pout`, `embarrassed`, `bright_reunion`, `thoughtful`, `vulnerable`, `teary_smile`, `startled`, `playful`, `crying_guarded` y `teacher_enthusiastic`.

### Fuutarou — opción 1

Joven adulto delgado, ojos ámbar, cabello negro con ahoge. Blazer carbón desestructurado, camisa Oxford celeste sin corbata y con el cuello abierto, cinturón negro y pantalón negro.

Variantes: `teacher_neutral`, `annoyed`, `embarrassed`, `hand_cover`, `neck_scratch`, `soft_smile`, `surprised`, `worried`, `determined` y `teary_relief`.

### Raiha — uniforme escolar

Rostro y proporciones juveniles preservados, ojos ámbar rojizos, cabello oscuro largo en coleta alta y lazo rosa. Blazer carbón con ribete blanco, blusa blanca, lazo verde oscuro, falda plisada verde oscuro y bolso escolar marrón.

Variantes: `cheerful_wave`, `neutral` y `surprised_shy`.

## Prompt reproducible

Modo: ImageGen integrado, edición guiada por una referencia de pose aprobada y por la lámina del vestuario seleccionado.

Plantilla común:

> Crear un sprite 2D de novela visual en estilo anime limpio y sombreado suave. Preservar exactamente identidad, rostro, color de ojos, cabello, proporciones adultas o juveniles y pose de la referencia. Sustituir únicamente el vestuario por el diseño aprobado. Mantener una sola figura completa, sin texto, marcas, objetos extra ni recortes de cabeza o manos. Fondo cromático sólido y uniforme.

Ajustes por personaje:

- Miku: fondo `#00FF00`; cabello suelto largo, sin audífonos. La variante docente elimina el cárdigan, añade delantal crema y coleta baja con mechones frontales.
- Fuutarou: fondo `#00FF00`; conservar ahoge y ojos ámbar; el mismo conjunto carbón/celeste en las diez poses.
- Raiha: fondo `#FF00FF` para no perder el verde del uniforme; conservar el lazo rosa y el bolso escolar.

La intención expresiva de cada variante está codificada en el nombre. La pose se obtuvo de su sprite ancla homólogo para mantener lenguaje corporal y continuidad con el resto del juego.

## Procedencia de ImageGen

Directorio de salida integrado: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/`.

### Miku

| Variante | Fuente generada |
|---|---|
| neutral | `exec-9a52e699-0d86-4b07-8143-3eef6be16b7b.png` |
| gentle | `exec-cbe239a6-aaf4-45e0-9226-d8fb30cb486d.png` |
| pout | `exec-79c203d8-ce2e-40ff-8d84-156b14e3e734.png` |
| embarrassed | `exec-159717a4-ff93-4587-a124-1014f8f6eee0.png` |
| bright_reunion | `exec-6f8c7680-e1cd-42aa-88af-66c978368b7a.png` |
| thoughtful | `exec-e2aa4ce8-c52a-41c0-94a1-0c50fda0ca68.png` |
| vulnerable | `exec-7e23e81a-3e82-45e9-924e-ca957fb3318a.png` |
| teary_smile | `exec-17c92b16-9842-48c3-b5c5-2881cd911ee5.png` |
| startled | `exec-c15edf65-afc8-41b1-b85b-d10473d6f5ef.png` |
| playful | `exec-9154a0e8-ad0a-410a-aa5b-7c3d538a7773.png` |
| crying_guarded | `exec-9dfb69fa-2593-4833-8996-8ed1eaaaf2d1.png` |
| teacher_enthusiastic | `exec-4d45d60d-3b0b-4d27-9ddf-7f5a33938c75.png` |

### Fuutarou

| Variante | Fuente generada |
|---|---|
| teacher_neutral | `exec-3f8c013d-2ec0-4b1e-bcd3-72969b75588a.png` |
| annoyed | `exec-de5788ad-68ec-452a-9ea2-5145ed55e464.png` |
| embarrassed | `exec-4b5ff0d9-a54c-4977-8c29-f4af2a9f03b3.png` |
| hand_cover | `exec-ac2d9e72-d75e-4b24-99b6-3aa03734c2c4.png` |
| neck_scratch | `exec-a5b8a9dd-730f-4cba-9a11-69f962461fd8.png` |
| soft_smile | `exec-f6ba5294-b9d7-49a5-8302-40eefa9abb2a.png` |
| surprised | `exec-5af6ff8f-53d3-4b71-9f33-874b5d9ad890.png` |
| worried | `exec-1de80fe6-caa5-4d61-ba97-c4b1d5357c6b.png` |
| determined | `exec-5e0ab894-f8f3-4cac-a29c-291995d62357.png` |
| teary_relief | `exec-eb565c91-35ce-4845-a8a9-fef082420675.png` |

### Raiha

| Variante | Fuente generada |
|---|---|
| cheerful_wave | `exec-11ca03e0-435a-46b8-8ce4-838969de0701.png` |
| neutral | `exec-dbe3b63a-ae4f-4eff-8a2b-4262fc9799da.png` |
| surprised_shy | `exec-be4c9fbf-2f36-48b0-b5f7-b542dcd2b9c8.png` |

## Procesamiento y control

- Eliminación de croma con mate suave; despill verde para Miku y Fuutarou. Raiha se procesó sin despill magenta para conservar el lazo rosa.
- Normalización individual contra una pose ancla existente.
- Salida estándar: `620 × 876`, WebP de runtime y PNG maestro.
- Todas las variantes tienen alfa real, contenido anclado al borde inferior y cuatro esquinas transparentes.
- Hojas de control:
  - `artwork/bocetos/characters/chapter_09_miku_final/miku_final_contact_sheet.png`
  - `artwork/bocetos/characters/chapter_09_fuutarou_final/fuutarou_final_contact_sheet.png`
  - `artwork/bocetos/characters/chapter_09_raiha_school_final/raiha_final_contact_sheet.png`

## Rutas finales

- Maestros Miku: `artwork/fuentes/production-originals/characters/miku/chapter_09/`
- Runtime Miku: `public/images/characters/miku/chapter_09/`
- Maestros Fuutarou: `artwork/fuentes/production-originals/characters/fuutarou/chapter_09/`
- Runtime Fuutarou: `public/images/characters/fuutarou/chapter_09/`
- Maestros Raiha: `artwork/fuentes/production-originals/characters/raiha/chapter_09/`
- Runtime Raiha: `public/images/characters/raiha/chapter_09/`

## Integración

- Las 25 claves `chapter_09_*` están registradas en `src/data/characterSprites.ts`.
- `src/ink/chapters/chapter_09.ink` usa los sprites durante el reencuentro, restaurante, biblioteca, práctica docente, conversación con Raiha, azotea, epílogo de la propuesta y extra.
- Las secuencias de abrazo, baile, pregunta, aceptación, beso y latido continúan ocultando sprites para mostrar sus CG.
