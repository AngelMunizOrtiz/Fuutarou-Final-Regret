# Revisión integral sin personaje narrador

## Objetivo

Esta revisión elimina por completo a `narrator` como hablante. La historia queda más cercana a una novela visual moderna: la cámara, los fondos, los CG, las expresiones, los silencios y los pensamientos de los personajes cuentan la escena.

No se elimina el contexto que el jugador necesita. Se cambia de medio:

- Los nombres de capítulo, lugares y saltos de tiempo pasan a ser **tarjetas visuales**.
- Las fichas de las quintillizas pasan a ser **tarjetas de personaje** superpuestas, no diálogo.
- Los timbres, campanas y golpes pasan a ser **SFX**.
- La información emocional pasa a pensamientos breves de Fuutarou o a diálogo entre los personajes.
- Las acciones ya visibles en un CG, fondo o sprite se eliminan del texto.

El documento cubre las 73 intervenciones explícitas de `narrator` y los bloques de prosa cercanos que conviene adelgazar. Los diálogos que no aparecen aquí se conservan tal como están.

> Estado: documento editorial de referencia. No modifica todavía los `.ink`; primero permite revisar tono, ritmo y continuidad antes de aplicar cambios al juego.

---

## Convención visual nueva

| Antes | Después | Implementación futura en Ink |
| --- | --- | --- |
| `narrator: Chapter X...` | Tarjeta de capítulo | Transición/imagen breve, sin caja de diálogo |
| `narrator: *Lugar*` | Tarjeta de localización | Fondo nuevo + rótulo discreto de 1–2 s |
| `narrator: *5 months later*` | Tarjeta temporal | Fundido corto con texto centrado |
| `narrator: Nombre(edad): ...` | Ficha de personaje | Overlay junto al sprite, sin avanzar texto |
| `narrator: *DING DONG*` | SFX de campana | Audio/subtítulo visual breve |
| Exposición emocional | Pensamiento o diálogo | Sólo si aporta información nueva |
| Acción visible en CG | Nada | El CG ya cuenta ese momento |

### Regla de ritmo

1. Un cambio de fondo ya comunica lugar; no repetirlo con una frase como “The rooftop”.
2. Un CG ya comunica una acción principal; no describir literalmente lo que el jugador está viendo.
3. Dejar una línea breve de descripción sólo cuando cambie una intención, un dato temporal o una emoción que no sea legible en pantalla.
4. Los pensamientos se reservan para Fuutarou, Miku y, puntualmente, el personaje que sostenga la escena. Deben ser cortos y concretos.

---

## Capítulo 1 — Extra

### Tarjeta de entrada

**Reemplazo de `Chapter 1 Extra`:**

```text
[EXTRA — Fuutarou y Takeda]
```

La frase “Fuutarou goes to the restroom, Takeda swiftly follows behind” se puede reducir a una sola transición de fondo. El sprite de Takeda detrás de Fuutarou y su primera línea ya explican la situación.

**Versión de escena:**

```text
[EXTRA — Fuutarou y Takeda]

fuutarou: Why do you always follow me here? Do you even have to go?
takeda: I always believe in true friendship.
takeda: Being like this is wonderful for relationships.
takeda: I'm truly glad our friendship has blossomed so well.

[CG: Takeda intenta abrazarlo.]

fuutarou: Don't you dare! Two stalls, Takeda!
```

---

## Capítulo 2 — The Hot Springs

### Entrada y localización

**Reemplazo de `Chapter 2: The Hot Springs...` y `Uesugi Home`:**

```text
[CHAPTER 2 — THE HOT SPRINGS]
[UESUGI HOME — MORNING]
```

No hace falta explicar que Fuutarou vuelve de un viaje: el fondo exterior, el sprite y su saludo a su madre lo establecen.

### Nota de Raiha

La nota no debe aparecer como diálogo atribuido a un personaje ausente. Debe ser una imagen/overlay legible que Fuutarou lee.

```text
[INSERT — NOTE LEFT BY RAIHA]

“Hey, Fuutarou!

It seems Maruo got impatient waiting, and his butler offered to drive us there. We couldn't pass up the offer, so we're going ahead of you!

Don't worry, we called your old manager and he agreed to let you use the motorcycle. It isn't that bad of a trip. You can make it!

P.S. We left you some money. It should be enough for a drink or two!

I'm sorry, brother! Love, Raiha.”

fuutarou: That guy, going off without me. I'll have to thank the manager later.
```

### Fichas de Itsuki, Nino, Ichika y Yotsuba

Las cuatro descripciones se convierten en fichas breves al entrar cada sprite. No deben frenar la escena ni sentirse como una voz externa.

```text
[CHARACTER CARD — ITSUKI NAKANO, 20]
Student teacher. Determined to continue her mother's legacy.

[CHARACTER CARD — NINO NAKANO, 20]
Restaurant manager. Aiming to build Japan's greatest restaurant.

[CHARACTER CARD — ICHIKA NAKANO, 20]
Actress whose first success opened the door to bigger roles.

[CHARACTER CARD — YOTSUBA NAKANO, 20]
Athletic university student. Still helping everyone she can — now with a white ribbon.
```

El abrazo con Raiha, la llegada tardía de Yotsuba y las bromas de las hermanas se sostienen solos con sprites, CG y diálogo. Las frases de acción se pueden dejar sólo como acotaciones internas de producción, no como texto para el jugador.

---

## Capítulo 3 — Meetup

### Tarjetas

```text
[CHAPTER 3 — MEETUP]
[HOT SPRINGS — RAIN]

[EXTRA — THE SLIPPERY FLOOR]
```

La llegada accidental al baño, el pasillo y la conversación con Ren ya tienen fondos y CG suficientes. Hay que conservar el diálogo y eliminar descripciones redundantes como “The door opens...” cuando el CG de la puerta ya se muestra.

### Ajuste de enfoque

En el momento de la pregunta de Ren, conservar sólo una transición silenciosa:

```text
[CG: Ren detiene a Fuutarou en el pasillo.]

grandpa: But tell me, Uesugi Fuutarou... Are you truly happy right now?
```

El gesto de Fuutarou y la pausa posterior cargan el peso emocional; no hace falta explicar su sobresalto dos veces.

---

## Capítulo 4 — Quint Talk

### Tarjetas

```text
[CHAPTER 4 — QUINT TALK]
[THE QUINTUPLETS' ROOM]

[EXTRA — AN AWKWARD DEJA VU]
```

La conversación sobre el amor funciona mejor si se ve como una charla íntima: el kotatsu, los sprites y los silencios bastan. Se eliminan frases visibles como “The Quint's room” y “The girls stared at Yotsuba”, dejando que la reacción facial comunique la tensión.

### Fragmento revisado

```text
yotsuba: Um, guys?
itsuki: What is it, Yotsuba?
yotsuba: What do you think love is?

[CG: Las cuatro hermanas quedan en silencio alrededor del kotatsu.]

nino: That's a dangerous question to ask so suddenly.
ichika: Especially when we already know who you mean.
```

Esta mínima adición reemplaza varias frases descriptivas y mantiene la intención de la escena.

---

## Capítulo 5 — The Final Game

### Tarjeta de capítulo y arranque del recuerdo

```text
[CHAPTER 5 — THE FINAL GAME]

[MEMORY FRAGMENTS]
Uesugi-san!
Hey, F—, did you know that Yot...
Let's do our best, Fuutarou-kun.
I won't hold back anymore.
I'm sure there's a better option...
Of course, in a weird way.
I can tell... She needs your help—
Fuutarou.
```

Los fragmentos ya son un recurso de memoria; no requieren una voz explicativa. Deben aparecer con fundido, eco o una animación breve, no en una caja de diálogo normal.

---

## Capítulo 6 — Fuutarou and Yotsuba

### Tarjetas

```text
[CHAPTER 6 — FUUTAROU AND YOTSUBA]

[EXTRA — FIVE MINUTES LATER]
```

La conversación entre ambos es suficientemente personal. El bloque “five minutes later” pasa a una tarjeta temporal, y el llanto de Yotsuba se deja entrar directamente por el audio y los sprites:

```text
[EXTRA — FIVE MINUTES LATER]

yotsuba: WAAAAAHHH!
nino: Alright, Yotsuba. Stop crying so we can ea— I can't get out of her grip.
```

---

## Capítulo 7 — Aoi and Isanari

### Tarjetas

```text
[CHAPTER 7 — AOI AND ISANARI]
[MEMORY — ASAHIYAMA HIGH SCHOOL]

[EXTRA — MARUO AND REN]
```

Este capítulo tiene mucho material visual: CG de la confesión, montaje de vida, panadería, hospital y despedida. La prosa debe ser especialmente mínima.

### Criterio para el montaje

Cada salto del montaje usa una tarjeta de dos o tres palabras, seguida directamente por el diálogo:

```text
[GRADUATION]
Congratulations on graduating!

[THE BAKERY OPENS]
aoi: Come to our bakery! We're open for business!

[YEARS LATER]
aoi: I think I'm pregnant!

[HOSPITAL]
doctor: Your wife is in critical condition.
```

La propuesta, el nacimiento de Raiha y la despedida de Aoi se deben sostener con los CG. Se eliminan frases que repiten lo que se ve, por ejemplo “Aoi grabs Isanari's arm”, antes de que ella hable.

---

## Capítulo 8 — Fuutarou and Miku

### Tarjeta de entrada

```text
[CHAPTER 8 — FUUTAROU AND MIKU]
```

### El recuerdo de Miku

**Antes:** una frase explicativa externa sobre los recuerdos de Fuutarou.

**Versión revisada:**

```text
[FLASHES: la sonrisa de Miku, su determinación, sus manos cubiertas de harina.]

fuutarou (thought): Her smile. Her stubbornness. Every small thing she did to move forward.
fuutarou (thought): I remember all of it.
```

El resto de recuerdos se puede condensar en una sola línea interna:

```text
fuutarou (thought): New Year's, Kyoto, the aquarium, the pool, the festival... I never stopped watching her become herself.
```

### Ensayo mental de la confesión

Las cuatro opciones no deben presentarse como texto externo. Son imitaciones mentales de Fuutarou, vinculadas visualmente a cada hermana.

```text
[FUUTAROU'S IMAGINATION — ICHIKA]
“Come now, can't you see how much I love you? Put your head on my lap. You look tired.”
fuutarou: No. That's too bold. That's Ichika's territory.

[FUUTAROU'S IMAGINATION — ITSUKI]
“Did you know the best way to get to someone's heart is through their stomach? Let's go to a buffet together.”
fuutarou: Definitely not. I barely have money with me.

[FUUTAROU'S IMAGINATION — NINO]
“You should be glad that someone like you is loved by someone like—”
fuutarou: Nino's way won't help either.

[FUUTAROU'S IMAGINATION — YOTSUBA]
“Let's go shopping, then to a Ferris wheel and a playground where I'll propose!”
fuutarou: Not the worst idea... but none of that is in this town.
fuutarou (thought): I'll do it my own way. I just have to find the words.
```

### Ficha de Miku

```text
[CHARACTER CARD — MIKU NAKANO, 20]
Culinary-school apprentice and event ambassador. She plans to work at Nino's restaurant — and one day open a bakery of her own.
```

Debe aparecer una sola vez al revelar a Miku bajo la lluvia, sin interrumpir el impacto del CG.

### Campanas y saltos temporales

Las 31 apariciones de `*DING DONG*` pasan siempre a:

```text
[SFX: DING DONG]
```

No se muestra una caja de diálogo; basta un subtítulo pequeño o el sonido. Las transiciones quedan así:

```text
[ONE YEAR EARLIER]

[BACK TO THE PRESENT]

[EXTRA — AFTER THE CONFESSION]
```

### Regla para esta ruta

El capítulo ya tiene suficientes CG y recuerdos. Las descripciones de acciones visibles se quitan: “Miku sits on the bench”, “Fuutarou runs”, “they fall”, etc. Sólo se conserva texto cuando revela un pensamiento, una decisión o una pieza de información que el CG no transmite.

---

## Capítulo 9 — 5-Star Proposal

### Tarjetas de escena

```text
[CHAPTER 9 — 5-STAR PROPOSAL]
[ASAHIYAMA HIGH SCHOOL]
[THE ROOFTOP]

[EXTRA — FIVE MONTHS LATER]
```

### Reescritura del almuerzo

Las cinco líneas actuales explican desde fuera cómo funciona la relación de Fuutarou y Miku. Conviene convertir esa información en una conversación breve, antes del chiste de “the entire menu”.

```text
miku: Are you sure you want to pay again? I can contribute too.
fuutarou: You already do. The material you send for my university projects helps more than you think.
miku: Then let me make it up to you on our next date.
miku: Just be warned, I may order the entire menu. Teehee!
```

Con esto se conserva todo el contenido importante: Fuutarou paga, Miku se siente incómoda, ella contribuye con su ayuda académica y ambos convierten el gesto en una broma afectuosa.

### Reglas para el resto del capítulo

- El abrazo del reencuentro se comunica con el CG; dejar sólo `miku: I missed you!` y la respuesta de Fuutarou.
- El beso corto se comunica con una pausa y las reacciones; no describirlo literalmente.
- La llegada al instituto y la azotea sólo necesitan tarjeta de lugar + cambio de fondo.
- En la propuesta, conservar los pensamientos de Fuutarou porque muestran su decisión; recortar acciones obvias como sentarse, mirar el asiento o caminar hasta una puerta.

---

## Capítulo 10 — Wedding

### Tarjetas

```text
[CHAPTER 10 — WEDDING]
[SUTEKINA CHURCH]
```

El CG del beso y el fondo de la iglesia sustituyen cualquier explicación inicial.

### Los tres sobres

La explicación de los destinatarios y la salida de Raiha debe ser diálogo funcional:

```text
raiha: Brother asked me to give these to you after they left.
raiha: One is for Itsuki, one is for Nino, and this one is for Ichika and Yotsuba together.
raiha: I have to go before Dad and Maruo drink themselves into another argument. See you!

itsuki: I wonder what's inside.
yotsuba: Only one way to find out!
```

Así la información llega desde un personaje presente y Raiha conserva su energía.

---

## Capítulo 11 — Epilogue

### Tarjetas

```text
[CHAPTER 11 — EPILOGUE]

[ONE YEAR LATER]
```

El montaje de carreras y el exterior renovado de la panadería hacen el trabajo visual. La línea sobre el año posterior debe aparecer sólo como tarjeta breve antes del nuevo fondo.

No es necesario explicar que las hermanas llegan a la tienda: el fondo, su entrada y sus primeros diálogos lo muestran.

---

## Lista de eliminación directa

Estas intervenciones desaparecen de la caja de diálogo y se sustituyen por el formato visual indicado arriba:

1. Los títulos de capítulo 2 a 11.
2. Los siete títulos de extra: capítulos 1, 3, 4, 6, 7, 8 y 9.
3. La nota de Raiha, convertida en insert legible.
4. Las cuatro fichas de capítulo 2 y la ficha de Miku del capítulo 8.
5. Las cuatro opciones mentales de Fuutarou del capítulo 8.
6. Las 31 campanas `DING DONG` del capítulo 8.
7. Los saltos `One year earlier`, `Back in the present`, `5 minutes later`, `5 months later` y `1 year later`.
8. Los rótulos de lugar: Asahiyama High School, The rooftop y Sutekina Church.
9. La exposición del almuerzo en capítulo 9, reemplazada por diálogo.
10. La explicación de los sobres en capítulo 10, reemplazada por diálogo de Raiha.

---

## Orden recomendado de implementación

1. Crear el componente visual reutilizable para tarjetas de capítulo, lugar, tiempo, ficha de personaje y SFX.
2. Reemplazar primero los 73 usos explícitos de `narrator` siguiendo este documento.
3. Jugar cada capítulo y recortar sólo la prosa no atribuida que repita fondo, sprite o CG.
4. Mantener pensamientos únicamente donde la imagen no pueda explicar la decisión interna.
5. Rehacer la transición entre capítulos con tarjetas visuales en lugar de texto de caja.

El resultado debe sentirse más cinematográfico: menos explicación, más actuación, pausas y composición visual.
