import React from "react";
import { Img, staticFile } from "remotion";
import { colores, fuenteTitulos } from "../marca/marca";

// Íconos propios en SVG (sin imágenes de stock).
type P = { readonly tamano?: number; readonly color?: string; readonly style?: React.CSSProperties };

export const IconoTilde: React.FC<P & { readonly progreso?: number }> = ({
  tamano = 24,
  color = colores.blanco,
  progreso = 1,
  style,
}) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path
      d="M5 12.5 L10 17.5 L19.5 7"
      fill="none"
      stroke={color}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progreso}
    />
  </svg>
);

export const IconoFlechaArriba: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M5.5 15.5 L12 9 L18.5 15.5" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconoCampana: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5v3.6L4.5 15.2V17h15v-1.8l-2-3.6V8A5.5 5.5 0 0 0 12 2.5z" fill={color} />
    <circle cx={12} cy={19.6} r={2.2} fill={color} />
  </svg>
);

export const IconoOjo: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" fill="none" stroke={color} strokeWidth={2} />
    <circle cx={12} cy={12} r={3.2} fill={color} />
  </svg>
);

export const IconoAvion: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M2.5 11 L21.5 2.5 L15 21.5 L11.2 12.8 Z" fill={color} />
    <path d="M11.2 12.8 L21.5 2.5" stroke={colores.verdeApp} strokeWidth={1.6} opacity={0.6} />
  </svg>
);

export const IconoDocumento: React.FC<P & { readonly colorSimbolo?: string }> = ({
  tamano = 24,
  color = colores.blanco,
  colorSimbolo = colores.verdeApp,
  style,
}) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M6 2.5h8.5L19 7v14.5H6z" fill={color} />
    <path d="M14.5 2.5V7H19" fill="rgba(0,0,0,0.12)" />
    <text x={12.4} y={17.6} textAnchor="middle" fontSize={9} fontWeight={800} fontFamily={fuenteTitulos} fill={colorSimbolo}>
      $
    </text>
  </svg>
);

export const IconoCopiar: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <rect x={4} y={6} width={11.5} height={15} rx={1.8} fill={color} opacity={0.75} />
    <path d="M9 2.5h7.5l4 4V17a1.5 1.5 0 0 1-1.5 1.5H9A1.5 1.5 0 0 1 7.5 17V4A1.5 1.5 0 0 1 9 2.5z" fill={color} />
  </svg>
);

const Billete: React.FC<{ readonly x: number; readonly y: number; readonly color: string; readonly colorSimbolo: string }> = ({
  x,
  y,
  color,
  colorSimbolo,
}) => (
  <g>
    <rect x={x} y={y} width={16} height={9.5} rx={1.6} fill={color} />
    <text x={x + 8} y={y + 7.6} textAnchor="middle" fontSize={7.5} fontWeight={800} fontFamily={fuenteTitulos} fill={colorSimbolo}>
      $
    </text>
  </g>
);

export const IconoIngresar: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <Billete x={4} y={3} color={color} colorSimbolo={colores.verdeApp} />
    <path d="M12 14.5v6.5M8.8 18l3.2 3.2 3.2-3.2" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconoCobrar: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M12 2.5v7M8.8 6.5l3.2 3.2 3.2-3.2" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    <Billete x={4} y={12} color={color} colorSimbolo={colores.verdeApp} />
  </svg>
);

export const IconoQR: React.FC<P> = ({ tamano = 24, color = colores.verdeApp, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    {[
      [2, 2],
      [14, 2],
      [2, 14],
    ].map(([x, y]) => (
      <g key={`${x}-${y}`}>
        <rect x={x} y={y} width={8} height={8} rx={1} fill="none" stroke={color} strokeWidth={2.2} />
        <rect x={x + 2.8} y={y + 2.8} width={2.4} height={2.4} fill={color} />
      </g>
    ))}
    <rect x={14} y={14} width={3} height={3} fill={color} />
    <rect x={19} y={14} width={3} height={3} fill={color} />
    <rect x={16.5} y={16.5} width={3} height={3} fill={color} />
    <rect x={14} y={19} width={3} height={3} fill={color} />
    <rect x={19} y={19} width={3} height={3} fill={color} />
  </svg>
);

export const IconoPersonas: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <circle cx={9} cy={8} r={3.6} fill={color} />
    <path d="M2 19c0-3.6 3.1-6 7-6s7 2.4 7 6z" fill={color} />
    <circle cx={16.5} cy={8.5} r={2.8} fill={color} opacity={0.8} />
    <path d="M15.5 13.2c3.6-.4 6.5 1.8 6.5 5.8h-4.6c0-2.3-.7-4.3-1.9-5.8z" fill={color} opacity={0.8} />
  </svg>
);

export const IconoMenu: React.FC<P> = ({ tamano = 24, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    {[6, 12, 18].map((y) => (
      <rect key={y} x={3} y={y - 1.3} width={18} height={2.6} rx={1.3} fill={color} />
    ))}
  </svg>
);

export const IconoBilleteVerde: React.FC<P> = ({ tamano = 28, style }) => (
  <svg width={tamano} height={tamano * 0.65} viewBox="0 0 28 18" style={style}>
    <rect x={0} y={0} width={28} height={18} rx={3.5} fill={colores.verdeApp} />
    <circle cx={14} cy={9} r={5.2} fill="rgba(255,255,255,0.25)" />
    <text x={14} y={13} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily={fuenteTitulos} fill={colores.blanco}>
      $
    </text>
  </svg>
);

export const IconoMoneda: React.FC<P> = ({ tamano = 120, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 100 100" style={style}>
    <circle cx={50} cy={54} r={44} fill="#2E8F2A" />
    <circle cx={50} cy={48} r={44} fill={colores.verde} />
    <circle cx={50} cy={48} r={34} fill="none" stroke="#8BE07F" strokeWidth={5} />
    <text x={50} y={65} textAnchor="middle" fontSize={46} fontWeight={800} fontFamily={fuenteTitulos} fill={colores.blanco}>
      $
    </text>
  </svg>
);

export const IconoLuna: React.FC<P> = ({ tamano = 120, color = "#FFE9A8", style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M20.5 14.8A8.6 8.6 0 1 1 9.2 3.5a7 7 0 0 0 11.3 11.3z" fill={color} />
  </svg>
);

export const IconoDestello: React.FC<P> = ({ tamano = 40, color = colores.blanco, style }) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    <path d="M12 1.5 L13.9 10.1 L22.5 12 L13.9 13.9 L12 22.5 L10.1 13.9 L1.5 12 L10.1 10.1 Z" fill={color} />
  </svg>
);

// Isotipo de Prestapp recortado del PNG original (369x444).
export const Isotipo: React.FC<{ readonly alto: number; readonly style?: React.CSSProperties }> = ({ alto, style }) => (
  <Img src={staticFile("brand/isotipo-recortado.png")} style={{ height: alto, width: (alto * 369) / 444, ...style }} />
);

// Ícono de app: isotipo sobre cuadrado blanco redondeado.
export const IconoApp: React.FC<{ readonly tamano: number; readonly style?: React.CSSProperties }> = ({ tamano, style }) => (
  <div
    style={{
      width: tamano,
      height: tamano,
      borderRadius: tamano * 0.24,
      backgroundColor: colores.blanco,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    <Isotipo alto={tamano * 0.7} style={{ marginLeft: tamano * 0.02 }} />
  </div>
);

// Signo "≈" dibujado (Sora no trae ese carácter).
export const SignoAprox: React.FC<P> = ({ tamano = 100, color = colores.blanco, style }) => (
  <svg width={tamano * 0.6} height={tamano * 0.6} viewBox="0 0 24 24" style={{ flexShrink: 0, ...style }}>
    <path d="M3 9.2c2.8-2.6 5.6-2.6 9 0s6.2 2.6 9 0" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path d="M3 16.2c2.8-2.6 5.6-2.6 9 0s6.2 2.6 9 0" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
  </svg>
);
