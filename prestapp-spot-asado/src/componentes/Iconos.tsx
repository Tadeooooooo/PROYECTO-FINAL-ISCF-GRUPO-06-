import React from "react";
import { C } from "../marca";

// Íconos de línea propios: trazo blanco, sin relleno, mismo grosor.
const TRAZO = 3.5;
const base = { fill: "none", stroke: C.blanco, strokeWidth: TRAZO, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const IconoDNI: React.FC<{ tamano: number }> = ({ tamano }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 64 64">
    <rect x={6} y={14} width={52} height={36} rx={6} {...base} />
    <circle cx={22} cy={28} r={5} {...base} />
    <path d="M13 42c1.5-4.5 5-7 9-7s7.5 2.5 9 7" {...base} />
    <path d="M37 26h14M37 33h14M37 40h9" {...base} />
  </svg>
);

export const IconoTienda: React.FC<{ tamano: number }> = ({ tamano }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 64 64">
    <path d="M10 26l4-12h36l4 12" {...base} />
    <path d="M10 26c0 4 3 7 6.8 7s6.7-3 6.7-7c0 4 3 7 6.8 7s6.7-3 6.7-7c0 4 3 7 6.8 7S54 30 54 26" {...base} />
    <path d="M14 33v19h36V33" {...base} />
    <path d="M27 52V41h10v11" {...base} />
  </svg>
);

// Huella dactilar de líneas concéntricas. "progreso" 0→1 la dibuja (stroke-dashoffset).
const HUELLA = [
  "M20 48c-2.5-4-3.8-8.6-3.8-13.5C16.2 25.5 23.3 18 32 18s15.8 7.5 15.8 16.5",
  "M47.8 34.5c0 5.5-1.4 10.6-3.8 15",
  "M26 50c-1.8-4.6-2.8-9.6-2.8-14.8 0-5.4 3.9-9.7 8.8-9.7s8.8 4.3 8.8 9.7c0 4-.6 7.9-1.8 11.5",
  "M32 34.5c0 7 1.5 13.6 4.2 19.5",
  "M32 34.5c0 6.5-1.3 12.7-3.6 18.3",
  "M12.5 27C16 18 23.5 12 32 12c7 0 13.3 4 17.2 10.2",
  "M51.5 28.5c.6 2 .9 4 .9 6",
];
export const IconoHuella: React.FC<{ tamano: number; progreso?: number; grosor?: number }> = ({ tamano, progreso = 1, grosor = TRAZO }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 64 64">
    {HUELLA.map((d, i) => {
      const p = Math.min(1, Math.max(0, progreso * 1.35 - i * 0.05));
      return <path key={i} d={d} {...base} strokeWidth={grosor} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} />;
    })}
  </svg>
);

// Check verde con spring (círculo verde, tilde en Tinta).
export const CheckVerde: React.FC<{ tamano: number; escala: number; trazo: number }> = ({ tamano, escala, trazo }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 100 100" style={{ scale: String(escala), overflow: "visible" }}>
    <circle cx={50} cy={50} r={48} fill={C.blanco} />
    <circle cx={50} cy={50} r={42} fill={C.verde} />
    <path
      d="M30 51l13 13 27-28"
      fill="none"
      stroke={C.tinta}
      strokeWidth={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - trazo}
    />
  </svg>
);
