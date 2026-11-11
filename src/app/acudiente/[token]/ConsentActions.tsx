"use client";

import { useState } from "react";

type Resultado = "aprobado" | "rechazado";

/**
 * Los dos botones del acudiente.
 *
 * Cliente porque es lo único de la página que necesita interacción. El resto
 * —de quién se trata, qué club— lo pinta el servidor, así que se ve el
 * contenido aunque el JavaScript tarde o falle.
 *
 * **«No autorizar» no es destructivo y no se pinta como tal.** La decisión por
 * defecto ya es que no: si el acudiente cierra la pestaña, el chico no entra.
 * Un botón rojo sugeriría que decir que no es la opción drástica, cuando es la
 * que protege.
 */
export default function ConsentActions({
  token, playerName, clubName,
}: {
  token: string;
  playerName: string;
  clubName: string;
}) {
  const [enviando, setEnviando] = useState<Resultado | null>(null);
  const [hecho, setHecho] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  const responder = async (accept: boolean) => {
    const cual: Resultado = accept ? "aprobado" : "rechazado";
    setEnviando(cual);
    setError(null);
    try {
      // Por el servidor de la landing, NO directo a la API: un POST con JSON
      // dispara un preflight y la API no tiene CORS en ninguna ruta.
      const res = await fetch(`/api/acudiente/${encodeURIComponent(token)}`, {
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
      <div style={{ ...caja, borderColor: hecho === "aprobado" ? NEON : "#555" }}>
        <p style={{ margin: 0, fontWeight: 600, color: "#F0F0F0" }}>
          {hecho === "aprobado" ? "Autorizado" : "No autorizado"}
        </p>
        <p style={{ margin: "8px 0 0", color: "#AAAAAA", fontSize: 14, lineHeight: 1.6 }}>
          {hecho === "aprobado"
            ? `${playerName} ya aparece en la plantilla de ${clubName}. Si cambias de`
              + ` opinión, el club puede retirarlo desde su lista.`
            : `${playerName} no aparecerá en la plantilla de ${clubName}. No tienes que`
              + ` hacer nada más.`}
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
          {enviando === "aprobado" ? "Guardando…" : "Sí, autorizo"}
        </button>
        <button
          onClick={() => responder(false)}
          disabled={enviando !== null}
          style={{
            ...boton, background: "transparent", color: "#F0F0F0",
            border: "1px solid #555",
          }}
        >
          {enviando === "rechazado" ? "Guardando…" : "No autorizo"}
        </button>
      </div>

      {error && <p style={{ color: "#FF6B6B", fontSize: 14, marginTop: 14 }}>{error}</p>}

      <p style={{ color: GRIS_PIE, fontSize: 13, marginTop: 20, lineHeight: 1.6 }}>
        Si no respondes, {playerName} no aparecerá en la plantilla del club. No necesitas
        hacer nada para protegerlo.
      </p>
    </div>
  );
}

const NEON = "#AAFF00";

/**
 * El gris del texto de pie.
 *
 * **#999 y no #777, y es una medición**: sobre el velo del marco el peor fondo
 * posible es rgb(43,43,43), y ahí #777 da 3,16:1 — por debajo del 4,5:1 que
 * pide AA para texto normal.
 */
const GRIS_PIE = "#999999";

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
