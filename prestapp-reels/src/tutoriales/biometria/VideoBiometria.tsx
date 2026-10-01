import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { IconoTilde } from "../../componentes/Iconos";
import { Efecto } from "../../componentes/Sonido";
import { Titular, ZonaTitular } from "../../componentes/Titular";
import { Escena09Cierre } from "../../escenas/Escena09Cierre";
import { colores } from "../../marca/marca";
import { fechaISO } from "../../utils/numeros";
import {
  Interruptor,
  PantallaExito,
  PantallaInicio,
  PantallaInterna,
  PantallaMenu,
  Texto,
  Y_MENU,
} from "../comun/app";
import { BaseTutorial, EMPUJE, FUNDIDO, GanchoBase } from "../comun/escenas";
import { IcEscudo, IcHuella, IcLapiz } from "../comun/iconos";
import { calcularInicios, Paso, RecorridoApp } from "../comun/RecorridoApp";
import type { DatosBiometria } from "./datos";

const AZUL = colores.azulApp;
const SCROLL_CUENTA = 800;
const TOQUE_INTERRUPTOR = 60;

/** Línea que barre un elemento de arriba a abajo. */
const Barrido: React.FC<{ readonly f: number; readonly alto: number }> = ({
  f,
  alto,
}) => {
  const y = ((f % 70) / 70) * alto;
  return (
    <div
      style={{
        position: "absolute",
        left: -30,
        right: -30,
        top: y,
        height: 8,
        borderRadius: 4,
        backgroundColor: colores.verde,
        boxShadow: `0 0 30px ${colores.verde}`,
        opacity: 0.9,
      }}
    />
  );
};

const GanchoBiometria: React.FC<{ readonly datos: DatosBiometria }> = ({
  datos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({
    frame: frame - 4,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  return (
    <GanchoBase texto={datos.gancho}>
      <div
        style={{
          position: "relative",
          width: 460,
          height: 460,
          scale: String(0.8 + 0.2 * entra),
          opacity: Math.min(1, entra * 1.5),
        }}
      >
        <IcEscudo
          tamano={460}
          candado
          style={{ filter: `drop-shadow(0 0 40px ${colores.verde}88)` }}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 40,
            bottom: 40,
            overflow: "hidden",
          }}
        >
          <Barrido f={frame} alto={380} />
        </div>
      </div>
    </GanchoBase>
  );
};

/** Ícono de rostro de línea (no es una persona real) con puntos de escaneo. */
const EscenaRostro: React.FC<{ readonly datos: DatosBiometria }> = ({
  datos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const listo = spring({
    frame: frame - 120,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  const puntos = [
    [150, 170],
    [250, 170],
    [200, 230],
    [140, 290],
    [260, 290],
    [200, 320],
    [120, 200],
    [280, 200],
    [200, 120],
    [165, 360],
    [235, 360],
  ];
  return (
    <AbsoluteFill>
      <Efecto archivo="trazo" en={20} volumen={0.35} />
      <ZonaTitular>
        <Titular
          texto={datos.rostro}
          desde={6}
          tamano={84}
          retrasoPorPalabra={4}
        />
      </ZonaTitular>
      <div
        style={{
          position: "absolute",
          left: 340,
          top: 700,
          width: 400,
          height: 460,
          scale: String(0.85 + 0.15 * entra),
          opacity: Math.min(1, entra * 1.5),
        }}
      >
        {/* Esquinas del marco */}
        {[0, 90, 270, 180].map((rot, i) => (
          <div
            key={rot}
            style={{
              position: "absolute",
              width: 90,
              height: 90,
              borderLeft: `10px solid ${listo > 0.5 ? colores.verde : "#fff"}`,
              borderTop: `10px solid ${listo > 0.5 ? colores.verde : "#fff"}`,
              borderRadius: "22px 0 0 0",
              rotate: `${rot}deg`,
              ...[
                { left: 0, top: 0 },
                { right: 0, top: 0 },
                { left: 0, bottom: 0 },
                { right: 0, bottom: 0 },
              ][i],
            }}
          />
        ))}
        <svg
          width={400}
          height={460}
          viewBox="0 0 400 460"
          style={{ position: "absolute", inset: 0 }}
        >
          <ellipse
            cx={200}
            cy={230}
            rx={115}
            ry={150}
            fill="none"
            stroke="#fff"
            strokeWidth={9}
          />
          <path
            d="M150 300 Q200 340 250 300"
            fill="none"
            stroke="#fff"
            strokeWidth={9}
            strokeLinecap="round"
          />
          <circle cx={155} cy={200} r={11} fill="#fff" />
          <circle cx={245} cy={200} r={11} fill="#fff" />
          {puntos.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={7}
              fill={colores.verde}
              opacity={interpolate(frame, [20 + i * 6, 28 + i * 6], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            top: 30,
            bottom: 30,
            overflow: "hidden",
            opacity: frame < 120 ? 1 : 0,
          }}
        >
          <Barrido f={frame} alto={400} />
        </div>
        <div
          style={{
            position: "absolute",
            right: -40,
            bottom: -40,
            width: 130,
            height: 130,
            borderRadius: 65,
            backgroundColor: colores.verde,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(listo),
          }}
        >
          <IconoTilde tamano={90} color="#fff" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CAMPOS: [string, string, boolean][] = [
  ["Nombre y apellido", "******** ********", false],
  ["CUIL", "**-********-*", false],
  ["Email", "*******@*****.***", true],
  ["Celular", "****-*********", true],
  ["Estado civil", "*******", true],
  ["Condición", "****", true],
  ["Persona políticamente expuesta", "**", true],
];
const PERFIL: [string, string][] = [
  ["Tipo de cuenta", "********"],
  ["Comisión por acreditación", "*,**** %"],
  ["Perfil asignado", "$ *.***.***,**"],
  ["Volumen operado", "$ **.***,**"],
  ["Disponible", "$ *.***.***,**"],
  ["Documentación presentada", "**"],
  ["Fecha de vencimiento", "*** **********"],
];
const Y_HUELLA = 1748;

const PantallaMiCuenta: React.FC<{
  readonly desplazamiento: number;
  readonly encendido: number;
}> = ({ desplazamiento, encendido }) => {
  const campo = (etiqueta: string, valor: string, y: number, lapiz = false) => (
    <React.Fragment key={etiqueta}>
      <Texto x={54} y={y} tamano={22} peso={700}>
        {etiqueta}:
      </Texto>
      <Texto x={54} y={y + 33} tamano={22} peso={500} color="#8C8AA0">
        {valor}
      </Texto>
      {lapiz && (
        <IcLapiz
          tamano={36}
          style={{ position: "absolute", left: 648, top: y + 6 }}
        />
      )}
    </React.Fragment>
  );
  return (
    <PantallaInterna titulo="Mi cuenta" desplazamiento={desplazamiento}>
      {CAMPOS.map(([e, v, l], i) => campo(e, v, 252 + i * 84, l))}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 829,
          width: 624,
          height: 2,
          backgroundColor: "#E2E2EA",
        }}
      />
      <Texto x={54} y={872} tamano={27} peso={800} color={AZUL}>
        Mi Perfil
      </Texto>
      {PERFIL.map(([e, v], i) => campo(e, v, 940 + i * 84))}
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 1531,
          width: 624,
          height: 2,
          backgroundColor: "#E2E2EA",
        }}
      />
      <Texto x={54} y={1575} tamano={27} peso={800} color={AZUL}>
        Configuraciones
      </Texto>
      <Texto x={54} y={1655} tamano={22} peso={700}>
        Alias
      </Texto>
      <IcLapiz
        tamano={36}
        style={{ position: "absolute", left: 648, top: 1650 }}
      />
      <Texto x={54} y={Y_HUELLA - 14} tamano={22} peso={700}>
        Acceso con huella
      </Texto>
      <Interruptor x={590} y={Y_HUELLA - 29} encendido={encendido} />
      {encendido > 0.5 && (
        <IcHuella
          tamano={54}
          progreso={(encendido - 0.5) * 2}
          style={{ position: "absolute", left: 520, top: Y_HUELLA - 27 }}
        />
      )}
    </PantallaInterna>
  );
};

export const VideoBiometria: React.FC<DatosBiometria> = (datos) => {
  const inicio = () => (
    <PantallaInicio
      saludo={datos.saludo}
      tna={datos.tna}
      fecha={fechaISO(datos.fecha)}
    />
  );
  const bajar = (f: number) =>
    interpolate(f, [40, 200], [0, SCROLL_CUENTA], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  const pasos: Paso[] = [
    {
      titulo: datos.pasoMenu,
      duracion: 150,
      pantalla: inicio,
      camara: [
        [20, 0],
        [70, -420],
      ],
      toques: [{ x: 638, y: 1457, en: 110 }],
    },
    {
      titulo: datos.pasoMiCuenta,
      duracion: 210,
      pantalla: (f) => (
        <PantallaMenu
          resaltar="Mi cuenta"
          nivel={interpolate(f, [116, 124], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      ),
      toques: [{ x: 368, y: Y_MENU["Mi cuenta"], en: 120 }],
    },
    {
      titulo: datos.pasoBajar,
      duracion: 270,
      pantalla: (f) => (
        <PantallaMiCuenta desplazamiento={bajar(f)} encendido={0} />
      ),
    },
    {
      titulo: datos.pasoActivar,
      duracion: 240,
      entra: "igual",
      pantalla: (f) => (
        <PantallaMiCuenta
          desplazamiento={SCROLL_CUENTA}
          encendido={interpolate(
            f,
            [TOQUE_INTERRUPTOR, TOQUE_INTERRUPTOR + 30],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )}
        />
      ),
      toques: [{ x: 636, y: Y_HUELLA - SCROLL_CUENTA, en: TOQUE_INTERRUPTOR }],
    },
    {
      titulo: datos.pasoExito,
      duracion: 300,
      pantalla: (f) => (
        <PantallaExito
          f={f}
          tituloPantalla="Mi cuenta"
          titulo="¡Identidad verificada!"
          lineas={datos.lineasExito}
          icono={
            <IcEscudo
              tamano={150}
              color="#fff"
              colorDetalle={colores.verde}
              check
            />
          }
        />
      ),
    },
  ];
  const inicios = calcularInicios(pasos);

  return (
    <BaseTutorial
      musica="musica-biometria.wav"
      volumenMusica={datos.volumenMusica}
      volumenEfectos={datos.volumenEfectos}
    >
      <Efecto archivo="whoosh" en={291} volumen={0.35} />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Gancho (0–2 s)"
          durationInFrames={120 + 15}
        >
          <GanchoBiometria datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Rostro (2–5 s)"
          durationInFrames={180 + 15}
        >
          <EscenaRostro datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Recorrido en la app (5–24,5 s)"
          durationInFrames={1170 + 20}
        >
          <RecorridoApp pasos={pasos} />
          <Sequence from={inicios[4]} layout="none">
            <Efecto archivo="exito" en={4} volumen={0.6} />
          </Sequence>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...FUNDIDO} />
        <TransitionSeries.Sequence
          name="Cierre (24,5–30 s)"
          durationInFrames={330}
        >
          <Escena09Cierre datos={datos} sonidos="minimo" />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </BaseTutorial>
  );
};
