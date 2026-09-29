import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Celular } from "../componentes/Celular";
import { PantallaApp } from "../componentes/PantallaApp";
import type { DatosVideo } from "../datos/rendimientos";
import { CELULAR } from "../marca/marca";
import { calcularSimulacion, fechaMenosDias } from "../utils/numeros";
import { Escena02Promesa } from "./Escena02Promesa";
import { Escena03SinMinimo } from "./Escena03SinMinimo";
import { diasAcreditadosEscena04, Escena04Diario } from "./Escena04Diario";
import { Escena05SinHacerNada, LLEGA_NOTIFICACION } from "./Escena05SinHacerNada";

// Escenas 2 a 5 comparten el mismo celular (un solo plano, como una grabación de pantalla).
// Cada escena suma su título y sus elementos encima.
export const DURACION_ESCENA = 180; // 3 s a 60 fps
const INICIO = { e2: 0, e3: 180, e4: 360, e5: 540 };

export const BloqueCelular: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { rendimientoDiario, tnaTexto } = calcularSimulacion(datos);

  const entrada = spring({ frame: frame - 4, fps, config: { damping: 22, stiffness: 90, mass: 1 } });
  const zoom = interpolate(frame, [INICIO.e3, INICIO.e3 + 50], [1, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const oscuridad = interpolate(frame, [INICIO.e3 + 8, INICIO.e3 + 28, INICIO.e5 - 10, INICIO.e5 + 20], [0, 0.4, 0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dias =
    diasAcreditadosEscena04(frame - INICIO.e4) + (frame - INICIO.e5 >= LLEGA_NOTIFICACION ? 1 : 0);
  const saldo = datos.montoEjemplo + dias * rendimientoDiario;
  const movimientos = [0, 1, 2, 3].map((i) => ({
    fecha: fechaMenosDias(datos.fechaUltimaAcreditacion, i),
    monto: rendimientoDiario,
  }));

  return (
    <AbsoluteFill>
      <Celular
        ancho={CELULAR.ancho}
        noche={oscuridad}
        style={{
          left: (1080 - CELULAR.ancho) / 2,
          top: CELULAR.arriba,
          translate: `0px ${(1 - entrada) * 1350}px`,
          scale: String(zoom),
          transformOrigin: "50% 0%",
        }}
      >
        <PantallaApp
          saldo={saldo}
          tnaTexto={tnaTexto}
          movimientos={movimientos}
          concepto={datos.conceptoMovimiento}
          tituloMovimientos={datos.tituloMovimientos}
          verMas={datos.verMas}
        />
      </Celular>

      <Sequence name="Escena 2 · Promesa" from={INICIO.e2} durationInFrames={DURACION_ESCENA}>
        <Escena02Promesa datos={datos} />
      </Sequence>
      <Sequence name="Escena 3 · Sin mínimo" from={INICIO.e3} durationInFrames={DURACION_ESCENA}>
        <Escena03SinMinimo datos={datos} />
      </Sequence>
      <Sequence name="Escena 4 · Todos los días" from={INICIO.e4} durationInFrames={DURACION_ESCENA}>
        <Escena04Diario datos={datos} />
      </Sequence>
      {/* La escena 5 dura 15 cuadros más: sigue visible mientras sale con la transición. */}
      <Sequence name="Escena 5 · Sin hacer nada" from={INICIO.e5} durationInFrames={DURACION_ESCENA + 15}>
        <Escena05SinHacerNada datos={datos} />
      </Sequence>
    </AbsoluteFill>
  );
};
