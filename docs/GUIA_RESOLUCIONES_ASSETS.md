# Guía de resoluciones maestras y exportación

Esta guía separa el archivo de trabajo de CSP de la versión que se incorpora al juego. Los archivos maestros deben conservarse fuera de `public/`; a `public/` solo van las exportaciones optimizadas.

La composición base del juego es **16:9** y la escena de referencia es **1920 × 1080 px**.

## Tabla rápida

| Recurso | Archivo maestro de trabajo | Exportación estándar al proyecto | Android durante build completo |
| --- | --- | --- | --- |
| Fondo nuevo | 2560 × 1440 px | 1920 × 1080 px | máximo 1152 × 648 px |
| CG nuevo | 2560 × 1440 px | 1920 × 1080 px | máximo 1152 × 648 px |
| CG con paneo, zoom o animación | 3840 × 2160 px | 1920 × 1080 px | máximo 1152 × 648 px |
| Sprite normal | 1240 × 1752 px, transparente | 620 × 876 px, transparente | se conserva en 620 × 876 px |
| Overlay o efecto a pantalla completa | 2560 × 1440 px | 1920 × 1080 px | máximo 1152 × 648 px |
| Icono de aplicación | 1024 × 1024 px, cuadrado | `icon.png` de 512 × 512 px | mismo icono; Tauri genera sus tamaños derivados |
| Elementos UI escalables | SVG o CSS | vectorial | vectorial |
| Elementos UI rasterizados | al doble de su tamaño visual | 1× del tamaño visual | igual que PC, salvo que el build lo reduzca |

## Fondos, CG y overlays

- Mantener siempre la relación **16:9**: 2560 × 1440 para el trabajo normal y 3840 × 2160 cuando habrá cámara, zoom o movimiento.
- Exportar la versión que entra al repositorio a **1920 × 1080 px**. No es necesario dejar los 2K o 4K en `public/`.
- Usar `.webp` para fondos y CG finales siempre que no se necesite transparencia. PNG queda reservado para una fase de edición o transparencias que se deban conservar.
- El perfil de compilación completo de Android vuelve a limitar automáticamente fondos, CG y recuerdos a **1152 × 648 px**. No hace falta crear una copia Android manual.
- No cambies el encuadre al reducir: usa una reducción proporcional, sin recortar ni estirar la imagen.

## Sprites de personajes

La resolución que usa actualmente el juego para los sprites existentes de Fuutarou, Miku y Raiha es **620 × 876 px**.

1. En CSP, dibujar cada sprite en un lienzo de **1240 × 1752 px** con fondo transparente.
2. Conservar el personaje centrado y los pies en la misma línea base que las demás expresiones. Así no “salta” al cambiar de emoción dentro de la VN.
3. Exportar una copia final a **620 × 876 px**.
4. Guardarla como `.webp` con transparencia en `public/images/characters/<personaje>/`.

La reducción de 1240 × 1752 a 620 × 876 es exactamente al **50 %**. Esto conserva el trazo limpio y mantiene el consumo de memoria bajo en PC, tablet y Android.

> No conviene incorporar al juego sprites de 1240 × 1752 como versión final: aunque funcionen, duplican aproximadamente el área de imagen y aumentan la memoria que necesita cada escena.

## Icono de la aplicación

El archivo actual que utiliza la app es `src-tauri/icons/icon.png` de **512 × 512 px**. Para editarlo con margen suficiente:

1. Trabajar en CSP con un maestro cuadrado de **1024 × 1024 px**.
2. Mantener los rostros y detalles importantes dentro del 80 % central del lienzo: Windows y Android pueden aplicar máscaras o esquinas redondeadas.
3. Reducir a **512 × 512 px** y sustituir `src-tauri/icons/icon.png`.
4. Regenerar los iconos derivados de Tauri antes de compilar una nueva versión.

## UI

- Para botones, marcos, texto decorativo y adornos simples, priorizar **SVG/CSS**: se ven nítidos en cualquier resolución y no añaden peso al juego.
- Si un elemento debe ser raster, crear el maestro al doble del tamaño que se verá en pantalla y exportar la copia 1× para el proyecto.
- Mantener fondos, CG y UI separados: los fondos van en `public/images/backgrounds/`, los CG en `public/images/cg/` y la UI en `public/images/ui/`.

Como referencia, los elementos UI actuales tienen tamaños variados porque se escalan por CSS: el marco de diálogo `dialog_box_v2.webp` mide 1751 × 278 px y el cuadro de nombre `name_box_v2.webp` mide 480 × 90 px. No hace falta forzarlos a 16:9.

## Reducción en CSP

Al exportar una versión final:

1. Duplica el archivo maestro; nunca reduzcas la única copia editable.
2. Usa **Cambiar resolución de imagen** y conserva la relación de aspecto.
3. Elige interpolación de alta calidad (bicúbica o equivalente) al bajar tamaño.
4. Revisa a 100 % de zoom: líneas de ojos, dedos, cabello y texto decorativo son las zonas que más revelan una mala reducción.
5. Exporta con un nombre final claro. Ejemplo: `mitsuki_normal.webp` o `cg_epilogue_morning.webp`.

## Resumen de carpetas

| Tipo | Ubicación de exportación |
| --- | --- |
| Sprites | `public/images/characters/<personaje>/` |
| Fondos | `public/images/backgrounds/` |
| CG | `public/images/cg/<capítulo>/` |
| UI | `public/images/ui/` |
| Icono fuente de la app | `src-tauri/icons/icon.png` |

La automatización de build completo aplica sus límites finales al ejecutar `npm run prepare:windows:full` o `npm run prepare:android:full`. La tabla anterior es la referencia para que los originales, las exportaciones y los builds se mantengan coherentes.
