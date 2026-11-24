"""
Efectos de sonido sutiles para el reel (sintetizados, sin samples de internet):
- tap.wav: toque suave de interfaz, corto y cálido.
- whoosh.wav: aire leve para las transiciones.
Uso: python scripts/sfx.py public/audio/sfx
"""
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
rng = np.random.default_rng(3)


def filtro(x, tipo, corte, orden=2):
    return sosfilt(butter(orden, corte, btype=tipo, fs=SR, output="sos"), x)


def guardar(ruta, x, pico_db):
    x = x / np.max(np.abs(x)) * 10 ** (pico_db / 20)
    n_in, n_out = int(0.002 * SR), int(0.02 * SR)
    x[:n_in] *= np.linspace(0, 1, n_in)
    x[-n_out:] *= np.linspace(1, 0, n_out)
    datos = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(str(ruta), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(datos.tobytes())
    print("listo:", ruta, f"{len(x) / SR:.2f} s")


def tap():
    t = np.arange(int(0.18 * SR)) / SR
    tono = np.sin(2 * np.pi * 620 * t) * np.exp(-t / 0.028) + 0.3 * np.sin(2 * np.pi * 930 * t) * np.exp(-t / 0.018)
    clic = filtro(rng.standard_normal(len(t)), "bandpass", [900, 3000]) * np.exp(-t / 0.004) * 0.6
    return filtro(tono + clic, "lowpass", 4000)


def whoosh():
    dur = 0.5
    t = np.arange(int(dur * SR)) / SR
    ruido = rng.standard_normal(len(t))
    grave = filtro(ruido, "bandpass", [250, 900], 2)
    medio = filtro(ruido, "bandpass", [700, 2200], 2)
    avance = np.sin(np.pi * t / dur) ** 2
    mezcla = grave * (1 - t / dur) + medio * (t / dur)
    return mezcla * avance


destino = Path(sys.argv[1])
destino.mkdir(parents=True, exist_ok=True)
guardar(destino / "tap.wav", tap(), -9)
guardar(destino / "whoosh.wav", whoosh(), -14)
