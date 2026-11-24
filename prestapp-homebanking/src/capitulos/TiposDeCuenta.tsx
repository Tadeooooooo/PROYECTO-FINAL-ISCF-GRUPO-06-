import React from "react";
import { spring, useCurrentFrame } from "remotion";
import { Columna } from "../componentes/Columna";
import { Icono } from "../componentes/Iconos";
import { C, cruce, FPS, INTER, POPPINS, RESORTE, sale, tramo } from "../marca";
import type { Paso } from "../tipos";

// CAP. 2 · TIPOS DE CUENTA: escena sin capturas, con un esquema que se arma (tarjetas, íconos de línea y conectores).
export const DURACION_TIPOS = 1140;

const T = {
  entidad: 14,
  conectores: 40,
  tarjetas: [62, 74, 86],
  etiquetas: [112, 122, 132],
  separadores: 240,
  brillo: [262, 292, 322],
  chips: [430, 445, 460],
  eventos: 660,
  saleEsquema: 770,
  roles: [790, 830],
  fin: DURACION_TIPOS,
};

export const pasosTipos: Paso[] = [
  { desde: 0, titulo: ["Cada cuenta tiene", "*CVU y alias", "propios*"] },
  { desde: 220, titulo: ["Cada cuenta ve", "*solo sus", "movimientos*"] },
  {
    desde: 400,
    titulo: ["Puntos de venta", "y *usuarios*"],
    apoyo: ["Cada cuenta puede crear", "puntos de venta y usuarios", "para cobrar. Todo lo que", "cobran entra en esa cuenta,", "sin afectar a las demás."],
  },
  { desde: 640, titulo: ["Ideal para", "*eventos*"], apoyo: ["Distintos puntos de venta", "con QR de distintos montos."] },
  { desde: 780, titulo: ["Cada usuario", "tiene *un rol*"] },
  { desde: 1000, titulo: ["La recaudadora y", "las administrativas", "ven *todas las", "funciones*"], apoyo: ["Los usuarios, según su rol."] },
];

// Geometría del esquema (a la derecha, en el lugar del navegador).
const CX = 1246;
const ANCHO_T = 380;
const XS = [636, 1056, 1476];
const ARRIBA_T = 420;
const ALTO_T = 380;

const Verde: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.verde }}>{children}</span>;

const Pop: React.FC<{ en: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ en, children, style }) => {
  const f = useCurrentFrame();
  const v = spring({ frame: f - en, fps: FPS, config: RESORTE });
  if (f < en) return null;
  return <div style={{ position: "absolute", opacity: Math.min(1, v * 1.5), scale: String(0.9 + 0.1 * v), translate: `0px ${(1 - v) * 26}px`, ...style }}>{children}</div>;
};

const Caja: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.07)",
  border: "1.5px solid rgba(255,255,255,0.18)",
  borderRadius: 26,
  boxShadow: "0 24px 60px rgba(4,6,30,0.25)",
};

const CUENTAS = [
  { icono: "recaudadora" as const, titulo: "recaudadora", sub: ["La cuenta madre,", "donde llega", "lo recaudado"] },
  { icono: "administrativa" as const, titulo: "administrativa", sub: ["A cargo", "de un área"] },
  { icono: "administrativa" as const, titulo: "administrativa", sub: ["A cargo", "de un área"] },
];

const ChipVerde: React.FC<{ icono: "tienda" | "usuarios"; texto: string; brillo?: number }> = ({ icono, texto, brillo = 0 }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "7px 18px 7px 12px",
      borderRadius: 999,
      border: `2px solid rgba(78,193,72,${0.7 + 0.3 * brillo})`,
      backgroundColor: `rgba(78,193,72,${0.12 + 0.22 * brillo})`,
      boxShadow: brillo ? `0 0 ${24 * brillo}px rgba(78,193,72,0.55)` : undefined,
      fontFamily: INTER,
      fontWeight: 600,
      fontSize: 28,
      color: C.blanco,
      whiteSpace: "nowrap",
    }}
  >
    <Icono nombre={icono} tam={30} color={C.verde} grosor={3} />
    {texto}
  </div>
);

const Esquema: React.FC = () => {
  const f = useCurrentFrame();
  const fuera = tramo(f, T.saleEsquema, T.saleEsquema + 18, sale);
  if (fuera >= 1) return null;
  const con = tramo(f, T.conectores, T.conectores + 26, cruce);
  const sep = tramo(f, T.separadores, T.separadores + 24, cruce);
  const eventos = tramo(f, T.eventos, T.eventos + 14) * (1 - tramo(f, T.saleEsquema - 10, T.saleEsquema));
  const pulso = eventos * (0.65 + 0.35 * Math.sin(((f - T.eventos) / 22) * Math.PI));
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - fuera, translate: `0px ${-30 * fuera}px` }}>
      {/* conectores que se dibujan */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }} fill="none" strokeLinecap="round">
        <path
          d={`M${CX} 340V380 M${XS[0] + ANCHO_T / 2} ${ARRIBA_T}V380H${XS[2] + ANCHO_T / 2}V${ARRIBA_T} M${CX} 380V${ARRIBA_T}`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={3}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - con}
        />
        {/* separadores: cada cuenta ve solo lo suyo */}
        {sep > 0.01 && [XS[1] - 20, XS[2] - 20].map((x) => (
          <path key={x} d={`M${x} ${ARRIBA_T - 6}V${ARRIBA_T - 6 + 420 * sep}`} stroke={C.verde} strokeWidth={3} strokeDasharray="10 12" opacity={0.85} />
        ))}
        {/* línea de cada tarjeta a sus chips */}
        {XS.map((x, i) => {
          const v = tramo(f, T.chips[i] - 6, T.chips[i] + 8);
          return v > 0.01 ? <path key={i} d={`M${x + ANCHO_T / 2} ${ARRIBA_T + ALTO_T}v${24 * v}`} stroke="rgba(255,255,255,0.45)" strokeWidth={3} /> : null;
        })}
      </svg>

      {/* Entidad */}
      <Pop en={T.entidad} style={{ left: CX - 250, top: 236, width: 500 }}>
        <div style={{ ...Caja, height: 104, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <Icono nombre="edificio" tam={52} color={C.verde} grosor={2.8} dibujo={tramo(f, T.entidad + 4, T.entidad + 26)} />
          <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 36, color: C.blanco }}>
            Entidad <span style={{ fontFamily: INTER, fontWeight: 500, fontSize: 30, color: C.apoyo }}>(mismo CUIT)</span>
          </div>
        </div>
      </Pop>

      {/* Cuentas */}
      {CUENTAS.map((c, i) => {
        const etiqueta = tramo(f, T.etiquetas[i], T.etiquetas[i] + 14);
        const brillo = tramo(f, T.brillo[i], T.brillo[i] + 12) * (1 - tramo(f, T.brillo[i] + 40, T.brillo[i] + 60));
        return (
          <Pop key={i} en={T.tarjetas[i]} style={{ left: XS[i], top: ARRIBA_T, width: ANCHO_T }}>
            <div
              style={{
                ...Caja,
                height: ALTO_T,
                padding: "26px 26px",
                boxSizing: "border-box",
                position: "relative",
                borderColor: `rgba(78,193,72,${0.18 + 0.8 * brillo})`,
                boxShadow: `0 24px 60px rgba(4,6,30,0.25), 0 0 ${36 * brillo}px rgba(78,193,72,${0.45 * brillo})`,
              }}
            >
              <Icono nombre={c.icono} tam={48} color={C.verde} grosor={2.8} dibujo={tramo(f, T.tarjetas[i] + 6, T.tarjetas[i] + 30)} />
              <div style={{ marginTop: 12, fontFamily: POPPINS, fontWeight: 700, fontSize: 34, lineHeight: 1.12, color: C.blanco }}>
                Cuenta
                <br />
                <Verde>{c.titulo}</Verde>
              </div>
              <div style={{ marginTop: 10, fontFamily: INTER, fontWeight: 500, fontSize: 28, lineHeight: 1.3, color: C.apoyo }}>
                {c.sub.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 26,
                  bottom: 24,
                  padding: "7px 14px",
                  borderRadius: 999,
                  backgroundColor: C.blanco,
                  color: C.tinta,
                  fontFamily: INTER,
                  fontWeight: 600,
                  fontSize: 28,
                  whiteSpace: "nowrap",
                  opacity: etiqueta,
                  translate: `0px ${(1 - etiqueta) * 12}px`,
                }}
              >
                CVU y alias propios
              </div>
            </div>
          </Pop>
        );
      })}

      {/* Puntos de venta y usuarios debajo de cada cuenta */}
      {XS.map((x, i) => (
        <Pop key={i} en={T.chips[i]} style={{ left: x, top: ARRIBA_T + ALTO_T + 28, width: ANCHO_T, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <ChipVerde icono="tienda" texto="Puntos de venta" brillo={pulso} />
          <ChipVerde icono="usuarios" texto="Usuarios" />
        </Pop>
      ))}
    </div>
  );
};

const ROLES = [
  { icono: "etiqueta" as const, titulo: "Vendedor", lineas: ["Ve Cobranzas", "y Movimientos."] },
  { icono: "carpeta" as const, titulo: "Administrativo", lineas: ["Todo lo del vendedor,", "más Transferencias."] },
];

const Roles: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      {ROLES.map((r, i) => (
        <Pop key={i} en={T.roles[i]} style={{ left: 656 + i * 620, top: 330, width: 560 }}>
          <div style={{ ...Caja, height: 360, padding: "34px 36px", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Icono nombre={r.icono} tam={56} color={C.verde} grosor={2.8} dibujo={tramo(f, T.roles[i] + 6, T.roles[i] + 30)} />
              <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 44, color: C.verde }}>{r.titulo}</div>
            </div>
            <div style={{ marginTop: 22, fontFamily: INTER, fontWeight: 500, fontSize: 32, lineHeight: 1.36, color: C.blanco }}>
              {r.lineas.map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
            <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 12, fontFamily: INTER, fontWeight: 500, fontSize: 30, color: C.apoyo }}>
              <Icono nombre="ojoTachado" tam={34} color={C.apoyo} grosor={3} />
              No ve el saldo.
            </div>
          </div>
        </Pop>
      ))}
    </>
  );
};

export const TiposDeCuenta: React.FC = () => {
  const f = useCurrentFrame();
  const fin = 1 - tramo(f, T.fin - 14, T.fin, sale);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, opacity: fin }}>
        <Esquema />
        <Roles />
      </div>
      <Columna etiqueta="TIPOS DE CUENTA" pasos={pasosTipos} duracion={DURACION_TIPOS} />
    </>
  );
};
