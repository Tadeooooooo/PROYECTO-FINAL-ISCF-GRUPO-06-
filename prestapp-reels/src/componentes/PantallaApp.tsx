import React from "react";
import { Img, staticFile } from "remotion";
import { colores, fuenteTexto } from "../marca/marca";
import { formatoNumero } from "../utils/numeros";
import {
  IconoAvion,
  IconoBilleteVerde,
  IconoCampana,
  IconoCobrar,
  IconoCopiar,
  IconoDocumento,
  IconoFlechaArriba,
  IconoIngresar,
  IconoMenu,
  IconoOjo,
  IconoPersonas,
  IconoQR,
  Isotipo,
} from "./Iconos";

// Recreación de la pantalla de inicio de Prestapp a partir de la captura real.
// Todas las medidas están en píxeles de la captura (736x1600).

export type Movimiento = {
  readonly fecha: string;
  readonly monto: number;
  /** 0 a 1: cuánto ocupa la fila (para que entre empujando a las demás). */
  readonly aparicion?: number;
  /** 0 a 1: brillo verde de "recién acreditado". */
  readonly brillo?: number;
};

const ALTO_FILA = 86;

const accionesApp: { etiqueta: string; icono: React.ReactNode; x: number; y: number }[] = [
  { etiqueta: "Pagar Servicios", icono: <IconoDocumento tamano={50} />, x: 149, y: 380 },
  { etiqueta: "Transferir", icono: <IconoAvion tamano={46} />, x: 368, y: 380 },
  { etiqueta: "CVU / Alias", icono: <IconoCopiar tamano={48} />, x: 586, y: 380 },
  { etiqueta: "Ingresar\nFondos", icono: <IconoIngresar tamano={50} />, x: 149, y: 580 },
  { etiqueta: "Prestapp", icono: <Isotipo alto={58} />, x: 368, y: 591 },
  { etiqueta: "Cobrar", icono: <IconoCobrar tamano={50} />, x: 586, y: 591 },
];

export const PantallaApp: React.FC<{
  readonly saldo: number;
  readonly tnaTexto: string;
  readonly movimientos: Movimiento[];
  readonly concepto: string;
  readonly tituloMovimientos: string;
  readonly verMas: string;
  /** Desplazamiento vertical del contenido (como si el usuario scrolleara). */
  readonly desplazamiento?: number;
}> = ({ saldo, tnaTexto, movimientos, concepto, tituloMovimientos, verMas, desplazamiento = 0 }) => {
  const texto: React.CSSProperties = { fontFamily: fuenteTexto, position: "absolute" };

  return (
    <div style={{ position: "absolute", inset: 0, backgroundColor: colores.grisFondoApp, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 736, height: 2400, translate: `0px ${-desplazamiento}px` }}>
        {/* Encabezado azul */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 736, height: 330, backgroundColor: colores.azulApp }} />
        {/* Barra de estado */}
        <div style={{ ...texto, left: 52, top: 26, fontSize: 26, fontWeight: 700, color: colores.blanco }}>9:41</div>
        <div style={{ position: "absolute", right: 48, top: 30, display: "flex", gap: 8, alignItems: "flex-end" }}>
          {[10, 14, 18, 22].map((h) => (
            <div key={h} style={{ width: 6, height: h, borderRadius: 2, backgroundColor: colores.blanco }} />
          ))}
          <div style={{ width: 40, height: 20, borderRadius: 5, border: "2.5px solid white", marginLeft: 10, padding: 2 }}>
            <div style={{ width: "75%", height: "100%", borderRadius: 2, backgroundColor: colores.blanco }} />
          </div>
        </div>
        {/* Logo blanco, TNA y campana */}
        <Img src={staticFile("brand/logo-horizontal-blanco.png")} style={{ position: "absolute", left: 46, top: 128, width: 190 }} />
        <div
          style={{
            ...texto,
            left: 530,
            top: 145,
            height: 40,
            padding: "0 12px 0 6px",
            borderRadius: 9,
            backgroundColor: colores.blanco,
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: 22,
            fontWeight: 700,
            color: colores.azulApp,
          }}
        >
          <IconoFlechaArriba tamano={26} color={colores.azulApp} />
          {tnaTexto}
        </div>
        <div
          style={{
            position: "absolute",
            left: 650,
            top: 142,
            width: 48,
            height: 46,
            borderRadius: 10,
            backgroundColor: "rgba(255,255,255,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconoCampana tamano={28} />
        </div>
        {/* Saldo (en la captura está tapado; lo ubicamos debajo del logo) */}
        <div style={{ ...texto, left: 52, top: 206, fontSize: 21, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>
          Saldo disponible
        </div>
        <div style={{ ...texto, left: 52, top: 232, fontSize: 40, fontWeight: 800, color: colores.blanco, letterSpacing: "-0.01em" }}>
          $ {formatoNumero(saldo, 2)}
        </div>
        <IconoOjo tamano={34} style={{ position: "absolute", right: 48, top: 240 }} />

        {/* Tarjeta de acciones */}
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 295,
            width: 688,
            height: 432,
            borderRadius: 12,
            backgroundColor: colores.blanco,
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        />
        {accionesApp.map((a) => (
          <React.Fragment key={a.etiqueta}>
            <div
              style={{
                position: "absolute",
                left: a.x - 48,
                top: a.y - 48,
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colores.verdeApp,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {a.icono}
            </div>
            <div
              style={{
                ...texto,
                left: a.x - 110,
                width: 220,
                top: a.y + 58,
                textAlign: "center",
                fontSize: 25,
                lineHeight: 0.92,
                fontWeight: 700,
                color: colores.azulApp,
                whiteSpace: "pre-line",
              }}
            >
              {a.etiqueta}
            </div>
          </React.Fragment>
        ))}

        {/* Últimos movimientos */}
        <div
          style={{
            position: "absolute",
            left: 24,
            top: 771,
            width: 688,
            minHeight: 1000,
            borderRadius: 12,
            backgroundColor: colores.blanco,
            boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ ...texto, left: 33, top: 34, fontSize: 23, fontWeight: 500, color: "#5E5B72" }}>{tituloMovimientos}</div>
          <div style={{ ...texto, right: 26, top: 34, fontSize: 23, fontWeight: 600, color: colores.azulApp }}>{verMas}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 96 }}>
            {movimientos.map((m, i) => {
              const aparicion = m.aparicion ?? 1;
              const brillo = m.brillo ?? 0;
              return (
                <div
                  key={`${m.fecha}-${i}`}
                  style={{ position: "relative", height: ALTO_FILA * aparicion, overflow: "hidden", opacity: aparicion }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: "0 12px",
                      borderRadius: 12,
                      backgroundColor: `rgba(85,193,71,${0.2 * brillo})`,
                    }}
                  />
                  <IconoBilleteVerde tamano={30} style={{ position: "absolute", left: 31, top: 16 }} />
                  <div style={{ ...texto, left: 84, top: 8, fontSize: 25, fontWeight: 700, color: colores.azulApp }}>{concepto}</div>
                  <div style={{ ...texto, left: 84, top: 43, fontSize: 19, fontWeight: 500, color: colores.grisTextoApp }}>{m.fecha}</div>
                  <div
                    style={{
                      ...texto,
                      right: 26,
                      top: 8,
                      fontSize: 25,
                      fontWeight: 800,
                      color: brillo > 0.05 ? "#2F9A2A" : colores.azulApp,
                    }}
                  >
                    $ {formatoNumero(m.monto, 2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Barra inferior fija */}
      <div style={{ position: "absolute", left: 0, top: 1377, width: 736, height: 223, backgroundColor: colores.azulApp }}>
        {[
          { x: 97, icono: <IconoCopiar tamano={40} color="#7F7DD6" /> },
          { x: 227, icono: <IconoPersonas tamano={42} color="#7F7DD6" /> },
          { x: 508, icono: <IconoAvion tamano={40} color="#7F7DD6" /> },
          { x: 638, icono: <IconoMenu tamano={42} color="#7F7DD6" /> },
        ].map((b) => (
          <div
            key={b.x}
            style={{
              position: "absolute",
              left: b.x - 47,
              top: 80 - 47,
              width: 94,
              height: 94,
              borderRadius: 47,
              backgroundColor: colores.azulAppOscuro,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {b.icono}
          </div>
        ))}
        <div
          style={{
            position: "absolute",
            left: 368 - 59,
            top: 80 - 59,
            width: 118,
            height: 118,
            borderRadius: 59,
            backgroundColor: colores.blanco,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconoQR tamano={64} />
        </div>
      </div>
    </div>
  );
};
