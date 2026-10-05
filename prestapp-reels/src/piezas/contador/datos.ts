/**
 * ARCHIVO DE DATOS — Animación "Contador" (número que sube con el signo $ adelante).
 * Para otra versión, cambiá SOLO este archivo.
 * Tiempos en cuadros: 60 cuadros = 1 segundo.
 */
export const datosContador = {
  /** Número donde arranca y donde termina (sin puntos). Monto de ejemplo: cambialo por el que necesites. */
  desde: 0,
  hasta: 100000,
  /** Cantidad de decimales (0 = "$100.000", 2 = "$100.000,00"). */
  decimales: 0,
  /** Signo que va adelante. */
  signo: "$",

  /** Cuánto tarda en contar (150 = 2,5 s). */
  duracionConteo: 150,
  /** Cuánto queda quieto el número final antes de irse (120 = 2 s). */
  esperaAntesDeSalir: 120,

  /** Color de los números y del signo. */
  colorNumeros: "#FFFFFF",
  colorSigno: "#4EC148",
  /** Relieve 3D: un "costado" sólido debajo de cada cifra para darle profundidad. */
  relieve: true,
  /** Color del costado de los números y del signo. */
  colorRelieveNumeros: "#2422A9",
  colorRelieveSigno: "#2A7F27",

  /** "transparente" = sin fondo. Un color = fondo liso para sacarlo con croma. */
  fondo: "transparente",
  /** Sombra suave y resplandor verde al terminar (conviene apagarlos en la versión con fondo de color). */
  sombra: true,
};

export type DatosContador = typeof datosContador;
