import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colores, fuenteTitulos } from "../../marca/marca";
import type { DatosLink } from "./datos";

// Medidas de la cápsula, en píxeles (lienzo de 1080x320).
const ALTO = 132;
const BORDE = 5;
const MARGEN_CIRCULO = 12; // del círculo azul al borde de afuera
const DIAMETRO = ALTO - 2 * MARGEN_CIRCULO;
const SEPARACION = 26; // entre el círculo y el texto
const TAM_TEXTO = 64;
const AJUSTE_TEXTO = -3; // corrección vertical para que el texto quede centrado a la vista
const CURSOR = { ancho: 6, alto: 72, separacion: 6 };
const MARGEN_DERECHO = 34;
const INTERIOR = ALTO - 2 * BORDE;
// Azul claro para el aro del pulso: se ve tanto sobre fondos claros como oscuros.
const AZUL_CLARO = "#8C88FF";

// Momentos, en cuadros (60 = 1 s).
const APERTURA = 14; // la cápsula se abre desde el círculo
const INICIO_ESCRITURA = 32;
const DURACION_SALIDA = 36;

const suave = Easing.out(Easing.cubic);
const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const finEscritura = (d: DatosLink) =>
  INICIO_ESCRITURA + d.texto.length * d.cuadrosPorLetra;
export const duracionLink = (d: DatosLink) =>
  finEscritura(d) + d.esperaAntesDeSalir + DURACION_SALIDA + 12;

// Ancho del texto escrito hasta cada letra (anchos[n] = ancho de las primeras n letras).
const useAnchos = (texto: string) => {
  const [anchos, setAnchos] = useState<number[] | null>(null);
  const [espera] = useState(() => delayRender("Midiendo el texto del link"));
  useEffect(() => {
    document.fonts
      .load(`700 ${TAM_TEXTO}px ${fuenteTitulos}`)
      .then(() => {
        setAnchos(
          Array.from({ length: texto.length + 1 }, (_, n) =>
            n === 0
              ? 0
              : measureText({
                  text: texto.slice(0, n),
                  fontFamily: fuenteTitulos,
                  fontSize: TAM_TEXTO,
                  fontWeight: "700",
                  validateFontIsLoaded: true,
                }).width,
          ),
        );
        continueRender(espera);
      })
      .catch((err) => cancelRender(err));
  }, [texto, espera]);
  return anchos;
};

// Ícono propio: dos eslabones que se enganchan (union va de 0 = separados a 1 = unidos).
const IconoEnlace: React.FC<{ union: number; tam: number }> = ({
  union,
  tam,
}) => {
  const d = interpolate(union, [0, 1], [24, 12]);
  return (
    <svg
      width={tam}
      height={tam}
      viewBox="0 0 100 100"
      style={{
        overflow: "visible",
        transform: `rotate(${interpolate(union, [0, 1], [-35, 0])}deg)`,
        opacity: Math.min(1, union * 3),
      }}
    >
      <g
        transform="rotate(-45 50 50)"
        fill="none"
        stroke={colores.blanco}
        strokeWidth={9}
      >
        <rect x={50 - d - 24} y={36} width={48} height={28} rx={14} />
        <rect x={50 + d - 24} y={36} width={48} height={28} rx={14} />
      </g>
    </svg>
  );
};

export const LinkPrestapp: React.FC<DatosLink> = (d) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const anchos = useAnchos(d.texto);
  if (!anchos) return null;

  const n = d.texto.length;
  const cpl = d.cuadrosPorLetra;
  const fin = finEscritura(d);
  const salida = fin + d.esperaAntesDeSalir;
  const inicioDestacado =
    d.textoDestacado && d.texto.endsWith(d.textoDestacado)
      ? n - d.textoDestacado.length
      : n;

  // Entrada: el círculo aparece con un rebote y los eslabones se enganchan.
  const pop = spring({ frame, fps, config: { damping: 11, stiffness: 140, mass: 0.7 } });
  const union = spring({ frame: frame - 6, fps, config: { damping: 9, stiffness: 160 } });
  // La cápsula se abre hacia los costados.
  const apertura = spring({ frame: frame - APERTURA, fps, config: { damping: 16, stiffness: 120 } });
  // Salida: la cápsula se cierra sobre el círculo y el círculo se achica.
  const cierre = interpolate(frame, [salida, salida + 22], [0, 1], {
    ...fijo,
    easing: Easing.inOut(Easing.cubic),
  });
  const achique = interpolate(
    frame,
    [salida + 16, salida + DURACION_SALIDA],
    [0, 1],
    { ...fijo, easing: Easing.in(Easing.back(1.6)) },
  );
  const escala = pop * (1 - achique);

  // Ancho del texto ya escrito, con transición suave entre letra y letra.
  const t = (frame - INICIO_ESCRITURA) / cpl;
  let anchoEscrito = 0;
  if (t >= 0) {
    const k = Math.min(n - 1, Math.floor(t));
    anchoEscrito = interpolate(suave(Math.min(1, t - k)), [0, 1], [anchos[k], anchos[k + 1]]);
  }

  const relleno = SEPARACION + CURSOR.separacion + CURSOR.ancho + MARGEN_DERECHO;
  const anchoCapsula = ALTO + (relleno * apertura + anchoEscrito) * (1 - cierre);
  const izquierda = (width - anchoCapsula) / 2;
  const arriba = (height - ALTO) / 2;

  // Cursor: fijo mientras escribe, titila dos veces y se va.
  const tras = frame - fin - 10;
  const cursorVisible =
    tras < 0 ? Math.min(1, apertura) : tras < 96 && Math.floor(tras / 24) % 2 === 1 ? 1 : 0;

  // Pulso: un aro que sale de la cápsula cuando termina de escribir.
  const pulso = interpolate(frame, [fin + 4, fin + 44], [0, 1], fijo);
  const aro = suave(pulso) * 26;

  // Brillo que cruza la cápsula.
  const brillo = interpolate(frame, [fin + 26, fin + 72], [-0.25, 1.25], {
    ...fijo,
    easing: Easing.inOut(Easing.quad),
  });
  const xBrillo = brillo * anchoCapsula;
  const izqCirculo = MARGEN_CIRCULO - BORDE;

  return (
    <AbsoluteFill
      style={{ backgroundColor: d.fondo === "transparente" ? undefined : d.fondo }}
    >
      {pulso > 0 && pulso < 1 && (
        <div
          style={{
            position: "absolute",
            left: izquierda - aro,
            top: arriba - aro,
            width: anchoCapsula + 2 * aro,
            height: ALTO + 2 * aro,
            borderRadius: ALTO / 2 + aro,
            border: `4px solid ${AZUL_CLARO}`,
            opacity: 0.7 * (1 - pulso),
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: izquierda,
          top: arriba,
          width: anchoCapsula,
          height: ALTO,
          borderRadius: ALTO / 2,
          background: `linear-gradient(90deg, ${colores.azulApp}, ${colores.violeta})`,
          boxShadow: d.sombra
            ? "0 16px 36px rgba(10,10,58,0.30), 0 4px 10px rgba(10,10,58,0.18)"
            : undefined,
          transform: `scale(${escala})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: BORDE,
            borderRadius: INTERIOR / 2,
            backgroundColor: colores.blanco,
            overflow: "hidden",
          }}
        >
          {brillo > -0.25 && brillo < 1.25 && (
            <div
              style={{
                position: "absolute",
                top: -20,
                bottom: -20,
                left: xBrillo - 70,
                width: 140,
                background: `linear-gradient(90deg, transparent, rgba(91,47,214,0.12), transparent)`,
                transform: "skewX(-20deg)",
              }}
            />
          )}
          {/* Texto que se escribe letra por letra */}
          <div
            style={{
              position: "absolute",
              left: izqCirculo + DIAMETRO + SEPARACION,
              top: AJUSTE_TEXTO,
              height: INTERIOR,
            }}
          >
            {d.texto.split("").map((letra, i) => {
              const aparece = INICIO_ESCRITURA + i * cpl;
              if (frame < aparece) return null;
              const p = interpolate(frame, [aparece, aparece + 8], [0, 1], {
                ...fijo,
                easing: suave,
              });
              return (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    left: anchos[i],
                    lineHeight: `${INTERIOR}px`,
                    fontFamily: fuenteTitulos,
                    fontWeight: 700,
                    fontSize: TAM_TEXTO,
                    whiteSpace: "pre",
                    color: i >= inicioDestacado ? colores.azulApp : colores.textoOscuro,
                    opacity: p,
                    transform: `translateY(${(1 - p) * 14}px) scale(${0.7 + 0.3 * p})`,
                    transformOrigin: "50% 70%",
                  }}
                >
                  {letra}
                </span>
              );
            })}
            <div
              style={{
                position: "absolute",
                left: anchoEscrito + CURSOR.separacion,
                top: (INTERIOR - CURSOR.alto) / 2 - AJUSTE_TEXTO,
                width: CURSOR.ancho,
                height: CURSOR.alto,
                borderRadius: CURSOR.ancho / 2,
                backgroundColor: colores.azulApp,
                opacity: cursorVisible,
              }}
            />
          </div>
          {/* Círculo con el ícono de enlace */}
          <div
            style={{
              position: "absolute",
              left: izqCirculo,
              top: izqCirculo,
              width: DIAMETRO,
              height: DIAMETRO,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${colores.azulApp}, ${colores.violeta})`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconoEnlace union={union} tam={DIAMETRO * 0.66} />
            {brillo > -0.25 && brillo < 1.25 && (
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  bottom: -20,
                  left: xBrillo - izqCirculo - 50,
                  width: 100,
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                  transform: "skewX(-20deg)",
                }}
              />
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
