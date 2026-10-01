# Reels de Prestapp (Remotion)

Videos verticales de Instagram (1080x1920, 60 fps, 30 s) hechos 100% con código.

| Video | Nombre para exportar | Archivo de datos |
|---|---|---|
| Rendimientos | `rendimientos` | `src/datos/rendimientos.ts` |
| Pagar con QR | `qr` | `src/tutoriales/qr/datos.ts` |
| Transferencias | `transferencias` | `src/tutoriales/transferencias/datos.ts` |
| Recargas | `recargas` | `src/tutoriales/recargas/datos.ts` |
| Pagar servicios | `servicios` | `src/tutoriales/servicios/datos.ts` |
| Biometría | `biometria` | `src/tutoriales/biometria/datos.ts` |

## Hacer otra versión

1. Abrí el archivo de datos del video y cambiá textos, montos o volúmenes. Es lo único que hay que tocar.
   - Lo que va entre `*asteriscos*` sale en verde.
   - `\n` fuerza un salto de línea.
   - Máximo 6 a 8 palabras por pantalla.
2. Para ver los videos en el navegador: `npm run dev`.
3. Para exportar (cambiá `qr` por el nombre del video, o usá `todos`):
   - Borrador (540x960): `npm run borrador -- qr`
   - Final (1080x1920, alta nitidez): `npm run final -- qr`

Los MP4 quedan en la carpeta `out/`. El borrador sale a media resolución (se ve más blando a propósito). El final se renderiza al doble de tamaño y se achica, con compresión de alta calidad y el color estándar que espera Instagram.

## Sonido

- La música y los efectos son **originales**: los sintetizan `scripts/audio/generar_audio.py` (Rendimientos y efectos) y `scripts/audio/generar_tutoriales.py` (una variante de música por tutorial). No usan samples ni grabaciones de terceros.
- Volumen: `volumenMusica` y `volumenEfectos` en cada archivo de datos (0 = apagado, 1 = máximo).
- Los tutoriales llevan pocos sonidos, solo en los momentos clave.
- Para volver a generar el audio: `pip install numpy scipy` y después `npm run audio`.

## Dónde está cada cosa

- `src/tutoriales/comun/`: la base de los tutoriales (pantallas de la app recreadas de las capturas, el recorrido con toques y paneo de cámara, escena del dato, gancho).
- `src/tutoriales/<video>/`: datos y escenas propias de cada tutorial.
- `src/escenas/`: escenas del video de Rendimientos (el cierre de marca lo comparten todos).
- `src/componentes/`: piezas reutilizables (título animado, celular, pantalla de inicio, íconos SVG, contador, sonido).
- `src/marca/marca.ts`: colores, tipografías y zonas seguras de Instagram.
- `public/brand/`: logos. `public/fonts/`: Sora y Manrope (licencia libre OFL). `public/audio/`: música y efectos.
