import React from "react";
import { Img, staticFile } from "remotion";
import { C } from "../marca";

// Logo "Prestapp · TU BILLETERA + cuotas" del Brand Kit (archivo "dale cuotas.png", sin modificar).
// Solo existe a color: sobre los azules de marca la parte azul se perdería, así que va en pastilla blanca
// (regla del manual para el logo a color sobre fondos de color). Se recorta solo el aire transparente con CSS.
const ARCHIVO = { ancho: 3508, alto: 2481 };
const CONTENIDO = { x: 402, y: 784, ancho: 2705, alto: 913 };

export const LogoCuotas: React.FC<{ readonly ancho: number; readonly style?: React.CSSProperties }> = ({ ancho, style }) => {
  const k = ancho / CONTENIDO.ancho;
  const alto = CONTENIDO.alto * k;
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: C.blanco,
        padding: `${alto * 0.26}px ${alto * 0.55}px`,
        borderRadius: 999,
        boxShadow: "0 24px 60px rgba(8,10,40,0.35)",
        ...style,
      }}
    >
      <div style={{ width: ancho, height: alto, overflow: "hidden", position: "relative" }}>
        <Img
          src={staticFile("marca/dale-cuotas.png")}
          style={{ position: "absolute", width: ARCHIVO.ancho * k, height: ARCHIVO.alto * k, left: -CONTENIDO.x * k, top: -CONTENIDO.y * k, maxWidth: "none" }}
        />
      </div>
    </div>
  );
};
