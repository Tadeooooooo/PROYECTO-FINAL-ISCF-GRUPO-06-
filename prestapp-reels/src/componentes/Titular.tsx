import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colores, fuenteTitulos } from "../marca/marca";

type Palabra = { texto: string; verde: boolean };

// "Con Prestapp,\ntu saldo *rinde solo*" -> líneas de palabras con marca de verde.
const separarTexto = (texto: string): Palabra[][] => {
  let enVerde = false;
  return texto.split("\n").map((linea) =>
    linea
      .split(" ")
      .filter(Boolean)
      .map((crudo) => {
        let t = crudo;
        let verde = enVerde;
        if (t.startsWith("*")) {
          verde = true;
          enVerde = true;
          t = t.slice(1);
        }
        if (t.endsWith("*")) {
          enVerde = false;
          t = t.slice(0, -1);
        }
        return { texto: t, verde };
      }),
  );
};

type Props = {
  readonly texto: string;
  /** Cuadro en el que empieza a entrar la primera palabra. */
  readonly desde?: number;
  /** Cuadro en el que termina de salir (si no se pasa, no sale). */
  readonly hasta?: number;
  readonly tamano?: number;
  readonly retrasoPorPalabra?: number;
  /** "golpe" = entra rápido desde grande (gancho). "suave" = sube con resorte. */
  readonly estilo?: "golpe" | "suave";
  /** Escalonar la entrada palabra por palabra o línea por línea. */
  readonly escalonar?: "palabra" | "linea";
  readonly color?: string;
  readonly style?: React.CSSProperties;
};

export const Titular: React.FC<Props> = ({
  texto,
  desde = 0,
  hasta,
  tamano = 96,
  retrasoPorPalabra = 4,
  estilo = "suave",
  escalonar = "palabra",
  color = colores.blanco,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineas = separarTexto(texto);

  const salida =
    hasta === undefined
      ? 0
      : interpolate(frame, [hasta - 12, hasta], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.in(Easing.cubic),
        });

  let indice = 0;
  return (
    <div
      style={{
        fontFamily: fuenteTitulos,
        fontWeight: 800,
        fontSize: tamano,
        lineHeight: 1.08,
        letterSpacing: "-0.025em",
        color,
        textAlign: "center",
        opacity: 1 - salida,
        translate: `0px ${-40 * salida}px`,
        ...style,
      }}
    >
      {lineas.map((linea, l) => (
        <div
          key={l}
          style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: "0.26em" }}
        >
          {linea.map((palabra) => {
            const orden = escalonar === "linea" ? l : indice;
            const local = frame - desde - orden * retrasoPorPalabra;
            indice++;
            const entrada =
              estilo === "golpe"
                ? spring({ frame: local, fps, config: { damping: 22, stiffness: 520, mass: 0.5 } })
                : spring({ frame: local, fps, config: { damping: 15, stiffness: 170, mass: 0.8 } });
            return (
              <span
                key={indice}
                style={{
                  display: "inline-block",
                  color: palabra.verde ? colores.verde : undefined,
                  opacity: interpolate(local, [0, estilo === "golpe" ? 3 : 8], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  translate: estilo === "golpe" ? undefined : `0px ${(1 - entrada) * tamano * 0.55}px`,
                  scale: estilo === "golpe" ? String(1.18 - 0.18 * entrada) : undefined,
                }}
              >
                {palabra.texto}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Caja fija arriba, dentro de la zona segura, donde van los títulos. */
export const ZonaTitular: React.FC<{ readonly children: React.ReactNode; readonly arriba?: number }> = ({
  children,
  arriba = 290,
}) => (
  <div style={{ position: "absolute", top: arriba, left: 80, right: 80 }}>{children}</div>
);
