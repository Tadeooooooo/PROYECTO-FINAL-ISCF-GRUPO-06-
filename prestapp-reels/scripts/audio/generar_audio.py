#!/usr/bin/env python3
"""
Genera la música de fondo y los efectos de sonido del reel de rendimientos.

Todo el audio se sintetiza desde cero con matemática (osciladores, ruido y filtros):
no usa samples, loops ni grabaciones de terceros, así que es 100% original y libre de derechos.

Uso (desde la carpeta prestapp-reels):
    pip install numpy scipy
    python3 scripts/audio/generar_audio.py

Salida:
    public/audio/musica.wav      30 s, estéreo, 48 kHz
    public/audio/sfx/*.wav       efectos cortos

La música está pensada para la línea de tiempo del video (60 fps, 30 s):
120 BPM, así cada cambio de escena cae justo en un tiempo del compás.
"""
import os
import wave

import numpy as np
from scipy import signal

SR = 48000
BPM = 120
TIEMPO = 60 / BPM  # 0,5 s
DURACION = 30.0
AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.normpath(os.path.join(AQUI, "..", "..", "public", "audio"))
rng = np.random.default_rng(2026)


# ------------------------------------------------------------------ utilidades
def muestras(s):
    return int(round(s * SR))


def tiempo(n):
    return np.arange(n) / SR


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def filtro(x, tipo, f, orden=2):
    sos = signal.butter(orden, f, btype=tipo, fs=SR, output="sos")
    return signal.sosfilt(sos, x, axis=-1)


def estereo(x):
    return np.stack([x, x]) if x.ndim == 1 else x


def paneo(x, p):
    """p = -1 izquierda, 0 centro, 1 derecha (potencia constante)."""
    a = (p + 1) * np.pi / 4
    return np.stack([x * np.cos(a), x * np.sin(a)])


def sumar(destino, x, inicio):
    """Suma x (estéreo) en destino a partir del segundo `inicio`."""
    x = estereo(x)
    i = muestras(inicio)
    if i >= destino.shape[1]:
        return
    fin = min(destino.shape[1], i + x.shape[1])
    destino[:, i:fin] += x[:, : fin - i]


def fundido(x, entrada=0.002, salida=0.01):
    x = x.copy()
    n = x.shape[-1]
    a, b = min(n, muestras(entrada)), min(n, muestras(salida))
    if a:
        x[..., :a] *= np.linspace(0, 1, a)
    if b:
        x[..., n - b :] *= np.linspace(1, 0, b)
    return x


def guardar(ruta, x, pico_db=-3.0, normalizar=True):
    x = estereo(x)
    if normalizar:
        x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (pico_db / 20)
    datos = (np.clip(x, -1, 1) * 32767).astype("<i2").T.copy()
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    with wave.open(ruta, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(datos.tobytes())


# ------------------------------------------------------------------ reverb
def crear_ir(dur=1.6, predelay=0.014, brillo=6500):
    n = muestras(dur)
    ir = rng.standard_normal((2, n)) * np.exp(-tiempo(n) * 6.9 / dur)
    ir = filtro(ir, "lowpass", brillo)
    ir[:, : muestras(predelay)] = 0
    return ir / np.sqrt(np.sum(ir**2, axis=1, keepdims=True))


IR_SALA = crear_ir()
IR_CORTA = crear_ir(dur=0.7, brillo=8000)


def reverb(x, mezcla=0.25, ir=IR_SALA, cola=True):
    x = estereo(x)
    if cola:
        x = np.concatenate([x, np.zeros((2, ir.shape[1]))], axis=1)
    humedo = np.stack([signal.fftconvolve(x[c], ir[c])[: x.shape[1]] for c in range(2)])
    return x * (1 - mezcla) + humedo * mezcla


def eco(x, retardo, realim=0.35, repeticiones=4, cruzado=True):
    """Delay con rebotes alternando izquierda/derecha."""
    x = estereo(x)
    d = muestras(retardo)
    out = np.concatenate([x, np.zeros((2, d * repeticiones))], axis=1)
    for r in range(1, repeticiones + 1):
        g = realim**r
        rebote = x[::-1] if (cruzado and r % 2) else x
        out[:, d * r : d * r + x.shape[1]] += rebote * g
    return out


# ------------------------------------------------------------------ osciladores
def tabla_sierra(f, fc):
    """Un ciclo de diente de sierra de banda limitada, ya filtrado (pasa-bajos en fc)."""
    k = np.arange(1, max(2, int(0.45 * SR / f)))
    g = 1 / np.sqrt(1 + (k * f / fc) ** 4) / k
    fase = np.linspace(0, 2 * np.pi, 2048, endpoint=False)
    return (g[:, None] * np.sin(k[:, None] * fase[None, :])).sum(0)


def leer_tabla(tabla, f, n, fase0=0.0):
    fase = (fase0 + f * np.arange(n) / SR) % 1.0
    return np.interp(fase * len(tabla), np.arange(len(tabla) + 1), np.append(tabla, tabla[0]))


def sierra_barrida(f, n, fc):
    """Diente de sierra aditivo con pasa-bajos que cambia en el tiempo (fc es un array)."""
    t = tiempo(n)
    out = np.zeros(n)
    fc_max = np.max(fc)
    for k in range(1, int(0.45 * SR / f) + 1):
        fk = k * f
        if 1 / np.sqrt(1 + (fk / fc_max) ** 4) < 0.004:
            break
        out += (1 / np.sqrt(1 + (fk / fc) ** 4)) / k * np.sin(2 * np.pi * fk * t + rng.uniform(0, 2 * np.pi))
    return out


# ------------------------------------------------------------------ instrumentos
_cache = {}


def pluck(midi, dur=0.42, brillo=2600, decaimiento=0.2, detune=9):
    """Sinte "pluck" moderno: tres osciladores desafinados con filtro que se cierra."""
    clave = (midi, dur, brillo, decaimiento, detune)
    if clave in _cache:
        return _cache[clave]
    n = muestras(dur)
    t = tiempo(n)
    fc = 280 + brillo * np.exp(-t / 0.085)
    f = hz(midi)
    izq = sierra_barrida(f * 2 ** (-detune / 1200), n, fc)
    der = sierra_barrida(f * 2 ** (detune / 1200), n, fc)
    cen = sierra_barrida(f, n, fc)
    amp = np.minimum(1, t / 0.002) * np.exp(-t / decaimiento)
    x = fundido(np.stack([izq + 0.7 * cen, der + 0.7 * cen]) * amp * 0.5, salida=0.02)
    _cache[clave] = x
    return x


def pad(notas, dur, fc=1500, ataque=0.5, liberacion=0.8, detune=12):
    n = muestras(dur + liberacion)
    t = tiempo(n)
    izq = np.zeros(n)
    der = np.zeros(n)
    for m in notas:
        f = hz(m)
        tabla = tabla_sierra(f, fc)
        izq += leer_tabla(tabla, f * 2 ** (-detune / 1200), n, rng.random())
        der += leer_tabla(tabla, f * 2 ** (detune / 1200), n, rng.random())
        c = leer_tabla(tabla, f, n, rng.random())
        izq += 0.5 * c
        der += 0.5 * c
    amp = np.minimum(1, t / ataque)
    fin = muestras(dur)
    amp[fin:] *= np.exp(-(t[fin:] - dur) / (liberacion / 4))
    return np.stack([izq, der]) * amp / len(notas) * 0.5


def bajo(midi, dur):
    n = muestras(dur)
    t = tiempo(n)
    f = hz(midi)
    x = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)
    amp = np.minimum(1, t / 0.004) * np.exp(-t / (dur * 1.2))
    return fundido(np.tanh(2.2 * x * amp) * 0.6, salida=0.015)


def bombo():
    n = muestras(0.42)
    t = tiempo(n)
    f = 46 + 120 * np.exp(-t / 0.032)
    cuerpo = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.2)
    golpe = filtro(rng.standard_normal(n), "highpass", 2500) * np.exp(-t / 0.004) * 0.25
    return fundido(np.tanh(1.8 * (cuerpo + golpe)) * 0.9)


def aplauso():
    n = muestras(0.32)
    t = tiempo(n)
    env = np.zeros(n)
    for desfase in (0.0, 0.01, 0.021):
        i = muestras(desfase)
        env[i:] += np.exp(-t[: n - i] / 0.006)
    env += 0.55 * np.exp(-np.maximum(t - 0.03, 0) / 0.07) * (t > 0.03)
    x = filtro(rng.standard_normal(n), "bandpass", [900, 3200]) * env
    return fundido(x * 0.8)


def platillo(abierto=False):
    n = muestras(0.2 if abierto else 0.06)
    t = tiempo(n)
    x = filtro(rng.standard_normal(n), "highpass", 7500) * np.exp(-t / (0.07 if abierto else 0.018))
    return fundido(x * 0.45)


def redoble(dur=0.5):
    """Redoble que se acelera y crece (para llegar al drop)."""
    out = np.zeros(muestras(dur) + muestras(0.1))
    golpes = np.array([0, 0.25, 0.5, 0.625, 0.75, 0.8125, 0.875, 0.9375]) * dur  # corcheas → fusas
    for i, g in enumerate(golpes):
        n = muestras(0.09)
        t = tiempo(n)
        x = filtro(rng.standard_normal(n), "bandpass", [1200, 6000]) * np.exp(-t / 0.03)
        x += 0.4 * np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.04)
        j = muestras(g)
        out[j : j + n] += x * (0.25 + 0.75 * i / len(golpes))
    return out * 0.5


def ruido_barrido(dur, f_ini, f_fin, ancho=0.35, forma=None):
    """Ruido con un pasa-banda que se desplaza (base de whooshes y risers)."""
    n = muestras(dur)
    ruido = rng.standard_normal((2, n))
    f, _, Z = signal.stft(ruido, fs=SR, nperseg=1024)
    marcos = Z.shape[-1]
    centros = np.geomspace(f_ini, f_fin, marcos) if forma is None else forma(marcos)
    logf = np.log(np.maximum(f, 20))[:, None]
    mascara = np.exp(-((logf - np.log(centros)[None, :]) ** 2) / (2 * ancho**2))
    _, x = signal.istft(Z * mascara[None, :, :], fs=SR, nperseg=1024)
    return x[:, :n]


def campana(f, dur=1.2, decaimiento=0.5, brillo=1.0):
    """Campana / metal: parciales inarmónicos que decaen a distinta velocidad."""
    n = muestras(dur)
    t = tiempo(n)
    parciales = [(1.0, 1.0, 1.0), (2.01, 0.45, 0.7), (2.76, 0.3 * brillo, 0.5), (5.40, 0.18 * brillo, 0.3), (8.93, 0.08 * brillo, 0.2)]
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / (decaimiento * d)) for r, a, d in parciales)
    return fundido(x * np.minimum(1, t / 0.001))


def marimba(f, dur=0.5):
    n = muestras(dur)
    t = tiempo(n)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.16)
    x += 0.35 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.03)
    x += 0.12 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t / 0.01)
    return fundido(x * np.minimum(1, t / 0.001))


# ------------------------------------------------------------------ música
ACORDES = {  # voicings en MIDI
    "Am": [57, 60, 64, 67],
    "F": [53, 57, 60, 64],
    "G": [55, 59, 62, 64],
    "Em": [52, 55, 59, 62],
    "C": [48, 55, 64, 67, 71],
}
RAIZ = {"Am": 45, "F": 41, "G": 43, "Em": 40, "C": 36}

# (inicio en segundos, fin, acorde)
LINEA_ACORDES = [
    (0, 2, "Am"), (2, 4, "F"), (4, 6, "G"), (6, 8, "Em"), (8, 10, "Am"), (10, 12, "F"), (12, 14, "G"),
    (14, 16, "Em"), (16, 18, "Am"), (18, 20, "F"), (20, 22, "G"), (22, 24, "Em"), (24, 26, "F"),
    (26, 27, "G"), (27, 30, "C"),
]


def acorde_en(s):
    for a, b, nombre in LINEA_ACORDES:
        if a <= s < b:
            return nombre
    return "C"


def seccion(s):
    """Qué parte del tema suena en el segundo s (siguiendo las escenas del video)."""
    if s < 2:
        return "intro"  # gancho: se arma la tensión
    if 11 <= s < 14:
        return "noche"  # "Sin mover un dedo": baja la energía
    if 14 <= s < 21.5:
        return "b"  # simulación: se suma un arpegio
    if 24.5 <= s < 25:
        return "pausa"  # entra el cierre de marca
    if s >= 27:
        return "final"  # placa legal: calma
    return "a"


def componer(linea=None, seccion_fn=None, transponer=0, final=27.0, acorde_final="C", motivos=(2.0, 24.5)):
    """Compone el tema. Los parámetros permiten variantes (otros acordes, tonalidad y secciones)."""
    linea = linea or LINEA_ACORDES
    seccion_fn = seccion_fn or seccion
    t_ = transponer

    def acorde_local(s):
        for a, b, nombre in linea:
            if a <= s < b:
                return nombre
        return acorde_final

    def notas_de(nombre):
        return [m + t_ for m in ACORDES[nombre]]

    n = muestras(DURACION + 2)
    buses = {k: np.zeros((2, n)) for k in ("bombo", "bateria", "bajo", "pluck", "pad", "arpegio", "campanas")}
    kicks = []

    # Pads: un acorde sostenido por tramo
    for a, b, nombre in linea:
        volumen = {"intro": 1.6, "noche": 1.3, "final": 2.0}.get(seccion_fn(a), 0.55)
        fc = 900 if seccion_fn(a) in ("noche",) else 1500
        sumar(buses["pad"], pad(notas_de(nombre), b - a, fc=fc, ataque=0.25 if a else 0.05) * volumen, a)

    tiempos = np.arange(0, DURACION, TIEMPO / 4)  # grilla de semicorcheas
    for paso, s in enumerate(tiempos):
        sec = seccion_fn(s)
        pos = paso % 16  # posición dentro del compás (16 semicorcheas)
        nombre = acorde_local(s)

        # --- Batería
        if sec in ("a", "b") and pos % 4 == 0:
            sumar(buses["bombo"], bombo(), s)
            kicks.append(s)
        if sec == "noche" and pos in (0, 8):
            sumar(buses["bombo"], bombo() * 0.6, s)
            kicks.append(s)
        if sec in ("a", "b") and pos in (4, 12):
            sumar(buses["bateria"], paneo(aplauso(), 0.05), s)
        if sec == "a" and pos % 4 == 2:
            sumar(buses["bateria"], paneo(platillo(), 0.3), s)
        if sec == "b" and pos % 4 == 2:
            sumar(buses["bateria"], paneo(platillo(abierto=True), 0.3), s)
        if sec in ("a", "b") and pos % 2 == 1:
            sumar(buses["bateria"], paneo(platillo() * 0.35, -0.4), s)
        if sec == "intro" and s < 1.5 and pos % 2 == 0:
            sumar(buses["bateria"], paneo(platillo() * (0.2 + 0.4 * s / 1.5), 0.3), s)

        # --- Bajo: en los contratiempos (entre bombos)
        if sec in ("a", "b") and pos % 4 == 2:
            sumar(buses["bajo"], bajo(RAIZ[nombre] + t_, TIEMPO * 0.4), s)
        if sec == "noche" and pos == 0:
            sumar(buses["bajo"], bajo(RAIZ[nombre] + t_, TIEMPO * 1.6) * 0.8, s)

        # --- Pluck de acordes con ritmo 3-3-2
        if pos in (0, 6, 12) and sec not in ("pausa", "final"):
            if sec == "intro":
                brillo = 500 + 2600 * (s / 2)
            elif sec == "noche":
                brillo = 700
            else:
                brillo = 2600
            fuerza = 0.8 if sec == "intro" else 0.55
            for m in notas_de(nombre)[-3:]:
                sumar(buses["pluck"], pluck(m + 12, brillo=int(brillo) // 100 * 100) * fuerza, s)

        # --- Arpegio (sección de números)
        if sec == "b":
            notas = [m + 24 for m in notas_de(nombre)[-3:]]
            orden = [0, 1, 2, 1]
            sumar(buses["arpegio"], pluck(notas[orden[paso % 4]], dur=0.22, brillo=3800, decaimiento=0.09) * 0.35, s)

        # --- Campanitas nocturnas
        if sec == "noche" and pos in (2, 7, 11, 14):
            nota = rng.choice([76, 79, 81, 84, 86, 88])
            sumar(buses["campanas"], paneo(campana(hz(nota + t_), dur=1.5, decaimiento=0.35) * 0.18, rng.uniform(-0.6, 0.6)), s)

    # Intro: redoble y ruido que sube hacia el drop del segundo 2
    sumar(buses["bateria"], paneo(redoble(0.5), 0.1), 1.5)
    sube = ruido_barrido(1.6, 400, 9000, ancho=0.5)
    sube *= np.linspace(0, 1, sube.shape[1]) ** 2 * 0.12
    sumar(buses["bateria"], sube, 0.4)

    # Motivo de campana en el drop (2 s) y en el cierre de marca (24,5 s)
    for inicio in motivos:
        for i, m in enumerate([76, 79, 81, 84]):
            sumar(buses["campanas"], paneo(campana(hz(m + t_), dur=1.6, decaimiento=0.45) * 0.22, -0.3 + 0.2 * i), inicio + i * TIEMPO / 2)

    # Acorde final brillante en 27 s (placa legal)
    for m in notas_de(acorde_final):
        sumar(buses["pluck"], pluck(m + 12, dur=2.5, brillo=3200, decaimiento=0.9) * 0.6, final)
    sumar(buses["campanas"], paneo(campana(hz(84 + t_), dur=2.8, decaimiento=1.2) * 0.25, 0.2), final)

    # --- Efectos de bus
    buses["arpegio"] = eco(buses["arpegio"], TIEMPO * 0.75, realim=0.35)[:, :n]
    buses["pluck"] = reverb(buses["pluck"], 0.22, cola=False)
    buses["pad"] = reverb(buses["pad"], 0.35, cola=False)
    buses["campanas"] = reverb(buses["campanas"], 0.45, cola=False)
    buses["bateria"] = reverb(buses["bateria"], 0.12, ir=IR_CORTA, cola=False)

    # Compresión "sidechain": todo respira con el bombo
    respira = np.ones(n)
    t = tiempo(muestras(0.45))
    curva = 1 - 0.55 * np.exp(-t / 0.11)
    for k in kicks:
        i = muestras(k)
        fin = min(n, i + len(curva))
        respira[i:fin] = np.minimum(respira[i:fin], curva[: fin - i])
    for bus in ("bajo", "pluck", "pad", "arpegio"):
        buses[bus] *= respira

    # Balance pensado para parlantes de celular: graves contenidos, medios y brillo presentes.
    niveles = {"bombo": 0.55, "bateria": 0.75, "bajo": 0.45, "pluck": 0.85, "pad": 0.55, "arpegio": 0.65, "campanas": 0.75}
    mezcla = sum(buses[k] * v for k, v in niveles.items())
    mezcla = filtro(mezcla, "highpass", 32)
    mezcla = mezcla + 0.35 * filtro(mezcla, "highpass", 6000)  # "aire" en los agudos
    mezcla = mezcla[:, : muestras(DURACION)]

    # Final: se apaga suave en el último segundo y medio
    cola = muestras(1.5)
    mezcla[:, -cola:] *= np.linspace(1, 0, cola) ** 1.5

    # Masterizado: nivel y limitador suave
    mezcla = mezcla / (np.percentile(np.abs(mezcla), 99.9) + 1e-9) * 0.7
    mezcla = np.tanh(mezcla * 1.1)
    return mezcla / np.max(np.abs(mezcla)) * 0.89  # pico en -1 dBFS


# ------------------------------------------------------------------ efectos (SFX)
def sfx_whoosh(dur=0.5, pico=0.55, grave=False):
    grave_, agudo = (120, 1400) if grave else (250, 3200)

    def forma(marcos):
        # El filtro sube hasta el pico del whoosh y vuelve a bajar.
        x = np.linspace(0, 1, marcos)
        return grave_ * (agudo / grave_) ** np.sin(np.pi * np.clip(x / (2 * pico), 0, 1))

    x = ruido_barrido(dur, 0, 0, ancho=0.45, forma=forma)
    t = np.linspace(0, 1, x.shape[1])
    env = np.where(t < pico, (t / pico) ** 2, np.exp(-(t - pico) / 0.12))
    x = x * env
    giro = np.linspace(-0.7, 0.7, x.shape[1])
    return np.stack([x[0] * np.cos((giro + 1) * np.pi / 4), x[1] * np.sin((giro + 1) * np.pi / 4)])


def sfx_impacto():
    n = muestras(1.2)
    t = tiempo(n)
    f = 38 + 70 * np.exp(-t / 0.06)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45)
    golpe = filtro(rng.standard_normal(n), "lowpass", 3000) * np.exp(-t / 0.05)
    x = np.tanh(1.5 * (sub + 0.6 * golpe))
    return reverb(fundido(x), 0.2)


def sfx_pop(f_ini=1300, f_fin=380, dur=0.12):
    n = muestras(dur)
    t = tiempo(n)
    f = f_fin + (f_ini - f_fin) * np.exp(-t / 0.018)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035)
    x += filtro(rng.standard_normal(n), "highpass", 3000) * np.exp(-t / 0.002) * 0.15
    return reverb(fundido(x), 0.12, ir=IR_CORTA)


def sfx_moneda():
    """ "Cha-ching" suave: dos golpes metálicos agudos."""
    a = campana(1975.5, dur=0.25, decaimiento=0.08)
    b = campana(2637.0, dur=1.0, decaimiento=0.35)
    x = np.zeros(muestras(1.1))
    x[: len(a)] += a * 0.8
    i = muestras(0.07)
    x[i : i + len(b)] += b
    return reverb(x, 0.25)


def sfx_tintineo(f):
    x = campana(f * rng.uniform(0.98, 1.02), dur=0.45, decaimiento=0.12, brillo=1.3)
    x[: muestras(0.004)] += rng.standard_normal(muestras(0.004)) * 0.3
    return reverb(x, 0.15, ir=IR_CORTA)


def sfx_tic():
    n = muestras(0.03)
    t = tiempo(n)
    x = np.sin(2 * np.pi * 1900 * t) * np.exp(-t / 0.004)
    x += filtro(rng.standard_normal(n), "bandpass", [2500, 6000]) * np.exp(-t / 0.0015) * 0.5
    return fundido(x)


def sfx_contador(dur=0.8):
    """Tics que empiezan rápido y se van frenando (como un contador que llega a su número)."""
    x = np.zeros(muestras(dur + 0.05))
    tic = sfx_tic()
    s, paso = 0.0, 0.022
    while s < dur:
        i = muestras(s)
        x[i : i + len(tic)] += tic * (0.6 + 0.4 * s / dur)
        s += paso
        paso *= 1.11
    return x


def sfx_tecla():
    n = muestras(0.06)
    t = tiempo(n)
    x = filtro(rng.standard_normal(n), "bandpass", [1800, 5500]) * np.exp(-t / 0.004)
    x += 0.5 * np.sin(2 * np.pi * rng.uniform(150, 190) * t) * np.exp(-t / 0.012)
    return reverb(fundido(x), 0.08, ir=IR_CORTA)


def sfx_nota(midi):
    return reverb(marimba(hz(midi), dur=0.55), 0.2)


def sfx_notificacion():
    x = np.zeros(muestras(1.3))
    a = marimba(hz(79), 0.6)  # G5
    b = marimba(hz(86), 0.9)  # D6
    x[: len(a)] += a
    i = muestras(0.11)
    x[i : i + len(b)] += b
    c = campana(hz(98), dur=0.8, decaimiento=0.3) * 0.12
    x[i : i + len(c)] += c[: len(x) - i]
    return reverb(x, 0.3)


def sfx_brillo():
    x = np.zeros(muestras(1.4))
    for i, m in enumerate([88, 91, 93, 96, 100]):
        c = campana(hz(m), dur=0.9, decaimiento=0.25, brillo=0.6) * (0.5 + 0.1 * i)
        j = muestras(0.07 * i + rng.uniform(0, 0.02))
        x[j : j + len(c)] += c[: len(x) - j]
    return reverb(x, 0.45)


def sfx_trazo():
    x = ruido_barrido(0.35, 1500, 7000, ancho=0.35)
    t = np.linspace(0, 1, x.shape[1])
    return x * np.sin(np.pi * t) ** 1.5


def sfx_subida(dur=1.3):
    """Tono y ruido que suben mientras crecen las barras."""
    n = muestras(dur)
    t = tiempo(n)
    f = 220 * 2 ** (2.3 * (t / dur) ** 1.4)
    tono = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
    x = paneo(tono * (t / dur) ** 1.2 * 0.35, 0) + ruido_barrido(dur, 600, 8000, ancho=0.4) * (t / dur) ** 2 * 0.6
    return fundido(x, salida=0.02)


def sfx_exito():
    x = np.zeros((2, muestras(1.8)))
    for i, m in enumerate([84, 88, 91, 96]):  # do-mi-sol-do
        c = paneo(campana(hz(m), dur=1.4, decaimiento=0.5) * (0.7 + 0.1 * i), -0.3 + 0.2 * i)
        j = muestras(0.045 * i)
        x[:, j : j + c.shape[1]] += c[:, : x.shape[1] - j]
    return reverb(x, 0.35)


def sfx_entra_plata():
    x = np.zeros(muestras(0.8))
    a = marimba(hz(84), 0.4)
    b = marimba(hz(91), 0.6)
    x[: len(a)] += a
    i = muestras(0.06)
    x[i : i + len(b)] += b
    return reverb(x, 0.25)


def sfx_ping():
    return reverb(campana(hz(96), dur=1.6, decaimiento=0.6, brillo=0.5), 0.4)


def sfx_boton():
    x = estereo(sfx_pop(900, 300, 0.1))
    click = np.zeros(x.shape[1])
    n = muestras(0.01)
    click[:n] = filtro(rng.standard_normal(n), "bandpass", [2000, 7000]) * np.exp(-tiempo(n) / 0.002)
    return x + estereo(click) * 0.4


def sfx_bip():
    """Bip corto y amable de lector de código."""
    n = muestras(0.16)
    t = tiempo(n)
    x = (np.sin(2 * np.pi * 1760 * t) + 0.25 * np.sin(2 * np.pi * 3520 * t)) * np.minimum(1, t / 0.004) * np.exp(-t / 0.06)
    return reverb(fundido(x), 0.15, ir=IR_CORTA)


def generar_efectos():
    carpeta = os.path.join(SALIDA, "sfx")
    efectos = {
        "whoosh": sfx_whoosh(),
        "whoosh-suave": sfx_whoosh(0.45, grave=True),
        "impacto": sfx_impacto(),
        "pop": sfx_pop(),
        "pop-suave": sfx_pop(900, 320, 0.1),
        "pop-grande": sfx_pop(700, 160, 0.2),
        "moneda": sfx_moneda(),
        "tintineo-1": sfx_tintineo(2200),
        "tintineo-2": sfx_tintineo(2480),
        "tintineo-3": sfx_tintineo(2790),
        "contador": sfx_contador(),
        "tecla-1": sfx_tecla(),
        "tecla-2": sfx_tecla(),
        "tecla-3": sfx_tecla(),
        "notificacion": sfx_notificacion(),
        "brillo": sfx_brillo(),
        "trazo": sfx_trazo(),
        "subida": sfx_subida(),
        "exito": sfx_exito(),
        "entra-plata": sfx_entra_plata(),
        "ping": sfx_ping(),
        "boton": sfx_boton(),
        "bip": sfx_bip(),
    }
    # 14 notas que suben (pentatónica de do) para los días del calendario
    escala = [67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98]
    for i, m in enumerate(escala, start=1):
        efectos[f"nota-{i:02d}"] = sfx_nota(m)

    for nombre, x in efectos.items():
        # Recorta el silencio del final para que los archivos sean livianos
        x = estereo(x)
        vivo = np.where(np.max(np.abs(x), axis=0) > 1e-3 * np.max(np.abs(x)))[0]
        x = fundido(x[:, : vivo[-1] + 1], entrada=0, salida=0.01)
        guardar(os.path.join(carpeta, f"{nombre}.wav"), x, pico_db=-3)
    return list(efectos)


if __name__ == "__main__":
    nombres = generar_efectos()
    print(f"{len(nombres)} efectos generados en {os.path.join(SALIDA, 'sfx')}")
    musica = componer()
    guardar(os.path.join(SALIDA, "musica.wav"), musica, normalizar=False)
    print(f"Música generada: {os.path.join(SALIDA, 'musica.wav')} ({musica.shape[1] / SR:.1f} s)")
