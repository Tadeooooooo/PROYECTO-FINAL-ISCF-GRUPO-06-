import React from "react";

// Pantalla diseñada a la medida de la captura real (736x1600) y escalada al celular.
export const PANTALLA = { ancho: 736, alto: 1600 };
const BISEL = 16;

export const altoCelular = (ancho: number) => ((ancho - BISEL * 2) * PANTALLA.alto) / PANTALLA.ancho + BISEL * 2;

// Marco de celular genérico (sin marca de fabricante).
export const Celular: React.FC<{
  readonly ancho: number;
  /** 0 = de día, 1 = pantalla oscurecida (modo noche). */
  readonly noche?: number;
  readonly children: React.ReactNode;
  readonly style?: React.CSSProperties;
}> = ({ ancho, noche = 0, children, style }) => {
  const anchoPantalla = ancho - BISEL * 2;
  const escala = anchoPantalla / PANTALLA.ancho;
  const alto = altoCelular(ancho);
  const radio = ancho * 0.14;

  return (
    <div
      style={{
        position: "absolute",
        width: ancho,
        height: alto,
        borderRadius: radio,
        backgroundColor: "#0D0E26",
        boxShadow: "0 0 0 3px #3B3D6B, 0 50px 120px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: BISEL,
          top: BISEL,
          width: anchoPantalla,
          height: alto - BISEL * 2,
          borderRadius: radio - BISEL,
          overflow: "hidden",
          backgroundColor: "#F4F4F4",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: PANTALLA.ancho,
            height: PANTALLA.alto,
            transformOrigin: "0 0",
            scale: String(escala),
          }}
        >
          {children}
        </div>
        <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(4, 4, 26, ${0.62 * noche})` }} />
        {/* Isla superior de la pantalla */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: "50%",
            width: anchoPantalla * 0.28,
            height: 30,
            marginLeft: -(anchoPantalla * 0.14),
            borderRadius: 15,
            backgroundColor: "#07081A",
          }}
        />
      </div>
    </div>
  );
};
