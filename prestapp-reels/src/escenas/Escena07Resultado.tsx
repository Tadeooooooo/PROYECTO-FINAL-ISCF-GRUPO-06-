import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SignoAprox } from "../componentes/Iconos";
import { Efecto } from "../componentes/Sonido";
import type { DatosVideo } from "../datos/rendimientos";
import { colores, fuenteTexto, fuenteTitulos } from "../marca/marca";
import { calcularSimulacion, formatoNumero } from "../utils/numeros";

// Escena 7 · 17–21,5 s · Resultado: primero cuánto rinde por día, después en 30 días con barras.
const CAMBIO = 120; // cuadro en el que pasa de "por día" a "en 30 días"
const BARRAS_DESDE = CAMBIO + 4;

const NumeroGrande: React.FC<{ readonly valor: number; readonly tamano: number }> = ({ valor, tamano }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: fuenteTitulos,
      fontWeight: 800,
      fontSize: tamano,
      letterSpacing: "-0.035em",
      lineHeight: 1,
      color: colores.verde,
      fontVariantNumeric: "tabular-nums",
    }}
  >
    <SignoAprox tamano={tamano * 0.85} color={colores.verde} style={{ marginRight: tamano * 0.06 }} />$
    {formatoNumero(valor)}
  </div>
);

export const Escena07Resultado: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sim = calcularSimulacion(datos);
  const dias = datos.diasSimulacion;

  const pastilla = spring({ frame: frame - 4, fps, config: { damping: 14, stiffness: 160 } });

  // Fase A: por día
  const entradaA = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 150 } });
  const valorA = interpolate(frame, [14, 62], [0, sim.rendimientoDiarioRedondo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const salidaA = interpolate(frame, [CAMBIO - 8, CAMBIO + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

  // Fase B: en 30 días
  const entradaB = spring({ frame: frame - CAMBIO, fps, config: { damping: 14, stiffness: 150 } });
  const finBarras = BARRAS_DESDE + (dias - 1) * 2 + 18;
  const valorB = interpolate(frame, [BARRAS_DESDE, finBarras], [0, sim.rendimientoPeriodoRedondo], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const zonaBarras = { izquierda: 140, ancho: 800, base: 1370, alto: 320 };
  const separacion = 6;
  const anchoBarra = (zonaBarras.ancho - separacion * (dias - 1)) / dias;

  return (
    <AbsoluteFill>
      {/* Sonido: "éxito" cuando las barras llegan al total */}
      <Efecto archivo="exito" en={finBarras} volumen={0.6} />
      {/* TNA de referencia */}
      <div style={{ position: "absolute", top: 300, left: 80, right: 80, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "16px 38px",
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.08)",
            border: "2px solid rgba(255,255,255,0.18)",
            fontFamily: fuenteTexto,
            fontWeight: 700,
            fontSize: 56,
            color: colores.blanco,
            whiteSpace: "nowrap",
            opacity: Math.min(1, pastilla * 1.5),
            scale: String(0.85 + 0.15 * pastilla),
          }}
        >
          {datos.etiquetaTna} <span style={{ color: colores.verde, fontWeight: 800 }}>{sim.tnaTexto}</span>
        </div>
      </div>

      {/* Fase A */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: frame < 10 ? 0 : Math.min(1, entradaA * 1.5) * (1 - salidaA),
          scale: String(0.85 + 0.15 * entradaA),
          translate: `0px ${-80 * salidaA}px`,
        }}
      >
        <NumeroGrande valor={valorA} tamano={250} />
        <div style={{ marginTop: 30, fontFamily: fuenteTitulos, fontWeight: 700, fontSize: 92, color: colores.blanco }}>
          {datos.porDia}
        </div>
      </div>

      {/* Fase B */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: frame < CAMBIO ? 0 : Math.min(1, entradaB * 1.5),
          translate: `0px ${(1 - entradaB) * 70}px`,
        }}
      >
        <div style={{ fontFamily: fuenteTitulos, fontWeight: 700, fontSize: 84, color: colores.blanco, marginBottom: 24 }}>
          {datos.enDias.replace("{dias}", String(dias))}
        </div>
        <NumeroGrande valor={valorB} tamano={200} />
      </div>

      {/* Barras: lo acumulado día a día */}
      {frame >= CAMBIO &&
        [...Array(dias).keys()].map((i) => {
          const crecer = interpolate(frame, [BARRAS_DESDE + i * 2, BARRAS_DESDE + i * 2 + 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(1.6)),
          });
          const alto = ((i + 1) / dias) * zonaBarras.alto * crecer;
          const ultima = i === dias - 1;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: zonaBarras.izquierda + i * (anchoBarra + separacion),
                width: anchoBarra,
                top: zonaBarras.base - alto,
                height: Math.max(0, alto),
                borderRadius: "8px 8px 3px 3px",
                background: ultima
                  ? `linear-gradient(180deg, #9CF08F 0%, ${colores.verde} 100%)`
                  : `linear-gradient(180deg, ${colores.verde} 0%, #2E8F2A 100%)`,
                boxShadow: ultima ? `0 0 40px ${colores.verde}` : undefined,
                opacity: ultima ? 1 : 0.55 + 0.45 * (i / dias),
              }}
            />
          );
        })}
      {frame >= CAMBIO && (
        <div
          style={{
            position: "absolute",
            left: zonaBarras.izquierda - 20,
            width: zonaBarras.ancho + 40,
            top: zonaBarras.base + 6,
            height: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.25)",
            opacity: entradaB,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
