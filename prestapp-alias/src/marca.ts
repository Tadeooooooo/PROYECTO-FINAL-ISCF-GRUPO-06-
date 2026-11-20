import { loadFont } from "@remotion/fonts";
import { Easing, interpolate, staticFile } from "remotion";

// Estética de los tutoriales anteriores con los colores actuales: azul noche, texto blanco y verde para una palabra por título.
export const C = {
  azul: "#1724A7",
  verde: "#4EC148",
  fondo: "#162053", // azul noche de los posteos actuales
  luz: "#24348F", // foco de luz suave del fondo
  blanco: "#FFFFFF",
  tinta: "#121845",
  apoyo: "rgba(255,255,255,0.82)", // texto de apoyo sobre oscuro
};

// Poppins Bold (títulos y números), Poppins SemiBold (chips y botones), Inter (apoyo). Archivos locales (OFL).
export const POPPINS = "Poppins";
export const INTER = "Inter";
for (const peso of ["400", "600", "700"]) {
  loadFont({ family: POPPINS, url: staticFile(`fonts/poppins-latin-${peso}-normal.woff2`), weight: peso });
}
for (const peso of ["400", "500", "600"]) {
  loadFont({ family: INTER, url: staticFile(`fonts/inter-latin-${peso}-normal.woff2`), weight: peso });
}

// Zonas seguras del reel: 250 px arriba, 420 px abajo y 140 px a la derecha.
export const SEGURA = { arriba: 250, abajo: 420, derecha: 140 };
// Eje vertical del contenido: centrado en el área usable (de 0 a 1080 - 140).
export const EJE_X = 520;

export const suave = Easing.bezier(0.22, 1, 0.36, 1);
export const cruce = Easing.bezier(0.65, 0, 0.35, 1);
export const sale = Easing.bezier(0.55, 0, 1, 0.45);
export const RESORTE = { damping: 20, mass: 0.8, stiffness: 150 };

export const tramo = (f: number, desde: number, hasta: number, curva = suave) =>
  interpolate(f, [desde, hasta], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: curva });
