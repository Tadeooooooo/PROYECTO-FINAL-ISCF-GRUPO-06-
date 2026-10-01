import React from "react";
import {
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { Efecto } from "../../componentes/Sonido";
import { Escena09Cierre } from "../../escenas/Escena09Cierre";
import { colores, fuenteTitulos } from "../../marca/marca";
import { fechaISO, formatoNumero } from "../../utils/numeros";
import {
  BotonApp,
  Campo,
  FilaLista,
  PantallaExito,
  PantallaInicio,
  PantallaInterna,
  Texto,
} from "../comun/app";
import {
  BaseTutorial,
  EMPUJE,
  EscenaDato,
  FUNDIDO,
  GanchoBase,
} from "../comun/escenas";
import {
  IcCelular,
  IcDocumentoLineas,
  IcGota,
  IcLlama,
  IcRayo,
  IcWifi,
} from "../comun/iconos";
import { calcularInicios, Paso, RecorridoApp } from "../comun/RecorridoApp";
import type { DatosServicios } from "./datos";

const AZUL = colores.azulApp;
const ICONOS = [IcRayo, IcLlama, IcGota, IcWifi];

const CajaIcono: React.FC<{ readonly i: number; readonly tamano?: number }> = ({
  i,
  tamano = 60,
}) => {
  const Icono = ICONOS[i % ICONOS.length];
  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        borderRadius: tamano * 0.22,
        backgroundColor: "#fff",
        border: "2px solid #E3E2EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icono tamano={tamano * 0.55} />
    </div>
  );
};

const GanchoServicios: React.FC<{ readonly datos: DatosServicios }> = ({
  datos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <GanchoBase texto={datos.gancho}>
      <div style={{ position: "relative", width: 620, height: 640 }}>
        {[0, 1, 2].map((i) => {
          const cae = spring({
            frame: frame - 6 - i * 9,
            fps,
            config: { damping: 11, stiffness: 150 },
          });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 70 + i * 22,
                top: 330 - i * 120,
                width: 440,
                height: 250,
                borderRadius: 30,
                backgroundColor: "#fff",
                boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
                rotate: `${[-6, 3, -2][i]}deg`,
                translate: `0px ${(1 - cae) * -700}px`,
                opacity: frame >= 6 + i * 9 ? 1 : 0,
                display: "flex",
                alignItems: "center",
                gap: 30,
                padding: "0 40px",
                boxSizing: "border-box",
              }}
            >
              <CajaIcono i={i} tamano={120} />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <div
                  style={{
                    height: 22,
                    width: "80%",
                    borderRadius: 11,
                    backgroundColor: "#DCDBEA",
                  }}
                />
                <div
                  style={{
                    height: 22,
                    width: "55%",
                    borderRadius: 11,
                    backgroundColor: "#ECEBF4",
                  }}
                />
                <div
                  style={{
                    height: 30,
                    width: "65%",
                    borderRadius: 15,
                    backgroundColor: colores.verde,
                    opacity: 0.85,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GanchoBase>
  );
};

const PantallaListaServicios: React.FC<{
  readonly datos: DatosServicios;
  readonly resaltar: number;
}> = ({ datos, resaltar }) => (
  <PantallaInterna titulo="Servicios">
    <Texto x={61} y={280} tamano={22} peso={700}>
      Empresa:
    </Texto>
    <Campo y={316} placeholder="Buscador" />
    <Texto x={61} y={430} tamano={30} peso={800} color={AZUL}>
      Recientes
    </Texto>
    {datos.servicios.map((s, i) => (
      <FilaLista
        key={s.nombre}
        x={61}
        ancho={614}
        y={490 + i * 118}
        texto={s.nombre}
        subtitulo={s.detalle}
        colorTexto="#1F1D57"
        icono={<CajaIcono i={i} />}
        resaltado={i === 0 ? resaltar : 0}
      />
    ))}
    <BotonApp
      y={1340}
      texto="ESCANEÁ EL CÓDIGO DE BARRAS"
      x={61}
      ancho={614}
      alto={76}
    />
    <BotonApp
      y={1440}
      texto="ESCRIBÍ EL CÓDIGO DE BARRAS"
      x={61}
      ancho={614}
      alto={76}
      borde
    />
  </PantallaInterna>
);

const PantallaFactura: React.FC<{
  readonly datos: DatosServicios;
  readonly f: number;
}> = ({ datos, f }) => {
  const s = datos.servicios[0];
  return (
    <PantallaInterna titulo="Servicios">
      <div style={{ position: "absolute", left: 368 - 64, top: 280 }}>
        <CajaIcono i={0} tamano={128} />
      </div>
      <Texto
        x={0}
        y={430}
        ancho={736}
        centrado
        tamano={36}
        peso={800}
        color="#1F1D57"
      >
        {s.nombre}
      </Texto>
      <Texto
        x={0}
        y={480}
        ancho={736}
        centrado
        tamano={23}
        peso={600}
        color="#8C8AA0"
      >
        {s.detalle}
      </Texto>
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 548,
          width: 614,
          height: 2,
          backgroundColor: "#ECECF2",
        }}
      />
      <Texto x={61} y={578} tamano={23} peso={600} color="#7A7890">
        Vencimiento
      </Texto>
      <Texto x={675} y={578} tamano={23} peso={800} color="#2B2940" derecha>
        {datos.vencimiento}
      </Texto>
      <Texto
        x={0}
        y={650}
        ancho={736}
        centrado
        tamano={23}
        peso={600}
        color="#7A7890"
      >
        Total a pagar
      </Texto>
      <Texto
        x={0}
        y={686}
        ancho={736}
        centrado
        tamano={70}
        peso={800}
        color={AZUL}
        style={{ fontFamily: fuenteTitulos }}
      >
        $ {formatoNumero(datos.monto, 2)}
      </Texto>
      <BotonApp
        y={880}
        texto="PAGAR"
        presionado={interpolate(f, [156, 160, 168], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </PantallaInterna>
  );
};

export const VideoServicios: React.FC<DatosServicios> = (datos) => {
  const inicio = () => (
    <PantallaInicio
      saludo={datos.saludo}
      tna={datos.tna}
      fecha={fechaISO(datos.fecha)}
    />
  );
  const pasos: Paso[] = [
    { titulo: datos.promesa, duracion: 150, pantalla: inicio },
    {
      titulo: datos.pasoBoton,
      duracion: 210,
      entra: "igual",
      pantalla: inicio,
      toques: [{ x: 149, y: 380, en: 120 }],
    },
    {
      titulo: datos.pasoServicio,
      duracion: 270,
      pantalla: (f) => (
        <PantallaListaServicios
          datos={datos}
          resaltar={interpolate(f, [146, 154], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      ),
      toques: [{ x: 368, y: 540, en: 150 }],
    },
    {
      titulo: datos.pasoPagar,
      duracion: 240,
      pantalla: (f) => <PantallaFactura datos={datos} f={f} />,
      toques: [{ x: 368, y: 914, en: 160 }],
    },
    {
      titulo: datos.pasoExito,
      duracion: 210,
      pantalla: (f) => (
        <PantallaExito
          f={f}
          tituloPantalla="Servicios"
          titulo="¡Servicio pagado!"
          monto={`$ ${formatoNumero(datos.monto, 2)}`}
          lineas={[
            `${datos.servicios[0].nombre} · ${datos.servicios[0].detalle}`,
            datos.fecha,
          ]}
        />
      ),
    },
  ];
  const inicios = calcularInicios(pasos);
  const iconosDato = [
    <IcRayo key="r" tamano={84} />,
    <IcLlama key="l" tamano={84} />,
    <IcGota key="g" tamano={84} />,
    <IcWifi key="w" tamano={84} color="#B497FF" />,
    <IcCelular key="c" tamano={84} color="#fff" />,
    <IcDocumentoLineas key="d" tamano={84} color="#fff" />,
    <IcRayo key="r2" tamano={84} />,
    <IcGota key="g2" tamano={84} />,
  ];

  return (
    <BaseTutorial
      musica="musica-servicios.wav"
      volumenMusica={datos.volumenMusica}
      volumenEfectos={datos.volumenEfectos}
    >
      <Efecto archivo="whoosh" en={111} volumen={0.35} />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Gancho (0–2 s)"
          durationInFrames={120 + 15}
        >
          <GanchoServicios datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Recorrido en la app (2–20 s)"
          durationInFrames={1080 + 15}
        >
          <RecorridoApp pasos={pasos} />
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
            iconos={iconosDato}
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
