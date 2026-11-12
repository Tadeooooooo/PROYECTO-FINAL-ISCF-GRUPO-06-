import React from "react";
import { AbsoluteFill } from "remotion";
import { Revelar } from "../componentes/Texto";
import { escena } from "../marca";

// 5 · Rendimientos: el celular vuelve a entrar desde la derecha con la lista de "Rendimiento Saldo"
// (una acreditación por día, montos tapados). Sin tasas ni montos en pantalla.
export const E5Rendimientos: React.FC = () => {
  const e = escena(5);
  const sale = e.sale - e.desde;
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, gap: 26 }}>
      <Revelar lineas={["Tu saldo", "*rinde*"]} entra={e.textos[0].entra - e.desde} sale={sale} tamano={128} palabrasBloque={6} />
      <Revelar lineas={["todos los días."]} entra={e.textos[1].entra - e.desde} sale={sale} tamano={64} peso={600} palabrasBloque={6} />
    </AbsoluteFill>
  );
};
