import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CelularSpot } from "./componentes/Celular";
import { Fondo } from "./componentes/Fondo";
import { E1Apertura } from "./escenas/E1Apertura";
import { E2QueEs } from "./escenas/E2QueEs";
import { E3QR } from "./escenas/E3QR";
import { E4Cuotas } from "./escenas/E4Cuotas";
import { E5Rendimientos } from "./escenas/E5Rendimientos";
import { K } from "./marca";
import { E6Seguridad } from "./escenas/E6Seguridad";
import { E7Cierre } from "./escenas/E7Cierre";

// Spot institucional de Prestapp · 1920x1080 · 60 fps · 2688 cuadros (44,8 s).
// Los tiempos salen de src/guion.json, en cuadros base de 30/s (x K = cuadros reales).
export const Spot: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    {/* El celular es una sola capa continua que conecta las escenas 2-3 y 5-6 */}
    <CelularSpot />
    <Sequence name="1 · Apertura" from={0 * K} durationInFrames={150 * K}>
      <E1Apertura />
    </Sequence>
    <Sequence name="2 · Qué es" from={138 * K} durationInFrames={192 * K}>
      <E2QueEs />
    </Sequence>
    <Sequence name="3 · Pagá con QR" from={316 * K} durationInFrames={232 * K}>
      <E3QR />
    </Sequence>
    <Sequence name="4 · Cuotas" from={530 * K} durationInFrames={250 * K}>
      <E4Cuotas />
    </Sequence>
    <Sequence name="5 · Rendimientos" from={744 * K} durationInFrames={216 * K}>
      <E5Rendimientos />
    </Sequence>
    <Sequence name="6 · Seguridad" from={930 * K} durationInFrames={182 * K}>
      <E6Seguridad />
    </Sequence>
    <Sequence name="7 · Cierre" from={1096 * K} durationInFrames={248 * K}>
      <E7Cierre />
    </Sequence>
  </AbsoluteFill>
);
