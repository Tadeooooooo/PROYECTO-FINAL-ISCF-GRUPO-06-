// Plantilla de los reels "paso a paso" de Prestapp. Cada video se describe con estos datos
// (todas las coordenadas son píxeles de captura, de 1206 px de ancho; los tiempos, cuadros a 30 por segundo).

export type Caja = [number, number, number, number]; // x0, y0, x1, y1

export type Toque = { x: number; y: number; en: number };

/** Movimiento de cámara: z = 1 sin foco vuelve a la vista completa del celular. */
export type Zoom = { desde: number; z: number; foco?: [number, number]; destino?: [number, number] };

/** Tipeo letra por letra con cursor dentro de un campo (x, y = esquina de arriba a la izquierda del texto). */
export type Tipeo = { x: number; y: number; texto: string; desde: number; porLetra: number };

/** Botón deshabilitado (gris) que se muestra activo en azul: simulación del estado activo. */
export type Boton = { caja: Caja; texto: string; desde: number };

/** "Pop" de escala sobre una zona de la captura (por ejemplo, la estrella que se llena). */
export type Pop = { caja: Caja; en: number };

/** Contorno verde que aparece suave alrededor de una zona, con una etiqueta chica debajo. */
export type Resaltado = { caja: Caja; desde: number; etiqueta: string };

/** Scroll simulado: el contenido debajo del encabezado arranca corrido hacia abajo y sube. */
export type Scroll = { desde: number; hasta: number; inicio: number; encabezado: number; relleno: string };

export type Pantalla = {
  captura: string;
  desde: number;
  /** Cómo entra si no es la primera del paso (la primera siempre se desliza desde la derecha). */
  entrada?: "deslizar" | "fundido";
  /** Corrimiento vertical para alinear capturas apenas distintas (ej.: la misma ficha antes y después). */
  dy?: number;
  scroll?: Scroll;
  toques?: Toque[];
  tipeos?: Tipeo[];
  botones?: Boton[];
  pops?: Pop[];
  resaltados?: Resaltado[];
};

export type Paso = {
  numero: number;
  /** Una línea por elemento; lo que va entre *asteriscos* sale en verde. */
  instruccion: string[];
  desde: number;
  hasta: number;
  pantallas: Pantalla[];
  zoom: Zoom[];
};

export type Video = {
  duracion: number;
  /** Alto de referencia de las capturas (define la proporción de la pantalla del celular). */
  altoCaptura: number;
  intro: { hasta: number; titulo: string[]; tamano: number };
  cierre: { desde: number; titulo: string[]; tamano: number };
  pasos: Paso[];
  whoosh: number[];
  musica: string;
};
