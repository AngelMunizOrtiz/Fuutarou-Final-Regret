# Capítulo 9: plan de sprites y candidatos de vestuario

Estado: selección aprobada, lote definitivo producido e integrado.

## Continuidad narrativa

- El capítulo comienza 19 meses después del viaje a las aguas termales y siete meses después del reencuentro del capítulo 8.
- Toda la acción principal ocurre durante un único día: reencuentro, restaurante, biblioteca, práctica docente, azotea y propuesta.
- No existe una transición narrativa que justifique cambiar el vestuario base entre esas escenas.
- Miku puede añadir un delantal sencillo durante su clase de cocina y quitárselo después; el resto del atuendo debe conservarse.
- Raiha aparece dentro de Asahiyama y necesita un pequeño lote con uniforme escolar propio del capítulo 9.
- El guion contiene 55 intervenciones de Fuutarou, 53 de Miku y 3 de Raiha; las escenas conversacionales ya incluyen órdenes de sprite específicas del capítulo 9.

## Lote definitivo

- Miku: opción 4 aprobada; 11 variantes con tejido terracota, falda azul marino y cárdigan camel, más una variante docente sin cárdigan, con delantal crema y coleta baja.
- Fuutarou: opción 1 aprobada; 10 variantes con blazer carbón desestructurado, camisa Oxford celeste abierta y pantalón negro.
- Raiha: uniforme escolar de Asahiyama y 3 variantes: saludo alegre, explicación neutral y sorpresa tímida.
- Las acciones físicas grandes —abrazo, baile, propuesta, caída y beso— permanecen cubiertas por CG; los sprites se reservarán para los diálogos y transiciones.

## Candidatos de Miku

Lámina: `artwork/bocetos/characters/chapter_09_miku_wardrobe_candidates/miku_chapter_09_wardrobe_candidates.png`.

1. Vestido tejido ciruela con cinturón azul marino.
2. Blusa crema de cuello alto y vestido sin mangas azul marino.
3. Blusa verde azulado y falda plisada carbón.
4. Tejido terracota, falda azul marino y cárdigan camel.
5. Vestido cruzado malva con medias carbón.
6. Suéter marfil, falda verde bosque y chaqueta corta azul marino.

Condiciones comunes del prompt: preservar la identidad adulta de Miku, ojos azules, cabello castaño rojizo muy largo y suelto, proporciones y estilo de sprite; sin audífonos, uniforme, delantal, sombrero, bolso, marcas ni texto adicional.

## Candidatos de Fuutarou

Lámina: `artwork/bocetos/characters/chapter_09_fuutarou_wardrobe_candidates/fuutarou_chapter_09_wardrobe_candidates.png`.

1. Blazer carbón desestructurado y camisa Oxford celeste.
2. Chaqueta café tipo café-racer y tejido crema de cuello alto.
3. Sobrecamisa de lana oliva y henley marfil.
4. Cárdigan burdeos y camisa blanca sin corbata.
5. Chaqueta de campo gris y tejido negro.
6. Chaqueta de trabajo entallada verde petróleo y tejido gris claro.

Condiciones comunes del prompt: preservar rostro, ojos dorados, cabello negro con ahoge, complexión delgada y estilo de sprite; evitar la chaqueta azul de capítulos 2-3, la parka del capítulo 8, traje completo, corbata, accesorios, marcas y texto adicional.

## Producción

- Modo: ImageGen integrado con referencias locales y preservación de identidad.
- Ancla de Miku: `artwork/fuentes/production-originals/characters/miku/miku_gentle.png`.
- Fuente generada de Miku: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-d8b29748-ec96-4a22-9c13-3c31caf6b82c.png`.
- Ancla de Fuutarou: `artwork/fuentes/production-originals/characters/fuutarou/fuutarou_soft_smile.png`.
- Fuente generada de Fuutarou: `C:/Users/Angel/.codex/generated_images/019f9b10-7b3b-7101-b308-ee4e101e3715/exec-75606d31-3587-412d-9744-14f7e7f54065.png`.

## Resultado integrado

- Maestros PNG: `artwork/fuentes/production-originals/characters/{miku,fuutarou,raiha}/chapter_09/`.
- Runtime WebP: `public/images/characters/{miku,fuutarou,raiha}/chapter_09/`.
- Registro: `src/data/characterSprites.ts`.
- Guion: `src/ink/chapters/chapter_09.ink`.
- Hojas finales: `artwork/bocetos/characters/chapter_09_{miku,fuutarou,raiha_school}_final/`.
- Especificación reproducible y procedencia: `artwork/fuentes/characters/chapter_09_sprite_final.md`.
