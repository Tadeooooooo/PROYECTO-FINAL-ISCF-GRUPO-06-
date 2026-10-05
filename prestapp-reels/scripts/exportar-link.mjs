// Exporta la animación del link en tres formatos:
//  - .mov (ProRes 4444) sin fondo: para Premiere, Final Cut, DaVinci, After Effects, CapCut de compu.
//  - .webm (VP9) sin fondo: para editores web y navegadores.
//  - .mp4 con fondo verde: para editores de celular (se saca con "croma" / "chroma key").
// Uso: node scripts/exportar-link.mjs [--browser-executable=ruta]
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const arg = process.argv.find((a) => a.startsWith("--browser-executable="));
const browserExecutable = arg ? arg.split("=")[1] : null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });

const versiones = [
  { id: "LinkPrestapp", salida: "out/_link-sin-fondo.mov", codec: "prores", proResProfile: "4444", pixelFormat: "yuva444p10le" },
  { id: "LinkPrestapp", salida: "out/prestapp-link-sin-fondo.webm", codec: "vp9", pixelFormat: "yuva420p", crf: 12 },
  { id: "LinkPrestappCroma", salida: "out/prestapp-link-fondo-verde.mp4", codec: "h264", pixelFormat: "yuv420p", crf: 10, x264Preset: "slow", colorSpace: "bt709" },
];

for (const { id, salida, ...opciones } of versiones) {
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  await renderMedia({ composition, serveUrl, outputLocation: salida, imageFormat: "png", browserExecutable, overwrite: true, ...opciones });
  console.log(`listo: ${salida}`);
}

// El ProRes que sale de Remotion pesa ~43 MB: se recomprime a calidad muy alta (~28 MB, diferencia invisible).
execFileSync("npx", [
  "remotion", "ffmpeg", "-v", "error", "-y", "-i", "out/_link-sin-fondo.mov",
  "-c:v", "prores_ks", "-profile:v", "4444", "-qscale:v", "4", "-vendor", "apl0", "-pix_fmt", "yuva444p10le",
  "out/prestapp-link-sin-fondo.mov",
], { stdio: "inherit" });
rmSync("out/_link-sin-fondo.mov");
console.log("listo: out/prestapp-link-sin-fondo.mov");
