import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { CIERRE, PASOS } from "../guion";
import { C, EJE_X, POPPINS, RESORTE, sale, tramo } from "../marca";

// Instrucción con la palabra clave en azul ("*...*").
const Instruccion: React.FC<{ texto: string }> = ({ texto }) => (
  <>
    {texto.split("*").map((parte, i) => (
      <span key={i} style={{ color: i % 2 === 1 ? C.azul : undefined }}>
        {parte}
      </span>
    ))}
  </>
);

export const TOP_TARJETA = 372;
const ANCHO = 800;

// Recuadro claro arriba del celular: número de paso grande en verde + instrucción corta.
export const Tarjeta: React.FC = () => {
  const f = useCurrentFrame();
  const primero = PASOS[0].desde;
  const entra = spring({ frame: f - primero - 4, fps: 30, config: RESORTE });
  const s = tramo(f, CIERRE.desde - 4, CIERRE.desde + 8, sale);
  if (f < primero) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: EJE_X - ANCHO / 2,
        top: TOP_TARJETA,
        width: ANCHO,
        height: 206,
        borderRadius: 36,
        backgroundColor: C.blanco,
        boxShadow: "0 18px 44px rgba(18,24,69,0.12), 0 3px 10px rgba(18,24,69,0.06)",
        overflow: "hidden",
        opacity: Math.min(1, entra * 1.4) * (1 - s),
        translate: `0px ${(1 - entra) * 40 - 20 * s}px`,
        zIndex: 5,
      }}
    >
      {PASOS.map((p) => {
        const v = tramo(f, p.desde + 2, p.desde + 16);
        const fuera = tramo(f, p.hasta - 8, p.hasta, sale);
        if (f < p.desde || f > p.hasta) return null;
        return (
          <div
            key={p.numero}
            style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: "0 44px 0 36px", gap: 30, opacity: v * (1 - fuera), translate: `0px ${(1 - v) * 30 - 18 * fuera}px` }}
          >
            <div style={{ width: 120, textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 28, letterSpacing: "0.2em", color: C.azul, marginLeft: "0.2em" }}>PASO</div>
              <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 124, lineHeight: 0.95, color: C.verde }}>{p.numero}</div>
            </div>
            <div style={{ width: 2, alignSelf: "stretch", margin: "34px 0", backgroundColor: "#E2E5F2" }} />
            <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 40, lineHeight: 1.2, color: C.tinta }}>
              <Instruccion texto={p.instruccion} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
