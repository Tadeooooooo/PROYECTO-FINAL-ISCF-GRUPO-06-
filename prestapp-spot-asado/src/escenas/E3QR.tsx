import React from "react";
import { AbsoluteFill } from "remotion";
import { Pildora, Revelar } from "../componentes/Texto";
import { escena } from "../marca";

// 3 · Pagá con QR: píldora + título. El recuadro de escaneo y el check se dibujan dentro del celular.
export const E3QR: React.FC = () => {
  const e = escena(3);
  const sale = e.sale - e.desde;
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, gap: 40 }}>
      <div>
        <Pildora texto="PAGÁ CON QR" entra={e.textos[0].entra - e.desde} sale={sale} salidaX={-260} />
      </div>
      <Revelar lineas={["Rápido y", "*sin efectivo.*"]} entra={e.textos[1].entra - e.desde} sale={sale} tamano={112} salidaX={-260} />
    </AbsoluteFill>
  );
};
