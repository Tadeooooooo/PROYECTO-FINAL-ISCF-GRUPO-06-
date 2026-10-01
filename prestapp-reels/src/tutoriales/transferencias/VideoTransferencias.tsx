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
import { Celular } from "../../componentes/Celular";
import { IconoApp, IconoTilde } from "../../componentes/Iconos";
import { Efecto } from "../../componentes/Sonido";
import { Titular, ZonaTitular } from "../../componentes/Titular";
import { Escena09Cierre } from "../../escenas/Escena09Cierre";
import {
  CELULAR,
  colores,
  fuenteTexto,
  fuenteTitulos,
} from "../../marca/marca";
import { fechaISO, formatoNumero } from "../../utils/numeros";
import {
  BotonApp,
  Campo,
  GRIS_FILA,
  PantallaExito,
  PantallaInicio,
  PantallaInterna,
  POS_TECLA,
  Teclado,
  Texto,
} from "../comun/app";
import { BaseTutorial, EMPUJE, FUNDIDO, GanchoBase } from "../comun/escenas";
import { IcCamara, IcChevron, IcPersonaMas } from "../comun/iconos";
import { calcularInicios, Paso, RecorridoApp } from "../comun/RecorridoApp";
import type { DatosTransferencias } from "./datos";

const AZUL = colores.azulApp;

/** Celular de línea simple para la ilustración del gancho. */
const CelularIcono: React.FC<{
  readonly children?: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      position: "absolute",
      width: 230,
      height: 420,
      borderRadius: 44,
      border: "10px solid #fff",
      boxSizing: "border-box",
      backgroundColor: "rgba(255,255,255,0.06)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 18,
        width: 60,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#fff",
      }}
    />
    {children}
  </div>
);

const Billete: React.FC<{ readonly style?: React.CSSProperties }> = ({
  style,
}) => (
  <div
    style={{
      position: "absolute",
      width: 190,
      height: 110,
      borderRadius: 18,
      backgroundColor: colores.verde,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 16px 40px ${colores.verde}55`,
      ...style,
    }}
  >
    <div
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(255,255,255,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fuenteTitulos,
        fontWeight: 800,
        fontSize: 52,
        color: "#fff",
      }}
    >
      $
    </div>
  </div>
);

const GanchoTransferencias: React.FC<{
  readonly datos: DatosTransferencias;
}> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const viaje = interpolate(frame, [18, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const llega = spring({
    frame: frame - 70,
    fps,
    config: { damping: 10, stiffness: 180 },
  });
  return (
    <GanchoBase texto={datos.gancho}>
      <div style={{ position: "relative", width: 920, height: 520 }}>
        <CelularIcono style={{ left: 30, top: 50 }} />
        <CelularIcono
          style={{
            right: 30,
            top: 50,
            borderColor: frame > 70 ? colores.verde : "#fff",
          }}
        >
          <div
            style={{
              scale: String(llega),
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: colores.verde,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconoTilde tamano={80} color="#fff" />
          </div>
        </CelularIcono>
        {frame < 74 && (
          <Billete
            style={{
              left: 50 + viaje * 630,
              top: 205 - Math.sin(viaje * Math.PI) * 170,
              rotate: `${-12 + viaje * 24}deg`,
              scale: String(1 - 0.35 * viaje),
            }}
          />
        )}
      </div>
    </GanchoBase>
  );
};

const PantallaAlias: React.FC<{
  readonly datos: DatosTransferencias;
  readonly f: number;
}> = ({ datos, f }) => {
  const escritos = Math.max(
    0,
    Math.min(datos.alias.length, Math.floor((f - 30) / 3) + 1),
  );
  const listo = interpolate(
    f,
    [30 + datos.alias.length * 3, 30 + datos.alias.length * 3 + 10],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <PantallaInterna titulo="Transferir">
      <Texto x={61} y={296} tamano={21} peso={700}>
        CVU, CBU o Alias:
      </Texto>
      <Campo
        y={335}
        ancho={504}
        valor={datos.alias.slice(0, escritos)}
        cursor={f >= 20 && Math.floor(f / 15) % 2 === 0}
        enfocado={f >= 20}
      />
      <div
        style={{
          position: "absolute",
          left: 582,
          top: 333,
          width: 89,
          height: 98,
          borderRadius: 22,
          backgroundColor: AZUL,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IcCamara tamano={38} />
      </div>
      <Texto x={61} y={488} tamano={28} peso={500} color={AZUL}>
        Últimos
      </Texto>
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 543,
          width: 614,
          height: 98,
          borderRadius: 10,
          backgroundColor: GRIS_FILA,
        }}
      >
        <IcPersonaMas
          tamano={30}
          style={{ position: "absolute", left: 24, top: 34 }}
        />
        <div
          style={{
            position: "absolute",
            left: 73,
            top: 34,
            fontFamily: fuenteTexto,
            fontSize: 23,
            color: "#6E6C80",
          }}
        >
          <b style={{ color: "#4A4860" }}>{datos.destinatario}</b> - Prestapp
        </div>
        <IcChevron
          tamano={30}
          style={{ position: "absolute", right: 30, top: 34 }}
        />
      </div>
      <BotonApp
        y={1467}
        x={57}
        ancho={622}
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

const TECLEOS = [30, 42, 54, 66, 78];
const PantallaMonto: React.FC<{
  readonly datos: DatosTransferencias;
  readonly f: number;
}> = ({ datos, f }) => {
  const digitos = String(datos.monto).slice(0, TECLEOS.length);
  const n = TECLEOS.filter((t) => f >= t).length;
  const valor = n ? formatoNumero(Number(digitos.slice(0, n))) : "";
  const presionada = TECLEOS.findIndex((t) => f >= t && f < t + 7);
  const listo = interpolate(f, [84, 94], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <PantallaInterna titulo="Transferir">
      <Texto x={61} y={284} tamano={22} peso={500} color={AZUL}>
        A:
      </Texto>
      <Texto x={61} y={316} tamano={28} peso={800} color={AZUL}>
        {datos.destinatario}
      </Texto>
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 452,
          display: "flex",
          alignItems: "center",
          fontFamily: fuenteTexto,
          color: AZUL,
        }}
      >
        <span style={{ fontSize: 50, fontWeight: 300 }}>$</span>
        <span style={{ fontSize: 50, fontWeight: 800, marginLeft: 14 }}>
          {valor}
        </span>
        <span
          style={{
            width: 3,
            height: 52,
            backgroundColor: AZUL,
            marginLeft: 4,
            opacity: Math.floor(f / 15) % 2 === 0 ? 1 : 0,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 61,
          top: 528,
          width: 614,
          height: 3,
          backgroundColor: AZUL,
        }}
      />
      <Texto x={61} y={570} tamano={20} peso={700}>
        Disponible:
      </Texto>
      <Texto x={61} y={604} tamano={22} peso={700} color="#8C8AA0">
        $ *********
      </Texto>
      <BotonApp
        y={879}
        texto="CONTINUAR"
        activo={listo}
        presionado={interpolate(f, [186, 190, 198], [0, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />
      <Teclado presionada={presionada >= 0 ? digitos[presionada] : null} />
    </PantallaInterna>
  );
};

/** Dato: el otro celular recibe la plata al instante. */
const DatoTransferencias: React.FC<{ readonly datos: DatosTransferencias }> = ({
  datos,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sube = spring({
    frame: frame - 2,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const noti = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  return (
    <AbsoluteFill>
      <Efecto archivo="notificacion" en={40} volumen={0.6} />
      <ZonaTitular>
        <Titular
          texto={datos.dato}
          desde={6}
          tamano={84}
          retrasoPorPalabra={4}
        />
      </ZonaTitular>
      <Celular
        ancho={CELULAR.ancho}
        style={{
          left: (1080 - CELULAR.ancho) / 2,
          top: CELULAR.arriba + 40,
          translate: `0px ${(1 - sube) * 900}px`,
        }}
      >
        <PantallaInicio
          saludo={datos.saludo}
          tna={datos.tna}
          fecha={fechaISO(datos.fecha)}
        />
      </Celular>
      <div
        style={{
          position: "absolute",
          left: 110,
          width: 860,
          top: 760,
          padding: "26px 30px",
          borderRadius: 40,
          backgroundColor: "rgba(255,255,255,0.97)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          gap: 28,
          opacity: frame >= 40 ? Math.min(1, noti * 2) : 0,
          translate: `0px ${(1 - noti) * -260}px`,
        }}
      >
        <IconoApp tamano={120} style={{ boxShadow: "0 0 0 2px #E6E6F0" }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div
            style={{
              fontFamily: fuenteTexto,
              fontWeight: 600,
              fontSize: 32,
              color: colores.grisTextoApp,
            }}
          >
            Prestapp · ahora
          </div>
          <div
            style={{
              fontFamily: fuenteTexto,
              fontWeight: 800,
              fontSize: 44,
              color: colores.textoOscuro,
            }}
          >
            Recibiste plata
          </div>
          <div
            style={{
              fontFamily: fuenteTitulos,
              fontWeight: 800,
              fontSize: 56,
              color: "#2E8F2A",
              letterSpacing: "-0.02em",
            }}
          >
            +$ {formatoNumero(datos.monto, 2)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const VideoTransferencias: React.FC<DatosTransferencias> = (datos) => {
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
      toques: [{ x: 368, y: 380, en: 120 }],
    },
    {
      titulo: datos.pasoAlias,
      duracion: 240,
      pantalla: (f) => <PantallaAlias datos={datos} f={f} />,
      camara: [
        [12, 0],
        [100, 0],
        [150, -440],
      ],
      toques: [{ x: 368, y: 1501, en: 200 }],
    },
    {
      titulo: datos.pasoMonto,
      duracion: 240,
      pantalla: (f) => <PantallaMonto datos={datos} f={f} />,
      camara: [[20, -300]],
      toques: [
        ...TECLEOS.map((en, i) => ({
          ...POS_TECLA(String(datos.monto)[i] ?? "0"),
          en,
        })),
        { x: 368, y: 913, en: 190 },
      ],
    },
    {
      titulo: datos.pasoExito,
      duracion: 270,
      pantalla: (f) => (
        <PantallaExito
          f={f}
          tituloPantalla="Transferir"
          titulo="¡Transferencia enviada!"
          monto={`$ ${formatoNumero(datos.monto, 2)}`}
          lineas={[`A ${datos.destinatario}`, "Acreditación inmediata"]}
        />
      ),
    },
  ];
  const inicios = calcularInicios(pasos);

  return (
    <BaseTutorial
      musica="musica-transferencias.wav"
      volumenMusica={datos.volumenMusica}
      volumenEfectos={datos.volumenEfectos}
    >
      <Efecto archivo="whoosh" en={111} volumen={0.35} />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="Gancho (0–2 s)"
          durationInFrames={120 + 15}
        >
          <GanchoTransferencias datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Recorrido en la app (2–20,5 s)"
          durationInFrames={1110 + 15}
        >
          <RecorridoApp pasos={pasos} />
          <Sequence from={inicios[4]} layout="none">
            <Efecto archivo="exito" en={4} volumen={0.6} />
          </Sequence>
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...EMPUJE} />
        <TransitionSeries.Sequence
          name="Dato (20,5–24,5 s)"
          durationInFrames={240 + 20}
        >
          <DatoTransferencias datos={datos} />
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
