/**
 * ============================================================
 *  ARCHIVO DE DATOS — Reel "Rendimientos" (30 s)
 * ============================================================
 *  Para hacer otra versión del video, cambiá SOLO este archivo.
 *
 *  Reglas de escritura:
 *   - Lo que pongas entre *asteriscos* se pinta de verde.
 *   - "\n" fuerza un salto de línea en el título.
 *   - Máximo 6 a 8 palabras por pantalla.
 *
 *  Los números (rendimiento por día, en 30 días, saldos que suben)
 *  se calculan solos a partir de montoEjemplo, tna y diasBase.
 * ============================================================
 */

export const datosRendimientos = {
  // ---------- Números de la simulación ----------
  /** Monto de ejemplo en pesos (sin puntos). */
  montoEjemplo: 100000,
  /** TNA de referencia en %, con punto decimal (20.78 = 20,78%). */
  tna: 20.78,
  /** Días del año para pasar de TNA a rendimiento diario. */
  diasBase: 365,
  /** Cantidad de días de la simulación de la escena 7. */
  diasSimulacion: 30,

  // ---------- Escena 1 · Gancho (0–2 s) ----------
  gancho: "¿Tu plata\nestá *quieta?*",
  etiquetaSaldo: "Tu saldo",
  /** Texto que acompaña al chip verde "+$57 hoy". */
  chipHoy: "hoy",

  // ---------- Escena 2 · Promesa (2–5 s) ----------
  promesa: "Con Prestapp,\ntu saldo *rinde solo*",

  // ---------- Escena 3 · Sin mínimo (5–8 s) ----------
  sinMinimo: "Sin monto\n*mínimo*",
  /** Montos que van pasando en la tarjeta (el último debería ser montoEjemplo). */
  montosSinMinimo: [500, 15000, 100000],
  etiquetaRinde: "Rinde",

  // ---------- Escena 4 · Todos los días (8–11 s) ----------
  diario: "Se acredita\n*todos los días*",
  /** Iniciales de los días de la semana del calendario. */
  diasSemana: ["L", "M", "M", "J", "V", "S", "D"],

  // ---------- Escena 5 · Sin hacer nada (11–14 s) ----------
  sinHacerNada: "Sin mover\n*un dedo*",
  notificacionApp: "Prestapp · ahora",
  notificacionTitulo: "Rendimiento acreditado",

  // ---------- Escena 6 · Simulación (14–17 s) ----------
  simulemos: "Simulemos:",
  enTuSaldo: "en tu saldo",

  // ---------- Escena 7 · Resultado (17–21,5 s) ----------
  etiquetaTna: "TNA de referencia:",
  porDia: "por día",
  /** {dias} se reemplaza por diasSimulacion. */
  enDias: "En {dias} días:",

  // ---------- Escena 8 · En la app (21,5–24,5 s) ----------
  enLaApp: "Y lo ves *crecer*\nen la app",
  tituloMovimientos: "Últimos movimientos",
  verMas: "Ver más",
  conceptoMovimiento: "Rendimiento Saldo",
  /** Fecha de la última acreditación que se ve en la lista (AAAA-MM-DD). */
  fechaUltimaAcreditacion: "2026-09-28",

  // ---------- Escena 9 · Cierre (24,5–27 s) ----------
  cierre: "Tu saldo rinde.\nVos, *tranqui.*",
  cta: "Abrí Prestapp",

  // ---------- Aviso legal (obligatorio) ----------
  disclaimer:
    "Simulación informativa. TNA de referencia sujeta a variación. Rendimientos no garantizados.",
};

export type DatosVideo = typeof datosRendimientos;
