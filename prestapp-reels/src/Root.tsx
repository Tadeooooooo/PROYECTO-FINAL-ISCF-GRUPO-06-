import "./index.css";
import { Composition, Folder } from "remotion";
import { datosRendimientos } from "./datos/rendimientos";
import { VideoRendimientos } from "./Video";
import { datosQR } from "./tutoriales/qr/datos";
import { VideoQR } from "./tutoriales/qr/VideoQR";
import { datosTransferencias } from "./tutoriales/transferencias/datos";
import { VideoTransferencias } from "./tutoriales/transferencias/VideoTransferencias";
import { datosRecargas } from "./tutoriales/recargas/datos";
import { VideoRecargas } from "./tutoriales/recargas/VideoRecargas";
import { datosServicios } from "./tutoriales/servicios/datos";
import { VideoServicios } from "./tutoriales/servicios/VideoServicios";
import { datosBiometria } from "./tutoriales/biometria/datos";
import { VideoBiometria } from "./tutoriales/biometria/VideoBiometria";
import { datosLink } from "./piezas/link/datos";
import { duracionLink, LinkPrestapp } from "./piezas/link/LinkPrestapp";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PrestappRendimientos"
        component={VideoRendimientos}
        durationInFrames={1800}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={datosRendimientos}
      />
      <Folder name="Tutoriales">
        <Composition
          id="PrestappQR"
          component={VideoQR}
          durationInFrames={1800}
          fps={60}
          width={1080}
          height={1920}
          defaultProps={datosQR}
        />
        <Composition
          id="PrestappTransferencias"
          component={VideoTransferencias}
          durationInFrames={1800}
          fps={60}
          width={1080}
          height={1920}
          defaultProps={datosTransferencias}
        />
        <Composition
          id="PrestappRecargas"
          component={VideoRecargas}
          durationInFrames={1800}
          fps={60}
          width={1080}
          height={1920}
          defaultProps={datosRecargas}
        />
        <Composition
          id="PrestappServicios"
          component={VideoServicios}
          durationInFrames={1800}
          fps={60}
          width={1080}
          height={1920}
          defaultProps={datosServicios}
        />
        <Composition
          id="PrestappBiometria"
          component={VideoBiometria}
          durationInFrames={1800}
          fps={60}
          width={1080}
          height={1920}
          defaultProps={datosBiometria}
        />
      </Folder>
      <Folder name="Piezas">
        {/* Sin fondo (transparente) */}
        <Composition
          id="LinkPrestapp"
          component={LinkPrestapp}
          durationInFrames={300}
          fps={60}
          width={1080}
          height={320}
          defaultProps={datosLink}
          calculateMetadata={({ props }) => ({ durationInFrames: duracionLink(props) })}
        />
        {/* Con fondo verde liso, para sacarlo con croma en editores que no leen transparencia */}
        <Composition
          id="LinkPrestappCroma"
          component={LinkPrestapp}
          durationInFrames={300}
          fps={60}
          width={1080}
          height={320}
          defaultProps={{ ...datosLink, fondo: "#00FF00", sombra: false }}
          calculateMetadata={({ props }) => ({ durationInFrames: duracionLink(props) })}
        />
      </Folder>
    </>
  );
};
