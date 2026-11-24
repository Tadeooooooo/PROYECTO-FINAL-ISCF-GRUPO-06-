// Entregables de revisión: un MP4 por capítulo y un PNG por escena principal.
// Uso: NAVEGADOR=<chrome> node scripts/entregables.mjs [capitulos|escenas]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const browserExecutable = process.env.NAVEGADOR || null;
const que = process.argv[2] || "todo";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });

const CAPITULOS = ["01_primer_ingreso", "02_tipos_de_cuenta", "03_inicio", "04_cobranzas", "05_movimientos", "06_transferencias", "07_puntos_de_venta", "08_usuarios"];
// Cuadro (del video completo) de cada escena principal.
const ESCENAS = {
  "00_intro": 120,
  "01a_olvide_la_contrasena": 305, "01b_cuit_y_correo": 510, "01c_escanear_qr": 740, "01d_contrasena_nueva": 1070, "01e_ingreso": 1320,
  "02a_cuentas": 1580, "02b_solo_sus_movimientos": 1730, "02c_puntos_de_venta_y_usuarios": 1940, "02d_eventos": 2080, "02e_roles": 2280, "02f_funciones": 2460,
  "03a_saldo_cvu_alias": 2640, "03b_accesos": 2810,
  "04a_metodos": 3030, "04b_link": 3270, "04c_transferencia": 3420, "04d_datos_para_transferir": 3570, "04e_qr_pantalla": 3810, "04f_qr_impreso": 4130,
  "05a_filtros": 4350, "05b_descargas": 4490,
  "06a_varias_transferencias": 4870, "06b_archivo": 5000,
  "07a_puntos_de_venta": 5240, "07b_usuarios_asociados": 5400,
  "08a_carga_de_usuario": 5790, "08b_rol": 5910,
  "09_cierre": 6150,
};

if (que === "todo" || que === "capitulos") {
  for (const [i, nombre] of CAPITULOS.entries()) {
    const composition = await selectComposition({ serveUrl, id: `Capitulo${i + 1}`, browserExecutable });
    const outputLocation = `entregables/capitulos/prestapp_home_banking_${nombre}.mp4`;
    await renderMedia({
      composition, serveUrl, codec: "h264", outputLocation, browserExecutable,
      crf: 16, x264Preset: "slow", imageFormat: "png", colorSpace: "bt709", audioCodec: "aac", audioBitrate: "320k",
    });
    console.log("ok", outputLocation);
  }
}
if (que === "todo" || que === "escenas") {
  const composition = await selectComposition({ serveUrl, id: "HomeBanking", browserExecutable });
  fs.mkdirSync("entregables/escenas", { recursive: true });
  for (const [nombre, frame] of Object.entries(ESCENAS)) {
    await renderStill({ composition, serveUrl, frame, output: `entregables/escenas/${nombre}.png`, browserExecutable, imageFormat: "png" });
    process.stdout.write(`${nombre} `);
  }
  console.log("\nlisto");
}
