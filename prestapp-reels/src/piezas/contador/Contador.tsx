import { measureText } from "@remotion/layout-utils";
import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colores, fuenteTitulos } from "../../marca/marca";
import type { DatosContador } from "./datos";

// Medidas, en "em" (1 em = tamaño de la letra).
const TAM_SIGNO = 0.86;
const SEPARACION_SIGNO = 0.1;
const LETRA_ESPACIADO = -0.02;
const TAM_MAXIMO = 190; // px
const MARGEN = 100; // px a cada lado (más que los 80 px de zona segura)
const GOLPE = 0.07; // cuánto crece el número en el "golpe" final

// Momentos, en cuadros (60 = 1 s).
const ENTRADA = 20;
const DURACION_SALIDA = 24;

const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const duracionContador = (d: DatosContador) =>
  ENTRADA + d.duracionConteo + d.esperaAntesDeSalir + DURACION_SALIDA + 6;

// Curva del conteo: arranca suave, acelera y frena largo al final,
// así las últimas cifras se ven girar y "aterrizar" en el número final.
const arranque = Easing.bezier(0.45, 0, 1, 1);
const valorEn = (f: number, d: DatosContador, escala: number) => {
  const t = interpolate(f, [ENTRADA, ENTRADA + d.duracionConteo], [0, 1], fijo);
  const e = 1 - Math.pow(1 - arranque(t), 5);
  const desde = Math.round(d.desde * escala);
  const hasta = Math.round(d.hasta * escala);
  return desde + (hasta - desde) * e;
};

// Ancho real (en em) de cada cifra, del punto, de la coma y del signo con la tipografía final.
// Sirve para calcular el tamaño y para que, al terminar de contar, el número quede con el espaciado natural.
const REFERENCIA = 100;
const useAnchosReales = () => {
  const [anchos, setAnchos] = useState<Record<string, number> | null>(null);
  const [espera] = useState(() => delayRender("Midiendo las cifras del contador"));
  useEffect(() => {
    document.fonts
      .load(`800 ${REFERENCIA}px ${fuenteTitulos}`)
      .then(() => {
        const medidas: Record<string, number> = {};
        for (const c of "0123456789.,$") {
          medidas[c] = measureText({
            text: c,
            fontFamily: fuenteTitulos,
            fontSize: REFERENCIA,
            fontWeight: "800",
            letterSpacing: `${LETRA_ESPACIADO}em`,
            validateFontIsLoaded: true,
          }).width / REFERENCIA;
        }
        setAnchos(medidas);
        continueRender(espera);
      })
      .catch((err) => cancelRender(err));
  }, [espera]);
  return anchos;
};

// Estrellita propia de 4 puntas para los destellos del final.
const Destello: React.FC<{ tam: number; color: string }> = ({ tam, color }) => (
  <svg width={tam} height={tam} viewBox="0 0 100 100">
    <path
      d="M50 0 C54 36 64 46 100 50 C64 54 54 64 50 100 C46 64 36 54 0 50 C36 46 46 36 50 0Z"
      fill={color}
    />
  </svg>
);

// Rueda de una cifra: una tira 0-9-0 que se desplaza; con estelas si gira rápido.
const Rueda: React.FC<{ posicion: number; velocidad: number; anchoEm: number }> = ({
  posicion,
  velocidad,
  anchoEm,
}) => {
  const estela = interpolate(velocidad, [1, 4], [0, 1], fijo);
  const tira = (desvio: number, opacidad: number, key: string) => (
    <span
      key={key}
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        width: `${anchoEm}em`,
        transform: `translate(-50%, ${-(posicion + desvio)}em)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: opacidad,
      }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n, i) => (
        <span key={i} style={{ height: "1em", lineHeight: 1 }}>
          {n}
        </span>
      ))}
    </span>
  );
  return (
    <>
      {estela > 0 && tira(-0.14, 0.2 * estela, "a")}
      {tira(0, 1 - 0.15 * estela, "b")}
      {estela > 0 && tira(0.14, 0.2 * estela, "c")}
    </>
  );
};

export const Contador: React.FC<DatosContador> = (d) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Se cuenta en la unidad más chica (centavos si hay decimales) para evitar errores de redondeo.
  const escala = 10 ** d.decimales;
  const valor = valorEn(frame, d, escala);
  const velocidad = valor - valorEn(frame - 1, d, escala);
  const fin = ENTRADA + d.duracionConteo;
  const salida = fin + d.esperaAntesDeSalir;

  const anchosReales = useAnchosReales();
  if (!anchosReales) return null;

  const enteros = String(Math.floor(Math.max(d.hasta, d.desde))).length;
  const lugares = enteros + d.decimales; // cantidad de ruedas
  const hastaUnidades = Math.round(d.hasta * escala);
  const cifraFinal = (j: number) => String(Math.floor(hastaUnidades / 10 ** j) % 10);

  // Mientras cuenta, todas las cifras ocupan lo mismo (la más ancha); al final, cada una su ancho natural.
  const anchoDigito = Math.max(...[..."0123456789"].map((c) => anchosReales[c]));
  const separadores =
    Math.floor((enteros - 1) / 3) * anchosReales["."] + (d.decimales > 0 ? anchosReales[","] : 0);
  const anchoSigno = TAM_SIGNO * anchosReales["$"] + SEPARACION_SIGNO;
  let anchoNatural = 0;
  for (let j = 0; j < lugares; j++) anchoNatural += anchosReales[cifraFinal(j)];
  const anchoEm = anchoSigno + separadores + Math.max(lugares * anchoDigito, anchoNatural);

  // Tamaño de letra: el máximo que entra en el ancho, contando el "golpe" final.
  const tam = Math.min(TAM_MAXIMO, (width - 2 * MARGEN) / (anchoEm * (1 + GOLPE)));

  // Cada cifra nueva aparece cuando su rueda empieza a girar por primera vez:
  // el espacio se abre un poquito antes y la cifra entra girando junto con las demás.
  const aparicion = (j: number) => {
    const umbral = 10 ** j - 1;
    if (j <= d.decimales || Math.round(d.desde * escala) > umbral) return { ancho: 1, opacidad: 1 };
    let ancho = 0;
    for (let f = 0; f <= fin; f++) {
      if (valorEn(f, d, escala) > umbral) {
        ancho = spring({ frame: frame - (f - 4), fps, config: { damping: 24, stiffness: 320 } });
        break;
      }
    }
    return { ancho, opacidad: Math.min(1, Math.max(0, valor - umbral)) };
  };

  // Posición de cada rueda (como un cuentakilómetros: las de la izquierda giran
  // solo cuando las de la derecha pasan de 9 a 0).
  const posicionRueda = (j: number) => {
    const base = 10 ** j;
    if (j === 0) return valor % 10;
    const cifra = Math.floor(valor / base) % 10;
    const resto = valor % base;
    return cifra + Math.min(1, Math.max(0, resto - (base - 1)));
  };

  // Entrada, golpe al terminar y salida.
  const entrada = spring({ frame, fps, config: { damping: 13, stiffness: 150 } });
  const golpe = interpolate(frame, [fin - 2, fin + 5, fin + 28], [0, 1, 0], {
    ...fijo,
    easing: Easing.inOut(Easing.quad),
  });
  const brillo = interpolate(frame, [fin - 4, fin + 8, fin + 60], [0, 1, 0], fijo);
  const sale = interpolate(frame, [salida, salida + DURACION_SALIDA - 4], [0, 1], {
    ...fijo,
    easing: Easing.in(Easing.cubic),
  });
  const escalaTotal = (0.7 + 0.3 * entrada) * (1 + GOLPE * golpe) * (1 - 0.1 * sale);

  const filtros = d.sombra
    ? [
        "drop-shadow(0px 6px 18px rgba(10,10,58,0.45))",
        brillo > 0 ? `drop-shadow(0px 0px ${24 + 30 * brillo}px rgba(78,193,72,${0.7 * brillo}))` : "",
      ].join(" ")
    : undefined;

  // Al terminar de contar, cada cifra pasa de un ancho fijo a su ancho natural.
  const asentado = interpolate(frame, [fin - 2, fin + 14], [0, 1], {
    ...fijo,
    easing: Easing.inOut(Easing.cubic),
  });
  const anchoCelda = (j: number) =>
    tam * (anchoDigito + (anchosReales[cifraFinal(j)] - anchoDigito) * asentado);

  // Cifras de izquierda a derecha, con puntos de miles y coma de decimales.
  const piezas: React.ReactNode[] = [];
  for (let j = lugares - 1; j >= 0; j--) {
    const { ancho: a, opacidad } = aparicion(j);
    const giro = posicionRueda(j);
    const girando = Math.abs(giro - Math.round(giro)) > 0.01;
    const mascara = girando
      ? "linear-gradient(to bottom, transparent 2%, #000 24%, #000 76%, transparent 98%)"
      : undefined;
    piezas.push(
      <span
        key={`d${j}`}
        style={{
          position: "relative",
          display: "inline-block",
          width: a * anchoCelda(j),
          height: "1em",
          overflow: "hidden",
          opacity: opacidad,
          maskImage: mascara,
          WebkitMaskImage: mascara,
        }}
      >
        <Rueda posicion={giro} velocidad={velocidad / 10 ** j} anchoEm={anchoDigito} />
      </span>,
    );
    const k = j - d.decimales; // lugar entero (0 = unidades)
    const separador = k > 0 && k % 3 === 0 ? "." : j === d.decimales && j > 0 ? "," : null;
    if (separador) {
      piezas.push(
        <span
          key={`s${j}`}
          style={{
            display: "inline-block",
            width: a * tam * anchosReales[separador],
            overflow: "hidden",
            textAlign: "center",
            opacity: opacidad,
          }}
        >
          {separador}
        </span>,
      );
    }
  }

  // Destellos que salen alrededor del número cuando termina de contar.
  const anchoNumero = anchoEm * tam;
  const destellos = Array.from({ length: 10 }, (_, i) => {
    const inicio = fin + (i % 3) * 3;
    const p = interpolate(frame, [inicio, inicio + 38], [0, 1], fijo);
    if (p <= 0 || p >= 1) return null;
    const angulo = (i / 10) * Math.PI * 2 + random(`angulo-${i}`) * 0.4;
    const radioX = anchoNumero / 2 + 10 + Easing.out(Easing.cubic)(p) * (60 + 70 * random(`dist-${i}`));
    const radioY = tam * 0.45 + Easing.out(Easing.cubic)(p) * (40 + 40 * random(`dist-${i}`));
    const tamDestello = 34 + 24 * random(`tam-${i}`);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: width / 2 + Math.cos(angulo) * radioX - tamDestello / 2,
          top: height / 2 + Math.sin(angulo) * radioY - tamDestello / 2,
          transform: `scale(${Math.sin(p * Math.PI)}) rotate(${p * 90}deg)`,
        }}
      >
        <Destello tam={tamDestello} color={i % 2 === 0 ? colores.verde : colores.blanco} />
      </div>
    );
  });

  return (
    <AbsoluteFill
      style={{ backgroundColor: d.fondo === "transparente" ? undefined : d.fondo }}
    >
      {destellos}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: fuenteTitulos,
            fontWeight: 800,
            fontSize: tam,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: d.colorNumeros,
            filter: filtros,
            opacity: Math.min(1, entrada * 1.5) * (1 - sale),
            transform: `translateY(${(1 - entrada) * 30 - sale * 20}px) scale(${escalaTotal})`,
          }}
        >
          <span
            style={{
              color: d.colorSigno,
              fontSize: `${TAM_SIGNO}em`,
              marginRight: `${SEPARACION_SIGNO}em`,
            }}
          >
            {d.signo}
          </span>
          {piezas}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
