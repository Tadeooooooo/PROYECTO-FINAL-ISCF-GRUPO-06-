"""
Música de fondo original para el reel (sintetizada): tranqui, sutil y sin batería.
84 BPM · Do mayor · colchón de acordes + arpegio suave tipo piano + bajo muy bajito.
Uso: python scripts/musica.py <salida.wav> [cuadros, a 30 por segundo; por defecto 645]
"""
import sys
import wave

import numpy as np
import pyloudnorm as pyln
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
DURACION = (int(sys.argv[2]) if len(sys.argv) > 2 else 645) / 30  # igual que el video
BPM = 84
PULSO = 60 / BPM
COMPAS = 4 * PULSO
rng = np.random.default_rng(11)

midi = lambda n: 440 * 2 ** ((n - 69) / 12)
filtro = lambda x, t, c, o=2: sosfilt(butter(o, c, btype=t, fs=SR, output="sos"), x)

# Acordes (uno por compás): Cmaj7 · Am7 · Fmaj7 · G6, y cierra en Cmaj9.
ACORDES = [
    ([60, 64, 67, 71], 36),
    ([57, 60, 64, 67], 33),
    ([57, 60, 65, 69], 29),
    ([55, 59, 62, 67], 31),
]
FINAL = ([60, 64, 67, 71, 74], 36)

n = int(DURACION * SR)
t_total = np.arange(n) / SR
pad = np.zeros(n)
arpegio = np.zeros(n)
bajo = np.zeros(n)

def nota_pad(f, ini, dur):
    i0 = int(ini * SR)
    largo = int((dur + 1.2) * SR)
    t = np.arange(largo) / SR
    voz = sum(np.sin(2 * np.pi * f * (1 + d) * t + rng.uniform(0, 6.28)) for d in (-0.0023, 0, 0.0023)) / 3
    voz += 0.12 * np.sin(2 * np.pi * 2 * f * t)
    ataque = np.clip(t / 0.7, 0, 1) ** 2
    suelta = np.clip(1 - (t - dur) / 1.2, 0, 1)
    seg = voz * ataque * suelta
    fin = min(n, i0 + largo)
    pad[i0:fin] += seg[: fin - i0]

def nota_piano(f, ini, vel):
    i0 = int(ini * SR)
    largo = int(1.6 * SR)
    t = np.arange(largo) / SR
    voz = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t) + 0.06 * np.sin(2 * np.pi * 3 * f * t)) * np.exp(-t / 0.45)
    voz *= np.clip(t / 0.004, 0, 1)
    fin = min(n, i0 + largo)
    arpegio[i0:fin] += vel * voz[: fin - i0]

def nota_bajo(f, ini, dur):
    i0 = int(ini * SR)
    largo = int((dur + 0.4) * SR)
    t = np.arange(largo) / SR
    voz = np.sin(2 * np.pi * f * t) * np.clip(t / 0.05, 0, 1) * np.clip(1 - (t - dur) / 0.4, 0, 1)
    fin = min(n, i0 + largo)
    bajo[i0:fin] += voz[: fin - i0]

compases = int(np.ceil(DURACION / COMPAS))
inicio_final = DURACION - 3.5  # el acorde final suena durante el cierre
for c in range(compases):
    ini = c * COMPAS
    if ini >= inicio_final:
        break
    notas, raiz = ACORDES[c % 4]
    dur = min(COMPAS, inicio_final - ini)
    for m in notas:
        nota_pad(midi(m), ini, dur)
    nota_bajo(midi(raiz), ini, dur)
    # Arpegio en corcheas, una octava arriba; arranca después de la intro y es muy suave.
    if ini >= COMPAS * 0.75:
        orden = [0, 2, 1, 3, 2, 1, 3, 2]
        for k in range(8):
            momento = ini + k * PULSO / 2
            if momento < inicio_final:
                nota_piano(midi(notas[orden[k]] + 12), momento, 0.55 if k % 2 == 0 else 0.4)

notas, raiz = FINAL
for m in notas:
    nota_pad(midi(m), inicio_final, DURACION - inicio_final - 0.4)
nota_bajo(midi(raiz), inicio_final, DURACION - inicio_final - 0.6)
for k, m in enumerate([72, 76, 79, 83, 86]):
    nota_piano(midi(m), inicio_final + k * 0.18, 0.45)

pad = filtro(pad, "lowpass", 1600)
mezcla = 0.55 * pad / np.max(np.abs(pad)) + 0.28 * arpegio / np.max(np.abs(arpegio)) + 0.3 * bajo / np.max(np.abs(bajo))

# Reverb suave (respuesta de ruido con caída exponencial) y tono cálido.
largo = int(2.2 * SR)
t = np.arange(largo) / SR
ir = filtro(rng.standard_normal(largo), "lowpass", 4000) * np.exp(-t / 0.5)
ir /= np.sqrt(np.sum(ir**2))
mojado = fftconvolve(mezcla, ir)[:n]
mezcla = 0.72 * mezcla + 0.28 * mojado
mezcla = filtro(mezcla, "lowpass", 6000)
mezcla = filtro(mezcla, "highpass", 35)

# Fundidos de entrada y salida.
mezcla *= np.clip(t_total / 1.2, 0, 1) * np.clip((DURACION - t_total) / 1.5, 0, 1)

# Nivel: -20 LUFS (en el video se baja un poco más, para que quede de fondo).
lufs = pyln.Meter(SR).integrated_loudness(mezcla)
mezcla *= 10 ** ((-20 - lufs) / 20)
pico = np.max(np.abs(mezcla))
if pico > 0.7:
    mezcla *= 0.7 / pico
estereo = np.stack([mezcla, np.concatenate([np.zeros(24), mezcla[:-24]])], axis=1)
datos = (np.clip(estereo, -1, 1) * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(datos.tobytes())
print(f"listo: {sys.argv[1]} · {DURACION:.2f} s · {pyln.Meter(SR).integrated_loudness(mezcla):.1f} LUFS · pico {20 * np.log10(np.max(np.abs(mezcla))):.1f} dBFS")
