import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../marca";

// Fondo claro (niebla) con círculos muy suaves que derivan lento.
const CIRCULOS = [
  { x: 120, y: 260, r: 380, color: "rgba(255,255,255,0.75)", fase: 0 },
  { x: 980, y: 1500, r: 520, color: "rgba(255,255,255,0.65)", fase: 2 },
  { x: 900, y: 420, r: 240, color: "rgba(23,36,167,0.05)", fase: 4 },
  { x: 160, y: 1700, r: 300, color: "rgba(23,36,167,0.04)", fase: 1 },
];

export const Fondo: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.niebla }}>
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
            backgroundColor: c.color,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
