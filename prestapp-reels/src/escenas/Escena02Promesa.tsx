import React from "react";
import { AbsoluteFill } from "remotion";
import { Titular, ZonaTitular } from "../componentes/Titular";
import type { DatosVideo } from "../datos/rendimientos";

// Escena 2 · 2–5 s · Promesa. El celular lo dibuja BloqueCelular.
export const Escena02Promesa: React.FC<{ readonly datos: DatosVideo }> = ({ datos }) => (
  <AbsoluteFill>
    <ZonaTitular>
      <Titular texto={datos.promesa} desde={10} hasta={180} tamano={92} retrasoPorPalabra={12} escalonar="linea" />
    </ZonaTitular>
  </AbsoluteFill>
);
