import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Colores tomados del isotipo y de la captura de la app.
export const colores = {
  azulMarca: "#1724A7", // isotipo
  azulApp: "#2422A9", // encabezado y barra de la app
  azulAppOscuro: "#1E1C97", // botones de la barra inferior
  // [DATO] Provisorio hasta tener el HEX del manual de marca.
  violeta: "#5B2FD6",
  verde: "#4EC148", // isotipo
  verdeApp: "#55C147", // botones de la app
  noche: "#0A0A3A", // fondo del video
  blanco: "#FFFFFF",
  grisFondoApp: "#F4F4F4",
  grisTextoApp: "#69648D",
  textoOscuro: "#14123F",
};

export const degradeMarca = `linear-gradient(160deg, ${colores.azulApp} 0%, #3A27C4 45%, ${colores.violeta} 100%)`;

// Tipografías de la marca, guardadas en public/fonts (licencia libre OFL).
export const fuenteTitulos = "Sora";
export const fuenteTexto = "Manrope";

for (const peso of ["600", "700", "800"]) {
  loadFont({ family: fuenteTitulos, url: staticFile(`fonts/sora-latin-${peso}-normal.woff2`), weight: peso });
}
for (const peso of ["500", "600", "700", "800"]) {
  loadFont({ family: fuenteTexto, url: staticFile(`fonts/manrope-latin-${peso}-normal.woff2`), weight: peso });
}

// Zonas seguras de Instagram Reels (en píxeles, sobre 1080x1920).
export const ZONA_SEGURA = {
  arriba: 250,
  abajo: 380,
  lados: 80,
  // Borde inferior de la zona segura (1920 - 380).
  limiteInferior: 1540,
};

// Posición del celular en las escenas 2 a 5 y 8.
export const CELULAR = {
  ancho: 620,
  arriba: 620,
};
