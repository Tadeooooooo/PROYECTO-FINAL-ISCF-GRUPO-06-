import React from "react";
import { AbsoluteFill, interpolate, spring} from "remotion";
import { IconoTienda } from "../componentes/Iconos";
import { Chip, Revelar } from "../componentes/Texto";
import { C, escena, FUENTE, RESORTE, sale as curvaSalida, tramo, useCuadro, FPS_BASE } from "../marca";

// Título 3D de marca: verde, volumen en Verde sombra y contorno blanco fino.
const CAPAS = 14;
const Titulo3D: React.FC<{ texto: string; tamano: number }> = ({ texto, tamano }) => {
  const ancho = 1728;
  const alto = tamano * 1.15;
  const base = tamano * 0.86;
  const comun = { x: ancho / 2, textAnchor: "middle" as const, fontFamily: FUENTE, fontWeight: 800, fontSize: tamano, letterSpacing: "-0.01em" };
  return (
    <svg width={ancho} height={alto} viewBox={`0 0 ${ancho} ${alto}`} style={{ overflow: "visible" }}>
      {/* 1) Contorno blanco fino de toda la silueta (cara + volumen) */}
      {Array.from({ length: CAPAS + 1 }, (_, k) => (
        <text key={`c${k}`} {...comun} y={base} dx={k * 0.55} dy={k * 1.35} fill={C.blanco} stroke={C.blanco} strokeWidth={8} strokeLinejoin="round">
          {texto}
        </text>
      ))}
      {/* 2) Volumen en Verde sombra */}
      {Array.from({ length: CAPAS }, (_, i) => CAPAS - i).map((k) => (
        <text key={`v${k}`} {...comun} y={base} dx={k * 0.55} dy={k * 1.35} fill={C.verdeSombra}>
          {texto}
        </text>
      ))}
      <text {...comun} y={base} fill={C.verde} stroke={C.blanco} strokeWidth={3} strokeLinejoin="round" style={{ paintOrder: "stroke" }}>
        {texto}
      </text>
    </svg>
  );
};

// 4 · Cuotas: escena 100% tipográfica, pico visual del spot.
export const E4Cuotas: React.FC = () => {
  const f = useCuadro();
  const e = escena(4);
  const entra = e.textos[0].entra - e.desde;
  const subtitulo = e.textos[1].entra - e.desde;
  const sale = e.sale - e.desde;
  // Empuje de cámara: escala 1.15 → 1 con spring; llega desde la derecha siguiendo el paneo.
  const empuje = spring({ frame: f - entra, fps: FPS_BASE, config: RESORTE });
  const s = tramo(f, sale, sale + 12, curvaSalida);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          scale: String(interpolate(empuje, [0, 1], [1.15, 1])),
          translate: `${interpolate(empuje, [0, 1], [180, 0]) - 260 * s}px -30px`,
          opacity: Math.min(1, empuje * 2.5) * (1 - s),
        }}
      >
        <Titulo3D texto="CUOTAS" tamano={268} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40, marginTop: 34, translate: `${-260 * s}px 0px` }}>
        <Revelar lineas={["en comercios adheridos."]} entra={subtitulo} sale={sale} tamano={64} peso={600} />
        <Chip icono={<IconoTienda tamano={84} />} entra={entra + 26} sale={sale} />
      </div>
    </AbsoluteFill>
  );
};
