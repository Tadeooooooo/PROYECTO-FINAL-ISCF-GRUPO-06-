import React from "react";
import { spring } from "remotion";
import { useCuadro } from "../tiempo";
import { Columna } from "../componentes/Columna";
import { Icono } from "../componentes/Iconos";
import { C, cruce, FPS, INTER, POPPINS, RESORTE, sale, tramo } from "../marca";
import type { Paso } from "../tipos";

// CAP. 2 · TIPOS DE CUENTA: escena sin capturas, con un esquema que se arma (tarjetas, íconos de línea y conectores).
// Arriba la cuenta recaudadora (la madre) y debajo las administrativas (3 de ejemplo: pueden ser las que el club necesite).
export const DURACION_TIPOS = 1140;

const T = {
  recaudadora: 14,
  etiquetaRec: 40,
  conectores: 44,
  tarjetas: [66, 78, 90],
  etiquetas: [112, 122, 132],
  nota: 150,
  separadores: 240,
  brillo: [262, 292, 322, 352],
  chipsRec: 415,
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
const REC = { x: CX - 380, y: 180, ancho: 760, alto: 180 };
const Y_CHIPS_REC = 378; // chips de la recaudadora, a los costados del tronco
const Y_RAMA = 450; // línea horizontal que reparte a las administrativas
const ANCHO_T = 380;
const XS = [636, 1056, 1476];
const ARRIBA_T = 476;
const ALTO_T = 280;
const Y_NOTA = 940;

const Verde: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: C.verde }}>{children}</span>;

const Pop: React.FC<{ en: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ en, children, style }) => {
  const f = useCuadro();
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

const brilloDe = (f: number, en: number) => tramo(f, en, en + 12) * (1 - tramo(f, en + 40, en + 60));
const bordeBrillo = (b: number): React.CSSProperties => ({
  borderColor: `rgba(78,193,72,${0.18 + 0.8 * b})`,
  boxShadow: `0 24px 60px rgba(4,6,30,0.25), 0 0 ${36 * b}px rgba(78,193,72,${0.45 * b})`,
});

const EtiquetaCVU: React.FC<{ v: number; style?: React.CSSProperties }> = ({ v, style }) => (
  <div
    style={{
      display: "inline-block",
      padding: "7px 14px",
      borderRadius: 999,
      backgroundColor: C.blanco,
      color: C.tinta,
      fontFamily: INTER,
      fontWeight: 600,
      fontSize: 28,
      whiteSpace: "nowrap",
      opacity: v,
      translate: `0px ${(1 - v) * 12}px`,
      ...style,
    }}
  >
    CVU y alias propios
  </div>
);

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
  const f = useCuadro();
  const fuera = tramo(f, T.saleEsquema, T.saleEsquema + 18, sale);
  if (fuera >= 1) return null;
  const con = tramo(f, T.conectores, T.conectores + 26, cruce);
  const sep = tramo(f, T.separadores, T.separadores + 24, cruce);
  const eventos = tramo(f, T.eventos, T.eventos + 14) * (1 - tramo(f, T.saleEsquema - 10, T.saleEsquema));
  const pulso = eventos * (0.65 + 0.35 * Math.sin(((f - T.eventos) / 22) * Math.PI));
  const ramitas = tramo(f, T.chipsRec - 6, T.chipsRec + 8);
  const nota = tramo(f, T.nota, T.nota + 18);
  const bRec = brilloDe(f, T.brillo[0]);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: 1 - fuera, translate: `0px ${-30 * fuera}px` }}>
      {/* conectores que se dibujan: de la recaudadora a cada administrativa */}
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }} fill="none" strokeLinecap="round">
        <path
          d={`M${CX} ${REC.y + REC.alto}V${Y_RAMA} M${XS[0] + ANCHO_T / 2} ${ARRIBA_T}V${Y_RAMA}H${XS[2] + ANCHO_T / 2}V${ARRIBA_T} M${CX} ${Y_RAMA}V${ARRIBA_T}`}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={3}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - con}
        />
        {/* ramitas del tronco a los chips de la recaudadora */}
        {ramitas > 0.01 && <path d={`M${CX - 24 * ramitas} ${Y_CHIPS_REC + 23}H${CX + 24 * ramitas}`} stroke="rgba(255,255,255,0.45)" strokeWidth={3} />}
        {/* separadores: cada cuenta ve solo lo suyo */}
        {sep > 0.01 &&
          [XS[1] - 20, XS[2] - 20].map((x) => <path key={x} d={`M${x} ${ARRIBA_T - 6}V${ARRIBA_T - 6 + (ALTO_T + 12) * sep}`} stroke={C.verde} strokeWidth={3} strokeDasharray="10 12" opacity={0.85} />)}
        {/* línea de cada administrativa a sus chips */}
        {XS.map((x, i) => {
          const v = tramo(f, T.chips[i] - 6, T.chips[i] + 8);
          return v > 0.01 ? <path key={i} d={`M${x + ANCHO_T / 2} ${ARRIBA_T + ALTO_T}v${20 * v}`} stroke="rgba(255,255,255,0.45)" strokeWidth={3} /> : null;
        })}
      </svg>

      {/* Cuenta recaudadora (la madre) */}
      <Pop en={T.recaudadora} style={{ left: REC.x, top: REC.y, width: REC.ancho }}>
        <div style={{ ...Caja, ...bordeBrillo(bRec), height: REC.alto, boxSizing: "border-box", padding: "22px 28px", display: "flex", gap: 22 }}>
          <Icono nombre="recaudadora" tam={52} color={C.verde} grosor={2.8} dibujo={tramo(f, T.recaudadora + 6, T.recaudadora + 30)} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: POPPINS, fontWeight: 700, fontSize: 34, lineHeight: 1.12, color: C.blanco }}>
              Cuenta <Verde>recaudadora</Verde>
            </div>
            <div style={{ marginTop: 4, fontFamily: INTER, fontWeight: 500, fontSize: 28, lineHeight: 1.3, color: C.apoyo }}>La cuenta madre, donde llega lo recaudado</div>
            <EtiquetaCVU v={tramo(f, T.etiquetaRec, T.etiquetaRec + 14)} style={{ marginTop: 12 }} />
          </div>
        </div>
      </Pop>

      {/* Puntos de venta y usuarios de la recaudadora, a los costados del tronco */}
      <Pop en={T.chipsRec} style={{ left: 636, top: Y_CHIPS_REC, width: CX - 24 - 636, display: "flex", justifyContent: "flex-end" }}>
        <ChipVerde icono="tienda" texto="Puntos de venta" brillo={pulso} />
      </Pop>
      <Pop en={T.chipsRec + 6} style={{ left: CX + 24, top: Y_CHIPS_REC }}>
        <ChipVerde icono="usuarios" texto="Usuarios" />
      </Pop>

      {/* Cuentas administrativas (3 de ejemplo) */}
      {XS.map((x, i) => {
        const b = brilloDe(f, T.brillo[i + 1]);
        return (
          <Pop key={i} en={T.tarjetas[i]} style={{ left: x, top: ARRIBA_T, width: ANCHO_T }}>
            <div style={{ ...Caja, ...bordeBrillo(b), height: ALTO_T, padding: "22px 26px", boxSizing: "border-box", position: "relative" }}>
              <Icono nombre="administrativa" tam={44} color={C.verde} grosor={2.8} dibujo={tramo(f, T.tarjetas[i] + 6, T.tarjetas[i] + 30)} />
              <div style={{ marginTop: 10, fontFamily: POPPINS, fontWeight: 700, fontSize: 34, lineHeight: 1.12, color: C.blanco }}>
                Cuenta
                <br />
                <Verde>administrativa</Verde>
              </div>
              <div style={{ marginTop: 6, fontFamily: INTER, fontWeight: 500, fontSize: 28, lineHeight: 1.3, color: C.apoyo }}>A cargo de un área</div>
              <EtiquetaCVU v={tramo(f, T.etiquetas[i], T.etiquetas[i] + 14)} style={{ position: "absolute", left: 26, bottom: 22 }} />
            </div>
          </Pop>
        );
      })}

      {/* Puntos de venta y usuarios debajo de cada administrativa */}
      {XS.map((x, i) => (
        <Pop key={i} en={T.chips[i]} style={{ left: x, top: ARRIBA_T + ALTO_T + 20, width: ANCHO_T, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <ChipVerde icono="tienda" texto="Puntos de venta" brillo={pulso} />
          <ChipVerde icono="usuarios" texto="Usuarios" />
        </Pop>
      ))}

      {/* Aclaración: las administrativas pueden ser las que el club necesite */}
      <div
        style={{
          position: "absolute",
          left: 636,
          width: 1220,
          top: Y_NOTA,
          textAlign: "center",
          fontFamily: INTER,
          fontWeight: 500,
          fontSize: 30,
          lineHeight: 1.3,
          color: C.blanco,
          opacity: nota,
          translate: `0px ${(1 - nota) * 14}px`,
        }}
      >
        El club puede tener <Verde>tantas cuentas administrativas como necesite</Verde>.
        <div style={{ color: C.apoyo }}>Estas 3 son solo un ejemplo.</div>
      </div>
    </div>
  );
};

const ROLES = [
  { icono: "etiqueta" as const, titulo: "Vendedor", lineas: ["Ve Cobranzas", "y Movimientos."] },
  { icono: "carpeta" as const, titulo: "Administrativo", lineas: ["Todo lo del vendedor,", "más Transferencias."] },
];

const Roles: React.FC = () => {
  const f = useCuadro();
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
  const f = useCuadro();
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
