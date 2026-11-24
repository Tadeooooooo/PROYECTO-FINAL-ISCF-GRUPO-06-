import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { C, cruce, FPS, MONTSERRAT, NAV, RESORTE, sale, suave, tramo } from "../marca";
import type { Boton, Camara, Pantalla, Resalte, Tarjeta, Tipeo, Toque } from "../tipos";

const W = NAV.ancho;
const H = NAV.alto;
const FONDO_PANTALLA = "#FFFFFF";
const MOVIMIENTO = 26; // cuadros que dura cada movimiento de cámara

// ----- Cámara: zoom suave dentro de la pantalla del navegador -----
type Vista = { s: number; cx: number; cy: number }; // escala y punto de la captura que queda en el centro

const vistaDe = (p: Pantalla, cam: Camara): Vista => {
  const s = (W / p.ancho) * cam.z;
  const anchoVisible = W / s;
  const altoVisible = H / s;
  let cx = cam.foco ? cam.foco[0] : p.ancho / 2;
  let cy = cam.foco ? cam.foco[1] : altoVisible / 2; // sin foco: pegada arriba
  // Nunca se ve afuera de la captura.
  cx = anchoVisible >= p.ancho ? p.ancho / 2 : Math.min(p.ancho - anchoVisible / 2, Math.max(anchoVisible / 2, cx));
  cy = altoVisible >= p.alto ? altoVisible / 2 : Math.min(p.alto - altoVisible / 2, Math.max(altoVisible / 2, cy));
  return { s, cx, cy };
};

const vistaEn = (p: Pantalla, f: number): Vista => {
  let v = vistaDe(p, p.camara[0]);
  for (const cam of p.camara.slice(1)) {
    if (f < cam.en) break;
    const sig = vistaDe(p, cam);
    const t = tramo(f, cam.en, cam.en + MOVIMIENTO, cruce);
    v = {
      s: Math.exp(interpolate(t, [0, 1], [Math.log(v.s), Math.log(sig.s)])),
      cx: interpolate(t, [0, 1], [v.cx, sig.cx]),
      cy: interpolate(t, [0, 1], [v.cy, sig.cy]),
    };
  }
  return v;
};

// ----- Click: círculo blanco con borde azul que se presiona y una onda que se abre (tamaño fijo en pantalla) -----
const MarcaToque: React.FC<{ t: Toque; f: number; s: number }> = ({ t, f, s }) => {
  const { x, y, en } = t;
  if (f < en - 8 || f > en + 30) return null;
  const aparece = tramo(f, en - 8, en);
  const presiona = interpolate(f, [en, en + 4, en + 10], [1, 0.82, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const seVa = tramo(f, en + 14, en + 26);
  const onda = tramo(f, en, en + 24);
  const r = 22 / s;
  const base: React.CSSProperties = { position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%" };
  return (
    <>
      <div style={{ ...base, border: `${3.5 / s}px solid ${C.azul}`, scale: String(1 + 1.6 * onda), opacity: 0.8 * (1 - onda) * aparece }} />
      <div
        style={{
          ...base,
          backgroundColor: "rgba(255,255,255,0.88)",
          border: `${4.5 / s}px solid ${C.azul}`,
          boxShadow: `0 ${3 / s}px ${10 / s}px rgba(18,24,69,0.35)`,
          scale: String((0.6 + 0.4 * aparece) * presiona),
          opacity: aparece * (1 - seVa),
        }}
      />
    </>
  );
};

// ----- Contorno verde que resalta un botón o un campo -----
const ContornoVerde: React.FC<{ r: Resalte; f: number; s: number }> = ({ r, f, s }) => {
  if (f < r.desde || (r.hasta !== undefined && f > r.hasta + 10)) return null;
  const v = tramo(f, r.desde, r.desde + 14);
  const fuera = r.hasta !== undefined ? tramo(f, r.hasta, r.hasta + 10, sale) : 0;
  const [x0, y0, x1, y1] = r.caja;
  const m = 6 / s;
  return (
    <div
      style={{
        position: "absolute",
        left: x0 - m,
        top: y0 - m,
        width: x1 - x0 + 2 * m,
        height: y1 - y0 + 2 * m,
        borderRadius: 10 / s,
        border: `${4 / s}px solid ${C.verde}`,
        boxShadow: `0 0 0 ${5 / s}px rgba(78,193,72,0.2), 0 0 ${18 / s}px rgba(78,193,72,0.35)`,
        opacity: v * (1 - fuera),
        scale: String(1.04 - 0.04 * v),
      }}
    />
  );
};

// ----- Tipeo letra por letra, en Montserrat como la plataforma, con cursor -----
const ASCENSO = 0.968; // métricas de Montserrat (1000 unidades por em)
const ALTO_LINEA = 1.219;
const TextoTipeado: React.FC<{ t: Tipeo; f: number }> = ({ t, f }) => {
  if (f < t.desde - 1) return null;
  const tam = t.tam ?? 17;
  const letras = Math.max(0, Math.min(t.texto.length, Math.floor((f - t.desde) / t.porLetra) + 1));
  const fin = t.desde + t.texto.length * t.porLetra;
  const cursor = f < fin || (f < fin + 30 && Math.floor((f - fin) / 8) % 2 === 0);
  return (
    <>
      {t.tapa && <div style={{ position: "absolute", left: t.tapa[0], top: t.tapa[1], width: t.tapa[2] - t.tapa[0], height: t.tapa[3] - t.tapa[1], backgroundColor: "#FFFFFF" }} />}
      <div
        style={{
          position: "absolute",
          left: t.x,
          top: t.y - ASCENSO * tam,
          height: ALTO_LINEA * tam,
          lineHeight: `${ALTO_LINEA * tam}px`,
          fontFamily: MONTSERRAT,
          fontWeight: t.peso ?? 400,
          fontSize: tam,
          color: t.color ?? "#666666",
          whiteSpace: "pre",
          display: "flex",
          alignItems: "center",
        }}
      >
        {t.texto.startsWith("•") ? (
          // Contraseña: puntos redondos del tamaño de los de un navegador.
          Array.from({ length: letras }).map((_, i) => (
            <span key={i} style={{ display: "inline-block", width: tam * 0.44, height: tam * 0.44, marginRight: tam * 0.2, borderRadius: "50%", backgroundColor: "#555555", translate: `0px ${tam * 0.06}px` }} />
          ))
        ) : (
          <span>{t.texto.slice(0, letras)}</span>
        )}
        <span style={{ display: "inline-block", width: 1.6, height: tam * 1.15, marginLeft: 1, backgroundColor: "#333333", opacity: cursor ? 1 : 0 }} />
      </div>
    </>
  );
};

// ----- Botón que se habilita: de lila a azul -----
const BotonActivo: React.FC<{ b: Boton; f: number }> = ({ b, f }) => {
  const v = tramo(f, b.desde, b.desde + 8);
  if (v <= 0) return null;
  const [x0, y0, x1, y1] = b.caja;
  return (
    <div
      style={{
        position: "absolute",
        left: x0,
        top: y0,
        width: x1 - x0,
        height: y1 - y0,
        borderRadius: 4,
        backgroundColor: C.plataforma,
        color: "#FFFFFF",
        fontFamily: MONTSERRAT,
        fontWeight: 700,
        fontSize: b.tam ?? 15,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: v,
      }}
    >
      {b.texto}
    </div>
  );
};

// ----- Captura chica encima (modal, panel o detalle) -----
const TarjetaEncima: React.FC<{ t: Tarjeta; f: number; p: Pantalla }> = ({ t, f, p }) => {
  if (f < t.desde || (t.hasta !== undefined && f > t.hasta + 12)) return null;
  const e = spring({ frame: f - t.desde, fps: FPS, config: RESORTE });
  const fuera = t.hasta !== undefined ? tramo(f, t.hasta, t.hasta + 12, sale) : 0;
  return (
    <>
      {t.oscurecer ? <div style={{ position: "absolute", left: 0, top: 0, width: p.ancho, height: p.alto, backgroundColor: `rgba(12,16,48,${t.oscurecer * Math.min(1, e) * (1 - fuera)})` }} /> : null}
      <Img
        src={staticFile(`capturas/${t.img}`)}
        style={{
          position: "absolute",
          left: t.x,
          top: t.y,
          width: t.ancho,
          height: t.alto,
          borderRadius: 8,
          boxShadow: "0 24px 60px rgba(10,14,40,0.35), 0 0 0 1px rgba(10,14,40,0.08)",
          opacity: Math.min(1, e * 1.5) * (1 - fuera),
          scale: String(0.9 + 0.1 * e - 0.04 * fuera),
          translate: `0px ${(1 - e) * 24}px`,
        }}
      />
    </>
  );
};

// ----- La captura de fondo (con la opción de una fila que aparece empujando lo de abajo) -----
const Captura: React.FC<{ p: Pantalla; f: number }> = ({ p, f }) => {
  const src = staticFile(`capturas/${p.img}`);
  const img = (top: number): React.CSSProperties => ({ position: "absolute", left: 0, top, width: p.ancho, height: p.alto, maxWidth: "none" });
  if (!p.expandir) return <Img src={src} style={img(0)} />;
  const { y, alto, desde } = p.expandir;
  const t = tramo(f, desde, desde + 20, suave);
  const abajo = y + alto;
  return (
    <>
      <div style={{ position: "absolute", left: 0, top: 0, width: p.ancho, height: y, overflow: "hidden" }}>
        <Img src={src} style={img(0)} />
      </div>
      <div style={{ position: "absolute", left: 0, top: y, width: p.ancho, height: alto, overflow: "hidden", opacity: t, translate: `0px ${(t - 1) * 12}px` }}>
        <Img src={src} style={img(-y)} />
      </div>
      <div style={{ position: "absolute", left: 0, top: y + alto * t, width: p.ancho, height: p.alto - abajo, overflow: "hidden" }}>
        <Img src={src} style={img(-abajo)} />
      </div>
    </>
  );
};

const VistaPantalla: React.FC<{ p: Pantalla; f: number }> = ({ p, f }) => {
  const { s, cx, cy } = vistaEn(p, f);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: p.ancho,
        height: p.alto,
        transformOrigin: "0 0",
        transform: `translate(${W / 2 - cx * s}px, ${H / 2 - cy * s}px) scale(${s})`,
      }}
    >
      <Captura p={p} f={f} />
      {p.botones?.map((b, i) => <BotonActivo key={`b${i}`} b={b} f={f} />)}
      {p.tipeos?.map((t, i) => <TextoTipeado key={`t${i}`} t={t} f={f} />)}
      {p.tarjetas?.map((t, i) => <TarjetaEncima key={`c${i}`} t={t} f={f} p={p} />)}
      {p.resaltes?.map((r, i) => <ContornoVerde key={`r${i}`} r={r} f={f} s={s} />)}
      {p.toques?.map((t, i) => <MarcaToque key={`q${i}`} t={t} f={f} s={s} />)}
    </div>
  );
};

// Las pantallas de un capítulo, con fundido entre una y otra. Puede arrancar y/o terminar en blanco (cambio de capítulo).
export const Pantallas: React.FC<{ pantallas: Pantalla[]; duracion: number; blancoInicio?: boolean; blancoFin?: boolean }> = ({ pantallas, duracion, blancoInicio, blancoFin }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: FONDO_PANTALLA, overflow: "hidden" }}>
      {pantallas.map((p, i) => {
        const sig = pantallas[i + 1];
        if (f < p.desde - 1 || (sig && f > sig.desde + 12)) return null;
        const op = i === 0 ? (blancoInicio ? tramo(f, 0, 12) : 1) : tramo(f, p.desde, p.desde + 12);
        return (
          <AbsoluteFill key={p.img + i} style={{ opacity: op }}>
            <VistaPantalla p={p} f={f} />
          </AbsoluteFill>
        );
      })}
      {blancoFin && <AbsoluteFill style={{ backgroundColor: FONDO_PANTALLA, opacity: tramo(f, duracion - 12, duracion) }} />}
    </AbsoluteFill>
  );
};

// ----- Mockup de navegador simple, sin marcas: barra con tres puntos y una barra de direcciones vacía -----
export const Navegador: React.FC<{ children: React.ReactNode; entra?: number; sale?: number }> = ({ children, entra, sale: salida }) => {
  const f = useCurrentFrame();
  const e = entra === undefined ? 1 : spring({ frame: f - entra, fps: FPS, config: RESORTE });
  const s = salida === undefined ? 0 : tramo(f, salida, salida + 20, cruce);
  if (e <= 0.001 && entra !== undefined && f < entra) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: NAV.x,
        top: NAV.y,
        width: NAV.ancho,
        height: NAV.barra + NAV.alto,
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 40px 90px rgba(4,6,30,0.45), 0 0 0 1px rgba(255,255,255,0.10)",
        opacity: Math.min(1, e * 1.4) * (1 - s),
        translate: `${(1 - e) * 120 + s * 140}px ${(1 - e) * 30}px`,
        scale: String(0.96 + 0.04 * e - 0.03 * s),
      }}
    >
      <div style={{ height: NAV.barra, backgroundColor: "#E7E9F1", display: "flex", alignItems: "center", padding: "0 20px", gap: 9, borderBottom: "1px solid #D9DCE6" }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 13, height: 13, borderRadius: "50%", backgroundColor: "#C3C8D6" }} />
        ))}
        <div style={{ marginLeft: 22, flex: 1, height: 26, borderRadius: 13, backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", paddingLeft: 12 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#9AA0B4" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <rect x={5} y={11} width={14} height={10} rx={2} />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
      </div>
      <div style={{ position: "relative", width: NAV.ancho, height: NAV.alto, overflow: "hidden" }}>{children}</div>
    </div>
  );
};
