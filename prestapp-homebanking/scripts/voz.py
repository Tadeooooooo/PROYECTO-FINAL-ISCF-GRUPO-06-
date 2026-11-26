"""
Voz en off (Piper, voz es_AR "daniela", local): una pista por paso, tranquila y normalizada.
Uso: python scripts/voz.py <modelo.onnx> [salida=public/audio/voz]
Escribe también src/voz.json con la duración de cada pista en cuadros (30 fps).
"""
import json
import os
import subprocess
import sys
import wave

import numpy as np
import pyloudnorm as pyln
from scipy.signal import butter, resample_poly, sosfilt

MODELO = sys.argv[1]
SALIDA = sys.argv[2] if len(sys.argv) > 2 else "public/audio/voz"
os.makedirs(SALIDA, exist_ok=True)
GUION = json.load(open("scripts/narracion.json", encoding="utf-8"))
SR = 48000

duraciones = {}
for bloque, frases in GUION.items():
    if bloque.startswith("_"):
        continue
    for i, texto in enumerate(frases):
        nombre = f"{bloque}-{i}"
        crudo = os.path.join(SALIDA, f"_{nombre}.wav")
        subprocess.run(
            [sys.executable, "-m", "piper", "-m", MODELO, "-f", crudo,
             "--length-scale", "1.45", "--noise-scale", "0.55", "--noise-w-scale", "0.7", "--sentence-silence", "0.5"],
            input=texto.encode("utf-8"), check=True, capture_output=True,
        )
        w = wave.open(crudo)
        sr = w.getframerate()
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float64) / 32768
        w.close()
        os.remove(crudo)
        x = resample_poly(x, SR, sr)
        # Recorte de silencios de punta, filtro de graves y un poco de calidez; volumen parejo (-18 LUFS).
        umbral = np.abs(x).max() * 0.02
        idx = np.nonzero(np.abs(x) > umbral)[0]
        x = x[max(0, idx[0] - int(0.03 * SR)): idx[-1] + int(0.12 * SR)]
        x = sosfilt(butter(2, 80, btype="highpass", fs=SR, output="sos"), x)
        x = x * 10 ** ((-18 - pyln.Meter(SR).integrated_loudness(x)) / 20)
        x = np.clip(x, -0.98, 0.98)
        fade = int(0.01 * SR)
        x[:fade] *= np.linspace(0, 1, fade)
        x[-fade:] *= np.linspace(1, 0, fade)
        out = wave.open(os.path.join(SALIDA, f"{nombre}.wav"), "wb")
        out.setnchannels(1)
        out.setsampwidth(2)
        out.setframerate(SR)
        out.writeframes((x * 32767).astype(np.int16).tobytes())
        out.close()
        duraciones[nombre] = int(np.ceil(len(x) / SR * 30))
        print(f"{nombre}: {len(x) / SR:.2f} s")

json.dump(duraciones, open("src/voz.json", "w"), indent=1)
