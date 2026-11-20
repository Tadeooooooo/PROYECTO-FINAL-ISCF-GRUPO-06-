import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { C, INTER, POPPINS, sale, tramo } from "../marca";

// Logo "Prestapp · TU BILLETERA + cuotas" a color, en pastilla blanca con sombra suave.
const ARCHIVO = { ancho: 3508, alto: 2481 };
const CONTENIDO = { x: 402, y: 784, ancho: 2705, alto: 913 };
export const LogoPastilla: React.FC<{ readonly ancho: number; readonly style?: React.CSSProperties }> = ({ ancho, style }) => {
  const k = ancho / CONTENIDO.ancho;
  const alto = CONTENIDO.alto * k;
  return (
    <div
      style={{
        display: "inline-block",
        backgroundColor: C.blanco,
        padding: `${alto * 0.3}px ${alto * 0.6}px`,
        borderRadius: 999,
        boxShadow: "0 14px 40px rgba(4,6,30,0.35)",
        ...style,
      }}
    >
      <div style={{ width: ancho, height: alto, overflow: "hidden", position: "relative" }}>
        <Img
          src={staticFile("marca/dale-cuotas.png")}
          style={{ position: "absolute", width: ARCHIVO.ancho * k, height: ARCHIVO.alto * k, left: -CONTENIDO.x * k, top: -CONTENIDO.y * k, maxWidth: "none" }}
        />
      </div>
    </div>
  );
};

// Chip de categoría: mayúsculas en verde con letras espaciadas (como "FUNCIONES DE LA APP" en los posteos).
export const Chip: React.FC<{ readonly texto: string; readonly style?: React.CSSProperties }> = ({ texto, style }) => (
  <div
    style={{
      display: "inline-block",
      fontFamily: POPPINS,
      fontWeight: 600,
      fontSize: 32,
      letterSpacing: "0.28em",
      marginLeft: "0.28em",
      color: C.verde,
      ...style,
    }}
  >
    {texto}
  </div>
);

// Separa cada palabra en: signos de apertura, núcleo y signos de cierre; marca en verde lo que va entre *asteriscos*.
type Palabra = { antes: string; nucleo: string; despues: string; verde: boolean };
const partir = (linea: string, estado: { verde: boolean }): Palabra[] =>
  linea.split(" ").map((w) => {
    const m = w.match(/^([¡¿"(]*)(\*?)(.*?)(\*?)([!?.,:;")]*)$/) ?? ["", "", "", w, "", ""];
    const [, antes, abre, nucleo, cierra, despues] = m;
    if (abre) estado.verde = true;
    const verde = estado.verde;
    if (cierra) estado.verde = false;
    return { antes, nucleo, despues, verde };
  });

// Título con reveal en máscara palabra por palabra. "*palabra*" = verde (una sola por título).
export const Titulo: React.FC<{
  readonly lineas: string[];
  readonly entra: number;
  readonly sale?: number;
  readonly tamano: number;
  readonly color?: string;
  readonly fuente?: "titulo" | "apoyo";
  readonly acento?: string;
  readonly style?: React.CSSProperties;
}> = ({ lineas, entra, sale: salida = 99999, tamano, color = C.tinta, fuente = "titulo", acento = C.verde, style }) => {
  const f = useCurrentFrame();
  const s = tramo(f, salida, salida + 10, sale);
  const estado = { verde: false };
  let k = 0;
  return (
    <div
      style={{
        fontFamily: fuente === "titulo" ? POPPINS : INTER,
        fontWeight: fuente === "titulo" ? 700 : 500,
        fontSize: tamano,
        lineHeight: fuente === "titulo" ? 1.12 : 1.3,
        letterSpacing: fuente === "titulo" ? "-0.01em" : "0",
        color,
        textAlign: "center",
        opacity: 1 - s,
        translate: `0px ${-20 * s}px`,
        ...style,
      }}
    >
      {lineas.map((linea, i) => {
        const palabras = partir(linea, estado);
        return (
          <div key={i} style={{ whiteSpace: "nowrap" }}>
            {palabras.map((p, j) => {
              const inicio = entra + k++ * 2;
              const v = tramo(f, inicio, inicio + 14);
              return (
                <span key={j} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.12em", marginBottom: "-0.12em", marginRight: j < palabras.length - 1 ? "0.25em" : 0 }}>
                  <span style={{ display: "inline-block", translate: `0px ${(1 - v) * 105}%`, filter: v < 0.98 ? `blur(${(1 - v) * 4}px)` : undefined }}>
                    {p.antes}
                    <span style={{ color: p.verde ? acento : undefined }}>{p.nucleo}</span>
                    {p.despues}
                  </span>
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
