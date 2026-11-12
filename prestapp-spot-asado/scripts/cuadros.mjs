// Renderiza cuadros sueltos del spot (control de calidad). Uso: node scripts/cuadros.mjs <carpeta> <cuadro> [cuadro...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [salida, ...cuadros] = process.argv.slice(2);
const browserExecutable = process.env.NAVEGADOR || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "PrestappSpot", browserExecutable });
for (const f of cuadros.map(Number)) {
  await renderStill({ composition, serveUrl, frame: f, output: path.join(salida, `f${String(f).padStart(4, "0")}.png`), browserExecutable, imageFormat: "png" });
  process.stdout.write(`${f} `);
}
console.log("listo");
