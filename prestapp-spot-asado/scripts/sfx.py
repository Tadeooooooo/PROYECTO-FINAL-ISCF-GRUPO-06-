"""
Efectos de sonido del spot (sintetizados, sin samples de internet).
Lee los cuadros exactos de src/guion.json y escribe un WAV de 48 kHz / 24 bits
con la misma duración que el video, sincronizado desde 00:00.

Uso: python scripts/sfx.py entregables/prestapp_spot_SFX.wav
"""
import json
import struct
import sys
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, resample_poly, sosfilt

SR = 48000
RAIZ = Path(__file__).resolve().parent.parent
GUION = json.loads((RAIZ / "src" / "guion.json").read_text(encoding="utf-8"))
rng = np.random.default_rng(7)


def db(x):
    return 20 * np.log10(max(x, 1e-12))


def filtro(x, tipo, corte, orden=2):
    return sosfilt(butter(orden, corte, btype=tipo, fs=SR, output="sos"), x)


def fades(x, entrada=0.004, salida=0.03):
    n_in, n_out = int(entrada * SR), int(salida * SR)
    x[:n_in] *= np.sin(np.linspace(0, np.pi / 2, n_in)) ** 2
    x[-n_out:] *= np.cos(np.linspace(0, np.pi / 2, n_out)) ** 2
    return x


def reverb(x, largo=0.35, mezcla=0.18):
    """Reverb corta: respuesta de ruido filtrado con caída exponencial."""
    n = int(largo * SR)
    t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t / (largo / 5))
    ir = filtro(ir, "lowpass", 3500)
    ir /= np.sqrt(np.sum(ir**2))
    mojado = np.concatenate([np.convolve(x, ir), [0.0]])[: len(x) + n]
    seco = np.concatenate([x, np.zeros(n)])
    return seco * (1 - mezcla) + mojado * mezcla


def swell(duracion):
    """Aire suave y grave: ruido que se abre de grave a medio + un colchón de senoidales graves."""
    n = int(duracion * SR)
    t = np.arange(n) / SR
    ruido = rng.standard_normal(n)
    # Filtro que se abre: mezcla de dos pasabajos según el avance.
    oscuro = filtro(ruido, "lowpass", 280, 4)
    abierto = filtro(ruido, "lowpass", 1300, 4)
    avance = np.clip(t / (duracion * 0.7), 0, 1)
    aire = oscuro * (1 - avance) + abierto * avance
    graves = 0.5 * np.sin(2 * np.pi * 55 * t) + 0.25 * np.sin(2 * np.pi * 82.5 * t)
    sonido = 0.8 * aire / np.max(np.abs(aire)) + 0.35 * graves
    ataque = 0.62 * duracion
    env = np.where(t < ataque, np.sin(np.pi / 2 * t / ataque) ** 2, np.cos(np.pi / 2 * (t - ataque) / (duracion - ataque)) ** 2)
    return reverb(fades(sonido * env, 0.02, 0.05), 0.5, 0.2)


def impacto():
    """Golpe grave, redondo y corto: senoidal con caída de afinación + cuerpo suave, sin brillo."""
    duracion = 0.7
    n = int(duracion * SR)
    t = np.arange(n) / SR
    frec = 48 + 50 * np.exp(-t / 0.05)  # 98 Hz → 48 Hz
    fase = 2 * np.pi * np.cumsum(frec) / SR
    cuerpo = np.sin(fase) * np.exp(-t / 0.16)
    golpe = filtro(rng.standard_normal(n), "lowpass", 180, 4) * np.exp(-t / 0.035)
    sonido = np.tanh(1.6 * (cuerpo + 0.5 * golpe / np.max(np.abs(golpe))))  # redondeo suave
    sonido = filtro(sonido, "lowpass", 900, 2)
    return reverb(fades(sonido, 0.003, 0.08), 0.4, 0.12)


def tick(f0):
    """Tick suave de interfaz: dos parciales cálidos con caída rápida y un poco de cuerpo grave."""
    duracion = 0.32
    n = int(duracion * SR)
    t = np.arange(n) / SR
    tono = np.sin(2 * np.pi * f0 * t) * np.exp(-t / 0.05) + 0.35 * np.sin(2 * np.pi * f0 * 1.5 * t) * np.exp(-t / 0.03)
    cuerpo = 0.5 * np.sin(2 * np.pi * f0 / 2 * t) * np.exp(-t / 0.025)
    sonido = filtro(tono + cuerpo, "lowpass", 2600, 2)
    return reverb(fades(sonido, 0.002, 0.06), 0.25, 0.15)


# Pico objetivo de cada efecto (dBFS): todos entre -24 y -18.
EFECTOS = {
    "swell-apertura": (lambda: swell(1.2), -20.0),
    "tick-qr": (lambda: tick(523.25), -22.0),  # Do
    "impacto-cuotas": (impacto, -18.5),
    "tick-huella": (lambda: tick(659.25), -22.0),  # Mi: misma familia, otra afinación
    "swell-cierre": (lambda: swell(0.8), -21.0),
}


def main(salida):
    total = int(round(GUION["duracion"] / GUION["fps"] * SR))
    mezcla = np.zeros((total, 2))
    informe = []
    for ev in GUION["sfx"]:
        crear, pico = EFECTOS[ev["nombre"]]
        x = crear()
        x = x / np.max(np.abs(x)) * 10 ** (pico / 20)
        inicio = int(round(ev["cuadro"] / GUION["fps"] * SR))
        fin = min(total, inicio + len(x))
        x = x[: fin - inicio]
        # Leve apertura estéreo: el lado derecho apenas retrasado (0,4 ms).
        retraso = int(0.0004 * SR)
        der = np.concatenate([np.zeros(retraso), x[:-retraso]])
        mezcla[inicio:fin, 0] += x
        mezcla[inicio:fin, 1] += der
        informe.append((ev["nombre"], ev["cuadro"], inicio / SR, db(np.max(np.abs(x))), db(np.sqrt(np.mean(x**2)))))

    # True peak (sobremuestreo x4).
    tp = max(db(np.max(np.abs(resample_poly(mezcla[:, c], 4, 1)))) for c in range(2))
    assert tp <= -3.0, f"True peak {tp:.1f} dBTP supera -3"

    datos = np.clip(np.round(mezcla * (2**23 - 1)), -(2**23), 2**23 - 1).astype(np.int32)
    with wave.open(str(salida), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(3)
        w.setframerate(SR)
        crudo = bytearray()
        for muestra in datos.reshape(-1):
            crudo += struct.pack("<i", int(muestra))[:3]
        w.writeframes(bytes(crudo))

    print(f"WAV: {salida} · {total} muestras · {total / SR:.4f} s · true peak {tp:.1f} dBTP")
    for nombre, cuadro, seg, pico, rms in informe:
        print(f"  {nombre:<16} cuadro {cuadro:>4} ({seg:6.3f} s)  pico {pico:6.1f} dBFS  RMS {rms:6.1f} dBFS")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
