// Renderiza cuadros sueltos del spot (control de calidad). Uso: node scripts/cuadros.mjs <carpeta> <cuadro base> [...]
// Los cuadros se piden en cuadros base (30 por segundo, como en src/guion.json); el archivo lleva el número base.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const g = JSON.parse(fs.readFileSync("src/guion.json", "utf8"));
const K = g.fpsSalida / g.fps;

const [salida, ...cuadros] = process.argv.slice(2);
const browserExecutable = process.env.NAVEGADOR || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "PrestappSpot", browserExecutable });
for (const f of cuadros.map(Number)) {
  await renderStill({ composition, serveUrl, frame: Math.round(f * K), output: path.join(salida, `f${String(f).padStart(4, "0")}.png`), browserExecutable, imageFormat: "png" });
  process.stdout.write(`${f} `);
}
console.log("listo");
