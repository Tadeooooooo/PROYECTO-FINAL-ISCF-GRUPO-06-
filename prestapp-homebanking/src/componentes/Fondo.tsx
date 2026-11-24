import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../marca";

// Fondo azul noche con un foco de luz suave y círculos grandes muy tenues que derivan lento.
const CIRCULOS = [
  { x: 180, y: 260, r: 420, op: 0.05, fase: 0 },
  { x: 1700, y: 980, r: 560, op: 0.04, fase: 2 },
  { x: 1240, y: 120, r: 300, op: 0.045, fase: 4 },
  { x: 420, y: 1020, r: 340, op: 0.04, fase: 1 },
];

export const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  const focoX = 1150 + 120 * Math.sin(f / 160);
  const focoY = 560 + 70 * Math.cos(f / 190);
  return (
    <AbsoluteFill style={{ backgroundColor: C.fondo }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${focoX}px ${focoY}px, ${C.luz} 0px, rgba(36,52,143,0) 900px)`, opacity: 0.9 }} />
      {CIRCULOS.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x - c.r + 36 * Math.sin(f / 120 + c.fase),
            top: c.y - c.r + 28 * Math.cos(f / 140 + c.fase),
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
