# Final Regret — estudio interactivo de ending

La misma base de Miku ahora permite elegir dos experimentos: **Mitsuki · Contigo**, un pase de 72 s/14 planos a partir de 9 CG, y **Miku · Bajo la lluvia**, la escena original de 24 s.
El entregable es esta vista interactiva: el usuario aclaró que no quiere exportación MP4 por ahora. El anime recibido se usa como referencia de dirección visual.
No modifica la historia, los fondos del capítulo 1, las partidas ni las rutas del juego.
Los derivados y los títulos son provisionales; no se consideran arte final aprobado.

## Abrir

Desde la raíz del repositorio:

```powershell
npm run dev:ending-lab
```

Abrir `http://127.0.0.1:1430/`.

La vista inicial muestra **Romance y esperanza**, la nueva variante solicitada por el usuario. **Luz cálida** y **Neón gráfico** siguen disponibles. Enlaces directos: `/?look=hope`, `/?look=warm`, `/?look=neon`, `/?quality=lite`, `/?scene=miku`.

```powershell
npm run build:ending-lab
npm run preview:ending-lab
```

La compilación queda en `dist/ending-lab/`; la vista previa de producción usa el puerto 1431.
La configuración Vite es independiente. Los builds normales no incluyen este experimento.
El build normal puede reemplazar `dist/`; ejecutar de nuevo `build:ending-lab` si ocurre.

## Qué probar

### Mitsuki · Contigo

- **Pase de ending:** nueve ilustraciones, 14 planos, 72 s. Detalles, retratos, un tríptico y cierre; se detiene al finalizar.
- **Romance y esperanza:** acabado pastel con sombras suavizadas, luz dorada de amanecer, resplandor rosado, bokeh en los bordes y pétalos discretos. Disolvencias de 1.5 s entre todos los planos y cierre hacia marfil en 2.3 s. El tríptico aparece con el fundido, sin barridos. Conserva los mismos CG, encuadres, parpadeo y duración. **Luz y pétalos** y **Intensidad** regulan la atmósfera; movimiento reducido congela la luz y elimina los pétalos animados. La corrección de color se calcula por textura, conservando su transparencia; al cambiar de variante se libera la caché de la variante anterior.
- **Luz cálida:** cámara suave, profundidad por capas en el retrato de Mitsuki, respiración, parpadeo, luz de ventana, partículas, bokeh y disolvencias.
- **Neón gráfico:** colores cuantizados, amarillo/cian/magenta, fondo gráfico en el retrato, ecos de silueta, líneas, semitono, barridos diagonales y breves tiras desplazadas cerca de los cortes. No hay flashes de pantalla completa. El color se calcula una vez por textura y se reutiliza; no hay lectura de píxeles por frame.
- **Mantener plano:** repite el plano seleccionado. La tira de miniaturas y el selector permiten saltar entre los 14 planos. **CG original** muestra su fuente sin tratamiento.
- Parpadeo y respiración se aplican al retrato inicial de Mitsuki y al centro del tríptico. Los otros CG tienen movimiento de cámara/composición; no tienen nueva animación corporal.
- **Activar música:** reproduce el instrumental recibido como referencia. La reproducción usa el reloj del audio; pausa, búsqueda, cambio de escena y ocultación de pestaña sincronizan ambos. La música es opcional, sin reproducción automática al cargar.
- En **Ajustar efectos → Elegir canción** se puede probar un archivo local durante la sesión. No sube archivos ni cambia la música original del proyecto. El montaje mantiene 72 s y todavía requiere ajustar el ritmo a la canción definitiva.

### Miku · Bajo la lluvia

- **Escena viva:** fondo y Miku en capas, cámara lenta, desplazamiento con cursor, respiración, parpadeo, dos planos de lluvia y anillos sobre el suelo. Bucle de 24 segundos.
- **CG original:** comparación estática con la composición original, sin efectos añadidos. Parte de la lluvia ya está pintada en el recurso original.
- **Pase de ending:** tres títulos de muestra, reencuadre y fundidos; se detiene a los 24 segundos. No contiene texto canónico nuevo ni la canción definitiva del usuario.
- **Pausa y línea de tiempo:** permiten inspeccionar ojos abiertos/cerrados y cualquier momento. El primer cierre completo está en 2.60 s.
- **Activar lluvia:** ambiente sintetizado localmente con Web Audio, opcional. Se silencia durante pausa, comparación y al ocultar la pestaña.
- **Ajustar efectos:** permite desactivar capas de movimiento, cambiar intensidad, activar movimiento reducido y seleccionar calidad.

El movimiento reducido sigue la preferencia del sistema al abrir la página; inicia en pausa. El control local permite probarlo sin cambiar el sistema operativo.
La animación se suspende cuando la pestaña está oculta; el reloj no salta al volver.

## Medición y Android

En ajustes, escoger perfil, reproducir y pulsar **Medir durante 10 s**. Hay 1 segundo de calentamiento.
Se puede descargar un JSON con perfil, resolución, efectos, FPS dibujados, percentil 95 de intervalos, intervalos >50 ms y coste del envío de comandos Canvas.
Cambiar efectos, pausar, redimensionar u ocultar la pestaña cancela la muestra para evitar mezclar condiciones.

- Ligero: imágenes de 1152 px de ancho, canvas limitado a 1152 px y objetivo de 30 FPS.
- Detalle: imágenes de 1672 px, canvas limitado a 1920 px y objetivo de 60 FPS.
- Los perfiles cargan sus imágenes correspondientes al seleccionarse. No cargan capítulos, Pixi, modelos 3D ni fuentes externas.
- **El tiempo de envío de Canvas no mide la GPU, y el perfil ligero no emula un dispositivo Android.**
- Esta prueba aislada no predice por sí sola el rendimiento dentro del juego completo, donde habrá otras cargas.

Para probar físicamente en la MatePad, se puede servir la prueba en la red local con `npm run dev:ending-lab -- --host 0.0.0.0` y abrir `http://<IP-del-PC>:1430/?quality=lite` desde la tablet en la misma red. El acceso depende del firewall; no se cambiaron reglas ni se publicó la prueba.

Recorrer ambos modos, pausa, reanudación, pantalla completa, tacto y sonido. Guardar una medición con el mismo tamaño y los mismos efectos en cada perfil. La prueba física y la integración en APK siguen pendientes.

## Validación inicial de Miku (6 de septiembre de 2026)

Estas cifras corresponden a la primera versión. Posteriormente se corrigió el empaquetado de transparencia: Sharp descartaba el alfa al combinar `removeAlpha` y `joinChannel` en la misma operación. Ambos scripts ahora materializan RGB antes de añadir la máscara y verifican que el WebP conserve alfa. Las mediciones iniciales no describen la versión corregida ni el ending de Mitsuki.

- Build de producción y TypeScript: correctos. ESLint de los dos archivos TypeScript nuevos: correcto. `git diff --check`: sin errores de espacios.
- Revisión visual en navegador, incluyendo 390×844 y 1280×800: sin desbordamiento horizontal observado; controles accesibles y encuadre 16:9 conservado.
- Comprobados pausa, búsqueda a 2.60 s, ojos cerrados, comparación estática, movimiento reducido, títulos, fin del pase a 24 s y entrada/salida de pantalla completa. Activación/desactivación de audio aceptada por el navegador, sin errores de consola; no se hizo evaluación auditiva.
- Detalle, servidor de desarrollo, canvas 1003×564: 60 FPS, intervalo p95 16.8 ms, envío de dibujo p95 0.3 ms, 0 intervalos >50 ms.
- Ligero, compilación de producción, canvas 1134×638: 29.9 FPS, intervalo p95 33.5 ms, envío de dibujo p95 1.9 ms, 1 intervalo >50 ms.
- Son muestras de 10 s del navegador de escritorio con distintos tamaños; no comparan hardware ni sustituyen la prueba física en Android. Descarga de JSON y cambios reales de visibilidad no se comprobaron manualmente.

## Validación del pase de Mitsuki (6 de septiembre de 2026)

- Añadido posteriormente **Romance y esperanza**: build/TypeScript y ESLint correctos; revisión visual de producción del retrato con título y de un CG posterior, y selección de la tercera variante. No se repitió la medición de rendimiento para este tratamiento. Las cifras siguientes son de la variante neón anterior.
- TypeScript, build aislado y ESLint de los tres módulos TypeScript y la configuración Vite: correctos. Scripts de empaquetado verificados con `node --check`; `git diff --check` correcto.
- Revisados en navegador el retrato cálido y neón, el parpadeo a 2.61 s, el tríptico, títulos, selector de plano, comparación, movimiento reducido y el regreso a Miku con las transparencias corregidas. Revisadas vistas de 1280×900 y 390×844.
- Perfil ligero en preview de producción, neón con música, canvas 1134×638: muestra de 10 s a **30 FPS**, intervalo p95 **33.5 ms**, envío de dibujo p95 **1.1 ms**, **0 intervalos >50 ms**. No mide GPU ni rendimiento real de Android.
- La imagen y el audio se detuvieron al llegar a 72 s. Se comprobó la reanudación desde otro plano. Sin evaluación auditiva artística ni prueba de una canción alternativa mediante el selector de archivo.
- Los 12 WebP de Mitsuki en perfil ligero suman **703,556 bytes**; el MP3 opcional pesa **3,549,864 bytes**. La memoria de imágenes decodificadas, copias neón y buffers es mayor que el tamaño de descarga; falta medirla en la MatePad.
- Durante la edición aparecieron errores transitorios de HMR al cargar módulos antes de los elementos HTML nuevos (`look-controls` y `music`); se resolvieron al recargar. La última consulta no mostró errores nuevos en producción. El límite de uso bloqueó inicialmente la revisión automática del navegador; el reintento tras la petición de continuar permitió hacer estas comprobaciones.

## Archivos y reutilización

- `main.ts`: reproducción, capas Canvas 2D, reloj, partículas, audio y medición.
- `mitsuki-ending.ts`: dirección editable de los 14 planos, encuadres, títulos, compositor y transiciones.
- `mitsuki-assets.json`: relación de nombres cortos con los CG fuente en `background-fixed`. Para sustituir una ilustración, cambiar el archivo de esta tabla y volver a empaquetar. Si se reemplaza el retrato `hero`, se deben rehacer su máscara/fondo/parpadeo y las coordenadas de ojos.
- `neon-treatment.ts`: paleta y capas gráficas de la variante neón.
- `hope-treatment.ts`: acabado pastel cacheado, luz de amanecer, resplandor rosado y pétalos dibujados en Canvas. No requiere imágenes ni descargas nuevas.
- `style.css` e `index.html`: presentación y controles fuera de la imagen.
- `assets/`: imágenes WebP empaquetadas y registro de coordenadas.
- `../../artwork/experiments/ending-lab/`: placas generadas y prompts exactos.
- `../../scripts/prepare-ending-lab-assets.mjs`: empaquetado reproducible con Sharp; admite `--sharp <ruta-al-paquete>` si Sharp procede de un runtime externo.
- `../../scripts/prepare-mitsuki-live-assets.mjs`: empaquetado de los nueve CG en dos resoluciones, capas y música de referencia. Mismo argumento `--sharp`.

Miku se obtiene aplicando la máscara generada al CG original. El parpadeo solo superpone pequeñas zonas de ojos con bordes suaves, para conservar el resto de la cara. Conviene refinar manualmente la máscara y crear párpados intermedios si se aprueba el efecto para producción.

Para un ending definitivo, el siguiente paso sería definir duración y puntos musicales con la canción del usuario, sustituir los títulos y ampliar la secuencia con CG aprobados. Esta prueba es interactiva; no entrega todavía un MP4 renderizado.
