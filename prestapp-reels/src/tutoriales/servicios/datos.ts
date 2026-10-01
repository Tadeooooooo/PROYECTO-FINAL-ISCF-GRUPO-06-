/**
 * ARCHIVO DE DATOS — Reel "Pagar servicios" (30 s)
 * Lo que va entre *asteriscos* sale en verde. "\n" = salto de línea. Máximo 6 a 8 palabras por pantalla.
 */
export const datosServicios = {
  // Títulos de cada escena
  gancho: "Pagá la luz\nsin hacer *fila*",
  promesa: "Desde tu casa,\ncon *Prestapp*",
  pasoBoton: "Tocá\n*Pagar Servicios*",
  pasoServicio: "Elegí el\n*servicio*",
  pasoPagar: "Revisá\ny *pagá*",
  pasoExito: "¡*Pagado!*",

  // Lo que se ve en la app (genérico, sin marcas de empresas)
  saludo: "¡Hola!",
  tna: "21,81%",
  fecha: "30/09/2026",
  servicios: [
    { nombre: "Luz", detalle: "Electricidad" },
    { nombre: "Gas", detalle: "Gas natural" },
    { nombre: "Agua", detalle: "Agua corriente" },
    { nombre: "Internet", detalle: "Hogar" },
  ],
  vencimiento: "10/10/2026",
  /** Monto de ejemplo de la factura de luz, en pesos (sin puntos). */
  monto: 12350,

  // Dato real
  datoPrefijo: "Más de",
  datoNumero: 5000,
  datoSufijo: "empresas\nadheridas",

  // Cierre
  cierre: "Tus servicios,\n*al día.*",
  cta: "Abrí Prestapp",

  // Sonido (0 = apagado, 1 = máximo)
  volumenMusica: 0.7,
  volumenEfectos: 1,
};

export type DatosServicios = typeof datosServicios;
