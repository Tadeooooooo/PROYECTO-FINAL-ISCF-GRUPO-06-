import React from "react";
import { interpolate } from "remotion";
import { useCuadro } from "../tiempo";
import { C, tramo } from "../marca";

// Íconos de línea propios (viewBox 48x48), trazo redondeado. Se dibujan con "dibujo" de 0 a 1.
const TRAZOS: Record<string, string[]> = {
  edificio: ["M10 42V13l14-7 14 7v29", "M5 42h38", "M17 18h3M28 18h3M17 26h3M28 26h3", "M21 42v-8h6v8"],
  recaudadora: ["M8 22h32v17a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3z", "M24 4v15", "M18 13l6 6 6-6", "M16 31h16"],
  administrativa: ["M9 16h30a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V19a3 3 0 0 1 3-3z", "M17 16v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4", "M6 27h36", "M22 27v3h4v-3"],
  tienda: ["M9 21v19h30V21", "M6 21l4-12h28l4 12z", "M20 40V30h8v10"],
  usuarios: ["M18 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M5 40c0-7 5.5-11 13-11s13 4 13 11", "M31 9a6.5 6.5 0 0 1 0 13", "M35 29c5 1.2 8 5 8 11"],
  etiqueta: ["M25 6h16v16L23 40 8 25z", "M33.5 13.5h.01"],
  carpeta: ["M15 8h18v6H15z", "M14 11h-2a3 3 0 0 0-3 3v25a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3V14a3 3 0 0 0-3-3h-2", "M17 24h14M17 32h10"],
  ojoTachado: ["M4 24s7-12 20-12c4 0 7.4 1.2 10.2 2.9M44 24s-7 12-20 12c-4 0-7.4-1.2-10.2-2.9", "M20 28.5a6 6 0 0 1 8.5-8.5", "M8 8l32 32"],
  qr: ["M8 8h12v12H8zM28 8h12v12H28zM8 28h12v12H8z", "M28 28h5v5h-5zM36 36h4v4h-4zM28 37v3M37 28h3"],
  candado: ["M12 22h24v19H12z", "M17 22v-6a7 7 0 0 1 14 0v6", "M24 30v4"],
  lapiz: ["M30 8l10 10-22 22H8V30z", "M26 12l10 10"],
  pantalla: ["M6 9h36v24H6z", "M18 41h12", "M24 33v8"],
  enviar: ["M42 6L21 27", "M42 6L29 42l-8-15-15-8z"],
  cobrar: ["M24 42a17 17 0 1 0 0-34 17 17 0 0 0 0 34z", "M24 14v20", "M29 18.5c-1.1-1.4-2.9-2.2-5-2.2-2.8 0-5 1.6-5 3.7 0 5 10 2.6 10 7.6 0 2.1-2.2 3.7-5 3.7-2.1 0-4-.9-5.1-2.3"],
  flechas: ["M8 16h31", "M32 9l7 7-7 7", "M40 32H9", "M16 25l-7 7 7 7"],
};

export const Icono: React.FC<{ nombre: keyof typeof TRAZOS; tam: number; color?: string; grosor?: number; dibujo?: number; style?: React.CSSProperties }> = ({
  nombre,
  tam,
  color = C.blanco,
  grosor = 2.6,
  dibujo = 1,
  style,
}) => (
  <svg width={tam} height={tam} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {TRAZOS[nombre].map((d, i) => (
      <path key={i} d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - dibujo} />
    ))}
  </svg>
);

// Celular escaneando un QR (al costado del paso del QR): marco, esquinas de escaneo y una línea verde que barre.
export const IconoEscaneo: React.FC<{ entra: number }> = ({ entra }) => {
  const f = useCuadro();
  const d = tramo(f, entra, entra + 24);
  const barrido = (Math.sin(((f - entra) / 34) * Math.PI) + 1) / 2;
  const yLinea = interpolate(barrido, [0, 1], [66, 128]);
  const ok = tramo(f, entra + 60, entra + 72);
  return (
    <svg width={210} height={210} viewBox="0 0 210 210" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: Math.min(1, d * 1.6) }}>
      {/* celular */}
      <rect x={58} y={14} width={94} height={182} rx={16} stroke={C.blanco} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
      <path d="M94 28h22" stroke={C.blanco} strokeWidth={4} opacity={d} />
      {/* esquinas de escaneo */}
      <g stroke={C.verde} strokeWidth={4} opacity={d}>
        <path d="M74 66v-10h10M136 66v-10h-10M74 128v10h10M136 128v10h-10" />
      </g>
      {/* QR mínimo */}
      <g fill={C.blanco} opacity={0.85 * d}>
        <rect x={84} y={66} width={16} height={16} rx={2} />
        <rect x={110} y={66} width={16} height={16} rx={2} />
        <rect x={84} y={112} width={16} height={16} rx={2} />
        <rect x={110} y={102} width={7} height={7} rx={1} />
        <rect x={119} y={112} width={7} height={7} rx={1} />
        <rect x={110} y={120} width={7} height={7} rx={1} />
        <rect x={97} y={92} width={7} height={7} rx={1} />
      </g>
      {/* línea que barre */}
      <path d={`M70 ${yLinea}h70`} stroke={C.verde} strokeWidth={4} opacity={d * (1 - ok)} />
      {/* listo */}
      <g opacity={ok} transform={`translate(105 166) scale(${0.6 + 0.4 * ok})`}>
        <circle r={15} fill={C.verde} />
        <path d="M-7 0l5 5 9-10" stroke={C.tinta} strokeWidth={3.5} />
      </g>
    </svg>
  );
};
