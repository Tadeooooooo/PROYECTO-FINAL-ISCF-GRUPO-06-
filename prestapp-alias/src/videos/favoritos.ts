import type { Video } from "../tipos";

// Reel "Cómo agregar un destinatario y ponerlo en favoritos" · 815 cuadros = 27,2 s.
export const videoFavoritos: Video = {
  duracion: 815,
  altoCaptura: 2436,
  intro: { hasta: 75, titulo: ["¿Cómo agrego un", "destinatario a", "*favoritos*?"], tamano: 88 },
  cierre: { desde: 715, titulo: ["¡Listo! Tus", "*favoritos*", "aparecen primero"], tamano: 80 },
  musica: "audio/musica-favoritos.wav",
  whoosh: [70, 160, 235, 310, 430, 575, 632, 711],
  pasos: [
    {
      numero: 1,
      instruccion: ["Tocá el *menú*", "de abajo a la derecha"],
      desde: 75,
      hasta: 160,
      pantallas: [{ captura: "paso1-inicio.png", desde: 75, toques: [{ x: 1046, y: 2226, en: 128 }] }],
      zoom: [{ desde: 92, z: 1.5, foco: [1046, 2226], destino: [600, 1200] }],
    },
    {
      numero: 2,
      instruccion: ["Entrá a", "*Destinatarios*"],
      desde: 160,
      hasta: 235,
      pantallas: [{ captura: "fav-menu.png", desde: 160, toques: [{ x: 600, y: 778, en: 210 }] }],
      zoom: [{ desde: 176, z: 1.5, foco: [600, 778], destino: [520, 1100] }],
    },
    {
      numero: 3,
      instruccion: ["Tocá", "*Nuevo destinatario*"],
      desde: 235,
      hasta: 310,
      pantallas: [{ captura: "fav-destinatarios.png", desde: 235, toques: [{ x: 602, y: 2275, en: 286 }] }],
      zoom: [{ desde: 250, z: 1.5, foco: [602, 2275], destino: [520, 1200] }],
    },
    {
      numero: 4,
      instruccion: ["Ingresá el", "*CVU, CBU o alias*"],
      desde: 310,
      hasta: 430,
      pantallas: [
        {
          captura: "fav-cvu.png",
          desde: 310,
          tipeos: [{ x: 140, y: 359, texto: "JUAN.PEREZ.MP", desde: 344, porLetra: 3 }],
          botones: [{ caja: [92, 1316, 1113, 1427], texto: "CONTINUAR", desde: 388 }],
          toques: [{ x: 602, y: 1371, en: 410 }],
        },
      ],
      zoom: [
        { desde: 326, z: 1.5, foco: [600, 387], destino: [520, 960] },
        { desde: 386, z: 1.5, foco: [602, 1371], destino: [520, 1150] },
      ],
    },
    {
      numero: 5,
      instruccion: ["Ingresá un apodo y", "tocá la *estrella*"],
      desde: 430,
      hasta: 575,
      pantallas: [
        {
          captura: "fav-ficha.png",
          desde: 430,
          tipeos: [{ x: 140, y: 1033, texto: "Juan", desde: 462, porLetra: 4 }],
          toques: [{ x: 118, y: 1195, en: 500 }],
        },
        {
          // La misma ficha con la estrella llena: entra con un fundido corto después del toque.
          captura: "fav-ficha-favorito.png",
          desde: 502,
          entrada: "fundido",
          dy: 5,
          tipeos: [{ x: 140, y: 1028, texto: "Juan", desde: 462, porLetra: 4 }],
          pops: [{ caja: [93, 1165, 144, 1216], en: 504 }],
          toques: [{ x: 600, y: 2254, en: 555 }],
        },
      ],
      zoom: [
        { desde: 446, z: 1.5, foco: [600, 1061], destino: [520, 1000] },
        { desde: 478, z: 1.5, foco: [300, 1195], destino: [520, 1050] },
        { desde: 520, z: 1.5, foco: [600, 2259], destino: [520, 1200] },
      ],
    },
    {
      numero: 6,
      instruccion: ["Desde el inicio,", "tocá *Transferir*"],
      desde: 575,
      hasta: 715,
      pantallas: [
        { captura: "paso1-inicio.png", desde: 575, toques: [{ x: 603, y: 465, en: 612 }] },
        {
          captura: "fav-transferir.png",
          desde: 634,
          entrada: "deslizar",
          resaltados: [{ caja: [96, 862, 1108, 1024], desde: 668, etiqueta: "Tus favoritos aparecen primero" }],
        },
      ],
      zoom: [
        { desde: 591, z: 1.5, foco: [603, 465], destino: [520, 1000] },
        { desde: 624, z: 1 },
        { desde: 650, z: 1.35, foco: [603, 1000], destino: [520, 1080] },
      ],
    },
  ],
};
