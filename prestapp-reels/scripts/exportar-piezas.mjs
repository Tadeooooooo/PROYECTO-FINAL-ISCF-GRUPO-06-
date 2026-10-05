// Exporta las piezas sueltas (link, contador) en tres formatos:
//  - .mov sin fondo: para Premiere, Final Cut, DaVinci, After Effects, CapCut de compu.
//    Va en ProRes 4444 si pesa menos de ~29 MB; si no, en PNG (sin pérdida, también estándar en .mov).
//  - .webm (VP9) sin fondo: para editores web y navegadores.
//  - .mp4 con fondo de color liso: para editores de celular (se saca con "croma" / "chroma key").
// Uso: node scripts/exportar-piezas.mjs <link|contador|todas> [--browser-executable=ruta]
import { bundle } from "@remotion/bundler";
import { renderFrames, renderMedia, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const PIEZAS = {
  link: { id: "LinkPrestapp", croma: "LinkPrestappCroma", colorCroma: "verde" },
  contador: { id: "Contador", croma: "ContadorCroma", colorCroma: "fucsia" },
};

const pedido = process.argv[2];
const nombres = pedido === "todas" ? Object.keys(PIEZAS) : [pedido];
if (!nombres.every((n) => PIEZAS[n])) {
  console.error(`Uso: node scripts/exportar-piezas.mjs <${Object.keys(PIEZAS).join("|")}|todas>`);
  process.exit(1);
}
const arg = process.argv.find((a) => a.startsWith("--browser-executable="));
const browserExecutable = arg ? arg.split("=")[1] : null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });

for (const nombre of nombres) {
  const { id, croma, colorCroma } = PIEZAS[nombre];
  const versiones = [
    { id, salida: `out/prestapp-${nombre}-sin-fondo.webm`, codec: "vp9", pixelFormat: "yuva420p", crf: 12 },
    { id: croma, salida: `out/prestapp-${nombre}-fondo-${colorCroma}.mp4`, codec: "h264", pixelFormat: "yuv420p", crf: 10, x264Preset: "slow", colorSpace: "bt709" },
  ];
  for (const { id: comp, salida, ...opciones } of versiones) {
    const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
    await renderMedia({ composition, serveUrl, outputLocation: salida, imageFormat: "png", browserExecutable, overwrite: true, ...opciones });
    console.log(`listo: ${salida}`);
  }

  // .mov sin fondo: se arma desde los cuadros PNG originales (exactos, con transparencia).
  const cuadros = `out/_${nombre}-cuadros`;
  rmSync(cuadros, { recursive: true, force: true });
  mkdirSync(cuadros, { recursive: true });
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  await renderFrames({
    composition, serveUrl, outputDir: cuadros, imageFormat: "png", inputProps: composition.props,
    onStart: () => {}, onFrameUpdate: () => {}, browserExecutable,
  });
  const ffmpeg = (...args) =>
    execFileSync("npx", ["remotion", "ffmpeg", "-v", "error", "-y", "-framerate", String(composition.fps),
      "-pattern_type", "glob", "-i", `${cuadros}/*.png`, ...args], { stdio: "inherit" });
  const salidaMov = `out/prestapp-${nombre}-sin-fondo.mov`;
  let formato = null;
  // Primero ProRes 4444 (el más compatible), con calidad muy alta; se comprime un poco más solo si hace falta.
  for (const calidad of [4, 6, 8]) {
    ffmpeg("-c:v", "prores_ks", "-profile:v", "4444", "-qscale:v", String(calidad), "-alpha_bits", "8",
      "-vendor", "apl0", "-pix_fmt", "yuva444p10le", salidaMov);
    if (statSync(salidaMov).size < 29e6) { formato = `ProRes 4444 (calidad ${calidad})`; break; }
  }
  // Si igual pesa demasiado (mucho desenfoque o degradé), PNG dentro del .mov: sin pérdida y más liviano.
  if (!formato) {
    ffmpeg("-c:v", "png", "-pix_fmt", "rgba", salidaMov);
    formato = "PNG sin pérdida";
  }
  rmSync(cuadros, { recursive: true, force: true });
  console.log(`listo: ${salidaMov} (${formato}, ${(statSync(salidaMov).size / 1e6).toFixed(1)} MB)`);
}
