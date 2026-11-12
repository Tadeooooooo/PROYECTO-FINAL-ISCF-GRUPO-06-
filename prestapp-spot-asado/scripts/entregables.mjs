// Arma los entregables a partir del master ProRes y los verifica con ffprobe.
// Requiere haber renderizado antes: entregables/prestapp_spot_45s_1080p_ProRes.mov (npm run master)
// y entregables/prestapp_spot_SFX.wav (npm run sfx).
// Uso: node scripts/entregables.mjs
import { execFileSync } from "node:child_process";

const E = "entregables";
const MASTER = `${E}/prestapp_spot_45s_1080p_ProRes.mov`;
const SIN_AUDIO = `${E}/prestapp_spot_45s_1080p_SIN_AUDIO.mp4`;
const CON_AUDIO = `${E}/prestapp_spot_45s_1080p.mp4`;
const SFX = `${E}/prestapp_spot_SFX.wav`;

const ffmpeg = (...args) => execFileSync("npx", ["remotion", "ffmpeg", "-v", "error", "-y", ...args], { stdio: "inherit" });
const ffprobe = (...args) => execFileSync("npx", ["remotion", "ffprobe", "-v", "error", ...args]).toString().trim();

// 2. H.264 High, yuv420p, ≥ 20 Mbps (22 Mbps de promedio), bt709, faststart, sin audio.
//    Con CRF 16 el archivo quedaba en ~2 Mbps y aparecían escalones en los degradés del fondo;
//    a 22 Mbps con "tune grain" el grano fino se conserva y el degradé queda liso como en el master.
ffmpeg(
  "-i", MASTER, "-map", "0:v:0", "-pix_fmt", "yuv420p",
  "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-b:v", "22M", "-maxrate", "26M", "-bufsize", "44M",
  "-tune", "grain", "-x264-params", "aq-mode=3", "-r", "30",
  "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
  "-an", "-movflags", "+faststart", SIN_AUDIO,
);
// 1. La misma imagen (copia exacta del video) + los efectos en AAC 48 kHz 320 kbps.
ffmpeg(
  "-i", SIN_AUDIO, "-i", SFX, "-map", "0:v:0", "-map", "1:a:0",
  "-c:v", "copy", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-movflags", "+faststart", CON_AUDIO,
);

// Verificación.
for (const archivo of [CON_AUDIO, SIN_AUDIO, MASTER, SFX]) {
  console.log(`\n== ${archivo}`);
  console.log(
    ffprobe(
      "-show_entries",
      "format=duration,size,bit_rate:stream=index,codec_type,codec_name,profile,width,height,pix_fmt,r_frame_rate,field_order,nb_frames,sample_rate,channels,bits_per_sample,bit_rate,duration,color_space,color_primaries,color_transfer,color_range",
      "-of", "default=noprint_wrappers=1",
      archivo,
    ),
  );
}
