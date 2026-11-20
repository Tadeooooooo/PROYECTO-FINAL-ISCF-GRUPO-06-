import React from "react";
import { useCurrentFrame } from "remotion";
import { CIERRE, PASOS } from "../guion";
import { C, EJE_X, POPPINS, sale, tramo } from "../marca";
import { Titulo } from "./Marca";

export const TOP_ENCABEZADO = 420;

// Encabezado de cada paso: "PASO N" en verde con letras espaciadas + instrucción grande en blanco (una palabra en verde).
export const Encabezado: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, width: EJE_X * 2, top: TOP_ENCABEZADO, zIndex: 5 }}>
      {PASOS.map((p) => {
        if (f < p.desde || f > p.hasta) return null;
        const v = tramo(f, p.desde + 2, p.desde + 14);
        const salida = p.numero === PASOS.length ? CIERRE.desde - 6 : p.hasta - 8;
        const fuera = tramo(f, salida, salida + 8, sale);
        return (
          <div key={p.numero} style={{ position: "absolute", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div
              style={{
                fontFamily: POPPINS,
                fontWeight: 600,
                fontSize: 30,
                letterSpacing: "0.26em",
                marginLeft: "0.26em",
                color: C.verde,
                opacity: v * (1 - fuera),
                translate: `0px ${(1 - v) * 16 - 12 * fuera}px`,
              }}
            >
              PASO {p.numero}
            </div>
            <Titulo lineas={p.instruccion} entra={p.desde + 4} sale={salida} tamano={56} color={C.blanco} />
          </div>
        );
      })}
    </div>
  );
};
