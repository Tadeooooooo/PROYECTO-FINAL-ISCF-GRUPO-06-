import type { CapituloPantallas } from "../tipos";

// Datos de ejemplo (nunca datos reales).
const CUIT = "0000***************";
const IMPORTE = "$ ****";
const EMAIL = "usuario@ejemplo.com";
const CLAVE = "••••••••••";

// Todos los cuadros son relativos al inicio de cada capítulo (30 por segundo).
// Coordenadas en píxeles de cada captura (ver scripts/tapar.py).

export const cap1: CapituloPantallas = {
  tipo: "pantallas",
  id: "cap1",
  etiqueta: "PRIMER INGRESO",
  duracion: 1200,
  pasos: [
    { desde: 0, titulo: ["En la pantalla de", "ingreso, tocá", "*Olvidé la", "contraseña*"] },
    { desde: 170, titulo: ["Ingresá tu", "*CUIT y tu correo*"], apoyo: ["Y tocá Recuperar."] },
    { desde: 430, titulo: ["Escaneá el QR", "con el *escáner de", "tu billetera", "Prestapp*"], icono: "escaneo" },
    { desde: 650, titulo: ["La pantalla se", "actualiza y te", "pide la *contraseña", "nueva*"], apoyo: ["Al menos una minúscula,", "una mayúscula y un", "carácter especial."] },
    { desde: 1000, titulo: ["Después ingresás", "con tu CUIT, tu", "correo y la", "*clave nueva*"] },
  ],
  pantallas: [
    {
      img: "01_login.png", ancho: 1910, alto: 946, desde: 0,
      camara: [{ en: 0, z: 1 }, { en: 28, z: 1.9, foco: [955, 430] }, { en: 92, z: 2.7, foco: [1080, 560] }],
      resaltes: [{ caja: [1027, 568, 1167, 590], desde: 104 }],
      toques: [{ x: 1097, y: 578, en: 140 }],
    },
    {
      img: "02_recuperar_contrasena_cuit_email.png", ancho: 1918, alto: 952, desde: 160,
      camara: [{ en: 160, z: 2.0, foco: [960, 440] }, { en: 172, z: 2.35, foco: [960, 460] }],
      tipeos: [
        { x: 759, y: 408, texto: CUIT, desde: 205, porLetra: 3 },
        { x: 759, y: 462, texto: EMAIL, desde: 272, porLetra: 3, tapa: [749, 442, 900, 474] },
      ],
      resaltes: [{ caja: [746, 385, 1174, 477], desde: 196, hasta: 332 }, { caja: [746, 512, 1174, 547], desde: 336 }],
      toques: [{ x: 960, y: 529, en: 385 }],
    },
    {
      img: "03_qr_escanear_con_billetera.png", ancho: 1918, alto: 948, desde: 420,
      camara: [{ en: 420, z: 2.1, foco: [960, 430] }],
      resaltes: [{ caja: [871, 372, 1049, 550], desde: 455 }],
    },
    {
      img: "04_crear_nueva_contrasena.png", ancho: 1918, alto: 949, desde: 640,
      camara: [{ en: 640, z: 2.05, foco: [960, 425] }],
      resaltes: [
        { caja: [709, 352, 1211, 374], desde: 690, hasta: 790 },
        { caja: [734, 393, 1186, 485], desde: 798, hasta: 878 },
        { caja: [734, 501, 1186, 536], desde: 884 },
      ],
      tipeos: [
        { x: 747, y: 416, texto: CLAVE, desde: 805, porLetra: 3, tapa: [736, 396, 1140, 428] },
        { x: 747, y: 470, texto: CLAVE, desde: 845, porLetra: 3, tapa: [736, 450, 1140, 482] },
      ],
      toques: [{ x: 960, y: 518, en: 930 }],
    },
    {
      img: "01_login.png", ancho: 1910, alto: 946, desde: 990,
      camara: [{ en: 990, z: 1.95, foco: [955, 440] }],
      tipeos: [
        { x: 754, y: 370, texto: CUIT, desde: 1035, porLetra: 2, tapa: [743, 349, 1128, 383] },
        { x: 754, y: 424, texto: EMAIL, desde: 1078, porLetra: 2, tapa: [743, 403, 1126, 437] },
        { x: 754, y: 478, texto: CLAVE, desde: 1120, porLetra: 2, tapa: [743, 457, 1128, 491] },
      ],
      resaltes: [{ caja: [741, 347, 1169, 493], desde: 1030, hasta: 1150 }],
      toques: [{ x: 955, y: 526, en: 1165 }],
    },
  ],
};

export const cap3: CapituloPantallas = {
  tipo: "pantallas",
  id: "cap3",
  etiqueta: "INICIO",
  duracion: 330,
  pausas: [{ en: 292, cuadros: 45 }],
  pasos: [
    { desde: 0, titulo: ["Desde el inicio", "ves tu *saldo,", "CVU y alias*"] },
    {
      desde: 170,
      titulo: ["Y accedés a", "estas *funciones*:"],
      // Cada ítem aparece junto con el contorno de su botón.
      lista: { desde: 190, cada: 25, items: [{ icono: "enviar", texto: "Transferir" }, { icono: "cobrar", texto: "Cobrar" }, { icono: "flechas", texto: "Movimientos" }] },
    },
  ],
  pantallas: [
    {
      img: "05_inicio.png", ancho: 1934, alto: 942, desde: 0,
      camara: [{ en: 0, z: 1 }, { en: 24, z: 2.3, foco: [440, 185] }, { en: 165, z: 1.4, foco: [860, 330] }],
      resaltes: [
        { caja: [255, 104, 565, 264], desde: 52, hasta: 160 },
        { caja: [241, 308, 643, 483], desde: 190 },
        { caja: [658, 308, 1060, 483], desde: 215 },
        { caja: [1075, 308, 1476, 483], desde: 240 },
      ],
    },
  ],
};

// Cobranzas: sin el método Transferencia (no se habla de esa función en este capítulo).
export const cap4: CapituloPantallas = {
  tipo: "pantallas",
  id: "cap4",
  etiqueta: "COBRANZAS",
  duracion: 1070,
  pausas: [{ en: 196, cuadros: 80 }],
  pasos: [
    {
      desde: 0,
      titulo: ["En Cobranzas", "elegís el *punto de", "venta* y el método", "de cobro"],
      apoyo: ["Antes creá un punto de", "venta: sin él, los métodos", "de cobro no funcionan."],
      chip: "Los usuarios solo ven su punto de venta",
    },
    { desde: 230, titulo: ["Generá un", "*link de cobro*"], apoyo: ["Importe, concepto,", "vencimiento y si es", "de uso múltiple."] },
    { desde: 480, titulo: ["Ingresá el importe", "y mostrá el *QR en", "tu pantalla*"], apoyo: ["Para cobrar al instante."] },
    {
      desde: 730,
      titulo: ["Descargá un PDF", "con tu *QR* para", "tenerlo impreso"],
      tarjetas: { desde: 805, items: [{ titulo: "*QR cerrado*", texto: "cobra siempre el mismo importe" }, { titulo: "*QR abierto*", texto: "la persona ingresa el monto" }] },
    },
  ],
  pantallas: [
    {
      img: "06_cobranzas_metodos.png", ancho: 1920, alto: 891, desde: 0,
      camara: [{ en: 0, z: 1 }, { en: 22, z: 1.75, foco: [560, 200] }, { en: 118, z: 1.1, foco: [1070, 330] }],
      resaltes: [
        { caja: [243, 111, 645, 149], desde: 45, hasta: 120 },
        { caja: [243, 171, 645, 364], desde: 140, hasta: 200 },
        { caja: [660, 171, 1062, 364], desde: 150, hasta: 200 },
        { caja: [243, 380, 645, 554], desde: 160 },
      ],
      toques: [{ x: 444, y: 467, en: 212 }],
    },
    {
      img: "07_cobranzas_link.png", ancho: 1703, alto: 1013, desde: 230,
      camara: [{ en: 230, z: 1 }, { en: 330, z: 2.1, foco: [330, 135] }, { en: 388, z: 1.5, foco: [1250, 140] }],
      resaltes: [{ caja: [23, 85, 1302, 148], desde: 255, hasta: 325 }, { caja: [1419, 110, 1683, 146], desde: 405 }],
      tipeos: [{ x: 36, y: 133, texto: IMPORTE, desde: 352, porLetra: 4, tapa: [25, 112, 395, 146] }],
      botones: [{ caja: [1419, 110, 1683, 146], texto: "GENERAR LINK", desde: 384 }],
      toques: [{ x: 1551, y: 128, en: 445 }],
    },
    {
      img: "10_cobranzas_qr_pantalla_importe.png", ancho: 1700, alto: 1005, desde: 480,
      camara: [{ en: 480, z: 2.1, foco: [430, 130] }, { en: 598, z: 1.3, foco: [850, 410] }],
      tipeos: [{ x: 33, y: 128, texto: IMPORTE, desde: 510, porLetra: 4, tapa: [22, 107, 410, 141] }],
      tarjetas: [{ img: "11_cobranzas_qr_pantalla_generado.png", ancho: 470, alto: 545, x: 615, y: 140, desde: 600, oscurecer: 0.35 }],
      resaltes: [{ caja: [439, 105, 843, 141], desde: 542, hasta: 588 }, { caja: [712, 284, 962, 534], desde: 645 }],
      toques: [{ x: 641, y: 123, en: 578 }],
    },
    {
      img: "12_cobranzas_qr_impreso.png", ancho: 1699, alto: 1008, desde: 730,
      camara: [{ en: 730, z: 1 }, { en: 760, z: 2.3, foco: [330, 330] }],
      resaltes: [{ caja: [288, 346, 384, 363], desde: 820 }, { caja: [320, 365, 416, 382], desde: 900 }],
    },
  ],
};

export const cap5: CapituloPantallas = {
  tipo: "pantallas",
  id: "cap5",
  etiqueta: "MOVIMIENTOS",
  duracion: 420,
  pasos: [
    { desde: 0, titulo: ["Consultá tus", "*movimientos* y", "filtrá por fecha"] },
    { desde: 215, titulo: ["Descargalos en", "*PDF o Excel*"] },
  ],
  pantallas: [
    {
      img: "13_movimientos.png", ancho: 1917, alto: 949, desde: 0,
      camara: [{ en: 0, z: 1 }, { en: 26, z: 1.5, foco: [640, 220] }, { en: 220, z: 2.6, foco: [1700, 95] }, { en: 330, z: 1 }],
      // El panel de filtros (14) se abre en su lugar, debajo del botón "Filtros".
      tarjetas: [{ img: "14_movimientos_filtros.png", ancho: 897, alto: 239, x: 221, y: 55, desde: 78, hasta: 205 }],
      resaltes: [
        { caja: [241, 172, 1064, 210], desde: 105, hasta: 160 },
        { caja: [660, 242, 1064, 276], desde: 160, hasta: 200 },
        { caja: [1609, 82, 1749, 104], desde: 250, hasta: 322 },
        { caja: [1765, 82, 1898, 104], desde: 268, hasta: 322 },
      ],
      toques: [{ x: 278, y: 92, en: 62 }, { x: 862, y: 259, en: 192 }],
    },
  ],
};

export const cap6: CapituloPantallas = {
  tipo: "pantallas",
  id: "cap6",
  etiqueta: "TRANSFERENCIAS",
  duracion: 480,
  pasos: [
    { desde: 0, titulo: ["Hacé *una o varias", "transferencias* en", "una sola operación"] },
    { desde: 270, titulo: ["También podés", "cargarlas desde", "un *archivo*"] },
  ],
  pantallas: [
    {
      img: "15_transferencias.png", ancho: 1910, alto: 947, desde: 0,
      camara: [{ en: 0, z: 1 }, { en: 24, z: 1.125, foco: [1065, 200] }],
      resaltes: [{ caja: [239, 150, 1891, 194], desde: 50, hasta: 125 }, { caja: [239, 208, 1891, 244], desde: 128 }],
      toques: [{ x: 1065, y: 226, en: 170 }],
    },
    {
      img: "16_transferencias_detalle.png", ancho: 1699, alto: 1012, desde: 182,
      expandir: { y: 205, alto: 61, desde: 196 },
      camara: [{ en: 182, z: 1.0, foco: [845, 200] }, { en: 275, z: 1.25, foco: [845, 330] }],
      resaltes: [{ caja: [19, 216, 1679, 258], desde: 222, hasta: 268 }, { caja: [14, 330, 1684, 436], desde: 295 }],
    },
  ],
};

export const cap7: CapituloPantallas = {
  tipo: "pantallas",
  id: "cap7",
  etiqueta: "PUNTOS DE VENTA",
  chip: "Recaudadora y administrativas",
  duracion: 450,
  pausas: [{ en: 51, cuadros: 75 }],
  pasos: [
    // Qué es, antes de mostrar cómo se crea.
    { desde: 0, titulo: ["Un *punto de venta*", "es un sector de", "cobro de tu cuenta"] },
    { desde: 66, titulo: ["Creá cada uno con", "*nombre y dato", "adicional*"] },
    { desde: 235, titulo: ["Elegí qué *usuarios*", "cobran en ese", "punto de venta"] },
  ],
  pantallas: [
    {
      img: "17_puntos_de_venta.png", ancho: 1919, alto: 948, desde: 0,
      camara: [{ en: 0, z: 1 }, { en: 24, z: 1.55, foco: [860, 170] }, { en: 225, z: 1.9, foco: [961, 390] }],
      tarjetas: [{ img: "19_puntos_de_venta_usuarios_asociados.png", ancho: 922, alto: 418, x: 500, y: 180, desde: 226, oscurecer: 0.4 }],
      resaltes: [
        { caja: [242, 109, 1061, 147], desde: 72, hasta: 165 },
        { caja: [1076, 111, 1477, 147], desde: 170, hasta: 222 },
        { caja: [500, 308, 1422, 362], desde: 270, hasta: 335 },
        { caja: [1192, 528, 1399, 562], desde: 345 },
      ],
      toques: [{ x: 1276, y: 129, en: 212 }, { x: 539, y: 331, en: 262 }, { x: 1295, y: 545, en: 392 }],
    },
  ],
};

export const cap8: CapituloPantallas = {
  tipo: "pantallas",
  id: "cap8",
  etiqueta: "USUARIOS",
  chip: "Recaudadora y administrativas",
  duracion: 480,
  pausas: [{ en: 51, cuadros: 90 }],
  pasos: [
    // Qué es, antes de mostrar cómo se crea.
    { desde: 0, titulo: ["Los *usuarios* son", "extensiones de", "tu cuenta"], apoyo: ["Cada uno tiene un rol:", "vendedor o administrativo."] },
    { desde: 66, titulo: ["Cargá sus datos", "y elegí su *rol*"] },
    { desde: 385, titulo: ["Después los", "asociás a tus", "*puntos de venta*"] },
  ],
  pantallas: [
    {
      img: "20_usuarios.png", ancho: 1919, alto: 948, desde: 0,
      camara: [{ en: 0, z: 1 }, { en: 24, z: 1.15, foco: [1067, 200] }],
      resaltes: [{ caja: [241, 108, 1893, 147], desde: 72, hasta: 122 }],
    },
    {
      img: "21_usuarios_detalle.png", ancho: 1700, alto: 1007, desde: 128,
      camara: [{ en: 128, z: 1 }, { en: 150, z: 1.75, foco: [440, 140] }, { en: 245, z: 1.75, foco: [1230, 140] }],
      tipeos: [
        { x: 33, y: 131, texto: "Ana", desde: 165, porLetra: 4 },
        { x: 312, y: 131, texto: "Gómez", desde: 185, porLetra: 4 },
        { x: 591, y: 131, texto: CUIT, desde: 210, porLetra: 2 },
        { x: 870, y: 131, texto: EMAIL, desde: 272, porLetra: 2 },
        { x: 1150, y: 131, texto: CLAVE, desde: 314, porLetra: 2 },
      ],
      resaltes: [{ caja: [1412, 84, 1684, 150], desde: 345 }],
    },
  ],
};
