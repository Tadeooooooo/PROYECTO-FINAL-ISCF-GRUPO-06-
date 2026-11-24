import React from "react";
import { Composition } from "remotion";
import { ALTO, ANCHO, FPS } from "./marca";
import { Pelicula, RANGOS, TOTAL } from "./Pelicula";

// Video completo + un video por capítulo (mismo contenido, recortado).
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="HomeBanking" component={Pelicula} durationInFrames={TOTAL} fps={FPS} width={ANCHO} height={ALTO} defaultProps={{ desde: 0, hasta: TOTAL }} />
    {RANGOS.map((r, i) => (
      <Composition
        key={r.id}
        id={`Capitulo${i + 1}`}
        component={Pelicula}
        durationInFrames={r.hasta - r.desde}
        fps={FPS}
        width={ANCHO}
        height={ALTO}
        defaultProps={{ desde: r.desde, hasta: r.hasta }}
      />
    ))}
  </>
);
