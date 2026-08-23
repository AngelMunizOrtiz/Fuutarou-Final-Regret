# Miku: candidatos de vestuario para el temporal (capítulo 8)

Estado: opción 2 seleccionada. La parka topo con capucha fue trasladada al lote definitivo del capítulo 8 e integrada al juego.

## Modo y referencia

- Modo de generación: ImageGen integrado (edición con preservación de identidad).
- Referencia única: `artwork/fuentes/production-originals/characters/miku/miku_neutral.png`.
- Fondo solicitado: chroma uniforme `#00FF00` para extracción local.
- Encuadre común: una sola Miku, frontal, pose neutral, de cabeza a medio muslo.

## Prompt común

En todas las variantes se indicó cambiar solamente la ropa y conservar exactamente la identidad adulta de Miku, rostro, ojos azules, cabello largo rojizo-anaranjado suelto, peinado, proporciones corporales y de busto, expresión neutral, pose, brazos, estilo anime, línea, sombreado, cámara y escala. También se prohibieron audífonos, sombrero, paraguas, bolso, utilería, lluvia, escenario, texto, números, marcas de agua y cualquier verde dentro del personaje.

## Variantes finales

1. **Trench azul tinta con cinturón**: impermeable ligero entallado en A, azul marino, ribetes beige y cuello alto beige visible.
   - Fuente ImageGen: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-a3130dc5-1e48-43e1-a246-61a6e3fa2ca2.png`
2. **Parka topo con capucha**: impermeable camel/taupe, capucha descansando detrás de los hombros, cintura ligeramente marcada y detalles azul marino.
   - Fuente ImageGen: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-b249ede0-35a2-42f9-9cb6-da04afa7b105.png`
3. **Chaqueta corta ciruela**: chaqueta impermeable cropped hasta la cadera, cuello alto abierto, cuello de tortuga beige y vestido/falda azul marino visibles.
   - Fuente ImageGen: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-fb909117-b6f3-4db8-b794-27d94b940b14.png`
4. **Mac largo azul carbón**: impermeable minimalista sin cinturón, cuello alto, cierre oculto y bolsillos verticales.
   - Fuente ImageGen: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-e26bd323-b172-4cbb-ba09-2e382039a074.png`
5. **Impermeable rosa apagado**: abrigo A-line rosa viejo desaturado, cierre asimétrico y ribetes índigo.
   - Fuente ImageGen: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-bfd5ca0a-3f57-48de-8747-9c8a1e201253.png`
6. **Capa impermeable azul tinta**: capa A-line práctica, cuello de tormenta, aberturas para los brazos y forro beige discreto.
   - Fuente ImageGen: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-593d1ab0-c78f-4b04-b580-1571c57f3817.png`

## Procesamiento local

- Chroma: `remove_chroma_key.py`, color `#00ff00`, soft matte, umbrales 40/160, despill y contracción de borde de 1 px.
- Normalización: ancla `public/images/characters/miku/miku_neutral.webp`, lienzo `620x876`, centrado en canvas.
- Validación: las seis variantes WebP pasan tamaño, transparencia, bbox y esquinas transparentes.
- Lámina: `artwork/bocetos/characters/chapter_08_miku_rainwear_candidates/miku_rainwear_candidates_sheet.png`.

La opción 2 se usó como referencia de vestuario para las diez expresiones definitivas documentadas en `chapter_08_miku_rainwear_final.md`.
