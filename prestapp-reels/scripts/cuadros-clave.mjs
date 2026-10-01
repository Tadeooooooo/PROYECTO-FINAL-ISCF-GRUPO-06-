// Renderiza cuadros sueltos del video para revisarlos (uso interno de control de calidad).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [salida, ...cuadros] = process.argv.slice(2);
const browserExecutable = process.env.NAVEGADOR || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const id = process.env.COMPOSICION || "PrestappRendimientos";
const composition = await selectComposition({ serveUrl, id, browserExecutable });
for (const f of cuadros.map(Number)) {
  await renderStill({ composition, serveUrl, frame: f, output: path.join(salida, `f${String(f).padStart(4, "0")}.png`), browserExecutable });
  process.stdout.write(`${f} `);
}
console.log("listo");
