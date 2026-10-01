import React from "react";
import { colores, fuenteTitulos } from "../../marca/marca";

// Íconos propios (SVG) para las pantallas de los tutoriales.
type P = {
  readonly tamano?: number;
  readonly color?: string;
  readonly style?: React.CSSProperties;
};
const AZUL = colores.azulApp;

const Svg: React.FC<P & { readonly children: React.ReactNode }> = ({
  tamano = 40,
  style,
  children,
}) => (
  <svg width={tamano} height={tamano} viewBox="0 0 24 24" style={style}>
    {children}
  </svg>
);

export const IcPersona: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <circle cx={12} cy={7.5} r={4.5} fill={color} />
    <path d="M3.5 21c0-4.7 3.8-7.5 8.5-7.5s8.5 2.8 8.5 7.5z" fill={color} />
  </Svg>
);

export const IcPersonaMas: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <circle cx={9} cy={8} r={4} fill={color} />
    <path d="M1.5 20c0-4.2 3.3-6.5 7.5-6.5s7.5 2.3 7.5 6.5z" fill={color} />
    <path
      d="M19 7v6M16 10h6"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
  </Svg>
);

export const IcPersonaCheck: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <circle cx={9} cy={8} r={4} fill={color} />
    <path d="M1.5 20c0-4.2 3.3-6.5 7.5-6.5s7.5 2.3 7.5 6.5z" fill={color} />
    <path
      d="M15.5 11l2.2 2.2 4.3-4.6"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IcCompartir: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <circle cx={18} cy={5} r={3} fill={color} />
    <circle cx={6} cy={12} r={3} fill={color} />
    <circle cx={18} cy={19} r={3} fill={color} />
    <path
      d="M8.5 10.7L15.5 6.3M8.5 13.3L15.5 17.7"
      stroke={color}
      strokeWidth={2.2}
    />
  </Svg>
);

export const IcCelular: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <rect x={6.5} y={2} width={11} height={20} rx={2.2} fill={color} />
    <rect x={10} y={18.2} width={4} height={1.4} rx={0.7} fill="#fff" />
  </Svg>
);

export const IcCelularCheck: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <rect x={6.5} y={2} width={11} height={20} rx={2.2} fill={color} />
    <path
      d="M9.3 10.5l2 2 3.6-4"
      fill="none"
      stroke="#fff"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x={10} y={18.2} width={4} height={1.4} rx={0.7} fill="#fff" />
  </Svg>
);

export const IcRombo: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <path
      d="M12 4L22 12 12 20 2 12z"
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
    <circle
      cx={12}
      cy={12}
      r={3.2}
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

export const IcCaraTriste: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <circle cx={12} cy={12} r={10} fill={color} />
    <circle cx={8.7} cy={10} r={1.4} fill="#fff" />
    <circle cx={15.3} cy={10} r={1.4} fill="#fff" />
    <path
      d="M8 16.5c2.3-2.2 5.7-2.2 8 0"
      fill="none"
      stroke="#fff"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

export const IcTacho: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <rect x={4} y={4.5} width={16} height={2.6} rx={1} fill={color} />
    <rect x={9} y={2.5} width={6} height={2.5} rx={1} fill={color} />
    <path d="M5.5 8.5h13l-1.2 13H6.7z" fill={color} />
  </Svg>
);

export const IcCorazon: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <path
      d="M12 21s-9-5.6-9-11.6A5 5 0 0 1 12 6.6a5 5 0 0 1 9 2.8C21 15.4 12 21 12 21z"
      fill={color}
    />
  </Svg>
);

export const IcDocumentoLineas: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <path d="M5 2h9.5L19 6.5V22H5z" fill={color} />
    <path
      d="M8.5 13h7M8.5 16.5h7"
      stroke="#fff"
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

export const IcLapiz: React.FC<P> = ({ color = AZUL, ...p }) => (
  <Svg {...p}>
    <path d="M3 17.3V21h3.7L18 9.7 14.3 6z" fill={color} />
    <path
      d="M15.6 4.7l1.7-1.7a1.4 1.4 0 0 1 2 0l1.7 1.7a1.4 1.4 0 0 1 0 2l-1.7 1.7z"
      fill={color}
    />
  </Svg>
);

export const IcCamara: React.FC<P> = ({ color = "#fff", ...p }) => (
  <Svg {...p}>
    <path d="M3 7.5h4l1.8-2.5h6.4L17 7.5h4v12H3z" fill={color} />
    <circle cx={12} cy={13.2} r={3.6} fill={AZUL} />
    <circle cx={12} cy={13.2} r={2} fill={color} />
  </Svg>
);

export const IcRayo: React.FC<P> = ({ color = "#F2B01E", ...p }) => (
  <Svg {...p}>
    <path d="M13.5 2L5 13.5h6L10 22l9-12h-6.2z" fill={color} />
  </Svg>
);

export const IcLlama: React.FC<P> = ({ color = "#E8622C", ...p }) => (
  <Svg {...p}>
    <path
      d="M12 2c1 4 5.5 6 5.5 11.5A5.5 5.5 0 0 1 6.5 13.5c0-2.5 1.2-4 2.6-5.2.2 2 1 3 2.2 3.5C11 8.5 11.3 5 12 2z"
      fill={color}
    />
  </Svg>
);

export const IcGota: React.FC<P> = ({ color = "#2E8DEB", ...p }) => (
  <Svg {...p}>
    <path
      d="M12 2.5S5 10.2 5 14.5a7 7 0 0 0 14 0C19 10.2 12 2.5 12 2.5z"
      fill={color}
    />
  </Svg>
);

export const IcWifi: React.FC<P> = ({ color = "#7B4FE0", ...p }) => (
  <Svg {...p}>
    <path
      d="M2.5 9.5a13.5 13.5 0 0 1 19 0M5.8 12.8a8.8 8.8 0 0 1 12.4 0M9.1 16.1a4.2 4.2 0 0 1 5.8 0"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
    />
    <circle cx={12} cy={19.3} r={1.5} fill={color} />
  </Svg>
);

export const IcTienda: React.FC<P> = ({ color = "#fff", ...p }) => (
  <Svg {...p}>
    <path
      d="M3 9l1.6-5.5h14.8L21 9a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"
      fill={color}
    />
    <path d="M4.5 12v9h15v-9" fill="none" stroke={color} strokeWidth={2} />
    <rect x={10} y={15} width={4} height={6} fill={color} />
  </Svg>
);

export const IcEscudo: React.FC<
  P & {
    readonly check?: boolean;
    readonly candado?: boolean;
    readonly colorDetalle?: string;
  }
> = ({
  color = colores.verde,
  check,
  candado,
  colorDetalle = "#fff",
  ...p
}) => (
  <Svg {...p}>
    <path
      d="M12 1.8l8.5 3.2v6.4c0 5.4-3.6 9.6-8.5 11-4.9-1.4-8.5-5.6-8.5-11V5z"
      fill={color}
    />
    {check && (
      <path
        d="M7.6 12.2l3 3 5.8-6.2"
        fill="none"
        stroke={colorDetalle}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
    {candado && (
      <>
        <rect x={8.3} y={11} width={7.4} height={6} rx={1.2} fill="#fff" />
        <path
          d="M9.8 11V9.3a2.2 2.2 0 0 1 4.4 0V11"
          fill="none"
          stroke="#fff"
          strokeWidth={1.6}
        />
      </>
    )}
  </Svg>
);

/** Huella digital de líneas; `progreso` (0–1) la va dibujando. */
export const IcHuella: React.FC<
  P & { readonly progreso?: number; readonly grosor?: number }
> = ({ color = colores.verde, progreso = 1, grosor = 1.5, ...p }) => {
  const trazos = [
    "M6.2 5.2A9 9 0 0 1 18.6 6",
    "M4.2 9.8a8.2 8.2 0 0 1 15.6.4",
    "M6.4 20.2C5.2 17.6 5 15 5.6 12.6a6.5 6.5 0 0 1 12.8 1",
    "M9.2 21.2c-.9-2.3-1.3-4.6-1-6.8a4.1 4.1 0 0 1 8.1.2c.2 2 .1 3.8-.4 5.6",
    "M12.2 22c-.8-2.4-1.3-5-1.1-7.6",
    "M15.8 21.3c.7-2 .9-4 .7-6",
    "M18.6 18c.4-1.4.5-2.8.3-4.2",
  ];
  return (
    <Svg {...p}>
      {trazos.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={grosor}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={
            1 - Math.max(0, Math.min(1, progreso * trazos.length - i))
          }
        />
      ))}
    </Svg>
  );
};

export const IcChevron: React.FC<P> = ({ color = "#5E5B72", ...p }) => (
  <Svg {...p}>
    <path
      d="M9 5l7 7-7 7"
      fill="none"
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const IcVolver: React.FC<P> = ({ color = "#fff", ...p }) => (
  <Svg {...p}>
    <path
      d="M15 4.5L7.5 12l7.5 7.5"
      fill="none"
      stroke={color}
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/** Círculo neutro con la inicial (reemplaza los logos de otras marcas). */
export const Inicial: React.FC<{
  readonly letra: string;
  readonly tamano?: number;
}> = ({ letra, tamano = 64 }) => (
  <div
    style={{
      width: tamano,
      height: tamano,
      borderRadius: tamano / 2,
      backgroundColor: "#E7E6F3",
      color: AZUL,
      fontFamily: fuenteTitulos,
      fontWeight: 800,
      fontSize: tamano * 0.42,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {letra}
  </div>
);
