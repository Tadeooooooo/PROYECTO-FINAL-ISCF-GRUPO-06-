import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { CelularSpot } from "./componentes/Celular";
import { Fondo } from "./componentes/Fondo";
import { E1Apertura } from "./escenas/E1Apertura";
import { E2QueEs } from "./escenas/E2QueEs";
import { E3QR } from "./escenas/E3QR";
import { E4Cuotas } from "./escenas/E4Cuotas";
import { E5Servicios } from "./escenas/E5Servicios";
import { E6Seguridad } from "./escenas/E6Seguridad";
import { E7Cierre } from "./escenas/E7Cierre";

// Spot institucional de Prestapp · 1920x1080 · 30 fps · 1344 cuadros (44,8 s).
// Los tiempos de cada escena salen de src/guion.json.
export const Spot: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    {/* El celular es una sola capa continua que conecta las escenas 2-3 y 5-6 */}
    <CelularSpot />
    <Sequence name="1 · Apertura" from={0} durationInFrames={150}>
      <E1Apertura />
    </Sequence>
    <Sequence name="2 · Qué es" from={138} durationInFrames={192}>
      <E2QueEs />
    </Sequence>
    <Sequence name="3 · Pagá con QR" from={316} durationInFrames={232}>
      <E3QR />
    </Sequence>
    <Sequence name="4 · Cuotas" from={530} durationInFrames={250}>
      <E4Cuotas />
    </Sequence>
    <Sequence name="5 · Servicios" from={744} durationInFrames={216}>
      <E5Servicios />
    </Sequence>
    <Sequence name="6 · Seguridad" from={930} durationInFrames={182}>
      <E6Seguridad />
    </Sequence>
    <Sequence name="7 · Cierre" from={1096} durationInFrames={248}>
      <E7Cierre />
    </Sequence>
  </AbsoluteFill>
);
