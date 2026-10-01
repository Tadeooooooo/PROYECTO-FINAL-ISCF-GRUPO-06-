import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Celular } from "../../componentes/Celular";
import { Titular, ZonaTitular } from "../../componentes/Titular";
import { CELULAR, colores } from "../../marca/marca";

export type Toque = {
  readonly x: number;
  readonly y: number;
  readonly en: number;
};

export type Paso = {
  /** Título del paso (lo que va entre *asteriscos* sale en verde). */
  readonly titulo: string;
  /** Duración del paso en cuadros (60 = 1 s). */
  readonly duracion: number;
  /** Qué muestra la pantalla del celular en el cuadro f del paso. */
  readonly pantalla: (f: number) => React.ReactNode;
  /** Toques en la pantalla (en píxeles de la captura, 736x1600) y cuadro del paso en que ocurren. */
  readonly toques?: Toque[];
  /** Cámara: [cuadro del paso, cuánto sube el celular en px]. Por defecto vuelve a 0. */
  readonly camara?: [number, number][];
  /** "igual" = misma pantalla que el paso anterior (no desliza). */
  readonly entra?: "deslizar" | "igual";
};

export const calcularInicios = (pasos: Paso[]) => {
  const inicios: number[] = [];
  let t = 0;
  for (const p of pasos) {
    inicios.push(t);
    t += p.duracion;
  }
  return inicios;
};

/** Círculo que marca el toque: aparece, se hunde y suelta una onda. */
const MarcaToque: React.FC<Toque & { readonly f: number }> = ({
  x,
  y,
  en,
  f,
}) => {
  const d = f - en;
  if (d < -12 || d > 32) {
    return null;
  }
  const aparece = interpolate(d, [-12, -3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const presion = interpolate(d, [-3, 1, 9], [1, 0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sale = interpolate(d, [16, 30], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const onda = interpolate(d, [0, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const base: React.CSSProperties = {
    position: "absolute",
    left: x - 46,
    top: y - 46,
    width: 92,
    height: 92,
    borderRadius: 46,
  };
  return (
    <>
      {d >= 0 && (
        <div
          style={{
            ...base,
            border: `5px solid rgba(36,34,169,0.55)`,
            opacity: 1 - onda,
            scale: String(1 + 1.7 * onda),
          }}
        />
      )}
      <div
        style={{
          ...base,
          backgroundColor: "rgba(255,255,255,0.6)",
          border: "5px solid rgba(20,18,63,0.5)",
          boxShadow: "0 8px 22px rgba(0,0,0,0.3)",
          opacity: aparece * sale,
          scale: String(presion * (1.25 - 0.25 * aparece)),
        }}
      />
    </>
  );
};

const TRANSICION = 14;

export const RecorridoApp: React.FC<{
  readonly pasos: Paso[];
  readonly entradaCelular?: boolean;
}> = ({ pasos, entradaCelular = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inicios = calcularInicios(pasos);
  const ultimo = pasos.length - 1;
  let i = 0;
  while (i < ultimo && frame >= inicios[i + 1]) i++;
  const f = frame - inicios[i];

  // Cámara: une los puntos de todos los pasos en una sola curva suave.
  const puntos = new Map<number, number>();
  pasos.forEach((p, k) =>
    (p.camara ?? [[12, 0]]).forEach(([c, y]) => puntos.set(inicios[k] + c, y)),
  );
  const claves = [...puntos.keys()].sort((a, b) => a - b);
  const camY =
    claves.length > 1
      ? interpolate(
          frame,
          claves,
          claves.map((c) => puntos.get(c) ?? 0),
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          },
        )
      : (puntos.get(claves[0]) ?? 0);
  const entrada = entradaCelular
    ? spring({
        frame: frame - 4,
        fps,
        config: { damping: 22, stiffness: 90, mass: 1 },
      })
    : 1;

  const capa = (k: number, fk: number, estilo: React.CSSProperties) => (
    <div
      key={k}
      style={{ position: "absolute", inset: 0, overflow: "hidden", ...estilo }}
    >
      {pasos[k].pantalla(fk)}
      {(pasos[k].toques ?? []).map((t) => (
        <MarcaToque key={`${t.en}-${t.x}`} {...t} f={fk} />
      ))}
    </div>
  );
  const desliza = i > 0 && pasos[i].entra !== "igual" && f < TRANSICION;
  const p = desliza ? Easing.inOut(Easing.cubic)(f / TRANSICION) : 1;

  return (
    <AbsoluteFill>
      <Celular
        ancho={CELULAR.ancho}
        style={{
          left: (1080 - CELULAR.ancho) / 2,
          top: CELULAR.arriba,
          translate: `0px ${camY + (1 - entrada) * 1350}px`,
        }}
      >
        {desliza ? (
          <>
            {capa(i - 1, pasos[i - 1].duracion - 1, {
              translate: `${-30 * p}% 0px`,
              filter: `brightness(${1 - 0.25 * p})`,
            })}
            {capa(i, f, {
              translate: `${100 * (1 - p)}% 0px`,
              boxShadow: "-20px 0 40px rgba(0,0,0,0.2)",
            })}
          </>
        ) : (
          capa(i, f, {})
        )}
      </Celular>

      {/* Velo arriba: cuando el celular sube, se esconde debajo del título */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 760,
          background: `linear-gradient(to bottom, ${colores.noche} 0%, ${colores.noche}f2 62%, ${colores.noche}00 100%)`,
          opacity: interpolate(camY, [-160, 0], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {pasos.map((paso, k) =>
        paso.titulo ? (
          <Sequence
            key={k}
            name={`Paso · ${paso.titulo.replace(/[*\n]/g, " ")}`}
            from={inicios[k]}
            durationInFrames={paso.duracion + (k === ultimo ? 30 : 0)}
            layout="none"
          >
            <ZonaTitular>
              <Titular
                texto={paso.titulo}
                desde={6}
                hasta={
                  k < ultimo && pasos[k + 1].titulo !== paso.titulo
                    ? paso.duracion
                    : undefined
                }
                tamano={92}
                retrasoPorPalabra={4}
              />
            </ZonaTitular>
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  );
};
