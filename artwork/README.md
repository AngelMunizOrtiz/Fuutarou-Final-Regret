# Archivo de arte

Esta carpeta conserva material visual que no forma parte del runtime del juego.

- `bocetos/`: previews, versiones antiguas y alternativas no registradas.
- `fuentes/`: chroma keys, hojas, transparencias de trabajo y originales sin recortar.
- `fuentes/production-originals/`: PNG maestros de los WebP lossless usados por el juego.
- `referencias/`: imagenes usadas como guia durante la produccion.

Solo los assets consumidos por el juego deben vivir bajo `public/`. Los archivos
de este archivo no deben referenciarse desde `src/`; primero se prepara una
version final y luego se incorpora al catalogo o manifiesto correspondiente.
