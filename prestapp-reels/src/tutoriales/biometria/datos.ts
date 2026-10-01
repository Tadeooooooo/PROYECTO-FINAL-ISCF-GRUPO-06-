/**
 * ARCHIVO DE DATOS — Reel "Biometría" (30 s)
 * Lo que va entre *asteriscos* sale en verde. "\n" = salto de línea. Máximo 6 a 8 palabras por pantalla.
 */
export const datosBiometria = {
  // Títulos de cada escena
  gancho: "Tu cuenta es\n*solo tuya*",
  rostro: "Al crear tu cuenta,\nvalidamos tu *rostro*",
  pasoMenu: "Sumá el acceso\ncon *huella*",
  pasoMiCuenta: "Entrá a\n*Mi cuenta*",
  pasoBajar: "Bajá hasta\n*Acceso con huella*",
  pasoActivar: "Activalo con\n*un toque*",
  pasoExito: "¡Identidad\n*verificada!*",

  // Lo que se ve en la app (los datos personales van tapados con *)
  saludo: "¡Hola!",
  tna: "21,81%",
  fecha: "30/09/2026",
  lineasExito: ["Validación facial ✓", "Acceso con huella activado ✓"],

  // Cierre
  cierre: "Tu cuenta,\nmás *protegida.*",
  cta: "Abrí Prestapp",

  // Sonido (0 = apagado, 1 = máximo)
  volumenMusica: 0.7,
  volumenEfectos: 1,
};

export type DatosBiometria = typeof datosBiometria;
