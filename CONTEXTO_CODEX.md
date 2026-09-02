# Contexto de continuidad de Codex

## Fecha de actualización

1 de septiembre de 2026.

## Objetivo general del proyecto

Desarrollar **Fuutarou Final Regret**, una novela visual fan de *The Quintessential Quintuplets* centrada en la ruta de Miku, con historia bilingüe, CG y sprites propios, y versiones jugables optimizadas para web, Windows y Android. El objetivo inmediato combina terminar y uniformar el apartado visual con mantener una demo del capítulo 1 + extra y builds completas suficientemente fluidas, sobre todo en tablets Android.

## Estado actual

- Rama comprobada: `New-Optimization`; `HEAD` era `bef5373` (`Terminar Optimizacion y continuar con CG`) al iniciar esta actualización. El árbol estaba limpio antes de crear estos dos archivos.
- La historia activa contiene 11 capítulos Ink en `src/ink/chapters/`. Vite los precompila durante el build; el modo demo incluye solo el capítulo 1 y su extra.
- Existen scripts para demo de capítulo 1 en web, Windows y Android, y para la versión completa en Windows y Android. No se ejecutaron en esta tarea los empaquetados Tauri completos.
- El build web de producción pasa. La demo web tiene despliegue automático de GitHub Pages al hacer push a `main`; el estado y la URL pública actuales quedan pendientes de verificar externamente.
- La versión PC portable fue reportada por el usuario como fluida. El rendimiento de la última versión Android en la Huawei MatePad 11 todavía necesita una prueba física reciente; las primeras versiones llegaron a tener tirones severos.
- El trabajo visual vigente se concentra en terminar CG del capítulo 1 y en bocetos del epílogo cómico de Mitsuki. La carpeta `public/images/cg/epilogue-mitsuki/background-fixed/` contiene actualmente 11 PNG; el conteo de `docs/INVENTARIO_CG_EPILOGO_MITSUKI.md` está desactualizado y debe revisarse antes de usarlo como inventario definitivo.
- `src/ink-sin-narrador/` conserva una reescritura editorial separada de los 11 capítulos. No está integrada al runtime. Se mantiene aparte mientras el narrador aún ayuda a definir acciones y CG.
- `src/ink-borradores/extra_final_mitsuki.ink` y su JSON español son un borrador independiente; su integración en la historia principal está pendiente.

## Decisiones importantes y sus motivos

- **Conservar por ahora la historia activa con narrador.** Las descripciones todavía sirven como guía para componer CG y acciones. La variante reducida/sin narrador se revisará e integrará solo después de cerrar el apartado visual.
- **Separar borradores de contenido jugable.** `src/ink-sin-narrador/` y `src/ink-borradores/` no deben importarse accidentalmente desde el juego actual.
- **Cargar y liberar recursos por capítulo.** Evita cargar toda la VN al iniciar y reduce memoria y pausas, especialmente en Android.
- **Mantener movimiento ligero en Android.** El perfil móvil acorta transiciones y reduce resolución/FPS, pero no elimina las animaciones salvo que el sistema solicite movimiento reducido.
- **Preparar recursos distintos por plataforma sin alterar los maestros.** Los builds usan copias temporales en `.codex-tmp/`; Android reduce más las imágenes y omite el video del menú.
- **Composición visual base 16:9.** Fondos y CG se trabajan normalmente a 2560×1440 y se exportan a 1920×1080; para paneo/zoom se recomienda maestro 3840×2160. Sprites: maestro transparente 1240×1752 y exportación 620×876.
- **Continuidad del epílogo de Mitsuki.** La vivienda debe ser una casa japonesa contemporánea, cálida y modesta, no un departamento. Día 1: Mitsuki usa ojos normales y Raiha aparece desde la tarde. Día 2: Mitsuki usa los ojos tiernos aprendidos y Raiha ya no está. La posición y mirada de los personajes deben respetar el eje del genkan/puerta.
- **No confirmar assets nuevos solo por existir.** Versiones con sufijos `draft` o múltiples `vN` son candidatas de revisión; no se consideran finales ni integradas hasta comprobar referencias en manifiesto/Ink y aprobación del usuario.

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

## Trabajo ya realizado

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

Construir el APK actual del capítulo 1 + extra con `npm run build:android:chapter1`, instalarlo en la Huawei MatePad 11 y recorrer introducción, capítulo y extra anotando exactamente dónde aparecen tirones. Si la tablet no está disponible, continuar con la selección/exportación final de los CG del capítulo 1 y comprobar sus referencias en `src/assets/manifest.ts` y `src/ink/chapters/chapter_01.ink`.
