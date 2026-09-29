import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { DatosVideo } from "../datos/rendimientos";
import { degradeMarca, fuenteTexto } from "../marca/marca";

// Escena 10 · 27–30 s · Placa legal completa, quieta para que se pueda leer.
export const Escena10Legal: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const aparece = interpolate(frame, [4, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // Cada oración en su propio renglón.
  const oraciones = datos.disclaimer.split(/(?<=\.)\s+/);

  return (
    <AbsoluteFill style={{ background: degradeMarca }}>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Img src={staticFile("brand/logo-horizontal-blanco.png")} style={{ width: 293 }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          bottom: 380,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 36,
          fontFamily: fuenteTexto,
          fontWeight: 700,
          fontSize: 62,
          lineHeight: 1.22,
          color: "#FFFFFF",
          textAlign: "center",
          textWrap: "balance",
          opacity: aparece,
          translate: `0px ${(1 - aparece) * 24}px`,
        }}
      >
        {oraciones.map((o) => (
          <div key={o}>{o}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
