"use client";

import { useState } from "react";

type Resultado = "approved" | "rejected";

interface Props {
  token: string;
  minorName: string;
}

/**
 * Los dos botones del tutor.
 *
 * Cliente porque es lo único de la página que necesita interacción. El resto
 * —quién pide, qué escribió— lo pinta el servidor, así que el padre ve el
 * contenido aunque el JavaScript tarde o falle.
 */
export default function AuthorizeActions({ token, minorName }: Props) {
  const [enviando, setEnviando] = useState<Resultado | null>(null);
  const [hecho, setHecho] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const responder = async (accept: boolean) => {
    const cual: Resultado = accept ? "approved" : "rejected";
    setEnviando(cual);
    setError(null);
    try {
      // Por el servidor de la landing, NO directo a la API: un POST con
      // JSON dispara un preflight y la API no tiene CORS en ninguna ruta.
      // Directo, el navegador lo bloquea y al tutor le sale «Failed to fetch».
      const res = await fetch(`/api/guardian/${encodeURIComponent(token)}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });
      if (!res.ok) {
        const cuerpo = await res.json().catch(() => null);
        throw new Error(cuerpo?.message ?? "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
      }
      setHecho(cual);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos guardar tu respuesta. Inténtalo nuevamente.");
    } finally {
      setEnviando(null);
    }
  };

  if (hecho) {
    return (
      <div style={{ ...caja, borderColor: hecho === "approved" ? NEON : "#555" }}>
        <p style={{ margin: 0, fontWeight: 600, color: "#F0F0F0" }}>
          {hecho === "approved" ? "Autorizado" : "Contacto rechazado"}
        </p>
        <p style={{ margin: "8px 0 0", color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>
          {hecho === "approved"
            ? `Ya puede escribirle a ${minorName}. Puedes retirar esta autorización en cualquier momento desde la cuenta de ${minorName}, en Configuración.`
            : `Esa cuenta no podrá escribirle a ${minorName}. No tienes que hacer nada más.`}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => responder(true)}
          disabled={enviando !== null}
          style={{ ...boton, background: NEON, color: "#0D0D0D" }}
        >
          {enviando === "approved" ? "Guardando…" : "Autorizar el contacto"}
        </button>
        <button
          onClick={() => responder(false)}
          disabled={enviando !== null}
          style={{ ...boton, background: "transparent", color: "#F0F0F0", border: "1px solid #555" }}
        >
          {enviando === "rejected" ? "Guardando…" : "No autorizar"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#FF6B6B", fontSize: 14, marginTop: 14 }}>{error}</p>
      )}

      <p style={{ color: GRIS_PIE, fontSize: 13, marginTop: 20, lineHeight: 1.6 }}>
        Si no respondes, el contacto permanecerá bloqueado. No necesitas hacer
        nada para proteger a {minorName}.
      </p>
    </div>
  );
}

/**
 * El gris del texto de pie.
 *
 * **#999 y no #777, y es una medicion.** Sobre el velo del marco —rgb(8 8 8 /
 * 0.86) encima de la foto del heroe— el peor fondo posible es rgb(43,43,43), y
 * ahi #777 da **3,16:1**: por debajo del 4,5:1 que pide AA para texto normal.
 * #999 da 4,97:1.
 *
 * No es un detalle de estilo: ese pie dice «no hace falta que respondas», que
 * es informacion que un padre necesita para no sentirse obligado a algo.
 */
const GRIS_PIE = "#999999";

const NEON = "#AAFF00";

const boton: React.CSSProperties = {
  flex: "1 1 200px",
  padding: "14px 22px",
  borderRadius: 10,
  border: "none",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const caja: React.CSSProperties = {
  border: "1px solid",
  borderRadius: 12,
  padding: "20px 22px",
  background: "rgb(20 20 20 / 0.70)",
};
