import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, FUENTE, sale as curvaSalida, suave, tramo } from "../marca";

// Reveal con máscara palabra por palabra.
// - Cada palabra sube desde abajo de su máscara con un leve desenfoque de movimiento y queda quieta.
// - Stagger de 2 cuadros. Todo el bloque entra en 18 cuadros (0,6 s) como máximo.
// - "*palabra*" va en verde. Cada elemento del array es una línea.
export const MAX_ENTRADA = 18;
export const MAX_SALIDA = 12;
const STAGGER = 2;

export const duracionPalabra = (palabras: number) =>
  Math.max(8, Math.min(14, MAX_ENTRADA - STAGGER * (palabras - 1)));

type Palabra = { texto: string; verde: boolean };
const partir = (lineas: string[]): Palabra[][] => {
  let verde = false;
  return lineas.map((l) =>
    l.split(" ").map((w) => {
      let t = w;
      let v = verde;
      if (t.startsWith("*")) {
        t = t.slice(1);
        v = true;
        verde = true;
      }
      if (t.endsWith("*")) {
        t = t.slice(0, -1);
        verde = false;
      }
      return { texto: t, verde: v };
    }),
  );
};

export const contarPalabras = (lineas: string[]) => partir(lineas).flat().length;

export const Revelar: React.FC<{
  readonly lineas: string[];
  /** Cuadro (relativo a la escena) en que empieza a entrar. */
  readonly entra: number;
  /** Cuadro en que empieza a salir (sale en 12 cuadros). */
  readonly sale: number;
  readonly tamano: number;
  readonly peso?: 600 | 800;
  readonly color?: string;
  readonly alinear?: "left" | "center";
  readonly interlineado?: number;
  /** Desplazamiento horizontal de la salida (para acompañar un movimiento de cámara). */
  readonly salidaX?: number;
  /** Si el texto es parte de un bloque más grande: palabras totales del bloque y cuántas van antes de este. */
  readonly palabrasBloque?: number;
  readonly desfase?: number;
  readonly style?: React.CSSProperties;
}> = ({ lineas, entra, sale, tamano, peso = 800, color = C.blanco, alinear = "left", interlineado = 1.08, salidaX = 0, palabrasBloque, desfase = 0, style }) => {
  const f = useCurrentFrame();
  const palabras = partir(lineas);
  const total = palabras.flat().length;
  const dur = duracionPalabra(palabrasBloque ?? total);
  const s = tramo(f, sale, sale + MAX_SALIDA, curvaSalida);
  let indice = desfase;

  return (
    <div
      style={{
        fontFamily: FUENTE,
        fontWeight: peso,
        fontSize: tamano,
        lineHeight: interlineado,
        color,
        textAlign: alinear,
        letterSpacing: peso === 800 ? "-0.015em" : "0",
        opacity: 1 - s,
        translate: `${salidaX * s}px ${salidaX === 0 ? -24 * s : 0}px`,
        ...style,
      }}
    >
      {palabras.map((linea, i) => (
        <div key={i} style={{ whiteSpace: "nowrap" }}>
          {linea.map((p, j) => {
            const k = indice++;
            const inicio = entra + k * STAGGER;
            const v = interpolate(f, [inicio, inicio + dur], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: suave,
            });
            return (
              <span
                key={j}
                style={{
                  display: "inline-block",
                  overflow: "hidden",
                  verticalAlign: "top",
                  paddingBottom: "0.14em",
                  marginBottom: "-0.14em",
                  marginRight: j < linea.length - 1 ? "0.26em" : 0,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    color: p.verde ? C.verde : undefined,
                    translate: `0px ${(1 - v) * 110}%`,
                    filter: v < 0.98 ? `blur(${(1 - v) * 5}px)` : undefined,
                  }}
                >
                  {p.texto}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// Píldora verde con texto en mayúsculas (Tinta sobre verde).
export const Pildora: React.FC<{ readonly texto: string; readonly entra: number; readonly sale: number; readonly salidaX?: number }> = ({
  texto,
  entra,
  sale,
  salidaX = 0,
}) => {
  const f = useCurrentFrame();
  const v = tramo(f, entra, entra + 14);
  const s = tramo(f, sale, sale + MAX_SALIDA, curvaSalida);
  return (
    <div style={{ display: "inline-block", overflow: "hidden", padding: "6px 0", opacity: 1 - s, translate: `${salidaX * s}px 0px` }}>
      <div
        style={{
          display: "inline-block",
          backgroundColor: C.verde,
          color: C.tinta,
          fontFamily: FUENTE,
          fontWeight: 800,
          fontSize: 56,
          lineHeight: 1,
          letterSpacing: "0.02em",
          padding: "18px 40px 16px",
          borderRadius: 999,
          translate: `0px ${(1 - v) * 115}%`,
          filter: v < 0.98 ? `blur(${(1 - v) * 5}px)` : undefined,
        }}
      >
        {texto}
      </div>
    </div>
  );
};

// Chip: blanco al 15% con borde fino, ícono de línea + texto de apoyo.
export const Chip: React.FC<{
  readonly icono: React.ReactNode;
  readonly texto?: string;
  readonly entra: number;
  readonly sale: number;
  readonly salidaX?: number;
  readonly style?: React.CSSProperties;
}> = ({ icono, texto, entra, sale, salidaX = 0, style }) => {
  const f = useCurrentFrame();
  const v = tramo(f, entra, entra + 14);
  const s = tramo(f, sale, sale + MAX_SALIDA, curvaSalida);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 22,
        padding: texto ? "18px 40px 18px 26px" : 24,
        borderRadius: 999,
        backgroundColor: "rgba(255,255,255,0.15)",
        border: "2px solid rgba(255,255,255,0.45)",
        fontFamily: FUENTE,
        fontWeight: 600,
        fontSize: 56,
        lineHeight: 1,
        color: C.blanco,
        opacity: v * (1 - s),
        translate: `${salidaX * s}px ${(1 - v) * 40}px`,
        filter: v < 0.98 ? `blur(${(1 - v) * 5}px)` : undefined,
        ...style,
      }}
    >
      {icono}
      {texto && <span style={{ paddingTop: 4 }}>{texto}</span>}
    </div>
  );
};
