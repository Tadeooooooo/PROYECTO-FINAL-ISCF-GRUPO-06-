# Reels de Prestapp (Remotion)

Video vertical de Instagram (1080x1920, 60 fps, 30 s) hecho 100% con código.

## Hacer otra versión

1. Abrí `src/datos/rendimientos.ts` y cambiá textos o números. Es el único archivo que hay que tocar.
   - Lo que va entre `*asteriscos*` sale en verde.
   - `\n` fuerza un salto de línea.
   - El rendimiento por día, el de 30 días y los saldos que suben se calculan solos a partir de `montoEjemplo`, `tna` y `diasBase`.
2. Para ver el video en el navegador: `npm run dev`.
3. Para exportarlo:
   - Borrador (540x960): `npm run borrador`
   - Final (1080x1920): `npm run final`
   - Cuadros sueltos para revisar: `npm run cuadros`

Los MP4 quedan en la carpeta `out/`. El borrador sale a media resolución (se ve más blando a propósito); el final se exporta con cuadros sin pérdida y compresión de alta calidad (ver `remotion.config.ts`).

## Dónde está cada cosa

- `src/datos/rendimientos.ts`: textos y números.
- `src/escenas/`: un archivo por escena (Escena01Gancho … Escena10Legal). Las escenas 2 a 5 comparten el celular (`BloqueCelular.tsx`) y la 6 y la 7 van juntas (`BloqueSimulacion.tsx`).
- `src/componentes/`: piezas reutilizables (título animado, celular, pantalla de la app, íconos SVG, contador).
- `src/marca/marca.ts`: colores, tipografías y zonas seguras de Instagram.
- `public/brand/`: logos. `public/fonts/`: Sora y Manrope, con licencia libre OFL.
