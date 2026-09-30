import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { IconoTilde } from "../componentes/Iconos";
import { Titular, ZonaTitular } from "../componentes/Titular";
import { Efecto } from "../componentes/Sonido";
import type { DatosVideo } from "../datos/rendimientos";
import { colores, fuenteTexto, fuenteTitulos } from "../marca/marca";
import { calcularSimulacion, formatoNumero } from "../utils/numeros";

// Escena 4 · 8–11 s · Se acredita todos los días: el calendario se tilda y el saldo suma.
const DIAS = 14;
const PRIMER_TILDE = 26;
const CADA = 6; // 0,1 s entre tildes

const cuadroTilde = (i: number) => PRIMER_TILDE + i * CADA;

/** Días ya acreditados en el cuadro dado (con transición suave entre un día y otro). */
export const diasAcreditadosEscena04 = (frame: number) => {
  let total = 0;
  for (let i = 0; i < DIAS; i++) {
    total += interpolate(frame, [cuadroTilde(i), cuadroTilde(i) + 5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return total;
};

export const Escena04Diario: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rendimientoDiario } = calcularSimulacion(datos);

  const saldo = datos.montoEjemplo + diasAcreditadosEscena04(frame) * rendimientoDiario;
  const entradaSaldo = spring({ frame: frame - 6, fps, config: { damping: 16, stiffness: 150 } });
  const entradaCalendario = spring({ frame: frame - 12, fps, config: { damping: 16, stiffness: 150 } });
  const salida = interpolate(frame, [164, 178], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  // Destello verde en la tarjeta de saldo cada vez que se acredita un día.
  const ultimoTilde = [...Array(DIAS).keys()].map(cuadroTilde).filter((c) => frame >= c).pop();
  const destello =
    ultimoTilde === undefined ? 0 : interpolate(frame - ultimoTilde, [0, 14], [1, 0], { extrapolateRight: "clamp" });

  const tarjeta: React.CSSProperties = {
    position: "absolute",
    left: 150,
    width: 780,
    borderRadius: 40,
    backgroundColor: colores.blanco,
    boxShadow: "0 40px 100px rgba(0,0,0,0.45)",
  };

  return (
    <AbsoluteFill style={{ opacity: 1 - salida, scale: String(1 - 0.05 * salida) }}>
      {/* Sonido: entran las tarjetas y cada día tildado suena una nota más aguda */}
      <Efecto archivo="pop-suave" en={6} volumen={0.45} />
      <Efecto archivo="pop-suave" en={12} volumen={0.35} />
      {[...Array(DIAS).keys()].map((i) => (
        <Efecto key={i} archivo={`nota-${String(i + 1).padStart(2, "0")}`} en={cuadroTilde(i)} volumen={0.36} />
      ))}
      <ZonaTitular>
        <Titular texto={datos.diario} desde={4} tamano={96} retrasoPorPalabra={5} />
      </ZonaTitular>

      {/* Tarjeta de saldo */}
      <div
        style={{
          ...tarjeta,
          top: 590,
          padding: "28px 44px 30px",
          opacity: Math.min(1, entradaSaldo * 1.5),
          translate: `0px ${(1 - entradaSaldo) * 70}px`,
          boxShadow: `0 40px 100px rgba(0,0,0,0.45), 0 0 0 ${6 * destello}px ${colores.verde}`,
        }}
      >
        <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 56, color: colores.grisTextoApp }}>
          {datos.etiquetaSaldo}
        </div>
        <div
          style={{
            fontFamily: fuenteTitulos,
            fontWeight: 800,
            fontSize: 94,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            fontVariantNumeric: "tabular-nums",
            color: destello > 0.05 ? "#2E8F2A" : colores.azulApp,
          }}
        >
          $ {formatoNumero(saldo, 2)}
        </div>
      </div>

      {/* Calendario */}
      <div
        style={{
          ...tarjeta,
          top: 900,
          padding: "30px 30px 34px",
          opacity: Math.min(1, entradaCalendario * 1.5),
          translate: `0px ${(1 - entradaCalendario) * 90}px`,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          rowGap: 22,
          justifyItems: "center",
        }}
      >
        {datos.diasSemana.map((d, i) => (
          <div key={`s${i}`} style={{ fontFamily: fuenteTexto, fontWeight: 800, fontSize: 34, color: "#9A97B5" }}>
            {d}
          </div>
        ))}
        {[...Array(DIAS).keys()].map((i) => {
          const tilde = spring({ frame: frame - cuadroTilde(i), fps, config: { damping: 10, stiffness: 260, mass: 0.5 } });
          const hecho = frame >= cuadroTilde(i);
          return (
            <div
              key={i}
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: hecho ? colores.verde : "#EEEEF6",
                scale: String(hecho ? 0.75 + 0.25 * tilde : 1),
                fontFamily: fuenteTitulos,
                fontWeight: 700,
                fontSize: 36,
                color: colores.azulApp,
              }}
            >
              {hecho ? <IconoTilde tamano={58} color={colores.noche} progreso={Math.min(1, tilde * 1.2)} /> : i + 1}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
