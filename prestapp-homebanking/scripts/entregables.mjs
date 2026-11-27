// Entregables: un MP4 por capítulo (el video se entrega en secciones sueltas) y un PNG por escena principal.
// Uso: NAVEGADOR=<chrome> node scripts/entregables.mjs [capitulos|escenas]
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const browserExecutable = process.env.NAVEGADOR || null;
const que = process.argv[2] || "todo";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });

const CAPITULOS = ["01_primer_ingreso", "02_tipos_de_cuenta", "03_inicio", "04_cobranzas", "05_movimientos", "06_transferencias", "07_puntos_de_venta", "08_usuarios"];
// Escena principal -> [capítulo, cuadro dentro del video de ese capítulo].
const ESCENAS = {
  "01a_olvide_la_contrasena": [1, 125], "01b_cuit_y_correo": [1, 330], "01c_escanear_qr": [1, 560], "01d_contrasena_nueva": [1, 890], "01e_ingreso": [1, 1140],
  "02a_cuentas": [2, 200], "02b_solo_sus_movimientos": [2, 350], "02c_puntos_de_venta_y_usuarios": [2, 560], "02d_eventos": [2, 700], "02e_roles": [2, 900], "02f_funciones": [2, 1080],
  "03a_saldo_cvu_alias": [3, 120], "03b_funciones": [3, 300],
  "04a_punto_de_venta_y_metodos": [4, 250], "04b_link": [4, 500], "04c_qr_pantalla": [4, 800], "04d_qr_impreso": [4, 1120],
  "05a_filtros": [5, 150], "05b_descargas": [5, 290],
  "06a_varias_transferencias": [6, 250], "06b_archivo": [6, 380],
  "07a_que_es_un_punto_de_venta": [7, 100], "07b_nombre_y_dato_adicional": [7, 200], "07c_usuarios_del_punto_de_venta": [7, 400],
  "08a_que_son_los_usuarios": [8, 110], "08b_carga_de_usuario": [8, 380], "08c_rol": [8, 450],
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
  fs.rmSync("entregables/escenas", { recursive: true, force: true });
  fs.mkdirSync("entregables/escenas", { recursive: true });
  for (const [nombre, [cap, frame]] of Object.entries(ESCENAS)) {
    const composition = await selectComposition({ serveUrl, id: `Capitulo${cap}`, browserExecutable });
    await renderStill({ composition, serveUrl, frame, output: `entregables/escenas/${nombre}.png`, browserExecutable, imageFormat: "png" });
    process.stdout.write(`${nombre} `);
  }
  console.log("\nlisto");
}
