// Exporta la animación del link en tres formatos:
//  - .mov (ProRes 4444) sin fondo: para Premiere, Final Cut, DaVinci, After Effects, CapCut de compu.
//  - .webm (VP9) sin fondo: para editores web y navegadores.
//  - .mp4 con fondo verde: para editores de celular (se saca con "croma" / "chroma key").
// Uso: node scripts/exportar-link.mjs [--browser-executable=ruta]
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";

const arg = process.argv.find((a) => a.startsWith("--browser-executable="));
const browserExecutable = arg ? arg.split("=")[1] : null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });

const versiones = [
  { id: "LinkPrestapp", salida: "out/prestapp-link-sin-fondo.mov", codec: "prores", proResProfile: "4444", pixelFormat: "yuva444p10le" },
  { id: "LinkPrestapp", salida: "out/prestapp-link-sin-fondo.webm", codec: "vp9", pixelFormat: "yuva420p", crf: 12 },
  { id: "LinkPrestappCroma", salida: "out/prestapp-link-fondo-verde.mp4", codec: "h264", pixelFormat: "yuv420p", crf: 10, x264Preset: "slow", colorSpace: "bt709" },
];

for (const { id, salida, ...opciones } of versiones) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  await renderMedia({ composition, serveUrl, outputLocation: salida, imageFormat: "png", browserExecutable, overwrite: true, ...opciones });
  console.log(`listo: ${salida}`);
}
