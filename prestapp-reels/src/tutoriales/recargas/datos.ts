/**
 * ARCHIVO DE DATOS — Reel "Recargas" (30 s)
 * Lo que va entre *asteriscos* sale en verde. "\n" = salto de línea. Máximo 6 a 8 palabras por pantalla.
 */
export const datosRecargas = {
  // Títulos de cada escena
  gancho: "¿Te quedaste\nsin *crédito?*",
  promesa: "Recargalo desde\n*Prestapp*",
  pasoMenu: "Tocá el\n*menú*",
  pasoRecargas: "Entrá a\n*Recargar prepagos*",
  pasoCompania: "Elegí tu\n*compañía*",
  pasoDatos: "Poné el número\ny el *monto*",
  pasoExito: "¡*Recargado!*",

  // Lo que se ve en la app (datos de ejemplo)
  saludo: "¡Hola!",
  tna: "21,81%",
  fecha: "30/09/2026",
  /** Lista tal como aparece en la app (sin logos: se muestra la inicial). */
  companias: [
    "Claro Recarga",
    "Telecom Personal Recargas",
    "Movistar Recarga",
    "Tuenti Recarga",
    "Directv Prepago",
  ],
  iniciales: ["C", "P", "M", "T", "D"],
  numero: "11 1234-5678",
  monto: 2000,

  // Dato real
  datoTitulo: "Principales\n*compañías*",
  datoCompanias: ["Claro", "Personal", "Movistar", "Tuenti", "DirecTV"],

  // Cierre
  cierre: "Recargá sin\nmoverte de *casa.*",
  cta: "Abrí Prestapp",

  // Sonido (0 = apagado, 1 = máximo)
  volumenMusica: 0.7,
  volumenEfectos: 1,
};

export type DatosRecargas = typeof datosRecargas;
