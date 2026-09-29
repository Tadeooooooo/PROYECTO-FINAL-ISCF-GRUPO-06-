import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Titular, ZonaTitular } from "../componentes/Titular";
import type { DatosVideo } from "../datos/rendimientos";
import { colores, fuenteTexto, fuenteTitulos } from "../marca/marca";
import { formatoNumero } from "../utils/numeros";

// Escena 6 · 14–17 s · "Simulemos: $100.000 en tu saldo". El monto se escribe cifra por cifra.
const EMPIEZA_A_ESCRIBIR = 22;
const CUADROS_POR_CARACTER = 4;

export const Escena06Simulacion: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const monto = "$" + formatoNumero(datos.montoEjemplo);
  const escritos = Math.max(0, Math.min(monto.length, Math.floor((frame - EMPIEZA_A_ESCRIBIR) / CUADROS_POR_CARACTER) + 1));
  const terminaDeEscribir = EMPIEZA_A_ESCRIBIR + monto.length * CUADROS_POR_CARACTER;
  const cursorVisible = frame < terminaDeEscribir + 30 && Math.floor(frame / 12) % 2 === 0;

  const tarjeta = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 140 } });
  const etiqueta = spring({ frame: frame - terminaDeEscribir, fps, config: { damping: 16, stiffness: 150 } });
  const subrayado = interpolate(frame, [terminaDeEscribir + 10, terminaDeEscribir + 34], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const salida = interpolate(frame, [166, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ opacity: 1 - salida, translate: `0px ${-50 * salida}px` }}>
      <ZonaTitular>
        <Titular texto={datos.simulemos} desde={4} tamano={104} />
      </ZonaTitular>

      <div
        style={{
          position: "absolute",
          left: 110,
          width: 860,
          top: 690,
          height: 470,
          borderRadius: 56,
          backgroundColor: "rgba(255,255,255,0.07)",
          border: "2px solid rgba(255,255,255,0.16)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: Math.min(1, tarjeta * 1.5),
          scale: String(0.9 + 0.1 * tarjeta),
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <div
            style={{
              fontFamily: fuenteTitulos,
              fontWeight: 800,
              fontSize: 158,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: colores.blanco,
            }}
          >
            {monto.slice(0, escritos)}
            {/* Parte que falta, invisible, para que el ancho no salte */}
            <span style={{ opacity: 0 }}>{monto.slice(escritos)}</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: `${(escritos / monto.length) * 100}%`,
              top: 24,
              width: 10,
              height: 136,
              marginLeft: 6,
              borderRadius: 5,
              backgroundColor: colores.verde,
              opacity: cursorVisible ? 1 : 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              bottom: -14,
              height: 12,
              borderRadius: 6,
              width: `${subrayado * 100}%`,
              backgroundColor: colores.verde,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 40,
            fontFamily: fuenteTexto,
            fontWeight: 700,
            fontSize: 68,
            color: "rgba(255,255,255,0.8)",
            opacity: frame >= terminaDeEscribir ? etiqueta : 0,
            translate: `0px ${(1 - etiqueta) * 30}px`,
          }}
        >
          {datos.enTuSaldo}
        </div>
      </div>
    </AbsoluteFill>
  );
};
