import React from "react";
import { Composition } from "remotion";
import guion from "./guion.json";
import { Spot } from "./Spot";

export const RemotionRoot: React.FC = () => (
  <Composition id="PrestappSpot" component={Spot} durationInFrames={guion.duracion} fps={guion.fps} width={1920} height={1080} />
);
