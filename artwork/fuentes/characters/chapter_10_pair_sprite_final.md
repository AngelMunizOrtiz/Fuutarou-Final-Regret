# Capítulo 10: sprites definitivos de Miku y Fuutarou

Estado: producidos, normalizados, registrados e integrados en el guion.

## Continuidad aprobada

- El capítulo comienza directamente con la orden de besar a la novia y muestra el beso mediante CG. No hay diálogo ni ventana de sprite previa al beso.
- Miku tiene una referencia ceremonial con moño alto y velo, pero no se registra en runtime porque no aparece en una conversación jugable.
- Después del beso, Miku conserva el mismo vestido y cambia a cabello largo suelto con una corona fina de flores blancas; este es el estado usado durante recepción, baile y pastel.
- Fuutarou conserva el mismo traje blanco durante todo el capítulo. El pecho no lleva flor, boutonnière, pin ni cinta.

## Diseños definitivos

### Miku — novia post-beso

Mujer joven adulta, ojos azules y cabello castaño rojizo largo hasta la cintura. Vestido blanco sin tirantes con corpiño cruzado, guantes largos, falda de gala muy amplia formada por volantes esculturales, dos rosas marfil y gran lazo blanco azulado en la cintura. Corona floral blanca y sin velo.

Variantes: `gentle`, `joyful`, `playful`, `embarrassed`, `teary_smile` y `proud`.

Referencia ceremonial archivada: `miku_ceremony_reference_full.png`, con el mismo vestido, moño alto compacto, rosas y velo.

### Fuutarou — novio

Joven adulto delgado, ojos ámbar y cabello negro con ahoge. Traje nupcial blanco de tres piezas, camisa blanca, corbata azul marino, pañuelo blanco y zapatos negros. Sin flor en el pecho.

Variantes: `soft_smile`, `formal_gratitude`, `surprised`, `embarrassed`, `flustered` y `tender_relief`.

## Prompt reproducible

Modo: ImageGen integrado con referencias locales y preservación de identidad.

Plantilla común:

> Crear un sprite 2D de novela visual en estilo anime limpio y sombreado suave. Preservar exactamente identidad adulta, rostro, ojos, cabello, proporciones y lenguaje corporal de la referencia de pose. Bloquear el vestuario definitivo del capítulo 10 y cambiar únicamente expresión y gesto superior. Mantener una sola figura completa, sin texto, marcas, objetos extra ni recortes. Usar un fondo cromático `#00FF00` completamente plano.

Ajustes de Miku:

- Mantener cabello largo suelto, corona floral blanca, corpiño sin tirantes, guantes largos, rosas, lazo y geometría de la falda en las seis variantes.
- No añadir velo, audífonos, collar, ramo ni accesorios nuevos.
- La referencia ceremonial cambia únicamente el cabello a moño alto y añade el velo.

Ajustes de Fuutarou:

- Mantener el traje blanco de tres piezas, corbata azul marino, pañuelo blanco y zapatos negros.
- Prohibir flor, boutonnière, pin, cinta o adorno de color en solapas y pecho.

## Procedencia de ImageGen

Directorio de salida integrado: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/`.

### Miku

| Variante | Fuente generada |
|---|---|
| gentle | `exec-8337a6e2-25b4-41bf-8d93-8790a29add86.png` |
| joyful | `exec-ed04a593-fe04-46d1-ad64-a6efbda830b3.png` |
| playful | `exec-65a5eda3-bfc7-44b3-9f74-83a96c771e4a.png` |
| embarrassed | `exec-f3757275-b803-45ca-a968-7351cbc5a4af.png` |
| teary_smile | `exec-47b8aa8c-77ad-4204-bf9e-f7fe11e12393.png` |
| proud | `exec-24757856-32e4-41bb-ad64-bd315d379b5d.png` |
| ceremony_reference | `exec-419a35a2-a029-40e6-9a79-234d3d9dc8f1.png` |

### Fuutarou

| Variante | Fuente generada |
|---|---|
| soft_smile | `exec-5c594f82-e737-4f6f-9357-f05e66c3b7aa.png` |
| formal_gratitude | `exec-840ea5d8-dd95-41e8-899f-03e4a9b0134d.png` |
| surprised | `exec-ff9fbc1b-2a3f-4ccf-853d-7ddd1848aa1e.png` |
| embarrassed | `exec-58102d16-05bc-494a-a63f-36f48df340cc.png` |
| flustered | `exec-423e02a0-1b9f-4857-a640-7bb4f4020db8.png` |
| tender_relief | `exec-098d012a-2105-47e7-8f3f-ab5aa4adb874.png` |

## Procesamiento y control

- Extracción del croma mediante mate suave, despill y contracción de borde de un píxel.
- Normalización por altura visible contra los sprites aprobados del capítulo 9.
- Salida estándar: `620 × 876`, PNG maestro y WebP de runtime.
- Las doce variantes tienen alfa real, anclaje inferior común y cuatro esquinas transparentes.
- Hojas de control:
  - `artwork/bocetos/characters/chapter_10_miku_final/miku_final_contact_sheet.png`
  - `artwork/bocetos/characters/chapter_10_fuutarou_final/fuutarou_final_contact_sheet.png`

## Rutas finales

- Maestros Miku: `artwork/fuentes/production-originals/characters/miku/chapter_10/`
- Runtime Miku: `public/images/characters/miku/chapter_10/`
- Maestros Fuutarou: `artwork/fuentes/production-originals/characters/fuutarou/chapter_10/`
- Runtime Fuutarou: `public/images/characters/fuutarou/chapter_10/`
- Registro: `src/data/characterSprites.ts`
- Guion: `src/ink/chapters/chapter_10.ink`

## Integración narrativa

- Entrada de los recién casados: `soft_smile` y `joyful`.
- Conversación de Miku con Isanari: `embarrassed` y `teary_smile`.
- Conversación de Fuutarou con Maruo: `soft_smile` y `tender_relief`.
- Discurso de apertura: `formal_gratitude`.
- Pastel: `playful`, `proud`, `surprised` y `embarrassed`.
- Los besos, el baile con Maruo, el discurso de agradecimiento y la despedida siguen cubiertos por sus CG y ocultan los sprites.
