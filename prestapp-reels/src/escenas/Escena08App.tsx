import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Celular } from "../componentes/Celular";
import { PantallaApp } from "../componentes/PantallaApp";
import { Titular, ZonaTitular } from "../componentes/Titular";
import type { DatosVideo } from "../datos/rendimientos";
import { CELULAR } from "../marca/marca";
import { calcularSimulacion, fechaMenosDias } from "../utils/numeros";

// Escena 8 · 21,5–24,5 s · La lista de acreditaciones de la app se llena sola, como una grabación de pantalla.
const NUEVAS = [34, 74, 114]; // cuadros en que entra cada acreditación nueva

export const Escena08App: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rendimientoDiario, tnaTexto } = calcularSimulacion(datos);

  // Las 3 más nuevas entran de a una arriba de todo; debajo quedan las anteriores.
  const nuevas = NUEVAS.map((cuadro, i) => ({
    fecha: fechaMenosDias(datos.fechaUltimaAcreditacion, NUEVAS.length - 1 - i),
    monto: rendimientoDiario,
    aparicion: spring({ frame: frame - cuadro, fps, config: { damping: 18, stiffness: 160 } }),
    brillo: frame < cuadro ? 0 : interpolate(frame - cuadro, [0, 10, 50], [0, 1, 0], { extrapolateRight: "clamp" }),
  })).reverse();
  const anteriores = [...Array(7).keys()].map((i) => ({
    fecha: fechaMenosDias(datos.fechaUltimaAcreditacion, NUEVAS.length + i),
    monto: rendimientoDiario,
  }));

  return (
    <AbsoluteFill>
      <ZonaTitular>
        <Titular texto={datos.enLaApp} desde={8} tamano={96} retrasoPorPalabra={5} />
      </ZonaTitular>

      <Celular ancho={CELULAR.ancho} style={{ left: (1080 - CELULAR.ancho) / 2, top: CELULAR.arriba }}>
        <PantallaApp
          saldo={datos.montoEjemplo + 3 * rendimientoDiario}
          tnaTexto={tnaTexto}
          movimientos={[...nuevas, ...anteriores]}
          concepto={datos.conceptoMovimiento}
          tituloMovimientos={datos.tituloMovimientos}
          verMas={datos.verMas}
          desplazamiento={interpolate(frame, [0, 200], [470, 540])}
        />
      </Celular>
    </AbsoluteFill>
  );
};
