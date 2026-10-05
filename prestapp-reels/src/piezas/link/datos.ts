/**
 * ARCHIVO DE DATOS — Animación "Link" (cápsula con el ícono de enlace que escribe la dirección).
 * Para otra versión, cambiá SOLO este archivo.
 * Tiempos en cuadros: 60 cuadros = 1 segundo.
 */
export const datosLink = {
  /** Dirección que se escribe. */
  texto: "prestapp.com.ar",
  /** Parte final del texto que va en azul (el resto va en azul oscuro). Vacío = todo del mismo color. */
  textoDestacado: ".com.ar",

  /** Cuántos cuadros tarda en aparecer cada letra (más alto = escribe más lento). */
  cuadrosPorLetra: 4,
  /** Cuánto tiempo queda quieta la cápsula ya escrita antes de cerrarse (150 = 2,5 s). */
  esperaAntesDeSalir: 150,

  /** "transparente" = sin fondo. Un color (ej. "#00FF00") = fondo liso para sacarlo con croma. */
  fondo: "transparente",
  /** Sombra suave debajo de la cápsula (conviene apagarla en la versión con fondo verde). */
  sombra: true,
};

export type DatosLink = typeof datosLink;
