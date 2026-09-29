import type { DatosVideo } from "../datos/rendimientos";

/** Formato argentino: 100000.5 -> "100.000,50". */
export const formatoNumero = (n: number, decimales = 0): string => {
  const fijo = Math.abs(n).toFixed(decimales);
  const [entero, decimal] = fijo.split(".");
  const miles = entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 ? "-" : "") + miles + (decimal ? "," + decimal : "");
};

/** Todas las cuentas de la simulación salen de acá. */
export const calcularSimulacion = (datos: DatosVideo) => {
  const rendimientoDiario = (datos.montoEjemplo * (datos.tna / 100)) / datos.diasBase;
  return {
    rendimientoDiario,
    rendimientoDiarioRedondo: Math.round(rendimientoDiario),
    rendimientoPeriodo: rendimientoDiario * datos.diasSimulacion,
    rendimientoPeriodoRedondo: Math.round(rendimientoDiario * datos.diasSimulacion),
    tnaTexto: formatoNumero(datos.tna, 2) + "%",
  };
};

/** "2026-09-28" menos n días -> "26/09/2026". */
export const fechaMenosDias = (isoFecha: string, dias: number): string => {
  const [a, m, d] = isoFecha.split("-").map(Number);
  const fecha = new Date(Date.UTC(a, m - 1, d - dias));
  const dd = String(fecha.getUTCDate()).padStart(2, "0");
  const mm = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${fecha.getUTCFullYear()}`;
};
