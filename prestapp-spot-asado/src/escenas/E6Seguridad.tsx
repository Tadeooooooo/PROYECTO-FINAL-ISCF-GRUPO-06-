import React from "react";
import { AbsoluteFill, spring} from "remotion";
import { CENTRO_CEL, ANCHO_CELULAR } from "../componentes/Celular";
import { CheckVerde, IconoHuella } from "../componentes/Iconos";
import { Chip, MAX_SALIDA, Revelar } from "../componentes/Texto";
import { C, escena, RESORTE, sale as curvaSalida, tramo, useCuadro, FPS_BASE } from "../marca";

// 6 · Seguridad: título + chip de biometría. Una huella de trazo fino se dibuja junto al celular y termina en un check.
export const E6Seguridad: React.FC = () => {
  const f = useCuadro();
  const e = escena(6);
  const entra = e.textos[0].entra - e.desde;
  const entraChip = e.textos[1].entra - e.desde;
  const sale = e.sale - e.desde;
  const abs = (x: number) => x - e.desde;
  const insignia = spring({ frame: f - abs(970), fps: FPS_BASE, config: RESORTE });
  const dibujo = tramo(f, abs(980), abs(1030));
  const check = spring({ frame: f - abs(1034), fps: FPS_BASE, config: RESORTE });
  const marca = tramo(f, abs(1038), abs(1052));
  const s = tramo(f, sale, sale + MAX_SALIDA, curvaSalida);
  const diam = 240;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", paddingLeft: 150, gap: 48 }}>
        <Revelar lineas={["Tu dinero,", "*protegido.*"]} entra={entra} sale={sale} tamano={112} salidaX={-260} palabrasBloque={6} />
        <div>
          <Chip icono={<IconoHuella tamano={64} />} texto="Ingreso con biometría" entra={entraChip} sale={sale} salidaX={-260} />
        </div>
      </AbsoluteFill>
      {/* Insignia de huella apoyada sobre el borde izquierdo del celular */}
      <div
        style={{
          position: "absolute",
          left: CENTRO_CEL.x - ANCHO_CELULAR / 2 - diam / 2 - 10,
          top: 640,
          width: diam,
          height: diam,
          borderRadius: "50%",
          backgroundColor: C.noche,
          border: "2px solid rgba(255,255,255,0.35)",
          boxShadow: "0 24px 60px rgba(8,10,40,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          scale: String(insignia),
          opacity: 1 - s,
          translate: `${-260 * s}px 0px`,
        }}
      >
        <IconoHuella tamano={150} progreso={dibujo} grosor={2.4} />
        <div style={{ position: "absolute", right: -14, bottom: -6 }}>
          <CheckVerde tamano={92} escala={check} trazo={marca} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
