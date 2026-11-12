import React from "react";
import { AbsoluteFill, Easing, interpolate, spring } from "remotion";
import { MAX_SALIDA, Revelar } from "../componentes/Texto";
import { C, escena, FPS_BASE, RESORTE, sale as curvaSalida, tramo, useCuadro } from "../marca";

// Círculo verde con una flecha que sube en loop (el saldo que crece). Entra con resorte cuando "rinde" se asienta.
const FlechaSube: React.FC<{ readonly entra: number; readonly sale: number; readonly tamano: number }> = ({ entra, sale, tamano }) => {
  const f = useCuadro();
  const pop = spring({ frame: f - entra, fps: FPS_BASE, config: RESORTE });
  const s = tramo(f, sale, sale + MAX_SALIDA, curvaSalida);
  // Cada 48 cuadros base (1,6 s): la flecha sube y sale por arriba, y vuelve a entrar desde abajo hasta el centro.
  const t = f - entra - 16;
  const fase = t > 0 ? (t % 48) / 48 : 0;
  const sube = interpolate(fase, [0, 0.45], [0, -1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const vuelve = interpolate(fase, [0.45, 0.9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
  const y = (fase < 0.45 ? sube : vuelve) * tamano;
  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        borderRadius: "50%",
        backgroundColor: C.verde,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: String(pop),
        opacity: 1 - s,
        translate: `0px ${-24 * s}px`,
        boxShadow: "0 18px 40px rgba(8,10,40,0.35)",
      }}
    >
      <svg width={tamano * 0.56} height={tamano * 0.56} viewBox="0 0 64 64" style={{ translate: `0px ${y}px`, overflow: "visible" }}>
        <path d="M32 54V12M14 29l18-18 18 18" fill="none" stroke={C.tinta} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// 5 · Rendimientos: el celular vuelve a entrar desde la derecha con la lista de "Rendimiento Saldo"
// (una acreditación por día, montos tapados). Sin tasas ni montos en pantalla.
export const E5Rendimientos: React.FC = () => {
  const e = escena(5);
  const sale = e.sale - e.desde;
  const entra = e.textos[0].entra - e.desde;
  return (
    <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, gap: 26 }}>
      <div>
        <Revelar lineas={["Tu saldo"]} entra={entra} sale={sale} tamano={128} palabrasBloque={6} />
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <Revelar lineas={["*rinde*"]} entra={entra} sale={sale} tamano={128} palabrasBloque={6} desfase={2} />
          <FlechaSube entra={e.textos[0].asentado - e.desde + 2} sale={sale} tamano={118} />
        </div>
      </div>
      <Revelar lineas={["todos los días."]} entra={e.textos[1].entra - e.desde} sale={sale} tamano={64} peso={600} palabrasBloque={6} />
    </AbsoluteFill>
  );
};
