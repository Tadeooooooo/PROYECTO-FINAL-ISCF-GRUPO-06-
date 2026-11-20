"""
Tapa los datos personales de las capturas del video "Cómo agregar un destinatario a favoritos".
Las originales NO entran al proyecto: lee de la carpeta que le pases y escribe solo las versiones
tapadas en public/capturas/fav-*.png.

- Listas (Destinatarios y Transferir): franja gris redondeada sobre cada nombre (queda la descripción gris).
- Ficha del destinatario: el nombre se reemplaza por "Juan Pérez" (Montserrat Bold, mismo tamaño y color),
  y el CVU/CBU y el CUIL/CUIT se tapan con franjas grises.
- Transferir: en la fila del favorito el nombre pasa a "Juan Pérez - Prestapp".
- Sin otras marcas: como somos una billetera no mostramos otras empresas. "Mercado Libre" se reemplaza por
  "Prestapp" (listas: " - Prestapp"; ficha: "Entidad: PRESTAPP"); " - Sin Descripción" queda igual.

Uso: python scripts/tapar_favoritos.py <carpeta con IMG_0637..0642.jpg>
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ORIGEN = Path(sys.argv[1])
RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "public" / "capturas"
FUENTE = RAIZ / "node_modules" / "@fontsource" / "montserrat" / "files" / "montserrat-latin-700-normal.woff"
FUENTE_REGULAR = RAIZ / "node_modules" / "@fontsource" / "montserrat" / "files" / "montserrat-latin-400-normal.woff"
GRIS_CLARO = (214, 217, 226)  # mismas franjas que en el video del alias
NOMBRE_ORIGINAL = "Tadeo Ezequiel Perelstein"
NOMBRE_NUEVO = "Juan Pérez"


def franja(im, caja):
    """Desenfoque fuerte + franja gris redondeada encima (como en el video anterior)."""
    x0, y0, x1, y1 = caja
    alto = y1 - y0
    mascara = Image.new("L", (x1 - x0, alto), 0)
    ImageDraw.Draw(mascara).rounded_rectangle((0, 0, x1 - x0 - 1, alto - 1), radius=alto // 2, fill=255)
    im.paste(im.crop(caja).filter(ImageFilter.GaussianBlur(18)), (x0, y0), mascara)
    ImageDraw.Draw(im).rounded_rectangle(caja, radius=alto // 2, fill=GRIS_CLARO)


def tinta(a, caja, umbral):
    """Caja de los píxeles más oscuros que 'umbral' (máximo de los 3 canales) dentro de 'caja'."""
    x0, y0, x1, y1 = caja
    reg = a[y0:y1, x0:x1]
    m = reg.max(axis=2) < umbral
    ys, xs = np.where(m)
    if len(xs) == 0:
        return None
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max(), y0 + ys.max())


def color_tinta(a, caja, umbral):
    x0, y0, x1, y1 = caja
    reg = a[y0 : y1 + 1, x0 : x1 + 1].reshape(-1, 3)
    oscuros = reg[reg.max(axis=1) < umbral]
    # El color "lleno" del texto: el 30% más oscuro de los píxeles de tinta (los bordes son más claros por el suavizado).
    orden = oscuros[np.argsort(oscuros.sum(axis=1))]
    return tuple(int(v) for v in np.median(orden[: max(1, len(orden) * 3 // 10)], axis=0))


def reemplazar_nombre(im, a, caja_tinta, color, fondo):
    """Borra el nombre original y escribe "Juan Pérez" con el mismo tamaño (ajustado al ancho del original)."""
    x0, y0, x1, y1 = caja_tinta
    ancho = x1 - x0 + 1
    tam = 10
    while True:
        f = ImageFont.truetype(str(FUENTE), tam + 1)
        b = f.getbbox(NOMBRE_ORIGINAL)
        if b[2] - b[0] > ancho:
            break
        tam += 1
    fuente = ImageFont.truetype(str(FUENTE), tam)
    b_orig = fuente.getbbox(NOMBRE_ORIGINAL)
    d = ImageDraw.Draw(im)
    d.rectangle((x0 - 6, y0 - 6, x1 + 6, y1 + 6), fill=fondo)
    # Mismo origen que el texto original: alinea el borde izquierdo y la parte de arriba de la tinta.
    origen = (x0 - b_orig[0], y0 - b_orig[1])
    d.text(origen, NOMBRE_NUEVO, font=fuente, fill=color)
    b_nuevo = fuente.getbbox(NOMBRE_NUEVO)
    return origen[0] + b_nuevo[2], tam


DESTINO.mkdir(parents=True, exist_ok=True)


def abrir(nombre):
    im = Image.open(ORIGEN / nombre).convert("RGB")
    return im, np.asarray(im).astype(int)


def filas_de_nombres(a, y0, y1, x0=205, x1=1010, umbral=115):
    """Bandas horizontales con texto oscuro (los nombres en negrita) en la columna de la lista."""
    oscuras = (a[y0:y1, x0:x1].max(axis=2) < umbral).any(axis=1)
    bandas, ini = [], None
    for i, v in enumerate(oscuras):
        if v and ini is None:
            ini = i
        if not v and ini is not None:
            bandas.append((y0 + ini, y0 + i - 1))
            ini = None
    return [b for b in bandas if b[1] - b[0] >= 12]



def partes_fila(a, ya, yb, x0=205, x1=1010, umbral=200):
    """Separa una fila "Nombre - Descripción": nombre y descripción tienen el mismo gris, así que se corta en el guion
    (un trazo corto y finito entre los dos). Devuelve (caja del nombre, caja de la descripción con el guion)."""
    banda = a[ya:yb + 1, x0:x1].max(axis=2) < umbral
    columnas = banda.any(axis=0)
    segs, ini = [], None
    for i, v in enumerate(columnas):
        if v and ini is None:
            ini = i
        if not v and ini is not None:
            segs.append((ini, i - 1))
            ini = None
    if ini is not None:
        segs.append((ini, len(columnas) - 1))
    filas = lambda s: np.where(banda[:, s[0] : s[1] + 1].any(axis=1))[0]
    guion = next(k for k, sg in enumerate(segs) if 5 <= sg[1] - sg[0] <= 14 and len(filas(sg)) <= 7 and k > 0)
    ys = np.where(banda[:, : segs[guion - 1][1] + 1].any(axis=1))[0]
    nombre = (x0 + segs[0][0], ya + ys.min(), x0 + segs[guion - 1][1], ya + ys.max())
    ys2 = np.where(banda[:, segs[guion][0] :].any(axis=1))[0]
    desc = (x0 + segs[guion][0], ya + ys2.min(), x0 + segs[-1][1], ya + ys2.max())
    # Primera letra después del guion ("M" de Mercado o "S" de Sin Descripción): caja de su tinta.
    letra = segs[guion + 1]
    yl = filas(letra)
    primera = (x0 + letra[0], ya + yl.min(), x0 + letra[1], ya + yl.max())
    return nombre, desc, primera


def tamano_por_altura(fuente, alto_mayuscula):
    """Tamaño de letra cuya "M" mayúscula mide lo mismo que en la captura."""
    tam = 10
    while ImageFont.truetype(str(fuente), tam + 1).getbbox("M", anchor="ls")[1] * -1 <= alto_mayuscula:
        tam += 1
    return tam


def escribir(im, texto, x_tinta, base, fuente, tam, color):
    """Escribe 'texto' con la tinta empezando en x_tinta y apoyado en la línea de base 'base'."""
    f = ImageFont.truetype(str(fuente), tam)
    dx = f.getbbox(texto, anchor="ls")[0]
    ImageDraw.Draw(im).text((x_tinta - dx, base), texto, font=f, fill=color, anchor="ls")
    return x_tinta - dx + f.getlength(texto)


def reemplazar_descripcion(im, a, ya, yb, x_guion=None):
    """" - Mercado Libre ..." → " - Prestapp" (misma letra gris regular). " - Sin Descripción" no se toca."""
    _, desc, primera = partes_fila(a, ya, yb)
    ancho_letra = primera[2] - primera[0]
    if ancho_letra < 26:  # "S" de "Sin Descripción" (la "M" de "Mercado" mide ~34 px)
        return "sin descripción"
    fondo = tuple(int(v) for v in a[ya - 6, desc[0]])
    color = color_tinta(a, desc, 200)
    tam = tamano_por_altura(FUENTE_REGULAR, primera[3] - primera[1] + 1)
    ImageDraw.Draw(im).rectangle((desc[0] - 3, ya - 4, desc[2] + 6, yb + 6), fill=fondo)
    escribir(im, "- Prestapp", desc[0] if x_guion is None else x_guion, primera[3] + 1, FUENTE_REGULAR, tam, color)
    return f"reemplazada (tamaño {tam}, color {color})"


def tapar_lista(im, a, y0, y1):
    for ya, yb in filas_de_nombres(a, y0, y1):
        nombre, _, _ = partes_fila(a, ya - 2, yb + 3)
        print("   fila", ya, reemplazar_descripcion(im, a, ya - 2, yb + 3))
        franja(im, (nombre[0] - 16, nombre[1] - 11, nombre[2] + 7, nombre[3] + 11))


# Menú: no tiene datos personales.
im, a = abrir("IMG_0637.jpg")
im.save(DESTINO / "fav-menu.png", optimize=True)

# Destinatarios: nombres de "Últimos".
im, a = abrir("IMG_0638.jpg")
tapar_lista(im, a, 480, 2120)
im.save(DESTINO / "fav-destinatarios.png", optimize=True)

# CVU, CBU o Alias: se vacía el campo (para animar el tipeo encima).
im, a = abrir("IMG_0639.jpg")
ImageDraw.Draw(im).rectangle((107, 343, 1098, 431), fill=(255, 255, 255))
im.save(DESTINO / "fav-cvu.png", optimize=True)

# Fichas (estrella vacía y llena): nombre → "Juan Pérez"; CVU/CBU y CUIL/CUIT tapados.
for archivo, salida in (("IMG_0641.jpg", "fav-ficha.png"), ("IMG_0640.jpg", "fav-ficha-favorito.png")):
    im, a = abrir(archivo)
    nombre = tinta(a, (90, 335, 1100, 400) if archivo == "IMG_0641.jpg" else (90, 330, 1100, 395), 200)
    color = color_tinta(a, nombre, 200)
    fin, tam = reemplazar_nombre(im, a, nombre, color, (255, 255, 255))
    dy = 0 if archivo == "IMG_0641.jpg" else -5
    # Entidad: "MERCADO LIBRE SRL" → "PRESTAPP" (misma letra gris regular, mismo tamaño y posición).
    entidad = tinta(a, (90, 505 + dy, 1100, 560 + dy), 200)
    color_e = color_tinta(a, entidad, 200)
    fondo_e = tuple(int(v) for v in a[entidad[1] - 8, entidad[0] + 4])
    tam_e = tamano_por_altura(FUENTE_REGULAR, entidad[3] - entidad[1] + 1)
    ImageDraw.Draw(im).rectangle((entidad[0] - 6, entidad[1] - 6, entidad[2] + 6, entidad[3] + 6), fill=fondo_e)
    escribir(im, "PRESTAPP", entidad[0], entidad[3] + 1, FUENTE_REGULAR, tam_e, color_e)
    print(salida, "entidad", entidad, "color", color_e, "tamaño", tam_e)
    for y0, y1 in ((662, 722), (828, 885)):
        caja = tinta(a, (90, y0 + dy, 1100, y1 + dy), 200)
        franja(im, (caja[0] - 8, caja[1] - 9, caja[2] + 10, caja[3] + 9))
    im.save(DESTINO / salida, optimize=True)
    print(salida, "nombre", nombre, "color", color, "tamaño", tam)

# Transferir: fila del favorito y lista "Últimos".
im, a = abrir("IMG_0642.jpg")
(ya, yb), = filas_de_nombres(a, 900, 990)
nombre, desc, primera = partes_fila(a, ya - 2, yb + 3)
fondo = tuple(int(v) for v in a[nombre[1] - 12, nombre[0]])
color = color_tinta(a, nombre, 140)
color_desc = color_tinta(a, desc, 200)
tam_desc = tamano_por_altura(FUENTE_REGULAR, primera[3] - primera[1] + 1)
separacion = desc[0] - nombre[2]  # espacio original entre el nombre y el guion
fin, tam = reemplazar_nombre(im, a, nombre, color, fondo)
ImageDraw.Draw(im).rectangle((nombre[0] - 6, 905, desc[2] + 4, 985), fill=fondo)
fuente = ImageFont.truetype(str(FUENTE), tam)
b = fuente.getbbox(NOMBRE_ORIGINAL)
ImageDraw.Draw(im).text((nombre[0] - b[0], nombre[1] - b[1]), NOMBRE_NUEVO, font=fuente, fill=color)
escribir(im, "- Prestapp", fin + separacion, primera[3] + 1, FUENTE_REGULAR, tam_desc, color_desc)
tapar_lista(im, a, 1260, 2120)
im.save(DESTINO / "fav-transferir.png", optimize=True)
print("fav-transferir.png", "nombre", nombre, "descripcion", desc, "fondo", fondo, "tamaño", tam)
