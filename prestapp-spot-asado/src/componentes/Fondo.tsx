import React from "react";
import { AbsoluteFill, interpolate, useVideoConfig } from "remotion";
import { C, cruce, DURACION as N, K, tiemposCelular as T, tramo, useCuadro } from "../marca";

// Cuánto "avanzó" la cámara hacia la derecha (en pasos de 1 por cada paneo).
// En el cierre vuelve despacio a 0, así el último cuadro es igual al primero (loop limpio).
export const avanceCamara = (f: number) => {
  const paneos =
    tramo(f, T.saleIzquierda1, T.saleIzquierda1 + 48, cruce) +
    tramo(f, T.entra2, T.entra2 + 48, cruce) +
    tramo(f, T.saleIzquierda2, T.saleIzquierda2 + 36, cruce);
  const regreso = tramo(f, 1160, 1329, cruce);
  return paneos * (1 - regreso);
};

// Círculos grandes de Azul suave (8-12%), cada uno a una "profundidad" distinta (parallax leve).
const CIRCULOS = [
  { x: 260, y: 180, r: 420, op: 0.1, prof: 90, fase: 0 },
  { x: 1650, y: 860, r: 560, op: 0.08, prof: 140, fase: 2.1 },
  { x: 1180, y: -120, r: 320, op: 0.12, prof: 60, fase: 4.0 },
  { x: 520, y: 1020, r: 300, op: 0.09, prof: 110, fase: 1.2 },
];

export const Fondo: React.FC = () => {
  const f = useCuadro();
  const { width, height } = useVideoConfig();
  const ciclo = (f / N) * Math.PI * 2; // todo lo que se mueve solo es periódico: el loop cierra perfecto
  const camara = avanceCamara(f);

  // El foco se enciende al empezar, se intensifica en "CUOTAS" y vuelve a su nivel inicial al final.
  const encendido = interpolate(f, [0, 24, N - 15, N - 1], [0.35, 1, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: cruce,
  });
  const cuotas = interpolate(f, [536, 562, 744, 770], [0, 0.45, 0.45, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: cruce,
  });
  const focoX = width * 0.5 + width * 0.16 * Math.sin(ciclo);
  const focoY = height * 0.45 + height * 0.08 * Math.cos(ciclo * 2);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.noche} 0%, ${C.azul} 100%)` }}>
      {/* Foco de luz radial suave que se desplaza lento */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${focoX}px ${focoY}px, ${C.foco} 0px, rgba(58,75,209,0) ${820 + 220 * cuotas}px)`,
          opacity: Math.min(1, 0.75 * encendido + cuotas),
        }}
      />
      {CIRCULOS.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x - c.r + 40 * Math.sin(ciclo + c.fase) - c.prof * camara,
            top: c.y - c.r + 30 * Math.cos(ciclo + c.fase),
            width: c.r * 2,
            height: c.r * 2,
            borderRadius: "50%",
            backgroundColor: C.azulSuave,
            opacity: c.op,
          }}
        />
      ))}
      {/* Grano fílmico muy sutil (~2,5%) */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.025, mixBlendMode: "overlay" }}>
        <filter id="grano">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(f * K) % 113} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grano)" />
      </svg>
    </AbsoluteFill>
  );
};
