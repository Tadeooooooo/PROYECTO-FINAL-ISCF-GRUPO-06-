import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../marca";

// Fondo azul noche con un foco de luz suave detrás del celular y círculos muy tenues que derivan lento.
const CIRCULOS = [
  { x: 120, y: 300, r: 380, op: 0.05, fase: 0 },
  { x: 980, y: 1500, r: 520, op: 0.04, fase: 2 },
  { x: 900, y: 520, r: 240, op: 0.05, fase: 4 },
  { x: 140, y: 1700, r: 300, op: 0.04, fase: 1 },
];

export const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  const focoX = 520 + 80 * Math.sin(f / 120);
  const focoY = 1150 + 60 * Math.cos(f / 140);
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${focoX}px ${focoY}px, ${C.luz} 0px, rgba(36,52,143,0) 760px)`, opacity: 0.9 }} />
      {CIRCULOS.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x - c.r + 30 * Math.sin(f / 90 + c.fase),
            top: c.y - c.r + 24 * Math.cos(f / 110 + c.fase),
            width: c.r * 2,
            height: c.r * 2,
            borderRadius: "50%",
            backgroundColor: C.blanco,
            opacity: c.op,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
