import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Revelar } from "../componentes/Texto";
import { escena, RESORTE, sale as curvaSalida, tramo } from "../marca";

// Entrada en stagger de cada elemento del cierre (sube y aparece desde la derecha, siguiendo la cámara).
const useEntrada = (desde: number) => {
  const f = useCurrentFrame();
  const v = tramo(f, desde, desde + 18);
  return { opacity: v, translate: `${(1 - v) * 120}px ${(1 - v) * 30}px` };
};

// 7 · Cierre: logo, "Descargá la app", badges oficiales, redes y Cuotín. Queda quieto y al final se funde al fondo.
export const E7Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = escena(7);
  const r = (x: number) => x - e.desde;
  const fundido = 1 - tramo(f, r(e.sale), r(e.fin) - 1, curvaSalida);
  const cuotin = spring({ frame: f - r(1128), fps, config: RESORTE });
  const logo = useEntrada(r(1112));
  const badges = useEntrada(r(1126));
  const alto = 100; // alto de los dos badges
  return (
    <AbsoluteFill style={{ opacity: fundido }}>
      <div style={{ position: "absolute", left: 120, width: 1100, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 44 }}>
        <Img src={staticFile("marca/Prestapp_logo_blanco.png")} style={{ width: 600, ...logo }} />
        <Revelar lineas={["*Descargá la app*"]} entra={r(e.textos[0].entra)} sale={99999} tamano={104} alinear="center" />
        <div style={{ display: "flex", gap: 32, alignItems: "center", ...badges }}>
          <div style={{ height: alto, overflow: "hidden" }}>
            <Img src={staticFile("marca/badge-google-play.png")} style={{ height: (alto * 250) / 192, marginTop: (-29 * alto) / 192, display: "block" }} />
          </div>
          <Img src={staticFile("marca/badge-app-store.svg")} style={{ height: alto, display: "block" }} />
        </div>
        <Revelar lineas={["@prestapp.ar · prestapp.com.ar"]} entra={r(e.textos[1].entra)} sale={99999} tamano={56} peso={600} alinear="center" />
      </div>
      {/* Cuotín: una sola vez, en un costado, sin tapar textos */}
      <Img
        src={staticFile("marca/cuotin.webp")}
        style={{
          position: "absolute",
          height: 760,
          right: 40,
          top: 150,
          translate: `${interpolate(cuotin, [0, 1], [700, 0])}px 0px`,
          opacity: Math.min(1, cuotin * 2),
        }}
      />
    </AbsoluteFill>
  );
};
