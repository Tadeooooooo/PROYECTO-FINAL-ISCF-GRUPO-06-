import "./index.css";
import { Composition } from "remotion";
import { datosRendimientos } from "./datos/rendimientos";
import { VideoRendimientos } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PrestappRendimientos"
      component={VideoRendimientos}
      durationInFrames={1800}
      fps={60}
      width={1080}
      height={1920}
      defaultProps={datosRendimientos}
    />
  );
};
