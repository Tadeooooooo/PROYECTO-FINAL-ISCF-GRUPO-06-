// Tiempos del reel en cuadros (30 = 1 s). Total: 645 cuadros = 21,5 s.
export const FPS = 30;
export const DURACION = 645;

export const INTRO = { desde: 0, hasta: 75 };
export const CIERRE = { desde: 540, hasta: 645 };

export type Paso = {
  numero: number;
  /** Instrucción: lo que va entre *asteriscos* sale en azul. */
  instruccion: string;
  captura: string;
  desde: number; // entra la pantalla nueva (deslizándose dentro del celular)
  hasta: number;
  toque: { x: number; y: number; en: number }; // coordenadas sobre la captura (1206 px de ancho)
  zoom: { desde: number; z: number; foco: [number, number]; destino: [number, number] }[];
};

export const PASOS: Paso[] = [
  {
    numero: 1,
    instruccion: "Tocá las *tres rayitas* de abajo a la derecha",
    captura: "paso1-inicio.png",
    desde: 75,
    hasta: 180,
    toque: { x: 1046, y: 2226, en: 140 },
    zoom: [{ desde: 100, z: 1.5, foco: [1046, 2226], destino: [600, 1200] }],
  },
  {
    numero: 2,
    instruccion: "Entrá a *Mi cuenta*",
    captura: "paso2-menu.png",
    desde: 180,
    hasta: 270,
    toque: { x: 600, y: 305, en: 232 },
    zoom: [{ desde: 198, z: 1.5, foco: [600, 305], destino: [520, 900] }],
  },
  {
    numero: 3,
    instruccion: "Bajá hasta Alias y tocá el *lápiz azul*",
    captura: "paso3-mi-cuenta.png",
    desde: 270,
    hasta: 405,
    toque: { x: 1090, y: 1971, en: 372 },
    zoom: [{ desde: 334, z: 1.5, foco: [1090, 1971], destino: [620, 1150] }],
  },
  {
    numero: 4,
    instruccion: "Escribí tu alias nuevo y tocá *Guardar*",
    captura: "paso4-alias.png",
    desde: 405,
    hasta: 540,
    toque: { x: 603, y: 2254, en: 504 },
    zoom: [
      { desde: 421, z: 1.5, foco: [600, 626], destino: [520, 900] },
      { desde: 484, z: 1.5, foco: [603, 2254], destino: [520, 1200] },
    ],
  },
];

// Paso 3: scroll simulado (la pantalla arranca corrida hacia abajo y sube hasta la sección "Cuenta").
export const SCROLL = { desde: 290, hasta: 328, inicio: 280 };
// Paso 4: tipeo del alias de ejemplo y botón activo (simulación del estado activo).
export const TIPEO = { texto: "MI.ALIAS.NUEVO", desde: 444, porLetra: 3 };
export const BOTON_ACTIVO = 490;

// Sonidos: un "tap" en cada toque y un "whoosh" leve en cada transición.
export const WHOOSH = [70, 180, 270, 405, 536];
