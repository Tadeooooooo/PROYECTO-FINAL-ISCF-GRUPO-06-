import React from "react";
import { Composition } from "remotion";
import { DURACION, FPS } from "./guion";
import { Reel } from "./Reel";

export const RemotionRoot: React.FC = () => (
  <Composition id="PrestappAlias" component={Reel} durationInFrames={DURACION} fps={FPS} width={1080} height={1920} />
);
