/**
 * ARCHIVO DE DATOS — Reel "Transferencias" (30 s)
 * Lo que va entre *asteriscos* sale en verde. "\n" = salto de línea. Máximo 6 a 8 palabras por pantalla.
 */
export const datosTransferencias = {
  // Títulos de cada escena
  gancho: "Mandá plata\n*al instante*",
  promesa: "Transferí desde\n*Prestapp*",
  pasoBoton: "Tocá\n*Transferir*",
  pasoAlias: "Poné el\n*alias* o CVU",
  pasoMonto: "Elegí\n*cuánto* mandar",
  pasoExito: "¡*Enviada!*",

  // Lo que se ve en la app (datos de ejemplo, sin nombres reales)
  saludo: "¡Hola!",
  tna: "21,81%",
  fecha: "30/09/2026",
  alias: "usuario.prestapp",
  destinatario: "Usuario Prestapp",
  /** Monto de ejemplo en pesos (sin puntos). */
  monto: 15000,

  // Dato real
  dato: "Entre usuarios de Prestapp,\nllega *al instante*",

  // Cierre
  cierre: "Transferí\n*al instante.*",
  cta: "Abrí Prestapp",

  // Sonido (0 = apagado, 1 = máximo)
  volumenMusica: 0.7,
  volumenEfectos: 1,
};

export type DatosTransferencias = typeof datosTransferencias;
