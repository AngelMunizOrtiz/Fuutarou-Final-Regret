# Ending de Mitsuki — montaje provisional 01

**Flujo anterior, fuera del encargo vigente.** El usuario aclaró que quiere efectos en la base interactiva de Miku y ningún MP4 por ahora. El trabajo actual está en `experiments/ending-lab/`. Este montaje se conserva como prueba previa; no continuar exportándolo sin nueva petición.

Referencia de montaje aportada por el usuario: `Megami no Cafe Terrace - Ending.mp4`, 90.09 s, 640×360.
Se estudió su alternancia entre detalles, retratos y momentos de grupo. No se insertan fotogramas, subtítulos ni música de ese anime.

La carpeta indicada como `background-fix` existe como `public/images/cg/epilogue-mitsuki/background-fixed`.
El 6 de septiembre contenía 15 PNG y 18 MP4, además del instrumental y archivos de trabajo. El inventario previo de 11 PNG ya no describe todos sus contenidos.

## Dirección

Un recorrido por recuerdos cotidianos de Miku, Fuutarou y Mitsuki: cuidados, apego, complicidad, cocina, salidas y celebración, con el hogar nocturno como principio y final.
El montaje mezcla las ilustraciones con algunos clips animados que el usuario ya tenía en esa misma carpeta. No genera movimientos corporales nuevos.

- 20 planos y 90 segundos, 16:9, 24 FPS.
- Reencuadres animados con aceleración suave, planos de detalle y aperturas de encuadre.
- Disolvencias, tres transiciones a través de luz blanca y un desplazamiento lateral.
- Corrección cálida sutil, viñeta ligera y motas de luz discretas.
- Títulos con nombres de personajes; no se inventan créditos de un equipo de producción.
- Instrumental: `antent - hope to see you again.mp3`, primeros 90 segundos, con entrada y salida gradual. El audio propio de los clips se descarta.

Las distintas edades, vestuario, escenarios y estilos de los clips se presentan como recuerdos, pero **su continuidad sigue siendo provisional**. El usuario solicitó utilizar estas bases y reemplazarlas después por ilustraciones coherentes. No se sustituyen maestros ni se integra este montaje al final del juego.

## Reproducir y renderizar

Desde la raíz del proyecto, con FFmpeg (libx264, AAC, libass, drawtext, zoompan y xfade) disponible:

```powershell
node scripts/render-mitsuki-ending.mjs --preview
node scripts/render-mitsuki-ending.mjs
```

La primera orden produce 960×540 para revisar. La segunda produce 1920×1080 H.264/AAC con `faststart`.
Salidas en `artifacts/ending-mitsuki-v1/`, caché y logs en `.codex-tmp/ending-mitsuki/`.
Los planos se reutilizan cuando no cambian su fuente o parámetros. El ensamblaje final se vuelve a calcular.
Variable opcional: `FFMPEG_PATH`. El script usa Georgia y Segoe UI de Windows; para ejecutarlo en otro sistema se deben adaptar las rutas de fuente y los estilos ASS.

## Sustituir ilustraciones o música

Editar `sequence.json`. Cada plano define archivo, duración hasta el siguiente plano, acercamiento inicial/final, punto de interés inicial/final y, para video, recorte temporal. `transition` selecciona la entrada al plano.
Los tiempos normalizados de foco van de 0 a 1. Es necesario revisar el encuadre al sustituir una imagen por otra de composición diferente.
La suma de duraciones define los 90 s; el solapamiento adicional de cada plano se calcula automáticamente. `audio` y `audioStart` permiten cambiar la música y el punto de comienzo.

`timeline.json` en la salida registra los tiempos y fuentes del render; `titles.ass` conserva los títulos editables.
Los títulos temporizados se editan en el script si se cambia la duración general. La primera versión usa el instrumental recibido; el encaje exacto con otra canción requerirá revisar los cortes.

## Selección de fuentes

Se evitaron los videos verticales con subtítulos incrustados, las viñetas de cómic verticales y los duplicados de bebé con interfaz REC visible. Se seleccionaron clips de cuidados, abrazo familiar, reacción de Mitsuki, cocina, salida y cumpleaños.
Los reencuadres se adaptan a 16:9. Algunas fuentes tienen menor resolución y diferente acabado: exportar a 1080p no recupera detalle ausente.

## Validación

- Render final: `ending-mitsuki-1080p-v1.mp4`, 90.000 s, 1920×1080, H.264, 24 FPS, 2160 fotogramas, AAC estéreo a 48 kHz; 70,849,090 bytes (~70.8 MB).
- Preview actualizado: `ending-mitsuki-preview.mp4`, 960×540, 90 s. Ambos usan la corrección del título de Fuutarou para coincidir con su plano.
- Decodificación completa del MP4 final con FFmpeg: sin errores. Sintaxis del script y `git diff --check`: correctos.
- Revisión visual de 20 muestras, una disolvencia, una transición blanca y el título de Fuutarou. `contact-sheet.jpg` y `poster.jpg` quedan en la carpeta de salida.
- En el primer corte, el análisis técnico de audio dio media -21.0 dB y máximo -3.9 dB; no hubo saturación detectada. No se hizo evaluación auditiva del montaje.
- No se integró al juego ni se evaluó reproducción en Android. Pendiente valoración del usuario sobre selección, ritmo, música y coherencia entre recursos.
