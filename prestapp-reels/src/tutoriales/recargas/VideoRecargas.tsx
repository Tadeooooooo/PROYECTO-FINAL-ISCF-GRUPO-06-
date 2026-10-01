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
import { Efecto } from "../../componentes/Sonido";
import { Titular, ZonaTitular } from "../../componentes/Titular";
import { Escena09Cierre } from "../../escenas/Escena09Cierre";
import { colores, fuenteTexto, fuenteTitulos } from "../../marca/marca";
import { fechaISO, formatoNumero } from "../../utils/numeros";
import {
  BotonApp,
  Campo,
  FilaLista,
  PantallaExito,
  PantallaInicio,
  PantallaInterna,
  PantallaMenu,
  Texto,
  Y_MENU,
} from "../comun/app";
import { BaseTutorial, EMPUJE, FUNDIDO, GanchoBase } from "../comun/escenas";
import { IcCelular, Inicial } from "../comun/iconos";
import { calcularInicios, Paso, RecorridoApp } from "../comun/RecorridoApp";
import type { DatosRecargas } from "./datos";

const AZUL = colores.azulApp;
const SCROLL_MENU = 900;

const GanchoRecargas: React.FC<{ readonly datos: DatosRecargas }> = ({
  datos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const nivel = interpolate(frame, [14, 80], [1, 0.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const color =
    nivel > 0.4 ? colores.verde : nivel > 0.2 ? "#F2B01E" : "#E5484D";
  return (
    <GanchoBase texto={datos.gancho}>
      <div
        style={{
          position: "relative",
          width: 360,
          height: 640,
          scale: String(0.85 + 0.15 * entra),
          opacity: Math.min(1, entra * 1.5),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 64,
            border: "12px solid #fff",
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 140,
            width: 80,
            height: 16,
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 230,
            textAlign: "center",
            fontFamily: fuenteTitulos,
            fontWeight: 800,
            fontSize: 56,
            color: "#fff",
          }}
        >
          Crédito
        </div>
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            top: 330,
            height: 90,
            borderRadius: 24,
            border: "6px solid #fff",
            padding: 8,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: `${nivel * 100}%`,
              height: "100%",
              borderRadius: 14,
              backgroundColor: color,
            }}
          />
        </div>
        {nivel < 0.15 && (
          <div
            style={{
              position: "absolute",
              left: 150,
              top: 460,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#E5484D",
              color: "#fff",
              fontFamily: fuenteTitulos,
              fontWeight: 800,
              fontSize: 44,
              textAlign: "center",
              lineHeight: "60px",
              opacity: Math.floor(frame / 10) % 2 === 0 ? 1 : 0.4,
            }}
          >
            !
          </div>
        )}
      </div>
    </GanchoBase>
  );
};

const PantallaCompanias: React.FC<{
  readonly datos: DatosRecargas;
  readonly resaltar: number;
}> = ({ datos, resaltar }) => (
  <PantallaInterna titulo="Recargar">
    <Texto x={61} y={281} tamano={22} peso={500}>
      Seleccioná el servicio
    </Texto>
    {datos.companias.map((c, i) => (
      <FilaLista
        key={c}
        x={61}
        ancho={614}
        y={329 + i * 120}
        texto={c}
        colorTexto="#55536A"
        icono={<Inicial letra={datos.iniciales[i] ?? c[0]} tamano={64} />}
        resaltado={i === 0 ? resaltar : 0}
      />
    ))}
  </PantallaInterna>
);

const PantallaFormulario: React.FC<{
  readonly datos: DatosRecargas;
  readonly f: number;
}> = ({ datos, f }) => {
  const escritos = Math.max(
    0,
    Math.min(datos.numero.length, Math.floor((f - 20) / 4) + 1),
  );
  const montoListo = f >= 110;
  const abierto = f >= 92 && f < 110;
  const listo = interpolate(f, [112, 122], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <PantallaInterna titulo="Recargar">
      <Texto x={61} y={257} tamano={27} peso={800} color={AZUL}>
        {datos.companias[0].toUpperCase()}
      </Texto>
      <Texto x={61} y={303} tamano={21} peso={700}>
        Ingresá los datos para la búsqueda:
      </Texto>
      <Texto x={61} y={370} tamano={20} peso={700}>
        Nro Teléfono:
      </Texto>
      <Campo
        y={402}
        valor={datos.numero.slice(0, escritos)}
        cursor={f < 80 && Math.floor(f / 15) % 2 === 0}
        enfocado={f < 80}
      />
      <Texto x={61} y={494} tamano={20} peso={700}>
        Monto:
      </Texto>
      <Campo
        y={527}
        valor={montoListo ? `$ ${formatoNumero(datos.monto)}` : ""}
        flecha
        enfocado={abierto}
      />
      {abierto && (
        <div
          style={{
            position: "absolute",
            left: 61,
            top: 594,
            width: 614,
            borderRadius: 10,
            backgroundColor: "#fff",
            boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
            overflow: "hidden",
          }}
        >
          {[500, 1000, datos.monto, 5000]
            .filter((v, i, a) => a.indexOf(v) === i)
            .map((v) => (
              <div
                key={v}
                style={{
                  height: 62,
                  padding: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  fontFamily: fuenteTexto,
                  fontSize: 24,
                  fontWeight: 700,
                  color: v === datos.monto ? "#fff" : "#4A4860",
                  backgroundColor:
                    v === datos.monto && f >= 102 ? AZUL : "transparent",
                }}
              >
                $ {formatoNumero(v)}
              </div>
            ))}
        </div>
      )}
      <BotonApp
        y={1431}
        texto="CONTINUAR"
        activo={listo}
        presionado={interpolate(f, [196, 200, 208], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
    </PantallaInterna>
  );
};

/** Dato: las compañías aparecen como fichas de texto (sin logos). */
const DatoRecargas: React.FC<{ readonly datos: DatosRecargas }> = ({
  datos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <ZonaTitular>
        <Titular
          texto={datos.datoTitulo}
          desde={4}
          tamano={96}
          retrasoPorPalabra={5}
        />
      </ZonaTitular>
      <div
        style={{
          position: "absolute",
          top: 620,
          left: 140,
          right: 140,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {datos.datoCompanias.map((c, i) => {
          const entra = spring({
            frame: frame - 14 - i * 7,
            fps,
            config: { damping: 12, stiffness: 170 },
          });
          return (
            <div
              key={c}
              style={{
                height: 130,
                borderRadius: 65,
                backgroundColor: "rgba(255,255,255,0.08)",
                border: `3px solid ${colores.verde}`,
                display: "flex",
                alignItems: "center",
                gap: 26,
                padding: "0 36px",
                fontFamily: fuenteTitulos,
                fontWeight: 800,
                fontSize: 64,
                color: "#fff",
                opacity: frame >= 14 + i * 7 ? Math.min(1, entra * 1.5) : 0,
                translate: `${(1 - entra) * (i % 2 ? 120 : -120)}px 0px`,
              }}
            >
              <IcCelular tamano={64} color={colores.verde} />
              {c}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const VideoRecargas: React.FC<DatosRecargas> = (datos) => {
  const inicio = () => (
    <PantallaInicio
      saludo={datos.saludo}
      tna={datos.tna}
      fecha={fechaISO(datos.fecha)}
    />
  );
  const scroll = (f: number) =>
    interpolate(f, [24, 96], [0, SCROLL_MENU], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    });
  const pasos: Paso[] = [
    { titulo: datos.promesa, duracion: 150, pantalla: inicio },
    {
      titulo: datos.pasoMenu,
      duracion: 180,
      entra: "igual",
      pantalla: inicio,
      camara: [
        [10, 0],
        [60, -420],
      ],
      toques: [{ x: 638, y: 1457, en: 120 }],
    },
    {
      titulo: datos.pasoRecargas,
      duracion: 210,
      pantalla: (f) => (
        <PantallaMenu
          desplazamiento={scroll(f)}
          resaltar="Recargar prepagos"
          nivel={interpolate(f, [140, 150], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      ),
      toques: [
        { x: 368, y: Y_MENU["Recargar prepagos"] - SCROLL_MENU, en: 150 },
      ],
    },
    {
      titulo: datos.pasoCompania,
      duracion: 210,
      pantalla: (f) => (
        <PantallaCompanias
          datos={datos}
          resaltar={interpolate(f, [116, 124], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
        />
      ),
      toques: [{ x: 368, y: 379, en: 120 }],
    },
    {
      titulo: datos.pasoDatos,
      duracion: 240,
      pantalla: (f) => <PantallaFormulario datos={datos} f={f} />,
      camara: [
        [12, 0],
        [130, 0],
        [170, -440],
      ],
      toques: [
        { x: 368, y: 559, en: 92 },
        { x: 368, y: 1465, en: 200 },
      ],
    },
    {
      titulo: datos.pasoExito,
      duracion: 180,
      pantalla: (f) => (
        <PantallaExito
          f={f}
          tituloPantalla="Recargar"
          titulo="¡Recarga lista!"
          monto={`$ ${formatoNumero(datos.monto, 2)}`}
          lineas={[datos.companias[0], datos.numero]}
        />
      ),
    },
  ];
  const inicios = calcularInicios(pasos);

  return (
    <BaseTutorial
      musica="musica-recargas.wav"
      volumenMusica={datos.volumenMusica}
      volumenEfectos={datos.volumenEfectos}
    >
      <Efecto archivo="whoosh" en={111} volumen={0.35} />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Gancho (0–2 s)"
          durationInFrames={120 + 15}
        >
          <GanchoRecargas datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Recorrido en la app (2–21,5 s)"
          durationInFrames={1170 + 15}
        >
          <RecorridoApp pasos={pasos} />
          <Sequence from={inicios[5]} layout="none">
            <Efecto archivo="exito" en={4} volumen={0.6} />
          </Sequence>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Dato (21,5–24,5 s)"
          durationInFrames={180 + 20}
        >
          <DatoRecargas datos={datos} />
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
