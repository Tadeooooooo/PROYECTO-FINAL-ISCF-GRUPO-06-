import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

// Tiempo de contenido de un capítulo. Las pausas de lectura congelan la imagen: durante una pausa el cuadro de
// contenido se queda fijo y después sigue corrido. Los componentes de los capítulos leen el tiempo con useCuadro().
export type Pausa = { en: number; cuadros: number };
export const Remapeo = createContext<(f: number) => number>((f) => f);
export const useCuadro = () => useContext(Remapeo)(useCurrentFrame());

// Cuadro real del capítulo -> cuadro de contenido.
export const aContenido = (pausas: Pausa[], real: number) => {
  let corrido = 0;
  for (const p of pausas) {
    const inicio = p.en + corrido;
    if (real < inicio) break;
    if (real < inicio + p.cuadros) return p.en;
    corrido += p.cuadros;
  }
  return real - corrido;
};
