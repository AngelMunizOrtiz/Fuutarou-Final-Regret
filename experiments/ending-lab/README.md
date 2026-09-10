# Final Regret — estudio interactivo de ending

**Mitsuki · Contigo**: 39 planos, 147 segundos, 23 ilustraciones y 220 fotogramas de 13 clips del usuario. Incluye el nuevo cierre «Ya estoy en casa» (02:01). **Miku · Bajo la lluvia** conserva la escena de 24 segundos. Entregable Canvas interactivo, sin exportación de película ni integración al juego. Arte y títulos provisionales.

## Abrir

Desde la raíz: `npm run dev:ending-lab` → `http://127.0.0.1:1430/?quality=lite&look=hope`.

Producción: `npm run build:ending-lab` y `npm run preview:ending-lab` → `http://127.0.0.1:1431/?quality=lite&look=hope`.

El build incluye TypeScript y queda en `dist/ending-lab/`. Usa configuración Vite independiente; los builds normales no incluyen el experimento y pueden reemplazar `dist/`.

## Cronología

| Tiempo | Etapa | Recuerdos |
| --- | --- | --- |
| 00:00–00:23 | Desde que llegaste | Miku con recién nacida, despertar, brazos abiertos y besos de padres |
| 00:23–00:35.5 | Descubrir el mundo | Campo, primeros pasos y pequeños intentos |
| 00:35.5–01:18 | Los días contigo | Apego a papá, consuelo, lección de Raiha, noche, mañana siguiente y salida juntos |
| 01:18–02:01 | Todo lo que vendrá | Cuidados de papá, limonada, lectura, paseo y cumpleaños |
| 02:01–02:27 | Ya estoy en casa | Miku y Mitsuki dormidas, regreso del trabajo, sábana y un beso en la cabeza a cada una |

Los ojos normales preceden a la lección de Raiha y a los ojos tiernos del día siguiente. Los cambios de encuadre del nacimiento y cumpleaños recorren tramos consecutivos del gesto, evitando retrocesos. Las edades, pelo y estilos de las bases aún requieren coherencia artística al sustituirlas.

## Tratamiento y controles

- **Romance y esperanza**, inicial: pastel, sombras suaves, luz dorada/rosada progresiva, pétalos y bokeh discretos. Transiciones proporcionales al plano (26%, hasta 1.2 s/1.55 s radial), cierre marfil de 2.3 s. La secuencia nocturna usa cortes de detalle y fundidos breves de 0.3–0.85 s para que los gestos se lean sin superponer rostros durante mucho tiempo.
- **Luz cálida** conserva cámara y partículas. **Neón gráfico** mantiene amarillo/cian/magenta, ecos, semitono y barridos. Enlaces `?look=warm`, `?look=neon` y `?scene=miku`.
- Se utilizan 23 CG y 13 clips de `public/images/cg/epilogue-mitsuki/background-fixed/`. Se excluyen duplicados, variantes muy similares, clips verticales con subtítulos y páginas con globos extensos. Originales conservados.
- Los clips aportan fotogramas existentes interpolados con fundidos; no son nueva animación generada ni reproducción del MP4 a su frecuencia original. Gestos rápidos pueden mostrar doble contorno.
- El retrato de Mitsuki conserva capas, respiración y parpadeo. Otros CG estáticos usan cámara/composición. Nino conserva su proporción dentro de una fotografía.
- Pausa, reinicio, búsqueda, selector de 39 planos, miniaturas y cinco botones de etapa. **Mantener plano** repite un recuerdo; **Comparar original** muestra la fuente sin acabado.
- **Activar música** usa el instrumental recibido, opcional sin reproducción automática. Su reloj sincroniza imagen, pausa y búsqueda. **Elegir canción** admite archivos locales durante la sesión sin subirlos ni modificar el proyecto. El montaje mantiene 147 s; falta ajustar su ritmo a la canción definitiva.
- Ajustes de cámara, parpadeo, respiración, atmósfera, intensidad y calidad. Movimiento reducido congela gestos y partículas y omite transiciones; sigue la preferencia del sistema e inicia en pausa. Ocultar la pestaña suspende animación y sonido.
- Miku conserva lluvia Canvas, profundidad, anillos y ambiente Web Audio opcional. Primer parpadeo completo a 2.60 s.

## Recursos y rendimiento

- Ligero: CG hasta 1152 px, fotogramas 512×288, canvas hasta 1152 px, objetivo 30 FPS.
- Detalle: CG hasta 1672 px, fotogramas 768×432, canvas hasta 1920 px, objetivo 60 FPS.
- Hojas WebP de cuatro columnas cargadas por proximidad. Se retienen actual, siguiente y saliente, hasta tres; se libera su copia tratada al expulsarlas. Posters cargados por perfil sirven de respaldo mientras una hoja opcional descarga o si falla.
- Color calculado por textura, sin procesar píxeles de pantalla por frame. Cambiar de acabado libera la caché inactiva.
- Hojas ligeras: 4,428,948 bytes. Otros WebP ligeros Mitsuki: 1,189,492 bytes. MP3 opcional: 3,549,864 bytes. Imágenes decodificadas y copias ocupan más memoria que la descarga.

En ajustes, reproducir y pulsar **Medir durante 10 s**. Incluye un segundo de calentamiento, FPS, intervalo p95, intervalos >50 ms y envío Canvas, con descarga JSON. Cambiar ajustes/tamaño, pausar u ocultar cancela la muestra. El envío Canvas no mide GPU; el perfil ligero no emula Android.

Prueba física en MatePad e integración pendientes. Para probar en red local: `npm run dev:ending-lab -- --host 0.0.0.0` y abrir `http://<IP-del-PC>:1430/?quality=lite` en tablet. Depende del firewall; no se cambiaron reglas ni se publicó la prueba.

## Validación

- Ampliación: TypeScript/build aislado, ESLint de cinco módulos y sintaxis del extractor correctos. Revisados nacimiento, abrazo al despertar y cierre de cumpleaños en producción.
- Refinamiento del 8 de septiembre: build/TypeScript correctos. Corregidos rangos consecutivos de gestos y velos de títulos.
- Romance ampliado, ligero/escritorio, canvas 1003×564: muestra de 10 s de apertura a **29.7 FPS**, intervalo p95 **33.5 ms**, envío Canvas p95 **0.8 ms**, **2 intervalos >50 ms**. Sin música. No mide GPU ni Android.
- Verificación histórica de la base: pausa, búsqueda, comparación, parpadeo, movimiento reducido, sonido sin errores de consola, pantalla completa y vistas 390×844/escritorio. Las métricas antiguas de Miku/neón de 72 s no describen este pase. Sin evaluación auditiva artística.

## Editar y empaquetar

- `mitsuki-sequence.ts`: orden, duración, encuadres, rangos, transiciones y títulos.
- `mitsuki-assets.json`: alias de los 23 CG. Cambiar fuente y volver a empaquetar. Reemplazar `hero` exige rehacer máscara, fondo, párpados y coordenadas.
- `mitsuki-motion.json`: clips, rangos temporales y número de fotogramas.
- `mitsuki-ending.ts`: compositor y carga por proximidad; `hope-treatment.ts` y `neon-treatment.ts`: acabado y atmósfera.
- `main.ts`: reproducción, audio, controles, Miku y medición.
- `assets/mitsuki/motion-registration.json`: registro de extracción. Placas/prompts en `artwork/experiments/ending-lab/` desde la raíz.

Desde la raíz:

```powershell
node scripts/prepare-mitsuki-live-assets.mjs --sharp <ruta-al-paquete-sharp>
node scripts/prepare-mitsuki-motion.mjs --sharp <ruta-al-paquete-sharp>
npm run build:ending-lab
```

Extractor requiere FFmpeg (`FFMPEG_PATH` opcional). `prepare-ending-lab-assets.mjs` empaqueta Miku. Se preservan maestros y alfa en las capas. Siguiente paso artístico: unificar las bases y ajustar puntos musicales manteniendo el montaje editable.

## Nuevos CG de cuidados (8 de septiembre)

Generados con la herramienta integrada image_gen y guardados en `public/images/cg/epilogue-mitsuki/background-fixed/`:

- `ending-fuutarou-fever-bed-v1.png`: Fuutarou en cama con toalla y Mitsuki fuera de la habitación (01:41).
- `ending-mitsuki-worried-door-v1.png`: plano cercano de la niña apoyada en el marco (01:46).
- `ending-miku-offers-apron-v1.png`: Miku muestra el delantal crema y diadema rosa de la cocina (01:51).

Prompts exactos: `artwork/experiments/ending-lab/mitsuki/care-prompts-v1.json`. Referencias: CG del padre, Miku y fotograma de la limonada; los nuevos CG encadenan la misma casa y ropa. Medicina sobre la mesita, limonada como gesto de cuidado. Imágenes base sin efectos horneados; cámara y acabado se aplican en Canvas. Se acortó un segundo cada plano de la etapa doméstica para conservar 144 s y todas las fuentes anteriores; cocina/cumpleaños conservan sus tiempos. El total anterior de bytes no incluye los seis nuevos WebP derivados. Empaquetado evita reescribir WebP idénticos para prevenir bloqueos de lectura en Windows.

## Recuerdos familiares y referencias de sprites

Tres CG adicionales creados con la herramienta integrada image_gen, manteniendo el diseño aprobado de Mitsuki y usando como referencias de los padres `miku/chapter_11/miku_gentle_welcome.webp` y `fuutarou/chapter_11/fuutarou_soft_welcome.webp`:

- `ending-family-lemonade-gift-v1.png`: entrega de la limonada, con ayuda de Miku (02:03).
- `ending-family-reading-v1.png`: lectura de los tres, después de la recuperación (02:09).
- `ending-family-sunset-walk-v1.png`: paseo de los tres al atardecer (02:14).

Maestros en `public/images/cg/epilogue-mitsuki/background-fixed/`. Prompts exactos en `artwork/experiments/ending-lab/mitsuki/family-prompts-v1.json`. Los sprites orientan los rasgos; los CG anteriores conservan continuidad de ropa y casa. Son 18 ilustraciones estáticas más los 220 fotogramas existentes. Los nuevos CG tienen cámara y atmósfera en tiempo real, sin animación corporal generada.

Montaje vigente: 32 planos/147 s. Se fusionan los dos encuadres del nacimiento y los dos del cumpleaños, se sustituye el tríptico repetido y se acorta un segundo el último plano de cocina. Se conservan todas las fuentes anteriores y el retrato animado. La música de referencia dura 147.84 s y el fade visual/audio termina antes. La luz de la lectura usa tratamiento nocturno. Los tiempos de la sección histórica de cuidados corresponden al pase anterior; ahora comienza a 01:35.

Build/TypeScript, ESLint de secuencia/compositor y empaquetado de 18 CG correctos. Las cifras de rendimiento y bytes anteriores no incluyen esta ampliación. El empaquetado ahora evita reescribir también registro, ojos y música idénticos para evitar bloqueos de lectura en Windows.

## Pulido de presentación

Atmósfera por entorno: polvo tenue y menos velo en casa; luz discreta en lectura/noche; pétalos en campo y paseo; resplandor del atardecer desde el lado del sol. Se mezclan los ambientes durante las transiciones. Las transiciones románticas duran 26% del plano hasta 1.2 s (1.55 s apertura radial), dando más tiempo a los insertos breves. Intensidad y movimiento reducido siguen disponibles en Luz y ambiente.

El pase oculta las etiquetas de diagnóstico dentro de la imagen; Mantener plano conserva las etiquetas para inspección. Tarjeta final centrada desde 145.2 s y persistente sobre marfil al terminar a 147 s; buscar atrás restaura los títulos correspondientes. Mismo material, duración y música; no se realizó una sincronización artística nueva con la canción.

Build/TypeScript y ESLint correctos. Cierre centrado revisado en producción. Las mediciones anteriores no describen estos efectos ajustados.


## Cierre nocturno: regreso del trabajo (9 de septiembre)

Cinco keyframes creados con **image_gen integrado**, conservando a Mitsuki de pelo negro/pijama rosa, Miku cobriza/pijama azul y Fuutarou con uniforme negro de cocina. Maestros 1672×941 en `public/images/cg/epilogue-mitsuki/background-fixed/`; nombres `ending-home-sleeping-v1.png`, `ending-home-arrival-v1.png`, `ending-home-blanket-v1.png`, `ending-home-kiss-mitsuki-v1.png` y `ending-home-kiss-miku-v1.png`. Prompts completos y referencias: `artwork/experiments/ending-lab/mitsuki/homecoming-prompts-v1.json`.

| Inicio | Plano | Duración |
| --- | --- | --- |
| 02:01 | Ellas se quedaron dormidas esperándolo | 4 s |
| 02:05 | Fuutarou llega del trabajo | 3 s |
| 02:08 | Detalle de su expresión | 1.5 s |
| 02:09.5 | Las arropa con otra sábana | 3.5 s |
| 02:13 | Detalle de sus manos sobre la sábana | 1.5 s |
| 02:14.5 | Beso en la cabeza a Mitsuki | 4.5 s |
| 02:19 | Beso en la cabeza a Miku y cierre marfil | 8 s |

Los 32 planos anteriores ahora ocupan 121 s; se mantienen todas sus fuentes y los 220 fotogramas existentes. Son 39 planos/147 s en total. El último gesto queda sin títulos superpuestos hasta la tarjeta final a 145.2 s. La cámara saliente queda en su encuadre final durante las transiciones. El bloque nocturno usa luz de interior de noche, cortes de detalle y disolvencias breves; respeta movimiento reducido y comparación original. Las acciones nuevas son keyframes ilustrados con cámara en Canvas, no animación corporal continua. El encuadre de llegada cambia el ángulo del dormitorio; su geografía exacta todavía se puede uniformar en arte final.

Empaquetados full/lite correctos; los cinco CG nuevos añaden **403,032 bytes** en ligero. Build/TypeScript y ESLint de secuencia/compositor correctos. Comprobados duración, límites de búsqueda de los 39 planos y existencia de todos los posters en ambos perfiles. Revisados en navegador de producción los encuadres, besos, movimiento reducido, cambio de calidad y vista móvil 390×844. La activación de música funciona; no se afirma ajuste artístico a nuevos acentos musicales ni rendimiento físico en Android. Las métricas antiguas de rendimiento corresponden a versiones anteriores.
