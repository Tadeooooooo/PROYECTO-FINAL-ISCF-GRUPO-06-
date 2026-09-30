import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { IconoApp } from "../componentes/Iconos";
import { Titular, ZonaTitular } from "../componentes/Titular";
import { Efecto } from "../componentes/Sonido";
import type { DatosVideo } from "../datos/rendimientos";
import { colores, degradeMarca, fuenteTitulos } from "../marca/marca";

// Escena 9 · 24,5–27 s · Cierre de marca con el llamado a la acción.
export const Escena09Cierre: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const icono = spring({ frame: frame - 16, fps, config: { damping: 9, stiffness: 150, mass: 0.8 } });
  const ping = interpolate(frame, [38, 68], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const logo = spring({ frame: frame - 26, fps, config: { damping: 16, stiffness: 140 } });
  const boton = spring({ frame: frame - 66, fps, config: { damping: 10, stiffness: 170, mass: 0.7 } });
  const latido = frame > 90 ? 1 + 0.025 * Math.sin((frame - 90) / 7) : 1;

  return (
    <AbsoluteFill style={{ background: degradeMarca }}>
      {/* Sonido: aparece el ícono, la onda de la burbuja "$" y el botón */}
      <Efecto archivo="pop-grande" en={16} volumen={0.7} />
      <Efecto archivo="ping" en={38} volumen={0.5} />
      <Efecto archivo="boton" en={66} volumen={0.6} />
      <AbsoluteFill
        style={{ background: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 45%)` }}
      />

      {/* Ícono de la app */}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative", scale: String(icono) }}>
          <IconoApp tamano={270} />
          {/* Onda que sale desde la burbuja "$" */}
          <div
            style={{
              position: "absolute",
              left: 183 - 60,
              top: 55 - 60,
              width: 120,
              height: 120,
              borderRadius: 60,
              border: `6px solid ${colores.verde}`,
              opacity: ping > 0 ? 1 - ping : 0,
              scale: String(0.6 + 1.6 * ping),
            }}
          />
        </div>
      </div>

      {/* Logo blanco */}
      <div
        style={{
          position: "absolute",
          top: 650,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: frame < 26 ? 0 : Math.min(1, logo * 1.5),
          translate: `0px ${(1 - logo) * 40}px`,
        }}
      >
        {/* El PNG mide 293 px: se usa a tamaño real para que no se pixele. */}
        <Img src={staticFile("brand/logo-horizontal-blanco.png")} style={{ width: 293 }} />
      </div>

      <ZonaTitular arriba={860}>
        <Titular texto={datos.cierre} desde={34} tamano={100} retrasoPorPalabra={5} />
      </ZonaTitular>

      {/* Botón */}
      <div style={{ position: "absolute", top: 1170, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            padding: "26px 70px",
            borderRadius: 999,
            backgroundColor: colores.verde,
            color: colores.noche,
            fontFamily: fuenteTitulos,
            fontWeight: 800,
            fontSize: 64,
            boxShadow: `0 24px 60px rgba(0,0,0,0.3)`,
            opacity: frame >= 66 ? 1 : 0,
            scale: String(boton * latido),
          }}
        >
          {datos.cta}
        </div>
      </div>
    </AbsoluteFill>
  );
};
