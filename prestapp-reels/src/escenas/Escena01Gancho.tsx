import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Odometro } from "../componentes/Odometro";
import { Titular, ZonaTitular } from "../componentes/Titular";
import { IconoFlechaArriba } from "../componentes/Iconos";
import type { DatosVideo } from "../datos/rendimientos";
import { colores, fuenteTexto, fuenteTitulos } from "../marca/marca";
import { calcularSimulacion } from "../utils/numeros";

// Escena 1 · 0–2 s · Gancho: el saldo está quieto y de golpe empieza a crecer.
export const Escena01Gancho: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rendimientoDiarioRedondo } = calcularSimulacion(datos);

  const INICIO_CHIP = 58;
  const saldoFinal = datos.montoEjemplo + rendimientoDiarioRedondo;
  const giro = interpolate(frame, [INICIO_CHIP + 4, INICIO_CHIP + 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Antes del chip el número está "apagado"; cuando empieza a rendir se enciende.
  const vida = interpolate(frame, [INICIO_CHIP, INICIO_CHIP + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chip = spring({ frame: frame - INICIO_CHIP, fps, config: { damping: 11, stiffness: 190, mass: 0.7 } });
  const pulso = spring({ frame: frame - INICIO_CHIP - 4, fps, config: { damping: 9, stiffness: 160 } });

  return (
    <AbsoluteFill>
      <ZonaTitular arriba={300}>
        <Titular texto={datos.gancho} tamano={116} estilo="golpe" retrasoPorPalabra={2} />
      </ZonaTitular>

      <div style={{ position: "absolute", top: 760, left: 80, right: 80, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontFamily: fuenteTexto, fontWeight: 700, fontSize: 56, color: "rgba(255,255,255,0.7)", marginBottom: 24 }}>
          {datos.etiquetaSaldo}
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: "-40px -60px",
              borderRadius: 200,
              background: `radial-gradient(ellipse at center, ${colores.verde}55 0%, transparent 70%)`,
              opacity: vida * (1 - 0.4 * pulso),
              scale: String(0.8 + 0.3 * pulso),
            }}
          />
          <Odometro
            desde={datos.montoEjemplo}
            hasta={saldoFinal}
            progreso={giro}
            style={{
              position: "relative",
              fontFamily: fuenteTitulos,
              fontWeight: 800,
              fontSize: 170,
              letterSpacing: "-0.03em",
              color: `rgba(255,255,255,${0.55 + 0.45 * vida})`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 70,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 40px 14px 26px",
            borderRadius: 999,
            backgroundColor: colores.verde,
            color: colores.noche,
            fontFamily: fuenteTitulos,
            fontWeight: 800,
            fontSize: 68,
            opacity: frame >= INICIO_CHIP ? 1 : 0,
            scale: String(chip),
            boxShadow: `0 20px 60px ${colores.verde}66`,
          }}
        >
          <IconoFlechaArriba tamano={62} color={colores.noche} />
          +${rendimientoDiarioRedondo} {datos.chipHoy}
        </div>
      </div>
    </AbsoluteFill>
  );
};
