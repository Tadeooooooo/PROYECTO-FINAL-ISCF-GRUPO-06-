import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Celular } from "./componentes/Celular";
import { Fondo } from "./componentes/Fondo";
import { Chip, LogoPastilla, Titulo } from "./componentes/Marca";
import { Encabezado } from "./componentes/Encabezado";
import { CIERRE, INTRO, PASOS, WHOOSH } from "./guion";
import { C, cruce, EJE_X, INTER, POPPINS, RESORTE, sale, tramo } from "./marca";

// Logo en pastilla: grande en la intro, chico arriba al centro durante los pasos y el cierre.
const Logo: React.FC = () => {
  const f = useCurrentFrame();
  const aparece = spring({ frame: f - 4, fps: 30, config: RESORTE });
  const sube = tramo(f, INTRO.hasta - 14, INTRO.hasta + 10, cruce);
  const ancho = interpolate(sube, [0, 1], [440, 220]);
  const arriba = interpolate(sube, [0, 1], [470, 262]);
  return (
    <div style={{ position: "absolute", left: 0, width: EJE_X * 2, top: arriba, display: "flex", justifyContent: "center", zIndex: 6 }}>
      <LogoPastilla ancho={ancho} style={{ opacity: Math.min(1, aparece * 1.5), scale: String(0.9 + 0.1 * aparece) }} />
    </div>
  );
};

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const chip = tramo(f, 14, 28);
  const s = tramo(f, INTRO.hasta - 12, INTRO.hasta, sale);
  return (
    <AbsoluteFill style={{ width: EJE_X * 2, alignItems: "center", paddingTop: 790, opacity: 1 - s, translate: `0px ${-30 * s}px` }}>
      <Chip texto="PASO A PASO" style={{ opacity: chip, translate: `0px ${(1 - chip) * 20}px` }} />
      <Titulo lineas={["¿Cómo cambio", "mi *alias*?"]} entra={20} tamano={104} color={C.blanco} style={{ marginTop: 34 }} />
    </AbsoluteFill>
  );
};

// El celular sube desde abajo al terminar la intro y baja al empezar el cierre.
const CelularEnEscena: React.FC = () => {
  const f = useCurrentFrame();
  const entra = spring({ frame: f - (INTRO.hasta - 6), fps: 30, config: RESORTE });
  const s = tramo(f, CIERRE.desde - 6, CIERRE.desde + 14, cruce);
  if (f < INTRO.hasta - 6 || f > CIERRE.desde + 16) return null;
  // El celular se desvanece por arriba (debajo del título): al hacer zoom nunca tapa el título ni el logo.
  const mascara = "linear-gradient(to bottom, transparent 0px, transparent 630px, #000 710px)";
  return (
    <AbsoluteFill style={{ maskImage: mascara, WebkitMaskImage: mascara }}>
      <AbsoluteFill style={{ translate: `0px ${(1 - entra) * 1300 + s * 1400}px` }}>
        <Celular />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Check: React.FC<{ en: number }> = ({ en }) => {
  const f = useCurrentFrame();
  const pop = spring({ frame: f - en, fps: 30, config: RESORTE });
  const trazo = tramo(f, en + 4, en + 18);
  return (
    <svg width={190} height={190} viewBox="0 0 100 100" style={{ scale: String(pop) }}>
      <circle cx={50} cy={50} r={48} fill={C.verde} />
      <path d="M28 51l14 14 30-31" fill="none" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trazo} />
    </svg>
  );
};

const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const r = (x: number) => x - CIERRE.desde;
  const apoyo = tramo(f, r(578), r(592));
  const usuario = tramo(f, r(588), r(602));
  return (
    <AbsoluteFill style={{ width: EJE_X * 2, alignItems: "center", paddingTop: 470 }}>
      <Check en={r(552)} />
      <Titulo lineas={["¡Listo! Ya tenés", "tu *alias nuevo*"]} entra={r(560)} tamano={88} color={C.blanco} style={{ marginTop: 44 }} />
      <div style={{ marginTop: 40, fontFamily: INTER, fontWeight: 500, fontSize: 38, lineHeight: 1.3, color: C.apoyo, textAlign: "center", opacity: apoyo, translate: `0px ${(1 - apoyo) * 20}px` }}>
        Descargá la app desde
        <br />
        el link de nuestro perfil
      </div>
      <div style={{ marginTop: 34, fontFamily: POPPINS, fontWeight: 600, fontSize: 42, color: C.verde, opacity: usuario, translate: `0px ${(1 - usuario) * 20}px` }}>@prestapp.ar</div>
    </AbsoluteFill>
  );
};

// Reel "Cómo cambiar tu alias" · 1080x1920 · 30 fps · 645 cuadros (21,5 s).
export const Reel: React.FC = () => (
  <AbsoluteFill>
    <Fondo />
    <Sequence name="Intro" from={INTRO.desde} durationInFrames={INTRO.hasta - INTRO.desde + 2}>
      <Intro />
    </Sequence>
    <CelularEnEscena />
    <Encabezado />
    <Sequence name="Cierre" from={CIERRE.desde} durationInFrames={CIERRE.hasta - CIERRE.desde}>
      <Cierre />
    </Sequence>
    <Logo />
    {/* Música de fondo tranqui (original, sintetizada) y sonidos: whoosh en cada transición y tap en cada toque */}
    <Audio src={staticFile("audio/musica.wav")} volume={0.55} />
    {WHOOSH.map((en) => (
      <Sequence key={`w${en}`} name="Whoosh" from={en} durationInFrames={20} layout="none">
        <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.7} />
      </Sequence>
    ))}
    {PASOS.map((p) => (
      <Sequence key={`t${p.numero}`} name={`Tap paso ${p.numero}`} from={p.toque.en} durationInFrames={10} layout="none">
        <Audio src={staticFile("audio/sfx/tap.wav")} volume={0.8} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
