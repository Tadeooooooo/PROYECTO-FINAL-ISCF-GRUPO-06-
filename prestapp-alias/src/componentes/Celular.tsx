import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BOTON_ACTIVO, PASOS, SCROLL, TIPEO, type Paso } from "../guion";
import { C, cruce, EJE_X, POPPINS, tramo } from "../marca";

// Celular simple y moderno: marco oscuro redondeado, sin marca, con sombra suave.
export const ALTO_CEL = 1060;
const BISEL = 14;
const ALTO_PANT = ALTO_CEL - BISEL * 2;
const ANCHO_CAP = 1206; // ancho de las capturas
const ALTO_CAP = 2464;
const ANCHO_PANT = (ALTO_PANT * ANCHO_CAP) / ALTO_CAP;
const ANCHO_CEL = ANCHO_PANT + BISEL * 2;
const ESC = ANCHO_PANT / ANCHO_CAP; // de píxeles de captura a píxeles del video
export const BASE = { izquierda: EJE_X - ANCHO_CEL / 2, arriba: 720 };

// ----- Cámara: zoom suave hacia la zona del toque -----
type Camara = { z: number; dx: number; dy: number };
const REPOSO: Camara = { z: 1, dx: 0, dy: 0 };
const enfoque = (z: number, foco: [number, number], destino: [number, number]): Camara => ({
  z,
  dx: destino[0] - BASE.izquierda - z * (BISEL + foco[0] * ESC),
  dy: destino[1] - BASE.arriba - z * (BISEL + foco[1] * ESC),
});
const mezcla = (a: Camara, b: Camara, p: number): Camara => ({
  z: a.z + (b.z - a.z) * p,
  dx: a.dx + (b.dx - a.dx) * p,
  dy: a.dy + (b.dy - a.dy) * p,
});
const ZOOM = 26; // cuadros que tarda cada movimiento de cámara
export const camaraEn = (f: number, paso: Paso): Camara => {
  let cam = REPOSO;
  for (const z of paso.zoom) cam = mezcla(cam, enfoque(z.z, z.foco, z.destino), tramo(f, z.desde, z.desde + ZOOM, cruce));
  // Antes de que entre la pantalla siguiente, vuelve a la vista completa.
  return mezcla(cam, REPOSO, tramo(f, paso.hasta - 18, paso.hasta, cruce));
};

// ----- Toque: círculo blanco con borde azul que hace "ripple" -----
const Toque: React.FC<{ x: number; y: number; en: number }> = ({ x, y, en }) => {
  const f = useCurrentFrame();
  if (f < en - 8 || f > en + 30) return null;
  const aparece = tramo(f, en - 8, en);
  const presiona = interpolate(f, [en, en + 4, en + 10], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const se_va = tramo(f, en + 14, en + 26);
  const onda = tramo(f, en, en + 24);
  const r = 62; // radio en píxeles de captura
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          border: `9px solid ${C.azul}`,
          scale: String(1 + 1.6 * onda),
          opacity: 0.8 * (1 - onda) * aparece,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.88)",
          border: `12px solid ${C.azul}`,
          boxShadow: "0 8px 24px rgba(18,24,69,0.35)",
          scale: String((0.6 + 0.4 * aparece) * presiona),
          opacity: aparece * (1 - se_va),
        }}
      />
    </>
  );
};

const Captura: React.FC<{ archivo: string; style?: React.CSSProperties }> = ({ archivo, style }) => (
  <Img src={staticFile(`capturas/${archivo}`)} style={{ position: "absolute", left: 0, top: 0, width: ANCHO_CAP, ...style }} />
);

// Paso 3: el contenido debajo del encabezado se desliza hacia arriba (scroll simulado).
const ALTO_ENCABEZADO = 188;
const PantallaMiCuenta: React.FC<{ f: number; archivo: string }> = ({ f, archivo }) => {
  const corrimiento = SCROLL.inicio * (1 - tramo(f, SCROLL.desde, SCROLL.hasta, cruce));
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: ALTO_ENCABEZADO, width: ANCHO_CAP, height: ALTO_CAP, overflow: "hidden" }}>
        {/* Tarjeta vacía que se ve arriba mientras la pantalla todavía no subió */}
        <Img src={staticFile("capturas/paso3-relleno.png")} style={{ position: "absolute", left: 0, top: 0, width: ANCHO_CAP, height: corrimiento + 4 }} />
        <Captura archivo={archivo} style={{ top: corrimiento - ALTO_ENCABEZADO, clipPath: `inset(${ALTO_ENCABEZADO}px 0 0 0)` }} />
      </div>
      <Captura archivo={archivo} style={{ clipPath: `inset(0 0 ${ALTO_CAP - ALTO_ENCABEZADO}px 0)` }} />
    </>
  );
};

// Paso 4: tipeo letra por letra con cursor y, al terminar, botón Guardar activo (simulación del estado activo).
const PantallaAlias: React.FC<{ f: number; archivo: string }> = ({ f, archivo }) => {
  const letras = Math.max(0, Math.min(TIPEO.texto.length, Math.floor((f - TIPEO.desde) / TIPEO.porLetra) + 1));
  const terminado = TIPEO.desde + TIPEO.texto.length * TIPEO.porLetra;
  const cursor = f < TIPEO.desde - 4 ? 0 : f < terminado ? 1 : Math.floor((f - terminado) / 12) % 2 === 0 ? 1 : 0;
  const activo = tramo(f, BOTON_ACTIVO, BOTON_ACTIVO + 6);
  return (
    <>
      <Captura archivo={archivo} />
      <div
        style={{
          position: "absolute",
          left: 147,
          top: 600,
          height: 56,
          display: "flex",
          alignItems: "center",
          fontFamily: POPPINS,
          fontWeight: 400,
          fontSize: 46,
          letterSpacing: "0.02em",
          color: "#5B5B66",
          whiteSpace: "pre",
        }}
      >
        {TIPEO.texto.slice(0, letras)}
        <span style={{ display: "inline-block", width: 4, height: 50, marginLeft: 4, backgroundColor: C.azul, opacity: cursor }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 106,
          top: 2198,
          width: 1099 - 106,
          height: 2309 - 2198,
          borderRadius: 56,
          backgroundColor: C.azul,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: POPPINS,
          fontWeight: 600,
          fontSize: 46,
          letterSpacing: "0.06em",
          color: C.blanco,
          opacity: activo,
        }}
      >
        GUARDAR
      </div>
    </>
  );
};

const Pantalla: React.FC<{ paso: Paso; f: number }> = ({ paso, f }) => {
  if (paso.numero === 3) return <PantallaMiCuenta f={f} archivo={paso.captura} />;
  if (paso.numero === 4) return <PantallaAlias f={f} archivo={paso.captura} />;
  return <Captura archivo={paso.captura} />;
};

export const Celular: React.FC = () => {
  const f = useCurrentFrame();
  let indice = 0;
  PASOS.forEach((p, i) => {
    if (f >= p.desde) indice = i;
  });
  const paso = PASOS[indice];
  const anterior = PASOS[indice - 1];
  const cam = camaraEn(f, paso);
  // Entrada de la pantalla nueva dentro del teléfono (desliza desde la derecha).
  const cambio = anterior ? tramo(f, paso.desde, paso.desde + 16, cruce) : 1;

  return (
    <div
      style={{
        position: "absolute",
        left: BASE.izquierda,
        top: BASE.arriba,
        width: ANCHO_CEL,
        height: ALTO_CEL,
        borderRadius: 66,
        backgroundColor: "#0B0E2A",
        boxShadow: "0 0 0 2px #3A3F72, 0 50px 110px rgba(4,6,30,0.55)",
        transformOrigin: "0 0",
        transform: `translate(${cam.dx}px, ${cam.dy}px) scale(${cam.z})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: BISEL,
          top: BISEL,
          width: ANCHO_PANT,
          height: ALTO_PANT,
          borderRadius: 66 - BISEL,
          overflow: "hidden",
          backgroundColor: "#F4F4F4",
        }}
      >
        <div style={{ position: "absolute", width: ANCHO_CAP, height: ALTO_CAP, transformOrigin: "0 0", scale: String(ESC) }}>
          {anterior && cambio < 1 && (
            <div style={{ position: "absolute", inset: 0, translate: `${-0.3 * ANCHO_CAP * cambio}px 0px`, filter: `brightness(${1 - 0.3 * cambio})` }}>
              <Pantalla paso={anterior} f={paso.desde} />
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, translate: `${(1 - cambio) * ANCHO_CAP}px 0px` }}>
            <Pantalla paso={paso} f={f} />
            <Toque {...paso.toque} />
          </div>
        </div>
        {/* Isla superior */}
        <div style={{ position: "absolute", top: 12, left: "50%", width: 120, height: 30, marginLeft: -60, borderRadius: 15, backgroundColor: "#07081A" }} />
      </div>
    </div>
  );
};
