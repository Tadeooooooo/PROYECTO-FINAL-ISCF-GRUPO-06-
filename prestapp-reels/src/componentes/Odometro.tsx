import React from "react";
import { Easing, interpolate } from "remotion";
import { formatoNumero } from "../utils/numeros";

// Número con dígitos que ruedan como un contador mecánico:
// cada cifra que cambia gira sola hasta su valor final (las de la derecha arrancan primero).
export const Odometro: React.FC<{
  readonly desde: number;
  readonly hasta: number;
  /** 0 = muestra "desde", 1 = muestra "hasta". */
  readonly progreso: number;
  readonly prefijo?: string;
  readonly style?: React.CSSProperties;
}> = ({ desde, hasta, progreso, prefijo = "$", style }) => {
  const plantilla = formatoNumero(Math.floor(hasta));
  const cantidadDigitos = plantilla.replace(/\./g, "").length;
  let lugar = cantidadDigitos;

  return (
    <div style={{ display: "flex", lineHeight: 1, fontVariantNumeric: "tabular-nums", ...style }}>
      <span>{prefijo}</span>
      {plantilla.split("").map((caracter, i) => {
        if (caracter === ".") {
          return <span key={i}>.</span>;
        }
        lugar--;
        const inicial = Math.floor(desde / 10 ** lugar) % 10;
        let final = Math.floor(hasta / 10 ** lugar) % 10;
        if (final < inicial) final += 10;
        // Escalonado: las unidades arrancan primero, cada lugar hacia la izquierda un poco después.
        const p = interpolate(progreso, [lugar * 0.12, Math.min(1, 0.7 + lugar * 0.12)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        const posicion = inicial + (final - inicial) * p;
        const girando = Math.abs(posicion - Math.round(posicion)) > 0.01;
        const mascara = girando
          ? "linear-gradient(to bottom, transparent 4%, #000 26%, #000 74%, transparent 96%)"
          : undefined;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              width: "0.64em",
              height: "1em",
              overflow: "hidden",
              position: "relative",
              maskImage: mascara,
              WebkitMaskImage: mascara,
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                translate: `0px ${-posicion}em`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d, j) => (
                <span key={j} style={{ height: "1em", lineHeight: 1 }}>
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </div>
  );
};
