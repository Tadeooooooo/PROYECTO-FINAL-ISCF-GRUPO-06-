import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { cap1, cap3, cap4, cap5, cap6, cap7, cap8 } from "./capitulos/datos";
import { DURACION_TIPOS, pasosTipos, TiposDeCuenta } from "./capitulos/TiposDeCuenta";
import { Columna } from "./componentes/Columna";
import { Fondo } from "./componentes/Fondo";
import { LogoPastilla, Titulo } from "./componentes/Marca";
import { Navegador, Pantallas } from "./componentes/Navegador";
import { C, COLUMNA, cruce, FPS, INTER, LOGO, RESORTE, sale, tramo } from "./marca";
import type { CapituloPantallas, Paso } from "./tipos";
import VOZ from "./voz.json";

type Bloque =
  | { tipo: "intro"; id: string; duracion: number }
  | { tipo: "tipos"; id: string; duracion: number }
  | { tipo: "cierre"; id: string; duracion: number }
  | CapituloPantallas;

const BLOQUES: Bloque[] = [
  { tipo: "intro", id: "intro", duracion: 180 },
  cap1,
  { tipo: "tipos", id: "cap2", duracion: DURACION_TIPOS },
  cap3,
  cap4,
  cap5,
  cap6,
  cap7,
  cap8,
  { tipo: "cierre", id: "cierre", duracion: 165 },
];

const conNavegador = (b?: Bloque) => !!b && (b.tipo === "pantallas" || b.tipo === "intro");

// ----- Voz en off: una pista por paso, que arranca junto con el título -----
// Si la voz necesita más tiempo que el paso, la imagen se congela un momento (en un instante quieto del paso)
// y todo lo que sigue se corre: así el texto nunca se va antes de que la voz termine.
type Pausa = { en: number; cuadros: number };
type Locucion = { archivo: string; en: number; dura: number }; // en = cuadro de contenido del bloque
const DUR_VOZ = VOZ as Record<string, number>;

const pasosDe = (b: Bloque): Paso[] => (b.tipo === "pantallas" ? b.pasos : b.tipo === "tipos" ? pasosTipos : []);

const vozDe = (b: Bloque): Locucion[] => {
  if (b.tipo === "intro") return [{ archivo: "intro-0", en: 14, dura: DUR_VOZ["intro-0"] }];
  if (b.tipo === "cierre") return [{ archivo: "cierre-0", en: 28, dura: DUR_VOZ["cierre-0"] }];
  return pasosDe(b).map((p, i) => ({ archivo: `${b.id}-${i}`, en: p.desde + (i === 0 ? 12 : 6), dura: DUR_VOZ[`${b.id}-${i}`] }));
};

const pausasDe = (b: Bloque): Pausa[] => {
  const pasos = pasosDe(b);
  const voz = vozDe(b);
  const pausas: Pausa[] = [];
  pasos.forEach((p, i) => {
    const sig = i < pasos.length - 1 ? pasos[i + 1].desde : b.duracion;
    const falta = voz[i].en + voz[i].dura + 4 - (sig - 8);
    if (falta > 0) pausas.push({ en: p.pausa ?? sig - 16, cuadros: falta });
  });
  return pausas;
};

// Cuadro de contenido -> cuadro real del bloque (sumando las pausas anteriores).
const aReal = (pausas: Pausa[], f: number) => f + pausas.filter((p) => p.en < f).reduce((a, p) => a + p.cuadros, 0);

const PAUSAS: Record<string, Pausa[]> = {};
const DURACIONES: Record<string, number> = {};
for (const b of BLOQUES) {
  PAUSAS[b.id] = pausasDe(b);
  DURACIONES[b.id] = b.duracion + PAUSAS[b.id].reduce((a, p) => a + p.cuadros, 0);
}

export const INICIOS: Record<string, number> = {};
let acumulado = 0;
for (const b of BLOQUES) {
  INICIOS[b.id] = acumulado;
  acumulado += DURACIONES[b.id];
}
export const TOTAL = acumulado;
export const RANGOS = BLOQUES.filter((b) => b.id.startsWith("cap")).map((b) => ({ id: b.id, desde: INICIOS[b.id], hasta: INICIOS[b.id] + DURACIONES[b.id] }));

// Muestra el contenido con sus pausas: tramos normales y, entre ellos, cuadros congelados.
const ConPausas: React.FC<{ pausas: Pausa[]; duracion: number; children: React.ReactNode }> = ({ pausas, duracion, children }) => {
  const tramos: React.ReactNode[] = [];
  let ini = 0;
  let corrido = 0;
  pausas.forEach((p, k) => {
    tramos.push(
      <Sequence key={`t${k}`} from={ini + corrido} durationInFrames={p.en - ini}>
        <Sequence from={-ini}>{children}</Sequence>
      </Sequence>,
      <Sequence key={`p${k}`} from={p.en + corrido} durationInFrames={p.cuadros}>
        <Freeze frame={p.en}>{children}</Freeze>
      </Sequence>,
    );
    corrido += p.cuadros;
    ini = p.en;
  });
  tramos.push(
    <Sequence key="fin" from={ini + corrido} durationInFrames={duracion - ini}>
      <Sequence from={-ini}>{children}</Sequence>
    </Sequence>,
  );
  return <>{tramos}</>;
};

// ----- Intro: "Home Banking Prestapp" y la bajada; el navegador entra con la pantalla de inicio -----
const PANTALLA_INTRO = [{ img: "05_inicio.png", ancho: 1934, alto: 942, desde: 0, camara: [{ en: 0, z: 1 }] }];
const Intro: React.FC<{ duracion: number }> = ({ duracion }) => {
  const f = useCurrentFrame();
  const bajada = tramo(f, 44, 62);
  const fuera = tramo(f, duracion - 16, duracion, sale);
  return (
    <>
      <div style={{ position: "absolute", left: COLUMNA.x, top: 380, width: 520, opacity: 1 - fuera, translate: `0px ${-24 * fuera}px` }}>
        <Titulo lineas={["Home Banking", "*Prestapp*"]} entra={16} tamano={66} color={C.blanco} />
        <div style={{ marginTop: 30, fontFamily: INTER, fontWeight: 500, fontSize: 36, lineHeight: 1.34, color: C.apoyo, opacity: bajada, translate: `0px ${(1 - bajada) * 16}px` }}>
          Gestioná, cobrá y transferí
          <br />
          desde tu computadora.
        </div>
      </div>
      <Navegador entra={10}>
        <Pantallas pantallas={PANTALLA_INTRO} duracion={duracion} blancoFin />
      </Navegador>
    </>
  );
};

// ----- Cierre: check verde, título, logo (llega desde la esquina) y web/usuario -----
const CIERRE_LOGO = { y: 560, ancho: 300 };
const Cierre: React.FC = () => {
  const f = useCurrentFrame();
  const pop = spring({ frame: f - 12, fps: FPS, config: RESORTE });
  const trazo = tramo(f, 16, 30);
  const linea = tramo(f, 56, 72);
  return (
    <AbsoluteFill style={{ alignItems: "center" }}>
      <svg width={150} height={150} viewBox="0 0 100 100" style={{ position: "absolute", top: 196, scale: String(pop) }}>
        <circle cx={50} cy={50} r={48} fill={C.verde} />
        <path d="M28 51l14 14 30-31" fill="none" stroke={C.tinta} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - trazo} />
      </svg>
      <div style={{ position: "absolute", top: 382, width: "100%" }}>
        <Titulo lineas={["Todo tu club, en un *solo lugar*"]} entra={22} tamano={72} color={C.blanco} alinear="center" />
      </div>
      <div style={{ position: "absolute", top: 764, fontFamily: INTER, fontWeight: 500, fontSize: 38, color: C.apoyo, opacity: linea, translate: `0px ${(1 - linea) * 16}px` }}>
        prestapp.com.ar <span style={{ color: C.verde, margin: "0 14px" }}>·</span> <span style={{ color: C.verde, fontWeight: 600 }}>@prestapp.ar</span>
      </div>
    </AbsoluteFill>
  );
};

// Logo en pastilla: fijo arriba a la izquierda todo el video; en el cierre se agranda y pasa al centro.
const LogoFijo: React.FC = () => {
  const f = useCurrentFrame();
  const aparece = spring({ frame: f - 2, fps: FPS, config: RESORTE });
  const cierre = INICIOS.cierre;
  const v = tramo(f, cierre + 30, cierre + 56, cruce);
  const ancho = interpolate(v, [0, 1], [LOGO.ancho, CIERRE_LOGO.ancho]);
  const alto = (913 / 2705) * ancho;
  const anchoPastilla = ancho + alto * 1.2;
  const x = interpolate(v, [0, 1], [LOGO.x, 960 - anchoPastilla / 2]);
  const y = interpolate(v, [0, 1], [LOGO.y, CIERRE_LOGO.y]);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: Math.min(1, aparece * 1.5), scale: String(0.92 + 0.08 * aparece) }}>
      <LogoPastilla ancho={ancho} />
    </div>
  );
};

const Bloque: React.FC<{ b: Bloque; anterior?: Bloque; siguiente?: Bloque }> = ({ b, anterior, siguiente }) => {
  if (b.tipo === "intro") return <Intro duracion={b.duracion} />;
  if (b.tipo === "tipos") return <TiposDeCuenta />;
  if (b.tipo === "cierre") return <Cierre />;
  const entra = !conNavegador(anterior);
  const sale = !conNavegador(siguiente);
  return (
    <>
      <Navegador entra={entra ? 4 : undefined} sale={sale ? b.duracion - 22 : undefined}>
        <Pantallas pantallas={b.pantallas} duracion={b.duracion} blancoInicio={!entra} blancoFin={!sale} />
      </Navegador>
      <Columna etiqueta={b.etiqueta} chip={b.chip} pasos={b.pasos} duracion={b.duracion} />
    </>
  );
};

// Sonidos: whoosh en cada cambio de capítulo y de pantalla (y cuando aparece un panel); tap en cada click.
const WHOOSH: number[] = [];
const TAPS: number[] = [];
const VOCES: { archivo: string; en: number; dura: number }[] = [];
for (const b of BLOQUES) {
  const ini = INICIOS[b.id];
  const real = (f: number) => ini + aReal(PAUSAS[b.id], f);
  if (b.id !== "intro") WHOOSH.push(ini);
  vozDe(b).forEach((v) => VOCES.push({ ...v, en: real(v.en) }));
  if (b.tipo === "tipos") WHOOSH.push(real(790)); // tarjetas de roles
  if (b.tipo !== "pantallas") continue;
  b.pantallas.forEach((p, i) => {
    if (i > 0) WHOOSH.push(real(p.desde));
    p.tarjetas?.forEach((t) => WHOOSH.push(real(t.desde)));
    p.toques?.forEach((t) => TAPS.push(real(t.en)));
  });
}

// La música baja un poco mientras habla la voz.
const conVoz = (f: number) => Math.max(0, ...VOCES.map((v) => Math.min(tramo(f, v.en - 10, v.en + 4), 1 - tramo(f, v.en + v.dura - 4, v.en + v.dura + 14))));

// La película completa; con desde/hasta se exporta un capítulo suelto (la música entra y sale con fundido).
export const Pelicula: React.FC<{ desde: number; hasta: number }> = ({ desde, hasta }) => (
  <AbsoluteFill>
    <Sequence from={-desde} durationInFrames={TOTAL} layout="none">
      <AbsoluteFill>
        <Fondo />
        {BLOQUES.map((b, i) => (
          <Sequence key={b.id} name={b.id} from={INICIOS[b.id]} durationInFrames={DURACIONES[b.id]}>
            <ConPausas pausas={PAUSAS[b.id]} duracion={b.duracion}>
              <Bloque b={b} anterior={BLOQUES[i - 1]} siguiente={BLOQUES[i + 1]} />
            </ConPausas>
          </Sequence>
        ))}
        <LogoFijo />
        <Audio
          src={staticFile("audio/musica.wav")}
          volume={(f) => (0.42 - 0.2 * conVoz(f)) * Math.max(0, Math.min(1, (f - desde) / 15, (hasta - f) / 24))}
        />
        {VOCES.filter((v) => v.en >= desde && v.en < hasta).map((v) => (
          <Sequence key={v.archivo} name={`Voz ${v.archivo}`} from={v.en} durationInFrames={v.dura + 6} layout="none">
            <Audio src={staticFile(`audio/voz/${v.archivo}.wav`)} volume={1} />
          </Sequence>
        ))}
        {WHOOSH.filter((en) => en >= desde && en < hasta).map((en) => (
          <Sequence key={`w${en}`} name="Whoosh" from={en} durationInFrames={20} layout="none">
            <Audio src={staticFile("audio/sfx/whoosh.wav")} volume={0.6} />
          </Sequence>
        ))}
        {TAPS.filter((en) => en >= desde && en < hasta).map((en) => (
          <Sequence key={`t${en}`} name="Tap" from={en} durationInFrames={10} layout="none">
            <Audio src={staticFile("audio/sfx/tap.wav")} volume={0.75} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </Sequence>
  </AbsoluteFill>
);

export const NOMBRES: Record<string, string> = {
  cap1: "01_primer_ingreso",
  cap2: "02_tipos_de_cuenta",
  cap3: "03_inicio",
  cap4: "04_cobranzas",
  cap5: "05_movimientos",
  cap6: "06_transferencias",
  cap7: "07_puntos_de_venta",
  cap8: "08_usuarios",
};
