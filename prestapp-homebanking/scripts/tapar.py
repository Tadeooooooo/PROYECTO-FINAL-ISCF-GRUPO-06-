"""
Tapa o reemplaza los datos reales de las capturas del Home Banking (las originales NO entran al repo).
Uso: python scripts/tapar.py <carpeta_con_las_capturas_originales> [carpeta_salida=public/capturas]

- Importes y saldos -> "$ ****"           - CVU / CBU / CUIT -> "0000***************"
- Alias propio -> "CLUB.EJEMPLO.PRESTAPP"  - Personas -> "Juan Pérez" / emails @ejemplo.com
- Movimientos: pastillas grises sobre "Operación" e importes
- QR reales (03 y 11) -> QR de ejemplo que no se puede leer   - Botón de Pix (06) -> borrado con el fondo
El texto nuevo se escribe en Montserrat (la tipografía de la plataforma), al mismo tamaño y en la misma línea de base.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ORIG = sys.argv[1]
SALIDA = sys.argv[2] if len(sys.argv) > 2 else "public/capturas"
os.makedirs(SALIDA, exist_ok=True)
FUENTES = "node_modules/@fontsource/montserrat/files/montserrat-latin-{}-normal.woff"

CUIT = "0000***************"
CVU = "0000***************"
ALIAS = "CLUB.EJEMPLO.PRESTAPP"
IMPORTE = "$ ****"
PASTILLA = (214, 217, 226)
AZUL = (35, 34, 169)


def abrir(nombre):
    return Image.open(os.path.join(ORIG, nombre)).convert("RGB")


def guardar(im, nombre):
    im.save(os.path.join(SALIDA, nombre), optimize=True)
    print("ok", nombre)


def fuente(peso, tam):
    return ImageFont.truetype(FUENTES.format(peso), tam)


def fondo_de(im, caja):
    """Color más común en el borde de la caja (el fondo sobre el que está el texto)."""
    a = np.asarray(im).astype(int)
    x0, y0, x1, y1 = caja
    borde = np.concatenate([a[y0, x0:x1], a[y1 - 1, x0:x1], a[y0:y1, x0], a[y0:y1, x1 - 1]])
    cols, cnt = np.unique(borde, axis=0, return_counts=True)
    return tuple(int(v) for v in cols[cnt.argmax()])


def tinta(im, caja, tol=40):
    """Caja exacta de los píxeles de texto dentro de 'caja' (lo que difiere del fondo)."""
    a = np.asarray(im).astype(int)
    x0, y0, x1, y1 = caja
    r = a[y0:y1, x0:x1]
    bg = np.array(fondo_de(im, caja))
    d = np.abs(r - bg).sum(2) > tol
    ys, xs = np.nonzero(d)
    if len(xs) == 0:
        raise SystemExit(f"sin tinta en {caja}")
    return x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1


def color_texto(im, caja):
    a = np.asarray(im).astype(int)
    x0, y0, x1, y1 = caja
    r = a[y0:y1, x0:x1].reshape(-1, 3)
    return tuple(int(v) for v in r[r.sum(1).argmin()])


def alto_tinta(texto, peso, tam):
    """Alto en píxeles de la tinta de 'texto' (mismo umbral que tinta())."""
    f = fuente(peso, tam)
    im = Image.new("L", (400, 120), 255)
    ImageDraw.Draw(im).text((10, 90), texto, font=f, fill=0, anchor="ls")
    a = np.asarray(im) < 215
    ys = np.nonzero(a.any(1))[0]
    return ys.max() - ys.min() + 1


def tam_por_alto(alto, peso, ref="0"):
    """Tamaño de letra cuyo '0' (o la referencia) mide 'alto' píxeles: así la cifra nueva queda igual de alta."""
    mejor = min((abs(alto_tinta(ref, peso, t / 4) - alto), t / 4) for t in range(24, 200))
    return mejor[1]


def metricas(texto, peso, tam):
    """(arriba, abajo) de la tinta respecto de la línea de base (arriba es negativo)."""
    f = fuente(peso, tam)
    im = Image.new("L", (600, 200), 255)
    ImageDraw.Draw(im).text((10, 120), texto, font=f, fill=0, anchor="ls")
    ys = np.nonzero((np.asarray(im) < 215).any(1))[0]
    return ys.min() - 120, ys.max() + 1 - 120


def ancho_tinta(texto, peso, tam):
    f = fuente(peso, tam)
    x0, _, x1, _ = f.getbbox(texto, anchor="ls")
    return x1 - x0


def tam_por_ancho(texto, ancho, peso):
    return min((abs(ancho_tinta(texto, peso, t / 4) - ancho), t / 4) for t in range(24, 200))[1]


def borrar(im, caja, color=None, pad=2):
    x0, y0, x1, y1 = caja
    caja = (x0 - pad, y0 - pad, x1 + pad, y1 + pad)
    color = color or fondo_de(im, (caja[0] - 2, caja[1] - 2, caja[2] + 2, caja[3] + 2))
    ImageDraw.Draw(im).rectangle((caja[0], caja[1], caja[2] - 1, caja[3] - 1), fill=color)


SS = 4  # el texto se dibuja a 4x y se reduce: espaciado exacto y antialias parejo en tamaños chicos


def escribir(im, x, base, texto, peso, tam, color, anchor="ls"):
    f = fuente(peso, tam * SS)
    ancho = int(f.getlength(texto)) + 8 * SS
    alto = int(tam * SS * 2)
    if anchor == "ms":
        x -= f.getlength(texto) / SS / 2
    ox, oy = round(x), round(base)
    dx, dy = (x - ox) * SS, (base - oy) * SS
    capa = Image.new("L", (ancho + 4 * SS, alto), 0)
    ImageDraw.Draw(capa).text((2 * SS + dx, alto * 0.7 + dy), texto, font=f, fill=255, anchor="ls")
    capa = capa.resize((capa.width // SS, capa.height // SS), Image.BOX)
    origen = (ox - 2, oy - round(alto * 0.7 / SS))
    im.paste(Image.new("RGB", capa.size, color), origen, capa)


def reemplazar(im, buscar, texto, peso=400, tam=None, base=None, color=None, alto_ref=None, pad=2):
    """Borra el texto que hay en 'buscar' y escribe 'texto' en su lugar (misma x inicial, misma línea de base)."""
    caja = tinta(im, buscar)
    color = color or color_texto(im, caja)
    bg = fondo_de(im, buscar)
    if tam is None:
        tam = tam_por_alto(alto_ref or (caja[3] - caja[1]), peso)
    base = base if base is not None else caja[3]
    borrar(im, caja, bg, pad)
    escribir(im, caja[0], base, texto, peso, tam, color)
    return caja, tam


def pastilla(im, caja, pad_x=7, pad_y=5):
    x0, y0, x1, y1 = caja
    caja = (x0 - pad_x, y0 - pad_y, x1 + pad_x, y1 + pad_y)
    ImageDraw.Draw(im).rounded_rectangle(caja, radius=(caja[3] - caja[1]) / 2, fill=PASTILLA)


def qr_de_ejemplo(lado_px, modulos, semilla):
    """Patrón con aspecto de QR (localizadores + módulos al azar) que no codifica nada: no se puede escanear."""
    rng = np.random.default_rng(semilla)
    m = (rng.random((modulos, modulos)) < 0.47).astype(np.uint8)

    def localizador(x, y):
        m[y : y + 7, x : x + 7] = 1
        m[y + 1 : y + 6, x + 1 : x + 6] = 0
        m[y + 2 : y + 5, x + 2 : x + 5] = 1
        # separador blanco alrededor
        for i in range(-1, 8):
            for j in (-1, 7):
                for (yy, xx) in ((y + j, x + i), (y + i, x + j)):
                    if 0 <= yy < modulos and 0 <= xx < modulos:
                        m[yy, xx] = 0

    localizador(0, 0)
    localizador(modulos - 7, 0)
    localizador(0, modulos - 7)
    img = Image.fromarray(((1 - m) * 255).astype(np.uint8), "L")
    return img.resize((lado_px, lado_px), Image.NEAREST).convert("RGB")


def poner_qr(im, caja, modulos, semilla):
    x0, y0, x1, y1 = caja
    lado = max(x1 - x0, y1 - y0)
    borrar(im, (x0, y0, x0 + lado, y0 + lado), (255, 255, 255), pad=3)
    im.paste(qr_de_ejemplo(lado, modulos, semilla), (x0, y0))


def borde_rojo_a_gris(im, caja, gris=186):
    """El campo con error tiene borde rojo: lo vuelve al gris normal conservando el antialias."""
    a = np.asarray(im).astype(float)
    x0, y0, x1, y1 = caja
    r = a[y0:y1, x0:x1]
    rojo = (r[..., 0] - r[..., 1]) > 40
    alfa = np.clip((255 - r[..., 1]) / (255 - 74), 0, 1)
    nuevo = 255 - alfa * (255 - gris)
    for c in range(3):
        r[..., c] = np.where(rojo, nuevo, r[..., c])
    a[y0:y1, x0:x1] = r
    return Image.fromarray(a.astype(np.uint8))


# ---------------------------------------------------------------- capturas sin datos: se copian tal cual
for n in ["01_login.png", "04_crear_nueva_contrasena.png", "08_cobranzas_transferencia_importe.png",
          "10_cobranzas_qr_pantalla_importe.png", "12_cobranzas_qr_impreso.png", "14_movimientos_filtros.png",
          "17_puntos_de_venta.png", "18_puntos_de_venta_detalle.png"]:
    if os.path.exists(os.path.join(ORIG, n)):
        guardar(abrir(n), n)

# ---------------------------------------------------------------- 02: CUIT fuera; campo de email sin el error en rojo
im = abrir("02_recuperar_contrasena_cuit_email.png")
borrar(im, tinta(im, (750, 388, 1100, 420)), (255, 255, 255))           # CUIT (se tipea en el video)
borrar(im, (1104, 448, 1124, 468), (255, 255, 255), pad=0)              # ícono de error
borrar(im, tinta(im, (740, 478, 900, 500)), (255, 255, 255))            # "* Email requerido."
im = borde_rojo_a_gris(im, (744, 437, 1136, 479))
guardar(im, "02_recuperar_contrasena_cuit_email.png")

# ---------------------------------------------------------------- 03: QR de ejemplo
im = abrir("03_qr_escanear_con_billetera.png")
poner_qr(im, tinta(im, (860, 365, 1060, 560)), 33, 7)
guardar(im, "03_qr_escanear_con_billetera.png")

# ---------------------------------------------------------------- 05: CVU y alias (los íconos de copiar se corren)
im = abrir("05_inicio.png")
icono_cvu = im.crop((478, 218, 495, 236))
icono_alias = im.crop((452, 241, 469, 259))
cvu = tinta(im, (300, 218, 475, 238))
ali = tinta(im, (302, 242, 450, 260))
borrar(im, (cvu[0], 216, 497, 237), (255, 255, 255), pad=0)
borrar(im, (ali[0], 240, 471, 260), (255, 255, 255), pad=0)
tam = tam_por_alto(cvu[3] - cvu[1], 400)
gris = (102, 102, 102)
escribir(im, cvu[0], cvu[3], CVU, 400, tam, gris)
escribir(im, ali[0], ali[3], ALIAS, 400, tam, gris)
im.paste(icono_cvu, (int(cvu[0] + ancho_tinta(CVU, 400, tam) + 12), 218))
im.paste(icono_alias, (int(ali[0] + ancho_tinta(ALIAS, 400, tam) + 12), 241))
guardar(im, "05_inicio.png")

# ---------------------------------------------------------------- 06: borrar la tarjeta de Pix con el fondo
im = abrir("06_cobranzas_metodos.png")
ImageDraw.Draw(im).rectangle((1077, 171, 1477, 363), fill=(255, 255, 255))
guardar(im, "06_cobranzas_metodos.png")

# ---------------------------------------------------------------- 07: campo de importe sin el error (se tipea en el video)
im = abrir("07_cobranzas_link.png")
borrar(im, (398, 119, 418, 139), (255, 255, 255), pad=0)                 # ícono de error
borrar(im, tinta(im, (18, 150, 200, 168)), (255, 255, 255))              # "* Importe requerido."
guardar(im, "07_cobranzas_link.png")

# ---------------------------------------------------------------- 09: datos para transferir
im = abrir("09_cobranzas_transferencia_datos.png")
titular = tinta(im, (15, 42, 200, 60))
tam_chico = tam_por_alto(tinta(im, (15, 96, 200, 114))[3] - tinta(im, (15, 96, 200, 114))[1], 400)
reemplazar(im, (15, 42, 200, 60), "Juan Pérez", tam=tam_chico, base=titular[1] - metricas("T", 400, tam_chico)[0])
reemplazar(im, (15, 96, 200, 114), CUIT, tam=tam_chico)
reemplazar(im, (15, 150, 250, 170), CVU, tam=tam_chico)
imp = tinta(im, (435, 40, 560, 70))
tam_imp = tam_por_ancho("$1,00", imp[2] - imp[0], 700)
borrar(im, imp, (255, 255, 255))
base_imp = imp[1] - metricas("$", 700, tam_imp)[0]
escribir(im, imp[0], base_imp, "$", 400, tam_imp, AZUL)
escribir(im, imp[0] + ancho_tinta("$ ", 400, tam_imp), base_imp, "****", 700, tam_imp, AZUL)
ali = tinta(im, (850, 40, 1200, 70))
reemplazar(im, (850, 40, 1200, 70), ALIAS, peso=700, tam=tam_por_alto(ali[3] - ali[1], 700), color=AZUL)
guardar(im, "09_cobranzas_transferencia_datos.png")

# ---------------------------------------------------------------- 11: importe y QR de ejemplo
im = abrir("11_cobranzas_qr_pantalla_generado.png")
imp = tinta(im, (150, 85, 320, 115))
tam_imp = tam_por_ancho("$1,00", imp[2] - imp[0], 700)
centro = (imp[0] + imp[2]) / 2
borrar(im, imp, (255, 255, 255))
base_imp = imp[1] - metricas("$", 700, tam_imp)[0]
escribir(im, centro, base_imp, IMPORTE, 700, tam_imp, AZUL, anchor="ms")
poner_qr(im, tinta(im, (80, 130, 370, 410)), 41, 23)
guardar(im, "11_cobranzas_qr_pantalla_generado.png")

# ---------------------------------------------------------------- 13: Movimientos, pastillas sobre importes y "Operación"
im = abrir("13_movimientos.png")
for i in range(10):
    yc = 193 + 45 * i
    pastilla(im, tinta(im, (500, yc - 13, 590, yc + 12)))
    pastilla(im, tinta(im, (670, yc - 13, 1130, yc + 12)))
guardar(im, "13_movimientos.png")

# ---------------------------------------------------------------- 15 / 16: destinatario (pastilla) e importes
for n, dest, imp in [("15_transferencias.png", (275, 160, 620, 186), (672, 160, 1040, 186)),
                     ("16_transferencias_detalle.png", (55, 163, 400, 189), (455, 163, 830, 189))]:
    im = abrir(n)
    d = tinta(im, dest)
    borrar(im, d, (255, 255, 255))
    pastilla(im, (d[0], d[1] - 1, d[0] + 92, d[3] + 1), pad_x=4, pad_y=5)
    c = tinta(im, imp)
    tam = tam_por_alto(c[3] - c[1], 400, ref="$2")
    borrar(im, c, (255, 255, 255))
    escribir(im, c[0], c[3] - metricas("$", 400, tam)[1], IMPORTE, 400, tam, (102, 102, 102))
    if n.startswith("15"):
        # "Disponible: $123,78": se reemplaza solo el importe (en negrita), que empieza después del espacio más ancho
        caja_total = tinta(im, (1340, 447, 1480, 467))
        a = np.asarray(im).astype(int)[447:467, caja_total[0]:caja_total[2]]
        tiene = (np.abs(a - 255).sum(2) > 40).any(0)
        corridas, x, hueco_max, x_peso = [], 0, 0, None
        while x < len(tiene):
            if not tiene[x]:
                ini = x
                while x < len(tiene) and not tiene[x]:
                    x += 1
                if x - ini > hueco_max:
                    hueco_max, x_peso = x - ini, caja_total[0] + x
            x += 1
        caja = tinta(im, (x_peso - 1, 447, 1480, 467))
        color_b = color_texto(im, caja)
        tam_b = tam_por_alto(caja[3] - caja[1], 700, ref="$")
        borrar(im, caja, (255, 255, 255))
        escribir(im, caja[0], caja[3] - metricas("$", 700, tam_b)[1], IMPORTE, 700, tam_b, color_b)
    guardar(im, n)

# ---------------------------------------------------------------- 19 / 20 / 21: tablas de usuarios
def tabla(im, cols, filas, extra_email):
    """cols = x de inicio de Nombre, Apellido, CUIT, Email; filas = (y0, y1) de cada fila."""
    nombre, apellido, cuit, email = cols
    for k, (y0, y1) in enumerate(filas):
        cifras = tinta(im, (cuit - 4, y0, email - 20, y1))
        base = cifras[3]
        tam = tam_por_alto(cifras[3] - cifras[1], 400)
        color = color_texto(im, cifras)
        def poner(x0, x1, texto):
            c = tinta(im, (x0 - 4, y0, x1, y1))
            borrar(im, c, fondo_de(im, (x0 - 6, y0, x1, y1)))
            escribir(im, c[0], base, texto, 400, tam, color)
        if k == 0:
            poner(nombre, apellido - 20, "Juan")
            poner(apellido, cuit - 20, "Pérez")
            poner(email, email + 260, "juan@ejemplo.com")
        else:
            poner(email, email + 260, extra_email)
        poner(cuit, email - 20, CUIT)


im = abrir("19_puntos_de_venta_usuarios_asociados.png")
tabla(im, (142, 280, 437, 625), [(140, 172), (195, 227)], "admin@ejemplo.com")
guardar(im, "19_puntos_de_venta_usuarios_asociados.png")

im = abrir("20_usuarios.png")
tabla(im, (241, 460, 692, 970), [(336, 366), (384, 414)], "admin@ejemplo.com")
guardar(im, "20_usuarios.png")

im = abrir("21_usuarios_detalle.png")
tabla(im, (20, 240, 474, 753), [(336, 366), (384, 414)], "admin@ejemplo.com")
# email y contraseña autocompletados (fondo celeste): se vacían, en el video se tipea un usuario de ejemplo
ImageDraw.Draw(im).rectangle((858, 109, 1120, 144), fill=(255, 255, 255))
ImageDraw.Draw(im).rectangle((1138, 109, 1356, 144), fill=(255, 255, 255))
guardar(im, "21_usuarios_detalle.png")
