import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Fondo } from "../../componentes/Fondo";
import { Efecto, ProveedorSonido } from "../../componentes/Sonido";
import { Titular, ZonaTitular } from "../../componentes/Titular";
import { colores, fuenteTitulos } from "../../marca/marca";
import { formatoNumero } from "../../utils/numeros";

// Transiciones entre bloques (iguales al video de Rendimientos).
export const EMPUJE = {
  presentation: slide({ direction: "from-bottom" }),
  timing: linearTiming({
    durationInFrames: 15,
    easing: Easing.inOut(Easing.cubic),
  }),
};
export const FUNDIDO = {
  presentation: fade(),
  timing: linearTiming({ durationInFrames: 20 }),
};

/** Capas comunes de los tutoriales: fondo, música y volumen general de efectos. */
export const BaseTutorial: React.FC<{
  readonly musica: string;
  readonly volumenMusica: number;
  readonly volumenEfectos: number;
  readonly children: React.ReactNode;
}> = ({ musica, volumenMusica, volumenEfectos, children }) => (
  <ProveedorSonido volumenEfectos={volumenEfectos}>
    <AbsoluteFill>
      {volumenMusica > 0 && (
        <Audio
          src={staticFile(`audio/${musica}`)}
          volume={Math.min(1, volumenMusica)}
        />
      )}
      <Fondo />
      {children}
    </AbsoluteFill>
  </ProveedorSonido>
);

/** Gancho: título grande que entra de golpe + una ilustración en el centro. */
export const GanchoBase: React.FC<{
  readonly texto: string;
  readonly children: React.ReactNode;
}> = ({ texto, children }) => (
  <AbsoluteFill>
    <Efecto archivo="impacto" en={0} volumen={0.5} />
    <ZonaTitular arriba={300}>
      <Titular
        texto={texto}
        tamano={112}
        estilo="golpe"
        retrasoPorPalabra={2}
      />
    </ZonaTitular>
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: 640,
        height: 820,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

/** Escena del dato: "En más de" + número que cuenta + texto + grilla de íconos que se encienden. */
export const EscenaDato: React.FC<{
  readonly prefijo: string;
  readonly numero: number;
  readonly sufijo: string;
  readonly iconos: React.ReactNode[];
}> = ({ prefijo, numero, sufijo, iconos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 150 },
  });
  const valor = interpolate(frame, [8, 70], [0, numero], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: fuenteTitulos,
          color: colores.blanco,
          opacity: Math.min(1, entrada * 1.5),
          scale: String(0.9 + 0.1 * entrada),
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 76 }}>{prefijo}</div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 230,
            lineHeight: 1.05,
            color: colores.verde,
            letterSpacing: "-0.04em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatoNumero(valor)}
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 84,
            textAlign: "center",
            lineHeight: 1.05,
            whiteSpace: "pre-line",
          }}
        >
          {sufijo}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 980,
          left: 140,
          right: 140,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 26,
        }}
      >
        {iconos.map((icono, i) => {
          const luz = spring({
            frame: frame - 22 - i * 4,
            fps,
            config: { damping: 12, stiffness: 180 },
          });
          return (
            <div
              key={i}
              style={{
                height: 158,
                borderRadius: 34,
                backgroundColor: `rgba(255,255,255,${0.06 + 0.1 * luz})`,
                border: `2px solid rgba(78,193,72,${0.15 + 0.65 * luz})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.25 + 0.75 * luz,
                scale: String(0.8 + 0.2 * luz),
              }}
            >
              {icono}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
