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

// 2. H.264 High, yuv420p, CRF 16, bt709, faststart, sin audio.
ffmpeg(
  "-i", MASTER, "-map", "0:v:0",
  "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-r", "30",
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
