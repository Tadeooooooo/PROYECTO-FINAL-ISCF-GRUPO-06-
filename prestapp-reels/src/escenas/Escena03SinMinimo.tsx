import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { IconoMoneda, IconoTilde } from "../componentes/Iconos";
import { Titular, ZonaTitular } from "../componentes/Titular";
import type { DatosVideo } from "../datos/rendimientos";
import { colores, fuenteTitulos } from "../marca/marca";
import { formatoNumero } from "../utils/numeros";

// Escena 3 · 5–8 s · Sin monto mínimo: la tarjeta va mostrando montos chicos y grandes, y todos rinden.
const CAMBIOS = [14, 64, 114];

export const Escena03SinMinimo: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const montos = datos.montosSinMinimo;

  const entrada = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 150 } });
  const salida = interpolate(frame, [166, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const actual = CAMBIOS.filter((c) => frame >= c).length - 1;
  const inicioActual = CAMBIOS[Math.max(0, actual)];
  const chip = spring({ frame: frame - inicioActual - 6, fps, config: { damping: 9, stiffness: 200, mass: 0.6 } });

  return (
    <AbsoluteFill>
      <ZonaTitular>
        <Titular texto={datos.sinMinimo} desde={4} hasta={180} tamano={96} retrasoPorPalabra={5} />
      </ZonaTitular>

      <div
        style={{
          position: "absolute",
          left: 150,
          width: 780,
          top: 870,
          height: 300,
          borderRadius: 44,
          backgroundColor: colores.blanco,
          boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
          opacity: Math.min(1, entrada * 1.5) * (1 - salida),
          translate: `0px ${(1 - entrada) * 80}px`,
          scale: String(1 - 0.08 * salida),
        }}
      >
        {/* Montos que van pasando, como una tragamonedas */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 44 }}>
          {montos.map((monto, i) => {
            const desde = CAMBIOS[i] ?? CAMBIOS[CAMBIOS.length - 1];
            const hasta = CAMBIOS[i + 1];
            const entra = interpolate(frame, [desde, desde + 12], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(1.4)),
            });
            const sale =
              hasta === undefined
                ? 0
                : interpolate(frame, [hasta, hasta + 10], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                    easing: Easing.in(Easing.cubic),
                  });
            const visible = frame >= desde && sale < 1;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: "0 0 64px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fuenteTitulos,
                  fontWeight: 800,
                  fontSize: 116,
                  letterSpacing: "-0.03em",
                  color: colores.azulApp,
                  opacity: visible ? 1 - sale : 0,
                  translate: `0px ${entra * 150 - sale * 150}px`,
                }}
              >
                $ {formatoNumero(monto)}
              </div>
            );
          })}
        </div>

        {/* Chip "Rinde" que rebota con cada monto */}
        <div
          style={{
            position: "absolute",
            right: -24,
            top: -58,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 34px 10px 22px",
            borderRadius: 999,
            backgroundColor: colores.verde,
            color: colores.noche,
            fontFamily: fuenteTitulos,
            fontWeight: 800,
            fontSize: 58,
            rotate: "-4deg",
            scale: String(0.7 + 0.3 * chip),
            opacity: frame >= CAMBIOS[0] + 6 ? 1 : 0,
            boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
          }}
        >
          <IconoTilde tamano={60} color={colores.noche} />
          {datos.etiquetaRinde}
        </div>

        {/* Monedas que caen, una por cada monto */}
        {CAMBIOS.map((c, i) => {
          const caida = spring({ frame: frame - c - 2, fps, config: { damping: 10, stiffness: 170, mass: 0.8 } });
          return (
            <IconoMoneda
              key={c}
              tamano={140}
              style={{
                position: "absolute",
                left: 26 + i * 14,
                bottom: -74 + i * 26,
                opacity: frame >= c + 2 ? 1 : 0,
                translate: `0px ${(1 - caida) * -420}px`,
                rotate: `${(1 - caida) * -40 + (i % 2 === 0 ? -6 : 8)}deg`,
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
