// Renderiza cuadros sueltos del reel (control de calidad). Uso: node scripts/cuadros.mjs <carpeta> <cuadro> [...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const K = 1;

const [salida, ...cuadros] = process.argv.slice(2);
const browserExecutable = process.env.NAVEGADOR || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "PrestappAlias", browserExecutable });
for (const f of cuadros.map(Number)) {
  await renderStill({ composition, serveUrl, frame: Math.round(f * K), output: path.join(salida, `f${String(f).padStart(4, "0")}.png`), browserExecutable, imageFormat: "png" });
  process.stdout.write(`${f} `);
}
console.log("listo");
