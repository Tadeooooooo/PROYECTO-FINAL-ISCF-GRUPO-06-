import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { IconoApp, IconoDestello, IconoLuna } from "../componentes/Iconos";
import { Titular, ZonaTitular } from "../componentes/Titular";
import { Efecto } from "../componentes/Sonido";
import type { DatosVideo } from "../datos/rendimientos";
import { colores, fuenteTexto, fuenteTitulos } from "../marca/marca";
import { calcularSimulacion, formatoNumero } from "../utils/numeros";

// Escena 5 · 11–14 s · Sin mover un dedo: es de noche y el rendimiento llega solo.
export const LLEGA_NOTIFICACION = 40;

export const Escena05SinHacerNada: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rendimientoDiario } = calcularSimulacion(datos);

  const luna = interpolate(frame, [8, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const notificacion = spring({ frame: frame - LLEGA_NOTIFICACION, fps, config: { damping: 14, stiffness: 140 } });

  return (
    <AbsoluteFill>
      {/* Sonido: llega la notificación */}
      <Efecto archivo="notificacion" en={LLEGA_NOTIFICACION} volumen={0.6} />
      <ZonaTitular>
        <Titular texto={datos.sinHacerNada} desde={6} tamano={96} retrasoPorPalabra={5} />
      </ZonaTitular>

      {/* Luna y estrellas */}
      <div
        style={{
          position: "absolute",
          left: 800,
          top: 575,
          opacity: luna,
          translate: `0px ${Math.sin(frame / 22) * 8 + (1 - luna) * 30}px`,
        }}
      >
        <IconoLuna tamano={150} />
        {[
          { x: -50, y: 10, t: 70, fase: 0 },
          { x: 150, y: 120, t: 44, fase: 2 },
          { x: -10, y: 150, t: 34, fase: 4 },
        ].map((e) => (
          <IconoDestello
            key={e.fase}
            tamano={e.t}
            color="#FFF3C8"
            style={{ position: "absolute", left: e.x, top: e.y, opacity: 0.45 + 0.55 * Math.abs(Math.sin(frame / 14 + e.fase)) }}
          />
        ))}
      </div>

      {/* Notificación */}
      <div
        style={{
          position: "absolute",
          left: 110,
          width: 860,
          top: 760,
          padding: "26px 30px",
          borderRadius: 40,
          backgroundColor: "rgba(255,255,255,0.97)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: frame >= LLEGA_NOTIFICACION ? Math.min(1, notificacion * 2) : 0,
          translate: `0px ${(1 - notificacion) * -260}px`,
        }}
      >
        <IconoApp tamano={120} style={{ boxShadow: "0 0 0 2px #E6E6F0" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontFamily: fuenteTexto, fontWeight: 600, fontSize: 32, color: colores.grisTextoApp }}>
            {datos.notificacionApp}
          </div>
          <div style={{ fontFamily: fuenteTexto, fontWeight: 800, fontSize: 44, color: colores.textoOscuro }}>
            {datos.notificacionTitulo}
          </div>
          <div style={{ fontFamily: fuenteTitulos, fontWeight: 800, fontSize: 56, color: "#2E8F2A", letterSpacing: "-0.02em" }}>
            +$ {formatoNumero(rendimientoDiario, 2)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
