import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { Boton, Paso, Pantalla, Pop, Resaltado, Tipeo, Toque, Video } from "../tipos";
import { C, cruce, EJE_X, POPPINS, tramo } from "../marca";

// Celular simple y moderno: marco oscuro redondeado, sin marca, con sombra suave.
export const ALTO_CEL = 1060;
const BISEL = 14;
const ALTO_PANT = ALTO_CEL - BISEL * 2;
const ANCHO_CAP = 1206; // ancho de las capturas
const ARRIBA = 720;

const geometria = (altoCaptura: number) => {
  const anchoPant = (ALTO_PANT * ANCHO_CAP) / altoCaptura;
  const anchoCel = anchoPant + BISEL * 2;
  return { anchoPant, anchoCel, esc: anchoPant / ANCHO_CAP, izquierda: EJE_X - anchoCel / 2, arriba: ARRIBA };
};
type Geometria = ReturnType<typeof geometria>;

// ----- Cámara: zoom suave hacia la zona del toque -----
type Camara = { z: number; dx: number; dy: number };
const REPOSO: Camara = { z: 1, dx: 0, dy: 0 };
const mezcla = (a: Camara, b: Camara, p: number): Camara => ({
  z: a.z + (b.z - a.z) * p,
  dx: a.dx + (b.dx - a.dx) * p,
  dy: a.dy + (b.dy - a.dy) * p,
});
const ZOOM = 26; // cuadros que tarda cada movimiento de cámara
const camaraEn = (f: number, paso: Paso, g: Geometria): Camara => {
  let cam = REPOSO;
  for (const z of paso.zoom) {
    const objetivo =
      z.foco && z.destino
        ? {
            z: z.z,
            dx: z.destino[0] - g.izquierda - z.z * (BISEL + z.foco[0] * g.esc),
            dy: z.destino[1] - g.arriba - z.z * (BISEL + z.foco[1] * g.esc),
          }
        : REPOSO;
    cam = mezcla(cam, objetivo, tramo(f, z.desde, z.desde + ZOOM, cruce));
  }
  // Antes de que entre el paso siguiente, vuelve a la vista completa.
  return mezcla(cam, REPOSO, tramo(f, paso.hasta - 18, paso.hasta, cruce));
};

// ----- Toque: círculo blanco con borde azul que hace "ripple" -----
const MarcaToque: React.FC<Toque> = ({ x, y, en }) => {
  const f = useCurrentFrame();
  if (f < en - 8 || f > en + 30) return null;
  const aparece = tramo(f, en - 8, en);
  const presiona = interpolate(f, [en, en + 4, en + 10], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seVa = tramo(f, en + 14, en + 26);
  const onda = tramo(f, en, en + 24);
  const r = 62; // radio en píxeles de captura
  const base: React.CSSProperties = { position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%" };
  return (
    <>
      <div style={{ ...base, border: `9px solid ${C.azul}`, scale: String(1 + 1.6 * onda), opacity: 0.8 * (1 - onda) * aparece }} />
      <div
        style={{
          ...base,
          backgroundColor: "rgba(255,255,255,0.88)",
          border: `12px solid ${C.azul}`,
          boxShadow: "0 8px 24px rgba(18,24,69,0.35)",
          scale: String((0.6 + 0.4 * aparece) * presiona),
          opacity: aparece * (1 - seVa),
        }}
      />
    </>
  );
};

// ----- Tipeo letra por letra con cursor -----
const TextoTipeado: React.FC<Tipeo> = ({ x, y, texto, desde, porLetra }) => {
  const f = useCurrentFrame();
  const letras = Math.max(0, Math.min(texto.length, Math.floor((f - desde) / porLetra) + 1));
  const terminado = desde + texto.length * porLetra;
  const cursor = f < desde - 4 ? 0 : f < terminado ? 1 : Math.floor((f - terminado) / 12) % 2 === 0 ? 1 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
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
      {f >= desde ? texto.slice(0, letras) : ""}
      <span style={{ display: "inline-block", width: 4, height: 50, marginLeft: 4, backgroundColor: C.azul, opacity: cursor }} />
    </div>
  );
};

// ----- Botón activo (simulación del estado activo sobre el botón gris deshabilitado) -----
const BotonActivo: React.FC<Boton> = ({ caja, texto, desde }) => {
  const f = useCurrentFrame();
  const [x0, y0, x1, y1] = caja;
  return (
    <div
      style={{
        position: "absolute",
        left: x0,
        top: y0,
        width: x1 - x0,
        height: y1 - y0,
        borderRadius: (y1 - y0) / 2,
        backgroundColor: C.azul,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: POPPINS,
        fontWeight: 600,
        fontSize: 46,
        letterSpacing: "0.06em",
        color: C.blanco,
        opacity: tramo(f, desde, desde + 6),
      }}
    >
      {texto}
    </div>
  );
};

// ----- "Pop" de escala sobre una zona de la captura -----
const PopZona: React.FC<Pop & { captura: string }> = ({ caja, en, captura }) => {
  const f = useCurrentFrame();
  if (f < en || f > en + 24) return null;
  const [x0, y0, x1, y1] = caja;
  const escala = interpolate(f, [en, en + 7, en + 18], [1, 1.45, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: cruce });
  return (
    <div
      style={{
        position: "absolute",
        left: x0,
        top: y0,
        width: x1 - x0,
        height: y1 - y0,
        borderRadius: "50%",
        backgroundImage: `url(${staticFile(`capturas/${captura}`)})`,
        backgroundSize: `${ANCHO_CAP}px auto`,
        backgroundPosition: `${-x0}px ${-y0}px`,
        scale: String(escala),
      }}
    />
  );
};

// ----- Contorno verde con etiqueta -----
const ContornoVerde: React.FC<Resaltado> = ({ caja, desde, etiqueta }) => {
  const f = useCurrentFrame();
  const v = tramo(f, desde, desde + 14);
  const e = tramo(f, desde + 8, desde + 22);
  const [x0, y0, x1, y1] = caja;
  const m = 10;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x0 - m,
          top: y0 - m,
          width: x1 - x0 + 2 * m,
          height: y1 - y0 + 2 * m,
          borderRadius: 30,
          border: `9px solid ${C.verde}`,
          boxShadow: "0 0 0 8px rgba(78,193,72,0.18)",
          opacity: v,
          scale: String(1.04 - 0.04 * v),
        }}
      />
      <div style={{ position: "absolute", left: 0, width: ANCHO_CAP, top: y1 + m + 14, display: "flex", justifyContent: "center", opacity: e, translate: `0px ${(1 - e) * 16}px` }}>
        <div style={{ backgroundColor: C.verde, color: C.tinta, fontFamily: POPPINS, fontWeight: 600, fontSize: 50, lineHeight: 1.2, padding: "8px 38px", borderRadius: 999 }}>{etiqueta}</div>
      </div>
    </>
  );
};

// ----- Una pantalla del celular: captura + lo que pasa encima -----
const Captura: React.FC<{ archivo: string; style?: React.CSSProperties }> = ({ archivo, style }) => (
  <Img src={staticFile(`capturas/${archivo}`)} style={{ position: "absolute", left: 0, top: 0, width: ANCHO_CAP, ...style }} />
);

const VistaPantalla: React.FC<{ p: Pantalla; f: number; altoCaptura: number }> = ({ p, f, altoCaptura }) => {
  let fondo: React.ReactNode = <Captura archivo={p.captura} />;
  if (p.scroll) {
    // Scroll simulado: el contenido debajo del encabezado se desliza hacia arriba.
    const s = p.scroll;
    const corrimiento = s.inicio * (1 - tramo(f, s.desde, s.hasta, cruce));
    fondo = (
      <>
        <div style={{ position: "absolute", left: 0, top: s.encabezado, width: ANCHO_CAP, height: altoCaptura, overflow: "hidden" }}>
          {/* Tarjeta vacía que se ve arriba mientras la pantalla todavía no subió */}
          <Img src={staticFile(`capturas/${s.relleno}`)} style={{ position: "absolute", left: 0, top: 0, width: ANCHO_CAP, height: corrimiento + 4 }} />
          <Captura archivo={p.captura} style={{ top: corrimiento - s.encabezado, clipPath: `inset(${s.encabezado}px 0 0 0)` }} />
        </div>
        <Captura archivo={p.captura} style={{ clipPath: `inset(0 0 ${altoCaptura - s.encabezado}px 0)` }} />
      </>
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, translate: `0px ${p.dy ?? 0}px` }}>
      {fondo}
      {p.tipeos?.map((t, i) => <TextoTipeado key={`t${i}`} {...t} />)}
      {p.botones?.map((b, i) => <BotonActivo key={`b${i}`} {...b} />)}
      {p.pops?.map((o, i) => <PopZona key={`p${i}`} {...o} captura={p.captura} />)}
      {p.resaltados?.map((r, i) => <ContornoVerde key={`r${i}`} {...r} />)}
      {p.toques?.map((t, i) => <MarcaToque key={`q${i}`} {...t} />)}
    </div>
  );
};

// Pantalla del paso en el cuadro f: la última que ya entró, con la transición desde la anterior.
const PantallasDelPaso: React.FC<{ paso: Paso; anterior?: Paso; f: number; altoCaptura: number }> = ({ paso, anterior, f, altoCaptura }) => {
  let i = 0;
  paso.pantallas.forEach((p, k) => {
    if (f >= p.desde) i = k;
  });
  const actual = paso.pantallas[i];
  const previa = i > 0 ? paso.pantallas[i - 1] : anterior?.pantallas[anterior.pantallas.length - 1];
  const fFrenado = i > 0 ? actual.desde : paso.desde; // la pantalla que sale queda quieta
  if (!previa) return <VistaPantalla p={actual} f={f} altoCaptura={altoCaptura} />;
  const fundido = i > 0 && actual.entrada === "fundido";
  const p = tramo(f, actual.desde, actual.desde + (fundido ? 8 : 16), cruce);
  if (p >= 1) return <VistaPantalla p={actual} f={f} altoCaptura={altoCaptura} />;
  if (fundido) {
    return (
      <>
        <VistaPantalla p={previa} f={fFrenado} altoCaptura={altoCaptura} />
        <div style={{ position: "absolute", inset: 0, opacity: p }}>
          <VistaPantalla p={actual} f={f} altoCaptura={altoCaptura} />
        </div>
      </>
    );
  }
  return (
    <>
      <div style={{ position: "absolute", inset: 0, translate: `${-0.3 * ANCHO_CAP * p}px 0px`, filter: `brightness(${1 - 0.3 * p})` }}>
        <VistaPantalla p={previa} f={fFrenado} altoCaptura={altoCaptura} />
      </div>
      <div style={{ position: "absolute", inset: 0, translate: `${(1 - p) * ANCHO_CAP}px 0px` }}>
        <VistaPantalla p={actual} f={f} altoCaptura={altoCaptura} />
      </div>
    </>
  );
};

export const Celular: React.FC<{ video: Video }> = ({ video }) => {
  const f = useCurrentFrame();
  const g = geometria(video.altoCaptura);
  let indice = 0;
  video.pasos.forEach((p, i) => {
    if (f >= p.desde) indice = i;
  });
  const paso = video.pasos[indice];
  const cam = camaraEn(f, paso, g);

  return (
    <div
      style={{
        position: "absolute",
        left: g.izquierda,
        top: g.arriba,
        width: g.anchoCel,
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
          width: g.anchoPant,
          height: ALTO_PANT,
          borderRadius: 66 - BISEL,
          overflow: "hidden",
          backgroundColor: "#F4F4F4",
        }}
      >
        <div style={{ position: "absolute", width: ANCHO_CAP, height: video.altoCaptura, transformOrigin: "0 0", scale: String(g.esc) }}>
          <PantallasDelPaso paso={paso} anterior={video.pasos[indice - 1]} f={f} altoCaptura={video.altoCaptura} />
        </div>
        {/* Isla superior */}
        <div style={{ position: "absolute", top: 12, left: "50%", width: 120, height: 30, marginLeft: -60, borderRadius: 15, backgroundColor: "#07081A" }} />
      </div>
    </div>
  );
};
