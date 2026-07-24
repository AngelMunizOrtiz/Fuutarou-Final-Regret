# Plan maestro visual de Final Regret

Ultima revision: 2026-07-21

Este documento organiza el estado visual real del proyecto. Su alcance principal es el arco del ryokan y las aguas termales, desde el capitulo 2 hasta el final del capitulo 7, junto con la continuidad inmediata del capitulo 8.

Fuentes de verdad del proyecto:

- Guion: `src/ink/start.ink` y `src/ink/chapters/`
- Fondos y CG de Pixi: `src/assets/manifest.ts`
- Catalogo de sprites DOM: `src/data/characterSprites.ts`
- Fondos del bloque: `public/images/backgrounds/chapter_02/`
- Sprites: `public/images/characters/`
- Archivo de produccion: `artwork/`

## 1. Leyenda de estados

- `LISTO`: imagen final aprobada, registrada en el manifest e insertada en el guion.
- `PREPARADO`: escena, numero, funcion narrativa y fondo base definidos; falta dibujarla.
- `PENDIENTE`: necesidad detectada, pero falta cerrar su composicion o producir el recurso.
- `POR AUDITAR`: el guion existe, pero aun no se hizo un desglose visual completo.

Terminos usados:

- `BG`: fondo reutilizable sin personajes.
- `Variante`: cambio de clima o luz del mismo BG, sin consumir un numero nuevo.
- `Inserto`: plano de detalle reutilizable, por ejemplo una nota, radio o cajon.
- `Sprite`: personaje recortado para dialogos normales.
- `CG`: ilustracion de evento con composicion propia y personajes, reservada para un momento narrativo concreto.

## 2. Resumen general

| Area | Estado | Avance real |
| --- | --- | --- |
| Guion | LISTO para desglose | Capitulos 1 al 11 presentes en Ink |
| Recursos previos al viaje del capitulo 2 | LISTO | 6 de 6 activos e integrados |
| Fondos del ryokan y aguas termales | LISTO | 10 BG numerados + 1 variante de lluvia |
| Integracion de BG del arco termal | LISTO | Usados entre capitulos 2 y 7; BG_010 abre tambien el capitulo 8 |
| Sprites principales | LISTO como referencia | 12 personajes con varias poses; Isanari joven tiene 5 expresiones y Fuutarou nino 3 |
| CG del arco capitulos 2-7 | EN CURSO | 26 definidos; CG_001 dibujado e integrado |
| Fondos propios del capitulo 8 | LISTO | BG_011, BG_012 y BG_012_Rain producidos e integrados |
| Capitulos 9-11 | EN CURSO | Capitulo 9 ya cuenta con BG_013 y BG_014; faltan sus escenas previas y los capitulos 10-11 |
| Compilacion | LISTO | `npm run build` superado el 2026-07-19 |

Importante: los 26 CG de este documento son la lista cerrada del arco de los capitulos 2 al 7. No representan todavia la totalidad de CG del juego. El siguiente bloque empezara en `CG_027` despues de auditar los capitulos 8 al 11.

## 3. Recursos previos al ryokan ya listos

Estos recursos pertenecen al comienzo del capitulo 2 y ya estan registrados e integrados. No forman parte de la numeracion `BG_001-BG_010` del recinto termal.

| Recurso | Funcion |
| --- | --- |
| `uesugi_home_exterior_morning_motorcycle_v2.webp` | Exterior de la casa Uesugi y motocicleta |
| `uesugi_entryway_inside_hallway_v3.webp` | Entrada interior de la casa |
| `uesugi_main_room_note_table_v3.webp` | Habitacion principal con la nota |
| `uesugi_raiha_note_radio_table_cg_v4.webp` | Inserto de la nota de Raiha |
| `uesugi_radio_weather_table_cg_v4.webp` | Inserto del pronostico del tiempo |
| `fuutarou_historical_warlords_gifts_closeup.webp` | Inserto del cajon y los regalos historicos |

## 4. Fondos del ryokan ya listos

Todos los fondos finales tienen formato `1672 x 941`, estan registrados en `src/assets/manifest.ts` y aparecen en el archivo de su capitulo bajo `src/ink/chapters/`.

| ID | Archivo canonico | Uso principal | Estado |
| --- | --- | --- | --- |
| `BG_001` | `onsen_arrival_parking_bg_001.webp` | Estacionamiento inferior, llegada de la limusina | LISTO |
| `BG_002` | `onsen_ryokan_forest_entrance_bg_002.webp` | Camino boscoso y fachada de acceso al ryokan | LISTO |
| `BG_002_Rain` | `onsen_ryokan_forest_entrance_bg_002_rain.webp` | Variante lluviosa reutilizable de BG_002 | LISTO |
| `BG_003` | `onsen_reception_staircase_bg_003.webp` | Recepcion, mostrador y escalera contigua | LISTO |
| `BG_004` | `onsen_courtyard_window_corridor_bg_004.webp` | Pasillo acristalado con vista al patio | LISTO |
| `BG_005` | `onsen_stairwell_landing_bg_005.webp` | Escalera y rellano para Fuutarou y Yotsuba | LISTO |
| `BG_006` | `onsen_womens_bath_vestibule_bg_006.webp` | Vestibulo de los tres banos: hombres, mixto y mujeres | LISTO |
| `BG_007` | `onsen_destiny_bell_overlook_bg_007.webp` | Mirador y campana del destino | LISTO |
| `BG_008` | `onsen_quintuplets_tatami_room_bg_008.webp` | Habitacion tatami de las quintillizas | LISTO |
| `BG_009` | `onsen_uesugi_family_tatami_room_bg_009.webp` | Habitacion de Fuutarou, Raiha e Isanari | LISTO |
| `BG_010` | `onsen_upper_ryokan_motorcycle_forecourt_bg_010.webp` | Explanada superior, motocicleta y comienzo de la bajada | LISTO |

### Uso por capitulo

- Capitulo 2: `BG_001`, `BG_002`.
- Capitulo 3: `BG_002_Rain`, `BG_006`, `BG_004`, `BG_009`, `BG_007`.
- Capitulo 4: `BG_008`.
- Capitulo 5: `BG_009`, `BG_004`, `BG_008`, `BG_003`, `BG_005`.
- Capitulo 6: `BG_005`, `BG_003`; el extra reutiliza `BG_005`.
- Capitulo 7: `BG_003`, `BG_010`; el extra reutiliza ambos.
- Capitulo 8: abre con `BG_010`, pero necesita fondos propios al comenzar el descenso.

## 5. Cola oficial de CG del arco termal

No hay distincion entre CG esenciales y opcionales. Todos los momentos de esta lista forman parte del plan oficial y conservaran su numero aunque se produzcan en otro orden.

### Capitulo 2: llegada

- [x] `CG_001 - Reencuentro de Raiha con las hermanas`
  - Raiha abraza a Ichika, Nino e Itsuki frente al ryokan.
  - Fondo base: `BG_002`.
  - Funcion: primera recompensa emocional de la llegada y presentacion grupal del arco.

### Capitulo 3: reunion y lluvia

- [ ] `CG_002 - Fuutarou abre por accidente la entrada del bano`
  - Encuadre comico y no explicito; la puerta y el vapor protegen la composicion.
  - Personajes: Fuutarou, Ichika, Nino, Itsuki y Yotsuba.
  - Fondo base: `BG_006`.

- [ ] `CG_003 - El abuelo agradece a Fuutarou`
  - Ambos se inclinan mutuamente despues del agradecimiento por la felicidad de las hermanas.
  - Fondo base: `BG_004`.

- [ ] `CG_004 - Fuutarou solo bajo la campana`
  - Fuutarou contempla la campana despues de la lluvia, en silencio.
  - Fondo base: `BG_007`.

### Capitulo 4: decision de Yotsuba

- [ ] `CG_005 - Conversacion sobre el amor alrededor del kotatsu`
  - Ichika, Nino, Itsuki y Yotsuba reunidas; tono intimo y reflexivo.
  - Fondo base: `BG_008`.

- [ ] `CG_006 - Yotsuba pide ayuda a sus hermanas`
  - Yotsuba reune valor y formula su peticion; las demas reaccionan con atencion.
  - Fondo base: `BG_008`.

### Capitulo 5: el juego de Rena

- [ ] `CG_007 - Las cuatro Rena alineadas en el pasillo`
  - Las cuatro hermanas disfrazadas esperan a Fuutarou con los rostros parcialmente ocultos.
  - Fondo base: `BG_004`.

- [ ] `CG_008 - Nino cubre los ojos de Fuutarou`
  - Nino oculta su rubor tapandole los ojos desde atras.
  - Fondo base: `BG_004`.

- [ ] `CG_009 - Ichika acaricia la cabeza de Fuutarou`
  - Momento afectuoso y jugueton; puede incluir el inicio de la devolucion del gesto.
  - Fondo base: `BG_008`.

- [ ] `CG_010 - Sonrisa de Itsuki despues del agradecimiento`
  - Fuutarou le agradece todo lo aprendido y ella responde con una sonrisa calida.
  - Fondo base: `BG_003`.

- [ ] `CG_011 - La ultima Rena se revela como Yotsuba`
  - Yotsuba domina la parte alta del encuadre mientras Fuutarou la mira desde el rellano.
  - Fondo base: `BG_005`.

### Capitulo 6: Fuutarou y Yotsuba

- [ ] `CG_012 - Fuutarou intenta acercarse en la escalera`
  - Fuutarou sube un escalon; Yotsuba retrocede y mantiene la distancia.
  - Fondo base: `BG_005`.

- [ ] `CG_013 - Yotsuba anuncia la ruptura`
  - Momento frontal, contenido y doloroso; ambos separados por la propia escalera.
  - Fondo base: `BG_005`.

- [ ] `CG_014 - Golpes debiles y empujon de Yotsuba`
  - Su mano queda sobre el pecho de Fuutarou antes de apartarlo.
  - Fondo base: `BG_005`.

- [ ] `CG_015 - Abrazo, despedida y reverencia`
  - Fuutarou la abraza, la suelta y se inclina para agradecerle todo.
  - Fondo base: `BG_005`.

- [ ] `CG_016 - Despedida entre el presente y la infancia`
  - Composicion simbolica tipo limbo luminoso: Fuutarou y Yotsuba actuales junto a sus versiones infantiles.
  - Escenario propio, limpio y emotivo; no reutiliza un BG literal.

- [ ] `CG_017 - Yotsuba llora abrazada por sus hermanas`
  - Ichika, Nino e Itsuki sostienen a Yotsuba despues de que Fuutarou se marcha.
  - Fondo base: `BG_005`.

- [ ] `CG_018 - Maruo lanza el paraguas a Fuutarou`
  - El paraguas queda en movimiento entre ambos; Maruo serio y Fuutarou preparado para partir.
  - Fondo base: `BG_003`.

### Capitulo 7: Aoi, Isanari y la partida

- [ ] `CG_019 - Confesion del joven Isanari a Aoi`
  - Isanari adolescente se inclina ante Aoi al confesarle sus sentimientos.
  - Escenario propio de juventud; debe definirse usando referencias del flashback.

- [ ] `CG_020 - Montaje de la vida de Aoi e Isanari`
  - Una ilustracion narrativa dividida en momentos: estudios, apertura de la panaderia, propuesta y familia.
  - Escenario compuesto en varias vinetas coherentes.

- [ ] `CG_021 - Despedida de Aoi en el hospital`
  - Aoi e Isanari se toman del brazo o de la mano durante su ultima conversacion.
  - Escenario propio de hospital.

- [ ] `CG_022 - Isanari se derrumba al volver a casa`
  - Fuutarou y Raiha ya fueron enviados a su habitacion; Isanari queda solo y rompe en llanto.
  - Escenario propio de la antigua casa Uesugi.

- [ ] `CG_023 - Isanari llora frente a Maruo en el presente`
  - Isanari se cubre los ojos al recordar a Aoi; Maruo permanece a su lado.
  - Fondo base: `BG_003`.

- [ ] `CG_024 - Raiha se despide junto a la motocicleta`
  - Raiha anima a Fuutarou antes de que descienda a buscar a Miku.
  - Fondo base: `BG_010`.

- [ ] `CG_025 - Fuutarou conversa con el abuelo antes de partir`
  - El abuelo reconoce el cambio de Fuutarou y revela que su nombre es Ren.
  - Fondo base: `BG_010`.

- [ ] `CG_026 - Maruo y Ren observan la bajada`
  - Ambos quedan en la explanada mientras Fuutarou y la motocicleta desaparecen por la ladera.
  - Fondo base: `BG_010`.

## 6. Fondos pendientes inmediatos

### Capitulo 8

Estos son los siguientes fondos ya identificados. La numeracion continua desde `BG_010`.

- [x] `BG_011 - Carretera de descenso de la montana`
  - Continuidad directa de `BG_010`.
  - Carretera vehicular ancha, descenso perceptible, bosque y montanas coherentes con el ryokan.
  - Uso: monologo de Fuutarou mientras conduce hacia Yuzine.

- [x] `BG_012 - Calle Eien del pueblo de Yuzine`
  - Debe reunir la panaderia cerrada, el banco, la maquina expendedora y la iglesia Sutekina visible.
  - Uso: espera de Fuutarou, llegada de Miku y conversacion principal.

- [x] `BG_012_Rain - Calle Eien bajo la lluvia`
  - Misma camara y arquitectura que `BG_012`; suelo mojado y cielo cubierto.
  - No consume un numero nuevo.

El interior de la iglesia y los recuerdos intercalados del capitulo 8 deben decidirse durante el desglose de CG. No se les asignara un BG nuevo hasta confirmar que realmente necesitan un fondo reutilizable.

### Capitulos 9 al 11

Estado: `EN CURSO`.

El guion utiliza actualmente `bg01-hallway` y `bg02-dorm` como fondos provisionales. Antes de numerar nuevos BG hay que hacer un pase escena por escena. Lugares ya detectados:

- Capitulo 9: `BG_013` cubre el rooftop al atardecer y `BG_014` el exterior del instituto Asahiyama. Siguen pendientes el trayecto en motocicleta, restaurante, biblioteca, aulas y pasillos.
- Capitulo 10: iglesia Sutekina, salon de recepcion y exterior de despedida junto a la limusina.
- Capitulo 11: exterior de la nueva panaderia, tienda interior, vivienda superior y rincon de recuerdos.

## 7. CG futuros por auditar

Estos momentos probablemente necesitaran ilustracion, pero aun no reciben numero oficial. Despues de revisarlos en detalle, continuaran desde `CG_027` sin renumerar los 26 anteriores.

- Capitulo 8: reencuentro bajo la lluvia, confesion repentina, caida al sonar las doce, recuerdos del beso bajo la campana, Miku llorando, declaracion final y caminata compartiendo paraguas.
- Capitulo 9: trabajo conjunto como profesores, baile privado y propuesta.
- Capitulo 10: ceremonia, fotografias, bailes con los padres, discurso familiar y salida de la iglesia.
- Capitulo 11: inauguracion de la panaderia, reunion familiar y Miku frente al rincon de recuerdos.

## 8. Recursos de personajes disponibles

Hay sprites y hojas de referencia para:

- Fuutarou, Ichika, Nino, Miku, Yotsuba e Itsuki.
- Raiha, Isanari, Maruo, Ren/abuelo Nakano y Takeda.

Estos sprites sirven para continuidad de rostro, cabello, ropa y color, pero un CG necesitara poses completas y referencias del anime para manos, perspectiva e interaccion entre personajes.

Tambien faltan referencias especificas para:

- Aoi joven, adulta y hospitalizada.
- Isanari joven adulto; su set adolescente de 5 expresiones ya esta producido e integrado.
- Yotsuba infantil para `CG_016`; el set de Fuutarou nino ya tiene 3 expresiones integradas.
- Vestuario especial de Rena para `CG_007-CG_011`.
- Variantes de yukata y ropa de viaje cuando no coincidan con los sprites actuales.

## 9. Convencion para nuevos recursos

- Resolucion final: `1672 x 941`, relacion 16:9.
- Estilo: anime 2D de novela visual, formas limpias, sombreado moderado y continuidad cromatica con los BG aprobados.
- Sin subtitulos, marcas de agua, interfaz ni texto incrustado, salvo elementos diegeticos indispensables.
- Mantener libre la franja inferior cuando el cuadro vaya a convivir con la caja de dialogo.
- Nombre sugerido: `cg_001_raiha_reunion.webp`, `cg_002_bath_door_accident.webp`, etc.
- Alias sugerido: `onsen-cg-001-raiha-reunion`, `onsen-cg-002-bath-door-accident`, etc.
- Los archivos finales pueden alojarse en `public/images/cg/onsen_arc/` para no mezclarlos con BG ni borradores.

## 10. Flujo de trabajo para atacar la lista

Para cada BG o CG:

1. Confirmar el momento exacto del guion y reunir referencias.
2. Acordar encuadre, personajes, expresion, vestuario y fondo base.
3. Generar una primera version 16:9.
4. Corregir un detalle por vez hasta recibir `CHECK`.
5. Copiar la version aprobada con nombre canonico.
6. Registrar fondos y CG en `src/assets/manifest.ts`, o sprites en `src/data/characterSprites.ts`.
7. Insertarla en el archivo correcto de `src/ink/chapters/`.
8. Ejecutar build y una comprobacion visual en el juego.
9. Marcar la casilla correspondiente en este documento.

## 11. Siguiente objetivo recomendado

El siguiente recurso recomendado es `CG_002 - Fuutarou abre por accidente la entrada del bano`.

Debe usar `BG_006` como referencia directa, mantener una composicion comica y no explicita, y bloquear la identidad de Fuutarou, Ichika, Nino, Itsuki y Yotsuba con los sprites aprobados. El lenguaje visual base de los CG queda fijado por `CG_001`.

## 12. Limpieza tecnica

Estado: `LISTO`.

- `public/images/` contiene solo recursos consumidos por el runtime.
- Bocetos, previews y versiones antiguas viven en `artwork/bocetos/`.
- Chroma keys, hojas y transparencias de trabajo viven en `artwork/fuentes/`.
- Las referencias visuales viven en `artwork/referencias/`.
- Los PNG maestros de produccion se conservan en `artwork/fuentes/production-originals/`.
- Los recursos de runtime usan WebP lossless; el manifest y el catalogo usan esas rutas.
- Los sprites DOM se cargan bajo demanda desde el catalogo y no se duplican como texturas Pixi.
