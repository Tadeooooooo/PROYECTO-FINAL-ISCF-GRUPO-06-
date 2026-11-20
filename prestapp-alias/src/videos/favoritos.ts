import type { Video } from "../tipos";

// Reel "Cómo agregar un destinatario y ponerlo en favoritos" · 1125 cuadros = 37,5 s (con pausas largas para leer).
export const videoFavoritos: Video = {
  duracion: 1125,
  altoCaptura: 2436,
  intro: { hasta: 85, titulo: ["¿Cómo agrego un", "destinatario a", "*favoritos*?"], tamano: 88 },
  cierre: { desde: 1010, titulo: ["¡Listo! Tus", "*favoritos*", "aparecen primero"], tamano: 80 },
  musica: "audio/musica-favoritos.wav",
  whoosh: [80, 205, 310, 415, 595, 815, 902, 1006],
  pasos: [
    {
      numero: 1,
      instruccion: ["Tocá el *menú*", "de abajo a la derecha"],
      desde: 85,
      hasta: 205,
      pantallas: [{ captura: "paso1-inicio.png", desde: 85, toques: [{ x: 1046, y: 2226, en: 160 }] }],
      zoom: [{ desde: 115, z: 1.5, foco: [1046, 2226], destino: [600, 1200] }],
    },
    {
      numero: 2,
      instruccion: ["Entrá a", "*Destinatarios*"],
      desde: 205,
      hasta: 310,
      pantallas: [{ captura: "fav-menu.png", desde: 205, toques: [{ x: 600, y: 778, en: 280 }] }],
      zoom: [{ desde: 238, z: 1.5, foco: [600, 778], destino: [520, 1100] }],
    },
    {
      numero: 3,
      instruccion: ["Tocá", "*Nuevo destinatario*"],
      desde: 310,
      hasta: 415,
      pantallas: [{ captura: "fav-destinatarios.png", desde: 310, toques: [{ x: 602, y: 2275, en: 385 }] }],
      zoom: [{ desde: 343, z: 1.5, foco: [602, 2275], destino: [520, 1200] }],
    },
    {
      numero: 4,
      instruccion: ["Ingresá el", "*CVU, CBU o alias*"],
      desde: 415,
      hasta: 595,
      pantallas: [
        {
          captura: "fav-cvu.png",
          desde: 415,
          tipeos: [{ x: 140, y: 359, texto: "JUAN.PEREZ.MP", desde: 470, porLetra: 4 }],
          botones: [{ caja: [92, 1316, 1113, 1427], texto: "CONTINUAR", desde: 528 }],
          toques: [{ x: 602, y: 1371, en: 568 }],
        },
      ],
      zoom: [
        { desde: 445, z: 1.5, foco: [600, 387], destino: [520, 960] },
        { desde: 534, z: 1.5, foco: [602, 1371], destino: [520, 1150] },
      ],
    },
    {
      numero: 5,
      instruccion: ["Ingresá un apodo y", "tocá la *estrella*"],
      desde: 595,
      hasta: 815,
      pantallas: [
        {
          captura: "fav-ficha.png",
          desde: 595,
          tipeos: [{ x: 140, y: 1033, texto: "Juan", desde: 650, porLetra: 5 }],
          toques: [{ x: 118, y: 1195, en: 715 }],
        },
        {
          // La misma ficha con la estrella llena: entra con un fundido corto después del toque.
          captura: "fav-ficha-favorito.png",
          desde: 717,
          entrada: "fundido",
          dy: 5,
          tipeos: [{ x: 140, y: 1028, texto: "Juan", desde: 650, porLetra: 5 }],
          pops: [{ caja: [93, 1165, 144, 1216], en: 719 }],
          toques: [{ x: 600, y: 2254, en: 788 }],
        },
      ],
      zoom: [
        { desde: 625, z: 1.5, foco: [600, 1061], destino: [520, 1000] },
        { desde: 680, z: 1.5, foco: [300, 1195], destino: [520, 1050] },
        { desde: 750, z: 1.5, foco: [600, 2259], destino: [520, 1200] },
      ],
    },
    {
      numero: 6,
      instruccion: ["Desde el inicio,", "tocá *Transferir*"],
      desde: 815,
      hasta: 1010,
      pantallas: [
        { captura: "paso1-inicio.png", desde: 815, toques: [{ x: 603, y: 465, en: 880 }] },
        {
          captura: "fav-transferir.png",
          desde: 902,
          entrada: "deslizar",
          resaltados: [{ caja: [96, 862, 1108, 1024], desde: 950, etiqueta: "Tus favoritos aparecen primero" }],
        },
      ],
      zoom: [
        { desde: 845, z: 1.5, foco: [603, 465], destino: [520, 1000] },
        { desde: 892, z: 1 },
        { desde: 925, z: 1.35, foco: [603, 1000], destino: [520, 1080] },
      ],
    },
  ],
};
