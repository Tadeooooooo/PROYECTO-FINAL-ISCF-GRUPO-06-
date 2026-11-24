// Coordenadas de las capturas en píxeles de la imagen original (x0, y0, x1, y1).
export type Caja = [number, number, number, number];
// Cámara: z = 1 muestra la captura completa a lo ancho; foco = punto que queda en el centro.
export type Camara = { en: number; z: number; foco?: [number, number] };
export type Toque = { x: number; y: number; en: number };
// Texto tipeado sobre un campo (y = línea de base). "tapa" cubre el texto de ayuda del campo al empezar.
export type Tipeo = { x: number; y: number; texto: string; desde: number; porLetra: number; tam?: number; peso?: number; color?: string; tapa?: Caja };
export type Resalte = { caja: Caja; desde: number; hasta?: number };
// Botón que se habilita (pasa de lila a azul) al completar el campo.
export type Boton = { caja: Caja; texto: string; desde: number; tam?: number };
// Captura chica (modal, panel o detalle) que aparece encima de la pantalla, en coordenadas de la pantalla de abajo.
export type Tarjeta = { img: string; ancho: number; alto: number; x: number; y: number; desde: number; hasta?: number; oscurecer?: number };
// Una fila nueva que aparece empujando hacia abajo lo que está debajo de y.
export type Expandir = { y: number; alto: number; desde: number };
export type Pantalla = {
  img: string;
  ancho: number;
  alto: number;
  desde: number;
  camara: Camara[];
  toques?: Toque[];
  tipeos?: Tipeo[];
  resaltes?: Resalte[];
  botones?: Boton[];
  tarjetas?: Tarjeta[];
  expandir?: Expandir;
};
export type Tarjetita = { titulo: string; texto: string };
export type Paso = { desde: number; titulo: string[]; apoyo?: string[]; chip?: string; icono?: "escaneo"; tarjetas?: { desde: number; items: Tarjetita[] } };
export type CapituloPantallas = { tipo: "pantallas"; id: string; etiqueta: string; duracion: number; chip?: string; pasos: Paso[]; pantallas: Pantalla[] };
