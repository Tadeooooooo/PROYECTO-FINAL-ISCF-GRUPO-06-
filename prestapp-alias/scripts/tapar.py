"""
Tapa los datos personales de las capturas reales antes de usarlas en el video.
Las originales NO entran al proyecto: este script lee de la carpeta que le pases
y escribe solo las versiones tapadas en public/capturas/.

Uso: python scripts/tapar.py <carpeta con IMG_0631..0634.jpg>
"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ORIGEN = Path(sys.argv[1])
DESTINO = Path(__file__).resolve().parent.parent / "public" / "capturas"
DESTINO.mkdir(parents=True, exist_ok=True)

GRIS_CLARO = (214, 217, 226)  # franja sobre fondo blanco
GRIS_AZULADO = (101, 100, 190)  # franja sobre el encabezado azul (blanco al 30% sobre el azul de la app)

# (archivo, salida, [(caja x0, y0, x1, y1), color]) — cajas medidas sobre las capturas originales.
FRANJAS = {
    "IMG_0631.jpg": ("paso1-inicio.png", [((153, 209, 460, 265), GRIS_AZULADO)]),  # nombre del saludo (queda "Hola")
    "IMG_0632.jpg": ("paso2-menu.png", []),
    "IMG_0633.jpg": (
        "paso3-mi-cuenta.png",
        [
            ((80, 955, 400, 1002), GRIS_CLARO),  # Perfil asignado
            ((80, 1092, 400, 1138), GRIS_CLARO),  # Volumen operado
            ((80, 1228, 400, 1278), GRIS_CLARO),  # Disponible
            ((80, 1832, 592, 1878), GRIS_CLARO),  # CVU
            ((80, 1974, 548, 2022), GRIS_CLARO),  # Alias
        ],
    ),
    "IMG_0634.jpg": ("paso4-alias.png", []),
}
# En la edición del alias, el texto del campo se borra (queda el campo vacío) para animar el tipeo encima.
VACIAR = {"IMG_0634.jpg": (108, 583, 1098, 670)}

for archivo, (salida, franjas) in FRANJAS.items():
    im = Image.open(ORIGEN / archivo).convert("RGB")
    for caja, color in franjas:
        # 1) desenfoque fuerte de la zona, 2) franja redondeada encima (doble seguridad)
        alto = caja[3] - caja[1]
        mascara = Image.new("L", (caja[2] - caja[0], alto), 0)
        ImageDraw.Draw(mascara).rounded_rectangle((0, 0, mascara.width - 1, alto - 1), radius=alto // 2, fill=255)
        zona = im.crop(caja).filter(ImageFilter.GaussianBlur(18))
        im.paste(zona, caja[:2], mascara)
        ImageDraw.Draw(im).rounded_rectangle(caja, radius=alto // 2, fill=color)
    if archivo in VACIAR:
        ImageDraw.Draw(im).rectangle(VACIAR[archivo], fill=(255, 255, 255))
    im.save(DESTINO / salida, optimize=True)
    print("listo:", DESTINO / salida, im.size)
