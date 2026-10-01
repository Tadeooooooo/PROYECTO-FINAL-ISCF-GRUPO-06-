import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, staticFile } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Fondo } from "./componentes/Fondo";
import { LineaLegal } from "./componentes/LineaLegal";
import { Efecto, ProveedorSonido } from "./componentes/Sonido";
import type { DatosVideo } from "./datos/rendimientos";
import { BloqueCelular } from "./escenas/BloqueCelular";
import { BloqueSimulacion } from "./escenas/BloqueSimulacion";
import { Escena01Gancho } from "./escenas/Escena01Gancho";
import { Escena08App } from "./escenas/Escena08App";
import { Escena09Cierre } from "./escenas/Escena09Cierre";
import { Escena10Legal } from "./escenas/Escena10Legal";

// Video completo: 30 s a 60 fps = 1800 cuadros.
// Cada bloque dura lo que dice el storyboard + los cuadros de la transición que lo sigue
// (las transiciones se superponen, por eso se suman).
const empuje = {
  presentation: slide({ direction: "from-bottom" }),
  timing: linearTiming({
    durationInFrames: 15,
    easing: Easing.inOut(Easing.cubic),
  }),
};
const fundido = {
  presentation: fade(),
  timing: linearTiming({ durationInFrames: 20 }),
};

export const VideoRendimientos: React.FC<DatosVideo> = (datos) => (
  <ProveedorSonido volumenEfectos={datos.volumenEfectos}>
    <AbsoluteFill>
      {datos.volumenMusica > 0 && (
        <Audio
          src={staticFile("audio/musica.wav")}
          volume={Math.min(1, datos.volumenMusica)}
        />
      )}
      {/* Un solo whoosh, en la primera transición (sonido reducido) */}
      <Efecto archivo="whoosh" en={111} volumen={0.35} />
      <Fondo />
      <TransitionSeries>
        <TransitionSeries.Sequence
          name="1 · Gancho (0–2 s)"
          durationInFrames={120 + 15}
        >
          <Escena01Gancho datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...empuje} />
        <TransitionSeries.Sequence
          name="2 a 5 · Celular (2–14 s)"
          durationInFrames={720 + 15}
        >
          <BloqueCelular datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...empuje} />
        <TransitionSeries.Sequence
          name="6 y 7 · Simulación (14–21,5 s)"
          durationInFrames={450 + 15}
        >
          <BloqueSimulacion datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...empuje} />
        <TransitionSeries.Sequence
          name="8 · En la app (21,5–24,5 s)"
          durationInFrames={180 + 20}
        >
          <Escena08App datos={datos} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fundido} />
        <TransitionSeries.Sequence
          name="9 · Cierre (24,5–27 s)"
          durationInFrames={150 + 20}
        >
          <Escena09Cierre datos={datos} sonidos="minimo" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition {...fundido} />
        <TransitionSeries.Sequence
          name="10 · Legal (27–30 s)"
          durationInFrames={180}
        >
          <Escena10Legal datos={datos} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      {/* Aviso legal chico y fijo hasta que aparece la placa legal completa */}
      <LineaLegal texto={datos.disclaimer} ocultarDesde={1620} />
    </AbsoluteFill>
  </ProveedorSonido>
);
