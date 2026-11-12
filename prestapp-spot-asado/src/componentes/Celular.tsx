import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, cruce, RESORTE, tiemposCelular as T, tramo } from "../marca";

// Mockup de smartphone limpio (CSS): marco fino oscuro, reflejo sutil y las capturas de la app adentro.
const ALTO_CEL = 860;
const BISEL = 12;
const ALTO_PANT = ALTO_CEL - BISEL * 2;
const ANCHO_PANT = (ALTO_PANT * 736) / 1600; // proporción de la captura (736x1600)
const ANCHO_CEL = ANCHO_PANT + BISEL * 2;

export const CENTRO_CEL = { x: 1420, y: 540 };
export const ANCHO_CELULAR = ANCHO_CEL;
const GIRO = -12; // rotateY de reposo: la pantalla mira hacia el texto

// Pantalla que se desliza adentro del teléfono (la nueva entra desde la derecha).
const Pantallas: React.FC<{ actual: string; nueva?: string; p: number }> = ({ actual, nueva, p }) => (
  <>
    <Img
      src={staticFile(`capturas/${actual}.png`)}
      style={{ position: "absolute", width: ANCHO_PANT, height: ALTO_PANT, translate: `${-p * 0.3 * ANCHO_PANT}px 0px`, filter: `brightness(${1 - 0.35 * p})` }}
    />
    {nueva && p > 0 && (
      <Img
        src={staticFile(`capturas/${nueva}.png`)}
        style={{ position: "absolute", width: ANCHO_PANT, height: ALTO_PANT, translate: `${(1 - p) * ANCHO_PANT}px 0px`, boxShadow: "-20px 0 40px rgba(0,0,0,0.25)" }}
      />
    )}
  </>
);

// Recuadro de escaneo verde que se dibuja sobre el QR y termina en un check (escena 3).
const EscaneoQR: React.FC<{ f: number }> = ({ f }) => {
  const { fps } = useVideoConfig();
  const lado = 592;
  const perimetro = 4 * lado;
  const trazo = tramo(f, 356, 392);
  const check = spring({ frame: f - 396, fps, config: RESORTE });
  const marcaCheck = tramo(f, 400, 414);
  if (f < 352) return null;
  return (
    <svg
      width={736}
      height={1600}
      viewBox="0 0 736 1600"
      style={{ position: "absolute", left: 0, top: 0, width: ANCHO_PANT, height: ALTO_PANT }}
    >
      <rect
        x={72}
        y={374}
        width={lado}
        height={lado}
        rx={44}
        fill="none"
        stroke={C.verde}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={perimetro}
        strokeDashoffset={perimetro * (1 - trazo)}
      />
      <g transform={`translate(368 670) scale(${check})`}>
        <circle r={112} fill={C.blanco} />
        <circle r={98} fill={C.verde} />
        <path
          d="M -44 2 L -12 34 L 48 -30"
          fill="none"
          stroke={C.tinta}
          strokeWidth={22}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={160}
          strokeDashoffset={160 * (1 - marcaCheck)}
        />
      </g>
    </svg>
  );
};

export const CelularSpot: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Recorrido horizontal: entra desde la derecha, sale con la cámara hacia la izquierda,
  // vuelve a entrar desde la derecha (escena 5) y vuelve a salir (cierre).
  const entra1 = spring({ frame: f - T.entra1, fps, config: RESORTE });
  const sale1 = tramo(f, T.saleIzquierda1, T.saleIzquierda1 + 48, cruce);
  const entra2 = tramo(f, T.entra2, T.entra2 + 48, cruce);
  const sale2 = tramo(f, T.saleIzquierda2, T.saleIzquierda2 + 36, cruce);
  const fuera = 2200; // centro fuera de cuadro a la derecha
  const salida = -420; // centro fuera de cuadro a la izquierda

  let x: number;
  let giroExtra: number;
  if (f < T.entra2) {
    x = interpolate(entra1, [0, 1], [fuera, CENTRO_CEL.x]) + (salida - CENTRO_CEL.x) * sale1;
    giroExtra = 34 * (1 - entra1) - 10 * sale1;
  } else {
    x = interpolate(entra2, [0, 1], [fuera, CENTRO_CEL.x]) + (salida - CENTRO_CEL.x) * sale2;
    giroExtra = 26 * (1 - entra2) - 10 * sale2;
  }
  if (f < T.entra1 || (f > T.saleIzquierda1 + 48 && f < T.entra2) || f > T.saleIzquierda2 + 36) return null;

  // Flotación lenta.
  const flotaY = 10 * Math.sin((f / 150) * Math.PI * 2);
  const giroY = GIRO + giroExtra + 1.5 * Math.sin((f / 210) * Math.PI * 2);
  const giroX = 2 * Math.sin((f / 170) * Math.PI * 2);

  // Pantallas adentro del teléfono.
  let pantallas: React.ReactNode;
  if (f < T.entra2) {
    const p = tramo(f, T.cambioQR, T.cambioQR + 18, cruce);
    pantallas = <Pantallas actual={p >= 1 ? "qr" : "inicio"} nueva={p >= 1 ? undefined : "qr"} p={p >= 1 ? 0 : p} />;
  } else {
    const p = tramo(f, T.cambioBiometria, T.cambioBiometria + 18, cruce);
    pantallas = <Pantallas actual={p >= 1 ? "biometria" : "servicios"} nueva={p >= 1 ? undefined : "biometria"} p={p >= 1 ? 0 : p} />;
  }

  return (
    <div style={{ position: "absolute", inset: 0, perspective: 1600 }}>
      <div
        style={{
          position: "absolute",
          left: x - ANCHO_CEL / 2,
          top: CENTRO_CEL.y - ALTO_CEL / 2 + flotaY,
          width: ANCHO_CEL,
          height: ALTO_CEL,
          borderRadius: 60,
          backgroundColor: "#0B0E2A",
          boxShadow: "0 0 0 1.5px rgba(255,255,255,0.16), 0 40px 90px rgba(8,10,40,0.55)",
          transform: `rotateY(${giroY}deg) rotateX(${giroX}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: BISEL,
            top: BISEL,
            width: ANCHO_PANT,
            height: ALTO_PANT,
            borderRadius: 60 - BISEL,
            overflow: "hidden",
            backgroundColor: "#F4F4F4",
          }}
        >
          {pantallas}
          {f < T.entra2 && <EscaneoQR f={f} />}
          {/* Isla superior */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              width: ANCHO_PANT * 0.28,
              height: 26,
              marginLeft: -ANCHO_PANT * 0.14,
              borderRadius: 13,
              backgroundColor: "#07081A",
            }}
          />
          {/* Reflejo sutil del vidrio */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 32%, rgba(255,255,255,0) 45%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
