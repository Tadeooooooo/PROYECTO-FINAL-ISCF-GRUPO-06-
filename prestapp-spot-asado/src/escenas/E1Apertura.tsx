import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Revelar } from "../componentes/Texto";
import { escena, sale, tramo } from "../marca";

// 1 · Apertura: el foco se enciende, el logo escala de 0.92 a 1 y el eslogan entra con máscara.
export const E1Apertura: React.FC = () => {
  const f = useCurrentFrame();
  const e = escena(1);
  const logo = tramo(f, 8, 26);
  const s = tramo(f, e.sale - e.desde, e.fin - e.desde, sale); // el logo sube y sale
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 64, translate: `0px ${-110 * s}px`, opacity: 1 - s }}>
        <Img src={staticFile("marca/Prestapp_logo_blanco.png")} style={{ width: 860, opacity: logo, scale: String(0.92 + 0.08 * logo) }} />
        <Revelar lineas={["Dale cuotas *a todo*"]} entra={e.textos[0].entra - e.desde} sale={99999} tamano={112} alinear="center" />
      </div>
    </AbsoluteFill>
  );
};
