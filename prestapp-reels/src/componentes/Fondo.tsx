import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colores } from "../marca/marca";

// Fondo azul noche con dos brillos de marca que se mueven muy despacio.
export const Fondo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colores.noche,
        backgroundImage: [
          `radial-gradient(circle at ${18 + 10 * p}% ${14 + 6 * p}%, ${colores.azulApp}cc 0%, transparent 55%)`,
          `radial-gradient(circle at ${88 - 8 * p}% ${82 - 6 * p}%, ${colores.violeta}73 0%, transparent 50%)`,
          `radial-gradient(circle at 50% 50%, #16147055 0%, transparent 70%)`,
        ].join(", "),
      }}
    />
  );
};
