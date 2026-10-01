/**
 * ARCHIVO DE DATOS — Reel "Pagar con QR" (30 s)
 * Lo que va entre *asteriscos* sale en verde. "\n" = salto de línea. Máximo 6 a 8 palabras por pantalla.
 */
export const datosQR = {
  // Títulos de cada escena
  gancho: "Pagá con QR\nen *segundos*",
  promesa: "Así de fácil\ncon *Prestapp*",
  pasoBoton: "Tocá el\nbotón *QR*",
  pasoEscanear: "*Escaneá*\nel código",
  pasoPagar: "Revisá el monto\ny *pagá*",
  pasoExito: "¡Listo,\n*pagado!*",

  // Lo que se ve en la app (datos de ejemplo)
  saludo: "¡Hola!",
  tna: "21,81%",
  fecha: "30/09/2026",
  comercio: "Comercio adherido",
  monto: 4500,

  // Dato real
  datoPrefijo: "En más de",
  datoNumero: 5000,
  datoSufijo: "comercios\nadheridos",

  // Cierre
  cierre: "Pagá con QR,\nasí de *simple.*",
  cta: "Abrí Prestapp",

  // Sonido (0 = apagado, 1 = máximo)
  volumenMusica: 0.5,
  volumenEfectos: 1,
};

export type DatosQR = typeof datosQR;
