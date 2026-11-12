import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";
import guion from "./guion.json";

// Paleta del Brand Kit de Prestapp (no usar otros colores).
export const C = {
  azul: "#1724A7", // Azul Prestapp
  noche: "#1A2466", // Azul noche
  tinta: "#121845", // Tinta: texto sobre verde
  verde: "#4EC148", // Verde Prestapp: solo palabras clave y cifras
  verdeSombra: "#2E8A2A", // Verde sombra: solo volumen 3D
  azulSuave: "#C9D0F0", // Azul suave: círculos translúcidos
  blanco: "#FFFFFF",
  foco: "#3A4BD1", // Foco de luz radial del fondo
};

// Tipografía única: Poppins (ExtraBold 800 títulos y cifras, SemiBold 600 apoyo). Archivos locales (OFL).
export const FUENTE = "Poppins";
for (const peso of ["600", "800"]) {
  loadFont({ family: FUENTE, url: staticFile(`fonts/poppins-latin-${peso}-normal.woff2`), weight: peso });
}

export const ANCHO = 1920;
export const ALTO = 1080;
export const SEGURA = 96; // nada importante a menos de 96 px de los bordes
export const DURACION = guion.duracion;

// Curvas: nada lineal.
export const suave = Easing.bezier(0.22, 1, 0.36, 1); // entradas
export const cruce = Easing.bezier(0.65, 0, 0.35, 1); // movimientos de cámara
export const sale = Easing.bezier(0.55, 0, 1, 0.45); // salidas
export const RESORTE = { damping: 20, mass: 0.8, stiffness: 150 }; // se asienta en 14 cuadros, sin rebote

const fijo = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const tramo = (f: number, desde: number, hasta: number, curva = suave) =>
  interpolate(f, [desde, hasta], [0, 1], { ...fijo, easing: curva });

export const escena = (id: number) => {
  const e = guion.escenas.find((x) => x.id === id);
  if (!e) throw new Error(`Escena ${id} no existe`);
  return e;
};
export const tiemposCelular = guion.celular;
