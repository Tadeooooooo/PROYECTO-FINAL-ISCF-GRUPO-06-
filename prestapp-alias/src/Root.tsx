import React from "react";
import { Composition } from "remotion";
import { Reel } from "./Reel";
import { videoAlias } from "./videos/alias";
import { videoFavoritos } from "./videos/favoritos";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PrestappAlias" component={Reel} durationInFrames={videoAlias.duracion} fps={30} width={1080} height={1920} defaultProps={{ video: videoAlias }} />
    <Composition id="PrestappFavoritos" component={Reel} durationInFrames={videoFavoritos.duracion} fps={30} width={1080} height={1920} defaultProps={{ video: videoFavoritos }} />
  </>
);
