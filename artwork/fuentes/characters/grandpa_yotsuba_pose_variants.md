# Variantes de pose: abuelo Nakano y Yotsuba-Rena

Fecha de producción: 2026-08-02

Modo de herramienta: edición `identity-preserve` con ImageGen integrado. Los
fondos chroma se retiraron localmente y los sprites finales se normalizaron al
lienzo de runtime `620 x 876`.

## Abuelo Nakano

Referencia de cada edición: el WebP de runtime aprobado de la misma expresión.

Invariantes compartidas: conservar exactamente rostro anciano, cabello gris,
expresión, arrugas, proporciones, haori verde, bordados, camiseta blanca,
pantalón negro, encuadre y sombreado. Cambiar solamente el brazo pasivo. Fondo
uniforme `#ff00ff`, sin sombras, texto, objetos ni extremidades duplicadas.

- `neutral`: colocar ambas manos naturalmente detrás de la zona lumbar; manos y
  antebrazos no visibles desde el frente.
- `authoritative`: conservar la mano elevada que acompaña el diálogo y colocar
  la mano contraria detrás de la espalda.
- `concerned`: conservar la inclinación hacia delante y la palma ofrecida;
  colocar la mano contraria detrás de la espalda.
- `grateful`: conservar la reverencia y la mano sobre el pecho; colocar la mano
  contraria detrás de la espalda.

Extracción del chroma: clave fija `#ff00ff`, matte suave, umbrales `40/160`,
despill y contracción de borde de un píxel. Los PNG transparentes se
normalizaron contra los sprites previos respaldados.

## Yotsuba con vestido de Rena

Referencia de cada edición: el WebP de runtime aprobado de la misma expresión.

Invariantes compartidas: conservar exactamente identidad de Yotsuba, cabello
bob naranja, ojos azules, expresión, rubor, proporciones corporales aprobadas,
vestido blanco-lila, mangas translúcidas, encaje floral, faja y lazo lavanda,
encuadre y sombreado. Cambiar solamente brazos, manos, hombros y la inclinación
mínima del torso. Fondo uniforme `#00ff00`, sin sombras, texto, objetos ni
extremidades duplicadas.

- `determined`: postura erguida, hombros firmes, una mano sobre el pecho y el
  brazo contrario relajado junto a la falda.
- `shocked`: ligera retirada del torso, hombros levantados y ambas manos
  separadas cerca de la clavícula con dedos tensos y abiertos.
- `crying`: hombros recogidos, una mano secando una lágrima y la otra sobre el
  pecho, manteniendo lágrimas, rubor y boca temblorosa.

Extracción del chroma: clave fija `#00ff00`, matte suave, umbrales `40/160`,
despill y contracción de borde de un píxel. La normalización usa altura visible
y ancla inferior para impedir que los gestos anchos reduzcan accidentalmente el
tamaño del personaje.

## Rutas finales

- Runtime del abuelo: `public/images/characters/grandpa_nakano/`
- Runtime de Yotsuba-Rena: `public/images/characters/yotsuba/rena_disguise/`
- Fuentes y respaldos del abuelo: `artwork/bocetos/characters/grandpa_nakano_sprites/`
- Fuentes y respaldos de Yotsuba-Rena: `artwork/bocetos/characters/rena_disguise_sprites/revealed/yotsuba/`
