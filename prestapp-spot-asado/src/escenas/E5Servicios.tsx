import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { MAX_SALIDA, Revelar } from "../componentes/Texto";
import { C, escena, FUENTE, sale as curvaSalida, tramo } from "../marca";

const miles = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

// 5 · Servicios: contador de 0 a 5.000 que desacelera. El celular vuelve a entrar con la captura de servicios.
export const E5Servicios: React.FC = () => {
  const f = useCurrentFrame();
  const e = escena(5);
  const entra = e.entra - e.desde;
  const sale = e.sale - e.desde;
  const asentado = e.asentado - e.desde;
  const v = tramo(f, entra, entra + 14);
  const cuenta = interpolate(f, [entra + 4, asentado], [0, 5000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const s = tramo(f, sale, sale + MAX_SALIDA, curvaSalida);
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150 }}>
      <div style={{ overflow: "hidden", paddingBottom: "0.06em", opacity: 1 - s, translate: `0px ${-24 * s}px` }}>
        <div
          style={{
            fontFamily: FUENTE,
            fontWeight: 800,
            fontSize: 168,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: C.verde,
            fontVariantNumeric: "tabular-nums",
            translate: `0px ${(1 - v) * 110}%`,
            filter: v < 0.98 ? `blur(${(1 - v) * 5}px)` : undefined,
          }}
        >
          +{miles(cuenta)}
        </div>
      </div>
      <Revelar lineas={["empresas"]} entra={entra + 2} sale={sale} tamano={108} palabrasBloque={6} />
      <Revelar
        lineas={["para pagar tus servicios."]}
        entra={e.textos[1].entra - e.desde}
        sale={sale}
        tamano={60}
        peso={600}
        palabrasBloque={6}
        style={{ marginTop: 26 }}
      />
    </AbsoluteFill>
  );
};


