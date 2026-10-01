import React from "react";
import { Img, interpolate, spring, staticFile, useVideoConfig } from "remotion";
import {
  IconoAvion,
  IconoCampana,
  IconoCobrar,
  IconoDocumento,
  IconoIngresar,
  IconoPersonas,
  IconoTilde,
  Isotipo,
} from "../../componentes/Iconos";
import { PantallaApp } from "../../componentes/PantallaApp";
import { colores, fuenteTexto, fuenteTitulos } from "../../marca/marca";
import { fechaMenosDias } from "../../utils/numeros";
import {
  IcCaraTriste,
  IcCelular,
  IcCelularCheck,
  IcChevron,
  IcCompartir,
  IcCorazon,
  IcDocumentoLineas,
  IcPersona,
  IcPersonaCheck,
  IcRombo,
  IcTacho,
  IcVolver,
} from "./iconos";

// Piezas de las pantallas de la app, en píxeles de la captura real (736x1600).
const AZUL = colores.azulApp;
export const GRIS_FILA = "#F6F6F6";

export const Texto: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly tamano?: number;
  readonly peso?: number;
  readonly color?: string;
  readonly derecha?: boolean;
  readonly ancho?: number;
  readonly centrado?: boolean;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({
  x,
  y,
  tamano = 22,
  peso = 600,
  color = "#5E5B72",
  derecha,
  ancho,
  centrado,
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      top: y,
      ...(derecha ? { right: 736 - x } : { left: x }),
      width: ancho,
      textAlign: centrado ? "center" : undefined,
      fontFamily: fuenteTexto,
      fontSize: tamano,
      fontWeight: peso,
      color,
      lineHeight: 1.2,
      whiteSpace: ancho ? undefined : "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

export const BarraEstado: React.FC = () => (
  <>
    <Texto x={52} y={26} tamano={26} peso={700} color="#fff">
      9:41
    </Texto>
    <div
      style={{
        position: "absolute",
        right: 48,
        top: 30,
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      {[10, 14, 18, 22].map((h) => (
        <div
          key={h}
          style={{
            width: 6,
            height: h,
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        />
      ))}
      <div
        style={{
          width: 40,
          height: 20,
          borderRadius: 5,
          border: "2.5px solid white",
          marginLeft: 10,
          padding: 2,
        }}
      >
        <div
          style={{
            width: "75%",
            height: "100%",
            borderRadius: 2,
            backgroundColor: "#fff",
          }}
        />
      </div>
    </div>
  </>
);

/** Pantalla interna: encabezado azul con volver + logo + título, y tarjeta blanca que puede scrollear. */
export const PantallaInterna: React.FC<{
  readonly titulo: string;
  readonly desplazamiento?: number;
  readonly children: React.ReactNode;
}> = ({ titulo, desplazamiento = 0, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: colores.grisFondoApp,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 736,
        height: 276,
        backgroundColor: AZUL,
      }}
    />
    <BarraEstado />
    <IcVolver
      tamano={38}
      style={{ position: "absolute", left: 14, top: 145 }}
    />
    <Img
      src={staticFile("brand/logo-horizontal-blanco.png")}
      style={{ position: "absolute", left: 62, top: 142, width: 116 }}
    />
    <Texto x={698} y={148} tamano={23} peso={500} color="#fff" derecha>
      {titulo}
    </Texto>
    <div
      style={{
        position: "absolute",
        left: 24,
        top: 212,
        width: 688,
        height: 1356,
        borderRadius: 12,
        backgroundColor: "#fff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -24,
          top: -212 - desplazamiento,
          width: 736,
          height: 3200,
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

export const Campo: React.FC<{
  readonly x?: number;
  readonly y: number;
  readonly ancho?: number;
  readonly alto?: number;
  readonly valor?: string;
  readonly placeholder?: string;
  readonly cursor?: boolean;
  readonly flecha?: boolean;
  readonly enfocado?: boolean;
}> = ({
  x = 61,
  y,
  ancho = 614,
  alto = 63,
  valor,
  placeholder,
  cursor,
  flecha,
  enfocado,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: ancho,
      height: alto,
      borderRadius: 8,
      border: `2px solid ${enfocado ? AZUL : "#CFCFD6"}`,
      display: "flex",
      alignItems: "center",
      padding: "0 18px",
      boxSizing: "border-box",
      fontFamily: fuenteTexto,
      fontSize: 25,
      fontWeight: 600,
      color: valor ? "#2B2940" : "#A8A6B8",
    }}
  >
    {valor || placeholder}
    {cursor && (
      <div
        style={{ width: 2.5, height: 30, backgroundColor: AZUL, marginLeft: 3 }}
      />
    )}
    {flecha && (
      <div
        style={{
          position: "absolute",
          right: 18,
          width: 0,
          height: 0,
          borderLeft: "11px solid transparent",
          borderRight: "11px solid transparent",
          borderTop: "12px solid #6E6C80",
        }}
      />
    )}
  </div>
);

/** Botón de la app. activo: 0 = gris deshabilitado, 1 = azul. */
export const BotonApp: React.FC<{
  readonly y: number;
  readonly texto: string;
  readonly activo?: number;
  readonly x?: number;
  readonly ancho?: number;
  readonly alto?: number;
  readonly borde?: boolean;
  readonly presionado?: number;
}> = ({
  y,
  texto,
  activo = 1,
  x = 64,
  ancho = 607,
  alto = 68,
  borde,
  presionado = 0,
}) => {
  const fondo = borde
    ? "#fff"
    : `rgb(${interpolate(activo, [0, 1], [204, 36])}, ${interpolate(activo, [0, 1], [204, 34])}, ${interpolate(activo, [0, 1], [204, 169])})`;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: ancho,
        height: alto,
        borderRadius: alto / 2,
        backgroundColor: fondo,
        border: borde ? `3px solid ${AZUL}` : undefined,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fuenteTexto,
        fontSize: 23,
        fontWeight: 800,
        letterSpacing: "0.02em",
        color: borde ? AZUL : "#fff",
        scale: String(1 - 0.04 * presionado),
      }}
    >
      {texto}
    </div>
  );
};

export const Interruptor: React.FC<{
  readonly x: number;
  readonly y: number;
  readonly encendido: number;
}> = ({ x, y, encendido }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 92,
      height: 58,
      borderRadius: 29,
      backgroundColor: `rgb(${interpolate(encendido, [0, 1], [233, 78])}, ${interpolate(encendido, [0, 1], [233, 193])}, ${interpolate(encendido, [0, 1], [238, 72])})`,
      boxShadow: `inset 0 0 0 2px rgba(0,0,0,${0.08 * (1 - encendido)})`,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 4,
        left: 4 + 34 * encendido,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#fff",
        boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
      }}
    />
  </div>
);

// ---------------------------------------------------------------- Menú
type ItemMenu = {
  t?: string;
  sec?: string;
  y: number;
  off?: boolean;
  icono?: React.ReactNode;
};
const ic = 40;
const ITEMS_MENU: ItemMenu[] = [
  { t: "Mi cuenta", y: 233, icono: <IcPersona tamano={ic} /> },
  { sec: "Usuario", y: 376 },
  { t: "Cuentas vinculadas", y: 419, icono: <IcCompartir tamano={ic} /> },
  {
    t: "Destinatarios",
    y: 539,
    icono: <IconoPersonas tamano={ic} color={AZUL} />,
  },
  { t: "Dispositivos", y: 659, icono: <IcCelular tamano={ic} /> },
  {
    t: "Notificaciones",
    y: 779,
    icono: <IconoCampana tamano={ic} color={AZUL} />,
  },
  { sec: "Operaciones", y: 922 },
  { t: "Brasil", y: 965, off: true, icono: <IcRombo tamano={ic} /> },
  { t: "Cobrar", y: 1085, icono: <IconoCobrar tamano={ic} color={AZUL} /> },
  {
    t: "Cuentas autorizadas",
    y: 1205,
    off: true,
    icono: <IcPersonaCheck tamano={ic} />,
  },
  {
    t: "Ingresar dinero",
    y: 1325,
    icono: <IconoIngresar tamano={ic} color={AZUL} />,
  },
  {
    t: "Pagar servicios",
    y: 1445,
    icono: <IconoDocumento tamano={ic} color={AZUL} colorSimbolo="#fff" />,
  },
  { t: "Prestapp", y: 1565, icono: <Isotipo alto={42} /> },
  { t: "Recargar prepagos", y: 1685, icono: <IcCelularCheck tamano={ic} /> },
  { t: "Transferir", y: 1805, icono: <IconoAvion tamano={ic} color={AZUL} /> },
  { sec: "Soporte", y: 1950 },
  {
    t: "Botón de arrepentimiento",
    y: 1993,
    icono: <IcCaraTriste tamano={ic} />,
  },
  { t: "Botón de baja", y: 2113, icono: <IcTacho tamano={ic} /> },
  { t: "Invitar", y: 2233, icono: <IcCorazon tamano={ic} /> },
  {
    t: "Términos y condiciones",
    y: 2353,
    icono: <IcDocumentoLineas tamano={ic} />,
  },
];
export const Y_MENU = Object.fromEntries(
  ITEMS_MENU.filter((i) => i.t).map((i) => [i.t, i.y + 50]),
) as Record<string, number>;

export const FilaLista: React.FC<{
  readonly y: number;
  readonly texto: string;
  readonly icono?: React.ReactNode;
  readonly off?: boolean;
  readonly resaltado?: number;
  readonly x?: number;
  readonly ancho?: number;
  readonly colorTexto?: string;
  readonly subtitulo?: string;
}> = ({
  y,
  texto,
  icono,
  off,
  resaltado = 0,
  x = 48,
  ancho = 640,
  colorTexto = AZUL,
  subtitulo,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: ancho,
      height: 100,
      borderRadius: 10,
      backgroundColor:
        resaltado > 0 ? `rgba(36,34,169,${0.06 + 0.1 * resaltado})` : GRIS_FILA,
      opacity: off ? 0.35 : 1,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 22,
        top: 0,
        width: 46,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icono}
    </div>
    <div
      style={{
        position: "absolute",
        left: 93,
        top: subtitulo ? 22 : 34,
        fontFamily: fuenteTexto,
        fontSize: 24,
        fontWeight: 700,
        color: colorTexto,
      }}
    >
      {texto}
    </div>
    {subtitulo && (
      <div
        style={{
          position: "absolute",
          left: 93,
          top: 54,
          fontFamily: fuenteTexto,
          fontSize: 19,
          fontWeight: 600,
          color: "#8C8AA0",
        }}
      >
        {subtitulo}
      </div>
    )}
    <IcChevron
      tamano={34}
      color={off ? "#B5B4C2" : AZUL}
      style={{ position: "absolute", right: 26, top: 33 }}
    />
  </div>
);

export const PantallaMenu: React.FC<{
  readonly desplazamiento?: number;
  readonly resaltar?: string;
  readonly nivel?: number;
}> = ({ desplazamiento = 0, resaltar, nivel = 0 }) => (
  <PantallaInterna titulo="Menú" desplazamiento={desplazamiento}>
    {ITEMS_MENU.map((it) =>
      it.sec ? (
        <Texto key={it.sec} x={56} y={it.y} tamano={23} peso={500} color={AZUL}>
          {it.sec}
        </Texto>
      ) : (
        <FilaLista
          key={it.t}
          y={it.y}
          texto={it.t ?? ""}
          icono={it.icono}
          off={it.off}
          resaltado={it.t === resaltar ? nivel : 0}
        />
      ),
    )}
  </PantallaInterna>
);

// ---------------------------------------------------------------- Teclado numérico
const TECLAS = [
  ["1", ""],
  ["2", "ABC"],
  ["3", "DEF"],
  ["4", "GHI"],
  ["5", "JKL"],
  ["6", "MNO"],
  ["7", "PQRS"],
  ["8", "TUV"],
  ["9", "WXYZ"],
  [".", ""],
  ["0", ""],
  ["⌫", ""],
];
export const POS_TECLA = (t: string) => {
  const i = TECLAS.findIndex(([d]) => d === t);
  return {
    x: [124, 366, 609][i % 3],
    y: [1134, 1233, 1332, 1431][Math.floor(i / 3)],
  };
};

export const Teclado: React.FC<{ readonly presionada?: string | null }> = ({
  presionada,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 1047,
      width: 736,
      height: 553,
      backgroundColor: "#262626",
      borderRadius: "44px 44px 0 0",
    }}
  >
    {TECLAS.map(([d, letras], i) => {
      const sinFondo = d === "." || d === "⌫";
      const x = [9, 251, 494][i % 3];
      const y = [44, 143, 242, 341][Math.floor(i / 3)];
      return (
        <div
          key={d}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: 231,
            height: 87,
            borderRadius: 12,
            backgroundColor: sinFondo
              ? "transparent"
              : presionada === d
                ? "#8A8A8A"
                : "#4B4B4B",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: fuenteTexto,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 500, lineHeight: 1 }}>
            {d}
          </div>
          {letras && (
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.25em",
                marginTop: 2,
              }}
            >
              {letras}
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ---------------------------------------------------------------- Pantalla de éxito
export const PantallaExito: React.FC<{
  readonly f: number;
  readonly tituloPantalla: string;
  readonly titulo: string;
  readonly monto?: string;
  readonly lineas: string[];
  readonly icono?: React.ReactNode;
}> = ({ f, tituloPantalla, titulo, monto, lineas, icono }) => {
  const { fps } = useVideoConfig();
  const circulo = spring({
    frame: f - 2,
    fps,
    config: { damping: 11, stiffness: 160 },
  });
  const tilde = interpolate(f, [10, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textos = spring({
    frame: f - 16,
    fps,
    config: { damping: 16, stiffness: 140 },
  });
  return (
    <PantallaInterna titulo={tituloPantalla}>
      {/* Confeti suave */}
      {[...Array(14).keys()].map((i) => {
        const ang = (i / 14) * Math.PI * 2;
        const d = interpolate(f, [4, 40], [0, 210 + (i % 3) * 40], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const o = interpolate(f, [4, 12, 34, 48], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 368 + Math.cos(ang) * d - 7,
              top: 470 + Math.sin(ang) * d * 0.8 - 7,
              width: 14,
              height: i % 2 ? 14 : 8,
              borderRadius: i % 2 ? 7 : 2,
              backgroundColor:
                i % 3 === 0 ? colores.verde : i % 3 === 1 ? AZUL : "#F2B01E",
              opacity: o,
              rotate: `${i * 40 + f * 4}deg`,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 368 - 105,
          top: 365,
          width: 210,
          height: 210,
          borderRadius: 105,
          backgroundColor: colores.verde,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(circulo),
          boxShadow: `0 18px 50px ${colores.verde}66`,
        }}
      >
        {icono ?? <IconoTilde tamano={130} color="#fff" progreso={tilde} />}
      </div>
      <div
        style={{
          opacity: Math.min(1, textos * 1.4),
          translate: `0px ${(1 - textos) * 30}px`,
        }}
      >
        <Texto
          x={0}
          y={625}
          ancho={736}
          centrado
          tamano={42}
          peso={800}
          color={AZUL}
        >
          {titulo}
        </Texto>
        {monto && (
          <Texto
            x={0}
            y={690}
            ancho={736}
            centrado
            tamano={58}
            peso={800}
            color="#2B2940"
            style={{ fontFamily: fuenteTitulos }}
          >
            {monto}
          </Texto>
        )}
        {lineas.map((l, i) => (
          <Texto
            key={l}
            x={0}
            y={(monto ? 790 : 700) + i * 40}
            ancho={736}
            centrado
            tamano={24}
            peso={600}
            color="#7A7890"
          >
            {l}
          </Texto>
        ))}
      </div>
      <BotonApp y={1010} texto="VOLVER AL INICIO" borde />
    </PantallaInterna>
  );
};

// ---------------------------------------------------------------- QR decorativo
/** QR de mentira: tiene la forma de un QR pero no se puede escanear (los módulos son al azar). */
export const QRDecorativo: React.FC<{ readonly tamano: number }> = ({
  tamano,
}) => {
  const N = 25;
  let semilla = 7;
  const azar = () => {
    semilla = (semilla * 1103515245 + 12345) % 2147483648;
    return semilla / 2147483648;
  };
  const enFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  const modulos: React.ReactNode[] = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      if (enFinder(x, y)) continue;
      if (azar() < 0.48)
        modulos.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1.02}
            height={1.02}
            fill="#111"
          />,
        );
    }
  }
  const finder = (fx: number, fy: number) => (
    <g key={`f${fx}${fy}`}>
      <rect x={fx} y={fy} width={7} height={7} fill="#111" />
      <rect x={fx + 1} y={fy + 1} width={5} height={5} fill="#fff" />
      <rect x={fx + 2} y={fy + 2} width={3} height={3} fill="#111" />
    </g>
  );
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox={`-1 -1 ${N + 2} ${N + 2}`}
      shapeRendering="crispEdges"
    >
      <rect x={-1} y={-1} width={N + 2} height={N + 2} fill="#fff" />
      {modulos}
      {finder(0, 0)}
      {finder(N - 7, 0)}
      {finder(0, N - 7)}
    </svg>
  );
};

// ---------------------------------------------------------------- Inicio
/** Pantalla de inicio real (saludo + saldo oculto). Botones: Pagar Servicios (149,380), Transferir (368,380), QR (368,1457), Menú (638,1457). */
export const PantallaInicio: React.FC<{
  readonly saludo: string;
  readonly tna: string;
  readonly fecha: string;
}> = ({ saludo, tna, fecha }) => (
  <PantallaApp
    saldo={0}
    saludo={saludo}
    tnaTexto={tna}
    concepto="Rendimiento Saldo"
    tituloMovimientos="Últimos movimientos"
    verMas="Ver más"
    movimientos={[0, 1, 2, 3, 4, 5].map((i) => ({
      fecha: fechaMenosDias(fecha, i),
      monto: 59.75,
    }))}
  />
);
