import React from "react";
import { AbsoluteFill } from "remotion";
import { altoCelular, Celular } from "../../componentes/Celular";
import { PantallaApp } from "../../componentes/PantallaApp";
import { datosRendimientos } from "../../datos/rendimientos";
import { PantallaMiCuenta } from "../../tutoriales/biometria/VideoBiometria";
import { PantallaEscaneo } from "../../tutoriales/qr/VideoQR";
import { PantallaCompanias } from "../../tutoriales/recargas/VideoRecargas";
import { datosRecargas } from "../../tutoriales/recargas/datos";
import { PantallaListaServicios } from "../../tutoriales/servicios/VideoServicios";
import { datosServicios } from "../../tutoriales/servicios/datos";
import { PantallaAlias } from "../../tutoriales/transferencias/VideoTransferencias";
import { datosTransferencias } from "../../tutoriales/transferencias/datos";
import { calcularSimulacion, fechaMenosDias } from "../../utils/numeros";

// Pantallas del celular para las portadas: una imagen por video, sin fondo.
// Se exportan a 3x (3300 px de ancho) para que se vean nítidas al agrandarlas.
export const ANCHO_CELULAR = 900;
const MARGEN = { lados: 100, arriba: 80, abajo: 260 }; // aire para la sombra
export const ANCHO_PORTADA = ANCHO_CELULAR + 2 * MARGEN.lados;
export const ALTO_PORTADA = Math.round(altoCelular(ANCHO_CELULAR)) + MARGEN.arriba + MARGEN.abajo;

const inicioRendimientos = () => {
  const d = datosRendimientos;
  const { rendimientoDiario, tnaTexto } = calcularSimulacion(d);
  const movimientos = [...Array(10).keys()].map((i) => ({
    fecha: fechaMenosDias(d.fechaUltimaAcreditacion, i),
    monto: rendimientoDiario,
  }));
  return (
    <PantallaApp
      saldo={d.montoEjemplo + 3 * rendimientoDiario}
      tnaTexto={tnaTexto}
      movimientos={movimientos}
      concepto={d.conceptoMovimiento}
      tituloMovimientos={d.tituloMovimientos}
      verMas={d.verMas}
      desplazamiento={0}
    />
  );
};

// Pantalla característica de cada video (la del paso más reconocible del recorrido).
const PANTALLAS: Record<string, () => React.ReactNode> = {
  rendimientos: inicioRendimientos,
  qr: () => <PantallaEscaneo f={60} />,
  transferencias: () => (
    <PantallaAlias datos={datosTransferencias} f={30 + datosTransferencias.alias.length * 3 + 24} />
  ),
  recargas: () => <PantallaCompanias datos={datosRecargas} resaltar={0} />,
  servicios: () => <PantallaListaServicios datos={datosServicios} resaltar={0} />,
  biometria: () => <PantallaMiCuenta desplazamiento={800} encendido={1} />,
};

export const NOMBRES_PORTADAS = Object.keys(PANTALLAS);

export const PortadaCelular: React.FC<{ readonly video: string }> = ({ video }) => (
  <AbsoluteFill>
    <Celular ancho={ANCHO_CELULAR} style={{ left: MARGEN.lados, top: MARGEN.arriba }}>
      {PANTALLAS[video]()}
    </Celular>
  </AbsoluteFill>
);
