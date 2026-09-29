import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import type { DatosVideo } from "../datos/rendimientos";
import { Escena06Simulacion } from "./Escena06Simulacion";
import { Escena07Resultado } from "./Escena07Resultado";

// Escenas 6 y 7 van en el mismo plano: solo cambia el contenido.
export const BloqueSimulacion: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => (
  <AbsoluteFill>
    <Sequence name="Escena 6 · Simulemos" durationInFrames={180}>
      <Escena06Simulacion datos={datos} />
    </Sequence>
    {/* 270 cuadros (4,5 s) + 15 de la transición de salida */}
    <Sequence name="Escena 7 · Resultado" from={180} durationInFrames={285}>
      <Escena07Resultado datos={datos} />
    </Sequence>
  </AbsoluteFill>
);
