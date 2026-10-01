// Exporta los videos.
//   npm run borrador -- qr        → borrador 540x960 (rápido, para revisar)
//   npm run final -- qr           → final 1080x1920 en alta nitidez
//   npm run final -- todos        → los 6 videos
// Videos: rendimientos, qr, transferencias, recargas, servicios, biometria.
// Después del nombre se pueden pasar opciones extra de Remotion.
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";

const VIDEOS = {
  rendimientos: "PrestappRendimientos",
  qr: "PrestappQR",
  transferencias: "PrestappTransferencias",
  recargas: "PrestappRecargas",
  servicios: "PrestappServicios",
  biometria: "PrestappBiometria",
};
const [modo, nombre = "rendimientos", ...extra] = process.argv.slice(2);
const opciones = { stdio: "inherit", shell: process.platform === "win32" };
const lista = nombre === "todos" ? Object.keys(VIDEOS) : [nombre];
if (!["borrador", "final"].includes(modo) || lista.some((n) => !VIDEOS[n])) {
  console.error(`Uso: npm run borrador|final -- <${Object.keys(VIDEOS).join("|")}|todos>`);
  process.exit(1);
}
mkdirSync("out", { recursive: true });

for (const n of lista) {
  const id = VIDEOS[n];
  if (modo === "borrador") {
    execFileSync("npx", ["remotion", "render", id, `out/prestapp-${n}-borrador-540x960.mp4`, "--scale=0.5", ...extra], opciones);
    continue;
  }
  // Final: renderiza al doble (2160x3840) casi sin pérdida, achica a 1080x1920 con buen filtro
  // (bordes de texto más limpios) y comprime en H.264 de alta calidad con el color que espera Instagram.
  const temporal = `out/_${n}-2x.mp4`;
  execFileSync("npx", ["remotion", "render", id, temporal, "--scale=2", "--crf=4", ...extra], opciones);
  execFileSync(
    "npx",
    [
      "remotion", "ffmpeg", "-y", "-i", temporal,
      "-vf", "scale=1080:1920:flags=lanczos",
      "-c:v", "libx264", "-preset", "slow", "-crf", "10",
      "-pix_fmt", "yuv420p",
      "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
      "-c:a", "copy",
      "-movflags", "+faststart",
      `out/prestapp-${n}-1080x1920.mp4`,
    ],
    opciones,
  );
  rmSync(temporal);
  console.log(`Listo: out/prestapp-${n}-1080x1920.mp4`);
}
