import React, { createContext, useContext } from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";

// Volumen general de los efectos (sale del archivo de datos).
const VolumenEfectos = createContext(1);

export const ProveedorSonido: React.FC<{
  readonly volumenEfectos: number;
  readonly children: React.ReactNode;
}> = ({ volumenEfectos, children }) => (
  <VolumenEfectos.Provider value={volumenEfectos}>
    {children}
  </VolumenEfectos.Provider>
);

/**
 * Efecto de sonido que arranca en el cuadro `en` (contado desde el inicio de la escena).
 * Los archivos están en public/audio/sfx y los genera scripts/audio/generar_audio.py.
 */
export const Efecto: React.FC<{
  readonly archivo: string;
  readonly en: number;
  readonly volumen?: number;
}> = ({ archivo, en, volumen = 1 }) => {
  const general = useContext(VolumenEfectos);
  if (general <= 0) {
    return null;
  }
  return (
    <Sequence from={en} layout="none" name={`Sonido · ${archivo}`}>
      <Audio
        src={staticFile(`audio/sfx/${archivo}.wav`)}
        volume={Math.min(1, volumen * general)}
      />
    </Sequence>
  );
};
