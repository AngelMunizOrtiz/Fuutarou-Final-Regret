# Variantes de pose: Nino, Ichika e Itsuki con vestido de Rena

Fecha de producción: 2026-08-03

Modo de herramienta: edición `identity-preserve` con ImageGen integrado. Cada
edición partió del sprite de runtime aprobado para esa misma expresión. Se usó
un fondo chroma uniforme `#00ff00`, que luego se retiró localmente, y los
resultados finales se normalizaron al lienzo de runtime `620 x 876`.

## Invariantes compartidas

Conservar exactamente la identidad, rostro, cabello, accesorios, expresión,
rubor, proporciones corporales aprobadas y sombreado de cada sprite. Mantener el
mismo vestido blanco-lila de Rena, mangas translúcidas, encaje floral, faja y
lazo lavanda. Cambiar solamente brazos, manos, hombros y la inclinación mínima
del torso necesaria para que el gesto resulte natural. Sin sombrero, peluca,
objetos, texto, sombras proyectadas ni extremidades duplicadas.

## Nino

- `annoyed`: brazos cruzados con firmeza bajo el pecho, hombros tensos y postura
  frontal cerrada, conservando exactamente su expresión molesta.
- `proud`: una mano apoyada en la cadera y la otra tocando ligeramente un mechón
  de cabello, con una postura segura y elegante.

## Ichika

- `teasing`: una mano cerca del mentón y la otra en la cadera, con postura
  relajada y segura que acompañe su expresión juguetona.
- `sad_reflective`: una mano apoyada sobre el pecho y el otro brazo relajado
  junto a la falda, con hombros levemente recogidos.

## Itsuki

- `indignant`: una palma abierta al frente en gesto de protesta o «alto» y la
  otra mano apoyada en la cadera, con hombros firmes.
- `thoughtful`: una mano bajo el mentón mientras el antebrazo contrario sostiene
  el codo, formando una pose de reflexión clara y contenida.

## Procesamiento

Extracción del chroma: clave fija `#00ff00`, matte suave, umbrales `40/160`,
despill y contracción de borde de un píxel. La normalización usa altura visible
y ancla inferior para que las posturas más anchas no reduzcan accidentalmente
el tamaño del personaje. Los nombres y rutas de runtime se mantuvieron sin
cambios para no requerir modificaciones en el registro de sprites.

## Rutas finales y respaldos

- Runtime de Nino: `public/images/characters/nino/rena_disguise/`
- Runtime de Ichika: `public/images/characters/ichika/rena_disguise/`
- Runtime de Itsuki: `public/images/characters/itsuki/rena_disguise/`
- Fuentes, previews y respaldos: `artwork/bocetos/characters/rena_disguise_sprites/revealed/`
- Originales de producción: `artwork/fuentes/production-originals/characters/rena_disguise/revealed/`
- Estado anterior preservado: carpeta `iterations/v1_before_pose_diversity/` de cada personaje.
