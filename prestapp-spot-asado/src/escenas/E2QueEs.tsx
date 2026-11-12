import React from "react";
import { AbsoluteFill } from "remotion";
import { Revelar } from "../componentes/Texto";
import { escena } from "../marca";

// 2 · Qué es: texto a la izquierda; el celular (capa global) entra por la derecha con la pantalla de inicio.
export const E2QueEs: React.FC = () => {
  const e = escena(2);
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150 }}>
      <Revelar lineas={["Tu billetera", "digital,", "*de Entre Ríos.*"]} entra={e.textos[0].entra - e.desde} sale={e.sale - e.desde} tamano={108} />
    </AbsoluteFill>
  );
};
