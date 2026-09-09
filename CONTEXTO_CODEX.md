# Contexto de continuidad de Codex

## Fecha de actualización

8 de septiembre de 2026 (montaje cronológico y refinamiento del ending interactivo).

## Objetivo general del proyecto

Desarrollar **Fuutarou Final Regret**, una novela visual fan de *The Quintessential Quintuplets* centrada en la ruta de Miku, con historia bilingüe, CG y sprites propios, y versiones jugables optimizadas para web, Windows y Android. El objetivo inmediato combina terminar y uniformar el apartado visual con mantener una demo del capítulo 1 + extra y builds completas suficientemente fluidas, sobre todo en tablets Android.

## Estado actual

- **Pulido audiovisual vigente:** el usuario pidió un acabado más profesional. HopeTreatment ahora distingue casa, noche, jardín y atardecer: polvo discreto en interiores, pétalos solo en exteriores, menos velo sobre los rostros, luz del paseo desde la derecha. Atmósferas se mezclan durante cambios. Transiciones románticas proporcionales al plano (26%, máximo 1.2 s normal/1.55 s bloom) para dejar legibles los insertos cortos. Etiquetas de prueba ocultas en el pase de Mitsuki, visibles al inspeccionar planos. Tarjeta final centrada sobre marfil desde 145.2 s, permanece al terminar a 147 s; conserva movimiento reducido y comparación. Build/TypeScript y ESLint correctos, cierre revisado visualmente en producción. No se modifica el audio ni se afirma sincronía musical nueva. Mismo material/32 planos, sin integración ni exportación MP4.

- **Última petición: más recuerdos familiares fieles a sprites.** Creados con image_gen `ending-family-lemonade-gift-v1.png`, `ending-family-reading-v1.png`, `ending-family-sunset-walk-v1.png` en `public/images/cg/epilogue-mitsuki/background-fixed/`. Referencias de rostros: sprites chapter_11 `miku_gentle_welcome` y `fuutarou_soft_welcome`; Mitsuki conserva el diseño aprobado de los CG de cuidados. Prompts: `artwork/experiments/ending-lab/mitsuki/family-prompts-v1.json`. Integrados a 02:03/02:09/02:14; cumpleaños a 02:20. Ahora 18 CG, 220 fotogramas, 32 planos/147 s. Se fusionan encuadres repetidos del nacimiento/cumpleaños, sustituye tríptico y acorta un segundo cocina; todas las fuentes anteriores siguen representadas. Nuevo inicio de cuidados a 01:35. Build/TypeScript, ESLint secuencia/compositor y empaquetado correctos. Se evita reescribir todos los derivados idénticos tras bloqueo Windows en registro. Revisado en producción el paseo con encuadre de los tres y acabado romántico; selector confirma 32 planos/147 s, sin errores ni avisos de consola. Rendimiento Android y benchmark de esta ampliación pendientes.

- **Ampliación anterior de cuidados (tiempos históricos):** 3 CG creados con image_gen para explicar la limonada: Fuutarou enfermo con toalla en cama y niña en puerta (01:41), Mitsuki preocupada apoyada en el marco (01:46), Miku ofrece delantal crema/diadema rosa de la cocina (01:51). Maestros `ending-fuutarou-fever-bed-v1.png`, `ending-mitsuki-worried-door-v1.png`, `ending-miku-offers-apron-v1.png` en `public/images/cg/epilogue-mitsuki/background-fixed/`; prompts exactos en `artwork/experiments/ending-lab/mitsuki/care-prompts-v1.json`. Son 32 planos, 15 CG y los mismos 220 fotogramas. Se reduce un segundo por plano doméstico para conservar 144 s y todas las fuentes; cocina/cumpleaños no cambian de tiempo. Delantal interpretado según la ropa existente de la limonada. Nuevas bases provisionales reemplazables. Build/TypeScript, ESLint del montaje y sintaxis del empaquetador correctos; verificados selector de 32 planos/144 s y CG del delantal en producción, sin errores/avisos de consola. No se repitió benchmark Android. Empaquetador evita reescribir WebP idénticos tras un bloqueo de archivo en Windows; ejecución final correcta (15 CG).

- **Base cronológica conservada:** nacimiento → despertar/abrazos → primeros pasos → vida cotidiana → cuidados de papá y limonada → cumpleaños. Se mantienen los 12 CG y 13 clips previamente seleccionados y se añaden tres CG generados. La coherencia de edades/estilos de las fuentes anteriores sigue pendiente; los nuevos planos usan la niña y ropa de la cocina como referencia.
- **Dirección vigente:** Romance y esperanza es el acabado inicial: pastel, luz dorada/rosada progresiva, pétalos, disolvencias, aperturas suaves de luz y fotografías de álbum (1.4–1.8 s); cierre a marfil. Neón gráfico y Luz cálida siguen disponibles. El pase vigente dura 147 s; no se exporta película ni se integra al juego.
- Rama comprobada el 6 de septiembre: `New-Optimization`; `HEAD` es `be92700` (`Crear contexxto para agente Codex`), que solo añadió `AGENTS.md` y este documento sobre `bef5373`. El árbol estaba limpio al comenzar la revisión de continuidad.
- La historia activa contiene 11 capítulos Ink en `src/ink/chapters/`. Vite los precompila durante el build; el modo demo incluye solo el capítulo 1 y su extra.
- Existen scripts para demo de capítulo 1 en web, Windows y Android, y para la versión completa en Windows y Android. No se ejecutaron en esta tarea los empaquetados Tauri completos.
- El build web de producción pasa. La demo web tiene despliegue automático de GitHub Pages al hacer push a `main`; el estado y la URL pública actuales quedan pendientes de verificar externamente.
- La versión PC portable fue reportada por el usuario como fluida. El rendimiento de la última versión Android en la Huawei MatePad 11 todavía necesita una prueba física reciente; las primeras versiones llegaron a tener tirones severos.
- El trabajo visual vigente incluye fondos/CG del capítulo 1 y el epílogo cómico de Mitsuki. En la revisión posterior del 6 de septiembre, `public/images/cg/epilogue-mitsuki/background-fixed/` ya contiene 15 PNG y 18 MP4, además del instrumental y archivos de trabajo. El conteo previo de 11 PNG y `docs/INVENTARIO_CG_EPILOGO_MITSUKI.md` están desactualizados; no asumir que todo el contenido está aprobado.
- `src/ink-sin-narrador/` conserva una reescritura editorial separada de los 11 capítulos. No está integrada al runtime. Se mantiene aparte mientras el narrador aún ayuda a definir acciones y CG.
- `src/ink-borradores/extra_final_mitsuki.ink` y su JSON español son un borrador independiente; su integración en la historia principal está pendiente.
- El usuario está produciendo los fondos definitivos del capítulo 1 y preparando un ending después del capítulo final. Autorizó una prueba de CG animado. Se creó `experiments/ending-lab/`, una vista previa independiente de 24 s basada en `cg_041a_miku_answer_permission.png`, con capas, parpadeo, respiración, lluvia, comparación estática, pase de títulos provisionales y medición. No está integrada al runtime ni aprobada como ending final.
- El usuario valoró positivamente el experimento y prefiere explorar un ending con ilustraciones estáticas y movimientos leves, como parpadeo. Tiene canciones en Suno que no lo convencen por completo y está explorando un instrumental de referencia.
- **Formato solicitado:** ampliar la base INTERACTIVA de Miku, sin exportar MP4 por ahora. Mitsuki tiene 32 planos/144 s, con Miku disponible en el selector. Parpadeo y respiración en retrato/tríptico; clips existentes aportan 220 fotogramas interpolados por fundidos. No se han generado nuevos gestos corporales. Originales conservados.
- Después entregó `antent - hope to see you again.mp3` (147.84 s) y `Megami no Cafe Terrace - Ending.mp4` (90.09 s), ambos en su escritorio. Posponiendo la petición de prompt para Suno, pidió hacer un ending con los recursos de `background-fixed` (escribió `background-fix`, que no existe). Autorizó usar las ilustraciones como bases reemplazables. Se preparó un montaje de 20 planos y 90 s con el instrumental recibido, tomando como referencia los detalles/retratos/grupos del MP4; incluye ilustraciones y clips existentes de esa carpeta. No se utilizan escenas ni audio del anime de referencia.

## Decisiones importantes y sus motivos

- **Conservar por ahora la historia activa con narrador.** Las descripciones todavía sirven como guía para componer CG y acciones. La variante reducida/sin narrador se revisará e integrará solo después de cerrar el apartado visual.
- **Separar borradores de contenido jugable.** `src/ink-sin-narrador/` y `src/ink-borradores/` no deben importarse accidentalmente desde el juego actual.
- **Cargar y liberar recursos por capítulo.** Evita cargar toda la VN al iniciar y reduce memoria y pausas, especialmente en Android.
- **Mantener movimiento ligero en Android.** El perfil móvil acorta transiciones y reduce resolución/FPS, pero no elimina las animaciones salvo que el sistema solicite movimiento reducido.
- **Preparar recursos distintos por plataforma sin alterar los maestros.** Los builds usan copias temporales en `.codex-tmp/`; Android reduce más las imágenes y omite el video del menú.
- **Composición visual base 16:9.** Fondos y CG se trabajan normalmente a 2560×1440 y se exportan a 1920×1080; para paneo/zoom se recomienda maestro 3840×2160. Sprites: maestro transparente 1240×1752 y exportación 620×876.
- **Continuidad del epílogo de Mitsuki.** La vivienda debe ser una casa japonesa contemporánea, cálida y modesta, no un departamento. Día 1: Mitsuki usa ojos normales y Raiha aparece desde la tarde. Día 2: Mitsuki usa los ojos tiernos aprendidos y Raiha ya no está. La posición y mirada de los personajes deben respetar el eje del genkan/puerta.
- **No confirmar assets nuevos solo por existir.** Versiones con sufijos `draft` o múltiples `vN` son candidatas de revisión; no se consideran finales ni integradas hasta comprobar referencias en manifiesto/Ink y aprobación del usuario.
- **Explorar el ending con una prueba independiente.** Los derivados ImageGen están en `artwork/experiments/ending-lab/`; el recorte utiliza el CG original con una máscara generada. Los títulos son ejemplos, sin canción definitiva. La prueba no cambia Ink, partidas ni fondos del capítulo 1.
- **Formato de trabajo del ending:** animación de imágenes en Canvas 2D dentro de `ending-lab`, con pausa, búsqueda, selección de plano, comparación, perfiles y música opcional. No seguir desarrollando la exportación MP4 salvo nueva petición. El tratamiento neón se calcula una vez por textura y se conserva en memoria; no procesa píxeles de toda la pantalla en cada frame.

## Arquitectura o funcionamiento relevante

- Frontend: React 19 + TypeScript + Vite 7, con Pixi'VN/PixiJS para la novela y Zustand para estado. Empaquetado nativo mediante Tauri 2.
- Lienzo lógico: 1920×1080 en `src/main.tsx`, escalado con modo `contain`.
- Historia: `vite.config.ts` compila `src/ink/start.ink` y los capítulos a un módulo virtual. `src/utils/ink-utility.ts` procesa comandos Ink de navegación, escenas, sprites y transiciones.
- Rutas pesadas se cargan con `lazy()` en `src/AppRoutes.tsx`. Las escenas cinemáticas están separadas de la narración normal.
- `src/assets/manifest.ts` agrupa fondos y CG por capítulo. `src/assets/generatedStoryPrefetchPlan.ts` se regenera antes del build. `src/utils/assets-utility.ts` precarga, conserva una ventana pequeña y libera texturas al cambiar de capítulo.
- `src/utils/performance-profile.ts` detecta Android/CPU/memoria y aplica perfiles: canvas interno de 0.42–0.5 en Android, máximo 30 FPS móvil/45 FPS PC, precarga limitada, transiciones cortas y video de menú desactivado en Android.
- `src/utils/renderer-performance.ts` duerme el ticker de Pixi cuando la escena está estática y lo despierta con entrada o cambios de escena.
- `src/hooks/usePointerAdvance.ts` unifica avance con mouse, tacto y lápiz evitando controles y gestos largos. El botón Salir usa cierre Tauri con alternativas en `src/screens/MainMenu.tsx`.
- PWA/GitHub Pages: `.github/workflows/pages.yml` construye la demo del capítulo 1 desde `main`. En Tauri la PWA se desactiva.
- Builds completas: `scripts/prepare-full-public.mjs` prepara assets temporales; Windows limita visuales a 1920×1080, Android a 1152×648. `scripts/build-windows-full.mjs` genera portable + instalador NSIS y `scripts/build-android-full.mjs` genera APK ARM64.

## Archivos clave

- `package.json`: comandos de desarrollo, validación y builds.
- `vite.config.ts`: compilación Ink, PWA, subruta web y separación de chunks.
- `src/main.tsx`, `src/AppRoutes.tsx`: inicio, render, rutas y cambios de capítulo.
- `src/ink/start.ink`, `src/ink/chapters/`: guion actualmente integrado.
- `src/ink-sin-narrador/`: revisión editorial independiente, todavía no integrada.
- `src/ink-borradores/extra_final_mitsuki.ink`: epílogo de Mitsuki en borrador.
- `src/assets/manifest.ts`, `src/utils/assets-utility.ts`: catálogo y ciclo de vida de recursos.
- `src/utils/performance-profile.ts`, `src/utils/renderer-performance.ts`: optimización en tiempo de ejecución.
- `scripts/prepare-full-public.mjs` y scripts `build-*`: preparación/empaquetado por plataforma.
- `src-tauri/tauri.conf.json`, `src-tauri/tauri.full.conf.json`: configuración de escritorio/móvil.
- `src-tauri/icon-master.png`, `src-tauri/icons/`: icono maestro y derivados.
- `.github/workflows/pages.yml`: publicación automática de la demo web.
- `docs/GUIA_RESOLUCIONES_ASSETS.md`: resoluciones maestras y exportaciones.
- `docs/revision-integral-sin-narrador.md`: referencia de la revisión narrativa.
- `docs/INVENTARIO_CG_EPILOGO_MITSUKI.md`: inventario visual útil, pero su conteo actual requiere actualización.
- `public/images/cg/chapter_01/`, `public/images/cg/epilogue-mitsuki/` y `public/images/backgrounds/epilogue/`: trabajo visual reciente.
- `experiments/ending-lab/README.md`: uso, límites y prueba física de la escena animada. `vite.ending-lab.config.ts` y comandos `dev:ending-lab`, `build:ending-lab`, `preview:ending-lab`: servidor 1430, compilación independiente y preview de producción 1431. `scripts/prepare-ending-lab-assets.mjs`: empaquetado reproducible de los derivados.
- `experiments/ending-lab/mitsuki-ending.ts`: compositor en tiempo real; `mitsuki-assets.json`: 12 CG reemplazables; `neon-treatment.ts`: tratamiento gráfico cacheado; `scripts/prepare-mitsuki-live-assets.mjs`: dos resoluciones y música. Derivados de ojos/máscara/fondo y prompts en `artwork/experiments/ending-lab/mitsuki/`. Cambiar el retrato base exige rehacer sus capas y coordenadas de ojos.
- `experiments/ending-lab/hope-treatment.ts`: tercera variante Romance y esperanza, corrección pastel por textura y partículas Canvas. `EndingLook` sustituye al booleano neón; se libera la caché inactiva al alternar variantes y se conserva el tiempo del plano.
- `experiments/ending-lab/mitsuki-sequence.ts`: nuevo montaje cronológico de 29 planos/4 etapas y títulos provisionales. `mitsuki-motion.json`: fuente, rango temporal y cantidad de fotogramas de los clips; `scripts/prepare-mitsuki-motion.mjs`: extracción/hojas WebP en dos resoluciones. `mitsuki-ending.ts` carga por proximidad hasta 3 hojas de animación y libera su tratamiento de color al expulsarlas; conserva posters mientras una hoja opcional termina de cargar. El ending sigue siendo Canvas interactivo, sin exportación de película.
- `experiments/ending-mitsuki/sequence.json`: montaje editable de 20 planos con fuentes, tiempos y encuadres. `scripts/render-mitsuki-ending.mjs`: exportación FFmpeg; `--preview` genera 960×540 y sin opción genera 1920×1080. Salidas locales en `artifacts/ending-mitsuki-v1/`, excluidas de Git; caché en `.codex-tmp/ending-mitsuki/`. La guía explica cómo sustituir ilustraciones/música y las limitaciones de continuidad.

## Trabajo ya realizado

- Revisión de continuidad del 6 de septiembre: leídos `AGENTS.md` y este resumen; contrastados rama, último commit, scripts de `package.json`, 11 capítulos Ink y 11 PNG de Mitsuki. El README conserva documentación de la plantilla y el plan maestro visual tiene fechas/estados anteriores; no sustituyen al código como evidencia del avance actual. No se repitieron builds ni validadores.
- Historia principal estructurada en 11 capítulos Ink con traducciones españolas por capítulo.
- Demo del capítulo 1 + extra y variantes de build web, Windows y Android.
- Builds completas para Windows (portable e instalador) y Android ARM64.
- Precarga por capítulo, liberación/retención limitada de texturas, perfiles de rendimiento, ticker inactivo en escenas estáticas y assets reducidos por plataforma.
- Avance mediante click/táctil/lápiz, orientación móvil, transiciones optimizadas y cierre de ventana Tauri implementados en código.
- Despliegue automático de GitHub Pages para la demo web y release de prueba trabajado anteriormente.
- Icono personalizado incorporado como maestro Tauri y regenerado para Windows, Android, iOS y PWA.
- Guion alternativo sin narrador preparado fuera del runtime y borrador bilingüe del epílogo de Mitsuki creado.
- Guía de resoluciones, planes visuales y múltiples fondos/CG de capítulo 1 y epílogo preparados. La selección final e integración de varias variantes sigue abierta.

## Pruebas ejecutadas y resultados

Comprobadas el 1 de septiembre de 2026:

- `npm run build`: **correcto**. Generó el plan de precarga de 11 capítulos, transformó 3664 módulos y produjo `dist/`. Vite avisó de chunks minificados mayores a 500 kB; no impidió el build.
- `npm run lint`: **falló** con 104 problemas (98 errores y 6 avisos). Incluye deuda previa en hooks, tipos, variables no usadas y reglas nuevas de React; no fue modificada en esta tarea.
- `npm run validate:translations`: **falló** con 1736/1739 entradas traducidas. Capítulo 1 tiene 2 faltantes y capítulo 8 tiene 1; también hay entradas extra. Los numerosos avisos de personajes/comandos aparecen porque el validador aislado no registra todo el runtime, pero los tres faltantes sí son deuda verificable.
- No se ejecutaron builds Tauri completos, instaladores, APK ni una prueba visual/end-to-end en esta tarea.
- Validación manual previa reportada por el usuario: el portable de PC funciona fluido. Resultado actual en tablet Android: pendiente de verificar con el último build.

Comprobadas el 6 de septiembre, solo para el experimento de ending:

- `npm run build:ending-lab`: correcto (incluye TypeScript). ESLint de `main.ts` del experimento y `vite.ending-lab.config.ts`: correcto. No se repitieron lint/build completos del juego.
- Prueba en navegador: carga, pausa, búsqueda temporal, parpadeo a 2.60 s, comparación estática, títulos y movimiento reducido; revisión visual a 390×844 y 1280×800. Sin errores/avisos en la consola consultada.
- Perfil de detalle en navegador de escritorio/desarrollo: muestra de 10 s a 60 FPS, intervalo p95 16.8 ms, envío de dibujo p95 0.3 ms, 0 intervalos >50 ms, canvas 1003×564. No mide tiempo de GPU ni rendimiento real de Android.
- Perfil ligero en preview de producción: 29.9 FPS, intervalo p95 33.5 ms, envío de dibujo p95 1.9 ms, 1 intervalo >50 ms, canvas 1134×638. Se comprobaron también activación del audio sin errores de consola, pantalla completa y detención del ending en 24 s. Las dos muestras tienen tamaños distintos y no son un benchmark comparativo de hardware.
- Los WebP cargados por el perfil ligero suman aproximadamente 392 KB. El perfil limita el canvas a 1152 px y el dibujo a 30 FPS. Medición física en MatePad y comportamiento dentro del juego completo pendientes.

Montaje MP4 posterior del 6 de septiembre:

- Generado `artifacts/ending-mitsuki-v1/ending-mitsuki-1080p-v1.mp4`: 90 s, 1080p, 24 FPS/2160 fotogramas, H.264 + AAC estéreo, ~70.8 MB. Preview 960×540 disponible. Son 12 planos a partir de CG y 8 a partir de clips existentes, con reencuadres, transiciones, partículas discretas y títulos.
- FFmpeg decodificó el MP4 completo sin errores. Revisados 20 fotogramas representativos y transiciones/título; se corrigió el tiempo del nombre de Fuutarou. Sintaxis del script y comprobación de espacios correctas. Audio analizado técnicamente en el primer corte, sin saturación; no hubo evaluación auditiva ni prueba Android.
- Originales conservados; montaje y títulos editables, sin integración al juego ni publicación. La coherencia visual entre estilos/edades y la selección definitiva quedan para revisión del usuario.

Ampliación interactiva posterior a la aclaración del usuario:

- Mitsuki: 72 s/14 planos, tratamientos Luz cálida y Neón gráfico; este último es el inicial por la referencia de Cyberpunk: Edgerunners. Pausa, búsqueda, selección de planos, bucle de un plano, comparación original, música opcional con reloj sincronizado y archivo local reemplazable por sesión. Miku sigue disponible en el selector.
- Build y TypeScript aislados, ESLint de `main.ts`, `mitsuki-ending.ts`, `neon-treatment.ts` y configuración Vite: correctos. Sintaxis de los scripts y espacios correctos.
- Corregido empaquetado alfa de ambos experimentos: `removeAlpha` y `joinChannel` juntos descartaban transparencia; ahora se materializa RGB antes de añadir el canal y se comprueba el alfa. Las métricas antiguas de Miku NO describen la versión corregida.
- Revisados retratos cálido/neón, parpadeo a 2.61 s, tríptico, controles, comparación, movimiento reducido, vuelta a Miku y vistas de 1280×900 y 390×844. En preview de producción el pase y la música se detienen a 72 s; se comprobó reanudación desde otro plano. Los errores transitorios de HMR por HTML todavía sin actualizar se resolvieron recargando; última consulta sin errores nuevos en producción. Un bloqueo inicial del navegador por límite de uso se resolvió en el reintento después de la petición de continuar. Vista de producción disponible en `http://127.0.0.1:1431/?quality=lite`, marcada para conservarse; tamaño de prueba del navegador restaurado.
- Perfil ligero en escritorio/producción con neón y música, canvas 1134×638: 30 FPS, intervalo p95 33.5 ms, envío de dibujo p95 1.1 ms, 0 intervalos >50 ms durante 10 s. No mide GPU ni Android. WebP ligero Mitsuki: 703,556 bytes; audio opcional: 3,549,864 bytes. Memoria decodificada/neón y rendimiento físico pendientes.
- Variante romántica posterior: build/TypeScript y ESLint de los cuatro módulos del ending correctos. Revisados en producción la selección exclusiva entre tres variantes, retrato inicial con título, color pastel/pétalos y un CG posterior durante reproducción. Aplicada `look=hope` en la misma pestaña. No se repitió el benchmark ni se midió Android para este tratamiento; las cifras de la viñeta anterior corresponden al neón.

Refinamiento del 8 de septiembre (pase ampliado):

- Rangos de gestos consecutivos en los dos planos del nacimiento y los dos del cumpleaños, evitando retrocesos al cambiar encuadre. Velo de lectura sincronizado con títulos; velos inferiores diagonales despejan rostros.
- Build/TypeScript aislados y ESLint de los cinco módulos correctos. Revisión visual del cierre refinado en producción; sin errores/avisos de consola. README actualizado con 32 planos/144 s, fuentes, cronología y empaquetado.
- Romance y esperanza ligero/escritorio sin música, canvas 1003×564: 29.7 FPS, intervalo p95 33.5 ms, envío Canvas p95 0.8 ms, 2 intervalos >50 ms durante 10 s de apertura. No mide GPU ni Android. Hojas ligeras 4,428,948 bytes; demás WebP ligeros Mitsuki 1,189,492 bytes; la memoria decodificada es mayor.

## Problemas o bloqueos conocidos

- Rendimiento real del build Android más reciente sin confirmar en la Huawei MatePad 11; se necesita medir fluidez, memoria, entrada táctil y transiciones en dispositivo.
- El validador español mantiene 3 líneas sin correspondencia (2 en capítulo 1 y 1 en capítulo 8).
- El lint no está limpio: 98 errores y 6 avisos. El build TypeScript sí pasa.
- Vite todavía genera chunks grandes, en particular el bundle principal y PixiJS. Es una oportunidad de mejora, no un fallo de compilación.
- Parte de los CG/fondos son bocetos PNG pesados y existen variantes `vN`; falta elegir finales, exportar optimizados y eliminar referencias obsoletas sin borrar maestros útiles.
- El inventario de Mitsuki documenta más variantes de las que hoy existen en `background-fixed`; debe sincronizarse.
- La reescritura sin narrador y el epílogo de Mitsuki no están integrados al juego actual por decisión editorial.
- La URL/estado actual de GitHub Pages y los artefactos completos más recientes no se comprobaron durante esta tarea.

## Tareas pendientes, ordenadas por prioridad

1. Probar en la Huawei MatePad 11 el último APK del capítulo 1 + extra y registrar FPS percibido, tirones, tacto, audio y transiciones; optimizar solo a partir de esa evidencia.
2. Cerrar la selección visual del capítulo 1: aprobar una sola versión por CG, corregir detalles restantes, exportar a 1920×1080/WebP y actualizar manifiesto/Ink/galería.
3. Revisar los 11 CG actuales del epílogo de Mitsuki, actualizar su inventario y decidir cuáles quedan finales antes de integrar `extra_final_mitsuki.ink`.
4. Completar las 3 traducciones faltantes y volver a ejecutar el validador.
5. Reducir progresivamente la deuda de lint, priorizando reglas de hooks que puedan afectar comportamiento o rendimiento.
6. Probar `build:windows:full` y `build:android:full`, comprobar iconos, Salir, avance por click/tacto, guardado/carga y tamaño de artefactos.
7. Cuando los CG estén cerrados, revisar la variante sin narrador y decidir qué descripciones explicativas conservar antes de integrarla.
8. Verificar el despliegue actual de GitHub Pages y documentar la URL estable de la demo.

## Próximo paso concreto para retomar el trabajo

Revisar la versión ampliada y cronológica de **Romance y esperanza** (32 planos/147 s) en `http://127.0.0.1:1431/?quality=lite&look=hope`. Ajustar especialmente la continuidad visual entre edades/estilos de los recursos, velocidad de los gestos y sincronía musical; el usuario aprobó el filtro y pidió aprovechar más material. Neón gráfico, Luz cálida y Miku bajo la lluvia siguen disponibles. No continuar exportaciones MP4 por ahora; Suno está pospuesto. Sin integración al juego, commits ni publicación. Pendientes prueba física en MatePad y CG definitivos.
