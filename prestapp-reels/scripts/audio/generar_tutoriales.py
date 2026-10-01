#!/usr/bin/env python3
"""
Música (y el bip del escáner) para los videos tutoriales: QR, Transferencias, Recargas, Servicios y Biometría.

Usa el mismo sintetizador que generar_audio.py, con una variante por video
(otra tonalidad y otros acordes) sobre la estructura común de los tutoriales:
  0–2 s intro · 2 s drop · 14–20 s sube la energía · 24,5 s golpe de marca · 27,5 s final en calma.

Uso (desde prestapp-reels):  python3 scripts/audio/generar_tutoriales.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generar_audio as g  # noqa: E402


def seccion_tutorial(s):
    if s < 2:
        return "intro"
    if 14 <= s < 20:
        return "b"
    if 24.5 <= s < 25:
        return "pausa"
    if s >= 27.5:
        return "final"
    return "a"


def linea(progresion, intro):
    """Un acorde cada 2 s hasta los 24 s, después F → G y resuelve en C a los 27,5 s."""
    tramos = [(0, 2, intro)]
    for i, inicio in enumerate(range(2, 24, 2)):
        tramos.append((inicio, inicio + 2, progresion[i % len(progresion)]))
    tramos += [(24, 26, "F"), (26, 27.5, "G"), (27.5, 30, "C")]
    return tramos


VARIANTES = {
    "qr": dict(progresion=["F", "G", "Em", "Am"], intro="Am", transponer=2),
    "transferencias": dict(progresion=["Am", "F", "C", "G"], intro="G", transponer=-2),
    "recargas": dict(progresion=["C", "G", "Am", "F"], intro="G", transponer=3),
    "servicios": dict(progresion=["F", "C", "G", "Am"], intro="G", transponer=-3),
    "biometria": dict(progresion=["Am", "Em", "F", "G"], intro="G", transponer=0),
}

if __name__ == "__main__":
    g.guardar(os.path.join(g.SALIDA, "sfx", "bip.wav"), g.sfx_bip(), pico_db=-3)
    for nombre, v in VARIANTES.items():
        musica = g.componer(
            linea=linea(v["progresion"], v["intro"]),
            seccion_fn=seccion_tutorial,
            transponer=v["transponer"],
            final=27.5,
            motivos=(2.0, 24.5),
        )
        ruta = os.path.join(g.SALIDA, f"musica-{nombre}.wav")
        g.guardar(ruta, musica, normalizar=False)
        print("Música generada:", ruta)
