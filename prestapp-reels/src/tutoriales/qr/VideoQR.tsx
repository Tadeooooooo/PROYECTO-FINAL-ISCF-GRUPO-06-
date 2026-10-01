import React from "react";
import {
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { Efecto } from "../../componentes/Sonido";
import { Escena09Cierre } from "../../escenas/Escena09Cierre";
import { colores, fuenteTitulos } from "../../marca/marca";
import { fechaISO, formatoNumero } from "../../utils/numeros";
import {
  BarraEstado,
  BotonApp,
  PantallaExito,
  PantallaInicio,
  PantallaInterna,
  QRDecorativo,
  Texto,
} from "../comun/app";
import {
  BaseTutorial,
  EMPUJE,
  EscenaDato,
  FUNDIDO,
  GanchoBase,
} from "../comun/escenas";
import { IcTienda, IcVolver } from "../comun/iconos";
import { calcularInicios, Paso, RecorridoApp } from "../comun/RecorridoApp";
import type { DatosQR } from "./datos";

const CIERRE_ESCANEO = 150; // cuadro del paso "Escaneá" en que el QR queda leído

/** Marco de escáner con esquinas verdes y una línea que barre. */
const Escaner: React.FC<{
  readonly tamano: number;
  readonly f: number;
  readonly leido?: number;
}> = ({ tamano, f, leido = 0 }) => {
  const linea = leido > 0 ? 0.5 : (Math.sin(f / 14) + 1) / 2;
  const esquina = (rot: number, pos: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: tamano * 0.2,
        height: tamano * 0.2,
        borderLeft: `${tamano * 0.03}px solid ${colores.verde}`,
        borderTop: `${tamano * 0.03}px solid ${colores.verde}`,
        borderRadius: `${tamano * 0.05}px 0 0 0`,
        rotate: `${rot}deg`,
        scale: String(1.18 - 0.18 * leido),
        ...pos,
      }}
    />
  );
  const m = tamano * 0.035;
  return (
    <div
      style={{
        position: "relative",
        width: tamano,
        height: tamano,
        borderRadius: tamano * 0.05,
        backgroundColor: "#22222E",
        padding: tamano * 0.07,
        boxSizing: "border-box",
        boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
      }}
    >
      <QRDecorativo tamano={tamano * 0.86} />
      {esquina(0, { left: m, top: m })}
      {esquina(90, { right: m, top: m })}
      {esquina(270, { left: m, bottom: m })}
      {esquina(180, { right: m, bottom: m })}
      <div
        style={{
          position: "absolute",
          left: tamano * 0.1,
          right: tamano * 0.1,
          top: tamano * (0.12 + 0.76 * linea),
          height: tamano * 0.012,
          borderRadius: 4,
          backgroundColor: colores.verde,
          boxShadow: `0 0 ${tamano * 0.04}px ${colores.verde}`,
          opacity: leido > 0 ? 1 - leido : 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: tamano * 0.05,
          boxShadow: `inset 0 0 0 ${tamano * 0.012}px rgba(78,193,72,${leido})`,
        }}
      />
    </div>
  );
};

const GanchoQR: React.FC<{ readonly datos: DatosQR }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({
    frame: frame - 4,
    fps,
    config: { damping: 13, stiffness: 150 },
  });
  return (
    <GanchoBase texto={datos.gancho}>
      <div
        style={{
          scale: String(0.8 + 0.2 * entra),
          opacity: Math.min(1, entra * 1.5),
        }}
      >
        <Escaner tamano={560} f={frame} />
      </div>
    </GanchoBase>
  );
};

const PantallaEscaneo: React.FC<{ readonly f: number }> = ({ f }) => {
  const leido = interpolate(
    f,
    [CIERRE_ESCANEO - 6, CIERRE_ESCANEO + 6],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: colores.azulApp,
      }}
    >
      <BarraEstado />
      <IcVolver
        tamano={38}
        style={{ position: "absolute", left: 14, top: 145 }}
      />
      <Img
        src={staticFile("brand/logo-horizontal-blanco.png")}
        style={{ position: "absolute", left: 62, top: 142, width: 116 }}
      />
      <Texto
        x={0}
        y={290}
        ancho={736}
        centrado
        tamano={42}
        peso={800}
        color="#fff"
      >
        Escaneá el código QR
      </Texto>
      <div style={{ position: "absolute", left: 88, top: 390 }}>
        <Escaner tamano={560} f={f} leido={leido} />
      </div>
    </div>
  );
};

const PantallaConfirmar: React.FC<{
  readonly datos: DatosQR;
  readonly f: number;
}> = ({ datos, f }) => (
  <PantallaInterna titulo="Pagar">
    <div
      style={{
        position: "absolute",
        left: 368 - 64,
        top: 290,
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: colores.azulApp,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IcTienda tamano={70} />
    </div>
    <Texto
      x={0}
      y={450}
      ancho={736}
      centrado
      tamano={32}
      peso={800}
      color="#2B2940"
    >
      {datos.comercio}
    </Texto>
    <Texto
      x={0}
      y={530}
      ancho={736}
      centrado
      tamano={23}
      peso={600}
      color="#7A7890"
    >
      Monto a pagar
    </Texto>
    <Texto
      x={0}
      y={566}
      ancho={736}
      centrado
      tamano={70}
      peso={800}
      color={colores.azulApp}
      style={{ fontFamily: fuenteTitulos }}
    >
      $ {formatoNumero(datos.monto, 2)}
    </Texto>
    <div
      style={{
        position: "absolute",
        left: 61,
        top: 700,
        width: 614,
        height: 2,
        backgroundColor: "#ECECF2",
      }}
    />
    <Texto x={61} y={730} tamano={23} peso={600} color="#7A7890">
      Pagás con
    </Texto>
    <Texto x={675} y={730} tamano={23} peso={800} color="#2B2940" derecha>
      Saldo Prestapp
    </Texto>
    <BotonApp
      y={880}
      texto="PAGAR"
      presionado={interpolate(f, [136, 140, 148], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })}
    />
  </PantallaInterna>
);

export const VideoQR: React.FC<DatosQR> = (datos) => {
  const pasos: Paso[] = [
    {
      titulo: datos.promesa,
      duracion: 150,
      pantalla: () => (
        <PantallaInicio
          saludo={datos.saludo}
          tna={datos.tna}
          fecha={fechaISO(datos.fecha)}
        />
      ),
    },
    {
      titulo: datos.pasoBoton,
      duracion: 210,
      entra: "igual",
      pantalla: () => (
        <PantallaInicio
          saludo={datos.saludo}
          tna={datos.tna}
          fecha={fechaISO(datos.fecha)}
        />
      ),
      camara: [
        [10, 0],
        [60, -420],
      ],
      toques: [{ x: 368, y: 1457, en: 130 }],
    },
    {
      titulo: datos.pasoEscanear,
      duracion: 240,
      pantalla: (f) => <PantallaEscaneo f={f} />,
    },
    {
      titulo: datos.pasoPagar,
      duracion: 210,
      pantalla: (f) => <PantallaConfirmar datos={datos} f={f} />,
      toques: [{ x: 368, y: 914, en: 140 }],
    },
    {
      titulo: datos.pasoExito,
      duracion: 270,
      pantalla: (f) => (
        <PantallaExito
          f={f}
          tituloPantalla="Pagar"
          titulo="¡Pago hecho!"
          monto={`$ ${formatoNumero(datos.monto, 2)}`}
          lineas={[datos.comercio, datos.fecha]}
        />
      ),
    },
  ];
  const inicios = calcularInicios(pasos);

  return (
    <BaseTutorial
      musica="musica-qr.wav"
      volumenMusica={datos.volumenMusica}
      volumenEfectos={datos.volumenEfectos}
    >
      <Efecto archivo="whoosh" en={111} volumen={0.35} />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Gancho (0–2 s)"
          durationInFrames={120 + 15}
        >
          <GanchoQR datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Recorrido en la app (2–20 s)"
          durationInFrames={1080 + 15}
        >
          <RecorridoApp pasos={pasos} />
          <Sequence from={inicios[2]} layout="none">
            <Efecto archivo="bip" en={CIERRE_ESCANEO} volumen={0.6} />
          </Sequence>
          <Sequence from={inicios[4]} layout="none">
            <Efecto archivo="exito" en={4} volumen={0.6} />
          </Sequence>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Dato (20–24,5 s)"
          durationInFrames={270 + 20}
        >
          <EscenaDato
            prefijo={datos.datoPrefijo}
            numero={datos.datoNumero}
            sufijo={datos.datoSufijo}
            iconos={[...Array(8).keys()].map((i) => (
              <IcTienda key={i} tamano={84} />
            ))}
          />
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
