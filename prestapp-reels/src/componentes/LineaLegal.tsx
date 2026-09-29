import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fuenteTexto, ZONA_SEGURA } from "../marca/marca";

// Aviso legal chico y fijo, apoyado en el borde inferior de la zona segura.
export const LineaLegal: React.FC<{ readonly texto: string; readonly ocultarDesde: number }> = ({
  texto,
  ocultarDesde,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: ZONA_SEGURA.lados,
        right: ZONA_SEGURA.lados,
        bottom: 1920 - ZONA_SEGURA.limiteInferior,
        padding: "14px 28px",
        borderRadius: 22,
        backgroundColor: "rgba(6, 6, 32, 0.72)",
        fontFamily: fuenteTexto,
        fontWeight: 600,
        fontSize: 30,
        lineHeight: 1.3,
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
        opacity: interpolate(frame, [ocultarDesde, ocultarDesde + 20], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {texto}
    </div>
  );
};
