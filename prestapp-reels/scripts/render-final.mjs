// Exporta el MP4 final con máxima nitidez:
// 1) renderiza al doble de resolución (2160x3840) casi sin pérdida,
// 2) lo achica a 1080x1920 con buen filtro (bordes de texto más limpios),
// 3) lo comprime en H.264 de alta calidad, con el color estándar que espera Instagram.
// Uso: npm run final   (se le pueden pasar opciones extra de Remotion al final)
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const temporal = "out/_final-2x.mp4";
const salida = "out/prestapp-rendimientos-1080x1920.mp4";
const extra = process.argv.slice(2);
const opciones = { stdio: "inherit", shell: process.platform === "win32" };

mkdirSync("out", { recursive: true });
execFileSync("npx", ["remotion", "render", "PrestappRendimientos", temporal, "--scale=2", "--crf=4", ...extra], opciones);
execFileSync(
  "npx",
  [
    "remotion", "ffmpeg", "-y", "-i", temporal,
    "-vf", "scale=1080:1920:flags=lanczos",
    "-c:v", "libx264", "-preset", "slow", "-crf", "10",
    "-pix_fmt", "yuv420p",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-movflags", "+faststart",
    salida,
  ],
  opciones,
);
rmSync(temporal);
console.log(`Listo: ${salida}`);
