import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Misma estética que los tutoriales de la app (azul noche, texto blanco, una palabra en verde), en horizontal.
export const C = {
  azul: "#1724A7",
  verde: "#4EC148",
  fondo: "#162053",
  luz: "#24348F",
  blanco: "#FFFFFF",
  tinta: "#121845",
  apoyo: "rgba(255,255,255,0.82)",
  plataforma: "#2322A9", // azul de los botones del Home Banking
};

// Poppins Bold (títulos), SemiBold (rótulos), Inter (apoyo) y Montserrat (la letra de la plataforma, para los tipeos).
export const POPPINS = "Poppins";
export const INTER = "Inter";
export const MONTSERRAT = "Montserrat";
for (const peso of ["400", "600", "700"]) {
  loadFont({ family: POPPINS, url: staticFile(`fonts/poppins-latin-${peso}-normal.woff2`), weight: peso });
}
for (const peso of ["400", "500", "600"]) {
  loadFont({ family: INTER, url: staticFile(`fonts/inter-latin-${peso}-normal.woff2`), weight: peso });
}
for (const peso of ["400", "500", "600", "700"]) {
  loadFont({ family: MONTSERRAT, url: staticFile(`fonts/montserrat-latin-${peso}-normal.woff2`), weight: peso });
}

export const FPS = 30;
export const ANCHO = 1920;
export const ALTO = 1080;

// Diseño: logo fijo arriba a la izquierda, columna de texto a la izquierda y navegador (≈ 2/3 del ancho) a la derecha.
export const LOGO = { x: 64, y: 48, ancho: 170 };
export const COLUMNA = { x: 96, ancho: 484 };
export const NAV = { x: 636, y: 226, ancho: 1220, barra: 46, alto: 601 }; // alto = alto de la pantalla (sin la barra)

export const suave = Easing.bezier(0.22, 1, 0.36, 1);
export const cruce = Easing.bezier(0.65, 0, 0.35, 1);
export const sale = Easing.bezier(0.55, 0, 1, 0.45);
export const RESORTE = { damping: 20, mass: 0.8, stiffness: 150 };

export const tramo = (f: number, desde: number, hasta: number, curva = suave) =>
  interpolate(f, [desde, hasta], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curva });
