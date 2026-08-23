# Capítulo 11: sprites definitivos de Miku y Fuutarou en la panadería

Estado: diseños aprobados, lote expresivo producido, transparencia revisada, escala normalizada y variantes registradas para runtime.

## Continuidad aprobada

- La secuencia transcurre durante una misma visita a la panadería, un año después de la boda.
- Miku conserva durante todo el capítulo el cabello suelto de la opción 1, la polera gris clara con franjas blancas, el delantal completo azul grisáceo, la falda larga azul marino y los zapatos marrones.
- El diseño base de Miku no muestra embarazo. La revelación se comunica únicamente mediante el gesto de una mano sobre el vientre, sin cambiar su silueta.
- Fuutarou conserva la opción 5: chaqueta de panadero carbón con cierre asimétrico, delantal corto azul marino, pantalón negro y zapatos negros.
- Ninguno lleva sombrero de chef, uniforme de maid ni elementos del vestuario de boda.

## Variantes definitivas

### Miku

1. `gentle_welcome`: bienvenida tranquila.
2. `ring_proud`: muestra con orgullo el anillo hecho a mano.
3. `family_reveal`: gesto cálido sobre el vientre durante el anuncio familiar.
4. `playful_fufu`: sonrisa juguetona con la mano cerca de los labios.
5. `teary_memory`: recuerdo emotivo con lágrimas contenidas.
6. `bright_call`: respuesta alegre de «¡Ya voy!».

### Fuutarou

1. `soft_welcome`: bienvenida serena.
2. `awkward_explain`: explicación incómoda con una mano detrás del cuello.
3. `earnest_pitch`: presentación muy seria del nombre de la panadería.
4. `startled_protest`: protesta sorprendida con la mano al frente.

## Producción visual

- Modo: ImageGen integrado, con edición guiada por referencias locales y bloqueo de identidad, vestuario y proporciones.
- Resumen del prompt: producir sprites 2D de novela visual, de cuerpo completo, conservando exactamente el diseño adulto aprobado; modificar solamente expresión y gesto; usar una figura, sin texto, accesorios nuevos ni escenario, sobre fondo cromático plano.
- La referencia aprobada de Miku se conserva en `artwork/bocetos/characters/chapter_11_miku_bakery_final/chroma/miku_bakery_reference.png`.
- La referencia aprobada de Fuutarou corresponde a `exec-482c9722-4ce0-425d-a780-594bfbb2ba62.png` en el directorio integrado de ImageGen.

### Fuentes de las variantes de Miku

| Variante | Fuente generada |
|---|---|
| gentle_welcome | copia de la referencia aprobada `miku_bakery_reference.png` |
| ring_proud | `exec-082cb8c4-7222-498e-abad-3950a8c38a1e.png` |
| family_reveal | `exec-9a72d8b8-8bf4-4eab-8b2f-177d46ceda4e.png` |
| playful_fufu | `exec-f676c381-0cc8-4b1f-8c53-cbde7a7d8732.png` |
| teary_memory | `exec-d632a066-a6e6-4a72-a61a-3e85d9ad992a.png` |
| bright_call | `exec-d6e78326-f6fa-4dc4-be43-89f9e90b3e15.png` |

### Fuentes de las variantes de Fuutarou

| Variante | Fuente generada |
|---|---|
| soft_welcome | `exec-482c9722-4ce0-425d-a780-594bfbb2ba62.png` |
| awkward_explain | `exec-cbcfadbb-ba5f-4109-869d-82987a90448d.png` |
| earnest_pitch | `exec-adaa3b24-7ed2-402c-9f16-b27f19defc4e.png` |
| startled_protest | `exec-47476349-5edc-4ae7-8d53-ac55b8dc6ea4.png` |

## Procesamiento y control

- Extracción del fondo cromático con alfa real y limpieza adicional de contaminación magenta en Miku.
- Normalización por altura visible contra las referencias aprobadas del capítulo 10.
- Salida estándar: `620 × 876`, PNG maestro y WebP de runtime.
- Todas las variantes comparten anclaje inferior, centrado de lienzo y cuatro esquinas transparentes.
- Hojas de control:
  - `artwork/bocetos/characters/chapter_11_miku_bakery_final/miku_final_contact_sheet.png`
  - `artwork/bocetos/characters/chapter_11_fuutarou_bakery_final/fuutarou_final_contact_sheet.png`

## Rutas finales

- Maestros Miku: `artwork/fuentes/production-originals/characters/miku/chapter_11/`
- Runtime Miku: `public/images/characters/miku/chapter_11/`
- Maestros Fuutarou: `artwork/fuentes/production-originals/characters/fuutarou/chapter_11/`
- Runtime Fuutarou: `public/images/characters/fuutarou/chapter_11/`
- Registro: `src/data/characterSprites.ts`

## Integración narrativa

Las diez variantes quedan disponibles en el registro. El guion de `chapter_11.ink` no se altera todavía porque la secuencia actual está montada principalmente con CG; superponer sprites sin revisar ese montaje ocultaría o duplicaría parte de la composición. Las claves quedan listas para incorporarlas cuando se haga el pase narrativo del capítulo 11.
