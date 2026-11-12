// Genera entregables/guion_y_tiempos.txt desde src/guion.json y verifica las reglas de lectura.
// Uso: node scripts/guion.mjs entregables/guion_y_tiempos.txt
import fs from "node:fs";

const g = JSON.parse(fs.readFileSync("src/guion.json", "utf8"));
const fps = g.fps; // cuadros base del guion
const fpsSalida = g.fpsSalida;
// Timecode del video final (60 fps): HH:MM:SS:CC con CC de 0 a 59.
const tc = (f) => {
  const r = Math.round((f * fpsSalida) / fps);
  const s = Math.floor(r / fpsSalida);
  return `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(r % fpsSalida).padStart(2, "0")}`;
};
const seg = (f) => (f / fps).toFixed(2).replace(".", ",");

let ok = true;
const filas = [];
g.escenas.forEach((e, i) => {
  const minimo = Math.max(2.5, 1.5 + 0.35 * e.palabras, e.minimoBrief ?? 0);
  const real = (e.sale - e.asentado) / fps; // quieto: desde que el último texto se asentó hasta que empieza a salir
  const entrada = Math.max(...e.textos.map((t) => t.asentado - t.entra)) / fps; // la entrada más larga de un texto
  const salida = (e.fin - e.sale) / fps;
  const anterior = g.escenas[i - 1];
  const pisa = anterior && e.entra < anterior.fin;
  const salidaMax = e.id === 7 ? 15 / fps : 0.4; // cierre: fundido de 15 cuadros pedido por el brief
  const cumple = real >= minimo - 1e-9 && entrada <= 0.6 + 1e-9 && salida <= salidaMax + 1e-9 && !pisa;
  ok &&= cumple;
  filas.push({ e, minimo, real, entradaTextos: entrada, salida, cumple });
});

const L = [];
L.push("PRESTAPP · SPOT INSTITUCIONAL PARA PANTALLAS LED");
L.push(`1920x1080 · ${fpsSalida} fps · ${(g.duracion * fpsSalida) / fps} cuadros = ${seg(g.duracion)} s · loop: empieza y termina en el fondo azul limpio`);
L.push(`Timecodes en formato HH:MM:SS:CC (CC = cuadro dentro del segundo, 0-${fpsSalida - 1}).`);
L.push("");
L.push("GUION Y TIEMPOS");
L.push("===============");
for (const { e } of filas) {
  L.push("");
  L.push(`ESCENA ${e.id} · ${e.nombre.toUpperCase()}`);
  L.push(`  En pantalla: ${e.textos.map((t) => `"${t.texto}"`).join(" + ")}`);
  for (const t of e.textos) L.push(`    · "${t.texto}" entra ${tc(t.entra)} → quieto ${tc(t.asentado)}`);
  L.push(`  Entra:       ${tc(e.entra)}  (${seg(e.entra)} s)`);
  L.push(`  Quieto desde ${tc(e.asentado)}  (${seg(e.asentado)} s)`);
  L.push(`  Sale:        ${tc(e.sale)} → ${tc(e.fin)}  (${seg(e.sale)} → ${seg(e.fin)} s)`);
  L.push(`  Locución sugerida: "${e.locucion}"`);
}
L.push("");
L.push("EFECTOS DE SONIDO (prestapp_spot_SFX.wav, sincronizado desde 00:00)");
L.push("=====================================================================");
for (const s of g.sfx) L.push(`  ${tc(s.cuadro)}  (${seg(s.cuadro)} s)  ${s.descripcion}`);
L.push("");
L.push("TABLA DE TIEMPOS DE LECTURA");
L.push("===========================");
L.push("Regla: quieto ≥ max(2,5 s; 1,5 s + 0,35 s × palabras). Entrada ≤ 0,6 s. Salida ≤ 0,4 s. Sin superposición.");
L.push("");
L.push("Esc | Palabras | Mínimo | Real   | Entrada (texto más lento) | Salida | Cumple");
for (const f of filas) {
  L.push(
    `${String(f.e.id).padEnd(3)} | ${String(f.e.palabras).padEnd(8)} | ${f.minimo.toFixed(2).replace(".", ",")} s | ${f.real.toFixed(2).replace(".", ",")} s | ${f.entradaTextos.toFixed(2).replace(".", ",")} s                  | ${f.salida.toFixed(2).replace(".", ",")} s | ${f.cumple ? "sí" : "NO"}`,
  );
}
L.push("");
L.push("Notas:");
L.push("- Escena 4: el brief pide además \"CUOTAS\" y subtítulo quietos al menos 3,5 s.");
L.push("- Escena 5: sin cifras; el celular muestra la lista de \"Rendimiento Saldo\" con los montos tapados.");
L.push("- Escena 7: el cierre queda completamente quieto y en los últimos 0,5 s se funde al fondo, como pide el brief.");
fs.writeFileSync(process.argv[2], L.join("\n") + "\n");
console.log(L.slice(L.indexOf("TABLA DE TIEMPOS DE LECTURA")).join("\n"));
if (!ok) {
  console.error("\nHAY TEXTOS QUE NO CUMPLEN");
  process.exit(1);
}
