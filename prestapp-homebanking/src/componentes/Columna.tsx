import React from "react";
import { useCurrentFrame } from "remotion";
import { C, COLUMNA, INTER, POPPINS, sale, tramo } from "../marca";
import type { Paso } from "../tipos";
import { Icono, IconoEscaneo } from "./Iconos";
import { Titulo } from "./Marca";

export const TAM_TITULO = 46;

// Rótulo del capítulo: mayúsculas en verde con letras espaciadas, con una rayita delante.
export const Rotulo: React.FC<{ texto: string; v: number }> = ({ texto, v }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16, opacity: v, translate: `${(1 - v) * -24}px 0px` }}>
    <div style={{ width: 36 * v, height: 4, borderRadius: 2, backgroundColor: C.verde }} />
    <div style={{ fontFamily: POPPINS, fontWeight: 600, fontSize: 28, letterSpacing: "0.24em", color: C.verde, whiteSpace: "nowrap" }}>{texto}</div>
  </div>
);

// Chip chico con borde: aclaraciones como "Los usuarios solo ven su punto de venta".
export const ChipBorde: React.FC<{ texto: string; v: number; icono?: "usuarios" | "ojoTachado" | "edificio" }> = ({ texto, v, icono }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 22px 10px 16px",
      borderRadius: 999,
      border: `2px solid rgba(78,193,72,0.75)`,
      backgroundColor: "rgba(78,193,72,0.10)",
      fontFamily: INTER,
      fontWeight: 600,
      fontSize: 28,
      lineHeight: 1.2,
      color: C.blanco,
      opacity: v,
      translate: `0px ${(1 - v) * 14}px`,
      maxWidth: COLUMNA.ancho,
    }}
  >
    {icono && <Icono nombre={icono} tam={30} color={C.verde} grosor={3} />}
    <span>{texto}</span>
  </div>
);

// Texto con *frase en verde* (para las tarjetitas).
const ConVerde: React.FC<{ texto: string }> = ({ texto }) => (
  <>
    {texto.split(/(\*[^*]+\*)/).map((t, i) =>
      t.startsWith("*") ? (
        <span key={i} style={{ color: C.verde, fontFamily: POPPINS, fontWeight: 700 }}>
          {t.slice(1, -1)}
        </span>
      ) : (
        <span key={i}>{t}</span>
      ),
    )}
  </>
);

// Columna de la izquierda: rótulo del capítulo fijo y los textos de cada paso, que se van reemplazando.
export const Columna: React.FC<{ etiqueta: string; chip?: string; pasos: Paso[]; duracion: number; arriba?: number }> = ({ etiqueta, chip, pasos, duracion, arriba = 262 }) => {
  const f = useCurrentFrame();
  const fuera = tramo(f, duracion - 14, duracion, sale);
  const rot = tramo(f, 2, 18) * (1 - fuera);
  return (
    <div style={{ position: "absolute", left: COLUMNA.x, top: arriba, width: COLUMNA.ancho }}>
      <Rotulo texto={etiqueta} v={rot} />
      {chip && (
        <div style={{ marginTop: 22 }}>
          <ChipBorde texto={chip} v={tramo(f, 10, 26) * (1 - fuera)} icono="usuarios" />
        </div>
      )}
      <div style={{ position: "relative", marginTop: chip ? 34 : 30 }}>
        {pasos.map((p, i) => {
          const fin = i < pasos.length - 1 ? pasos[i + 1].desde : duracion;
          if (f < p.desde || f > fin) return null;
          const entra = p.desde + (i === 0 ? 10 : 2);
          const s = tramo(f, fin - 12, fin, sale);
          const apoyo = tramo(f, entra + 14, entra + 30);
          const chipPaso = tramo(f, entra + 26, entra + 42);
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: COLUMNA.ancho, opacity: 1 - s, translate: `0px ${-18 * s}px` }}>
              <Titulo lineas={p.titulo} entra={entra} tamano={TAM_TITULO} color={C.blanco} />
              {p.apoyo && (
                <div style={{ marginTop: 24, fontFamily: INTER, fontWeight: 500, fontSize: 30, lineHeight: 1.36, color: C.apoyo, opacity: apoyo, translate: `0px ${(1 - apoyo) * 14}px` }}>
                  {p.apoyo.map((l, k) => (
                    <div key={k}>{l}</div>
                  ))}
                </div>
              )}
              {p.chip && (
                <div style={{ marginTop: 30 }}>
                  <ChipBorde texto={p.chip} v={chipPaso} icono="usuarios" />
                </div>
              )}
              {p.icono === "escaneo" && (
                <div style={{ marginTop: 26, marginLeft: -36 }}>
                  <IconoEscaneo entra={entra + 20} />
                </div>
              )}
              {p.tarjetas && (
                <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
                  {p.tarjetas.items.map((t, k) => {
                    const v = tramo(f, p.tarjetas!.desde + k * 80, p.tarjetas!.desde + k * 80 + 16);
                    return (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          gap: 18,
                          alignItems: "flex-start",
                          padding: "18px 22px",
                          borderRadius: 22,
                          backgroundColor: "rgba(255,255,255,0.07)",
                          border: "1.5px solid rgba(255,255,255,0.16)",
                          opacity: v,
                          translate: `${(1 - v) * -26}px 0px`,
                        }}
                      >
                        <Icono nombre={k === 0 ? "candado" : "lapiz"} tam={40} color={C.verde} grosor={3} style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ fontFamily: INTER, fontWeight: 500, fontSize: 28, lineHeight: 1.32, color: C.blanco }}>
                          <ConVerde texto={t.titulo} />
                          <span>: {t.texto}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
