import type { Video } from "../tipos";

// Reel "Cómo cambiar tu alias" · 645 cuadros = 21,5 s.
export const videoAlias: Video = {
  duracion: 645,
  altoCaptura: 2464,
  intro: { hasta: 75, titulo: ["¿Cómo cambio", "mi *alias*?"], tamano: 104 },
  cierre: { desde: 540, titulo: ["¡Listo! Ya tenés", "tu *alias nuevo*"], tamano: 88 },
  musica: "audio/musica.wav",
  whoosh: [70, 180, 270, 405, 536],
  pasos: [
    {
      numero: 1,
      instruccion: ["Tocá el *menú*", "de abajo a la derecha"],
      desde: 75,
      hasta: 180,
      pantallas: [{ captura: "paso1-inicio.png", desde: 75, toques: [{ x: 1046, y: 2226, en: 140 }] }],
      zoom: [{ desde: 100, z: 1.5, foco: [1046, 2226], destino: [600, 1200] }],
    },
    {
      numero: 2,
      instruccion: ["Entrá a", "*Mi cuenta*"],
      desde: 180,
      hasta: 270,
      pantallas: [{ captura: "paso2-menu.png", desde: 180, toques: [{ x: 600, y: 305, en: 232 }] }],
      zoom: [{ desde: 198, z: 1.5, foco: [600, 305], destino: [520, 960] }],
    },
    {
      numero: 3,
      instruccion: ["Bajá hasta Alias y", "tocá el *lápiz azul*"],
      desde: 270,
      hasta: 405,
      pantallas: [
        {
          captura: "paso3-mi-cuenta.png",
          desde: 270,
          scroll: { desde: 290, hasta: 328, inicio: 280, encabezado: 188, relleno: "paso3-relleno.png" },
          toques: [{ x: 1090, y: 1971, en: 372 }],
        },
      ],
      zoom: [{ desde: 334, z: 1.5, foco: [1090, 1971], destino: [620, 1150] }],
    },
    {
      numero: 4,
      instruccion: ["Escribí tu alias nuevo", "y tocá *Guardar*"],
      desde: 405,
      hasta: 540,
      pantallas: [
        {
          captura: "paso4-alias.png",
          desde: 405,
          tipeos: [{ x: 147, y: 600, texto: "MI.ALIAS.NUEVO", desde: 444, porLetra: 3 }],
          botones: [{ caja: [106, 2198, 1099, 2309], texto: "GUARDAR", desde: 490 }],
          toques: [{ x: 603, y: 2254, en: 504 }],
        },
      ],
      zoom: [
        { desde: 421, z: 1.5, foco: [600, 626], destino: [520, 900] },
        { desde: 484, z: 1.5, foco: [603, 2254], destino: [520, 1200] },
      ],
    },
  ],
};
